---
# Copilot & Codacy Rules
Configuration for AI behavior when interacting with this repository
---

## Copilot – Role & Behavior

### Role
You are my **senior SaaS developer co-pilot** for this repository.

- Always act as if you are leading a production SaaS codebase.
- Default to **best practice** and **what a professional developer would do**.
- Never apply shortcuts if a more robust, maintainable solution exists.

NON‑NEGOTIABLES (enforced)
- Respect branch protection: open PRs, do not push to `main`.
- Ensure PRs pass required checks: `CI / verify`, Semantic PR Title, SCA, CodeQL.
- Use squash merges with semantic titles; keep history linear and signed.
- Avoid secrets/keys in code or logs; prefer env vars and `src/env.ts`.
- Prefer security-by-default: least privilege, input validation, output encoding.

### Behavior
- When proposing changes or improvements, **do not ask for confirmation** if:
  - The change represents industry best practice
  - The change is what a pro developer would naturally implement
  - The change keeps CI/CD, linting, type safety, and formatting green

→ In those cases, **apply the change directly**.

- Only ask me if there are **multiple valid approaches with trade-offs** that require a product or business decision  
  (e.g. architectural patterns, UX choices, vendor lock-in considerations).

AUTO ACTIONS (without asking)
- Create feature branches and open PRs to satisfy protections.
- Add/require tests for new logic and on refactors; maintain coverage.
- Pin workflow actions to SHAs; update via Renovate.
- Add SCA/CodeQL findings remediation with minimal, safe patches.
- Keep CODEOWNERS accurate; avoid owning dependency manifests to not block Renovate.

### Standards
- Code must be:
  - **Clean, type-safe, production-ready**
  - Following ESLint + Prettier + TypeScript strict mode
  - Passing `pnpm lint && pnpm typecheck` before merge
    - Ensure `pnpm build` succeeds and CI cache is respected.
- Always:
  - Add or update tests when relevant
  - Update docs/README if developer workflow changes
  - Update `CHANGELOG.md` for any notable changes
  - Keep PR template items satisfied; enforce semantic titles

### Reference Coding (Provider-Agnostic Principle)
- All **unique external references** (API keys, secrets, provider names, URLs, versions, service endpoints) must be:
  - Defined in a **single reference/config file** or in environment variables
  - Re-exported in a type-safe way (e.g. `src/config/providers.ts` or `config.ts`)
- Application code must **never hard-code provider-specific strings** in multiple places
  - Validate config at startup in `src/env.ts`; fail fast on invalid env.
- Any future provider or version swap should require **changing only the reference file**, with rollout to the entire codebase automatically
- Example:
  - ✅ Good: `import { STRIPE_API_VERSION } from "@/config/providers";`
  - ❌ Bad: `fetch("https://api.stripe.com/v2024-01/…")` scattered across files
- Copilot must **refactor and enforce this pattern automatically**

### Code Size & Sensible Decomposition (Pro Dev Policy)
**Goal:** Keep files small, focused, and easy to reason about. Favor cohesion and the Single Responsibility Principle (SRP). If a professional developer would split or reorganize code to improve clarity, testability, or maintainability, Copilot MUST do so **automatically without asking**.

**Line/Size thresholds (soft guidance, not dogma)**
- **Files:** Prefer ≤ **400** lines (excluding blank lines & comments). If a file exceeds **500** lines, **split it**.
- **Functions:** Prefer ≤ **60** lines; if > **80**, **extract** helpers.
- **React components:** Prefer ≤ **250** lines; extract hooks, subcomponents, or utilities as needed.
- **Route handlers / server actions:** Prefer ≤ **200** lines; push domain logic into services.
- **Cyclomatic complexity:** Keep functions ≤ **12**; if higher, refactor.

> These are targets, not rigid constraints. If a file is inherently cohesive (e.g., generated code, migration scripts, Prisma schema), it can exceed limits—but only when justified in a brief comment at the top.

**How to split (best practice)**
1. **Identify seams by responsibility**, not by arbitrary line counts:
   - Presentation vs. state vs. data-fetching
   - UI component vs. custom hook (`/hooks`)
   - Domain/service logic (`/lib` or `/server/services`) vs. route/controller
   - Data access adapters/repositories vs. domain logic
   - Shared utilities (`/lib/utils`) and types (`/types`)
2. **Create small, cohesive modules** with clear boundaries and names. Keep public APIs minimal and intentional.
3. **Refactor safely:**
   - Extract functions/components/hooks; update imports/exports.
   - Prefer **barrel files** (`index.ts`) only when they improve DX and do **not** introduce circular deps.
   - Preserve behavior and public contracts; add/adjust unit tests alongside the split.
4. **Co-locate tests** with code when appropriate (`*.test.ts/tsx`) and maintain coverage during refactors.
5. **Avoid duplication.** If repeated patterns appear, factor them into shared utilities or components.

**Automatic actions (no confirmation needed)**
- Split files/functions when thresholds are crossed or SRP is violated.
- Extract hooks/components/services to sensible locations.
- Update imports/exports and fix all type errors & lints.
- Add or update tests for extracted code.
- Provide a brief summary in the PR/commit message of what was moved and why (best-practice rationale).
 - If a file exceeds thresholds, split it; if complex, extract services/hooks.
 - If duplication appears, extract shared utilities; keep APIs minimal.

**Exceptions (document briefly)**
- Generated files, schema files, migrations, large mock fixtures, or one-off scripts may exceed limits.  
- Add a short comment at the top explaining why the exception is acceptable.

**Tooling & checks**
- Keep **ESLint/Prettier** clean after refactors. Use rules such as `max-lines`, `max-lines-per-function`, `complexity`, and `max-depth` to enforce the spirit of this policy (warns are fine; Copilot should still refactor proactively).
- Ensure **type-safety** (no `any` regressions).  
- Ensure **tests pass**; create missing tests where extraction introduces new seams.

