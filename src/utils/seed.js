// Seed data awal — dijalankan otomatis saat Local Storage kosong
import { uid } from './helpers';
import { getLastNDays, todayStr } from './date';
import { DEFAULT_SETTINGS, STATUS, VERIFICATION } from './constants';

/**
 * Bangun data awal:
 * - 1 admin (Guru)
 * - 8 siswa dummy
 * - 5 kelas
 * - riwayat absensi 6 hari terakhir (TANPA hari ini agar status siswa
 *   saat pertama login adalah "Belum Absen")
 */
export function buildSeedData() {
  const classes = ['X RPL 1', 'X RPL 2', 'XI RPL 1', 'XI RPL 2', 'XII RPL 1'].map((nama) => ({
    id: uid(),
    nama,
  }));
  const [xrpl1, xrpl2, xirpl1, xirpl2, xiirpl1] = classes;

  const users = [
    { id: uid(), nama: 'Guru', email: 'admin@gmail.com', password: '123456', role: 'admin', status: 'aktif' },
    { id: uid(), nama: 'Andi Saputra', email: 'andi@gmail.com', password: '123456', role: 'siswa', nis: '2023001', kelasId: xrpl1.id, status: 'aktif' },
    { id: uid(), nama: 'Budi Santoso', email: 'budi@gmail.com', password: '123456', role: 'siswa', nis: '2023002', kelasId: xrpl1.id, status: 'aktif' },
    { id: uid(), nama: 'Citra Ayu', email: 'citra@gmail.com', password: '123456', role: 'siswa', nis: '2023003', kelasId: xrpl2.id, status: 'aktif' },
    { id: uid(), nama: 'Dina Marlina', email: 'dina@gmail.com', password: '123456', role: 'siswa', nis: '2023004', kelasId: xirpl1.id, status: 'aktif' },
    { id: uid(), nama: 'Eko Prasetyo', email: 'eko@gmail.com', password: '123456', role: 'siswa', nis: '2023005', kelasId: xirpl2.id, status: 'aktif' },
    { id: uid(), nama: 'Fajar Nugroho', email: 'fajar@gmail.com', password: '123456', role: 'siswa', nis: '2023006', kelasId: xiirpl1.id, status: 'aktif' },
    { id: uid(), nama: 'Gita Puspita', email: 'gita@gmail.com', password: '123456', role: 'siswa', nis: '2023007', kelasId: xiirpl1.id, status: 'aktif' },
    { id: uid(), nama: 'Hadi Wijaya', email: 'hadi@gmail.com', password: '123456', role: 'siswa', nis: '2023008', kelasId: xiirpl1.id, status: 'aktif' },
  ];

  const students = users.filter((u) => u.role === 'siswa');

  // Riwayat absensi 6 hari terakhir (hari ini sengaja KOSONG — siswa harus absen sendiri)
  const attendance = [];
  const days = getLastNDays(7).filter((d) => d !== todayStr());

  days.forEach((tanggal, idx) => {
    students.forEach((s, j) => {
      const r = (idx * 7 + j) % 13;
      let status = STATUS.HADIR;
      if (r === 3 || r === 8) status = STATUS.IZIN;
      else if (r === 5) status = STATUS.SAKIT;
      else if (r === 9) status = STATUS.TERLAMBAT;

      // Beberapa siswa alpha (tidak absen) di hari tertentu
      const isAlpha = (idx === 2 && j === 4) || (idx === 0 && j === 7);

      if (!isAlpha) {
        // Hadir/izin/sakit umumnya absen sebelum jam masuk; terlambat sesudahnya
        let hour = 6 + (j % 2);
        let minute = (10 + j * 8) % 60;
        let keterangan = '';
        let verificationStatus;
        if (status === STATUS.TERLAMBAT) {
          hour = 7;
          minute = 5 + j * 4; // 07:05 – 07:33
          keterangan = `Terlambat ${minute} Menit`;
        } else if (status === STATUS.IZIN) {
          keterangan = 'Alasan Izin: Keperluan keluarga';
          // Riwayat lama dianggap sudah diverifikasi
          verificationStatus = VERIFICATION.DISETUJUI;
        } else if (status === STATUS.SAKIT) {
          keterangan = 'Keluhan: Demam dan pusing';
          verificationStatus = VERIFICATION.DISETUJUI;
        }

        attendance.push({
          id: uid(),
          siswaId: s.id,
          tanggal,
          jam: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
          status,
          keterangan,
          ...(verificationStatus ? { verificationStatus } : {}),
        });
      }
    });
  });

  const settings = { ...DEFAULT_SETTINGS };

  return { users, classes, attendance, settings };
}
