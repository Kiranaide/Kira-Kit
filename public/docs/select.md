# Select

A Base UI Select and Combobox family supporting grouped options, multiple selection with removable chips, fuzzy and debounced asynchronous search, creatable options, and virtualized long lists. KiraSelect also provides clear controls, loading/empty/create states, three trigger variants, invalid styling, and reduced-motion-aware option staggering.

## Install

```bash
kira-kit add @kira-kit/select
```

## Dependencies

- @base-ui/react
- @gsap/react
- @tabler/icons-react
- @tanstack/react-virtual
- cn
- gsap

## Registry dependencies

- @kira-kit/component-defaults
- @kira-kit/component-prop-guards
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Select } from "@/components/ui/select";
<Select> text</Select>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
