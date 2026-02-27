import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMATTING_OPTIONS, StyleType } from '../types';
import { getBuiltInStylePrompt } from '../gemini-service';

test('should expose the new Red Insight Lite style in option list', () => {
  const option = FORMATTING_OPTIONS.find((x) => x.id === StyleType.RED_INSIGHT_LITE);
  assert.ok(option, 'missing Red Insight Lite option');
  assert.match(option?.name || '', /红色洞察/);
});

test('should expose Orange Pulse Brief style in option list', () => {
  const option = FORMATTING_OPTIONS.find((x) => x.id === StyleType.ORANGE_PULSE_BRIEF);
  assert.ok(option, 'missing Orange Pulse Brief option');
  assert.match(option?.name || '', /橙势简报/);
});

test('should provide wechat-safe stable prompt constraints for Red Insight Lite', () => {
  const prompt = getBuiltInStylePrompt(StyleType.RED_INSIGHT_LITE);

  assert.match(prompt, /STYLE TARGET:\s*"Red Insight Lite"/);
  assert.match(prompt, /Do NOT use <svg>/i);
  assert.match(prompt, /Do NOT use CSS grid/i);
  assert.match(prompt, /INLINE CSS ONLY/i);
  assert.match(prompt, /NUMBERED SECTION HEADING/i);
  assert.match(prompt, /MANDATORY for major chapter headings/i);
  assert.match(prompt, /Every major chapter heading MUST use this numbered block/i);
  assert.match(prompt, /including short English headings like "The End"/i);
  assert.match(prompt, /ONE visual row/i);
  assert.match(prompt, /red hollow circle \+ small black star/i);
  assert.match(prompt, /NO image icon, NO svg icon/i);
  assert.match(prompt, /○/);
  assert.match(prompt, /&#10022;/);
  assert.match(prompt, /font-size:\s*10px/i);
  assert.match(prompt, /line-height:\s*2/i);
  assert.match(prompt, /vertical-align:\s*top/i);
  assert.match(prompt, /vertical-align:\s*bottom/i);
  assert.match(prompt, /margin-left:\s*8px/i);
  assert.match(prompt, /margin-left:\s*-20px/i);
  assert.match(prompt, /GRADIENT HIGHLIGHT/i);
});
