import Link from 'next/link';
import type { ReactNode } from 'react';

const TONE_CLASS: Record<string, string> = {
  default: 'border-t-4 border-brand bg-brand-soft',
  warning: 'border-t-4 border-accent bg-amber-soft',
  success: 'border-t-4 border-brand bg-green-soft',
};

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'warning' | 'success';
};

export function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-line px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${TONE_CLASS[tone]}`}
    >
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1.5 text-3xl font-bold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

const MODULE_ACCENT: string[] = [
  'border-l-brand',
  'border-l-accent',
  'border-l-brand',
  'border-l-accent',
];

type ModuleCardProps = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
  index?: number;
};

export function ModuleCard({ title, description, href, cta, index = 0 }: ModuleCardProps) {
  const accent = MODULE_ACCENT[index % MODULE_ACCENT.length];

  const inner = (
    <>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          {cta ?? 'Buka'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      ) : (
        <span className="mt-4 inline-block text-sm text-muted">Belum tersedia</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex flex-col rounded-xl border border-line border-l-4 ${accent} bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={`flex flex-col rounded-xl border border-line border-l-4 ${accent} bg-card p-5 opacity-70`}
    >
      {inner}
    </div>
  );
}
