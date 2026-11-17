# Kbd

Renders keyboard keys and shortcut groups with default, outline, and ghost variants, three sizes, and custom separators. KbdShortcut parses combinations such as mod+shift+k, handles literal + keys, chooses platform-specific labels or macOS symbols, and emits aria-keyshortcuts.

## Install

```bash
npx shadcn add @kira-kit/kbd
```

## Dependencies

- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/use-platform

## Usage

```tsx
import { Kbd } from "@/components/ui/kbd";
<Kbd> text</Kbd>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
