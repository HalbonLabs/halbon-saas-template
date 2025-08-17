import { z } from "zod";
import { EnvSchema } from "./schema";
import type { AppConfig, PaymentConfig, EmailConfig, StorageConfig } from "./types";

const raw = EnvSchema.parse(process.env);

const payments: PaymentConfig = {
  provider: raw.PAYMENT_PROVIDER,
  apiKey: raw.PAYMENT_API_KEY,
  apiVersion: raw.PAYMENT_API_VERSION,
  baseUrl: raw.PAYMENT_BASE_URL,
};

const email: EmailConfig = {
  provider: raw.EMAIL_PROVIDER,
  apiKey: raw.EMAIL_API_KEY,
  baseUrl: raw.EMAIL_BASE_URL,
  fromDefault: raw.EMAIL_FROM_DEFAULT,
  domain: raw.EMAIL_DOMAIN,
};

const storage: StorageConfig = {
  provider: raw.STORAGE_PROVIDER,
  bucket: raw.STORAGE_BUCKET,
  region: raw.STORAGE_REGION,
  baseUrl: raw.STORAGE_BASE_URL,
  accessKeyId: raw.STORAGE_ACCESS_KEY_ID,
  secretAccessKey: raw.STORAGE_SECRET_ACCESS_KEY,
};

export const cfg: AppConfig = {
  env: raw.NODE_ENV,
  appName: raw.NEXT_PUBLIC_APP_NAME,
  appUrl: raw.NEXT_PUBLIC_APP_URL,
  payments,
  email,
  storage,
};

export function getProvider(domain: keyof Pick<AppConfig, "payments" | "email" | "storage">) {
  return cfg[domain];
}
