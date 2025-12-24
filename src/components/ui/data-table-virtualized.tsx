import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, Row } from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface VirtualizedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  estimateRowHeight?: number;
  containerHeight?: number;
  enableSorting?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
}

export function VirtualizedDataTable<TData, TValue>({
  columns,
  data,
  estimateRowHeight = 48,
  containerHeight = 500,
  enableSorting = true,
  onLoadMore,
  isLoading = false,
  hasNextPage = false,
}: VirtualizedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      enableSortingRemoval: true,
    }),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
  });

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
        <TableHeader className="sticky top-0 bg-background z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} colSpan={columns.length} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<TData>;
            return (
              <TableRow key={row.id} data-index={virtualRow.index}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom }} colSpan={columns.length} />
            </tr>
          )}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                <span className="text-muted-foreground">Loading...</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
