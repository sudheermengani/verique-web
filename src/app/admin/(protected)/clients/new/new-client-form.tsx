"use client";

import { useActionState, useState } from "react";

import {
  createClientAction,
  type CreateClientState,
} from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PendingButton } from "@/components/ops/pending-button";
import { cn } from "@/lib/utils";

const KINDS = [
  {
    id: "lead_engine",
    title: "Lead engine",
    desc: "We scan public contract awards and surface leads.",
  },
  {
    id: "ads",
    title: "Ads / marketing",
    desc: "We run campaigns and log results. No scanning.",
  },
] as const;

export function NewClientForm() {
  const [state, formAction] = useActionState<CreateClientState, FormData>(
    createClientAction,
    {},
  );
  const [kind, setKind] = useState<"lead_engine" | "ads">("lead_engine");

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Client name</Label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="off"
          placeholder="e.g. Acme Civils"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium text-ink">Type</legend>
        <input type="hidden" name="kind" value={kind} />
        <div className="grid gap-2 sm:grid-cols-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                kind === k.id
                  ? "border-ink bg-paper-tint"
                  : "border-line hover:border-slate/40",
              )}
            >
              <p className="text-sm font-medium text-ink">{k.title}</p>
              <p className="mt-0.5 text-xs text-slate">{k.desc}</p>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          autoComplete="off"
          placeholder="e.g. Construction & Civils Labour"
        />
        <p className="text-xs text-slate">
          A human label for grouping clients. Optional.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="text-xs text-destructive">
          {state.error}
        </p>
      )}
      <PendingButton>Create client</PendingButton>
    </form>
  );
}
