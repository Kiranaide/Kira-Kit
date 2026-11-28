import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconTrash,
  IconDownload,
  IconFileExport,
  IconLayoutGrid,
  IconSearch,
  IconFileText,
} from "@tabler/icons-react";
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
  KiraDataTable,
  useDataTable,
  useDataTableFilters,
  useTableStatePersistence,
  createSelectColumn,
  StatusCell,
  DateCell,
  CurrencyCell,
  AvatarCell,
  ActionsCell,
  type DataTableFilterField,
  type DataTablePreset,
  type DTColumnDef as ColumnDef,
} from "@/components/ui/data-table";
import type { SortingState } from "@tanstack/react-table";
import { exportToCSV, exportToJSON } from "@/lib/data-table-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
          <IconTrash aria-hidden="true" className="h-4 w-4" /> Delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Export")}
        >
          <IconDownload aria-hidden="true" className="h-4 w-4" /> Export
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
        description="A powerful, modular table with sorting, filtering, pagination, card view, and preset layouts using TanStack Table. Includes KiraDataTable presets, cell renderers, bulk actions, density controls, KiraEmpty states, and full keyboard accessibility."
        version="v3.4.0"
      />

      <FeatureGrid features={dataTablePageFeatureGridFeatures} />

      <DemoTabs defaultValue="kira-presets" tabs={dataTablePageDemoTabs} />

      <KeyboardShortcuts
        title="Keyboard shortcuts"
        description="Spreadsheet-grade grid flow when enableKeyboardNavigation is set (non-virtualized mode)."
        shortcuts={dataTablePageKeyboardShortcutsShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation with cell renderers, bulk actions, and pagination."
        notes={dataTablePageUsageNotes}
      />

      <APIReference
        sections={dataTablePageAPIReferenceSections}
        description="Complete API reference for all DataTable components"
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
    icon: <IconLayoutGrid aria-hidden="true" className="h-5 w-5" />,
  },
  {
    title: "Rich Interactions",
    description:
      "Three-way sorting, column pinning, row selection, density controls, and virtual scrolling for large datasets.",
    icon: <IconSearch aria-hidden="true" className="h-5 w-5" />,
  },
  {
    title: "Accessibility First",
    description:
      "Full keyboard navigation, ARIA announcements, screen reader support, and focus management included by default.",
    icon: <IconFileText aria-hidden="true" className="h-5 w-5" />,
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
        type: "ReactNode | ((ctx: DataTableEmptyContext) => ReactNode)",
        default: "KiraEmpty (no-data / no-results / error)",
        description:
          "Custom empty state node or render callback. Defaults to KiraEmpty with contextual no-data, no-results (with Reset), and error (with Retry) states.",
      },
      {
        prop: "view",
        type: '"table" | "cards"',
        default: '"table"',
        description:
          "Render semantic <table> rows or an accessible role=list card layout with a Sort by selector.",
      },
      {
        prop: "renderCard",
        type: "(row: DTRow<T>) => ReactNode",
        default: "-",
        description:
          "Custom card body when view='cards'. Falls back to rendering visible cells in a responsive 2-column mobile grid.",
      },
    ],
  },
  {
    title: "KiraDataTable",
    props: [
      {
        prop: "preset",
        type: '"toolbar" | "sidebar" | "cards"',
        default: '"toolbar"',
        description:
          "Controls the filter and results layout: bordered toolbar, sticky collapsible sidebar, or stacked filter card with active filter tags and pill pagination.",
      },
      {
        prop: "view",
        type: '"table" | "cards"',
        default: '"cards" for the cards preset, "table" otherwise',
        description:
          "Overrides how results render. Use table to share the same columns and row controls across presets.",
      },
      {
        prop: "title / hint / totalCount",
        type: "ReactNode / ReactNode / number",
        default: "- / - / server rowCount or data.length",
        description: "Header title with tabular result count and muted hint.",
      },
      {
        prop: "filters / filterState",
        type: "DataTableFilterField[] / UseDataTableFiltersReturn",
        default: "-",
        description:
          "Declarative search/select/chips/date-range fields paired with useDataTableFilters (draft vs applied, live debounce, reset).",
      },
      {
        prop: "filterMode",
        type: '"manual" | "live"',
        default: '"live" for sidebar, "manual" otherwise',
        description:
          "Deferred Search/Enter commit or 250ms debounced live filtering.",
      },
      {
        prop: "showActiveFilters / enableSlashShortcut",
        type: "boolean / boolean",
        default: "cards: true / sidebar: true",
        description:
          "Toggle removable active-filter pills and '/' search focus shortcut.",
      },
      {
        prop: "pagination",
        type: "DataTablePaginationProps | false",
        default: "6/12/24 page sizes + range info",
        description:
          "Footer pagination configuration or false to hide the footer.",
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
        prop: "showJump",
        type: "boolean",
        default: "false",
        description:
          "Show an inline page-jump number input (Page [input] of N)",
      },
      {
        prop: "infoFormat",
        type: "string",
        default: '"Showing {start}–{end} of {total}"',
        description: "Format string for the item range indicator",
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
        default: "false",
        description: "Show Previous/Next text labels beside the arrows",
      },
      {
        prop: "variant",
        type: "default | outline | ghost | pills | rounded",
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
        default: "2",
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
    title: "DataTableColumnHeader",
    props: [
      {
        prop: "column",
        type: "DTColumn<TData, TValue>",
        default: "-",
        description: "TanStack column instance from header render context.",
      },
      {
        prop: "title",
        type: "string",
        default: "-",
        description: "Visible column heading label.",
      },
      {
        prop: "showPinning",
        type: "boolean",
        default: "false",
        description: "Show the pin-left / pin-right / unpin dropdown menu.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the header wrapper.",
      },
    ],
  },
  {
    title: "DataTableSearch",
    props: [
      {
        prop: "columnKey",
        type: "string",
        default: "-",
        description: "Column id to filter when globalSearch is false.",
      },
      {
        prop: "placeholder",
        type: "string",
        default: '"Search..."',
        description: "Input placeholder and accessible label.",
      },
      {
        prop: "globalSearch",
        type: "boolean",
        default: "false",
        description: "Bind to table globalFilter instead of a single column.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the search input.",
      },
    ],
  },
  {
    title: "DataTablePageCount",
    props: [
      {
        prop: "(context)",
        type: "Reads DataTableRoot context",
        default: "-",
        description:
          "Renders 'Page X of Y' synced to the root table's pagination state.",
      },
    ],
  },
  {
    title: "DataTableRowCount",
    props: [
      {
        prop: "(context)",
        type: "Reads DataTableRoot context",
        default: "-",
        description:
          "Renders total row count or 'X of Y row(s) selected' using server rowCount when set.",
      },
    ],
  },
  {
    title: "DataTableColumnVisibility",
    props: [
      {
        prop: "(context)",
        type: "Reads DataTableRoot context",
        default: "-",
        description:
          "Renders toggle checkboxes for all hideable columns with humanized labels.",
      },
    ],
  },
  {
    title: "DataTablePinningControls",
    props: [
      {
        prop: "(context)",
        type: "Reads DataTableRoot context",
        default: "-",
        description:
          "Displays active left/right pinned column counts when any column is pinned.",
      },
    ],
  },
  {
    title: "DataTableEditableCell",
    props: [
      {
        prop: "value",
        type: "string | number",
        default: "-",
        description: "Current cell value.",
      },
      {
        prop: "onSave",
        type: "(value: string | number) => void",
        default: "-",
        description: "Called on Enter or blur when the value changes.",
      },
      {
        prop: "type",
        type: '"text" | "number" | "select"',
        default: '"text"',
        description: "Inline editor control type.",
      },
      {
        prop: "options",
        type: "{ value: string; label: string }[]",
        default: "-",
        description: 'Options list when type="select".',
      },
      {
        prop: "label",
        type: "string",
        default: '"Edit value"',
        description: "Accessible name for the inline edit control.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the cell or editor.",
      },
    ],
  },
  {
    title: "DataTableRowActions",
    props: [
      {
        prop: "row",
        type: "TData",
        default: "-",
        description: "Row data object passed to each action's onClick handler.",
      },
      {
        prop: "actions",
        type: "RowAction<TData>[]",
        default: "-",
        description: "Menu items with label, icon, variant, and onClick.",
      },
      {
        prop: "label",
        type: "string",
        default: '"Row actions"',
        description: "Accessible name for the trigger button.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the trigger button.",
      },
    ],
  },
  {
    title: "NumberRangeFilter",
    props: [
      {
        prop: "columnId",
        type: "string",
        default: "-",
        description:
          'Column id to filter (pair with filterFn: "inNumberRange").',
      },
      {
        prop: "minPlaceholder",
        type: "string",
        default: '"Min"',
        description: "Placeholder for the lower bound input.",
      },
      {
        prop: "maxPlaceholder",
        type: "string",
        default: '"Max"',
        description: "Placeholder for the upper bound input.",
      },
      {
        prop: "step",
        type: "number",
        default: "1",
        description: "Step increment for the number inputs.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the filter group.",
      },
    ],
  },
  {
    title: "MultiSelectFilter",
    props: [
      {
        prop: "columnId",
        type: "string",
        default: "-",
        description: "Column id to filter (pair with facetedFilterFn).",
      },
      {
        prop: "options",
        type: "{ value: string; label: string }[]",
        default: "-",
        description: "Selectable filter options.",
      },
      {
        prop: "placeholder",
        type: "string",
        default: '"Select..."',
        description: "Trigger label when no options are selected.",
      },
      {
        prop: "searchable",
        type: "boolean",
        default: "true",
        description: "Show a search input inside the filter popover.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the trigger button.",
      },
    ],
  },
  {
    title: "DateRangeFilter",
    props: [
      {
        prop: "columnId",
        type: "string",
        default: "-",
        description: "Column id to filter (pair with dateRangeFilterFn).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the date range inputs.",
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
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const dataTablePageKeyboardShortcutsShortcuts = [
  {
    keys: "/",
    description:
      "Focus the search input when enableSlashShortcut is enabled (ignored inside editable fields and dialogs)",
  },
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
    version: "3.4.0",
    date: "28 November 2026",
    changes: [
      {
        type: "added",
        title: "Configurable results view for each preset",
        description:
          'Set view="table" to use the same sortable table across filter layouts. The presets demo shows all three layouts with a shared table and sticky header.',
      },
    ],
  },
  {
    version: "3.3.0",
    date: "28 November 2026",
    changes: [
      {
        type: "added",
        title: "Unified KiraDataTable presets and composable filter primitives",
        description:
          'Added KiraDataTable with preset="toolbar" | "sidebar" | "cards", useDataTableFilters (draft vs applied state + 250ms live debounce), DataTableFilterBar (search/select/chips/date-range, "/" focus shortcut, collapsible <= 820px sidebar), DataTableActiveFilters, and DataTableContent view="cards" with card skeletons and Sort by control.',
      },
      {
        type: "added",
        title: "KiraEmpty integration, refetching, and error states",
        description:
          "DataTableContent now defaults to KiraEmpty for no-data, filtered no-results (with Reset), and error (with Retry) states, supports isFetching (dimmed rows + top progress bar without layout shift), and forwards showJump, infoFormat, and pills variant on DataTablePagination.",
      },
      {
        type: "fixed",
        title: "Resizable column text overlap and fixed utility column handles",
        description:
          "Fixed text overflowing into neighboring columns under table-layout: fixed by clipping resizable cells with overflow-hidden text-ellipsis, and disabled resizing on createSelectColumn, createExpandColumn, and createDragHandleColumn so fixed-width utility columns no longer render stuck resize handles.",
      },
    ],
  },
  {
    version: "3.2.2",
    date: "27 November 2026",
    changes: [
      {
        type: "fixed",
        title:
          "Column visibility and labels use header titles instead of raw IDs",
        description:
          "columnLabel now resolves columnDef.meta.label, string headers, and titles registered by DataTableColumnHeader before falling back to a Title-Cased column ID—so the Columns popover, sort announcements, resize handles, pinning menus, and range filters display human-readable labels.",
      },
      {
        type: "fixed",
        title: "Zero dead space and spring dock motion for sticky bulk actions",
        description:
          "DataTableBulkActions with sticky now unmounts completely when 0 rows are selected and floats as a centered frosted bottom dock with spring-out transform/opacity enter/exit transitions, animated count pill, and inert/reduced-motion handling.",
      },
      {
        type: "fixed",
        title: "Single-line row/page counts beside DataTablePagination",
        description:
          "DataTableRowCount and DataTablePageCount now use shrink-0 whitespace-nowrap tabular-nums and accept className, while DataTablePagination defaults to w-auto flex-1 so composed footer rows never squeeze counts onto two lines.",
      },
    ],
  },
  {
    version: "3.2.1",
    date: "20 November 2026",
    changes: [
      {
        type: "changed",
        title: "Bulk-action count stays on one line",
        description:
          'The selected-count label is now whitespace-nowrap, so a narrow toolbar breaks around the buttons instead of splitting "7 selected" across two lines.',
      },
      {
        type: "changed",
        title: "Icon-only previous and next by default",
        description:
          "The pagination defaults set showPreviousNextText to false, so the footer shows chevrons rather than text that reflows the control row. Pass showPreviousNextText to get the labelled buttons back.",
      },
    ],
  },
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

function DensityDemo() {
  const [density, setDensity] = React.useState<
    "compact" | "default" | "comfortable"
  >("default");

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <DataTableDensityToggle value={density} onValueChange={setDensity} />
        <span className="text-sm text-muted-foreground">
          Current: {density}
        </span>
      </div>
      <DataTableRoot columns={rendererColumns} data={data} density={density}>
        <DataTableContent />
        <DataTablePagination />
      </DataTableRoot>
    </>
  );
}

function SelectionDemo() {
  return (
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
            <IconTrash aria-hidden="true" className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          <Button variant="outline" size="sm">
            <IconFileExport aria-hidden="true" className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
        </DataTableBulkActions>
        <DataTablePagination />
      </div>
    </DataTableRoot>
  );
}

function StatesDemo() {
  const [showSkeleton, setShowSkeleton] = React.useState(false);
  const [showEmpty, setShowEmpty] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Loading State</p>
        <div className="mb-4 flex gap-2">
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
        <p className="mb-2 text-sm text-muted-foreground">Empty State</p>
        <div className="mb-4 flex gap-2">
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
  );
}

function ExportDemo() {
  return (
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
        <IconDownload aria-hidden="true" className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToJSON(data, "users.json")}
      >
        <IconFileExport aria-hidden="true" className="mr-2 h-4 w-4" />
        Export JSON
      </Button>
    </div>
  );
}

type StressUser = {
  id: string;
  name: string;
  status: string;
  balance: number | null;
  createdAt: string | null;
  disabled?: boolean;
};

const stressData: StressUser[] = [
  {
    id: "s1",
    name: "Alexandria Bartholomew-Montgomery III (Principal Infrastructure Architect)",
    status: "active",
    balance: 9_876_543.21,
    createdAt: "2026-02-14",
  },
  {
    id: "s2",
    name: "",
    status: "pending",
    balance: null,
    createdAt: null,
  },
  {
    id: "s3",
    name: "Suspended Account (Row selection disabled)",
    status: "suspended",
    balance: -420.5,
    createdAt: "2025-11-01",
    disabled: true,
  },
];

const stressColumns: ColumnDef<StressUser, unknown>[] = [
  createSelectColumn<StressUser>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <AvatarCell name={row.original.name || "—"} showName={true} />
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => (
      <CurrencyCell value={row.original.balance} currency="USD" colorCode />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
];

function StressDemo() {
  return (
    <div className="max-w-xs">
      <DataTableRoot
        columns={stressColumns}
        data={stressData}
        density="compact"
        enableRowSelection={(row) => !row.original.disabled}
      >
        <DataTableContent />
        <DataTablePagination />
      </DataTableRoot>
    </div>
  );
}

const stressCode = `import {
  DataTableRoot,
  DataTableContent,
  DataTablePagination,
  createSelectColumn,
} from "@/components/ui/data-table"

// Long labels, null/empty values, and disabled row selection inside max-w-xs
<div className="max-w-xs">
  <DataTableRoot
    columns={stressColumns}
    data={stressData}
    density="compact"
    enableRowSelection={(row) => !row.original.disabled}
  >
    <DataTableContent />
    <DataTablePagination />
  </DataTableRoot>
</div>`;

const usageCode = `import {
  DataTableRoot,
  DataTableContent,
  DataTablePagination,
  DataTableBulkActions,
  DataTableColumnHeader,
  StatusCell,
  AvatarCell,
  type DTColumnDef as ColumnDef,
} from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"

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
</DataTableRoot>`;

const dataTablePageUsageNotes = [
  {
    label: "KiraDataTable Presets",
    body: 'Use KiraDataTable with preset="toolbar" | "sidebar" | "cards" to switch layouts from a single component, or compose DataTableFilterBar, DataTableActiveFilters, DataTableContent, and DataTablePagination inside DataTableRoot.',
  },
  {
    label: "TanStack Table v9",
    body: "Type your column definitions with DTColumnDef<TData, TValue> from @/components/ui/data-table so every v9 feature (pinning, resizing, faceting, grouping) stays typed.",
  },
  {
    label: "Cell Renderers",
    body: "Use StatusCell, DateCell, CurrencyCell, AvatarCell, and ActionsCell for consistent formatting, fallbacks, and accessible markup across tables.",
  },
  {
    label: "State Persistence",
    body: "Pass persistStateKey to DataTableRoot to persist density, sorting, visibility, sizing, order, and pinning in localStorage (selection and filters stay ephemeral).",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

type CatalogItem = {
  id: string;
  title: string;
  category: "Design System" | "Platform" | "DevOps" | "Content" | "Security";
  status: "active" | "draft" | "archived";
  owner: string;
  updatedAt: string;
};

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "c1",
    title: "Oxblood Atelier Design Tokens",
    category: "Design System",
    status: "active",
    owner: "Kazu Atelier",
    updatedAt: "2026-11-26",
  },
  {
    id: "c2",
    title: "Dual BFF Auth Proxy Adapter",
    category: "Platform",
    status: "active",
    owner: "Hana Sato",
    updatedAt: "2026-11-25",
  },
  {
    id: "c3",
    title: "Multi-Stage Coolify Runtime Config",
    category: "DevOps",
    status: "draft",
    owner: "Raka Pratama",
    updatedAt: "2026-11-26",
  },
  {
    id: "c4",
    title: "Legacy Marketing Redirect Map",
    category: "Content",
    status: "archived",
    owner: "Nadia Putri",
    updatedAt: "2026-11-18",
  },
  {
    id: "c5",
    title: "W3C Traceparent Propagation Middleware",
    category: "Platform",
    status: "active",
    owner: "Hana Sato",
    updatedAt: "2026-11-26",
  },
  {
    id: "c6",
    title: "AES-256-GCM Session Cookie Rotation",
    category: "Security",
    status: "active",
    owner: "Kazu Atelier",
    updatedAt: "2026-11-24",
  },
  {
    id: "c7",
    title: "Paraglide Locale Negotiation Matrix",
    category: "Content",
    status: "active",
    owner: "Nadia Putri",
    updatedAt: "2026-11-23",
  },
  {
    id: "c8",
    title: "Rolldown Vendor Chunk Budget Policy",
    category: "DevOps",
    status: "active",
    owner: "Raka Pratama",
    updatedAt: "2026-11-22",
  },
  {
    id: "c9",
    title: "Semantic Motion Curve Specification",
    category: "Design System",
    status: "draft",
    owner: "Kazu Atelier",
    updatedAt: "2026-11-21",
  },
  {
    id: "c10",
    title: "Edge Rate Limiter Token Bucket",
    category: "Security",
    status: "active",
    owner: "Hana Sato",
    updatedAt: "2026-11-20",
  },
  {
    id: "c11",
    title: "Zero-Downtime Postgres Migration Playbook",
    category: "DevOps",
    status: "active",
    owner: "Raka Pratama",
    updatedAt: "2026-11-19",
  },
  {
    id: "c12",
    title: "Deprecated V1 Onboarding Copy",
    category: "Content",
    status: "archived",
    owner: "Nadia Putri",
    updatedAt: "2026-11-15",
  },
];

type CatalogFilters = {
  search: string;
  status: string;
  category: string;
  owner: string;
};

const CATALOG_DEFAULT_FILTERS: CatalogFilters = {
  search: "",
  status: "",
  category: "",
  owner: "",
};

const CATALOG_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
] as const;

const CATALOG_CATEGORY_OPTIONS = [
  { value: "Design System", label: "Design System" },
  { value: "Platform", label: "Platform" },
  { value: "DevOps", label: "DevOps" },
  { value: "Content", label: "Content" },
  { value: "Security", label: "Security" },
] as const;

const CATALOG_OWNER_OPTIONS = [
  { value: "Kazu Atelier", label: "Kazu Atelier" },
  { value: "Hana Sato", label: "Hana Sato" },
  { value: "Raka Pratama", label: "Raka Pratama" },
  { value: "Nadia Putri", label: "Nadia Putri" },
] as const;

const CATALOG_STATUS_MAP = {
  active: "success",
  draft: "warning",
  archived: "default",
} as const;

function buildCatalogFilters(preset: DataTablePreset): DataTableFilterField[] {
  return [
    {
      kind: "search",
      key: "search",
      label: "Search",
      placeholder: "Search title or owner...",
    },
    {
      kind: preset === "sidebar" ? "chips" : "select",
      key: "status",
      label: "Status",
      options: CATALOG_STATUS_OPTIONS,
    },
    {
      kind: "select",
      key: "category",
      label: "Category",
      options: CATALOG_CATEGORY_OPTIONS,
    },
    {
      kind: "select",
      key: "owner",
      label: "Owner",
      options: CATALOG_OWNER_OPTIONS,
    },
  ];
}

const CATALOG_BASE_COLUMNS: ColumnDef<CatalogItem, unknown>[] = [
  createSelectColumn<CatalogItem>(),
  {
    accessorKey: "title",
    size: 240,
    minSize: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "category",
    size: 140,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
  },
  {
    accessorKey: "status",
    size: 120,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusCell
        value={row.original.status}
        statusMap={CATALOG_STATUS_MAP}
        dot
      />
    ),
  },
  {
    accessorKey: "owner",
    size: 160,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <AvatarCell name={row.original.owner} size="sm" showName />
    ),
  },
  {
    accessorKey: "updatedAt",
    size: 130,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => (
      <DateCell
        value={row.original.updatedAt}
        format={{ dateStyle: "medium" }}
      />
    ),
  },
];

