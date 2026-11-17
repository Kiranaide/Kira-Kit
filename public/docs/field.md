# Field

A form-field system with vertical, horizontal, and container-responsive orientations, shared control state, descriptions, validation icons, character counts, and focusable error summaries. It integrates TanStack Form and Zod, including debounced async validation, and KiraField can compose either a standard input or a custom registered control.

## Install

```bash
npx shadcn add @kira-kit/field
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- @tanstack/react-form
- class-variance-authority
- cn
- zod

## Registry dependencies

- @kira-kit/input
- @kira-kit/separator
- @kira-kit/textarea

## Usage

```tsx
import { Field } from "@/components/ui/field";
<Field> text</Field>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
