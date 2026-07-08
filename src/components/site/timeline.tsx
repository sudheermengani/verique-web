import { Reveal } from "@/components/site/reveal";

const steps = [
  { title: "Consultation", description: "We map how you currently acquire customers and where the gaps are." },
  { title: "Strategy", description: "A plan built around the channels that fit your market and your budget." },
  { title: "Build", description: "Pages, campaigns, tracking and CRM connections built and tested." },
  { title: "Launch", description: "Traffic on, leads flowing, everything measured from day one." },
  { title: "Optimise", description: "Weekly refinement so cost per customer keeps coming down." },
];

export function Timeline() {
  return (
    <div className="relative mt-2.5 grid gap-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4.5">
      <div className="absolute top-[27px] right-[6%] left-[6%] hidden h-0.5 rounded-full bg-grad opacity-30 lg:block" />
      {steps.map((step, i) => (
        <Reveal key={step.title} delay={(i % 4) as 0 | 1 | 2 | 3} className="relative px-0 text-left lg:text-center lg:px-2">
          <div className="bg-grad relative z-10 mb-4.5 flex size-13.5 items-center justify-center rounded-full bg-white font-display text-lg font-bold [background:linear-gradient(#fff,#fff)_padding-box,var(--grad)_border-box] [border:2px_solid_transparent] lg:mx-auto">
            {i + 1}
          </div>
          <h3 className="mb-2 font-display text-lg font-bold">{step.title}</h3>
          <p className="text-[14.5px] text-slate">{step.description}</p>
        </Reveal>
      ))}
    </div>
  );
}
