/**
 * Modular Stripe Configuration
 * Provider-agnostic billing configuration for the template
 */

import { env } from "./env";

// Stripe configuration for billing module
export const stripeConfig = {
  publicKey: env.STRIPE_PUBLIC_KEY || "",
  secretKey: env.STRIPE_SECRET_KEY || "",
  webhookSecret: env.STRIPE_WEBHOOK_SECRET || "",
  
  // Billing module configuration
  billing: {
    plans: {
      basic: {
        priceId: "price_basic_monthly", // Replace with your Stripe price ID
        features: ["feature_basic_1", "feature_basic_2"],
        limits: {
          credits: 1000,
          storage: "10GB",
          api_calls: 10000,
        },
      },
      pro: {
        priceId: "price_pro_monthly", // Replace with your Stripe price ID
        features: ["feature_pro_1", "feature_pro_2", "feature_pro_3"],
        limits: {
          credits: 10000,
          storage: "100GB",
          api_calls: 100000,
        },
      },
      enterprise: {
        priceId: "price_enterprise_monthly", // Replace with your Stripe price ID
        features: ["feature_enterprise_1", "feature_enterprise_2"],
        limits: {
          credits: -1, // Unlimited
          storage: "1TB",
          api_calls: -1, // Unlimited
        },
      },
    },
  },
  
  // Credit system configuration
  credits: {
    defaultAllocation: 100,
    packages: {
      small: { credits: 1000, priceId: "price_credits_small" },
      medium: { credits: 5000, priceId: "price_credits_medium" },
      large: { credits: 10000, priceId: "price_credits_large" },
    },
  },
  
  // Feature flags for modular billing
  features: {
    subscriptions: true,
    oneTimePayments: true,
    creditPackages: true,
    usageBilling: false,
  },
} as const;

export type StripeConfig = typeof stripeConfig;