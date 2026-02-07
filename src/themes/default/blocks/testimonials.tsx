'use client';

import { LazyImage } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section, SectionItem } from '@/shared/types/blocks/landing';

import {
  landingCardClassName,
  SectionBackdrop,
  SectionHeader,
} from './landing-section-kit';

export function Testimonials({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const TestimonialCard = ({ item }: { item: SectionItem }) => {
    return (
      <div
        className={`${landingCardClassName} flex h-full flex-col justify-between gap-6 p-7 hover:-translate-y-2`}
      >
        <p className='text-foreground/80 text-balance before:mr-1 before:content-["\\201C"] after:ml-1 after:content-["\\201D"]'>
          {item.quote || item.description}
        </p>
        <div className="flex items-center gap-3">
          {/* Avatar with gradient border */}
          <div className="relative">
            <div className="from-primary to-wechat-green absolute -inset-0.5 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="border-border bg-card relative aspect-square size-10 overflow-hidden rounded-xl border shadow-sm shadow-black/10">
              <LazyImage
                src={item.image?.src || item.avatar?.src || ''}
                alt={item.image?.alt || item.avatar?.alt || item.name || ''}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <h3 className="sr-only">
            {item.name}, {item.role || item.title}
          </h3>
          <div className="space-y-px">
            <p className="text-sm font-medium">{item.name} </p>
            <p className="text-muted-foreground text-xs">
              {item.role || item.title}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id={section.id}
      className={`relative overflow-hidden py-16 md:py-24 ${section.className} ${className}`}
    >
      <SectionBackdrop className="opacity-[0.45]" />

      <div className="container">
        <ScrollAnimation>
          <SectionHeader
            title={section.title}
            description={section.description}
          />
        </ScrollAnimation>
        <ScrollAnimation delay={0.2}>
          <div className="relative rounded-3xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items?.map((item, index) => (
                <TestimonialCard key={index} item={item} />
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
