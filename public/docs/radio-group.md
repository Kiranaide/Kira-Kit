# Radio Group

Base UI radio groups with labeled options, rich RadioCard metadata, and a RadioButtonGroup whose GSAP indicator slides between selections. KiraRadioGroup provides data-driven list, cards, and segmented layouts with selected-option details, loading skeletons, empty states, and field validation.

## Install

```bash
kira-kit add @kira-kit/radio-group
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/component-defaults
- @kira-kit/component-native-props
- @kira-kit/component-prop-guards
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { RadioGroup } from "@/components/ui/radio-group";
<RadioGroup> text</RadioGroup>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
