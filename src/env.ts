
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  DATABASE_URL: z.preprocess((val) => {
    if (typeof val !== 'string') return undefined;
    const s = val.trim();
    if (s === '') return undefined;
    try {
      // Validate using WHATWG URL; if invalid, treat as undefined for templates
      new URL(s);
      return s;
    } catch {
      return undefined;
    }
  }, z.string().url().optional()),
  NEXT_PUBLIC_APP_NAME: z.string().default('Halbon SaaS Template'),
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  AUTH_SECRET: z.string().optional()
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || undefined,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || undefined,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || undefined,
  AUTH_SECRET: process.env.AUTH_SECRET || undefined
});
