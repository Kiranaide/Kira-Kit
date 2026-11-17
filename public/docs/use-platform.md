# usePlatform

Detects and caches the browser operating system from the user agent, returning "mac", "windows", "linux", or "unknown" without requiring options. Use it for platform-specific UI such as keyboard-shortcut labels; server rendering returns "unknown" before the client snapshot is applied.

## Install

```bash
npx shadcn add @kira-kit/use-platform
```

## Usage

```tsx
import { usePlatform } from "@/hooks/use-platform";
```
