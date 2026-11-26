# Sidebar

An application navigation shell with offcanvas/icon/none collapse modes, floating and inset variants, custom widths, persisted collapse state, hover expansion, pointer-only GSAP layout motion, and a mobile Drawer below 768px. KiraSidebar adds searchable data-driven sections, router-agnostic navigation via SidebarRouterProvider, badges, favorites with drag or arrow-button reordering, user controls, and loading, error, and empty states.

## Install

```bash
kira-kit add @kira-kit/sidebar
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/avatar
- @kira-kit/collapsible
- @kira-kit/component-utils
- @kira-kit/drawer
- @kira-kit/dropdown-menu
- @kira-kit/skeleton
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Sidebar } from "@/components/ui/sidebar";
<Sidebar> text</Sidebar>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
