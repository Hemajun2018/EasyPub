import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('HeroPreview 组件应使用 normalizeHeroPreviewHtml 处理预览 HTML', () => {
  const filePath = path.resolve(process.cwd(), 'src/themes/default/blocks/hero-preview.tsx');
  const source = readFileSync(filePath, 'utf8');

  assert.match(source, /from\s+['"]@\/themes\/default\/blocks\/hero-preview-html['"]/);
  assert.match(source, /normalizeHeroPreviewHtml\s*\(/);
});
