'use client';

import { LazyImage } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { Section, SectionItem } from '@/shared/types/blocks/landing';

export function Testimonials({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const TestimonialCard = ({ item }: { item: SectionItem }) => {
    return (
      <div className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card/80 p-7 shadow-lg shadow-black/5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
        <p className='text-foreground/80 text-balance before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"]'>
          {item.quote || item.description}
        </p>
        <div className="flex items-center gap-3">
          {/* Avatar with gradient border */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary to-wechat-green opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative aspect-square size-10 overflow-hidden rounded-xl border border-border bg-card shadow-sm shadow-black/10">
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
      className={`py-16 md:py-24 ${section.className} ${className}`}
    >
      <div className="container">
        <ScrollAnimation>
          <div className="mx-auto max-w-2xl text-center text-balance">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold tracking-tight md:text-5xl">
              {section.title}
            </h2>
            <p className="text-foreground/70 mb-6 md:mb-12 lg:mb-16">
              {section.description}
            </p>
          </div>
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
