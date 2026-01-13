import { setRequestLocale } from 'next-intl/server';

import { FormatterApp } from '@/shared/blocks/formatter';

export default async function FormatterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FormatterApp />;
}
