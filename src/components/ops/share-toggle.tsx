"use client";

import { useFormStatus } from "react-dom";
import { Check, Loader2, Plus } from "lucide-react";

import { toggleShareAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

function ToggleButton({ shared }: { shared: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-pressed={shared}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50",
        shared
          ? "border-cyan/40 bg-cyan/15 text-ink hover:bg-cyan/25"
          : "border-line bg-paper text-slate hover:text-ink",
      )}
    >
      {pending ? (
        <Loader2 className="size-3 animate-spin" aria-hidden />
      ) : shared ? (
        <Check className="size-3" aria-hidden />
      ) : (
        <Plus className="size-3" aria-hidden />
      )}
      {shared ? "Shared" : "Share"}
    </button>
  );
}

export function ShareToggle({
  leadId,
  shared,
}: {
  leadId: number;
  shared: boolean;
}) {
  return (
    <form action={toggleShareAction}>
      <input type="hidden" name="lead_id" value={leadId} />
      <input type="hidden" name="share" value={(!shared).toString()} />
      <ToggleButton shared={shared} />
    </form>
  );
}
