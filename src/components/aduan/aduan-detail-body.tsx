import type { ReactNode } from 'react';
import { AduanMap } from '@/src/components/map/aduan-map';
import { STATUS_ADUAN_LABEL, STATUS_RIWAYAT_LABEL, formatTanggal, type AduanItem } from '@/src/lib/aduan/labels';

export type RiwayatRow = {
  id: number;
  status: string;
  statusAduan: string;
  catatan: string | null;
  createdAt: string;
};

export function AduanDetailBody({
  item,
  riwayat,
  action,
  actionTitle = 'Tindakan',
}: {
  item: AduanItem;
  riwayat: RiwayatRow[];
  action?: ReactNode;
  actionTitle?: string;
}) {
  const riwayatTerurut = riwayat
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="border border-line bg-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="text-xs font-medium text-muted">Status saat ini</p>
              <p className="mt-0.5 text-lg font-semibold text-ink">
                {STATUS_ADUAN_LABEL[item.status] ?? item.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted">Dukungan warga</p>
              <p className="mt-0.5 text-lg font-semibold text-ink">{item.totalUpvote}</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted">Deskripsi</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink">
                {item.deskripsi}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted">Dibuat pada</p>
                <p className="mt-1 text-sm text-ink">{formatTanggal(item.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Koordinat</p>
                <p className="mt-1 text-sm text-ink">
                  {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}{' '}
                  <a
                    href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand hover:underline"
                  >
                    (lihat peta)
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {item.fotoUrls.length > 0 ? (
          <section className="border border-line bg-card p-5">
            <h2 className="text-sm font-semibold text-ink">Foto bukti</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {item.fotoUrls.map((url, index) => (
                <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Foto bukti aduan ${index + 1}`}
                    className="aspect-[4/3] w-full border border-line object-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="border border-line bg-card p-5">
          <h2 className="text-sm font-semibold text-ink">Lokasi di peta</h2>
          <div className="mt-3">
            <AduanMap
              points={[
                {
                  id: item.id,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  judul: item.judul,
                  nomorTiket: item.nomorTiket,
                  kecamatanNama: item.kecamatanNama,
                },
              ]}
              height={280}
            />
          </div>
        </section>

        {action ? (
          <section className="border border-line bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-ink">{actionTitle}</h2>
            {action}
          </section>
        ) : null}
      </div>

      <aside className="border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">Riwayat penanganan</h2>
        {riwayatTerurut.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Belum ada riwayat penanganan.</p>
        ) : (
          <ol className="mt-4 space-y-5">
            {riwayatTerurut.map((r) => (
              <li key={r.id} className="border-l-2 border-line pl-4">
                <p className="text-sm font-medium text-ink">
                  {STATUS_RIWAYAT_LABEL[r.status] ?? r.status}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {STATUS_ADUAN_LABEL[r.statusAduan] ?? r.statusAduan} · {formatTanggal(r.createdAt)}
                </p>
                {r.catatan ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.catatan}</p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}

