# Theme Provider

Lightweight light/dark theme context with localStorage persistence, system preference detection, useTheme hook, and a composable ThemeToggle button decoupled from any navigation shell.

## Install

```bash
kira-kit add @kira-kit/theme-provider
```

## Dependencies

- @tabler/icons-react
- cn

## Registry dependencies

- @kira-kit/button

## Usage

```tsx
import { ThemeProvider } from "@/components/ui/theme-provider";
<ThemeProvider> text</ThemeProvider>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
