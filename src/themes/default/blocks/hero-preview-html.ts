import { normalizeTemplatePreviewHtml } from '@/shared/blocks/formatter/preview-html';

export function normalizeHeroPreviewHtml(html: string): string {
  return normalizeTemplatePreviewHtml(html);
}
