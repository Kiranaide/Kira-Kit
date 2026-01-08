import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function PaginationPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Pagination</h1>
        <p className="text-muted-foreground">
          Navigation for paginated content.
        </p>
      </header>

      {/* Basic Pagination */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Pagination
        </h2>
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

      {/* With Ellipsis */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Ellipsis
        </h2>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
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
            <Pagination size="sm">
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
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large</p>
            <Pagination size="lg">
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
            <p className="text-sm text-muted-foreground mb-2">Outline</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="outline" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="outline">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="outline" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="outline">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="outline" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Pills</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="pills" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="pills">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="pills" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="pills">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="pills" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Ghost</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="ghost" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="ghost">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="ghost" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="ghost">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="ghost" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Rounded</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="rounded" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="rounded">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="rounded" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="rounded">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="rounded" />
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
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="pills" color="success" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="pills" color="success">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="pills" color="success" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="pills" color="success">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="pills" color="success" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Warning (Outline)</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="outline" color="warning" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="outline" color="warning">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="outline" color="warning" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="outline" color="warning">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="outline" color="warning" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Destructive (Ghost)</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious variant="ghost" color="destructive" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="ghost" color="destructive">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="ghost" color="destructive" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink variant="ghost" color="destructive">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext variant="ghost" color="destructive" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
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
  PaginationEllipsis,
} from "@/components/ui/pagination"

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious /></PaginationItem>
    <PaginationItem><PaginationLink>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext /></PaginationItem>
  </PaginationContent>
</Pagination>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
