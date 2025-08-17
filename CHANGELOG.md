# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Conventional Commits.

## Unreleased

- Security: Remediate CVE-2022-46175 (json5 Prototype Pollution) by enforcing `json5@2.2.2` via `pnpm.overrides`; refreshed lockfile and validated with Trivy (no HIGH/CRITICAL).
- CI/Security: Re-ran “Security - SCA” workflow on `main` to update code scanning; run completed successfully with clean results.
 - Fix: Lazy-initialize Prisma client to avoid build-time datasource URL validation when `DATABASE_URL` is not set; guard `/api/users` to return empty list if DB is not configured and set `runtime: nodejs` for that route.
