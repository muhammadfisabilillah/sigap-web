import { VerifikasiActions } from '@/src/components/verifikasi/verifikasi-actions';
import { formatTanggal } from '@/src/lib/aduan/labels';
import type { PengajuanItem } from '@/src/lib/verifikasi/query';

const STATUS_LABEL: Record<string, string> = {
  Menunggu: 'Menunggu verifikasi',
  Diterima: 'Diterima',
  Ditolak: 'Ditolak',
};

export function VerifikasiList({ pengajuan }: { pengajuan: PengajuanItem[] }) {
  if (pengajuan.length === 0) {
    return (
      <div className="border border-line bg-card px-5 py-10 text-center">
        <p className="text-sm text-muted">Tidak ada pengajuan domisili.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border border-line bg-card">
      {pengajuan.map((item) => (
        <li key={item.id} className="px-5 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h2 className="text-sm font-semibold text-ink">{item.nama}</h2>
            <span className="text-xs font-medium text-muted">
              {STATUS_LABEL[item.status] ?? item.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted">
            {item.email} · Kec. {item.kecamatanNama} · Diajukan {formatTanggal(item.createdAt)}
          </p>

          {item.catatan ? (
            <p className="mt-2 border-l-2 border-line pl-3 text-sm text-muted">{item.catatan}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <a
              href={item.fileKtpUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-brand hover:underline"
            >
              Lihat berkas KTP
            </a>
          </div>

          <VerifikasiActions id={item.id} status={item.status} />
        </li>
      ))}
    </ul>
  );
}
