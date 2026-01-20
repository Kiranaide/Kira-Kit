import * as React from "react";
import {
  DataTableRoot,
  DataTableContent,
  DataTablePagination,
  DataTableColumnHeader,
  DataTableSkeleton,
  DataTableEmptyState,
  DataTableBulkActions,
  DataTableDensityToggle,
  createSelectColumn,
} from "@/components/ui/data-table";
import {
  StatusCell,
  DateCell,
  CurrencyCell,
  AvatarCell,
  ActionsCell,
} from "@/components/ui/data-table";
import { exportToCSV, exportToJSON } from "@/lib/data-table-helpers";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { IconTrash, IconDownload, IconFileExport } from "@tabler/icons-react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive" | "pending" | "suspended";
  balance: number;
  createdAt: string;
};

const data: User[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "",
    status: "active",
    balance: 2540.50,
    createdAt: "2024-01-15",
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "active",
    balance: -125.30,
    createdAt: "2024-01-16",
  },
  {
    id: "u3",
    name: "Carol Davis",
    email: "carol@example.com",
    status: "pending",
    balance: 890.75,
    createdAt: "2024-01-17",
  },
  {
    id: "u4",
    name: "David Wilson",
    email: "david@example.com",
    status: "inactive",
    balance: 3420.00,
    createdAt: "2024-01-18",
  },
  {
    id: "u5",
    name: "Eve Martinez",
    email: "eve@example.com",
    status: "suspended",
    balance: 560.20,
    createdAt: "2024-01-19",
  },
];

// ============================================
// CELL RENDERER EXAMPLES
// ============================================
const rendererColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <AvatarCell
        src={row.original.avatar}
        name={row.original.name}
        showName={true}
      />
    ),
  },
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
    cell: ({ row }) => (
      <StatusCell
        value={row.getValue("status")}
        statusMap={{
          active: "success",
          inactive: "default",
          pending: "warning",
          suspended: "error",
        }}
      />
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => (
      <CurrencyCell
        value={row.getValue("balance")}
        currency="USD"
        colorCode={true}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => (
      <DateCell
        value={row.getValue("createdAt")}
        showRelative={true}
        format={{ dateStyle: "medium" }}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell
        row={row.original}
        onView={(user) => console.log("View:", user.name)}
        onEdit={(user) => console.log("Edit:", user.name)}
        onDelete={(user) => console.log("Delete:", user.name)}
      />
    ),
  },
];

// ============================================
// BULK ACTIONS & ROW SELECTION
// ============================================
const selectionColumns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  ...rendererColumns,
];

