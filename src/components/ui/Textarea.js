'use client';
import { cn } from '@/utils/helpers';

export default function Textarea({
  label,
  error,
  hint,
  id,
  rows = 3,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={cn(
          'input-base resize-none',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
