'use client';
import { useState } from 'react';
import { PencilSquareIcon, KeyIcon, EnvelopeIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { getClassName } from '@/lib/storage';
import { validateProfile, validatePasswordChange } from '@/utils/validation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import PhotoUpload from '@/components/ui/PhotoUpload';

export default function ProfilPage() {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();

  // Edit profil
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', email: '' });
  const [editErrors, setEditErrors] = useState({});

  // Ganti password
  const [passOpen, setPassOpen] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passErrors, setPassErrors] = useState({});

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

  return (
    <ProtectedPage roles={['siswa']}>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Kartu profil */}
        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
              <PhotoUpload user={user} onSave={handlePhotoSave} size="xl" />
              <div className="flex-1 text-center sm:pb-1 sm:text-left">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  {user?.nama}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge color="blue">{getClassName(user?.kelasId)}</Badge>
                  <Badge color="aktif" dot>
                    {user?.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 ring-1 ring-gray-100">
                <IdentificationIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-400">NIS</p>
                  <p className="text-sm font-bold text-gray-900">{user?.nis}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 ring-1 ring-gray-100">
                <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="truncate text-sm font-bold text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={openEdit}>
                <PencilSquareIcon className="h-5 w-5" />
                Edit Profil
              </Button>
              <Button variant="outline" onClick={openPass}>
                <KeyIcon className="h-5 w-5" />
                Ganti Password
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal edit profil */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profil"
        description="Perbarui nama dan email kamu."
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
            id="profil-nama"
            label="Nama Lengkap"
            value={editForm.nama}
            onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
            error={editErrors.nama}
          />
          <Input
            id="profil-email"
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
        description="Masukkan password lama dan password baru."
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
            id="pass-lama"
            label="Password Lama"
            type="password"
            value={passForm.current}
            onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
            error={passErrors.current}
          />
          <Input
            id="pass-baru"
            label="Password Baru"
            type="password"
            placeholder="Minimal 6 karakter"
            value={passForm.newPass}
            onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
            error={passErrors.newPass}
          />
          <Input
            id="pass-konfirmasi"
            label="Konfirmasi Password Baru"
            type="password"
            value={passForm.confirm}
            onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
            error={passErrors.confirm}
          />
        </div>
      </Modal>
    </ProtectedPage>
  );
}
