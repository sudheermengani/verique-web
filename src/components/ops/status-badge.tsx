import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/ops/queries";

const STYLES: Record<LeadStatus, string> = {
  new: "border-blue/25 bg-blue/10 text-blue",
  called: "border-border bg-muted text-muted-foreground",
  conversation: "border-violet/25 bg-violet/10 text-violet",
  requirement: "border-cyan/40 bg-cyan/15 text-ink",
  dead: "border-border bg-muted text-muted-foreground/70",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
