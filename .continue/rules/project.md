<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.
     Run `bash scripts/sync-agent-rules.sh` to regenerate. -->

---
description: Project conventions for AI Website Clone Template
alwaysApply: true
---
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KAZENCO Website

## Project Identity
- This is KAZENCO's live corporate website, not a website-cloning template. The cloning/reverse-engineering phase is complete.
- Primary domain: https://www.kazenco.com
- Audience: international EPC contractors and industrial/procurement clients.
- Use only verified company content: real projects, real products, real certificates, and approved brand assets.
- Never invent certificates, clients, projects, or technical claims.

## Technology
Verified against `package.json`:
- Next.js 16.3.0 (App Router)
- React 19.2.4 / react-dom 19.2.4
- TypeScript (^5)
- Tailwind CSS 4
- Node.js 24.x (`engines.node`)
- `@vercel/analytics`, `@vercel/speed-insights`
- `@vercel/blob` — used in `src/app/api/rfq/route.ts` for signed uploads
- `resend` — used for RFQ email delivery
- `@vercel/postgres` — installed but current source usage not verified. Do not treat it as an active dependency or as part of the RFQ flow.

Icons are hand-authored in `src/components/icons.tsx`. `lucide-react`, `@base-ui/react`, and the `shadcn` CLI config (`components.json`) are present in the project but have no confirmed usage in `src/` — do not assume they are part of the active UI stack, and do not add operational rules for them.

Before changing any Next.js-specific code, read the local docs under `node_modules/next/dist/docs/` first (see the block above).

Do not assume unverified conventions such as a blanket named-export rule, an absolute `any` ban, or mandatory CSS Modules — none of these were confirmed in the current codebase.

## Start-of-Task Checks
1. Read this entire `AGENTS.md` file.
2. If `docs/AI-HANDOFF.md` exists, open and read it as well.
3. For inspection/audit tasks, read `docs/research/INSPECTION_GUIDE.md`.
4. Confirm the branch with `git branch --show-current`.
5. Record the starting state with `git status --short --branch`.
6. Treat any pre-existing changes as the user's own — do not fold them into your own commits or attribute them to yourself.

Do not assume this instruction — or Claude Code's `@file` import syntax — is automatically resolved by every tool. Both Claude Code and Codex must open `docs/AI-HANDOFF.md` themselves as a normal read step, not via import syntax.

## Git Safety
- Expected branch: `kazenco-v5`.
- Do not switch, create, merge, rebase, or create a worktree without the user's explicit request.
- Do not modify, revert, delete, stage, or reformat pre-existing changes you did not make.
- Do not run `git reset --hard`, `git clean -fd`, `git checkout -- .`, or `git restore .`.
- Do not run `git add .` or `git add -A`.
- If staging is explicitly requested, stage only the specific files the user approved, one at a time.
- Permission to edit a file is not permission to commit it.
- Permission to commit is not permission to push.
- Never commit or push without the user's explicit permission for that specific change.
- Never delete a `.git/index.lock` (or similar) file on your own initiative:
  1. First check whether an active Git process is actually running (note: a sandboxed or bridged shell may not see every process running on the user's own machine — say so if that's a limitation).
  2. If no active process is found and the lock looks stale, tell the user what you found instead of acting on it.
  3. Remove a stale lock only with the user's explicit permission, naming the exact file to remove.

## Existing Systems to Preserve
- The approved KAZENCO logo and brand assets.
- The current premium design system.
- Real project and product photography.
- Responsive behavior across breakpoints.
- Existing animations and `prefers-reduced-motion` handling.
- Accessibility and keyboard interaction patterns.
- The RFQ flow.
- Certificate and catalogue download links.

Do not make broad visual redesigns, introduce placeholder content, or swap in stock imagery unless the user asks for that specifically.

## Locale Rules
URL locales: `en`, `ru`, `tr`, `kz`.

The Kazakh URL segment is `/kz`; the corresponding document/metadata language code is `kk` (see `src/app/layout.tsx`, `src/components/DocumentLocale.tsx`, `src/components/LanguageSwitcher.tsx`). Do not conflate the two.

