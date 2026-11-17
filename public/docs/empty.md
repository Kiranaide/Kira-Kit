# Empty

An empty-state layout with centered or inline arrangements, three sizes, media variants, and reusable inbox, search, and file presets. KiraEmpty supplies seven contextual states including offline, forbidden, and loading, plus query-aware messaging and abortable async actions with disabled reasons and live status feedback.

## Install

```bash
npx shadcn add @kira-kit/empty
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/spinner

## Usage

```tsx
import { Empty } from "@/components/ui/empty";
<Empty> text</Empty>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
