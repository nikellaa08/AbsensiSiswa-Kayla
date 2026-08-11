'use client';
import { useMemo, useState } from 'react';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useAuth } from '@/hooks/useAuth';
import { getAttendanceByStudent } from '@/lib/storage';
import { formatDateID, formatTime12 } from '@/utils/date';
import {
  PAGE_SIZE_HISTORY,
  getStatusDisplay,
  getVerificationMeta,
} from '@/utils/constants';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import Table from '@/components/ui/Table';
import AttachmentPreviewModal, { AttachmentActions } from '@/components/ui/Attachment';

export default function RiwayatPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [previewAtt, setPreviewAtt] = useState(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return getAttendanceByStudent(user?.id)
      .filter((a) => {
        if (!q) return true;
        return (
          formatDateID(a.tanggal).toLowerCase().includes(q) ||
          a.status.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.tanggal + b.jam).localeCompare(a.tanggal + a.jam));
  }, [user?.id, search]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE_HISTORY));
  const safePage = Math.min(page, totalPages);
  const paged = rows.slice((safePage - 1) * PAGE_SIZE_HISTORY, safePage * PAGE_SIZE_HISTORY);

  return (
    <ProtectedPage roles={['siswa']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Riwayat Absensi</h2>
            <p className="mt-1 text-sm text-gray-500">
              Seluruh catatan absensi kamu, diurutkan dari yang terbaru.
            </p>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari tanggal atau status..."
            className="max-w-xs"
          />
        </div>

        <Card className="overflow-hidden">
          <Table
            columns={[
              { key: 'tanggal', header: 'Tanggal', render: (r) => <span className="whitespace-nowrap font-semibold text-gray-900">{formatDateID(r.tanggal)}</span> },
              { key: 'jam', header: 'Jam', render: (r) => <span className="whitespace-nowrap font-mono text-xs">{r.jam} <span className="text-gray-400">({formatTime12(r.jam)})</span></span> },
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
                className: 'max-w-[220px]',
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
            ]}
            data={paged}
            empty={
              <EmptyState
                title="Riwayat kosong"
                description={
                  search
                    ? 'Tidak ada riwayat yang cocok dengan pencarian.'
                    : 'Kamu belum melakukan absensi. Absen sekarang!'
                }
              />
            }
          />
          <div className="border-t border-gray-100 px-4 py-4">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={rows.length}
              pageSize={PAGE_SIZE_HISTORY}
            />
          </div>
        </Card>
      </div>

      {/* Modal pratinjau lampiran */}
      <AttachmentPreviewModal attachment={previewAtt} onClose={() => setPreviewAtt(null)} />
    </ProtectedPage>
  );
}
