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
import { useVirtualizer } from "@tanstack/react-virtual";
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
  IconPin,
  IconPinFilled,
  IconDotsVertical,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ============================================
// CONTEXT
// ============================================
interface DataTableContextValue<TData> {
  table: TableType<TData>;
  enableVirtualization?: boolean;
  estimateRowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
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
  enableVirtualization?: boolean;
  // Initial states
  initialPageSize?: number;
  initialSorting?: SortingState;
  // Callbacks
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  // Sub-row accessor
  getSubRows?: (originalRow: TData) => TData[] | undefined;
  // Sub-component renderer
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  // Row can expand checker (for renderSubComponent without sub-rows)
  getRowCanExpand?: (row: Row<TData>) => boolean;
  // Virtualization options
  estimateRowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
}

function DataTableRoot<TData, TValue>({
  columns,
  data,
  children,
  enableSorting = true,
  enableFiltering = true,
  enableRowSelection = false,
  enableColumnOrdering: _enableColumnOrdering = false,
  enableColumnPinning = false,
  enableColumnResizing = false,
  enableExpanding = false,
  enableGrouping = false,
  enableVirtualization = false,
  initialPageSize = 10,
  initialSorting = [],
  onRowSelectionChange,
  getSubRows,
  getRowCanExpand,
  estimateRowHeight = 48,
  containerHeight = 500,
  onLoadMore,
  isLoading = false,
  hasNextPage = false,
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
    // Core
    getCoreRowModel: getCoreRowModel(),

    // Row Models - Always provide unconditionally (TanStack Table requirement)
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),

    // Sorting - Always provide handler (TanStack Table requirement)
    onSortingChange: setSorting,
    enableSortingRemoval: enableSorting,
    enableSorting: enableSorting,

    // Filtering - Always provide handlers (TanStack Table requirement)
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnFilters: enableFiltering,
    enableGlobalFilter: enableFiltering,

    // Row Selection
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelection,

    // Column Ordering
    onColumnOrderChange: setColumnOrder,

    // Column Pinning
    onColumnPinningChange: setColumnPinning,
    enableColumnPinning: enableColumnPinning,

    // Column Resizing
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: enableColumnResizing ? ("onChange" as const) : undefined,

    // Expanding - Always provide handler, pass getRowCanExpand if provided
    onExpandedChange: setExpanded,
    getSubRows: getSubRows,
    getRowCanExpand: getRowCanExpand,
    enableExpanding: enableExpanding,

    // Grouping
    onGroupingChange: setGrouping,
    enableGrouping: enableGrouping,

    // Column Visibility - Always provide handler
    onColumnVisibilityChange: setColumnVisibility,

    // State - Always provide all state properties
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

  // Store virtualization props in context for child components
  // Include state values in deps to trigger re-renders when table state changes
  const contextValue = React.useMemo(
    () => ({
      table: table as TableType<unknown>,
      enableVirtualization,
      estimateRowHeight,
      containerHeight,
      onLoadMore,
      isLoading,
      hasNextPage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      table,
      enableVirtualization,
      estimateRowHeight,
      containerHeight,
      onLoadMore,
      isLoading,
      hasNextPage,
      // Include state values to trigger re-renders
      columnFilters,
      globalFilter,
      columnVisibility,
      sorting,
      rowSelection,
      expanded,
      columnOrder,
      columnPinning,
      grouping,
    ]
  );

  return (
    <DataTableContext.Provider value={contextValue}>
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
  enableReordering?: boolean;
  onReorder?: (newOrder: string[]) => void;
}

function DataTableContent<TData>({
  renderSubComponent,
  stickyHeader = false,
  expandOnRowClick = false,
  enableReordering = false,
  onReorder,
}: DataTableContentProps<TData>) {
  const {
    table,
    enableVirtualization,
    estimateRowHeight = 48,
    containerHeight = 500,
    onLoadMore,
    isLoading = false,
    hasNextPage = false,
  } = useDataTable<TData>();

  if (enableVirtualization) {
    return (
      <DataTableVirtualizedContent
        renderSubComponent={renderSubComponent}
        stickyHeader={stickyHeader}
        expandOnRowClick={expandOnRowClick}
        estimateRowHeight={estimateRowHeight}
        containerHeight={containerHeight}
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
      />
    );
  }

  if (enableReordering) {
    return (
      <DataTableReorderableContent
        renderSubComponent={renderSubComponent}
        stickyHeader={stickyHeader}
        expandOnRowClick={expandOnRowClick}
        onReorder={onReorder}
      />
    );
  }

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
                const pinnedLeft = isPinned === "left";
                const pinnedRight = isPinned === "right";

                // Calculate left offset for pinned columns
                let leftOffset = 0;
                if (pinnedLeft) {
                  const leftPinnedColumns = headerGroup.headers.filter(
                    (h) => h.column.getIsPinned() === "left"
                  );
                  const currentIndex = leftPinnedColumns.findIndex(
                    (h) => h.id === header.id
                  );
                  for (let i = 0; i < currentIndex; i++) {
                    leftOffset += leftPinnedColumns[i].getSize();
                  }
                }

                // Calculate right offset for pinned columns
                let rightOffset = 0;
                if (pinnedRight) {
                  const rightPinnedColumns = headerGroup.headers.filter(
                    (h) => h.column.getIsPinned() === "right"
                  );
                  const currentIndex = rightPinnedColumns.findIndex(
                    (h) => h.id === header.id
                  );
                  for (
                    let i = currentIndex + 1;
                    i < rightPinnedColumns.length;
                    i++
                  ) {
                    rightOffset += rightPinnedColumns[i].getSize();
                  }
                }

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn("group relative", isPinned && "shadow-sm")}
                    style={{
                      width: header.getSize(),
                      ...(isPinned && {
                        position: "sticky",
                        left: pinnedLeft ? leftOffset : undefined,
                        right: pinnedRight ? rightOffset : undefined,
                        backgroundColor: "hsl(var(--background))",
                        zIndex: pinnedLeft || pinnedRight ? 2 : 1,
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
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none transition-colors",
                          header.column.getIsResizing()
                            ? "bg-primary"
                            : "bg-transparent group-hover:bg-primary/50"
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
                    const pinnedLeft = isPinned === "left";
                    const pinnedRight = isPinned === "right";

                    // Calculate left offset for pinned columns
                    let leftOffset = 0;
                    if (pinnedLeft) {
                      const leftPinnedColumns = row
                        .getVisibleCells()
                        .filter((c) => c.column.getIsPinned() === "left");
                      const currentIndex = leftPinnedColumns.findIndex(
                        (c) => c.id === cell.id
                      );
                      for (let i = 0; i < currentIndex; i++) {
                        leftOffset += leftPinnedColumns[i].column.getSize();
                      }
                    }

                    // Calculate right offset for pinned columns
                    let rightOffset = 0;
                    if (pinnedRight) {
                      const rightPinnedColumns = row
                        .getVisibleCells()
                        .filter((c) => c.column.getIsPinned() === "right");
                      const currentIndex = rightPinnedColumns.findIndex(
                        (c) => c.id === cell.id
                      );
                      for (
                        let i = currentIndex + 1;
                        i < rightPinnedColumns.length;
                        i++
                      ) {
                        rightOffset += rightPinnedColumns[i].column.getSize();
                      }
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(isPinned && "shadow-sm")}
                        style={{
                          width: cell.column.getSize(),
                          ...(isPinned && {
                            position: "sticky",
                            left: pinnedLeft ? leftOffset : undefined,
                            right: pinnedRight ? rightOffset : undefined,
                            backgroundColor: "hsl(var(--background))",
                            zIndex: pinnedLeft || pinnedRight ? 1 : 0,
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
// VIRTUALIZED TABLE CONTENT COMPONENT
// ============================================
interface DataTableVirtualizedContentProps<TData> {
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  stickyHeader?: boolean;
  expandOnRowClick?: boolean;
  estimateRowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
}

function DataTableVirtualizedContent<TData>({
  renderSubComponent,
  stickyHeader = false,
  expandOnRowClick = false,
  estimateRowHeight = 48,
  containerHeight = 500,
  onLoadMore,
  isLoading = false,
  hasNextPage = false,
}: DataTableVirtualizedContentProps<TData>) {
  const { table } = useDataTable<TData>();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  // Infinite scroll detection
  React.useEffect(() => {
    const parent = parentRef.current;
    if (!parent || !onLoadMore || !hasNextPage || isLoading) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = parent;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    };

    parent.addEventListener("scroll", handleScroll);
    return () => parent.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, hasNextPage, isLoading]);

  return (
    <div
      ref={parentRef}
      className="rounded-lg border border-border overflow-auto"
      style={{ height: containerHeight }}
    >
      <Table>
        <TableHeader
          className={cn(stickyHeader && "sticky top-0 bg-background z-10")}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned();
                const pinnedLeft = isPinned === "left";
                const pinnedRight = isPinned === "right";

                // Calculate left offset for pinned columns
                let leftOffset = 0;
                if (pinnedLeft) {
                  const leftPinnedColumns = headerGroup.headers.filter(
                    (h) => h.column.getIsPinned() === "left"
                  );
                  const currentIndex = leftPinnedColumns.findIndex(
                    (h) => h.id === header.id
                  );
                  for (let i = 0; i < currentIndex; i++) {
                    leftOffset += leftPinnedColumns[i].getSize();
                  }
                }

                // Calculate right offset for pinned columns
                let rightOffset = 0;
                if (pinnedRight) {
                  const rightPinnedColumns = headerGroup.headers.filter(
                    (h) => h.column.getIsPinned() === "right"
                  );
                  const currentIndex = rightPinnedColumns.findIndex(
                    (h) => h.id === header.id
                  );
                  for (
                    let i = currentIndex + 1;
                    i < rightPinnedColumns.length;
                    i++
                  ) {
                    rightOffset += rightPinnedColumns[i].getSize();
                  }
                }

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn("group relative", isPinned && "shadow-sm")}
                    style={{
                      width: header.getSize(),
                      ...(isPinned && {
                        position: "sticky",
                        left: pinnedLeft ? leftOffset : undefined,
                        right: pinnedRight ? rightOffset : undefined,
                        backgroundColor: "hsl(var(--background))",
                        zIndex: pinnedLeft || pinnedRight ? 2 : 1,
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
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none transition-colors",
                          header.column.getIsResizing()
                            ? "bg-primary"
                            : "bg-transparent group-hover:bg-primary/50"
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
          {paddingTop > 0 && (
            <tr>
              <td
                style={{ height: paddingTop }}
                colSpan={table.getAllColumns().length}
              />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<TData>;
            return (
              <React.Fragment key={row.id}>
                <TableRow
                  data-index={virtualRow.index}
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
                    const pinnedLeft = isPinned === "left";
                    const pinnedRight = isPinned === "right";

                    // Calculate left offset for pinned columns
                    let leftOffset = 0;
                    if (pinnedLeft) {
                      const leftPinnedCells = row
                        .getVisibleCells()
                        .filter((c) => c.column.getIsPinned() === "left");
                      const currentIndex = leftPinnedCells.findIndex(
                        (c) => c.id === cell.id
                      );
                      for (let i = 0; i < currentIndex; i++) {
                        leftOffset += leftPinnedCells[i].column.getSize();
                      }
                    }

                    // Calculate right offset for pinned columns
                    let rightOffset = 0;
                    if (pinnedRight) {
                      const rightPinnedCells = row
                        .getVisibleCells()
                        .filter((c) => c.column.getIsPinned() === "right");
                      const currentIndex = rightPinnedCells.findIndex(
                        (c) => c.id === cell.id
                      );
                      for (
                        let i = currentIndex + 1;
                        i < rightPinnedCells.length;
                        i++
                      ) {
                        rightOffset += rightPinnedCells[i].column.getSize();
                      }
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(isPinned && "shadow-sm")}
                        style={{
                          width: cell.column.getSize(),
                          ...(isPinned && {
                            position: "sticky",
                            left: pinnedLeft ? leftOffset : undefined,
                            right: pinnedRight ? rightOffset : undefined,
                            backgroundColor: "hsl(var(--background))",
                            zIndex: pinnedLeft || pinnedRight ? 1 : 0,
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
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td
                style={{ height: paddingBottom }}
                colSpan={table.getAllColumns().length}
              />
            </tr>
          )}
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="text-center py-4"
              >
                <span className="text-muted-foreground">Loading...</span>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && rows.length === 0 && (
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
// REORDERABLE TABLE CONTENT COMPONENT
// ============================================
interface DataTableReorderableContentProps<TData> {
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  stickyHeader?: boolean;
  expandOnRowClick?: boolean;
  onReorder?: (newOrder: string[]) => void;
}

function DataTableReorderableContent<TData>({
  renderSubComponent,
  stickyHeader = false,
  expandOnRowClick = false,
  onReorder,
}: DataTableReorderableContentProps<TData>) {
  const { table } = useDataTable<TData>();
  const rows = table.getRowModel().rows;
  const [items, setItems] = React.useState(() => rows.map((row) => row.id));

  // Update items when rows change (e.g., filtering)
  React.useEffect(() => {
    const newItems = rows.map((row) => row.id);
    setItems(newItems);
  }, [rows]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder?.(newItems);
        return newItems;
      });
    }
  };

  // Create a map of row id to row for efficient lookup
  const rowMap = React.useMemo(() => {
    const map = new Map<string, Row<TData>>();
    rows.forEach((row) => {
      map.set(row.id, row);
    });
    return map;
  }, [rows]);

  // Get rows in the new order
  const orderedRows = items
    .map((id) => rowMap.get(id))
    .filter((row): row is Row<TData> => row !== undefined);

  return (
    <div
      className={cn(
        "rounded-lg border border-border",
        stickyHeader && "max-h-[600px] overflow-auto"
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
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
                  const pinnedLeft = isPinned === "left";
                  const pinnedRight = isPinned === "right";

                  let leftOffset = 0;
                  if (pinnedLeft) {
                    const leftPinnedColumns = headerGroup.headers.filter(
                      (h) => h.column.getIsPinned() === "left"
                    );
                    const currentIndex = leftPinnedColumns.findIndex(
                      (h) => h.id === header.id
                    );
                    for (let i = 0; i < currentIndex; i++) {
                      leftOffset += leftPinnedColumns[i].getSize();
                    }
                  }

                  let rightOffset = 0;
                  if (pinnedRight) {
                    const rightPinnedColumns = headerGroup.headers.filter(
                      (h) => h.column.getIsPinned() === "right"
                    );
                    const currentIndex = rightPinnedColumns.findIndex(
                      (h) => h.id === header.id
                    );
                    for (
                      let i = currentIndex + 1;
                      i < rightPinnedColumns.length;
                      i++
                    ) {
                      rightOffset += rightPinnedColumns[i].getSize();
                    }
                  }

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn("group relative", isPinned && "shadow-sm")}
                      style={{
                        width: header.getSize(),
                        ...(isPinned && {
                          position: "sticky",
                          left: pinnedLeft ? leftOffset : undefined,
                          right: pinnedRight ? rightOffset : undefined,
                          backgroundColor: "hsl(var(--background))",
                          zIndex: pinnedLeft || pinnedRight ? 2 : 1,
                        }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn(
                            "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none transition-colors",
                            header.column.getIsResizing()
                              ? "bg-primary"
                              : "bg-transparent group-hover:bg-primary/50"
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
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {orderedRows.length ? (
                orderedRows.map((row) => (
                  <DataTableSortableRow
                    key={row.id}
                    row={row}
                    renderSubComponent={renderSubComponent}
                    expandOnRowClick={expandOnRowClick}
                  />
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
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}

// ============================================
// SORTABLE ROW COMPONENT
// ============================================
interface DataTableSortableRowProps<TData> {
  row: Row<TData>;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  expandOnRowClick?: boolean;
}

function DataTableSortableRow<TData>({
  row,
  renderSubComponent,
  expandOnRowClick = false,
}: DataTableSortableRowProps<TData>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <React.Fragment>
      <tr
        ref={setNodeRef}
        style={style}
        data-state={row.getIsSelected() && "selected"}
        className={cn(
          "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
          expandOnRowClick && row.getCanExpand() && "cursor-pointer",
          isDragging && "ring-2 ring-primary"
        )}
        onClick={
          expandOnRowClick && row.getCanExpand()
            ? () => row.toggleExpanded()
            : undefined
        }
      >
        {row.getVisibleCells().map((cell) => {
          const isPinned = cell.column.getIsPinned();
          const pinnedLeft = isPinned === "left";
          const pinnedRight = isPinned === "right";

          let leftOffset = 0;
          if (pinnedLeft) {
            const leftPinnedColumns = row
              .getVisibleCells()
              .filter((c) => c.column.getIsPinned() === "left");
            const currentIndex = leftPinnedColumns.findIndex(
              (c) => c.id === cell.id
            );
            for (let i = 0; i < currentIndex; i++) {
              leftOffset += leftPinnedColumns[i].column.getSize();
            }
          }

          let rightOffset = 0;
          if (pinnedRight) {
            const rightPinnedColumns = row
              .getVisibleCells()
              .filter((c) => c.column.getIsPinned() === "right");
            const currentIndex = rightPinnedColumns.findIndex(
              (c) => c.id === cell.id
            );
            for (let i = currentIndex + 1; i < rightPinnedColumns.length; i++) {
              rightOffset += rightPinnedColumns[i].column.getSize();
            }
          }

          // Check if this is the drag handle column
          const isDragHandle = cell.column.id === "drag";

          return (
            <TableCell
              key={cell.id}
              className={cn(
                isPinned && "shadow-sm",
                isDragHandle && "cursor-grab active:cursor-grabbing"
              )}
              style={{
                width: cell.column.getSize(),
                ...(isPinned && {
                  position: "sticky",
                  left: pinnedLeft ? leftOffset : undefined,
                  right: pinnedRight ? rightOffset : undefined,
                  backgroundColor: "hsl(var(--background))",
                  zIndex: pinnedLeft || pinnedRight ? 1 : 0,
                }),
              }}
              {...(isDragHandle ? { ...attributes, ...listeners } : {})}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </tr>
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
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

function DataTablePagination({
  showPageSize = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageInfo = false,
  showFirstLast = true,
  variant = "outline",
  size = "sm",
}: DataTablePaginationProps) {
  const { table } = useDataTable();

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className={cn(
                "rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-2 focus:ring-ring",
                size === "sm" && "h-7 text-xs",
                size === "default" && "h-8 text-sm",
                size === "lg" && "h-9 text-base"
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
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalRows)} of {totalRows}
            </span>
            <span className="sm:hidden">{currentPage}/{pageCount}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <Button
            variant={variant}
            size={size}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            {"<<"}
          </Button>
        )}
        <Button
          variant={variant}
          size={size}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Go to previous page"
        >
          Previous
        </Button>
        <div className="flex items-center gap-1 mx-1">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
        </div>
        <Button
          variant={variant}
          size={size}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Go to next page"
        >
          Next
        </Button>
        {showFirstLast && (
          <Button
            variant={variant}
            size={size}
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            {">>"}
          </Button>
        )}
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
  showPinning?: boolean;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  showPinning = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isPinned = column.getIsPinned();

  if (!column.getCanSort()) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span>{title}</span>
        {showPinning && column.getCanPin() && (
          <DataTableColumnPinningMenu column={column} />
        )}
      </div>
    );
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
    <div className={cn("flex items-center gap-2", className)}>
      <button
        className={cn(
          "flex items-center gap-1 -ml-3 px-3 py-1.5 rounded-md hover:bg-muted",
          isPinned && "bg-muted/50"
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
      {showPinning && column.getCanPin() && (
        <DataTableColumnPinningMenu column={column} />
      )}
    </div>
  );
}

// ============================================
// COLUMN PINNING MENU
// ============================================
interface DataTableColumnPinningMenuProps<TData, TValue> {
  column: import("@tanstack/react-table").Column<TData, TValue>;
}

function DataTableColumnPinningMenu<TData, TValue>({
  column,
}: DataTableColumnPinningMenuProps<TData, TValue>) {
  const isPinned = column.getIsPinned();
  const pinPosition =
    isPinned === "left" ? "left" : isPinned === "right" ? "right" : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            aria-label="Column options"
          >
            <IconDotsVertical className="h-4 w-4" />
          </button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (pinPosition === "left") {
              column.pin(false);
            } else {
              column.pin("left");
            }
          }}
        >
          {pinPosition === "left" ? (
            <>
              <IconPinFilled className="h-4 w-4 mr-2" />
              Unpin from Left
            </>
          ) : (
            <>
              <IconPin className="h-4 w-4 mr-2" />
              Pin to Left
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (pinPosition === "right") {
              column.pin(false);
            } else {
              column.pin("right");
            }
          }}
        >
          {pinPosition === "right" ? (
            <>
              <IconPinFilled className="h-4 w-4 mr-2" />
              Unpin from Right
            </>
          ) : (
            <>
              <IconPin className="h-4 w-4 mr-2" />
              Pin to Right
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// SELECTION CHECKBOX COLUMN HELPER
// ============================================
function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              isAllSelected ? true : isSomeSelected ? "indeterminate" : false
            }
            onCheckedChange={(value) => {
              // Toggle all page rows based on checkbox value
              const shouldSelect = value === true || value === "indeterminate";
              table.toggleAllPageRowsSelected(shouldSelect);
            }}
            aria-label="Select all"
          />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => {
              // Toggle row selection based on checkbox value
              row.toggleSelected(value === true);
            }}
            aria-label="Select row"
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 50,
    maxSize: 50,
  };
}

// ============================================
// EXPAND COLUMN HELPER
// ============================================
function createExpandColumn<TData>(): ColumnDef<TData> {
  return {
    id: "expand",
    header: () => <div className="w-10" />,
    cell: ({ row }) => {
      // Always show the expand button if the row can expand
      // If it can't expand, show a placeholder to maintain column width
      const canExpand = row.getCanExpand();
      const isExpanded = row.getIsExpanded();

      return (
        <div className="flex items-center justify-center w-full">
          {canExpand ? (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              <IconChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </button>
          ) : (
            <div className="w-6" /> // Placeholder to maintain spacing
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 50,
    maxSize: 50,
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
// EDITABLE CELL COMPONENT
// ============================================
interface DataTableEditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  className?: string;
}

function DataTableEditableCell({
  value: initialValue,
  onSave,
  type = "text",
  options,
  className,
}: DataTableEditableCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(initialValue);
  const inputRef = React.useRef<HTMLInputElement | HTMLSelectElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === "text" && inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(initialValue);
  };

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(initialValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div
        onDoubleClick={handleDoubleClick}
        className={cn("cursor-pointer min-h-6 py-1", className)}
      >
        {initialValue}
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <select
        ref={inputRef as React.RefObject<HTMLSelectElement>}
        value={String(editValue)}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full border border-primary rounded px-2 py-1 bg-background",
          className
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

  return (
    <Input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={type}
      value={editValue}
      onChange={(e) =>
        setEditValue(
          type === "number" ? Number(e.target.value) : e.target.value
        )
      }
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={cn("h-auto py-1", className)}
      autoFocus
    />
  );
}

// ============================================
// EXPORTS
// ============================================
// ============================================
// COLUMN PINNING CONTROLS (Standalone component)
// ============================================
function DataTablePinningControls() {
  const { table } = useDataTable();

  const pinnedLeftColumns = table
    .getAllLeafColumns()
    .filter((col) => col.getIsPinned() === "left");
  const pinnedRightColumns = table
    .getAllLeafColumns()
    .filter((col) => col.getIsPinned() === "right");

  if (pinnedLeftColumns.length === 0 && pinnedRightColumns.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {pinnedLeftColumns.length > 0 && (
        <div className="flex items-center gap-2">
          <IconPinFilled className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {pinnedLeftColumns.length} left
          </span>
        </div>
      )}
      {pinnedRightColumns.length > 0 && (
        <div className="flex items-center gap-2">
          <IconPinFilled className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {pinnedRightColumns.length} right
          </span>
        </div>
      )}
    </div>
  );
}

export {
  // Main components
  DataTableRoot,
  DataTableSearch,
  DataTableContent,
  DataTablePageCount,
  DataTableRowCount,
  DataTablePagination,
  DataTableColumnVisibility,
  DataTablePinningControls,
  // Column header
  DataTableColumnHeader,
  // Column helpers
  createSelectColumn,
  createExpandColumn,
  createDragHandleColumn,
  // Editable cell
  DataTableEditableCell,
  // Context hook
  useDataTable,
};

// Type exports
export type { DataTableProps, DataTableSearchProps, DataTablePaginationProps };
