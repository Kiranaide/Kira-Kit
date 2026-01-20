import { Grid, GridItem } from "@/components/ui/grid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconPhoto, IconMusic, IconVideo, IconFile } from "@tabler/icons-react";

export function GridPage() {
  return (
    <div className="p-8 max-w-5xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Grid</h1>
        <p className="text-muted-foreground">
          CSS Grid layout primitive for complex two-dimensional layouts.
        </p>
      </header>

      {/* Basic Columns */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Column Count
        </h2>
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
      </section>

      {/* Gap */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Gap Spacing
        </h2>
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
      </section>

      {/* Separate X/Y Gap */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Separate X/Y Gap
        </h2>
        <p className="text-sm text-muted-foreground mb-2">gapX=8, gapY=2</p>
        <Grid cols={4} gapX={8} gapY={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-3 bg-primary/20 rounded text-center">
              {i + 1}
            </div>
          ))}
        </Grid>
      </section>

      {/* Responsive Columns */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Responsive Columns
        </h2>
        <p className="text-sm text-muted-foreground">
          Resize the window: 1 column on mobile, 2 on tablet, 4 on desktop
        </p>
        <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-6 bg-primary/20 rounded text-center">
              Item {i + 1}
            </div>
          ))}
        </Grid>
      </section>

      {/* GridItem Span */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          GridItem Column Span
        </h2>
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
      </section>

      {/* GridItem Row Span */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          GridItem Row Span
        </h2>
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
      </section>

      {/* Responsive Span */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Responsive Span
        </h2>
        <p className="text-sm text-muted-foreground">
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
      </section>

      {/* Grid Flow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Grid Flow
        </h2>
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
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Real-World Examples
        </h2>

        {/* Dashboard Layout */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Dashboard Layout</p>
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
        </div>

        {/* Image Gallery */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Image Gallery</p>
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
        </div>

        {/* Team Grid */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Team Members</p>
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
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Grid, GridItem } from "@/components/ui/grid"

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
</Grid>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
