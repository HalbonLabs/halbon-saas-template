// ESLint flat config (ESM) for ESLint v9+ with Next.js + TypeScript
import js from "@eslint/js";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
// Avoid importing eslint-config-next directly to prevent @rushstack patch issues.
// We approximate Next rules via JS recommended + a few React settings.
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "coverage/**",
      "**/*.d.ts",
      "**/*.generated.*",
      "pnpm-lock.yaml",
      "eslint.config.*"
    ]
  },
  {
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.node,
        ...globals.browser
      }
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.es2024,
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: {
  "@typescript-eslint": tseslint,
  "@next/next": nextPlugin
    },
    rules: {
      // Rely on TypeScript for undefined vars; disable base rule
      "no-undef": "off",
      // Use the TS variant of no-unused-vars
      "no-unused-vars": "off",
  // Include a subset of Next recommended rules
  ...nextPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/react-in-jsx-scope": "off"
    }
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}", "vitest.config.ts"],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.node,
        ...globals.browser,
        // Vitest globals
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        test: "readonly",
        vi: "readonly",
        vitest: "readonly"
      }
    }
  }
];
