'use client';
import { useRef, useState } from 'react';
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/helpers';
import { useToast } from '@/components/ui/Toast';
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_SIZE,
} from '@/utils/constants';
import { attachmentToDataUrl, formatFileSize, isImageAttachment } from '@/utils/attachment';

/**
 * Upload dokumen pendukung (surat izin / surat sakit) dengan drag & drop.
 * Membaca file via FileReader lalu menyimpannya sebagai Base64.
 *
 * @param {object|null} value - attachment { fileName, fileType, fileSize, base64 } atau null
 * @param {function} onChange - (attachment|null) => void
 */
export default function FileUpload({
  value,
  onChange,
  label = 'Upload Bukti Pendukung',
  description = 'Unggah surat izin dari orang tua, surat dokter, atau dokumen pendukung lainnya.',
  className,
}) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState(0);

  const openPicker = () => inputRef.current?.click();

  const handleFile = (file) => {
    if (!file) return;

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const typeOk = ALLOWED_ATTACHMENT_TYPES.includes(file.type);
    const extOk = ALLOWED_ATTACHMENT_EXTENSIONS.includes(ext);
    if (!typeOk && !extOk) {
      toast.error('Format file tidak didukung.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      toast.error('Ukuran file maksimal 5 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (file.size === 0) {
      toast.error('File kosong — pilih file yang valid.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setReading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
      }
    };
    reader.onerror = () => {
      setReading(false);
      toast.error('Gagal membaca file. Silakan coba lagi.');
    };
    reader.onload = () => {
      setReading(false);
      setProgress(100);
      onChange({
        fileName: file.name,
        fileType: file.type || (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
        fileSize: file.size,
        base64: String(reader.result).split(',')[1] || '',
      });
    };
    reader.readAsDataURL(file);

    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const previewUrl = attachmentToDataUrl(value);

  return (
    <div className={cn('w-full', className)}>
      {/* Judul */}
      <div className="flex items-center gap-2">
        <ArrowUpTrayIcon className="h-5 w-5 text-blue-600" />
        <p className="text-sm font-bold text-gray-700">{label}</p>
        <span className="ml-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-500">
          Wajib
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-400">{description}</p>

      {/* Area upload */}
      {!value && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload file"
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openPicker();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            // Jangan flicker saat kursor lewat elemen anak di dalam area
            if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false);
          }}
          onDrop={handleDrop}
          className={cn(
            'mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition',
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50/70 hover:border-blue-400 hover:bg-blue-50/50'
          )}
        >
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl transition',
              dragOver ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            )}
          >
            {reading ? (
              <ArrowUpTrayIcon className="h-7 w-7 animate-bounce" />
            ) : (
              <ArrowUpTrayIcon className="h-7 w-7" />
            )}
          </div>

          {reading ? (
            <div className="mt-4 w-full max-w-xs">
              <p className="text-sm font-semibold text-gray-700">Membaca file…</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs font-medium text-gray-400">{progress}%</p>
            </div>
          ) : (
            <>
              <p className="mt-3 text-sm font-semibold text-gray-800">
                Klik untuk memilih file
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                atau <span className="font-medium text-blue-600">Drag &amp; Drop</span> file di sini
              </p>
            </>
          )}

          <p className="mt-4 text-[11px] font-medium text-gray-400">
            Format: JPG, JPEG, PNG, PDF &nbsp;•&nbsp; Maksimal 5 MB
          </p>
        </div>
      )}

      {/* Preview setelah file dipilih */}
      {value && (
        <div className="mt-3 flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
          {isImageAttachment(value) ? (
            <img
              src={previewUrl}
              alt={value.fileName}
              className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <DocumentIcon className="h-8 w-8" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-gray-800">
              {isImageAttachment(value) ? (
                <PhotoIcon className="h-4 w-4 shrink-0 text-gray-400" />
              ) : (
                <DocumentIcon className="h-4 w-4 shrink-0 text-red-400" />
              )}
              <span className="truncate">{value.fileName}</span>
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {formatFileSize(value.fileSize)} • {value.fileType || 'file'}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                Ganti File
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Hapus lampiran"
            className="self-start rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Input file tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
