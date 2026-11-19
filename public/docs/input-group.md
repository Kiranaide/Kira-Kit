# Input Group

A compound control container that joins inputs or textareas with text, compact buttons, and addons aligned at inline or block start and end. Shared focus, invalid, and disabled styling surrounds the group, while clicking noninteractive addon space focuses its associated control.

## Install

```bash
kira-kit add @kira-kit/input-group
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/component-defaults
- @kira-kit/textarea

## Usage

```tsx
import { InputGroup } from "@/components/ui/input-group";
<InputGroup> text</InputGroup>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
