# Textarea

Auto-sizing native textarea with size and resize variants plus minRows and maxRows height limits. Counter variants add warning thresholds, optional hard limits, and debounced announcements, while KiraTextarea provides inline validation, clearing, and Enter or Ctrl/Cmd+Enter submission.

## Install

```bash
kira-kit add @kira-kit/textarea
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Textarea } from "@/components/ui/textarea";
<Textarea> text</Textarea>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
