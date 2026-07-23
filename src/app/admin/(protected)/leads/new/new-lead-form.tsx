"use client";

import { useActionState } from "react";

import { addLeadManuallyAction, type AddLeadState } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PendingButton } from "@/components/ops/pending-button";

export function NewLeadForm({
  clients,
}: {
  clients: { slug: string; name: string }[];
}) {
  const [state, formAction] = useActionState<AddLeadState, FormData>(
    addLeadManuallyAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="client">Client</Label>
        <select
          id="client"
          name="client"
          required
          defaultValue=""
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        >
          <option value="" disabled>
            Choose a client
          </option>
          {clients.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="e.g. M6 Lune Gorge - Bored Piling Works" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="winner">Winner / company</Label>
          <Input id="winner" name="winner" required placeholder="Who to call" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="buyer">Buyer</Label>
          <Input id="buyer" name="buyer" placeholder="Who's paying (optional)" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="value_gbp">Value (£)</Label>
          <Input id="value_gbp" name="value_gbp" inputMode="numeric" placeholder="e.g. 400000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="award_date">Award date</Label>
          <Input id="award_date" name="award_date" type="date" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="site_address">Where the work happens</Label>
        <Input id="site_address" name="site_address" placeholder="Postcode or address (optional)" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="evidence_url">Evidence link</Label>
        <Input
          id="evidence_url"
          name="evidence_url"
          type="url"
          placeholder="https://... the notice/article this came from"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} placeholder="Scope of work, context, why this is a lead" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sector_hint">Sector label</Label>
          <Input id="sector_hint" name="sector_hint" placeholder="e.g. piling / foundations" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="score">Score</Label>
          <Input id="score" name="score" inputMode="numeric" placeholder="60" />
          <p className="text-xs text-slate">Same 0-100+ scale as scanned leads. Defaults to 60.</p>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-xs text-destructive">
          {state.error}
        </p>
      )}
      <PendingButton>Add lead</PendingButton>
    </form>
  );
}
