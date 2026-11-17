# Tabs

Base UI tabs with horizontal or vertical layouts, seven variants including sliding segment indicators, animated or lazy panels, and scrollable lists with edge-aware chevrons. KiraTabs adds addable and guarded-closable dirty tabs, hash deep links, overflow menus, and pointer/keyboard drag reordering.

## Install

```bash
npx shadcn add @kira-kit/tabs
```

## Dependencies

- @base-ui/react
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/dropdown-menu
- @kira-kit/use-announce
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Tabs } from "@/components/ui/tabs";
<Tabs> text</Tabs>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
