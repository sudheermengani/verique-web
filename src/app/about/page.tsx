import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { CtaPanel } from "@/components/site/cta-panel";

export const metadata: Metadata = {
  title: "About Verique | Your UK Growth Partner",
  description:
    "Verique is a UK growth partner helping service businesses acquire customers through accountable, data-driven marketing. Learn how we work and what we stand for.",
  alternates: { canonical: "/about" },
};

const commitments = [
  {
    word: "Measurable",
    description:
      "Every engagement starts by agreeing what success looks like in numbers. We report against those numbers — the flattering ones and the unflattering ones.",
  },
  {
    word: "Honest",
    description:
      "If a channel isn't right for your business, we say so — including when that means less work for us. Trust is the asset; everything else is rented.",
  },
  {
    word: "Long-term",
    description:
      "We'd rather grow with twenty clients for years than churn through two hundred. Your accounts, data and assets are always yours, so staying with us is a choice, not a trap.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        h1="Built to be the growth partner we couldn't find."
        lede="Verique exists because most businesses don't need another agency selling channels. They need one accountable partner who treats their marketing budget like an investment with an expected return."
      />

      <section className="py-20 md:py-27.5">
        <div className="mx-auto max-w-[840px] px-7">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4.5 mb-5.5 font-display text-[clamp(30px,4vw,44px)] leading-[1.08] font-bold tracking-[-0.02em]">
              Why Verique exists
            </h2>
            <div className="grid gap-4.5 text-lg text-ink-soft">
              <p>
                Talk to enough business owners and the same story repeats. They&apos;ve
                paid for a website that looks fine and produces nothing. They&apos;ve
                &ldquo;tried Facebook ads&rdquo; through an agency that reported clicks
                and impressions while the phone stayed quiet. They&apos;ve been sold
                marketing as a set of disconnected services, each with its own invoice
                and none with responsibility for the result.
              </p>
              <p>
                Verique was built as the answer to that. One team running the full
                acquisition system — the offer, the ads, the pages, the follow-up —
                with a single measure of success: customers acquired at a cost that
                makes sense for your business.
              </p>
              <p>
                The name of the game is compounding. When the people writing your ads
                also build your landing pages and see your CRM data, every lesson from
                one channel improves the others. That&apos;s what a growth partner is,
                and it&apos;s the only way we work.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-tint py-20 md:py-27.5">
        <div className="mx-auto max-w-[1180px] px-7">
          <Reveal className="mb-15 max-w-[660px]">
            <Eyebrow>What we stand for</Eyebrow>
            <h2 className="mt-4.5 mb-4 font-display text-[clamp(34px,4.4vw,50px)] leading-[1.06] font-bold tracking-[-0.02em]">
              Three commitments, kept on every account.
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {commitments.map((c, i) => (
              <Reveal key={c.word} delay={i as 0 | 1 | 2}>
                <div className="h-full rounded-[18px] border border-line bg-white p-8.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(10,18,36,0.09)]">
                  <div className="mb-3 flex items-center gap-2.5 font-display text-[26px] font-extrabold tracking-[-0.01em]">
                    {c.word}
                    <span className="bg-grad h-0.5 flex-1 rounded-full opacity-25" />
                  </div>
                  <p className="text-[16px] text-slate">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-27.5">
        <div className="mx-auto max-w-[840px] px-7">
          <Reveal>
            <Eyebrow>The founder</Eyebrow>
            <h2 className="mt-4.5 mb-5 font-display text-[clamp(28px,3.6vw,40px)] leading-[1.1] font-bold tracking-[-0.02em]">
              A note from the founder
            </h2>
            <div className="rounded-[22px] border border-line bg-white p-9.5 shadow-[0_24px_60px_rgba(10,18,36,0.08)] sm:p-10">
              <div className="grid gap-4 text-[17.5px] text-ink-soft">
                <p>
                  &ldquo;I started Verique with a simple belief: marketing should be
                  accountable to revenue, and the businesses that keep this country
                  running — agents, dentists, brokers, solicitors, trades — deserve the
                  same calibre of growth marketing that venture-backed startups get.
                </p>
                <p>
                  We keep our client list deliberately focused so every account gets
                  senior attention. When you work with Verique, you&apos;re not handed
                  to a junior after the sales call — the people who plan your strategy
                  are the people who execute it.
                </p>
                <p>
                  If you want a straight answer about whether we can help your business
                  grow, book a call. If we&apos;re not the right fit, you&apos;ll leave
                  the call knowing more about your own marketing than when you joined —
                  that&apos;s a promise.&rdquo;
                </p>
              </div>
              <p className="mt-5.5 font-mono text-[12.5px] tracking-[0.12em] text-slate uppercase">
                Founder, Verique
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaPanel />
    </>
  );
}
