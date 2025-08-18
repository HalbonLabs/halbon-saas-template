# Chan## Unreleased

### Added
- **Modular Configuration System**: Complete configuration wizard for customizing template features
- **Configuration Wizard**: Interactive CLI tool (`scripts/configure-template.mjs`) with presets and help system
- **Flexible Entity Naming**: Support for Organization, Workspace, Team, or custom entity names
- **Modular Billing System**: Centralized Stripe configuration (`src/config/stripe.ts`)
- **Credits System**: Comprehensive credit-based billing configuration (`src/config/credits.ts`)
- **Plan Limits Module**: Configurable feature limits per subscription tier (`src/config/plan-limits.ts`)
- **Smart Presets**: Pre-configured setups for Startup, Enterprise, and Minimal use cases
- **Enhanced Documentation**: Added `MODULAR-CONFIG.md` and `IMPROVEMENTS-SUMMARY.md`

### Changed
- **Prisma Schema**: Updated to support flexible entity naming and modular relations
- **Environment Schema**: Added Stripe configuration variables
- **Config Exports**: Updated `src/config/index.ts` to export new modular configurations
- **README**: Added overview of modular configuration system and quick start guide

### Improved
- **Developer Experience**: Reduced template setup time from hours to minutes
- **Adaptability**: Template now configurable for different business models and use cases
- **Maintainability**: Centralized, type-safe configuration system
- **Code Organization**: Modular architecture with opt-in feature modules

- Security: Remediate CVE-2022-46175 (json5 Prototype Pollution) by enforcing `json5@2.2.2` via `pnpm.overrides`; refreshed lockfile and validated with Trivy (no HIGH/CRITICAL).
- CI/Security: Re-ran "Security - SCA" workflow on `main` to update code scanning; run completed successfully with clean results.
 - Fix: Lazy-initialize Prisma client to avoid build-time datasource URL validation when `DATABASE_URL` is not set; guard `/api/users` to return empty list if DB is not configured and set `runtime: nodejs` for that route.

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Conventional Commits.

## Unreleased

- Security: Remediate CVE-2022-46175 (json5 Prototype Pollution) by enforcing `json5@2.2.2` via `pnpm.overrides`; refreshed lockfile and validated with Trivy (no HIGH/CRITICAL).
- CI/Security: Re-ran “Security - SCA” workflow on `main` to update code scanning; run completed successfully with clean results.
 - Fix: Lazy-initialize Prisma client to avoid build-time datasource URL validation when `DATABASE_URL` is not set; guard `/api/users` to return empty list if DB is not configured and set `runtime: nodejs` for that route.
