# Label

A form label family with required/optional markers, hints, errors, icons, tooltips, counters, truncation, and Field.Label rendering through render. KiraLabel adds live character counts, near-limit and over-limit feedback, validation states, and automatic Base UI field association.

## Install

```bash
kira-kit add @kira-kit/label
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/tooltip

## Usage

```tsx
import { Label } from "@/components/ui/label";
<Label> text</Label>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
