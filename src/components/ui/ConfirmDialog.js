'use client';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/helpers';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title = 'Yakin ingin melanjutkan?',
  message,
  confirmLabel = 'Ya, lanjutkan',
  cancelLabel = 'Batal',
  danger = true,
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" noHeader>
      <div className="flex flex-col items-center pb-2 text-center">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            danger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          )}
        >
          <ExclamationTriangleIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
        {message && <p className="mt-1.5 max-w-sm text-sm text-gray-500">{message}</p>}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
