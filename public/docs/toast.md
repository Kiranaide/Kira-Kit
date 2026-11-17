# Toast

Base UI toast system with an imperative API for six variants, stable-ID updates and deduplication, actions, promise transitions, variant-specific timeouts, and optional anchoring to an element. Stacked toasts expand, swipe away in four directions, and show a pausing countdown bar, with separate managers for stacked and anchored notifications.

## Install

```bash
npx shadcn add @kira-kit/toast
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Usage

```tsx
import { Toast } from "@/components/ui/toast";
<Toast> text</Toast>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
