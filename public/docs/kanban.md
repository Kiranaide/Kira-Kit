# Kanban

A sortable Kanban board with controlled or uncontrolled columns, mouse/touch/keyboard dragging, collapsible columns, and wipMode "warn" | "enforce" limits. Cards support priorities, covers, tags, due dates, checklists, comments, attachments, assignees, and blocked reasons, with an accessible Move card dialog and KiraKanban search, loading, error, and retry states.

## Install

```bash
kira-kit add @kira-kit/kanban
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

- @kira-kit/avatar
- @kira-kit/button
- @kira-kit/component-defaults
- @kira-kit/component-item-keys
- @kira-kit/component-native-props
- @kira-kit/component-prop-guards
- @kira-kit/dialog
- @kira-kit/input
- @kira-kit/select
- @kira-kit/skeleton
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Kanban } from "@/components/ui/kanban";
<Kanban> text</Kanban>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
