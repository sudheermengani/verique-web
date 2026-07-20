import type { Metadata } from "next";
import Link from "next/link";

import { requireSession } from "@/lib/ops/auth";
import { logoutAction } from "../actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Ops",
  robots: { index: false, follow: false },
};

export default async function OpsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireSession();
  return (
    <div className="flex min-h-screen flex-col bg-paper-tint">
      <header className="sticky top-0 z-10 border-b border-line bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/ops"
            className="rounded-md font-heading text-sm font-semibold text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Verique <span className="text-slate">· Ops</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate sm:inline">
              {session.email}
            </span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
