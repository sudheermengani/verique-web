import type { Metadata } from "next";
import Link from "next/link";

import { requireClientAccess } from "@/lib/ops/auth";
import { clientLogoutAction } from "../actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Client portal",
  robots: { index: false, follow: false },
};

export default async function ClientLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const session = await requireClientAccess(slug);
  const isAdmin = session.role === "admin";

  return (
    <div className="flex min-h-screen flex-col bg-paper-tint">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <span className="font-heading text-sm font-semibold text-ink">
            Verique <span className="text-slate">· Client portal</span>
          </span>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-md text-xs text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                ← Admin view
              </Link>
            )}
            <form action={clientLogoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
