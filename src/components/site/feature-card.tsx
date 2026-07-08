import { Reveal } from "@/components/site/reveal";
import type { Feature } from "@/lib/services-data";

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {features.map((f, i) => (
        <Reveal key={f.title} delay={i % 2 === 0 ? 0 : 1}>
          <div className="h-full rounded-[18px] border border-line bg-white p-7.5">
            <h3 className="mb-2 flex items-baseline gap-2.5 font-display text-lg font-bold">
              <span className="text-grad font-mono text-sm">→</span>
              {f.title}
            </h3>
            <p className="text-[15.5px] text-slate">{f.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
