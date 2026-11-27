# Date Picker

A date picker with single, datetime, and range modes, built around a native popover, Calendar, date-fns, and timezone-aware values. It includes typed date entry, presets, locale and IANA time-zone options, pending Cancel/Apply selection, time granularity, and range constraints such as minimum nights and disabled-date exclusion.

## Install

```bash
kira-kit add @kira-kit/date-picker
```

## Dependencies

- @date-fns/tz
- @tabler/icons-react
- class-variance-authority
- cn
- date-fns
- react-day-picker

## Registry dependencies

- @kira-kit/button
- @kira-kit/calendar
- @kira-kit/component-utils
- @kira-kit/popover
- @kira-kit/time-picker

## Usage

```tsx
import { DatePicker } from "@/components/ui/date-picker";
<DatePicker> text</DatePicker>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
