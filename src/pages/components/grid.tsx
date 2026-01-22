import { Grid, GridItem } from "@/components/ui/grid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconPhoto, IconMusic, IconVideo, IconFile, IconLayoutGrid, IconGridDots, IconDeviceMobile } from "@tabler/icons-react";
import {
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
  ComponentPage,
} from "@/components/docs";

function ColumnCountDemo() {
  return (
    <div className="space-y-6">
      {([2, 3, 4, 6] as const).map((cols) => (
        <div key={cols}>
          <p className="text-sm text-muted-foreground mb-2">cols={cols}</p>
          <Grid cols={cols} gap={4}>
            {Array.from({ length: cols * 2 }).map((_, i) => (
              <div key={i} className="p-4 bg-primary/20 rounded text-center">
                {i + 1}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}

const columnCountCode = `import { Grid } from "@/components/ui/grid"

export function ColumnCountDemo() {
  return (
    <div className="space-y-6">
      {[2, 3, 4, 6].map((cols) => (
        <div key={cols}>
          <p className="text-sm text-muted-foreground mb-2">cols={cols}</p>
          <Grid cols={cols} gap={4}>
            {Array.from({ length: cols * 2 }).map((_, i) => (
              <div key={i} className="p-4 bg-primary/20 rounded">
                {i + 1}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  )
}`;

function GapSpacingDemo() {
  return (
    <div className="space-y-6">
      {([2, 4, 6, 8] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
          <Grid cols={4} gap={gap}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-3 bg-primary/20 rounded text-center">
                {i + 1}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}

const gapSpacingCode = `import { Grid } from "@/components/ui/grid"

export function GapSpacingDemo() {
  return (
    <div className="space-y-6">
      {[2, 4, 6, 8].map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
          <Grid cols={4} gap={gap}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-3 bg-primary/20 rounded">
                {i + 1}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  )
}`;

function ResponsiveColumnsDemo() {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Resize the window: 1 column on mobile, 2 on tablet, 4 on desktop
      </p>
      <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-6 bg-primary/20 rounded text-center">
            Item {i + 1}
          </div>
        ))}
      </Grid>
    </div>
  );
}

const responsiveColumnsCode = `import { Grid } from "@/components/ui/grid"

export function ResponsiveColumnsDemo() {
  return (
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-6 bg-primary/20 rounded">
          Item {i + 1}
        </div>
      ))}
    </Grid>
  )
}`;

function SeparateGapDemo() {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">gapX=8, gapY=2</p>
      <Grid cols={4} gapX={8} gapY={2}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="p-3 bg-primary/20 rounded text-center">
            {i + 1}
          </div>
        ))}
      </Grid>
    </div>
  );
}

const separateGapCode = `import { Grid } from "@/components/ui/grid"

export function SeparateGapDemo() {
  return (
    <Grid cols={4} gapX={8} gapY={2}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="p-3 bg-primary/20 rounded">
          {i + 1}
        </div>
      ))}
    </Grid>
  )
}`;

function GridFlowDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="row" (default)</p>
        <Grid cols={3} rows={2} gap={2} flow="row" className="h-40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-2 bg-primary/20 rounded text-center text-sm">
              {i + 1}
            </div>
          ))}
        </Grid>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="column"</p>
        <Grid cols={3} rows={2} gap={2} flow="column" className="h-40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-2 bg-primary/20 rounded text-center text-sm">
              {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

const gridFlowCode = `import { Grid } from "@/components/ui/grid"

export function GridFlowDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="row"</p>
        <Grid cols={3} rows={2} gap={2} flow="row" className="h-40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-2 bg-primary/20 rounded">
              {i + 1}
            </div>
          ))}
        </Grid>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="column"</p>
        <Grid cols={3} rows={2} gap={2} flow="column" className="h-40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-2 bg-primary/20 rounded">
              {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  )
}`;

function ColumnSpanDemo() {
  return (
    <Grid cols={4} gap={4}>
      <GridItem colSpan={2} className="p-4 bg-blue-500/20 rounded text-center">
        Span 2
      </GridItem>
      <div className="p-4 bg-primary/20 rounded text-center">1</div>
      <div className="p-4 bg-primary/20 rounded text-center">1</div>
      <div className="p-4 bg-primary/20 rounded text-center">1</div>
      <GridItem colSpan={3} className="p-4 bg-green-500/20 rounded text-center">
        Span 3
      </GridItem>
      <GridItem colSpan="full" className="p-4 bg-purple-500/20 rounded text-center">
        Full Width
      </GridItem>
    </Grid>
  );
}

const columnSpanCode = `import { Grid, GridItem } from "@/components/ui/grid"

export function ColumnSpanDemo() {
  return (
    <Grid cols={4} gap={4}>
      <GridItem colSpan={2} className="p-4 bg-blue-500/20 rounded">
        Span 2
      </GridItem>
      <div className="p-4 bg-primary/20 rounded">1</div>
      <div className="p-4 bg-primary/20 rounded">1</div>
      <div className="p-4 bg-primary/20 rounded">1</div>
      <GridItem colSpan={3} className="p-4 bg-green-500/20 rounded">
        Span 3
      </GridItem>
      <GridItem colSpan="full" className="p-4 bg-purple-500/20 rounded">
        Full Width
      </GridItem>
    </Grid>
  )
}`;

function RowSpanDemo() {
  return (
    <Grid cols={3} gap={4}>
      <GridItem rowSpan={2} className="p-4 bg-blue-500/20 rounded flex items-center justify-center">
        Row Span 2
      </GridItem>
      <div className="p-4 bg-primary/20 rounded text-center">1</div>
      <div className="p-4 bg-primary/20 rounded text-center">2</div>
      <div className="p-4 bg-primary/20 rounded text-center">3</div>
      <GridItem rowSpan={2} className="p-4 bg-green-500/20 rounded flex items-center justify-center">
        Row Span 2
      </GridItem>
      <div className="p-4 bg-primary/20 rounded text-center">4</div>
      <div className="p-4 bg-primary/20 rounded text-center">5</div>
    </Grid>
  );
}

const rowSpanCode = `import { Grid, GridItem } from "@/components/ui/grid"

export function RowSpanDemo() {
  return (
    <Grid cols={3} gap={4}>
      <GridItem rowSpan={2} className="p-4 bg-blue-500/20 rounded flex items-center justify-center">
        Row Span 2
      </GridItem>
      <div className="p-4 bg-primary/20 rounded">1</div>
      <div className="p-4 bg-primary/20 rounded">2</div>
      <div className="p-4 bg-primary/20 rounded">3</div>
      <GridItem rowSpan={2} className="p-4 bg-green-500/20 rounded flex items-center justify-center">
        Row Span 2
      </GridItem>
      <div className="p-4 bg-primary/20 rounded">4</div>
      <div className="p-4 bg-primary/20 rounded">5</div>
    </Grid>
  )
}`;

function ResponsiveSpanDemo() {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Featured card spans full width on mobile, 2 columns on desktop
      </p>
      <Grid cols={{ base: 1, md: 3 }} gap={4}>
        <GridItem colSpan={{ base: 1, md: 2 }} className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded">
          <h3 className="font-semibold mb-2">Featured Item</h3>
          <p className="text-sm text-muted-foreground">This spans 2 columns on desktop</p>
        </GridItem>
        <div className="p-6 bg-primary/20 rounded">
          <h3 className="font-semibold mb-2">Regular Item</h3>
          <p className="text-sm text-muted-foreground">Standard width</p>
        </div>
        <div className="p-6 bg-primary/20 rounded">Item 3</div>
        <div className="p-6 bg-primary/20 rounded">Item 4</div>
        <div className="p-6 bg-primary/20 rounded">Item 5</div>
      </Grid>
    </div>
  );
}

