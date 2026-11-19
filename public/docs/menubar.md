# Menu Bar

A Base UI menubar with horizontal or vertical orientation, default/outline/soft variants, comfortable or compact density, and dropdown-menu primitives for checkbox items, radio items, submenus, shortcuts, filtering, and input. KiraMenubar builds menus from data and can aggregate enabled actions and links into a searchable Ctrl/Cmd+K command menu.

## Install

```bash
kira-kit add @kira-kit/menubar
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/dropdown-menu
- @kira-kit/use-platform

## Usage

```tsx
import { Menubar } from "@/components/ui/menubar";
<Menubar> text</Menubar>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
