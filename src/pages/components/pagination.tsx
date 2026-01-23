import * as React from "react";
import {
  IconNumbers,
  IconArrowsLeftRight,
  IconAdjustments,
} from "@tabler/icons-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationPages,
  PaginationInfo,
  PaginationSizeSelector,
  PaginationJump,
  PaginationStatus,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";

function DemoWrapper({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  code: string;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "preview" | "code")}
          >
            <TabsList>
              <TabsTrigger value="preview" className="gap-1.5">
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5">
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {view === "preview" ? (
          <div className="min-h-[200px]">{children}</div>
        ) : (
          <CodeBlock code={code} language="tsx" />
        )}
      </CardContent>
    </Card>
  );
}

function BasicDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const basicCode = `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

export function BasicPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`;

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Pagination variant="default" total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Outline</p>
        <Pagination variant="outline" total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Ghost</p>
        <Pagination variant="ghost" total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

const variantsCode = `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
} from "@/components/ui/pagination"

export function PaginationVariants() {
  const variants = ["default", "outline", "ghost"] as const

  return (
    <div className="space-y-6">
      {variants.map((variant) => (
        <Pagination key={variant} variant={variant} total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem><PaginationPrevious /></PaginationItem>
            <PaginationPages />
            <PaginationItem><PaginationNext /></PaginationItem>
          </PaginationContent>
        </Pagination>
      ))}
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <Pagination size="sm" total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Pagination total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <Pagination size="lg" total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

const sizesCode = `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationPages,
} from "@/components/ui/pagination"

export function PaginationSizes() {
  return (
    <div className="space-y-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Pagination key={size} size={size} total={50} pageSize={5} defaultPage={3}>
          <PaginationContent>
            <PaginationItem><PaginationFirst /></PaginationItem>
            <PaginationItem><PaginationPrevious /></PaginationItem>
            <PaginationPages />
            <PaginationItem><PaginationNext /></PaginationItem>
            <PaginationItem><PaginationLast /></PaginationItem>
          </PaginationContent>
        </Pagination>
      ))}
    </div>
  )
}`;

function ControlledDemo() {
  const [controlledPage, setControlledPage] = React.useState(1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Current page: <strong>{controlledPage}</strong>
      </p>
      <Pagination
        total={50}
        pageSize={5}
        page={controlledPage}
        onPageChange={setControlledPage}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationPages />
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setControlledPage(1)}
          className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
        >
          Go to page 1
        </button>
        <button
          onClick={() => setControlledPage(5)}
          className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
        >
          Go to page 5
        </button>
        <button
          onClick={() => setControlledPage(10)}
          className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
        >
          Go to page 10
        </button>
      </div>
    </div>
  );
}

const controlledCode = `import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
} from "@/components/ui/pagination"

export function ControlledPagination() {
  const [page, setPage] = useState(1)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Current page: <strong>{page}</strong>
      </p>
      <Pagination
        total={50}
        pageSize={5}
        page={page}
        onPageChange={setPage}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationPages />
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex gap-2">
        <button onClick={() => setPage(1)}>Go to page 1</button>
        <button onClick={() => setPage(5)}>Go to page 5</button>
        <button onClick={() => setPage(10)}>Go to page 10</button>
      </div>
    </div>
  )
}`;

function WithSelectDemo() {
  return (
    <Pagination total={235} pageSize={10} defaultPage={1}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <PaginationInfo />
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationPages />
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast />
          </PaginationItem>
        </PaginationContent>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <PaginationSizeSelector options={[5, 10, 20, 50]} />
        <PaginationJump />
      </div>
      <PaginationStatus />
    </Pagination>
  );
}

const withSelectCode = `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationPages,
  PaginationInfo,
  PaginationSizeSelector,
  PaginationJump,
  PaginationStatus,
} from "@/components/ui/pagination"