Preserve:
- Locale-aware navigation.
- Localized content.
- Canonical URLs.
- `hreflang` alternates (`en`, `ru`, `tr`, `kk`, `x-default` → `/en`; see `alternates.languages` in `src/app/layout.tsx`).
- Document-language behavior (`document.documentElement.lang`).
- Sitemap (`src/app/sitemap.ts`) and image sitemap (`src/app/image-sitemap.xml`) coverage.

Unless a task explicitly scopes to one language, check all relevant locale data before changing any visible copy.

Do not change the `/kz` URL segment to `/kk` without an explicit migration plan.

## SEO and Structured Data
Preserve and verify when touched:
- `metadataBase` (`src/app/layout.tsx`, built from `SITE.url`).
- Canonical URLs and `hreflang` alternates.
- Open Graph and Twitter metadata.
- `src/app/sitemap.ts` and `src/app/image-sitemap.xml`.
- `src/app/robots.ts`, including its preview-environment noindex rule (`KAZENCO_PREVIEW` / `VERCEL_ENV`).
- Organization and WebSite JSON-LD (`src/app/layout.tsx`), plus page-level structured data (breadcrumb, collection, service, project, page, contact-page) rendered via `src/components/JsonLd.tsx` across route files.
- Legacy redirects in `next.config.ts`.
- References to the production domain (`https://www.kazenco.com`).

Evaluate SEO impact separately whenever a route, slug, locale, or domain changes.

## Routes and Backward Compatibility
The project has both localized (`src/app/[locale]/...`) and non-localized/legacy routes (e.g. `src/app/products`, `src/app/capabilities`, `src/app/projects`, `src/app/project/[slug]`) kept for backward compatibility, plus explicit legacy `.html` redirects in `next.config.ts`.

Before any broad route change, review:
1. `next.config.ts` redirects.
2. Sitemap and metadata generation.
3. Internal links.
4. Locale variants.
5. Dynamic slug sources (`src/lib/*` — products, capabilities, industries, projects, etc.).
6. The purpose of legacy/backward-compatible URLs.

Do not merge, move, or delete routes without the user's explicit permission and a migration plan.

## RFQ and External Services
The RFQ system (`src/app/api/rfq/route.ts`) uses Resend for email delivery and `@vercel/blob` for signed attachment uploads; environment variables gate both.

- Never display or commit secrets or environment values.
- Never send real email without explicit permission.
- Never upload to production storage or modify external service data without explicit permission.
- Preserve existing validation, private-attachment handling, and success/error flows.

## Verification and Completion
Run checks appropriate to the change:
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- or `npm run check` for all three.

Skip build artifacts for read-only tasks or when the user asks you not to run tests.

Never report a test as passing if it was not actually run.

At the end of a task, report:
- Summary of what was done.
- Files changed.
- Files created.
- Files deleted.
- Tests run and their results.
- Tests skipped and why.
- Commit/push status.
- Remaining risks.

## Shared Handoff
- Claude Code reads these rules via `CLAUDE.md`'s `@AGENTS.md` import.
- Codex reads this `AGENTS.md` file directly.
- Both tools must explicitly open and read `docs/AI-HANDOFF.md`, if it exists, before starting a task — this is a plain reading instruction, not a `@file` import.
- Do not add an `@docs/AI-HANDOFF.md` import line.
- Treat the handoff file as a starting reference, never as a substitute for the actual repository state — always re-verify with Git.

## Agent Tooling and Sync
- After editing `AGENTS.md`, run `bash scripts/sync-agent-rules.sh` — with user approval and a diff review — to regenerate the derived files it manages.
- After editing `.claude/skills/clone-website/SKILL.md`, run `node scripts/sync-skills.mjs` — with user approval — to regenerate the skill for all platforms it targets.
- Never auto-stage, commit, or push the files these scripts generate.
- Do not conflate tracked project skills with untracked local skill copies.
- Do not fold existing or untracked skill files into unrelated product changes.
- Do not use subagents or parallel agents unless the user explicitly asks for that.
- If the user explicitly asks for parallel/concurrent code changes, isolate each writing agent in its own Git worktree or branch, and merge the results deliberately afterward.
- Never let multiple agents write to the same working tree or the same files at the same time.

