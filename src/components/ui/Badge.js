import { cn } from '@/utils/helpers';

const styles = {
  hadir: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  terlambat: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  izin: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  sakit: 'bg-red-50 text-red-700 ring-red-600/20',
  alpha: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  aktif: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'tidak aktif': 'bg-red-50 text-red-700 ring-red-600/20',
  admin: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  siswa: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
};

const dots = {
  hadir: 'bg-emerald-500',
  terlambat: 'bg-orange-500',
  izin: 'bg-amber-500',
  sakit: 'bg-red-500',
  alpha: 'bg-gray-400',
  aktif: 'bg-emerald-500',
  'tidak aktif': 'bg-red-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
};

export default function Badge({ children, color = 'gray', dot = false, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        styles[color] || styles.gray,
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[color] || 'bg-gray-400')} />}
      {children}
    </span>
  );
}
