import type { Metadata } from "next";
import { Target, Megaphone, Search, Clapperboard, LayoutTemplate, Workflow } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { VeriqueButton, Arrow } from "@/components/site/verique-button";
import { GrowthCard } from "@/components/site/growth-card";
import { SectionHead } from "@/components/site/page-hero";
import { PillarStrip } from "@/components/site/pillar-strip";
import { ServiceCard } from "@/components/site/service-card";
import { IndustryChip } from "@/components/site/industry-chip";
import { Timeline } from "@/components/site/timeline";
import { WhyGrid } from "@/components/site/why-grid";
import { CtaPanel } from "@/components/site/cta-panel";
import { ContactForm } from "@/components/site/contact-form";
import { services } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Lead Generation & Growth Marketing Agency UK",
  description:
    "Verique helps UK businesses generate qualified leads, appointments and customers through Meta ads, Google ads, video marketing and conversion-focused websites. Book a free consultation.",
  alternates: { canonical: "/" },
};

const serviceIcons = {
  "lead-generation": Target,
  "meta-advertising": Megaphone,
  "google-advertising": Search,
  "video-marketing": Clapperboard,
  "website-design": LayoutTemplate,
} as const;

const industries = [
  { code: "EA", name: "Estate agents" },
  { code: "DE", name: "Dentists" },
  { code: "SO", name: "Solicitors" },
  { code: "MB", name: "Mortgage brokers" },
  { code: "CL", name: "Clinics" },
  { code: "TR", name: "Trades" },
  { code: "HI", name: "Home improvement" },
  { code: "PS", name: "Professional services" },
  { code: "FI", name: "Financial services" },
];

export default function HomePage() {
  return (
    <>
      <header className="relative overflow-hidden pt-[140px] pb-19 md:pt-[176px] md:pb-25">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_440px_at_84%_6%,rgba(0,200,245,0.14),transparent_65%),radial-gradient(640px_500px_at_6%_92%,rgba(139,61,246,0.10),transparent_65%)]" />
        <div className="relative mx-auto max-w-[1180px] px-7">
          <div className="grid items-center gap-11 lg:grid-cols-[1.25fr_0.95fr] lg:gap-15">
            <div>
              <Eyebrow>UK lead generation &amp; growth marketing</Eyebrow>
              <h1 className="mt-6 font-display text-[clamp(46px,6.2vw,76px)] leading-[1.02] font-extrabold tracking-[-0.025em]">
                <span className="block">Generate More Leads.</span>
                <span className="block">Convert More Customers.</span>
                <span className="text-grad block">Grow Faster.</span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-xl text-slate">
                Verique runs the full acquisition system for UK service businesses —
                ads, landing pages, follow-up and reporting — measured against one
                outcome: customers acquired.
              </p>
              <div className="mt-8.5 flex flex-wrap gap-3.5">
                <VeriqueButton href="/contact">
                  Book Free Consultation <Arrow />
                </VeriqueButton>
                <VeriqueButton href="/services" variant="ghost">
                  Explore our services
                </VeriqueButton>
              </div>
              <p className="mt-5.5 font-mono text-[12.5px] tracking-[0.05em] text-slate">
                No obligation · Reply within one working day
              </p>
            </div>
            <GrowthCard />
          </div>
        </div>
      </header>

      <section className="border-y border-line bg-paper-tint py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            eyebrow="How we work"
            heading="Create. Engage. Grow."
            description="One team running the whole acquisition system, so every lesson from one discipline improves the others."
          />
          <PillarStrip />
        </div>
      </section>

      <section className="py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            eyebrow="What we do"
            heading="One team for the whole growth system."
            description="Pick a single service or let us run the full engine. Either way, everything is built around one outcome: customers acquired."
          />
          <div className="grid gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard
                key={service.slug}
                href={`/services/${service.slug}`}
                icon={serviceIcons[service.slug as keyof typeof serviceIcons]}
                name={service.name}
                description={service.shortDescription}
                delay={(i % 4) as 0 | 1 | 2 | 3}
              />
            ))}
            <ServiceCard
              href="/services"
              icon={Workflow}
              name="CRM & Automation"
              description="Instant lead routing, automated sequences and pipeline visibility, so no enquiry goes cold."
              delay={2}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-tint py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            eyebrow="Who we work with"
            heading="Industries we serve"
            description="We specialise in UK service businesses where every enquiry has real value."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <IndustryChip key={ind.name} code={ind.code} name={ind.name} delay={(i % 4) as 0 | 1 | 2 | 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            eyebrow="The process"
            heading="How it works"
            description="From first call to a system that compounds every month."
          />
          <Timeline />
        </div>
      </section>

      <section className="border-y border-line bg-paper-tint py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            eyebrow="Why Verique"
            heading="A growth partner, not a vendor."
            description="Five commitments we keep on every account."
          />
          <WhyGrid />
        </div>
      </section>

      <CtaPanel />

      <section className="pb-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            center
            eyebrow="Get started"
            heading="Book your free strategy consultation"
            description="Tell us about your business and we'll map your biggest growth opportunities."
          />
          <div className="mx-auto max-w-[640px]">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