function buildCatalogColumns(
  onDelete: (item: CatalogItem) => void,
): ColumnDef<CatalogItem, unknown>[] {
  return [
    ...CATALOG_BASE_COLUMNS,
    {
      id: "actions",
      size: 56,
      minSize: 56,
      maxSize: 56,
      enableSorting: false,
      enableResizing: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ActionsCell
            row={row.original}
            label={`Actions for ${row.original.title}`}
            onView={(item) => console.log("View:", item.title)}
            onEdit={(item) => console.log("Edit:", item.title)}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}

function readCatalogSortValue(item: CatalogItem, columnId: string): string {
  switch (columnId) {
    case "title":
      return item.title;
    case "category":
      return item.category;
    case "status":
      return item.status;
    case "owner":
      return item.owner;
    case "updatedAt":
      return item.updatedAt;
    default:
      return "";
  }
}

function filterAndSortCatalog(
  items: CatalogItem[],
  applied: CatalogFilters,
  sorting: SortingState,
): CatalogItem[] {
  const query = applied.search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (
      query &&
      !item.title.toLowerCase().includes(query) &&
      !item.owner.toLowerCase().includes(query)
    ) {
      return false;
    }

    if (applied.status && item.status !== applied.status) return false;

    if (applied.category && item.category !== applied.category) return false;

    if (applied.owner && item.owner !== applied.owner) return false;

    return true;
  });

  const activeSort = sorting[0];

  if (!activeSort) return filtered;

  return [...filtered].sort((a, b) => {
    const cmp = readCatalogSortValue(a, activeSort.id).localeCompare(
      readCatalogSortValue(b, activeSort.id),
    );

    return activeSort.desc ? -cmp : cmp;
  });
}

