# Table

Semantic table primitives with three densities, striping, sticky headers, RTL-aware pinned cells, sortable headers, selection, skeletons, and empty states. KiraTable combines typed columns and multi-type sorting with row selection, persisted density preferences, and screen-reader sort announcements.

## Install

```bash
kira-kit add @kira-kit/table
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/checkbox
- @kira-kit/component-defaults
- @kira-kit/component-prop-guards

## Usage

```tsx
import { Table } from "@/components/ui/table";
<Table> text</Table>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
