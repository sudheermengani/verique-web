import { Reveal } from "@/components/site/reveal";

const pillars = [
  {
    word: "Create",
    description:
      "Lead-generating websites, landing pages and campaign creative built around a single goal: turning visitors into enquiries.",
  },
  {
    word: "Engage",
    description:
      "Ads, retargeting and follow-up sequences that keep your offer in front of the right people until they're ready to talk.",
  },
  {
    word: "Grow",
    description:
      "Weekly reporting, testing and optimisation, so cost per customer comes down as the relationship goes on.",
  },
];

export function PillarStrip() {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {pillars.map((p, i) => (
        <Reveal key={p.word} delay={i as 0 | 1 | 2}>
          <div className="h-full rounded-[18px] border border-line bg-white p-8.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(10,18,36,0.09)]">
            <div className="mb-3 flex items-center gap-2.5 font-display text-[26px] font-extrabold tracking-[-0.01em]">
              {p.word}
              <span className="bg-grad h-0.5 flex-1 rounded-full opacity-25" />
            </div>
            <p className="text-[16px] text-slate">{p.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
