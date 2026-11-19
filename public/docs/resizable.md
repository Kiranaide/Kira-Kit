# Resizable

Accessible horizontal and vertical panel groups built on react-resizable-panels, with three handle variants, optional grips, coarse-pointer targets, collapsible panels, and validated autoSaveId layout persistence. KiraResizable renders data-driven panels with hide/show, restore, and balance controls plus inert collapsed content.

## Install

```bash
kira-kit add @kira-kit/resizable
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn
- react-resizable-panels

## Registry dependencies

- @kira-kit/button
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Resizable } from "@/components/ui/resizable";
<Resizable> text</Resizable>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
