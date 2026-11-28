"use client";

// Components and hooks in this module that read TanStack Table / TanStack
// Virtual mutable getters opt out of React Compiler individually via
// function-level "use no memo" directives (module-level directives are stripped
// by Rolldown during bundling).

import * as React from "react";
import {
  FlexRender,
  aggregationFns,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  functionalUpdate,
  sortFns,
  stockFeatures,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  Header,
  Row,
  RowData,
  RowSelectionState,
  PaginationState,
  SortingState,
  Table as TanstackTable,
  Updater,
} from "@tanstack/react-table";
import { useSelector } from "@tanstack/react-store";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconGripVertical,
  IconInbox,
  IconPin,
  IconPinFilled,
  IconPinnedOff,
  IconRefresh,
  IconSearch,
  IconSelector,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { cn } from "cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type StickyCellProps,
  type TableDensity,
} from "@/components/ui/table";
import { KiraPagination } from "@/components/ui/pagination";
import { KiraEmpty } from "@/components/ui/empty";
import { KiraSelect } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  isFunctionProp,
  isNumberProp,
  isObjectProp,
  isStringProp,
  resolveComponentDefaults,
} from "@/lib/component-utils";

// Every feature + row model this component can use. Narrow it (and replace the
// deprecated full fn registries with individual sortFn_* / filterFn_* imports)
// if bundle size matters.
const dataTableFeatures = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns,
  sortFns,
  aggregationFns,
});

type DTFeatures = typeof dataTableFeatures;

type DTTable<TData extends RowData> = TanstackTable<DTFeatures, TData>;

type DTRow<TData extends RowData> = Row<DTFeatures, TData>;

type DTColumn<TData extends RowData, TValue = unknown> = Column<
  DTFeatures,
  TData,
  TValue
>;

type DTHeader<TData extends RowData, TValue = unknown> = Header<
  DTFeatures,
  TData,
  TValue
>;

/** Use this to type columns passed to DataTableRoot. */
type DTColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  DTFeatures,
  TData,
  TValue
>;

type DTState = DTTable<RowData>["store"]["state"];

// Public density names kept for compatibility; mapped onto table.tsx densities.
type DataTableDensity = "compact" | "default" | "comfortable";

const DENSITY_TO_TABLE: Record<DataTableDensity, TableDensity> = {
  compact: "dense",
  default: "compact",
  comfortable: "comfortable",
};

// Initial guesses only; virtual rows are measured after render.
const DENSITY_ROW_ESTIMATE: Record<DataTableDensity, number> = {
  compact: 33,
  default: 41,
  comfortable: 57,
};

const EMPTY_SORTING: SortingState = [];

/** Column ids may contain dots/spaces — make them safe custom-property names. */
const cssId = (id: string) => id.replace(/[^\w-]/g, "_");

const INTERACTIVE_SELECTOR =
  "a,button,input,select,textarea,label,[role=checkbox],[role=menuitem],[role=separator],[contenteditable=true]";

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

