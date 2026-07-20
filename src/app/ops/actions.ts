"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { sql } from "@/lib/ops/db";
import {
  createSession,
  destroySession,
  requireSession,
  verifyCredentials,
} from "@/lib/ops/auth";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/ops/queries";

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
  redirect("/ops");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/ops/login");
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
  revalidatePath("/ops");
  revalidatePath(`/ops/leads/${leadId}`);
}
