# CashQuest — Interactive Financial Literacy Game

## Project Overview

CashQuest is a gamified financial literacy web app for kids aged 10–14. Users create an avatar, take a baseline knowledge quiz, and land on a main dashboard that tracks XP, streak, bank balance, and arcade tokens. From the dashboard they access three core modules:

1. **Learn Path** — Duolingo-style micro-lessons (Credit, Taxes, Budgeting) with flashcards, definitions, and knowledge-check quizzes. Correct answers award XP + arcade tokens; incorrect answers loop back to review material.
2. **Life Simulator** — A monthly budgeting simulation. The user is assigned an age, salary, and starting balance, then allocates money across savings/spending/investing each month. Random life events (flat tire, medical bill, job bonus, tax refund) apply consequences to balance, interest, and credit score. If balance hits zero the game ends (BANKRUPT).
3. **Mini-Game Arcade** — Token-gated 60-second drill games (Budget Blitz, Tax Dash, Credit Rush). Tokens are earned in Learn Path. Games award XP and unlock cosmetics. Combo multipliers reward streaks.

**Team**: Vinil Polepalli, Beckett Oliver, Ryan Da Silva (Team #4)
**Client**: School departments & parents of kids 10–14

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion
- **Database & Auth**: Supabase (Postgres + Auth + Row Level Security) — free tier
- **Deployment**: Vercel (free tier)
- **Package Manager**: pnpm

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, signup, avatar creation
│   ├── (game)/             # Authenticated game routes
│   │   ├── dashboard/      # Main dashboard (XP, streak, balance, tokens)
│   │   ├── learn/          # Learn Path module
│   │   │   ├── [topic]/    # Credit | Taxes | Budgeting
│   │   │   └── quiz/       # Knowledge-check quizzes
│   │   ├── simulator/      # Life Simulator module
│   │   │   ├── setup/      # Age/salary/balance generation
│   │   │   ├── play/       # Monthly decision loop
│   │   │   └── summary/    # End-of-month & game-over screens
│   │   └── arcade/         # Mini-Game Arcade
│   │       ├── library/    # Game selection screen
│   │       └── [game]/     # Individual game routes
│   └── api/                # API routes (game logic, server actions)
├── components/
│   ├── ui/                 # shadcn/ui primitives (do not edit directly)
│   ├── game/               # Game-specific components (cards, timers, meters)
│   ├── dashboard/          # Dashboard widgets (XP bar, streak counter, etc.)
│   └── shared/             # Shared layout, nav, avatar display, modals
├── lib/
│   ├── supabase/           # Supabase client, server client, middleware helpers
│   ├── game-engine/        # Core game logic (simulator math, scoring, events)
│   │   ├── simulator.ts    # Life Simulator calculations (interest, credit score, events)
│   │   ├── arcade.ts       # Arcade scoring, combo multipliers, token costs
│   │   └── learn.ts        # XP calculations, streak logic, quiz grading
│   └── constants/          # Game balance numbers, CEE standard tags, life events catalog
├── hooks/                  # Custom React hooks (useGameState, useTimer, useTokens)
├── types/                  # Shared TypeScript types & Zod schemas
├── styles/                 # Global CSS, Tailwind config extensions
└── content/                # Static lesson content, flashcard data, quiz banks (JSON/MDX)
```

## Coding Conventions

- Use TypeScript strict mode everywhere. No `any` types — use `unknown` and narrow.
- Prefer functional React components with hooks. No class components.
- Use named exports, not default exports (except for Next.js page/layout files which require default exports).
- All database queries go through `lib/supabase/` helpers — never call Supabase directly from components.
- Game logic (scoring, event resolution, balance math) lives in `lib/game-engine/`, not in components. Components only render state and dispatch actions.
- Use Zod for runtime validation of all external data (API responses, form inputs, Supabase query results).
- CSS: use Tailwind utility classes. Custom CSS only when Tailwind cannot express it. Never use inline `style={{}}` props.
- Animations: use Framer Motion's `motion` components. Keep animation definitions in the component file, not in separate config.
- File naming: `kebab-case.ts` for files, `PascalCase` for components, `camelCase` for functions and variables.
- Every new feature must include a loading state, an error state, and an empty state.

## Design Guidelines

This app is for kids aged 10–14. The design must be:

- **Playful and vibrant** — bold colors, rounded corners, satisfying micro-interactions. Think Duolingo energy, not banking-app energy.
- **Mobile-first responsive** — must work on phones and tablets. Touch targets minimum 44px.
- **Accessible** — WCAG 2.1 AA compliance. Sufficient contrast ratios even with vibrant colors. Screen reader support.
- **NOT generic AI slop** — no purple-gradient-on-white, no Inter/Roboto defaults. Use distinctive, fun typography. Commit to a cohesive visual identity with personality.
- **Fast** — navigation from dashboard to any game mode in under 2 seconds. Use optimistic UI updates and skeleton loaders.

Color palette direction: bright greens, teals, warm yellows, and soft purples (matching the module color-coding in the flowcharts — green for Learn, purple for Simulator, gold for Arcade).

## Key Commands

```bash
pnpm dev              # Start local dev server
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm type-check       # TypeScript compiler check (no emit)
pnpm test             # Run test suite
pnpm db:gen-types     # Regenerate Supabase TypeScript types
pnpm db:migrate       # Apply pending Supabase migrations
pnpm db:seed          # Seed database with sample lesson content & quiz banks
```

## Measurable Constraints (from design brief)

1. Responsive: works properly on mobile and desktop.
2. Database must save progress, display scores, and run simulations.
3. Lesson content must align with Council for Economic Education (CEE) standards — embed CEE metadata tags in content JSON.
4. Games must track: cash balance, credit score, happiness, monthly net flow, and other personal finance stats.
5. At least 3 different playable games representing different financial concepts.
6. Dashboard → any game mode navigation in under 2 seconds.
7. Legal disclaimer on every page: "All advice and game content is for educational purposes only."
8. Total cost must be $0 — use only free tiers (Vercel free + Supabase free). No paid APIs.
9. No PII stored beyond email. All passwords hashed via Supabase Auth (bcrypt).

## Game Module Specs

### Learn Path
- Topics: Credit, Taxes, Budgeting (expandable)
- Lesson format: micro-lesson (2–3 min) with interactive flashcards & definitions → knowledge-check quiz
- Pass → +XP, +Arcade Tokens, return to dashboard
- Fail → review material, re-read flashcards, retake quiz
- Content lives in `content/` directory as structured JSON with CEE metadata tags

### Life Simulator
- Setup: generate random age, salary, starting balance (or let user pick a scenario)
- Monthly loop: view fixed income & expenses → allocate remaining money (savings/spending/investing) → random life event → consequence calculation (costs, interest, credit score) → end-of-month summary
- Fail state: balance ≤ 0 → BANKRUPT game over screen
- Stats tracked: bank balance, debt, credit score, happiness, monthly net flow

### Mini-Game Arcade
- Token-gated: must spend tokens earned from Learn Path
- Games: Budget Blitz (sorting needs vs wants), Tax Dash (tax category speed-matching), Credit Rush (credit score decision speed-run)
- Each game: 60-second round → score screen with combo multiplier → +XP, +cosmetic unlock
- Play-again loop or return to dashboard

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase → Settings → General → "Project URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase → Settings → API Keys → "Publishable key" (the sb_publishable_... key)
SUPABASE_SERVICE_ROLE_KEY=       # Supabase → Settings → API Keys → "Secret keys" (the sb_secret_... key, click reveal)
```

Never commit `.env.local`. The `.env.example` file must always be kept in sync.
Note: Supabase's new dashboard labels these as "Publishable key" and "Secret key" but our env vars use the standard naming convention that the Supabase JS client expects.

## Database Schema (Supabase)

Key tables (all protected by Row Level Security):
- `profiles` — user_id (FK to auth.users), display_name, avatar_config (JSON), created_at
- `progress` — user_id, total_xp, current_streak, last_active_date, arcade_tokens
- `lesson_completions` — user_id, topic, lesson_id, score, completed_at
- `simulator_runs` — user_id, run_id, months_survived, final_balance, final_credit_score, ended_at
- `arcade_scores` — user_id, game_id, score, combo_multiplier, played_at
- `unlocked_cosmetics` — user_id, cosmetic_id, unlocked_at

## Important Rules

- Always show the legal disclaimer: "All game content and financial advice is for educational purposes only and does not constitute professional financial advice."
- Never store PII beyond email. No names, addresses, or phone numbers in the database.
- All financial calculations (interest, credit score changes, event costs) must use deterministic formulas defined in `lib/game-engine/simulator.ts` — no magic numbers scattered in components.
- Life events catalog lives in `lib/constants/life-events.ts` as a typed array, not hardcoded in components.
- Quiz question banks live in `content/` as versioned JSON files with CEE standard tags.
- When adding new lessons or quiz content, always include the `ceeStandard` field referencing the relevant CEE standard code.

---

# Workflow: Subagents & Hyperthinking

## ALWAYS use subagents to build this project.

When implementing any feature, break the work across the subagents defined below. Do not try to do everything in a single context. Spin up subagents in parallel whenever their scopes do not depend on each other. For example, when building a new game module, the Game Logic Agent and Content Agent can run simultaneously while the Frontend Agent waits for their outputs.

## ALWAYS use extended thinking (hyperthinking) for complex tasks.

Enable extended thinking / hyperthinking for:
- Designing game balance systems (XP curves, token economy, credit score model)
- Architecting new features or refactoring existing ones
- Debugging complex state management issues
- Writing Supabase RLS policies
- Any task that requires reasoning through multiple interacting systems

## Setup Report — REQUIRED at end of every major task

After completing any major implementation milestone (initial scaffold, new module, full feature), you MUST print a setup checklist to the user that includes:

1. **Environment variables needed** — list every env var the user must fill in, where to get it (e.g., "Go to supabase.com → Project Settings → API → copy the anon key"), and which file to put it in.
2. **External accounts required** — list every service the user needs to sign up for (Supabase project, Vercel account, etc.) with direct URLs.
3. **Database setup steps** — any migrations to run, tables to create, or seed data to load.
4. **Local commands to run** — the exact shell commands in order to get from zero to running locally (e.g., `pnpm install`, `pnpm db:migrate`, `pnpm dev`).
5. **What's done vs what's next** — a clear summary of what was built and what remains.

Format this as a clear numbered checklist the user can follow step-by-step. Do not assume they know where to find API keys — give explicit instructions.

---

# Subagent Definitions

The following subagents should be used to parallelize work. Use `"use subagents"` or reference them by name.

## Frontend Agent
Focus: All UI components, pages, layouts, styling, animations, and responsive design.
Context: Read `src/components/`, `src/app/`, `src/styles/`, and the Design Guidelines section above.
Rules:
- Must use Tailwind + shadcn/ui + Framer Motion
- Must be mobile-first responsive
- Must avoid generic AI aesthetics — bold, playful, kid-friendly design
- Must include loading, error, and empty states for every new view
- Run `pnpm lint` and `pnpm type-check` before completing

## Backend Agent
Focus: Supabase schema, migrations, RLS policies, server actions, and server-side game logic.
Context: Read `src/lib/supabase/`, `src/lib/game-engine/`, `src/app/api/`, and the Database Schema section above.
Rules:
- Every table must have RLS policies — no public access
- All queries through helper functions in `lib/supabase/`
- Game engine math in `lib/game-engine/` must be pure functions with unit tests
- Validate all inputs with Zod before database writes
- No paid APIs or external services — everything runs on Supabase free tier
- Run `pnpm test` on any new game-engine logic

## Game Logic Agent
Focus: Core game mechanics — Life Simulator calculations, arcade scoring, Learn Path XP/streak systems, event catalogs, and balance tuning.
Context: Read `src/lib/game-engine/`, `src/lib/constants/`, `src/content/`, and the Game Module Specs above.
Rules:
- All formulas must be documented with comments explaining the financial concept
- Life events must be typed and cataloged in `lib/constants/life-events.ts`
- Credit score model should be a simplified FICO-like system appropriate for educational purposes
- Arcade combo multipliers and token costs must be balanced so a player can reasonably earn tokens through Learn Path
- No randomness without seeding — use deterministic random with run_id for reproducibility in simulator

## Content Agent
Focus: Lesson content, flashcard data, quiz question banks, and CEE standard alignment.
Context: Read `src/content/`, the Measurable Constraints section, and CEE standards reference.
Rules:
- All content in structured JSON with fields: `id`, `topic`, `title`, `body`, `ceeStandard`, `difficulty`
- Quiz questions must have: `question`, `options` (array), `correctIndex`, `explanation`, `ceeStandard`
- Language must be age-appropriate for 10–14 year olds — no jargon without definitions
- Every topic (Credit, Taxes, Budgeting) must have at least 5 micro-lessons and 10 quiz questions

## QA / Review Agent
Focus: Testing, accessibility audits, performance checks, and constraint verification.
Context: Read the Measurable Constraints section and review all recent changes.
Rules:
- Verify mobile responsiveness on common breakpoints (375px, 768px, 1024px, 1440px)
- Check WCAG 2.1 AA contrast ratios on all text
- Verify navigation timing: dashboard → any mode < 2 seconds
- Confirm legal disclaimer is present on all pages
- Run full `pnpm lint && pnpm type-check && pnpm test` suite
- Check that no PII beyond email is stored

---

## Landing page (rogo style)

A separate parent-facing marketing landing page lives at `/landing`. It uses an editorial serif aesthetic (Newsreader + Inter, ink/paper palette) and is intentionally independent from the kid-facing game UI at `/`.

### Where the files live

```
src/app/
├── layout.tsx                        # Slim root: <html><body><ClerkProvider> only
├── (site)/                           # Route group wrapping the existing kid-facing app
│   ├── layout.tsx                    # Nunito + flex column + global disclaimer footer
│   ├── page.tsx                      # Existing home
│   ├── (auth)/, (game)/, (minigames)/  # Existing routes
└── landing/                          # New rogo-style marketing route
    ├── layout.tsx                    # Newsreader + Inter font loaders, scoped to /landing
    ├── page.tsx                      # Composes the sections below
    └── _components/
        ├── _primitives/              # section, eyebrow, button, fade-up
        ├── navbar.tsx                # Client; IntersectionObserver scroll-flip + mobile sheet
        ├── hero.tsx                  # CSS-rendered architectural composition (no real photo yet)
        ├── logo-marquee.tsx          # Pure CSS keyframes, reduced-motion-aware
        ├── testimonials-section.tsx
        ├── why-section.tsx
        ├── pricing-section.tsx
        ├── stats-section.tsx
        ├── security-section.tsx
        ├── cta-section.tsx
        └── footer.tsx
```

### Token convention

Landing-only color and font tokens are prefixed `--color-rogo-*` / `--font-rogo-*` in `src/app/globals.css` to avoid collision with the existing `--color-muted` and other shared tokens. Any new landing token MUST use the `rogo-` prefix. Tailwind utilities resolve to `bg-rogo-ink`, `text-rogo-muted`, `font-rogo-serif`, etc.

### Hero composition

The hero right column is a layered CSS/SVG composition (gradient sky + radial sun glow + neoclassical column SVG + vignette) that evokes the rogo.ai institutional architecture mood without shipping any image asset. To swap to a real photo later, replace the `<ArchitectureComposition />` block inside `landing/_components/hero.tsx` — the rest of the layout is independent.

### Auth

`/landing` is added to the public-route matcher in `src/proxy.ts` so unauthenticated visitors see it directly.

### Tests

A single Playwright e2e covers the highest-value behaviors (hero render, scroll-flip, mobile menu open/Escape, pricing copy):
- `tests/e2e/landing.spec.ts`
- `playwright.config.ts` at repo root
- `pnpm test:e2e` to run
