import type { ReactNode } from 'react';

export type BarChartItem = {
  label: string;
  value: number;
};

export function BarChart({
  title,
  subtitle,
  items,
  formatValue,
}: {
  title: string;
  subtitle?: string;
  items: BarChartItem[];
  formatValue?: (value: number) => ReactNode;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
      </div>
      {total === 0 ? (
        <p className="mt-4 text-sm text-muted">Belum ada data.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const width = Math.round((item.value / max) * 100);
            return (
              <li key={item.label}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                  <span className="truncate font-medium text-ink">{item.label}</span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {formatValue ? formatValue(item.value) : item.value}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-700"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
