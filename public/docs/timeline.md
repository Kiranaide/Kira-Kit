# Timeline

Chronological event list with vertical or horizontal rails, alternating or centered layouts, status dots, solid/dashed/gradient connectors, and collapsible details. It supports locale/time-zone grouping, relative timestamps, optional virtualization, and a KiraTimeline wrapper with skeletons and cancellable, retryable older-event loading.

## Install

```bash
kira-kit add @kira-kit/timeline
```

## Dependencies

- @tabler/icons-react
- @tanstack/react-virtual
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/avatar
- @kira-kit/button
- @kira-kit/collapsible
- @kira-kit/component-defaults
- @kira-kit/component-prop-guards
- @kira-kit/skeleton
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Timeline } from "@/components/ui/timeline";
<Timeline> text</Timeline>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
