总是用中文回复
# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router routes (e.g., `[locale]/(landing)/page.tsx`).
- `src/core`: Platform core (auth, db/drizzle, RBAC, theme, i18n setup).
- `src/config`: App configuration and i18n messages.
- `src/extensions`: Optional integrations (AI, payments, storage, email).
- `src/shared`: Utilities, types, services shared across modules.
- `content/pages`: MDX content (legal, docs). 
- `public`: Static assets (`logo.png`, `favicon.ico`, `sitemap.xml`).
- `.claude/skills`: Project automation/bootstrapping scripts (e.g., quick-start).
- `scripts`: One-off maintenance (RBAC init/assign, etc.).

## 项目架构梳理（中文）
- **总体定位**：基于 Next.js App Router 的 AI SaaS 建站模板，覆盖鉴权/RBAC、支付订阅、积分计费、AI 生成、内容系统、国际化与多主题。
- **路由层 (`src/app`)**：按 locale 分区；含 `(landing)` 官网、`(docs)` 文档、`(chat)` 对话、`(admin)` 管理台、`(formatter)` 排版器；`api/**` 为后端接口。
- **核心层 (`src/core`)**：鉴权 (`auth`)、数据库 (`db`/Drizzle)、权限 (`rbac`)、国际化 (`i18n`)、主题 (`theme`)、文档 (`docs`)。
- **配置层 (`src/config`)**：环境变量聚合、i18n 文案、样式与主题配置、数据库 schema。
- **扩展层 (`src/extensions`)**：AI/支付/存储/邮件等提供方适配与统一接口。
- **共享层 (`src/shared`)**：通用模型、服务、UI Blocks 与组件。
- **内容与静态资源**：`content/` 放 MDX，`public/` 放静态资源。
- **排版器模块**：入口 `src/app/[locale]/(formatter)/formatter/page.tsx`，主逻辑 `src/shared/blocks/formatter/formatter-app.tsx`。支持多风格排版、自定义模板、图片占位与复制到公众号；后端接口 `src/app/api/formatter/*` 负责 AI 生成与公众号正文抓取。

## 技术架构细节（数据流 / 调用链 / 依赖）
### 1) 路由与国际化数据流
- `middleware.ts`：识别/校验 locale → 重写路由 → 设置公共缓存头。
- `src/core/i18n/config.ts`：集中定义 `locales`/`defaultLocale`/`localePrefix`。
- `src/core/i18n/request.ts`：按请求 locale 加载 `src/config/locale/messages/**`。
- 页面层：`src/app/[locale]/**` 中各页面 `setRequestLocale(locale)` 确保服务端渲染一致。

### 2) 鉴权 / RBAC 调用链
- 客户端：`src/core/auth/client.ts` → `useSession` 获取会话。
- 服务端：`src/core/auth/index.ts` 生成 `auth` 实例；`src/core/auth/config.ts` 处理 locale 与回调 URL。
- 权限守卫：`src/core/rbac/permission.ts` 中 `requirePermission/requireRole` → 失败时重定向。
- 管理台页面：`src/app/[locale]/(admin)/**` 使用 `getTranslations` + 权限校验逻辑。

### 3) 数据库与模型依赖
- Schema：`src/config/db/schema.ts` 定义用户、内容、订单、订阅、积分、AI 任务、聊天、RBAC 等表。
- 连接层：`src/core/db/index.ts` 根据运行环境选择连接策略（Node/Workers/Hyperdrive）。
- 领域模型：`src/shared/models/**` 负责具体实体查询与聚合逻辑。

### 4) 支付与积分数据流
- 创建支付：前端 → `src/shared/services/payment.ts` → `src/extensions/payment/*` → 生成订单/订阅。
- 回调处理：`/api/payment/notify/[provider]` → 更新订单/订阅 → 驱动积分发放/续费。
- 积分扣减：`src/shared/models/credit.ts` 提供扣减/回滚与聚合查询。

### 5) AI 生成与 Chat 数据流
- 统一入口：`src/shared/services/ai.ts` → 按配置注入 `src/extensions/ai/*`。
- Chat API：`src/app/api/chat/route.ts` → 权限与积分校验 → 流式生成 → 持久化消息。
- UI 渲染：`src/shared/components/ai-elements/*` 处理流式与推理展示。

### 6) 内容系统与主题依赖
- 文档/博客/页面：`content/` + `source.config.ts` → `src/core/docs/source.ts` 生成数据源。
- 主题加载：`src/core/theme/index.ts` 动态加载 `src/themes/<name>`。
- UI Blocks：`src/themes/default/blocks/*` 提供可复用主题块。

### 7) 排版器（AI 排版）完整调用链
- 入口：`/formatter` → `src/shared/blocks/formatter/formatter-app.tsx`
- 文本输入：清理 Word/WPS 噪音 → 解析图片 → 统一占位符（`[[IMAGE:id]]`/`[[URL:n]]`）
- 图片存储：`image-compressor.ts` 压缩 → `image-store.ts` 存 IndexedDB
- AI 排版：`gemini-service.ts` → `POST /api/formatter/generate` → Evolink/Gemini → 返回 HTML
- 模板系统：
  - `POST /api/formatter/fetch-article` 抓取公众号正文
  - `analyzeHtmlToTemplate` 生成模板提示词 + 图片样式
  - `template-store.ts` 存 localStorage
- 渲染与复制：占位符替换成带样式 `<img>` → 复制时转 base64 以适配公众号粘贴

### 8) 模块依赖图（概念）
- `src/app` → `src/shared/blocks` → `src/shared/services` → `src/extensions/*`
- `src/app/api` → `src/shared/models` / `src/shared/services` → `src/core/*`
- `src/core` 与 `src/config` 为全局底座，几乎被所有模块引用

## Build, Test, and Development Commands
- `pnpm dev`: Run local dev server with Turbopack.
- `pnpm build` | `pnpm build:fast`: Production build (fast raises Node memory limit).
- `pnpm start`: Start a production build locally.
- `pnpm lint`: Lint with ESLint.
- `pnpm format` | `pnpm format:check`: Format with Prettier/check only.
- Database: `pnpm db:generate` | `db:migrate` | `db:push` | `db:studio`.
- Auth/RBAC: `pnpm auth:generate` | `rbac:init` | `rbac:assign`.
- Cloudflare: `pnpm cf:preview` | `cf:deploy` | `cf:upload` | `cf:typegen`.

## Coding Style & Naming Conventions
- TypeScript, React 19, Next.js App Router.
- Formatting: Prettier; Linting: ESLint (Next config). Tailwind v4.
- Indentation: 2 spaces; max line length per Prettier.
- Naming: PascalCase for components, camelCase for functions/vars, kebab-case for files/route segments.
- Follow Next.js conventions for route folders and `page.tsx`/`layout.tsx`.

## Testing Guidelines
- No test suite is configured yet. If adding tests, prefer Vitest or Playwright.
- Suggested layout: `src/__tests__/**/*.(test|spec).ts(x)`.
- Keep tests colocated with features when helpful; aim for fast unit tests first.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
- PRs: Provide clear description, screenshots for UI, and linked issues.
- Include steps to reproduce and risk/rollback notes for non-trivial changes.
- Ensure `pnpm lint` and `pnpm build` pass before requesting review.

## Security & Configuration Tips
- Configure env via `.env.development`/`.env.production` (e.g., `NEXT_PUBLIC_APP_URL`, DB, auth secrets).
- Never commit secrets; use platform secret stores.
- Validate i18n keys when editing `src/config/locale/messages/**`.
- For Cloudflare, verify `wrangler.toml` and `open-next.config.ts` before deploy.
