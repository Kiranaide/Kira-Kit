# Time Picker

Date-based time selector with typeable hour, minute, and optional second steppers, 12/24-hour cycles, configurable increments, quick-pick presets, and selection grids. It enforces minimum, maximum, and disabled times and renders inline or in a native anchored popover with clear and focus-return behavior.

## Install

```bash
kira-kit add @kira-kit/time-picker
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn
- date-fns

## Usage

```tsx
import { TimePicker } from "@/components/ui/time-picker";
<TimePicker> text</TimePicker>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
