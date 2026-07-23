import Link from "next/link";
import { Inbox, Plus } from "lucide-react";

import {
  getClients,
  getLeads,
  getStats,
  LEAD_STATUSES,
  type LeadSort,
  type LeadStatus,
} from "@/lib/ops/queries";
import { formatDate, formatGBP } from "@/lib/ops/format";
import { StatusBadge } from "@/components/ops/status-badge";
import { ShareToggle } from "@/components/ops/share-toggle";
import { LeadFilterBar } from "@/components/ops/lead-filter-bar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = ["new", ...LEAD_STATUSES.filter((s) => s !== "new"), "all"] as const;
const SORTS = ["score", "newest", "oldest", "value"] as const;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    client?: string;
    sort?: string;
    minScore?: string;
    minValue?: string;
  }>;
}) {
  const params = await searchParams;
  const clients = await getClients();
  if (clients.length === 0) {
    return <EmptyCard title="No clients yet" body="Add one from the Clients page." />;
  }

  const clientSlug = params.client && params.client !== "all"
    ? (clients.find((c) => c.slug === params.client)?.slug ?? "all")
    : "all";
  const status = (
    FILTERS.includes(params.status as (typeof FILTERS)[number])
      ? params.status
      : "new"
  ) as LeadStatus | "all";
  const sort = (
    SORTS.includes(params.sort as (typeof SORTS)[number]) ? params.sort : "score"
  ) as LeadSort;
  const minScore = Number(params.minScore) || 0;
  const minValue = Number(params.minValue) || 0;

  const qs = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({
      client: clientSlug,
      status,
      sort,
      ...(minScore ? { minScore: String(minScore) } : {}),
      ...(minValue ? { minValue: String(minValue) } : {}),
      ...overrides,
    });
    return p.toString();
  };

  const [stats, leads] = await Promise.all([
    getStats(clientSlug),
    getLeads({ client: clientSlug, status, sort, minScore, minValue }),
  ]);

  const showClientColumn = clientSlug === "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-ink">Leads</h1>
          <p className="mt-1 text-sm text-slate">
            {showClientColumn
              ? `Across ${clients.length} ${clients.length === 1 ? "client" : "clients"}`
              : clients.find((c) => c.slug === clientSlug)?.name}
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile label="Open leads" value={String(stats.open)} />
            <StatTile label="Open pipeline" value={formatGBP(stats.pipeline_gbp)} />
            <StatTile label="Conversations" value={String(stats.conversations)} />
            <StatTile label="Requirements" value={String(stats.requirements)} highlight />
          </div>
          <Link href="/admin/leads/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5" aria-hidden /> Add lead
          </Link>
        </div>
      </div>

      <LeadFilterBar clients={clients} />

      <nav
        aria-label="Filter by status"
        className="flex flex-wrap gap-1 border-b border-line pb-px"
      >
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/leads?${qs({ status: f })}`}
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
              ? "No open leads match these filters right now."
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
                {showClientColumn && (
                  <th scope="col" className="px-4 py-3 font-medium">Client</th>
                )}
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
                  {showClientColumn && (
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-slate">
                      <Link
                        href={`/admin/leads?${qs({ client: lead.client_slug })}`}
                        className="rounded-md hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {lead.client_name}
                      </Link>
                    </td>
                  )}
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
