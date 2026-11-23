# Spotlight

Command-palette dialog for grouped, keyboard-navigable results with keywords, shortcuts, recent items, custom filtering, and an optional selected-item preview. KiraSpotlight adds scoped debounced async search with cancellation and retries, recent-result memory, and a configurable Ctrl/Cmd+K shortcut.

## Install

```bash
kira-kit add @kira-kit/spotlight
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/command
- @kira-kit/empty
- @kira-kit/kbd
- @kira-kit/use-reduced-motion
- @kira-kit/component-utils

## Usage

```tsx
import { Spotlight } from "@/components/ui/spotlight";
<Spotlight> text</Spotlight>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
