"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconInbox,
} from "@tabler/icons-react";
import { cn } from "cn";
import { Checkbox } from "@/components/ui/checkbox";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import {
  isStringProp,
  isNumberProp,
  isBooleanProp,
  isBigIntProp,
} from "@/lib/component-prop-guards";

type AriaSort = "ascending" | "descending" | "none" | "other";

type TableDensity = "comfortable" | "compact" | "dense";

type SortDirection = "asc" | "desc" | "none";

type Align = "left" | "center" | "right";

// =============================================================================
// Row paint model
// =============================================================================
// Each row state writes its OWN variable; the row resolves them through a
// var() fallback chain, so precedence (selected > hover > stripe) is encoded in
// the chain rather than fought out via selector specificity:
//
//   --row-tint = var(--kt-sel, var(--kt-hover, var(--kt-stripe, 0%)))
//
// <tr>          paints muted @ tint% over transparent   (translucent)
// pinned cells  paint  muted @ tint% over --table-surface (opaque)
//
// Mixing in srgb reproduces the browser's alpha compositing exactly, so the
// pinned cell is pixel-identical to the rest of the row. Both are
// background-color, so transition-colors animates them in lockstep.
//
// Tunables (set on any ancestor): --table-surface (default var(--card)),
// --table-stripe (40%), --table-hover (65%).

const STICKY_CELL = [
  "data-[sticky-cell]:sticky data-[sticky-cell]:z-10",
  // Logical insets so pinning follows dir="rtl".
  "data-[sticky-cell=start]:[inset-inline-start:var(--kt-offset,0px)]",
  "data-[sticky-cell=end]:[inset-inline-end:var(--kt-offset,0px)]",
  "data-[sticky-cell]:bg-[color-mix(in_srgb,var(--muted)_var(--row-tint,0%),var(--table-surface,var(--card)))]",
  "[&[data-sticky-cell=start]:not([data-sticky-inner])]:shadow-[inset_-1px_0_0_var(--border)]",
  "[&[data-sticky-cell=end]:not([data-sticky-inner])]:shadow-[inset_1px_0_0_var(--border)]",
].join(" ");

interface StickyCellProps {
  /** Pin this column. `true` means "start" (left in LTR). */
  stickyColumn?: boolean | "start" | "end";
  /** Offset from the pinned edge, e.g. "48px" or "calc(3rem + 12rem)". */
  stickyOffset?: string;
  /** Draw the divider on the scrolling side. Disable on all but the innermost pinned column. */
  stickyEdge?: boolean;
}

function stickyAttrs(
  { stickyColumn, stickyOffset, stickyEdge = true }: StickyCellProps,
  style?: React.CSSProperties,
) {
  if (!stickyColumn) return { style };

  return {
    "data-sticky-cell": stickyColumn === true ? "start" : stickyColumn,
    "data-sticky-inner": stickyEdge ? undefined : "",
    style: stickyOffset
      ? // Object.assign: TS's CSSProperties type omits the custom-property
        // index signature, so "--kt-offset" must be assigned, not literalized.
        Object.assign({}, style, { "--kt-offset": stickyOffset })
      : style,
  };
}

// border-separate + spacing-0 instead of collapse: collapsed borders are
// painted by the table, not the cell, so they don't travel with sticky cells
// (row lines vanish under the pinned column, the sticky header loses its
// bottom line). Cells own their borders instead.
const tableVariants = cva(
  "w-full caption-bottom border-separate border-spacing-0 text-sm",
  {
    variants: {
      // Density sets padding variables; cells consume them, so per-cell
      // overrides (e.g. px-0) merge cleanly instead of losing to [&_td] rules.
      density: {
        comfortable: "[--cell-px:1rem] [--cell-py:1rem] [--head-h:3rem]",
        compact: "[--cell-px:0.75rem] [--cell-py:0.5rem] [--head-h:2.5rem]",
        dense: "[--cell-px:0.5rem] [--cell-py:0.25rem] [--head-h:2rem]",
      },
      striped: {
        true: "[&_tbody>tr:nth-child(even):not([data-stripe])]:[--kt-stripe:var(--table-stripe,40%)] [&_tbody>tr[data-stripe=even]]:[--kt-stripe:var(--table-stripe,40%)]",
        false: "",
      },
      bordered: {
        true: "[&_th]:border-r [&_td]:border-r [&_tr>*:first-child]:border-l [&_thead>tr:first-child>th]:border-t [&_tbody>tr:last-child>*]:border-b",
        false: "",
      },
    },
    defaultVariants: {
      density: "comfortable",
      striped: false,
      bordered: false,
    },
  },
);

