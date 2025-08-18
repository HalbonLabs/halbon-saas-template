# Modular Configuration Guide

This guide explains how to use the new modular configuration system in the Halbon SaaS Template.

## Overview

The template now features a modular architecture that allows you to:
- Enable only the features you need for your SaaS
- Choose flexible entity naming (Organization, Workspace, Team, etc.)
- Use pre-configured setups for common use cases
- Automatically update Prisma schema and configuration files

## Quick Start

1. **Run the configuration wizard:**
   ```bash
   node scripts/configure-template.mjs
   ```

2. **Follow the prompts to:**
   - Choose a preset or custom configuration
   - Select which modules to include
   - Configure entity naming
   - Set up provider configurations

3. **The wizard will automatically:**
   - Update your Prisma schema
   - Configure environment variables
   - Set up modular config files
   - Generate appropriate database relations

## Available Presets

### Startup (Recommended)
- **Best for:** MVP and early-stage products
- **Includes:** Auth, Billing, Credits, Plan Limits
- **Entity:** Organization
- **Focus:** Core SaaS functionality with usage-based billing

### Enterprise
- **Best for:** B2B SaaS with complex requirements
- **Includes:** All modules (Auth, Billing, Credits, Plan Limits, Storage, Email)
- **Entity:** Organization
- **Focus:** Full-featured enterprise SaaS

### Minimal
- **Best for:** Simple applications or prototypes
- **Includes:** Auth only
- **Entity:** User (no multi-tenancy)
- **Focus:** Basic authentication without complex billing

## Module Details

### Auth Module
- User authentication and authorization
- Role-based access control
- Session management
- Password reset functionality

### Billing Module (`src/config/stripe.ts`)
- Stripe integration
- Subscription management
- Plan configuration
- Payment processing
- Webhook handling

### Credits Module (`src/config/credits.ts`)
- Usage-based billing
- Credit packages and pricing
- Credit transaction tracking
- Expiration and alerts
- Bulk discount tiers

### Plan Limits Module (`src/config/plan-limits.ts`)
- Feature limits per subscription tier
- Usage tracking and enforcement
- Rate limiting
- Storage quotas
- API call limits

### Storage Module
- File upload and storage
- Multiple provider support (AWS S3, GCP, Azure)
- Secure file access
- Storage quota management

### Email Module
- Transactional email system
- Template management
- Multiple provider support
- Email tracking and analytics

## Entity Naming Configuration

The template supports flexible entity naming for multi-tenancy:

### Organization (Default)
```typescript
// Generated entities
Organization
OrganizationMember
OrganizationBalance
```

### Workspace
```typescript
// Generated entities  
Workspace
WorkspaceMember
WorkspaceBalance
```

### Team
```typescript
// Generated entities
Team
TeamMember
TeamBalance
```

### Custom
You can also specify any custom entity name (e.g., "Company", "Project", "Client").

## Configuration Files

After running the wizard, you'll have these modular configuration files:

- **`template-config.json`** - Main configuration file
- **`src/config/stripe.ts`** - Billing and subscription config
- **`src/config/credits.ts`** - Credit system configuration  
- **`src/config/plan-limits.ts`** - Feature limits configuration
- **Updated `prisma/schema.prisma`** - Database schema with chosen entity names

## Manual Configuration

You can also manually edit `template-config.json` and re-run the wizard:

```json
{
  "preset": "custom",
  "entityName": "Organization",
  "modules": {
    "auth": true,
    "billing": true,
    "credits": true,
    "planLimits": true,
    "storage": false,
    "email": false
  },
  "providers": {
    "auth": "auth-js",
    "billing": "stripe",
    "storage": "aws_s3",
    "email": "resend"
  }
}
```

## Database Schema Updates

The wizard automatically updates your Prisma schema based on your configuration:

1. **Entity Naming**: Updates model names and relations
2. **Module Relations**: Adds tables for enabled modules only
3. **Indexes**: Creates appropriate database indexes
4. **Constraints**: Adds necessary foreign key constraints

After configuration, run:
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
```

## Environment Variables

The wizard will guide you through setting up required environment variables based on your selected modules:

- **Auth Module**: `AUTH_SECRET`, auth provider keys
- **Billing Module**: `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Storage Module**: Provider-specific storage credentials
- **Email Module**: Email provider API keys

## Best Practices

1. **Start with a preset** that matches your use case
2. **Enable modules incrementally** as your needs grow
3. **Use the wizard** rather than manually editing generated files
4. **Test your configuration** with `pnpm lint && pnpm typecheck`
5. **Commit your `template-config.json`** for team consistency

## Migration from Existing Template

If you're upgrading from an older version of the template:

1. **Backup your current configuration**
2. **Run the wizard** and select modules matching your current setup
3. **Review generated files** and merge any custom changes
4. **Update your database schema** with `pnpm db:push`
5. **Test thoroughly** before deploying

## Troubleshooting

### Common Issues

**"Module not found" errors after configuration:**
- Run `pnpm install` to ensure all dependencies are installed
- Check that your `src/config/index.ts` exports are correct

**Database schema conflicts:**
- Reset your database: `pnpm db:reset`
- Re-generate and push: `pnpm db:generate && pnpm db:push`

**TypeScript errors in config files:**
- Ensure all required environment variables are defined
- Check that module dependencies are properly imported

### Getting Help

If you encounter issues:
1. Check this guide and the main README
2. Review the generated configuration files
3. Run the wizard again with different options
4. Open an issue in the template repository

## Advanced Customization

For advanced users who want to extend the modular system:

1. **Add new modules** by creating config files in `src/config/`
2. **Extend the wizard** by modifying `scripts/configure-template.mjs`
3. **Create custom presets** in `template-config.json`
4. **Add module-specific migrations** in the Prisma schema

The modular system is designed to be extensible - you can add your own modules and configuration options as needed.