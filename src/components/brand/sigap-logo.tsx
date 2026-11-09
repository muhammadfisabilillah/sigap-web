import Link from 'next/link';

type SigapLogoProps = {
  variant?: 'light' | 'dark';
  href?: string;
  size?: 'sm' | 'md';
};

export function SigapLogo({ variant = 'light', href = '/', size = 'md' }: SigapLogoProps) {
  const isLight = variant === 'light';
  const titleClass = isLight ? 'text-white' : 'text-ink';
  const subtitleClass = isLight ? 'text-white/60' : 'text-muted';

  return (
    <Link href={href} className="inline-flex items-baseline gap-2" aria-label="SIGAP Surabaya - beranda">
      <span
        className={`${size === 'sm' ? 'text-[17px]' : 'text-[22px]'} font-bold leading-none tracking-tight ${titleClass}`}
      >
        SIGAP
      </span>
      <span className={`text-[11px] font-medium ${subtitleClass}`}>Surabaya</span>
      <span className="h-1 w-1 self-center rounded-full bg-accent" aria-hidden="true" />
    </Link>
  );
}
