import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
  KiraTable,
  type KiraTableColumn,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
];

function BasicDemo() {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const basicCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Default</p>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 2).map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">With Caption</p>
        <div className="rounded-lg border border-border">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 2).map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">With Footer</p>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 2).map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">$400.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}

const variantsCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="text-right">$750.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`;

function StripedDemo() {
  return (
    <div className="rounded-lg border border-border">
      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const stripedCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

<Table striped>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

function HoverDemo() {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice} className="hover:bg-muted/50">
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const hoverCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/50">
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

function BorderlessDemo() {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader className="border-b-0">
          <TableRow>
            <TableHead className="border-b-0">Invoice</TableHead>
            <TableHead className="border-b-0">Status</TableHead>
            <TableHead className="border-b-0">Method</TableHead>
            <TableHead className="border-b-0 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.invoice}
              className="border-b-0 last:border-0"
            >
              <TableCell className="border-b-0 font-medium">
                {invoice.invoice}
              </TableCell>
              <TableCell className="border-b-0">
                {invoice.paymentStatus}
              </TableCell>
              <TableCell className="border-b-0">
                {invoice.paymentMethod}
              </TableCell>
              <TableCell className="border-b-0 text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const borderlessCode = `import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

<Table>
  <TableHeader className="border-b-0">
    <TableRow>
      <TableHead className="border-b-0">Invoice</TableHead>
      <TableHead className="border-b-0">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-b-0">
      <TableCell className="border-b-0">INV001</TableCell>
      <TableCell className="border-b-0">Paid</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

type Invoice = (typeof invoices)[number];

const kiraColumns: KiraTableColumn<Invoice>[] = [
  { key: "invoice", header: "Invoice", sortable: true, stickyColumn: true },
  { key: "paymentStatus", header: "Status", sortable: true },
  { key: "paymentMethod", header: "Method" },
  { key: "totalAmount", header: "Amount", sortable: true, align: "right" },
];

function KiraTableDemo() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <KiraTable
        label="Recent invoices"
        columns={kiraColumns}
        data={invoices}
        getRowId={(row) => row.invoice}
        caption="Sortable, selectable — click a header to sort."
        striped
        selectable
        onSelectionChange={setSelected}
        defaultSort={{ key: "invoice", dir: "asc" }}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {selected.length} row{selected.length === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}

const kiraCode = `import { KiraTable, type KiraTableColumn } from "@/components/ui/table"

const columns: KiraTableColumn<Invoice>[] = [
  { key: "invoice", header: "Invoice", sortable: true, stickyColumn: true },
  { key: "paymentStatus", header: "Status", sortable: true },
  { key: "totalAmount", header: "Amount", sortable: true, align: "right" },
]

<KiraTable
  label="Recent invoices"
  columns={columns}
  data={invoices}
  getRowId={(row) => row.invoice}
  striped
  selectable
  onSelectionChange={setSelected}
  defaultSort={{ key: "invoice", dir: "asc" }}
/>`;

