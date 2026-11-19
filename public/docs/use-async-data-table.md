# useAsyncDataTable

Coordinates server-side table pagination, sorting, column filters, and global search through a fetchFn that returns rows and totalCount. It returns fetched data, loading and error states, table state setters, pageCount, refetch, and page-navigation flags, while debouncing filters and resetting to the first page when queries change.

## Install

```bash
kira-kit add @kira-kit/use-async-data-table
```

## Dependencies

- @tanstack/react-table

## Usage

```tsx
import { useAsyncDataTable } from "@/hooks/use-async-data-table";
```
