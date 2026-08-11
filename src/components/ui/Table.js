'use client';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/helpers';
import EmptyState from './EmptyState';

/**
 * Kolom: { key, header, render?, className?, onClick?, sortDir? }
 */
export default function Table({ columns, data, rowKey = 'id', empty, className }) {
  if (!data?.length) {
    return (
      empty || (
        <EmptyState title="Tidak ada data" description="Belum ada data untuk ditampilkan." />
      )
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full min-w-[640px] text-left text-sm', className)}>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            {columns.map((c, i) => (
              <th
                key={c.key || i}
                onClick={c.onClick}
                className={cn(
                  'px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500',
                  c.onClick && 'cursor-pointer select-none transition hover:text-blue-600',
                  c.className
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {c.header}
                  {c.sortDir &&
                    (c.sortDir === 'asc' ? (
                      <ArrowUpIcon className="h-3.5 w-3.5 text-blue-600" />
                    ) : (
                      <ArrowDownIcon className="h-3.5 w-3.5 text-blue-600" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row[rowKey] || JSON.stringify(row)} className="transition hover:bg-blue-50/40">
              {columns.map((c, i) => (
                <td key={c.key || i} className={cn('px-4 py-3.5 text-gray-700', c.className)}>
                  {c.render ? c.render(row) : row[c.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
