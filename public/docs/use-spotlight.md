# useSpotlight

Reads spotlight state from SpotlightProvider and returns open, query, setQuery, and openSpotlight, closeSpotlight, and toggleSpotlight controls. Use it inside command-palette interfaces whose provider supplies a global Cmd+K/Ctrl+K-style shortcut with customizable shortcut and disableShortcut options.

## Install

```bash
npx shadcn add @kira-kit/use-spotlight
```

## Usage

```tsx
import { useSpotlight } from "@/hooks/use-spotlight";
```
