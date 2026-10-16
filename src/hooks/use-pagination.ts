"use client";

import * as React from "react";

// ============================================
// TYPES
// ============================================

export interface PaginationState {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
}

export interface UsePaginationOptions {
  /** Total number of items */
  total?: number;
  /** Items per page (default: 10) */
  pageSize?: number;
  /** Initial page for uncontrolled mode (1-indexed, default: 1) */
  defaultPage?: number;
  /** Controlled page value (1-indexed) */
  page?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Maximum number of visible page buttons (default: 5) */
  maxPages?: number;
  /** Keep page in bounds when total changes (default: true) */
  keepInBounds?: boolean;
}

export interface UsePaginationReturn {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total items */
  total: number;
  /** Total number of pages */
  pageCount: number;
  /** Index of first item on current page (0-indexed) */
  startIndex: number;
  /** Index of last item on current page (0-indexed) */
  endIndex: number;
  /** First item number on current page (1-indexed, for display) */
  startItem: number;
  /** Last item number on current page (1-indexed, for display) */
  endItem: number;
  /** Whether there's a previous page */
  hasPrev: boolean;
  /** Whether there's a next page */
  hasNext: boolean;
  /** Whether currently on first page */
  isFirst: boolean;
  /** Whether currently on last page */
  isLast: boolean;
  /** Set specific page */
  setPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Set page size (resets to page 1) */
  setPageSize: (size: number) => void;
  /** Set total items */
  setTotal: (total: number) => void;
  /** Reset to page 1 */
  reset: () => void;
  /** Get page range array for rendering */
  getPageRange: () => PageRangeItem[];
  /** Check if a specific page is the current page */
  isCurrentPage: (pageNum: number) => boolean;
  /** Get slice of data for current page */
  getPageData: <T>(data: T[]) => T[];
}

export type PageRangeItem =
  | { type: "page"; page: number; isActive: boolean }
  | { type: "ellipsis"; key: string };

// ============================================
// UTILITIES
// ============================================

/**
 * Calculate the range of page numbers to display with smart ellipsis.
 * Returns an array of page numbers and ellipsis indicators.
 */
export function calculatePageRange(
  currentPage: number,
  pageCount: number,
  maxPages: number = 5
): PageRangeItem[] {
  if (pageCount <= 0) return [];

  if (pageCount === 1) return [{ type: "page", page: 1, isActive: true }];

  const result: PageRangeItem[] = [];

  // For small page counts, show all pages
  if (pageCount <= maxPages + 2) {
    for (let i = 1; i <= pageCount; i++) {
      result.push({ type: "page", page: i, isActive: i === currentPage });
    }

    return result;
  }

  // Calculate the range around the current page
  const sidePages = Math.floor((maxPages - 1) / 2);

  // Determine start and end of the middle range
  let rangeStart = Math.max(2, currentPage - sidePages);
  let rangeEnd = Math.min(pageCount - 1, currentPage + sidePages);

  // Adjust range if at the beginning or end
  if (currentPage <= sidePages + 1) {
    rangeStart = 2;
    rangeEnd = maxPages;
  } else if (currentPage >= pageCount - sidePages) {
    rangeStart = pageCount - maxPages + 1;
    rangeEnd = pageCount - 1;
  }

  // Always show first page
  result.push({ type: "page", page: 1, isActive: currentPage === 1 });

  // Show ellipsis before range if needed
  if (rangeStart > 2) {
    result.push({ type: "ellipsis", key: "ellipsis-start" });
  }

  // Show middle range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    result.push({ type: "page", page: i, isActive: i === currentPage });
  }

  // Show ellipsis after range if needed
  if (rangeEnd < pageCount - 1) {
    result.push({ type: "ellipsis", key: "ellipsis-end" });
  }

  // Always show last page
  result.push({
    type: "page",
    page: pageCount,
    isActive: currentPage === pageCount,
  });

  return result;
}

/**
 * Clamp a page number to valid bounds
 */
function clampPage(page: number, pageCount: number): number {
  if (pageCount <= 0) return 1;

  return Math.max(1, Math.min(page, pageCount));
}

/**
 * Calculate the total number of pages
 */
function calculatePageCount(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) return 0;

  return Math.ceil(total / pageSize);
}

