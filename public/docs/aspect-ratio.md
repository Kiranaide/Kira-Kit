# Aspect Ratio

Media frame with ratio presets, object-fit and object-position controls, responsive breakpoint ratios, loading skeletons, and focal-point hover zoom. It includes image, video, and iframe helpers, with KiraAspectRatio adding fallback/retry states and explicit click-to-load embeds.

## Install

```bash
npx shadcn add @kira-kit/aspect-ratio
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/skeleton
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio";
<AspectRatio> text</AspectRatio>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
