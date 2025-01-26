<?php
require 'config.php';
require 'curl_helper.php';
require_once 'models/Lecturer.php';
require_once 'models/Group.php';
require_once 'models/Subject.php';
require_once 'models/Room.php';
require_once 'models/Faculty.php';
require_once 'models/Schedule.php';

function scrapeTeachersWithPlans() {
    $alphabet = array_merge(range('A', 'Z'), ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż']);
    $startDate = '2024-10-01T00:00:00+01:00';
    $endDate = '2025-02-02T00:00:00+01:00';

    $lecturerModel = new Lecturer();
    $groupModel = new Group();
    $subjectModel = new Subject();
    $roomModel = new Room();
    $facultyModel = new Faculty();
    $scheduleModel = new Schedule();

    foreach ($alphabet as $letter) {
        $url = "https://plan.zut.edu.pl/schedule.php?kind=teacher&query=" . urlencode($letter);
        $teacherData = fetchData($url);

        if ($teacherData === null || empty($teacherData)) {
            echo "[INFO] Brak nauczycieli dla litery: $letter\n";
            continue;
        }

        foreach ($teacherData as $teacherItem) {
            if (isset($teacherItem['item'])) {
                $teacherName = $teacherItem['item'];

                // Wstawienie nauczyciela do bazy
                $lecturerModel->insertIfNotExists(['name' => $teacherName], ['name']);
                $lecturer = $lecturerModel->findBy('name', $teacherName);

                if (!$lecturer) {
                    echo "[ERROR] Nie znaleziono ID dla nauczyciela: $teacherName\n";
                    continue;
                }
                $lecturerId = $lecturer['id'];

                // Pobranie planu zajęć nauczyciela
                $planUrl = "https://plan.zut.edu.pl/schedule_student.php?teacher=" . urlencode($teacherName) . "&start=$startDate&end=$endDate";
                $scheduleData = fetchData($planUrl);

                if ($scheduleData === null || !isset($scheduleData[1])) {
                    echo "[INFO] Brak planu dla nauczyciela: $teacherName\n";
                    continue;
                }

                foreach ($scheduleData as $entry) {
                    if (!is_array($entry) || !isset($entry['subject'])) {
                        continue;
                    }

                    $groupName = $entry['group_name'] ?? null;
                    $startTime = $entry['start'] ?? null;
                    $endTime = $entry['end'] ?? null;
                    $subjectName = $entry['subject'] ?? null;
                    $room = $entry['room'] ?? null;

                    $faculty = null;
                    $roomName = null;
                    if ($room) {
                        $roomParts = explode(' ', $room, 2);
                        $faculty = $roomParts[0] ?? null;
                        $roomName = $roomParts[1] ?? null;
                    }

                    $groupId = null;
                    if ($groupName) {
                        $groupModel->insertIfNotExists(['group_name' => $groupName], ['group_name']);
                        $group = $groupModel->findBy('group_name', $groupName);
                        $groupId = $group['id'] ?? null;
                    }

                    $subjectId = null;
                    if ($subjectName) {
                        $subjectModel->insertIfNotExists(['subject_name' => $subjectName], ['subject_name']);
                        $subject = $subjectModel->findBy('subject_name', $subjectName);
                        $subjectId = $subject['id'] ?? null;
                    }

                    $facultyId = null;
                    if ($faculty) {
                        $facultyModel->insertIfNotExists(['faculty_name' => $faculty], ['faculty_name']);
                        $faculty = $facultyModel->findBy('faculty_name', $faculty);
                        $facultyId = $faculty['id'] ?? null;
                    }

                    $roomId = null;
                    if ($roomName) {
                        $roomModel->insertIfNotExists(['room_name' => $roomName, 'faculty_id' => $facultyId], ['room_name']);
                        $room = $roomModel->findBy('room_name', $roomName);
                        $roomId = $room['id'] ?? null;
                    }

                    if (!$lecturerId || !$roomId || !$subjectId || !$groupId) {
                        echo "[ERROR] Nie można przypisać zajęcia: brak powiązanych ID\n";
                        continue;
                    }

                    $scheduleModel->insert([
                        'lecturer_id' => $lecturerId,
                        'room_id' => $roomId,
                        'subject_id' => $subjectId,
                        'group_id' => $groupId,
                        'start_time' => $startTime,
                        'end_time' => $endTime
                    ]);
                }
                echo "[INFO] Przetworzono plan dla nauczyciela: $teacherName\n";
            }
        }
    }
}

// Wywołanie funkcji
scrapeTeachersWithPlans();
