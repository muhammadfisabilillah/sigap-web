type TimelineStep = {
  label: string;
  done: boolean;
};

export function ActivationTimeline({ steps }: { steps: TimelineStep[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Langkah mengaktifkan akun</h2>
        <p className="text-xs font-medium text-muted">
          {doneCount} dari {steps.length} selesai · {percent}%
        </p>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.label} className="flex flex-col items-center text-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step.done
                  ? 'bg-brand text-white'
                  : 'border-2 border-line bg-paper text-muted'
              }`}
              aria-hidden="true"
            >
              {step.done ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`mt-2 text-[10px] leading-snug sm:text-[11px] ${
                step.done ? 'font-medium text-ink' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
