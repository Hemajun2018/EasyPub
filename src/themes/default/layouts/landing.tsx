import { ReactNode } from 'react';

import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';
import { Footer, Header } from '@/themes/default/blocks';

export default async function LandingLayout({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: HeaderType;
  footer: FooterType;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(1200px_520px_at_50%_-160px,rgba(120,170,255,0.35),transparent),radial-gradient(900px_460px_at_8%_-140px,rgba(255,208,170,0.45),transparent),linear-gradient(180deg,#fdf7f1_0%,#f6f9ff_40%,#ffffff_100%)]">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.8),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:90px_90px]" />
      </div>
      <Header header={header} />
      {children}
      <Footer footer={footer} />
    </div>
  );
}
