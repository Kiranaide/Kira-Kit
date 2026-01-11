import * as React from "react";
import {
  DataTableRoot,
  DataTableSearch,
  DataTableContent,
  DataTablePageCount,
  DataTableRowCount,
  DataTablePagination,
  DataTableColumnHeader,
  DataTableColumnVisibility,
  DataTablePinningControls,
  DataTableEditableCell,
  createSelectColumn,
  createExpandColumn,
  createDragHandleColumn,
} from "@/components/ui/data-table";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  createdAt: string;
};

const data: Payment[] = [
  {
    id: "m5grK84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
    createdAt: "2024-01-15",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "abe45@gmail.com",
    createdAt: "2024-01-16",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "monserrat44@gmail.com",
    createdAt: "2024-01-17",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "silas22@gmail.com",
    createdAt: "2024-01-18",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    createdAt: "2024-01-19",
  },
  {
    id: "7fjs84ks",
    amount: 512,
    status: "pending",
    email: "john.doe@example.com",
    createdAt: "2024-01-20",
  },
  {
    id: "9xmz72lp",
    amount: 943,
    status: "success",
    email: "jane.smith@example.com",
    createdAt: "2024-01-21",
  },
  {
    id: "2qwn39rk",
    amount: 156,
    status: "processing",
    email: "bob.wilson@example.com",
    createdAt: "2024-01-22",
  },
  {
    id: "8hsk39dk",
    amount: 428,
    status: "success",
    email: "alice@example.com",
    createdAt: "2024-01-23",
  },
  {
    id: "1pqo29sk",
    amount: 654,
    status: "pending",
    email: "charlie@example.com",
    createdAt: "2024-01-24",
  },
  {
    id: "6mns83jk",
    amount: 289,
    status: "failed",
    email: "diana@example.com",
    createdAt: "2024-01-25",
  },
  {
    id: "4kls92dk",
    amount: 762,
    status: "success",
    email: "edward@example.com",
    createdAt: "2024-01-26",
  },
];

// Basic columns
const basicColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "success"
          ? "default"
          : status === "failed"
          ? "destructive"
          : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
];

// Columns with selection
const selectionColumns: ColumnDef<Payment>[] = [
  createSelectColumn<Payment>(),
  ...basicColumns,
];

// Columns with expand
const expandColumns: ColumnDef<Payment>[] = [
  createExpandColumn<Payment>(),
  ...basicColumns,
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

// Columns with drag handle for reordering
const reorderColumns: ColumnDef<Payment>[] = [
  createDragHandleColumn<Payment>(),
  ...basicColumns,
];

// Columns with editable cells
const editableColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <DataTableEditableCell
        value={row.getValue("email")}
        onSave={(value) => {
          // In a real app, you'd update the data source
          console.log("Saved:", value);
        }}
        type="text"
      />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <DataTableEditableCell
          value={amount}
          onSave={(value) => {
            console.log("Saved amount:", value);
          }}
          type="number"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <DataTableEditableCell
          value={status}
          onSave={(value) => {
            console.log("Saved status:", value);
          }}
          type="select"
          options={[
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "success", label: "Success" },
            { value: "failed", label: "Failed" },
          ]}
        />
      );
    },
  },
];

