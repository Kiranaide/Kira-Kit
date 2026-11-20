import * as React from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface UseAsyncDataTableOptions<TData> {
  /** Fetch function that returns data and total count */
  fetchFn: (params: FetchParams) => Promise<FetchResult<TData>>;
  initialPageSize?: number;
  /** Initial sorting state */
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  /** Debounce delay for filter changes (ms) */
  filterDebounceMs?: number;
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
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  /** Manually trigger a refetch */
  refetch: () => Promise<void>;
  /** Whether there's a next page */
  hasNextPage: boolean;
  /** Whether there's a previous page */
  hasPreviousPage: boolean;
}

function useDebouncedFilter<Value>(value: Value, delay: number) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

interface AsyncTableRows<TData> {
  data: TData[];
  isLoading: boolean;
  isInitialLoading: boolean;
  error: Error | null;
  totalCount: number;
}

async function loadTableRows<TData>(
  fetchFn: UseAsyncDataTableOptions<TData>["fetchFn"],
  params: FetchParams,
  controller: AbortController,
  setRows: React.Dispatch<React.SetStateAction<AsyncTableRows<TData>>>,
  hasFetched: React.RefObject<boolean>,
) {
  setRows((previous) => ({ ...previous, isLoading: true, error: null }));

  try {
    const result = await fetchFn(params);

    if (!controller.signal.aborted)
      setRows((previous) => ({
        ...previous,
        data: result.data,
        totalCount: result.totalCount,
      }));
  } catch (cause) {
    if (
      controller.signal.aborted ||
      (cause instanceof Error && cause.name === "AbortError")
    )
      return;
    setRows((previous) => ({
      ...previous,
      error: cause instanceof Error ? cause : new Error("Failed to fetch data"),
    }));
  } finally {
    if (!controller.signal.aborted) {
      setRows((previous) => ({
        ...previous,
        isLoading: false,
        isInitialLoading: false,
      }));
      hasFetched.current = true;
    }
  }
}

function useAsyncTableRows<TData>(
  { fetchFn, fetchOnMount = true }: UseAsyncDataTableOptions<TData>,
  params: FetchParams,
) {
  const [rows, setRows] = React.useState<AsyncTableRows<TData>>({
    data: [],
    isLoading: false,
    isInitialLoading: true,
    error: null,
    totalCount: 0,
  });

  const controllerRef = React.useRef<AbortController | null>(null);
  const hasFetched = React.useRef(false);
  const { pagination, sorting, columnFilters, globalFilter } = params;

  const refetch = React.useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    return loadTableRows(
      fetchFn,
      { pagination, sorting, columnFilters, globalFilter },
      controller,
      setRows,
      hasFetched,
    );
  }, [fetchFn, pagination, sorting, columnFilters, globalFilter]);

  React.useEffect(() => {
    if (fetchOnMount || hasFetched.current) void refetch();

    return () => controllerRef.current?.abort();
  }, [refetch, fetchOnMount]);

  return { ...rows, refetch };
}

export function useAsyncDataTable<TData>(
  options: UseAsyncDataTableOptions<TData>,
): UseAsyncDataTableReturn<TData> {
  const {
    initialPageSize = 10,
    initialSorting = [],
    initialColumnFilters = [],
    filterDebounceMs = 300,
  } = options;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debouncedFilters = useDebouncedFilter(columnFilters, filterDebounceMs);

  const debouncedGlobalFilter = useDebouncedFilter(
    globalFilter,
    filterDebounceMs,
  );

  const [previousQuery, setPreviousQuery] = React.useState({
    sorting,
    filters: debouncedFilters,
    global: debouncedGlobalFilter,
  });

  if (
    previousQuery.sorting !== sorting ||
    previousQuery.filters !== debouncedFilters ||
    previousQuery.global !== debouncedGlobalFilter
  ) {
    setPreviousQuery({
      sorting,
      filters: debouncedFilters,
      global: debouncedGlobalFilter,
    });

    if (pagination.pageIndex !== 0)
      setPagination({ ...pagination, pageIndex: 0 });
  }

  const rows = useAsyncTableRows(options, {
    pagination,
    sorting,
    columnFilters: debouncedFilters,
    globalFilter: debouncedGlobalFilter,
  });

  const pageCount = Math.ceil(rows.totalCount / pagination.pageSize);

  return {
    ...rows,
    pageCount,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    hasNextPage: pagination.pageIndex < pageCount - 1,
    hasPreviousPage: pagination.pageIndex > 0,
  };
}

export type {
  UseAsyncDataTableOptions,
  UseAsyncDataTableReturn,
  FetchParams,
  FetchResult,
};
