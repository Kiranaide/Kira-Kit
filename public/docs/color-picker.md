# Color Picker

A popover color editor with saturation, hue, optional alpha, swatches, recent colors, harmonies, EyeDropper support, and HEX, HEXA, RGB, HSL, and OKLCH formats. KiraColorPicker also evaluates WCAG contrast against a required background, suggests accessible replacements, and exports CSS variables or DTCG color tokens with cancellable async feedback.

## Install

```bash
kira-kit add @kira-kit/color-picker
```

## Dependencies

- @tabler/icons-react
- @uiw/color-convert
- @uiw/react-color-saturation
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/color-picker-lib
- @kira-kit/component-utils
- @kira-kit/input
- @kira-kit/popover
- @kira-kit/select
- @kira-kit/slider
- @kira-kit/use-color-picker
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { ColorPicker } from "@/components/ui/color-picker";
<ColorPicker> text</ColorPicker>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
