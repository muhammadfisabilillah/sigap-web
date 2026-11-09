export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="h-16 border-b border-slate-200 bg-white" />
      <div className="mx-auto w-full max-w-6xl flex-1 animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-7 w-56 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-200" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-white" />
          <div className="h-28 rounded-2xl bg-white" />
          <div className="h-28 rounded-2xl bg-white" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-40 rounded-2xl bg-white" />
          <div className="h-40 rounded-2xl bg-white" />
        </div>
      </div>
    </div>
  );
}
