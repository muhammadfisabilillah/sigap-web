import Link from 'next/link';

type SigapLogoProps = {
  variant?: 'light' | 'dark';
  href?: string;
  size?: 'sm' | 'md';
};

export function SigapLogo({
  variant = 'light',
  href = '/',
  size = 'md',
}: SigapLogoProps) {
  const isLight = variant === 'light';
  const titleClass = isLight ? 'text-white' : 'text-[#132A50]';
  const subtitleClass = isLight ? 'text-white/75' : 'text-slate-500';
  const badgeSize = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const iconSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const titleSize = size === 'sm' ? 'text-base' : 'text-xl';

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3"
      aria-label="SIGAP Surabaya - beranda"
    >
      <span
        className={`flex ${badgeSize} items-center justify-center rounded-xl bg-[#F59E0B] text-white shadow-sm`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconSize}
          aria-hidden="true"
        >
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`${titleSize} font-bold tracking-wider ${titleClass}`}>
          SIGAP
        </span>
        <span className={`text-[11px] font-medium tracking-wide ${subtitleClass}`}>
          Surabaya
        </span>
      </span>
    </Link>
  );
}
