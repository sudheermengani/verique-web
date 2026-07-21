import type { Metadata } from "next";

import { LoginRequestForm } from "./login-request-form";

export const metadata: Metadata = {
  title: "Client sign in",
  robots: { index: false, follow: false },
};

export default async function ClientLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const { expired } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-tint px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 shadow-sm">
        <p className="font-mono text-xs tracking-widest text-slate uppercase">
          Verique · Client portal
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-ink">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-slate">
          Enter your email and we&apos;ll send you a secure sign-in link.
        </p>
        {expired && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-line bg-paper-tint px-3 py-2 text-xs text-slate"
          >
            That sign-in link has expired or been used. Request a fresh one below.
          </p>
        )}
        <LoginRequestForm />
      </div>
    </div>
  );
}
