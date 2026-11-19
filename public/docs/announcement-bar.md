# Announcement Bar

Inline, sticky, fixed, or floating announcement with semantic variants, marquees, message rotation, countdowns, and pause-aware auto-dismiss progress. Dismissals persist across sessions and tabs, while KiraAnnouncementBar handles abortable asynchronous actions and persisted consent decisions.

## Install

```bash
kira-kit add @kira-kit/announcement-bar
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/spinner
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { AnnouncementBar } from "@/components/ui/announcement-bar";
<AnnouncementBar> text</AnnouncementBar>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
