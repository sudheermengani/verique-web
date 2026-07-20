import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { ContactForm } from "@/components/site/contact-form";
import { FaqSection } from "@/components/site/faq-section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Verique | Book a Free Strategy Consultation",
  description:
    "Book a free 30-minute strategy consultation with Verique. Tell us about your business and we'll map your biggest growth opportunities. contact@verique.co.uk",
  alternates: { canonical: "/contact" },
};

const steps = [
  {
    title: "You send the form",
    description: "Takes two minutes. The more you tell us about your business, the more useful the call will be.",
  },
  {
    title: "We reply within one working day",
    description: `You'll get a short email from ${siteConfig.email} with a few proposed times.`,
  },
  {
    title: "Strategy consultation",
    description: "We review how you currently acquire customers and map the highest-leverage opportunities — with honest budget guidance.",
  },
  {
    title: "Your decision",
    description: "If there's a fit, you'll receive a clear proposal. If not, you keep the insights. No chasing, no pressure.",
  },
];

const faqs = [
  {
    question: "Is the consultation really free?",
    answer:
      "Yes — 30 minutes, no invoice, no obligation. It's how we decide together whether there's a fit. You'll get genuine recommendations either way.",
  },
  {
    question: "What does working with Verique cost?",
    answer:
      "It depends on the services and ad budget involved. Most engagements combine a monthly management fee with your ad spend, scoped after the consultation. We'll always give you clear numbers before you commit to anything.",
  },
  {
    question: "Are there long contracts?",
    answer:
      "We work on rolling agreements after an initial period long enough to judge results fairly — typically three months. We keep clients with performance, not paperwork.",
  },
  {
    question: "Do you only work with certain industries?",
    answer:
      "We specialise in UK service businesses — estate agents, dentists, solicitors, mortgage brokers, clinics, trades, home improvement and professional services. If you're outside those, get in touch anyway; we'll tell you honestly if we're the right partner.",
  },
  {
    question: "Who will actually run my account?",
    answer:
      "The senior team you speak to on the consultation. We keep the client list focused specifically so accounts are never passed down to juniors.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Contact"
        h1="Book your free strategy consultation."
        lede="A 30-minute call about your business, your market and your numbers. You'll leave with a clear read on where your biggest growth opportunity is — whether or not we work together."
        showCtas={false}
      />

      <section className="py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <div className="grid items-start gap-11 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            <Reveal>
              <Eyebrow>What happens next</Eyebrow>
              <div className="mt-3.5">
                {steps.map((step, i) => (
                  <div key={step.title} className="py-6 first:pt-0">
                    <h3 className="mb-1.5 font-display text-lg font-bold">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="text-slate">{step.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7.5 rounded-2xl border border-line bg-paper-tint p-6.5">
                <p className="mb-2.5 font-mono text-[11.5px] tracking-[0.16em] text-slate uppercase">
                  Business enquiries
                </p>
                <p className="font-semibold">Partnerships, press or supplier enquiries:</p>
                <a href={`mailto:${siteConfig.email}`} className="font-bold text-blue">
                  {siteConfig.email}
                </a>
              </div>
            </Reveal>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-tint py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <SectionHead center eyebrow="Before you book" heading="Frequently asked" />
          <FaqSection faqs={faqs} />
        </div>
      </section>
    </>
  );
}