# Website Inspection Guide

## How to Reverse-Engineer Any Website

This guide outlines what to capture when inspecting a target website via Chrome MCP or browser DevTools.

## Phase 1: Visual Audit

### Screenshots to Capture
- [ ] Every distinct page — desktop, tablet, mobile
- [ ] Dark mode variants (if applicable)
- [ ] Light mode variants (if applicable)
- [ ] Key interaction states (hover, active, open menus, modals)
- [ ] Loading/skeleton states
- [ ] Empty states
- [ ] Error states

### Design Tokens to Extract
- [ ] **Colors** — background, text (primary/secondary/muted), accent, border, hover, error, success, warning
- [ ] **Typography** — font family, sizes (h1-h6, body, caption, label), weights, line heights, letter spacing
- [ ] **Spacing** — padding/margin patterns (look for a scale: 4px, 8px, 12px, 16px, 24px, 32px, etc.)
- [ ] **Border radius** — buttons, cards, avatars, inputs
- [ ] **Shadows/elevation** — card shadows, dropdown shadows, modal overlay
- [ ] **Breakpoints** — when does the layout shift? (inspect with DevTools responsive mode)
- [ ] **Icons** — which icon library? custom SVGs? sizes?
- [ ] **Avatars** — sizes, shapes, fallback behavior
- [ ] **Buttons** — all variants (primary, secondary, ghost, icon-only, danger)
- [ ] **Inputs** — text fields, textareas, selects, checkboxes, toggles

## Phase 2: Component Inventory

For each distinct UI component, document:
1. **Name** — what would you call this component?
2. **Structure** — what HTML elements / child components does it contain?
3. **Variants** — does it have different sizes, colors, or states?
4. **States** — default, hover, active, disabled, loading, error, empty
5. **Responsive behavior** — how does it change at different breakpoints?
6. **Interactions** — click, hover, focus, keyboard navigation
7. **Animations** — transitions, entrance/exit animations, micro-interactions

### Common Components to Look For
- Navigation (top bar, sidebar, bottom bar)
- Cards / list items
- Buttons and links
- Forms and inputs
- Modals and dialogs
- Dropdowns and menus
- Tabs and segmented controls
- Avatars and user badges
- Loading skeletons
- Toast notifications
- Tooltips and popovers

## Phase 3: Layout Architecture

- [ ] **Grid system** — CSS Grid? Flexbox? Fixed widths?
- [ ] **Column layout** — how many columns at each breakpoint?
- [ ] **Max-width** — main content area max-width
- [ ] **Sticky elements** — header, sidebar, floating buttons
- [ ] **Z-index layers** — navigation, modals, tooltips, overlays
- [ ] **Scroll behavior** — infinite scroll, pagination, virtual scrolling

## Phase 4: Technical Stack Analysis

- [ ] **Framework** — React? Vue? Angular? Check `__NEXT_DATA__`, `__NUXT__`, `ng-version`
- [ ] **CSS approach** — Tailwind (utility classes), CSS Modules, Styled Components, Emotion, vanilla CSS
- [ ] **State management** — Redux (check DevTools), React Query, Zustand, Pinia
- [ ] **API patterns** — REST, GraphQL (check network tab for `/graphql` requests)
- [ ] **Font loading** — Google Fonts, self-hosted, system fonts
- [ ] **Image strategy** — CDN, lazy loading, srcset, WebP/AVIF
- [ ] **Animation library** — Framer Motion, GSAP, CSS transitions only

## Phase 5: Documentation Output

After inspection, create these files in `docs/research/`:
1. `DESIGN_TOKENS.md` — All extracted colors, typography, spacing
2. `COMPONENT_INVENTORY.md` — Every component with structure notes
3. `LAYOUT_ARCHITECTURE.md` — Page layouts, grid system, responsive behavior
4. `INTERACTION_PATTERNS.md` — Animations, transitions, hover states
5. `TECH_STACK_ANALYSIS.md` — What the site uses and our chosen equivalents
