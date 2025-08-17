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

function sanitizeError(error: unknown): { message: string } {
  if (typeof error === 'object' && error !== null) {
    // Try to extract a message property, fallback to generic message
    const message = (error as any).message ?? 'Internal server error';
    return { message: String(message) };
  }
  return { message: String(error) };
}

export function jsonServerError(error: unknown) {
  const payload = sanitizeError(error);
  return new Response(JSON.stringify({ error: payload }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}
