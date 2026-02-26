# Formatter Red Insight Lite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 新增一个“公众号稳定版”红色洞察风格模板（基于用户提供 HTML），并确保复制到公众号编辑器时稳定可用。

**Architecture:** 在现有 formatter 预设模板链路中新增一个内置 style，采用“混合方案”组件规则：保留视觉识别度（红色编号标题、渐变高亮、灰卡信息块），禁用高风险结构（SVG/复杂 grid），全部行内样式。通过可测试的 prompt builder 保证风格规则可验证。

**Tech Stack:** Next.js + TypeScript + 现有 formatter（gemini-service/types/style-selector）+ Node test runner（tsx --test）。

---

### Task 1: 建立测试入口并写失败用例

**Files:**
- Modify: `src/shared/blocks/formatter/gemini-service.ts`
- Create: `src/shared/blocks/formatter/__tests__/style-prompts.test.ts`

1. 提取/暴露内置 style prompt builder（先不实现新风格）。
2. 编写失败测试：断言新 style 在枚举、选项、prompt 规则中存在并含稳定约束（禁 SVG/grid）。
3. 运行测试并确认失败。

### Task 2: 实现新风格模板（稳定版）

**Files:**
- Modify: `src/shared/blocks/formatter/types.ts`
- Modify: `src/shared/blocks/formatter/gemini-service.ts`
- Modify: `src/shared/blocks/formatter/formatter-app.tsx`

1. 新增 `StyleType` 与 `FORMATTING_OPTIONS` 条目。
2. 在 prompt builder 增加 “Red Insight Lite” 规则：
   - 统一正文样式
   - 01/02 编号标题
   - 渐变高亮 + 红下划线
   - 灰底要点卡/对比卡/流程卡（纯 section）
   - 明确禁用 SVG、复杂 grid、绝对定位
3. 在图片替换样式中加入该风格的图像容器表现。

### Task 3: 验证与差异评估

**Files:**
- (optional) Modify: `public/preview-samples.json`

1. 运行新增测试与 lint。
2. 若环境允许，尝试生成 preview 样例；不可用则给出原因与替代比对（基于规则覆盖率对照用户原始 HTML）。
3. 形成“差异是否巨大”结论与风险点说明。
