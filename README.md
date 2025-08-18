
# Halbon SaaS Template (Vercel-ready)

A professional, adaptable starter for SaaS projects. Optimized for **Vercel** deploys with **pnpm**, **Next.js (App Router)**, **TypeScript**, **Prisma + Postgres**, **Zod env validation**, and **Renovate** for dependency updates.

## ⚡ NEW: Modular Configuration System

This template now includes a **configuration wizard** to customize the template for your specific needs:

```bash
# Run the configuration wizard
node scripts/configure-template.mjs

# Or use a preset
node scripts/configure-template.mjs --preset startup
```

**Features:**
- 🧩 **Modular architecture** - Enable only the modules you need
- 🏢 **Flexible entity naming** - Choose between Organization, Workspace, Team, etc.
- 🎯 **Smart presets** - Pre-configured setups for different use cases
- 🔧 **Auto-configuration** - Updates Prisma schema and config files automatically

**Available Modules:**
- **Auth**: Authentication & authorization system
- **Billing**: Stripe integration with subscription management
- **Credits**: Usage-based billing and credit system
- **Plan Limits**: Feature limits per subscription tier
- **Storage**: File upload and storage integration
- **Email**: Transactional email system

## Highlights
- **Next.js App Router** (SSR/ISR/Edge-friendly)
- **TypeScript strict** + **ESLint/Prettier**
- **Prisma** with Postgres (Neon/Supabase ready)
- **Zod**-based **env validation** at boot
- **Auth placeholder** (ready for Auth.js)
- **Stripe placeholder** (typed, env-gated)
- **Health & status** API routes
- **Renovate** bot configured to keep deps fresh
- **CI** (GitHub Actions): install → lint → typecheck → build
- **Deploy with Vercel** button
 - **Automation**: PR-based safe auto-merge, majors dashboard, semantic PR titles

• Read the full Template Guide: docs/TEMPLATE-GUIDE.md

## Getting Started

Prereqs: Node 20+, pnpm 10+

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Quickstart
1. **Use this template** → create a new repo.
2. In Vercel: **Import Project** → set env vars (see `.env.example`).
3. Locally:
   ```bash
   corepack enable
   corepack prepare pnpm@9 --activate
   pnpm i
   pnpm db:generate
   pnpm dev
   ```
4. Visit http://localhost:3000

## Environment
Copy `.env.example` to `.env.local` and set values. Env is validated at runtime via `src/env.ts`.

## Scripts
- `pnpm dev` — Next.js dev server
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — eslint
- `pnpm lint:strict` — eslint with `--max-warnings=0` (CI-friendly)
- `pnpm typecheck` — tsc --noEmit
- `pnpm typecheck:strict` — strictest TS checks via tsconfig.strictest.json
- `pnpm db:generate` — prisma generate
- `pnpm db:push` — prisma db push (dev only)
- `pnpm test` — run unit tests via Vitest

## Security Scans (SCA)

This template runs a consolidated Trivy-based SCA workflow: `.github/workflows/security-sca.yml`

- Dependency-only job on PRs/commits that change `package.json` or `pnpm-lock.yaml`
- Weekly full repository scan (reduced noise, excludes node_modules)

Both jobs generate and upload SARIF to GitHub Code Scanning. View findings under the repository's "Security" → "Code scanning alerts". The table-mode steps still fail the job on HIGH/CRITICAL issues for fast feedback.

Local quick checks (requires `trivy` installed):

```powershell
trivy fs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 pnpm-lock.yaml
trivy fs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 package.json
```

---

## Stack Decisions

- **Next.js (App Router)**: best-in-class DX on Vercel, hybrid SSR/ISR/Edge.  
- **Prisma + Postgres**: fast local dev; portable to Neon/Supabase.  
- **Zod env guard**: fail-fast on missing config.  
- **Auth.js + Stripe placeholders**: drop-in later without rewiring.  
- **Renovate**: automated PRs for dependency updates.  

You can trim or extend easily. This repo is intentionally minimal yet production-aimed.

## Branch Protection (Recommended)

Configure in GitHub → Settings → Branches → Branch protection rules for `main`:

- Require status checks to pass: select CI, SCA deps, SCA weekly, Semantic PR Title
- Require pull request reviews before merging: 1
- Allow auto-merge: enabled
- Require linear history: optional but recommended
