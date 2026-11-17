# Drawer

A swipe-enabled Base UI drawer that opens from any side with size variants, scrollable content, and overlay opacity tied to swipe progress. Bottom drawers exclusively expose snap-point controls, and DrawerHandle provides a keyboard-operable expand/collapse button rather than only a decorative grip.

## Install

```bash
npx shadcn add @kira-kit/drawer
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Usage

```tsx
import { Drawer } from "@/components/ui/drawer";
<Drawer> text</Drawer>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
