# Accordion

Compound disclosure component whose data-driven KiraAccordion supports recursive nested items, searchable match highlighting, keyboard and pointer drag reordering, persistence, and URL hash deep links. Items can lazy-mount panels and provide loading skeletons, retryable errors, disabled-reason tooltips, asynchronous open handlers, and expand/collapse-all controls.

## Install

```bash
kira-kit add @kira-kit/accordion
```

## Dependencies

- @base-ui/react
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-defaults
- @kira-kit/component-prop-guards
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Accordion } from "@/components/ui/accordion";
<Accordion> text</Accordion>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
