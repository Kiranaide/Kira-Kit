import { defineConfig } from "oxlint";
import base from "./tools/oxlint/presets/base.ts";
import react from "./tools/oxlint/presets/react.ts";
import sonar from "./tools/oxlint/presets/sonar.ts";
import antiSlop from "./tools/oxlint/presets/anti-slop.ts";
import strict from "./tools/oxlint/presets/strict.ts";

export default defineConfig({
  ignorePatterns: [
    "install-lint.mjs",
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
});
