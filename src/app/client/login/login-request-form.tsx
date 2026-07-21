"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";

import { requestMagicLinkAction, type LinkState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PendingButton } from "@/components/ops/pending-button";

export function LoginRequestForm() {
  const [state, formAction] = useActionState<LinkState, FormData>(
    requestMagicLinkAction,
    {},
  );

  if (state.sent) {
    return (
      <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-line bg-paper-tint p-6 text-center">
        <MailCheck className="size-6 text-blue" aria-hidden />
        <p className="text-sm font-medium text-ink">Check your inbox</p>
        <p className="text-xs text-slate">
          If that email is registered, a sign-in link is on its way. It expires
          in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          placeholder="you@company.co.uk"
          aria-invalid={state.error ? "true" : undefined}
          aria-describedby={state.error ? "email-error" : undefined}
        />
      </div>
      {state.error && (
        <p id="email-error" role="alert" className="text-xs text-destructive">
          {state.error}
        </p>
      )}
      <PendingButton className="w-full">Send sign-in link</PendingButton>
    </form>
  );
}
