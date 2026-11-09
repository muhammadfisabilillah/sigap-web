export function AuthFormSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4" aria-hidden="true">
      <div className="space-y-1.5">
        <div className="h-4 w-16 bg-line" />
        <div className="h-11 w-full border border-line bg-card" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-24 bg-line" />
        <div className="h-11 w-full border border-line bg-card" />
      </div>
      <div className="h-11 w-full bg-line" />
    </div>
  );
}
