# Command

A cmdk command palette with three visual variants, nested action pages, breadcrumbs, keyboard-aware selection, and a KiraCommandDialog that can bind Cmd/Ctrl+K. Async actions support cancellation, retry, and success or error status, while Escape intelligently clears search, goes back, or cancels pending work.

## Install

```bash
npx shadcn add @kira-kit/command
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cmdk
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/dialog
- @kira-kit/kbd
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Command } from "@/components/ui/command";
<Command> text</Command>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
