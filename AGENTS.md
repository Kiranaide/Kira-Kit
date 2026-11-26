# Kira Kit V2 - LLM Agent Context

> Enterprise UI Kit built on Base UI primitives, distributed as a source registry.

**Package Manager:** `bun`

## Commands

```bash
bun install && bun run dev    # Development
bun run check                 # oxlint && tsc -b && prettier --check .
bun run check:pages           # CLI quality checks on src/pages/components
bun run format                # prettier --write .
bun run build                 # Production (registry:build, check, vite build)
```

The registry itself is built by the CLI: `bun run registry:build` runs `kira-kit build`
(checks → preset themes → native validate/build → docs). The CLI lives in
`packages/cli` (Node 22+ ESM, own node_modules); run its tests with
`cd packages/cli && bun run test`.

## Imports

```tsx
// Use @ alias for src/
import { cn } from "cn"; // the `cn` package — never clsx/tailwind-merge or @/lib/utils in components
import { Button } from "@/components/ui/button";

// Order: React → External → @/ → ./
```

## Component Template

```tsx
import { ComponentPrimitive } from "@base-ui/react/component";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const variants = cva("base-classes", {
  variants: {
    variant: { default: "", secondary: "" },
    size: { default: "", sm: "", lg: "" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export function Component({
  className,
  variant,
  size,
  ...props
}: ComponentProps) {
  return (
    <ComponentPrimitive
      data-slot="component"
      className={cn(variants({ variant, size, className }))}
      {...props}
    />
  );
}

export { variants };
```

## Constraints

- Use `@base-ui/react` primitives (NOT Radix)
- Import `cn` from the `cn` package (NOT clsx/tailwind-merge/@/lib/utils in components)
- Use `tw-animate-css` or `gsap` for animations (NOT Framer Motion)
- Use `data-slot` on root elements
- Use `bun` runtime for this repo (NOT npm/yarn); the published CLI targets Node 22+
- Export both component and variants

## Tech Stack

| Package                    | Purpose        |
| -------------------------- | -------------- |
| `react`                    | React 19.2+    |
| `@base-ui/react`           | Primitives     |
| `tailwindcss` v4           | CSS            |
| `@tanstack/react-form`     | Forms          |
| `@tanstack/react-table`    | Tables         |
| `@tanstack/react-virtual`  | Virtualization |
| `@tanstack/react-router`   | Routing        |
| `@tabler/icons-react`      | Icons          |
| `zod`                      | Validation     |
| `cn`                       | Class merging  |
| `class-variance-authority` | Variants       |
| `tw-animate-css`           | Animations     |
| `gsap` or `@gsap/react`    | Animations     |

## Demo Pages (`src/pages/components/<name>.tsx`)

Reference exemplar: `src/pages/components/accordion.tsx`.

### When to Update

Sync `src/pages/components/<name>.tsx` on **any user-visible change** to `src/components/ui/<name>.tsx` — public API, props, variants, behavior, visuals, accessibility, or bug fixes. Internal-only refactors with no user-visible effect do not require demo edits.

### Sync Checklist

`ComponentPage` enforces the canonical reading order automatically (`PageHeader` + `DemoTabs`, extra sections, `FeatureGrid`, `KeyboardShortcuts`, `UsageBlock`, `APIReference`, `Changelog`). Keep all 7 sections aligned with the component:

1. **`PageHeader`** — Update `description` if scope changed; bump `version="vX.Y.Z"` so it **always equals** `Changelog` `entries[0].version`.
2. **`FeatureGrid`** — Keep feature highlights accurate (icons auto-resolve from title keywords when `icon` is omitted).
3. **`DemoTabs` + `DemoWrapper`** —
   - Add or update a tab for every new or changed feature, prop, or variant.
   - Group tabs via `group` (e.g., `"Core"`, `"Kira<Name>"`, `"Behavior"`) whenever a page has **6 or more tabs**.
   - Maintain a **`Stress Cases`** tab verifying long labels/titles, empty content/values, disabled states, and narrow (`max-w-xs`) containers.
   - Each `DemoWrapper` `code` string must reflect the real props and APIs shown in its live demo (boilerplate and long copy may be trimmed, but imports, prop names, and prop values must be accurate).
4. **`KeyboardShortcuts`** — Keep bindings, optional `group` headers, and descriptions true to actual runtime behavior. Note what Base UI provides vs. Kira additions; remove or update bindings when behavior changes.
5. **`UsageBlock`** — Update `usageCode` and optional `notes` (`{ label, body }`) to match current exports, variants, and recommended entry points (e.g., when to use `Kira<Name>`).
6. **`APIReference`** — Document every exported component/part with exact `prop`, `type`, `default`, and `description` rows matching the exported TypeScript types — no dead or undocumented props.
7. **`Changelog`** — Prepend a new release entry (newest first) using `"DD Month YYYY"` dates and change types `"added" | "changed" | "fixed" | "deprecated" | "removed" | "breaking"`.

### Versioning & Root Changelog

- Use per-component semver on the demo page:
  - **patch** (`x.y.Z`): bug fixes, accessibility fixes, visual/spacing tweaks.
  - **minor** (`x.Y.0`): new props, variants, or non-breaking features.
  - **major** (`X.0.0`): breaking changes.
