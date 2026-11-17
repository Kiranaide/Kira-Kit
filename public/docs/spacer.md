# Spacer

Responsive horizontal or vertical whitespace with spacing-token sizes, an auto flex-fill mode, and decorative semantics enforced through aria-hidden, presentation role, and inert. KiraSpacer adds clamp-based fluid gaps with safe-area insets and a reserve mode that preserves height while showing accessible loading placeholders.

## Install

```bash
npx shadcn add @kira-kit/spacer
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/skeleton

## Usage

```tsx
import { Spacer } from "@/components/ui/spacer";
<Spacer> text</Spacer>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
