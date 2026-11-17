"use client";

import * as React from "react";

export interface PaginationState {
  /** Pages are 1-indexed. */
  page: number;
  pageSize: number;
  total: number;
}

export interface UsePaginationOptions {
  total?: number;
  defaultTotal?: number;
  pageSize?: number;
  defaultPageSize?: number;
  defaultPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onTotalChange?: (total: number) => void;
  /** One atomic notification for page and size, including size resets. */
  onPaginationChange?: (
    state: Pick<PaginationState, "page" | "pageSize">,
  ) => void;
  /** Maximum numbered buttons, excluding ellipses. Minimum 3, maximum 25. */
  maxPages?: number;
  keepInBounds?: boolean;
}

export interface UsePaginationReturn extends PaginationState {
  pageCount: number;
  startIndex: number;
  /** Inclusive, or -1 when there are no items on the page. */
  endIndex: number;
  startItem: number;
  endItem: number;
  hasPrev: boolean;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
  setPage: (page: number) => void;
  /** Commit a page and size together, including URL-backed controlled state. */
  setPagination: (state: Pick<PaginationState, "page" | "pageSize">) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  reset: () => void;
  getPageRange: () => PageRangeItem[];
  isCurrentPage: (page: number) => boolean;
  getPageData: <T>(data: readonly T[]) => T[];
}

export type PageRangeItem =
  | { type: "page"; page: number; isActive: boolean }
  | { type: "ellipsis"; key: string };

function integer(value: number | undefined, fallback: number, minimum = 1) {
  return value !== undefined && Number.isFinite(value)
    ? Math.max(minimum, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value)))
    : fallback;
}

function clampPage(page: number, count: number) {
  return Math.max(1, Math.min(integer(page, 1), Math.max(1, count)));
}

export function calculatePageRange(
  currentPage: number,
  pageCount: number,
  maxPages = 5,
): PageRangeItem[] {
  const count = integer(pageCount, 0, 0);

  if (count === 0) return [];
  const activePage = integer(currentPage, 1);
  const page = clampPage(activePage, count);
  const budget = Math.min(25, Math.max(3, integer(maxPages, 5)));
  const result: PageRangeItem[] = [];

  const addPage = (number: number) =>
    result.push({
      type: "page",
      page: number,
      isActive: number === activePage,
    });

  if (count <= budget) {
    for (let number = 1; number <= count; number++) addPage(number);

    return result;
  }

  const middleCount = budget - 2;

  const start = Math.max(
    2,
    Math.min(count - middleCount, page - Math.floor((middleCount - 1) / 2)),
  );

  const end = start + middleCount - 1;
  addPage(1);

  if (start > 2) result.push({ type: "ellipsis", key: "ellipsis-start" });

  for (let number = start; number <= end; number++) addPage(number);

  if (end < count - 1) result.push({ type: "ellipsis", key: "ellipsis-end" });
  addPage(count);

  return result;
}

type PaginationSelection = Pick<PaginationState, "page" | "pageSize">;

interface InternalPagination extends PaginationState {
  boundsCorrection: PaginationSelection | null;
}

function initialPagination(options: UsePaginationOptions): InternalPagination {
  return {
    page: integer(options.defaultPage, 1),
    pageSize: integer(options.defaultPageSize, 10),
    total: integer(options.defaultTotal, 0, 0),
    boundsCorrection: null,
  };
}

function paginationView(
  options: UsePaginationOptions,
  internal: InternalPagination,
) {
  const total = integer(options.total ?? internal.total, 0, 0);
  const pageSize = integer(options.pageSize ?? internal.pageSize, 10);
  const pageCount = total > 0 ? Math.ceil(total / pageSize) : 0;
  const requested = integer(options.page ?? internal.page, 1);

  const page =
    options.keepInBounds === false
      ? requested
      : clampPage(requested, pageCount);

  const startIndex = Math.min(Number.MAX_SAFE_INTEGER, (page - 1) * pageSize);

  return {
    page,
    pageSize,
    total,
    pageCount,
    startIndex,
    ...paginationItems(total, startIndex, pageSize),
  };
}

function paginationItems(total: number, startIndex: number, pageSize: number) {
  const hasItems = total > 0 && startIndex < total;
  const endIndex = hasItems ? Math.min(startIndex + pageSize, total) - 1 : -1;

  return {
    hasItems,
    endIndex,
    startItem: hasItems ? startIndex + 1 : 0,
    endItem: hasItems ? endIndex + 1 : 0,
  };
}

function useBoundsNotification(
  correction: PaginationSelection | null,
  options: UsePaginationOptions,
) {
  const notified = React.useRef(correction);
  const { onPageChange, onPaginationChange } = options;
  React.useEffect(() => {
    if (!correction || notified.current === correction) return;
    notified.current = correction;
    onPageChange?.(correction.page);
    onPaginationChange?.(correction);
  }, [correction, onPageChange, onPaginationChange]);
}