function formatColumnId(id: string): string {
  return id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function readColumnMetaLabel(
  columnDef: { meta?: unknown } | undefined,
): string | undefined {
  const meta = columnDef?.meta;

  if (!isObjectProp(meta) || !("label" in meta)) return undefined;

  return isStringProp(meta.label) && meta.label.trim() ? meta.label : undefined;
}

function columnLabel(
  column:
    { id: string; columnDef: { header?: unknown; meta?: unknown } } | undefined,
  registeredLabels?: Readonly<Record<string, string>>,
) {
  if (!column) return "";

  const metaLabel = readColumnMetaLabel(column.columnDef);

  if (metaLabel) return metaLabel;

  const { header } = column.columnDef;

  if (isStringProp(header) && header.trim()) return header;

  return registeredLabels?.[column.id] ?? formatColumnId(column.id);
}

/** store.subscribe's return shape differs across TanStack Store versions. */
function subscribeTable<TData extends RowData>(
  table: DTTable<TData>,
  listener: () => void,
) {
  const sub: (() => void) | { unsubscribe: () => void } =
    table.store.subscribe(listener);

  return () => unsubscribeTable(sub);
}

function unsubscribeTable(
  subscription: (() => void) | { unsubscribe?: () => void } | undefined,
) {
  if (isFunctionProp(subscription)) {
    subscription();

    return;
  }

  subscription?.unsubscribe?.();
}

/** Re-render whenever any table state changes (v8-equivalent behavior). */
function useTableState<TData extends RowData>(table: DTTable<TData>) {
  return useSelector(table.store);
}

/** Pinned-cell props from TanStack's own offset math (no O(n²) loops). */
function pinProps<TData extends RowData>(
  column: DTColumn<TData>,
): StickyCellProps {
  const side = column.getIsPinned();

  if (!side) return {};

  return {
    stickyColumn: side,
    stickyOffset: `${side === "start" ? column.getStart("start") : column.getAfter("end")}px`,
    stickyEdge:
      side === "start"
        ? column.getIsLastColumn("start")
        : column.getIsFirstColumn("end"),
  };
}

interface DataTableContextValue<TData extends RowData> {
  table: DTTable<TData>;
  density: DataTableDensity;
  setDensity: (density: DataTableDensity) => void;
  columnLabels: Readonly<Record<string, string>>;
  registerColumnLabel: (columnId: string, label: string) => void;
  enablePagination: boolean;
  enableVirtualization: boolean;
  enableKeyboardNavigation: boolean;
  estimateRowHeight?: number;
  containerHeight: number;
  onLoadMore?: () => void;
  isLoading: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  error?: React.ReactNode;
  onRetry?: () => void;
  hasActiveFilters: boolean;
  onResetFilters?: () => void;
  searchQuery?: string;
  onRowClick?: (row: DTRow<TData>) => void;
  pendingRowIds?: ReadonlySet<string>;
}

const DataTableContext =
  React.createContext<DataTableContextValue<RowData> | null>(null);

function useDataTable<TData extends RowData = RowData>() {
  const context = React.useContext(DataTableContext);

  if (!context)
    throw new Error("useDataTable must be used within a DataTableRoot");

  // SAFETY: DataTableRoot is generic over TData and its provider stores the
  // table it created, so a context read inside that provider carries TData.
  return context as DataTableContextValue<TData>;
}

export interface PersistedTableState {
  version?: number;
  density?: DataTableDensity;
  sorting?: SortingState;
  columnVisibility?: ColumnVisibilityState;
  columnOrder?: ColumnOrderState;
  columnSizing?: ColumnSizingState;
  columnPinning?: ColumnPinningState;
}

const TABLE_STATE_STORAGE_PREFIX = "kira-table:";

// v2: pinning switched to v9's start/end keys — old left/right records are ignored.
const DEFAULT_PERSIST_VERSION = 2;
const PERSIST_DEBOUNCE_MS = 300;

function readStoredTableState(
  key: string,
  version: number,
): PersistedTableState | null {
  try {
    const raw = localStorage.getItem(TABLE_STATE_STORAGE_PREFIX + key);

    if (!raw) return null;
    // SAFETY: only this module writes kira-table:<key> records, always as a
    // PersistedTableState-shaped object (version checked below).
    const parsed = JSON.parse(raw) as PersistedTableState;

    return parsed?.version === version ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredTableState(
  key: string,
  version: number,
  partial: PersistedTableState,
) {
  try {
    const next = { ...readStoredTableState(key, version), ...partial, version };
    localStorage.setItem(
      TABLE_STATE_STORAGE_PREFIX + key,
      JSON.stringify(next),
    );
  } catch {
    // Storage writes must never crash the table.
  }
}

export interface UseTableStatePersistenceOptions {
  version?: number;
}

export function useTableStatePersistence(
  key: string,
  opts?: UseTableStatePersistenceOptions,
) {
  const version = opts?.version ?? DEFAULT_PERSIST_VERSION;

  const load = React.useCallback(
    () => readStoredTableState(key, version),
    [key, version],
  );

  const save = React.useCallback(
    (partial: PersistedTableState) =>
      writeStoredTableState(key, version, partial),
    [key, version],
  );

  return { load, save };
}

function useTablePersistence<TData extends RowData>(
  table: DTTable<TData>,
  key: string | undefined,
  version: number,
  onRestoreDensity: (density: DataTableDensity) => void,
) {
  const restoreDensity = React.useEffectEvent(onRestoreDensity);

  // Restore after mount, before paint: reading storage during render would
  // mismatch the server-rendered markup.
  React.useLayoutEffect(() => {
    if (!key) return;
    const saved = readStoredTableState(key, version);

    if (!saved) return;

    if (saved.sorting) table.setSorting(saved.sorting);

    if (saved.columnVisibility)
      table.setColumnVisibility(saved.columnVisibility);

    if (saved.columnOrder) table.setColumnOrder(saved.columnOrder);

    if (saved.columnSizing) table.setColumnSizing(saved.columnSizing);

    if (saved.columnPinning) table.setColumnPinning(saved.columnPinning);

    if (saved.density) restoreDensity(saved.density);
  }, [table, key, version]);

  // Save on change, debounced — resizing fires on every pointer move.
  React.useEffect(() => {
    if (!key) return;

    const pick = () => {
      const s = table.store.state;

      return {
        sorting: s.sorting,
        columnVisibility: s.columnVisibility,
        columnOrder: s.columnOrder,
        columnSizing: s.columnSizing,
        columnPinning: s.columnPinning,
      };
    };

    let last = pick();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const flush = () => {
      timer = undefined;
      writeStoredTableState(key, version, last);
    };

    const unsubscribe = subscribeTable(table, () => {
      const next = pick();

      const changed = (
        [
          "sorting",
          "columnVisibility",
          "columnOrder",
          "columnSizing",
          "columnPinning",
        ] as const
      ).some((k) => next[k] !== last[k]);

      if (!changed) return;
      last = next;
      clearTimeout(timer);
      timer = setTimeout(flush, PERSIST_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();

      if (timer) {
        clearTimeout(timer);
        flush(); // don't drop the last change on unmount
      }
    };
  }, [table, key, version]);
}

function describeChange<TData extends RowData>(
  table: DTTable<TData>,
  prev: DTState,
  next: DTState,
  columnLabels?: Readonly<Record<string, string>>,
): string | null {
  if (next.sorting !== prev.sorting) {
    const s = next.sorting[0];

    if (!s) return "Sorting cleared";

    return `Sorted by ${columnLabel(table.getColumn(s.id), columnLabels)}, ${s.desc ? "descending" : "ascending"}`;
  }

  if (
    next.columnFilters !== prev.columnFilters ||
    next.globalFilter !== prev.globalFilter
  ) {
    const n = table.options.rowCount ?? table.getFilteredRowModel().rows.length;

    return `${n} ${n === 1 ? "result" : "results"}`;
  }

  if (next.pagination.pageIndex !== prev.pagination.pageIndex) {
    return `Page ${next.pagination.pageIndex + 1} of ${Math.max(1, table.getPageCount())}`;
  }

  return null;
}

interface DataTableProps<TData extends RowData, TValue> {
  columns: DTColumnDef<TData, TValue>[];
  data: TData[];
  children: React.ReactNode;
  /** Stable row ids — strongly recommended. Defaults to the array index. */
  getRowId?: (row: TData, index: number, parent?: DTRow<TData>) => string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean | ((row: DTRow<TData>) => boolean);
  enableColumnPinning?: boolean;
  enableColumnResizing?: boolean;
  enableExpanding?: boolean;
  enableGrouping?: boolean;
  enableVirtualization?: boolean;
  enableKeyboardNavigation?: boolean;
  announceChanges?: boolean;
  density?: DataTableDensity;
  initialPageSize?: number;
  serverPagination?: {
    state: PaginationState;
    rowCount: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  initialSorting?: SortingState;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  manualSorting?: boolean;
  initialColumnPinning?: Partial<ColumnPinningState>;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  onRowClick?: (row: DTRow<TData>) => void;
  pendingRowIds?: ReadonlySet<string>;
  getSubRows?: (originalRow: TData) => TData[] | undefined;
  getRowCanExpand?: (row: DTRow<TData>) => boolean;
  /** Initial virtual row height guess; defaults to a density-based estimate. */
  estimateRowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  /** True while refetching with previous rows still on screen. */
  isFetching?: boolean;
  hasNextPage?: boolean;
  error?: React.ReactNode;
  onRetry?: () => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  searchQuery?: string;
  /** Persist density, sorting and column visibility/order/sizing/pinning. */
  persistStateKey?: string;
  persistStateVersion?: number;
}

function DataTableRoot<TData extends RowData, TValue>(
  input0: DataTableProps<TData, TValue>,
) {
  const state0 = useDataTableSetup<TData, TValue>(input0);
  const state1 = useDataTableState2<TData, TValue>(state0);
  const state2 = useDataTableActions<TData, TValue>(state1);

  return renderDataTable<TData, TValue>(state2);
}

interface DataTableSearchProps {
  columnKey?: string;
  placeholder?: string;
  globalSearch?: boolean;
  className?: string;
}

function DataTableSearch({
  columnKey,
  placeholder = "Search...",
  globalSearch = false,
  className,
}: DataTableSearchProps) {
  "use no memo";

  const { table } = useDataTable();
  const state = useTableState(table);

  const column =
    !globalSearch && columnKey ? table.getColumn(columnKey) : undefined;

  if (!globalSearch && !column) return null;

  const value = getDataTableSearchValue(globalSearch, state, column);

  return (
    <Input
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        updateDataTableSearch(globalSearch, table, column, e.target.value)
      }
      className={cn("max-w-sm", className)}
    />
  );
}

function getDataTableSearchValue(
  globalSearch: boolean,
  state: ReturnType<typeof useTableState>,
  column: ReturnType<DTTable<RowData>["getColumn"]>,
) {
  return globalSearch
    ? String(state.globalFilter ?? "")
    : String(column?.getFilterValue() ?? "");
}

function updateDataTableSearch<TData extends RowData>(
  globalSearch: boolean,
  table: DTTable<TData>,
  column: ReturnType<DTTable<TData>["getColumn"]>,
  value: string,
) {
  if (globalSearch) table.setGlobalFilter(value);
  else column?.setFilterValue(value || undefined);
}

type GridPos = { rowIndex: number; colIndex: number };

const PAGE_STEP = 10;

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

function useGridNavigation({
  enabled,
  rowCount,
  colCount,
  tableRef,
  scrollToRow,
}: {
  enabled: boolean;
  rowCount: number;
  colCount: number;
  tableRef: React.RefObject<HTMLTableElement | null>;
  scrollToRow?: (rowIndex: number) => void;
}) {
  // Start on the first cell so Tab can always enter the grid.
  const [active, setActive] = React.useState<GridPos>({
    rowIndex: 0,
    colIndex: 0,
  });

  // Clamp during render: a shrinking page/filter must never leave the grid
  // without a tab stop.
  const activeRow = clamp(active.rowIndex, 0, Math.max(rowCount - 1, 0));
  const activeCol = clamp(active.colIndex, 0, Math.max(colCount - 1, 0));

  const focusCell = (rowIndex: number, colIndex: number) => {
    const r = clamp(rowIndex, 0, rowCount - 1);
    const c = clamp(colIndex, 0, colCount - 1);
    setActive({ rowIndex: r, colIndex: c });
    scrollToRow?.(r);
    // The target may not be mounted yet (virtualized / just scrolled).
    requestAnimationFrame(() => {
      tableRef.current
        ?.querySelector<HTMLElement>(`[data-grid-cell="${r}:${c}"]`)
        ?.focus();
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    if (!enabled || rowCount === 0) return;
    // SAFETY: keyboard events inside the table always target an HTMLElement.
    const target = event.target as HTMLElement;

    if (handleGridEscape(event, target)) {
      return;
    }

    // Never hijack keys while a child control (input, button, menu) has focus.
    if (!target.matches("[data-grid-cell]")) return;

    if (handleGridCellEntry(event, target)) {
      return;
    }

    const next = gridKeyDestination(
      event.key,
      event.ctrlKey || event.metaKey,
      activeRow,
      activeCol,
      rowCount,
      colCount,
    );

    if (!next) return;

    event.preventDefault();
    focusCell(next[0], next[1]);
  };

  return { activeRow, activeCol, setActive, onKeyDown };
}

function handleGridEscape(
  event: React.KeyboardEvent<HTMLTableElement>,
  target: HTMLElement,
) {
  if (event.key !== "Escape" || target.matches("[data-grid-cell]")) {
    return false;
  }

  target.closest<HTMLElement>("[data-grid-cell]")?.focus();

  return true;
}

function handleGridCellEntry(
  event: React.KeyboardEvent<HTMLTableElement>,
  target: HTMLElement,
) {
  if (event.key !== "Enter" && event.key !== "F2") {
    return false;
  }

  const widget = target.querySelector<HTMLElement>(INTERACTIVE_SELECTOR);

  if (widget) {
    event.preventDefault();
    widget.focus();
  }

  return true;
}

type DataTableEmptyReason = "no-data" | "no-results" | "error";

interface DataTableEmptyContext {
  reason: DataTableEmptyReason;
  query?: string;
  onReset?: () => void;
  onRetry?: () => void;
}

interface DataTableContentProps<TData extends RowData> {
  renderSubComponent?: (props: { row: DTRow<TData> }) => React.ReactNode;
  stickyHeader?: boolean;
  expandOnRowClick?: boolean;
  enableReordering?: boolean;
  onReorder?: (newOrder: string[]) => void;
  density?: DataTableDensity;
  emptyState?:
    React.ReactNode | ((context: DataTableEmptyContext) => React.ReactNode);
  striped?: boolean;
  bordered?: boolean;
  /** Accessible name for the table's scroll region. */
  label?: string;
  /** Switch between semantic <table> and accessible card list rendering. */
  view?: "table" | "cards";
  /** Custom card renderer when view="cards". Falls back to visible cells. */
  renderCard?: (row: DTRow<TData>) => React.ReactNode;
  /** Show a labeled "Sort by" selector above the list when view="cards". */
  showCardSort?: boolean;
  /** Explicit skeleton row/card count during initial load. Defaults to pageSize. */
  skeletonRows?: number;
  className?: string;
  containerClassName?: string;
}

interface DataTableFrameProps<TData extends RowData> {
  content: DataTableContentProps<TData>;
  isGrid: boolean;
  rowCount: number;
  tableRef: React.RefObject<HTMLTableElement | null>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTableElement>;
  containerRef?: React.Ref<HTMLDivElement>;
  containerStyle?: React.CSSProperties;
  forceStickyHeader?: boolean;
  isFetching?: boolean;
  children: React.ReactNode;
}

function buildColumnSizeStyle<TData extends RowData>(
  table: DTTable<TData>,
  resizable: boolean,
): React.CSSProperties & Record<`--${string}`, number | undefined> {
  const style: React.CSSProperties & Record<`--${string}`, number | undefined> =
    {};

  for (const header of table.getFlatHeaders()) {
    style[`--header-${cssId(header.id)}-size`] = header.getSize();
    style[`--col-${cssId(header.column.id)}-size`] = header.column.getSize();
  }

  if (resizable) {
    Object.assign(style, {
      width: table.getTotalSize(),
      minWidth: "100%",
      tableLayout: "fixed",
    });
  }

  return style;
}

function DataTableFrame<TData extends RowData>({
  content,
  isGrid,
  rowCount,
  tableRef,
  onKeyDown,
  containerRef,
  containerStyle,
  forceStickyHeader = false,
  isFetching = false,
  children,
}: DataTableFrameProps<TData>) {
  "use no memo";

  const { table, density: ctxDensity } = useDataTable<TData>();
  const density = content.density ?? ctxDensity;
  const sticky = forceStickyHeader || Boolean(content.stickyHeader);
  const resizable = Boolean(table.options.enableColumnResizing);
  const headerGroups = table.getHeaderGroups();
  const style = buildColumnSizeStyle(table, resizable);
  const useDefaultMaxHeight = sticky && !containerStyle?.height;

  return (
    // kira-kit-ignore arbitrary-values: 600px scroll viewport bound for the table body
    <Table
      ref={tableRef}
      density={DENSITY_TO_TABLE[density]}
      striped={content.striped}
      bordered={content.bordered}
      stickyHeader={sticky}
      label={content.label}
      isGrid={isGrid}
      aria-busy={isFetching || undefined}
      ariaRowCount={rowCount + headerGroups.length}
      ariaColCount={table.getVisibleLeafColumns().length}
      onKeyDown={onKeyDown}
      containerRef={containerRef}
      containerStyle={containerStyle}
      containerClassName={cn(
        "rounded-lg border border-border",
        useDefaultMaxHeight && "max-h-[600px]",
        content.containerClassName,
      )}
      className={cn(density === "compact" && "text-xs", content.className)}
      style={style}
    >
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id} isGridRow={isGrid}>
            {headerGroup.headers.map((header) => (
              <DataTableHeadCell
                key={header.id}
                header={header}
                isGrid={isGrid}
                isResizable={resizable}
              />
            ))}
          </TableRow>
        ))}
      </TableHeader>
      {children}
    </Table>
  );
}

function DataTableHeadCell<TData extends RowData>({
  header,
  isGrid,
  isResizable = false,
}: {
  header: DTHeader<TData>;
  isGrid: boolean;
  isResizable?: boolean;
}) {
  "use no memo";

  const resolveAriaSort1 = () => {
    if (sorted === "asc") {
      return "ascending" as const;
    }

    if (sorted === "desc") {
      return "descending" as const;
    }

    return undefined;
  };

  const column = header.column;
  const sorted = column.getIsSorted();

  return (
    <TableHead
      colSpan={header.colSpan}
      isGridCell={isGrid}
      ariaSort={resolveAriaSort1()}
      {...pinProps(column)}
      className="group relative"
      style={{ width: `calc(var(--header-${cssId(header.id)}-size) * 1px)` }}
    >
      <div
        className={cn(
          "min-w-0",
          isResizable && "overflow-hidden text-ellipsis",
        )}
      >
        {header.isPlaceholder ? null : <FlexRender header={header} />}
      </div>
      {column.getCanResize() && <DataTableResizeHandle header={header} />}
    </TableHead>
  );
}

interface DataTableRowProps<TData extends RowData> {
  row: DTRow<TData>;
  rowIndex: number;
  isGrid: boolean;
  activeRow: number;
  activeCol: number;
  onCellFocus?: (pos: GridPos) => void;
  expandOnRowClick: boolean;
  renderSubComponent?: (props: { row: DTRow<TData> }) => React.ReactNode;
  ariaRowIndex?: number;
  rowRef?: React.Ref<HTMLTableRowElement>;
  rowStyle?: React.CSSProperties;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  isResizable?: boolean;
  stickyHeader?: boolean;
  isPending?: boolean;
  onRowClick?: (row: DTRow<TData>) => void;
}

function DataTableRow<TData extends RowData>({
  row,
  rowIndex,
  isGrid,
  activeRow,
  activeCol,
  onCellFocus,
  expandOnRowClick,
  renderSubComponent,
  ariaRowIndex,
  rowRef,
  rowStyle,
  isDragging = false,
  dragHandleProps,
  isResizable = false,
  stickyHeader = false,
  isPending = false,
  onRowClick,
}: DataTableRowProps<TData>) {
  "use no memo";

  const cells = row.getVisibleCells();
  const clickToExpand = expandOnRowClick && row.getCanExpand();
  // Explicit parity: sub-rows and virtual spacers would break nth-child.
  const stripe = rowIndex % 2 === 1 ? "even" : "odd";

  return (
    <>
      {renderDataTableRowSectionPart1({
        rowRef,
        rowStyle,
        stripe,
        row,
        isGrid,
        ariaRowIndex,
        clickToExpand,
        isDragging,
        cells,
        rowIndex,
        activeRow,
        activeCol,
        onCellFocus,
        dragHandleProps,
        isResizable,
        stickyHeader,
        isPending,
        onRowClick,
      })}
      {row.getIsExpanded() && renderSubComponent && (
        <TableRow stripe={stripe}>
          <TableCell colSpan={cells.length} className="bg-muted/30">
            {renderSubComponent({ row })}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function resolveDataTableEmptyReason<TData extends RowData>(
  ctx: DataTableContextValue<TData>,
): DataTableEmptyReason {
  if (ctx.error) return "error";

  const state = ctx.table.store.state;

  const hasTableFilters =
    ctx.hasActiveFilters ||
    state.columnFilters.length > 0 ||
    Boolean(String(state.globalFilter ?? "").trim());

  return hasTableFilters ? "no-results" : "no-data";
}

function resolveDataTableEmptyNode<TData extends RowData>(
  emptyState: DataTableContentProps<TData>["emptyState"],
  ctx: DataTableContextValue<TData>,
): React.ReactNode {
  const reason = resolveDataTableEmptyReason(ctx);

  const emptyContext: DataTableEmptyContext = {
    reason,
    query: ctx.searchQuery,
    onReset: ctx.onResetFilters,
    onRetry: ctx.onRetry,
  };

  if (isFunctionProp(emptyState)) {
    return emptyState(emptyContext);
  }

  if (emptyState !== undefined && emptyState !== null) {
    return emptyState;
  }

  if (reason === "error") {
    return (
      <KiraEmpty
        size="sm"
        state="error"
        description={isStringProp(ctx.error) ? ctx.error : undefined}
        primaryAction={
          ctx.onRetry ? { label: "Retry", onClick: ctx.onRetry } : undefined
        }
      />
    );
  }

  if (reason === "no-results") {
    return (
      <KiraEmpty
        size="sm"
        state="no-results"
        query={ctx.searchQuery}
        primaryAction={
          ctx.onResetFilters
            ? { label: "Reset filters", onClick: ctx.onResetFilters }
            : undefined
        }
      />
    );
  }

  return <KiraEmpty size="sm" state="no-data" />;
}

function DataTableEmptyRow<TData extends RowData>({
  colSpan,
  emptyState,
}: {
  colSpan: number;
  emptyState?: DataTableContentProps<TData>["emptyState"];
}) {
  "use no memo";

  const ctx = useDataTable<TData>();

  return (
    <tr>
      <TableCell
        colSpan={colSpan}
        className="p-0 text-center whitespace-normal"
      >
        {resolveDataTableEmptyNode(emptyState, ctx)}
      </TableCell>
    </tr>
  );
}

function DataTableInlineErrorBanner({
  error,
  onRetry,
}: {
  error: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div
      data-slot="data-table-error"
      role="alert"
      className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <div className="flex min-w-0 items-center gap-2">
        <IconAlertCircle className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 wrap-anywhere">{error}</span>
      </div>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0 pointer-coarse:min-h-11"
        >
          <IconRefresh className="size-4" aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  );
}

function DataTableSkeletonBody({
  rows,
  colCount,
}: {
  rows: number;
  colCount: number;
}) {
  return (
    <TableBody aria-hidden="true" data-slot="data-table-skeleton-body">
      {Array.from({ length: rows }, (_, r) => (
        <TableRow key={`sk-row-${r}`}>
          {Array.from({ length: colCount }, (__, c) => (
            <TableCell key={`sk-cell-${r}-${c}`}>
              <div
                className="h-4 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none"
                style={{
                  width: `${SKELETON_WIDTHS[(r + c) % SKELETON_WIDTHS.length]}%`,
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

interface DataTableRowsProps<TData extends RowData> {
  rows: DTRow<TData>[];
  colCount: number;
  isGrid: boolean;
  activeRow: number;
  activeCol: number;
  onCellFocus: (pos: GridPos) => void;
  expandOnRowClick: boolean;
  renderSubComponent?: (props: { row: DTRow<TData> }) => React.ReactNode;
  emptyState?: DataTableContentProps<TData>["emptyState"];
  isResizable?: boolean;
  stickyHeader?: boolean;
  isRefetching?: boolean;
  pendingRowIds?: ReadonlySet<string>;
  onRowClick?: (row: DTRow<TData>) => void;
}

function DataTableRows<TData extends RowData>({
  rows,
  colCount,
  emptyState,
  isRefetching = false,
  pendingRowIds,
  ...rowProps
}: DataTableRowsProps<TData>) {
  return (
    <TableBody
      className={cn(
        isRefetching && "opacity-60 motion-safe:transition-opacity",
      )}
    >
      {rows.length ? (
        rows.map((row, i) => (
          <DataTableRow
            key={row.id}
            row={row}
            rowIndex={i}
            isPending={Boolean(pendingRowIds?.has(row.id))}
            {...rowProps}
          />
        ))
      ) : (
        <DataTableEmptyRow colSpan={colCount} emptyState={emptyState} />
      )}
    </TableBody>
  );
}

// Only used *while resizing* (TanStack's recommended pattern): selection and
// expansion don't change row-model identity, so an always-on memo would paint
// stale checkboxes. SAFETY: React.memo returns Exactly<T> at runtime; the cast
// hides only the wrapper's call signature, keeping JSX usage unchanged.
const DataTableRowsMemo = React.memo(DataTableRows) as typeof DataTableRows;

function DataTableContent<TData extends RowData>(
  props: DataTableContentProps<TData>,
) {
  const { enableVirtualization } = useDataTable<TData>();

  if (props.view === "cards") return <DataTableCardList {...props} />;

  if (enableVirtualization) return <DataTableVirtualContent {...props} />;

  if (props.enableReordering) return <DataTableReorderableContent {...props} />;

  return <DataTableStaticContent {...props} />;
}

function resolveStaticLoadFlags(
  isLoading: boolean,
  isFetching: boolean,
  rowCount: number,
  pageSize: number,
  skeletonRows?: number,
) {
  const showInitialSkeleton = isLoading && rowCount === 0;
  const isRefetching = (isFetching || isLoading) && rowCount > 0;

  return {
    showInitialSkeleton,
    isRefetching,
    isBusy: isRefetching || showInitialSkeleton,
    skeletonCount: skeletonRows ?? Math.max(1, Math.min(pageSize, 12)),
  };
}

function DataTableRefetchBar({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      data-slot="data-table-refetch-bar"
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1 overflow-hidden rounded-t-lg bg-primary/20"
    >
      <div className="h-full w-1/2 bg-primary animate-shimmer motion-reduce:animate-none" />
    </div>
  );
}

function DataTableStaticContent<TData extends RowData>(
  props: DataTableContentProps<TData>,
) {
  "use no memo";

  const {
    table,
    enableKeyboardNavigation,
    isLoading,
    isFetching,
    error,
    onRetry,
    onRowClick,
    pendingRowIds,
  } = useDataTable<TData>();

  const state = useTableState(table);
  const rows = table.getRowModel().rows;
  const colCount = table.getVisibleLeafColumns().length;
  const tableRef = React.useRef<HTMLTableElement>(null);

  const nav = useGridNavigation({
    enabled: enableKeyboardNavigation,
    rowCount: rows.length,
    colCount,
    tableRef,
  });

  const isResizable = Boolean(table.options.enableColumnResizing);

  const isResizing = table
    .getVisibleLeafColumns()
    .some((c) => c.getIsResizing());

  const Rows = isResizing ? DataTableRowsMemo : DataTableRows;

  const load = resolveStaticLoadFlags(
    isLoading,
    isFetching,
    rows.length,
    state.pagination.pageSize,
    props.skeletonRows,
  );

  return (
    <div data-slot="data-table-content" className="relative min-w-0">
      {error && rows.length > 0 && (
        <DataTableInlineErrorBanner error={error} onRetry={onRetry} />
      )}
      <DataTableRefetchBar visible={load.isRefetching} />
      <DataTableFrame
        content={props}
        isGrid={enableKeyboardNavigation}
        rowCount={rows.length}
        tableRef={tableRef}
        onKeyDown={nav.onKeyDown}
        isFetching={load.isBusy}
      >
        {load.showInitialSkeleton ? (
          <DataTableSkeletonBody
            rows={load.skeletonCount}
            colCount={colCount}
          />
        ) : (
          <Rows
            rows={rows}
            colCount={colCount}
            isGrid={enableKeyboardNavigation}
            activeRow={nav.activeRow}
            activeCol={nav.activeCol}
            onCellFocus={nav.setActive}
            expandOnRowClick={Boolean(props.expandOnRowClick)}
            renderSubComponent={props.renderSubComponent}
            emptyState={props.emptyState}
            isResizable={isResizable}
            stickyHeader={Boolean(props.stickyHeader)}
            isRefetching={load.isRefetching}
            pendingRowIds={pendingRowIds}
            onRowClick={onRowClick}
          />
        )}
      </DataTableFrame>
    </div>
  );
}

const LOAD_MORE_THRESHOLD = 5;

function useStickyHeaderHeight(
  tableRef: React.RefObject<HTMLTableElement | null>,
) {
  const [headerHeight, setHeaderHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const thead = tableRef.current?.tHead;

    if (!thead) return;

    const observer = new ResizeObserver(() =>
      setHeaderHeight(thead.offsetHeight),
    );

    observer.observe(thead);

    return () => observer.disconnect();
  }, [tableRef]);

  return headerHeight;
}

function measureVisibleVirtualizerViewport(
  element: HTMLDivElement | null,
  virtualizer: ReturnType<
    typeof useVirtualizer<HTMLDivElement, Element>
  > | null,
) {
  if (!element || !virtualizer) return element;

  const rect = element.getBoundingClientRect();

  const next = {
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };

  const previous = virtualizer.scrollRect;

  if (
    previous &&
    (previous.width !== next.width || previous.height !== next.height) &&
    next.height > 0
  ) {
    virtualizer.scrollRect = next;
    virtualizer.measure();
  }

  return element;
}

function DataTableVirtualContent<TData extends RowData>(
  props: DataTableContentProps<TData>,
) {
  // TanStack Virtual exposes mutable methods; React Compiler must not memoize their results.
  "use no memo";

  const ctx = useDataTable<TData>();

  const {
    table,
    containerHeight,
    isLoading,
    hasNextPage,
    enableKeyboardNavigation,
  } = ctx;

  useTableState(table);

  const density = props.density ?? ctx.density;
  const rows = table.getRowModel().rows;
  const colCount = table.getVisibleLeafColumns().length;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const virtualizerRef = React.useRef<DataTableVirtualizer | null>(null);

  // Sticky header height, so scrollToIndex doesn't park rows under it.
  const headerHeight = useStickyHeaderHeight(tableRef);

  // oxlint-disable-next-line react/incompatible-library -- TanStack Virtual exposes mutable getters; this caller uses the documented use no memo compiler opt-out to preserve live measurements.
  const virtualizer = useVirtualizer({
    count: rows.length,
    // getScrollElement is re-called on every render (_willUpdate): re-read
    // the rect each time so a container that just became visible (hidden tab
    // panel, expanded accordion) reports its real size without waiting for a
    // ResizeObserver tick, which may never come in background pages.
    getScrollElement: () =>
      measureVisibleVirtualizerViewport(
        scrollRef.current,
        virtualizerRef.current,
      ),
    estimateSize: () => ctx.estimateRowHeight ?? DENSITY_ROW_ESTIMATE[density],
    getItemKey: (index) => rows[index]?.id ?? index,
    scrollPaddingStart: headerHeight,
    overscan: 10,
  });

  // SAFETY: the instance is stable across renders (useVirtualizer returns the
  // same object); the ref only lets getScrollElement refresh its cached rect.
  virtualizerRef.current = virtualizer;

  // Density changes every row height — drop cached measurements.
  React.useEffect(() => {
    virtualizer.measure();
  }, [virtualizer, density]);

  const items = virtualizer.getVirtualItems();
  const paddingTop = items[0]?.start ?? 0;

  const paddingBottom = items.length
    ? virtualizer.getTotalSize() - items[items.length - 1].end
    : 0;

  // Infinite loading keyed off the rendered range, not a raw scroll listener.
  const lastIndex = items.at(-1)?.index ?? -1;
  const loadMore = React.useEffectEvent(() => ctx.onLoadMore?.());
  React.useEffect(() => {
    if (!hasNextPage || isLoading || rows.length === 0) return;

    if (lastIndex >= rows.length - 1 - LOAD_MORE_THRESHOLD) loadMore();
  }, [lastIndex, rows.length, hasNextPage, isLoading]);

  const nav = useGridNavigation({
    enabled: enableKeyboardNavigation,
    rowCount: rows.length,
    colCount,
    tableRef,
    scrollToRow: (index) => virtualizer.scrollToIndex(index, { align: "auto" }),
  });

  return renderDataTableVirtualView({
    props,
    enableKeyboardNavigation,
    rows,
    tableRef,
    nav,
    scrollRef,
    containerHeight,
    paddingTop,
    spacer: (height) => renderDataTableVirtualSpacer(height, colCount),
    items,
    virtualizer,
    table,
    paddingBottom,
    isLoading,
    colCount,
  });
}

function renderDataTableVirtualSpacer(height: number, colCount: number) {
  return (
    <tbody aria-hidden="true">
      <tr>
        <td
          aria-hidden="true"
          colSpan={colCount}
          style={{ height, padding: 0, border: 0 }}
        />
      </tr>
    </tbody>
  );
}

function DataTableReorderableContent<TData extends RowData>(
  props: DataTableContentProps<TData>,
) {
  "use no memo";

  const { table, enableKeyboardNavigation } = useDataTable<TData>();
  const state = useTableState(table);

  const rows = table.getRowModel().rows;
  const colCount = table.getVisibleLeafColumns().length;
  const tableRef = React.useRef<HTMLTableElement>(null);

  // Local order resets when the underlying rows change (adjust-during-render,
  // replacing the old sync-in-effect).
  const rowIds = rows.map((r) => r.id);
  const rowKey = rowIds.join("\u0000");
  const [order, setOrder] = React.useState(rowIds);
  const [prevKey, setPrevKey] = React.useState(rowKey);

  if (rowKey !== prevKey) {
    setPrevKey(rowKey);
    setOrder(rowIds);
  }

  const rowById = new Map(rows.map((r) => [r.id, r]));

  const orderedRows = order
    .map((id) => rowById.get(id))
    .filter((r): r is DTRow<TData> => r !== undefined);

  // Manual order is meaningless while a column sort is applied.
  const dragDisabled = state.sorting.length > 0;

  const nav = useGridNavigation({
    enabled: enableKeyboardNavigation,
    rowCount: orderedRows.length,
    colCount,
    tableRef,
  });

  const sensors = useSensors(
    // Small distance so clicks on cells still register as clicks.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = order.indexOf(String(active.id));
    const to = order.indexOf(String(over.id));

    if (from < 0 || to < 0) return;
    const next = arrayMove(order, from, to);
    // Outside the updater: StrictMode double-invokes updaters.
    setOrder(next);
    props.onReorder?.(next);
  };

  return (
    // DndContext renders live-region <div>s — it must sit outside <table>.
    <RenderDataTableReorderableContentSectionPart3
      {...{
        sensors,
        handleDragEnd,
        props,
        enableKeyboardNavigation,
        orderedRows,
        tableRef,
        nav,
        order,
        dragDisabled,
        colCount,
      }}
    />
  );
}

function DataTableSortableRow<TData extends RowData>({
  disabled,
  ...rowProps
}: Omit<
  DataTableRowProps<TData>,
  "rowRef" | "rowStyle" | "isDragging" | "dragHandleProps"
> & {
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowProps.row.id,
    disabled,
  });

  return (
    // Uses TableRow (via DataTableRow), so pinned cells follow hover/selection —
    // the raw <tr> here was why pinned cells ignored row state in reorder mode.
    <DataTableRow
      {...rowProps}
      rowRef={setNodeRef}
      // Translate (not Transform): scaling distorts table rows of uneven height.
      rowStyle={{ transform: CSS.Translate.toString(transform), transition }}
      isDragging={isDragging}
      dragHandleProps={{
        ...attributes,
        ...listeners,
        "aria-label": "Drag to reorder row",
      }}
    />
  );
}

interface DataTableCountProps {
  className?: string;
}

function DataTablePageCount({ className }: DataTableCountProps = {}) {
  "use no memo";

  const { table } = useDataTable();
  const state = useTableState(table);

  return (
    <div
      data-slot="data-table-page-count"
      className={cn(
        "shrink-0 whitespace-nowrap text-sm tabular-nums text-muted-foreground",
        className,
      )}
    >
      Page {state.pagination.pageIndex + 1} of{" "}
      {Math.max(1, table.getPageCount())}
    </div>
  );
}

function DataTableRowCount({ className }: DataTableCountProps = {}) {
  "use no memo";

  const { table } = useDataTable();
  useTableState(table);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const totalCount =
    table.options.rowCount ?? table.getFilteredRowModel().rows.length;

  return (
    <div
      data-slot="data-table-row-count"
      className={cn(
        "shrink-0 whitespace-nowrap text-sm tabular-nums text-muted-foreground",
        className,
      )}
    >
      {selectedCount > 0
        ? `${selectedCount} of ${totalCount} row(s) selected`
        : `${totalCount} row(s)`}
    </div>
  );
}

interface DataTablePaginationProps {
  showPageSize?: boolean;
  pageSizeOptions?: readonly number[];
  showPageInfo?: boolean;
  infoFormat?: string;
  showJump?: boolean;
  showPreviousNextText?: boolean;
  showFirstLast?: boolean;
  variant?: "default" | "outline" | "ghost" | "pills" | "rounded";
  size?: "sm" | "default" | "lg";
  className?: string;
}

function DataTablePagination(input: DataTablePaginationProps) {
  "use no memo";

  const {
    showPageSize,
    pageSizeOptions,
    showPageInfo,
    infoFormat,
    showJump,
    showFirstLast,
    showPreviousNextText,
    variant,
    size,
    className,
  } = resolveComponentDefaults(input, DATA_TABLE_PAGINATION_DEFAULTS_1);

  const { table, enablePagination } = useDataTable();
  const { pagination } = useTableState(table);

  if (!enablePagination) return null;

  return (
    <KiraPagination
      page={pagination.pageIndex + 1}
      pageSize={pagination.pageSize}
      total={table.options.rowCount ?? table.getFilteredRowModel().rows.length}
      onPaginationChange={({ page, pageSize }) => {
        table.setPagination({ pageIndex: page - 1, pageSize });
      }}
      showSizeSelector={showPageSize}
      pageSizeOptions={pageSizeOptions}
      showInfo={showPageInfo}
      infoFormat={infoFormat}
      showJump={showJump}
      infoMobileCompact
      showEdges={showFirstLast}
      showLabels={showPreviousNextText}
      aria-label="Pagination"
      variant={variant}
      size={size}
      className={cn("w-auto flex-1", className)}
    />
  );
}

interface DataTableColumnHeaderProps<
  TData extends RowData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: DTColumn<TData, TValue>;
  title: string;
  showPinning?: boolean;
}

function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
  showPinning = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  "use no memo";

  const tableContext = React.useContext(DataTableContext);
  const registerColumnLabel = tableContext?.registerColumnLabel;

  React.useEffect(() => {
    if (registerColumnLabel && title.trim()) {
      registerColumnLabel(column.id, title);
    }
  }, [registerColumnLabel, column.id, title]);

  const resolveNext3 = () => {
    if (sorted === false) {
      return "ascending" as const;
    }

    if (sorted === "asc") {
      return "descending" as const;
    }

    return "none" as const;
  };

  const resolveValue4 = () => {
    if (sorted === "desc") {
      return <IconChevronDown className="size-4" aria-hidden="true" />;
    }

    if (sorted === "asc") {
      return <IconChevronUp className="size-4" aria-hidden="true" />;
    }

    return <IconSelector className="size-4 opacity-50" aria-hidden="true" />;
  };

  const sorted = column.getIsSorted();

  const pinMenu = showPinning && column.getCanPin() && (
    <DataTableColumnPinningMenu column={column} />
  );

  if (!column.getCanSort()) {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        <span className="truncate">{title}</span>
        {pinMenu}
      </div>
    );
  }

  const handleSort = () => {
    if (sorted === false) column.toggleSorting(false);
    else if (sorted === "asc") column.toggleSorting(true);
    else column.clearSorting();
  };

  // The <th> carries aria-sort; the button's name says what clicking does next.
  const next = resolveNext3();

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleSort}
        aria-label={`${title}, sort ${next === "none" ? "off" : next}`}
        className="-ml-3 flex min-w-0 max-w-full items-center gap-1 rounded-md px-3 py-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="truncate">{title}</span>
        <span className="shrink-0">{resolveValue4()}</span>
      </button>
      {pinMenu}
    </div>
  );
}

const RESIZE_STEP = 5;

function DataTableResizeHandle<TData extends RowData, TValue>({
  header,
}: {
  header: DTHeader<TData, TValue>;
}) {
  "use no memo";

  const tableContext = React.useContext(DataTableContext);
  const column = header.column;
  const { table } = header.getContext();
  const size = Math.round(header.getSize());
  const minSize = column.columnDef.minSize ?? 20;
  const maxSize = column.columnDef.maxSize ?? 1000;

  const resizeTo = (target: number) => {
    const clamped = Math.round(clamp(target, minSize, maxSize));
    table.setColumnSizing((prev) => ({ ...prev, [column.id]: clamped }));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        resizeTo(size - RESIZE_STEP);
        break;
      case "ArrowRight":
        resizeTo(size + RESIZE_STEP);
        break;
      case "Home":
        resizeTo(minSize);
        break;
      case "End":
        resizeTo(maxSize);
        break;
      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This compound divider preserves its div styling and inherited DOM contract while exposing separator semantics.
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${columnLabel(column, tableContext?.columnLabels)} column`}
      aria-valuenow={size}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      aria-valuetext={`${size} pixels`}
      tabIndex={0}
      onPointerDown={header.getResizeHandler()}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => column.resetSize()}
      className={cn(
        "absolute right-0 top-0 z-10 h-full w-2 cursor-col-resize touch-none select-none",
        "after:absolute after:right-0.75 after:top-0 after:h-full after:w-px after:bg-border",
        "hover:after:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:after:bg-primary",
        column.getIsResizing() && "after:bg-primary",
      )}
    />
  );
}

function DataTableColumnPinningMenu<TData extends RowData, TValue>({
  column,
}: {
  column: DTColumn<TData, TValue>;
}) {
  "use no memo";

  const tableContext = React.useContext(DataTableContext);
  const pinned = column.getIsPinned(); // "start" | "end" | false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${columnLabel(column, tableContext?.columnLabels)} column options`}
            // Visible on hover, keyboard focus, while open, and always on touch
            // screens (no hover there).
            className="rounded p-1 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 pointer-coarse:opacity-100"
          >
            <IconDotsVertical className="size-4" aria-hidden="true" />
          </button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => column.pin(pinned === "start" ? false : "start")}
        >
          {pinned === "start" ? (
            <IconPinFilled className="mr-2 size-4" />
          ) : (
            <IconPin className="mr-2 size-4" />
          )}
          {pinned === "start" ? "Unpin from left" : "Pin to left"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => column.pin(pinned === "end" ? false : "end")}
        >
          {pinned === "end" ? (
            <IconPinFilled className="mr-2 size-4" />
          ) : (
            <IconPin className="mr-2 size-4" />
          )}
          {pinned === "end" ? "Unpin from right" : "Pin to right"}
        </DropdownMenuItem>
        {pinned && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.pin(false)}>
              <IconPinnedOff className="mr-2 size-4" />
              Unpin
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function createSelectColumn<TData extends RowData>(): DTColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected();
      // v9: "some" now means "at least one" — gate on !all for indeterminate.
      const some = !all && table.getIsSomePageRowsSelected();

      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={some ? "indeterminate" : all}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked)
            }
            aria-label="Select all rows on this page"
          />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          // v9's handler does Shift+click range selection; Base UI exposes the
          // native event on eventDetails.
          onCheckedChange={(_checked: boolean, details?: { event?: Event }) =>
            row.getToggleSelectedHandler()(details?.event)
          }
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 48,
    minSize: 48,
    maxSize: 48,
  };
}

function createExpandColumn<TData extends RowData>(): DTColumnDef<TData> {
  return {
    id: "expand",
    header: () => <span className="sr-only">Expand</span>,
    cell: ({ row }) => {
      if (!row.getCanExpand()) return null;
      const isExpanded = row.getIsExpanded();

      return (
        <div className="flex w-full items-center justify-center">
          <button
            type="button"
            onClick={row.getToggleExpandedHandler()}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse row" : "Expand row"}
            className="rounded p-1 transition-colors hover:bg-muted"
          >
            <IconChevronRight
              aria-hidden="true"
              className={cn(
                "size-4 text-muted-foreground motion-safe:transition-transform",
                isExpanded && "rotate-90",
              )}
            />
          </button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 48,
    minSize: 48,
    maxSize: 48,
  };
}

function createDragHandleColumn<TData extends RowData>(): DTColumnDef<TData> {
  return {
    id: "drag",
    header: () => <span className="sr-only">Reorder</span>,
    // The whole cell is the handle (listeners are attached to the <td>).
    cell: () => (
      <IconGripVertical
        className="size-4 text-muted-foreground"
        aria-hidden="true"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 40,
    minSize: 40,
    maxSize: 40,
  };
}

function DataTableColumnVisibility() {
  "use no memo";

  const { table, columnLabels } = useDataTable();
  useTableState(table);

  return (
    <div
      className="flex flex-wrap gap-2"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label="Visible columns"
    >
      {table
        .getAllLeafColumns()
        .filter((col) => col.getCanHide())
        .map((column) => {
          const label = columnLabel(column, columnLabels);

          return (
            <label key={column.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              />
              {label}
            </label>
          );
        })}
    </div>
  );
}

function DataTablePinningControls() {
  "use no memo";

  const { table } = useDataTable();
  useTableState(table);
  const columns = table.getAllLeafColumns();
  const start = columns.filter((c) => c.getIsPinned() === "start").length;
  const end = columns.filter((c) => c.getIsPinned() === "end").length;

  if (start === 0 && end === 0) return null;

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {start > 0 && (
        <span className="flex items-center gap-2">
          <IconPinFilled className="size-4" aria-hidden="true" />
          {start} pinned left
        </span>
      )}
      {end > 0 && (
        <span className="flex items-center gap-2">
          <IconPinFilled className="size-4" aria-hidden="true" />
          {end} pinned right
        </span>
      )}
    </div>
  );
}

/** Filter fn for faceted / multi-select filters: keep rows whose value is selected. */
function facetedFilterFn(
  row: Pick<DTRow<RowData>, "getValue">,
  columnId: string,
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- TanStack Table filter state is an untrusted library boundary; this parser validates the array and its entries before use.
  value: unknown,
) {
  if (!Array.isArray(value) || value.length === 0) return true;

  return value.includes(String(row.getValue(columnId)));
}

/**
 * Read an optional `[a?, b?]` pair out of untrusted filter state. Filter
 * values are user input, so every element is validated, not assumed.
 */
function parseOptionalPair<T>(
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- TanStack Table filter state is an untrusted library boundary; this parser validates the array and its entries before use.
  value: unknown,

  is: (item: unknown) => item is T,
): [T?, T?] {
  if (!Array.isArray(value) || value.length !== 2) return [];
  // Index reads on the narrowed array are the checked boundary; `is` decides
  // element validity instead of trusting the stored shape.
  const a: unknown = value[0];
  const b: unknown = value[1];

  return [is(a) ? a : undefined, is(b) ? b : undefined];
}

const isString = (item: unknown): item is string => isStringProp(item);

const isNumber = (item: unknown): item is number =>
  isNumberProp(item) && Number.isFinite(item);

const parseNumberInput = (raw: string) =>
  raw === "" ? undefined : Number(raw);

/** Filter fn for DateRangeFilter: [from?, to?] as yyyy-mm-dd, inclusive. */
function dateRangeFilterFn(
  row: Pick<DTRow<RowData>, "getValue">,
  columnId: string,
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- TanStack Table filter state is an untrusted library boundary; this parser validates the array and its entries before use.
  value: unknown,
) {
  const [from, to] = parseOptionalPair<string>(value, isString);

  if (!from && !to) return true;
  const raw = row.getValue(columnId);
  const time = new Date(raw instanceof Date ? raw : String(raw)).getTime();

  if (Number.isNaN(time)) return false;

  if (from && time < new Date(`${from}T00:00:00`).getTime()) return false;

  if (to && time > new Date(`${to}T23:59:59.999`).getTime()) return false;

  return true;
}

interface DataTableFacetedFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/** Listbox of toggleable options with arrow-key navigation. */
function FilterOptionsList({
  options,
  selected,
  onToggle,
  counts,
  label,
}: {
  options: DataTableFacetedFilterOption[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  counts?: Map<unknown, number>;
  label: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);

  const moveFocus = (from: HTMLElement, delta: number) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[role=option]") ?? [],
    );

    items[clamp(items.indexOf(from) + delta, 0, items.length - 1)]?.focus();
  };

  if (options.length === 0) {
    return (
      <p className="px-2 py-4 text-center text-sm text-muted-foreground">
        No options
      </p>
    );
  }

  return (
    <RenderFilterOptionsListSectionPart6
      {...{
        listRef,
        label,
        options,
        selected,
        onToggle,
        moveFocus,
        counts,
      }}
    />
  );
}

function useColumnFilterValue(columnId: string | undefined) {
  const { table } = useDataTable();
  const state = useTableState(table);

  return columnId
    ? state.columnFilters.find((f) => f.id === columnId)?.value
    : undefined;
}

interface DataTableFacetedFilterProps<TData extends RowData, TValue> {
  column?: DTColumn<TData, TValue>;
  title?: string;
  options: DataTableFacetedFilterOption[];
  className?: string;
}

/** Pair with `filterFn: facetedFilterFn` on the column. */
function DataTableFacetedFilter<TData extends RowData, TValue>({
  column,
  title,
  options,
  className,
}: DataTableFacetedFilterProps<TData, TValue>) {
  "use no memo";

  const value = useColumnFilterValue(column?.id);
  const selected = new Set(Array.isArray(value) ? value.map(String) : []);

  const toggle = (option: string) => {
    const next = new Set(selected);

    if (!next.delete(option)) next.add(option);
    column?.setFilterValue(next.size ? [...next] : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("border-dashed", className)}
            disabled={!column}
          >
            <IconFilter className="size-4" aria-hidden="true" />
            {title}
            {selected.size > 0 && (
              <>
                <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
                <Badge variant="secondary">
                  {selected.size}
                  <span className="sr-only"> selected</span>
                </Badge>
              </>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-56 p-2" align="start">
        <FilterOptionsList
          options={options}
          selected={selected}
          onToggle={toggle}
          counts={column?.getFacetedUniqueValues()}
          label={title ?? "Filter options"}
        />
        {selected.size > 0 && (
          <div className="mt-2 border-t border-border pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => column?.setFilterValue(undefined)}
            >
              Clear filters
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface MultiSelectFilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  columnId: string;
  options: MultiSelectFilterOption[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
}

/** Popover (not a Menu: menu typeahead steals keystrokes from the search input). */
function MultiSelectFilter({
  columnId,
  options,
  placeholder = "Select...",
  searchable = true,
  className,
}: MultiSelectFilterProps) {
  const { table } = useDataTable();
  const column = table.getColumn(columnId);
  const value = useColumnFilterValue(columnId);
  const [search, setSearch] = React.useState("");

  if (!column) return null;

  const selected = new Set(Array.isArray(value) ? value.map(String) : []);
  const query = search.trim().toLowerCase();

  const visible = query
    ? options.filter((o) => o.label.toLowerCase().includes(query))
    : options;

  const toggle = (option: string) => {
    const next = new Set(selected);

    if (!next.delete(option)) next.add(option);
    column.setFilterValue(next.size ? [...next] : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 justify-between", className)}
          >
            {selected.size > 0 ? `${selected.size} selected` : placeholder}
            <IconChevronDown className="ml-2 size-4" aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent className="w-56 p-2" align="start">
        {searchable && (
          <Input
            type="search"
            size="sm"
            aria-label="Search options"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        )}
        <div className="mb-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => column.setFilterValue(options.map((o) => o.value))}
          >
            Select all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => column.setFilterValue(undefined)}
          >
            Clear
          </Button>
        </div>
        <FilterOptionsList
          options={visible}
          selected={selected}
          onToggle={toggle}
          label={placeholder}
        />
      </PopoverContent>
    </Popover>
  );
}

interface NumberRangeFilterProps {
  columnId: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  step?: number;
  className?: string;
}

/** Pair with the built-in `filterFn: "inNumberRange"`. */
function NumberRangeFilter(inputProps: NumberRangeFilterProps) {
  const { columnId, minPlaceholder, maxPlaceholder, step, className } =
    resolveComponentDefaults(inputProps, {
      minPlaceholder: "Min",
      maxPlaceholder: "Max",
      step: 1,
    });

  const { table, columnLabels } = useDataTable();
  const column = table.getColumn(columnId);
  const value = useColumnFilterValue(columnId);
  const [min, max] = parseOptionalPair<number>(value, isNumber);

  if (!column) return null;

  const set = (nextMin?: number, nextMax?: number) =>
    column.setFilterValue(
      nextMin === undefined && nextMax === undefined
        ? undefined
        : [nextMin, nextMax],
    );

  const parse = parseNumberInput;
  const label = columnLabel(column, columnLabels);

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label={`${label} range`}
    >
      <Input
        type="number"
        size="sm"
        aria-label={`Minimum ${label}`}
        placeholder={minPlaceholder}
        value={min ?? ""}
        onChange={(e) => set(parse(e.target.value), max)}
        step={step}
        className="w-20"
      />
      <span className="text-muted-foreground" aria-hidden="true">
        to
      </span>
      <Input
        type="number"
        size="sm"
        aria-label={`Maximum ${label}`}
        placeholder={maxPlaceholder}
        value={max ?? ""}
        onChange={(e) => set(min, parse(e.target.value))}
        step={step}
        className="w-20"
      />
    </div>
  );
}

interface DateRangeFilterProps {
  columnId: string;
  className?: string;
}

/** Pair with `filterFn: dateRangeFilterFn`. */
function DateRangeFilter({ columnId, className }: DateRangeFilterProps) {
  const { table, columnLabels } = useDataTable();
  const column = table.getColumn(columnId);
  const value = useColumnFilterValue(columnId);
  const [from, to] = parseOptionalPair<string>(value, isString);

  if (!column) return null;

  const set = (nextFrom?: string, nextTo?: string) =>
    column.setFilterValue(
      !nextFrom && !nextTo ? undefined : [nextFrom, nextTo],
    );

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label={`${columnLabel(column, columnLabels)} date range`}
    >
      <Input
        type="date"
        size="sm"
        aria-label="From date"
        value={from ?? ""}
        max={to}
        onChange={(e) => set(e.target.value || undefined, to)}
      />
      <span className="text-muted-foreground" aria-hidden="true">
        to
      </span>
      <Input
        type="date"
        size="sm"
        aria-label="To date"
        value={to ?? ""}
        min={from}
        onChange={(e) => set(from, e.target.value || undefined)}
      />
    </div>
  );
}

interface DataTableEditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  className?: string;
  /** Accessible name for the edit control, e.g. the column name. */
  label?: string;
}

function DataTableEditableCell({
  value: initialValue,
  onSave,
  type = "text",
  options,
  className,
  label = "Edit value",
}: DataTableEditableCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(initialValue));
  const displayRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<HTMLElement>(null);
  React.useLayoutEffect(() => {
    if (isEditing) editorRef.current?.focus();
  }, [isEditing]);
  // Enter commits and unmounts the input, which can also fire blur → guard.
  const doneRef = React.useRef(false);

  const startEditing = () => {
    doneRef.current = false;
    setDraft(String(initialValue));
    setIsEditing(true);
  };

  const finish = (commit: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;

    if (commit) {
      if (type === "number") {
        const n = Number(draft);

        if (draft.trim() !== "" && Number.isFinite(n) && n !== initialValue)
          onSave(n);
      } else if (draft !== String(initialValue)) {
        onSave(draft);
      }
    }

    setIsEditing(false);
    requestAnimationFrame(() => displayRef.current?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent) =>
    handleEditableCellKeyDown(e, finish);

  if (!isEditing) {
    return (
      <RenderDataTableEditableCellSectionPart7
        {...{
          displayRef,
          label,
          initialValue,
          startEditing,
          className,
        }}
      />
    );
  }

  if (type === "select" && options) {
    return (
      <RenderDataTableEditableCellSectionPart8
        {...{
          editorRef,
          label,
          draft,
          setDraft,
          finish,
          handleKeyDown,
          className,
          options,
        }}
      />
    );
  }

  // oxlint-disable-next-line react/refs -- This JSX builder attaches a commit-time callback ref to Input and does not read editorRef.current during render.
  return renderEditableCellView({
    editorRef,
    label,
    type,
    draft,
    setDraft,
    finish,
    handleKeyDown,
    className,
  });
}

function handleEditableCellKeyDown(
  event: React.KeyboardEvent,
  finish: (commit: boolean) => void,
) {
  if (event.key === "Enter") {
    event.preventDefault();
    finish(true);
  } else if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    finish(false);
  }
}

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

// Deterministic widths — Math.random() in render is impure.
const SKELETON_WIDTHS = [72, 48, 60, 56, 64];

function DataTableSkeleton(inputProps: DataTableSkeletonProps) {
  const { rows, columns, showHeader, className } = resolveComponentDefaults(
    inputProps,
    { rows: 5, columns: 5, showHeader: true },
  );

  return (
    <div
      className={cn("rounded-lg border border-border", className)}
      aria-busy="true"
    >
      <span className="sr-only">Loading table</span>
      <Table aria-hidden="true">
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }, (_, i) => (
                <TableHead key={i}>
                  <div className="h-4 w-24 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }, (_, r) => (
            <TableRow key={r}>
              {Array.from({ length: columns }, (_, c) => (
                <TableCell key={c}>
                  <div
                    className="h-4 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none"
                    style={{
                      width: `${SKELETON_WIDTHS[(r + c) % SKELETON_WIDTHS.length]}%`,
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface DataTableEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function DataTableEmptyState({
  icon,
  title = "No results found",
  description = "Try adjusting your search or filters",
  action,
  className,
}: DataTableEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 text-muted-foreground" aria-hidden="true">
        {icon ?? <IconInbox className="size-12" />}
      </div>
      <p className="mb-1 text-lg font-medium">{title}</p>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

interface DataTableBulkActionsProps {
  children: React.ReactNode;
  className?: string;
  onClearSelection?: () => void;
  /** Float the bar as a bottom overlay dock without reserving layout height. */
  sticky?: boolean;
}

const BULK_DOCK_EXIT_MS = 220;

function useStickyDockTransition(active: boolean, selectedCount: number) {
  const [mounted, setMounted] = React.useState(active);
  const [entered, setEntered] = React.useState(active);
  const [lastCount, setLastCount] = React.useState(selectedCount);

  if (active && !mounted) {
    setMounted(true);
  }

  if (!active && entered) {
    setEntered(false);
  }

  if (selectedCount > 0 && selectedCount !== lastCount) {
    setLastCount(selectedCount);
  }

  React.useEffect(() => {
    if (!active) {
      if (!mounted) return;
      const timer = setTimeout(() => setMounted(false), BULK_DOCK_EXIT_MS);

      return () => clearTimeout(timer);
    }

    const frame = requestAnimationFrame(() => setEntered(true));

    return () => cancelAnimationFrame(frame);
  }, [active, mounted]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget && !active) {
      setMounted(false);
    }
  };

  return {
    mounted,
    visible: active && entered,
    displayCount: selectedCount > 0 ? selectedCount : lastCount,
    handleTransitionEnd,
  };
}

function DataTableBulkActionsBar({
  displayCount,
  sticky,
  className,
  onClear,
  children,
}: {
  displayCount: number;
  sticky: boolean;
  className?: string;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="data-table-bulk-actions"
      role="toolbar"
      aria-label="Bulk actions"
      className={cn(
        "flex max-w-full flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2",
        sticky
          ? "pointer-events-auto rounded-xl border-border/80 bg-popover/95 text-popover-foreground shadow-[var(--shadow-modal,var(--shadow-xl))] ring-1 ring-foreground/5 backdrop-blur-md"
          : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span
          key={displayCount}
          data-slot="data-table-bulk-count"
          className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold tabular-nums text-primary-foreground motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-150"
        >
          {displayCount}
        </span>
        <span className="whitespace-nowrap">selected</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 px-2 text-muted-foreground hover:text-foreground"
          aria-label="Clear selection"
        >
          {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
          <IconX className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
      <div className="h-4 w-px bg-border" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function DataTableBulkActions({
  children,
  className,
  onClearSelection,
  sticky = false,
}: DataTableBulkActionsProps) {
  const { table } = useDataTable();
  const state = useTableState(table);

  const selectedCount = Object.values(state.rowSelection).filter(
    Boolean,
  ).length;

  const active = selectedCount > 0;
  const dock = useStickyDockTransition(sticky && active, selectedCount);

  if (!active && (!sticky || !dock.mounted)) return null;

  const bar = (
    <DataTableBulkActionsBar
      displayCount={dock.displayCount}
      sticky={sticky}
      className={className}
      onClear={onClearSelection ?? (() => table.resetRowSelection())}
    >
      {children}
    </DataTableBulkActionsBar>
  );

  if (!sticky) return bar;

  return (
    <div
      data-slot="data-table-bulk-actions-dock"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-40 m-0! flex justify-center px-4"
    >
      <div
        // inert (not just aria-hidden): the hidden bar's buttons must leave the tab order.
        inert={!dock.visible}
        onTransitionEnd={dock.handleTransitionEnd}
        className={cn(
          "max-w-full motion-safe:transition-[transform,opacity] motion-reduce:transition-none",
          dock.visible
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : "pointer-events-none translate-y-4 scale-95 opacity-0 duration-200 ease-in",
        )}
      >
        {bar}
      </div>
    </div>
  );
}

interface RowAction<TData> {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: TData) => void;
  destructive?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  separator?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: TData;
  actions: RowAction<TData>[];
  className?: string;
  /** Accessible name, e.g. "Actions for Jane Doe". */
  label?: string;
  /** Disables the trigger and shows a spinner while an async row action runs. */
  pending?: boolean;
}

function DataTableRowActions<TData>({
  row,
  actions,
  className,
  label = "Row actions",
  pending = false,
}: DataTableRowActionsProps<TData>) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            aria-busy={pending || undefined}
            className={cn(
              "size-8 p-0 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
              className,
            )}
            aria-label={label}
          >
            {pending ? (
              <Spinner size="sm" aria-hidden="true" />
            ) : (
              <IconDotsVertical className="size-4" aria-hidden="true" />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {visibleActions.map((action, index) => (
          <React.Fragment key={action.id ?? action.label}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => action.onClick(row)}
              disabled={action.disabled || pending}
              variant={action.destructive ? "destructive" : "default"}
            >
              {action.icon && (
                <span className="mr-2" aria-hidden="true">
                  {action.icon}
                </span>
              )}
              {action.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type StatusVariant = "default" | "success" | "warning" | "error" | "info";

interface StatusCellProps {
  value: string;
  statusMap?: Record<string, StatusVariant>;
  dot?: boolean;
  className?: string;
}

const statusVariantStyles: Record<StatusVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-success/20 text-success border-success/30",
  warning: "bg-warning/20 text-warning border-warning/30",
  error: "bg-destructive/20 text-destructive border-destructive/30",
  info: "bg-info/20 text-info border-info/30",
};

const statusDotStyles: Record<StatusVariant, string> = {
  default: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  info: "bg-info",
};

function StatusCell({
  value,
  statusMap = {},
  dot = false,
  className,
}: StatusCellProps) {
  const variant = statusMap[value] ?? "default";

  if (dot) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span
          className={cn("size-2 rounded-full", statusDotStyles[variant])}
          aria-hidden="true"
        />
        <span className="capitalize">{value}</span>
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn("capitalize", statusVariantStyles[variant], className)}
    >
      {value}
    </Badge>
  );
}

// Intl formatters are expensive to construct — cache per locale+options.
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = dateFormatters.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    dateFormatters.set(key, formatter);
  }

  return formatter;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

function getRelativeTime(date: Date, locale = "en", now = Date.now()): string {
  // Signed: past dates are negative, future dates positive ("in 3 days").
  const diffSecs = Math.round((date.getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, secs] of RELATIVE_UNITS) {
    if (Math.abs(diffSecs) >= secs || unit === "second") {
      return rtf.format(Math.round(diffSecs / secs), unit);
    }
  }

  return rtf.format(0, "second");
}

/** Rendered only inside the tooltip, i.e. on the client when opened — no hydration mismatch. */
function RelativeTime({ date, locale }: { date: Date; locale: string }) {
  return <>{getRelativeTime(date, locale)}</>;
}

interface DateCellProps {
  value: Date | string | number | null | undefined;
  format?: Intl.DateTimeFormatOptions;
  showRelative?: boolean;
  locale?: string;
  /** Pass explicitly when server-rendering, or server and client may disagree. */
  timeZone?: string;
  fallback?: string;
  className?: string;
}

function DateCell(input: DateCellProps) {
  const { value, format, showRelative, locale, timeZone, fallback, className } =
    resolveComponentDefaults(input, {
      format: { dateStyle: "medium" },
      showRelative: false,
      locale: "en",
      fallback: "—",
    });

  const resolveDate5 = () => {
    if (value == null) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  };

  const date = resolveDate5();

  if (!date || Number.isNaN(date.getTime())) {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  const formatted = getDateFormatter(locale, { ...format, timeZone }).format(
    date,
  );

  const dateTime = date.toISOString();

  if (!showRelative) {
    return (
      <time dateTime={dateTime} className={className}>
        {formatted}
      </time>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <time
            dateTime={dateTime}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The time element is a focusable tooltip trigger so keyboard users can reveal the full timestamp.
            tabIndex={0}

            className={cn("cursor-help", className)}
          >
            {formatted}
          </time>
        }
      />
      <TooltipContent>
        <RelativeTime date={date} locale={locale} />
      </TooltipContent>
    </Tooltip>
  );
}

const currencyFormatters = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(locale: string, currency: string) {
  const key = `${locale}|${currency}`;
  let formatter = currencyFormatters.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
    currencyFormatters.set(key, formatter);
  }

  return formatter;
}

interface CurrencyCellProps {
  value: number | null | undefined;
  currency?: string;
  locale?: string;
  colorCode?: boolean;
  fallback?: string;
  className?: string;
}

function CurrencyCell(input: CurrencyCellProps) {
  const { value, currency, locale, colorCode, fallback, className } =
    resolveComponentDefaults(input, CURRENCY_CELL_DEFAULTS_2);

  const resolveColorClass6 = (amount: number) => {
    if (colorCode) {
      if (amount > 0) {
        return "text-success" as const;
      }

      if (amount < 0) {
        return "text-destructive" as const;
      }

      return undefined;
    }

    return undefined;
  };

  if (value == null || Number.isNaN(value)) {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  const colorClass = resolveColorClass6(value);

  return (
    <span className={cn("tabular-nums", colorClass, className)}>
      {getCurrencyFormatter(locale, currency).format(value)}
    </span>
  );
}

interface AvatarCellProps {
  src?: string | null;
  name: string;
  showName?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "") // Array.from: safe for emoji / surrogate pairs
    .join("")
    .toUpperCase();
}

const avatarSizeStyles = {
  sm: "size-6 text-xs",
  default: "size-8 text-sm",
  lg: "size-10 text-base",
};

function AvatarCell({
  src,
  name,
  showName = true,
  size = "default",
  className,
}: AvatarCellProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Avatar className={cn("shrink-0", avatarSizeStyles[size])}>
        {src && <AvatarImage src={src} alt={showName ? "" : name} />}
        <AvatarFallback className="text-xs" aria-hidden={showName}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {showName && <span className="truncate">{name}</span>}
    </div>
  );
}

interface ActionsCellProps<TData> {
  row: TData;
  onEdit?: (row: TData) => void;
  onView?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onDuplicate?: (row: TData) => void;
  customActions?: RowAction<TData>[];
  className?: string;
  label?: string;
}

function ActionsCell<TData>({
  row,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  customActions = [],
  className,
  label,
}: ActionsCellProps<TData>) {
  const actions: RowAction<TData>[] = [];

  if (onView)
    actions.push({
      label: "View",
      icon: <IconEye className="size-4" />,
      onClick: onView,
    });

  if (onEdit)
    actions.push({
      label: "Edit",
      icon: <IconEdit className="size-4" />,
      onClick: onEdit,
    });

  if (onDuplicate)
    actions.push({
      label: "Duplicate",
      icon: <IconCopy className="size-4" />,
      onClick: onDuplicate,
    });
  actions.push(...customActions);

  if (onDelete) {
    actions.push({
      label: "Delete",
      icon: <IconTrash className="size-4" />,
      onClick: onDelete,
      destructive: true,
      separator: actions.length > 0,
    });
  }

  if (actions.length === 0) return null;

  return (
    <DataTableRowActions
      row={row}
      actions={actions}
      className={className}
      label={label}
    />
  );
}

interface DataTableDensityToggleProps {
  value?: DataTableDensity;
  defaultValue?: DataTableDensity;
  onValueChange?: (density: DataTableDensity) => void;
  className?: string;
}

const DENSITY_OPTIONS: { value: DataTableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

function DataTableDensityToggle({
  value,
  defaultValue = "default",
  onValueChange,
  className,
}: DataTableDensityToggleProps) {
  const context = React.useContext(DataTableContext);

  const [internalValue, setInternalValue] =
    React.useState<DataTableDensity>(defaultValue);

  // Inside a DataTableRoot the context owns density (and persistence).
  const contextControlled = context !== null && value === undefined;

  const currentValue =
    value ?? (contextControlled ? context.density : internalValue);

  const handleChange = (next: DataTableDensity) => {
    if (contextControlled) context.setDensity(next);
    else if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label="Row density"
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border p-1",
        className,
      )}
    >
      {DENSITY_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={currentValue === option.value ? "secondary" : "ghost"}
          size="sm"
          aria-pressed={currentValue === option.value}
          onClick={() => handleChange(option.value)}
          className="h-7 px-2 text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export {
  DataTableRoot,
  DataTableSearch,
  DataTableContent,
  DataTableCardList,
  DataTableFilterBar,
  DataTableActiveFilters,
  DataTablePageCount,
  DataTableRowCount,
  DataTablePagination,
  DataTableColumnVisibility,
  DataTablePinningControls,
  DataTableDensityToggle,
  DataTableColumnHeader,
  DataTableResizeHandle,
  DataTableFacetedFilter,
  KiraDataTable,
  createSelectColumn,
  createExpandColumn,
  createDragHandleColumn,
  DataTableEditableCell,
  DataTableSkeleton,
  DataTableEmptyState,
  DataTableBulkActions,
  DataTableRowActions,
  StatusCell,
  DateCell,
  CurrencyCell,
  AvatarCell,
  ActionsCell,
  NumberRangeFilter,
  MultiSelectFilter,
  DateRangeFilter,
  facetedFilterFn,
  dateRangeFilterFn,
  dataTableFeatures,
  useDataTable,
  useDataTableFilters,
};

export type {
  DTFeatures,
  DTColumnDef,
  DTRow,
  DTColumn,
  DataTableProps,
  DataTableContentProps,
  DataTableEmptyReason,
  DataTableEmptyContext,
  DataTableFilterMode,
  DataTableFilterLayout,
  DataTableFilterOption,
  DataTableFilterField,
  DataTableFilterBarProps,
  DataTableActiveFiltersProps,
  UseDataTableFiltersOptions,
  UseDataTableFiltersReturn,
  DataTablePreset,
  KiraDataTableProps,
  DataTableCountProps,
  DataTableSearchProps,
  DataTablePaginationProps,
  DataTableSkeletonProps,
  DataTableEmptyStateProps,
  DataTableBulkActionsProps,
  DataTableRowActionsProps,
  DataTableDensityToggleProps,
  DataTableFacetedFilterProps,
  DataTableFacetedFilterOption,
  DataTableDensity,
  RowAction,
  StatusCellProps,
  DateCellProps,
  CurrencyCellProps,
  AvatarCellProps,
  ActionsCellProps,
  NumberRangeFilterProps,
  MultiSelectFilterProps,
  MultiSelectFilterOption,
  DateRangeFilterProps,
};

type renderDataTableRowSectionPart1Args<TData extends RowData> = {
  rowRef: DataTableRowProps<TData>["rowRef"];
  rowStyle: DataTableRowProps<TData>["rowStyle"];
  stripe: "even" | "odd";
  row: DataTableRowProps<TData>["row"];
  isGrid: DataTableRowProps<TData>["isGrid"];
  ariaRowIndex: DataTableRowProps<TData>["ariaRowIndex"];
  clickToExpand: boolean;
  isDragging: Exclude<DataTableRowProps<TData>["isDragging"], undefined>;
  cells: ReturnType<DTRow<TData>["getVisibleCells"]>;
  rowIndex: DataTableRowProps<TData>["rowIndex"];
  activeRow: DataTableRowProps<TData>["activeRow"];
  activeCol: DataTableRowProps<TData>["activeCol"];
  onCellFocus: DataTableRowProps<TData>["onCellFocus"];
  dragHandleProps: DataTableRowProps<TData>["dragHandleProps"];
  isResizable: boolean;
  stickyHeader: boolean;
  isPending: boolean;
  onRowClick?: (row: DTRow<TData>) => void;
};

function resolveGridCellTabIndex(
  isGrid: boolean,
  isActive: boolean,
): 0 | -1 | undefined {
  if (!isGrid) return undefined;

  return isActive ? 0 : -1;
}

function renderDataTableRowCell<TData extends RowData>({
  cell,
  colIndex,
  rowIndex,
  activeRow,
  activeCol,
  isGrid,
  isResizable,
  onCellFocus,
  dragHandleProps,
}: {
  cell: ReturnType<DTRow<TData>["getVisibleCells"]>[number];
  colIndex: number;
  rowIndex: number;
  activeRow: number;
  activeCol: number;
  isGrid: boolean;
  isResizable: boolean;
  onCellFocus: DataTableRowProps<TData>["onCellFocus"];
  dragHandleProps: DataTableRowProps<TData>["dragHandleProps"];
}) {
  const isDragHandle = cell.column.id === "drag";
  const isActive = rowIndex === activeRow && colIndex === activeCol;

  return (
    <TableCell
      key={cell.id}
      isGridCell={isGrid}
      data-grid-cell={isGrid ? `${rowIndex}:${colIndex}` : undefined}
      tabIndex={resolveGridCellTabIndex(isGrid, isActive)}
      onFocus={isGrid ? () => onCellFocus?.({ rowIndex, colIndex }) : undefined}
      {...pinProps(cell.column)}
      className={cn(
        isResizable && "overflow-hidden text-ellipsis",
        isGrid &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isDragHandle && "cursor-grab touch-none active:cursor-grabbing",
      )}
      style={{
        width: `calc(var(--col-${cssId(cell.column.id)}-size) * 1px)`,
      }}
      {...(isDragHandle ? dragHandleProps : undefined)}
    >
      <FlexRender cell={cell} />
    </TableCell>
  );
}

function renderDataTableRowSectionPart1<TData extends RowData>({
  rowRef,
  rowStyle,
  stripe,
  row,
  isGrid,
  ariaRowIndex,
  clickToExpand,
  isDragging,
  cells,
  rowIndex,
  activeRow,
  activeCol,
  onCellFocus,
  dragHandleProps,
  isResizable,
  stickyHeader,
  isPending,
  onRowClick,
}: renderDataTableRowSectionPart1Args<TData>) {
  const isRowClickable = clickToExpand || Boolean(onRowClick);

  return (
    <TableRow
      ref={rowRef}
      style={rowStyle}
      stripe={stripe}
      isSelected={row.getIsSelected()}
      isGridRow={isGrid}
      aria-rowindex={ariaRowIndex}
      aria-busy={isPending || undefined}
      data-pending={isPending ? "true" : undefined}
      className={cn(
        isRowClickable && "cursor-pointer",
        stickyHeader && "scroll-mt-12",
        isPending && "opacity-60",
        isDragging && "relative z-20 opacity-80",
      )}
      onClick={
        isRowClickable
          ? (event) => {
              if (isInteractiveTarget(event.target)) return;

              if (clickToExpand) row.toggleExpanded();
              onRowClick?.(row);
            }
          : undefined
      }
    >
      {cells.map((cell, colIndex) =>
        renderDataTableRowCell({
          cell,
          colIndex,
          rowIndex,
          activeRow,
          activeCol,
          isGrid,
          isResizable,
          onCellFocus,
          dragHandleProps,
        }),
      )}
    </TableRow>
  );
}

type renderDataTableVirtualContentSectionPart2Args<TData extends RowData> = {
  props: DataTableContentProps<TData>;
  enableKeyboardNavigation: boolean;
  rows: ReturnType<DTTable<TData>["getRowModel"]>["rows"];
  tableRef: React.RefObject<HTMLTableElement | null>;
  nav: ReturnType<typeof useGridNavigation>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  containerHeight: number;
  paddingTop: number;
  spacer: (height: number) => React.JSX.Element;
  items: ReturnType<ReturnType<typeof useVirtualizer>["getVirtualItems"]>;
  virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
  table: DTTable<TData>;
  paddingBottom: number;
  isLoading: boolean;
  colCount: number;
};

function renderDataTableVirtualContentSectionPart2<TData extends RowData>({
  props,
  enableKeyboardNavigation,
  rows,
  tableRef,
  nav,
  scrollRef,
  containerHeight,
  paddingTop,
  spacer,
  items,
  virtualizer,
  table,
  paddingBottom,
  isLoading,
  colCount,
}: renderDataTableVirtualContentSectionPart2Args<TData>) {
  return (
    <DataTableFrame
      content={props}
      isGrid={enableKeyboardNavigation}
      rowCount={rows.length}
      tableRef={tableRef}
      onKeyDown={nav.onKeyDown}
      containerRef={scrollRef}
      containerStyle={{ height: containerHeight }}
      forceStickyHeader
    >
      {paddingTop > 0 && spacer(paddingTop)}
      {items.map((item) => {
        const row = rows[item.index];

        // One <tbody> per virtual item (valid HTML) so a row *and* its
        // expanded sub-component are measured together.
        return (
          <TableBody
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            className="[&>tr:last-child>*]:border-b"
          >
            <DataTableRow
              row={row}
              rowIndex={item.index}
              ariaRowIndex={item.index + 1 + table.getHeaderGroups().length}
              isGrid={enableKeyboardNavigation}
              activeRow={nav.activeRow}
              activeCol={nav.activeCol}
              onCellFocus={nav.setActive}
              expandOnRowClick={!!props.expandOnRowClick}
              renderSubComponent={props.renderSubComponent}
            />
          </TableBody>
        );
      })}
      {paddingBottom > 0 && spacer(paddingBottom)}
      {(isLoading || rows.length === 0) && (
        <TableBody>
          {isLoading ? (
            <tr>
              <TableCell
                colSpan={colCount}
                className="text-center text-muted-foreground"
              >
                Loading…
              </TableCell>
            </tr>
          ) : (
            <DataTableEmptyRow
              colSpan={colCount}
              emptyState={props.emptyState}
            />
          )}
        </TableBody>
      )}
    </DataTableFrame>
  );
}

type renderDataTableReorderableContentSectionPart3Args<TData extends RowData> =
  {
    sensors: ReturnType<typeof useSensors>;
    handleDragEnd: ({ active, over }: DragEndEvent) => void;
    props: DataTableContentProps<TData>;
    enableKeyboardNavigation: ReturnType<
      typeof useDataTable<TData>
    >["enableKeyboardNavigation"];
    orderedRows: DTRow<TData>[];
    tableRef: React.RefObject<HTMLTableElement | null>;
    nav: ReturnType<typeof useGridNavigation>;
    order: string[];
    dragDisabled: boolean;
    colCount: number;
  };

function RenderDataTableReorderableContentSectionPart3<TData extends RowData>({
  sensors,
  handleDragEnd,
  props,
  enableKeyboardNavigation,
  orderedRows,
  tableRef,
  nav,
  order,
  dragDisabled,
  colCount,
}: renderDataTableReorderableContentSectionPart3Args<TData>) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <DataTableFrame
        content={props}
        isGrid={enableKeyboardNavigation}
        rowCount={orderedRows.length}
        tableRef={tableRef}
        onKeyDown={nav.onKeyDown}
      >
        <TableBody>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {orderedRows.length ? (
              orderedRows.map((row, i) => (
                <DataTableSortableRow
                  key={row.id}
                  row={row}
                  rowIndex={i}
                  disabled={dragDisabled}
                  isGrid={enableKeyboardNavigation}
                  activeRow={nav.activeRow}
                  activeCol={nav.activeCol}
                  onCellFocus={nav.setActive}
                  expandOnRowClick={!!props.expandOnRowClick}
                  renderSubComponent={props.renderSubComponent}
                />
              ))
            ) : (
              <DataTableEmptyRow
                colSpan={colCount}
                emptyState={props.emptyState}
              />
            )}
          </SortableContext>
        </TableBody>
      </DataTableFrame>
    </DndContext>
  );
}

type renderFilterOptionsListSectionPart6Args = {
  listRef: React.RefObject<HTMLDivElement | null>;
  label: {
    options: DataTableFacetedFilterOption[];
    selected: Set<string>;
    onToggle: (value: string) => void;
    counts?: Map<unknown, number>;
    label: string;
  }["label"];
  options: {
    options: DataTableFacetedFilterOption[];
    selected: Set<string>;
    onToggle: (value: string) => void;
    counts?: Map<unknown, number>;
    label: string;
  }["options"];
  selected: {
    options: DataTableFacetedFilterOption[];
    selected: Set<string>;
    onToggle: (value: string) => void;
    counts?: Map<unknown, number>;
    label: string;
  }["selected"];
  onToggle: {
    options: DataTableFacetedFilterOption[];
    selected: Set<string>;
    onToggle: (value: string) => void;
    counts?: Map<unknown, number>;
    label: string;
  }["onToggle"];
  moveFocus: (from: HTMLElement, delta: number) => void;
  counts: {
    options: DataTableFacetedFilterOption[];
    selected: Set<string>;
    onToggle: (value: string) => void;
    counts?: Map<unknown, number>;
    label: string;
  }["counts"];
};

function RenderFilterOptionsListSectionPart6({
  listRef,
  label,
  options,
  selected,
  onToggle,
  moveFocus,
  counts,
}: renderFilterOptionsListSectionPart6Args) {
  return (
    <div
      ref={listRef}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This custom multi-select composite implements keyboard navigation and selection; native select does not support its rendered option content.
      role="listbox"
      aria-multiselectable="true"
      aria-label={label}
      className="flex max-h-60 flex-col overflow-auto"
    >
      {options.map((option, i) => {
        const isSelected = selected.has(option.value);
        const OptionIcon = option.icon;

        return (
          <div
            key={option.value}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The custom option belongs to the keyboard-managed listbox and renders icons, counts, and selection markers.
            role="option"
            aria-selected={isSelected}
            tabIndex={i === 0 ? 0 : -1}
            onClick={() => onToggle(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(option.value);
              } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                moveFocus(e.currentTarget, e.key === "ArrowDown" ? 1 : -1);
              }
            }}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {/* Visual-only indicator: a real Checkbox here nests a focusable control inside an option. */}
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-lg border border-input",
                isSelected &&
                  "border-primary bg-primary text-primary-foreground",
              )}
            >
              {isSelected && <IconCheck className="size-3" />}
            </span>
            {OptionIcon && (
              <OptionIcon className="size-4 text-muted-foreground" />
            )}
            <span className="flex-1">{option.label}</span>
            {counts && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {counts.get(option.value) ?? 0}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

type renderDataTableEditableCellSectionPart7Args = {
  displayRef: React.RefObject<HTMLDivElement | null>;
  label: Exclude<DataTableEditableCellProps["label"], undefined>;
  initialValue: DataTableEditableCellProps["value"];
  startEditing: () => void;
  className: DataTableEditableCellProps["className"];
};

function RenderDataTableEditableCellSectionPart7({
  displayRef,
  label,
  initialValue,
  startEditing,
  className,
}: renderDataTableEditableCellSectionPart7Args) {
  return (
    <div
      ref={displayRef}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This editable-cell div enters edit mode on double-click, Enter, or F2; native button would change single-click activation and the public div ref.
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${initialValue}`}
      onDoubleClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "F2") {
          e.preventDefault();
          e.stopPropagation();
          startEditing();
        }
      }}
      className={cn(
        "min-h-6 cursor-pointer rounded py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {initialValue}
    </div>
  );
}

type renderDataTableEditableCellSectionPart8Args = {
  editorRef: React.RefObject<HTMLElement | null>;
  label: Exclude<DataTableEditableCellProps["label"], undefined>;
  draft: string;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
  finish: (commit: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  className: DataTableEditableCellProps["className"];
  options: NonNullable<DataTableEditableCellProps["options"]>;
};

function RenderDataTableEditableCellSectionPart8({
  editorRef,
  label,
  draft,
  setDraft,
  finish,
  handleKeyDown,
  className,
  options,
}: renderDataTableEditableCellSectionPart8Args) {
  return (
    <select
      ref={(node) => {
        editorRef.current = node;
      }}
      aria-label={label}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => finish(true)}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full rounded border border-primary bg-background px-2 py-1",
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const DATA_TABLE_PAGINATION_DEFAULTS_1 = {
  showPageSize: false,
  pageSizeOptions: [10, 20, 30, 40, 50],
  showPageInfo: false,
  showJump: false,
  showFirstLast: true,
  showPreviousNextText: false,
  variant: "outline",
  size: "sm",
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const CURRENCY_CELL_DEFAULTS_2 = {
  currency: "USD",
  locale: "en-US",
  colorCode: false,
  fallback: "—",
} as const;

type renderDataTableRootViewArgs<TData extends RowData, TValue> = {
  contextValue: DataTableContextValue<RowData>;
  children: DataTableProps<TData, TValue>["children"];
  announceChanges: Exclude<
    DataTableProps<TData, TValue>["announceChanges"],
    undefined
  >;
  announcement: string;
};

function renderDataTableRootView<TData extends RowData, TValue>({
  contextValue,
  children,
  announceChanges,
  announcement,
}: renderDataTableRootViewArgs<TData, TValue>) {
  return (
    <DataTableContext.Provider value={contextValue}>
      <div data-slot="data-table" className="space-y-4">
        {children}
      </div>
      {announceChanges && (
        <output aria-live="polite" className="block sr-only">
          {announcement}
        </output>
      )}
    </DataTableContext.Provider>
  );
}

function getServerPaginationOptions({
  state,
  rowCount,
  onPageChange,
  onPageSizeChange,
}: NonNullable<DataTableProps<RowData, unknown>["serverPagination"]>) {
  return {
    state: { pagination: state },
    rowCount,
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next = functionalUpdate(updater, state);

      // Size changes arrive with the reset page index in one atomic update;
      // deliver both so the consumer never keeps a stale page.
      if (next.pageSize !== state.pageSize) onPageSizeChange?.(next.pageSize);

      if (next.pageIndex !== state.pageIndex) onPageChange(next.pageIndex);
    },
  };
}

function resolveDataTableSetupProps<TData extends RowData, TValue>(
  input: DataTableProps<TData, TValue>,
) {
  return resolveComponentDefaults(input, {
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    enableRowSelection: false,
    enableColumnPinning: false,
    enableColumnResizing: false,
    enableExpanding: false,
    enableGrouping: false,
    enableVirtualization: false,
    enableKeyboardNavigation: false,
    announceChanges: false,
    density: "default",
    initialPageSize: 10,
    initialSorting: EMPTY_SORTING,
    manualSorting: false,
    containerHeight: 500,
    isLoading: false,
    isFetching: false,
    hasNextPage: false,
    hasActiveFilters: false,
    persistStateVersion: DEFAULT_PERSIST_VERSION,
  });
}

interface DataTableControlledState {
  pagination?: PaginationState;
  sorting?: SortingState;
}

interface DataTableInitialState {
  sorting: SortingState;
  pagination: PaginationState;
  columnPinning?: ColumnPinningState;
}

function buildDataTableControlledState(
  serverPagination: DataTableProps<RowData, unknown>["serverPagination"],
  sorting: SortingState | undefined,
): DataTableControlledState | undefined {
  const controlled: DataTableControlledState = {};

  if (serverPagination) controlled.pagination = serverPagination.state;

  if (sorting) controlled.sorting = sorting;

  return Object.keys(controlled).length > 0 ? controlled : undefined;
}

function buildDataTableInitialState(
  initialSorting: SortingState,
  initialPageSize: number,
  initialColumnPinning?: Partial<ColumnPinningState>,
): DataTableInitialState {
  const initialState: DataTableInitialState = {
    sorting: initialSorting,
    pagination: { pageIndex: 0, pageSize: initialPageSize },
  };

  if (initialColumnPinning) {
    initialState.columnPinning = {
      start: initialColumnPinning.start ?? [],
      end: initialColumnPinning.end ?? [],
    };
  }

  return initialState;
}

function buildDataTableOptions<TData extends RowData, TValue>(
  resolvedProps: ReturnType<typeof resolveDataTableSetupProps<TData, TValue>>,
) {
  const { serverPagination, sorting, onSortingChange } = resolvedProps;

  const serverOpts = serverPagination
    ? getServerPaginationOptions(serverPagination)
    : undefined;

  const controlledState = buildDataTableControlledState(
    serverPagination,
    sorting,
  );

  const initialState = buildDataTableInitialState(
    resolvedProps.initialSorting,
    resolvedProps.initialPageSize,
    resolvedProps.initialColumnPinning,
  );

  const sortingHandler = onSortingChange
    ? (updater: Updater<SortingState>) => {
        onSortingChange(functionalUpdate(updater, sorting ?? EMPTY_SORTING));
      }
    : undefined;

  return {
    features: dataTableFeatures,
    data: resolvedProps.data,
    columns: createColumnHelper<DTFeatures, TData>().columns(
      resolvedProps.columns,
    ),
    getRowId: resolvedProps.getRowId,
    getSubRows: resolvedProps.getSubRows,
    getRowCanExpand: resolvedProps.getRowCanExpand,
    enableSorting: resolvedProps.enableSorting,
    enableSortingRemoval: true,
    manualSorting: resolvedProps.manualSorting,
    enableColumnFilters: resolvedProps.enableFiltering,
    enableGlobalFilter: resolvedProps.enableFiltering,
    enableRowSelection: resolvedProps.enableRowSelection,
    enableColumnPinning: resolvedProps.enableColumnPinning,
    enableColumnResizing: resolvedProps.enableColumnResizing,
    columnResizeMode: "onChange" as const,
    enableExpanding: resolvedProps.enableExpanding,
    enableGrouping: resolvedProps.enableGrouping,
    manualPagination:
      !resolvedProps.enablePagination ||
      resolvedProps.enableVirtualization ||
      Boolean(serverPagination),
    rowCount: serverOpts?.rowCount,
    onPaginationChange: serverOpts?.onPaginationChange,
    onSortingChange: sortingHandler,
    state: controlledState,
    initialState,
  };
}

function useDataTableSetup<TData extends RowData, TValue>(
  input: DataTableProps<TData, TValue>,
) {
  "use no memo";

  const resolvedProps = resolveDataTableSetupProps(input);
  const { serverPagination, isLoading } = resolvedProps;
  const table = useTable(buildDataTableOptions(resolvedProps), () => null);

  React.useEffect(() => {
    if (!serverPagination || isLoading) return;
    const { rowCount, state } = serverPagination;
    const lastPageIndex = Math.max(0, Math.ceil(rowCount / state.pageSize) - 1);

    if (state.pageIndex > lastPageIndex) table.setPageIndex(lastPageIndex);
  }, [serverPagination, isLoading, table]);

  return { ...resolvedProps, table };
}

function useDataTableState2<TData extends RowData, TValue>(
  state: ReturnType<typeof useDataTableSetup<TData, TValue>>,
) {
  const {
    density,
    onRowSelectionChange,
    persistStateKey,
    persistStateVersion,
    table,
  } = state;

  // Density: prop seeds and wins when it changes; the toggle + storage override it.
  const [densityState, setDensityState] = React.useState(density);

  const [prevDensityProp, setPrevDensityProp] = React.useState(density);

  if (density !== prevDensityProp) {
    setPrevDensityProp(density);
    setDensityState(density);
  }

  const setDensity = React.useCallback(
    (next: DataTableDensity) => {
      setDensityState(next);

      if (persistStateKey) {
        writeStoredTableState(persistStateKey, persistStateVersion, {
          density: next,
        });
      }
    },
    [persistStateKey, persistStateVersion],
  );

  useTablePersistence(
    table,
    persistStateKey,
    persistStateVersion,
    setDensityState,
  );

  // Selection callback: subscribe to the store instead of mirroring state.
  const emitSelection = React.useEffectEvent((selection: RowSelectionState) =>
    onRowSelectionChange?.(selection),
  );

  React.useEffect(() => {
    let prev = table.store.state.rowSelection;

    return subscribeTable(table, () => {
      const next = table.store.state.rowSelection;

      if (next === prev) return;
      prev = next;
      emitSelection(next);
    });
  }, [table]);

  // Live announcements for sort / filter / page changes.
  const [announcement, setAnnouncement] = React.useState("");

  const [columnLabels, setColumnLabels] = React.useState<
    Record<string, string>
  >({});

  const registerColumnLabel = React.useCallback(
    (columnId: string, label: string) => {
      setColumnLabels((prev) =>
        prev[columnId] === label ? prev : { ...prev, [columnId]: label },
      );
    },
    [],
  );

  return {
    ...state,
    densityState,
    setDensity,
    columnLabels,
    registerColumnLabel,
    announcement,
    setAnnouncement,
  };
}

function useTableAnnouncements<TData extends RowData>(
  table: DTTable<TData>,
  announceChanges: boolean,
  columnLabels: Readonly<Record<string, string>>,
  setAnnouncement: React.Dispatch<React.SetStateAction<string>>,
) {
  const formatChange = React.useEffectEvent((prev: DTState, next: DTState) =>
    describeChange(table, prev, next, columnLabels),
  );

  React.useEffect(() => {
    if (!announceChanges) return;
    let prev = table.store.state;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = subscribeTable(table, () => {
      const next = table.store.state;
      const message = formatChange(prev, next);
      prev = next;

      if (!message) return;
      clearTimeout(timer);
      timer = setTimeout(() => setAnnouncement(message), 500);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [table, announceChanges, setAnnouncement]);
}

function buildDataTableContextValue<TData extends RowData, TValue>(
  state: ReturnType<typeof useDataTableState2<TData, TValue>>,
): DataTableContextValue<RowData> {
  // SAFETY: the provider below serves this exact table instance, so reading
  // the context inside this provider yields this TData; the context type
  // erases TData to RowData to keep one shared context object.
  const contextTable = state.table as DTTable<RowData>;

  // SAFETY: same TData erasure as contextTable for the shared context provider.
  const contextRowClick = state.onRowClick as
    ((row: DTRow<RowData>) => void) | undefined;

  const serverPaged = Boolean(state.serverPagination);

  return {
    table: contextTable,
    density: state.densityState,
    setDensity: state.setDensity,
    columnLabels: state.columnLabels,
    registerColumnLabel: state.registerColumnLabel,
    enablePagination:
      state.enablePagination && (!state.enableVirtualization || serverPaged),
    enableVirtualization: state.enableVirtualization,
    enableKeyboardNavigation: state.enableKeyboardNavigation,
    estimateRowHeight: state.estimateRowHeight,
    containerHeight: state.containerHeight,
    onLoadMore: state.onLoadMore,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    hasNextPage: state.hasNextPage,
    error: state.error,
    onRetry: state.onRetry,
    hasActiveFilters: state.hasActiveFilters,
    onResetFilters: state.onResetFilters,
    searchQuery: state.searchQuery,
    onRowClick: contextRowClick,
    pendingRowIds: state.pendingRowIds,
  };
}

function useDataTableActions<TData extends RowData, TValue>(
  state: ReturnType<typeof useDataTableState2<TData, TValue>>,
) {
  useTableAnnouncements(
    state.table,
    state.announceChanges,
    state.columnLabels,
    state.setAnnouncement,
  );

  const contextValue = buildDataTableContextValue(state);

  return { ...state, contextValue };
}

function renderDataTable<TData extends RowData, TValue>({
  children,
  announceChanges,
  announcement,
  contextValue,
}: ReturnType<typeof useDataTableActions<TData, TValue>>) {
  return renderDataTableRootView({
    contextValue,
    children,
    announceChanges,
    announcement,
  });
}

const GRID_KEY_DELTAS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  PageUp: [-PAGE_STEP, 0],
  PageDown: [PAGE_STEP, 0],
} satisfies Record<string, readonly [number, number]>;

function isGridNavigationKey(
  key: string,
): key is keyof typeof GRID_KEY_DELTAS | "Home" | "End" {
  return Object.hasOwn(GRID_KEY_DELTAS, key) || key === "Home" || key === "End";
}

function gridKeyDestination(
  key: string,
  modified: boolean,
  row: number,
  column: number,
  rowCount: number,
  columnCount: number,
): [number, number] | null {
  if (!isGridNavigationKey(key)) return null;

  if (key === "Home") return modified ? [0, 0] : [row, 0];

  if (key === "End") {
    return modified ? [rowCount - 1, columnCount - 1] : [row, columnCount - 1];
  }

  const delta = GRID_KEY_DELTAS[key];

  if (delta) return [row + delta[0], column + delta[1]];

  return null;
}

type DataTableVirtualizer = ReturnType<
  typeof useVirtualizer<HTMLDivElement, Element>
>;

type renderDataTableVirtualViewArgs<TData extends RowData> = {
  props: DataTableContentProps<TData>;
  enableKeyboardNavigation: boolean;
  rows: DTRow<TData>[];
  tableRef: React.RefObject<HTMLTableElement | null>;
  nav: {
    activeRow: number;
    activeCol: number;
    setActive: React.Dispatch<React.SetStateAction<GridPos>>;
    onKeyDown: (event: React.KeyboardEvent<HTMLTableElement>) => void;
  };
  scrollRef: React.RefObject<HTMLDivElement | null>;
  containerHeight: number;
  paddingTop: number;
  spacer: (height: number) => React.JSX.Element;
  items: ReturnType<DataTableVirtualizer["getVirtualItems"]>;
  virtualizer: DataTableVirtualizer;
  table: DTTable<TData>;
  paddingBottom: number;
  isLoading: boolean;
  colCount: number;
};

function renderDataTableVirtualView<TData extends RowData>({
  props,
  enableKeyboardNavigation,
  rows,
  tableRef,
  nav,
  scrollRef,
  containerHeight,
  paddingTop,
  spacer,
  items,
  virtualizer,
  table,
  paddingBottom,
  isLoading,
  colCount,
}: renderDataTableVirtualViewArgs<TData>) {
  return renderDataTableVirtualContentSectionPart2({
    props,
    enableKeyboardNavigation,
    rows,
    tableRef,
    nav,
    scrollRef,
    containerHeight,
    paddingTop,
    spacer,
    items,
    virtualizer,
    table,
    paddingBottom,
    isLoading,
    colCount,
  });
}

type renderEditableCellViewArgs = {
  editorRef: React.RefObject<HTMLElement | null>;
  label: DataTableEditableCellProps["label"];
  type: DataTableEditableCellProps["type"];
  draft: string;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
  finish: (commit: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  className: DataTableEditableCellProps["className"];
};

function renderEditableCellView({
  editorRef,
  label,
  type,
  draft,
  setDraft,
  finish,
  handleKeyDown,
  className,
}: renderEditableCellViewArgs) {
  return (
    <Input
      ref={(node) => {
        editorRef.current = node;
      }}
      aria-label={label}
      type={type}
      value={draft}
      onFocus={(e) => type === "text" && e.currentTarget.select()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => finish(true)}
      onKeyDown={handleKeyDown}
      className={cn("h-auto py-1", className)}
    />
  );
}

type DataTableFilterMode = "manual" | "live";

type DataTableFilterLayout = "toolbar" | "sidebar" | "stacked";

interface DataTableFilterOption {
  value: string;
  label: string;
}

type DataTableFilterField =
  | {
      kind: "search";
      key: string;
      label: string;
      placeholder?: string;
    }
  | {
      kind: "select";
      key: string;
      label: string;
      placeholder?: string;
      allLabel?: string;
      options: readonly DataTableFilterOption[];
    }
  | {
      kind: "chips";
      key: string;
      label: string;
      options: readonly DataTableFilterOption[];
    }
  | {
      kind: "date-range";
      fromKey: string;
      toKey: string;
      label: string;
    };

interface UseDataTableFiltersOptions<TFilters extends Record<string, string>> {
  defaultValues: TFilters;
  /** Optional externally owned applied state (e.g. from URL search params). */
  applied?: TFilters;
  mode?: DataTableFilterMode;
  debounceMs?: number;
  /** True when the caller's sort state differs from its default sort. */
  isSortModified?: boolean;
  onApply?: (
    next: TFilters,
    meta: { source: "manual" | "live" | "clear" },
  ) => void;
  onReset?: () => void;
}

interface UseDataTableFiltersReturn<TFilters extends Record<string, string>> {
  draft: TFilters;
  applied: TFilters;
  defaultValues: TFilters;
  mode: DataTableFilterMode;
  isDirty: boolean;
  activeCount: number;
  hasActiveFilters: boolean;
  canReset: boolean;
  setField: (key: keyof TFilters & string, value: string) => void;
  apply: () => void;
  reset: () => void;
  clearField: (key: keyof TFilters & string) => void;
}

function areFilterRecordsEqual<TFilters extends Record<string, string>>(
  a: TFilters,
  b: TFilters,
): boolean {
  const keys = Object.keys(a);

  for (const key of keys) {
    if ((a[key] ?? "") !== (b[key] ?? "")) return false;
  }

  return true;
}

function countNonDefaultFilters<TFilters extends Record<string, string>>(
  values: TFilters,
  defaults: TFilters,
): number {
  let count = 0;

  for (const key of Object.keys(defaults)) {
    if ((values[key] ?? "").trim() !== (defaults[key] ?? "").trim()) {
      count += 1;
    }
  }

  return count;
}

function deriveFilterFlags<TFilters extends Record<string, string>>(
  draft: TFilters,
  applied: TFilters,
  defaultValues: TFilters,
  isSortModified: boolean,
) {
  const isDirty = !areFilterRecordsEqual(draft, applied);
  const activeCount = countNonDefaultFilters(applied, defaultValues);
  const draftCount = countNonDefaultFilters(draft, defaultValues);
  const hasActiveFilters = activeCount > 0;
  const canReset = hasActiveFilters || draftCount > 0 || isSortModified;

  return { isDirty, activeCount, hasActiveFilters, canReset };
}

function useFilterCommitter<TFilters extends Record<string, string>>(
  controlledApplied: TFilters | undefined,
  setInternalApplied: React.Dispatch<React.SetStateAction<TFilters>>,
  onApply: UseDataTableFiltersOptions<TFilters>["onApply"],
) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const onApplyRef = React.useRef(onApply);
  React.useEffect(() => {
    onApplyRef.current = onApply;
  });

  React.useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  const commit = React.useCallback(
    (next: TFilters, source: "manual" | "live" | "clear") => {
      clearTimeout(timerRef.current);

      if (controlledApplied === undefined) setInternalApplied(next);

      onApplyRef.current?.(next, { source });
    },
    [controlledApplied, setInternalApplied],
  );

  return { timerRef, commit };
}

function useDataTableFilters<TFilters extends Record<string, string>>({
  defaultValues,
  applied: controlledApplied,
  mode = "manual",
  debounceMs = 250,
  isSortModified = false,
  onApply,
  onReset,
}: UseDataTableFiltersOptions<TFilters>): UseDataTableFiltersReturn<TFilters> {
  const [internalApplied, setInternalApplied] = React.useState<TFilters>(
    () => controlledApplied ?? defaultValues,
  );

  const applied = controlledApplied ?? internalApplied;
  const [draft, setDraft] = React.useState<TFilters>(() => applied);
  const [prevApplied, setPrevApplied] = React.useState<TFilters>(applied);

  if (!areFilterRecordsEqual(applied, prevApplied)) {
    setPrevApplied(applied);
    setDraft(applied);
  }

  const { timerRef, commit } = useFilterCommitter(
    controlledApplied,
    setInternalApplied,
    onApply,
  );

  const setField = React.useCallback(
    (key: keyof TFilters & string, value: string) => {
      setDraft((prev) => {
        const next = { ...prev, [key]: value };

        if (mode === "live") {
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => commit(next, "live"), debounceMs);
        }

        return next;
      });
    },
    [mode, debounceMs, commit, timerRef],
  );

  const apply = React.useCallback(
    () => commit(draft, "manual"),
    [commit, draft],
  );

  const reset = React.useCallback(() => {
    clearTimeout(timerRef.current);
    setDraft(defaultValues);

    if (controlledApplied === undefined) setInternalApplied(defaultValues);

    onReset?.();
  }, [controlledApplied, defaultValues, onReset, timerRef]);

  const clearField = React.useCallback(
    (key: keyof TFilters & string) => {
      const nextValue = defaultValues[key] ?? "";
      setDraft({ ...draft, [key]: nextValue });
      commit({ ...applied, [key]: nextValue }, "clear");
    },
    [applied, commit, defaultValues, draft],
  );

  const flags = deriveFilterFlags(
    draft,
    applied,
    defaultValues,
    isSortModified,
  );

  return {
    draft,
    applied,
    defaultValues,
    mode,
    ...flags,
    setField,
    apply,
    reset,
    clearField,
  };
}

const ALL_SELECT_VALUE = "__all__";

interface DataTableFilterBarProps<TFilters extends Record<string, string>> {
  fields: readonly DataTableFilterField[];
  filterState: UseDataTableFiltersReturn<TFilters>;
  layout?: DataTableFilterLayout;
  /** Overrides filterState.mode for action button rendering. */
  mode?: DataTableFilterMode;
  /** Focuses the search input when pressing "/" outside editable controls. */
  enableSlashShortcut?: boolean;
  searchButtonLabel?: string;
  resetButtonLabel?: string;
  liveHelperText?: string;
  className?: string;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable ||
    Boolean(target.closest("[role=dialog],[role=alertdialog]"))
  );
}

function useSlashSearchFocus(
  enabled: boolean,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  React.useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "/" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isEditableElement(event.target)
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, inputRef]);
}

function FilterSearchControl({
  id,
  field,
  value,
  inputRef,
  enableSlashShortcut,
  onChange,
  onClear,
}: {
  id: string;
  field: Extract<DataTableFilterField, { kind: "search" }>;
  value: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  enableSlashShortcut: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} size="sm">
        {field.label}
      </Label>
      <div className="relative flex items-center">
        <IconSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          placeholder={field.placeholder ?? "Search..."}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden pointer-coarse:min-h-11"
        />
        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${field.label}`}
            className="absolute right-2 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11"
          >
            <IconX className="size-4" aria-hidden="true" />
          </button>
        ) : (
          enableSlashShortcut &&
          !focused && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 hidden pointer-fine:inline-flex"
            >
              <Kbd size="sm">/</Kbd>
            </span>
          )
        )}
      </div>
    </div>
  );
}

function FilterSelectControl({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Extract<DataTableFilterField, { kind: "select" }>;
  value: string;
  onChange: (value: string) => void;
}) {
  const allLabel = field.allLabel ?? `All ${field.label.toLowerCase()}`;

  const options = React.useMemo(
    () => [{ value: ALL_SELECT_VALUE, label: allLabel }, ...field.options],
    [allLabel, field.options],
  );

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} size="sm">
        {field.label}
      </Label>
      <KiraSelect
        id={id}
        options={options}
        value={value || ALL_SELECT_VALUE}
        placeholder={field.placeholder ?? allLabel}
        aria-label={field.label}
        className="w-full pointer-coarse:min-h-11 **:data-[slot=select-field-clear]:hidden"
        onChange={(next) => {
          if (!isStringProp(next)) return;
          onChange(next === ALL_SELECT_VALUE ? "" : next);
        }}
      />
    </div>
  );
}

function FilterChipsControl({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Extract<DataTableFilterField, { kind: "chips" }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label id={id} as="span" size="sm">
        {field.label}
      </Label>
      <div
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Labeled toggle-chip group avoids native fieldset borders while preserving ARIA group semantics.
        role="group"
        aria-labelledby={id}
        className="flex flex-wrap gap-2"
      >
        {field.options.map((option) => {
          const active = value === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              aria-pressed={active}
              onClick={() => onChange(active ? "" : option.value)}
              className="h-8 rounded-full px-3 text-xs pointer-coarse:min-h-11"
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function FilterDateRangeControl({
  id,
  field,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
}: {
  id: string;
  field: Extract<DataTableFilterField, { kind: "date-range" }>;
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label id={id} as="span" size="sm">
        {field.label}
      </Label>
      <div
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Composite date-range pair grouped under a shared visible label.
        role="group"
        aria-labelledby={id}
        className="grid grid-cols-2 gap-2"
      >
        <Input
          type="date"
          aria-label={`${field.label} from`}
          value={fromValue}
          max={toValue || undefined}
          onChange={(event) => onFromChange(event.target.value)}
          className="pointer-coarse:min-h-11"
        />
        <Input
          type="date"
          aria-label={`${field.label} to`}
          value={toValue}
          min={fromValue || undefined}
          onChange={(event) => onToChange(event.target.value)}
          className="pointer-coarse:min-h-11"
        />
      </div>
    </div>
  );
}

const SEARCH_WRAPPER_LAYOUT: Record<DataTableFilterLayout, string> = {
  toolbar: "col-span-2 min-[820px]:col-span-1",
  stacked: "col-span-full",
  sidebar: "",
};

const FILTER_BAR_FORM_LAYOUT: Record<DataTableFilterLayout, string> = {
  toolbar:
    "grid grid-cols-2 items-end gap-3 min-[820px]:grid-cols-[2fr_1fr_1fr_1fr_auto]",
  stacked: "grid grid-cols-2 items-end gap-3 min-[820px]:grid-cols-3",
  sidebar: "flex flex-col gap-4",
};

const FILTER_BAR_ACTION_LAYOUT: Record<DataTableFilterLayout, string> = {
  toolbar:
    "col-span-2 grid grid-cols-2 min-[820px]:col-span-1 min-[820px]:flex",
  stacked: "col-span-full justify-end pt-1",
  sidebar: "grid grid-cols-2 pt-1",
};

function getFilterFieldId(field: DataTableFilterField): string {
  return field.kind === "date-range"
    ? `${field.fromKey}-${field.toKey}`
    : field.key;
}

function readDraftField<TFilters extends Record<string, string>>(
  draft: TFilters,
  key: string,
): string {
  return draft[key] ?? "";
}

function FilterBarFieldItem<TFilters extends Record<string, string>>({
  baseId,
  field,
  filterState,
  layout,
  searchRef,
  enableSlashShortcut,
}: {
  baseId: string;
  field: DataTableFilterField;
  filterState: UseDataTableFiltersReturn<TFilters>;
  layout: DataTableFilterLayout;
  searchRef: React.RefObject<HTMLInputElement | null>;
  enableSlashShortcut: boolean;
}) {
  const id = `${baseId}-${getFilterFieldId(field)}`;

  if (field.kind === "search") {
    // SAFETY: Caller field definitions map string keys onto TFilters.
    const key = field.key as keyof TFilters & string;

    return (
      <div className={SEARCH_WRAPPER_LAYOUT[layout]}>
        <FilterSearchControl
          id={id}
          field={field}
          value={readDraftField(filterState.draft, key)}
          inputRef={searchRef}
          enableSlashShortcut={enableSlashShortcut}
          onChange={(value) => filterState.setField(key, value)}
          onClear={() => filterState.clearField(key)}
        />
      </div>
    );
  }

  if (field.kind === "select") {
    // SAFETY: Caller field definitions map string keys onto TFilters.
    const key = field.key as keyof TFilters & string;

    return (
      <FilterSelectControl
        id={id}
        field={field}
        value={readDraftField(filterState.draft, key)}
        onChange={(value) => filterState.setField(key, value)}
      />
    );
  }

  if (field.kind === "chips") {
    // SAFETY: Caller field definitions map string keys onto TFilters.
    const key = field.key as keyof TFilters & string;

    return (
      <FilterChipsControl
        id={id}
        field={field}
        value={readDraftField(filterState.draft, key)}
        onChange={(value) => filterState.setField(key, value)}
      />
    );
  }

  // SAFETY: Caller date-range field definitions map string keys onto TFilters.
  const fromKey = field.fromKey as keyof TFilters & string;

  // SAFETY: Caller date-range field definitions map string keys onto TFilters.
  const toKey = field.toKey as keyof TFilters & string;

  return (
    <FilterDateRangeControl
      id={id}
      field={field}
      fromValue={readDraftField(filterState.draft, fromKey)}
      toValue={readDraftField(filterState.draft, toKey)}
      onFromChange={(value) => filterState.setField(fromKey, value)}
      onToChange={(value) => filterState.setField(toKey, value)}
    />
  );
}

function FilterSubmitButton({
  label,
  isDirty,
}: {
  label: string;
  isDirty: boolean;
}) {
  return (
    <Button type="submit" className="relative pointer-coarse:min-h-11">
      {label}
      {isDirty && (
        <span
          aria-hidden="true"
          className="ml-2 inline-block size-2 rounded-full bg-primary-foreground"
        />
      )}
    </Button>
  );
}

function FilterResetButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      className="pointer-coarse:min-h-11"
    >
      {label}
    </Button>
  );
}

function FilterBarActions<TFilters extends Record<string, string>>({
  layout,
  mode,
  filterState,
  searchButtonLabel,
  resetButtonLabel,
  liveHelperText,
}: {
  layout: DataTableFilterLayout;
  mode: DataTableFilterMode;
  filterState: UseDataTableFiltersReturn<TFilters>;
  searchButtonLabel: string;
  resetButtonLabel: string;
  liveHelperText: string;
}) {
  if (mode === "live") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2",
          layout === "toolbar" && "col-span-2 min-[820px]:col-span-1",
        )}
      >
        <p className="text-xs text-muted-foreground">{liveHelperText}</p>
        {layout !== "sidebar" && (
          <FilterResetButton
            label={resetButtonLabel}
            disabled={!filterState.canReset}
            onClick={filterState.reset}
          />
        )}
      </div>
    );
  }

  const submitBtn = (
    <FilterSubmitButton
      label={searchButtonLabel}
      isDirty={filterState.isDirty}
    />
  );

  const resetBtn = (
    <FilterResetButton
      label={resetButtonLabel}
      disabled={!filterState.canReset}
      onClick={filterState.reset}
    />
  );

  return (
    <div
      className={cn("flex items-end gap-2", FILTER_BAR_ACTION_LAYOUT[layout])}
    >
      {layout === "stacked" ? (
        <>
          {resetBtn}
          {submitBtn}
        </>
      ) : (
        <>
          {submitBtn}
          {resetBtn}
        </>
      )}
    </div>
  );
}

function DataTableMobileFilterCollapse({
  activeCount,
  children,
}: {
  activeCount: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div data-slot="data-table-filter-sidebar" className="min-w-0">
      <div className="min-[820px]:hidden">
        <Collapsible open={mobileOpen} onOpenChange={setMobileOpen}>
          <CollapsibleTrigger
            variant="outline"
            size="sm"
            className="justify-between pointer-coarse:min-h-11"
          >
            <span className="inline-flex items-center gap-2">
              <IconFilter className="size-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="tabular-nums">
                  {activeCount}
                </Badge>
              )}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
        </Collapsible>
      </div>
      <div className="hidden min-[820px]:block">{children}</div>
    </div>
  );
}

function DataTableFilterBar<TFilters extends Record<string, string>>({
  fields,
  filterState,
  layout = "toolbar",
  mode: modeOverride,
  enableSlashShortcut = false,
  searchButtonLabel = "Search",
  resetButtonLabel = "Reset",
  liveHelperText = "Filters apply as you type",
  className,
}: DataTableFilterBarProps<TFilters>) {
  const mode = modeOverride ?? filterState.mode;
  const baseId = React.useId();
  const searchRef = React.useRef<HTMLInputElement>(null);

  useSlashSearchFocus(enableSlashShortcut, searchRef);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    filterState.apply();
  };

  const formBody = (
    <form
      onSubmit={handleSubmit}
      data-slot="data-table-filter-bar"
      data-layout={layout}
      className={cn(FILTER_BAR_FORM_LAYOUT[layout], className)}
    >
      {fields.map((field) => (
        <FilterBarFieldItem
          key={getFilterFieldId(field)}
          baseId={baseId}
          field={field}
          filterState={filterState}
          layout={layout}
          searchRef={searchRef}
          enableSlashShortcut={enableSlashShortcut}
        />
      ))}
      <FilterBarActions
        layout={layout}
        mode={mode}
        filterState={filterState}
        searchButtonLabel={searchButtonLabel}
        resetButtonLabel={resetButtonLabel}
        liveHelperText={liveHelperText}
      />
    </form>
  );

  if (layout === "sidebar") {
    return (
      <DataTableMobileFilterCollapse activeCount={filterState.activeCount}>
        {formBody}
      </DataTableMobileFilterCollapse>
    );
  }

  return formBody;
}

interface DataTableActiveFiltersProps<TFilters extends Record<string, string>> {
  fields: readonly DataTableFilterField[];
  filterState: UseDataTableFiltersReturn<TFilters>;
  className?: string;
}

interface ActiveFilterTag {
  key: string;
  label: string;
  displayValue: string;
}

function collectDateRangeTags<TFilters extends Record<string, string>>(
  field: Extract<DataTableFilterField, { kind: "date-range" }>,
  applied: TFilters,
  defaults: TFilters,
): ActiveFilterTag[] {
  const tags: ActiveFilterTag[] = [];

  const pairs: readonly [string, string][] = [
    [field.fromKey, `${field.label} from`],
    [field.toKey, `${field.label} to`],
  ];

  for (const [key, label] of pairs) {
    const val = (applied[key] ?? "").trim();

    if (val && val !== (defaults[key] ?? "").trim()) {
      tags.push({ key, label, displayValue: val });
    }
  }

  return tags;
}

function collectSingleFieldTag<TFilters extends Record<string, string>>(
  field: Exclude<DataTableFilterField, { kind: "date-range" }>,
  applied: TFilters,
  defaults: TFilters,
): ActiveFilterTag | null {
  const raw = (applied[field.key] ?? "").trim();

  if (!raw || raw === (defaults[field.key] ?? "").trim()) return null;

  const displayValue =
    field.kind === "search"
      ? raw
      : (field.options.find((opt) => opt.value === raw)?.label ?? raw);

  return { key: field.key, label: field.label, displayValue };
}

function collectActiveFilterTags<TFilters extends Record<string, string>>(
  fields: readonly DataTableFilterField[],
  applied: TFilters,
  defaults: TFilters,
): ActiveFilterTag[] {
  const tags: ActiveFilterTag[] = [];

  for (const field of fields) {
    if (field.kind === "date-range") {
      tags.push(...collectDateRangeTags(field, applied, defaults));
      continue;
    }

    const tag = collectSingleFieldTag(field, applied, defaults);

    if (tag) tags.push(tag);
  }

  return tags;
}

function DataTableActiveFilters<TFilters extends Record<string, string>>({
  fields,
  filterState,
  className,
}: DataTableActiveFiltersProps<TFilters>) {
  const tags = collectActiveFilterTags(
    fields,
    filterState.applied,
    filterState.defaultValues,
  );

  if (tags.length === 0) return null;

  return (
    <div
      data-slot="data-table-active-filters"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {tags.map((tag) => (
        <Badge
          key={tag.key}
          variant="outline"
          className="gap-2 border-primary/40 bg-primary/5 py-1 pl-3 pr-2 text-xs font-medium text-foreground"
        >
          <span className="text-muted-foreground">{tag.label}:</span>
          <span>{tag.displayValue}</span>
          <button
            type="button"
            onClick={() => {
              // SAFETY: Tag keys originate from caller field definitions on TFilters.
              filterState.clearField(tag.key as keyof TFilters & string);
            }}
            aria-label={`Remove ${tag.label}: ${tag.displayValue}`}
            className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11"
          >
            <IconX className="size-3" aria-hidden="true" />
          </button>
        </Badge>
      ))}
      {tags.length > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={filterState.reset}
          className="h-7 px-2 text-xs text-muted-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

function DataTableCardSortBar<TData extends RowData>({
  table,
  columnLabels,
}: {
  table: DTTable<TData>;
  columnLabels: Readonly<Record<string, string>>;
}) {
  "use no memo";

  const selectId = React.useId();
  const state = useTableState(table);

  const sortableCols = table
    .getAllLeafColumns()
    .filter((column) => column.getCanSort());

  if (sortableCols.length === 0) return null;

  const options: DataTableFilterOption[] = [
    { value: "none", label: "Default order" },
  ];

  for (const col of sortableCols) {
    const label = columnLabel(col, columnLabels);
    options.push(
      { value: `${col.id}:asc`, label: `${label} (A–Z / Asc)` },
      { value: `${col.id}:desc`, label: `${label} (Z–A / Desc)` },
    );
  }

  const currentSort = state.sorting[0];

  const currentValue = currentSort
    ? `${currentSort.id}:${currentSort.desc ? "desc" : "asc"}`
    : "none";

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
      <Label htmlFor={selectId} size="sm" className="text-muted-foreground">
        Sort by
      </Label>
      <KiraSelect
        id={selectId}
        options={options}
        value={currentValue}
        aria-label="Sort by"
        className="w-52 max-w-full pointer-coarse:min-h-11 **:data-[slot=select-field-clear]:hidden"
        onChange={(next) => {
          if (!isStringProp(next)) return;

          if (next === "none") {
            table.setSorting([]);

            return;
          }

          const [id, dir] = next.split(":");

          if (id) table.setSorting([{ id, desc: dir === "desc" }]);
        }}
      />
    </div>
  );
}

function DataTableCardSkeletons({ count }: { count: number }) {
  return (
    <div
      data-slot="data-table-card-skeletons"
      aria-busy="true"
      className="grid grid-cols-1 gap-3"
    >
      <span className="sr-only">Loading items</span>
      {Array.from({ length: count }, (_, idx) => (
        <div
          key={`card-sk-${idx}`}
          aria-hidden="true"
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="grid grid-cols-2 gap-3 min-[820px]:flex min-[820px]:items-center min-[820px]:justify-between">
            <div className="col-span-2 space-y-2 min-[820px]:w-1/3">
              <div className="h-4 w-3/4 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none" />
              <div className="h-3 w-1/3 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none" />
            </div>
            <div className="h-6 w-20 animate-skeleton-wave rounded-full bg-muted motion-reduce:animate-none" />
            <div className="h-4 w-28 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none" />
            <div className="h-4 w-24 animate-skeleton-wave rounded bg-muted motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DefaultDataTableCard<TData extends RowData>({
  row,
  columnLabels,
}: {
  row: DTRow<TData>;
  columnLabels: Readonly<Record<string, string>>;
}) {
  "use no memo";

  const cells = row
    .getVisibleCells()
    .filter((cell) => cell.column.id !== "select" && cell.column.id !== "drag");

  const [primaryCell, ...restCells] = cells;
  const actionsCell = restCells.find((cell) => cell.column.id === "actions");
  const metaCells = restCells.filter((cell) => cell.column.id !== "actions");

  return (
    <div className="grid grid-cols-2 items-center gap-3 min-[820px]:flex min-[820px]:items-center min-[820px]:justify-between min-[820px]:gap-4">
      {primaryCell && (
        <div className="col-span-2 flex min-w-0 items-center justify-between gap-2 min-[820px]:flex-1">
          <div className="min-w-0 font-medium text-foreground">
            <FlexRender cell={primaryCell} />
          </div>
          {actionsCell && (
            <div className="shrink-0 min-[820px]:hidden">
              <FlexRender cell={actionsCell} />
            </div>
          )}
        </div>
      )}
      {metaCells.map((cell) => (
        <div key={cell.id} className="min-w-0 text-sm">
          <span className="block text-xs text-muted-foreground min-[820px]:hidden">
            {columnLabel(cell.column, columnLabels)}
          </span>
          <FlexRender cell={cell} />
        </div>
      ))}
      {actionsCell && (
        <div className="hidden shrink-0 min-[820px]:block">
          <FlexRender cell={actionsCell} />
        </div>
      )}
    </div>
  );
}

function DataTableCardList<TData extends RowData>({
  renderCard,
  emptyState,
  showCardSort = true,
  skeletonRows,
  className,
}: DataTableContentProps<TData>) {
  "use no memo";

  const ctx = useDataTable<TData>();

  const {
    table,
    columnLabels,
    isLoading,
    isFetching,
    error,
    onRetry,
    onRowClick,
    pendingRowIds,
  } = ctx;

  const state = useTableState(table);
  const reducedMotion = useReducedMotion();
  const rows = table.getRowModel().rows;

  const load = resolveStaticLoadFlags(
    isLoading,
    isFetching,
    rows.length,
    Math.min(state.pagination.pageSize, 6),
    skeletonRows,
  );

  const showSort = showCardSort && Boolean(table.options.enableSorting);
  const showErrorBanner = Boolean(error) && rows.length > 0;

  return (
    <div
      data-slot="data-table-card-list"
      aria-busy={load.isBusy || undefined}
      className={cn("min-w-0", className)}
    >
      {showSort && (
        <DataTableCardSortBar table={table} columnLabels={columnLabels} />
      )}
      {showErrorBanner && (
        <DataTableInlineErrorBanner error={error} onRetry={onRetry} />
      )}
      {load.showInitialSkeleton ? (
        <DataTableCardSkeletons count={load.skeletonCount} />
      ) : (
        <DataTableCardItems
          rows={rows}
          emptyState={emptyState}
          ctx={ctx}
          isRefetching={load.isRefetching}
          pendingRowIds={pendingRowIds}
          reducedMotion={reducedMotion}
          onRowClick={onRowClick}
          renderCard={renderCard}
          columnLabels={columnLabels}
        />
      )}
    </div>
  );
}

function DataTableCardItem<TData extends RowData>({
  row,
  index,
  isPending,
  reducedMotion,
  onRowClick,
  renderCard,
  columnLabels,
}: {
  row: DTRow<TData>;
  index: number;
  isPending: boolean;
  reducedMotion: boolean;
  onRowClick?: (row: DTRow<TData>) => void;
  renderCard?: (row: DTRow<TData>) => React.ReactNode;
  columnLabels: Readonly<Record<string, string>>;
}) {
  const stagger = !reducedMotion && index < 6;

  const content = renderCard ? (
    renderCard(row)
  ) : (
    <DefaultDataTableCard row={row} columnLabels={columnLabels} />
  );

  const handleClick = onRowClick
    ? (event: React.MouseEvent<HTMLLIElement>) => {
        if (!isInteractiveTarget(event.target)) onRowClick(row);
      }
    : undefined;

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Optional row-level click convenience mirrors table rows; interactive cell controls handle keyboard actions directly.
    <li
      aria-busy={isPending || undefined}
      data-pending={isPending ? "true" : undefined}
      style={stagger ? { animationDelay: `${index * 35}ms` } : undefined}
      onClick={handleClick}
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card,0_0_transparent)]",
        "motion-safe:transition-[transform,border-color,box-shadow] motion-reduce:transition-none",
        "[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-primary/40",
        stagger && "motion-safe:animate-fade-in",
        onRowClick && "cursor-pointer",
        isPending && "opacity-60",
      )}
    >
      {content}
    </li>
  );
}

function DataTableCardItems<TData extends RowData>({
  rows,
  emptyState,
  ctx,
  isRefetching,
  pendingRowIds,
  reducedMotion,
  onRowClick,
  renderCard,
  columnLabels,
}: {
  rows: DTRow<TData>[];
  emptyState: DataTableContentProps<TData>["emptyState"];
  ctx: DataTableContextValue<TData>;
  isRefetching: boolean;
  pendingRowIds?: ReadonlySet<string>;
  reducedMotion: boolean;
  onRowClick?: (row: DTRow<TData>) => void;
  renderCard?: (row: DTRow<TData>) => React.ReactNode;
  columnLabels: Readonly<Record<string, string>>;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        {resolveDataTableEmptyNode(emptyState, ctx)}
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "m-0 grid list-none grid-cols-1 gap-3 p-0",
        isRefetching && "opacity-60 motion-safe:transition-opacity",
      )}
    >
      {rows.map((row, index) => (
        <DataTableCardItem
          key={row.id}
          row={row}
          index={index}
          isPending={Boolean(pendingRowIds?.has(row.id))}
          reducedMotion={reducedMotion}
          onRowClick={onRowClick}
          renderCard={renderCard}
          columnLabels={columnLabels}
        />
      ))}
    </ul>
  );
}

type DataTablePreset = "toolbar" | "sidebar" | "cards";

interface KiraDataTableProps<
  TData extends RowData,
  TValue = unknown,
  TFilters extends Record<string, string> = Record<string, string>,
> extends Omit<DataTableProps<TData, TValue>, "children"> {
  /** Layout preset: "toolbar" (default), "sidebar", or "cards". */
  preset?: DataTablePreset;
  /** Results layout. Defaults to cards for the cards preset and table otherwise. */
  view?: DataTableContentProps<TData>["view"];
  title?: React.ReactNode;
  hint?: React.ReactNode;
  /** Displayed inside the title as "Title (N)". Defaults to server rowCount or data.length. */
  totalCount?: number;
  filters?: readonly DataTableFilterField[];
  filterState?: UseDataTableFiltersReturn<TFilters>;
  filterMode?: DataTableFilterMode;
  showActiveFilters?: boolean;
  enableSlashShortcut?: boolean;
  stickyHeader?: boolean;
  renderCard?: (row: DTRow<TData>) => React.ReactNode;
  emptyState?: DataTableContentProps<TData>["emptyState"];
  tableLabel?: string;
  headerActions?: React.ReactNode;
  bulkActions?: React.ReactNode;
  pagination?: DataTablePaginationProps | false;
  className?: string;
  contentClassName?: string;
}

function KiraDataTableResultsHeader<TFilters extends Record<string, string>>({
  title,
  count,
  hint,
  preset,
  filterState,
  headerActions,
}: {
  title?: React.ReactNode;
  count: number;
  hint?: React.ReactNode;
  preset: DataTablePreset;
  filterState?: UseDataTableFiltersReturn<TFilters>;
  headerActions?: React.ReactNode;
}) {
  if (!title && !hint && !headerActions && preset !== "sidebar") return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-baseline gap-2">
        {title && (
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {title}{" "}
            <span className="font-normal tabular-nums text-muted-foreground">
              ({count})
            </span>
          </h2>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        {preset === "sidebar" && filterState && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!filterState.canReset}
            onClick={filterState.reset}
            className="pointer-coarse:min-h-11"
          >
            Reset
          </Button>
        )}
        {headerActions}
      </div>
    </div>
  );
}

interface KiraDataTableLayoutViewProps<
  TFilters extends Record<string, string>,
> {
  preset: DataTablePreset;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  resolvedCount: number;
  filters?: readonly DataTableFilterField[];
  filterState?: UseDataTableFiltersReturn<TFilters>;
  resolvedFilterMode: DataTableFilterMode;
  resolvedShowActive: boolean;
  resolvedSlash: boolean;
  headerActions?: React.ReactNode;
  bulkActions?: React.ReactNode;
  tableContent: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}

function KiraDataTableActiveBar<TFilters extends Record<string, string>>({
  show,
  filters,
  filterState,
}: {
  show: boolean;
  filters?: readonly DataTableFilterField[];
  filterState?: UseDataTableFiltersReturn<TFilters>;
}) {
  if (!show || !filters || !filterState) return null;

  return <DataTableActiveFilters fields={filters} filterState={filterState} />;
}

function KiraDataTableSidebarLayout<TFilters extends Record<string, string>>(
  props: KiraDataTableLayoutViewProps<TFilters>,
) {
  const { filters, filterState } = props;

  return (
    <div
      data-slot="kira-data-table"
      data-preset="sidebar"
      className={cn(
        "grid grid-cols-1 gap-4 min-[820px]:grid-cols-[16rem_minmax(0,1fr)] min-[820px]:items-start",
        props.className,
      )}
    >
      {filters && filterState && (
        <Card size="sm" className="min-[820px]:sticky min-[820px]:top-4">
          <CardContent>
            <DataTableFilterBar
              fields={filters}
              filterState={filterState}
              layout="sidebar"
              mode={props.resolvedFilterMode}
              enableSlashShortcut={props.resolvedSlash}
            />
          </CardContent>
        </Card>
      )}
      <div className="min-w-0 space-y-3">
        <KiraDataTableResultsHeader
          title={props.title}
          count={props.resolvedCount}
          hint={props.hint}
          preset="sidebar"
          filterState={filterState}
          headerActions={props.headerActions}
        />
        <KiraDataTableActiveBar
          show={props.resolvedShowActive}
          filters={filters}
          filterState={filterState}
        />
        {props.bulkActions}
        {props.tableContent}
        {props.footer}
      </div>
    </div>
  );
}

function KiraDataTableCardsLayout<TFilters extends Record<string, string>>(
  props: KiraDataTableLayoutViewProps<TFilters>,
) {
  const { filters, filterState } = props;

  return (
    <div
      data-slot="kira-data-table"
      data-preset="cards"
      className={cn("min-w-0 space-y-4", props.className)}
    >
      {filters && filterState && (
        <Card size="sm">
          <CardContent>
            <DataTableFilterBar
              fields={filters}
              filterState={filterState}
              layout="stacked"
              mode={props.resolvedFilterMode}
              enableSlashShortcut={props.resolvedSlash}
            />
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        <KiraDataTableResultsHeader
          title={props.title}
          count={props.resolvedCount}
          hint={props.hint}
          preset="cards"
          filterState={filterState}
          headerActions={props.headerActions}
        />
        <KiraDataTableActiveBar
          show={props.resolvedShowActive}
          filters={filters}
          filterState={filterState}
        />
        {props.bulkActions}
        {props.tableContent}
        {props.footer}
      </div>
    </div>
  );
}

function KiraDataTableToolbarLayout<TFilters extends Record<string, string>>(
  props: KiraDataTableLayoutViewProps<TFilters>,
) {
  const { filters, filterState } = props;
  const hasHeader = Boolean(props.title || props.hint || props.headerActions);

  return (
    <Card
      size="sm"
      data-slot="kira-data-table"
      data-preset="toolbar"
      className={cn("min-w-0", props.className)}
    >
      {hasHeader && (
        <CardHeader className="border-b border-border">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>
              {props.title}{" "}
              <span className="font-normal tabular-nums text-muted-foreground">
                ({props.resolvedCount})
              </span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {props.hint && <CardDescription>{props.hint}</CardDescription>}
              {props.headerActions}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {filters && filterState && (
          <DataTableFilterBar
            fields={filters}
            filterState={filterState}
            layout="toolbar"
            mode={props.resolvedFilterMode}
            enableSlashShortcut={props.resolvedSlash}
          />
        )}
        <KiraDataTableActiveBar
          show={props.resolvedShowActive}
          filters={filters}
          filterState={filterState}
        />
        {props.bulkActions}
        {props.tableContent}
        {props.footer}
      </CardContent>
    </Card>
  );
}

function KiraDataTableLayoutView<TFilters extends Record<string, string>>(
  props: KiraDataTableLayoutViewProps<TFilters>,
) {
  if (props.preset === "sidebar") {
    return <KiraDataTableSidebarLayout {...props} />;
  }

  if (props.preset === "cards") {
    return <KiraDataTableCardsLayout {...props} />;
  }

  return <KiraDataTableToolbarLayout {...props} />;
}

function resolveKiraPaginationConfig(
  preset: DataTablePreset,
  pagination?: DataTablePaginationProps | false,
): DataTablePaginationProps | false {
  if (pagination === false) return false;

  return {
    showPageInfo: true,
    showPageSize: true,
    infoFormat: "{start}–{end} of {total}",
    pageSizeOptions: [6, 12, 24],
    showFirstLast: false,
    showJump: preset === "sidebar",
    variant: preset === "cards" ? "pills" : "outline",
    ...pagination,
  };
}

function resolveKiraPresetDefaults(
  preset: DataTablePreset,
  overrides: {
    view?: "table" | "cards";
    filterMode?: DataTableFilterMode;
    showActiveFilters?: boolean;
    enableSlashShortcut?: boolean;
    stickyHeader?: boolean;
  },
) {
  return {
    view: overrides.view ?? (preset === "cards" ? "cards" : "table"),
    filterMode:
      overrides.filterMode ?? (preset === "sidebar" ? "live" : "manual"),
    showActive: overrides.showActiveFilters ?? preset === "cards",
    slash: overrides.enableSlashShortcut ?? preset === "sidebar",
    stickyHeader: overrides.stickyHeader ?? preset === "toolbar",
  };
}

function renderKiraPaginationFooter(
  preset: DataTablePreset,
  pagination?: DataTablePaginationProps | false,
): React.ReactNode {
  const config = resolveKiraPaginationConfig(preset, pagination);

  if (config === false) return null;

  return (
    <DataTablePagination
      {...config}
      className={cn(preset === "cards" && "justify-center", config.className)}
    />
  );
}

function KiraDataTable<
  TData extends RowData,
  TValue = unknown,
  TFilters extends Record<string, string> = Record<string, string>,
>({
  preset = "toolbar",
  view,
  title,
  hint,
  totalCount,
  filters,
  filterState,
  filterMode,
  showActiveFilters,
  enableSlashShortcut,
  stickyHeader,
  renderCard,
  emptyState,
  tableLabel,
  headerActions,
  bulkActions,
  pagination,
  className,
  contentClassName,
  ...rootProps
}: KiraDataTableProps<TData, TValue, TFilters>) {
  const resolvedCount =
    totalCount ?? rootProps.serverPagination?.rowCount ?? rootProps.data.length;

  const defaults = resolveKiraPresetDefaults(preset, {
    view,
    filterMode,
    showActiveFilters,
    enableSlashShortcut,
    stickyHeader,
  });

  return (
    <DataTableRoot
      {...rootProps}
      hasActiveFilters={
        rootProps.hasActiveFilters ?? filterState?.hasActiveFilters
      }
      onResetFilters={rootProps.onResetFilters ?? filterState?.reset}
    >
      <KiraDataTableLayoutView
        preset={preset}
        title={title}
        hint={hint}
        resolvedCount={resolvedCount}
        filters={filters}
        filterState={filterState}
        resolvedFilterMode={defaults.filterMode}
        resolvedShowActive={defaults.showActive}
        resolvedSlash={defaults.slash}
        headerActions={headerActions}
        bulkActions={bulkActions}
        tableContent={
          <DataTableContent
            view={defaults.view}
            stickyHeader={defaults.stickyHeader}
            renderCard={renderCard}
            emptyState={emptyState}
            label={tableLabel}
            className={contentClassName}
          />
        }
        footer={renderKiraPaginationFooter(preset, pagination)}
        className={className}
      />
    </DataTableRoot>
  );
}
