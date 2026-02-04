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
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconChevronRight,
  IconGripVertical,
  IconPin,
  IconPinFilled,
  IconDotsVertical,
  IconInbox,
  IconX,
  IconTrash,
  IconEdit,
  IconEye,
  IconCopy,
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

type DataTableDensity = "compact" | "default" | "comfortable";

const densityStyles: Record<DataTableDensity, { row: string; cell: string }> = {
  compact: { row: "h-8", cell: "py-1 px-2 text-xs" },
  default: { row: "h-12", cell: "py-2 px-4 text-sm" },
  comfortable: { row: "h-16", cell: "py-4 px-4 text-sm" },
};

interface DataTableContextValue<TData> {
  table: TableType<TData>;
  enableVirtualization?: boolean;
  estimateRowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  density: DataTableDensity;
  enableKeyboardNavigation?: boolean;
  announceChanges?: boolean;
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children: React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;

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
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
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

  enableColumnPinning = false,
  enableColumnResizing = false,
  enableExpanding = false,
  enableGrouping = false,
  enableVirtualization = false,
  enableKeyboardNavigation = false,
  announceChanges = false,
  density = "default",
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

  React.useEffect(() => {
    onRowSelectionChange?.(rowSelection);
  }, [rowSelection, onRowSelectionChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: enableSorting,
    enableSorting: enableSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnFilters: enableFiltering,
    enableGlobalFilter: enableFiltering,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    enableColumnPinning: enableColumnPinning,
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: enableColumnResizing ? ("onChange" as const) : undefined,
    onExpandedChange: setExpanded,
    getSubRows: getSubRows,
    getRowCanExpand: getRowCanExpand,
    enableExpanding: enableExpanding,
    onGroupingChange: setGrouping,
    enableGrouping: enableGrouping,
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

  const contextValue = React.useMemo(
    () => ({
      table: table as TableType<unknown>,
      enableVirtualization,
      estimateRowHeight,
      containerHeight,
      onLoadMore,
      isLoading,
      hasNextPage,
      density,
      enableKeyboardNavigation,
      announceChanges,
    }),
    [
      table,
      enableVirtualization,
      estimateRowHeight,
      containerHeight,
      onLoadMore,
      isLoading,
      hasNextPage,
      density,
      enableKeyboardNavigation,
      announceChanges,

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

interface DataTableContentProps<TData> {
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  stickyHeader?: boolean;
  expandOnRowClick?: boolean;
  enableReordering?: boolean;
  onReorder?: (newOrder: string[]) => void;
  density?: DataTableDensity;
  emptyState?: React.ReactNode;
}

function DataTableContent<TData>({
  renderSubComponent,
  stickyHeader = false,
  expandOnRowClick = false,
  enableReordering = false,
  onReorder,
  density: densityProp,
  emptyState,
}: DataTableContentProps<TData>) {
  const {
    table,
    enableVirtualization,
    estimateRowHeight = 48,
    containerHeight = 500,
    onLoadMore,
    isLoading = false,
    hasNextPage = false,
    density: contextDensity = "default",
  } = useDataTable<TData>();

  const density = densityProp ?? contextDensity;

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
                    {}
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
                  className={cn(
                    densityStyles[density]?.row,
                    expandOnRowClick && row.getCanExpand() && "cursor-pointer"
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
                        className={cn(
                          densityStyles[density]?.cell,
                          isPinned && "shadow-sm"
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
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {}
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
          ) : emptyState ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <IconInbox className="h-8 w-8 mb-2" />
                  <span>No results found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

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
  const { table, density } = useDataTable<TData>();
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
            <TableRow
              key={headerGroup.id}
              className={densityStyles[density]?.row}
            >
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
                    {}
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
                  className={cn(
                    densityStyles[density]?.row,
                    expandOnRowClick && row.getCanExpand() && "cursor-pointer"
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
                        className={cn(
                          densityStyles[density]?.cell,
                          isPinned && "shadow-sm"
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
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {}
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
  const { table, density } = useDataTable<TData>();
  const rows = table.getRowModel().rows;
  const [items, setItems] = React.useState(() => rows.map((row) => row.id));

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

  const rowMap = React.useMemo(() => {
    const map = new Map<string, Row<TData>>();
    rows.forEach((row) => {
      map.set(row.id, row);
    });
    return map;
  }, [rows]);

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
              <TableRow
                key={headerGroup.id}
                className={densityStyles[density]?.row}
              >
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
  const { density } = useDataTable<TData>();
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
          densityStyles[density]?.row,
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

          const isDragHandle = cell.column.id === "drag";

          return (
            <TableCell
              key={cell.id}
              className={cn(
                densityStyles[density]?.cell,
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

function DataTablePageCount() {
  const { table } = useDataTable();

  return (
    <div className="text-sm text-muted-foreground">
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
  );
}

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
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">
              Rows per page
            </span>
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
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalRows)} of {totalRows}
            </span>
            <span className="sm:hidden">
              {currentPage}/{pageCount}
            </span>
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

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
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

  const handleSort = () => {
    const currentSort = column.getIsSorted();
    if (currentSort === false) {
      column.toggleSorting(false);
    } else if (currentSort === "asc") {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
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

function createExpandColumn<TData>(): ColumnDef<TData> {
  return {
    id: "expand",
    header: () => <div className="w-10" />,
    cell: ({ row }) => {
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
            <div className="w-6" />
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

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

function DataTableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={cn("rounded-lg border border-border", className)}>
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <div
                    className="h-4 animate-pulse rounded bg-muted"
                    style={{ width: `${60 + Math.random() * 40}%` }}
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
        className
      )}
    >
      <div className="mb-4 text-muted-foreground">
        {icon ?? <IconInbox className="h-12 w-12" />}
      </div>
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

interface DataTableBulkActionsProps {
  children: React.ReactNode;
  className?: string;
  onClearSelection?: () => void;
}

function DataTableBulkActions({
  children,
  className,
  onClearSelection,
}: DataTableBulkActionsProps) {
  const { table } = useDataTable();
  const selectedCount = Object.keys(table.getState().rowSelection).length;

  if (selectedCount === 0) {
    return null;
  }

  const handleClear = () => {
    if (onClearSelection) {
      onClearSelection();
    } else {
      table.resetRowSelection();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2",
        className
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{selectedCount} selected</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-6 px-2"
          aria-label="Clear selection"
        >
          <IconX className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">{children}</div>
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
}

function DataTableRowActions<TData>({
  row,
  actions,
  className,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", className)}
            aria-label="Row actions"
          >
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            {action.separator && index > 0 && (
              <div className="my-1 h-px bg-border" />
            )}
            <DropdownMenuItem
              onClick={() => action.onClick(row)}
              disabled={action.disabled}
              className={cn(action.destructive && "text-destructive")}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
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
        <div
          className={cn("h-2 w-2 rounded-full", statusDotStyles[variant])}
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

interface DateCellProps {
  value: Date | string | number | null | undefined;
  format?: Intl.DateTimeFormatOptions;
  showRelative?: boolean;
  locale?: string;
  fallback?: string;
  className?: string;
}

function getRelativeTime(date: Date, locale: string = "en"): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffDays > 30) {
    return rtf.format(-Math.floor(diffDays / 30), "month");
  } else if (diffDays > 0) {
    return rtf.format(-diffDays, "day");
  } else if (diffHours > 0) {
    return rtf.format(-diffHours, "hour");
  } else if (diffMins > 0) {
    return rtf.format(-diffMins, "minute");
  } else {
    return rtf.format(-diffSecs, "second");
  }
}

function DateCell({
  value,
  format = { dateStyle: "medium" },
  showRelative = false,
  locale = "en",
  fallback = "—",
  className,
}: DateCellProps) {
  if (value === null || value === undefined) {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  const formatted = new Intl.DateTimeFormat(locale, format).format(date);
  const relative = getRelativeTime(date, locale);

  if (showRelative) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <span className={cn("cursor-help", className)}>{formatted}</span>
          }
        />
        <TooltipContent>{relative}</TooltipContent>
      </Tooltip>
    );
  }

  return <span className={className}>{formatted}</span>;
}

interface CurrencyCellProps {
  value: number | null | undefined;
  currency?: string;
  locale?: string;
  colorCode?: boolean;
  fallback?: string;
  className?: string;
}

function CurrencyCell({
  value,
  currency = "USD",
  locale = "en-US",
  colorCode = false,
  fallback = "—",
  className,
}: CurrencyCellProps) {
  if (value === null || value === undefined) {
    return (
      <span className={cn("text-muted-foreground", className)}>{fallback}</span>
    );
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);

  const colorClass = colorCode
    ? value > 0
      ? "text-success"
      : value < 0
        ? "text-destructive"
        : ""
    : "";

  return <span className={cn(colorClass, className)}>{formatted}</span>;
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
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarSizeStyles = {
  sm: "h-6 w-6 text-xs",
  default: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
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
        {src && <AvatarImage src={src} alt={name} />}
        <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
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
}

function ActionsCell<TData>({
  row,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  customActions = [],
  className,
}: ActionsCellProps<TData>) {
  const actions: RowAction<TData>[] = [];

  if (onView) {
    actions.push({
      label: "View",
      icon: <IconEye className="h-4 w-4" />,
      onClick: onView,
    });
  }

  if (onEdit) {
    actions.push({
      label: "Edit",
      icon: <IconEdit className="h-4 w-4" />,
      onClick: onEdit,
    });
  }

  if (onDuplicate) {
    actions.push({
      label: "Duplicate",
      icon: <IconCopy className="h-4 w-4" />,
      onClick: onDuplicate,
    });
  }

  actions.push(...customActions);

  if (onDelete) {
    actions.push({
      label: "Delete",
      icon: <IconTrash className="h-4 w-4" />,
      onClick: onDelete,
      destructive: true,
      separator: actions.length > 0,
    });
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <DataTableRowActions row={row} actions={actions} className={className} />
  );
}

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

interface DataTableDensityToggleProps {
  value?: DataTableDensity;
  defaultValue?: DataTableDensity;
  onValueChange?: (density: DataTableDensity) => void;
  className?: string;
}

function DataTableDensityToggle({
  value,
  defaultValue = "default",
  onValueChange,
  className,
}: DataTableDensityToggleProps) {
  const [internalValue, setInternalValue] =
    React.useState<DataTableDensity>(defaultValue);
  const currentValue = value ?? internalValue;

  const handleChange = (newValue: DataTableDensity) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const densityOptions: { value: DataTableDensity; label: string }[] = [
    { value: "compact", label: "Compact" },
    { value: "default", label: "Default" },
    { value: "comfortable", label: "Comfortable" },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border p-1",
        className
      )}
    >
      {densityOptions.map((option) => (
        <Button
          key={option.value}
          variant={currentValue === option.value ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleChange(option.value)}
          className="h-7 px-2 text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

interface NumberRangeFilterProps {
  columnId: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  step?: number;
  className?: string;
}

function NumberRangeFilter({
  columnId,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  step = 1,
  className,
}: NumberRangeFilterProps) {
  const { table } = useDataTable();
  const column = table.getColumn(columnId);

  const filterValue = (column?.getFilterValue() as [number?, number?]) ?? [
    undefined,
    undefined,
  ];
  const [min, max] = filterValue;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    column?.setFilterValue([value, max]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    column?.setFilterValue([min, value]);
  };

  if (!column) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        type="number"
        placeholder={minPlaceholder}
        value={min ?? ""}
        onChange={handleMinChange}
        step={step}
        className="h-8 w-20"
      />
      <span className="text-muted-foreground">to</span>
      <Input
        type="number"
        placeholder={maxPlaceholder}
        value={max ?? ""}
        onChange={handleMaxChange}
        step={step}
        className="h-8 w-20"
      />
    </div>
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

function MultiSelectFilter({
  columnId,
  options,
  placeholder = "Select...",
  searchable = true,
  className,
}: MultiSelectFilterProps) {
  const { table } = useDataTable();
  const column = table.getColumn(columnId);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filterValue = (column?.getFilterValue() as string[]) ?? [];

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleToggle = (value: string) => {
    const newValue = filterValue.includes(value)
      ? filterValue.filter((v) => v !== value)
      : [...filterValue, value];
    column?.setFilterValue(newValue.length > 0 ? newValue : undefined);
  };

  const handleSelectAll = () => {
    column?.setFilterValue(options.map((o) => o.value));
  };

  const handleClear = () => {
    column?.setFilterValue(undefined);
  };

  if (!column) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 justify-between", className)}
          >
            {filterValue.length > 0
              ? `${filterValue.length} selected`
              : placeholder}
            <IconChevronDown className="ml-2 h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent className="w-56 p-2">
        {searchable && (
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 h-8"
          />
        )}
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="h-6 text-xs"
          >
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 text-xs"
          >
            Clear
          </Button>
        </div>
        <div className="max-h-48 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={filterValue.includes(option.value)}
                className="pointer-events-none"
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DateRangeFilterProps {
  columnId: string;
  className?: string;
}

function DateRangeFilter({ columnId, className }: DateRangeFilterProps) {
  const { table } = useDataTable();
  const column = table.getColumn(columnId);

  const filterValue = (column?.getFilterValue() as [string?, string?]) ?? [
    undefined,
    undefined,
  ];
  const [fromDate, toDate] = filterValue;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined;
    column?.setFilterValue([value, toDate]);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined;
    column?.setFilterValue([fromDate, value]);
  };

  if (!column) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        type="date"
        value={fromDate ?? ""}
        onChange={handleFromChange}
        className="h-8"
      />
      <span className="text-muted-foreground">to</span>
      <Input
        type="date"
        value={toDate ?? ""}
        onChange={handleToChange}
        className="h-8"
      />
    </div>
  );
}

function getDensityStyles(density: DataTableDensity) {
  return densityStyles[density];
}

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
  getDensityStyles,
  useDataTable,
};

export type {
  DataTableProps,
  DataTableSearchProps,
  DataTablePaginationProps,
  DataTableSkeletonProps,
  DataTableEmptyStateProps,
  DataTableBulkActionsProps,
  DataTableRowActionsProps,
  DataTableDensityToggleProps,
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
