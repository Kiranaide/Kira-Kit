# useFocusManager

Implements roving-tabindex keyboard navigation for grids using rowCount and colCount, with optional wrapping, initial positioning, and enable/disable control. It returns the current position, directional and boundary movement methods, getTabIndex, handleKeyDown, and a containerRef that focuses cells marked with data-row and data-col.

## Install

```bash
npx shadcn add @kira-kit/use-focus-manager
```

## Usage

```tsx
import { useFocusManager } from "@/hooks/use-focus-manager";

```
