# Pagination

Accessible numbered and cursor pagination with five visual variants, localized formatting, link rendering, responsive page ranges, ellipsis page-jump popovers, item ranges, and page-size controls. KiraPagination includes loading, error/retry, disabled-reason, and live status feedback, while cursor mode uses hasPreviousPage and hasNextPage without requiring a total.

## Install

```bash
kira-kit add @kira-kit/pagination
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/select
- @kira-kit/spinner
- @kira-kit/use-pagination
- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { Pagination } from "@/components/ui/pagination";
<Pagination> text</Pagination>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
