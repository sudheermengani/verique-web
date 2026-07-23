import { z } from "zod";

/**
 * The scan config for a lead_engine client, mirroring the Python
 * ClientConfig payload stored in clients.config (JSONB). The admin UI edits
 * this; the engine reads the same shape. Keep the two in sync.
 */

export const regionSchema = z.object({
  name: z.string().min(1),
  keywords: z.array(z.string()),
  postcode_areas: z.array(z.string()),
  roads: z.array(z.string()),
});

export const sectorSchema = z.object({
  label: z.string().min(1),
  cpv_prefixes: z.array(z.string()),
  keywords: z.array(z.string()),
  points: z.number().int(),
});

export const valueBandSchema = z.object({
  min_gbp: z.number().nullable(),
  max_gbp: z.number().nullable(),
  points: z.number().int(),
});

export const configSchema = z.object({
  sources: z.array(z.string()).min(1),
  qualify: z.object({
    cpv_prefixes: z.array(z.string()),
    fallback_keywords: z.array(z.string()),
    exclude_keywords: z.array(z.string()),
    min_value_gbp: z.number().nullable(),
    require_region: z.boolean(),
  }),
  regions: z.array(regionSchema),
  sectors: z.array(sectorSchema),
  scoring: z.object({
    base: z.number().int(),
    region_points: z.number().int(),
    default_sector_points: z.number().int(),
    freshness_days: z.number().int(),
    freshness_points: z.number().int(),
    value_bands: z.array(valueBandSchema),
  }),
  digest: z.object({ top_n: z.number().int() }),
});

export type ClientConfig = z.infer<typeof configSchema>;
export type Region = z.infer<typeof regionSchema>;
export type Sector = z.infer<typeof sectorSchema>;
export type ValueBand = z.infer<typeof valueBandSchema>;

export const AVAILABLE_SOURCES = [
  { id: "contracts_finder", label: "Contracts Finder (England)" },
  { id: "find_a_tender", label: "Find a Tender (high value)" },
] as const;

export const DEFAULT_CONFIG: ClientConfig = {
  sources: ["contracts_finder", "find_a_tender"],
  qualify: {
    cpv_prefixes: ["45"],
    fallback_keywords: ["construction", "civil engineering", "groundworks"],
    exclude_keywords: [],
    min_value_gbp: 250000,
    require_region: false,
  },
  regions: [],
  sectors: [],
  scoring: {
    base: 30,
    region_points: 20,
    default_sector_points: 5,
    freshness_days: 7,
    freshness_points: 5,
    value_bands: [
      { min_gbp: 1000000, max_gbp: 50000000, points: 15 },
      { min_gbp: 50000000, max_gbp: null, points: 8 },
      { min_gbp: 250000, max_gbp: 1000000, points: 6 },
    ],
  },
  digest: { top_n: 15 },
};

/** Parse a possibly-partial stored config, filling defaults so the editor
 * always has a complete object to render. */
export function normalizeConfig(raw: unknown): ClientConfig {
  const parsed = configSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_CONFIG;
}
