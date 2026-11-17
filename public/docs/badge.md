# Badge

Badge covers semantic, outline, ghost, link, and soft styles with status dots, trend arrows, loading, dismissal, and beta/new/version presets. CountBadge formats and animates changing counts, while the suite also provides status, tag, and group modes plus a Combobox-backed TagInput with suggestions and deduplication.

## Install

```bash
npx shadcn add @kira-kit/badge
```

## Dependencies

- @base-ui/react
- @gsap/react
- @tabler/icons-react
- class-variance-authority
- cn
- gsap

## Registry dependencies

- @kira-kit/spinner
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { Badge } from "@/components/ui/badge";
<Badge> text</Badge>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
