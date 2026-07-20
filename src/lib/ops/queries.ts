import { sql } from "./db";

export const LEAD_STATUSES = [
  "new",
  "called",
  "conversation",
  "requirement",
  "dead",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadRow = {
  id: number;
  score: number;
  status: LeadStatus;
  sector_hint: string;
  region_hit: string;
  created_at: Date;
  ocid: string;
  title: string;
  buyer: string;
  winners: { name: string; id: string }[];
  value_gbp: number | null;
  award_date: string | null;
  evidence_url: string;
};

export type LeadDetail = LeadRow & {
  description: string;
  cpv_codes: string[];
  source: string;
};

export type LeadEvent = {
  id: number;
  status: string;
  note: string;
  created_at: Date;
};

export type Stats = {
  open: number;
  new_this_week: number;
  conversations: number;
  requirements: number;
  pipeline_gbp: number;
};

const LEAD_SELECT = sql`
  l.id, l.score, l.status, l.sector_hint, l.region_hit, l.created_at,
  n.ocid, n.title, n.buyer, n.winners, n.value_gbp::float8 as value_gbp,
  n.award_date::text as award_date, n.evidence_url
`;

export async function getClients(): Promise<{ slug: string; name: string }[]> {
  return sql`select slug, name from clients where active order by name`;
}

export async function getStats(client: string): Promise<Stats> {
  const [row] = await sql`
    select
      count(*) filter (where l.status = 'new')::int as open,
      count(*) filter (where l.created_at > now() - interval '7 days')::int as new_this_week,
      count(*) filter (where l.status = 'conversation')::int as conversations,
      count(*) filter (where l.status = 'requirement')::int as requirements,
      coalesce(sum(n.value_gbp) filter (where l.status = 'new'), 0)::float8 as pipeline_gbp
    from leads l join notices n on n.ocid = l.ocid
    where l.client_slug = ${client}`;
  return row as Stats;
}

export async function getLeads(
  client: string,
  status: LeadStatus | "all",
): Promise<LeadRow[]> {
  return sql`
    select ${LEAD_SELECT}
    from leads l join notices n on n.ocid = l.ocid
    where l.client_slug = ${client}
      and ${status === "all" ? sql`true` : sql`l.status = ${status}`}
    order by l.score desc, l.created_at desc
    limit 200` as unknown as Promise<LeadRow[]>;
}

export async function getLead(id: number): Promise<LeadDetail | null> {
  const rows = await sql`
    select ${LEAD_SELECT}, n.description, n.cpv_codes, n.source
    from leads l join notices n on n.ocid = l.ocid
    where l.id = ${id}`;
  return (rows[0] as LeadDetail) ?? null;
}

export async function getLeadEvents(leadId: number): Promise<LeadEvent[]> {
  return sql`
    select id, status, note, created_at from lead_events
    where lead_id = ${leadId} order by created_at desc`;
}

export async function getRecentRuns(limit = 5) {
  return sql`
    select id, client_slug, started_at, finished_at, source_counts, new_leads
    from runs order by started_at desc limit ${limit}`;
}
