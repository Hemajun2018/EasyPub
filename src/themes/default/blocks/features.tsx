'use client';

import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import {
  landingCardClassName,
  SectionBackdrop,
  SectionHeader,
} from './landing-section-kit';

export function Features({
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
      <SectionBackdrop className="opacity-[0.45]" />

      <div className="container space-y-8 md:space-y-16">
        <ScrollAnimation>
          <SectionHeader
            title={section.title}
            description={section.description}
          />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="relative mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.items?.map((item, idx) => (
              <div className={cn(landingCardClassName, 'space-y-3')} key={idx}>
                <div className="flex items-center gap-3">
                  <div className="from-primary to-wechat-green shadow-primary/20 flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <SmartIcon name={item.icon as string} size={18} />
                  </div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
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
