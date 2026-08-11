import { InboxIcon } from '@heroicons/react/24/outline';

export default function EmptyState({
  icon: Icon = InboxIcon,
  title = 'Tidak ada data',
  description = 'Belum ada data untuk ditampilkan di sini.',
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="mt-2 text-sm font-bold text-gray-800">{title}</h3>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
