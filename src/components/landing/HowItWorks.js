import Link from 'next/link';
import {
  KeyIcon,
  CursorArrowRaysIcon,
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { buttonClasses } from '@/components/ui/buttonClasses';
import Reveal from '@/components/ui/Reveal';

const STEPS = [
  {
    icon: KeyIcon,
    step: '01',
    title: 'Login dengan Akun',
    desc: 'Guru login sebagai Admin, siswa login dengan akun sekolah masing-masing.',
  },
  {
    icon: CursorArrowRaysIcon,
    step: '02',
    title: 'Absen Sekarang',
    desc: 'Siswa cukup menekan satu tombol lalu memilih status: Hadir, Izin, atau Sakit.',
  },
  {
    icon: ClipboardDocumentCheckIcon,
    step: '03',
    title: 'Data Tercatat Otomatis',
    desc: 'Tanggal & jam diambil otomatis dan dicatat rapi. Cukup sekali dalam sehari.',
  },
  {
    icon: ChartPieIcon,
    step: '04',
    title: 'Guru Pantau & Rekap',
    desc: 'Guru melihat rekap kehadiran per tanggal & kelas lengkap dengan grafik.',
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Cara Kerja
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            4 Langkah <span className="gradient-text">Mudah</span>
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Dari login sampai rekap — semuanya berjalan otomatis dan tanpa ribet.
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 100}>
              <div className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-full top-8 hidden w-full -translate-x-6 lg:block">
                    <ArrowRightIcon className="h-5 w-5 text-blue-200" />
                  </div>
                )}
                <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition group-hover:scale-110">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="text-4xl font-extrabold text-gray-100 transition group-hover:text-blue-100">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link href="/login" className={buttonClasses('primary', 'lg')}>
            Masuk Sekarang
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
