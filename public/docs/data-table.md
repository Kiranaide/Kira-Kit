# Data Table

A TanStack Table data grid with sorting, filtering, pagination, grouping, expansion, selection, pinning, resizing, editable cells, and faceted or range filters. It also supports measured-row virtualization, APG-style keyboard navigation, dnd-kit row reordering, infinite loading, and versioned localStorage persistence of table state.

## Install

```bash
kira-kit add @kira-kit/data-table
```

## Dependencies

- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- @tabler/icons-react
- @tanstack/react-store
- @tanstack/react-table
- @tanstack/react-virtual
- cn

## Registry dependencies

- @kira-kit/avatar
- @kira-kit/badge
- @kira-kit/button
- @kira-kit/checkbox
- @kira-kit/component-utils
- @kira-kit/dropdown-menu
- @kira-kit/input
- @kira-kit/pagination
- @kira-kit/popover
- @kira-kit/table
- @kira-kit/tooltip

## Usage

```tsx
import { DataTable } from "@/components/ui/data-table";
<DataTable> text</DataTable>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
