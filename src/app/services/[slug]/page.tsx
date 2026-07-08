import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, SectionHead } from "@/components/site/page-hero";
import { FeatureGrid } from "@/components/site/feature-card";
import { ProcessSteps } from "@/components/site/process-steps";
import { OutcomeCards } from "@/components/site/outcome-cards";
import { FaqSection } from "@/components/site/faq-section";
import { CtaPanel } from "@/components/site/cta-panel";
import { getServiceBySlug, services } from "@/lib/services-data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.seoTitle.replace(" | Verique", ""),
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero crumb={service.name} h1={service.h1} lede={service.lede} />

      <section className="py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead eyebrow={service.featuresEyebrow} heading={service.featuresHeading} />
          <FeatureGrid features={service.features} />
        </div>
      </section>

      <section className="border-y border-line bg-paper-tint py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead eyebrow={service.stepsEyebrow} heading={service.stepsHeading} />
          <ProcessSteps steps={service.steps} />
        </div>
      </section>

      <section className="py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead
            eyebrow="What to expect"
            heading={service.outcomesHeading}
            description="We don't promise overnight miracles. We build systems, measure honestly, and improve every month. Here's what that looks like."
          />
          <OutcomeCards outcomes={service.outcomes} />
        </div>
      </section>

      <section className="border-y border-line bg-paper-tint py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead center eyebrow="Common questions" heading="Frequently asked" />
          <FaqSection faqs={service.faqs} />
        </div>
      </section>

      <CtaPanel />
    </>
  );
}
