# Grid

A responsive CSS Grid system with breakpoint-aware columns, rows, gaps, alignment, item spans, and placement, including auto-fit and auto-fill tracks controlled by minItemWidth. KiraGrid renders keyed collections with semantic list handling and empty content.

## Install

```bash
kira-kit add @kira-kit/grid
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-utils
- @kira-kit/layout-responsive

## Usage

```tsx
import { Grid } from "@/components/ui/grid";
<Grid> text</Grid>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
