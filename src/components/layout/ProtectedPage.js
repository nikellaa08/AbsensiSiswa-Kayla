'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Pembatas halaman berdasarkan role.
 * @param {string[]} roles - role yang diizinkan mengakses halaman ini
 */
export default function ProtectedPage({ roles = ['admin', 'siswa'], children }) {
  const { user } = useAuth();
  const router = useRouter();

  const allowed = user && roles.includes(user.role);

  useEffect(() => {
    if (user && !allowed) {
      router.replace('/dashboard');
    }
  }, [user, allowed, router]);

  if (!allowed) return null;
  return children;
}
