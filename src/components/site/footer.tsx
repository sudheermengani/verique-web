import Image from "next/image";
import Link from "next/link";
import { footerCompanyLinks, footerServiceLinks, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-tint py-14 pb-10">
      <div className="mx-auto max-w-[1180px] px-7">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/verique-mark.png" alt="Verique logo" width={35} height={32} className="h-8 w-auto" />
              <b className="font-display text-[17px] font-bold tracking-[0.14em]">VERIQUE</b>
            </div>
            <p className="mt-3 font-mono text-[11.5px] tracking-[0.16em] text-slate uppercase">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-14">
            <div>
              <h4 className="mb-4 font-mono text-[11.5px] font-medium tracking-[0.16em] text-slate uppercase">
                Services
              </h4>
              <ul className="grid gap-2.5">
                {footerServiceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-grad"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[11.5px] font-medium tracking-[0.16em] text-slate uppercase">
                Company
              </h4>
              <ul className="grid gap-2.5">
                {footerCompanyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-grad"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[11.5px] font-medium tracking-[0.16em] text-slate uppercase">
                Get in touch
              </h4>
              <ul className="grid gap-2.5">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-grad"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[14.5px] font-medium text-ink-soft transition-colors hover:text-grad"
                  >
                    Book a consultation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5.5 text-[13px] text-slate">
          <span>© {new Date().getFullYear()} Verique · verique.co.uk · United Kingdom</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
