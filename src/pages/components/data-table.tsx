import type { ComponentProps as ReactComponentProps } from "react";
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
  DataTableFacetedFilter,
  useDataTable,
  useTableStatePersistence,
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
import type { DTColumnDef as ColumnDef } from "@/components/ui/data-table";
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
  KeyboardShortcuts,
  Changelog,
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

const rendererColumns: ColumnDef<User, unknown>[] = [
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

const selectionColumns: ColumnDef<User, unknown>[] = [
  createSelectColumn<User>(),
  ...rendererColumns,
];

// Faceted filter columns — proper accessors so getFacetedUniqueValues counts
// populate (facet counting reads accessor values, not cell renderers).
const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

const facetedColumns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
  },
  {
    accessorKey: "status",
    filterFn: "arrIncludesSome",
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
      <CurrencyCell value={row.getValue("balance")} currency="USD" />
    ),
  },
];

// Faceted filter needs the live Column instance — pull it from context.
function StatusFacetedFilter() {
  const { table } = useDataTable<User>();

  return (
    <DataTableFacetedFilter
      column={table.getColumn("status")}
      title="Status"
      options={STATUS_OPTIONS}
    />
  );
}

function FacetedFilterDemo() {
  return (
    <DataTableRoot columns={facetedColumns} data={data}>
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <StatusFacetedFilter />
      </div>
      <DataTableContent />
      <DataTablePagination />
    </DataTableRoot>
  );
}

const resizingColumns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: "name",
    size: 200,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
  },
  {
    accessorKey: "email",
    size: 320,
    minSize: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "status",
    size: 140,
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
    size: 140,
    maxSize: 400,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => (
      <CurrencyCell value={row.getValue("balance")} currency="USD" />
    ),
  },
];

function ResizeDemo() {
  return (
    <DataTableRoot
      columns={resizingColumns}
      data={data}
      enableColumnResizing
      enableKeyboardNavigation
    >
      <DataTableContent />
      <DataTablePagination />
    </DataTableRoot>
  );
}

function KeyboardNavDemo() {
  return (
    <DataTableRoot
      columns={selectionColumns}
      data={data}
      enableRowSelection
      enableKeyboardNavigation
      enableExpanding
      getRowCanExpand={() => true}
    >
      <DataTableContent />
      <DataTablePagination />
    </DataTableRoot>
  );
}

function PersistDemo() {
  const { load, save } = useTableStatePersistence("data-table-demo", {
    version: 1,
  });

  const [density, setDensity] = React.useState<
    "compact" | "default" | "comfortable"
  >(() => load()?.density ?? "default");

  const handleDensityChange = (next: "compact" | "default" | "comfortable") => {
    setDensity(next);
    save({ density: next });
  };

  return (
    <div>
      <div className="flex items-center gap-3 pb-2">
        <DataTableDensityToggle
          value={density}
          onValueChange={handleDensityChange}
        />
        <span className="text-xs text-muted-foreground">
          Change density or hide a column, then reload — the view is restored
          from localStorage (key: kira-table:data-table-demo).
        </span>
      </div>
      <DataTableRoot
        columns={facetedColumns}
        data={data}
        density={density}
        persistStateKey="data-table-demo"
      >
        <DataTableContent />
        <DataTablePagination />
      </DataTableRoot>
    </div>
  );
}

function StickyBulkDemo() {
  return (
    <DataTableRoot columns={selectionColumns} data={data} enableRowSelection>
      <DataTableBulkActions sticky>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => console.log("Delete selected")}
        >
          <IconTrash className="h-4 w-4" /> Delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Export")}
        >
          <IconDownload className="h-4 w-4" /> Export
        </Button>
      </DataTableBulkActions>
      <DataTableContent />
      <DataTablePagination />
    </DataTableRoot>
  );
}

// 500 rows: realistic bulk data for the virtualization demo.
const bigData: User[] = Array.from({ length: 500 }, (_, i) => {
  const base = data[i % data.length];

  return {
    ...base,
    id: `u${i + 1}`,
    email: `${base.name.split(" ")[0].toLowerCase()}.${i + 1}@example.com`,
  };
});

function VirtualDemo() {
  return (
    <DataTableRoot
      columns={rendererColumns}
      data={bigData}
      enableVirtualization
      estimateRowHeight={45}
      containerHeight={400}
      enableKeyboardNavigation
    >
      <DataTableContent />
    </DataTableRoot>
  );
}

