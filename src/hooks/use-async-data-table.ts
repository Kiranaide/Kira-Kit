import * as React from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

// ============================================
// USE ASYNC DATA TABLE HOOK
// ============================================
// Manages server-side pagination, sorting, and filtering

interface UseAsyncDataTableOptions<TData> {
  /** Fetch function that returns data and total count */
  fetchFn: (params: FetchParams) => Promise<FetchResult<TData>>;
  /** Initial page size */
  initialPageSize?: number;
  /** Initial sorting state */
  initialSorting?: SortingState;
  /** Initial column filters */
  initialColumnFilters?: ColumnFiltersState;
  /** Debounce delay for filter changes (ms) */
  filterDebounceMs?: number;
  /** Whether to fetch on mount */
  fetchOnMount?: boolean;
  /** Unique key for caching/deduplication */
  queryKey?: string;
}

interface FetchParams {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
}

interface FetchResult<TData> {
  data: TData[];
  totalCount: number;
  pageCount?: number;
}

interface UseAsyncDataTableReturn<TData> {
  /** The fetched data */
  data: TData[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether initial load is happening */
  isInitialLoading: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Total row count from server */
  totalCount: number;
  /** Total page count */
  pageCount: number;
  /** Current pagination state */
  pagination: PaginationState;
  /** Set pagination state */
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  /** Current sorting state */
  sorting: SortingState;
  /** Set sorting state */
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  /** Current column filters */
  columnFilters: ColumnFiltersState;
  /** Set column filters */
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  /** Global filter value */
  globalFilter: string;
  /** Set global filter */
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  /** Manually trigger a refetch */
  refetch: () => Promise<void>;
  /** Whether there's a next page */
  hasNextPage: boolean;
  /** Whether there's a previous page */
  hasPreviousPage: boolean;
}

export function useAsyncDataTable<TData>(
  options: UseAsyncDataTableOptions<TData>
): UseAsyncDataTableReturn<TData> {
  const {
    fetchFn,
    initialPageSize = 10,
    initialSorting = [],
    initialColumnFilters = [],
    filterDebounceMs = 300,
    fetchOnMount = true,
  } = options;

  // State
  const [data, setData] = React.useState<TData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [totalCount, setTotalCount] = React.useState(0);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Debounced filter values
  const [debouncedFilters, setDebouncedFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState("");

  // Refs for tracking
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const hasFetchedRef = React.useRef(false);

  // Debounce filters
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(columnFilters);
    }, filterDebounceMs);

    return () => clearTimeout(timer);
  }, [columnFilters, filterDebounceMs]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, filterDebounceMs);

    return () => clearTimeout(timer);
  }, [globalFilter, filterDebounceMs]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedFilters, debouncedGlobalFilter, sorting]);

  // Fetch function
  const fetchData = React.useCallback(async () => {
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn({
        pagination,
        sorting,
        columnFilters: debouncedFilters,
        globalFilter: debouncedGlobalFilter,
      });

      setData(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Ignore aborted requests
      }
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
      hasFetchedRef.current = true;
    }
  }, [fetchFn, pagination, sorting, debouncedFilters, debouncedGlobalFilter]);

  // Fetch on mount and when dependencies change
  React.useEffect(() => {
    if (fetchOnMount || hasFetchedRef.current) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, fetchOnMount]);

  // Computed values
  const pageCount = Math.ceil(totalCount / pagination.pageSize);
  const hasNextPage = pagination.pageIndex < pageCount - 1;
  const hasPreviousPage = pagination.pageIndex > 0;

  return {
    data,
    isLoading,
    isInitialLoading,
    error,
    totalCount,
    pageCount,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    refetch: fetchData,
    hasNextPage,
    hasPreviousPage,
  };
}

export type {
  UseAsyncDataTableOptions,
  UseAsyncDataTableReturn,
  FetchParams,
  FetchResult,
};
