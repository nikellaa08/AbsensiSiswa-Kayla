'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/helpers';
import { getSettings } from '@/lib/storage';
import Logo from '@/components/ui/Logo';
import Avatar from '@/components/ui/Avatar';

const NAV = {
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/kelola-siswa', label: 'Kelola Siswa', icon: UsersIcon },
    { href: '/kelola-kelas', label: 'Kelola Kelas', icon: AcademicCapIcon },
    { href: '/absensi', label: 'Absensi', icon: ClipboardDocumentCheckIcon },
    { href: '/rekap', label: 'Rekap', icon: ChartBarIcon },
    { href: '/pengaturan', label: 'Pengaturan', icon: Cog6ToothIcon },
  ],
  siswa: [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/absen', label: 'Absen Hari Ini', icon: ClockIcon },
    { href: '/riwayat', label: 'Riwayat', icon: CalendarDaysIcon },
    { href: '/profil', label: 'Profil', icon: UserCircleIcon },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  if (!user) return null;
  const items = NAV[user.role] || [];
  const settings = getSettings();

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar. Sampai jumpa!');
    router.push('/login');
  };

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Logo variant="light" compact />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Sekolah */}
        <div className="border-b border-white/10 px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {settings.sekolah || 'Sekolah'}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Tahun Ajaran {settings.tahunAjaran || '-'}
          </p>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Menu {user.role === 'admin' ? 'Admin' : 'Siswa'}
          </p>
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                )}
                <Icon
                  className={cn('h-5 w-5 shrink-0', active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300')}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar user={user} size="md" ring={false} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user.nama}</p>
              <p className="truncate text-xs capitalize text-slate-400">
                {user.role === 'admin' ? 'Admin / Guru' : 'Siswa'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
