// Lapisan akses Local Storage — semua operasi CRUD data lewat sini
import { KEYS, STATUS, JAM_SELESAI } from '@/utils/constants';
import { buildSeedData } from '@/utils/seed';
import { uid } from '@/utils/helpers';
import { todayStr, nowTime } from '@/utils/date';

/* ---------- Helper dasar ---------- */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // QuotaExceededError dll — jangan sampai merusak aplikasi
    return false;
  }
}

/* ---------- Inisialisasi & reset ---------- */

/** Jika Local Storage kosong, buat seed data otomatis */
export function initLocalStorage() {
  if (!localStorage.getItem(KEYS.users)) {
    const seed = buildSeedData();
    Object.entries(seed).forEach(([k, v]) => write(k, v));
  }
}

/** Hapus semua data lalu seed ulang */
export function resetAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  initLocalStorage();
}

/**
 * Aturan Alfa otomatis: jika sudah lewat jam pulang (15:00) dan seorang siswa
 * aktif belum memiliki catatan absensi hari ini, sistem otomatis membuat
 * catatan dengan status Alpha. Idempoten — aman dipanggil berulang kali.
 */
export function autoMarkAlpha() {
  try {
    const today = todayStr();
    if (nowTime() < JAM_SELESAI) return 0;

    const students = getActiveStudents();
    const attendance = getAttendance();
    let added = 0;

    students.forEach((s) => {
      if (!attendance.some((a) => a.siswaId === s.id && a.tanggal === today)) {
        attendance.push({
          id: uid(),
          siswaId: s.id,
          tanggal: today,
          jam: `${JAM_SELESAI}:00`,
          status: STATUS.ALPHA,
          keterangan: 'Tidak hadir tanpa keterangan',
        });
        added += 1;
      }
    });

    if (added > 0) saveAttendance(attendance);
    return added;
  } catch {
    return 0;
  }
}

/* ---------- Users ---------- */
export const getUsers = () => read(KEYS.users, []);
export const saveUsers = (users) => write(KEYS.users, users);

export const getStudents = () => getUsers().filter((u) => u.role === 'siswa');
export const getActiveStudents = () => getStudents().filter((s) => s.status !== 'tidak aktif');

export const getUserById = (id) => getUsers().find((u) => u.id === id) || null;

export function addUser(data) {
  const users = getUsers();
  const user = { id: uid(), ...data };
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id, data) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...data } : u));
  saveUsers(users);
  return getUserById(id);
}

export function deleteUser(id) {
  // Hapus juga seluruh riwayat absensi milik siswa tersebut
  saveUsers(getUsers().filter((u) => u.id !== id));
  saveAttendance(getAttendance().filter((a) => a.siswaId !== id));
}

export const isEmailTaken = (email, excludeId) =>
  getUsers().some(
    (u) => u.email?.toLowerCase() === String(email).trim().toLowerCase() && u.id !== excludeId
  );

export const isNisTaken = (nis, excludeId) =>
  getUsers().some((u) => u.nis === String(nis).trim() && u.id !== excludeId);

/* ---------- Classes ---------- */
export const getClasses = () => read(KEYS.classes, []);
export const saveClasses = (classes) => write(KEYS.classes, classes);

export const getClassById = (id) => getClasses().find((c) => c.id === id) || null;
export const getClassName = (id) => getClassById(id)?.nama || '-';

export function addClass(data) {
  const classes = getClasses();
  const cls = { id: uid(), ...data };
  classes.push(cls);
  saveClasses(classes);
  return cls;
}

export function updateClass(id, data) {
  const classes = getClasses().map((c) => (c.id === id ? { ...c, ...data } : c));
  saveClasses(classes);
  return getClassById(id);
}

export function deleteClass(id) {
  saveClasses(getClasses().filter((c) => c.id !== id));
}

export const isClassNameTaken = (nama, excludeId) =>
  getClasses().some(
    (c) => c.nama?.toLowerCase() === String(nama).trim().toLowerCase() && c.id !== excludeId
  );

/* ---------- Attendance ---------- */
export const getAttendance = () => read(KEYS.attendance, []);
export const saveAttendance = (attendance) => write(KEYS.attendance, attendance);

export function addAttendance(data) {
  const attendance = getAttendance();
  const record = { id: uid(), ...data };
  attendance.push(record);
  // Kembalikan null jika gagal tersimpan (mis. ruang penyimpanan penuh)
  return saveAttendance(attendance) ? record : null;
}

export function updateAttendance(id, data) {
  const attendance = getAttendance().map((a) => (a.id === id ? { ...a, ...data } : a));
  return saveAttendance(attendance);
}

export function deleteAttendance(id) {
  saveAttendance(getAttendance().filter((a) => a.id !== id));
}

/** Semua absensi pada tanggal tertentu */
export const getAttendanceByDate = (tanggal) => getAttendance().filter((a) => a.tanggal === tanggal);

/** Absensi seorang siswa pada tanggal tertentu (null jika belum) */
export const getStudentAttendanceOn = (siswaId, tanggal) =>
  getAttendance().find((a) => a.siswaId === siswaId && a.tanggal === tanggal) || null;

/** Apakah siswa sudah absen hari ini */
export const hasAttendedToday = (siswaId) => !!getStudentAttendanceOn(siswaId, todayStr());

/** Semua absensi milik seorang siswa */
export const getAttendanceByStudent = (siswaId) =>
  getAttendance().filter((a) => a.siswaId === siswaId);

/* ---------- Session ---------- */
export const getSession = () => read(KEYS.session, null);
export const setSession = (session) => write(KEYS.session, session);
export const clearSession = () => localStorage.removeItem(KEYS.session);

/* ---------- Settings ---------- */
export const getSettings = () => read(KEYS.settings, {});
export const saveSettings = (settings) => write(KEYS.settings, settings);

/* ---------- Export / Import JSON ---------- */
export function exportAllData() {
  return {
    users: getUsers(),
    classes: getClasses(),
    attendance: getAttendance(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
}

export function importAllData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('File JSON tidak valid.');
  }
  const users = Array.isArray(data.users) ? data.users : null;
  const classes = Array.isArray(data.classes) ? data.classes : null;
  const attendance = Array.isArray(data.attendance) ? data.attendance : null;
  if (!users || !classes || !attendance) {
    throw new Error('Format data tidak dikenali. Pastikan file berisi users, classes, dan attendance.');
  }
  if (!write(KEYS.users, users)) throw new Error('Penyimpanan gagal — ruang penyimpanan browser penuh.');
  if (!write(KEYS.classes, classes)) throw new Error('Penyimpanan gagal — ruang penyimpanan browser penuh.');
  if (!write(KEYS.attendance, attendance)) throw new Error('Penyimpanan gagal — ruang penyimpanan browser penuh.');
  write(
    KEYS.settings,
    data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)
      ? data.settings
      : {}
  );
  clearSession();
}
