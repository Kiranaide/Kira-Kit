# Dropdown Menu

A Base UI menu supporting actions, links, checkboxes, radios, searchable submenus, filtering, and detached typed-payload popups shared by multiple triggers. Async items provide pending and retry states with live announcements, while a dedicated viewport animates detached popup size and content changes.

## Install

```bash
kira-kit add @kira-kit/dropdown-menu
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/use-menu-action
- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { DropdownMenu } from "@/components/ui/dropdown-menu";
<DropdownMenu> text</DropdownMenu>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
