import Link from "next/link";
import { Inbox } from "lucide-react";

import {
  getClients,
  getClient,
  getLeads,
  getStats,
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/ops/queries";
import { formatDate, formatGBP } from "@/lib/ops/format";
import { StatusBadge } from "@/components/ops/status-badge";
import { ShareToggle } from "@/components/ops/share-toggle";
import { cn } from "@/lib/utils";

const FILTERS = ["new", ...LEAD_STATUSES.filter((s) => s !== "new"), "all"] as const;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; client?: string }>;
}) {
  const params = await searchParams;
  const clients = await getClients();
  if (clients.length === 0) {
    return <EmptyCard title="No clients yet" body="Run the engine to create one." />;
  }
  const clientSlug =
    clients.find((c) => c.slug === params.client)?.slug ?? clients[0].slug;
  const status = (
    FILTERS.includes(params.status as (typeof FILTERS)[number])
      ? params.status
      : "new"
  ) as LeadStatus | "all";

  const [client, stats, leads] = await Promise.all([
    getClient(clientSlug),
    getStats(clientSlug),
    getLeads(clientSlug, status),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-ink">Leads</h1>
          {clients.length > 1 ? (
            <nav aria-label="Client" className="mt-1 flex flex-wrap gap-2">
              {clients.map((c) => (
                <Link
                  key={c.slug}
                  href={`/admin/leads?client=${c.slug}&status=${status}`}
                  className={cn(
                    "rounded-md text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    c.slug === clientSlug
                      ? "font-medium text-ink"
                      : "text-slate hover:text-ink",
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          ) : (
            <p className="mt-1 text-sm text-slate">
              {client?.name}
              {client?.category ? ` · ${client.category}` : ""}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile label="Open leads" value={String(stats.open)} />
          <StatTile label="Open pipeline" value={formatGBP(stats.pipeline_gbp)} />
          <StatTile label="Conversations" value={String(stats.conversations)} />
          <StatTile label="Requirements" value={String(stats.requirements)} highlight />
        </div>
      </div>

      <nav
        aria-label="Filter by status"
        className="flex flex-wrap gap-1 border-b border-line pb-px"
      >
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/leads?client=${clientSlug}&status=${f}`}
            aria-current={f === status ? "page" : undefined}
            className={cn(
              "rounded-t-md px-3 py-2 text-sm capitalize focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              f === status
                ? "-mb-px border-b-2 border-ink font-medium text-ink"
                : "text-slate hover:text-ink",
            )}
          >
            {f}
          </Link>
        ))}
      </nav>

      {leads.length === 0 ? (
        <EmptyCard
          title={status === "new" ? "All caught up" : `Nothing marked “${status}”`}
          body={
            status === "new"
              ? "No open leads right now. The next engine run may bring more."
              : "Outcomes you log will show up under this filter."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-paper">
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-slate">
                <th scope="col" className="px-4 py-3 font-medium">Score</th>
                <th scope="col" className="px-4 py-3 font-medium">Contract</th>
                <th scope="col" className="px-4 py-3 font-medium">Winner</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Value</th>
                <th scope="col" className="px-4 py-3 font-medium">Awarded</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Client page</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line/60 last:border-0 hover:bg-paper-tint">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-ink">
                    {lead.score}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="line-clamp-2 rounded-md font-medium text-ink hover:text-blue focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {lead.title || lead.ocid}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate">
                      {lead.sector_hint}
                      {lead.region_hit ? ` · ${lead.region_hit}` : ""}
                    </p>
                  </td>
                  <td className="max-w-45 px-4 py-3">
                    <p className="line-clamp-2 text-ink">
                      {lead.winners.map((w) => w.name).join("; ") || "not named"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-ink">
                    {formatGBP(lead.value_gbp)}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-slate">
                    {formatDate(lead.award_date)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ShareToggle leadId={lead.id} shared={lead.shared} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatTile({
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
      className={cn(
        "rounded-xl border px-3 py-2",
        highlight ? "border-cyan/40 bg-cyan/10" : "border-line bg-paper",
      )}
    >
      <p className="text-[0.65rem] tracking-wide text-slate uppercase">{label}</p>
      <p className="font-mono text-lg font-medium text-ink">{value}</p>
    </div>
  );
}

function EmptyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-paper py-16 text-center">
      <Inbox className="size-8 text-slate" aria-hidden />
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-slate">{body}</p>
      </div>
    </div>
  );
}
