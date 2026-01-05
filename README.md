# ShipAny Two — AI 建站模板架构说明

本仓库是基于 Next.js App Router 的 AI SaaS 建站模板，集成了鉴权、RBAC 权限、支付订阅、积分计费、AI 生成、内容/博客/文档、国际化、多主题等能力，可直接用于搭建多语言、多产品形态的 AI 网站与控制台。

本说明聚焦“架构梳理”，帮助你快速理解项目的模块划分、关键数据流与可扩展点。

## 技术栈概览

- 前端框架: `Next.js 15 (App Router)` + `React 19`
- 样式与 UI: `Tailwind CSS 4`、`shadcn/ui`、Radix UI、`lucide-react`
- 国际化: `next-intl`（基于中间件自动语言路由）
- 内容系统: `fumadocs-mdx`（MDX 文档/页面/博客/更新日志）
- 鉴权: `better-auth`（Drizzle 适配器）
- 数据库与 ORM: `Postgres`/`libsql` 等 + `drizzle-orm`（`drizzle-kit` 迁移）
- 支付: Stripe / PayPal / Creem（可选，统一抽象层）
- 对象存储: Cloudflare R2 / S3（统一存储抽象）
- 邮件: Resend（适配器可扩展）
- AI 能力: 统一 `AIManager` 抽象，内置 Kie / Replicate / Fal / Gemini 提供方
- 部署: Vercel（默认）或 Cloudflare（OpenNext Cloudflare）

## 目录结构（关键路径）

- `src/app/`：App Router 路由与入口
  - `layout.tsx`：全局 HTML、字体、分析/广告/客服脚本注入与 `<UtmCapture>`
  - `middleware.ts`：`next-intl` 语言中间件 + 部分鉴权前置检查 + 公共页缓存头
  - `[locale]/`：按语言分区的页面
    - `(landing)`：落地页、博客、定价、展示、设置等
    - `(docs)`：基于 `fumadocs` 的文档/页面/博客路由
    - `(chat)`：对话与历史页
    - `(admin)`：管理后台（用户/内容/权限/支付/积分/任务）
    - `(auth)`：登录注册/邮箱验证
  - `api/**`：服务端 API 路由（AI 生成、聊天、存储上传、支付回调、配置等）

- `src/core/`：跨页面核心能力
  - `db/`：数据库连接（Postgres + drizzle，支持 Cloudflare Hyperdrive）
  - `auth/`：`better-auth` 服务端与客户端配置（支持邮箱验证、新用户初始角色/积分）
  - `rbac/`：权限常量与校验辅助（`requirePermission/Role` 等）
  - `i18n/`：`next-intl` 路由与导航封装
  - `theme/`：主题选择与动态按需加载（页面/Layout/Block）
  - `docs/`：`fumadocs` 数据源与 TOC 生成

- `src/config/`：运行时与样式配置
  - `index.ts`：环境变量聚合（含 `.env` 读取）
  - `db/schema.ts`：全量数据表定义（用户/会话/文章/订单/订阅/积分/RBAC/AI 任务/聊天 等）
  - `locale/**`：文案字典（en/zh）
  - `style/**`：全局样式、主题色等
  - `theme/`：默认主题名等配置

- `src/extensions/`：能力提供方适配层（统一接口 + 多实现）
  - `ai/`：Kie / Replicate / Fal / Gemini 适配
  - `payment/`：Stripe / PayPal / Creem 适配
  - `storage/`：R2 / S3 适配
  - `email/`：Resend 适配
  - `analytics/`、`ads/`、`affiliate/`、`customer-service/`：脚本注入组件

- `src/shared/`：通用库、模型、服务与 UI Blocks
  - `models/`：基于 drizzle 的应用模型（如 `user`、`post`、`order`、`subscription`、`credit`、`ai_task`、`chat` 等）
  - `services/`：围绕扩展点的领域服务（AI、支付、存储、邮件、RBAC、设置等）
  - `lib/`：通用工具（响应/缓存/SEO/env/cookie/hash/ip/限流 等）
  - `components/`、`blocks/`：UI 组件与业务 Block（dashboard/landing/chat/form/table 等）

