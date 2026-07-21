"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createMagicToken, destroySession } from "@/lib/ops/auth";
import { findClientByEmail } from "@/lib/ops/queries";
import { sendMagicLink } from "@/lib/ops/email";

export type LinkState = { sent?: boolean; error?: string };

export async function clientLogoutAction(): Promise<void> {
  await destroySession();
  redirect("/client/login");
}

async function baseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function requestMagicLinkAction(
  _prev: LinkState,
  formData: FormData,
): Promise<LinkState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address." };

  const slug = await findClientByEmail(email);
  // Only send to authorised emails, but always return the same message so an
  // outsider can't probe which emails are registered.
  if (slug) {
    const token = createMagicToken(email, slug);
    const url = `${await baseUrl()}/client/auth?token=${encodeURIComponent(token)}`;
    await sendMagicLink(email, url);
  }
  return { sent: true };
}
