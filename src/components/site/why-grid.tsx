import { Check } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const reasons = [
  { title: "Senior team, always", description: "You're never handed to a junior after the sales call." },
  { title: "One number, not a deliverable", description: "We're accountable to customers acquired, not clicks and impressions." },
  { title: "You own everything", description: "Ad accounts, CRM data and websites are set up in your name, always." },
  { title: "Honest reporting", description: "The flattering numbers and the unflattering ones, every week." },
  { title: "No long lock-in", description: "Rolling agreements after a fair trial period. We keep clients with results." },
];

export function WhyGrid() {
  return (
    <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-5">
      {reasons.map((r, i) => (
        <Reveal key={r.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
          <div className="h-full rounded-[14px] border border-line bg-white p-6.5">
            <div className="bg-grad mb-3.5 flex size-7.5 items-center justify-center rounded-lg text-white">
              <Check className="size-4" strokeWidth={2.5} />
            </div>
            <b className="mb-2 block font-display text-[17.5px] font-bold tracking-[-0.005em]">{r.title}</b>
            <p className="text-sm leading-[1.55] text-slate">{r.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
