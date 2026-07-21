import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/ops/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-tint px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 shadow-sm">
        <p className="font-mono text-xs tracking-widest text-slate uppercase">
          Verique · Admin
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-ink">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-slate">
          Internal lead engine dashboard. Team access only.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
