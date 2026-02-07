'use client';

import { cn } from '@/shared/lib/utils';

export function SectionBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
    >
      <div className="absolute top-10 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(53,158,255,0.22),transparent_65%)] blur-[90px]" />
      <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(7,193,96,0.18),transparent_65%)] blur-[90px]" />
      <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:96px_96px] opacity-35" />
    </div>
  );
}

export function SectionHeader({
  label,
  title,
  description,
  className,
}: {
  label?: string | null;
  title?: string | null;
  description?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn('mx-auto max-w-2xl text-center text-balance', className)}
    >
      {label ? (
        <span className="border-primary/15 bg-primary/10 text-primary inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.22em] uppercase backdrop-blur">
          {label}
        </span>
      ) : null}
      {title ? (
        <h2 className="text-foreground mt-4 font-sans text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="text-foreground/70 mt-4 text-base leading-relaxed md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export const landingCardBaseClassName =
  'group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm shadow-black/5 backdrop-blur-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:ring-1 hover:ring-primary/15 dark:hover:shadow-black/40';

export const landingCardClassName = `${landingCardBaseClassName} h-full p-6 hover:-translate-y-1`;
