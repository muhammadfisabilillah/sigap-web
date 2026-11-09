import Link from 'next/link';
import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'default' | 'warning' | 'success';
};

const TONE_CLASS: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-blue-50 text-[#183B7E]',
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
};

export function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-3 inline-flex rounded-lg px-2.5 py-1 text-xl font-bold ${TONE_CLASS[tone]}`}>
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
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

export function ModuleCard({ title, description, href, cta, badge }: ModuleCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {badge ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{description}</p>
      {href ? (
        <Link
          href={href}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#183B7E] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#132F66]"
        >
          {cta ?? 'Buka'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="mt-4 inline-flex w-fit items-center rounded-lg border border-dashed border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-400">
          Segera hadir
        </span>
      )}
    </div>
  );
}
