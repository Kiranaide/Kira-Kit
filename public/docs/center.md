# Center

Polymorphic centering primitive with flex, grid, and absolute modes, inline display, and safe alignment to prevent overflow clipping. KiraCenter adds constrained content widths, viewport-height offsets, configurable padding, and device safe-area support.

## Install

```bash
kira-kit add @kira-kit/center
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Usage

```tsx
import { Center } from "@/components/ui/center";
<Center> text</Center>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
