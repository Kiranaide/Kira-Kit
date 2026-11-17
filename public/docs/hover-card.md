# Hover Card

A Base UI PreviewCard wrapper with five content sizes, default or blurred surfaces, configurable positioning, arrows, and typed detached handles for payload-driven triggers. Optional viewport transitions crossfade changing content, and companion parts cover headers, footers, loading states, and aspect-ratio-controlled images.

## Install

```bash
npx shadcn add @kira-kit/hover-card
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Usage

```tsx
import { HoverCard } from "@/components/ui/hover-card";
<HoverCard> text</HoverCard>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