- `src/themes/default/`：默认主题实现（Layouts/Pages/Blocks）
- `content/`：MDX 内容源（docs/pages/posts/logs）
- `public/`：静态资源（favicon、预览图、图片等）

## 运行时关键数据流

- 国际化与路由
  - 通过 `middleware.ts` 接入 `next-intl`，自动基于 URL 的首段 `[locale]` 选择语言。
  - `src/core/i18n/navigation.ts` 导出 `Link/redirect/useRouter` 等，简化多语言导航。

- 鉴权与会话（better-auth + drizzle）
  - `src/core/auth/index.ts` 在服务端基于数据库与环境变量生成 `auth` 实例；`client.ts` 创建客户端实例并节流 `get-session` 请求，避免风暴。
  - 支持邮箱密码、Google One Tap（按配置开关），新用户可自动分配初始角色与初始积分，并可按需发送验证邮件（Resend）。

- RBAC 权限
  - 权限常量于 `src/core/rbac/permission.ts` 定义；`requirePermission/requireRole` 可在页面与 API 中保护访问；`middleware` 在访问 admin/settings/activity 时做最小会话检查（完整权限在页面内校验）。

- 数据库与模型
  - `src/config/db/schema.ts` 定义了完整的数据模型与索引，如：
    - 用户/会话/第三方账户/验证码
    - 内容与分类（post/taxonomy）
    - 订单、订阅、账单、交易字段（对齐多支付提供方）
    - 积分记录（发放/消耗/过期逻辑与聚合查询）
    - AI 任务、聊天与消息
    - RBAC（role/permission/role_permission/user_role）
  - `src/core/db/index.ts` 在 Node/Workers 环境区分连接策略，支持 Cloudflare Hyperdrive，支持单例/非单例模式。

- 设置与配置合并
  - `shared/models/config.ts` 将 DB 配置 + 环境变量 + `envConfigs` 合并，暴露 `getAllConfigs()`/`getPublicConfigs()`；`shared/services/settings.ts` 定义设置项元数据（用于后台表单分组与渲染）。

- 存储抽象
  - `extensions/storage` 定义 `StorageManager` 与 Provider 接口，内置 R2/S3；`shared/services/storage.ts` 基于运行时配置选择默认 Provider，支持直传与“下载后再上传”。

- 邮件抽象
  - `extensions/email` 定义 `EmailManager` 与 Provider 接口；内置 Resend，支持 React 邮件模板渲染（`@react-email/components`）。

- 支付抽象
  - `extensions/payment` 定义 `PaymentManager`、`PaymentProvider` 与统一数据结构（Checkout/Session/Event/Invoice/Billing）。
  - `shared/services/payment.ts` 将订单/订阅与支付会话打通：
    - 创建支付：根据产品与价格生成 checkout，会记录订单，返回跳转 URL。
    - Webhook 通知：按事件类型（checkout.success/payment.success/subscribe.updated/subscribe.canceled）更新订单与订阅，并驱动积分发放/续费。

- 信用点数（Credits）
  - `shared/models/credit.ts` 负责积分发放、消耗、过期策略与聚合；
  - AI 任务/Chat 等会在生成前校验余额，成功后扣减；如任务失败会回滚对应消费记录。

- AI 统一层
  - `extensions/ai` 定义 `AIManager` 与 Provider 接口，包含 `generate/query` 等；
  - `shared/services/ai.ts` 基于配置注入 Kie/Replicate/Fal/Gemini，支持不同媒体类型（image/video/music/text/speech），可选“先存储后返回”。

- Chat 与流式输出
  - `src/app/api/chat/route.ts` 基于 Vercel AI SDK + OpenRouter，做权限校验、扣积分、持久化对话与消息，支持流式响应、工具/推理分步等（结合 UI 组件在 `shared/components/ai-elements/*` 展示）。

