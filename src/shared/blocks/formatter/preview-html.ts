const PREVIEW_IMAGE_MAP: Record<string, { src: string; alt: string }> = {
  promo: {
    src: '/imgs/fomatter/1.png',
    alt: 'preview-promo',
  },
};

function replacePreviewImageTokens(html: string): string {
  return html.replace(/\[\[\s*image\s*:\s*([^\]]+?)\s*\]\]/gi, (_full, token) => {
    const key = String(token || '').trim().toLowerCase();
    const matched = PREVIEW_IMAGE_MAP[key];
    if (!matched) return '';

    return `<img src="${matched.src}" alt="${matched.alt}" style="width: 100%; height: auto; display: block; border-radius: 8px;" />`;
  });
}

export function normalizeTemplatePreviewHtml(html: string): string {
  return replacePreviewImageTokens(html)
    .replace(
      /<(h[1-6]|p|section|div)[^>]*>(?:<[^>]+>)*\s*EasyPub[：:][\s\S]*?排版助手\s*(?:<\/[^>]+>)*<\/\1>/i,
      ''
    )
    .replace(/<(section|div|p)[^>]*>\s*<\/\1>/gi, '')
    .replace(/<section<section/gi, '<section ')
    .replace(/margin-top:\s*-\d+(\.\d+)?em/gi, 'margin-top: 0');
}
