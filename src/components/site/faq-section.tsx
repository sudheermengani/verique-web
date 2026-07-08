import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/reveal";
import type { Faq } from "@/lib/services-data";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <Reveal className="mx-auto max-w-[780px]">
      <Accordion className="gap-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={faq.question}
            value={`item-${i}`}
            className="rounded-[14px] border border-line bg-white px-6.5 not-last:border-b-0"
          >
            <AccordionTrigger className="py-5 text-[16.5px] font-bold hover:no-underline [&_svg]:hidden">
              {faq.question}
              <span className="text-grad ml-4 shrink-0 font-display text-2xl font-normal">+</span>
            </AccordionTrigger>
            <AccordionContent className="text-base text-slate">
              <p className="pb-1">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  );
}
