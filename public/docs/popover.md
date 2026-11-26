# Popover

A Base UI popover family with payload-aware triggers, five sizes, positioning props, arrows, backdrops, viewport transitions, and reduced-motion support. KiraPopover adds guarded dirty-draft dismissal with discard confirmation, while KiraPopoverFlow provides multi-view history and focus restoration.

## Install

```bash
kira-kit add @kira-kit/popover
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Popover } from "@/components/ui/popover";
<Popover> text</Popover>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
