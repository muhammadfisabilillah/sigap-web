import Link from 'next/link';
import { STATUS_ADUAN_LABEL, formatTanggal, type AduanItem } from '@/src/lib/aduan/labels';

export function AduanList({
  aduan,
  emptyMessage,
  basePath = '/warga/aduan',
}: {
  aduan: AduanItem[];
  emptyMessage: string;
  basePath?: string;
}) {
  if (aduan.length === 0) {
    return (
      <div className="border border-line bg-card px-5 py-10 text-center">
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border border-line bg-card">
      {aduan.map((item) => (
        <li key={item.id}>
          <Link href={`${basePath}/${item.id}`} className="flex gap-4 px-5 py-4 hover:bg-paper">
            {item.fotoUrls[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.fotoUrls[0]}
                alt=""
                className="h-16 w-16 shrink-0 border border-line object-cover"
                loading="lazy"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="truncate text-sm font-semibold text-ink">{item.judul}</h2>
                <span className="shrink-0 text-xs font-medium text-muted">
                  {STATUS_ADUAN_LABEL[item.status] ?? item.status}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                {item.deskripsi}
              </p>
              <p className="mt-1.5 text-xs text-muted">
                {item.nomorTiket} · Kec. {item.kecamatanNama} · {item.kategoriNama} ·{' '}
                {formatTanggal(item.createdAt)} · {item.totalUpvote} dukungan
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