interface TableProps
  extends React.ComponentProps<"table">, VariantProps<typeof tableVariants> {
  striped?: boolean;
  bordered?: boolean;
  density?: TableDensity;
  /** role="grid" promises arrow-key navigation — only set it if you implement that. */
  isGrid?: boolean;
  /** Freeze the header while the body scrolls (give containerClassName a max-h). */
  stickyHeader?: boolean;
  /** Accessible name for the scroll region; makes the wrapper focusable (WCAG 2.1.1). */
  label?: string;
  ariaColCount?: number;
  ariaRowCount?: number;
  containerClassName?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  containerStyle?: React.CSSProperties;
}

function Table(input: TableProps) {
  const {
    className,
    containerClassName,
    containerStyle,
    containerRef,
    striped,
    bordered,
    density,
    isGrid,
    stickyHeader,
    label,
    ariaColCount,
    ariaRowCount,
    ...props
  } = resolveComponentDefaults(input, TABLE_DEFAULTS_1);

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      role={label ? "region" : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
      style={containerStyle}
      className={cn(
        "relative w-full overflow-auto",
        label &&
          "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        containerClassName,
      )}
    >
      <table
        data-slot="table"
        data-striped={striped}
        data-bordered={bordered}
        data-density={density}
        role={isGrid ? "grid" : undefined}
        aria-colcount={ariaColCount}
        aria-rowcount={ariaRowCount}
        className={cn(
          tableVariants({ density, striped, bordered }),
          stickyHeader &&
            // Corner cell (pinned + sticky header) must sit above both the
            // scrolling header cells (z-20) and the pinned body cells (z-10).
            "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-20 [&_thead_th]:bg-(--table-surface,var(--card)) [&_thead_th[data-sticky-cell]]:z-30",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_th]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&>tr:hover]:[--kt-hover:var(--table-hover,65%)]",
        "[&>tr>*]:border-b [&>tr:last-child>*]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      data-slot="table-footer"
      // Tint via the row model so pinned footer cells match the footer row.
      className={cn(
        "font-medium [&>tr]:[--kt-stripe:50%] [&>tr>*]:border-t",
        className,
      )}
      {...props}
    />
  );
}

interface TableRowProps extends React.ComponentProps<"tr"> {
  isSelected?: boolean;
  isGridRow?: boolean;
  stripe?: "even" | "odd";
}

function TableRow({
  className,
  isSelected,
  isGridRow = false,
  ...props
}: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-state={isSelected ? "selected" : undefined}
      role={isGridRow ? "row" : undefined}
      // aria-selected is only valid on grid/treegrid rows.
      aria-selected={isGridRow ? isSelected : undefined}
      className={cn(
        // Reset so a nested table doesn't inherit its parent row's state.
        "[--kt-stripe:initial] [--kt-hover:initial] [--kt-sel:initial]",
        "[--row-tint:var(--kt-sel,var(--kt-hover,var(--kt-stripe,0%)))]",
        "data-[state=selected]:[--kt-sel:100%]",
        "bg-[color-mix(in_oklab,var(--muted)_var(--row-tint,0%),transparent)] motion-safe:transition-colors",
        className,
      )}
      {...props}
    />
  );
}

interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>, StickyCellProps {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  ariaSort?: AriaSort;
  isGridCell?: boolean;
}