function DensityDemo() {
  return (
    <div className="space-y-6">
      {(["comfortable", "compact", "dense"] as const).map((density) => (
        <div key={density}>
          <p className="text-sm font-medium mb-2 capitalize">{density}</p>
          <div className="rounded-lg border border-border">
            <Table density={density}>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.slice(0, 3).map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}

const densityCode = `<Table density="comfortable"> {/* 48px header rows */}
<Table density="compact">     {/* 40px */}
<Table density="dense">       {/* 32px — dashboards */}`;

function StatesDemo() {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setLoading((v) => !v)}>
          {loading ? "Show data" : "Show loading"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEmpty((v) => !v)}>
          {empty ? "Show data" : "Show empty"}
        </Button>
      </div>
      <KiraTable
        label="Invoice states"
        columns={kiraColumns}
        data={empty ? [] : invoices}
        getRowId={(row) => row.invoice}
        loading={loading}
        empty="No invoices yet — create your first one."
      />
    </div>
  );
}

const statesCode = `{/* Skeleton shimmer while fetching */}
<KiraTable columns={columns} data={data} loading={isLoading} />

{/* Centered empty state when data is [] */}
<KiraTable columns={columns} data={[]} empty="No invoices yet." />`;

export default function TablePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Table"
        description="A responsive, accessible table primitive with density, sticky header/columns, headless sort + selection, and the config-driven KiraTable."
        version="2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Responsive",
            description:
              "Built with overflow container for horizontal scrolling on smaller screens, ensuring data remains accessible.",
          },
          {
            title: "Accessible",
            description:
              "Proper HTML table semantics with scope attributes, ARIA support for grid role tables, and keyboard navigation.",
          },
          {
            title: "Customizable",
            description:
              "Support for striped rows, bordered cells, row selection states, and virtualized table props.",
          },
        ]}
      />

      <DemoTabs
        tabs={[
          {
            value: "kira",
            label: "KiraTable",
            demo: (
              <DemoWrapper
                title="KiraTable"
                description="Config-driven table: pass columns + data and get sorting, tri-state selection, sticky columns, loading and empty states for free."
                code={kiraCode}
              >
                <KiraTableDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "density",
            label: "Density",
            demo: (
              <DemoWrapper
                title="Density"
                description="Three row heights via the density prop — comfortable, compact, and dense for data-heavy dashboards."
                code={densityCode}
              >
                <DensityDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "states",
            label: "Loading & Empty",
            demo: (
              <DemoWrapper
                title="Loading & Empty States"
                description="TableSkeleton shimmer while data loads and a centered TableEmpty state when there are no rows."
                code={statesCode}
              >
                <StatesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Table"
                description="Simple table with header and body sections for displaying tabular data."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "variants",
            label: "Variants",
            demo: (
              <DemoWrapper
                title="Table Variants"
                description="Different table configurations including caption and footer options."
                code={variantsCode}
              >
                <VariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "striped",
            label: "Striped",
            demo: (
              <DemoWrapper
                title="Striped Table"
                description="Alternate row colors with the striped prop for better readability of large datasets."
                code={stripedCode}
              >
                <StripedDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "hover",
            label: "Hover",
            demo: (
              <DemoWrapper
                title="Hover States"
                description="Rows with hover states for better interaction feedback and visual emphasis."
                code={hoverCode}
              >
                <HoverDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "borderless",
            label: "Borderless",
            demo: (
              <DemoWrapper
                title="Borderless Table"
                description="Clean table variant without cell borders for a minimal design."
                code={borderlessCode}
              >
                <BorderlessDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        code={`import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      />

      <APIReference
        sections={[
          {
            title: "Table",
            props: [
              {
                prop: "density",
                type: "'comfortable' | 'compact' | 'dense'",
                default: "comfortable",
                description: "Row height / cell padding preset.",
              },
              {
                prop: "stickyHeader",
                type: "boolean",
                default: "false",
                description:
                  "Freeze the header while the body scrolls (needs the scroll container).",
              },
              {
                prop: "label",
                type: "string",
                default: "-",
                description:
                  "Accessible name for the scroll region; makes the wrapper a focusable role='region' (WCAG 2.1.1).",
              },
              {
                prop: "striped",
                type: "boolean",
                default: "false",
                description:
                  "Apply alternating row colors for better readability.",
              },
              {
                prop: "bordered",
                type: "boolean",
                default: "false",
                description: "Add borders to all cells in the table.",
              },
              {
                prop: "isGrid",
                type: "boolean",
                default: "false",
                description:
                  "Use role='grid' for interactive data tables with keyboard navigation.",
              },
              {
                prop: "ariaColCount",
                type: "number",
                default: "-",
                description:
                  "For virtualized tables, indicate total column count.",
              },
              {
                prop: "ariaRowCount",
                type: "number",
                default: "-",
                description:
                  "For virtualized tables, indicate total row count.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for custom styling.",
              },
            ],
          },
          {
            title: "TableHeader",
            props: [],
          },
          {
            title: "TableBody",
            props: [],
          },
          {
            title: "TableRow",
            props: [
              {
                prop: "isSelected",
                type: "boolean",
                default: "false",
                description: "For selectable rows, indicate selection state.",
              },
              {
                prop: "isGridRow",
                type: "boolean",
                default: "false",
                description: "For grid role tables.",
              },
            ],
          },
          {
            title: "TableHead",
            props: [
              {
                prop: "scope",
                type: "'col' | 'row' | 'colgroup' | 'rowgroup'",
                default: "col",
                description:
                  "Scope for accessibility - defaults to 'col' for column headers.",
              },
              {
                prop: "ariaSort",
                type: "'ascending' | 'descending' | 'none' | 'other'",
                default: "-",
                description:
                  "For sortable columns, indicate current sort direction.",
              },
              {
                prop: "isGridCell",
                type: "boolean",
                default: "false",
                description: "For grid role tables.",
              },
            ],
          },
          {
            title: "TableCell",
            props: [
              {
                prop: "isGridCell",
                type: "boolean",
                default: "false",
                description: "For grid role tables.",
              },
            ],
          },
          {
            title: "KiraTable",
            props: [
              {
                prop: "columns",
                type: "KiraTableColumn<T>[]",
                default: "-",
                description:
                  "Column config: { key, header, align?, stickyColumn?, sortable?, cell? }.",
              },
              {
                prop: "data",
                type: "T[]",
                default: "-",
                description: "Row data; rendered via each column's key or cell().",
              },
              {
                prop: "selectable",
                type: "boolean",
                default: "false",
                description:
                  "Add a leading checkbox column with a tri-state select-all header.",
              },
              {
                prop: "loading",
                type: "boolean",
                default: "false",
                description: "Render TableSkeleton shimmer rows instead of data.",
              },
              {
                prop: "empty",
                type: "ReactNode",
                default: "'No results.'",
                description: "Message shown when data is empty.",
              },
              {
                prop: "defaultSort",
                type: "{ key: keyof T; dir: SortDirection }",
                default: "-",
                description: "Initial sort column and direction.",
              },
              {
                prop: "onSelectionChange",
                type: "(ids: string[]) => void",
                default: "-",
                description: "Called with selected row ids (needs getRowId).",
              },
            ],
          },
          {
            title: "TableFooter",
            props: [],
          },
          {
            title: "TableCaption",
            props: [],
          },
        ]}
      />

      <Changelog
        entries={[
          {
            version: "2.0",
            date: "2026-07-22",
            changes: [
              {
                type: "added",
                title: "KiraTable mega-component",
                description:
                  "Config-driven columns + data with headless sort, tri-state row selection, sticky columns, loading and empty states.",
              },
              {
                type: "added",
                title: "Density, sticky header & sticky columns",
                description:
                  "density prop (comfortable/compact/dense) via cva, stickyHeader, and a stickyColumn prop on TableHead/TableCell.",
              },
              {
                type: "added",
                title: "SortableTableHead + useTableSort / useRowSelection",
                description:
                  "Nested-button sortable header (aria-sort on th, direction in aria-label) and two headless hooks powering KiraTable.",
              },
              {
                type: "added",
                title: "TableEmpty & TableSkeleton",
                description:
                  "Centered empty-state row and aria-hidden shimmer rows using the animate-skeleton-wave keyframe.",
              },
              {
                type: "added",
                title: "Focusable scroll region",
                description:
                  "label prop makes the overflow wrapper a keyboard-focusable role='region' (WCAG 2.1.1).",
              },
              {
                type: "fixed",
                title: "Reduced-motion row hover",
                description:
                  "Row hover transition is now gated behind useReducedMotion().",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
