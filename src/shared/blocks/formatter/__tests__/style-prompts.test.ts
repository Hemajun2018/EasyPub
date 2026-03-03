import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMATTING_OPTIONS, StyleType } from '../types';
import { getBuiltInStylePrompt, postProcessRedInsightHtml } from '../gemini-service';

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

test('should expose 36Kr style in option list', () => {
  const option = FORMATTING_OPTIONS.find((x) => x.id === StyleType.KR_36_FEATURE_BLUE);
  assert.ok(option, 'missing 36Kr style option');
  assert.match(option?.name || '', /36氪深蓝/);
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
  assert.match(prompt, /SUBSECTION HEADING/i);
  assert.match(prompt, /Understand article structure first/i);
  assert.match(prompt, /Major chapters => numbered heading block/i);
  assert.match(prompt, /Subtopics inside a chapter => subsection heading block/i);
  assert.match(prompt, /GRADIENT HIGHLIGHT/i);
});

test('should only promote title-like red highlights to subsection headings', () => {
  const input = `
<section style="max-width: 677px;">
  <section style="margin: 28px 24px 16px;">
    <section style="line-height: 1;">
      <span style="font-size: 50px; line-height: 1; font-weight: 700; color: rgb(220,38,38); letter-spacing: -1px;">01</span>
      <span style="display: inline-block; font-size: 10px; line-height: 2; font-weight: 700; color: rgb(239,68,68); margin-left: 8px; vertical-align: top;">○</span>
      <span style="display: inline-block; font-size: 10px; line-height: 2; color: rgb(17,24,39); margin-left: -20px; vertical-align: bottom;">&#10022;</span>
    </section>
    <section style="margin-top: 6px; font-size: 28px; line-height: 1.4; font-weight: 700; color: rgb(51,51,51);">核心优势</section>
  </section>
  <p style="margin: 0 24px 10px;"><span style="background: linear-gradient(120deg, rgb(255,205,210) 0%, rgba(255,255,255,0) 100%);">AI 语义级排版</span></p>
  <p style="font-size: 15px; color: rgb(55,65,81); line-height: 1.8; letter-spacing: 0.5px; margin: 0 24px 20px;">段落A</p>
  <p style="margin: 0 24px 10px;"><span style="background: linear-gradient(120deg, rgb(255,205,210) 0%, rgba(255,255,255,0) 100%);">这是一句带标点的强调，不应提升。</span></p>
  <p style="font-size: 15px; color: rgb(55,65,81); line-height: 1.8; letter-spacing: 0.5px; margin: 0 24px 20px;">段落B</p>
</section>`;

  const out = postProcessRedInsightHtml(input);
  assert.match(out, /font-size:\s*22px/);
  assert.match(out, />AI 语义级排版<\/section>/);
  assert.match(out, /这是一句带标点的强调，不应提升。/);
  assert.match(out, /<p style="margin: 0 24px 10px;">\s*<span style="background: linear-gradient\(120deg, rgb\(255,205,210\) 0%, rgba\(255,255,255,0\) 100%\);">这是一句带标点的强调，不应提升。<\/span>\s*<\/p>/);
});

test('should provide 36Kr style prompt with direct numbered heading constraints', () => {
  const prompt = getBuiltInStylePrompt(StyleType.KR_36_FEATURE_BLUE);

  assert.match(prompt, /STYLE TARGET:\s*"36Kr Feature Blue"/);
  assert.match(prompt, /INLINE CSS ONLY/i);
  assert.match(prompt, /Do NOT use <svg>/i);
  assert.match(prompt, /Do NOT use images as heading numbers/i);
  assert.match(prompt, /NUMBERED SECTION HEADING/i);
  assert.match(prompt, /sequentially incremented as 01, 02, 03/i);
  assert.match(prompt, /first digit must be visually smaller than the second digit/i);
  assert.match(prompt, /same bottom baseline/i);
  assert.match(prompt, /same serif font family/i);
  assert.match(prompt, /align-items:\s*flex-end/i);
  assert.match(prompt, /translateY\(-4px\)/i);
  assert.match(prompt, /Bodoni 72/i);
  assert.match(prompt, /Bodoni MT/i);
  assert.match(prompt, /Didot/i);
  assert.match(prompt, /Each major heading must appear exactly once/i);
  assert.match(prompt, /color:\s*rgb\(0,\s*52,\s*198\)/i);
  assert.match(prompt, /background-color:\s*rgb\(214,\s*214,\s*214\)/i);
});
