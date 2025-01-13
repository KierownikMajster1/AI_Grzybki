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
    $db = new SQLite3('baza.db');

    $lecturer = $_GET['lecturer'] ?? null;
    $group = $_GET['group'] ?? null;
    $room = $_GET['room'] ?? null;
    $subject = $_GET['subject'] ?? null;
    $startDate = $_GET['start'] ?? null;
    $endDate = $_GET['end'] ?? null;

    $query = "
        SELECT 
            s.id, 
            l.name AS lecturer,
            g.group_name, 
            r.room_name, 
            r.faculty_id, 
            f.faculty_name AS faculty, 
            sub.subject_name, 
            s.start_time, 
            s.end_time
        FROM schedules s
        LEFT JOIN lecturers l ON s.lecturer_id = l.id
        LEFT JOIN groups g ON s.group_id = g.id
        LEFT JOIN rooms r ON s.room_id = r.id
        LEFT JOIN faculties f ON r.faculty_id = f.id
        LEFT JOIN subjects sub ON s.subject_id = sub.id
        WHERE 1 = 1
    ";

    $params = [];
    if ($lecturer) {
        $query .= " AND l.name LIKE :lecturer";
        $params[] = [':lecturer', '%' . $lecturer . '%'];
    }
    if ($group) {
        $query .= " AND g.group_name LIKE :group";
        $params[] = [':group', '%' . $group . '%'];
    }
    if ($room) {
        $query .= " AND r.room_name LIKE :room";
        $params[] = [':room', '%' . $room . '%'];
    }
    if ($subject) {
        $query .= " AND sub.subject_name LIKE :subject";
        $params[] = [':subject', '%' . $subject . '%'];
    }
    if ($startDate) {
        $query .= " AND s.start_time >= :startDate";
        $params[] = [':startDate', $startDate];
    }
    if ($endDate) {
        $query .= " AND s.end_time <= :endDate";
        $params[] = [':endDate', $endDate];
    }

    $stmt = $db->prepare($query);
    for ($i = 0; $i < count($params); $i++) {
        $stmt->bindValue($params[$i][0], $params[$i][1]);
    }
    $result = $stmt->execute();

    $data = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $data[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $data]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
