'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section } from '@/shared/types/blocks/landing';

export function Faq({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section id={section.id} className={`py-16 md:py-24 ${className}`}>
      <div className={`mx-auto max-w-full px-4 md:max-w-3xl md:px-8`}>
        <ScrollAnimation>
          <div className="mx-auto max-w-2xl text-center text-balance">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold tracking-tight md:text-5xl">
              {section.title}
            </h2>
            <p className="text-foreground/70 mb-6 md:mb-12 lg:mb-16">
              {section.description}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mx-auto mt-12 max-w-full">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-3"
            >
              {section.items?.map((item, idx) => (
                <div className="group" key={idx}>
                  <AccordionItem
                    value={item.question || item.title || ''}
                    className="peer rounded-2xl border border-black/10 bg-white/80 px-6 py-2 shadow-sm shadow-black/5 data-[state=open]:bg-white"
                  >
                    <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline">
                      {item.question || item.title || ''}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-foreground/70 text-base leading-relaxed">
                        {item.answer || item.description || ''}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <hr className="mx-7 border-dashed border-black/10 group-last:hidden peer-data-[state=open]:opacity-0" />
                </div>
              ))}
            </Accordion>

            <p
              className="text-foreground/60 mt-6 px-8 text-sm"
              dangerouslySetInnerHTML={{ __html: section.tip || '' }}
            />
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
