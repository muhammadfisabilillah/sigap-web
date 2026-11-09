export function AuthFormSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4" aria-hidden="true">
      <div className="space-y-1.5">
        <div className="h-4 w-16 rounded bg-slate-100" />
        <div className="h-11 w-full rounded-lg bg-slate-100" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-24 rounded bg-slate-100" />
        <div className="h-11 w-full rounded-lg bg-slate-100" />
      </div>
      <div className="h-11 w-full rounded-lg bg-slate-100" />
    </div>
  );
}
