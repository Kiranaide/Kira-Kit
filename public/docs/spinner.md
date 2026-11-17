# Spinner

SVG loading indicator with six sizes and semantic colors, supporting indeterminate rotation, clamped determinate progress arcs, and success/error glyph states. It pauses in hidden documents, honors reduced motion, and KiraProgressSpinner adds a label with an optional percentage readout.

## Install

```bash
npx shadcn add @kira-kit/spinner
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Spinner } from "@/components/ui/spinner";
<Spinner> text</Spinner>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
