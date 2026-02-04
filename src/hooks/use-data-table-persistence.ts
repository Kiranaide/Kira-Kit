import * as React from "react";
import type { Table } from "@tanstack/react-table";

// Persists table state to localStorage or URL params

interface PersistableState {
  sorting?: boolean;
  columnFilters?: boolean;
  columnVisibility?: boolean;
  columnOrder?: boolean;
  columnPinning?: boolean;
  pagination?: boolean;
  globalFilter?: boolean;
}

interface UseDataTablePersistenceOptions<TData> {
  /** The table instance */
  table: Table<TData>;
  /** Unique key for storage */
  storageKey: string;
  /** Which state properties to persist */
  persist?: PersistableState;
  /** Storage type */
  storage?: "localStorage" | "sessionStorage" | "url";
  /** Debounce delay for saving (ms) */
  debounceMs?: number;
}

interface UseDataTablePersistenceReturn {
  /** Save current state */
  save: () => void;
  /** Restore saved state */
  restore: () => void;
  /** Clear saved state */
  clear: () => void;
  /** Whether there is saved state */
  hasSavedState: boolean;
}

export function useDataTablePersistence<TData>(
  options: UseDataTablePersistenceOptions<TData>
): UseDataTablePersistenceReturn {
  const {
    table,
    storageKey,
    persist = {
      sorting: true,
      columnFilters: true,
      columnVisibility: true,
      columnOrder: true,
      columnPinning: true,
      pagination: false,
      globalFilter: false,
    },
    storage = "localStorage",
    debounceMs = 500,
  } = options;

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasSavedState, setHasSavedState] = React.useState(false);

  // Check for saved state on mount
  React.useEffect(() => {
    if (storage === "url") {
      const params = new URLSearchParams(window.location.search);
      setHasSavedState(params.has(storageKey));
    } else {
      const storageObj =
        storage === "localStorage" ? localStorage : sessionStorage;
      setHasSavedState(storageObj.getItem(storageKey) !== null);
    }
  }, [storageKey, storage]);

  const getStateToSave = React.useCallback(() => {
    const state = table.getState();
    const toSave: Record<string, unknown> = {};

    if (persist.sorting) toSave.sorting = state.sorting;
    if (persist.columnFilters) toSave.columnFilters = state.columnFilters;
    if (persist.columnVisibility)
      toSave.columnVisibility = state.columnVisibility;
    if (persist.columnOrder) toSave.columnOrder = state.columnOrder;
    if (persist.columnPinning) toSave.columnPinning = state.columnPinning;
    if (persist.pagination) toSave.pagination = state.pagination;
    if (persist.globalFilter) toSave.globalFilter = state.globalFilter;

    return toSave;
  }, [table, persist]);

  const save = React.useCallback(() => {
    const state = getStateToSave();
    const serialized = JSON.stringify(state);

    if (storage === "url") {
      const url = new URL(window.location.href);
      url.searchParams.set(storageKey, btoa(serialized));
      window.history.replaceState({}, "", url.toString());
    } else {
      const storageObj =
        storage === "localStorage" ? localStorage : sessionStorage;
      storageObj.setItem(storageKey, serialized);
    }

    setHasSavedState(true);
  }, [getStateToSave, storageKey, storage]);

  const restore = React.useCallback(() => {
    let serialized: string | null = null;

    if (storage === "url") {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get(storageKey);
      if (encoded) {
        try {
          serialized = atob(encoded);
        } catch {
          serialized = null;
        }
      }
    } else {
      const storageObj =
        storage === "localStorage" ? localStorage : sessionStorage;
      serialized = storageObj.getItem(storageKey);
    }

    if (!serialized) return;

    try {
      const state = JSON.parse(serialized);

      if (state.sorting && persist.sorting) {
        table.setSorting(state.sorting);
      }
      if (state.columnFilters && persist.columnFilters) {
        table.setColumnFilters(state.columnFilters);
      }
      if (state.columnVisibility && persist.columnVisibility) {
        table.setColumnVisibility(state.columnVisibility);
      }
      if (state.columnOrder && persist.columnOrder) {
        table.setColumnOrder(state.columnOrder);
      }
      if (state.columnPinning && persist.columnPinning) {
        table.setColumnPinning(state.columnPinning);
      }
      if (state.pagination && persist.pagination) {
        table.setPagination(state.pagination);
      }
      if (state.globalFilter && persist.globalFilter) {
        table.setGlobalFilter(state.globalFilter);
      }
    } catch {
      // Failed to restore state, will use defaults
    }
  }, [table, storageKey, storage, persist]);

  const clear = React.useCallback(() => {
    if (storage === "url") {
      const url = new URL(window.location.href);
      url.searchParams.delete(storageKey);
      window.history.replaceState({}, "", url.toString());
    } else {
      const storageObj =
        storage === "localStorage" ? localStorage : sessionStorage;
      storageObj.removeItem(storageKey);
    }

    setHasSavedState(false);
  }, [storageKey, storage]);

  // Auto-save on state changes (debounced)
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    table.getState().sorting,
    table.getState().columnFilters,
    table.getState().columnVisibility,
    table.getState().columnOrder,
    table.getState().columnPinning,
    table.getState().globalFilter,
    save,
    debounceMs,
  ]);

  return {
    save,
    restore,
    clear,
    hasSavedState,
  };
}

export type { UseDataTablePersistenceOptions, UseDataTablePersistenceReturn, PersistableState };
