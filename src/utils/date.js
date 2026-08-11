// Helper tanggal & waktu (semua lokal, tanpa library tambahan)

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

/** Konversi Date -> "YYYY-MM-DD" (zona lokal) */
export function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Tanggal hari ini "YYYY-MM-DD" */
export function todayStr() {
  return toDateStr(new Date());
}

/** Jam sekarang "HH:MM:SS" */
export function nowTime() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((x) => String(x).padStart(2, '0'))
    .join(':');
}

/** Format "YYYY-MM-DD" -> "Senin, 11 Agustus 2026" */
export function formatDateID(dateStr) {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** Format "YYYY-MM-DD" -> "11 Agt 2026" */
export function formatDateShort(dateStr) {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}

/** Format "HH:MM:SS" -> "07:45 AM" */
export function formatTime12(timeStr) {
  if (!timeStr) return '-';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** "YYYY-MM-DD" + "HH:MM:SS" -> "Senin, 11 Agustus 2026 • 07:45 AM" */
export function formatDateTime(dateStr, timeStr) {
  return `${formatDateID(dateStr)} • ${formatTime12(timeStr)}`;
}

/** N hari terakhir (termasuk hari ini), urutan paling lama -> terbaru */
export function getLastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(toDateStr(d));
  }
  return out;
}

/** Bagian tanggal & jam hari ini */
export function getTodayParts() {
  const d = new Date();
  return {
    dateStr: toDateStr(d),
    time: nowTime(),
    dateLabel: formatDateID(toDateStr(d)),
  };
}

/**
 * Selisih menit antara dua waktu "HH:MM[:SS]" (later - earlier).
 * Dibulatkan ke atas; negatif bila earlier lebih besar dari later.
 */
export function diffMinutes(later, earlier) {
  if (!later || !earlier) return 0;
  const toSec = (t) => {
    const [h, m, s = 0] = t.split(':').map(Number);
    return h * 3600 + m * 60 + (s || 0);
  };
  return Math.ceil((toSec(later) - toSec(earlier)) / 60);
}

/** Nama bulan dalam setahun (indeks 0-11) */
export function getMonthName(monthIndex) {
  return MONTHS[monthIndex] || '-';
}

/** Semua tanggal pada bulan tertentu "YYYY-MM" -> ["YYYY-MM-DD", ...] */
export function getDaysInMonth(monthPrefix) {
  const [y, m] = monthPrefix.split('-').map(Number);
  const last = new Date(y, m, 0).getDate();
  return Array.from({ length: last }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return `${y}-${String(m).padStart(2, '0')}-${day}`;
  });
}
