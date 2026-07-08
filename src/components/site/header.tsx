"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { VeriqueButton } from "@/components/site/verique-button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 transition-[background-color,box-shadow] duration-300",
        scrolled && "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-7 py-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Verique home">
          <Image src="/verique-mark.png" alt="Verique logo" width={37} height={34} className="h-[34px] w-auto" priority />
          <span className="font-display text-[19px] font-bold tracking-[0.14em]">
            VERIQUE
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative py-1 text-[14.5px] font-semibold text-ink-soft after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-grad after:transition-[width] after:duration-250 hover:after:w-full",
                  isActive(link.href) && "after:w-full"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <VeriqueButton href="/contact" size="sm">
            Book Free Consultation
          </VeriqueButton>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex items-center justify-center rounded-md p-2 md:hidden" aria-label="Menu">
            <Menu className="size-6 text-ink" />
          </SheetTrigger>
          <SheetContent side="right" className="p-6">
            <SheetTitle className="flex items-center gap-2.5">
              <Image src="/verique-mark.png" alt="Verique logo" width={31} height={28} className="h-7 w-auto" />
              <span className="font-display text-base font-bold tracking-[0.14em]">VERIQUE</span>
            </SheetTitle>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="border-b border-line py-3.5 text-base font-semibold text-ink-soft"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <VeriqueButton href="/contact" className="mt-6 justify-center" onClick={() => setOpen(false)}>
              Book Free Consultation
            </VeriqueButton>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
