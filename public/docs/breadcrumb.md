# Breadcrumb

Accessible breadcrumb with configurable separators, link variants, middle truncation, collapsible ellipsis menus, and responsive mobile navigation. Hooks derive items from paths or router matches, while KiraBreadcrumb adds scrollable overflow, JSON-LD structured data, trailing actions, and current-path copying.

## Install

```bash
kira-kit add @kira-kit/breadcrumb
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-utils
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb";
<Breadcrumb> text</Breadcrumb>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
