# Context Menu

A Base UI context menu supporting links, checkbox and radio items, submenus, shortcuts, positioning, and keyboard opening via the Context Menu key or Shift+F10. Its data-driven KiraContextMenu runs async actions with pending states, inline errors, screen-reader announcements, and configurable close-on-success behavior.

## Install

```bash
npx shadcn add @kira-kit/context-menu
```

## Dependencies

- @base-ui/react
- cn

## Registry dependencies

- @kira-kit/dropdown-menu
- @kira-kit/use-menu-action

## Usage

```tsx
import { ContextMenu } from "@/components/ui/context-menu";
<ContextMenu> text</ContextMenu>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