export function DataTablePage() {
  const [showColumnVisibility, setShowColumnVisibility] = React.useState(false);

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Data Table</h1>
        <p className="text-muted-foreground">
          A powerful, modular table with sorting, filtering, pagination, and
          more using TanStack Table.
        </p>
      </header>

      {/* Basic Example - Using Modular Parts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Table (Modular Parts)
        </h2>
        <p className="text-sm text-muted-foreground">
          Sorting cycles: ascending → descending → none
        </p>
        <DataTableRoot columns={basicColumns} data={data}>
          <div className="flex items-center justify-between">
            <DataTableSearch columnKey="email" placeholder="Filter emails..." />
          </div>
          <DataTableContent />
          <div className="flex items-center justify-between">
            <DataTablePageCount />
            <DataTablePagination />
          </div>
        </DataTableRoot>
      </section>

      {/* With Row Selection */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Row Selection
        </h2>
        <DataTableRoot
          columns={selectionColumns}
          data={data}
          enableRowSelection
        >
          <DataTableSearch columnKey="email" placeholder="Filter emails..." />
          <DataTableContent />
          <div className="flex items-center justify-between">
            <DataTableRowCount />
            <DataTablePagination />
          </div>
        </DataTableRoot>
      </section>

      {/* With Expandable Rows - Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Expandable Rows (Button)
        </h2>
        <p className="text-sm text-muted-foreground">
          Click the chevron button to expand the row.
        </p>
        <DataTableRoot
          columns={expandColumns}
          data={data}
          enableExpanding
          // All rows can expand (they have renderSubComponent)
          // Provide getSubRows that returns undefined so TanStack knows to use getRowCanExpand
          getSubRows={() => undefined}
          getRowCanExpand={() => true}
        >
          <DataTableContent<Payment>
            renderSubComponent={({ row }: { row: Row<Payment> }) => (
              <div className="p-4 space-y-2">
                <h4 className="font-medium">Transaction Details</h4>
                <p className="text-sm text-muted-foreground">
                  ID: {row.original.id}
                  <br />
                  Amount: ${row.original.amount}
                  <br />
                  Email: {row.original.email}
                  <br />
                  Status: {row.original.status}
                </p>
              </div>
            )}
          />
          <DataTablePagination showPageSize pageSizeOptions={[5, 10, 20]} />
        </DataTableRoot>
      </section>

      {/* With Expandable Rows - Row Click */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Expandable Rows (Row Click)
        </h2>
        <p className="text-sm text-muted-foreground">
          Click anywhere on the row to expand it.
        </p>
        <DataTableRoot
          columns={basicColumns}
          data={data}
          enableExpanding
          // All rows can expand (they have renderSubComponent)
          // Provide getSubRows that returns undefined so TanStack knows to use getRowCanExpand
          getSubRows={() => undefined}
          getRowCanExpand={() => true}
        >
          <DataTableContent<Payment>
            expandOnRowClick
            renderSubComponent={({ row }: { row: Row<Payment> }) => (
              <div className="p-4 space-y-2">
                <h4 className="font-medium">Transaction Details</h4>
                <p className="text-sm text-muted-foreground">
                  ID: {row.original.id}
                  <br />
                  Amount: ${row.original.amount}
                  <br />
                  Email: {row.original.email}
                  <br />
                  Status: {row.original.status}
                </p>
              </div>
            )}
          />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* Column Visibility */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Column Visibility
        </h2>
        <DataTableRoot columns={basicColumns} data={data}>
          <div className="flex items-center gap-4">
            <DataTableSearch columnKey="email" placeholder="Search..." />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnVisibility(!showColumnVisibility)}
            >
              Toggle Columns
            </Button>
          </div>
          {showColumnVisibility && (
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">Visible Columns</p>
              <DataTableColumnVisibility />
            </div>
          )}
          <DataTableContent />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  DataTableRoot,
  DataTableSearch,
  DataTableContent,
  DataTablePagination,
  DataTableColumnHeader,
} from "@/components/ui/data-table"

const columns: ColumnDef<YourType>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
]

// Compose your own layout!
<DataTableRoot columns={columns} data={data}>
  <DataTableSearch columnKey="email" />
  <DataTableContent />
  <DataTablePagination />
