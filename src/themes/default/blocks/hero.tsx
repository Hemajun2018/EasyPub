import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { Highlighter } from '@/shared/components/ui/highlighter';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import { HeroPreview } from './hero-preview';
import { SocialAvatars } from './social-avatars';

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const highlightText = section.highlight_text ?? '';
  const hasBackgroundImage = Boolean(section.background_image?.src);
  const titleLines = (section.title ?? '').split('\n');
  const renderLine = (line: string) => {
    if (!highlightText || !line.includes(highlightText)) {
      return line;
    }
    const [before, after] = line.split(highlightText, 2);
    return (
      <>
        {before}
        <Highlighter action="underline" color="var(--primary)">
          {highlightText}
        </Highlighter>
        {after}
      </>
    );
  };

  return (
    <section
      id={section.id}
      className={cn(
        'relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28',
        section.className,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        {!hasBackgroundImage && (
          <>
            {/* Large glow effects */}
            <div className="absolute -right-24 top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(53,158,255,0.35),transparent_65%)] blur-[120px] opacity-50" />
            <div className="absolute -left-16 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(7,193,96,0.35),transparent_65%)] blur-[100px] opacity-50" />
          </>
        )}
      </div>
      {/* New Feature Badge with Pulse Animation */}
      <div className="mx-auto mb-8 flex w-fit items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          为公众号创作者而生
        </div>
      </div>

      {section.announcement && (
        <Link
          href={section.announcement.url || ''}
          target={section.announcement.target || '_self'}
          className="group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border border-border bg-card/80 p-1 pl-4 text-sm font-medium shadow-sm shadow-black/5 backdrop-blur transition"
        >
          <span className="text-foreground">
            {section.announcement.title}
          </span>
          <span className="block h-4 w-0.5 border-l border-border bg-muted" />

          <div className="size-6 overflow-hidden rounded-full bg-primary text-primary-foreground duration-500 group-hover:translate-x-0.5">
            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
              <span className="flex size-6">
                <ArrowRight className="m-auto size-3" />
              </span>
              <span className="flex size-6">
                <ArrowRight className="m-auto size-3" />
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className="relative mx-auto max-w-full px-4 text-center md:max-w-4xl">
        <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] font-black tracking-tight text-balance">
          {titleLines.map((line, index) => {
            // Apply gradient to the second line (index 1)
            if (index === 1) {
              return (
                <span className="block" key={`${line}-${index}`}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-wechat-green">
                    {line}
                  </span>
                </span>
              );
            }
            return (
              <span className="block text-foreground" key={`${line}-${index}`}>
                {renderLine(line)}
              </span>
            );
          })}
        </h1>

        <p
          className="text-foreground/70 mx-auto mt-6 mb-12 max-w-2xl text-base leading-relaxed text-balance sm:text-lg"
          dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
        />

        {section.buttons && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {section.buttons.map((button, idx) => (
              <Button
                asChild
                size={button.size || 'lg'}
                variant={button.variant || 'default'}
                className={cn(
                  'rounded-full px-20 py-5 text-base font-bold shadow-lg transition-all hover:scale-105',
                  button.variant === 'outline'
                    ? 'bg-card/80 text-foreground shadow-black/10 ring-1 ring-border hover:bg-card'
                    : 'bg-primary text-primary-foreground shadow-primary/30 hover:opacity-90'
                )}
                key={idx}
              >
                <Link href={button.url ?? ''} target={button.target ?? '_self'}>
                  {button.icon && <SmartIcon name={button.icon as string} />}
                  <span>{button.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}

        {section.tip && (
          <p
            className="text-foreground/60 mt-6 block text-center text-sm"
            dangerouslySetInnerHTML={{ __html: section.tip ?? '' }}
          />
        )}

        {section.show_avatars && (
          <div className="mt-8">
            <SocialAvatars tip={section.avatars_tip || ''} />
          </div>
        )}
      </div>

      {/* Before/After Preview Component */}
      <div className="relative mt-12 sm:mt-16">
        <HeroPreview />
      </div>

      {(section.image?.src || section.image_invert?.src) && (
        <div className="relative mt-12 sm:mt-16">
          <div className="relative z-10 mx-auto max-w-6xl px-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/70 shadow-2xl shadow-black/10 backdrop-blur">
              <div
                aria-hidden
                className="h-6 w-full bg-[linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:12px_12px]"
              />
              {section.image_invert?.src && (
                <Image
                  className="relative z-2 hidden w-full border-t border-black/5 dark:block"
                  src={section.image_invert.src}
                  alt={section.image_invert.alt || section.image?.alt || ''}
                  width={
                    section.image_invert.width || section.image?.width || 1200
                  }
                  height={
                    section.image_invert.height || section.image?.height || 630
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={75}
                  unoptimized={section.image_invert.src.startsWith('http')}
                />
              )}
              {section.image?.src && (
                <Image
                  className="relative z-2 block w-full border-t border-black/5 dark:hidden"
                  src={section.image.src}
                  alt={section.image.alt || section.image_invert?.alt || ''}
                  width={
                    section.image.width || section.image_invert?.width || 1200
                  }
                  height={
                    section.image.height || section.image_invert?.height || 630
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={75}
                  unoptimized={section.image.src.startsWith('http')}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {section.background_image?.src && (
        <div className="absolute inset-0 -z-10 hidden h-full w-full overflow-hidden md:block">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/10 via-white/30 to-white/70" />
          <Image
            src={section.background_image.src}
            alt={section.background_image.alt || ''}
            className="object-cover opacity-70"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 0vw, 100vw"
            quality={70}
            unoptimized={section.background_image.src.startsWith('http')}
          />
        </div>
      )}
    </section>
  );
}
