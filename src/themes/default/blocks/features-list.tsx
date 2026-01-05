'use client';

import { Link } from '@/core/i18n/navigation';
import { LazyImage, SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function FeaturesList({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    // Prevent horizontal scrolling
    <section
      className={cn(
        'relative overflow-x-hidden py-16 md:py-24',
        section.className,
        className
      )}
    >
      <div className="container overflow-x-hidden">
        <div className="grid items-center gap-10 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="w-full min-w-0 flex-1">
            {section.label && (
              <ScrollAnimation>
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">
                  {section.label}
                </span>
              </ScrollAnimation>
            )}
            <ScrollAnimation delay={0.1}>
              <h2 className="text-foreground mt-4 font-serif text-4xl font-semibold text-balance break-words md:text-5xl">
                {section.title}
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <p className="text-foreground/70 my-6 text-base leading-relaxed text-balance break-words md:text-lg">
                {section.description}
              </p>
            </ScrollAnimation>

            {section.buttons && section.buttons.length > 0 && (
              <ScrollAnimation delay={0.3}>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {section.buttons?.map((button, idx) => (
                    <Button
                      asChild
                      key={idx}
                      variant={button.variant || 'default'}
                      size={button.size || 'default'}
                    >
                      <Link
                        href={button.url ?? ''}
                        target={button.target ?? '_self'}
                        className={cn(
                          'focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                          'h-9 px-4 py-2',
                          'bg-background ring-foreground/10 hover:bg-muted/50 dark:ring-foreground/15 dark:hover:bg-muted/50 border border-transparent shadow-sm ring-1 shadow-black/15 duration-200'
                        )}
                      >
                        {button.icon && (
                          <SmartIcon name={button.icon as string} size={24} />
                        )}
                        {button.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </ScrollAnimation>
            )}
          </div>
          <ScrollAnimation direction="right">
            <div className="relative mx-auto w-full max-w-[520px] flex-shrink-0">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(111,157,255,0.35),transparent_60%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 p-3 shadow-2xl shadow-black/10 backdrop-blur">
                <LazyImage
                  src={section.image?.src ?? ''}
                  alt={section.image?.alt ?? ''}
                  className="h-auto w-full rounded-[1.6rem] object-cover"
                />
              </div>
            </div>
          </ScrollAnimation>
        </div>

        <ScrollAnimation delay={0.1}>
          {/* Prevent horizontal scrolling, min-w-0 and break-words */}
          <div className="relative grid min-w-0 grid-cols-1 gap-4 border-t border-black/10 pt-12 break-words sm:grid-cols-2 lg:grid-cols-4">
            {section.items?.map((item, idx) => (
              <div
                className="min-w-0 space-y-3 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm shadow-black/5 break-words"
                key={idx}
              >
                <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  {item.icon && (
                    <SmartIcon name={item.icon as string} size={16} />
                  )}
                  <h3 className="min-w-0 break-words">
                    {item.title}
                  </h3>
                </div>
                <p className="text-foreground/70 min-w-0 text-sm leading-relaxed break-words">
                  {item.description ?? ''}
                </p>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
