# Input

A Base UI text input with five sizes, prefix and suffix content, clear and clipboard actions, and an announced character counter. The module also provides scrub-enabled numeric and formatted decimal inputs, debounced search, password strength feedback, and separator-driven tag entry.

## Install

```bash
kira-kit add @kira-kit/input
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Input } from "@/components/ui/input";
<Input> text</Input>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
