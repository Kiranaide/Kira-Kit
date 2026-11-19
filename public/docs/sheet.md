# Sheet

Drawer-based sheets with trigger, title, description, body, and footer composition, defaulting to the right side on desktop and the bottom below 640px with configurable side and mobileSide. KiraSheet supports guarded close requests, live status text, inert skeleton loading, and error/retry states.

## Install

```bash
kira-kit add @kira-kit/sheet
```

## Registry dependencies

- @kira-kit/button
- @kira-kit/drawer
- @kira-kit/skeleton

## Usage

```tsx
import { Sheet } from "@/components/ui/sheet";
<Sheet> text</Sheet>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
