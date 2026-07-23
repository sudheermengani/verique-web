"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClientOption = { slug: string; name: string };

const SORTS = [
  { value: "score", label: "Score (highest first)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "value", label: "Value (highest first)" },
];

export function LeadFilterBar({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Local echo of the numeric inputs so typing feels instant; committed to
  // the URL on blur/change rather than every keystroke.
  const [minScore, setMinScore] = useState(searchParams.get("minScore") ?? "");
  const [minValue, setMinValue] = useState(searchParams.get("minValue") ?? "");

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    startTransition(() => {
      router.replace(`?${next.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-paper p-3">
      <div className="w-40 space-y-1">
        <Label htmlFor="filter-client" className="text-xs text-slate">
          Client
        </Label>
        <select
          id="filter-client"
          value={searchParams.get("client") ?? "all"}
          onChange={(e) => update({ client: e.target.value })}
          className="h-9 w-full rounded-lg border border-line bg-paper px-2 text-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <option value="all">All clients</option>
          {clients.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-44 space-y-1">
        <Label htmlFor="filter-sort" className="text-xs text-slate">
          Sort by
        </Label>
        <select
          id="filter-sort"
          value={searchParams.get("sort") ?? "score"}
          onChange={(e) => update({ sort: e.target.value })}
          className="h-9 w-full rounded-lg border border-line bg-paper px-2 text-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-28 space-y-1">
        <Label htmlFor="filter-min-score" className="text-xs text-slate">
          Min score
        </Label>
        <Input
          id="filter-min-score"
          inputMode="numeric"
          placeholder="0"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
          onBlur={() => update({ minScore })}
        />
      </div>

      <div className="w-32 space-y-1">
        <Label htmlFor="filter-min-value" className="text-xs text-slate">
          Min value (£)
        </Label>
        <Input
          id="filter-min-value"
          inputMode="numeric"
          placeholder="0"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          onBlur={() => update({ minValue })}
        />
      </div>

      {(minScore || minValue || (searchParams.get("client") ?? "all") !== "all") && (
        <button
          type="button"
          onClick={() => {
            setMinScore("");
            setMinValue("");
            update({ client: "all", minScore: "", minValue: "" });
          }}
          className="h-9 rounded-lg px-3 text-xs text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
