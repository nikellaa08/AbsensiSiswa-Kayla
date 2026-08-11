'use client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/helpers';

export default function Select({
  label,
  error,
  id,
  className,
  children,
  placeholder = 'Pilih...',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            'input-base appearance-none pr-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        >
          {placeholder !== null && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
