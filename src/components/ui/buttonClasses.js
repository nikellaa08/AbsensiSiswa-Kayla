// Modul murni (bukan 'use client') — aman dipanggil dari server maupun client
import { cn } from '@/utils/helpers';

export const buttonVariants = {
  primary: 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 focus-visible:ring-blue-500/30 active:scale-[.98]',
  secondary: 'bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-500/30 active:scale-[.98]',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus-visible:ring-gray-300 active:scale-[.98]',
  danger: 'bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700 focus-visible:ring-red-500/30 active:scale-[.98]',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300',
  white: 'bg-white text-blue-700 shadow-sm hover:bg-blue-50 focus-visible:ring-white/40 active:scale-[.98]',
};

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

/** Utility class untuk membuat tombol dari <Link> atau <button> */
export function buttonClasses(variant = 'primary', size = 'md', extra = '') {
  return cn('btn-base', buttonVariants[variant], buttonSizes[size], extra);
}
