<?php
header('Access-Control-Allow-Origin: *'); // Zezwól na dostęp z dowolnej domeny
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Zezwól na metody HTTP
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Zezwól na określone nagłówki
header('Content-Type: application/json'); // Ustaw typ odpowiedzi na JSON

// Obsługa preflight (zapytanie OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    // Połączenie z bazą danych
    $db = new SQLite3('baza.db');

    // Pobierz parametry GET
    $albumNumber = $_GET['album'] ?? null;

    if (!$albumNumber) {
        echo json_encode(['status' => 'error', 'message' => 'Nie podano numeru albumu.']);
        exit;
    }

    // Sprawdź, czy numer albumu istnieje w bazie
    $query = "SELECT s.id, s.album_number, g.group_name
              FROM students s
              LEFT JOIN groups g ON s.group_id = g.id
              WHERE s.album_number = :album";
    $stmt = $db->prepare($query);
    $stmt->bindValue(':album', $albumNumber);
    $result = $stmt->execute();

    $existingData = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $existingData[] = $row;
    }

    if (!empty($existingData)) {
        // Numer albumu istnieje w bazie - zwróć dane
        echo json_encode(['status' => 'success', 'data' => $existingData]);
        exit;
    }

    // Numer albumu nie istnieje - użyj API
    $startDate = '2025-01-06T00:00:00+01:00';
    $endDate = '2025-01-13T00:00:00+01:00';
    $apiUrl = "https://plan.zut.edu.pl/schedule_student.php?number=" . urlencode($albumNumber) . "&start=$startDate&end=$endDate";
    $apiResponse = file_get_contents($apiUrl);
    $apiData = json_decode($apiResponse, true);

    if (!$apiData || empty($apiData['schedule'])) {
        echo json_encode(['status' => 'error', 'message' => 'Nie znaleziono danych dla numeru albumu.']);
        exit;
    }

    // Zapisz dane zajęć i grup do bazy
    foreach ($apiData['schedule'] as $entry) {
        $groupName = $entry['group_name'] ?? null;

        if ($groupName) {
            // Wstaw grupę do tabeli `groups`, jeśli nie istnieje
            $insertGroupQuery = "INSERT OR IGNORE INTO groups (group_name) VALUES (:group_name)";
            $stmt = $db->prepare($insertGroupQuery);
            $stmt->bindValue(':group_name', $groupName);
            $stmt->execute();

            // Pobierz ID grupy
            $groupIdQuery = "SELECT id FROM groups WHERE group_name = :group_name";
            $stmt = $db->prepare($groupIdQuery);
            $stmt->bindValue(':group_name', $groupName);
            $result = $stmt->execute();
            $groupIdRow = $result->fetchArray(SQLITE3_ASSOC);
            $groupId = $groupIdRow['id'] ?? null;

            if ($groupId) {
                // Wstaw numer albumu do tabeli `students`
                $insertStudentQuery = "INSERT INTO students (album_number, group_id) VALUES (:album, :group_id)";
                $stmt = $db->prepare($insertStudentQuery);
                $stmt->bindValue(':album', $albumNumber);
                $stmt->bindValue(':group_id', $groupId);
                $stmt->execute();
            }
        }
    }

    // Pobierz zapisane dane i zwróć je
    $query = "SELECT s.id, s.album_number, g.group_name
              FROM students s
              LEFT JOIN groups g ON s.group_id = g.id
              WHERE s.album_number = :album";
    $stmt = $db->prepare($query);
    $stmt->bindValue(':album', $albumNumber);
    $result = $stmt->execute();

    $savedData = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $savedData[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $savedData]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
