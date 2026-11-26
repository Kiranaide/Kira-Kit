# Button

Base UI button with extensive semantic variants, icon sizes, full-width layout, CSS press ripples, and pointer/keyboard hold-to-complete progress. Loading and expandable-icon helpers are included, and KiraButton supports optimistic asynchronous toggles backed by useOptimisticCommit.

## Install

```bash
kira-kit add @kira-kit/button
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-utils
- @kira-kit/use-optimistic-commit
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Button } from "@/components/ui/button";
<Button> text</Button>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
