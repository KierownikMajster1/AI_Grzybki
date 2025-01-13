CREATE TABLE lecturers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE faculties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_name VARCHAR(255) NOT NULL
);

CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_name VARCHAR(255) NOT NULL,
    faculty_id INTEGER,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
);

CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name VARCHAR(255) NOT NULL
);

CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name VARCHAR(255) NOT NULL
);

CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_number VARCHAR(20) NOT NULL UNIQUE,
    group_id INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lecturer_id INTEGER,
    room_id INTEGER,
    subject_id INTEGER,
    group_id INTEGER,
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);
