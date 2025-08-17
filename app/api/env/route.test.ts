import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from './route';

const original = process.env;

describe('GET /api/env', () => {
  afterEach(() => {
    process.env = original;
    vi.resetModules();
  });

  it('returns derived env info', async () => {
    process.env = { ...original, NODE_ENV: 'test', NEXT_PUBLIC_APP_NAME: 'X' } as any;
    const res = await GET();
    const json = await res.json();
    expect(json.env.NODE_ENV).toBe('test');
    expect(json.env.HAS_DB).toBe(false);
  });
});
