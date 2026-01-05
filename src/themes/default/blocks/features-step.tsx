'use client';

import { ArrowBigRight } from 'lucide-react';

import { SmartIcon } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

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
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="m-4 rounded-[2rem]">
        <div className="@container relative container">
          <ScrollAnimation>
            <div className="mx-auto max-w-2xl text-center">
              {section.label && (
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">
                  {section.label}
                </span>
              )}
              <h2 className="text-foreground mt-4 font-serif text-4xl font-semibold md:text-5xl">
                {section.title}
              </h2>
              <p className="text-foreground/70 mt-4 text-lg text-balance">
                {section.description}
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div className="mt-16 grid gap-6 @3xl:grid-cols-4">
              {section.items?.map((item, idx) => (
                <div
                  className="relative space-y-5 rounded-2xl border border-black/10 bg-white/75 p-6 shadow-lg shadow-black/5"
                  key={idx}
                >
                  <div className="flex items-center justify-between text-sm font-medium text-foreground/60">
                    <span>Step {idx + 1}</span>
                    <span className="text-foreground/40">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-black text-white">
                      {item.icon && (
                        <SmartIcon name={item.icon as string} size={20} />
                      )}
                    </span>
                    <h3 className="text-foreground text-lg font-semibold">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {idx < (section.items?.length ?? 0) - 1 && (
                    <ArrowBigRight className="stroke-black/20 absolute -right-5 top-1/2 hidden h-5 w-8 -translate-y-1/2 @3xl:block" />
                  )}
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
