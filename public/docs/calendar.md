# Calendar

React Day Picker calendar with single, multiple, and range selection, IANA time zones, multi-month layouts, and min/max/disabled constraints. Range mode includes hover previews and night limits, with marker legends and an accessible keyboard-navigable month/year grid picker.

## Install

```bash
npx shadcn add @kira-kit/calendar
```

## Dependencies

- @date-fns/tz
- @tabler/icons-react
- class-variance-authority
- cn
- date-fns
- react-day-picker

## Usage

```tsx
import { Calendar } from "@/components/ui/calendar";
<Calendar> text</Calendar>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