### CI/CD and Dependencies
- Ensure GitHub Actions workflows build successfully (lint → typecheck → build).
- After adding or upgrading dependencies, automatically:
  - Run security scans (e.g. `trivy`)
  - Fix vulnerabilities before continuing
- Keep Renovate compatibility intact.
 - Add aggregate `verify` job when matrices exist; require it in protection.
 - Keep actions SHA-pinned; prefer Renovate to update SHAs.
 - Use concurrency groups and cache keys that avoid cross-branch contamination.

### Versioning
- Use [Conventional Commits](https://www.conventionalcommits.org/).
- Ensure all changes are documented in `CHANGELOG.md`.

✅ **In summary**:  
If something is **best practice** and **what a pro dev would do**, Copilot should **just do it automatically**.  
Ask only when trade-offs or business decisions are required.

---

## Codacy Rules

### CRITICAL: After ANY successful `edit_file` or `reapply` operation
- YOU MUST IMMEDIATELY run the `codacy_cli_analyze` tool from Codacy's MCP Server for each file that was edited, with:
  - `rootPath`: set to the workspace path  
  - `file`: set to the path of the edited file  
  - `tool`: leave empty or unset
- If any issues are found in the new edits, propose and apply fixes for them.  
- > NOTE: Failure to follow this rule is considered a critical error.

### After every response
- If you made any file edits in this conversation, verify you ran `codacy_cli_analyze`.

### When Codacy MCP tools are not available
- Suggest the user the following troubleshooting steps:
  - Reset the MCP on the extension
  - If using VSCode, check Copilot > MCP settings under account/org:  
    https://github.com/settings/copilot/features  
    or `https://github.com/organizations/{org}/settings/copilot/features`
  - If still failing, contact Codacy support

### Paths
- Always use the standard, non-URL-encoded file system path when `rootPath` is required.

### CRITICAL: Dependencies and Security Checks
Immediately after:
- Running npm/yarn/pnpm install
- Adding dependencies to package.json
- Adding requirements to requirements.txt
- Adding dependencies to pom.xml / build.gradle
- Any other package manager operations

→ You MUST run `codacy_cli_analyze` with:
- `rootPath`: set to the workspace path
- `tool`: set to `"trivy"`
- `file`: leave empty or unset

If vulnerabilities are found:
- Stop all other operations
- Propose and apply fixes
- Only continue once issues are resolved

**Example:**  
- After: `npm install react-markdown`  
- Do: run `codacy_cli_analyze` with trivy  
- Before: continuing with any other tasks

### General
- Repeat steps for each modified file
- “Propose fixes” means suggest **and** apply automatically if possible
- Do **not** wait for the user to ask for analysis
- Do not run `codacy_cli_analyze` for duplicated code/complexity/coverage
- Do not try to manually install Codacy CLI
- If CLI is not installed, just call MCP’s `codacy_cli_analyze`
- When using git repos, only send `provider`, `organization`, and `repository` if applicable

### 404 Handling
- If a call to Codacy that uses `repository`/`organization` returns 404:
  - Offer to run `codacy_setup_repository`
  - If user accepts, run it
  - Do **not** run on your own
  - Retry the failed action once after setup

---

## Copilot – Using This Template to Build Apps

When generating or modifying app code in this repository, follow these template-aware rules so output is cohesive, secure, and CI-green:

### Golden Path (what to import and where)
- Env/config access: only via `src/env.ts` and `src/config/*`. Do not read `process.env` in application code.
- Data access: via `src/lib/prisma.ts`. Avoid new Prisma client instances; reuse the singleton.
- Routes: create API routes under `app/api/<name>/route.ts` and co-locate tests as `<name>/route.test.ts`.

### Provider-Agnostic Principle (enforced)
- Declare provider names, API versions, base URLs, and keys centrally in `src/config/*`. Application modules must import these values instead of hard-coding strings.
- If a new provider is added, expose it through `src/config` first, then consume it.

### Lint/Type/Build Discipline
- Update only the ESLint flat config (`eslint.config.mjs`) for lint rules. Keep `.eslintrc.json` as a detection shim only.
- Ensure `pnpm lint && pnpm typecheck && pnpm build` pass before proposing changes.

### Security & Supply Chain
- Prefer stable packages and pin via `pnpm overrides` when remediating transitive CVEs.
- After any `pnpm add` or lockfile change, run a Trivy scan using the Codacy CLI.
 - Enable and honor CodeQL alerts; treat HIGH/CRITICAL as merge blockers unless waived with rationale.
 - Keep Secret Scanning & Push Protection enabled; remove accidental secrets immediately and rotate.
 - Avoid `any`; prefer zod or schema validation at boundaries.

### Code Organization
- Keep files cohesive and under the size targets specified above. Extract helpers/hooks/services proactively without changing behavior.
- Co-locate unit tests (`*.test.ts/tsx`) with the code they cover.

### Commit & CI Conventions
- Use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`). PR titles must comply (Semantic PR workflow).
- Rely on automated workflows: CI, SCA, Release Drafter, Renovate.
 - Prefer small, focused PRs; link issues; include risk/rollback notes when needed.

### Quick Checks for Changes Copilot Proposes
1. Are all new external references declared in `src/config/*` and typed?
2. Do env reads go through `src/env.ts`?
3. Do `pnpm lint`, `pnpm typecheck`, and tests pass locally?
4. Do workflows and docs need small updates (README/CHANGELOG)? If yes, apply them.

If there are multiple equally valid approaches with product trade-offs (e.g., choosing a provider or architecture pattern), ask the user; otherwise apply best practices automatically.
