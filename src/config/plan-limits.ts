/**
 * Modular Plan Limits Configuration
 * Configurable feature limits for different subscription tiers
 */

export const planLimitsConfig = {
  // Plan definitions with their limits
  plans: {
    free: {
      name: "Free",
      price: 0,
      interval: null,
      limits: {
        // Core limits
        projects: 1,
        users: 1,
        storage: 1024 * 1024 * 100, // 100MB in bytes
        
        // API limits
        apiCallsPerMonth: 1000,
        apiCallsPerMinute: 10,
        
        // Feature limits
        credits: 100,
        exports: 5,
        integrations: 1,
        
        // Advanced features
        customDomains: 0,
        teamMembers: 1,
        advancedAnalytics: false,
        prioritySupport: false,
      },
      features: [
        "basic_dashboard",
        "basic_reports",
        "community_support",
      ],
    },
    
    starter: {
      name: "Starter",
      price: 1900, // $19.00 in cents
      interval: "month",
      limits: {
        projects: 5,
        users: 3,
        storage: 1024 * 1024 * 1024, // 1GB in bytes
        
        apiCallsPerMonth: 10000,
        apiCallsPerMinute: 50,
        
        credits: 1000,
        exports: 50,
        integrations: 3,
        
        customDomains: 1,
        teamMembers: 3,
        advancedAnalytics: false,
        prioritySupport: false,
      },
      features: [
        "basic_dashboard",
        "basic_reports",
        "email_support",
        "basic_integrations",
      ],
    },
    
    professional: {
      name: "Professional",
      price: 4900, // $49.00 in cents
      interval: "month",
      limits: {
        projects: 25,
        users: 10,
        storage: 1024 * 1024 * 1024 * 10, // 10GB in bytes
        
        apiCallsPerMonth: 100000,
        apiCallsPerMinute: 200,
        
        credits: 10000,
        exports: 500,
        integrations: 10,
        
        customDomains: 5,
        teamMembers: 10,
        advancedAnalytics: true,
        prioritySupport: true,
      },
      features: [
        "advanced_dashboard",
        "advanced_reports",
        "priority_support",
        "advanced_integrations",
        "custom_branding",
        "advanced_analytics",
      ],
    },
    
    enterprise: {
      name: "Enterprise",
      price: null, // Custom pricing
      interval: "month",
      limits: {
        projects: -1, // Unlimited
        users: -1, // Unlimited
        storage: -1, // Unlimited
        
        apiCallsPerMonth: -1, // Unlimited
        apiCallsPerMinute: 1000,
        
        credits: -1, // Unlimited
        exports: -1, // Unlimited
        integrations: -1, // Unlimited
        
        customDomains: -1, // Unlimited
        teamMembers: -1, // Unlimited
        advancedAnalytics: true,
        prioritySupport: true,
      },
      features: [
        "enterprise_dashboard",
        "enterprise_reports",
        "dedicated_support",
        "enterprise_integrations",
        "white_label",
        "advanced_analytics",
        "sso",
        "audit_logs",
        "custom_deployment",
      ],
    },
  },

  // Feature flags for different modules
  featureFlags: {
    enableUsageLimits: true,
    enableRateLimiting: true,
    enableStorageLimits: true,
    enableTeamLimits: true,
    enableAPILimits: true,
  },

  // Override settings for specific features
  overrides: {
    // Allow temporary limit increases
    temporaryBoosts: {
      enabled: true,
      maxDuration: 7, // days
      cooldown: 30, // days between boosts
    },
    
    // Grace period when limits are exceeded
    gracePeriod: {
      enabled: true,
      duration: 3, // days
      warningThreshold: 0.8, // Warn at 80% of limit
    },
  },
} as const;

// Utility types
export type PlanName = keyof typeof planLimitsConfig.plans;
export type PlanConfig = typeof planLimitsConfig.plans[PlanName];
export type PlanLimits = PlanConfig["limits"];

// Helper functions
export function getPlanLimits(planName: PlanName): PlanLimits {
  return planLimitsConfig.plans[planName].limits;
}

export function isPlanFeatureEnabled(planName: PlanName, feature: string): boolean {
  const plan = planLimitsConfig.plans[planName];
  return plan.features.includes(feature as never);
}

export function isUnlimited(value: number): boolean {
  return value === -1;
}

export function checkLimit(current: number, limit: number): boolean {
  if (isUnlimited(limit)) return true;
  return current < limit;
}