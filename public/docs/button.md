# Button

Base UI button with extensive semantic variants, icon sizes, full-width layout, press ripples, and pointer/keyboard hold-to-complete progress. Loading, tooltip, and expandable-icon helpers are included, and KiraButton supports optimistic asynchronous toggles with an error toast on rejection.

## Install

```bash
kira-kit add @kira-kit/button
```

## Dependencies

- @base-ui/react
- @gsap/react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/toast
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { Button } from "@/components/ui/button";
<Button> text</Button>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
