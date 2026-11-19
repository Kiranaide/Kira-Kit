# Collapsible

A Base UI disclosure with eight trigger variants, four sizes, configurable icons and chevron placement, and reduced-motion-aware height transitions. Content can stay mounted or mount lazily, show configurable loading skeletons, and be composed through KiraCollapsible with a title, description, and disabled reason.

## Install

```bash
kira-kit add @kira-kit/collapsible
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-defaults
- @kira-kit/component-prop-guards
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Collapsible } from "@/components/ui/collapsible";
<Collapsible> text</Collapsible>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
