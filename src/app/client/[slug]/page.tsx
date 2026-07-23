import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";

import { getClient, getSharedLeads } from "@/lib/ops/queries";
import { formatDate, formatGBP, formatGBPFull } from "@/lib/ops/format";
import { StatusBadge } from "@/components/ops/status-badge";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();
  const leads = await getSharedLeads(slug);

  const pipeline = leads.reduce((sum, l) => sum + (l.value_gbp ?? 0), 0);
  const conversations = leads.filter((l) => l.status === "conversation").length;
  const requirements = leads.filter((l) => l.status === "requirement").length;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="font-mono text-xs tracking-widest text-slate uppercase">
          {client.category || "Lead intelligence"}
        </p>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          {client.name}
        </h1>
        <p className="text-sm text-slate">
          Leads Verique has surfaced and shared with your team.
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Leads delivered" value={String(leads.length)} />
        <Stat label="Pipeline value" value={formatGBP(pipeline)} />
        <Stat label="In conversation" value={String(conversations)} />
        <Stat label="Requirements" value={String(requirements)} highlight />
      </dl>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-paper py-16 text-center">
          <Sparkles className="size-8 text-slate" aria-hidden />
          <div>
            <p className="font-medium text-ink">Your first leads are on the way</p>
            <p className="mt-1 text-sm text-slate">
              Verique is monitoring contract awards in your patch. Shared leads
              will appear here.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="rounded-xl border border-line bg-paper p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-heading font-semibold text-ink">
                  {lead.title || lead.ocid}
                </h2>
                <StatusBadge status={lead.status} />
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <Field label="Winner">
                  {lead.winners.map((w) => w.name).join("; ") || "not named"}
                </Field>
                <Field label="Buyer">{lead.buyer || "—"}</Field>
                <Field label="Value">{formatGBPFull(lead.value_gbp)}</Field>
                <Field label="Awarded">{formatDate(lead.award_date)}</Field>
                {lead.enrichment?.phone && (
                  <Field label="Phone">
                    <a href={`tel:${lead.enrichment.phone}`} className="text-blue hover:underline">
                      {lead.enrichment.phone}
                    </a>
                  </Field>
                )}
                {lead.enrichment?.address && (
                  <Field label="Address">{lead.enrichment.address}</Field>
                )}
              </dl>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Link
                  href={`/client/${slug}/leads/${lead.id}`}
                  className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-blue hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Full details, brief & contact <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
                <a
                  href={lead.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md text-sm text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Official award notice <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl border px-4 py-3 " +
        (highlight ? "border-cyan/40 bg-cyan/10" : "border-line bg-paper")
      }
    >
      <dt className="text-[0.65rem] tracking-wide text-slate uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-xl font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.65rem] tracking-wide text-slate uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
