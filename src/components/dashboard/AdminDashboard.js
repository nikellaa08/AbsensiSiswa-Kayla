'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  HeartIcon,
  XCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import {
  getStudents,
  getActiveStudents,
  getClasses,
  getAttendance,
  getAttendanceByDate,
  getUserById,
  getClassName,
} from '@/lib/storage';
import {
  todayStr,
  formatDateShort,
  formatDateTime,
  getLastNDays,
  getDaysInMonth,
  getMonthName,
} from '@/utils/date';
import { STATUS_META, STATUS } from '@/utils/constants';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DoughnutChart from '@/components/charts/DoughnutChart';
import BarChart from '@/components/charts/BarChart';
import EmptyState from '@/components/ui/EmptyState';
import Table from '@/components/ui/Table';

const COLORS = {
  [STATUS.HADIR]: '#10b981',
  [STATUS.TERLAMBAT]: '#f97316',
  [STATUS.IZIN]: '#f59e0b',
  [STATUS.SAKIT]: '#ef4444',
  [STATUS.ALPHA]: '#9ca3af',
};

/** Hitung jumlah status pada daftar catatan, alpha = siswa tanpa catatan */
function countStatuses(attendance, totalStudents) {
  const counts = {
    [STATUS.HADIR]: 0,
    [STATUS.TERLAMBAT]: 0,
    [STATUS.IZIN]: 0,
    [STATUS.SAKIT]: 0,
    [STATUS.ALPHA]: 0,
  };
  attendance.forEach((a) => {
    if (counts[a.status] !== undefined) counts[a.status] += 1;
  });
  counts[STATUS.ALPHA] += Math.max(0, totalStudents - attendance.length);
  return counts;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const today = todayStr();
    const students = getActiveStudents();
    const todayAttendance = getAttendanceByDate(today);
    const counts = countStatuses(todayAttendance, students.length);
    return {
      totalSiswa: getStudents().length,
      totalKelas: getClasses().length,
      ...counts,
      totalAbsen: todayAttendance.length,
    };
  }, []);

  const weekly = useMemo(() => {
    const all = getAttendance();
    const students = getActiveStudents();
    const days = getLastNDays(7);
    return {
      labels: days.map((d) => formatDateShort(d)),
      series: days.map((d) => {
        const dayAttendance = all.filter((a) => a.tanggal === d);
        const counts = countStatuses(dayAttendance, students.length);
        return counts;
      }),
    };
  }, []);

  const monthly = useMemo(() => {
    const all = getAttendance();
    const students = getActiveStudents();
    const today = todayStr();
    const monthPrefix = today.slice(0, 7);
    // Hanya tampilkan hari yang sudah berlalu / hari ini
    const days = getDaysInMonth(monthPrefix).filter((d) => d <= today);
    return {
      labels: days.map((d) => String(Number(d.slice(8)))),
      series: days.map((d) => {
        const dayAttendance = all.filter((a) => a.tanggal === d);
        return countStatuses(dayAttendance, students.length);
      }),
    };
  }, []);

  const buildSeries = (label, series) => ({
    label,
    data: series.map((c) => c[label]),
    backgroundColor: COLORS[label],
  });

  const recent = useMemo(
    () =>
      [...getAttendance()]
        .sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam))
        .slice(0, 6)
        .map((a) => ({ ...a, siswa: getUserById(a.siswaId) }))
        .filter((a) => a.siswa),
    []
  );

  const statCards = [
    { label: 'Total Siswa', value: stats.totalSiswa, accent: 'blue', icon: UsersIcon, sub: 'seluruh siswa terdaftar' },
    { label: 'Total Kelas', value: stats.totalKelas, accent: 'indigo', icon: AcademicCapIcon, sub: 'kelas aktif' },
    { label: 'Hadir Hari Ini', value: stats.hadir, accent: 'green', icon: CheckCircleIcon, sub: 'siswa hadir' },
    { label: 'Terlambat Hari Ini', value: stats.terlambat, accent: 'amber', icon: ClockIcon, sub: 'hadir setelah 07:00' },
    { label: 'Izin Hari Ini', value: stats.izin, accent: 'amber', icon: DocumentCheckIcon, sub: 'siswa izin' },
    { label: 'Sakit Hari Ini', value: stats.sakit, accent: 'red', icon: HeartIcon, sub: 'siswa sakit' },
    { label: 'Alpha Hari Ini', value: stats.alpha, accent: 'gray', icon: XCircleIcon, sub: 'tidak hadir' },
  ];

  return (
    <div className="space-y-6">
      {/* Sapaan */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Halo, {user?.nama} 👋
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Berikut ringkasan absensi hari ini di SMK 8 Jakarta Barat.
        </p>
      </div>

      {/* Kartu statistik */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 50} />
        ))}
      </div>

      {/* Chart */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Status Hari Ini</h3>
              <p className="text-xs text-gray-400">{formatDateShort(todayStr())}</p>
            </div>
            <Badge color="blue">{stats.totalAbsen} absen</Badge>
          </div>
          <div className="mt-4">
            <DoughnutChart
              labels={['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Alpha']}
              values={[
                stats.hadir,
                stats.terlambat,
                stats.izin,
                stats.sakit,
                stats.alpha,
              ]}
              colors={Object.values(COLORS)}
            />
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Grafik Mingguan</h3>
              <p className="text-xs text-gray-400">Tren 7 hari terakhir per status</p>
            </div>
          </div>
          <div className="mt-4">
            <BarChart
              labels={weekly.labels}
              stacked
              datasets={[
                buildSeries(STATUS.HADIR, weekly.series),
                buildSeries(STATUS.TERLAMBAT, weekly.series),
                buildSeries(STATUS.IZIN, weekly.series),
                buildSeries(STATUS.SAKIT, weekly.series),
                buildSeries(STATUS.ALPHA, weekly.series),
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Grafik bulanan */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Grafik Bulanan</h3>
            <p className="text-xs text-gray-400">
              Kehadiran siswa {getMonthName(Number(todayStr().slice(5, 7)) - 1)} {todayStr().slice(0, 4)} per hari
            </p>
          </div>
        </div>
        <div className="mt-4">
          <BarChart
            labels={monthly.labels}
            stacked
            height="h-72"
            maxTicksLimit={10}
            datasets={[
              buildSeries(STATUS.HADIR, monthly.series),
              buildSeries(STATUS.TERLAMBAT, monthly.series),
              buildSeries(STATUS.IZIN, monthly.series),
              buildSeries(STATUS.SAKIT, monthly.series),
              buildSeries(STATUS.ALPHA, monthly.series),
            ]}
          />
        </div>
      </Card>

      {/* Absensi terbaru */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Absensi Terbaru</h3>
            <p className="text-xs text-gray-400">6 catatan absensi terakhir</p>
          </div>
          <Link
            href="/absensi"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Lihat semua
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <Table
          columns={[
            { key: 'nama', header: 'Nama', render: (r) => <span className="font-semibold text-gray-900">{r.siswa.nama}</span> },
            { key: 'kelas', header: 'Kelas', render: (r) => getClassName(r.siswa.kelasId) },
            { key: 'tanggal', header: 'Tanggal & Jam', render: (r) => <span className="whitespace-nowrap">{formatDateTime(r.tanggal, r.jam)}</span> },
            { key: 'status', header: 'Status', render: (r) => <Badge color={STATUS_META[r.status]?.color} dot>{STATUS_META[r.status]?.label}</Badge> },
          ]}
          data={recent}
          empty={
            <EmptyState
              title="Belum ada absensi"
              description="Catatan absensi siswa akan muncul di sini."
            />
          }
        />
      </Card>
    </div>
  );
}
