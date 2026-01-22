import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs"

const sizesCode = `import { Container } from "@/components/ui/container"

export function ContainerSizesDemo() {
  return (
    <div className="space-y-4">
      {(["sm", "md", "lg", "xl", "2xl", "prose", "full"] as const).map((size) => (
        <Container key={size} size={size} className="bg-primary/10 py-4 rounded-lg">
          <div className="text-center">
            <span className="font-mono text-sm">size="{size}"</span>
            <span className="text-muted-foreground text-sm ml-2">
              {size === "sm" && "(640px)"}
              {size === "md" && "(768px)"}
              {size === "lg" && "(1024px)"}
              {size === "xl" && "(1280px)"}
              {size === "2xl" && "(1536px)"}
              {size === "prose" && "(65ch)"}
              {size === "full" && "(100%)"}
            </span>
          </div>
        </Container>
      ))}
    </div>
  )
}`

function SizesDemo() {
  return (
    <div className="space-y-4">
      {(["sm", "md", "lg", "xl", "2xl", "prose", "full"] as const).map((size) => (
        <Container key={size} size={size} className="bg-primary/10 py-4 rounded-lg">
          <div className="text-center">
            <span className="font-mono text-sm">size="{size}"</span>
            <span className="text-muted-foreground text-sm ml-2">
              {size === "sm" && "(640px)"}
              {size === "md" && "(768px)"}
              {size === "lg" && "(1024px)"}
              {size === "xl" && "(1280px)"}
              {size === "2xl" && "(1536px)"}
              {size === "prose" && "(65ch)"}
              {size === "full" && "(100%)"}
            </span>
          </div>
        </Container>
      ))}
    </div>
  )
}

const paddingCode = `import { Container } from "@/components/ui/container"

export function ContainerPaddingDemo() {
  return (
    <div className="space-y-4 bg-muted/30 py-4">
      {(["none", "sm", "default", "lg"] as const).map((padding) => (
        <Container key={padding} padding={padding} size="lg">
          <div className="bg-primary/20 py-4 rounded-lg text-center">
            <span className="font-mono text-sm">padding="{padding}"</span>
          </div>
        </Container>
      ))}
    </div>
  )
}`

function PaddingDemo() {
  return (
    <div className="space-y-4 bg-muted/30 py-4">
      {(["none", "sm", "default", "lg"] as const).map((padding) => (
        <Container key={padding} padding={padding} size="lg">
          <div className="bg-primary/20 py-4 rounded-lg text-center">
            <span className="font-mono text-sm">padding="{padding}"</span>
          </div>
        </Container>
      ))}
    </div>
  )
}

const centeredCode = `import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export function ContainerCenteredDemo() {
  return (
    <Container size="md" centered className="py-8 bg-muted/30">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Centered Container</h3>
        <p className="text-muted-foreground">
          Content inside is centered both horizontally and vertically using flexbox.
        </p>
        <Button>Call to Action</Button>
      </div>
    </Container>
  )
}`

function CenteredDemo() {
  return (
    <Container size="md" centered className="py-8 bg-muted/30">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Centered Container</h3>
        <p className="text-muted-foreground">
          Content inside is centered both horizontally and vertically using flexbox.
        </p>
        <Button>Call to Action</Button>
      </div>
    </Container>
  )
}

const semanticCode = `import { Container } from "@/components/ui/container"

export function ContainerSemanticDemo() {
  return (
    <Container as="main" className="bg-muted/30 py-8">
      <p className="text-center text-muted-foreground">
        This container renders as a &lt;main&gt; element
      </p>
    </Container>
  )
}`

function SemanticDemo() {
  return (
    <Container as="main" className="bg-muted/30 py-8">
      <p className="text-center text-muted-foreground">
        This container renders as a <code className="bg-muted px-1 rounded">&lt;main&gt;</code> element
      </p>
    </Container>
  )
}

const heroCode = `import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export function ContainerHeroDemo() {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-16">
      <Container size="lg" centered>
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Welcome to Our Platform</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Build amazing products with our comprehensive toolkit designed for modern developers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}`

