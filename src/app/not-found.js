import Link from 'next/link';
import { buttonClasses } from '@/components/ui/buttonClasses';
import Logo from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Logo className="h-12 w-12" />
      <p className="mt-8 text-7xl font-extrabold tracking-tight text-blue-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <Link href="/" className={`${buttonClasses('primary', 'lg')} mt-8`}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
