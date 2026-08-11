'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, EnvelopeIcon, LockClosedIcon, ArrowRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import { APP_NAME } from '@/utils/constants';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    // Simulasi proses singkat agar loading terlihat
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success(`Selamat datang, ${result.user.nama}!`);
      router.push('/dashboard');
    }, 450);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4 py-10">
      {/* Dekorasi */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Link href="/">
            <Logo variant="light" className="h-12 w-12" />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100/90">
            <AcademicCapIcon className="h-4 w-4" />
            Sistem Absensi Siswa — {APP_NAME}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-2xl animate-slide-up sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Silakan login menggunakan akun yang diberikan oleh sekolah.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="nama@gmail.com"
              icon={EnvelopeIcon}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••"
              icon={LockClosedIcon}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error || undefined}
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {loading ? 'Memproses...' : 'Login'}
              {!loading && <ArrowRightIcon className="h-5 w-5" />}
            </Button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke beranda
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-blue-100/80">
          © {new Date().getFullYear()} SMK 8 Jakarta Barat — Sistem Absensi Siswa
        </p>
      </div>
    </div>
  );
}
