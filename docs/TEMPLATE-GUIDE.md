# Halbon SaaS Template – Technical Guide

This guide explains what this template is, how it is structured, what each key file does, and how to extend it safely. It is written for engineers adopting the template to build production SaaS apps.

## Goals
- Production-grade baseline for a Next.js + TypeScript + Prisma SaaS.
- Secure-by-default: pinned GitHub Actions, SCA scanning, typed config.
- CI green: lint → typecheck → build → security scans.
- Strict, flat ESLint v9 config; zero legacy lint files.
- Provider-agnostic architecture: swap infra/vendors via centralized config.

## Stack
- App: Next.js 15 (App Router), React 19, TypeScript strict.
- Data: Prisma ORM.
- Testing: Vitest + happy-dom.
- Linting/Format: ESLint v9 (flat), Prettier.
- Package Manager: pnpm with overrides for supply-chain hygiene.
- CI/Security: GitHub Actions, Trivy (SCA), Codacy CLI integration.

## Project Structure (selected)
- `app/` – Next.js App Router pages and API routes.
- `src/`
  - `env.ts` – runtime env schema and safe accessors.
  - `lib/prisma.ts` – Prisma client singleton with safe URL handling.
  - `config/` – provider-agnostic config surface (env-derived) for app services.
- `prisma/schema.prisma` – database schema.
- `eslint.config.mjs` – ESLint v9 flat config (authoritative).
- `.eslintrc.json` – minimal shim so Next build detects ESLint; not authoritative.
- `next.config.mjs` – Next config. Linting skipped during build; CI enforces lint.
- `package.json` – scripts and pnpm overrides (e.g., `json5` remediation).
- `.github/` – CI/CD, quality, and release automation.

## Key Files Explained

### Application
- `app/layout.tsx` – root layout.
- `app/page.tsx` – landing page.
- `app/status/page.tsx` – example status page.
- `app/api/*/route.ts` – API routes for health, env, users, checkout.

### Runtime Config
- `src/env.ts` – Defines and validates environment variables at runtime using Zod. Consumers must import from here rather than reading `process.env` directly.
- `src/config/*` – Provider-agnostic configuration layer. Centralizes external references (providers, endpoints, versions) to enable painless swaps.

### Data Layer
- `prisma/schema.prisma` – Prisma model definitions. Run `pnpm db:generate` to regenerate the client.
- `src/lib/prisma.ts` – Safe Prisma client singleton. Uses `DATABASE_URL` only if it matches a Postgres URL pattern to avoid accidental misconfig.

### Linting & Formatting
- `eslint.config.mjs` – ESLint v9 flat config using `@typescript-eslint` and `@next/eslint-plugin-next` rules with environment globals via `globals`. This is the only authoritative lint config.
- `.eslintrc.json` – Small shim for Next build detection (`extends: next/core-web-vitals`). Do not put rules here.
- `prettier` – Formatting via Prettier; no Prettier-specific config means defaults.

### Next.js
- `next.config.mjs` – `eslint.ignoreDuringBuilds: true` (lint in CI only), `experimental.typedRoutes: true`.

### Package & Security Hygiene
- `package.json` – Uses pnpm and enforces overrides to remediate known issues (e.g., `json5@2.2.3`). Keep scripts minimal and CI-aligned.
- `pnpm-lock.yaml` – Lockfile; pinned for reproducibility.

## GitHub Workflows (Overview)
All actions are SHA-pinned and Renovate is configured to keep digests fresh.

- `.github/workflows/ci.yml`
  - Purpose: Lint, typecheck, build. Matrix can target Node/pnpm as needed.
  - Permissions: minimal required.
  - Concurrency: serializes CI per ref.

- `.github/workflows/security-sca.yml`
  - Purpose: Trivy Software Composition Analysis for dependencies.
  - Output: SARIF upload, fails on critical vulns.

- `.github/workflows/semantic-pr.yml`
  - Purpose: Enforces Conventional Commits PR titles for clean history and automated releases.

- `.github/workflows/release-drafter.yml`
  - Purpose: Drafts release notes using PR labels and Conventional Commit types.

- `.github/workflows/pr-labeler.yml`
  - Purpose: Applies labels to PRs based on modified paths or other rules, powering Release Drafter and triage.

- `.github/workflows/renovate-automerge.yml`
  - Purpose: Automerge safe Renovate PRs (e.g., pinned digests, patch updates) after CI passes.

- `.github/workflows/renovate-majors-dashboard.yml`
  - Purpose: Provides a majors dashboard and keeps major upgrades visible and controlled.

## Developer Workflow
- Install: `pnpm install`.
- Lint: `pnpm lint` (ESLint v9 flat, CI enforces).
- Types: `pnpm typecheck`.
- Tests: `pnpm test`.
- Build: `pnpm build` (skips lint; types still checked).
- DB Client: `pnpm db:generate`.

## Conventions & Guarantees
- Conventional Commits enforced via CI.
- Provider-agnostic interfaces enforced via `src/config/*`.
- No hard-coded provider strings scattered in code; change providers centrally.
- ESLint rules target modern JS/TS and Next best practices.
- Supply-chain hygiene: use `pnpm overrides` for transitive vulnerabilities.

## Extending the Template
1. Add new services/providers
   - Extend `src/config/providers.ts` (or equivalent) with typed entries.
   - Read values from `src/env.ts`; do not read `process.env` directly.
   - Consume config in server modules; keep provider specifics isolated.

2. New API routes
   - Create `app/api/<name>/route.ts` and add tests under `app/api/<name>/route.test.ts`.
   - Ensure handler uses only the config layer for external references.

3. Data models
   - Edit `prisma/schema.prisma`, then `pnpm db:generate` and update usage.

4. Lint rules
   - Update `eslint.config.mjs`. Keep flat config as the sole source.

## CI Expectations
- CI runs `pnpm lint && pnpm typecheck && pnpm build` and security scans.
- PRs must pass CI and satisfy Semantic PR. Labels drive release notes.

## Security Model
- Trivy SCA runs in workflow and locally via Codacy CLI when needed.
- Overrides applied to eliminate known CVEs (e.g., `json5` chain).

## Troubleshooting
- Next build prints ESLint detection warning if the shim is missing; this is cosmetic when CI runs lint. We skip lint during build to avoid noise.
- If ESLint flags `no-undef` on Node/DOM globals, ensure `globals` is in `eslint.config.mjs` and tests include Vitest globals.

---

This guide is versioned with the template. Keep it updated alongside changes to workflows, lint rules, or architecture.