function TableHead({
  className,
  scope = "col",
  ariaSort,
  isGridCell = false,
  stickyColumn,
  stickyOffset,
  stickyEdge,
  style,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      {...stickyAttrs({ stickyColumn, stickyOffset, stickyEdge }, style)}
      scope={scope}
      role={isGridCell ? "columnheader" : undefined}
      aria-sort={ariaSort}
      className={cn(
        "h-(--head-h,3rem) px-(--cell-px,1rem) text-left align-middle font-medium text-muted-foreground has-[[role=checkbox]]:pr-0 motion-safe:transition-colors whitespace-nowrap",
        STICKY_CELL,
        className,
      )}
      {...props}
    />
  );
}

interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>, StickyCellProps {
  isGridCell?: boolean;
}

function TableCell({
  className,
  isGridCell = false,
  stickyColumn,
  stickyOffset,
  stickyEdge,
  style,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      {...stickyAttrs({ stickyColumn, stickyOffset, stickyEdge }, style)}
      role={isGridCell ? "gridcell" : undefined}
      className={cn(
        "px-(--cell-px,1rem) py-(--cell-py,1rem) align-middle has-[[role=checkbox]]:pr-0 motion-safe:transition-colors",
        "whitespace-nowrap",
        STICKY_CELL,
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("py-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// =============================================================================
// SortableTableHead
// =============================================================================

interface SortableTableHeadProps extends Omit<
  TableHeadProps,
  "onClick" | "aria-sort" | "ariaSort"
> {
  sortState?: SortDirection;
  onSort?: () => void;
  align?: Align;
  /** Column name for the button label when children isn't a plain string. */
  sortLabel?: string;
}

const SORT_TO_ARIA: Record<Exclude<SortDirection, "none">, AriaSort> = {
  asc: "ascending",
  desc: "descending",
};

function SortableTableHead({
  className,
  children,
  sortState = "none",
  onSort,
  align = "left",
  sortLabel,
  ...props
}: SortableTableHeadProps) {
  const resolveNextLabel1 = () => {
    if (sortState === "asc") {
      return "descending" as const;
    }

    if (sortState === "desc") {
      return "clear sort" as const;
    }

    return "ascending" as const;
  };

  const resolveClassName2 = () => {
    if (align === "right") {
      return "justify-end text-right" as const;
    }

    if (align === "center") {
      return "justify-center text-center" as const;
    }

    return "justify-start text-left" as const;
  };

  const resolveValue3 = () => {
    if (sortState === "asc") {
      // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
      return <IconArrowUp className="size-3.5" />;
    }

    if (sortState === "desc") {
      // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
      return <IconArrowDown className="size-3.5" />;
    }

    // kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception
    return <IconArrowsSort className="size-3.5 opacity-50" />;
  };

  const nextLabel = resolveNextLabel1();

  const name = sortLabel ?? (isStringProp(children) ? children : undefined);

  return (
    <TableHead
      // Padding moves onto the button so the whole cell is the hit target.
      className={cn("px-0", className)}
      // APG: aria-sort belongs on the one sorted header only.
      ariaSort={sortState === "none" ? undefined : SORT_TO_ARIA[sortState]}
      {...props}
    >
      {/* kira-kit-ignore spacing-scale: sort-header icon gap keeps the compact optical metric */}
      <button
        type="button"
        onClick={onSort}
        aria-label={name ? `${name}, sort ${nextLabel}` : `Sort ${nextLabel}`}
        className={cn(
          "flex min-h-(--head-h,3rem) w-full items-center gap-1.5 px-(--cell-px,1rem) font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset motion-safe:transition-colors",
          resolveClassName2(),
        )}
      >
        {children}
        <span className="shrink-0 text-muted-foreground" aria-hidden="true">
          {resolveValue3()}
        </span>
      </button>
    </TableHead>
  );
}

// =============================================================================
// TableEmpty
// =============================================================================

interface TableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

function TableEmpty({
  colSpan,
  message = "No results.",
  icon,
  action,
  className,
  ...props
}: TableEmptyProps) {
  return (
    <tr data-slot="table-empty" className={className} {...props}>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <span aria-hidden="true">
            {icon ?? <IconInbox className="size-8 opacity-50" />}
          </span>
          <span className="text-sm">{message}</span>
          {action}
        </div>
      </TableCell>
    </tr>
  );
}

// =============================================================================
// TableSkeleton — now respects density and striping
// =============================================================================

interface TableSkeletonProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  rows?: number;
  columns: number;
}

function TableSkeleton({
  rows = 5,
  columns,
  className,
  ...props
}: TableSkeletonProps) {
  return (
    <tbody
      data-slot="table-skeleton"
      aria-hidden="true"
      className={cn(
        "[&>tr>*]:border-b [&>tr:last-child>*]:border-b-0",
        className,
      )}
      {...props}
    >
      {Array.from({ length: rows }, (_, r) => (
        <TableRow key={r}>
          {Array.from({ length: columns }, (__, c) => (
            <TableCell key={c}>
              <div className="h-4 w-full rounded bg-muted animate-skeleton-wave motion-reduce:animate-none" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </tbody>
  );
}

// =============================================================================
// useTableSort
// =============================================================================

// numeric: "item 2" < "item 10"; base sensitivity: case/accent-insensitive.
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function compareValues<Value>(a: Value, b: Value): number {
  if (isNumberProp(a) && isNumberProp(b)) return a - b;

  if (isBigIntProp(a) && isBigIntProp(b)) return compareBigInts(a, b);

  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  if (isBooleanProp(a) && isBooleanProp(b)) return Number(a) - Number(b);

  return collator.compare(String(a), String(b));
}

function useTableSort<T>(
  data: T[],
  initial?: { key: keyof T; dir: SortDirection },
) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(
    initial?.key ?? null,
  );

  const [sortDir, setSortDir] = React.useState<SortDirection>(
    initial?.dir ?? "none",
  );

  const sorted = React.useMemo(() => {
    if (!sortKey || sortDir === "none") return data;
    const sign = sortDir === "asc" ? 1 : -1;

    return data.slice().sort((a, b) => {
      const resolveValue5 = () => {
        if (av == null) {
          if (bv == null) {
            return 0 as const;
          }

          return 1 as const;
        }

        return -1;
      };

      const av = a[sortKey];
      const bv = b[sortKey];

      // Empty values stay last in BOTH directions (previously flipped to first on desc).
      if (av == null || bv == null) return resolveValue5();

      return sign * compareValues(av, bv);
    });
  }, [data, sortKey, sortDir]);

  const toggle = React.useCallback(
    (key: keyof T) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDir("asc");

        return;
      }

      setSortDir((prev) => {
        const resolveToggle6 = () => {
          if (prev === "asc") {
            return "desc" as const;
          }

          if (prev === "desc") {
            return "none" as const;
          }

          return "asc" as const;
        };

        return resolveToggle6();
      });
    },
    [sortKey],
  );

  return { sorted, sortKey, sortDir, toggle };
}

// =============================================================================
// useRowSelection
// =============================================================================

function useRowSelection<T>(rows: T[], getId: (row: T) => string) {
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());

  const ids = React.useMemo(() => rows.map(getId), [rows, getId]);
  const idSet = React.useMemo(() => new Set(ids), [ids]);

  // Compare by content, not array identity: an inline getId / columns array
  // otherwise produces a new `ids` every render and an extra render pass.
  const idsKey = ids.join("\u0000");
  const [prevKey, setPrevKey] = React.useState(idsKey);

  if (idsKey !== prevKey) {
    setPrevKey(idsKey);
    setSelected((prev) => {
      let changed = false;
      const next = new Set<string>();

      for (const id of prev) {
        if (idSet.has(id)) next.add(id);
        else changed = true;
      }

      return changed ? next : prev;
    });
  }

  let selectedCount = 0;

  for (const id of ids) if (selected.has(id)) selectedCount++;
  const isAllSelected = ids.length > 0 && selectedCount === ids.length;
  const isSomeSelected = selectedCount > 0 && !isAllSelected;

  const toggle = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (!next.delete(id)) next.add(id);

      return next;
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    setSelected((prev) =>
      ids.length > 0 && ids.every((id) => prev.has(id))
        ? new Set()
        : new Set(ids),
    );
  }, [ids]);

  const clear = React.useCallback(() => setSelected(new Set()), []);

  return {
    selected,
    selectedCount,
    isAllSelected,
    isSomeSelected,
    toggle,
    toggleAll,
    clear,
  };
}

// =============================================================================
// Density persistence — SSR-safe, no longer clobbers the stored value on mount
// =============================================================================
// Intentionally duplicated from data-table.tsx (data-table imports table).
// Shares the same "kira-table:<key>" record format.

const STORAGE_PREFIX = "kira-table:";
const storageListeners = new Set<() => void>();

function subscribeStorage(cb: () => void) {
  storageListeners.add(cb);
  window.addEventListener("storage", cb);

  return () => {
    storageListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readRaw(key: string | null): string | null {
  if (!key) return null;

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parseDensity(raw: string | null): TableDensity | undefined {
  if (!raw) return undefined;

  try {
    const d: unknown = JSON.parse(raw)?.density;

    return d === "comfortable" || d === "compact" || d === "dense"
      ? d
      : undefined;
  } catch {
    return undefined;
  }
}

function useDensityPersistence(
  persistKey: string | undefined,
  density: TableDensity | undefined,
) {
  const storageKey = persistKey ? `${STORAGE_PREFIX}${persistKey}` : null;

  // Server snapshot is null, so hydration matches; the client then re-renders
  // with the stored value instead of reading localStorage during render.
  const raw = React.useSyncExternalStore(
    subscribeStorage,
    () => readRaw(storageKey),
    () => null,
  );

  // Only persist *changes* to the prop. Writing on mount would overwrite the
  // user's stored choice with the default every page load.
  const prevDensity = React.useRef(density);
  React.useEffect(() => {
    if (!storageKey || !density || prevDensity.current === density) return;
    prevDensity.current = density;

    try {
      const record = JSON.parse(localStorage.getItem(storageKey) ?? "{}") ?? {};
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...record, version: 1, density }),
      );
      storageListeners.forEach((l) => l()); // same-tab "storage" events don't fire
    } catch {
      // Storage unavailable — never crash the table.
    }
  }, [storageKey, density]);

  return parseDensity(raw);
}

// =============================================================================
// KiraTable
// =============================================================================

interface KiraTableColumn<T> {
  key: keyof T;
  header: React.ReactNode;
  align?: Align;
  /** Pin to the left. Pinned columns should be leading and contiguous. */
  stickyColumn?: boolean;
  /** CSS width. Required on every pinned column except the last, to offset the next one. */
  width?: string;
  sortable?: boolean;
  /** Custom cell renderer; defaults to the stringified value ("—" when empty). */
  cell?: (row: T) => React.ReactNode;
}

interface KiraTableProps<T> {
  columns: KiraTableColumn<T>[];
  data: T[];
  caption?: React.ReactNode;
  density?: TableDensity;
  striped?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  label?: string;
  loading?: boolean;
  loadingRows?: number;
  empty?: React.ReactNode;
  selectable?: boolean;
  getRowId?: (row: T) => string;
  onSelectionChange?: (ids: string[]) => void;
  defaultSort?: { key: keyof T; dir: SortDirection };
  /** Persist the density preference under this localStorage key. */
  persistKey?: string;
  className?: string;
  containerClassName?: string;
}

const SELECT_COL_WIDTH = "3rem"; // matches w-12 on the select cells

const alignClass = (a?: Align) => {
  const resolveAlignClass7 = () => {
    if (a === "center") {
      return "text-center" as const;
    }

    if (a === "right") {
      return "text-right" as const;
    }

    return undefined;
  };

  return resolveAlignClass7();
};

const headerText = <T,>(col: KiraTableColumn<T>) =>
  isStringProp(col.header) ? col.header : String(col.key);

const widthStyle = (
  width: string | undefined,
  exact: boolean,
): React.CSSProperties | undefined =>
  width
    ? { width, minWidth: width, maxWidth: exact ? width : undefined }
    : undefined;

const formatCell = <Value,>(v: Value) =>
  v == null || v === "" ? "—" : String(v);

function KiraTable<T>(input0: KiraTableProps<T>) {
  const state0 = useTableSetup<T>(input0);
  const state1 = useTableActions<T>(state0);

  return renderTable<T>(state1);
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  SortableTableHead,
  TableEmpty,
  TableSkeleton,
  KiraTable,
  useTableSort,
  useRowSelection,
  tableVariants,
};

export type {
  TableProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  StickyCellProps,
  SortableTableHeadProps,
  TableEmptyProps,
  TableSkeletonProps,
  KiraTableColumn,
  KiraTableProps,
  TableDensity,
  SortDirection,
  AriaSort,
};

const compareBigInts = (left: bigint, right: bigint) => {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1 as const;
  }

  return 0 as const;
};

type renderKiraTableSectionPart1Args<T> = {
  selectable: Exclude<KiraTableProps<T>["selectable"], undefined>;
  selectCellClass: "w-12 min-w-12 max-w-12 px-0 text-center";
  pin: { select: boolean; byKey: Map<keyof T, StickyCellProps> };
  resolveChecked8: () => boolean | "indeterminate";
  toggleAll: ReturnType<typeof useRowSelection>["toggleAll"];
  columns: KiraTableProps<T>["columns"];
  sortKey: keyof T | null;
  sortDir: ReturnType<typeof useTableSort>["sortDir"];
  userSorted: React.RefObject<boolean>;
  toggle: (key: keyof T) => void;
};

function renderKiraTableSectionPart1<T>({
  selectable,
  selectCellClass,
  pin,
  resolveChecked8,
  toggleAll,
  columns,
  sortKey,
  sortDir,
  userSorted,
  toggle,
}: renderKiraTableSectionPart1Args<T>) {
  return (
    <TableHeader>
      <TableRow>
        {selectable && (
          <TableHead
            className={selectCellClass}
            stickyColumn={pin.select}
            stickyEdge={false}
          >
            <Checkbox
              aria-label="Select all rows"
              checked={resolveChecked8()}
              onCheckedChange={() => toggleAll()}
            />
          </TableHead>
        )}
        {columns.map((col) => {
          const sticky = pin.byKey.get(col.key);
          const style = widthStyle(col.width, !!sticky);

          return col.sortable ? (
            <SortableTableHead
              key={String(col.key)}
              {...sticky}
              style={style}
              align={col.align}
              sortLabel={headerText(col)}
              sortState={sortKey === col.key ? sortDir : "none"}
              onSort={() => {
                userSorted.current = true;
                toggle(col.key);
              }}
            >
              {col.header}
            </SortableTableHead>
          ) : (
            <TableHead
              key={String(col.key)}
              {...sticky}
              style={style}
              className={alignClass(col.align)}
            >
              {col.header}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

type renderKiraTableSectionPart2Args<T> = {
  sorted: T[];
  totalCols: number;
  empty: KiraTableProps<T>["empty"];
  idOf: (row: T) => string;
  selected: ReturnType<typeof useRowSelection>["selected"];
  selectable: Exclude<KiraTableProps<T>["selectable"], undefined>;
  selectCellClass: "w-12 min-w-12 max-w-12 px-0 text-center";
  pin: { select: boolean; byKey: Map<keyof T, StickyCellProps> };
  toggleRow: ReturnType<typeof useRowSelection>["toggle"];
  columns: KiraTableProps<T>["columns"];
};

function renderKiraTableSectionPart2<T>({
  sorted,
  totalCols,
  empty,
  idOf,
  selected,
  selectable,
  selectCellClass,
  pin,
  toggleRow,
  columns,
}: renderKiraTableSectionPart2Args<T>) {
  return (
    <TableBody>
      {sorted.length === 0 ? (
        <TableEmpty colSpan={totalCols} message={empty} />
      ) : (
        sorted.map((row) => {
          const id = idOf(row);
          const isSel = selected.has(id);

          return (
            <TableRow key={id} isSelected={selectable ? isSel : undefined}>
              {selectable && (
                <TableCell
                  className={selectCellClass}
                  stickyColumn={pin.select}
                  stickyEdge={false}
                >
                  <Checkbox
                    aria-label={`Select row ${id}`}
                    checked={isSel}
                    onCheckedChange={() => toggleRow(id)}
                  />
                </TableCell>
              )}
              {columns.map((col) => {
                const sticky = pin.byKey.get(col.key);

                return (
                  <TableCell
                    key={String(col.key)}
                    {...sticky}
                    style={widthStyle(col.width, !!sticky)}
                    className={alignClass(col.align)}
                  >
                    {col.cell ? col.cell(row) : formatCell(row[col.key])}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      )}
    </TableBody>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const TABLE_DEFAULTS_1 = {
  striped: false,
  bordered: false,
  density: "comfortable",
  isGrid: false,
  stickyHeader: false,
} as const;

type renderKiraTableViewArgs<T> = {
  announce: string;
  effectiveDensity: TableDensity;
  striped: KiraTableProps<T>["striped"];
  bordered: KiraTableProps<T>["bordered"];
  stickyHeader: KiraTableProps<T>["stickyHeader"];
  label: KiraTableProps<T>["label"];
  loading: KiraTableProps<T>["loading"];
  className: KiraTableProps<T>["className"];
  containerClassName: KiraTableProps<T>["containerClassName"];
  caption: KiraTableProps<T>["caption"];
  selectable: boolean;
  selectCellClass: "w-12 min-w-12 max-w-12 px-0 text-center";
  pin: { select: boolean; byKey: Map<keyof T, StickyCellProps> };
  resolveChecked8: () => boolean | "indeterminate";
  toggleAll: () => void;
  columns: KiraTableProps<T>["columns"];
  sortKey: keyof T | null;
  sortDir: SortDirection;
  userSorted: React.RefObject<boolean>;
  toggle: (key: keyof T) => void;
  loadingRows: KiraTableProps<T>["loadingRows"];
  totalCols: number;
  sorted: T[];
  empty: KiraTableProps<T>["empty"];
  idOf: (row: T) => string;
  selected: Set<string>;
  toggleRow: (id: string) => void;
};

function RenderKiraTableView<T>({
  announce,
  effectiveDensity,
  striped,
  bordered,
  stickyHeader,
  label,
  loading,
  className,
  containerClassName,
  caption,
  selectable,
  selectCellClass,
  pin,
  resolveChecked8,
  toggleAll,
  columns,
  sortKey,
  sortDir,
  userSorted,
  toggle,
  loadingRows,
  totalCols,
  sorted,
  empty,
  idOf,
  selected,
  toggleRow,
}: renderKiraTableViewArgs<T>) {
  return (
    <>
      <output className="sr-only" aria-live="polite">
        {announce}
      </output>
      <Table
        density={effectiveDensity}
        striped={striped}
        bordered={bordered}
        stickyHeader={stickyHeader}
        label={label}
        aria-busy={loading || undefined}
        className={className}
        containerClassName={containerClassName}
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        {renderKiraTableSectionPart1({
          selectable,
          selectCellClass,
          pin,
          resolveChecked8,
          toggleAll,
          columns,
          sortKey,
          sortDir,
          userSorted,
          toggle,
        })}
        {loading ? (
          <TableSkeleton rows={loadingRows} columns={totalCols} />
        ) : (
          renderKiraTableSectionPart2({
            sorted,
            totalCols,
            empty,
            idOf,
            selected,
            selectable,
            selectCellClass,
            pin,
            toggleRow,
            columns,
          })
        )}
      </Table>
    </>
  );
}

function useTableSetup<T>(inputProps: KiraTableProps<T>) {
  const resolvedProps = resolveComponentDefaults(inputProps, {
    loading: false,
    loadingRows: 5,
    selectable: false,
  });

  const {
    columns,
    data,
    density,
    getRowId,
    onSelectionChange,
    defaultSort,
    persistKey,
  } = resolvedProps;

  const resolveChecked8 = () => {
    if (isAllSelected) {
      return true;
    }

    if (isSomeSelected) {
      return "indeterminate" as const;
    }

    return false;
  };

  const storedDensity = useDensityPersistence(persistKey, density);

  const effectiveDensity = storedDensity ?? density ?? "comfortable";

  const idOf = React.useCallback(
    (row: T) => (getRowId ? getRowId(row) : String(row[columns[0].key])),
    [getRowId, columns],
  );

  const { sorted, sortKey, sortDir, toggle } = useTableSort(data, defaultSort);

  const {
    selected,
    isAllSelected,
    isSomeSelected,
    toggle: toggleRow,
    toggleAll,
  } = useRowSelection(sorted, idOf);

  // React 19.2 stable: an inline onSelectionChange no longer re-fires the effect.
  const emitSelection = React.useEffectEvent((next: Set<string>) =>
    onSelectionChange?.([...next]),
  );

  const lastEmitted = React.useRef(selected);
  // skips the mount (and StrictMode re-mount) emit
  React.useEffect(() => {
    if (lastEmitted.current === selected) return;
    lastEmitted.current = selected;
    emitSelection(selected);
  }, [selected]);

  // Debounced sr-only sort announcement (WCAG 4.1.3), only after user action.
  const userSorted = React.useRef(false);

  const [announce, setAnnounce] = React.useState("");

  return {
    ...resolvedProps,
    resolveChecked8,
    effectiveDensity,
    idOf,
    sorted,
    sortKey,
    sortDir,
    toggle,
    selected,
    toggleRow,
    toggleAll,
    userSorted,
    announce,
    setAnnounce,
  };
}

function useTableActions<T>(state: ReturnType<typeof useTableSetup<T>>) {
  const { columns, selectable, sortKey, sortDir, userSorted, setAnnounce } =
    state;

  const sortMessage = React.useEffectEvent(() => {
    const col = columns.find((c) => c.key === sortKey);

    if (!col || sortDir === "none") return "Sort cleared";

    return `Sorted by ${headerText(col)}, ${sortDir === "asc" ? "ascending" : "descending"}`;
  });

  React.useEffect(() => {
    if (!userSorted.current) return;
    const t = setTimeout(() => setAnnounce(sortMessage()), 400);

    return () => clearTimeout(t);
  }, [sortKey, sortDir, userSorted, setAnnounce]);

  // Pinned layout: the select column pins with the data columns, and each
  // pinned column is offset by the widths of those before it.
  const pin = React.useMemo(() => {
    const sticky = columns.filter((c) => c.stickyColumn);
    const select = selectable && sticky.length > 0;
    const widths: string[] = select ? [SELECT_COL_WIDTH] : [];
    const byKey = new Map<keyof T, StickyCellProps>();

    sticky.forEach((col, i) => {
      const isLast = i === sticky.length - 1;
      byKey.set(col.key, {
        stickyColumn: true,
        stickyOffset: widths.length ? `calc(${widths.join(" + ")})` : undefined,
        stickyEdge: isLast,
      });

      if (col.width) widths.push(col.width);
      else if (!isLast && import.meta.env.DEV) {
        console.warn(
          `[KiraTable] Pinned column "${String(col.key)}" needs a \`width\` so later pinned columns can be offset.`,
        );
      }
    });

    return { select, byKey };
  }, [columns, selectable]);

  const totalCols = columns.length + (selectable ? 1 : 0);

  const selectCellClass = "w-12 min-w-12 max-w-12 px-0 text-center" as const;

  return { ...state, pin, totalCols, selectCellClass };
}

function renderTable<T>({
  columns,
  caption,
  striped,
  bordered,
  stickyHeader,
  label,
  loading,
  loadingRows,
  empty,
  selectable,
  className,
  containerClassName,
  resolveChecked8,
  effectiveDensity,
  idOf,
  sorted,
  sortKey,
  sortDir,
  toggle,
  selected,
  toggleRow,
  toggleAll,
  userSorted,
  announce,
  pin,
  totalCols,
  selectCellClass,
}: ReturnType<typeof useTableActions<T>>) {
  return (
    <RenderKiraTableView
      {...{
        announce,
        effectiveDensity,
        striped,
        bordered,
        stickyHeader,
        label,
        loading,
        className,
        containerClassName,
        caption,
        selectable,
        selectCellClass,
        pin,
        resolveChecked8,
        toggleAll,
        columns,
        sortKey,
        sortDir,
        userSorted,
        toggle,
        loadingRows,
        totalCols,
        sorted,
        empty,
        idOf,
        selected,
        toggleRow,
      }}
    />
  );
}
