import Link from 'next/link';
import { EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/ui/Logo';
import { SCHOOL_ADDRESS, SCHOOL_EMAIL } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            SMK 8 Jakarta Barat — sekolah menengah kejuruan yang menghadirkan sistem absensi
            digital untuk mendukung kedisiplinan dan prestasi siswa.
          </p>
          <div className="mt-6 flex gap-3">
            {['Keunggulan', 'Cara Kerja', 'Login'].map((l) => (
              <Link
                key={l}
                href={l === 'Login' ? '/login' : `#${l === 'Keunggulan' ? 'keunggulan' : 'cara-kerja'}`}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-blue-500/40 hover:text-white"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navigasi</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="transition hover:text-white">Beranda</Link></li>
            <li><Link href="/login" className="transition hover:text-white">Login</Link></li>
            <li><a href="#tentang" className="transition hover:text-white">Tentang Sekolah</a></li>
            <li><a href="#cara-kerja" className="transition hover:text-white">Cara Kerja</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Kontak</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              {SCHOOL_EMAIL}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              {SCHOOL_ADDRESS}
            </li>
            <li className="flex items-center gap-2.5">
              <ClockIcon className="h-4 w-4 shrink-0 text-blue-400" />
              Senin – Sabtu, 07.00 – 16.00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} SMK 8 Jakarta Barat. Semua hak dilindungi.</p>
          <p>Website Resmi SMK 8 Jakarta Barat</p>
        </div>
      </div>
    </footer>
  );
}
