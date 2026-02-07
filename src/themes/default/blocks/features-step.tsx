'use client';

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
      <div className="mx-4 overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 shadow-sm">
        <div className="relative">
          <div
            className={cn(
              'pointer-events-none absolute inset-0 opacity-[0.55]',
              // Subtle grid + glow to avoid the "default cards on gray" look.
              '[background-image:radial-gradient(1200px_circle_at_20%_-10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),radial-gradient(900px_circle_at_85%_0%,color-mix(in_oklch,var(--secondary)_18%,transparent),transparent_50%)]',
              '[background-size:auto,auto]',
              'dark:opacity-[0.18] dark:[background-image:radial-gradient(1200px_circle_at_20%_-10%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_55%),radial-gradient(900px_circle_at_85%_0%,color-mix(in_oklch,var(--secondary)_22%,transparent),transparent_50%)]'
            )}
          />

          <div className="@container relative container py-12 md:py-16">
            <ScrollAnimation>
              <div className="mx-auto max-w-2xl text-center">
                {section.label && (
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-foreground/70 shadow-xs">
                    {section.label}
                  </span>
                )}
                <h2 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-balance text-lg text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 @3xl:grid-cols-4">
                {section.items?.map((item, idx) => (
                  <div
                    className={cn(
                      'group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-[2px] transition',
                      'hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-1 hover:ring-ring/25',
                      'dark:hover:shadow-black/40'
                    )}
                    key={idx}
                  >
                    <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-90 dark:bg-primary/15" />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-primary">
                        <span className="font-mono tabular-nums">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </span>

                      {item.icon && (
                        <span className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-background/70 p-2 text-primary shadow-xs">
                          <SmartIcon
                            name={item.icon as string}
                            size={18}
                            className="text-current"
                          />
                        </span>
                      )}
                    </div>

                    <h3 className="relative mt-5 text-lg font-semibold leading-snug text-foreground">
                      {item.title}
                    </h3>

                    <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="relative mt-6 h-px w-full bg-gradient-to-r from-primary/35 via-secondary/20 to-transparent" />
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
