# Route Transition

Route-change motion utilities: a keyed entrance with seven variants (fade, fade-up, fade-down, slide-left, slide-right, zoom, none) — movement variants ride a gentle spring curve — that replays when the transitionKey changes, and a fixed glowing 2px top navigation progress bar with a grace delay, composite-only CSS trickle, and interruptible completion. Adding the item merges its motion CSS (spring token, keyframes, view-transition tuning) into your global stylesheet. Pairs with the view-transition lib helper and the kit's native View Transitions crossfade.

## Install

```bash
kira-kit add @kira-kit/route-transition
```

## Dependencies

- class-variance-authority
- cn

## Usage

```tsx
import { RouteTransition } from "@/components/ui/route-transition";
<RouteTransition> text</RouteTransition>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
