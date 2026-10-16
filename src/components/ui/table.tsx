/* eslint-disable react-refresh/only-export-components */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconInbox,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Checkbox } from "@/components/ui/checkbox";

type AriaSort = "ascending" | "descending" | "none" | "other";

type TableDensity = "comfortable" | "compact" | "dense";

type SortDirection = "asc" | "desc" | "none";

// Density drives cell padding via a static class map (no interpolation → no JIT purge).
const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    density: {
      comfortable: "[&_td]:p-4 [&_th]:h-12 [&_th]:px-4",
      compact: "[&_td]:px-3 [&_td]:py-2 [&_th]:h-10 [&_th]:px-3",
      dense: "[&_td]:px-2 [&_td]:py-1 [&_th]:h-8 [&_th]:px-2",
    },
    striped: {
      true: "[&_tbody_tr:nth-child(even)]:bg-muted/50",
      false: "",
    },
    bordered: {
      true: "border-collapse [&_td]:border [&_th]:border [&_td]:border-border [&_th]:border-border",
      false: "",
    },
  },
  defaultVariants: {
    density: "comfortable",
    striped: false,
    bordered: false,
  },
});

interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  striped?: boolean;
  bordered?: boolean;
  density?: TableDensity;
  isGrid?: boolean;
  /** Freeze the header while the body scrolls (needs the scrollable container). */
  stickyHeader?: boolean;
  /** Accessible name for the scroll region; makes the wrapper focusable (WCAG 2.1.1). */
  label?: string;
  ariaColCount?: number;
  ariaRowCount?: number;
  containerClassName?: string;
}

