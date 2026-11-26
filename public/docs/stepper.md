# Stepper

Multi-step workflow with horizontal or vertical rails, six step states, conditional and optional steps, linear navigation rules, and localStorage persistence. It includes RTL-aware keyboard navigation, progress and async next controls, mobile stacking, and a data-driven KiraStepper.

## Install

```bash
kira-kit add @kira-kit/stepper
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/component-utils
- @kira-kit/use-announce
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Stepper } from "@/components/ui/stepper";
<Stepper> text</Stepper>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
