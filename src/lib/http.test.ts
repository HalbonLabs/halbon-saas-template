import { describe, it, expect } from 'vitest';
import { jsonOk, jsonCreated, jsonNoContent, jsonBadRequest, jsonNotFound, jsonServerError } from './http';

function readJson(res: Response) {
  return res.json();
}

describe('http helpers', () => {
  it('jsonOk returns 200 with payload', async () => {
    const res = jsonOk({ a: 1 });
    expect(res.status).toBe(200);
    expect(await readJson(res)).toEqual({ a: 1 });
  });

  it('jsonCreated returns 201', async () => {
    const res = jsonCreated({ id: 'x' });
    expect(res.status).toBe(201);
  });

  it('jsonNoContent returns 204', () => {
    const res = jsonNoContent();
    expect(res.status).toBe(204);
  });

  it('jsonBadRequest returns 400 with error', async () => {
    const res = jsonBadRequest('bad');
    expect(res.status).toBe(400);
    expect(await readJson(res)).toEqual({ error: 'bad' });
  });

  it('jsonNotFound returns 404', async () => {
    const res = jsonNotFound();
    expect(res.status).toBe(404);
    expect(await readJson(res)).toEqual({ error: 'Not found' });
  });

  it('jsonServerError returns 500 with error object', async () => {
    const res = jsonServerError({ message: 'oops' });
    expect(res.status).toBe(500);
    expect(await readJson(res)).toEqual({ error: { message: 'oops' } });
  });
});
