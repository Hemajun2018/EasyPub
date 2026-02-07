'use client';

import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section } from '@/shared/types/blocks/landing';

import {
  landingCardClassName,
  SectionBackdrop,
  SectionHeader,
} from './landing-section-kit';

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
      className={`relative overflow-hidden py-16 md:py-24 ${section.className} ${className}`}
    >
      <SectionBackdrop className="opacity-[0.55]" />

      <div className="container space-y-8 md:space-y-16">
        <ScrollAnimation>
          <SectionHeader
            title={section.title}
            description={section.description}
          />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="grid gap-6 md:grid-cols-3">
            {section.items?.map((item, idx) => (
              <div
                className={`${landingCardClassName} space-y-4 p-8 text-center`}
                key={idx}
              >
                {/* Subtle glow on hover */}
                <div className="from-primary/5 to-wechat-green/5 absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <h3 className="sr-only">
                  {item.title} {item.description}
                </h3>

                {/* Gradient number */}
                <div className="from-primary to-wechat-green relative bg-gradient-to-r bg-clip-text font-sans text-6xl font-black tracking-tight text-transparent tabular-nums md:text-7xl">
                  {item.title}
                </div>

                <p className="text-foreground/70 text-base font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
