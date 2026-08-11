'use client';
import { useMemo, useState } from 'react';
import { CalendarDaysIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import {
  getActiveStudents,
  getClasses,
  getAttendanceByDate,
  getStudentAttendanceOn,
  getClassName,
  getClassById,
} from '@/lib/storage';
import { todayStr, formatDateID, formatTime12 } from '@/utils/date';
import { STATUS_META, STATUS } from '@/utils/constants';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  HeartIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import StatCard from '@/components/ui/StatCard';
import DoughnutChart from '@/components/charts/DoughnutChart';
import BarChart from '@/components/charts/BarChart';
import EmptyState from '@/components/ui/EmptyState';
import Table from '@/components/ui/Table';

export default function RekapPage() {
  const [tanggal, setTanggal] = useState(todayStr());
  const [filterKelas, setFilterKelas] = useState('all');

  const classes = getClasses();

  const data = useMemo(() => {
    const attendance = getAttendanceByDate(tanggal);
    let students = getActiveStudents();
    if (filterKelas !== 'all') {
      students = students.filter((s) => s.kelasId === filterKelas);
    }

    const rows = students.map((s) => ({
      siswa: s,
      record: getStudentAttendanceOn(s.id, tanggal),
    }));

    const counts = {
      [STATUS.HADIR]: 0,
      [STATUS.TERLAMBAT]: 0,
      [STATUS.IZIN]: 0,
      [STATUS.SAKIT]: 0,
      [STATUS.ALPHA]: 0,
    };
    rows.forEach((r) => {
      const st = r.record?.status || STATUS.ALPHA;
      if (counts[st] !== undefined) counts[st] += 1;
    });

    // Perbandingan per kelas pada tanggal terpilih
    const perClass = classes.map((c) => {
      const inClass = getActiveStudents().filter((s) => s.kelasId === c.id);
      return {
        nama: c.nama,
        hadir: inClass.filter((s) => getStudentAttendanceOn(s.id, tanggal)?.status === STATUS.HADIR).length,
        terlambat: inClass.filter((s) => getStudentAttendanceOn(s.id, tanggal)?.status === STATUS.TERLAMBAT).length,
        izin: inClass.filter((s) => getStudentAttendanceOn(s.id, tanggal)?.status === STATUS.IZIN).length,
        sakit: inClass.filter((s) => getStudentAttendanceOn(s.id, tanggal)?.status === STATUS.SAKIT).length,
        alpha: inClass.filter((s) => !getStudentAttendanceOn(s.id, tanggal)).length,
      };
    });

    return { rows, counts, perClass, total: rows.length };
  }, [tanggal, filterKelas, classes]);

  const summary = [
    { label: 'Hadir', value: data.counts.hadir, accent: 'green', icon: CheckCircleIcon, sub: 'siswa hadir' },
    { label: 'Terlambat', value: data.counts.terlambat, accent: 'amber', icon: ClockIcon, sub: 'setelah 07:00' },
    { label: 'Izin', value: data.counts.izin, accent: 'amber', icon: DocumentCheckIcon, sub: 'siswa izin' },
    { label: 'Sakit', value: data.counts.sakit, accent: 'red', icon: HeartIcon, sub: 'siswa sakit' },
    { label: 'Alpha', value: data.counts.alpha, accent: 'gray', icon: XCircleIcon, sub: 'tidak absen' },
  ];

  return (
    <ProtectedPage roles={['admin']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Rekap Absensi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Hitung otomatis kehadiran siswa berdasarkan tanggal dan kelas.
          </p>
        </div>

        {/* Filter */}
        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Tanggal</span>
            <div className="relative">
              <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={tanggal}
                max={todayStr()}
                onChange={(e) => setTanggal(e.target.value)}
                className="input-base pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:max-w-xs">
            <Select
              label="Kelas"
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </Select>
          </div>
          <p className="text-sm text-gray-500 sm:ml-auto sm:pb-2">
            {formatDateID(tanggal)}
          </p>
        </Card>

        {/* Ringkasan */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {summary.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 60} />
          ))}
        </div>

        {/* Grafik */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900">Distribusi Status</h3>
            <p className="text-xs text-gray-400">{formatDateID(tanggal)}</p>
            <div className="mt-4">
              <DoughnutChart
                labels={['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Alpha']}
                values={[
                  data.counts.hadir,
                  data.counts.terlambat,
                  data.counts.izin,
                  data.counts.sakit,
                  data.counts.alpha,
                ]}
                colors={['#10b981', '#f97316', '#f59e0b', '#ef4444', '#9ca3af']}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900">Per Kelas</h3>
            <p className="text-xs text-gray-400">Perbandingan kehadiran antar kelas</p>
            <div className="mt-4">
              <BarChart
                labels={data.perClass.map((c) => c.nama)}
                datasets={[
                  { label: 'Hadir', data: data.perClass.map((c) => c.hadir), backgroundColor: '#10b981' },
                  { label: 'Terlambat', data: data.perClass.map((c) => c.terlambat), backgroundColor: '#f97316' },
                  { label: 'Izin', data: data.perClass.map((c) => c.izin), backgroundColor: '#f59e0b' },
                  { label: 'Sakit', data: data.perClass.map((c) => c.sakit), backgroundColor: '#ef4444' },
                  { label: 'Alpha', data: data.perClass.map((c) => c.alpha), backgroundColor: '#9ca3af' },
                ]}
              />
            </div>
          </Card>
        </div>

        {/* Tabel detail */}
        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="text-base font-bold text-gray-900">Detail Siswa</h3>
            <p className="text-xs text-gray-400">
              {filterKelas === 'all' ? 'Semua kelas' : getClassName(filterKelas)} • {data.total} siswa
            </p>
          </div>
          <Table
            columns={[
              { key: 'nama', header: 'Nama', render: (r) => <span className="font-semibold text-gray-900">{r.siswa.nama}</span> },
              { key: 'nis', header: 'NIS', className: 'whitespace-nowrap', render: (r) => r.siswa.nis },
              { key: 'kelas', header: 'Kelas', render: (r) => <Badge color="blue">{getClassName(r.siswa.kelasId)}</Badge> },
              {
                key: 'status',
                header: 'Status',
                render: (r) =>
                  r.record ? (
                    <div className="flex items-center gap-2">
                      <Badge color={STATUS_META[r.record.status]?.color} dot>
                        {STATUS_META[r.record.status]?.label}
                      </Badge>
                      <span className="text-xs text-gray-400">{formatTime12(r.record.jam)}</span>
                    </div>
                  ) : (
                    <Badge color="alpha" dot>
                      Alpha
                    </Badge>
                  ),
              },
            ]}
            data={data.rows}
            empty={
              <EmptyState
                icon={DocumentChartBarIcon}
                title="Tidak ada siswa"
                description="Tidak ada siswa aktif pada filter kelas yang dipilih."
              />
            }
          />
        </Card>
      </div>
    </ProtectedPage>
  );
}
