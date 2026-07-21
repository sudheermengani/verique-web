import { Resend } from "resend";

const FROM =
  process.env.LOGIN_FROM_EMAIL ??
  process.env.CONTACT_FROM_EMAIL ??
  "Verique <contact@verique.co.uk>";

/**
 * Send the client sign-in link. If RESEND_API_KEY is missing (e.g. local dev
 * without email set up), fall back to logging the link so the flow is still
 * testable — never throw, so login requests don't error out.
 */
export async function sendMagicLink(to: string, url: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[magic-link] ${to} -> ${url}`);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Verique sign-in link",
    text: [
      "Here's your secure link to sign in to your Verique portal:",
      "",
      url,
      "",
      "This link expires in 15 minutes. If you didn't request it, ignore this email.",
    ].join("\n"),
  });
}
