'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import {
  landingCardBaseClassName,
  SectionBackdrop,
  SectionHeader,
} from './landing-section-kit';

export function Faq({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={`relative overflow-hidden py-16 md:py-24 ${section.className || ''} ${className || ''}`}
    >
      <SectionBackdrop className="opacity-[0.45]" />

      <div className="container max-w-3xl">
        <ScrollAnimation>
          <SectionHeader
            title={section.title}
            description={section.description}
          />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mx-auto mt-12 max-w-full">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {section.items?.map((item, idx) => (
                <div className="group" key={idx}>
                  <AccordionItem
                    value={item.question || item.title || ''}
                    className={cn(
                      'peer data-[state=open]:bg-card overflow-hidden p-0',
                      // Keep the overall card language consistent with the rest of the landing page.
                      landingCardBaseClassName
                    )}
                  >
                    <AccordionTrigger className="cursor-pointer px-6 py-4 text-base font-semibold hover:no-underline">
                      {item.question || item.title || ''}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5">
                      <p className="text-foreground/70 text-base leading-relaxed">
                        {item.answer || item.description || ''}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>

            <p
              className="text-foreground/60 mt-6 px-2 text-sm"
              dangerouslySetInnerHTML={{ __html: section.tip || '' }}
            />
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
