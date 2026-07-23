import Link from "next/link";
import { ArrowUpRight, Plus, Users } from "lucide-react";

import { getClientsWithStats } from "@/lib/ops/queries";
import { formatGBP } from "@/lib/ops/format";
import { buttonVariants } from "@/components/ui/button";
import { RunScanButton } from "@/components/ops/run-scan-button";

const KIND_LABEL: Record<string, string> = {
  lead_engine: "Lead engine",
  ads: "Ads",
};

export default async function AdminClientsPage() {
  const clients = await getClientsWithStats();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-ink">Clients</h1>
          <p className="mt-1 text-sm text-slate">
            {clients.length} active {clients.length === 1 ? "client" : "clients"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RunScanButton label="Run scan now (all clients)" />
          <Link href="/admin/clients/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5" aria-hidden /> Add client
          </Link>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-paper py-16 text-center">
          <Users className="size-8 text-slate" aria-hidden />
          <div>
            <p className="font-medium text-ink">No clients yet</p>
            <p className="mt-1 text-sm text-slate">
              Add one with <code className="text-xs">verique new-client</code> and
              run the engine.
            </p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {clients.map((c) => (
            <li
              key={c.slug}
              className="rounded-xl border border-line bg-paper p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading font-semibold text-ink">
                    {c.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate">
                    {c.category || "—"} · {KIND_LABEL[c.kind] ?? c.kind}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full border border-line px-2 py-0.5 text-[0.65rem] text-slate">
                    {c.retainer_gbp ? `${formatGBP(c.retainer_gbp)}/mo` : "no retainer set"}
                  </span>
                  {c.kind === "lead_engine" && (
                    <RunScanButton client={c.slug} label="Run now" />
                  )}
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Metric label="Open" value={c.open} />
                <Metric label="Shared" value={c.shared} />
                <Metric label="Reqs" value={c.requirements} />
              </dl>

              <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/leads?client=${c.slug}`}
                    className="rounded-md font-medium text-ink hover:text-blue focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    Work leads →
                  </Link>
                  <Link
                    href={`/admin/clients/${c.slug}`}
                    className="rounded-md text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    Settings
                  </Link>
                </div>
                <Link
                  href={`/client/${c.slug}`}
                  className="inline-flex items-center gap-1 rounded-md text-blue hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Client page <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-paper-tint py-2">
      <p className="font-mono text-lg font-medium text-ink">{value}</p>
      <p className="text-[0.6rem] tracking-wide text-slate uppercase">{label}</p>
    </div>
  );
}
