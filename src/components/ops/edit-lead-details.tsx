"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";

import {
  updateLeadDetailsAction,
  type EditLeadState,
} from "@/app/admin/actions";
import type { Enrichment } from "@/lib/ops/queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PendingButton } from "@/components/ops/pending-button";

/** Admin-only edit for the notice-level fields ContactCard and the
 * description display: mostly used to add context to the description
 * (call notes, corrections) or fill in contact details the scan/enrichment
 * didn't find. Edits the shared notice row, same as Companies House
 * enrichment does. */
export function EditLeadDetails({
  leadId,
  description,
  enrichment,
}: {
  leadId: number;
  description: string;
  enrichment: Enrichment | null;
}) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [state, formAction] = useActionState<EditLeadState, FormData>(
    updateLeadDetailsAction,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      setEditing(false);
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);

  if (!editing) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-blue">
              <Check className="size-3.5" aria-hidden /> Saved
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="size-3.5" aria-hidden /> Edit description & contact
        </Button>
      </div>
    );
  }

  const e = enrichment ?? {};

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-line bg-paper p-5">
      <input type="hidden" name="lead_id" value={leadId} />

      <div className="space-y-1.5">
        <Label htmlFor="edit_description">Description</Label>
        <Textarea
          id="edit_description"
          name="description"
          rows={6}
          defaultValue={description}
          placeholder="Scope of work, context, call notes..."
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="edit_contact_name">Contact name</Label>
          <Input id="edit_contact_name" name="contact_name" defaultValue={e.contact_name ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit_phone">Phone</Label>
          <Input id="edit_phone" name="phone" defaultValue={e.phone ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit_email">Email</Label>
          <Input id="edit_email" name="email" type="email" defaultValue={e.email ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit_website">Website</Label>
          <Input id="edit_website" name="website" defaultValue={e.website ?? ""} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="edit_address">Address</Label>
          <Input id="edit_address" name="address" defaultValue={e.address ?? ""} />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-xs text-destructive">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <PendingButton size="sm">Save</PendingButton>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setEditing(false)}
        >
          <X className="size-3.5" aria-hidden /> Cancel
        </Button>
      </div>
    </form>
  );
}
