import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { VeriqueButton, Arrow } from "@/components/site/verique-button";

export function PageHero({
  crumb,
  h1,
  lede,
  showCtas = true,
}: {
  crumb: string;
  h1: string;
  lede: string;
  showCtas?: boolean;
}) {
  return (
    <header className="relative overflow-hidden bg-paper-tint pt-[136px] pb-[60px] md:pt-[168px] md:pb-[76px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_380px_at_85%_0%,rgba(0,200,245,0.12),transparent_65%),radial-gradient(560px_420px_at_5%_100%,rgba(139,61,246,0.08),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1180px] px-7">
        <span className="mb-5.5 block font-mono text-xs tracking-[0.1em] text-slate uppercase">
          <Link href="/" className="hover:text-blue">
            Home
          </Link>{" "}
          / {crumb}
        </span>
        <h1 className="max-w-[15ch] font-display text-[clamp(40px,6vw,68px)] leading-[1.02] font-extrabold tracking-[-0.025em]">
          {h1}
        </h1>
        <p className="mt-5.5 max-w-[56ch] text-[19.5px] text-slate">{lede}</p>
        {showCtas && (
          <div className="mt-8.5 flex flex-wrap gap-3.5">
            <VeriqueButton href="/contact">
              Book Free Consultation <Arrow />
            </VeriqueButton>
            <VeriqueButton href="/services" variant="ghost">
              All services
            </VeriqueButton>
          </div>
        )}
      </div>
    </header>
  );
}

export function SectionHead({
  eyebrow,
  heading,
  description,
  center,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto mb-15 max-w-[660px] text-center" : "mb-15 max-w-[660px]"}>
      <p className={`eyebrow ${center ? "center" : ""}`}>{eyebrow}</p>
      <h2 className="mt-4.5 mb-4 font-display text-[clamp(34px,4.4vw,50px)] leading-[1.06] font-bold tracking-[-0.02em]">
        {heading}
      </h2>
      {description && <p className="text-lg text-slate">{description}</p>}
    </Reveal>
  );
}
