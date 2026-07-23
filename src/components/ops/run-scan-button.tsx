"use client";

import { useActionState, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { runScanNowAction, type ScanState } from "@/app/admin/actions";
import { PendingButton } from "@/components/ops/pending-button";

/** Triggers an on-demand engine run (via GitHub Actions) for one client, or
 * every client when `client` is omitted. The run happens off in CI, not on
 * this server, so success here means "queued" — new leads/briefs land in a
 * few minutes, not instantly. */
export function RunScanButton({
  client,
  label = "Run scan now",
}: {
  client?: string;
  label?: string;
}) {
  const [state, formAction] = useActionState<ScanState, FormData>(
    runScanNowAction,
    {},
  );
  const [queued, setQueued] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setQueued(true);
      const t = setTimeout(() => setQueued(false), 8000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1.5">
      {client && <input type="hidden" name="client" value={client} />}
      <PendingButton variant="outline" size="sm">
        <RefreshCw className="size-3.5" aria-hidden /> {label}
      </PendingButton>
      {queued && (
        <p className="text-xs text-cyan">
          Queued — check back in a few minutes.
        </p>
      )}
      {state.error && (
        <p className="max-w-64 text-right text-xs text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
