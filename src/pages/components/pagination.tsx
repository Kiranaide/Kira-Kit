import * as React from "react";
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
  usePagination,
} from "@/components/ui/pagination";

// Sample data for demonstration
const SAMPLE_ITEMS = Array.from({ length: 235 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

export function PaginationPage() {
  // For controlled example
  const [controlledPage, setControlledPage] = React.useState(1);

  // For hook example
  const hookPagination = usePagination({
    total: 500,
    pageSize: 10,
    defaultPage: 1,
  });

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Pagination</h1>
        <p className="text-muted-foreground">
          Navigation for paginated content with smart page range calculation,
          accessibility features, and mobile-responsive layout.
        </p>
      </header>

      {/* Basic Pagination (Legacy API - still works) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Pagination (Manual)
        </h2>
        <p className="text-sm text-muted-foreground">
          Manual composition for simple use cases.
        </p>
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
      </section>

      {/* Auto Pages with Smart Ellipsis */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Auto Pages with Smart Ellipsis
        </h2>
        <p className="text-sm text-muted-foreground">
          Automatic page calculation with smart ellipsis placement. Try clicking
          different pages to see how the range adapts.
        </p>
        <Pagination total={100} pageSize={10} defaultPage={5}>
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
      </section>

      {/* Full Featured */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Full Featured
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete pagination with all controls: First/Last buttons, info
          display, page size selector, and jump-to-page.
        </p>
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
      </section>

      {/* Controlled Mode */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Controlled Mode
        </h2>
        <p className="text-sm text-muted-foreground">
          Page state controlled externally. Current page:{" "}
          <strong>{controlledPage}</strong>
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
      </section>

      {/* Using the Hook Directly */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Using usePagination Hook
        </h2>
        <p className="text-sm text-muted-foreground">
          Direct hook usage for custom implementations. Current: page{" "}
          {hookPagination.page} of {hookPagination.pageCount} (items{" "}
          {hookPagination.startItem}-{hookPagination.endItem} of{" "}
          {hookPagination.total})
        </p>
        <div className="flex gap-2">
          <button
            onClick={hookPagination.firstPage}
            disabled={hookPagination.isFirst}
            className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={hookPagination.prevPage}
            disabled={!hookPagination.hasPrev}
            className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm font-medium">
            {hookPagination.page}
          </span>
          <button
            onClick={hookPagination.nextPage}
            disabled={!hookPagination.hasNext}
            className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={hookPagination.lastPage}
            disabled={hookPagination.isLast}
            className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </section>

      {/* With Labels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Labels
        </h2>
        <p className="text-sm text-muted-foreground">
          Previous/Next buttons with visible labels.
        </p>
        <Pagination total={100} pageSize={10} defaultPage={5}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious showLabel />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext showLabel />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="space-y-4">
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
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
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
            <p className="text-sm text-muted-foreground mb-2">Pills</p>
            <Pagination variant="pills" total={50} pageSize={5} defaultPage={3}>
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
          <div>
            <p className="text-sm text-muted-foreground mb-2">Rounded</p>
            <Pagination variant="rounded" total={50} pageSize={5} defaultPage={3}>
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
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Color Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Combine style and color variants for themed pagination.
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Success (Pills)</p>
            <Pagination
              variant="pills"
              color="success"
              total={30}
              pageSize={5}
              defaultPage={2}
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
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Warning (Outline)</p>
            <Pagination
              variant="outline"
              color="warning"
              total={30}
              pageSize={5}
              defaultPage={2}
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
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Destructive (Ghost)</p>
            <Pagination
              variant="ghost"
              color="destructive"
              total={30}
              pageSize={5}
              defaultPage={2}
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
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled State
        </h2>
        <Pagination disabled total={50} pageSize={5} defaultPage={3}>
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
      </section>

      {/* Client-Side Data Pagination Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Client-Side Data Pagination
        </h2>
        <p className="text-sm text-muted-foreground">
          Example showing how to use pagination with actual data.
        </p>
        <ClientPaginationExample items={SAMPLE_ITEMS} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
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
          </pre>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          API Reference
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Pagination Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Prop</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">total</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Total number of items</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">pageSize</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Items per page (default: 10)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">page</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Controlled page value (1-indexed)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">defaultPage</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Initial page for uncontrolled mode</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">onPageChange</td>
                    <td className="py-2 pr-4 font-mono text-xs">(page: number) =&gt; void</td>
                    <td className="py-2">Called when page changes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">variant</td>
                    <td className="py-2 pr-4 font-mono text-xs">&quot;default&quot; | &quot;outline&quot; | &quot;pills&quot; | &quot;ghost&quot; | &quot;rounded&quot;</td>
                    <td className="py-2">Visual style variant</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">color</td>
                    <td className="py-2 pr-4 font-mono text-xs">&quot;default&quot; | &quot;success&quot; | &quot;warning&quot; | &quot;destructive&quot;</td>
                    <td className="py-2">Color variant for active state</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">size</td>
                    <td className="py-2 pr-4 font-mono text-xs">&quot;sm&quot; | &quot;default&quot; | &quot;lg&quot;</td>
                    <td className="py-2">Size variant</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">disabled</td>
                    <td className="py-2 pr-4 font-mono text-xs">boolean</td>
                    <td className="py-2">Disable all controls</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">maxPages</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Max visible page numbers (default: 5)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">usePagination Hook Returns</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Property</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">page</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Current page (1-indexed)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">pageCount</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Total number of pages</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">startItem / endItem</td>
                    <td className="py-2 pr-4 font-mono text-xs">number</td>
                    <td className="py-2">Item range for current page (1-indexed)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">hasPrev / hasNext</td>
                    <td className="py-2 pr-4 font-mono text-xs">boolean</td>
                    <td className="py-2">Navigation availability</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">setPage(n)</td>
                    <td className="py-2 pr-4 font-mono text-xs">function</td>
                    <td className="py-2">Go to specific page</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">nextPage() / prevPage()</td>
                    <td className="py-2 pr-4 font-mono text-xs">function</td>
                    <td className="py-2">Navigate forward/backward</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">getPageRange()</td>
                    <td className="py-2 pr-4 font-mono text-xs">PageRangeItem[]</td>
                    <td className="py-2">Get page numbers with ellipsis</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">getPageData(data)</td>
                    <td className="py-2 pr-4 font-mono text-xs">function</td>
                    <td className="py-2">Slice array for current page</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Example component showing data pagination
function ClientPaginationExample({
  items,
}: {
  items: { id: number; name: string }[];
}) {
  const pagination = usePagination({
    total: items.length,
    pageSize: 5,
  });

  const currentItems = pagination.getPageData(items);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg divide-y">
        {currentItems.map((item) => (
          <div key={item.id} className="px-4 py-2 text-sm">
            {item.name}
          </div>
        ))}
      </div>
      <Pagination
        total={items.length}
        pageSize={pagination.pageSize}
        page={pagination.page}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setPageSize}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <PaginationInfo format="Showing {start}-{end} of {total} items" />
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationPages />
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </div>
      </Pagination>
    </div>
  );
}
