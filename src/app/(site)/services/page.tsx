import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ServiceDetailBlock } from "@/components/site/service-detail-block";
import { CtaPanel } from "@/components/site/cta-panel";
import { services, crmService } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Growth Marketing Services | Lead Gen, Ads, Video & Web",
  description:
    "Explore Verique's services: lead generation systems, Meta advertising, Google advertising, video marketing, website design and CRM automation for UK businesses.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        h1="One team for the whole growth system."
        lede="Ads, pages, video, follow-up and reporting — run together, measured together. Pick a single service or let us run the full engine. Either way, everything is built around one outcome: customers acquired."
      />

      {services.map((service, i) => (
        <ServiceDetailBlock
          key={service.slug}
          name={service.name}
          description={service.shortDescription}
          href={`/services/${service.slug}`}
          items={service.overviewList}
          tint={i % 2 === 0}
        />
      ))}

      <ServiceDetailBlock
        name={crmService.name}
        description={crmService.shortDescription}
        href="/contact"
        items={crmService.overviewList}
        tint={services.length % 2 === 0}
      />

      <CtaPanel />
    </>
  );
}