const responsiveSpanCode = `import { Grid, GridItem } from "@/components/ui/grid"

export function ResponsiveSpanDemo() {
  return (
    <Grid cols={{ base: 1, md: 3 }} gap={4}>
      <GridItem colSpan={{ base: 1, md: 2 }} className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded">
        <h3 className="font-semibold mb-2">Featured Item</h3>
        <p className="text-sm text-muted-foreground">This spans 2 columns on desktop</p>
      </GridItem>
      <div className="p-6 bg-primary/20 rounded">
        <h3 className="font-semibold mb-2">Regular Item</h3>
        <p className="text-sm text-muted-foreground">Standard width</p>
      </div>
      <div className="p-6 bg-primary/20 rounded">Item 3</div>
      <div className="p-6 bg-primary/20 rounded">Item 4</div>
      <div className="p-6 bg-primary/20 rounded">Item 5</div>
    </Grid>
  )
}`;

function DashboardDemo() {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 4 }} gap={4}>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl">12,345</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">+12%</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-2xl">$54,321</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">+8%</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Orders</CardDescription>
          <CardTitle className="text-2xl">1,234</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">+23%</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Conversion</CardDescription>
          <CardTitle className="text-2xl">3.2%</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="destructive">-2%</Badge>
        </CardContent>
      </Card>
    </Grid>
  );
}

const dashboardCode = `import { Grid, GridItem } from "@/components/ui/grid"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DashboardDemo() {
  return (
    <Grid cols={{ base: 1, md: 2, lg: 4 }} gap={4}>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl">12,345</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">+12%</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-2xl">$54,321</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">+8%</Badge>
        </CardContent>
      </Card>
    </Grid>
  )
}`;