- 文档/博客/页面（MDX）
  - `content/` 组织文档、页面、博客、更新日志；`source.config.ts` 与 `src/core/docs/source.ts` 生成数据源；`themes/default/pages/*` 提供动态/静态页渲染。

- 主题系统
  - `src/core/theme/index.ts` 提供 `getThemePage/Layout/Block` 动态加载与默认主题回退；当前主题来源 `envConfigs.theme`；默认主题目录 `src/themes/default`。

## 关键 API 路由示例

- `POST /api/ai/generate`：验证用户与积分 → 选择 Provider → 生成任务 → 入库 `ai_task`
- `POST /api/chat`：构造会话上下文 → 流式生成 → 扣积分与持久化消息
- `POST /api/payment/checkout`：创建订单与支付会话，返回跳转 URL
- `POST /api/payment/notify/[provider]`：支付 Webhook → 解析事件 → 更新订单/订阅/积分
- `GET/POST /api/storage/upload-image`：图片上传与转存（走统一存储层）
- `GET /api/user/*`：用户信息/积分/邮箱验证等

## 配置与环境

- `.env.example` 提供基础变量示例，核心变量集中在 `src/config/index.ts (envConfigs)`。
- 数据库迁移：`pnpm db:generate`、`pnpm db:migrate`、`pnpm db:push`（读取 `src/core/db/config.ts`）。
- 国际化文案：`src/config/locale/messages/**` 按模块分包。

## 构建与运行

- 本地开发：`pnpm install && pnpm dev`
- 生产构建：`pnpm build && pnpm start`
- Lint/格式：`pnpm lint`、`pnpm format`

## 部署说明

- Vercel：`vercel.json` 已配置函数超时；默认输出模式为 Vercel 兼容。
- Cloudflare：通过 `@opennextjs/cloudflare`，参考 `wrangler.toml.example` 与 `open-next.config.ts`（支持 Hyperdrive/R2 Cache）。

## 可扩展点一览

- 新增 AI 提供方：在 `src/extensions/ai` 实现 `AIProvider`，在 `getAIServiceWithConfigs` 中注入。
- 新增支付通道：在 `src/extensions/payment` 实现 `PaymentProvider`，在 `getPaymentServiceWithConfigs` 中注入。
- 新增存储/邮件/分析/广告/客服：分别在对应 `extensions/*` 下新增 Provider 并在 `shared/services/*` 中装配。
- 新增主题：新增 `src/themes/<your-theme>/` 目录，按 `default` 主题约定导出页面/Layout/Blocks，并设置 `NEXT_PUBLIC_THEME`。

## 重要模型速览（摘录）

- 用户与鉴权：`user`、`session`、`account`、`verification`
- 内容：`taxonomy`（分类/标签）、`post`（文章/页面）
- 交易：`order`（一次性/订阅首付）、`subscription`（订阅周期/取消/续费）
- 积分：`credit`（发放/消耗/过期/回滚）
- AI：`ai_task`（任务/状态/结果/花费）
- Chat：`chat`、`chat_message`
- RBAC：`role`、`permission`、`role_permission`、`user_role`

## 常用脚本

- 数据库：`pnpm db:generate | db:migrate | db:push | db:studio`
- 鉴权类型生成：`pnpm auth:generate`
- 初始化/分配 RBAC：`pnpm rbac:init`、`pnpm rbac:assign`
- Cloudflare：`pnpm cf:preview | cf:deploy | cf:upload | cf:typegen`

## 备注

- 该模板已提供较完整的演示与占位实现，个别页面可能存在示例/占位代码（例如个别页面文件内的重复变量定义），请按需调整。
- 请遵守 LICENSE，避免公开传播模板源代码。



# ShipAny Template Two

read [ShipAny Document](https://shipany.ai/docs/quick-start)  


