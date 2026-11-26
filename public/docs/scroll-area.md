# Scroll Area

Vertical, horizontal, or dual scrolling with three scrollbar thicknesses, always-visible or revealed bars, overflow shadows, and composable viewport, content, thumb, and corner primitives. KiraScrollArea's followOutput mode tracks streaming content only while the reader stays at the latest output, reports unseen activity, and offers Jump to latest.

## Install

```bash
kira-kit add @kira-kit/scroll-area
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/component-utils
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";
<ScrollArea> text</ScrollArea>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