function ImageGalleryDemo() {
  return (
    <Grid cols={{ base: 2, md: 4 }} gap={2}>
      <GridItem colSpan={{ base: 2, md: 2 }} rowSpan={2}>
        <div className="w-full h-full min-h-48 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg flex items-center justify-center">
          <IconPhoto className="size-12 text-muted-foreground" />
        </div>
      </GridItem>
      {[IconMusic, IconVideo, IconFile, IconPhoto].map((Icon, i) => (
        <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <Icon className="size-8 text-muted-foreground" />
        </div>
      ))}
    </Grid>
  );
}

const imageGalleryCode = `import { Grid, GridItem } from "@/components/ui/grid"
import { IconPhoto, IconMusic, IconVideo, IconFile } from "@tabler/icons-react"

export function ImageGalleryDemo() {
  return (
    <Grid cols={{ base: 2, md: 4 }} gap={2}>
      <GridItem colSpan={{ base: 2, md: 2 }} rowSpan={2}>
        <div className="w-full h-full min-h-48 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg flex items-center justify-center">
          <IconPhoto className="size-12 text-muted-foreground" />
        </div>
      </GridItem>
      {[IconMusic, IconVideo, IconFile, IconPhoto].map((Icon, i) => (
        <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <Icon className="size-8 text-muted-foreground" />
        </div>
      ))}
    </Grid>
  )
}`;

function TeamGridDemo() {
  return (
    <Grid cols={{ base: 2, sm: 3, md: 6 }} gap={4}>
      {["AJ", "BS", "CW", "DK", "EM", "FP"].map((initials, i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Member {i + 1}</span>
          <span className="text-xs text-muted-foreground">Role</span>
        </div>
      ))}
    </Grid>
  );
}

const teamGridCode = `import { Grid, GridItem } from "@/components/ui/grid"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TeamGridDemo() {
  return (
    <Grid cols={{ base: 2, sm: 3, md: 6 }} gap={4}>
      {["AJ", "BS", "CW", "DK", "EM", "FP"].map((initials, i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-4 border rounded-lg">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Member {i + 1}</span>
          <span className="text-xs text-muted-foreground">Role</span>
        </div>
      ))}
    </Grid>
  )
}`;

