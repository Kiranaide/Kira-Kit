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
import {
  IconTrash,
  IconDownload,
  IconFileExport,
  IconLayoutGrid,
  IconSearch,
  IconFileText,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

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
    balance: 2540.5,
    createdAt: "2024-01-15",
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "active",
    balance: -125.3,
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
    balance: 3420.0,
    createdAt: "2024-01-18",
  },
  {
    id: "u5",
    name: "Eve Martinez",
    email: "eve@example.com",
    status: "suspended",
    balance: 560.2,
    createdAt: "2024-01-19",
  },
];

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

const selectionColumns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  ...rendererColumns,
];

export default function DataTablePage() {
  const [showSkeleton, setShowSkeleton] = React.useState(false);
  const [showEmpty, setShowEmpty] = React.useState(false);
  const [density, setDensity] = React.useState<
    "compact" | "default" | "comfortable"
  >("default");

  const cellRenderersCode = `const rendererColumns: ColumnDef<User>[] = [
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
];`;

  const densityCode = `const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default");

<DataTableDensityToggle
  value={density}
  onValueChange={setDensity}
/>

<DataTableRoot
  columns={rendererColumns}
  data={data}
  density={density}
>
  <DataTableContent />
  <DataTablePagination />
</DataTableRoot>`;

  const selectionCode = `const selectionColumns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  ...rendererColumns,
];

<DataTableRoot
  columns={selectionColumns}
  data={data}
  enableRowSelection
>
  <DataTableContent />
  <div className="flex items-center justify-between">
    <DataTableBulkActions>
      <Button variant="destructive" size="sm">
        Delete Selected
      </Button>
      <Button variant="outline" size="sm">
        Export Selected
      </Button>
    </DataTableBulkActions>
    <DataTablePagination />
  </div>
</DataTableRoot>`;

  const statesCode = `const [showSkeleton, setShowSkeleton] = React.useState(false);
const [showEmpty, setShowEmpty] = React.useState(false);

{showSkeleton ? (
  <DataTableSkeleton rows={5} columns={5} showHeader />
) : (
  <DataTableRoot columns={rendererColumns} data={data}>
    <DataTableContent />
  </DataTableRoot>
)}

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
</DataTableRoot>`;

  const exportCode = `import { exportToCSV, exportToJSON } from "@/lib/data-table-helpers";

<Button onClick={() => exportToCSV(data, ["name", "email", "status"], "users.csv")}>
  Export CSV
</Button>

<Button onClick={() => exportToJSON(data, "users.json")}>
  Export JSON
</Button>`;

  return (
    <ComponentPage>
      <PageHeader
        title="Data Table"
        description="A powerful, modular table with sorting, filtering, pagination, and more using TanStack Table. Includes cell renderers, bulk actions, density controls, and comprehensive accessibility features."
        version="1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Modular Components",
            description:
              "Build tables with pre-built cell renderers, bulk actions, skeleton loading, and empty states. Mix and match components for your needs.",
            icon: <IconLayoutGrid className="h-5 w-5" />,
          },
          {
            title: "Rich Interactions",
            description:
              "Three-way sorting, column pinning, row selection, density controls, and virtual scrolling for large datasets.",
            icon: <IconSearch className="h-5 w-5" />,
          },
          {
            title: "Accessibility First",
            description:
              "Full keyboard navigation, ARIA announcements, screen reader support, and focus management included by default.",
            icon: <IconFileText className="h-5 w-5" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="cell-renderers"
        tabs={[
          {
            value: "cell-renderers",
            label: "Cell Renderers",
            demo: (
              <>
                <DemoWrapper
                  title="Pre-built Cell Renderers"
                  description="StatusCell, DateCell, CurrencyCell, AvatarCell, and ActionsCell provide common UI patterns out of the box."
                  code={cellRenderersCode}
                >
                  <DataTableRoot
                    columns={rendererColumns}
                    data={data}
                    density="default"
                    enableKeyboardNavigation
                    announceChanges
                  >
                    <DataTableContent />
                    <DataTablePagination />
                  </DataTableRoot>
                </DemoWrapper>
              </>
            ),
          },
          {
            value: "density",
            label: "Density",
            demo: (
              <>
                <DemoWrapper
                  title="Row Density Control"
                  description="Switch between compact, default, and comfortable row spacing to optimize for your content."
                  code={densityCode}
                >
                  <div className="flex items-center gap-4 mb-4">
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
                </DemoWrapper>
              </>
            ),
          },
          {
            value: "selection",
            label: "Selection",
            demo: (
              <>
                <DemoWrapper
                  title="Row Selection & Bulk Actions"
                  description="Enable checkbox selection with createSelectColumn and perform bulk actions on selected rows."
                  code={selectionCode}
                >
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
                </DemoWrapper>
              </>
            ),
          },
          {
            value: "states",
            label: "States",
            demo: (
              <>
                <DemoWrapper
                  title="Loading & Empty States"
                  description="Show skeleton loaders while data is fetching and friendly empty states when no data is available."
                  code={statesCode}
                >
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Loading State
                      </p>
                      <div className="flex gap-2 mb-4">
                        <Button
                          size="sm"
                          onClick={() => setShowSkeleton(!showSkeleton)}
                        >
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
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Empty State
                      </p>
                      <div className="flex gap-2 mb-4">
                        <Button
                          size="sm"
                          onClick={() => setShowEmpty(!showEmpty)}
                        >
                          {showEmpty ? "Show Data" : "Show Empty"}
                        </Button>
                      </div>
                      <DataTableRoot
                        columns={rendererColumns}
                        data={showEmpty ? [] : data}
                      >
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
                    </div>
                  </div>
                </DemoWrapper>
              </>
            ),
          },
          {
            value: "export",
            label: "Export",
            demo: (
              <>
                <DemoWrapper
                  title="Export to CSV or JSON"
                  description="Utility functions to export table data to CSV or JSON format for further processing."
                  code={exportCode}
                >
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        exportToCSV(
                          data,
                          ["name", "email", "status", "balance", "createdAt"],
                          "users.csv",
                        )
                      }
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
                </DemoWrapper>
              </>
            ),
          },
        ]}
      />

      <UsageBlock
        code={`import {
  DataTableRoot,
  DataTableContent,
  DataTablePagination,
  DataTableDensityToggle,
  DataTableBulkActions,
  DataTableColumnHeader,
} from "@/components/ui/data-table"
import {
  StatusCell,
  DateCell,
  CurrencyCell,
  AvatarCell,
  ActionsCell,
} from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusCell
        value={row.getValue("status")}
        statusMap={{ active: "success", pending: "warning" }}
      />
    ),
  },
]

<DataTableRoot
  columns={columns}
  data={data}
  density="comfortable"
  enableRowSelection
  enableKeyboardNavigation
  announceChanges
>
  <DataTableBulkActions>
    <Button variant="destructive">Delete</Button>
  </DataTableBulkActions>
  <DataTableContent />
  <DataTablePagination />
</DataTableRoot>`}
        description="Basic implementation with cell renderers and row selection"
      />

      <APIReference
        sections={[
          {
            title: "DataTableRoot",
            props: [
              {
                prop: "columns",
                type: "ColumnDef<T, V>[]",
                default: "-",
                description: "Column definitions from TanStack Table",
              },
              {
                prop: "data",
                type: "T[]",
                default: "-",
                description: "Array of data to display",
              },
              {
                prop: "children",
                type: "ReactNode",
                default: "-",
                description: "Child components (Content, Pagination, etc.)",
              },
              {
                prop: "enableSorting",
                type: "boolean",
                default: "true",
                description: "Enable column sorting",
              },
              {
                prop: "enableFiltering",
                type: "boolean",
                default: "true",
                description: "Enable column and global filtering",
              },
              {
                prop: "enablePagination",
                type: "boolean",
                default: "true",
                description: "Enable pagination",
              },
              {
                prop: "enableRowSelection",
                type: "boolean",
                default: "false",
                description: "Enable row selection with checkboxes",
              },
              {
                prop: "enableColumnPinning",
                type: "boolean",
                default: "false",
                description: "Enable column pinning to left/right",
              },
              {
                prop: "enableColumnResizing",
                type: "boolean",
                default: "false",
                description: "Enable column resizing by dragging",
              },
              {
                prop: "enableExpanding",
                type: "boolean",
                default: "false",
                description: "Enable row expansion for sub-rows",
              },
              {
                prop: "enableVirtualization",
                type: "boolean",
                default: "false",
                description: "Enable virtual scrolling for large datasets",
              },
              {
                prop: "enableKeyboardNavigation",
                type: "boolean",
                default: "false",
                description: "Enable full keyboard navigation support",
              },
              {
                prop: "announceChanges",
                type: "boolean",
                default: "false",
                description: "Announce table changes to screen readers",
              },
              {
                prop: "density",
                type: "compact | default | comfortable",
                default: "default",
                description: "Row density for spacing",
              },
              {
                prop: "initialPageSize",
                type: "number",
                default: "10",
                description: "Initial number of rows per page",
              },
              {
                prop: "initialSorting",
                type: "SortingState",
                default: "[]",
                description: "Initial sort state",
              },
              {
                prop: "onRowSelectionChange",
                type: "(selection: RowSelectionState) => void",
                default: "-",
                description: "Callback when row selection changes",
              },
              {
                prop: "getSubRows",
                type: "(row: T) => T[] | undefined",
                default: "-",
                description: "Function to get sub-rows for expansion",
              },
              {
                prop: "renderSubComponent",
                type: "(props: { row: Row<T> }) => ReactNode",
                default: "-",
                description: "Custom renderer for expanded sub-rows",
              },
              {
                prop: "getRowCanExpand",
                type: "(row: Row<T>) => boolean",
                default: "-",
                description: "Function to determine if a row can expand",
              },
              {
                prop: "estimateRowHeight",
                type: "number",
                default: "48",
                description: "Estimated row height for virtualization",
              },
              {
                prop: "containerHeight",
                type: "number",
                default: "500",
                description: "Container height for virtualization",
              },
              {
                prop: "onLoadMore",
                type: "() => void",
                default: "-",
                description: "Callback to load more data (infinite scroll)",
              },
              {
                prop: "isLoading",
                type: "boolean",
                default: "false",
                description: "Loading state for virtualization",
              },
              {
                prop: "hasNextPage",
                type: "boolean",
                default: "false",
                description: "Whether more data is available",
              },
            ],
          },
          {
            title: "DataTableContent",
            props: [
              {
                prop: "renderSubComponent",
                type: "(props: { row: Row<T> }) => ReactNode",
                default: "-",
                description: "Custom renderer for expanded rows",
              },
              {
                prop: "stickyHeader",
                type: "boolean",
                default: "false",
                description: "Make table header sticky while scrolling",
              },
              {
                prop: "expandOnRowClick",
                type: "boolean",
                default: "false",
                description: "Expand row when clicking anywhere on it",
              },
              {
                prop: "enableReordering",
                type: "boolean",
                default: "false",
                description: "Enable drag-to-reorder rows",
              },
              {
                prop: "onReorder",
                type: "(newOrder: string[]) => void",
                default: "-",
                description: "Callback when rows are reordered",
              },
              {
                prop: "density",
                type: "compact | default | comfortable",
                default: "-",
                description: "Override default density",
              },
              {
                prop: "emptyState",
                type: "ReactNode",
                default: "-",
                description: "Custom empty state component",
              },
            ],
          },
          {
            title: "DataTablePagination",
            props: [
              {
                prop: "showPageSize",
                type: "boolean",
                default: "false",
                description: "Show rows per page selector",
              },
              {
                prop: "pageSizeOptions",
                type: "number[]",
                default: "[10, 20, 30, 40, 50]",
                description: "Available page sizes",
              },
              {
                prop: "showPageInfo",
                type: "boolean",
                default: "false",
                description: "Show showing X-Y of Z info",
              },
              {
                prop: "showFirstLast",
                type: "boolean",
                default: "true",
                description: "Show first/last page buttons",
              },
              {
                prop: "variant",
                type: "default | outline | ghost",
                default: "outline",
                description: "Button variant style",
              },
              {
                prop: "size",
                type: "sm | default | lg",
                default: "sm",
                description: "Button size",
              },
            ],
          },
          {
            title: "StatusCell",
            props: [
              {
                prop: "value",
                type: "string",
                default: "-",
                description: "The status value to display",
              },
              {
                prop: "statusMap",
                type: "Record<string, StatusVariant>",
                default: "{}",
                description: "Map status values to badge variants",
              },
              {
                prop: "dot",
                type: "boolean",
                default: "false",
                description: "Show as colored dot instead of badge",
              },
            ],
          },
          {
            title: "DateCell",
            props: [
              {
                prop: "value",
                type: "Date | string | number | null | undefined",
                default: "-",
                description: "The date value to format",
              },
              {
                prop: "format",
                type: "Intl.DateTimeFormatOptions",
                default: "{ dateStyle: 'medium' }",
                description: "Date format options",
              },
              {
                prop: "showRelative",
                type: "boolean",
                default: "false",
                description: "Show relative time in tooltip",
              },
              {
                prop: "locale",
                type: "string",
                default: "en",
                description: "Locale for formatting",
              },
              {
                prop: "fallback",
                type: "string",
                default: '"—"',
                description: "Fallback text for null/undefined",
              },
            ],
          },
          {
            title: "CurrencyCell",
            props: [
              {
                prop: "value",
                type: "number | null | undefined",
                default: "-",
                description: "The numeric value to format",
              },
              {
                prop: "currency",
                type: "string",
                default: '"USD"',
                description: "ISO currency code",
              },
              {
                prop: "locale",
                type: "string",
                default: '"en-US"',
                description: "Locale for formatting",
              },
              {
                prop: "colorCode",
                type: "boolean",
                default: "false",
                description: "Color code positive/negative values",
              },
              {
                prop: "fallback",
                type: "string",
                default: '"—"',
                description: "Fallback text for null/undefined",
              },
            ],
          },
          {
            title: "AvatarCell",
            props: [
              {
                prop: "src",
                type: "string | null",
                default: "-",
                description: "Avatar image source URL",
              },
              {
                prop: "name",
                type: "string",
                default: "-",
                description: "Name for fallback initials",
              },
              {
                prop: "showName",
                type: "boolean",
                default: "true",
                description: "Display name alongside avatar",
              },
              {
                prop: "size",
                type: "sm | default | lg",
                default: "default",
                description: "Avatar size",
              },
            ],
          },
          {
            title: "ActionsCell",
            props: [
              {
                prop: "row",
                type: "T",
                default: "-",
                description: "The row data object",
              },
              {
                prop: "onView",
                type: "(row: T) => void",
                default: "-",
                description: "View action handler",
              },
              {
                prop: "onEdit",
                type: "(row: T) => void",
                default: "-",
                description: "Edit action handler",
              },
              {
                prop: "onDelete",
                type: "(row: T) => void",
                default: "-",
                description: "Delete action handler",
              },
              {
                prop: "onDuplicate",
                type: "(row: T) => void",
                default: "-",
                description: "Duplicate action handler",
              },
              {
                prop: "customActions",
                type: "RowAction<T>[]",
                default: "[]",
                description: "Additional custom actions",
              },
            ],
          },
          {
            title: "DataTableDensityToggle",
            props: [
              {
                prop: "value",
                type: "compact | default | comfortable",
                default: "-",
                description: "Current density value (controlled)",
              },
              {
                prop: "defaultValue",
                type: "compact | default | comfortable",
                default: "default",
                description: "Default density (uncontrolled)",
              },
              {
                prop: "onValueChange",
                type: "(density: DataTableDensity) => void",
                default: "-",
                description: "Callback when density changes",
              },
            ],
          },
          {
            title: "DataTableBulkActions",
            props: [
              {
                prop: "children",
                type: "ReactNode",
                default: "-",
                description: "Action buttons to display",
              },
              {
                prop: "onClearSelection",
                type: "() => void",
                default: "-",
                description: "Custom clear selection handler",
              },
            ],
          },
          {
            title: "DataTableSkeleton",
            props: [
              {
                prop: "rows",
                type: "number",
                default: "5",
                description: "Number of skeleton rows",
              },
              {
                prop: "columns",
                type: "number",
                default: "5",
                description: "Number of skeleton columns",
              },
              {
                prop: "showHeader",
                type: "boolean",
                default: "true",
                description: "Show header skeleton",
              },
            ],
          },
          {
            title: "DataTableEmptyState",
            props: [
              {
                prop: "title",
                type: "string",
                default: '"No results found"',
                description: "Title text to display",
              },
              {
                prop: "description",
                type: "string",
                default: '"Try adjusting your search or filters"',
                description: "Description text",
              },
              {
                prop: "icon",
                type: "ReactNode",
                default: "-",
                description: "Custom icon component",
              },
              {
                prop: "action",
                type: "ReactNode",
                default: "-",
                description: "Action button or element",
              },
            ],
          },
        ]}
        description="Complete API reference for all DataTable components"
      />
    </ComponentPage>
  );
}
