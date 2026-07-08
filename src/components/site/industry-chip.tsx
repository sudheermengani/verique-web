import { Reveal } from "@/components/site/reveal";

export function IndustryChip({
  code,
  name,
  delay = 0,
}: {
  code: string;
  name: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex items-center gap-3.5 rounded-[14px] border border-line bg-white px-6 py-5.5 text-base font-semibold transition-transform duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(10,18,36,0.08)]">
        <span className="bg-grad flex size-8.5 shrink-0 items-center justify-center rounded-[10px] font-mono text-xs text-white opacity-90">
          {code}
        </span>
        {name}
      </div>
    </Reveal>
  );
}
