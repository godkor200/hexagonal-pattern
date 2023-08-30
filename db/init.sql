CREATE DATABASE IF NOT EXISTS tennis_lesson_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tennis_lesson_db;

CREATE TABLE IF NOT EXISTS Coaches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS Courts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL
    );

CREATE TABLE IF NOT EXISTS Lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    coach_id INT,
    court_id INT,
    start_time DATETIME,
    end_time ENUM('30min','1hour'),
    lesson_type ENUM('trial', 'once_a_week', 'twice_a_week', 'three_times_a_week'),
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (coach_id) REFERENCES Coaches(id),
    FOREIGN KEY (court_id) REFERENCES Courts(id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;;

CREATE TABLE IF NOT EXISTS Lesson_Cancellations (
    cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(id)
    );

INSERT INTO Coaches (name) VALUES (N'김민준'), (N'오서준'), (N'이도윤'), (N'박예준');
INSERT INTO Courts (court_name) VALUES ('Court A'), ('Court B'), ('Court C') ,('Court D'), ('Court E');

INSERT INTO Customers (username, password)
VALUES
    ('user1', 'hashedpassword1'),
    ('user2', 'hashedpassword2'),
    ('user3', 'hashedpassword3'),
    ('user4', 'hashedpassword4'),
    ('user5', 'hashedpassword5');

INSERT INTO Lessons (customer_id, coach_id, court_id, start_time, end_time, lesson_type)
VALUES
    (1, 1, 1,'2023-09-01 10:00:00','30min','trial'),
    (5, 1, 1,'2023-09-01 10:30:00','1hour','trial'),
    (2, 2, 2,'2023-09-02 10:00:00','1hour','twice_a_week'),
    (2, 2, 2,'2023-09-03 10:00:00','1hour','twice_a_week'),
    (3, 1, 4,'2023-09-01 11:00:00','30min','three_times_a_week'),
    (3, 4, 3,'2023-09-04 12:00:00','30min','three_times_a_week'),
    (3, 3, 2,'2023-09-01 12:00:00','30min','three_times_a_week'),
    (4, 4, 4,'2023-09-01 11:00:00','30min','three_times_a_week'),
    (4, 4, 3,'2023-09-01 12:00:00','30min','three_times_a_week'),
    (4, 1, 2,'2023-09-01 12:00:00','30min','three_times_a_week');