export default function GridPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Grid"
        description="CSS Grid layout primitive for complex two-dimensional layouts. Supports responsive columns, rows, gaps, and item spanning."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Responsive Design",
            description: "Full responsive support for columns, rows, and gaps using breakpoint objects.",
            icon: <IconDeviceMobile className="h-5 w-5" />,
          },
          {
            title: "Flexible Spacing",
            description: "Control gap on both axes independently with responsive gapX and gapY props.",
            icon: <IconLayoutGrid className="h-5 w-5" />,
          },
          {
            title: "Item Placement",
            description: "GridItem supports column and row spanning for complex layouts with responsive spans.",
            icon: <IconGridDots className="h-5 w-5" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="column-count"
        tabs={[
          {
            value: "column-count",
            label: "Column Count",
            demo: (
              <DemoWrapper
                title="Column Count"
                description="Define the number of columns in your grid layout."
                code={columnCountCode}
              >
                <ColumnCountDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "gap-spacing",
            label: "Gap Spacing",
            demo: (
              <DemoWrapper
                title="Gap Spacing"
                description="Control spacing between grid items with the gap prop."
                code={gapSpacingCode}
              >
                <GapSpacingDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "responsive-columns",
            label: "Responsive Columns",
            demo: (
              <DemoWrapper
                title="Responsive Columns"
                description="Define different column counts for each breakpoint."
                code={responsiveColumnsCode}
              >
                <ResponsiveColumnsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "separate-gap",
            label: "Separate X/Y Gap",
            demo: (
              <DemoWrapper
                title="Separate X/Y Gap"
                description="Control horizontal and vertical gaps independently."
                code={separateGapCode}
              >
                <SeparateGapDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "grid-flow",
            label: "Grid Flow",
            demo: (
              <DemoWrapper
                title="Grid Flow"
                description="Control how auto-placed items are positioned."
                code={gridFlowCode}
              >
                <GridFlowDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "column-span",
            label: "Column Span",
            demo: (
              <DemoWrapper
                title="GridItem Column Span"
                description="Make items span multiple columns using GridItem and colSpan."
                code={columnSpanCode}
              >
                <ColumnSpanDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "row-span",
            label: "Row Span",
            demo: (
              <DemoWrapper
                title="GridItem Row Span"
                description="Make items span multiple rows using GridItem and rowSpan."
                code={rowSpanCode}
              >
                <RowSpanDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "responsive-span",
            label: "Responsive Span",
            demo: (
              <DemoWrapper
                title="Responsive Span"
                description="Responsive column spanning with breakpoint objects."
                code={responsiveSpanCode}
              >
                <ResponsiveSpanDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "dashboard",
            label: "Dashboard",
            demo: (
              <DemoWrapper
                title="Dashboard Layout"
                description="Real-world analytics dashboard with responsive cards."
                code={dashboardCode}
              >
                <DashboardDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "image-gallery",
            label: "Image Gallery",
            demo: (
              <DemoWrapper
                title="Image Gallery"
                description="Masonry-style gallery with featured item spanning multiple rows and columns."
                code={imageGalleryCode}
              >
                <ImageGalleryDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "team-grid",
            label: "Team Grid",
            demo: (
              <DemoWrapper
                title="Team Members"
                description="Team grid with responsive columns from 2 to 6."
                code={teamGridCode}
              >
                <TeamGridDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        code={`import { Grid, GridItem } from "@/components/ui/grid"

// Basic grid
<Grid cols={3} gap={4}>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</Grid>

// Responsive grid
<Grid cols={{ base: 1, md: 2, lg: 4 }} gap={4}>
  <Card />
</Grid>

// With spanning
<Grid cols={4} gap={4}>
  <GridItem colSpan={2}>Wide item</GridItem>
  <GridItem>Normal</GridItem>
  <GridItem rowSpan={2}>Tall item</GridItem>
</Grid>

// Responsive spanning
<Grid cols={{ base: 1, md: 3 }} gap={4}>
  <GridItem colSpan={{ base: 1, md: 2 }}>
    Featured
  </GridItem>
</Grid>

// Separate gaps
<Grid cols={4} gapX={8} gapY={2}>
  <Card />
</Grid>

// Grid flow
<Grid cols={3} rows={2} flow="column">
  <Card />
</Grid>`}
      />

      <APIReference
        sections={[
          {
            title: "Grid",
            props: [
              {
                prop: "as",
                type: "GridElement",
                default: "div",
                description: "Semantic HTML element to render (div, section, main, article, aside, ul, ol, form).",
              },
              {
                prop: "cols",
                type: "ResponsiveValue<GridCols>",
                default: "-",
                description: "Number of columns (1-12, none, subgrid). Supports responsive values.",
              },
              {
                prop: "rows",
                type: "ResponsiveValue<GridRows>",
                default: "-",
                description: "Number of rows (1-6, none, subgrid). Supports responsive values.",
              },
              {
                prop: "gap",
                type: "ResponsiveValue<GridGap>",
                default: "-",
                description: "Gap between items (0, 1-6, 8, 10, 12, 16, 20, 24). Supports responsive values.",
              },
              {
                prop: "gapX",
                type: "ResponsiveValue<number>",
                default: "-",
                description: "Horizontal gap between items. Supports responsive values.",
              },
              {
                prop: "gapY",
                type: "ResponsiveValue<number>",
                default: "-",
                description: "Vertical gap between items. Supports responsive values.",
              },
              {
                prop: "flow",
                type: "GridFlow",
                default: "-",
                description: "Grid flow direction (row, column, dense, row-dense, column-dense).",
              },
              {
                prop: "align",
                type: "ResponsiveValue<GridAlign>",
                default: "-",
                description: "Align items (start, end, center, stretch, baseline). Supports responsive values.",
              },
              {
                prop: "justify",
                type: "ResponsiveValue<GridJustify>",
                default: "-",
                description: "Justify items (start, end, center, stretch). Supports responsive values.",
              },
              {
                prop: "place",
                type: "ResponsiveValue<GridPlace>",
                default: "-",
                description: "Place items shorthand (start, end, center, stretch). Supports responsive values.",
              },
              {
                prop: "inline",
                type: "boolean",
                default: "false",
                description: "Whether to use inline-grid instead of grid display.",
              },
            ],
          },
          {
            title: "GridItem",
            props: [
              {
                prop: "colSpan",
                type: "ResponsiveValue<ColSpan>",
                default: "-",
                description: "Column span (1-12, full). Supports responsive values.",
              },
              {
                prop: "rowSpan",
                type: "ResponsiveValue<RowSpan>",
                default: "-",
                description: "Row span (1-6, full). Supports responsive values.",
              },
              {
                prop: "colStart",
                type: "ColPosition",
                default: "-",
                description: "Column start position (1-13, auto).",
              },
              {
                prop: "colEnd",
                type: "ColPosition",
                default: "-",
                description: "Column end position (1-13, auto).",
              },
              {
                prop: "rowStart",
                type: "RowPosition",
                default: "-",
                description: "Row start position (1-7, auto).",
              },
              {
                prop: "rowEnd",
                type: "RowPosition",
                default: "-",
                description: "Row end position (1-7, auto).",
              },
              {
                prop: "alignSelf",
                type: "SelfAlign",
                default: "-",
                description: "Align self (start, end, center, stretch, auto).",
              },
              {
                prop: "justifySelf",
                type: "SelfAlign",
                default: "-",
                description: "Justify self (start, end, center, stretch, auto).",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
