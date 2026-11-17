# Switch

Base UI toggle with three sizes, semantic colors, labels and validation, custom thumb icons, loading states, and enlarged hit targets. Controlled optimistic commits can await persistence and revert failures with a toast, while disabled reasons use a focusable tooltip and SwitchGroup shares disabled state.

## Install

```bash
npx shadcn add @kira-kit/switch
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/toast
- @kira-kit/tooltip
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Switch } from "@/components/ui/switch";
<Switch> text</Switch>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
