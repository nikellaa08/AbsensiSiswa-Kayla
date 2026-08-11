'use client';
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/helpers';
import Modal from './Modal';
import Button from './Button';
import {
  attachmentToDataUrl,
  downloadAttachment,
  formatFileSize,
  isImageAttachment,
  openAttachment,
} from '@/utils/attachment';

/**
 * Tombol aksi lampiran (Lihat / Download).
 * Gambar -> preview lewat modal (onPreview). PDF -> dibuka di tab baru.
 */
export function AttachmentActions({ attachment, onPreview, className }) {
  if (!attachment) return <span className="text-xs text-gray-300">—</span>;
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() =>
          isImageAttachment(attachment) ? onPreview?.(attachment) : openAttachment(attachment)
        }
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        title={isImageAttachment(attachment) ? 'Lihat pratinjau' : 'Buka di tab baru'}
      >
        <EyeIcon className="h-4 w-4" />
        Lihat
      </button>
      <button
        type="button"
        onClick={() => downloadAttachment(attachment)}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download
      </button>
    </div>
  );
}

/**
 * Modal pratinjau lampiran (gambar). Untuk PDF gunakan openAttachment()
 * agar dibuka di tab baru, atau modal ini menampilkan info file.
 */
export default function AttachmentPreviewModal({ attachment, onClose }) {
  if (!attachment) return null;
  const dataUrl = attachmentToDataUrl(attachment);
  const isImage = isImageAttachment(attachment);

  return (
    <Modal
      open
      onClose={onClose}
      title="Pratinjau Lampiran"
      description={attachment.fileName}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={() => downloadAttachment(attachment)}>
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </Button>
        </>
      }
    >
      {isImage ? (
        <img
          src={dataUrl}
          alt={attachment.fileName}
          className="mx-auto max-h-[60vh] w-auto rounded-xl border border-gray-100 object-contain shadow-sm"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <DocumentIcon className="h-10 w-10" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{attachment.fileName}</p>
            <p className="mt-1 text-xs text-gray-400">
              {formatFileSize(attachment.fileSize)} • {attachment.fileType || 'file'}
            </p>
          </div>
          <Button variant="outline" onClick={() => openAttachment(attachment)}>
            Buka di Tab Baru
          </Button>
        </div>
      )}
    </Modal>
  );
}
