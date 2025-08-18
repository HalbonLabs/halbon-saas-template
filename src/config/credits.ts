/**
 * Modular Credits System Configuration
 * Provider-agnostic credit system for usage-based billing
 */

export const creditsConfig = {
  // Default credit allocations
  defaults: {
    newUser: 100,
    freeTrialBonus: 1000,
    referralBonus: 500,
  },

  // Credit pricing (in cents)
  pricing: {
    perCredit: 1, // $0.01 per credit
    bulkDiscounts: {
      tier1: { minCredits: 1000, discount: 0.1 }, // 10% off for 1000+ credits
      tier2: { minCredits: 5000, discount: 0.15 }, // 15% off for 5000+ credits
      tier3: { minCredits: 10000, discount: 0.2 }, // 20% off for 10000+ credits
    },
  },

  // Credit packages for purchase
  packages: {
    starter: {
      credits: 1000,
      price: 900, // $9.00 (10% discount)
      name: "Starter Pack",
      popular: false,
    },
    professional: {
      credits: 5000,
      price: 4250, // $42.50 (15% discount)
      name: "Professional Pack",
      popular: true,
    },
    enterprise: {
      credits: 10000,
      price: 8000, // $80.00 (20% discount)
      name: "Enterprise Pack",
      popular: false,
    },
  },

  // Credit expiration settings
  expiration: {
    enabled: true,
    daysUntilExpiry: 365, // Credits expire after 1 year
    warningDays: 30, // Warn users 30 days before expiration
  },

  // Usage tracking configuration
  tracking: {
    enableUsageAnalytics: true,
    logCreditTransactions: true,
    enableAlerts: true,
    lowBalanceThreshold: 100, // Alert when credits < 100
  },

  // Feature flags
  features: {
    creditTransfers: false, // Allow users to transfer credits
    creditGifting: false, // Allow gifting credits to other users
    autoTopUp: true, // Allow automatic credit top-ups
    usageReports: true, // Generate usage reports
  },
} as const;

// Credit transaction types
export const CREDIT_TRANSACTION_TYPES = {
  PURCHASE: "purchase",
  USAGE: "usage",
  REFUND: "refund",
  BONUS: "bonus",
  TRANSFER_IN: "transfer_in",
  TRANSFER_OUT: "transfer_out",
  EXPIRATION: "expiration",
  ADMIN_ADJUSTMENT: "admin_adjustment",
} as const;

export type CreditTransactionType = keyof typeof CREDIT_TRANSACTION_TYPES;
export type CreditsConfig = typeof creditsConfig;