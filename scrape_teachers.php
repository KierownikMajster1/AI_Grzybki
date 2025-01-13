<?php
require 'config.php';
require 'db_helper.php';
require 'curl_helper.php';

function scrapeTeachersWithPlans($db) {
    $alphabet = array_merge(range('A', 'Z'), ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż']);
    $startDate = '2024-10-01T00:00:00+01:00';
    $endDate = '2025-02-02T00:00:00+01:00';

    for ($i = 0; $i < count($alphabet); $i++) {
        $letter = $alphabet[$i];
        $url = "https://plan.zut.edu.pl/schedule.php?kind=teacher&query=" . urlencode($letter);
        $teacherData = fetchData($url);

        if ($teacherData === null || empty($teacherData)) {
            echo "[INFO] Brak nauczycieli dla litery: $letter\n";
            continue;
        }

        for ($j = 0; $j < count($teacherData); $j++) {
            $teacherItem = $teacherData[$j];
            if (isset($teacherItem['item'])) {
                $teacherName = $teacherItem['item'];

                // Wstawienie nauczyciela do bazy
                insertIfNotExists($db, 'lecturers', [
                    'name' => $teacherName
                ], ['name']);
                $lecturerId = getIdByName($db, 'lecturers', 'name', $teacherName);

                if (!$lecturerId) {
                    echo "[ERROR] Nie znaleziono ID dla nauczyciela: $teacherName\n";
                    continue;
                }

                // Pobranie planu zajęć nauczyciela
                $planUrl = "https://plan.zut.edu.pl/schedule_student.php?teacher=" . urlencode($teacherName) . "&start=$startDate&end=$endDate";
                $scheduleData = fetchData($planUrl);

                if ($scheduleData === null || !isset($scheduleData[1])) {
                    echo "[INFO] Brak planu dla nauczyciela: $teacherName\n";
                    continue;
                }

                for ($k = 0; $k < count($scheduleData); $k++) {
                    $entry = $scheduleData[$k];
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

                    if ($groupName) {
                        insertIfNotExists($db, 'groups', [
                            'group_name' => $groupName
                        ], ['group_name']);
                        $groupId = getIdByName($db, 'groups', 'group_name', $groupName);
                    } else {
                        $groupId = null;
                    }

                    if ($subjectName) {
                        insertIfNotExists($db, 'subjects', [
                            'subject_name' => $subjectName
                        ], ['subject_name']);
                        $subjectId = getIdByName($db, 'subjects', 'subject_name', $subjectName);
                    } else {
                        $subjectId = null;
                    }

                    if ($faculty) {
                        insertIfNotExists($db, 'faculties', [
                            'faculty_name' => $faculty
                        ], ['faculty_name']);
                        $facultyId = getIdByName($db, 'faculties', 'faculty_name', $faculty);
                    } else {
                        $facultyId = null;
                    }

                    if ($roomName) {
                        insertIfNotExists($db, 'rooms', [
                            'room_name' => $roomName,
                            'faculty_id' => $facultyId
                        ], ['room_name']);
                        $roomId = getIdByName($db, 'rooms', 'room_name', $roomName);
                    } else {
                        $roomId = null;
                    }

                    if (!$lecturerId || !$roomId || !$subjectId || !$groupId) {
                        echo "[ERROR] Nie można przypisać zajęcia: brak powiązanych ID\n";
                        continue;
                    }

                    insertIfNotExists($db, 'schedules', [
                        'lecturer_id' => $lecturerId,
                        'room_id' => $roomId,
                        'subject_id' => $subjectId,
                        'group_id' => $groupId,
                        'start_time' => $startTime,
                        'end_time' => $endTime
                    ], ['start_time', 'end_time', 'lecturer_id', 'room_id', 'subject_id', 'group_id']);
                }
                echo "[INFO] Przetworzono plan dla nauczyciela: $teacherName\n";
            }
        }
    }
}

// Wywołanie funkcji
scrapeTeachersWithPlans($db);
?>