const virtualCode = `const bigData = Array.from({ length: 500 }, (_, i) => ({
  ...baseData[i % baseData.length],
  id: \`u\${i + 1}\`,
}))

<DataTableRoot
  columns={columns}
  data={bigData}
  enableVirtualization
  estimateRowHeight={45}
  containerHeight={400}
>
  <DataTableContent />
</DataTableRoot>
// Only the visible window (+10 overscan) is mounted; sticky header and
// grid keyboard navigation work in virtualized mode (arrows scroll).
// Pair with onLoadMore / hasNextPage / isLoading for infinite loading.`;

function ServerPaginationDemo() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rows, setRows] = React.useState<User[]>(() => bigData.slice(0, 10));
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const start = pagination.pageIndex * pagination.pageSize;

      setRows(bigData.slice(start, start + pagination.pageSize));
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pagination]);

  const handlePageChange = (pageIndex: number) => {
    setLoading(true);
    setPagination((prev) => ({ ...prev, pageIndex }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setLoading(true);
    setPagination((prev) => ({ ...prev, pageSize }));
  };

  return (
    <DataTableRoot
      columns={rendererColumns}
      data={rows}
      isLoading={loading}
      serverPagination={{
        state: pagination,
        rowCount: bigData.length,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      }}
    >
      <DataTableContent />
      <DataTablePagination showPageSize showPageInfo />
    </DataTableRoot>
  );
}

const serverPaginationCode = `const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
const [rows, setRows] = React.useState<User[]>([])
const [loading, setLoading] = React.useState(false)

// Fetch the current page from your API whenever pagination changes.
React.useEffect(() => {
  setLoading(true)
  fetchUsers(pagination).then((page) => {
    setRows(page.rows)
    setLoading(false)
  })
}, [pagination])

<DataTableRoot
  columns={columns}
  data={rows}
  isLoading={loading}
  serverPagination={{
    state: pagination,
    rowCount: totalFromServer, // total matching rows, not rows.length
    onPageChange: (pageIndex) => setPagination((p) => ({ ...p, pageIndex })),
    onPageSizeChange: (pageSize) => setPagination((p) => ({ ...p, pageSize })),
  }}
>
  <DataTableContent />
  <DataTablePagination showPageSize showPageInfo />
</DataTableRoot>
// Changing the page size resets to page 1 and fires both callbacks in one
// atomic update. If the server total shrinks below the current page, the
// table clamps pageIndex and notifies onPageChange (skipped while loading).`;

const resizeCode = `const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: "email",
    size: 320,        // initial width
    minSize: 160,     // clamp for keyboard resize
    maxSize: 600,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
]

<DataTableRoot
  columns={columns}
  data={data}
  enableColumnResizing
>
  <DataTableContent />
</DataTableRoot>
// Handles are automatic: role="separator" with aria-valuenow/min/max.
// Keys: ArrowLeft/Right ±5px · Home/End min/max · double-click resets.`;

const facetedCode = `const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: "status",
    filterFn: "arrIncludesSome", // multi-select ORs the values
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
]

function StatusFilter() {
  const { table } = useDataTable<User>()
  return (
    <DataTableFacetedFilter
      column={table.getColumn("status")}
      title="Status"
      options={[
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
      ]}
    />
  )
}

<DataTableRoot columns={columns} data={data}>
  <StatusFilter />
  <DataTableContent />
</DataTableRoot>`;

const keyboardNavCode = `<DataTableRoot
  columns={columns}
  data={data}
  enableRowSelection
  enableKeyboardNavigation
>
  <DataTableContent />
</DataTableRoot>
// Tab enters the grid on the first cell (roving tabindex).
// Arrows move focus · Home/End = row bounds · Ctrl+Home/End = corners.
// Checkboxes/buttons inside cells keep their native keys.
// Virtualized mode: arrows scroll the viewport instead.`;

const persistCode = `// Option A — whole-table persistence on DataTableRoot:
<DataTableRoot
  columns={columns}
  data={data}
  persistStateKey="inbox" // localStorage: kira-table:inbox
>
  <DataTableContent />
</DataTableRoot>
// Persists density, column visibility/sizing/order and sorting.

// Option B — manual hook (e.g. for a density toggle outside the root):
const { load, save } = useTableStatePersistence("inbox", { version: 1 })
const [density, setDensity] = useState(load()?.density ?? "default")
const change = (next) => { setDensity(next); save({ density: next }) }`;

const stickyBulkCode = `<DataTableRoot columns={columns} data={data} enableRowSelection>
  <DataTableBulkActions sticky>
    <Button variant="destructive" size="sm">
      <IconTrash className="h-4 w-4" /> Delete
    </Button>
  </DataTableBulkActions>
  <DataTableContent />
  <DataTablePagination />
</DataTableRoot>
// sticky floats the bar above content while a long table scrolls.
// Enter/exit is a 200ms translate+fade; disabled under prefers-reduced-motion.`;

const cellRenderersCode = `const rendererColumns: ColumnDef<User, unknown>[] = [
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

const selectionCode = `const selectionColumns: ColumnDef<User, unknown>[] = [
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

export default function DataTablePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Data Table"
        description="A powerful, modular table with sorting, filtering, pagination, and more using TanStack Table. Includes cell renderers, bulk actions, density controls, and comprehensive accessibility features."
        version="3.0.0"
      />

      <FeatureGrid features={dataTablePageFeatureGridFeatures} />

      <DataTableDemos />

      <DataTableControlsSection5 />

      <APIReference
        sections={dataTablePageAPIReferenceSections}
        description="Complete API reference for all DataTable components"
      />

      <KeyboardShortcuts
        title="Keyboard Navigation"
        description="Spreadsheet-grade grid flow when enableKeyboardNavigation is set (non-virtualized mode)."
        shortcuts={dataTablePageKeyboardShortcutsShortcuts}
      />

      <Changelog entries={dataTablePageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const dataTablePageFeatureGridFeatures = [
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
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const dataTablePageAPIReferenceSections = [
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
        description:
          "Enable APG grid keyboard flow: roving-tabindex cells, arrows, Home/End row bounds, Ctrl+Home/End corners. Virtualized mode: arrows scroll.",
      },
      {
        prop: "persistStateKey",
        type: "string",
        default: "-",
        description:
          "Persist density, column visibility/sizing/order and sorting under localStorage key kira-table:<key>. Selection and filters are not persisted.",
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
        prop: "serverPagination",
        type: "{ state: PaginationState; rowCount: number; onPageChange; onPageSizeChange? }",
        default: "-",
        description:
          "Controlled server-side pagination. rowCount is the server total; data holds only the current page. Size changes reset to page 1 and fire both callbacks atomically.",
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
        prop: "showPreviousNextText",
        type: "boolean",
        default: "true",
        description: "Show Previous/Next text labels beside the arrows",
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
        prop: "sticky",
        type: "boolean",
        default: "false",
        description:
          "Float the bar above scrolled content (sticky bottom-4, z-30) with a 200ms translate+fade enter/exit.",
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
    title: "DataTableFacetedFilter",
    props: [
      {
        prop: "column",
        type: "Column<T, V>",
        default: "-",
        description:
          "TanStack column to filter on; get the live instance via useDataTable().table.getColumn(id). Pass the column def filterFn: 'arrIncludesSome' for multi-select.",
      },
      {
        prop: "title",
        type: "string",
        default: "-",
        description: "Trigger button label",
      },
      {
        prop: "options",
        type: "{ label: string; value: string; icon?: ComponentType }[]",
        default: "-",
        description: "Facet options; counts come from getFacetedUniqueValues.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional classes for the trigger button",
      },
    ],
  },
  {
    title: "DataTableResizeHandle (rendered by DataTableContent)",
    props: [
      {
        prop: "role / aria",
        type: "separator (window splitter)",
        default: "-",
        description:
          "aria-orientation=vertical, aria-valuenow/min/max in pixels, aria-valuetext announced on change.",
      },
      {
        prop: "keyboard",
        type: "-",
        default: "-",
        description:
          "ArrowLeft/ArrowRight ±5px, Home/End min/max, double-click resets. Drag via pointer.",
      },
    ],
  },
  {
    title: "useTableStatePersistence",
    props: [
      {
        prop: "key",
        type: "string",
        default: "-",
        description: "Storage key suffix; full key is kira-table:<key>.",
      },
      {
        prop: "opts.version",
        type: "number",
        default: "1",
        description:
          "Bump to invalidate saved views after a state-shape change.",
      },
      {
        prop: "returns",
        type: "{ load(): PersistedTableState | null; save(partial): void }",
        default: "-",
        description:
          "load for lazy state init; save merges a partial (all writes try/catch guarded).",
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
  {
    title: "Other exports",
    props: [
      {
        prop: "facetedFilterFn / dateRangeFilterFn",
        type: "FilterFn",
        default: "-",
        description:
          "Column-def filterFns: facetedFilterFn matches a selected string array (pair with DataTableFacetedFilter); dateRangeFilterFn matches [from?, to?] as yyyy-mm-dd inclusive.",
      },
      {
        prop: "dataTableFeatures",
        type: "TableFeatures",
        default: "-",
        description:
          "The feature preset DataTableRoot builds on (v9 tableFeatures + all row models). Narrow it in your own root if bundle size matters.",
      },
      {
        prop: "createSelectColumn / createExpandColumn / createDragHandleColumn",
        type: "() => DTColumnDef<T>",
        default: "-",
        description:
          "Column factories: checkbox select, expander chevron, and drag handle (enableReordering).",
      },
      {
        prop: "DataTableEditableCell",
        type: "Component",
        default: "-",
        description:
          "Cell that swaps to an input/select on Enter, F2 or double-click; Escape reverts, blur/Enter commits.",
      },
      {
        prop: "DataTableColumnVisibility / DataTablePinningControls / DataTableRowActions / DataTableSearch / DataTablePageCount / DataTableRowCount",
        type: "Component",
        default: "-",
        description:
          "Toolbar/status parts sharing the root's table via context.",
      },
      {
        prop: "NumberRangeFilter / MultiSelectFilter / DateRangeFilter",
        type: "Component",
        default: "-",
        description:
          "Standalone filter controls (pair with the matching built-in filterFns).",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const dataTablePageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab",
    description:
      "Enter the grid on the first cell; Shift+Tab returns to the toolbar",
  },
  {
    keys: "Arrow keys",
    description: "Move cell focus Up / Down / Left / Right",
  },
  {
    keys: "Home / End",
    description: "Jump to the first / last cell of the current row",
  },
  {
    keys: "Ctrl+Home / Ctrl+End",
    description: "Jump to the first / last cell of the table",
  },
  {
    keys: "Enter / Space",
    description:
      "Expand / collapse an expandable row from its first cell (matches expandOnRowClick)",
  },
  {
    keys: "ArrowLeft / ArrowRight",
    description: "On a focused resize handle: shrink / grow column by 5px",
  },
  {
    keys: "Home / End",
    description: "On a focused resize handle: set column to min / max size",
  },
  {
    keys: "Double-click",
    description: "Resize handle resets the column to its default size",
  },
  {
    keys: "Arrow keys (virtualized)",
    description:
      "Virtualized mode: arrows scroll the viewport instead of moving cell focus",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const dataTablePageChangelogEntries = [
  {
    version: "3.2.0",
    date: "19 November 2026",
    changes: [
      {
        type: "changed",
        title: "Pagination footer delegates to KiraPagination",
        description:
          "DataTablePagination now renders the shared KiraPagination component instead of a hand-rolled footer, so page buttons, ellipsis jump, size selector and screen-reader announcements match the standalone Pagination component.",
      },
      {
        type: "added",
        title: "Server-side pagination",
        description:
          "New serverPagination prop on DataTableRoot ({ state, rowCount, onPageChange, onPageSizeChange }) drives controlled manual pagination. Page-size changes reset to page 1 and fire both callbacks in one atomic update; a shrinking server total clamps the page index (skipped while loading). The footer also renders for virtualized tables when serverPagination is set.",
      },
      {
        type: "breaking",
        title: "BREAKING: locale prop removed from DataTablePagination",
        description:
          'The "en" | "id" locale option and its Indonesian strings are gone; the footer is English-only. Number formatting follows KiraPagination\'s en-US default.',
      },
      {
        type: "added",
        title: "showPreviousNextText prop",
        description:
          "Toggle the Previous/Next text labels beside the arrows (default true).",
      },
      {
        type: "fixed",
        title: "Accurate counts under server pagination",
        description:
          "Row-count and filter announcements use the server rowCount when provided instead of the client-side filtered row length.",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: "Pagination select follows the control ladder",
        description:
          "The native rows-per-page select moves from h-7/8/9 to h-8/9/10 for sm/default/lg, matching Button/Input/Select heights.",
      },
      {
        type: "changed",
        title: 'Filter popover inputs use size="sm"',
        description:
          "Faceted-search, number-range and date-range filter inputs drop hardcoded h-8 className overrides in favor of the Input size ladder (sm = h-8).",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "23 October 2026",
    changes: [
      {
        type: "changed",
        title: "BREAKING: TanStack Table v8 → v9",
        description:
          "Peer dependency @tanstack/react-table bumped to ^9.3.1. Tables are created via tableFeatures(stockFeatures) + useTable with explicit row models, and consumers re-render by subscribing to the store (useSelector from @tanstack/react-store) instead of relying on useReactTable re-renders.",
      },
      {
        type: "breaking",
        title: "BREAKING: getDensityStyles removed",
        description:
          "The export is gone; density now flows through DataTableRoot's density prop and the shared table.tsx density tokens (DENSITY_TO_TABLE). Replace getDensityStyles(...) calls with the density prop.",
      },
      {
        type: "added",
        title: "New exports",
        description:
          "facetedFilterFn, dateRangeFilterFn, dataTableFeatures, useTableStatePersistence and DataTableResizeHandle are now exported.",
      },
      {
        type: "fixed",
        title: "Virtualization no longer capped by pagination",
        description:
          "manualPagination is set when virtualized; previously the paginated row model silently capped rows at pageSize.",
      },
      {
        type: "fixed",
        title: "Virtualizer recovers when the container appears late",
        description:
          "Mounting inside a hidden container (inactive tab panel, collapsed accordion) pinned the virtualizer's viewport at 0x0; getScrollElement now re-reads the container rect on re-render and re-measures when it appears, so rows render without waiting for a ResizeObserver tick.",
      },
      {
        type: "fixed",
        title: "React Compiler opt-out documented",
        description:
          "\"use no memo\" at module top: TanStack Virtual's useVirtualizer is on the compiler's incompatible list and getters read instance state the compiler can't see.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "22 October 2026",
    changes: [
      {
        type: "added",
        title: "Column resize handles",
        description:
          "Draggable + keyboard-operable window-splitter handles (aria role=separator with valuenow/min/max) on resizable columns; double-click resets size.",
      },
      {
        type: "added",
        title: "Faceted filters",
        description:
          "DataTableFacetedFilter popover with per-option counts via getFacetedUniqueValues; multi-select with active-count badge and clear action.",
      },
      {
        type: "added",
        title: "Grid keyboard navigation",
        description:
          "WAI-ARIA APG roving-tabindex cell navigation: arrows, Home/End row bounds, Ctrl+Home/End table corners; interactive cells keep native keys.",
      },
      {
        type: "added",
        title: "Saved table view state",
        description:
          "useTableStatePersistence hook + persistStateKey prop restore density, column visibility/sizing/order and sorting after reload. Selection and filters are deliberately not persisted.",
      },
      {
        type: "added",
        title: "Sticky bulk-action bar",
        description:
          "DataTableBulkActions sticky prop floats the bar above scrolled content with a 200ms translate+fade entrance gated by reduced motion.",
      },
      {
        type: "fixed",
        title: "aria-sort on sortable headers",
        description:
          "DataTable column headers now expose ascending/descending via aria-sort (semantic Table already had it).",
      },
      {
        type: "fixed",
        title: "Pinned cells transparent on scroll",
        description:
          "Pinned cell/header backgrounds used hsl(var(--background)) against oklch tokens — invalid CSS left pinned cells see-through. Now var(--background).",
      },
      {
        type: "fixed",
        title: "Deterministic skeleton widths",
        description:
          "DataTableSkeleton no longer calls Math.random() during render; widths are position-derived and stable across re-renders.",
      },
      {
        type: "fixed",
        title: "Skeleton animation unified",
        description:
          "DataTableSkeleton now uses the shared animate-skeleton-wave keyframe instead of animate-pulse.",
      },
      {
        type: "fixed",
        title: "Column visibility labels humanized",
        description:
          "DataTableColumnVisibility renders camelCase/snake_case ids as human labels with aria-label on each checkbox.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function DataTableControlsSection({
  densityCode,
  density,
  setDensity,
}: {
  densityCode: 'const [density, setDensity] = React.useState<"compact" | "default" | "comfortable">("default");\n\n<DataTableDensityToggle\n  value={density}\n  onValueChange={setDensity}\n/>\n\n<DataTableRoot\n  columns={rendererColumns}\n  data={data}\n  density={density}\n>\n  <DataTableContent />\n  <DataTablePagination />\n</DataTableRoot>';
  density: "default" | "compact" | "comfortable";
  setDensity: React.Dispatch<
    React.SetStateAction<"default" | "compact" | "comfortable">
  >;
}) {
  return (
    <DemoWrapper
      title="Row Density Control"
      description="Switch between compact, default, and comfortable row spacing to optimize for your content."
      code={densityCode}
    >
      <div className="flex items-center gap-4 mb-4">
        <DataTableDensityToggle value={density} onValueChange={setDensity} />
        <span className="text-sm text-muted-foreground">
          Current: {density}
        </span>
      </div>
      <DataTableRoot columns={rendererColumns} data={data} density={density}>
        <DataTableContent />
        <DataTablePagination />
      </DataTableRoot>
    </DemoWrapper>
  );
}

function DataTableControlsSection2({
  selectionCode,
}: {
  selectionCode: 'const selectionColumns: ColumnDef<User, unknown>[] = [\n  createSelectColumn<User>(),\n  ...rendererColumns,\n];\n\n<DataTableRoot\n  columns={selectionColumns}\n  data={data}\n  enableRowSelection\n>\n  <DataTableContent />\n  <div className="flex items-center justify-between">\n    <DataTableBulkActions>\n      <Button variant="destructive" size="sm">\n        Delete Selected\n      </Button>\n      <Button variant="outline" size="sm">\n        Export Selected\n      </Button>\n    </DataTableBulkActions>\n    <DataTablePagination />\n  </div>\n</DataTableRoot>';
}) {
  return (
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
  );
}

function DataTableLoadingStateSection({
  statesCode,
  setShowSkeleton,
  showSkeleton,
  setShowEmpty,
  showEmpty,
}: {
  statesCode: 'const [showSkeleton, setShowSkeleton] = React.useState(false);\nconst [showEmpty, setShowEmpty] = React.useState(false);\n\n{showSkeleton ? (\n  <DataTableSkeleton rows={5} columns={5} showHeader />\n) : (\n  <DataTableRoot columns={rendererColumns} data={data}>\n    <DataTableContent />\n  </DataTableRoot>\n)}\n\n<DataTableRoot columns={rendererColumns} data={showEmpty ? [] : data}>\n  {showEmpty ? (\n    <DataTableEmptyState\n      title="No users found"\n      description="Try adjusting your search or filters"\n      action={<Button>Add New User</Button>}\n    />\n  ) : (\n    <DataTableContent />\n  )}\n</DataTableRoot>';
  setShowSkeleton: React.Dispatch<React.SetStateAction<boolean>>;
  showSkeleton: boolean;
  setShowEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  showEmpty: boolean;
}) {
  return (
    <DemoWrapper
      title="Loading & Empty States"
      description="Show skeleton loaders while data is fetching and friendly empty states when no data is available."
      code={statesCode}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Loading State</p>
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
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Empty State</p>
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
        </div>
      </div>
    </DemoWrapper>
  );
}

function DataTableControlsSection4({
  exportCode,
}: {
  exportCode: 'import { exportToCSV, exportToJSON } from "@/lib/data-table-helpers";\n\n<Button onClick={() => exportToCSV(data, ["name", "email", "status"], "users.csv")}>\n  Export CSV\n</Button>\n\n<Button onClick={() => exportToJSON(data, "users.json")}>\n  Export JSON\n</Button>';
}) {
  return (
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
  );
}

function DataTableControlsSection5() {
  return (
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
import type { DTColumnDef as ColumnDef } from "@/components/ui/data-table"

const columns: ColumnDef<User, unknown>[] = [
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
  );
}

const dataTableCellRenderersTab = {
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
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableSelectionTab = {
  value: "selection",
  label: "Selection",
  demo: (
    <>
      <DataTableControlsSection2 selectionCode={selectionCode} />
    </>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableExportTab = {
  value: "export",
  label: "Export",
  demo: (
    <>
      <DataTableControlsSection4 exportCode={exportCode} />
    </>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableVirtualizationTab = {
  value: "virtualization",
  label: "Virtualization",
  demo: (
    <DemoWrapper
      title="Virtual Scrolling"
      description="500 rows with only the visible window (+10 overscan) mounted. Sticky header included; grid keyboard navigation switches to viewport scrolling in this mode. Pair with onLoadMore/hasNextPage for infinite loading."
      code={virtualCode}
    >
      <VirtualDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableServerPaginationTab = {
  value: "server-pagination",
  label: "Server Pagination",
  demo: (
    <DemoWrapper
      title="Server-side Pagination"
      description="The table holds only the current page; rowCount is the server total. Changing page size resets to page 1 and fires both callbacks atomically. A simulated 400ms fetch shows the loading state."
      code={serverPaginationCode}
    >
      <ServerPaginationDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableResizingTab = {
  value: "resizing",
  label: "Resizing",
  demo: (
    <DemoWrapper
      title="Column Resizing"
      description="Drag the handle at a column's right edge, or focus it and use ArrowLeft/ArrowRight (±5px), Home/End (min/max). Double-click resets to the default size."
      code={resizeCode}
    >
      <ResizeDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableFacetedTab = {
  value: "faceted",
  label: "Faceted Filters",
  demo: (
    <DemoWrapper
      title="Faceted Filters"
      description='DataTableFacetedFilter shows per-option counts from getFacetedUniqueValues. The column def sets filterFn: "arrIncludesSome" so multiple selections OR together.'
      code={facetedCode}
    >
      <FacetedFilterDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableKeyboardNavTab = {
  value: "keyboard-nav",
  label: "Keyboard Nav",
  demo: (
    <DemoWrapper
      title="Grid Keyboard Navigation"
      description="WAI-ARIA APG roving tabindex: Tab enters the first cell, arrows move focus, Home/End hit row bounds, Ctrl+Home/End jump to table corners. Interactive cells keep their native keys."
      code={keyboardNavCode}
    >
      <KeyboardNavDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTablePersistenceTab = {
  value: "persistence",
  label: "Persistence",
  demo: (
    <DemoWrapper
      title="Saved Table View"
      description="persistStateKey stores density, column visibility, sizing, order and sorting in localStorage. Selection and filters are deliberately not persisted."
      code={persistCode}
    >
      <PersistDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

const dataTableStickyBulkTab = {
  value: "sticky-bulk",
  label: "Sticky Bulk Bar",
  demo: (
    <DemoWrapper
      title="Sticky Bulk Actions"
      description="With the sticky prop the bulk-action bar floats above content while you scroll a long selection; deselect and it slides out (200ms translate+fade, reduced-motion aware)."
      code={stickyBulkCode}
    >
      <StickyBulkDemo />
    </DemoWrapper>
  ),
} satisfies React.ComponentProps<typeof DemoTabs>["tabs"][number];

function DataTableDemos() {
  const [showSkeleton, setShowSkeleton] = React.useState(false);
  const [showEmpty, setShowEmpty] = React.useState(false);

  const [density, setDensity] = React.useState<
    "compact" | "default" | "comfortable"
  >("default");

  return (
    <DemoTabs
      defaultValue="cell-renderers"
      tabs={[
        dataTableCellRenderersTab,
        {
          value: "density",
          label: "Density",
          demo: (
            <>
              <DataTableControlsSection
                densityCode={densityCode}
                density={density}
                setDensity={setDensity}
              />
            </>
          ),
        },
        dataTableSelectionTab,
        {
          value: "states",
          label: "States",
          demo: (
            <>
              <DataTableLoadingStateSection
                statesCode={statesCode}
                setShowSkeleton={setShowSkeleton}
                showSkeleton={showSkeleton}
                setShowEmpty={setShowEmpty}
                showEmpty={showEmpty}
              />
            </>
          ),
        },
        dataTableExportTab,
        dataTableVirtualizationTab,
        dataTableServerPaginationTab,
        dataTableResizingTab,
        dataTableFacetedTab,
        dataTableKeyboardNavTab,
        dataTablePersistenceTab,
        dataTableStickyBulkTab,
      ]}
    />
  );
}
