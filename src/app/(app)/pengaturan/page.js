'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  KeyIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { exportAllData, importAllData, resetAllData } from '@/lib/storage';
import { validateProfile, validatePasswordChange } from '@/utils/validation';
import { downloadJSON } from '@/utils/helpers';
import { APP_NAME } from '@/utils/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PhotoUpload from '@/components/ui/PhotoUpload';

export default function PengaturanPage() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const fileRef = useRef(null);

  // Edit profil admin
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', email: '' });
  const [editErrors, setEditErrors] = useState({});

  // Ganti password
  const [passOpen, setPassOpen] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passErrors, setPassErrors] = useState({});

  // Reset data
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handlePhotoSave = async (dataUrl) => {
    updateProfile({ photo: dataUrl });
    toast.success('Foto profil berhasil diperbarui.');
  };

  const openEdit = () => {
    setEditForm({ nama: user.nama, email: user.email });
    setEditErrors({});
    setEditOpen(true);
  };

  const handleSaveProfile = () => {
    const errs = validateProfile(editForm, { excludeId: user.id });
    if (Object.keys(errs).length) {
      setEditErrors(errs);
      return;
    }
    updateProfile({ nama: editForm.nama.trim(), email: editForm.email.trim() });
    setEditOpen(false);
    toast.success('Profil berhasil diperbarui.');
  };

  const openPass = () => {
    setPassForm({ current: '', newPass: '', confirm: '' });
    setPassErrors({});
    setPassOpen(true);
  };

  const handleChangePassword = () => {
    const errs = validatePasswordChange(passForm, user.password);
    if (Object.keys(errs).length) {
      setPassErrors(errs);
      return;
    }
    changePassword(passForm.newPass);
    setPassOpen(false);
    toast.success('Password berhasil diganti.');
  };

  const handleExport = () => {
    downloadJSON(`${APP_NAME.toLowerCase()}-data-${new Date().toISOString().slice(0, 10)}.json`, exportAllData());
    toast.success('Data berhasil diexport sebagai file JSON.');
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importAllData(data);
        toast.success('Data berhasil diimport. Halaman akan dimuat ulang...');
        setTimeout(() => window.location.href = '/login', 1200);
      } catch (err) {
        toast.error(err.message || 'Gagal mengimport data.');
      } finally {
        setImporting(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    reader.onerror = () => {
      toast.error('Gagal membaca file.');
      setImporting(false);
    };
    setImporting(true);
    reader.readAsText(file);
  };

  const handleReset = () => {
    setResetting(true);
    setTimeout(() => {
      resetAllData();
      logout();
      setResetting(false);
      setResetOpen(false);
      toast.success('Semua data berhasil direset ke awal.');
      router.push('/login');
    }, 600);
  };

  return (
    <ProtectedPage roles={['admin']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Pengaturan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola profil admin dan data aplikasi.
          </p>
        </div>

        {/* Profil */}
        <Card className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <PhotoUpload user={user} onSave={handlePhotoSave} size="lg" />
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900">Profil Admin</h3>
              <p className="mt-1 text-sm text-gray-500">
                Foto profil dapat diganti dengan foto JPG, JPEG, atau PNG.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <PencilSquareIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Nama</p>
                    <p className="truncate text-sm font-bold text-gray-900">{user?.nama}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <EnvelopeIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="truncate text-sm font-bold text-gray-900">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={openEdit}>
              <PencilSquareIcon className="h-4 w-4" />
              Edit Profil
            </Button>
          </div>
        </Card>

        {/* Keamanan */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
              <KeyIcon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900">Keamanan</h3>
              <p className="mt-1 text-sm text-gray-500">
                Ganti password login akun admin secara berkala.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={openPass}>
              <KeyIcon className="h-4 w-4" />
              Ganti Password
            </Button>
          </div>
        </Card>

        {/* Manajemen data */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <ArrowPathIcon className="h-5 w-5 text-blue-600" />
            Manajemen Data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Export untuk mencadangkan seluruh data, import untuk memulihkan, atau reset untuk
            kembali ke data awal.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Button variant="outline" onClick={handleExport}>
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export Data JSON
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} loading={importing}>
              <ArrowUpTrayIcon className="h-5 w-5" />
              Import Data JSON
            </Button>
            <Button
              variant="danger"
              onClick={() => setResetOpen(true)}
              className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
              Reset Semua Data
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
          <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-400 ring-1 ring-gray-100">
            Catatan: Import akan mengganti seluruh data saat ini dan mengharuskan login ulang.
            Pastikan file JSON berasal dari export {APP_NAME} yang valid.
          </p>
        </Card>
      </div>

      {/* Modal edit profil */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profil Admin"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            id="admin-nama"
            label="Nama"
            value={editForm.nama}
            onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
            error={editErrors.nama}
          />
          <Input
            id="admin-email"
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            error={editErrors.email}
          />
        </div>
      </Modal>

      {/* Modal ganti password */}
      <Modal
        open={passOpen}
        onClose={() => setPassOpen(false)}
        title="Ganti Password"
        footer={
          <>
            <Button variant="outline" onClick={() => setPassOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleChangePassword}>Ganti Password</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            id="admin-pass-lama"
            label="Password Lama"
            type="password"
            value={passForm.current}
            onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
            error={passErrors.current}
          />
          <Input
            id="admin-pass-baru"
            label="Password Baru"
            type="password"
            placeholder="Minimal 6 karakter"
            value={passForm.newPass}
            onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
            error={passErrors.newPass}
          />
          <Input
            id="admin-pass-konfirmasi"
            label="Konfirmasi Password Baru"
            type="password"
            value={passForm.confirm}
            onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
            error={passErrors.confirm}
          />
        </div>
      </Modal>

      {/* Konfirmasi reset */}
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset semua data?"
        message="Seluruh data (siswa, kelas, absensi, pengaturan) akan dihapus dan dikembalikan ke data awal. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, reset"
        loading={resetting}
        onConfirm={handleReset}
      />
    </ProtectedPage>
  );
}
