
import { env } from '@/src/env';

export async function GET() {
  return Response.json({ env: {
    NODE_ENV: env.NODE_ENV,
    HAS_DB: Boolean(env.DATABASE_URL)
  }});
}
