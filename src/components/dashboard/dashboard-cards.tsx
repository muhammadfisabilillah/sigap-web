import Link from 'next/link';
import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'warning' | 'success';
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="border-t-2 border-ink bg-card px-5 py-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

type ModuleCardProps = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
};

export function ModuleCard({ title, description, href, cta }: ModuleCardProps) {
  const inner = (
    <>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      {href ? (
        <span className="mt-4 inline-block text-sm font-medium text-brand">{cta ?? 'Buka'} →</span>
      ) : (
        <span className="mt-4 inline-block text-sm text-muted">Belum tersedia</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-col border border-line bg-card p-5 hover:border-brand/40"
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex flex-col border border-line bg-card p-5 opacity-70">{inner}</div>;
}
