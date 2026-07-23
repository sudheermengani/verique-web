"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

import {
  updateClientConfigAction,
  type ConfigSaveState,
} from "@/app/admin/actions";
import {
  AVAILABLE_SOURCES,
  type ClientConfig,
} from "@/lib/ops/client-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PendingButton } from "@/components/ops/pending-button";

// Editor state keeps list fields as comma-separated strings so typing feels
// natural; we convert to the real array shape only on submit.
type EditRegion = { name: string; keywords: string; postcodes: string; roads: string };
type EditSector = { label: string; cpv: string; keywords: string; points: number };
type EditBand = { min: string; max: string; points: number };

const csv = (s: string): string[] =>
  s.split(",").map((x) => x.trim()).filter(Boolean);
const join = (a: string[]): string => a.join(", ");
const numOrNull = (s: string): number | null =>
  s.trim() === "" ? null : Number(s);

function toEdit(c: ClientConfig) {
  return {
    sources: c.sources,
    cpv_prefixes: join(c.qualify.cpv_prefixes),
    fallback_keywords: join(c.qualify.fallback_keywords),
    exclude_keywords: join(c.qualify.exclude_keywords),
    min_value: c.qualify.min_value_gbp?.toString() ?? "",
    require_region: c.qualify.require_region,
    regions: c.regions.map((r) => ({
      name: r.name,
      keywords: join(r.keywords),
      postcodes: join(r.postcode_areas),
      roads: join(r.roads),
    })) as EditRegion[],
    sectors: c.sectors.map((s) => ({
      label: s.label,
      cpv: join(s.cpv_prefixes),
      keywords: join(s.keywords),
      points: s.points,
    })) as EditSector[],
    base: c.scoring.base,
    region_points: c.scoring.region_points,
    default_sector_points: c.scoring.default_sector_points,
    freshness_days: c.scoring.freshness_days,
    freshness_points: c.scoring.freshness_points,
    bands: c.scoring.value_bands.map((b) => ({
      min: b.min_gbp?.toString() ?? "",
      max: b.max_gbp?.toString() ?? "",
      points: b.points,
    })) as EditBand[],
    top_n: c.digest.top_n,
  };
}

type EditState = ReturnType<typeof toEdit>;

function toConfig(e: EditState): ClientConfig {
  return {
    sources: e.sources,
    qualify: {
      cpv_prefixes: csv(e.cpv_prefixes),
      fallback_keywords: csv(e.fallback_keywords),
      exclude_keywords: csv(e.exclude_keywords),
      min_value_gbp: numOrNull(e.min_value),
      require_region: e.require_region,
    },
    regions: e.regions.map((r) => ({
      name: r.name,
      keywords: csv(r.keywords),
      postcode_areas: csv(r.postcodes),
      roads: csv(r.roads),
    })),
    sectors: e.sectors.map((s) => ({
      label: s.label,
      cpv_prefixes: csv(s.cpv),
      keywords: csv(s.keywords),
      points: Number(s.points) || 0,
    })),
    scoring: {
      base: Number(e.base) || 0,
      region_points: Number(e.region_points) || 0,
      default_sector_points: Number(e.default_sector_points) || 0,
      freshness_days: Number(e.freshness_days) || 0,
      freshness_points: Number(e.freshness_points) || 0,
      value_bands: e.bands.map((b) => ({
        min_gbp: numOrNull(b.min),
        max_gbp: numOrNull(b.max),
        points: Number(b.points) || 0,
      })),
    },
    digest: { top_n: Number(e.top_n) || 15 },
  };
}

