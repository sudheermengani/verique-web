"use server";

import { redirect } from "next/navigation";

import { createMagicToken, destroySession } from "@/lib/ops/auth";
import { findClientByEmail } from "@/lib/ops/queries";
import { sendMagicLink } from "@/lib/ops/email";
import { appBaseUrl } from "@/lib/ops/url";

export type LinkState = { sent?: boolean; error?: string };

export async function clientLogoutAction(): Promise<void> {
  await destroySession();
  redirect("/client/login");
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
    const url = `${await appBaseUrl()}/client/auth?token=${encodeURIComponent(token)}`;
    await sendMagicLink(email, url);
  }
  return { sent: true };
}