export function DataTablePage() {
  const [showSkeleton, setShowSkeleton] = React.useState(false);
  const [showEmpty, setShowEmpty] = React.useState(false);
  const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default");

  return (
    <div className="p-8 max-w-6xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Data Table</h1>
        <p className="text-muted-foreground">
          A powerful, modular table with sorting, filtering, pagination, and
          more using TanStack Table. Now with enhanced accessibility, cell renderers,
          and more!
        </p>
      </header>

      {/* ============================================
          CELL RENDERERS
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Cell Renderers
        </h2>
        <p className="text-sm text-muted-foreground">
          Pre-built cell renderers for common use cases: Status, Date, Currency, Avatar, and Actions.
        </p>
        <DataTableRoot
          columns={rendererColumns}
          data={data}
          density={density}
          enableKeyboardNavigation
          announceChanges
        >
          <DataTableContent />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* ============================================
          DENSITY TOGGLE
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Density Toggle
        </h2>
        <div className="flex items-center gap-4">
          <DataTableDensityToggle
            value={density}
            onValueChange={setDensity}
          />
          <span className="text-sm text-muted-foreground">
            Current: {density}
          </span>
        </div>
        <DataTableRoot
          columns={rendererColumns}
          data={data}
          density={density}
        >
          <DataTableContent />
          <DataTablePagination />
        </DataTableRoot>
      </section>

      {/* ============================================
          BULK ACTIONS & ROW SELECTION
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Bulk Actions & Row Selection
        </h2>
        <p className="text-sm text-muted-foreground">
          Select multiple rows and perform bulk actions using the DataTableBulkActions component.
        </p>
        <DataTableRoot
          columns={selectionColumns}
          data={data}
          enableRowSelection
          density="default"
        >
          <DataTableContent />
          <div className="flex items-center justify-between">
            <DataTableBulkActions>
              <Button variant="destructive" size="sm">
                <IconTrash className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
              <Button variant="outline" size="sm">
                <IconFileExport className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            </DataTableBulkActions>
            <DataTablePagination />
          </div>
        </DataTableRoot>
      </section>

      {/* ============================================
          SKELETON LOADING
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading Skeleton
        </h2>
        <p className="text-sm text-muted-foreground">
          Show a skeleton loading state while fetching data.
        </p>
        <div className="flex gap-2 mb-4">
          <Button size="sm" onClick={() => setShowSkeleton(!showSkeleton)}>
            {showSkeleton ? "Show Table" : "Show Skeleton"}
          </Button>
        </div>
        {showSkeleton ? (
          <DataTableSkeleton rows={5} columns={5} showHeader />
        ) : (
          <DataTableRoot columns={rendererColumns} data={data}>
            <DataTableContent />
          </DataTableRoot>
        )}
      </section>

      {/* ============================================
          EMPTY STATE
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Empty State
        </h2>
        <p className="text-sm text-muted-foreground">
          Display a friendly message when there's no data.
        </p>
        <div className="flex gap-2 mb-4">
          <Button size="sm" onClick={() => setShowEmpty(!showEmpty)}>
            {showEmpty ? "Show Data" : "Show Empty"}
          </Button>
        </div>
        <DataTableRoot columns={rendererColumns} data={showEmpty ? [] : data}>
          {showEmpty ? (
            <DataTableEmptyState
              title="No users found"
              description="Try adjusting your search or filters"
              action={<Button>Add New User</Button>}
            />
          ) : (
            <DataTableContent />
          )}
        </DataTableRoot>
      </section>

      {/* ============================================
          EXPORT UTILITIES
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Export Data
        </h2>
        <p className="text-sm text-muted-foreground">
          Export table data to CSV or JSON format.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(data, ["name", "email", "status", "balance", "createdAt"], "users.csv")}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToJSON(data, "users.json")}
          >
            <IconFileExport className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </section>

      {/* ============================================
          AVAILABLE FEATURES
          ============================================ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Available Features
        </h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Core Features</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>Sorting (3-way)</li>
              <li>Filtering (global/column)</li>
              <li>Pagination</li>
              <li>Row Selection</li>
              <li>Column Pinning</li>
              <li>Column Resizing</li>
              <li>Row Expansion</li>
              <li>Column Grouping</li>
              <li>Virtualization</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">New Components</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>DataTableSkeleton</li>
              <li>DataTableEmptyState</li>
              <li>DataTableBulkActions</li>
              <li>DataTableRowActions</li>
              <li>DataTableDensityToggle</li>
              <li>NumberRangeFilter</li>
              <li>MultiSelectFilter</li>
              <li>DateRangeFilter</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Cell Renderers</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>StatusCell</li>
              <li>DateCell</li>
              <li>CurrencyCell</li>
              <li>AvatarCell</li>
              <li>ActionsCell</li>
            </ul>
            <h4 className="font-medium mt-3 mb-2">Hooks</h4>
            <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
              <li>useAnnounce</li>
              <li>useFocusManager</li>
              <li>useDataTablePersistence</li>
              <li>useAsyncDataTable</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================
          USAGE EXAMPLE
          ============================================ */}
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
  DataTableDensityToggle,
  DataTableBulkActions,
} from "@/components/ui/data-table"
import {
  StatusCell,
  DateCell,
  CurrencyCell,
  AvatarCell,
  ActionsCell,
} from "@/components/ui/data-table"

const columns = [
  {
    accessorKey: "name",
    cell: ({ row }) => (
      <AvatarCell
        src={row.original.avatar}
        name={row.original.name}
        showName={true}
      />
    ),
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusCell
        value={row.original.status}
        statusMap={{
          active: "success",
          pending: "warning",
        }}
      />
    ),
  },
]

<DataTableRoot
  columns={columns}
  data={data}
  density="comfortable"
  enableKeyboardNavigation
  announceChanges
  enableRowSelection
>
  <DataTableBulkActions>
    <Button onClick={handleDeleteSelected}>Delete</Button>
  </DataTableBulkActions>
  <DataTableSearch columnKey="name" />
  <DataTableContent />
  <DataTablePagination />
</DataTableRoot>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
