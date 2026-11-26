# Checkbox

Base UI checkbox supports indeterminate state, multiple sizes, variants and colors, loading and error states, custom icons, and reduced-motion-aware GSAP feedback. Labeled, card, and group compositions add select-all progress, disabled-reason tooltips, and optimistic asynchronous card commits that revert on failure.

## Install

```bash
kira-kit add @kira-kit/checkbox
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-utils
- @kira-kit/tooltip
- @kira-kit/use-optimistic-commit
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox";
<Checkbox> text</Checkbox>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
