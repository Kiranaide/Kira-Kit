# Toggle Group

Single- or multi-select toggle group with default, outline, segment, and pills variants, horizontal or vertical layouts, scrolling or icon-only overflow, and a GSAP sliding selection indicator. It supports current, radio, or pressed-button semantics, one-selected-always enforcement, validation and repeated hidden form inputs, plus an item-driven KiraToggleGroup with optimistic async updates.

## Install

```bash
kira-kit add @kira-kit/toggle-group
```

## Dependencies

- @base-ui/react
- @gsap/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/tooltip
- @kira-kit/use-optimistic-commit
- @kira-kit/use-press-bounce
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { ToggleGroup } from "@/components/ui/toggle-group";
<ToggleGroup> text</ToggleGroup>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
