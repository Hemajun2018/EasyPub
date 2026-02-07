'use client';

import { SmartIcon } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import {
  landingCardClassName,
  SectionBackdrop,
  SectionHeader,
} from './landing-section-kit';

export function FeaturesStep({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn(
        'relative overflow-hidden py-16 md:py-24',
        section.className,
        className
      )}
    >
      <SectionBackdrop className="opacity-[0.55]" />

      <div className="@container relative container">
        <ScrollAnimation>
          <SectionHeader
            label={section.label}
            title={section.title}
            description={section.description}
          />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 @3xl:grid-cols-4">
            {section.items?.map((item, idx) => (
              <div className={landingCardClassName} key={idx}>
                <div className="bg-primary/10 dark:bg-primary/15 pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full blur-2xl transition-opacity group-hover:opacity-90" />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.22em]">
                    <span className="font-mono tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </span>

                  {item.icon ? (
                    <span className="border-border/60 bg-background/70 text-primary inline-flex items-center justify-center rounded-xl border p-2 shadow-xs">
                      <SmartIcon
                        name={item.icon as string}
                        size={18}
                        className="text-current"
                      />
                    </span>
                  ) : null}
                </div>

                <h3 className="text-foreground relative mt-5 text-lg leading-snug font-semibold">
                  {item.title}
                </h3>

                <p className="text-muted-foreground relative mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="from-primary/35 via-wechat-green/25 relative mt-6 h-px w-full bg-gradient-to-r to-transparent" />
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