function Table({
  className,
  containerClassName,
  striped = false,
  bordered = false,
  density = "comfortable",
  isGrid = false,
  stickyHeader = false,
  label,
  ariaColCount,
  ariaRowCount,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      role={label ? "region" : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
      className={cn(
        "relative w-full overflow-auto",
        label &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
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
          stickyHeader && "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-background",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
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
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
  isGridRow?: boolean;
}

function TableRow({
  className,
  isSelected,
  isGridRow = false,
  ...props
}: TableRowProps) {
  const reduced = useReducedMotion();

  return (
    <tr
      data-slot="table-row"
      data-state={isSelected ? "selected" : undefined}
      role={isGridRow ? "row" : undefined}
      aria-selected={isSelected}
      className={cn(
        "border-b border-border hover:bg-muted/50 data-[state=selected]:bg-muted",
        !reduced && "transition-colors",
        className
      )}
      {...props}
    />
  );
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  ariaSort?: AriaSort;
  isGridCell?: boolean;
  /** Freeze this column against the left edge while the body scrolls sideways. */
  stickyColumn?: boolean;
}

function TableHead({
  className,
  scope = "col",
  ariaSort,
  isGridCell = false,
  stickyColumn = false,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      role={isGridCell ? "columnheader" : undefined}
      aria-sort={ariaSort}
      className={cn(
        "text-left align-middle font-medium text-muted-foreground has-[[role=checkbox]]:pr-0",
        stickyColumn &&
          "sticky left-0 z-10 bg-background shadow-[inset_-1px_0_0_var(--border)]",
        className
      )}
      {...props}
    />
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isGridCell?: boolean;
  stickyColumn?: boolean;
}

function TableCell({
  className,
  isGridCell = false,
  stickyColumn = false,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      role={isGridCell ? "gridcell" : undefined}
      className={cn(
        "align-middle has-[[role=checkbox]]:pr-0",
        stickyColumn &&
          "sticky left-0 z-10 bg-background shadow-[inset_-1px_0_0_var(--border)]",
        className
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
// SortableTableHead — a clickable header with a nested button + aria-sort
// =============================================================================

interface SortableTableHeadProps
  extends Omit<TableHeadProps, "onClick" | "aria-sort" | "ariaSort"> {
  sortState?: SortDirection;
  onSort?: () => void;
}

// aria-sort goes on the <th>; the accessible name lives in the button label
// because JAWS/VoiceOver don't announce aria-sort reliably.
const SORT_TO_ARIA: Record<SortDirection, AriaSort> = {
  asc: "ascending",
  desc: "descending",
  none: "none",
};

function SortableTableHead({
  className,
  children,
  sortState = "none",
  onSort,
  ...props
}: SortableTableHeadProps) {
  const reduced = useReducedMotion();

  const nextLabel =
    sortState === "asc"
      ? "descending"
      : sortState === "desc"
        ? "clear sort"
        : "ascending";

  return (
    <TableHead
      className={cn("p-0", className)}
      ariaSort={SORT_TO_ARIA[sortState]}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        aria-label={
          typeof children === "string"
            ? `${children}, sort ${nextLabel}`
            : `Sort ${nextLabel}`
        }
        className={cn(
          "flex h-full w-full items-center gap-1.5 px-4 py-2 text-left font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          !reduced && "transition-colors",
        )}
      >
        {children}
        <span className="shrink-0 text-muted-foreground" aria-hidden="true">
          {sortState === "asc" ? (
            <IconArrowUp className="h-3.5 w-3.5" />
          ) : sortState === "desc" ? (
            <IconArrowDown className="h-3.5 w-3.5" />
          ) : (
            <IconArrowsSort className="h-3.5 w-3.5 opacity-50" />
          )}
        </span>
      </button>
    </TableHead>
  );
}

// =============================================================================
// TableEmpty — full-width centered empty state
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
      <td colSpan={colSpan} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <span aria-hidden="true">
            {icon ?? <IconInbox className="h-8 w-8 opacity-50" />}
          </span>
          <span className="text-sm">{message}</span>
          {action}
        </div>
      </td>
    </tr>
  );
}

// =============================================================================
// TableSkeleton — shimmer placeholder rows while data loads
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
      className={className}
      {...props}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border">
          {Array.from({ length: columns }).map((__, c) => (
            <td key={c} className="p-4">
              <div className="h-4 w-full rounded bg-muted animate-skeleton-wave" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

// =============================================================================
// useTableSort — headless immutable client-side sort
// =============================================================================

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

    // slice()+sort keeps `data` immutable without needing the es2023 lib target.
    return data.slice().sort((a: T, b: T) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (av == null && bv == null) return 0;

      if (av == null) return 1;

      if (bv == null) return -1;

      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));

      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const toggle = React.useCallback(
    (key: keyof T) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDir("asc");

        return;
      }

      // asc → desc → none, cycling on the same column.
      setSortDir((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc",
      );
    },
    [sortKey],
  );

  return { sorted, sortKey, sortDir, toggle };
}

// =============================================================================
// useRowSelection — headless multi-row selection with tri-state header
// =============================================================================

function useRowSelection<T>(rows: T[], getId: (row: T) => string) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const ids = React.useMemo(() => rows.map(getId), [rows, getId]);
  const selectedCount = ids.filter((id) => selected.has(id)).length;
  const isAllSelected = ids.length > 0 && selectedCount === ids.length;
  const isSomeSelected = selectedCount > 0 && !isAllSelected;

  const toggle = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    setSelected((prev) => {
      const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));

      return allSelected ? new Set() : new Set(ids);
    });
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
// KiraTable — config-driven table for the common small-dataset case
// =============================================================================

interface KiraTableColumn<T> {
  key: keyof T;
  header: React.ReactNode;
  align?: "left" | "center" | "right";
  stickyColumn?: boolean;
  sortable?: boolean;
  /** Custom cell renderer; defaults to `String(row[key])`. */
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
  className?: string;
}

function KiraTable<T>({
  columns,
  data,
  caption,
  density,
  striped,
  bordered,
  stickyHeader,
  label,
  loading = false,
  loadingRows = 5,
  empty,
  selectable = false,
  getRowId,
  onSelectionChange,
  defaultSort,
  className,
}: KiraTableProps<T>) {
  const idOf = React.useCallback(
    (row: T) => (getRowId ? getRowId(row) : String(row[columns[0].key])),
    [getRowId, columns],
  );

  const { sorted, sortKey, sortDir, toggle } = useTableSort(data, defaultSort);
  const selection = useRowSelection(sorted, idOf);

  const { selected, isAllSelected, isSomeSelected, toggle: toggleRow, toggleAll } =
    selection;

  // Report selection changes to the caller (effect, not render).
  const selectedList = React.useMemo(() => [...selected], [selected]);
  React.useEffect(() => {
    onSelectionChange?.(selectedList);
  }, [selectedList, onSelectionChange]);

  const totalCols = columns.length + (selectable ? 1 : 0);

  // Debounced sr-only announce of the current sort (WCAG 4.1.3).
  const [announce, setAnnounce] = React.useState("");
  React.useEffect(() => {
    const col = columns.find((c) => c.key === sortKey);

    if (!col || sortDir === "none") {
      const t = setTimeout(() => setAnnounce(""), 400);

      return () => clearTimeout(t);
    }

    const dirWord = sortDir === "asc" ? "ascending" : "descending";

    const t = setTimeout(
      () =>
        setAnnounce(
          `Sorted by ${
            typeof col.header === "string" ? col.header : String(col.key)
          }, ${dirWord}`,
        ),
      400,
    );

    return () => clearTimeout(t);
  }, [sortKey, sortDir, columns]);

  const alignClass = (a?: "left" | "center" | "right") =>
    a === "center" ? "text-center" : a === "right" ? "text-right" : undefined;

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">
        {announce}
      </span>
      <Table
        density={density}
        striped={striped}
        bordered={bordered}
        stickyHeader={stickyHeader}
        label={label}
        className={className}
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all rows"
                  checked={
                    isAllSelected
                      ? true
                      : isSomeSelected
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={() => toggleAll()}
                />
              </TableHead>
            )}
            {columns.map((col) =>
              col.sortable ? (
                <SortableTableHead
                  key={String(col.key)}
                  stickyColumn={col.stickyColumn}
                  className={alignClass(col.align)}
                  sortState={sortKey === col.key ? sortDir : "none"}
                  onSort={() => toggle(col.key)}
                >
                  {col.header}
                </SortableTableHead>
              ) : (
                <TableHead
                  key={String(col.key)}
                  stickyColumn={col.stickyColumn}
                  className={alignClass(col.align)}
                >
                  {col.header}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableSkeleton rows={loadingRows} columns={totalCols} />
        ) : (
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
                      <TableCell className="w-10">
                        <Checkbox
                          aria-label="Select row"
                          checked={isSel}
                          onCheckedChange={() => toggleRow(id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        stickyColumn={col.stickyColumn}
                        className={alignClass(col.align)}
                      >
                        {col.cell ? col.cell(row) : String(row[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        )}
      </Table>
    </>
  );
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
  SortableTableHeadProps,
  TableEmptyProps,
  TableSkeletonProps,
  KiraTableColumn,
  KiraTableProps,
  TableDensity,
  SortDirection,
  AriaSort,
};
