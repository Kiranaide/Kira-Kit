# Kira Kit V2 - LLM Agent Context

> Enterprise UI Kit built on Base UI and shadcn patterns.

**Package Manager:** `bun`

## Commands

```bash
bun install && bun run dev    # Development
bun run build                 # Production (includes tsc, vite build, registry:build)
bun run lint && tsc -b        # Full check
```

## Imports

```tsx
// Use @ alias for src/
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Order: React → External → @/ → ./
```

## Component Template

```tsx
import { ComponentPrimitive } from "@base-ui/react/component"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const variants = cva("base-classes", {
  variants: {
    variant: { default: "", secondary: "" },
    size: { default: "", sm: "", lg: "" },
  },
  defaultVariants: { variant: "default", size: "default" },
})

export function Component({ className, variant, size, ...props }: ComponentProps) {
  return <ComponentPrimitive data-slot="component" className={cn(variants({ variant, size, className }))} {...props} />
}

export { variants }
```

## Constraints

- Use `@base-ui/react` primitives (NOT Radix)
- Use `tailwind-animate` or `gsap` for animations (NOT Framer Motion)
- Use `data-slot` on root elements
- Use `bun` runtime (NOT npm/yarn)
- Export both component and variants

## Tech Stack

| Package | Purpose |
|---------|---------|
| `react` | React 18.3 |
| `@base-ui/react` | Primitives |
| `tailwindcss` v4 | CSS |
| `@tanstack/react-form` | Forms |
| `@tanstack/react-table` | Tables |
| `@tanstack/react-virtual` | Virtualization |
| `@tanstack/react-router` | Routing |
| `@tabler/icons-react` | Icons |
| `zod` | Validation |
| `class-variance-authority` | Variants |
| `tailwind-animate` | Animations |
| `gsap` or `@gsap/react` | Animations |
