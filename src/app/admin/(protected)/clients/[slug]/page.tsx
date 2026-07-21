import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Mail, Trash2 } from "lucide-react";

import {
  getClient,
  getClientConfig,
  getClientUsers,
  getPayments,
  getPaymentTotals,
} from "@/lib/ops/queries";
import { normalizeConfig } from "@/lib/ops/client-config";
import { ConfigEditor } from "@/components/ops/config-editor";
import {
  addClientUserAction,
  addPaymentAction,
  markPaymentPaidAction,
  removeClientUserAction,
  sendClientLinkAction,
  updateClientAction,
} from "../../../actions";
import { formatDate, formatGBP } from "@/lib/ops/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PendingButton } from "@/components/ops/pending-button";

export default async function ClientSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [client, users, payments, totals, rawConfig] = await Promise.all([
    getClient(slug),
    getClientUsers(slug),
    getPayments(slug),
    getPaymentTotals(slug),
    getClientConfig(slug),
  ]);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 rounded-md text-sm text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" aria-hidden /> Clients
        </Link>
        <Link
          href={`/client/${slug}`}
          className="inline-flex items-center gap-1 rounded-md text-sm text-blue hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          View client page <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <header>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          {client.name}
        </h1>
        <p className="mt-1 text-sm text-slate">Client settings</p>
      </header>

      {/* --- basics --- */}
      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="font-heading font-semibold text-ink">Details</h2>
        <form action={updateClientAction} className="mt-4 space-y-4">
          <input type="hidden" name="slug" value={slug} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Name" defaultValue={client.name} required />
            <Field
              name="category"
              label="Category"
              defaultValue={client.category}
              placeholder="e.g. Construction & Civils Labour"
            />
            <div className="space-y-1.5">
              <Label htmlFor="kind">Type</Label>
              <select
                id="kind"
                name="kind"
                defaultValue={client.kind}
                className="h-9 w-full rounded-lg border border-line bg-paper px-3 text-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <option value="lead_engine">Lead engine</option>
                <option value="ads">Ads</option>
              </select>
            </div>
            <Field
              name="retainer_gbp"
              label="Monthly retainer (£)"
              defaultValue={client.retainer_gbp?.toString() ?? ""}
              inputMode="numeric"
              placeholder="e.g. 1500"
            />
            <Field
              name="contact_name"
              label="Primary contact"
              defaultValue={client.contact_name}
            />
            <Field
              name="contact_email"
              label="Contact email"
              type="email"
              defaultValue={client.contact_email}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={client.notes} />
          </div>
          <PendingButton>Save details</PendingButton>
        </form>
      </section>

      {/* --- scan configuration (lead engine only) --- */}
      {client.kind === "lead_engine" && (
        <section className="rounded-xl border border-line bg-paper p-5">
          <h2 className="font-heading font-semibold text-ink">
            Scan configuration
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate">
            What the engine looks for each morning. Changes apply on the next run.
          </p>
          <ConfigEditor slug={slug} initial={normalizeConfig(rawConfig)} />
        </section>
      )}

      {/* --- portal access --- */}
      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="font-heading font-semibold text-ink">Portal access</h2>
        <p className="mt-1 text-sm text-slate">
          Authorised emails can sign in at <code className="text-xs">/client/login</code>{" "}
          with a magic link — no password.
        </p>

        {users.length > 0 && (
          <ul className="mt-4 divide-y divide-line/60">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{u.email}</p>
                  <p className="text-xs text-slate">
                    {u.last_login_at
                      ? `last signed in ${formatDate(u.last_login_at)}`
                      : "never signed in"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <form action={sendClientLinkAction}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="email" value={u.email} />
                    <PendingButton variant="ghost" size="sm">
                      <Mail className="size-3.5" aria-hidden /> Send link
                    </PendingButton>
                  </form>
                  <form action={removeClientUserAction}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <PendingButton
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${u.email}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </PendingButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form action={addClientUserAction} className="mt-4 flex flex-wrap items-end gap-2">
          <input type="hidden" name="slug" value={slug} />
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="new-user-email">Add authorised email</Label>
            <Input
              id="new-user-email"
              name="email"
              type="email"
              autoComplete="off"
              spellCheck={false}
              required
              placeholder="contact@theircompany.co.uk"
            />
          </div>
          <PendingButton variant="secondary">Add</PendingButton>
        </form>
      </section>

      {/* --- payments --- */}
      <section className="rounded-xl border border-line bg-paper p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading font-semibold text-ink">Payments</h2>
          <p className="text-xs text-slate">
            Paid <span className="font-mono text-ink">{formatGBP(totals.paid)}</span>
            {" · "}Outstanding{" "}
            <span className="font-mono text-ink">{formatGBP(totals.due)}</span>
          </p>
        </div>

        {payments.length > 0 && (
          <ul className="mt-4 divide-y divide-line/60">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-sm text-ink">
                    {p.period || "—"} ·{" "}
                    <span className="font-mono">{formatGBP(p.amount_gbp)}</span>
                  </p>
                  <p className="text-xs text-slate capitalize">
                    {p.status}
                    {p.paid_at ? ` · ${formatDate(p.paid_at)}` : ""}
                  </p>
                </div>
                {p.status === "due" && (
                  <form action={markPaymentPaidAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <PendingButton variant="secondary" size="sm">
                      Mark paid
                    </PendingButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}

        <form action={addPaymentAction} className="mt-4 flex flex-wrap items-end gap-2">
          <input type="hidden" name="slug" value={slug} />
          <div className="w-28 space-y-1.5">
            <Label htmlFor="period">Period</Label>
            <Input id="period" name="period" placeholder="Jul 2026" />
          </div>
          <div className="w-28 space-y-1.5">
            <Label htmlFor="amount">Amount (£)</Label>
            <Input
              id="amount"
              name="amount_gbp"
              inputMode="numeric"
              required
              placeholder="1500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pstatus">Status</Label>
            <select
              id="pstatus"
              name="status"
              defaultValue="due"
              className="h-9 rounded-lg border border-line bg-paper px-3 text-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <option value="due">Due</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <PendingButton variant="secondary">Record</PendingButton>
        </form>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required,
  placeholder,
  inputMode,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "numeric";
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        spellCheck={false}
      />
    </div>
  );
}
