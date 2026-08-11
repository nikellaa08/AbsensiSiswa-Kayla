# Product Requirements Document (PRD)

# Aplikasi Web Absensi Siswa

## Ringkasan

Prototype aplikasi absensi siswa berbasis Next.js dengan Local Storage.

## Target Pengguna

-   Admin/Guru
-   Siswa

## Tujuan

-   Digitalisasi absensi.
-   Mempermudah rekap kehadiran.
-   Menjadi MVP sebelum backend.

## Fitur

### Landing Page

-   Hero
-   Tentang
-   Login

### Login

-   Admin
-   Siswa

### Dashboard Admin

-   Statistik
-   Kelola Kelas
-   Kelola Siswa
-   Data Absensi
-   Rekap

### Dashboard Siswa

-   Absen Hari Ini
-   Riwayat
-   Profil

## Functional Requirements

1.  Login berdasarkan Local Storage.
2.  CRUD kelas.
3.  CRUD siswa.
4.  Siswa hanya dapat absen sekali per hari.
5.  Admin melihat rekap.
6.  Data tersimpan di Local Storage.

## Non Functional

-   Responsive.
-   Mudah digunakan.
-   Loading ringan.

## Struktur Data

### users

-   id
-   nama
-   email
-   password
-   role

### classes

-   id
-   nama

### attendance

-   id
-   siswaId
-   tanggal
-   jam
-   status

## User Flow

Landing → Login → Dashboard → Absensi/Kelola Data → Rekap → Logout

## Acceptance Criteria

-   Login berhasil sesuai role.
-   CRUD berjalan.
-   Absensi tersimpan.
-   Rekap tampil.
-   Data tetap ada selama Local Storage tidak dihapus.
