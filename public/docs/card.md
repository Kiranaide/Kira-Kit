# Card

Compound card with header, title, description, action, content, footer, and skeleton slots. Its ten surface variants include interactive lift, glass, gradient, outline, and elevated styles, alongside compact sizing and a container-aware header grid.

## Install

```bash
kira-kit add @kira-kit/card
```

## Dependencies

- class-variance-authority
- cn

## Usage

```tsx
import { Card } from "@/components/ui/card";
<Card> text</Card>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
