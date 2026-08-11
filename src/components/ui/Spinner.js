'use client';
import { cn } from '@/utils/helpers';
import Logo from './Logo';

export function Spinner({ className }) {
  return (
    <svg className={cn('h-5 w-5 animate-spin', className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

/** Loader layar penuh (dipakai saat cek session) */
export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <Logo className="h-12 w-12 animate-float" />
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <Spinner className="h-4 w-4 text-blue-600" />
        Memuat aplikasi...
      </div>
    </div>
  );
}
