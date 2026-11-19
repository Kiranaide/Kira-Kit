# Alert Dialog

Base UI confirmation dialog with a configurable backdrop, content sizes, semantic media and lists, and a full-screen scrollable body. It supports type-to-confirm gates, delayed countdowns, Cmd/Ctrl+Enter, asynchronous confirmation states, and guarded closing while pending or locked.

## Install

```bash
kira-kit add @kira-kit/alert-dialog
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/component-defaults
- @kira-kit/component-item-keys
- @kira-kit/component-prop-guards
- @kira-kit/dialog
- @kira-kit/input

## Usage

```tsx
import { AlertDialog } from "@/components/ui/alert-dialog";
<AlertDialog> text</AlertDialog>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
