
import { getPrisma } from '@/lib/prisma';
import { env } from '@/env';

export const runtime = 'nodejs';

function isValidPostgresUrl(url: string | undefined): boolean {
  return typeof url === 'string' && /^(postgres(ql)?:\/\/)/.test(url);
}

export async function GET() {
  try {
    if (!isValidPostgresUrl(env.DATABASE_URL)) {
      return Response.json({ users: [], note: 'DATABASE_URL not configured' });
    }
    const prisma = getPrisma();
    const users = await prisma.user.findMany({ take: 5 });
    return Response.json({ users });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
