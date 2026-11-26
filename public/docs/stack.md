# Stack

Polymorphic flex layout with responsive direction, wrapping, independent row and column gaps, alignment, justification, and list-safe automatic dividers. KiraStack adds a container-width switcher layout and child-count limits.

## Install

```bash
kira-kit add @kira-kit/stack
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-utils
- @kira-kit/layout-responsive
- @kira-kit/separator

## Usage

```tsx
import { Stack } from "@/components/ui/stack";
<Stack> text</Stack>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
