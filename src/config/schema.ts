import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),

  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Halbon SaaS Template"),
  NEXT_PUBLIC_APP_URL: z.string().regex(/^https?:\/\/.+/, "Invalid URL format").optional(),

  // Database (optional for template)
  DATABASE_URL: z.preprocess(
    (val) => {
      if (typeof val !== "string") return undefined;
      const s = val.trim();
      if (s === "") return undefined;
      try {
        new URL(s);
        return s;
      } catch {
        return undefined;
      }
    },
    z.string().regex(/^[a-z]+:\/\/.+/, "Invalid database URL format").optional()
  ),

  // Payments (example: Stripe)
  PAYMENT_PROVIDER: z.enum(["stripe", "adyen", "braintree", "dummy"]).default("dummy"),
  PAYMENT_API_KEY: z.string().optional(),
  PAYMENT_API_VERSION: z.string().optional(),
  PAYMENT_BASE_URL: z.string().regex(/^https?:\/\/.+/, "Invalid payment URL format").optional(),

  // Email (example: Resend)
  EMAIL_PROVIDER: z.enum(["resend", "sendgrid", "postmark", "dummy"]).default("dummy"),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_BASE_URL: z.string().regex(/^https?:\/\/.+/, "Invalid email URL format").optional(),
  EMAIL_FROM_DEFAULT: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format").optional(),
  EMAIL_DOMAIN: z.string().optional(),

  // Storage (example: AWS S3)
  STORAGE_PROVIDER: z.enum(["aws_s3", "gcp_storage", "azure_blob", "dummy"]).default("dummy"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  STORAGE_BASE_URL: z.string().regex(/^https?:\/\/.+/, "Invalid storage URL format").optional(),
  STORAGE_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional(),

  // Stripe Configuration (Billing Module)
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Legacy/optional provider-specific keys kept for template compatibility
  AUTH_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;
