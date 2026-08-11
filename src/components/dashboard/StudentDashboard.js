'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  CheckBadgeIcon,
  IdentificationIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import {
  getStudentAttendanceOn,
  getAttendanceByStudent,
  getClassName,
} from '@/lib/storage';
import { getTodayParts, formatTime12, formatDateShort, formatDateID, todayStr } from '@/utils/date';
import { STATUS_META, STATUS } from '@/utils/constants';
import { buttonClasses } from '@/components/ui/buttonClasses';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [now, setNow] = useState(getTodayParts());
  useEffect(() => {
    const t = setInterval(() => setNow(getTodayParts()), 1000);
    return () => clearInterval(t);
  }, []);

  const today = todayStr();
  const record = useMemo(() => getStudentAttendanceOn(user?.id, today), [user?.id, today]);

  const monthStat = useMemo(() => {
    const month = today.slice(0, 7);
    const list = getAttendanceByStudent(user?.id).filter((a) => a.tanggal.startsWith(month));
    const hadir = list.filter((a) => a.status === STATUS.HADIR || a.status === STATUS.TERLAMBAT).length;
    const pct = list.length ? Math.round((hadir / list.length) * 100) : 0;
    return { total: list.length, hadir, pct };
  }, [user?.id, today]);

  const recent = useMemo(
    () =>
      getAttendanceByStudent(user?.id)
        .sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam))
        .slice(0, 5),
    [user?.id]
  );

  const lastRecord = recent[0] || null;

  return (
    <div className="space-y-6">
      {/* Kartu sapaan + identitas + jam */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white shadow-card-hover animate-slide-up sm:p-8">
        <div className="bg-grid absolute inset-0" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar user={user} size="lg" ring={false} className="ring-2 ring-white/40" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-blue-100">Halo, selamat datang 👋</p>
              <h2 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                {user?.nama}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
                  <IdentificationIcon className="h-3.5 w-3.5" />
                  NIS {user?.nis}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
                  <AcademicCapIcon className="h-3.5 w-3.5" />
                  Kelas {getClassName(user?.kelasId)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
            <div>
              <p className="font-mono text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">
                {now.time}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-100">
                <CalendarDaysIcon className="h-4 w-4" />
                {now.dateLabel}
              </p>
            </div>
            <div className="rounded-xl bg-white/15 px-4 py-3 ring-1 ring-white/25 backdrop-blur-sm">
              <p className="text-xs font-medium text-blue-100">Status Hari Ini</p>
              {record ? (
                <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-bold">
                  <CheckBadgeIcon className="h-5 w-5 text-emerald-300" />
                  {STATUS_META[record.status]?.label}
                  <span className="text-xs font-medium text-blue-100">
                    • {formatTime12(record.jam)}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-lg font-bold text-amber-300">Belum Absen</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tombol absen */}
      {record ? (
        <button
          disabled
          className={`${buttonClasses('outline', 'lg', 'w-full cursor-not-allowed')} opacity-70`}
        >
          <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
          Sudah Absen Hari Ini
          {record.keterangan && (
            <span className="text-xs font-medium text-gray-400">— {record.keterangan}</span>
          )}
        </button>
      ) : (
        <button
          onClick={() => router.push('/absen')}
          className={`${buttonClasses('primary', 'lg', 'w-full')} group`}
        >
          <ClockIcon className="h-5 w-5 transition group-hover:rotate-12" />
          Absen Sekarang
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      )}

      {/* Statistik bulan ini */}
      <div className="grid grid-cols-3 gap-4">
        <Card hover className="p-4 text-center sm:p-5">
          <p className="text-2xl font-extrabold text-gray-900">{monthStat.total}</p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">Absensi Bulan Ini</p>
        </Card>
        <Card hover className="p-4 text-center sm:p-5">
          <p className="text-2xl font-extrabold text-emerald-600">{monthStat.hadir}</p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">Total Hadir</p>
        </Card>
        <Card hover className="p-4 text-center sm:p-5">
          <p className="text-2xl font-extrabold text-blue-600">{monthStat.pct}%</p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">Persentase Hadir</p>
        </Card>
      </div>

      {/* Riwayat terakhir */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Riwayat Terakhir</h3>
            <p className="text-xs text-gray-400">5 catatan absensi terakhir</p>
          </div>
          <Link
            href="/riwayat"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Lihat semua
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {lastRecord && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDateID(lastRecord.tanggal)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime12(lastRecord.jam)}
                  {lastRecord.keterangan ? ` • ${lastRecord.keterangan}` : ''}
                </p>
              </div>
            </div>
            <Badge color={STATUS_META[lastRecord.status]?.color} dot>
              {STATUS_META[lastRecord.status]?.label}
            </Badge>
          </div>
        )}

        {recent.length ? (
          <ul className="divide-y divide-gray-100">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatDateShort(r.tanggal)}</p>
                    <p className="text-xs text-gray-400">{formatTime12(r.jam)}</p>
                  </div>
                </div>
                <Badge color={STATUS_META[r.status]?.color} dot>
                  {STATUS_META[r.status]?.label}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Belum ada riwayat"
            description="Riwayat absensi Anda akan tampil di sini setelah absen pertama."
          />
        )}
      </Card>
    </div>
  );
}
