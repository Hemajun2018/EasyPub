'use client';

import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section } from '@/shared/types/blocks/landing';

export function Stats({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={`py-12 md:py-24 ${section.className} ${className}`}
    >
      <div className={`container space-y-8 md:space-y-16`}>
        <ScrollAnimation>
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold tracking-tight md:text-5xl">
              {section.title}
            </h2>
            <p className="text-foreground/70 mb-6 md:mb-12 lg:mb-16">
              {section.description}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="grid gap-4 md:grid-cols-3">
            {section.items?.map((item, idx) => (
              <div
                className="space-y-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm shadow-black/5"
                key={idx}
              >
                <h3 className="sr-only">
                  {item.title} {item.description}
                </h3>
                <div className="text-foreground font-serif text-5xl font-semibold">
                  {item.title}
                </div>
                <p className="text-foreground/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
