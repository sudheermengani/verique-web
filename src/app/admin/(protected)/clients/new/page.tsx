import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { NewClientForm } from "./new-client-form";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 rounded-md text-sm text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden /> Clients
      </Link>
      <header>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          Add a client
        </h1>
        <p className="mt-1 text-sm text-slate">
          Creates the client. You&apos;ll set up scan rules and portal access next.
        </p>
      </header>
      <NewClientForm />
    </div>
  );
}
