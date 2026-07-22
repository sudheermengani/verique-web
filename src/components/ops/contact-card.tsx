import {
  Building2,
  ExternalLink,
  Globe,
  Map,
  Mail,
  MapPin,
  Phone,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import type { Enrichment } from "@/lib/ops/queries";

const mapsUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const searchUrl = (q: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(q)}`;

const SOURCE_LABEL: Record<string, string> = {
  award_notice: "award notice",
  companies_house: "Companies House",
  website: "company website",
};

// "SURNAME, First Middle, Title" → "First Surname"
function tidyDirector(name: string): string {
  const [surname, rest] = name.split(",").map((s) => s.trim());
  if (!rest) return name;
  const first = rest.split(" ")[0];
  const cap = (s: string) =>
    s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
  return `${cap(first)} ${surname.split(" ").map(cap).join(" ")}`;
}

export function ContactCard({
  enrichment,
  winner,
}: {
  enrichment: Enrichment | null;
  winner?: string;
}) {
  const e = enrichment ?? {};
  const hasAny =
    e.address || e.phone || e.email || e.website || e.contact_name ||
    e.directors?.length || e.company_number;

  return (
    <section
      aria-label="Winner contact"
      className="rounded-xl border border-line bg-paper p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-ink">Contact</h2>
        {e.sources?.length ? (
          <span className="text-[0.65rem] text-slate">
            from {e.sources.map((s) => SOURCE_LABEL[s] ?? s).join(", ")}
          </span>
        ) : null}
      </div>

      {hasAny ? (
        <dl className="mt-3 space-y-2 text-sm">
          {e.contact_name && (
            <Row icon={UserRound}>{e.contact_name}</Row>
          )}
          {e.phone && (
            <Row icon={Phone}>
              <a href={`tel:${e.phone}`} className="text-blue hover:underline">
                {e.phone}
              </a>
            </Row>
          )}
          {e.email && (
            <Row icon={Mail}>
              <a href={`mailto:${e.email}`} className="text-blue hover:underline">
                {e.email}
              </a>
            </Row>
          )}
          {e.website && (
            <Row icon={Globe}>
              <a
                href={e.website.startsWith("http") ? e.website : `https://${e.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {e.website}
              </a>
            </Row>
          )}
          {e.address && <Row icon={MapPin}>{e.address}</Row>}
          {e.directors?.length ? (
            <Row icon={Users}>
              <span className="text-slate">Ask for: </span>
              {e.directors.map(tidyDirector).join(", ")}
            </Row>
          ) : null}
          {e.company_number && (
            <Row icon={Building2}>
              {e.companies_house_url ? (
                <a
                  href={e.companies_house_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue hover:underline"
                >
                  Company {e.company_number}
                </a>
              ) : (
                <>Company {e.company_number}</>
              )}
              {e.status && (
                <span className="ml-1 text-xs text-slate">· {e.status}</span>
              )}
            </Row>
          )}

          {(e.address || winner) && (
            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              {e.address && (
                <QuickLink href={mapsUrl(e.address)} icon={Map}>
                  Map
                </QuickLink>
              )}
              {winner && (
                <QuickLink
                  href={searchUrl(`${winner} contact ${e.address ?? ""}`)}
                  icon={Search}
                >
                  Web search
                </QuickLink>
              )}
            </div>
          )}
        </dl>
      ) : (
        <p className="mt-2 text-sm text-slate">
          No contact details in the award notice
          {winner ? ` for ${winner}` : ""}. Enrichment (Companies House,
          website) will fill these in.
        </p>
      )}
    </section>
  );
}

function Row({
  icon: Icon,
  children,
}: {
  icon: typeof Phone;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate" aria-hidden />
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Phone;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Icon className="size-3.5" aria-hidden /> {children}
      <ExternalLink className="size-3" aria-hidden />
    </a>
  );
}
