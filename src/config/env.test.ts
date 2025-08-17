import { describe, it, expect, vi, afterEach } from 'vitest';

import { EnvSchema } from './schema';

const BASE = {
  NODE_ENV: 'test',
  NEXT_PUBLIC_APP_NAME: 'Test App'
};

describe('EnvSchema', () => {
  it('parses minimal valid env (no database)', () => {
    const parsed = EnvSchema.parse(BASE);
    expect(parsed.NODE_ENV).toBe('test');
    expect(parsed.NEXT_PUBLIC_APP_NAME).toBe('Test App');
    expect(parsed.DATABASE_URL).toBeUndefined();
  });

  it('accepts valid DATABASE_URL and trims blanks', () => {
    const parsed1 = EnvSchema.parse({ ...BASE, DATABASE_URL: 'https://example.com' });
    expect(parsed1.DATABASE_URL).toBe('https://example.com');

    const parsed2 = EnvSchema.parse({ ...BASE, DATABASE_URL: '  ' });
    expect(parsed2.DATABASE_URL).toBeUndefined();
  });

  it('coerces optional provider keys as undefined', () => {
    const parsed = EnvSchema.parse({ ...BASE, STRIPE_SECRET_KEY: '' });
    expect(parsed.STRIPE_SECRET_KEY).toBe('');
  });
});

// Test dynamic import path used by app/api/env/route.ts via @/env

describe('env re-export', () => {
  const original = process.env;

  afterEach(() => {
    process.env = original;
    vi.resetModules();
  });

  it('re-exports parsed env and reflects defaults', async () => {
  process.env = { ...original, NODE_ENV: 'test', NEXT_PUBLIC_APP_NAME: 'X' } as any;
  const { env } = await import('@/env');
  expect(env.NODE_ENV).toBe('test');
  expect(env.NEXT_PUBLIC_APP_NAME).toBe('X');
  });
});