function HeroDemo() {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-16">
      <Container size="lg" centered>
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Welcome to Our Platform</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Build amazing products with our comprehensive toolkit designed for modern developers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

const proseCode = `import { Container } from "@/components/ui/container"

export function ContainerProseDemo() {
  return (
    <Container size="prose">
      <article className="prose dark:prose-invert">
        <h3 className="text-2xl font-bold mb-4">Optimal Reading Width</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The "prose" size container uses a maximum width of 65 characters (65ch), 
          which is considered the optimal line length for reading. This ensures 
          comfortable reading without eye strain from lines that are too long or 
          too short.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Research has shown that lines between 50-75 characters are ideal for 
          readability. This container is perfect for blog posts, documentation, 
          and any long-form content.
        </p>
      </article>
    </Container>
  )
}`

function ProseDemo() {
  return (
    <Container size="prose">
      <article className="prose dark:prose-invert">
        <h3 className="text-2xl font-bold mb-4">Optimal Reading Width</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The "prose" size container uses a maximum width of 65 characters (65ch), 
          which is considered the optimal line length for reading. This ensures 
          comfortable reading without eye strain from lines that are too long or 
          too short.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Research has shown that lines between 50-75 characters are ideal for 
          readability. This container is perfect for blog posts, documentation, 
          and any long-form content.
        </p>
      </article>
    </Container>
  )
}

const dashboardCode = `import { Container } from "@/components/ui/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContainerDashboardDemo() {
  return (
    <Container size="xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12,345</p>
            <p className="text-sm text-muted-foreground">Active this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$54,321</p>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">+23%</p>
            <p className="text-sm text-muted-foreground">Year over year</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}`

function DashboardDemo() {
  return (
    <Container size="xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12,345</p>
            <p className="text-sm text-muted-foreground">Active this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$54,321</p>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">+23%</p>
            <p className="text-sm text-muted-foreground">Year over year</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}

const fullWidthCode = `import { Container } from "@/components/ui/container"

export function ContainerFullWidthDemo() {
  return (
    <Container size="full" padding="none" className="bg-muted py-12">
      <Container size="xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Full Width Background</h3>
          <p className="text-muted-foreground">
            Nested containers allow full-width backgrounds with contained content.
          </p>
        </div>
      </Container>
    </Container>
  )
}`

function FullWidthDemo() {
  return (
    <Container size="full" padding="none" className="bg-muted py-12">
      <Container size="xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Full Width Background</h3>
          <p className="text-muted-foreground">
            Nested containers allow full-width backgrounds with contained content.
          </p>
        </div>
      </Container>
    </Container>
  )
}

export default function ContainerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Container"
        description="Max-width wrapper for centering and constraining content width. Provides responsive padding and multiple size presets for optimal layouts."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Responsive Sizing",
            description: "Seven preset sizes from sm (640px) to full-width, including prose (65ch) for optimal reading.",
          },
          {
            title: "Semantic HTML",
            description: "Render as any semantic element using the as prop: main, section, article, aside, header, or footer.",
          },
          {
            title: "Flexible Padding",
            description: "Built-in horizontal padding options (none, sm, default, lg) with responsive breakpoints.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="sizes"
        tabs={[
          {
            value: "sizes",
            label: "Sizes",
            demo: (
              <DemoWrapper
                title="Container Sizes"
                description="Seven size variants for different content widths."
                code={sizesCode}
              >
                <SizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "padding",
            label: "Padding",
            demo: (
              <DemoWrapper
                title="Padding Options"
                description="Responsive horizontal padding presets."
                code={paddingCode}
              >
                <PaddingDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "centered",
            label: "Centered",
            demo: (
              <DemoWrapper
                title="Centered Content"
                description="Horizontally and vertically center content within the container."
                code={centeredCode}
              >
                <CenteredDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "semantic",
            label: "Semantic",
            demo: (
              <DemoWrapper
                title="Semantic HTML"
                description="Render containers as semantic HTML elements using the as prop."
                code={semanticCode}
              >
                <SemanticDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "hero",
            label: "Hero",
            demo: (
              <DemoWrapper
                title="Hero Section"
                description="Full-width gradient background with centered content container."
                code={heroCode}
              >
                <HeroDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "prose",
            label: "Prose",
            demo: (
              <DemoWrapper
                title="Prose Content"
                description="Optimal reading width (65ch) for long-form content."
                code={proseCode}
              >
                <ProseDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "dashboard",
            label: "Dashboard",
            demo: (
              <DemoWrapper
                title="Dashboard Cards"
                description="Responsive card grid within a constrained container."
                code={dashboardCode}
              >
                <DashboardDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "fullscreen",
            label: "Full Screen",
            demo: (
              <DemoWrapper
                title="Full Width Background"
                description="Nested containers for full-width backgrounds with contained content."
                code={fullWidthCode}
              >
                <FullWidthDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Basic implementation examples showing common Container patterns."
        code={`import { Container } from "@/components/ui/container"

// Default container (xl max-width)
<Container>
  <h1>Page Content</h1>
</Container>

// Narrow prose container
<Container size="prose">
  <article>Long form content...</article>
</Container>

// Centered content
<Container size="md" centered>
  <HeroSection />
</Container>

// Semantic element
<Container as="main" size="lg">
  <PageContent />
</Container>

// Full-width with nested container
<Container size="full" padding="none" className="bg-muted">
  <Container size="xl">
    <Content />
  </Container>
</Container>

// Custom padding
<Container size="lg" padding="lg">
  <Dashboard />
</Container>`}
      />

      <APIReference
        sections={[
          {
            title: "Container",
            props: [
              {
                prop: "as",
                type: `"div" | "section" | "main" | "article" | "aside" | "header" | "footer"`,
                default: `"div"`,
                description: "Semantic HTML element to render.",
              },
              {
                prop: "size",
                type: `"sm" | "md" | "lg" | "xl" | "2xl" | "full" | "prose"`,
                default: `"xl"`,
                description: "Maximum width of the container. sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px), prose (65ch), or full (100%).",
              },
              {
                prop: "padding",
                type: `"none" | "sm" | "default" | "lg"`,
                default: `"default"`,
                description: "Horizontal padding. none (0), sm (px-3 sm:px-4), default (px-4 sm:px-6 lg:px-8), or lg (px-6 sm:px-8 lg:px-12).",
              },
              {
                prop: "centered",
                type: `boolean`,
                default: `false`,
                description: "Center content within container using flexbox alignment.",
              },
              {
                prop: "className",
                type: `string`,
                default: `-`,
                description: "Additional CSS classes to apply.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
