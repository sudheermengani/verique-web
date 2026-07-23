import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { getLead } from "@/lib/ops/queries";
import { formatDate, formatGBPFull } from "@/lib/ops/format";
import { StatusBadge } from "@/components/ops/status-badge";
import { ContactCard } from "@/components/ops/contact-card";
import { BriefCard } from "@/components/ops/brief-card";

export default async function ClientLeadDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();

  const lead = await getLead(leadId);
  // Only ever show a lead that belongs to this client AND has actually been
  // shared — access to /client/[slug] is already gated by the layout, but a
  // client must never see another client's data, or anything not yet
  // curated for them, even by guessing an id in the URL.
  if (!lead || lead.client_slug !== slug || !lead.shared) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/client/${slug}`}
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
        {lead.site_address && (
          <Item label="Where the work happens">
            {lead.site_address_precise ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.site_address}, UK`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {lead.site_address}
              </a>
            ) : (
              <span title="Inferred from the notice text or a broad region — not an exact address">
                {lead.site_address}{" "}
                <span className="text-xs text-slate">(approximate)</span>
              </span>
            )}
          </Item>
        )}
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

      {lead.brief && <BriefCard brief={lead.brief} />}

      <ContactCard enrichment={lead.enrichment} winner={lead.winners[0]?.name} />

      {lead.description && (
        <section aria-label="Notice description">
          <h2 className="mb-1 text-sm font-medium text-ink">Description</h2>
          <p className="text-sm whitespace-pre-line text-slate">
            {lead.description}
          </p>
        </section>
      )}
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
