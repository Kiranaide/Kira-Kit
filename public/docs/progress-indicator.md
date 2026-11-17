# Progress Indicator

A step-based indicator with horizontal, vertical, and responsive layouts, clickable steps, optional steps, semantic tones, and pending/active/completed/error/paused/skipped states. KiraProgressIndicator adds milestone summaries, finished counts, current-phase linear progress, live status, and retry for failed steps.

## Install

```bash
npx shadcn add @kira-kit/progress-indicator
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/progress
- @kira-kit/spinner
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { ProgressIndicator } from "@/components/ui/progress-indicator";
<ProgressIndicator> text</ProgressIndicator>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
