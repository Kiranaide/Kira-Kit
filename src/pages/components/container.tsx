import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContainerPage() {
  return (
    <div className="space-y-12">
      <Container className="pt-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">Container</h1>
          <p className="text-muted-foreground">
            Max-width wrapper for centering and constraining content width.
          </p>
        </header>
      </Container>

      {/* Size Comparison */}
      <section className="space-y-4">
        <Container>
          <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4">
            Container Sizes
          </h2>
        </Container>
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
      </section>

      {/* Padding Options */}
      <section className="space-y-4">
        <Container>
          <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4">
            Padding Options
          </h2>
        </Container>
        <div className="space-y-4 bg-muted/30 py-4">
          {(["none", "sm", "default", "lg"] as const).map((padding) => (
            <Container key={padding} padding={padding} size="lg">
              <div className="bg-primary/20 py-4 rounded-lg text-center">
                <span className="font-mono text-sm">padding="{padding}"</span>
              </div>
            </Container>
          ))}
        </div>
      </section>

      {/* Centered Content */}
      <section className="space-y-4">
        <Container>
          <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4">
            Centered Content
          </h2>
        </Container>
        <Container size="md" centered className="py-8 bg-muted/30">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Centered Container</h3>
            <p className="text-muted-foreground">
              Content inside is centered both horizontally and vertically using flexbox.
            </p>
            <Button>Call to Action</Button>
          </div>
        </Container>
      </section>

      {/* Semantic HTML */}
      <section className="space-y-4">
        <Container>
          <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4">
            Semantic HTML (as prop)
          </h2>
        </Container>
        <Container as="main" className="bg-muted/30 py-8">
          <p className="text-center text-muted-foreground">
            This container renders as a <code className="bg-muted px-1 rounded">&lt;main&gt;</code> element
          </p>
        </Container>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-8">
        <Container>
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Real-World Examples
          </h2>
        </Container>

        {/* Hero Section */}
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

        {/* Prose Content */}
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

        {/* Dashboard Cards */}
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

        {/* Full Width Section */}
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
      </section>

      {/* Usage */}
      <Container className="pb-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">
              {`import { Container } from "@/components/ui/container"

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
</Container>`}
            </pre>
          </div>
        </section>
      </Container>
    </div>
  );
}
