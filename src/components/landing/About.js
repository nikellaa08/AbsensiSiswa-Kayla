import { CheckIcon, AcademicCapIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Reveal from '@/components/ui/Reveal';

const POINTS = [
  'Absensi digital yang menggantikan buku absensi manual.',
  'Guru dapat memantau kehadiran siswa secara real-time.',
  'Rekap kehadiran otomatis untuk setiap kelas dan tanggal.',
  'Orang tua dapat memantau kedisiplinan putra-putrinya.',
];

const PROGRAMS = ['Rekayasa Perangkat Lunak', 'Teknik Komputer & Jaringan', 'Multimedia'];

export default function About() {
  return (
    <section id="tentang" className="bg-white py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white shadow-card-hover">
              <div className="bg-grid absolute inset-0 rounded-3xl" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                  <BuildingOfficeIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold leading-snug">
                  Berprestasi, Berkarakter, dan Siap Menghadapi Dunia Kerja.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">
                  Sejak berdiri, SMK 8 Jakarta Barat terus berkomitmen mencetak lulusan yang
                  kompeten di bidang teknologi informasi dan komunikasi.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {PROGRAMS.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/25"
                    >
                      <AcademicCapIcon className="h-3.5 w-3.5" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 -z-10 hidden h-full w-full rounded-3xl border-2 border-dashed border-blue-200 sm:block" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Tentang Sekolah
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Profil <span className="gradient-text">SMK 8 Jakarta Barat</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            SMK 8 Jakarta Barat adalah sekolah menengah kejuruan yang fokus pada bidang teknologi
            informasi. Kami menghadirkan sistem absensi digital terintegrasi untuk mendukung
            kedisiplinan siswa — memudahkan guru memonitor kehadiran secara lebih mudah, cepat,
            dan transparan.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
