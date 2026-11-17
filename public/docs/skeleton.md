# Skeleton

Skeleton bones and text, card, list, table, avatar, image, and button presets with shimmer/wave animation, delay, pause, reduced-motion, offscreen, and document-visibility controls. KiraSkeleton supports delayed fallback display, minimum visible duration, retained content during refresh, minimum-height reservation, and live loading announcements.

## Install

```bash
npx shadcn add @kira-kit/skeleton
```

## Dependencies

- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton";
<Skeleton> text</Skeleton>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
