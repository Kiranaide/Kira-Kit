# usePagination

Manages controlled or uncontrolled 1-indexed page, pageSize, and total state and returns page bounds, navigation flags and actions, ellipsis-aware getPageRange output, and getPageData for slicing local arrays. Use it for pagination controls that need configurable page ranges, atomic page-and-size updates, and optional bounds correction.

## Install

```bash
npx shadcn add @kira-kit/use-pagination
```

## Usage

```tsx
import { usePagination } from "@/hooks/use-pagination";
```
