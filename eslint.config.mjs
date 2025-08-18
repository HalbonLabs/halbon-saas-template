import js from "@eslint/js";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
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
      "eslint.config.*",
      ".storybook/**",
      "analyze/**",
      "playwright-report/**",
      "test-results/**"
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
      "no-undef": "off",
      "no-unused-vars": "off",
      ...nextPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/react-in-jsx-scope": "off",
      // Size & complexity rules for pro dev standards
      "max-lines": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 60, skipBlankLines: true }],
      "complexity": ["warn", 12],
      "max-depth": ["warn", 4]
    }
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}", "vitest.config.ts"],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.node,
        ...globals.browser,
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
  },
  {
    files: ["**/*.stories.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.browser
      }
    }
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.browser
      }
    }
  }
];
