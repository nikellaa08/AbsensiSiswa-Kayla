'use client';
import { useRef, useState } from 'react';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { cn, isValidImageType, resizeImage } from '@/utils/helpers';
import Avatar from './Avatar';
import { Spinner } from './Spinner';

/**
 * Upload & ganti foto profil.
 * @param {object} user - user yang sedang login (untuk preview awal)
 * @param {function} onSave - async (dataUrl) => Promise / void, dipanggil setelah resize
 * @param {string} size - ukuran avatar ("lg" / "xl")
 */
export default function PhotoUpload({ user, onSave, size = 'xl', className }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (!isValidImageType(file)) {
      setError('Hanya file JPG, JPEG, atau PNG yang diperbolehkan.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Ukuran file maksimal 4 MB.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await resizeImage(file, 320, 0.85);
      setPreview(dataUrl);
      if (onSave) await onSave(dataUrl);
    } catch (err) {
      setError(err.message || 'Gagal memproses foto.');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        <Avatar user={{ ...user, photo: preview || user?.photo }} size={size} ring={false} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          aria-label="Ubah foto profil"
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Spinner className="h-4 w-4" /> : <CameraIcon className="h-4.5 w-4.5" />}
        </button>
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-60"
      >
        <PhotoIcon className="h-4 w-4" />
        Ubah Foto
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