function nextPagination(
  selection: PaginationSelection,
  total: number,
  keepInBounds: boolean,
): PaginationSelection | null {
  if (
    !Number.isFinite(selection.page) ||
    !Number.isSafeInteger(selection.pageSize) ||
    selection.pageSize < 1
  )
    return null;
  const count = total > 0 ? Math.ceil(total / selection.pageSize) : 0;

  const page = keepInBounds
    ? clampPage(selection.page, count)
    : integer(selection.page, 1);

  return { page, pageSize: selection.pageSize };
}

function commitPagination(
  previous: InternalPagination,
  selection: PaginationSelection,
  options: UsePaginationOptions,
): InternalPagination {
  const next = { ...previous, boundsCorrection: null };

  if (options.pageSize === undefined) next.pageSize = selection.pageSize;

  if (options.page === undefined) next.page = selection.page;

  return next;
}

function notifyPagination(
  previous: PaginationSelection,
  next: PaginationSelection,
  options: UsePaginationOptions,
) {
  if (next.pageSize !== previous.pageSize)
    options.onPageSizeChange?.(next.pageSize);

  if (next.page !== previous.page) options.onPageChange?.(next.page);
  options.onPaginationChange?.(next);
}

function paginationActions(
  options: UsePaginationOptions,
  view: ReturnType<typeof paginationView>,
  setInternal: React.Dispatch<React.SetStateAction<InternalPagination>>,
) {
  const setPagination = (selection: PaginationSelection) => {
    const next = nextPagination(
      selection,
      view.total,
      options.keepInBounds !== false,
    );

    if (!next || (next.page === view.page && next.pageSize === view.pageSize))
      return;
    setInternal((previous) => commitPagination(previous, next, options));
    notifyPagination(view, next, options);
  };

  const setPage = (page: number) =>
    setPagination({ page, pageSize: view.pageSize });

  const setPageSize = (pageSize: number) => {
    if (pageSize !== view.pageSize) setPagination({ page: 1, pageSize });
  };

  const setTotal = (value: number) => {
    if (!Number.isFinite(value)) return;
    const total = integer(value, 0, 0);

    if (total === view.total) return;

    if (options.total === undefined)
      setInternal((previous) => ({ ...previous, total }));
    options.onTotalChange?.(total);
  };

  return { setPagination, setPage, setPageSize, setTotal };
}

export function usePagination(
  options: UsePaginationOptions = {},
): UsePaginationReturn {
  const [internal, setInternal] = React.useState(() =>
    initialPagination(options),
  );

  const view = paginationView(options, internal);

  // Persist bounded uncontrolled pages so later results cannot restore an old page.
  if (
    options.page === undefined &&
    options.keepInBounds !== false &&
    internal.page !== view.page
  ) {
    setInternal({
      ...internal,
      page: view.page,
      boundsCorrection: { page: view.page, pageSize: view.pageSize },
    });
  }

  useBoundsNotification(internal.boundsCorrection, options);
  const actions = paginationActions(options, view, setInternal);
  const { hasItems, ...publicView } = view;
  const { page, pageCount, startIndex, endIndex } = publicView;
  const hasPrev = page > 1 && pageCount > 0;
  const hasNext = page < pageCount;

  return {
    ...publicView,
    ...actions,
    hasPrev,
    hasNext,
    isFirst: page === 1,
    isLast: !hasNext,
    nextPage: () => {
      if (hasNext) actions.setPage(page + 1);
    },
    prevPage: () => {
      if (hasPrev) actions.setPage(page - 1);
    },
    firstPage: () => actions.setPage(1),
    lastPage: () => {
      if (pageCount > 0) actions.setPage(pageCount);
    },
    reset: () => actions.setPage(1),
    getPageRange: () =>
      calculatePageRange(page, pageCount, options.maxPages ?? 5),
    isCurrentPage: (number) => number === page,
    getPageData: <T>(data: readonly T[]) =>
      hasItems ? data.slice(startIndex, endIndex + 1) : [],
  };
}

export interface UseUrlPaginationOptions extends UsePaginationOptions {
  pageParam?: string;
  pageSizeParam?: string;
  /** true replaces the history entry; false pushes. Neither reloads the page. */
  shallow?: boolean;
  getSearchParams?: () => URLSearchParams;
  setSearchParams?: (params: URLSearchParams) => void;
  /** A router adapter must subscribe to its own URL/search state changes. */
  subscribe?: (onStoreChange: () => void) => () => void;
}

export interface UseUrlPaginationReturn extends UsePaginationReturn {
  searchParamsString: string;
  buildUrl: (basePath?: string) => string;
}

