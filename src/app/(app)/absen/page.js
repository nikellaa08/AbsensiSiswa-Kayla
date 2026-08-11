'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  CheckBadgeIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { addAttendance, getStudentAttendanceOn } from '@/lib/storage';
import { getTodayParts, todayStr, formatTime12, diffMinutes } from '@/utils/date';
import {
  STATUS_OPTIONS,
  STATUS_META,
  STATUS,
  JAM_MASUK,
  VERIFICATION,
  getStatusDisplay,
  getVerificationMeta,
} from '@/utils/constants';
import { buttonClasses } from '@/components/ui/buttonClasses';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import { cn } from '@/utils/helpers';

const STATUS_CARDS = [
  { ...STATUS_OPTIONS[0], icon: CheckBadgeIcon, activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-emerald-500/20' },
  { ...STATUS_OPTIONS[1], icon: ClockIcon, activeColor: 'border-amber-500 bg-amber-50 text-amber-700 ring-amber-500/20' },
  { ...STATUS_OPTIONS[2], icon: HeartIcon, activeColor: 'border-red-500 bg-red-50 text-red-700 ring-red-500/20' },
];

export default function AbsenPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [now, setNow] = useState(getTodayParts());
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(STATUS.HADIR);
  const [keterangan, setKeterangan] = useState('');
  const [ketError, setKetError] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [record, setRecord] = useState(() => getStudentAttendanceOn(user?.id, todayStr()));

  useEffect(() => {
    const t = setInterval(() => setNow(getTodayParts()), 1000);
    return () => clearInterval(t);
  }, []);

  const today = todayStr();

  // Kebutuhan alasan untuk Izin / Sakit
  const needReason = status === STATUS.IZIN || status === STATUS.SAKIT;
  const reasonLabel = status === STATUS.IZIN ? 'Alasan Izin' : 'Keluhan / Keterangan';
  const reasonPlaceholder =
    status === STATUS.IZIN
      ? 'Contoh: Keperluan keluarga, mengikuti lomba, acara sekolah...'
      : 'Contoh: Demam, pusing, tidak enak badan...';

  const resetForm = () => {
    setStatus(STATUS.HADIR);
    setKeterangan('');
    setKetError('');
    setAttachment(null);
  };

  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  /** Hitung status & keterangan akhir berdasarkan pilihan siswa + jam sekarang */
  const computeResult = (chosen, jam) => {
    if (chosen === STATUS.HADIR) {
      // Hadir sebelum/tepat jam masuk -> Hadir; sesudahnya -> Terlambat
      if (jam <= `${JAM_MASUK}:00`) {
        return { status: STATUS.HADIR, keterangan: '' };
      }
      const menit = diffMinutes(jam, `${JAM_MASUK}:00`);
      return {
        status: STATUS.TERLAMBAT,
        keterangan: `Terlambat ${menit} Menit`,
      };
    }
    if (chosen === STATUS.IZIN) {
      return { status: STATUS.IZIN, keterangan: `Alasan Izin: ${keterangan.trim()}` };
    }
    return { status: STATUS.SAKIT, keterangan: `Keluhan: ${keterangan.trim()}` };
  };

  const handleSave = () => {
    // Validasi alasan / keluhan (minimal 10 karakter) + lampiran wajib
    if (needReason && (keterangan.trim().length < 10 || !attachment)) {
      setKetError(
        !attachment
          ? 'Wajib mengunggah dokumen pendukung (surat izin / surat sakit).'
          : `${reasonLabel} wajib diisi minimal 10 karakter.`
      );
      return;
    }
    // Cegah dobel absen (cek ulang ke storage)
    if (getStudentAttendanceOn(user.id, today)) {
      toast.error('Kamu sudah absen hari ini. Absen hanya boleh dilakukan sekali sehari.');
      setModalOpen(false);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const result = computeResult(status, now.time);
      const saved = addAttendance({
        siswaId: user.id,
        tanggal: today,
        jam: now.time,
        status: result.status,
        keterangan: result.keterangan,
        ...(needReason
          ? {
              attachment,
              verificationStatus: VERIFICATION.MENUNGGU,
            }
          : {}),
      });
      if (!saved) {
        setSaving(false);
        toast.error(
          'Penyimpanan gagal — ruang penyimpanan browser penuh. Gunakan file berukuran lebih kecil.'
        );
        return;
      }
      setRecord(getStudentAttendanceOn(user.id, today));
      setSaving(false);
      setModalOpen(false);
      toast.success(
        `Absensi tersimpan! Status kamu hari ini: ${STATUS_META[result.status].label}.` +
          (needReason ? ' Lampiran menunggu verifikasi admin.' : '')
      );
    }, 500);
  };

  const recordDisplay = record ? getStatusDisplay(record) : null;
  const recordVerification = record ? getVerificationMeta(record) : null;

  return (
    <ProtectedPage roles={['siswa']}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Absen Hari Ini</h2>
          <p className="mt-1 text-sm text-gray-500">
            Absensi cukup satu kali sehari dengan menekan tombol. Jam masuk pukul 07:00.
          </p>
        </div>

        {/* Kartu jam & tanggal */}
        <Card className="relative overflow-hidden p-8 text-center">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl" />
          <p className="text-sm font-medium text-gray-500">{now.dateLabel}</p>
          <p className="mt-2 font-mono text-5xl font-extrabold tracking-tight text-gray-900 tabular-nums">
            {now.time}
          </p>

          <div className="mt-8">
            {record ? (
              <div className="animate-scale-in">
                <div
                  className={cn(
                    'mx-auto flex h-16 w-16 items-center justify-center rounded-full',
                    record.status === STATUS.ALPHA
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-emerald-100 text-emerald-600'
                  )}
                >
                  <CheckCircleIcon className="h-9 w-9" />
                </div>
                <p className="mt-4 text-lg font-bold text-gray-900">
                  Anda Sudah Absen Hari Ini
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {recordDisplay && (
                    <Badge color={recordDisplay.color} dot>
                      {recordDisplay.label}
                    </Badge>
                  )}
                  {record.verificationStatus === VERIFICATION.MENUNGGU && recordVerification && (
                    <Badge color={recordVerification.color} dot>
                      {recordVerification.label}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-400">
                    pada {formatTime12(record.jam)}
                  </span>
                </div>
                {record.keterangan && (
                  <p className="mt-2 text-xs text-gray-400">Keterangan: {record.keterangan}</p>
                )}
                {record.penolakanAlasan && (
                  <p className="mt-2 text-xs font-medium text-red-400">
                    Alasan penolakan: {record.penolakanAlasan}
                  </p>
                )}
                {record.verificationStatus === VERIFICATION.MENUNGGU && (
                  <p className="mt-2 text-xs text-amber-500">
                    Lampiran kamu sedang menunggu verifikasi admin.
                  </p>
                )}
                <button disabled className={buttonClasses('outline', 'lg', 'mt-6 w-full cursor-not-allowed opacity-60')}>
                  <CheckCircleIcon className="h-5 w-5" />
                  Sudah Absen Hari Ini
                </button>
              </div>
            ) : (
              <button
                onClick={openModal}
                className={`${buttonClasses('primary', 'lg', 'w-full')} group`}
              >
                <CheckBadgeIcon className="h-5 w-5 transition group-hover:scale-110" />
                Absen Sekarang
              </button>
            )}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheckIcon className="h-4 w-4" />
            Tanggal & jam diambil otomatis dari perangkatmu.
          </p>
        </Card>
      </div>

      {/* Modal pilih status */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Status Kehadiran"
        description={`${now.dateLabel} — absen untuk hari ini.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={needReason && (keterangan.trim().length < 10 || !attachment)}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          {STATUS_CARDS.map((s) => {
            const Icon = s.icon;
            const active = status === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setStatus(s.value);
                  setKetError('');
                }}
                className={cn(
                  'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition',
                  active
                    ? s.activeColor
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition',
                    active ? 'bg-white/60' : 'bg-gray-100 text-gray-400'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-bold', active ? 'text-inherit' : 'text-gray-900')}>
                    {s.label}
                  </p>
                  <p className={cn('text-xs', active ? 'opacity-70' : 'text-gray-400')}>
                    {s.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border-2 transition',
                    active ? 'border-current bg-current' : 'border-gray-300'
                  )}
                >
                  {active && <CheckCircleIcon className="h-4 w-4 text-white" />}
                </span>
              </button>
            );
          })}

          {/* Keterangan wajib untuk Izin / Sakit */}
          {needReason && (
            <div className="animate-fade-in rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-bold text-gray-700">{reasonLabel}</p>
              </div>
              <div className="mt-3">
                <Textarea
                  id="alasan"
                  rows={3}
                  placeholder={reasonPlaceholder}
                  value={keterangan}
                  onChange={(e) => {
                    setKeterangan(e.target.value);
                    if (ketError) setKetError('');
                  }}
                  error={ketError}
                  hint={`Minimal 10 karakter (${keterangan.trim().length}/10).`}
                />
              </div>
            </div>
          )}

          {/* Upload bukti pendukung wajib untuk Izin / Sakit */}
          {needReason && (
            <div className="animate-fade-in">
              <FileUpload value={attachment} onChange={setAttachment} />
              <p className="mt-2 text-[11px] text-gray-400">
                * Dokumen wajib diunggah untuk status{' '}
                {status === STATUS.IZIN ? 'Izin' : 'Sakit'}.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </ProtectedPage>
  );
}
