import { cn } from '@/utils/helpers';

/**
 * Logo SMK 8 Jakarta Barat — ikon capi lulusan dengan lencana centang.
 * @param {string} variant - "light" untuk latar gelap, "dark" untuk latar terang
 * @param {boolean} compact - ukuran teks lebih kecil (dipakai di sidebar)
 */
export default function Logo({ className, variant = 'dark', withText = true, textClassName, compact = false }) {
  const isLight = variant === 'light';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30',
          className
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 14.5 21 9l-9-5-9 5 9 5.5z" />
          <path d="M12 14.5V21" />
          <path d="M5 11.5v3.2c0 1.6 3.1 3.3 7 3.3s7-1.7 7-3.3v-3.2" />
        </svg>
        <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-white">
            <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
      {withText && (
        <span
          className={cn(
            'font-extrabold leading-tight tracking-tight',
            compact ? 'text-sm' : 'text-lg sm:text-xl',
            isLight ? 'text-white' : 'text-gray-900',
            textClassName
          )}
        >
          SMK 8{' '}
          <span className={isLight ? 'text-blue-400' : 'text-blue-600'}>Jakarta Barat</span>
        </span>
      )}
    </div>
  );
}
