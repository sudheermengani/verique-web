import { Reveal } from "@/components/site/reveal";
import type { Outcome } from "@/lib/services-data";

export function OutcomeCards({ outcomes }: { outcomes: Outcome[] }) {
  return (
    <div className="grid gap-4.5 sm:grid-cols-3">
      {outcomes.map((o, i) => (
        <Reveal key={o.title} delay={i as 0 | 1 | 2}>
          <div className="relative h-full overflow-hidden rounded-[18px] bg-ink p-7 text-white before:absolute before:inset-0 before:bg-[radial-gradient(240px_160px_at_90%_-10%,rgba(0,200,245,0.2),transparent_60%)]">
            <b className="relative mb-2 block font-display text-lg font-bold">{o.title}</b>
            <p className="relative text-[14.5px] text-[#AEB7C9]">{o.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
