import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ExpandedState,
  GroupingState,
  RowSelectionState,
  ColumnOrderState,
  ColumnPinningState,
  Row,
  Table as TableType,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconChevronRight,
  IconGripVertical,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ============================================
// CONTEXT
// ============================================
interface DataTableContextValue<TData> {
  table: TableType<TData>;
}

const DataTableContext =
  React.createContext<DataTableContextValue<unknown> | null>(null);

function useDataTable<TData>() {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context as DataTableContextValue<TData>;
}

// ============================================
// MAIN DATATABLE ROOT
// ============================================
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children: React.ReactNode;
  // Features
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  enableColumnResizing?: boolean;
  enableExpanding?: boolean;
  enableGrouping?: boolean;
  // Initial states
  initialPageSize?: number;
  initialSorting?: SortingState;
  // Callbacks
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  // Sub-row accessor
  getSubRows?: (originalRow: TData) => TData[] | undefined;
  // Sub-component renderer
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
}

function DataTableRoot<TData, TValue>({
  columns,
  data,
  children,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = false,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  enableColumnResizing = false,
  enableExpanding = false,
  enableGrouping = false,
  initialPageSize = 10,
  initialSorting = [],
  onRowSelectionChange,
  getSubRows,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    {}
  );
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [grouping, setGrouping] = React.useState<GroupingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Notify parent of selection changes
  React.useEffect(() => {
    onRowSelectionChange?.(rowSelection);
  }, [rowSelection, onRowSelectionChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Sorting with 3-way toggle (asc -> desc -> none)
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      enableSortingRemoval: true,
    }),
    // Filtering
    ...(enableFiltering && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
    }),
    // Pagination
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    // Row Selection - always set up handlers, let columns control visibility
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelection,
    // Column Ordering
    ...(enableColumnOrdering && {
      onColumnOrderChange: setColumnOrder,
    }),
    // Column Pinning
    ...(enableColumnPinning && {
      onColumnPinningChange: setColumnPinning,
      enableColumnPinning: true,
    }),
    // Column Resizing
    ...(enableColumnResizing && {
      enableColumnResizing: true,
      columnResizeMode: "onChange" as const,
    }),
    // Expanding
    ...(enableExpanding && {
      getExpandedRowModel: getExpandedRowModel(),
      onExpandedChange: setExpanded,
      getSubRows,
    }),
    // Grouping
    ...(enableGrouping && {
      getGroupedRowModel: getGroupedRowModel(),
      onGroupingChange: setGrouping,
    }),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder,
      columnPinning,
      expanded,
      grouping,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  return (
    <DataTableContext.Provider value={{ table: table as TableType<unknown> }}>
      <div className="space-y-4">{children}</div>
    </DataTableContext.Provider>
  );
}

// ============================================
// SEARCH / FILTER COMPONENT
// ============================================
interface DataTableSearchProps {
  columnKey?: string;
  placeholder?: string;
  globalSearch?: boolean;
}

function DataTableSearch({
  columnKey,
  placeholder = "Search...",
  globalSearch = false,
}: DataTableSearchProps) {
  const { table } = useDataTable();

  if (globalSearch) {
    return (
      <Input
        placeholder={placeholder}
        value={table.getState().globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
    );
  }

  if (!columnKey) return null;

  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnKey)?.getFilterValue() as string) ?? ""}
      onChange={(e) =>
        table.getColumn(columnKey)?.setFilterValue(e.target.value)
      }
      className="max-w-sm"
    />
  );
}

// ============================================
// TABLE CONTENT COMPONENT
// ============================================
interface DataTableContentProps<TData> {
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  stickyHeader?: boolean;
  expandOnRowClick?: boolean;
}

