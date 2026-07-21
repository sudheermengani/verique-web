import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Auth for the Verique platform.
 *
 * - Admins (you): email allowlist + shared password (env), HMAC session cookie.
 * - Clients: passwordless. Admin authorises an email (client_users table); the
 *   client requests a magic link, which is a short-lived signed token that,
 *   when opened, mints a client-scoped session cookie.
 *
 * Both share one signed cookie whose payload records the role and, for
 * clients, which client slug they may see.
 */

const COOKIE = "verique_session";
const MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days
const MAGIC_TTL_MS = 15 * 60 * 1000; // 15 minutes

export type Session =
  | { role: "admin"; email: string; slug: null }
  | { role: "client"; email: string; slug: string };

function secret(): string {
  const s = process.env.OPS_SESSION_SECRET;
  if (!s) throw new Error("OPS_SESSION_SECRET is not set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// --- admin credentials ---------------------------------------------------

export function verifyCredentials(email: string, password: string): boolean {
  const allowed = (process.env.OPS_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const expected = process.env.OPS_PASSWORD ?? "";
  if (!allowed.includes(email.trim().toLowerCase()) || !expected) return false;
  return safeEqual(password, expected);
}

// --- session cookie ------------------------------------------------------

async function setSessionCookie(payload: string): Promise<void> {
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function createSession(email: string): Promise<void> {
  const expires = Date.now() + MAX_AGE_S * 1000;
  await setSessionCookie(`admin|${email.trim().toLowerCase()}||${expires}`);
}

export async function createClientSession(
  email: string,
  slug: string,
): Promise<void> {
  const expires = Date.now() + MAX_AGE_S * 1000;
  await setSessionCookie(`client|${email.trim().toLowerCase()}|${slug}|${expires}`);
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/" });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const payload = Buffer.from(encoded, "base64url").toString();
  if (!safeEqual(sig, sign(payload))) return null;
  const [role, email, slug, expires] = payload.split("|");
  if (!email || Number(expires) < Date.now()) return null;
  if (role === "admin") return { role: "admin", email, slug: null };
  if (role === "client" && slug) return { role: "client", email, slug };
  return null;
}

/** Admin-only. Redirects to the admin login otherwise. */
export async function requireSession(): Promise<Session & { role: "admin" }> {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");
  return session;
}

/** A client viewing their own slug, or any admin. */
export async function requireClientAccess(slug: string): Promise<Session> {
  const session = await getSession();
  if (session?.role === "admin") return session;
  if (session?.role === "client" && session.slug === slug) return session;
  redirect(`/client/login?next=${encodeURIComponent(`/client/${slug}`)}`);
}

// --- magic-link tokens ---------------------------------------------------

export function createMagicToken(email: string, slug: string): string {
  const expires = Date.now() + MAGIC_TTL_MS;
  const payload = `magic|${email.trim().toLowerCase()}|${slug}|${expires}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyMagicToken(
  token: string,
): { email: string; slug: string } | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const payload = Buffer.from(encoded, "base64url").toString();
  if (!safeEqual(sig, sign(payload))) return null;
  const [purpose, email, slug, expires] = payload.split("|");
  if (purpose !== "magic" || !email || !slug) return null;
  if (Number(expires) < Date.now()) return null;
  return { email, slug };
}
