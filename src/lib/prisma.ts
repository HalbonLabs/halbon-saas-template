
import { PrismaClient } from '@prisma/client';
import { env } from '@/env';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function isValidPostgresUrl(url: string | undefined): boolean {
  return typeof url === 'string' && /^(postgres(ql)?:\/\/)/.test(url);
}

export function getPrisma(): PrismaClient {
  if (global.prisma) return global.prisma;

  const client = new PrismaClient({
    datasources: isValidPostgresUrl(env.DATABASE_URL)
      ? { db: { url: env.DATABASE_URL as string } }
      : undefined,
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

  if (env.NODE_ENV !== 'production') global.prisma = client;
  return client;
}
