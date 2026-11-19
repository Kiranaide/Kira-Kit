# Kira Kit V2 - LLM Agent Context

> Enterprise UI Kit built on Base UI primitives, distributed as a source registry.

**Package Manager:** `bun`

## Commands

```bash
bun install && bun run dev    # Development
bun run build                 # Production (includes tsc, vite build, registry:build)
bun run lint && tsc -b        # Full check
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
