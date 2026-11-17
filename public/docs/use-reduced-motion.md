# useReducedMotion

Returns a live boolean for the user's prefers-reduced-motion: reduce media query and updates when the operating-system setting changes. Use it to gate JavaScript-driven animation, smooth scrolling, and timers; it returns false during SSR and hydration, with prefersReducedMotion also available for non-React reads.

## Install

```bash
npx shadcn add @kira-kit/use-reduced-motion
```

## Usage

```tsx
import { useReducedMotion } from "@/hooks/use-reduced-motion";

```