export function ConfigEditor({
  slug,
  initial,
}: {
  slug: string;
  initial: ClientConfig;
}) {
  const [e, setE] = useState<EditState>(() => toEdit(initial));
  const [state, formAction] = useActionState<ConfigSaveState, FormData>(
    updateClientConfigAction,
    {},
  );
  const set = (patch: Partial<EditState>) => setE((prev) => ({ ...prev, ...patch }));

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // After a successful <form action> submission, the browser performs a
    // native form reset that snaps checkbox `.checked` DOM properties back to
    // their page-load values — even for ones React considers controlled.
    // React's diffing then skips re-writing them because its own record of
    // the value hasn't changed. Force the DOM back in sync with `e` directly.
    if (!state.ok || !formRef.current) return;
    const form = formRef.current;
    const regionCb = form.querySelector<HTMLInputElement>('[data-field="require_region"]');
    if (regionCb) regionCb.checked = e.require_region;
    form.querySelectorAll<HTMLInputElement>("[data-source-id]").forEach((el) => {
      el.checked = e.sources.includes(el.dataset.sourceId!);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="config" value={JSON.stringify(toConfig(e))} />

      {/* sources */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">Data sources</legend>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_SOURCES.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                data-source-id={s.id}
                checked={e.sources.includes(s.id)}
                onChange={(ev) =>
                  set({
                    sources: ev.target.checked
                      ? [...e.sources, s.id]
                      : e.sources.filter((x) => x !== s.id),
                  })
                }
                className="size-4 rounded border-line"
              />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* qualify */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-ink">What qualifies</legend>
        <TextRow
          label="CPV code prefixes"
          hint="Comma-separated. 45 = construction."
          value={e.cpv_prefixes}
          onChange={(v) => set({ cpv_prefixes: v })}
        />
        <div className="space-y-1.5">
          <Label htmlFor="fk">Fallback keywords</Label>
          <Textarea
            id="fk"
            rows={2}
            value={e.fallback_keywords}
            onChange={(ev) => set({ fallback_keywords: ev.target.value })}
          />
          <p className="text-xs text-slate">
            Comma-separated. Used when a notice has missing/wrong CPV codes.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ek">Exclude keywords</Label>
          <Textarea
            id="ek"
            rows={2}
            value={e.exclude_keywords}
            onChange={(ev) => set({ exclude_keywords: ev.target.value })}
          />
          <p className="text-xs text-slate">
            Comma-separated. Vetoes a match even if the CPV code or a fallback
            keyword matched — e.g. a broad &ldquo;45&rdquo; CPV prefix covers
            kitchen fit-outs as well as groundworks, so add &ldquo;kitchen&rdquo;
            here to drop those.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-40 space-y-1.5">
            <Label htmlFor="mv">Minimum value (£)</Label>
            <Input
              id="mv"
              inputMode="numeric"
              value={e.min_value}
              onChange={(ev) => set({ min_value: ev.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm text-ink">
            <input
              type="checkbox"
              data-field="require_region"
              checked={e.require_region}
              onChange={(ev) => set({ require_region: ev.target.checked })}
              className="size-4 rounded border-line"
            />
            Require a region match
          </label>
        </div>
      </fieldset>

      {/* regions */}
      <fieldset className="space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium text-ink">Regions</legend>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              set({
                regions: [
                  ...e.regions,
                  { name: "", keywords: "", postcodes: "", roads: "" },
                ],
              })
            }
          >
            <Plus className="size-3.5" aria-hidden /> Add region
          </Button>
        </div>
        {e.regions.length === 0 && (
          <p className="text-xs text-slate">
            No regions — with &ldquo;require region&rdquo; off, leads come from
            anywhere in the UK.
          </p>
        )}
        {e.regions.map((r, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-line p-3">
            <div className="flex items-center gap-2">
              <Input
                aria-label="Region name"
                placeholder="Region name"
                value={r.name}
                onChange={(ev) =>
                  set({
                    regions: e.regions.map((x, j) =>
                      j === i ? { ...x, name: ev.target.value } : x,
                    ),
                  })
                }
              />
              <RemoveButton
                label="Remove region"
                onClick={() =>
                  set({ regions: e.regions.filter((_, j) => j !== i) })
                }
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <SmallField
                label="Place keywords"
                value={r.keywords}
                onChange={(v) =>
                  set({
                    regions: e.regions.map((x, j) =>
                      j === i ? { ...x, keywords: v } : x,
                    ),
                  })
                }
              />
              <SmallField
                label="Postcode areas"
                value={r.postcodes}
                onChange={(v) =>
                  set({
                    regions: e.regions.map((x, j) =>
                      j === i ? { ...x, postcodes: v } : x,
                    ),
                  })
                }
              />
              <SmallField
                label="Road corridors"
                value={r.roads}
                onChange={(v) =>
                  set({
                    regions: e.regions.map((x, j) =>
                      j === i ? { ...x, roads: v } : x,
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}
      </fieldset>

      {/* sectors */}
      <fieldset className="space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium text-ink">
            Priority sectors
          </legend>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              set({
                sectors: [
                  ...e.sectors,
                  { label: "", cpv: "", keywords: "", points: 10 },
                ],
              })
            }
          >
            <Plus className="size-3.5" aria-hidden /> Add sector
          </Button>
        </div>
        {e.sectors.map((s, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-line p-3">
            <div className="flex items-center gap-2">
              <Input
                aria-label="Sector label"
                placeholder="Sector label (e.g. railway works)"
                value={s.label}
                onChange={(ev) =>
                  set({
                    sectors: e.sectors.map((x, j) =>
                      j === i ? { ...x, label: ev.target.value } : x,
                    ),
                  })
                }
              />
              <div className="w-24 shrink-0">
                <Input
                  aria-label="Points"
                  inputMode="numeric"
                  value={s.points}
                  onChange={(ev) =>
                    set({
                      sectors: e.sectors.map((x, j) =>
                        j === i
                          ? { ...x, points: Number(ev.target.value) || 0 }
                          : x,
                      ),
                    })
                  }
                />
              </div>
              <RemoveButton
                label="Remove sector"
                onClick={() =>
                  set({ sectors: e.sectors.filter((_, j) => j !== i) })
                }
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <SmallField
                label="CPV prefixes"
                value={s.cpv}
                onChange={(v) =>
                  set({
                    sectors: e.sectors.map((x, j) =>
                      j === i ? { ...x, cpv: v } : x,
                    ),
                  })
                }
              />
              <SmallField
                label="Keywords"
                value={s.keywords}
                onChange={(v) =>
                  set({
                    sectors: e.sectors.map((x, j) =>
                      j === i ? { ...x, keywords: v } : x,
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}
      </fieldset>

      {/* scoring */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-ink">Scoring weights</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <NumField label="Base" value={e.base} onChange={(v) => set({ base: v })} />
          <NumField
            label="Region bonus"
            value={e.region_points}
            onChange={(v) => set({ region_points: v })}
          />
          <NumField
            label="Default sector"
            value={e.default_sector_points}
            onChange={(v) => set({ default_sector_points: v })}
          />
          <NumField
            label="Freshness days"
            value={e.freshness_days}
            onChange={(v) => set({ freshness_days: v })}
          />
          <NumField
            label="Freshness bonus"
            value={e.freshness_points}
            onChange={(v) => set({ freshness_points: v })}
          />
          <NumField
            label="Digest size"
            value={e.top_n}
            onChange={(v) => set({ top_n: v })}
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-medium text-ink">Value bands</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              set({ bands: [...e.bands, { min: "", max: "", points: 0 }] })
            }
          >
            <Plus className="size-3.5" aria-hidden /> Add band
          </Button>
        </div>
        {e.bands.map((b, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <SmallField
              label="Min £"
              value={b.min}
              onChange={(v) =>
                set({ bands: e.bands.map((x, j) => (j === i ? { ...x, min: v } : x)) })
              }
            />
            <SmallField
              label="Max £"
              value={b.max}
              onChange={(v) =>
                set({ bands: e.bands.map((x, j) => (j === i ? { ...x, max: v } : x)) })
              }
            />
            <SmallField
              label="Points"
              value={String(b.points)}
              onChange={(v) =>
                set({
                  bands: e.bands.map((x, j) =>
                    j === i ? { ...x, points: Number(v) || 0 } : x,
                  ),
                })
              }
            />
            <RemoveButton
              label="Remove band"
              onClick={() => set({ bands: e.bands.filter((_, j) => j !== i) })}
            />
          </div>
        ))}
      </fieldset>

      <div className="flex items-center gap-3">
        <PendingButton>Save configuration</PendingButton>
        {state.ok && (
          <span className="inline-flex items-center gap-1 text-xs text-blue">
            <Check className="size-3.5" aria-hidden /> Saved
          </span>
        )}
        {state.error && (
          <span role="alert" className="text-xs text-destructive">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

function TextRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(ev) => onChange(ev.target.value)} />
      {hint && <p className="text-xs text-slate">{hint}</p>}
    </div>
  );
}

function SmallField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 space-y-1">
      <Label className="text-xs text-slate">{label}</Label>
      <Input value={value} onChange={(ev) => onChange(ev.target.value)} />
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate">{label}</Label>
      <Input
        inputMode="numeric"
        value={value}
        onChange={(ev) => onChange(Number(ev.target.value) || 0)}
      />
    </div>
  );
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className="shrink-0"
    >
      <Trash2 className="size-3.5" aria-hidden />
    </Button>
  );
}
