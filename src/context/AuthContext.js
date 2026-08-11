'use client';
// Context autentikasi — mengelola session login (users + session di Local Storage)
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  initLocalStorage,
  autoMarkAlpha,
  getSession,
  setSession,
  clearSession,
  getUsers,
  getUserById,
  updateUser,
} from '@/lib/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inisialisasi: seed data bila kosong + terapkan alfa otomatis + pulihkan session
  useEffect(() => {
    initLocalStorage();
    autoMarkAlpha();
    // Cek berkala: saat lewat jam pulang (15:00), siswa yang belum absen otomatis Alfa
    const alphaTimer = setInterval(() => autoMarkAlpha(), 60 * 1000);
    const session = getSession();
    if (session?.userId) {
      const found = getUserById(session.userId);
      if (found && found.status !== 'tidak aktif') {
        setUser(found);
      } else {
        clearSession();
      }
    }
    setLoading(false);
    return () => clearInterval(alphaTimer);
  }, []);

  /** Login dengan email & password. Mengembalikan { user } atau { error }. */
  const login = useCallback((email, password) => {
    initLocalStorage();
    const users = getUsers();
    const found = users.find(
      (u) => u.email?.toLowerCase() === String(email).trim().toLowerCase() && u.password === password
    );
    if (!found) {
      return { error: 'Email atau password salah.' };
    }
    if (found.role === 'siswa' && found.status === 'tidak aktif') {
      return { error: 'Akun Anda tidak aktif. Silakan hubungi admin.' };
    }
    setSession({ userId: found.id, loginAt: new Date().toISOString() });
    setUser(found);
    return { user: found };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  /** Perbarui data profil user yang sedang login */
  const updateProfile = useCallback(
    (data) => {
      if (!user) return null;
      const updated = updateUser(user.id, data);
      setUser(updated);
      return updated;
    },
    [user]
  );

  /** Ganti password user yang sedang login */
  const changePassword = useCallback(
    (newPassword) => {
      if (!user) return;
      updateUser(user.id, { password: newPassword });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
