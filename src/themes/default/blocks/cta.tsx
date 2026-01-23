'use client';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Cta({
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
      <div className="container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-[radial-gradient(600px_220px_at_50%_-40px,var(--primary-foreground),transparent),bg-card] px-6 py-16 text-center shadow-2xl shadow-black/10 md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_55%)]" />
          <ScrollAnimation>
            <h2 className="text-foreground relative font-serif text-4xl font-semibold text-balance lg:text-5xl">
              {section.title}
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.15}>
            <p
              className="text-foreground/70 relative mt-4 text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </ScrollAnimation>

          <ScrollAnimation delay={0.3}>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              {section.buttons?.map((button, idx) => (
                <Button
                  asChild
                  size={button.size || 'lg'}
                  variant={button.variant || 'default'}
                  key={idx}
                  className={cn(
                    'rounded-full px-8 text-sm font-medium shadow-lg transition',
                    button.variant === 'outline'
                      ? 'bg-card text-foreground shadow-black/10 ring-1 ring-border hover:bg-card/90'
                      : 'bg-primary text-primary-foreground shadow-primary/25 hover:opacity-90'
                  )}
                >
                  <Link
                    href={button.url || ''}
                    target={button.target || '_self'}
                  >
                    {button.icon && <SmartIcon name={button.icon as string} />}
                    <span>{button.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
