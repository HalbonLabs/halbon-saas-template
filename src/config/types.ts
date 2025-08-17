// Central type contracts for provider-agnostic code

export type EnvStage = "development" | "test" | "staging" | "production";

export type PaymentProvider = "stripe" | "adyen" | "braintree" | "dummy";
export type EmailProvider = "resend" | "sendgrid" | "postmark" | "dummy";
export type StorageProvider = "aws_s3" | "gcp_storage" | "azure_blob" | "dummy";

export interface PaymentConfig {
  provider: PaymentProvider;
  apiKey?: string;
  apiVersion?: string;
  baseUrl?: string;
}

export interface EmailConfig {
  provider: EmailProvider;
  apiKey?: string;
  baseUrl?: string;
  fromDefault?: string;
  domain?: string;
}

export interface StorageConfig {
  provider: StorageProvider;
  bucket?: string;
  region?: string;
  baseUrl?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface AppConfig {
  env: EnvStage;
  appName: string;
  appUrl: string;

  payments: PaymentConfig;
  email: EmailConfig;
  storage: StorageConfig;

  // Add more domains here (analytics, search, auth, etc.)
  // analytics: AnalyticsConfig;
}
