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
      className={`relative py-12 md:py-24 ${section.className} ${className} overflow-hidden`}
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(53,158,255,0.15),transparent_70%)] blur-3xl" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(7,193,96,0.15),transparent_70%)] blur-3xl" />
      </div>

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
          <div className="grid gap-6 md:grid-cols-3">
            {section.items?.map((item, idx) => (
              <div
                className="group relative space-y-4 rounded-2xl border border-border bg-card/80 p-8 text-center shadow-lg shadow-black/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
                key={idx}
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-wechat-green/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <h3 className="sr-only">
                  {item.title} {item.description}
                </h3>
                
                {/* Gradient number */}
                <div className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary to-wechat-green font-serif text-6xl md:text-7xl font-black tracking-tight">
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
