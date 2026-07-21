"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Clients", exact: true },
  { href: "/admin/leads", label: "Leads" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="flex items-center gap-4">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active ? "font-medium text-ink" : "text-slate hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
