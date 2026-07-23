"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { sql } from "@/lib/ops/db";
import {
  createMagicToken,
  createSession,
  destroySession,
  requireSession,
  verifyCredentials,
} from "@/lib/ops/auth";
import { LEAD_STATUSES, slugExists, type LeadStatus } from "@/lib/ops/queries";
import { sendMagicLink } from "@/lib/ops/email";
import { configSchema, DEFAULT_CONFIG } from "@/lib/ops/client-config";
import { triggerScan } from "@/lib/ops/scan";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  if (!verifyCredentials(email, password)) {
    return { error: "That email and password combination isn't right." };
  }
  await createSession(email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function setLeadStatusAction(formData: FormData): Promise<void> {
  await requireSession();
  const leadId = Number(formData.get("lead_id"));
  const status = String(formData.get("status")) as LeadStatus;
  const note = String(formData.get("note") ?? "").trim();
  if (!Number.isInteger(leadId) || !LEAD_STATUSES.includes(status)) return;

  await sql.begin(async (tx) => {
    await tx`update leads set status = ${status} where id = ${leadId}`;
    await tx`insert into lead_events (lead_id, status, note, created_at)
             values (${leadId}, ${status}, ${note}, now())`;
  });
  revalidatePath("/admin", "layout");
}

/** Toggle whether a lead appears on the client's own /client/<slug> page. */
export async function toggleShareAction(formData: FormData): Promise<void> {
  await requireSession();
  const leadId = Number(formData.get("lead_id"));
  const share = formData.get("share") === "true";
  if (!Number.isInteger(leadId)) return;

  await sql`
    update leads
    set shared = ${share}, shared_at = ${share ? sql`now()` : null}
    where id = ${leadId}`;
  revalidatePath("/admin", "layout");
  revalidatePath("/client", "layout");
}

// --- client settings ----------------------------------------------------

export async function updateClientAction(formData: FormData): Promise<void> {
  await requireSession();
  const slug = String(formData.get("slug"));
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const kind = String(formData.get("kind") ?? "lead_engine");
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const retainerRaw = String(formData.get("retainer_gbp") ?? "").trim();
  const retainer = retainerRaw ? Number(retainerRaw) : null;
  if (!slug || !name) return;

  await sql`
    update clients set
      name = ${name}, category = ${category}, kind = ${kind},
      contact_name = ${contactName}, contact_email = ${contactEmail},
      notes = ${notes},
      retainer_gbp = ${retainer !== null && !Number.isNaN(retainer) ? retainer : null}
    where slug = ${slug}`;
  revalidatePath("/admin", "layout");
}

export async function addClientUserAction(formData: FormData): Promise<void> {
  await requireSession();
  const slug = String(formData.get("slug"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  if (!slug || !email) return;
  await sql`
    insert into client_users (client_slug, email, name, created_at)
    values (${slug}, ${email}, ${name}, now())
    on conflict (email) do nothing`;
  revalidatePath(`/admin/clients/${slug}`);
}

export async function removeClientUserAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  const slug = String(formData.get("slug"));
  if (!Number.isInteger(id)) return;
  await sql`delete from client_users where id = ${id}`;
  revalidatePath(`/admin/clients/${slug}`);
}

export async function sendClientLinkAction(formData: FormData): Promise<void> {
  await requireSession();
  const slug = String(formData.get("slug"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!slug || !email) return;
  const token = createMagicToken(email, slug);
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const url = `${proto}://${host}/client/auth?token=${encodeURIComponent(token)}`;
  await sendMagicLink(email, url);
  revalidatePath(`/admin/clients/${slug}`);
}

export async function addPaymentAction(formData: FormData): Promise<void> {
  await requireSession();
  const slug = String(formData.get("slug"));
  const period = String(formData.get("period") ?? "").trim();
  const amount = Number(formData.get("amount_gbp"));
  const status = formData.get("status") === "paid" ? "paid" : "due";
  if (!slug || !Number.isFinite(amount) || amount <= 0) return;
  await sql`
    insert into payments (client_slug, period, amount_gbp, status, paid_at, created_at)
    values (${slug}, ${period}, ${amount}, ${status},
            ${status === "paid" ? sql`now()` : null}, now())`;
  revalidatePath(`/admin/clients/${slug}`);
}

export async function markPaymentPaidAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  const slug = String(formData.get("slug"));
  if (!Number.isInteger(id)) return;
  await sql`update payments set status = 'paid', paid_at = now() where id = ${id}`;
  revalidatePath(`/admin/clients/${slug}`);
}

// --- create client + edit scan config -----------------------------------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export type CreateClientState = { error?: string };

export async function createClientAction(
  _prev: CreateClientState,
  formData: FormData,
): Promise<CreateClientState> {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const kind = formData.get("kind") === "ads" ? "ads" : "lead_engine";
  const category = String(formData.get("category") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  if (!name) return { error: "Enter a client name." };
  if (!slug) return { error: "Couldn't derive a valid slug — add letters or digits." };
  if (await slugExists(slug)) return { error: `A client with slug "${slug}" already exists.` };

  const config = kind === "lead_engine" ? DEFAULT_CONFIG : null;
  await sql`
    insert into clients (slug, name, kind, category, config, active, created_at)
    values (${slug}, ${name}, ${kind}, ${category},
            ${config ? sql.json(config) : null}, true, now())`;
  revalidatePath("/admin", "layout");
  redirect(`/admin/clients/${slug}`);
}

export type ConfigSaveState = { ok?: boolean; error?: string };

export async function updateClientConfigAction(
  _prev: ConfigSaveState,
  formData: FormData,
): Promise<ConfigSaveState> {
  await requireSession();
  const slug = String(formData.get("slug"));
  const raw = String(formData.get("config") ?? "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Couldn't read the configuration." };
  }
  const result = configSchema.safeParse(parsed);
  if (!slug) return { error: "Missing client." };
  if (!result.success) return { error: "Some fields are invalid — check numbers." };
  await sql`update clients set config = ${sql.json(result.data)} where slug = ${slug}`;
  revalidatePath("/admin", "layout");
  revalidatePath("/client", "layout");
  return { ok: true };
}

export type AddLeadState = { error?: string };

/** Manually add a lead the engine didn't catch — a real tip, a private
 * subcontractor-opportunity notice (like Kier's own supplier marketplace
 * listings, which aren't award notices our OCDS sources ever ingest), or a
 * correction for a false negative. Creates a synthetic notice (ocid
 * "manual-<uuid>") so it renders through the exact same lead detail/list
 * views as a scanned one. */
export async function addLeadManuallyAction(
  _prev: AddLeadState,
  formData: FormData,
): Promise<AddLeadState> {
  await requireSession();

  const client = String(formData.get("client") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const buyer = String(formData.get("buyer") ?? "").trim();
  const winner = String(formData.get("winner") ?? "").trim();
  const valueRaw = String(formData.get("value_gbp") ?? "").trim();
  const awardDateRaw = String(formData.get("award_date") ?? "").trim();
  const evidenceUrl = String(formData.get("evidence_url") ?? "").trim();
  const siteAddress = String(formData.get("site_address") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sectorHint = String(formData.get("sector_hint") ?? "").trim() || "manual";
  const scoreRaw = String(formData.get("score") ?? "").trim();

  if (!client) return { error: "Choose a client." };
  if (!title) return { error: "Title is required." };
  if (!winner) return { error: "Winner / company name is required." };

  const score = scoreRaw ? Number(scoreRaw) : 60;
  if (!Number.isFinite(score)) return { error: "Score must be a number." };

  let value: number | null = null;
  if (valueRaw) {
    value = Number(valueRaw);
    if (!Number.isFinite(value)) return { error: "Value must be a number." };
  }

  if (!(await slugExists(client))) return { error: "Unknown client." };

  const ocid = `manual-${crypto.randomUUID()}`;

  await sql`
    insert into notices (
      ocid, source, title, buyer, description, cpv_codes, winners,
      value_gbp, award_date, evidence_url, site_address, site_address_precise,
      first_seen_at, updated_at
    ) values (
      ${ocid}, 'manual', ${title}, ${buyer}, ${description}, ${sql.json([])},
      ${sql.json([{ name: winner, id: "" }])}, ${value}, ${awardDateRaw || null},
      ${evidenceUrl}, ${siteAddress}, ${siteAddress.length > 0}, now(), now()
    )`;

  const [row] = await sql<{ id: number }[]>`
    insert into leads (
      client_slug, ocid, score, sector_hint, region_hit, status, shared, created_at
    ) values (
      ${client}, ${ocid}, ${score}, ${sectorHint}, '', 'new', false, now()
    )
    returning id`;

  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${row.id}`);
}

export type ScanState = { ok?: boolean; error?: string };

/** Kicks off the engine's GitHub Actions workflow on demand — a shorter
 * lookback and a bigger brief catch-up limit than the daily cron, since
 * "run now" means "catch me up", not "repeat today's incremental scan". */
export async function runScanNowAction(
  _prev: ScanState,
  formData: FormData,
): Promise<ScanState> {
  await requireSession();
  const client = String(formData.get("client") ?? "").trim();
  const result = await triggerScan({ client: client || undefined });
  if (!result.ok) return { error: result.error };
  return { ok: true };
}