</DataTableRoot>`}
          </pre>
        </div>
      </section>

      {/* Column Pinning */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Column Pinning
        </h2>
        <p className="text-sm text-muted-foreground">
          Click the three-dot menu on column headers to pin columns left or
          right. Pinned columns stay visible while scrolling.
        </p>
        <DataTableRoot
          columns={
            basicColumns.map((col) => {
              const key =
                "accessorKey" in col ? (col.accessorKey as string) : "";
              return {
                ...col,
                header: ({ column }) => (
                  <DataTableColumnHeader
                    column={column}
                    title={
                      key === "email"
                        ? "Email"
                        : key === "status"
                        ? "Status"
                        : "Amount"
                    }
                    showPinning={true}
                  />
                ),
              };
            }) as ColumnDef<Payment>[]
          }
          data={data}
          enableColumnPinning
        >
          <div className="flex items-center justify-between">
            <DataTableSearch columnKey="email" placeholder="Filter emails..." />
            <DataTablePinningControls />
          </div>
          <DataTableContent />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* Column Resizing */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Column Resizing
        </h2>
        <p className="text-sm text-muted-foreground">
          Hover over column borders and drag to resize. Resize handles appear on
          hover.
        </p>
        <DataTableRoot columns={basicColumns} data={data} enableColumnResizing>
          <DataTableContent />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* Row Reordering */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Row Reordering
        </h2>
        <p className="text-sm text-muted-foreground">
          Drag rows by the grip handle to reorder them.
        </p>
        <DataTableRoot
          columns={reorderColumns}
          data={data}
          enableColumnOrdering={false}
        >
          <DataTableContent
            enableReordering
            onReorder={(newOrder) => {
              console.log("New order:", newOrder);
            }}
          />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* Inline Cell Editing */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Inline Cell Editing
        </h2>
        <p className="text-sm text-muted-foreground">
          Double-click any cell to edit. Press Enter to save, Escape to cancel.
        </p>
        <DataTableRoot columns={editableColumns} data={data}>
          <DataTableContent />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* Virtualization */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Virtualization (10,000 rows)
        </h2>
        <p className="text-sm text-muted-foreground">
          Virtualization enables smooth scrolling with large datasets. Only
          visible rows are rendered, making it performant even with thousands of
          rows. Sorting and filtering work seamlessly.
        </p>
        <DataTableRoot
          columns={basicColumns}
          data={React.useMemo(() => {
            // Generate 10,000 rows for virtualization demo
            const largeData: Payment[] = [];
            const statuses: Payment["status"][] = [
              "pending",
              "processing",
              "success",
              "failed",
            ];
            for (let i = 0; i < 10000; i++) {
              largeData.push({
                id: `row-${i}`,
                amount: Math.floor(Math.random() * 10000) + 100,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                email: `user${i}@example.com`,
                createdAt: new Date(2024, 0, 1 + (i % 365))
                  .toISOString()
                  .split("T")[0],
              });
            }
            return largeData;
          }, [])}
          enableVirtualization
          enablePagination={false}
          containerHeight={600}
          estimateRowHeight={48}
        >
          <DataTableSearch columnKey="email" placeholder="Filter emails..." />
          <DataTableContent stickyHeader />
        </DataTableRoot>
      </section>

      {/* Available Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Available Features
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Props</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>
                <code>enableSorting</code> - 3-way sorting
              </li>
              <li>
                <code>enableFiltering</code> - Column/global filter
              </li>
              <li>
                <code>enablePagination</code> - Page navigation
              </li>
              <li>
                <code>enableRowSelection</code> - Checkbox selection
              </li>
              <li>
                <code>enableColumnPinning</code> - Pin left/right
              </li>
              <li>
                <code>enableColumnResizing</code> - Drag to resize
              </li>
              <li>
                <code>enableExpanding</code> - Sub-rows/components
              </li>
              <li>
                <code>enableGrouping</code> - Group by column
              </li>
              <li>
                <code>enableVirtualization</code> - Virtual scrolling
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Components</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>
                <code>DataTableRoot</code> - Provider
              </li>
              <li>
                <code>DataTableSearch</code> - Filter input
              </li>
              <li>
                <code>DataTableContent</code> - Table body
              </li>
              <li>
                <code>DataTablePageCount</code> - Page X of Y
              </li>
              <li>
                <code>DataTableRowCount</code> - Selected/total
              </li>
              <li>
                <code>DataTablePagination</code> - Navigation
              </li>
              <li>
                <code>DataTableColumnVisibility</code> - Toggle cols
              </li>
              <li>
                <code>DataTablePinningControls</code> - Pin status
              </li>
              <li>
                <code>DataTableEditableCell</code> - Inline editing
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Async Data Loading */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Async Data Loading
        </h2>
        <p className="text-sm text-muted-foreground">
          Example of loading data asynchronously with loading states, error
          handling, and retry functionality.
        </p>
        <AsyncDataTableExample />
      </section>
    </div>
  );
}

// ============================================
// ASYNC DATA TABLE EXAMPLE
// ============================================
function AsyncDataTableExample() {
  const [data, setData] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Simulate async data fetching
  const fetchData = React.useCallback(
    async (shouldFail = false) => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (shouldFail && retryCount < 2) {
          throw new Error("Failed to load data. Please try again.");
        }

        // Generate mock data
        const mockData: Payment[] = Array.from({ length: 20 }, (_, i) => ({
          id: `async-${Date.now()}-${i}`,
          amount: Math.floor(Math.random() * 10000) + 100,
          status: (["pending", "processing", "success", "failed"] as const)[
            Math.floor(Math.random() * 4)
          ],
          email: `user${i + 1}@example.com`,
          createdAt: new Date(2024, 0, 1 + (i % 365))
            .toISOString()
            .split("T")[0],
        }));

        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    },
    [retryCount]
  );

  React.useEffect(() => {
    fetchData(retryCount > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const asyncColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "success"
            ? "default"
            : status === "failed"
            ? "destructive"
            : "secondary";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button
            onClick={() => {
              setRetryCount((prev) => prev + 1);
            }}
            variant="outline"
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Loaded {data.length} rows
        </p>
        <Button
          onClick={() => {
            setRetryCount(0);
            fetchData(false);
          }}
          variant="outline"
          size="sm"
        >
          Refresh Data
        </Button>
      </div>
      <DataTableRoot columns={asyncColumns} data={data}>
        <DataTableSearch columnKey="email" placeholder="Filter emails..." />
        <DataTableContent />
        <div className="flex items-center justify-between">
          <DataTablePageCount />
          <DataTablePagination />
        </div>
      </DataTableRoot>
    </div>
  );
}
