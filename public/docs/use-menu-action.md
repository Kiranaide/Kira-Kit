# useMenuAction

Runs dropdown or menubar actions as single-flight, abortable operations, passing an AbortSignal to each item's onSelect callback. Given a sessionKey and optional success/error callbacks, it returns run and reset plus state, activeId, message, and animatePending for rendering pending, success, and error feedback without stale sessions overwriting newer state.

## Install

```bash
kira-kit add @kira-kit/use-menu-action
```

## Usage

```tsx
import { useMenuAction } from "@/hooks/use-menu-action";
```