function DataTableContent<TData>({
  renderSubComponent,
  stickyHeader = false,
  expandOnRowClick = false,
}: DataTableContentProps<TData>) {
  const { table } = useDataTable<TData>();

  return (
    <div
      className={cn(
        "rounded-lg border border-border",
        stickyHeader && "max-h-[600px] overflow-auto"
      )}
    >
      <Table>
        <TableHeader
          className={
            stickyHeader ? "sticky top-0 bg-background z-10" : undefined
          }
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned();
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      ...(isPinned && {
                        position: "sticky",
                        left: isPinned === "left" ? 0 : undefined,
                        right: isPinned === "right" ? 0 : undefined,
                        backgroundColor: "hsl(var(--background))",
                        zIndex: 1,
                      }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {/* Column resizer handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                          header.column.getIsResizing()
                            ? "bg-primary"
                            : "bg-border hover:bg-primary/50"
                        )}
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    expandOnRowClick && row.getCanExpand()
                      ? "cursor-pointer"
                      : undefined
                  }
                  onClick={
                    expandOnRowClick && row.getCanExpand()
                      ? () => row.toggleExpanded()
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned();
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          ...(isPinned && {
                            position: "sticky",
                            left: isPinned === "left" ? 0 : undefined,
                            right: isPinned === "right" ? 0 : undefined,
                            backgroundColor: "hsl(var(--background))",
                          }),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {/* Expandable sub-component */}
                {row.getIsExpanded() && renderSubComponent && (
                  <TableRow>
                    <TableCell
                      colSpan={row.getVisibleCells().length}
                      className="bg-muted/30"
                    >
                      {renderSubComponent({ row })}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================
// PAGE COUNT COMPONENT
// ============================================
function DataTablePageCount() {
  const { table } = useDataTable();

  return (
    <div className="text-sm text-muted-foreground">
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
  );
}

// ============================================
// ROW COUNT COMPONENT
// ============================================
function DataTableRowCount() {
  const { table } = useDataTable();
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="text-sm text-muted-foreground">
      {selectedCount > 0 ? (
        <span>
          {selectedCount} of {totalCount} row(s) selected
        </span>
      ) : (
        <span>{totalCount} row(s)</span>
      )}
    </div>
  );
}

// ============================================
// PAGINATION COMPONENT
// ============================================
interface DataTablePaginationProps {
  showPageSize?: boolean;
  pageSizeOptions?: number[];
}

function DataTablePagination({
  showPageSize = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps) {
  const { table } = useDataTable();

  return (
    <div className="flex items-center justify-between gap-4">
      {showPageSize && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// COLUMN HEADER HELPER (with 3-way sorting)
// ============================================
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: import("@tanstack/react-table").Column<TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  // 3-way sort: asc -> desc -> none
  const handleSort = () => {
    const currentSort = column.getIsSorted();
    if (currentSort === false) {
      column.toggleSorting(false); // asc
    } else if (currentSort === "asc") {
      column.toggleSorting(true); // desc
    } else {
      column.clearSorting(); // none
    }
  };

  return (
    <button
      className={cn(
        "flex items-center gap-1 -ml-3 px-3 py-1.5 rounded-md hover:bg-muted",
        className
      )}
      onClick={handleSort}
    >
      {title}
      {column.getIsSorted() === "desc" ? (
        <IconChevronDown className="h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <IconChevronUp className="h-4 w-4" />
      ) : (
        <IconSelector className="h-4 w-4 opacity-50" />
      )}
    </button>
  );
}

// ============================================
// SELECTION CHECKBOX COLUMN HELPER
// ============================================
function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

// ============================================
// EXPAND COLUMN HELPER
// ============================================
function createExpandColumn<TData>(): ColumnDef<TData> {
  return {
    id: "expand",
    header: () => null,
    cell: ({ row }) => {
      if (!row.getCanExpand()) return null;
      return (
        <button onClick={row.getToggleExpandedHandler()} className="p-1">
          <IconChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              row.getIsExpanded() && "rotate-90"
            )}
          />
        </button>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

// ============================================
// DRAG HANDLE COLUMN HELPER
// ============================================
function createDragHandleColumn<TData>(): ColumnDef<TData> {
  return {
    id: "drag",
    header: () => null,
    cell: () => (
      <div className="cursor-grab p-1">
        <IconGripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

// ============================================
// COLUMN VISIBILITY TOGGLE
// ============================================
function DataTableColumnVisibility() {
  const { table } = useDataTable();

  return (
    <div className="flex flex-wrap gap-2">
      {table
        .getAllLeafColumns()
        .filter((col) => col.getCanHide())
        .map((column) => (
          <label key={column.id} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            />
            {column.id}
          </label>
        ))}
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================
export {
  // Main components
  DataTableRoot,
  DataTableSearch,
  DataTableContent,
  DataTablePageCount,
  DataTableRowCount,
  DataTablePagination,
  DataTableColumnVisibility,
  // Column header
  DataTableColumnHeader,
  // Column helpers
  createSelectColumn,
  createExpandColumn,
  createDragHandleColumn,
  // Context hook
  useDataTable,
};

// Type exports
export type { DataTableProps, DataTableSearchProps, DataTablePaginationProps };
