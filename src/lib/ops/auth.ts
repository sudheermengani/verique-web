import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Internal-only auth for /ops: email allowlist + shared password from env,
 * HMAC-signed session cookie. Two users, no accounts to manage.
 * If the team ever grows past "us two", replace with a real auth provider.
 */

const COOKIE = "verique_ops_session";
const MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.OPS_SESSION_SECRET;
  if (!s) throw new Error("OPS_SESSION_SECRET is not set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function verifyCredentials(email: string, password: string): boolean {
  const allowed = (process.env.OPS_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const expected = process.env.OPS_PASSWORD ?? "";
  if (!allowed.includes(email.trim().toLowerCase()) || !expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(email: string): Promise<void> {
  const expires = Date.now() + MAX_AGE_S * 1000;
  const payload = `${email.trim().toLowerCase()}|${expires}`;
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/ops",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/ops" });
}

export async function getSession(): Promise<{ email: string } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const payload = Buffer.from(encoded, "base64url").toString();
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const [email, expires] = payload.split("|");
  if (!email || Number(expires) < Date.now()) return null;
  return { email };
}

export async function requireSession(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) redirect("/ops/login");
  return session;
}
