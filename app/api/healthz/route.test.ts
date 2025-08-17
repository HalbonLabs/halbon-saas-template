import { describe, it, expect } from 'vitest';
import { GET } from './route';

// Minimal smoke test for edge route

describe('GET /api/healthz', () => {
  it('returns ok true and a timestamp', async () => {
    const res = await GET();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(typeof json.ts).toBe('number');
  });
});
