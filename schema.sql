// sql
-- =====================================================================
--  LIBRARY MANAGEMENT SYSTEM — DATABASE SCHEMA (MySQL 8.x)
--  Database : db_perpustakaan
--  ----------------------------------------------------------------
--  Run with   :  mysql -u root -p < schema.sql
--  Seed admin :  username = admin  |  password = admin123
--  NOTE: Seed passwords are plain text for TESTING ONLY.
--        Replace with a proper hash (e.g. bcrypt) before production.
-- =====================================================================
 
CREATE DATABASE IF NOT EXISTS db_perpustakaan
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
 
USE db_perpustakaan;
 
-- ---------------------------------------------------------------------
-- 1. DROP EXISTING TABLES (children first, in dependency order)
-- ---------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
 
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS racks;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
 
SET FOREIGN_KEY_CHECKS = 1;
 
-- ---------------------------------------------------------------------
-- 2. CREATE TABLES
-- ---------------------------------------------------------------------
 
-- users ---------------------------------------------------------------
CREATE TABLE users (
    id          INT UNSIGNED          NOT NULL AUTO_INCREMENT,
    username    VARCHAR(50)           NOT NULL,
    email       VARCHAR(100)          NOT NULL,
    password    VARCHAR(255)          NOT NULL,
    role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    nis_nim     VARCHAR(50)                    DEFAULT NULL,
    profile_pic VARCHAR(255)          NOT NULL DEFAULT 'default.png',
    created_at  TIMESTAMP             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- categories ----------------------------------------------------------
CREATE TABLE categories (
    id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100)   NOT NULL,
    created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categories_name (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- publishers ----------------------------------------------------------
CREATE TABLE publishers (
    id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    name       VARCHAR(150)   NOT NULL,
    created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_publishers_name (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- authors -------------------------------------------------------------
CREATE TABLE authors (
    id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    name       VARCHAR(150)   NOT NULL,
    created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_authors_name (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- racks ---------------------------------------------------------------
CREATE TABLE racks (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    location_name VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_racks_location (location_name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- books ---------------------------------------------------------------
CREATE TABLE books (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title        VARCHAR(255) NOT NULL,
    isbn         VARCHAR(20)           DEFAULT NULL,
    category_id  INT UNSIGNED          DEFAULT NULL,
    publisher_id INT UNSIGNED          DEFAULT NULL,
    author_id    INT UNSIGNED          DEFAULT NULL,
    rack_id      INT UNSIGNED          DEFAULT NULL,
    release_year YEAR                  DEFAULT NULL,
    stock        INT UNSIGNED NOT NULL DEFAULT 0,
    cover_image  VARCHAR(255) NOT NULL DEFAULT 'default_book.png',
    description  TEXT                  DEFAULT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_books_isbn (isbn),
    KEY idx_books_title (title),
    KEY idx_books_category (category_id),
    KEY idx_books_publisher (publisher_id),
    KEY idx_books_author (author_id),
    KEY idx_books_rack (rack_id),
    CONSTRAINT fk_books_category FOREIGN KEY (category_id)
        REFERENCES categories (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_books_publisher FOREIGN KEY (publisher_id)
        REFERENCES publishers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_books_author FOREIGN KEY (author_id)
        REFERENCES authors (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_books_rack FOREIGN KEY (rack_id)
        REFERENCES racks (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_books_stock CHECK (stock >= 0)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- loans ---------------------------------------------------------------
CREATE TABLE loans (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED NOT NULL,
    book_id     INT UNSIGNED NOT NULL,
    loan_date   DATE         NOT NULL,
    due_date    DATE         NOT NULL,
    return_date DATE                  DEFAULT NULL,
    status      ENUM('pending', 'active', 'returned', 'rejected')
                             NOT NULL DEFAULT 'pending',
    fine_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_loans_user (user_id),
    KEY idx_loans_book (book_id),
    KEY idx_loans_status (status),
    KEY idx_loans_due_date (due_date),
    CONSTRAINT fk_loans_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_loans_book FOREIGN KEY (book_id)
        REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_loans_fine CHECK (fine_amount >= 0.00)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- reservations (queue feature) ----------------------------------------
CREATE TABLE reservations (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id        INT UNSIGNED NOT NULL,
    book_id        INT UNSIGNED NOT NULL,
    queue_position INT UNSIGNED NOT NULL DEFAULT 1,
    status         ENUM('waiting', 'fulfilled', 'cancelled')
                             NOT NULL DEFAULT 'waiting',
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_reservations_user (user_id),
    KEY idx_reservations_book (book_id),
    KEY idx_reservations_queue (book_id, queue_position),
    CONSTRAINT fk_reservations_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reservations_book FOREIGN KEY (book_id)
        REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_reservations_queue CHECK (queue_position >= 1)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- activity_logs -------------------------------------------------------
CREATE TABLE activity_logs (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     INT UNSIGNED          DEFAULT NULL,
    action_type VARCHAR(50)  NOT NULL,
    description TEXT                  DEFAULT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_activity_logs_user (user_id),
    KEY idx_activity_logs_action (action_type),
    KEY idx_activity_logs_created (created_at),
    CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
 
-- ---------------------------------------------------------------------
-- 3. SEED DATA
-- ---------------------------------------------------------------------
 
-- Initial accounts (password = plain text, hash before production!)
INSERT INTO users (username, email, password, role, nis_nim, profile_pic) VALUES
    ('admin',  'admin@perpustakaan.com',  'admin123', 'admin', NULL,      'default.png'),
    ('siswa1', 'siswa1@example.com',      'user123',  'user',  '2024001', 'default.png');
 
INSERT INTO categories (name) VALUES
    ('Fiksi'),
    ('Non-Fiksi'),
    ('Sains & Teknologi'),
    ('Sejarah'),
    ('Komik');
 
INSERT INTO publishers (name) VALUES
    ('Gramedia Pustaka Utama'),
    ('Penerbit Erlangga'),
    ('Penerbit Buku Kompas'),
    ('Mizan'),
    ('Andi Offset');
 
INSERT INTO authors (name) VALUES
    ('Andrea Hirata'),
    ('Tere Liye'),
    ('Pramoedya Ananta Toer'),
    ('J.K. Rowling'),
    ('Ahmad Fuadi');
 
INSERT INTO racks (location_name) VALUES
    ('Rak A - Fiksi'),
    ('Rak B - Non-Fiksi'),
    ('Rak C - Sains & Teknologi'),
    ('Rak D - Sejarah'),
    ('Rak E - Referensi');
 
INSERT INTO books
    (title, isbn, category_id, publisher_id, author_id, rack_id,
     release_year, stock, cover_image, description)
VALUES
    ('Laskar Pelangi', '9789793062792',
     (SELECT id FROM categories WHERE name = 'Fiksi'),
     (SELECT id FROM publishers WHERE name = 'Gramedia Pustaka Utama'),
     (SELECT id FROM authors WHERE name = 'Andrea Hirata'),
     (SELECT id FROM racks WHERE location_name = 'Rak A - Fiksi'),
     2005, 10, 'default_book.png',
     'Novel tentang perjuangan sepuluh anak di Belitung dalam mengejar mimpi lewat pendidikan.'),
    ('Negeri 5 Menara', '9789792245418',
     (SELECT id FROM categories WHERE name = 'Fiksi'),
     (SELECT id FROM publishers WHERE name = 'Gramedia Pustaka Utama'),
     (SELECT id FROM authors WHERE name = 'Ahmad Fuadi'),
     (SELECT id FROM racks WHERE location_name = 'Rak A - Fiksi'),
     2009, 8, 'default_book.png',
     'Kisah Alif dan sahabatnya yang berjuang menuntut ilmu di Pondok Madani, Maninjau.'),
    ('Bumi', '9786020304104',
     (SELECT id FROM categories WHERE name = 'Fiksi'),
     (SELECT id FROM publishers WHERE name = 'Gramedia Pustaka Utama'),
     (SELECT id FROM authors WHERE name = 'Tere Liye'),
     (SELECT id FROM racks WHERE location_name = 'Rak A - Fiksi'),
     2014, 12, 'default_book.png',
     'Novel petualangan Raib dan teman-temannya menembus dunia paralel.'),
    ('Hujan', '9786020330805',
     (SELECT id FROM categories WHERE name = 'Fiksi'),
     (SELECT id FROM publishers WHERE name = 'Gramedia Pustaka Utama'),
     (SELECT id FROM authors WHERE name = 'Tere Liye'),
     (SELECT id FROM racks WHERE location_name = 'Rak A - Fiksi'),
     2016, 9, 'default_book.png',
     'Novel tentang persahabatan dan harapan di masa depan pasca bencana.'),
    ('Bumi Manusia', '9789799731234',
     (SELECT id FROM categories WHERE name = 'Sejarah'),
     (SELECT id FROM publishers WHERE name = 'Penerbit Buku Kompas'),
     (SELECT id FROM authors WHERE name = 'Pramoedya Ananta Toer'),
     (SELECT id FROM racks WHERE location_name = 'Rak D - Sejarah'),
     1980, 4, 'default_book.png',
     'Roman sejarah tentang Minke, pribumi terdidik di masa penjajahan Hindia Belanda.'),
    ('Harry Potter dan Batu Bertuah', '9789796056851',
     (SELECT id FROM categories WHERE name = 'Fiksi'),
     (SELECT id FROM publishers WHERE name = 'Gramedia Pustaka Utama'),
     (SELECT id FROM authors WHERE name = 'J.K. Rowling'),
     (SELECT id FROM racks WHERE location_name = 'Rak A - Fiksi'),
     2000, 6, 'default_book.png',
     'Petualangan pertama Harry Potter di Sekolah Sihir Hogwarts.'),
    ('Matematika Kelas X', '9786022419815',
     (SELECT id FROM categories WHERE name = 'Sains & Teknologi'),
     (SELECT id FROM publishers WHERE name = 'Penerbit Erlangga'),
     NULL, -- buku teks tanpa penulis tunggal
     (SELECT id FROM racks WHERE location_name = 'Rak C - Sains & Teknologi'),
     2016, 15, 'default_book.png',
     'Buku pelajaran matematika untuk jenjang SMA kelas X sesuai kurikulum.');