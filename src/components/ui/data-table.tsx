"use client";

"use no memo";
// Compiler opt-out: TanStack Virtual's useVirtualizer is still on React
// Compiler's incompatible-library list, and getters like getRowModel() read
// instance state the compiler can't see. Re-renders are driven explicitly by
// useSelector subscriptions below. Re-evaluate once TanStack Virtual ships a
// compiler-safe API.

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
  SortingState,
  Table as TanstackTable,
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
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
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
import { resolveComponentDefaults } from "@/lib/component-defaults";
import {
  isStringProp,
  isCallbackProp,
  isNumberProp,
} from "@/lib/component-prop-guards";

// =============================================================================
// Features & types (TanStack Table v9)
// =============================================================================

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

// =============================================================================
// Small helpers
// =============================================================================

/** Column ids may contain dots/spaces — make them safe custom-property names. */
const cssId = (id: string) => id.replace(/[^\w-]/g, "_");

const INTERACTIVE_SELECTOR =
  "a,button,input,select,textarea,label,[role=checkbox],[role=menuitem],[role=separator],[contenteditable=true]";

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;

function columnLabel(
  column: { id: string; columnDef: { header?: unknown } } | undefined,
) {
  const header = column?.columnDef.header;

  if (isStringProp(header)) return header;

  return (column?.id ?? "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");
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
  if (isCallbackProp(subscription)) {
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

// =============================================================================
// Context
// =============================================================================

interface DataTableContextValue<TData extends RowData> {
  table: DTTable<TData>;
  density: DataTableDensity;
  setDensity: (density: DataTableDensity) => void;
  enablePagination: boolean;
  enableVirtualization: boolean;
  enableKeyboardNavigation: boolean;
  estimateRowHeight?: number;
  containerHeight: number;
  onLoadMore?: () => void;
  isLoading: boolean;
  hasNextPage: boolean;
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

// =============================================================================
// Persistence
// =============================================================================

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

// =============================================================================
// Announcements (WCAG 4.1.3)
// =============================================================================

function describeChange<TData extends RowData>(
  table: DTTable<TData>,
  prev: DTState,
  next: DTState,
): string | null {
  if (next.sorting !== prev.sorting) {
    const s = next.sorting[0];

    if (!s) return "Sorting cleared";

    return `Sorted by ${columnLabel(table.getColumn(s.id))}, ${s.desc ? "descending" : "ascending"}`;
  }

  if (
    next.columnFilters !== prev.columnFilters ||
    next.globalFilter !== prev.globalFilter
  ) {
    const n = table.getFilteredRowModel().rows.length;

    return `${n} ${n === 1 ? "result" : "results"}`;
  }

  if (next.pagination.pageIndex !== prev.pagination.pageIndex) {
    return `Page ${next.pagination.pageIndex + 1} of ${Math.max(1, table.getPageCount())}`;
  }

  return null;
}

// =============================================================================
// DataTableRoot
// =============================================================================

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
  initialSorting?: SortingState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getSubRows?: (originalRow: TData) => TData[] | undefined;
  getRowCanExpand?: (row: DTRow<TData>) => boolean;
  /** Initial virtual row height guess; defaults to a density-based estimate. */
  estimateRowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
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

// =============================================================================
// DataTableSearch
// =============================================================================

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

// =============================================================================
// Grid keyboard navigation — APG data grid, roving tabindex
// =============================================================================

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

// =============================================================================
// Shared frame: <Table> + header
// =============================================================================

interface DataTableContentProps<TData extends RowData> {
  renderSubComponent?: (props: { row: DTRow<TData> }) => React.ReactNode;
  stickyHeader?: boolean;
  expandOnRowClick?: boolean;
  enableReordering?: boolean;
  onReorder?: (newOrder: string[]) => void;
  density?: DataTableDensity;
  emptyState?: React.ReactNode;
  striped?: boolean;
  bordered?: boolean;
  /** Accessible name for the table's scroll region. */
  label?: string;
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
  children: React.ReactNode;
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
  children,
}: DataTableFrameProps<TData>) {
  const { table, density: ctxDensity } = useDataTable<TData>();
  const density = content.density ?? ctxDensity;
  const sticky = forceStickyHeader || !!content.stickyHeader;
  const resizable = !!table.options.enableColumnResizing;
  const headerGroups = table.getHeaderGroups();

  // Widths as CSS variables on <table>: during a resize drag only this style
  // changes, and the (memoized) body picks the new widths up via var().
  const style: React.CSSProperties & Record<`--${string}`, number | undefined> =
    {};

  for (const header of table.getFlatHeaders()) {
    style[`--header-${cssId(header.id)}-size`] = header.getSize();
    style[`--col-${cssId(header.column.id)}-size`] = header.column.getSize();
  }

  if (resizable) {
    // Fixed layout + explicit width so the browser honors column widths; stable
    // from first render so columns don't snap when a drag starts.
    Object.assign(style, {
      width: table.getTotalSize(),
      minWidth: "100%",
      tableLayout: "fixed",
    });
  }

  return (
    <Table
      ref={tableRef}
      density={DENSITY_TO_TABLE[density]}
      striped={content.striped}
      bordered={content.bordered}
      stickyHeader={sticky}
      label={content.label}
      isGrid={isGrid}
      ariaRowCount={rowCount + headerGroups.length}
      ariaColCount={table.getVisibleLeafColumns().length}
      onKeyDown={onKeyDown}
      containerRef={containerRef}
      containerStyle={containerStyle}
      // The scroll container must be Table's own wrapper — a sticky header
      // only sticks to its nearest scrolling ancestor.
      containerClassName={cn(
        "rounded-lg border border-border",
        sticky && !containerStyle?.height && "max-h-[600px]",
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
}: {
  header: DTHeader<TData>;
  isGrid: boolean;
}) {
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
      {header.isPlaceholder ? null : <FlexRender header={header} />}
      {column.getCanResize() && <DataTableResizeHandle header={header} />}
    </TableHead>
  );
}

// =============================================================================
// Body rows
// =============================================================================

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
}: DataTableRowProps<TData>) {
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

function DataTableEmptyRow({
  colSpan,
  emptyState,
}: {
  colSpan: number;
  emptyState?: React.ReactNode;
}) {
  return (
    <tr>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {emptyState ?? (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <IconInbox className="mb-2 size-8" aria-hidden="true" />
            <span>No results found</span>
          </div>
        )}
      </TableCell>
    </tr>
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
  emptyState?: React.ReactNode;
}

function DataTableRows<TData extends RowData>({
  rows,
  colCount,
  emptyState,
  ...rowProps
}: DataTableRowsProps<TData>) {
  return (
    <TableBody>
      {rows.length ? (
        rows.map((row, i) => (
          <DataTableRow key={row.id} row={row} rowIndex={i} {...rowProps} />
        ))
      ) : (
        <DataTableEmptyRow colSpan={colCount} emptyState={emptyState} />
      )}
    </TableBody>
  );
}

// Only used *while resizing* (TanStack's recommended pattern): selection and
// expansion don't change row-model identity, so an always-on memo would paint
// stale checkboxes.
// SAFETY: React.memo returns Exactly<T> at runtime; the cast hides only the
// memo wrapper's distinct call signature to keep JSX usage unchanged.
const DataTableRowsMemo = React.memo(DataTableRows) as typeof DataTableRows;

// =============================================================================
// DataTableContent — static / virtualized / reorderable
// =============================================================================

function DataTableContent<TData extends RowData>(
  props: DataTableContentProps<TData>,
) {
  const { enableVirtualization } = useDataTable<TData>();

  if (enableVirtualization) return <DataTableVirtualContent {...props} />;

  if (props.enableReordering) return <DataTableReorderableContent {...props} />;

  return <DataTableStaticContent {...props} />;
}

function DataTableStaticContent<TData extends RowData>(
  props: DataTableContentProps<TData>,
) {
  const { table, enableKeyboardNavigation } = useDataTable<TData>();
  useTableState(table);

  const rows = table.getRowModel().rows;
  const colCount = table.getVisibleLeafColumns().length;
  const tableRef = React.useRef<HTMLTableElement>(null);

  const nav = useGridNavigation({
    enabled: enableKeyboardNavigation,
    rowCount: rows.length,
    colCount,
    tableRef,
  });

  const isResizing = table
    .getVisibleLeafColumns()
    .some((c) => c.getIsResizing());

  const Rows = isResizing ? DataTableRowsMemo : DataTableRows;

  return (
    <DataTableFrame
      content={props}
      isGrid={enableKeyboardNavigation}
      rowCount={rows.length}
      tableRef={tableRef}
      onKeyDown={nav.onKeyDown}
    >
      <Rows
        rows={rows}
        colCount={colCount}
        isGrid={enableKeyboardNavigation}
        activeRow={nav.activeRow}
        activeCol={nav.activeCol}
        onCellFocus={nav.setActive}
        expandOnRowClick={!!props.expandOnRowClick}
        renderSubComponent={props.renderSubComponent}
        emptyState={props.emptyState}
      />
    </DataTableFrame>
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

// =============================================================================
// Pagination & counts
// =============================================================================

function DataTablePageCount() {
  const { table } = useDataTable();
  const state = useTableState(table);

  return (
    <div className="text-sm text-muted-foreground">
      Page {state.pagination.pageIndex + 1} of{" "}
      {Math.max(1, table.getPageCount())}
    </div>
  );
}

function DataTableRowCount() {
  const { table } = useDataTable();
  useTableState(table);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="text-sm text-muted-foreground">
      {selectedCount > 0
        ? `${selectedCount} of ${totalCount} row(s) selected`
        : `${totalCount} row(s)`}
    </div>
  );
}

interface DataTablePaginationProps {
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

function DataTablePagination(input: DataTablePaginationProps) {
  const {
    showPageSize,
    pageSizeOptions,
    showPageInfo,
    showFirstLast,
    variant,
    size,
  } = resolveComponentDefaults(input, DATA_TABLE_PAGINATION_DEFAULTS_1);

  const { table, enablePagination } = useDataTable();
  const state = useTableState(table);
  const pageSizeId = React.useId();

  if (!enablePagination) return null;

  const pageCount = Math.max(1, table.getPageCount());
  const currentPage = state.pagination.pageIndex + 1;
  const pageSize = state.pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
    >
      {renderDataTablePaginationSectionPart4({
        showPageSize,
        pageSizeId,
        pageSize,
        table,
        size,
        pageSizeOptions,
        showPageInfo,
        totalRows,
        currentPage,
        pageCount,
      })}{" "}
      {renderDataTablePaginationSectionPart5({
        showFirstLast,
        variant,
        size,
        table,
        currentPage,
        pageCount,
      })}
    </nav>
  );
}

// =============================================================================
// Column header, resize handle, pinning menu
// =============================================================================

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
      <div className={cn("flex items-center gap-2", className)}>
        <span>{title}</span>
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
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleSort}
        aria-label={`${title}, sort ${next === "none" ? "off" : next}`}
        className="-ml-3 flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {title}
        {resolveValue4()}
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
      aria-label={`Resize ${columnLabel(column)} column`}
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
  const pinned = column.getIsPinned(); // "start" | "end" | false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${columnLabel(column)} column options`}
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

// =============================================================================
// Column factories
// =============================================================================

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
    size: 40,
    minSize: 40,
    maxSize: 40,
  };
}

// =============================================================================
// Column visibility & pinning summary
// =============================================================================

function DataTableColumnVisibility() {
  const { table } = useDataTable();
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
          const label = columnLabel(column);

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

// =============================================================================
// Filters
// =============================================================================

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

  const { table } = useDataTable();
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

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label={`${columnLabel(column)} range`}
    >
      <Input
        type="number"
        size="sm"
        aria-label={`Minimum ${columnLabel(column)}`}
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
        aria-label={`Maximum ${columnLabel(column)}`}
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
  const { table } = useDataTable();
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
      aria-label={`${columnLabel(column)} date range`}
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

// =============================================================================
// Editable cell
// =============================================================================

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

// =============================================================================
// Skeleton, empty state, bulk actions, row actions
// =============================================================================

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
  /** Float the bar over scrolled content (sticky bottom overlay). */
  sticky?: boolean;
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

  const hidden = selectedCount === 0;

  if (!sticky && hidden) return null;

  const bar = (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2",
        sticky && "bg-background shadow-lg",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{selectedCount} selected</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onClearSelection ? onClearSelection() : table.resetRowSelection()
          }
          className="h-6 px-2"
          aria-label="Clear selection"
        >
          <IconX className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
      <div className="h-4 w-px bg-border" aria-hidden="true" />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  if (!sticky) return bar;

  return (
    <div className="sticky bottom-4 z-30">
      <div
        // inert (not just aria-hidden): the hidden bar's buttons must leave the tab order.
        inert={hidden}
        className={cn(
          "motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-out",
          hidden
            ? "pointer-events-none translate-y-2 opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        {bar}
      </div>
    </div>
  );
}

interface RowAction<TData> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: TData) => void;
  destructive?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: TData;
  actions: RowAction<TData>[];
  className?: string;
  /** Accessible name, e.g. "Actions for Jane Doe". */
  label?: string;
}

function DataTableRowActions<TData>({
  row,
  actions,
  className,
  label = "Row actions",
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("size-8 p-0", className)}
            aria-label={label}
          >
            <IconDotsVertical className="size-4" aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <React.Fragment key={action.label}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => action.onClick(row)}
              disabled={action.disabled}
              className={cn(action.destructive && "text-destructive")}
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

// =============================================================================
// Cell renderers
// =============================================================================

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
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className={avatarSizeStyles[size]}>
        {src && <AvatarImage src={src} alt={showName ? "" : name} />}
        <AvatarFallback className="text-xs" aria-hidden={showName}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {showName && <span>{name}</span>}
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

// =============================================================================
// Density toggle
// =============================================================================

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

// =============================================================================
// Exports
// =============================================================================

export {
  DataTableRoot,
  DataTableSearch,
  DataTableContent,
  DataTablePageCount,
  DataTableRowCount,
  DataTablePagination,
  DataTableColumnVisibility,
  DataTablePinningControls,
  DataTableDensityToggle,
  DataTableColumnHeader,
  DataTableResizeHandle,
  DataTableFacetedFilter,
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
};

export type {
  DTFeatures,
  DTColumnDef,
  DTRow,
  DTColumn,
  DataTableProps,
  DataTableContentProps,
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
};

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
}: renderDataTableRowSectionPart1Args<TData>) {
  return (
    <TableRow
      ref={rowRef}
      style={rowStyle}
      stripe={stripe}
      isSelected={row.getIsSelected()}
      isGridRow={isGrid}
      aria-rowindex={ariaRowIndex}
      className={cn(
        clickToExpand && "cursor-pointer",
        isDragging && "relative z-20 opacity-80",
      )}
      onClick={
        clickToExpand
          ? (event) => {
              // Clicking a checkbox/button/menu inside the row must not expand it.
              if (!isInteractiveTarget(event.target)) row.toggleExpanded();
            }
          : undefined
      }
    >
      {cells.map((cell, colIndex) => {
        const resolveTabIndex2 = () => {
          if (isGrid) {
            if (isActive) {
              return 0 as const;
            }

            return -1;
          }

          return undefined;
        };

        const isDragHandle = cell.column.id === "drag";
        const isActive = rowIndex === activeRow && colIndex === activeCol;

        return (
          <TableCell
            key={cell.id}
            isGridCell={isGrid}
            data-grid-cell={isGrid ? `${rowIndex}:${colIndex}` : undefined}
            tabIndex={resolveTabIndex2()}
            onFocus={
              isGrid ? () => onCellFocus?.({ rowIndex, colIndex }) : undefined
            }
            {...pinProps(cell.column)}
            className={cn(
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
      })}
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

type renderDataTablePaginationSectionPart4Args = {
  showPageSize: boolean;
  pageSizeId: string;
  pageSize: number;
  table: ReturnType<typeof useDataTable>["table"];
  size: "default" | "sm" | "lg";
  pageSizeOptions: number[];
  showPageInfo: boolean;
  totalRows: number;
  currentPage: number;
  pageCount: number;
};

function renderDataTablePaginationSectionPart4({
  showPageSize,
  pageSizeId,
  pageSize,
  table,
  size,
  pageSizeOptions,
  showPageInfo,
  totalRows,
  currentPage,
  pageCount,
}: renderDataTablePaginationSectionPart4Args) {
  return (
    <div className="flex items-center gap-4">
      {showPageSize && (
        <div className="flex items-center gap-2">
          <label
            htmlFor={pageSizeId}
            className="hidden whitespace-nowrap text-sm text-muted-foreground sm:inline"
          >
            Rows per page
          </label>
          <select
            id={pageSizeId}
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className={cn(
              "rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-2 focus:ring-ring",
              size === "sm" && "h-8 text-xs",
              size === "default" && "h-9 text-sm",
              size === "lg" && "h-10 text-base",
            )}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      {showPageInfo && totalRows > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalRows)} of {totalRows}
          </span>
          <span className="sm:hidden">
            {currentPage}/{pageCount}
          </span>
        </div>
      )}
    </div>
  );
}

type renderDataTablePaginationSectionPart5Args = {
  showFirstLast: boolean;
  variant: "default" | "outline" | "ghost";
  size: "default" | "sm" | "lg";
  table: ReturnType<typeof useDataTable>["table"];
  currentPage: number;
  pageCount: number;
};

function renderDataTablePaginationSectionPart5({
  showFirstLast,
  variant,
  size,
  table,
  currentPage,
  pageCount,
}: renderDataTablePaginationSectionPart5Args) {
  return (
    <div className="flex items-center gap-1">
      {showFirstLast && (
        <Button
          variant={variant}
          size={size}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="Go to first page"
        >
          <IconChevronsLeft className="size-4" aria-hidden="true" />
        </Button>
      )}
      <Button
        variant={variant}
        size={size}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Go to previous page"
      >
        <IconChevronLeft className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </Button>
      <span className="mx-1 text-sm text-muted-foreground" aria-current="page">
        Page {currentPage} of {pageCount}
      </span>
      <Button
        variant={variant}
        size={size}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <IconChevronRight className="size-4" aria-hidden="true" />
      </Button>
      {showFirstLast && (
        <Button
          variant={variant}
          size={size}
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Go to last page"
        >
          <IconChevronsRight className="size-4" aria-hidden="true" />
        </Button>
      )}
    </div>
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
  showFirstLast: true,
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

function useDataTableSetup<TData extends RowData, TValue>(
  input: DataTableProps<TData, TValue>,
) {
  const resolvedProps = resolveComponentDefaults(input, {
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
    containerHeight: 500,
    isLoading: false,
    hasNextPage: false,
    persistStateVersion: DEFAULT_PERSIST_VERSION,
  });

  const {
    columns,
    data,
    getRowId,
    enableSorting,
    enableFiltering,
    enablePagination,
    enableRowSelection,
    enableColumnPinning,
    enableColumnResizing,
    enableExpanding,
    enableGrouping,
    enableVirtualization,
    initialPageSize,
    initialSorting,
    getSubRows,
    getRowCanExpand,
  } = resolvedProps;

  const table = useTable(
    {
      features: dataTableFeatures,
      data,
      columns: createColumnHelper<DTFeatures, TData>().columns(columns),
      getRowId,
      getSubRows,
      getRowCanExpand,
      enableSorting,
      enableSortingRemoval: true,
      enableColumnFilters: enableFiltering,
      enableGlobalFilter: enableFiltering,
      enableRowSelection,
      enableColumnPinning,
      enableColumnResizing,
      columnResizeMode: "onChange",
      enableExpanding,
      enableGrouping,
      // The virtualizer needs every row; manual pagination bypasses the
      // paginated row model (previously it silently capped rows at pageSize).
      manualPagination: !enablePagination || enableVirtualization,
      initialState: {
        sorting: initialSorting,
        pagination: { pageIndex: 0, pageSize: initialPageSize },
      },
    },
    // Root never needs to re-render on table state: consumers subscribe
    // themselves, so `children` updates without prop drilling.
    () => null,
  );

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

  return { ...state, densityState, setDensity, announcement, setAnnouncement };
}

function useDataTableActions<TData extends RowData, TValue>(
  state: ReturnType<typeof useDataTableState2<TData, TValue>>,
) {
  const {
    enablePagination,
    enableVirtualization,
    enableKeyboardNavigation,
    announceChanges,
    estimateRowHeight,
    containerHeight,
    onLoadMore,
    isLoading,
    hasNextPage,
    table,
    densityState,
    setDensity,
    setAnnouncement,
  } = state;

  React.useEffect(() => {
    if (!announceChanges) return;
    let prev = table.store.state;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = subscribeTable(table, () => {
      const next = table.store.state;
      const message = describeChange(table, prev, next);
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

  // SAFETY: the provider below serves this exact table instance, so reading
  // the context inside this provider yields this TData; the context type
  // erases TData to RowData to keep one shared context object.
  const contextTable = table as DTTable<RowData>;

  const contextValue = React.useMemo<DataTableContextValue<RowData>>(
    () => ({
      table: contextTable,
      density: densityState,
      setDensity,
      enablePagination: enablePagination && !enableVirtualization,
      enableVirtualization,
      enableKeyboardNavigation,
      estimateRowHeight,
      containerHeight,
      onLoadMore,
      isLoading,
      hasNextPage,
    }),
    [
      contextTable,
      densityState,
      setDensity,
      enablePagination,
      enableVirtualization,
      enableKeyboardNavigation,
      estimateRowHeight,
      containerHeight,
      onLoadMore,
      isLoading,
      hasNextPage,
    ],
  );

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
