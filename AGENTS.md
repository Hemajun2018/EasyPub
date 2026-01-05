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
