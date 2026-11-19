# Alert

Semantic alert with solid, soft, and outlined tones, banner layout, automatic icons, action buttons, and reduced-motion-aware GSAP dismissal. KiraAlert adds expandable content, copy-to-clipboard, relative timestamps, and a hover/focus-pausing undo-dismiss timer.

## Install

```bash
kira-kit add @kira-kit/alert
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/button
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Alert } from "@/components/ui/alert";
<Alert> text</Alert>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
