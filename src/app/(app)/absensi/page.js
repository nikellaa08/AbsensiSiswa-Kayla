'use client';
import { useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  PencilSquareIcon,
  CheckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useToast } from '@/components/ui/Toast';
import {
  getAttendance,
  getUserById,
  getClassName,
  updateAttendance,
} from '@/lib/storage';
import { formatDateTime, formatDateID, todayStr } from '@/utils/date';
import {
  STATUS,
  VERIFICATION,
  VERIFICATION_META,
  STATUS_META,
  PAGE_SIZE_ATTENDANCE,
  ADMIN_STATUS_OPTIONS,
  getStatusDisplay,
  getVerificationMeta,
} from '@/utils/constants';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import AttachmentPreviewModal, { AttachmentActions } from '@/components/ui/Attachment';

export default function AbsensiPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVerifikasi, setFilterVerifikasi] = useState('');
  const [page, setPage] = useState(1);

  // Edit absensi
  const [editTarget, setEditTarget] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editKeterangan, setEditKeterangan] = useState('');
  const [saving, setSaving] = useState(false);

  // Verifikasi lampiran
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyAction, setVerifyAction] = useState(null); // 'setujui' | 'tolak'
  const [alasanTolak, setAlasanTolak] = useState('');
  const [tolakError, setTolakError] = useState('');
  const [savingVerify, setSavingVerify] = useState(false);

  // Pratinjau lampiran
  const [previewAtt, setPreviewAtt] = useState(null);

  const [rows, setRows] = useState(() =>
    getAttendance()
      .map((a) => ({ ...a, siswa: getUserById(a.siswaId) }))
      .filter((a) => a.siswa)
  );

  const refreshRows = () =>
    setRows(
      getAttendance()
        .map((a) => ({ ...a, siswa: getUserById(a.siswaId) }))
        .filter((a) => a.siswa)
    );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((a) => {
        if (filterTanggal && a.tanggal !== filterTanggal) return false;
        if (filterStatus && a.status !== filterStatus) return false;
        if (filterVerifikasi && (a.verificationStatus || '') !== filterVerifikasi) return false;
        if (q) {
          const kelas = getClassName(a.siswa.kelasId).toLowerCase();
          return a.siswa.nama.toLowerCase().includes(q) || kelas.includes(q);
        }
        return true;
      })
      .sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam));
  }, [rows, search, filterTanggal, filterStatus, filterVerifikasi]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE_ATTENDANCE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE_ATTENDANCE, safePage * PAGE_SIZE_ATTENDANCE);

  const openEdit = (row) => {
    setEditTarget(row);
    setEditStatus(row.status);
    setEditKeterangan(row.keterangan || '');
  };

  const handleSaveEdit = () => {
    if (!editTarget) return;
    setSaving(true);
    setTimeout(() => {
      const patch = { status: editStatus, keterangan: editKeterangan.trim() };
      // Jika status diubah keluar dari Izin/Sakit, verifikasi tidak relevan lagi
      if (editStatus !== STATUS.IZIN && editStatus !== STATUS.SAKIT) {
        patch.verificationStatus = undefined;
        patch.penolakanAlasan = undefined;
      }
      const ok = updateAttendance(editTarget.id, patch);
      refreshRows();
      setSaving(false);
      setEditTarget(null);
      if (!ok) {
        toast.error(
          'Perubahan gagal disimpan — ruang penyimpanan browser penuh. Coba hapus lampiran berukuran besar.'
        );
        return;
      }
      toast.success(
        `Status absensi ${editTarget.siswa.nama} diperbarui menjadi ${STATUS_META[editStatus]?.label}.`
      );
    }, 400);
  };

  const handleApprove = () => {
    if (!verifyTarget) return;
    setSavingVerify(true);
    setTimeout(() => {
      updateAttendance(verifyTarget.id, {
        verificationStatus: VERIFICATION.DISETUJUI,
        penolakanAlasan: undefined,
      });
      refreshRows();
      setSavingVerify(false);
      setVerifyTarget(null);
      toast.success(
        `Lampiran ${verifyTarget.siswa.nama} disetujui. Status menjadi ${
          verifyTarget.status === STATUS.IZIN ? 'Izin Disetujui' : 'Sakit Disetujui'
        }.`
      );
    }, 400);
  };

  const handleReject = () => {
    if (!verifyTarget) return;
    if (alasanTolak.trim().length < 5) {
      setTolakError('Alasan penolakan wajib diisi minimal 5 karakter.');
      return;
    }
    setSavingVerify(true);
    setTimeout(() => {
      updateAttendance(verifyTarget.id, {
        verificationStatus: VERIFICATION.DITOLAK,
        penolakanAlasan: alasanTolak.trim(),
      });
      refreshRows();
      setSavingVerify(false);
      setVerifyTarget(null);
      setAlasanTolak('');
      setTolakError('');
      toast.success(`Lampiran ${verifyTarget.siswa.nama} ditolak.`);
    }, 400);
  };

  return (
    <ProtectedPage roles={['admin']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Data Absensi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Seluruh catatan absensi siswa — verifikasi lampiran Izin/Sakit, ubah status atau
            keterangan bila diperlukan.
          </p>
        </div>

        {/* Toolbar */}
        <Card className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari nama siswa atau kelas..."
          />
          <div className="relative lg:w-44">
            <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filterTanggal}
              max={todayStr()}
              onChange={(e) => {
                setFilterTanggal(e.target.value);
                setPage(1);
              }}
              className="input-base pl-10"
              aria-label="Filter tanggal"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="lg:w-40"
            placeholder="Semua Status"
            aria-label="Filter status"
          >
            {ADMIN_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          <Select
            value={filterVerifikasi}
            onChange={(e) => {
              setFilterVerifikasi(e.target.value);
              setPage(1);
            }}
            className="lg:w-48"
            placeholder="Semua Verifikasi"
            aria-label="Filter verifikasi"
          >
            {Object.entries(VERIFICATION_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
          <p className="text-sm text-gray-500 lg:ml-auto">
            {filtered.length} catatan ditemukan
          </p>
        </Card>

        {/* Tabel */}
        <Card className="overflow-hidden">
          <Table
            columns={[
              { key: 'nama', header: 'Nama', render: (r) => <span className="font-semibold text-gray-900">{r.siswa.nama}</span> },
              { key: 'kelas', header: 'Kelas', render: (r) => <Badge color="blue">{getClassName(r.siswa.kelasId)}</Badge> },
              { key: 'tanggal', header: 'Tanggal', render: (r) => <span className="whitespace-nowrap">{formatDateID(r.tanggal)}</span> },
              { key: 'jam', header: 'Jam', render: (r) => <span className="whitespace-nowrap font-mono text-xs">{r.jam}</span> },
              {
                key: 'status',
                header: 'Status',
                render: (r) => {
                  const d = getStatusDisplay(r);
                  return (
                    <Badge color={d.color} dot>
                      {d.label}
                    </Badge>
                  );
                },
              },
              {
                key: 'verifikasi',
                header: 'Verifikasi',
                render: (r) => {
                  const v = getVerificationMeta(r);
                  if (!v) return <span className="text-xs text-gray-300">—</span>;
                  if (r.verificationStatus === VERIFICATION.MENUNGGU) {
                    return (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge color={v.color} dot>
                          {v.label}
                        </Badge>
                        <button
                          onClick={() => {
                            setVerifyTarget(r);
                            setVerifyAction('setujui');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          aria-label={`Setujui lampiran ${r.siswa.nama}`}
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                          Setujui
                        </button>
                        <button
                          onClick={() => {
                            setVerifyTarget(r);
                            setVerifyAction('tolak');
                            setAlasanTolak('');
                            setTolakError('');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          aria-label={`Tolak lampiran ${r.siswa.nama}`}
                        >
                          <XCircleIcon className="h-3.5 w-3.5" />
                          Tolak
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-1">
                      <Badge color={v.color} dot>
                        {v.label}
                      </Badge>
                      {r.penolakanAlasan && (
                        <p
                          className="block max-w-[180px] truncate text-[11px] text-red-400"
                          title={r.penolakanAlasan}
                        >
                          {r.penolakanAlasan}
                        </p>
                      )}
                    </div>
                  );
                },
              },
              {
                key: 'keterangan',
                header: 'Keterangan',
                className: 'max-w-[200px]',
                render: (r) =>
                  r.keterangan ? (
                    <span className="block truncate text-xs text-gray-500" title={r.keterangan}>
                      {r.keterangan}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  ),
              },
              {
                key: 'lampiran',
                header: 'Lampiran',
                render: (r) => <AttachmentActions attachment={r.attachment} onPreview={setPreviewAtt} />,
              },
              {
                key: 'aksi',
                header: 'Aksi',
                className: 'text-right',
                render: (r) => (
                  <button
                    onClick={() => openEdit(r)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    aria-label={`Ubah status ${r.siswa.nama}`}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Ubah
                  </button>
                ),
              },
            ]}
            data={paged}
            empty={
              <EmptyState
                title="Absensi tidak ditemukan"
                description={
                  search || filterTanggal || filterStatus || filterVerifikasi
                    ? 'Coba ubah pencarian atau filter.'
                    : 'Belum ada data absensi.'
                }
              />
            }
          />
          <div className="border-t border-gray-100 px-4 py-4">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE_ATTENDANCE}
            />
          </div>
        </Card>
      </div>

      {/* Modal ubah status */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Ubah Status Absensi"
        description={
          editTarget
            ? `${editTarget.siswa.nama} • ${formatDateTime(editTarget.tanggal, editTarget.jam)}`
            : ''
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={saving}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} loading={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Status"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            {ADMIN_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          <Textarea
            id="ket-admin"
            label="Keterangan"
            placeholder="Contoh: Terlambat 15 Menit, Alasan Izin: Keperluan keluarga, dll."
            rows={3}
            value={editKeterangan}
            onChange={(e) => setEditKeterangan(e.target.value)}
            hint="Opsional — isi bila diperlukan."
          />
        </div>
      </Modal>

      {/* Modal verifikasi lampiran */}
      <Modal
        open={!!verifyTarget}
        onClose={() => setVerifyTarget(null)}
        title={verifyAction === 'tolak' ? 'Tolak Lampiran' : 'Setujui Lampiran'}
        description={
          verifyTarget
            ? `${verifyTarget.siswa.nama} • ${formatDateTime(verifyTarget.tanggal, verifyTarget.jam)} • ${verifyTarget.attachment?.fileName || 'tanpa lampiran'}`
            : ''
        }
        footer={
          verifyAction === 'tolak' ? (
            <>
              <Button
                variant="outline"
                onClick={() => setVerifyTarget(null)}
                disabled={savingVerify}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={savingVerify}
                disabled={alasanTolak.trim().length < 5}
              >
                {savingVerify ? 'Menyimpan...' : 'Tolak Lampiran'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setVerifyTarget(null)}
                disabled={savingVerify}
              >
                Batal
              </Button>
              <Button onClick={handleApprove} loading={savingVerify}>
                {savingVerify ? 'Menyimpan...' : 'Setujui'}
              </Button>
            </>
          )
        }
      >
        {verifyAction === 'tolak' ? (
          <div className="space-y-4">
            <Textarea
              id="alasan-tolak"
              label="Alasan Penolakan"
              placeholder="Contoh: Surat kurang jelas, dokumen tidak sesuai..."
              rows={3}
              value={alasanTolak}
              onChange={(e) => {
                setAlasanTolak(e.target.value);
                if (tolakError) setTolakError('');
              }}
              error={tolakError}
              hint={`Minimal 5 karakter (${alasanTolak.trim().length}/5).`}
            />
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600">
              <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
              Status akan berubah menjadi Ditolak dan siswa akan melihat alasan penolakan.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckIcon className="mt-0.5 h-6 w-6 shrink-0" />
            <p>
              Setujui lampiran ini? Status akan berubah menjadi{' '}
              {verifyTarget?.status === STATUS.IZIN ? 'Izin Disetujui' : 'Sakit Disetujui'}.
            </p>
          </div>
        )}
      </Modal>

      {/* Modal pratinjau lampiran */}
      <AttachmentPreviewModal attachment={previewAtt} onClose={() => setPreviewAtt(null)} />
    </ProtectedPage>
  );
}
