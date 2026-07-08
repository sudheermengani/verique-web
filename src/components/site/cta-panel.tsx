import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { VeriqueButton, Arrow } from "@/components/site/verique-button";
import { siteConfig } from "@/lib/site";

export function CtaPanel() {
  return (
    <section className="relative mx-7 mb-[110px] overflow-hidden rounded-[28px] bg-ink before:absolute before:inset-0 before:bg-[radial-gradient(700px_380px_at_50%_-10%,rgba(37,99,235,0.35),transparent_65%),radial-gradient(520px_300px_at_10%_110%,rgba(0,200,245,0.22),transparent_60%),radial-gradient(520px_300px_at_90%_110%,rgba(139,61,246,0.25),transparent_60%)]">
      <div className="relative z-10 mx-auto max-w-[1180px] px-7 py-24 text-center text-white">
        <Image
          src="/verique-mark.png"
          alt=""
          width={63}
          height={58}
          className="mx-auto mb-7 h-[58px] w-auto"
        />
        <Reveal>
          <h2 className="font-display text-[clamp(36px,5.2vw,58px)] leading-[1.04] font-extrabold tracking-[-0.02em]">
            Ready to grow your business?
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-4.5 max-w-[52ch] text-lg text-[#AEB7C9]">
            Book a free strategy consultation. We&apos;ll review how you currently get
            customers, show you where the gaps are, and map out what we&apos;d do
            differently — whether you work with us or not.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <VeriqueButton href="/contact" variant="light">
              Book Free Consultation <Arrow />
            </VeriqueButton>
            <a
              href={`mailto:${siteConfig.email}`}
              className="border-b border-white/25 pb-0.5 font-mono text-sm text-[#AEB7C9] transition-colors hover:border-white hover:text-white"
            >
              {siteConfig.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
