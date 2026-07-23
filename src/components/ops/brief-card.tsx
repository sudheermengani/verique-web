import { Sparkles } from "lucide-react";

import type { CallBrief } from "@/lib/ops/queries";

const CONFIDENCE: Record<CallBrief["confidence"], string> = {
  high: "border-cyan/40 bg-cyan/15 text-ink",
  medium: "border-blue/25 bg-blue/10 text-blue",
  low: "border-border bg-muted text-muted-foreground",
};

export function BriefCard({ brief }: { brief: CallBrief }) {
  return (
    <section
      aria-label="Call brief"
      className="rounded-xl border border-cyan/30 bg-cyan/5 p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-1.5 font-heading font-semibold text-ink">
          <Sparkles className="size-4 text-blue" aria-hidden /> Call brief
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${CONFIDENCE[brief.confidence]}`}
        >
          {brief.confidence} confidence
        </span>
      </div>
      <dl className="space-y-3 text-sm">
        <BriefItem label="What they won">{brief.won}</BriefItem>
        <BriefItem label="Likely mobilisation">{brief.mobilisation}</BriefItem>
        <BriefItem label="Trades likely needed">
          {brief.trades_needed.join(", ") || "—"}
        </BriefItem>
        <BriefItem label="Ask for">{brief.ask_for}</BriefItem>
        <BriefItem label="Opening line">
          <span className="text-ink italic">&ldquo;{brief.opening_line}&rdquo;</span>
        </BriefItem>
      </dl>
    </section>
  );
}

function BriefItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.65rem] tracking-wide text-slate uppercase">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
