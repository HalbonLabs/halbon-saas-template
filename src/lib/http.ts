type Json = Record<string, unknown> | unknown[] | null;

export function jsonOk(data: Json) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export function jsonCreated(data: Json) {
  return new Response(JSON.stringify(data), { status: 201, headers: { 'Content-Type': 'application/json' } });
}

export function jsonNoContent() {
  return new Response(null, { status: 204 });
}

export function jsonBadRequest(error: unknown) {
  return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });
}

export function jsonNotFound(error?: unknown) {
  return new Response(JSON.stringify({ error: error ?? 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
}

export function jsonServerError(error: unknown) {
  const payload = typeof error === 'object' && error !== null ? error : { message: String(error) };
  return new Response(JSON.stringify({ error: payload }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}
