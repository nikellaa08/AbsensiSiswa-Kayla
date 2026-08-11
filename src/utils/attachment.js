// Helper lampiran absensi (surat izin / surat sakit)
// Attachment disimpan di Local Storage sebagai Base64:
// { fileName, fileType, fileSize, base64 }

/** Data URL lengkap dari attachment base64 (untuk preview gambar) */
export function attachmentToDataUrl(att) {
  if (!att?.base64) return null;
  return `data:${att.fileType || 'application/octet-stream'};base64,${att.base64}`;
}

/** Apakah attachment berupa gambar (jpg/jpeg/png) */
export function isImageAttachment(att) {
  return !!att && /^image\//.test(att.fileType || '');
}

/** Konversi base64 -> Blob agar bisa diunduh / dibuka di tab baru */
function base64ToBlob(att) {
  const binary = atob(att.base64 || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: att.fileType || 'application/octet-stream' });
}

/** Unduh lampiran sebagai file asli (Blob URL dibuat lalu di-revoke) */
export function downloadAttachment(att) {
  if (!att?.base64) return;
  const blob = base64ToBlob(att);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = att.fileName || 'lampiran';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Buka PDF di tab baru (Blob URL di-revoke setelah 1 menit agar tidak bocor) */
export function openAttachment(att) {
  if (!att?.base64) return;
  const blob = base64ToBlob(att);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/** Format ukuran file ramah baca: 512 B / 4.2 KB / 1.05 MB */
export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
