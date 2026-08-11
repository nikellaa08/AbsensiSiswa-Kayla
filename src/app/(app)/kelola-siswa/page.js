'use client';
import { useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useToast } from '@/components/ui/Toast';
import {
  getStudents,
  addUser,
  updateUser,
  deleteUser,
  getClasses,
  getClassName,
} from '@/lib/storage';
import { validateStudent } from '@/utils/validation';
import { PAGE_SIZE_STUDENTS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import Table from '@/components/ui/Table';

const EMPTY_FORM = {
  id: '',
  nama: '',
  nis: '',
  email: '',
  password: '',
  kelasId: '',
  status: 'aktif',
};

export default function KelolaSiswaPage() {
  const toast = useToast();
  const [students, setStudents] = useState(() => getStudents());
  const classes = getClasses();

  // Filter, pencarian, sorting
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [sortKey, setSortKey] = useState('nama');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = students;
    if (filterKelas) rows = rows.filter((s) => s.kelasId === filterKelas);
    if (q) {
      rows = rows.filter(
        (s) =>
          s.nama.toLowerCase().includes(q) ||
          s.nis.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const av = (a[sortKey] || '').toString().toLowerCase();
      const bv = (b[sortKey] || '').toString().toLowerCase();
      return av.localeCompare(bv) * dir;
    });
    return rows;
  }, [students, search, filterKelas, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE_STUDENTS));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE_STUDENTS, safePage * PAGE_SIZE_STUDENTS);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const openAdd = () => {
    setEditing(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(true);
    setForm({ ...s, password: '' });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    const errs = validateStudent(form, { isEdit: editing });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload = {
      nama: form.nama.trim(),
      nis: form.nis.trim(),
      email: form.email.trim(),
      kelasId: form.kelasId,
      status: form.status,
      role: 'siswa',
    };
    if (editing) {
      if (form.password) payload.password = form.password;
      updateUser(form.id, payload);
      toast.success('Data siswa berhasil diperbarui.');
    } else {
      addUser({ ...payload, password: form.password });
      toast.success('Siswa baru berhasil ditambahkan.');
    }
    setModalOpen(false);
    setStudents(getStudents());
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    setStudents(getStudents());
    setDeleteTarget(null);
    toast.success('Siswa berhasil dihapus.');
  };

  return (
    <ProtectedPage roles={['admin']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Kelola Siswa</h2>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data siswa: tambah, ubah, aktifkan/nonaktifkan, dan hapus.
            </p>
          </div>
          <Button onClick={openAdd}>
            <PlusIcon className="h-5 w-5" />
            Tambah Siswa
          </Button>
        </div>

        {/* Toolbar */}
        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari nama, NIS, atau email..."
          />
          <Select
            value={filterKelas}
            onChange={(e) => {
              setFilterKelas(e.target.value);
              setPage(1);
            }}
            className="sm:w-48"
            placeholder="Semua Kelas"
            aria-label="Filter kelas"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </Select>
          <p className="text-sm text-gray-500 sm:ml-auto">
            {filtered.length} siswa ditemukan
          </p>
        </Card>

        {/* Tabel */}
        <Card className="overflow-hidden">
          <Table
            columns={[
              {
                key: 'nama',
                header: 'Nama',
                onClick: () => toggleSort('nama'),
                sortDir: sortKey === 'nama' ? sortDir : null,
                render: (r) => (
                  <div className="flex items-center gap-3">
                    <Avatar user={r} size="sm" ring={false} />
                    <span className="font-semibold text-gray-900">{r.nama}</span>
                  </div>
                ),
              },
              {
                key: 'nis',
                header: 'NIS',
                onClick: () => toggleSort('nis'),
                sortDir: sortKey === 'nis' ? sortDir : null,
                className: 'whitespace-nowrap',
              },
              {
                key: 'email',
                header: 'Email',
                onClick: () => toggleSort('email'),
                sortDir: sortKey === 'email' ? sortDir : null,
                className: 'whitespace-nowrap',
              },
              {
                key: 'kelas',
                header: 'Kelas',
                render: (r) => <Badge color="blue">{getClassName(r.kelasId)}</Badge>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Badge color={r.status} dot>
                    {r.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                ),
              },
              {
                key: 'aksi',
                header: 'Aksi',
                className: 'text-right',
                render: (r) => (
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(r)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                      aria-label={`Edit ${r.nama}`}
                    >
                      <PencilSquareIcon className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Hapus ${r.nama}`}
                    >
                      <TrashIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={paged}
            empty={
              <EmptyState
                icon={UserGroupIcon}
                title="Siswa tidak ditemukan"
                description={
                  search || filterKelas
                    ? 'Coba ubah kata kunci atau filter kelas.'
                    : 'Belum ada siswa. Tambahkan siswa pertama Anda.'
                }
              >
                {!search && !filterKelas && (
                  <Button onClick={openAdd}>
                    <PlusIcon className="h-5 w-5" />
                    Tambah Siswa
                  </Button>
                )}
              </EmptyState>
            }
          />
          <div className="border-t border-gray-100 px-4 py-4">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE_STUDENTS}
            />
          </div>
        </Card>
      </div>

      {/* Modal tambah / edit siswa */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={editing ? 'Edit Siswa' : 'Tambah Siswa'}
        description={editing ? 'Perbarui data siswa di bawah ini.' : 'Isi data siswa baru.'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>{editing ? 'Simpan Perubahan' : 'Tambah Siswa'}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="siswa-nama"
            label="Nama Lengkap"
            placeholder="Contoh: Andi Saputra"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            error={errors.nama}
          />
          <Input
            id="siswa-nis"
            label="NIS"
            placeholder="Contoh: 2023001"
            value={form.nis}
            onChange={(e) => setForm({ ...form, nis: e.target.value })}
            error={errors.nis}
          />
          <Input
            id="siswa-email"
            label="Email"
            type="email"
            placeholder="nama@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            id="siswa-password"
            label={editing ? 'Password (kosongkan jika tidak diganti)' : 'Password'}
            type="password"
            placeholder={editing ? '••••••' : 'Minimal 6 karakter'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <Select
            id="siswa-kelas"
            label="Kelas"
            value={form.kelasId}
            onChange={(e) => setForm({ ...form, kelasId: e.target.value })}
            error={errors.kelasId}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </Select>
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Status</span>
            <div className="grid grid-cols-2 gap-2">
              {['aktif', 'tidak aktif'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-sm font-semibold transition',
                    form.status === s
                      ? s === 'aktif'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                        : 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  )}
                >
                  {s === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Konfirmasi hapus */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus siswa ini?"
        message={`Siswa "${deleteTarget?.nama}" beserta riwayat absensinya akan dihapus permanen.`}
        confirmLabel="Ya, hapus"
        onConfirm={handleDelete}
      />
    </ProtectedPage>
  );
}
