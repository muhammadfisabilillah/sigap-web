export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="h-14 border-b border-line" />
      <div className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-4 py-8 sm:px-6">
        <div className="h-6 w-56 bg-line" />
        <div className="mt-2 h-4 w-80 max-w-full bg-line" />
        <div className="mt-8 grid grid-cols-1 gap-px bg-none sm:grid-cols-3 sm:gap-4">
          <div className="h-24 border border-line bg-card" />
          <div className="h-24 border border-line bg-card" />
          <div className="h-24 border border-line bg-card" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-36 border border-line bg-card" />
          <div className="h-36 border border-line bg-card" />
        </div>
      </div>
    </div>
  );
}
