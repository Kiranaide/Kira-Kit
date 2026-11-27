# usePressBounce

Accepts an element ref and enabled flag and returns a callback that runs an interruptible GSAP press animation scaling the element to 0.95 for 75ms before rebounding. Use it from press handlers for subtle button feedback; it does nothing when disabled or when reduced motion is preferred.

## Install

```bash
kira-kit add @kira-kit/use-press-bounce
```

## Dependencies

- gsap

## Registry dependencies

- @kira-kit/use-reduced-motion

## Usage

```tsx
import { usePressBounce } from "@/hooks/use-press-bounce";
```
