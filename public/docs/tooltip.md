# Tooltip

Base UI tooltip family with five color variants, three sizes, configurable delays and collision-aware positioning, arrows, maximum widths, and visual keyboard-shortcut keycaps. SharedTooltip reuses one animated popup across handle-based triggers, while SimpleTooltip wraps a single trigger without adding a wrapper element.

## Install

```bash
kira-kit add @kira-kit/tooltip
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Usage

```tsx
import { Tooltip } from "@/components/ui/tooltip";
<Tooltip> text</Tooltip>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
