
# Halbon SaaS Template (Vercel-ready)

A professional, adaptable starter for SaaS projects. Optimized for **Vercel** deploys with **pnpm**, **Next.js (App Router)**, **TypeScript**, **Prisma + Postgres**, **Zod env validation**, and **Renovate** for dependency updates.

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

This template runs two Trivy-based SCA workflows:

- Dependency-only on PRs/commits that change `package.json` or `pnpm-lock.yaml`: `.github/workflows/sca-deps.yml`
- Weekly full repository scan (reduced noise, excludes node_modules): `.github/workflows/sca-full-weekly.yml`

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