// ============================================
// HOOK
// ============================================

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    total: initialTotal = 0,
    pageSize: initialPageSize = 10,
    defaultPage = 1,
    page: controlledPage,
    onPageChange,
    onPageSizeChange,
    maxPages = 5,
    keepInBounds = true,
  } = options;

  // Internal state
  const [internalPage, setInternalPage] = React.useState(defaultPage);
  const [pageSize, setPageSizeState] = React.useState(initialPageSize);
  const [total, setTotalState] = React.useState(initialTotal);

  // Determine if controlled
  const isControlled = controlledPage !== undefined;
  const page = isControlled ? controlledPage : internalPage;

  // Derived values
  const pageCount = calculatePageCount(total, pageSize);
  const validPage = clampPage(page, pageCount);

  // Calculate indices
  const startIndex = total > 0 ? (validPage - 1) * pageSize : 0;
  const endIndex = total > 0 ? Math.min(startIndex + pageSize - 1, total - 1) : 0;
  const startItem = total > 0 ? startIndex + 1 : 0;
  const endItem = total > 0 ? endIndex + 1 : 0;

  // Navigation flags
  const hasPrev = validPage > 1;
  const hasNext = validPage < pageCount;
  const isFirst = validPage === 1;
  const isLast = validPage === pageCount || pageCount === 0;

  // Keep page in bounds when total or pageSize changes
  React.useEffect(() => {
    if (keepInBounds && !isControlled && pageCount > 0 && page > pageCount) {
      setInternalPage(pageCount);
      onPageChange?.(pageCount);
    }
  }, [keepInBounds, isControlled, pageCount, page, onPageChange]);

  // Update internal state when controlled value changes
  React.useEffect(() => {
    if (isControlled && controlledPage !== internalPage) {
      setInternalPage(controlledPage);
    }
  }, [isControlled, controlledPage, internalPage]);

  // Page navigation methods
  const setPage = React.useCallback(
    (newPage: number) => {
      const clampedPage = clampPage(newPage, pageCount);

      if (!isControlled) {
        setInternalPage(clampedPage);
      }

      onPageChange?.(clampedPage);
    },
    [isControlled, pageCount, onPageChange]
  );

  const nextPage = React.useCallback(() => {
    if (hasNext) {
      setPage(validPage + 1);
    }
  }, [hasNext, validPage, setPage]);

  const prevPage = React.useCallback(() => {
    if (hasPrev) {
      setPage(validPage - 1);
    }
  }, [hasPrev, validPage, setPage]);

  const firstPage = React.useCallback(() => {
    setPage(1);
  }, [setPage]);

  const lastPage = React.useCallback(() => {
    if (pageCount > 0) {
      setPage(pageCount);
    }
  }, [pageCount, setPage]);

  const setPageSize = React.useCallback(
    (newSize: number) => {
      if (newSize <= 0) return;
      setPageSizeState(newSize);
      onPageSizeChange?.(newSize);

      // Reset to page 1 when page size changes
      if (!isControlled) {
        setInternalPage(1);
      }

      onPageChange?.(1);
    },
    [isControlled, onPageChange, onPageSizeChange]
  );

  const setTotal = React.useCallback((newTotal: number) => {
    setTotalState(Math.max(0, newTotal));
  }, []);

  const reset = React.useCallback(() => {
    if (!isControlled) {
      setInternalPage(1);
    }

    onPageChange?.(1);
  }, [isControlled, onPageChange]);

  const getPageRange = React.useCallback((): PageRangeItem[] => {
    return calculatePageRange(validPage, pageCount, maxPages);
  }, [validPage, pageCount, maxPages]);

  const isCurrentPage = React.useCallback(
    (pageNum: number): boolean => {
      return pageNum === validPage;
    },
    [validPage]
  );

  const getPageData = React.useCallback(
    <T>(data: T[]): T[] => {
      if (!data || data.length === 0) return [];

      return data.slice(startIndex, endIndex + 1);
    },
    [startIndex, endIndex]
  );

  return {
    page: validPage,
    pageSize,
    total,
    pageCount,
    startIndex,
    endIndex,
    startItem,
    endItem,
    hasPrev,
    hasNext,
    isFirst,
    isLast,
    setPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    setTotal,
    reset,
    getPageRange,
    isCurrentPage,
    getPageData,
  };
}

// ============================================
// URL SYNC HOOK (Server-Side Pagination)
// ============================================

