<?php
function insertIfNotExists($db, $table, $data, $uniqueColumns = []) {
    $columns = array_keys($data);
    $placeholders = array_map(fn($col) => ":$col", $columns);

    if (!empty($uniqueColumns)) {
        $conditions = [];
        for ($i = 0; $i < count($uniqueColumns); $i++) {
            $conditions[] = $uniqueColumns[$i] . " = :check_" . $uniqueColumns[$i];
        }
        $whereClause = implode(' AND ', $conditions);

        $checkQuery = "SELECT COUNT(*) as count FROM $table WHERE $whereClause";
        $stmt = $db->prepare($checkQuery);
        for ($i = 0; $i < count($uniqueColumns); $i++) {
            $stmt->bindValue(":check_" . $uniqueColumns[$i], $data[$uniqueColumns[$i]]);
        }
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        if ($row['count'] > 0) {
            return; // Dane już istnieją
        }
    }

    $insertQuery = "INSERT INTO $table (" . implode(", ", $columns) . ") VALUES (" . implode(", ", $placeholders) . ")";
    $stmt = $db->prepare($insertQuery);
    for ($i = 0; $i < count($columns); $i++) {
        $stmt->bindValue(":$columns[$i]", $data[$columns[$i]]);
    }
    $stmt->execute();
}

function getIdByName($db, $table, $column, $value) {
    $query = "SELECT id FROM $table WHERE $column = :value LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindValue(':value', $value);
    $result = $stmt->execute();
    $row = $result->fetchArray(SQLITE3_ASSOC);
    return $row['id'] ?? null;
}
?>
