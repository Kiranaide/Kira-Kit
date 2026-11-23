# Dialog

A Base UI modal composition with five content sizes, an optional close button, and reduced-motion-aware scale and opacity transitions. Non-modal dialogs disable pointer dismissal by default, while scrollable content keeps the header and footer visible around an independently scrolling body.

## Install

```bash
kira-kit add @kira-kit/dialog
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Usage

```tsx
import { Dialog } from "@/components/ui/dialog";
<Dialog> text</Dialog>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
ive layer. Animations are gated by `useReducedMotion`.
