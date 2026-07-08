import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

export function ServiceCard({
  href,
  icon: Icon,
  name,
  description,
  delay = 0,
}: {
  href: string;
  icon: LucideIcon;
  name: string;
  description: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  return (
    <Reveal delay={delay}>
      <Link
        href={href}
        className="group relative flex h-full flex-col gap-3.5 overflow-hidden rounded-[18px] border border-line bg-white p-7.5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_44px_rgba(10,18,36,0.1)]"
      >
        <span className="bg-grad absolute inset-x-0 top-0 h-[3px] scale-x-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex size-11.5 items-center justify-center rounded-xl border border-line bg-paper-tint">
          <Icon className="size-5.5 text-blue" strokeWidth={1.8} />
        </div>
        <h3 className="font-display text-[21px] font-bold tracking-[-0.01em]">{name}</h3>
        <p className="flex-1 text-[15.5px] text-slate">{description}</p>
        <span className="text-grad inline-flex items-center gap-1.5 text-[14.5px] font-bold">
          Explore this service
          <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </span>
      </Link>
    </Reveal>
  );
}
