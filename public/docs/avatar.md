# Avatar

Avatar supports sizes from xs through 4xl, multiple shapes, semantic rings, positioned status dots, corner badges, initials, and blur-up fallbacks. Group and stack variants add overflow popovers, tooltips, horizontal scrolling, and add-member actions.

## Install

```bash
kira-kit add @kira-kit/avatar
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-defaults
- @kira-kit/component-prop-guards
- @kira-kit/popover
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Avatar } from "@/components/ui/avatar";
<Avatar> text</Avatar>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
