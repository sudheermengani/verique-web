import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getClients } from "@/lib/ops/queries";
import { NewLeadForm } from "./new-lead-form";

export default async function NewLeadPage() {
  const clients = await getClients();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1 rounded-md text-sm text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden /> Leads
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          Add a lead manually
        </h1>
        <p className="mt-1 text-sm text-slate">
          For a real tip, a private subcontractor-opportunity notice the scan
          can&apos;t reach, or a correction for something the scan missed.
        </p>
      </header>
      <NewLeadForm clients={clients} />
    </div>
  );
}
