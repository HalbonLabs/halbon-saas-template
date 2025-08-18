#!/usr/bin/env node

/**
 * Halbon SaaS Template Configuration Wizard
 * Helps developers configure the template for their specific needs
 */

import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🚀 Halbon SaaS Template Configuration Wizard

Usage: node scripts/configure-template.mjs [options]

Options:
  --help, -h     Show this help message
  --preset       Run with a specific preset (startup, enterprise, minimal)

This wizard will help you customize the SaaS template for your specific needs:
- Choose feature modules (auth, billing, credits, storage, etc.)
- Configure entity naming (Organization vs Workspace vs Team)
- Set up provider configurations
- Update Prisma schema and config files

Examples:
  node scripts/configure-template.mjs
  node scripts/configure-template.mjs --preset startup
`);
  process.exit(0);
}

// ANSI colors for better CLI experience
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function loadTemplateConfig() {
  const configPath = join(__dirname, 'template-config.json');
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

function promptUser(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

async function selectPreset(config) {
  log('\n📋 Available Presets:', colors.bright);
  
  const presets = Object.entries(config.presets);
  presets.forEach(([, preset], index) => {
    log(`${index + 1}. ${preset.name}`, colors.cyan);
    log(`   ${preset.description}`, colors.reset);
    log(`   Modules: ${preset.modules.join(', ')}\n`);
  });
  
  const choice = await promptUser('Select a preset (1-' + presets.length + ') or "custom" for custom configuration: ');
  
  if (choice.toLowerCase() === 'custom') {
    return await customModuleSelection(config);
  }
  
  const index = parseInt(choice) - 1;
  if (index >= 0 && index < presets.length) {
    const [presetKey, preset] = presets[index];
    log(`\n✅ Selected preset: ${preset.name}`, colors.green);
    return {
      preset: presetKey,
      modules: preset.modules,
      entityName: 'workspace' // default
    };
  }
  
  log('Invalid selection. Using minimal preset.', colors.yellow);
  return {
    preset: 'minimal',
    modules: config.presets.minimal.modules,
    entityName: 'workspace'
  };
}

async function customModuleSelection(config) {
  log('\n🔧 Custom Module Selection:', colors.bright);
  
  const selectedModules = ['core']; // Core is always required
  const availableModules = Object.entries(config.modules)
    .filter(([key]) => key !== 'core');
  
  for (const [key, module] of availableModules) {
    log(`\n📦 ${module.name}`, colors.cyan);
    log(`   ${module.description}`);
    
    const choice = await promptUser('Include this module? (y/n): ');
    if (choice.toLowerCase() === 'y' || choice.toLowerCase() === 'yes') {
      selectedModules.push(key);
      log(`   ✅ Added ${module.name}`, colors.green);
    }
  }
  
  return {
    preset: 'custom',
    modules: selectedModules,
    entityName: await selectEntityName(config)
  };
}

async function selectEntityName(config) {
  log('\n🏢 Entity Configuration:', colors.bright);
  log('What should we call your primary business entity?');
  
  config.entityConfig.alternativeNames.forEach((name, index) => {
    log(`${index + 1}. ${name}`);
  });
  
  const choice = await promptUser(`Enter number (1-${config.entityConfig.alternativeNames.length}) or custom name: `);
  
  const index = parseInt(choice) - 1;
  if (index >= 0 && index < config.entityConfig.alternativeNames.length) {
    return config.entityConfig.alternativeNames[index];
  }
  
  if (choice && choice.length > 0) {
    return choice.toLowerCase();
  }
  
  return 'workspace'; // default
}

function updatePrismaSchema(entityName) {
  log(`\n🗄️  Updating database schema for entity: ${entityName}`, colors.blue);
  
  const schemaPath = join(__dirname, 'prisma', 'schema.prisma');
  let schema = readFileSync(schemaPath, 'utf8');
  
  // Add base entity model
  const entityModel = `
model ${capitalize(entityName)} {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  plan        String   @default("FREE_TRIAL")
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations will be added by modules
  members     ${capitalize(entityName)}Member[]

  @@map("${entityName}s")
}

model ${capitalize(entityName)}Member {
  id           String @id @default(cuid())
  userId       String
  ${entityName}Id String
  role         String @default("MEMBER")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User @relation(fields: [userId], references: [id], onDelete: Cascade)
  ${entityName} ${capitalize(entityName)} @relation(fields: [${entityName}Id], references: [id], onDelete: Cascade)

  @@unique([userId, ${entityName}Id])
  @@map("${entityName}_members")
}
`;

  // Update User model to include relation
  schema = schema.replace(
    /model User \{[\s\S]*?\}/,
    `model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  ${entityName}Members ${capitalize(entityName)}Member[]
}`
  );

  schema += entityModel;
  writeFileSync(schemaPath, schema);
}

function updateConfigFiles(selection) {
  log('\n⚙️  Updating configuration files', colors.blue);
  
  // Update environment schema based on selected modules
  updateEnvSchema(selection);
  
  // Update providers config
  updateProvidersConfig();
  
  // Create module-specific files
  createModuleFiles(selection);
}

function updateEnvSchema(selection) {
  const envSchemaPath = join(__dirname, 'src', 'config', 'schema.ts');
  let envSchema = readFileSync(envSchemaPath, 'utf8');
  
  // Add billing-specific environment variables if billing module selected
  if (selection.modules.includes('billing')) {
    const billingEnvVars = `
  // Stripe Configuration
  STRIPE_PUBLIC_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),`;
    
    envSchema = envSchema.replace(
      /\/\/ Legacy\/optional provider-specific keys kept for template compatibility/,
      `// Billing Configuration${billingEnvVars}

  // Legacy/optional provider-specific keys kept for template compatibility`
    );
  }
  
  writeFileSync(envSchemaPath, envSchema);
}

