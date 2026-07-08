import { Reveal } from "@/components/site/reveal";
import { VeriqueButton, Arrow } from "@/components/site/verique-button";

export function ServiceDetailBlock({
  name,
  description,
  href,
  items,
  tint,
}: {
  name: string;
  description: string;
  href: string;
  items: string[];
  tint?: boolean;
}) {
  return (
    <section className={`py-20 md:py-27.5 ${tint ? "tint border-y border-line bg-paper-tint" : ""}`}>
      <div className="mx-auto max-w-[1180px] px-7">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] leading-[1.08] font-bold tracking-[-0.02em]">
              {name}
            </h2>
            <p className="mt-4 text-[17.5px] text-slate">{description}</p>
            <VeriqueButton href={href} variant="primary" className="mt-6.5">
              Explore this service <Arrow />
            </VeriqueButton>
          </Reveal>
          <Reveal delay={1}>
            <ul className="grid gap-3">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 border-b border-line pb-3 text-[16px] font-medium text-ink-soft last:border-b-0 last:pb-0"
                >
                  <span className="text-grad shrink-0 font-mono text-[13px]">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
