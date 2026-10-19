import { defineConfig } from "oxlint";
import base from "./tools/oxlint/presets/base.ts";
import react from "./tools/oxlint/presets/react.ts";
import sonar from "./tools/oxlint/presets/sonar.ts";
import antiSlop from "./tools/oxlint/presets/anti-slop.ts";
import strict from "./tools/oxlint/presets/strict.ts";

export default defineConfig({
  ignorePatterns: [
    ".agent/**",
    ".agents/**",
    ".claude/**",
    ".codex/**",
    ".continue/**",
    ".cursor/**",
    ".gemini/**",
    ".opencode/**",
    ".pi/**",
    ".roo/**",
    ".windsurf/**",
    "tools/oxlint/anti-slop/**",
  ],
  extends: [base, react, sonar, antiSlop, strict],

  plugins: ["typescript", "unicorn", "oxc", "react", "jsx-a11y"],

  jsPlugins: [
    {
      name: "anti-slop",
      specifier: "./tools/oxlint/anti-slop/index.ts",
    },
  ],

  rules: {
    // ============================================================
    // CORRECTNESS
    // ============================================================

    "no-unused-vars": "error",
    "no-unreachable": "error",

    // React Hooks and Vite Fast Refresh checks.
    "react/exhaustive-deps": "warn",
    "react/only-export-components": [
      "error",
      {
        allowConstantExport: true,
      },
    ],
    "react/rules-of-hooks": "error",

    // ============================================================
    // TYPESCRIPT SAFETY
    // ============================================================

    "typescript/no-explicit-any": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-argument": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
    "typescript/no-unsafe-type-assertion": "error",

    // ============================================================
    // TYPE-AWARE CLEANUP
    // ============================================================

    "typescript/no-unnecessary-condition": "error",
    "typescript/no-unnecessary-type-conversion": "error",
    "typescript/no-unnecessary-type-parameters": "error",
    "typescript/no-useless-default-assignment": "error",

    "typescript/prefer-find": "error",
    "typescript/prefer-nullish-coalescing": "error",
    "typescript/prefer-optional-chain": "error",
    "typescript/prefer-readonly": "warn",
    "typescript/prefer-string-starts-ends-with": "error",

    // ============================================================
    // ANTI-SLOP
    // ============================================================

    "anti-slop/no-array-filter-map": "error",
    "anti-slop/no-reduce-accumulator-copy": "error",
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-known-value-widening": "error",
    "anti-slop/no-module-mocking": "error",
    "anti-slop/no-object-parameters": "error",
    "anti-slop/no-reflect-apply": "error",
    "anti-slop/no-reflect-get": "error",
    "anti-slop/no-runtime-typeof": "error",
    "anti-slop/no-shape-in-symbol-names": "error",
    "anti-slop/no-unknown-parameters": "error",
    "anti-slop/no-unknown-returns": "error",
    "anti-slop/no-unknown-type-aliases": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/require-readable-spacing": "error",
    "anti-slop/require-safety-comment-for-type-assertion": "error",

    // ============================================================
    // OXC PERFORMANCE
    // ============================================================

    "oxc/no-accumulating-spread": "error",

    // ============================================================
    // TERNARY / CONTROL FLOW
    // ============================================================

    "no-ternary": "error",
    "no-nested-ternary": "error",
    "no-unneeded-ternary": "error",
    "no-negated-condition": "error",

    // ============================================================
    // PERFORMANCE
    // ============================================================

    "no-useless-call": "error",

    "unicorn/prefer-array-find": "error",
    "unicorn/prefer-array-flat-map": "error",
    "unicorn/prefer-set-has": "warn",
    "unicorn/consistent-function-scoping": "warn",

    // ============================================================
    // COMPLEXITY
    // ============================================================

    complexity: [
      "error",
      {
        max: 10,
      },
    ],

    "max-depth": [
      "error",
      {
        max: 3,
      },
    ],

    "max-lines-per-function": [
      "warn",
      {
        max: 80,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    // ============================================================
    // READABILITY
    // ============================================================

    "unicorn/no-unreadable-array-destructuring": "error",
    "unicorn/no-unreadable-iife": "error",
    "unicorn/numeric-separators-style": "error",

    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
      },
    ],
  },
});