const paginationUrlEvent = "kira-pagination-url-change";

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(paginationUrlEvent, onChange);

  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(paginationUrlEvent, onChange);
  };
}

function readUrlNumber(params: URLSearchParams, key: string, fallback: number) {
  const raw = params.get(key);

  if (!raw || !/^[1-9]\d*$/.test(raw)) return fallback;
  const value = Number(raw);

  return Number.isSafeInteger(value) ? value : fallback;
}

function applyUrlState(
  params: URLSearchParams,
  page: number,
  pageSize: number,
  pageParam: string,
  sizeParam: string,
  defaultSize: number,
  defaultPage: number,
) {
  if (page === defaultPage) params.delete(pageParam);
  else params.set(pageParam, String(page));

  if (pageSize === defaultSize) params.delete(sizeParam);
  else params.set(sizeParam, String(pageSize));

  return params;
}

interface PaginationUrlConfig {
  pageParam: string;
  pageSizeParam: string;
  shallow: boolean;
  initialPage: number;
  defaultSize: number;
}

function paginationUrlConfig(
  options: UseUrlPaginationOptions,
): PaginationUrlConfig {
  return {
    pageParam: options.pageParam ?? "page",
    pageSizeParam: options.pageSizeParam ?? "pageSize",
    shallow: options.shallow ?? true,
    initialPage: integer(options.defaultPage, 1),
    defaultSize: integer(options.defaultPageSize ?? options.pageSize, 10),
  };
}

function usePaginationSearch(options: UseUrlPaginationOptions) {
  const { subscribe, getSearchParams } = options;

  const getSnapshot = () =>
    typeof window === "undefined"
      ? ""
      : (getSearchParams?.().toString() ?? window.location.search);

  return React.useSyncExternalStore(
    subscribe ?? subscribeToUrl,
    getSnapshot,
    () => "",
  );
}

function querySuffix(query: string) {
  return query ? "?" + query : "";
}

function writePaginationHistory(params: URLSearchParams, shallow: boolean) {
  const target =
    window.location.pathname +
    querySuffix(params.toString()) +
    window.location.hash;

  const current =
    window.location.pathname + window.location.search + window.location.hash;

  if (target === current) return;

  if (shallow) window.history.replaceState(window.history.state, "", target);
  else window.history.pushState(window.history.state, "", target);
  window.dispatchEvent(new Event(paginationUrlEvent));
}

function paginationQuery(
  params: URLSearchParams,
  selection: PaginationSelection,
  config: PaginationUrlConfig,
) {
  return applyUrlState(
    params,
    selection.page,
    selection.pageSize,
    config.pageParam,
    config.pageSizeParam,
    config.defaultSize,
    config.initialPage,
  );
}

function updatePaginationUrl(
  selection: PaginationSelection,
  options: UseUrlPaginationOptions,
  config: PaginationUrlConfig,
) {
  if (typeof window === "undefined") return;

  const updated = paginationQuery(
    new URLSearchParams(options.getSearchParams?.() ?? window.location.search),
    selection,
    config,
  );

  if (options.setSearchParams) options.setSearchParams(updated);
  else writePaginationHistory(updated, config.shallow);
  options.onPaginationChange?.(selection);
}

function buildPaginationUrl(
  search: string,
  selection: PaginationSelection,
  config: PaginationUrlConfig,
  basePath?: string,
) {
  const fallback =
    typeof window === "undefined"
      ? "/"
      : window.location.pathname +
        window.location.search +
        window.location.hash;

  const address = new URL(
    basePath ?? fallback,
    typeof window === "undefined"
      ? "https://kira.invalid"
      : window.location.href,
  );

  // Preserve filters while allowing an explicit base URL to override them.
  const query = new URLSearchParams(search);
  address.searchParams.forEach((_, key) => query.delete(key));
  address.searchParams.forEach((value, key) => query.append(key, value));
  paginationQuery(query, selection, config);

  return address.pathname + querySuffix(query.toString()) + address.hash;
}

export function useUrlPagination(
  options: UseUrlPaginationOptions = {},
): UseUrlPaginationReturn {
  const config = paginationUrlConfig(options);
  const search = usePaginationSearch(options);
  const params = new URLSearchParams(search);

  const pagination = usePagination({
    ...options,
    page: readUrlNumber(params, config.pageParam, config.initialPage),
    pageSize: readUrlNumber(params, config.pageSizeParam, config.defaultSize),
    onPaginationChange: (selection) =>
      updatePaginationUrl(selection, options, config),
  });

  const searchParamsString = paginationQuery(
    new URLSearchParams(search),
    pagination,
    config,
  ).toString();

  return {
    ...pagination,
    searchParamsString,
    buildUrl: (basePath) =>
      buildPaginationUrl(search, pagination, config, basePath),
  };
}

export type { PageRangeItem as PaginationRangeItem };
