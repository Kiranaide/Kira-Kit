# Input

A Base UI text input with four sizes, prefix and suffix content, clear and clipboard actions, and an announced character counter. The module also provides scrub-enabled numeric and formatted decimal inputs, debounced search, OTP fields, half-star ratings, password strength feedback, and separator-driven tag entry.

## Install

```bash
npx shadcn add @kira-kit/input
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/field
- @kira-kit/select
- @kira-kit/toast
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Input } from "@/components/ui/input";
<Input> text</Input>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
