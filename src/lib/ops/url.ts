import { headers } from "next/headers";

/** Only http(s) (or empty) is safe to store and later render as an `href` —
 * these URLs come from admin-typed form fields (manual lead entry, contact
 * edits) and get rendered on both admin AND client-facing pages, so a
 * `javascript:` URI pasted in by mistake (or a compromised admin session)
 * would otherwise become stored XSS served straight to a client. */
export function isSafeHttpUrl(value: string): boolean {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

/** Base URL for links sent in emails (magic-link sign-in). Always prefers
 * NEXT_PUBLIC_APP_URL. The header fallback exists for local dev convenience
 * only — trusting the request's Host header here is a real risk on the
 * unauthenticated client-login path (anyone can spoof `Host:` and get a
 * legitimate magic-link token emailed pointing at their own domain instead
 * of yours), so it warns loudly if relied on outside development. */
export async function appBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[security] NEXT_PUBLIC_APP_URL is not set — falling back to the " +
        "request's Host header for magic-link URLs. This header can be " +
        "spoofed by an unauthenticated caller. Set NEXT_PUBLIC_APP_URL in " +
        "Vercel's environment variables.",
    );
  }
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
