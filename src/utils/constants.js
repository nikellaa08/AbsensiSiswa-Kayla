// Konstanta global aplikasi — SMK 8 Jakarta Barat

export const APP_NAME = 'SMK 8 Jakarta Barat';
export const APP_TAGLINE = 'Sistem Absensi Siswa';
export const SCHOOL_SHORT = 'SMK 8 Jakarta Barat';
export const SCHOOL_ADDRESS = 'Jl. Raya Pendidikan No. 8, Jakarta Barat, DKI Jakarta';
export const SCHOOL_EMAIL = 'info@smk8jakartabarat.sch.id';

// Jam operasional absensi
export const JAM_MASUK = '07:00'; // batas hadir / mulai terhitung terlambat
export const JAM_SELESAI = '15:00'; // jam pulang — setelah ini yang belum absen dianggap Alpha

export const KEYS = {
  users: 'users',
  classes: 'classes',
  attendance: 'attendance',
  session: 'session',
  settings: 'settings',
};

export const ROLES = {
  ADMIN: 'admin',
  SISWA: 'siswa',
};

export const STATUS = {
  HADIR: 'hadir',
  TERLAMBAT: 'terlambat',
  IZIN: 'izin',
  SAKIT: 'sakit',
  ALPHA: 'alpha',
};

// Opsi status yang bisa dipilih siswa saat absen
export const STATUS_OPTIONS = [
  { value: STATUS.HADIR, label: 'Hadir', description: 'Hadir di sekolah hari ini (sebelum 07:00)' },
  { value: STATUS.IZIN, label: 'Izin', description: 'Mendapat izin dari orang tua / wali' },
  { value: STATUS.SAKIT, label: 'Sakit', description: 'Tidak hadir karena sakit' },
];

// Opsi status untuk admin (mengubah absensi)
export const ADMIN_STATUS_OPTIONS = [
  { value: STATUS.HADIR, label: 'Hadir' },
  { value: STATUS.TERLAMBAT, label: 'Terlambat' },
  { value: STATUS.IZIN, label: 'Izin' },
  { value: STATUS.SAKIT, label: 'Sakit' },
  { value: STATUS.ALPHA, label: 'Alpha' },
];

export const STATUS_META = {
  [STATUS.HADIR]: { label: 'Hadir', color: 'hadir' },
  [STATUS.TERLAMBAT]: { label: 'Terlambat', color: 'terlambat' },
  [STATUS.IZIN]: { label: 'Izin', color: 'izin' },
  [STATUS.SAKIT]: { label: 'Sakit', color: 'sakit' },
  [STATUS.ALPHA]: { label: 'Alpha', color: 'alpha' },
};

// Status verifikasi lampiran (khusus Izin / Sakit)
export const VERIFICATION = {
  MENUNGGU: 'menunggu',
  DISETUJUI: 'disetujui',
  DITOLAK: 'ditolak',
};

export const VERIFICATION_META = {
  [VERIFICATION.MENUNGGU]: { label: 'Menunggu Verifikasi', color: 'amber' },
  [VERIFICATION.DISETUJUI]: { label: 'Disetujui', color: 'emerald' },
  [VERIFICATION.DITOLAK]: { label: 'Ditolak', color: 'red' },
};

// Batasan file lampiran (surat izin / surat sakit)
export const ALLOWED_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
export const ALLOWED_ATTACHMENT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'];
export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Tampilan status gabungan (status + verifikasi):
 * - Izin/Sakit yang disetujui -> "Izin Disetujui" / "Sakit Disetujui"
 * - Izin/Sakit yang ditolak   -> "Ditolak"
 * - Selain itu -> label status biasa
 */
export function getStatusDisplay(record) {
  if (!record) return { label: '-', color: 'gray' };
  const isIzinSakit = record.status === STATUS.IZIN || record.status === STATUS.SAKIT;
  if (isIzinSakit && record.verificationStatus === VERIFICATION.DISETUJUI) {
    return {
      label: record.status === STATUS.IZIN ? 'Izin Disetujui' : 'Sakit Disetujui',
      color: 'emerald',
    };
  }
  if (isIzinSakit && record.verificationStatus === VERIFICATION.DITOLAK) {
    return { label: 'Ditolak', color: 'red' };
  }
  const meta = STATUS_META[record.status];
  return { label: meta?.label || record.status, color: meta?.color || 'gray' };
}

/** Meta badge verifikasi — null jika record tidak memerlukan verifikasi */
export function getVerificationMeta(record) {
  if (!record) return null;
  return VERIFICATION_META[record.verificationStatus] || null;
}

export const DEFAULT_SETTINGS = {
  sekolah: SCHOOL_SHORT,
  tahunAjaran: '2025/2026',
  appName: APP_NAME,
};

export const PAGE_SIZE_STUDENTS = 8;
export const PAGE_SIZE_ATTENDANCE = 10;
export const PAGE_SIZE_HISTORY = 8;
