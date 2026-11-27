# Slider

Single and range sliders with horizontal or vertical orientation, semantic and gradient variants, inversion, read-only and error states, formatted values, thumb labels and icons, and four tooltip modes. Explicit or step-generated markers and stepOptions support constrained stops, while KiraRangeSlider adds synchronized From/To numeric inputs and KiraSlider exposes an accessible disabled-reason tooltip.

## Install

```bash
kira-kit add @kira-kit/slider
```

## Dependencies

- @base-ui/react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/component-utils
- @kira-kit/input
- @kira-kit/tooltip

## Usage

```tsx
import { Slider } from "@/components/ui/slider";
<Slider> text</Slider>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
