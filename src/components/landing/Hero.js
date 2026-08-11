import Link from 'next/link';
import {
  ArrowRightIcon,
  UsersIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { buttonClasses } from '@/components/ui/buttonClasses';
import Reveal from '@/components/ui/Reveal';

/* Ilustrasi gedung sekolah (SVG) */
function SchoolBuilding() {
  return (
    <svg viewBox="0 0 320 200" fill="none" className="h-full w-full">
      {/* Langit */}
      <rect width="320" height="200" rx="16" fill="url(#sky)" />
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dbeafe" />
          <stop offset="1" stopColor="#eff6ff" />
        </linearGradient>
      </defs>
      {/* Awan */}
      <ellipse cx="70" cy="40" rx="34" ry="12" fill="white" opacity="0.8" />
      <ellipse cx="250" cy="60" rx="40" ry="13" fill="white" opacity="0.8" />
      {/* Matahari */}
      <circle cx="270" cy="36" r="18" fill="#fbbf24" opacity="0.9" />
      {/* Tanah */}
      <rect y="168" width="320" height="32" fill="#86efac" />
      {/* Gedung utama */}
      <rect x="70" y="70" width="150" height="98" rx="4" fill="#f8fafc" stroke="#93c5fd" strokeWidth="2" />
      {/* Atap */}
      <path d="M56 74 145 30 234 74Z" fill="#2563eb" />
      <rect x="135" y="24" width="20" height="14" rx="3" fill="#1e3a8a" />
      {/* Tiang bendera */}
      <rect x="246" y="52" width="4" height="116" rx="2" fill="#94a3b8" />
      <rect x="250" y="52" width="42" height="26" rx="2" fill="#3b82f6" />
      <path d="M292 52v26l10-5-10-5Z" fill="#ef4444" />
      {/* Papan nama */}
      <rect x="84" y="140" width="122" height="20" rx="4" fill="#1e3a8a" />
      <text x="145" y="155" textAnchor="middle" fontSize="11" fontWeight="800" fill="white" fontFamily="Inter, sans-serif">
        SMK 8 JAKARTA BARAT
      </text>
      {/* Pintu */}
      <rect x="128" y="118" width="34" height="50" rx="3" fill="#bfdbfe" />
      <circle cx="154" cy="146" r="2.5" fill="#2563eb" />
      {/* Jendela */}
      {[90, 115, 162, 187].map((x) => (
        <rect key={x} x={x} y="86" width="22" height="20" rx="3" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
      ))}
      {/* Gedung kanan */}
      <rect x="220" y="92" width="72" height="76" rx="4" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
      <path d="M210 96 256 64l46 32Z" fill="#3b82f6" />
      {[232, 254].map((x) => (
        <rect key={x} x={x} y="104" width="20" height="18" rx="3" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
      ))}
      <rect x="228" y="146" width="56" height="22" rx="3" fill="#bfdbfe" />
      {/* Pohon */}
      <rect x="36" y="136" width="8" height="32" rx="3" fill="#92400e" />
      <circle cx="40" cy="126" r="18" fill="#4ade80" />
      <circle cx="56" cy="138" r="14" fill="#22c55e" />
      <rect x="286" y="140" width="8" height="28" rx="3" fill="#92400e" />
      <circle cx="290" cy="132" r="16" fill="#4ade80" />
    </svg>
  );
}

const PROFILE_STATS = [
  { icon: UsersIcon, label: 'Jumlah Guru', value: '42', color: 'bg-blue-50 text-blue-600 ring-blue-100' },
  { icon: AcademicCapIcon, label: 'Jumlah Siswa', value: '1.280', color: 'bg-indigo-50 text-indigo-600 ring-indigo-100' },
  { icon: TrophyIcon, label: 'Prestasi', value: '50+', color: 'bg-amber-50 text-amber-600 ring-amber-100' },
  { icon: ClipboardDocumentCheckIcon, label: 'Jumlah Kelas', value: '24', color: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
];

const EKSTRAKURIKULER = ['Pramuka', 'Paskibra', 'RPL', 'TKJ', 'Multimedia', 'Futsal'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Dekorasi latar */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-32 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
        {/* Teks */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            Website Resmi SMK 8 Jakarta Barat
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-[3.2rem]">
            SMK 8 <span className="gradient-text">Jakarta Barat</span>
            <span className="mt-3 block text-2xl font-bold leading-snug text-gray-700 sm:text-3xl lg:text-[2rem]">
              Mewujudkan Sekolah Modern, Disiplin, Berprestasi, dan Berkarakter.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
            SMK 8 Jakarta Barat menghadirkan sistem absensi digital untuk membantu guru
            memonitor kehadiran siswa secara lebih mudah, cepat, dan transparan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/login" className={buttonClasses('primary', 'lg')}>
              Masuk Sekarang
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a href="#tentang" className={buttonClasses('outline', 'lg')}>
              Lihat Profil Sekolah
            </a>
          </div>
        </Reveal>

        {/* Kartu profil sekolah */}
        <Reveal delay={150}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-card-hover ring-1 ring-gray-100 animate-float">
              {/* Ilustrasi gedung */}
              <div className="relative h-48 bg-gradient-to-b from-blue-50 to-white sm:h-52">
                <SchoolBuilding />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 shadow-sm ring-1 ring-blue-100 backdrop-blur">
                  NPSN 20103456
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-gray-900">Profil Sekolah</p>
                    <p className="text-xs text-gray-400">SMK 8 Jakarta Barat</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    Terakreditasi A
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {PROFILE_STATS.map((s) => (
                    <div key={s.label} className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${s.color}`}>
                        <s.icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="mt-2 text-xl font-extrabold text-gray-900">{s.value}</p>
                      <p className="text-[11px] font-medium text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Absensi hari ini */}
                <div className="mt-4 rounded-xl bg-slate-900 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">Absensi Hari Ini</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <CheckCircleIcon className="h-3 w-3" />
                      96% Hadir
                    </span>
                  </div>
                  <div className="mt-3 flex h-14 items-end gap-1.5">
                    {[92, 88, 95, 90, 97, 93, 96].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-all hover:from-indigo-600 hover:to-indigo-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Ekstrakurikuler */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500">Ekstrakurikuler Unggulan</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {EKSTRAKURIKULER.map((e) => (
                      <span
                        key={e}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
