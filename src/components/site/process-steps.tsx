import { Reveal } from "@/components/site/reveal";
import type { Step } from "@/lib/services-data";

export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <div>
      {steps.map((step, i) => (
        <Reveal key={step.title}>
          <div
            className={`grid grid-cols-[48px_1fr] gap-6 py-7 sm:grid-cols-[64px_1fr] ${
              i !== steps.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <span className="font-display text-3xl leading-none font-light text-line sm:text-[34px]">
              0{i + 1}
            </span>
            <div>
              <h3 className="mb-1.5 font-display text-xl font-bold">{step.title}</h3>
              <p className="max-w-[64ch] text-base text-slate">{step.description}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
