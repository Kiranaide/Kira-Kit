# Separator

Horizontal or vertical separators with six thicknesses, solid/dashed/dotted/gradient styles, semantic colors, labels, icons, alignment, spacing, and insets. KiraSeparator can show counts and descriptions, run a pending-aware action, or control a collapsible section with keepMounted and motion options.

## Install

```bash
kira-kit add @kira-kit/separator
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/collapsible
- @kira-kit/component-utils
- @kira-kit/spinner

## Usage

```tsx
import { Separator } from "@/components/ui/separator";
<Separator> text</Separator>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
