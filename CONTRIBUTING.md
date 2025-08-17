# Contributing

Thanks for contributing to the Halbon SaaS Template! This guide explains how to work locally, propose changes, and keep CI green.

## Prerequisites
- Node 20+
- pnpm 10+
- PostgreSQL (optional for local DB)

## Install
```sh
pnpm install
```

## Core Commands
```sh
# Lint (ESLint v9 flat)
pnpm lint

# Type-check
pnpm typecheck

# Unit/Integration tests (Vitest)
pnpm test

# Build (Next.js)
pnpm build

# Prisma client generate
pnpm db:generate
```

## Commit Conventions
Use Conventional Commits:
- `feat: ...` new features
- `fix: ...` bug fixes
- `docs: ...` documentation changes
- `chore: ...` non-code or tooling tasks
- `refactor: ...` code refactors
- `build: ...` build system or deps
- `test: ...` tests only

CI enforces Semantic PR (PR titles must follow the convention).

## Coding Standards
- TypeScript strict mode; no `any` regressions.
- Follow the ESLint flat config (`eslint.config.mjs`). The `.eslintrc.json` is a Next build shim only.
- Keep functions small and cohesive; extract helpers when >60 lines or complexity >12.
- Co-locate tests as `*.test.ts/tsx` near the code.

## Provider-Agnostic Design
- Add provider specifics in `src/config/*` and `src/env.ts` only.
- App code must import from those modules rather than using raw strings or `process.env`.

## Security & Supply Chain
- Prefer stable packages.
- If you add or update dependencies, run a Trivy scan (via Codacy CLI) and remediate:
  - `pnpm add <pkg>` → run SCA via workflow or locally
  - Use `pnpm overrides` to pin safe versions for transitive deps if needed.

## Submitting Changes
1. Create a feature branch.
2. Ensure local checks are green:
   ```sh
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```
3. Commit using Conventional Commits.
4. Open a PR; CI will run and enforce:
   - Install → Lint → Typecheck → Build
   - SCA (Trivy)
   - Semantic PR title
   - Release Drafter uses labels

## Releasing
- Release Drafter prepares notes based on merged PRs and labels.
- On merge to `main`, automations keep dependencies pinned and secure.
