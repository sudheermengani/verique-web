import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { getLead, getLeadEvents, LEAD_STATUSES } from "@/lib/ops/queries";
import { setLeadStatusAction } from "../../../actions";
import { formatDate, formatDateTime, formatGBPFull } from "@/lib/ops/format";
import { StatusBadge } from "@/components/ops/status-badge";
import { ShareToggle } from "@/components/ops/share-toggle";
import { PendingButton } from "@/components/ops/pending-button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();
  const lead = await getLead(leadId);
  if (!lead) notFound();
  const events = await getLeadEvents(leadId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/admin/leads?client=${lead.client_slug}`}
        className="inline-flex items-center gap-1 rounded-md text-sm text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to leads
      </Link>

      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-ink px-2 py-0.5 font-mono text-xs font-medium text-paper">
            {lead.score}
          </span>
          <StatusBadge status={lead.status} />
          <span className="ml-auto">
            <ShareToggle leadId={lead.id} shared={lead.shared} />
          </span>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-balance text-ink">
          {lead.title || lead.ocid}
        </h1>
        <p className="text-sm text-slate">
          {lead.sector_hint}
          {lead.region_hit ? ` · region: ${lead.region_hit}` : ""} · found{" "}
          {formatDate(lead.created_at)}
        </p>
      </header>

      <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-line bg-paper p-5 sm:grid-cols-2">
        <Item label="Winner">
          {lead.winners.map((w) => w.name).join("; ") || "not named"}
        </Item>
        <Item label="Buyer">{lead.buyer || "—"}</Item>
        <Item label="Award value">{formatGBPFull(lead.value_gbp)}</Item>
        <Item label="Awarded">{formatDate(lead.award_date)}</Item>
        <Item label="CPV codes">
          <span className="font-mono text-xs">
            {lead.cpv_codes.join(", ") || "—"}
          </span>
        </Item>
        <Item label="Source">{lead.source.replaceAll("_", " ")}</Item>
        <div className="sm:col-span-2">
          <a
            href={lead.evidence_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-blue hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Official award notice <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </dl>

      {lead.description && (
        <section aria-label="Notice description">
          <h2 className="mb-1 text-sm font-medium text-ink">Description</h2>
          <p className="text-sm whitespace-pre-line text-slate">
            {lead.description}
          </p>
        </section>
      )}

      <form
        action={setLeadStatusAction}
        className="space-y-4 rounded-xl border border-line bg-paper p-5"
      >
        <input type="hidden" name="lead_id" value={lead.id} />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">Log outcome</legend>
          <p className="text-xs text-slate">
            Every call gets logged — outcomes tune the scoring.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {LEAD_STATUSES.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm capitalize select-none has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2"
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  defaultChecked={s === lead.status}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-1.5">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            name="note"
            rows={2}
            placeholder="e.g. Spoke to contracts manager — needs groundworkers from mid-August"
          />
        </div>
        <PendingButton>Save outcome</PendingButton>
      </form>

      <section aria-label="Outcome history">
        <h2 className="mb-2 text-sm font-medium text-ink">History</h2>
        {events.length === 0 ? (
          <p className="text-sm text-slate">
            No outcomes logged yet. First call goes here.
          </p>
        ) : (
          <ol className="space-y-2">
            {events.map((e) => (
              <li key={e.id} className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink capitalize">{e.status}</span>
                  <time className="text-xs text-slate">
                    {formatDateTime(e.created_at)}
                  </time>
                </div>
                {e.note && <p className="mt-0.5 text-slate">{e.note}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.65rem] tracking-wide text-slate uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}
