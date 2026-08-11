// Validasi form
import { isEmailTaken, isNisTaken, isClassNameTaken } from '@/lib/storage';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validasi data siswa.
 * @param {object} data - { id?, nama, nis, email, password, kelasId, status }
 * @param {object} opts - { isEdit }
 */
export function validateStudent(data, { isEdit = false } = {}) {
  const errors = {};

  if (!data.nama?.trim()) {
    errors.nama = 'Nama wajib diisi.';
  }

  if (!data.nis?.trim()) {
    errors.nis = 'NIS wajib diisi.';
  } else if (isNisTaken(data.nis, data.id)) {
    errors.nis = 'NIS sudah digunakan.';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Format email tidak valid.';
  } else if (isEmailTaken(data.email, data.id)) {
    errors.email = 'Email sudah digunakan.';
  }

  if (!data.kelasId) {
    errors.kelasId = 'Kelas wajib dipilih.';
  }

  if (!isEdit) {
    if (!data.password) {
      errors.password = 'Password wajib diisi.';
    } else if (data.password.length < 6) {
      errors.password = 'Password minimal 6 karakter.';
    }
  } else if (data.password && data.password.length < 6) {
    errors.password = 'Password minimal 6 karakter.';
  }

  return errors;
}

/** Validasi data kelas */
export function validateClassName(nama, { excludeId } = {}) {
  const errors = {};
  if (!nama?.trim()) {
    errors.nama = 'Nama kelas wajib diisi.';
  } else if (isClassNameTaken(nama, excludeId)) {
    errors.nama = 'Nama kelas sudah ada.';
  }
  return errors;
}

/** Validasi profil (nama & email) */
export function validateProfile(data, { excludeId } = {}) {
  const errors = {};
  if (!data.nama?.trim()) {
    errors.nama = 'Nama wajib diisi.';
  }
  if (!data.email?.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Format email tidak valid.';
  } else if (isEmailTaken(data.email, excludeId)) {
    errors.email = 'Email sudah digunakan.';
  }
  return errors;
}

/** Validasi ganti password */
export function validatePasswordChange({ current, newPass, confirm }, currentPassword) {
  const errors = {};
  if (!current) {
    errors.current = 'Password lama wajib diisi.';
  } else if (current !== currentPassword) {
    errors.current = 'Password lama salah.';
  }
  if (!newPass) {
    errors.newPass = 'Password baru wajib diisi.';
  } else if (newPass.length < 6) {
    errors.newPass = 'Password minimal 6 karakter.';
  }
  if (!confirm) {
    errors.confirm = 'Konfirmasi password wajib diisi.';
  } else if (newPass !== confirm) {
    errors.confirm = 'Konfirmasi password tidak cocok.';
  }
  return errors;
}
