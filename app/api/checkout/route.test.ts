import { describe, it, expect, vi, afterEach } from 'vitest';

const original = process.env;

describe('POST /api/checkout', () => {
  afterEach(() => {
    process.env = original;
    vi.resetModules();
  });

  it('responds with dummy provider by default', async () => {
    process.env = { ...original, NODE_ENV: 'test', NEXT_PUBLIC_APP_NAME: 'X', PAYMENT_PROVIDER: 'dummy' } as any;
    const { POST } = await import('./route');
    const res = await POST();
    const json = await res.json();
    expect(json.provider).toBe('dummy');
  });
});
