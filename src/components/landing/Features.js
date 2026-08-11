import {
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';

const FEATURES = [
  {
    icon: ClipboardDocumentCheckIcon,
    title: 'Absensi Digital',
    desc: 'Gantikan absensi manual dengan pencatatan kehadiran digital yang rapi dan teratur.',
    color: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  {
    icon: ChartBarIcon,
    title: 'Rekap Otomatis',
    desc: 'Rekap hadir, terlambat, izin, sakit, dan alpha dihitung otomatis lengkap dengan grafik.',
    color: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  },
  {
    icon: UserGroupIcon,
    title: 'Monitoring Guru',
    desc: 'Guru memantau kehadiran seluruh siswa per kelas secara cepat dan transparan.',
    color: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Akses di Mana Saja',
    desc: 'Tampilan rapi di desktop, tablet, maupun ponsel. Absen kapan pun, di mana pun.',
    color: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Aman & Terpercaya',
    desc: 'Login berdasarkan peran (guru & siswa) dengan proteksi halaman otomatis.',
    color: 'bg-red-50 text-red-600 ring-red-100',
  },
  {
    icon: SparklesIcon,
    title: 'Mudah Digunakan',
    desc: 'Tampilan sederhana dan modern, tanpa perlu pelatihan khusus untuk menggunakannya.',
    color: 'bg-violet-50 text-violet-600 ring-violet-100',
  },
];

export default function Features() {
  return (
    <section id="keunggulan" className="bg-gray-50 py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Keunggulan
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Kenapa Memilih <span className="gradient-text">Absensi Digital</span> Kami?
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Semua yang dibutuhkan sekolah untuk absensi yang tertib, transparan, dan mudah
            direkap.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <Card hover className="h-full p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
