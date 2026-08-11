'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { PageLoader } from '@/components/ui/Spinner';

/**
 * Hanya merender children di sisi client (setelah mount).
 * Mencegah akses Local Storage saat server-side render / prerender.
 */
function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <PageLoader />;
  return children;
}

export default function AppLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Proteksi: belum login -> pindah ke /login
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) return <PageLoader />;
  if (!user) return null;

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-col lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          <footer className="px-4 pb-6 text-center text-xs text-gray-400 lg:px-8">
            © {new Date().getFullYear()} SMK 8 Jakarta Barat — Sistem Absensi Siswa
          </footer>
        </div>
      </div>
    </ClientOnly>
  );
}
