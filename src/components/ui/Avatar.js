import { cn, initials } from '@/utils/helpers';

const sizes = {
  xs: 'h-8 w-8 text-xs',
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
  xl: 'h-24 w-24 text-3xl',
};

/**
 * Avatar pengguna — menampilkan foto profil (Base64) bila tersedia,
 * fallback ke inisial nama.
 * @param {object} user - objek user (membutuhkan nama & photo)
 */
export default function Avatar({ user, size = 'md', className, ring = true }) {
  if (user?.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.photo}
        alt={user?.nama || 'Foto profil'}
        className={cn(
          'shrink-0 rounded-full object-cover',
          sizes[size],
          ring && 'ring-2 ring-white',
          className
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white',
        sizes[size],
        ring && 'ring-2 ring-white',
        className
      )}
    >
      {initials(user?.nama)}
    </div>
  );
}