- `PageHeader` `version="vX.Y.Z"` and `Changelog` `entries[0].version` (`"X.Y.Z"`) must **never drift**.
- Update root `CHANGELOG.md` and `src/pages/docs/changelog.tsx` for cross-cutting/CLI changes **and any breaking change** (even if scoped to one component). Non-breaking single-component changes stay on the component's own demo page.

### Demo Page Skeleton Template

```tsx
import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  Component,
  ComponentPart,
  KiraComponent,
} from "@/components/ui/component";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  return <Component>...</Component>;
}

const basicCode = `import { Component } from "@/components/ui/component"

export function BasicDemo() {
  return <Component>...</Component>
}`;

function StressDemo() {
  return (
    <div className="max-w-xs">
      <KiraComponent items={stressItems} />
    </div>
  );
}

const stressCode = `import { KiraComponent } from "@/components/ui/component"

// Long labels, empty content, and disabled states inside a narrow container
<div className="max-w-xs">
  <KiraComponent items={items} />
</div>`;

const usageCode = `import { Component, ComponentPart } from "@/components/ui/component"

<Component>
  <ComponentPart>...</ComponentPart>
</Component>`;

export default function ComponentDemoPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Component"
        description="One-sentence summary of what the component does."
        version="v1.0.0"
      />

      <FeatureGrid
        features={componentPageFeatures}
        description="Capabilities built into Kira Kit."
      />

      <DemoTabs defaultValue="basic" tabs={componentPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={componentPageShortcuts}
        description="Keyboard navigation and activation bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import the primitives and compose parts."
        notes={[
          {
            label: "KiraComponent",
            body: "Use the data-driven wrapper for common configurations.",
          },
        ]}
      />

      <APIReference
        sections={componentPageAPISections}
        description="Props, types, and defaults for each exported part."
      />

      <Changelog
        entries={componentPageChangelogEntries}
        title="Changelog"
        description="Version history for this component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const stressItems = [
  // ...
] satisfies ReactComponentProps<typeof KiraComponent>["items"];

const componentPageFeatures = [
  { title: "Accessible", description: "..." },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const componentPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core", // Required when a page has 6+ tabs
    demo: (
      <DemoWrapper
        title="Basic Component"
        description="Default usage."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, empty values, and disabled states in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const componentPageShortcuts = [
  { keys: "Tab", description: "Move focus to the next control." },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const componentPageAPISections = [
  {
    title: "Component",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const componentPageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Initial release",
        description: "Summary of what shipped.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
```

### Demo Page Lint & Check Guardrails

Demo pages are linted by `oxlint` (strict + anti-slop presets) and checked by `bun run check:pages`:

- **Default export only**: export only `export default function <Name>Page()`; keep all helper demo components and constants unexported.
- **Function size & complexity**: `eslint/max-lines-per-function` ≤ **80 lines** (excluding blank lines and comments), `eslint/complexity` ≤ 10, `eslint/max-depth` ≤ 3. Split large demos into small helper sub-components and hoist static metadata arrays to the bottom of the file.
- **Strict typing & anti-slop**:
  - Type hoisted arrays with `satisfies ReactComponentProps<typeof ...>` — avoid `as` assertions (`typescript/no-unsafe-type-assertion`, `anti-slop/require-safety-comment-for-type-assertion`, `anti-slop/no-chained-type-assertions`, `anti-slop/no-widen-then-assert`).
  - No `any` (`typescript/no-explicit-any`), no array-index React keys (`react/no-array-index-key`), no nested/unneeded ternaries (`eslint/no-nested-ternary`, `eslint/no-unneeded-ternary`), no negated `if/else` conditions (`eslint/no-negated-condition`).
  - Satisfy `typescript/strict-boolean-expressions`, `unicorn/consistent-function-scoping`, `anti-slop/no-array-filter-map`, `kira/no-low-value-comments`, and `kira/require-suppression-reason` (any lint suppression must end with `-- <reason>`).
- **CLI page checks (`bun run check:pages`)**:
  - Use semantic theme tokens, not raw palette/hex colors (`raw-colors`).
  - Avoid arbitrary Tailwind spacing/values outside the scale (`arbitrary-values`, `spacing-scale`).
  - Gate animations on reduced motion (`reduced-motion`), avoid dead `animate-*` classes (`dead-animate`), avoid transitioning layout properties (`layout-transitions`), preserve accessible target sizes (`target-size`), import `cn` from `"cn"` (`cn-source`), and use `@base-ui/react` primitives only (`base-ui-only`).

### Wiring a Brand-New Component Demo Page

When adding a new component demo page (not just editing an existing one):

1. Create `src/pages/components/<name>.tsx` following the skeleton above (kebab-case filename).
2. Register a lazy route under `appRoute` in `src/router.tsx` (`path: "/components/<name>"`).
3. Add a sidebar link under the appropriate group in `src/components/app-layout.tsx`.

### Verification

After editing a component and its demo page, run:

```bash
bun run check && bun run check:pages
```

Run `bun run build` as well whenever component imports, registry metadata, or CSS tokens changed.
