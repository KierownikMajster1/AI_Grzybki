CREATE TABLE lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE faculties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(255) NOT NULL
);

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    faculty_id INT,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL
);

CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_number VARCHAR(20) NOT NULL UNIQUE,
    group_id INT,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT,
    room_id INT,
    subject_id INT,
    group_id INT,
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);