export function PaginationWithSelect() {
  return (
    <Pagination total={235} pageSize={10} defaultPage={1}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <PaginationInfo />
        <PaginationContent>
          <PaginationItem><PaginationFirst /></PaginationItem>
          <PaginationItem><PaginationPrevious /></PaginationItem>
          <PaginationPages />
          <PaginationItem><PaginationNext /></PaginationItem>
          <PaginationItem><PaginationLast /></PaginationItem>
        </PaginationContent>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <PaginationSizeSelector options={[5, 10, 20, 50]} />
        <PaginationJump />
      </div>
      <PaginationStatus />
    </Pagination>
  )
}`;

export default function PaginationPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Pagination</h1>
          <Badge>v1.0</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Navigation for paginated content with smart page range calculation,
          accessibility features, and mobile-responsive layout.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <IconNumbers className="h-4 w-4" />
              Smart Ellipsis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Automatic page range calculation with intelligent ellipsis placement
            that adapts as you navigate.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <IconArrowsLeftRight className="h-4 w-4" />
              Responsive
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Mobile-friendly layout with touch targets and flexible composition
            for any screen size.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <IconAdjustments className="h-4 w-4" />
              Customizable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Multiple variants, sizes, colors, and composable sub-components for
            complete control.
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="controlled">Controlled</TabsTrigger>
          <TabsTrigger value="with-select">With Select</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <DemoWrapper
            title="Basic Pagination"
            description="Manual composition for simple use cases."
            code={basicCode}
          >
            <BasicDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="variants">
          <DemoWrapper
            title="Style Variants"
            description="Different visual styles: default, outline, and ghost."
            code={variantsCode}
          >
            <VariantsDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="sizes">
          <DemoWrapper
            title="Size Variants"
            description="Small, default, and large sizes for different contexts."
            code={sizesCode}
          >
            <SizesDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="controlled">
          <DemoWrapper
            title="Controlled Mode"
            description="Page state controlled externally via props."
            code={controlledCode}
          >
            <ControlledDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="with-select">
          <DemoWrapper
            title="Full Featured with Select"
            description="Complete pagination with all controls: First/Last buttons, info display, page size selector, and jump-to-page."
            code={withSelectCode}
          >
            <WithSelectDemo />
          </DemoWrapper>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>
            Full keyboard support for accessibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              {
                keys: "Tab",
                description: "Navigate between pagination controls",
              },
              {
                keys: "Enter / Space",
                description: "Activate focused page or button",
              },
              { keys: "Home", description: "Go to first page (when focused)" },
              { keys: "End", description: "Go to last page (when focused)" },
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center gap-2">
                <kbd className="rounded border bg-muted px-2 py-1 text-xs font-mono">
                  {shortcut.keys}
                </kbd>
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Import and use the pagination components with your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationPages,
  PaginationInfo,
  PaginationSizeSelector,
  PaginationJump,
  usePagination,
} from "@/components/ui/pagination"

// Simple auto pagination
<Pagination total={100} pageSize={10} defaultPage={1}>
  <PaginationContent>
    <PaginationItem><PaginationPrevious /></PaginationItem>
    <PaginationPages />
    <PaginationItem><PaginationNext /></PaginationItem>
  </PaginationContent>
</Pagination>

// Full featured with all controls
<Pagination total={235} pageSize={10}>
  <div className="flex items-center justify-between">
    <PaginationInfo />
    <PaginationContent>
      <PaginationItem><PaginationFirst /></PaginationItem>
      <PaginationItem><PaginationPrevious /></PaginationItem>
      <PaginationPages />
      <PaginationItem><PaginationNext /></PaginationItem>
      <PaginationItem><PaginationLast /></PaginationItem>
    </PaginationContent>
  </div>
  <div className="flex gap-4 mt-4">
    <PaginationSizeSelector options={[10, 20, 50]} />
    <PaginationJump />
  </div>
</Pagination>

// Using the hook directly
const pagination = usePagination({
  total: 500,
  pageSize: 20,
  onPageChange: (page) => fetchData(page),
})

const currentPageData = pagination.getPageData(allData)`}
            language="tsx"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Key props and configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pagination</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      prop: "total",
                      type: "number",
                      description: "Total number of items",
                    },
                    {
                      prop: "pageSize",
                      type: "number",
                      default: "10",
                      description: "Items per page",
                    },
                    {
                      prop: "page",
                      type: "number",
                      description: "Controlled page value (1-indexed)",
                    },
                    {
                      prop: "defaultPage",
                      type: "number",
                      default: "1",
                      description: "Initial page for uncontrolled mode",
                    },
                    {
                      prop: "onPageChange",
                      type: "(page: number) => void",
                      description: "Called when page changes",
                    },
                    {
                      prop: "onPageSizeChange",
                      type: "(size: number) => void",
                      description: "Called when page size changes",
                    },
                    {
                      prop: "variant",
                      type: '"default" | "outline" | "pills" | "ghost" | "rounded"',
                      default: '"default"',
                      description: "Visual style variant",
                    },
                    {
                      prop: "color",
                      type: '"default" | "success" | "warning" | "destructive"',
                      default: '"default"',
                      description: "Color variant for active state",
                    },
                    {
                      prop: "size",
                      type: '"sm" | "default" | "lg"',
                      default: '"default"',
                      description: "Size variant",
                    },
                    {
                      prop: "disabled",
                      type: "boolean",
                      default: "false",
                      description: "Disable all controls",
                    },
                    {
                      prop: "maxPages",
                      type: "number",
                      default: "5",
                      description: "Max visible page numbers",
                    },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 font-mono text-xs">{item.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.default || "-"}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PaginationContent</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      prop: "className",
                      type: "string",
                      description: "Additional CSS classes",
                    },
                    {
                      prop: "children",
                      type: "ReactNode",
                      description: "Pagination items",
                    },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 font-mono text-xs">{item.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        -
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PaginationItem</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      prop: "className",
                      type: "string",
                      description: "Additional CSS classes",
                    },
                    {
                      prop: "children",
                      type: "ReactNode",
                      description: "Item content (buttons, links)",
                    },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 font-mono text-xs">{item.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        -
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              PaginationNext / PaginationPrevious
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      prop: "className",
                      type: "string",
                      description: "Additional CSS classes",
                    },
                    {
                      prop: "showLabel",
                      type: "boolean",
                      default: "false",
                      description: "Show text label instead of icon",
                    },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 font-mono text-xs">{item.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.default || "-"}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PaginationLink</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      prop: "isActive",
                      type: "boolean",
                      default: "false",
                      description: "Whether this is the active page",
                    },
                    {
                      prop: "page",
                      type: "number",
                      description: "Page number (for manual links)",
                    },
                    {
                      prop: "onClick",
                      type: "() => void",
                      description: "Click handler",
                    },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 font-mono text-xs">{item.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.default || "-"}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              usePagination Hook Returns
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      prop: "page",
                      type: "number",
                      description: "Current page (1-indexed)",
                    },
                    {
                      prop: "pageCount",
                      type: "number",
                      description: "Total number of pages",
                    },
                    {
                      prop: "startItem / endItem",
                      type: "number",
                      description: "Item range for current page (1-indexed)",
                    },
                    {
                      prop: "hasPrev / hasNext",
                      type: "boolean",
                      description: "Navigation availability",
                    },
                    {
                      prop: "isFirst / isLast",
                      type: "boolean",
                      description: "Whether on first or last page",
                    },
                    {
                      prop: "setPage(n)",
                      type: "function",
                      description: "Go to specific page",
                    },
                    {
                      prop: "nextPage() / prevPage()",
                      type: "function",
                      description: "Navigate forward/backward",
                    },
                    {
                      prop: "firstPage() / lastPage()",
                      type: "function",
                      description: "Navigate to first/last page",
                    },
                    {
                      prop: "getPageRange()",
                      type: "PageRangeItem[]",
                      description: "Get page numbers with ellipsis",
                    },
                    {
                      prop: "getPageData(data)",
                      type: "function",
                      description: "Slice array for current page",
                    },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 font-mono text-xs">{item.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {item.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        -
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
