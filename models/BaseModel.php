<?php

class BaseModel {
    protected static $table;
    protected $db;

    public function __construct() {
        $this->db = new SQLite3('baza.db');
    }

    public function find($id) {
        $query = "SELECT * FROM " . static::$table . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        return $result->fetchArray(SQLITE3_ASSOC);
    }

    public function findBy($column, $value) {
        $query = "SELECT * FROM " . static::$table . " WHERE $column = :value LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':value', $value);
        $result = $stmt->execute();
        return $result->fetchArray(SQLITE3_ASSOC);
    }

    public function all() {
        $query = "SELECT * FROM " . static::$table;
        $result = $this->db->query($query);
        $rows = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function insert($data) {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $query = "INSERT INTO " . static::$table . " ($columns) VALUES ($placeholders)";
        $stmt = $this->db->prepare($query);
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        return $stmt->execute();
    }

    public function insertIfNotExists($data, $uniqueColumns) {
        $conditions = implode(' AND ', array_map(fn($col) => "$col = :$col", $uniqueColumns));
        $query = "SELECT COUNT(*) as count FROM " . static::$table . " WHERE $conditions";
        $stmt = $this->db->prepare($query);
        foreach ($uniqueColumns as $column) {
            $stmt->bindValue(":$column", $data[$column]);
        }
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);

        if ($row['count'] == 0) {
            return $this->insert($data);
        }
        return false; // Rekord już istnieje
    }

    public function update($id, $data) {
        $columns = implode(", ", array_map(fn($col) => "$col = :$col", array_keys($data)));
        $query = "UPDATE " . static::$table . " SET $columns WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . static::$table . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        return $stmt->execute();
    }
}
