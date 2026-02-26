import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeTemplatePreviewHtml } from '@/shared/blocks/formatter/preview-html';

test('将 [[IMAGE:promo]] 渲染为预览图 img', () => {
  const input = '<section>before</section><section style="text-align:center;">[[IMAGE:promo]]</section><section>after</section>';
  const output = normalizeTemplatePreviewHtml(input);

  assert.equal(output.includes('[[IMAGE:promo]]'), false);
  assert.match(output, /<img[^>]+src="\/imgs\/fomatter\/1\.png"/);
  assert.match(output, /alt="preview-promo"/);
});
