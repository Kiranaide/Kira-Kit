# Box

Polymorphic layout primitive for semantic HTML tags with responsive background, color, sizing, spacing, and border props. CVA variants add rounding, shadows, display modes, and positioning using safelisted runtime-generated utilities.

## Install

```bash
npx shadcn add @kira-kit/box
```

## Dependencies

- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/flex

## Usage

```tsx
import { Box } from "@/components/ui/box";
<Box> text</Box>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
