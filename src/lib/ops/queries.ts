import { sql } from "./db";

export const LEAD_STATUSES = [
  "new",
  "called",
  "conversation",
  "requirement",
  "dead",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Client = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  contact_name: string;
  contact_email: string;
  retainer_gbp: number | null;
  notes: string;
};

export type ClientWithStats = Client & {
  open: number;
  shared: number;
  requirements: number;
  pipeline_gbp: number;
};

export type Enrichment = {
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  contact_name?: string | null;
  website?: string | null;
  sources?: string[];
  // Companies House
  company_number?: string | null;
  status?: string | null;
  registered_office?: string | null;
  companies_house_url?: string | null;
  directors?: string[];
  incorporated?: string | null;
  sic_codes?: string[];
};

export type LeadRow = {
  id: number;
  score: number;
  status: LeadStatus;
  sector_hint: string;
  region_hit: string;
  shared: boolean;
  created_at: Date;
  ocid: string;
  title: string;
  buyer: string;
  winners: { name: string; id: string }[];
  value_gbp: number | null;
  award_date: string | null;
  evidence_url: string;
  enrichment: Enrichment | null;
};

export type LeadDetail = LeadRow & {
  description: string;
  cpv_codes: string[];
  source: string;
  client_slug: string;
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
  l.id, l.score, l.status, l.sector_hint, l.region_hit, l.shared, l.created_at,
  n.ocid, n.title, n.buyer, n.winners, n.value_gbp::float8 as value_gbp,
  n.award_date::text as award_date, n.evidence_url, n.enrichment
`;

export async function getClients(): Promise<{ slug: string; name: string }[]> {
  return sql`select slug, name from clients where active order by name`;
}

export async function getCategories(): Promise<string[]> {
  const rows = await sql<{ category: string }[]>`
    select distinct category from clients
    where active and category <> '' order by category`;
  return rows.map((r) => r.category);
}

/** Admin roster: every client with headline numbers. */
export async function getClientsWithStats(): Promise<ClientWithStats[]> {
  return sql<ClientWithStats[]>`
    select
      c.slug, c.name, c.category, c.kind, c.contact_name, c.contact_email,
      c.retainer_gbp::float8 as retainer_gbp, c.notes,
      count(l.id) filter (where l.status = 'new')::int as open,
      count(l.id) filter (where l.shared)::int as shared,
      count(l.id) filter (where l.status = 'requirement')::int as requirements,
      coalesce(sum(n.value_gbp) filter (where l.status = 'new'), 0)::float8 as pipeline_gbp
    from clients c
    left join leads l on l.client_slug = c.slug
    left join notices n on n.ocid = l.ocid
    where c.active
    group by c.slug
    order by c.name`;
}

export async function getClient(slug: string): Promise<Client | null> {
  const rows = await sql<Client[]>`
    select slug, name, category, kind, contact_name, contact_email,
      retainer_gbp::float8 as retainer_gbp, notes
    from clients where slug = ${slug}`;
  return rows[0] ?? null;
}

export async function getClientConfig(slug: string): Promise<unknown | null> {
  const rows = await sql<{ config: unknown }[]>`
    select config from clients where slug = ${slug}`;
  return rows[0]?.config ?? null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const rows = await sql`select 1 from clients where slug = ${slug} limit 1`;
  return rows.length > 0;
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

/** Admin workbench: leads for a client, optionally filtered by status. */
export async function getLeads(
  client: string,
  status: LeadStatus | "all",
): Promise<LeadRow[]> {
  return sql<LeadRow[]>`
    select ${LEAD_SELECT}
    from leads l join notices n on n.ocid = l.ocid
    where l.client_slug = ${client}
      and ${status === "all" ? sql`true` : sql`l.status = ${status}`}
    order by l.score desc, l.created_at desc
    limit 200`;
}

/** Client-facing: only the leads the admin chose to share. */
export async function getSharedLeads(client: string): Promise<LeadRow[]> {
  return sql<LeadRow[]>`
    select ${LEAD_SELECT}
    from leads l join notices n on n.ocid = l.ocid
    where l.client_slug = ${client} and l.shared
    order by l.score desc, l.created_at desc`;
}

export async function getLead(id: number): Promise<LeadDetail | null> {
  const rows = await sql<LeadDetail[]>`
    select ${LEAD_SELECT}, n.description, n.cpv_codes, n.source, l.client_slug
    from leads l join notices n on n.ocid = l.ocid
    where l.id = ${id}`;
  return rows[0] ?? null;
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

// --- client users (portal logins) ---------------------------------------

export type ClientUser = {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  last_login_at: Date | null;
};

export async function getClientUsers(slug: string): Promise<ClientUser[]> {
  return sql<ClientUser[]>`
    select id, email, name, created_at, last_login_at
    from client_users where client_slug = ${slug} order by email`;
}

/** Which client an authorised email belongs to, or null. */
export async function findClientByEmail(email: string): Promise<string | null> {
  const rows = await sql<{ client_slug: string }[]>`
    select client_slug from client_users
    where lower(email) = ${email.trim().toLowerCase()} limit 1`;
  return rows[0]?.client_slug ?? null;
}

export async function touchClientUserLogin(email: string): Promise<void> {
  await sql`update client_users set last_login_at = now()
            where lower(email) = ${email.trim().toLowerCase()}`;
}

// --- payments ------------------------------------------------------------

export type Payment = {
  id: number;
  period: string;
  amount_gbp: number;
  status: "due" | "paid";
  due_date: string | null;
  paid_at: Date | null;
  note: string;
};

export async function getPayments(slug: string): Promise<Payment[]> {
  return sql<Payment[]>`
    select id, period, amount_gbp::float8 as amount_gbp, status,
      due_date::text as due_date, paid_at, note
    from payments where client_slug = ${slug}
    order by created_at desc`;
}

export async function getPaymentTotals(
  slug: string,
): Promise<{ paid: number; due: number }> {
  const [row] = await sql`
    select
      coalesce(sum(amount_gbp) filter (where status = 'paid'), 0)::float8 as paid,
      coalesce(sum(amount_gbp) filter (where status = 'due'), 0)::float8 as due
    from payments where client_slug = ${slug}`;
  return row as { paid: number; due: number };
}
