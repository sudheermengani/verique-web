"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function OpsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="size-4" aria-hidden />
        <p className="text-sm font-medium">Couldn&apos;t load the dashboard</p>
      </div>
      <p className="text-sm text-slate">
        Usually this means the database isn&apos;t reachable. Check that
        Postgres is running, then try again.
      </p>
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
