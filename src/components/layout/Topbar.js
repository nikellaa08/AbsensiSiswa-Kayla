'use client';
import { usePathname } from 'next/navigation';
import { Bars3Icon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { formatDateID, todayStr } from '@/utils/date';
import Avatar from '@/components/ui/Avatar';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/kelola-siswa': 'Kelola Siswa',
  '/kelola-kelas': 'Kelola Kelas',
  '/absensi': 'Data Absensi',
  '/rekap': 'Rekap Absensi',
  '/pengaturan': 'Pengaturan',
  '/absen': 'Absen Hari Ini',
  '/riwayat': 'Riwayat Absensi',
  '/profil': 'Profil Saya',
};

export default function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = TITLES[pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
            aria-label="Buka menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 md:inline-flex">
            <CalendarDaysIcon className="h-4 w-4" />
            {formatDateID(todayStr())}
          </span>
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight text-gray-900">{user.nama}</p>
                <p className="text-xs capitalize text-gray-400">
                  {user.role === 'admin' ? 'Admin / Guru' : 'Siswa'}
                </p>
              </div>
              <Avatar user={user} size="sm" ring={false} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