function PresetDemoControls({
  preset,
  onPresetChange,
  simulateError,
  onToggleError,
}: {
  preset: DataTablePreset;
  onPresetChange: (next: DataTablePreset) => void;
  simulateError: boolean;
  onToggleError: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Segmented preset switcher avoids fieldset styling.
        role="group"
        aria-label="Table layout preset"
        className="flex flex-wrap items-center gap-2"
      >
        {(["toolbar", "sidebar", "cards"] as const).map((next) => (
          <Button
            key={next}
            type="button"
            size="sm"
            variant={preset === next ? "default" : "outline"}
            aria-pressed={preset === next}
            onClick={() => onPresetChange(next)}
            className="capitalize"
          >
            {next}
          </Button>
        ))}
      </div>
      <Button type="button" size="sm" variant="outline" onClick={onToggleError}>
        {simulateError ? "Clear Error" : "Simulate Error"}
      </Button>
    </div>
  );
}

function KiraPresetsDemo() {
  const [preset, setPreset] = React.useState<DataTablePreset>("toolbar");
  const [items, setItems] = React.useState<CatalogItem[]>(CATALOG_ITEMS);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const [simulateError, setSimulateError] = React.useState(false);

  const filterState = useDataTableFilters<CatalogFilters>({
    defaultValues: CATALOG_DEFAULT_FILTERS,
    mode: preset === "sidebar" ? "live" : "manual",
    isSortModified: sorting.length > 0,
    onApply: () => setPagination((prev) => ({ ...prev, pageIndex: 0 })),
    onReset: () => {
      setSorting([]);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
  });

  const handleDelete = React.useCallback((item: CatalogItem) => {
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));
  }, []);

  const columns = React.useMemo(
    () => buildCatalogColumns(handleDelete),
    [handleDelete],
  );

  const fields = React.useMemo(() => buildCatalogFilters(preset), [preset]);

  const filtered = React.useMemo(
    () => filterAndSortCatalog(items, filterState.applied, sorting),
    [items, filterState.applied, sorting],
  );

  const pageRows = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;

    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  return (
    <div className="space-y-4">
      <PresetDemoControls
        preset={preset}
        onPresetChange={setPreset}
        simulateError={simulateError}
        onToggleError={() => setSimulateError((prev) => !prev)}
      />
      <KiraDataTable
        preset={preset}
        view="table"
        title="Items"
        hint="Use Search/Enter or switch presets"
        columns={columns}
        data={pageRows}
        getRowId={(row) => row.id}
        filters={fields}
        filterState={filterState}
        searchQuery={filterState.applied.search}
        sorting={sorting}
        onSortingChange={setSorting}
        manualSorting
        enableRowSelection
        enableColumnResizing
        enableColumnPinning
        initialColumnPinning={{ end: ["actions"] }}
        stickyHeader
        announceChanges
        error={simulateError ? "Failed to sync latest items." : undefined}
        onRetry={() => setSimulateError(false)}
        serverPagination={{
          state: pagination,
          rowCount: filtered.length,
          onPageChange: (pageIndex) =>
            setPagination((prev) => ({ ...prev, pageIndex })),
          onPageSizeChange: (pageSize) =>
            setPagination({ pageIndex: 0, pageSize }),
        }}
      />
    </div>
  );
}