export interface UseUrlPaginationOptions extends UsePaginationOptions {
  /** URL parameter name for page (default: "page") */
  pageParam?: string;
  /** URL parameter name for page size (default: "pageSize") */
  pageSizeParam?: string;
  /** Whether to use shallow routing (no full page refresh, default: true) */
  shallow?: boolean;
  /** Custom function to get URL search params */
  getSearchParams?: () => URLSearchParams;
  /** Custom function to set URL search params */
  setSearchParams?: (params: URLSearchParams) => void;
}

export interface UseUrlPaginationReturn extends UsePaginationReturn {
  /** Current URL search params string */
  searchParamsString: string;
  /** Build URL with pagination params */
  buildUrl: (basePath?: string) => string;
}

/**
 * Pagination hook that syncs state with URL query parameters.
 * Useful for server-side pagination and shareable/bookmarkable URLs.
 */
export function useUrlPagination(
  options: UseUrlPaginationOptions = {}
): UseUrlPaginationReturn {
  const {
    pageParam = "page",
    pageSizeParam = "pageSize",
    shallow = true,
    getSearchParams,
    setSearchParams,
    defaultPage = 1,
    pageSize: defaultPageSize = 10,
    ...paginationOptions
  } = options;

  // Get initial values from URL
  const getParamsFromUrl = React.useCallback(() => {
    if (typeof window === "undefined") {
      return { page: defaultPage, pageSize: defaultPageSize };
    }

    const params = getSearchParams?.() ?? new URLSearchParams(window.location.search);
    const pageFromUrl = parseInt(params.get(pageParam) || "", 10);
    const pageSizeFromUrl = parseInt(params.get(pageSizeParam) || "", 10);

    return {
      page: isNaN(pageFromUrl) || pageFromUrl < 1 ? defaultPage : pageFromUrl,
      pageSize: isNaN(pageSizeFromUrl) || pageSizeFromUrl < 1 ? defaultPageSize : pageSizeFromUrl,
    };
  }, [getSearchParams, pageParam, pageSizeParam, defaultPage, defaultPageSize]);

  const [urlState, setUrlState] = React.useState(getParamsFromUrl);

  // Update URL when state changes
  const updateUrl = React.useCallback(
    (page: number, pageSize: number) => {
      if (typeof window === "undefined") return;

      const params = getSearchParams?.() ?? new URLSearchParams(window.location.search);
      
      if (page === 1) {
        params.delete(pageParam);
      } else {
        params.set(pageParam, String(page));
      }

      if (pageSize === defaultPageSize) {
        params.delete(pageSizeParam);
      } else {
        params.set(pageSizeParam, String(pageSize));
      }

      if (setSearchParams) {
        setSearchParams(params);
      } else {
        const newUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;

        if (shallow) {
          window.history.replaceState(null, "", newUrl);
        } else {
          window.history.pushState(null, "", newUrl);
        }
      }
    },
    [getSearchParams, setSearchParams, pageParam, pageSizeParam, defaultPageSize, shallow]
  );

  // Use base pagination hook
  const pagination = usePagination({
    ...paginationOptions,
    page: urlState.page,
    pageSize: urlState.pageSize,
    onPageChange: (page) => {
      setUrlState((prev) => ({ ...prev, page }));
      updateUrl(page, urlState.pageSize);
      paginationOptions.onPageChange?.(page);
    },
    onPageSizeChange: (pageSize) => {
      setUrlState((prev) => ({ ...prev, pageSize }));
      updateUrl(1, pageSize); // Reset to page 1 on size change
      paginationOptions.onPageSizeChange?.(pageSize);
    },
  });

  // Listen for browser back/forward
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const newState = getParamsFromUrl();
      setUrlState(newState);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [getParamsFromUrl]);

  const searchParamsString = React.useMemo(() => {
    const params = new URLSearchParams();

    if (pagination.page !== 1) {
      params.set(pageParam, String(pagination.page));
    }

    if (pagination.pageSize !== defaultPageSize) {
      params.set(pageSizeParam, String(pagination.pageSize));
    }

    return params.toString();
  }, [pagination.page, pagination.pageSize, pageParam, pageSizeParam, defaultPageSize]);

  const buildUrl = React.useCallback(
    (basePath?: string) => {
      const path = basePath ?? (typeof window === "undefined" ? "/" : window.location.pathname);

      return searchParamsString ? `${path}?${searchParamsString}` : path;
    },
    [searchParamsString]
  );

  return {
    ...pagination,
    searchParamsString,
    buildUrl,
  };
}

export type { PageRangeItem as PaginationRangeItem };
