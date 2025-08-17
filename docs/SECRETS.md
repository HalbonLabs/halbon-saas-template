# Secrets & Environment Management

This template avoids hard-coding secrets and centralizes configuration.

- Define environment variables once in your runtime (e.g., Vercel Project Settings). Use `.env.local` only for local dev.
- Application code must import from `src/env.ts` or `src/config/*`. Do not read `process.env` directly.
- Rotate keys regularly and remove unused ones.

## Local Development
- Copy `.env.example` to `.env.local` and fill the values you need.
- Keep `.env.local` out of version control (already ignored).

## Vercel
- Use Project-level Environment Variables for `Production`, `Preview`, and `Development` scopes.
- Prefer encrypted secrets; do not embed API keys in code or logs.

## Providers (Provider-Agnostic Principle)
- Add provider constants to `src/config/providers.ts` and types to `src/config/types.ts`.
- Validate configuration in `src/config/schema.ts` and re-export via `src/env.ts`.
- This ensures future provider swaps are one-file edits.
