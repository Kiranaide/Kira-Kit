# Button Group

Horizontal or vertical button groups offer connected or gapped layouts, RTL-safe rounding, toolbar parts, and none, single, or multiple selection. Segmented mode measures the selected item to animate its background pill, while KiraButtonGroup adds data-driven icons, loading states, and required-selection guards.

## Install

```bash
kira-kit add @kira-kit/button-group
```

## Dependencies

- @base-ui/react
- @gsap/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/button
- @kira-kit/separator
- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { ButtonGroup } from "@/components/ui/button-group";
<ButtonGroup> text</ButtonGroup>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
