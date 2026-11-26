# Progress

Linear, circular, and segmented progress with custom ranges, locale-aware values, indeterminate states, stripes, buffering, and animation that pauses offscreen or while the document is hidden. KiraProgress adds weighted phases, idle/running/paused/error/complete/canceled states, and pause, resume, cancel, and retry actions.

## Install

```bash
kira-kit add @kira-kit/progress
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/use-reduced-motion
- @kira-kit/use-visibility-pause

## Usage

```tsx
import { Progress } from "@/components/ui/progress";
<Progress> text</Progress>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
