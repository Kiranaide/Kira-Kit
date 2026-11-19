# Stats Card

Composable metric card with visual and status variants, locale-aware value formatting, GSAP count-up numbers, trend indicators, meters, and Recharts sparklines. Interactive cards support keyboard activation and an optional details drawer, with reduced-motion handling and loading skeletons.

## Install

```bash
kira-kit add @kira-kit/stats-card
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap
- recharts

## Registry dependencies

- @kira-kit/component-defaults
- @kira-kit/drawer
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { StatsCard } from "@/components/ui/stats-card";
<StatsCard> text</StatsCard>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
