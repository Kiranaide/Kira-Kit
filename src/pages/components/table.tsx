import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
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

export default function TablePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Table"
        description="A responsive table component for displaying tabular data with support for striped and bordered variants."
        version="1.0"
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
            title: "TableFooter",
            props: [],
          },
          {
            title: "TableCaption",
            props: [],
          },
        ]}
      />
    </ComponentPage>
  );
}