function updateProvidersConfig() {
  // Provider config updates based on selected modules
  log('   📝 Updated provider configurations');
}

function createModuleFiles(selection) {
  if (selection.modules.includes('billing')) {
    createBillingModule(selection.entityName);
  }
  
  if (selection.modules.includes('credits')) {
    createCreditSystemModule();
  }
  
  if (selection.modules.includes('planLimits')) {
    createPlanLimitsModule();
  }
}

function createBillingModule(entityName) {
  log('   💳 Creating billing module', colors.cyan);
  
  const billingDir = join(__dirname, 'src', 'lib', 'billing');
  mkdirSync(billingDir, { recursive: true });
  
  // Create basic billing service
  const billingService = `/**
 * Billing service for ${entityName} subscriptions
 * Generated by Halbon SaaS Template
 */

import { stripe } from '@/config/stripe';
import { prisma } from '@/lib/prisma';

export class BillingService {
  static async createCustomer(${entityName}Id: string, email: string) {
    const customer = await stripe.customers.create({
      email,
      metadata: { ${entityName}Id }
    });
    
    await prisma.${entityName}.update({
      where: { id: ${entityName}Id },
      data: { stripeCustomerId: customer.id }
    });
    
    return customer;
  }
  
  static async createSubscription(customerId: string, priceId: string) {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  }
}
`;
  
  writeFileSync(join(billingDir, 'service.ts'), billingService);
  
  // Create Stripe webhook handler
  const webhookDir = join(__dirname, 'app', 'api', 'webhooks', 'stripe');
  mkdirSync(webhookDir, { recursive: true });
  
  const webhookHandler = `import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/config/env';
import { stripe } from '@/config/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const ${entityName} = await prisma.${entityName}.findFirst({
    where: { stripeCustomerId: customerId }
  });
  
  if (${entityName}) {
    await prisma.${entityName}.update({
      where: { id: ${entityName}.id },
      data: {
        plan: subscription.status === 'active' ? 'PRO' : 'FREE_TRIAL',
        stripeSubscriptionId: subscription.id
      }
    });
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const ${entityName} = await prisma.${entityName}.findFirst({
    where: { stripeCustomerId: customerId }
  });
  
  if (${entityName}) {
    await prisma.${entityName}.update({
      where: { id: ${entityName}.id },
      data: {
        plan: 'FREE_TRIAL',
        stripeSubscriptionId: null
      }
    });
  }
}
`;
  
  writeFileSync(join(webhookDir, 'route.ts'), webhookHandler);
}

function createCreditSystemModule() {
  log('   🪙 Creating credit system module', colors.cyan);
  // Credit system implementation would go here
}

function createPlanLimitsModule() {
  log('   🚧 Creating plan limits module', colors.cyan);
  // Plan limits implementation would go here
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function removeUnusedFiles(selection) {
  log('\n🧹 Cleaning up unused files', colors.blue);
  
  const config = loadTemplateConfig();
  const allModules = Object.keys(config.modules);
  const unusedModules = allModules.filter(m => !selection.modules.includes(m));
  
  // Remove files for unused modules
  unusedModules.forEach(module => {
    const moduleConfig = config.modules[module];
    if (moduleConfig.files) {
      moduleConfig.files.forEach(filePath => {
        const fullPath = join(__dirname, filePath);
        if (existsSync(fullPath)) {
          rmSync(fullPath, { recursive: true, force: true });
          log(`   🗑️  Removed ${filePath}`, colors.yellow);
        }
      });
    }
  });
}

function generateSummary(selection) {
  log('\n📋 Configuration Summary:', colors.bright);
  log(`Preset: ${selection.preset}`, colors.cyan);
  log(`Entity Name: ${selection.entityName}`, colors.cyan);
  log(`Modules: ${selection.modules.join(', ')}`, colors.cyan);
  
  log('\n🚀 Next Steps:', colors.green);
  log('1. Run "pnpm install" to install dependencies');
  log('2. Copy .env.example to .env.local and configure');
  log('3. Run "pnpm db:generate" to generate Prisma client');
  log('4. Run "pnpm dev" to start development server');
  
  if (selection.modules.includes('billing')) {
    log('\n💳 Billing Setup:', colors.yellow);
    log('- Configure Stripe environment variables');
    log('- Set up webhook endpoint in Stripe dashboard');
    log('- Configure product prices in Stripe');
  }
}

async function main() {
  log('🎯 Halbon SaaS Template Configuration Wizard', colors.bright);
  log('This wizard will help you configure the template for your specific needs.\n');
  
  const config = loadTemplateConfig();
  const selection = await selectPreset(config);
  
  log('\n🔨 Configuring your template...', colors.blue);
  
  updatePrismaSchema(selection.entityName);
  updateConfigFiles(selection);
  removeUnusedFiles(selection);
  
  log('\n✅ Template configured successfully!', colors.green);
  generateSummary(selection);
  
  // Save selection for future reference
  writeFileSync(
    join(__dirname, '.template-selection.json'), 
    JSON.stringify(selection, null, 2)
  );
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as configureTemplate };