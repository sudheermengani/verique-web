export default function OpsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded-md bg-line/60" />
          <div className="h-4 w-24 animate-pulse rounded-md bg-line/60" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 w-28 animate-pulse rounded-xl bg-line/60" />
          ))}
        </div>
      </div>
      <div className="h-9 w-full max-w-md animate-pulse rounded-md bg-line/60" />
      <div className="space-y-px overflow-hidden rounded-xl border border-line bg-paper">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse border-b border-line/60 bg-paper-tint/50 last:border-0" />
        ))}
      </div>
    </div>
  );
}
