import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeHeroPreviewHtml } from '@/themes/default/blocks/hero-preview-html';

test('Hero 预览会将图片占位符替换为图片', () => {
  const input =
    '<section>before</section><section style="text-align:center;">[[IMAGE:promo]]</section><section>after</section>';
  const output = normalizeHeroPreviewHtml(input);

  assert.equal(output.includes('[[IMAGE:promo]]'), false);
  assert.match(output, /<img[^>]+src="\/imgs\/fomatter\/1\.png"/);
});