const kiraPresetsCode = `import { KiraDataTable, useDataTableFilters } from "@/components/ui/data-table"

const filterState = useDataTableFilters({
  defaultValues: { search: "", status: "", category: "", owner: "" },
  mode: preset === "sidebar" ? "live" : "manual",
})

<KiraDataTable
  preset={preset} // "toolbar" | "sidebar" | "cards"
  view="table"
  title="Items"
  columns={columns}
  data={pageRows}
  filters={fields}
  filterState={filterState}
  enableColumnResizing
  enableColumnPinning
  initialColumnPinning={{ end: ["actions"] }}
  stickyHeader
  serverPagination={{ state: pagination, rowCount: total, onPageChange, onPageSizeChange }}
/>`;

const dataTablePageDemoTabs = [
  {
    value: "kira-presets",
    label: "KiraDataTable Presets",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Unified KiraDataTable (Toolbar, Sidebar, Cards)"
        description="Switch between Toolbar, Sidebar, and Cards filters while using the same sortable table with resizable columns and sticky Actions."
        code={kiraPresetsCode}
      >
        <KiraPresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "cell-renderers",
    label: "Cell Renderers",
    group: "Core",
    demo: (
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
    ),
  },
  {
    value: "density",
    label: "Density",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Row Density Control"
        description="Switch between compact, default, and comfortable row spacing to optimize for your content."
        code={densityCode}
      >
        <DensityDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "selection",
    label: "Selection",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Row Selection & Bulk Actions"
        description="Enable checkbox selection with createSelectColumn and perform bulk actions on selected rows."
        code={selectionCode}
      >
        <SelectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Loading & Empty States"
        description="Show skeleton loaders while data is fetching and friendly empty states when no data is available."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "export",
    label: "Export",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Export to CSV or JSON"
        description="Utility functions to export table data to CSV or JSON format for further processing."
        code={exportCode}
      >
        <ExportDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "virtualization",
    label: "Virtualization",
    group: "Data & Scale",
    demo: (
      <DemoWrapper
        title="Virtual Scrolling"
        description="500 rows with only the visible window (+10 overscan) mounted. Sticky header included; grid keyboard navigation switches to viewport scrolling in this mode. Pair with onLoadMore/hasNextPage for infinite loading."
        code={virtualCode}
      >
        <VirtualDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "server-pagination",
    label: "Server Pagination",
    group: "Data & Scale",
    demo: (
      <DemoWrapper
        title="Server-side Pagination"
        description="The table holds only the current page; rowCount is the server total. Changing page size resets to page 1 and fires both callbacks atomically. A simulated 400ms fetch shows the loading state."
        code={serverPaginationCode}
      >
        <ServerPaginationDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "faceted",
    label: "Faceted Filters",
    group: "Data & Scale",
    demo: (
      <DemoWrapper
        title="Faceted Filters"
        description='DataTableFacetedFilter shows per-option counts from getFacetedUniqueValues. The column def sets filterFn: "arrIncludesSome" so multiple selections OR together.'
        code={facetedCode}
      >
        <FacetedFilterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "resizing",
    label: "Resizing",
    group: "Data & Scale",
    demo: (
      <DemoWrapper
        title="Column Resizing"
        description="Drag the handle at a column's right edge, or focus it and use ArrowLeft/ArrowRight (±5px), Home/End (min/max). Double-click resets to the default size."
        code={resizeCode}
      >
        <ResizeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "keyboard-nav",
    label: "Keyboard Nav",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Grid Keyboard Navigation"
        description="WAI-ARIA APG roving tabindex: Tab enters the first cell, arrows move focus, Home/End hit row bounds, Ctrl+Home/End jump to table corners. Interactive cells keep their native keys."
        code={keyboardNavCode}
      >
        <KeyboardNavDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "persistence",
    label: "Persistence",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Saved Table View"
        description="persistStateKey stores density, column visibility, sizing, order and sorting in localStorage. Selection and filters are deliberately not persisted."
        code={persistCode}
      >
        <PersistDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sticky-bulk",
    label: "Sticky Bulk Bar",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Sticky Bulk Actions"
        description="With the sticky prop the bulk-action bar floats above content while you scroll a long selection; deselect and it slides out (200ms translate+fade, reduced-motion aware)."
        code={stickyBulkCode}
      >
        <StickyBulkDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long user labels, empty/null cell values, and disabled row selection inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];
