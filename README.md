# 🎓 SMK 8 Jakarta Barat — Sistem Absensi Siswa

Website resmi + sistem absensi digital siswa berbasis web untuk **SMK 8 Jakarta Barat**.
Seluruh data tersimpan di **Local Storage** browser.

## ✨ Fitur Utama

- **2 Role**: Admin (Guru) & Siswa dengan protected route otomatis
- **Landing page** bergaya website resmi sekolah (profil sekolah, keunggulan, cara kerja)
- **Dashboard Admin**: Total Hadir / Terlambat / Izin / Sakit / Alfa, grafik mingguan & bulanan (Chart.js)
- **Kelola Siswa**: CRUD + search, pagination, sorting, filter kelas
- **Kelola Kelas**: CRUD dengan modal
- **Absensi Siswa**: sekali sehari (Hadir / Izin / Sakit), jam & tanggal otomatis
- **Aturan Terlambat**: absen Hadir setelah pukul 07:00 otomatis menjadi **Terlambat** + keterangan menit
- **Alasan Izin & Keluhan Sakit**: wajib diisi minimal 10 karakter
- **Alfa Otomatis**: siswa yang belum absen sampai pukul 15:00 otomatis berstatus **Alfa**
- **Admin dapat mengubah status & keterangan** seluruh absensi
- **Foto Profil**: guru & siswa dapat mengubah foto (JPG/PNG) yang tersimpan sebagai Base64
- **Rekap**: filter tanggal & kelas, hitung otomatis, grafik
- **Pengaturan**: edit profil, ganti password, reset data, export/import JSON

## 🚀 Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

> Saat pertama kali dibuka, data awal (seed) dibuat otomatis di Local Storage.
> Hari ini **tidak** memiliki catatan absensi — siswa harus absen sendiri.

## 👤 Akun Bawaan

| Role  | Nama | Email           | Password |
| ----- | ---- | --------------- | -------- |
| Admin | Guru | admin@gmail.com | 123456   |
| Siswa | Andi | andi@gmail.com  | 123456   |
| Siswa | Budi | budi@gmail.com  | 123456   |
| Siswa | Citra| citra@gmail.com | 123456   |
| Siswa | Dina | dina@gmail.com  | 123456   |
| Siswa | Eko  | eko@gmail.com   | 123456   |
| Siswa | Fajar| fajar@gmail.com | 123456   |
| Siswa | Gita | gita@gmail.com  | 123456   |
| Siswa | Hadi | hadi@gmail.com  | 123456   |

## 🧱 Tech Stack

- **Next.js 15** (App Router) + JavaScript
- **Tailwind CSS** (responsif, animasi, hover effect)
- **Chart.js** + react-chartjs-2
- **Heroicons**
- **Local Storage** (tanpa database, tanpa API)

## 📁 Struktur Project

```
src/
├── app/                 # Halaman (App Router)
│   ├── layout.js        # Root layout (Auth & Toast provider)
│   ├── page.js          # Landing page
│   ├── login/
│   └── (app)/           # Halaman ber-proteksi
│       ├── dashboard/   # Dashboard (admin & siswa)
│       ├── kelola-siswa/
│       ├── kelola-kelas/
│       ├── absensi/
│       ├── rekap/
│       ├── pengaturan/
│       ├── absen/
│       ├── riwayat/
│       └── profil/
├── components/
│   ├── ui/              # Komponen reusable (Button, Input, Modal, Avatar, PhotoUpload, dll)
│   ├── layout/          # Navbar, Sidebar, Topbar, Footer
│   ├── landing/         # Hero, About, Features, HowItWorks
│   ├── dashboard/       # AdminDashboard, StudentDashboard
│   └── charts/          # Chart.js wrapper
├── context/AuthContext.js
├── hooks/               # useAuth, useLocalStorage
├── lib/storage.js       # Seluruh operasi Local Storage
├── utils/               # constants, date, helpers, validation, seed
└── styles/globals.css
```

## 💾 Local Storage Keys

| Key          | Isi                                    |
| ------------ | -------------------------------------- |
| `users`      | Data pengguna (admin & siswa, termasuk foto) |
| `classes`    | Data kelas                            |
| `attendance` | Data absensi (status, jam, keterangan) |
| `session`    | Session login aktif                    |
| `settings`   | Pengaturan aplikasi                    |

> **Catatan**: Data tersimpan di browser. Membersihkan Local Storage akan menghapus seluruh data.
> Gunakan fitur **Export Data JSON** di halaman Pengaturan untuk cadangan.
