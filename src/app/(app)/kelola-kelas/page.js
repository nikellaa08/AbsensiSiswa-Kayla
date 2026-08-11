'use client';
import { useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useToast } from '@/components/ui/Toast';
import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
  getStudents,
} from '@/lib/storage';
import { validateClassName } from '@/utils/validation';
import { cn } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';

export default function KelolaKelasPage() {
  const toast = useToast();
  const [classes, setClasses] = useState(() => getClasses());
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: '', nama: '' });
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const studentCounts = useMemo(() => {
    const counts = {};
    getStudents().forEach((s) => {
      counts[s.kelasId] = (counts[s.kelasId] || 0) + 1;
    });
    return counts;
  }, [classes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => c.nama.toLowerCase().includes(q));
  }, [classes, search]);

  const openAdd = () => {
    setEditing(false);
    setForm({ id: '', nama: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cls) => {
    setEditing(true);
    setForm({ id: cls.id, nama: cls.nama });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    const errs = validateClassName(form.nama, { excludeId: form.id });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (editing) {
      updateClass(form.id, { nama: form.nama.trim() });
      toast.success('Kelas berhasil diperbarui.');
    } else {
      addClass({ nama: form.nama.trim() });
      toast.success('Kelas baru berhasil ditambahkan.');
    }
    setModalOpen(false);
    setClasses(getClasses());
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const studentInClass = getStudents().filter((s) => s.kelasId === deleteTarget.id).length;
    deleteClass(deleteTarget.id);
    setClasses(getClasses());
    setDeleteTarget(null);
    toast.success(
      studentInClass > 0
        ? `Kelas dihapus. ${studentInClass} siswa kini tidak memiliki kelas.`
        : 'Kelas berhasil dihapus.'
    );
  };

  return (
    <ProtectedPage roles={['admin']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Kelola Kelas</h2>
            <p className="mt-1 text-sm text-gray-500">
              Tambah, ubah, atau hapus kelas untuk pengelompokan siswa.
            </p>
          </div>
          <Button onClick={openAdd}>
            <PlusIcon className="h-5 w-5" />
            Tambah Kelas
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari nama kelas..."
            className="max-w-xs"
          />
          <p className="text-sm text-gray-500">
            {filtered.length} kelas ditemukan
          </p>
        </div>

        <Card className="overflow-hidden p-6">
          {filtered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cls) => (
                <div
                  key={cls.id}
                  className="group rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-md shadow-blue-600/25">
                      {cls.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(cls)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${cls.nama}`}
                      >
                        <PencilSquareIcon className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cls)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Hapus ${cls.nama}`}
                      >
                        <TrashIcon className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-gray-900">{cls.nama}</h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {studentCounts[cls.id] || 0} siswa terdaftar
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Kelas tidak ditemukan"
              description={search ? 'Coba ubah kata kunci pencarian.' : 'Belum ada kelas. Tambahkan kelas pertama Anda.'}
            >
              {!search && (
                <Button onClick={openAdd}>
                  <PlusIcon className="h-5 w-5" />
                  Tambah Kelas
                </Button>
              )}
            </EmptyState>
          )}
        </Card>
      </div>

      {/* Modal tambah / edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Kelas' : 'Tambah Kelas'}
        description={editing ? 'Perbarui nama kelas.' : 'Masukkan nama kelas baru.'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>{editing ? 'Simpan Perubahan' : 'Tambah Kelas'}</Button>
          </>
        }
      >
        <Input
          id="nama-kelas"
          label="Nama Kelas"
          placeholder="Contoh: X RPL 1"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          error={errors.nama}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <p className={cn('mt-2 text-xs', errors.nama ? 'text-red-500' : 'text-gray-400')}>
          Gunakan format standar seperti &quot;X RPL 1&quot;, &quot;XI TKJ 2&quot;, dll.
        </p>
      </Modal>

      {/* Konfirmasi hapus */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus kelas ini?"
        message={`Kelas "${deleteTarget?.nama}" akan dihapus. Data siswa di kelas tersebut tetap ada tetapi tidak memiliki kelas.`}
        confirmLabel="Ya, hapus"
        onConfirm={handleDelete}
      />
    </ProtectedPage>
  );
}
