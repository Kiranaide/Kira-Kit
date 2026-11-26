# Rating

Accessible star rating control with hover preview, half-star increments, clear-on-reclick, keyboard arrow/Home/End navigation, custom icons and colors, and a read-only RatingDisplay helper with fraction and review-count labels.

## Install

```bash
kira-kit add @kira-kit/rating
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Usage

```tsx
import { Rating } from "@/components/ui/rating";
<Rating> text</Rating>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
