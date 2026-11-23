# Navigation Menu

Website navigation with native links, shared popup/viewport composition, active-link underlines, direction-aware transitions, and mega-menu section, header, and footer helpers. KiraNavigationMenu accepts recursive grouped data and custom router links, switching at 768px to a right-side mobile Drawer with collapsible groups unless mobileMode="inline" is used.

## Install

```bash
kira-kit add @kira-kit/navigation-menu
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/drawer
- @kira-kit/component-utils

## Usage

```tsx
import { NavigationMenu } from "@/components/ui/navigation-menu";
<NavigationMenu> text</NavigationMenu>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
