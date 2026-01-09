import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CardPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Card</h1>
        <p className="text-muted-foreground">
          Containers for content with header, body, and footer sections.
        </p>
      </header>

      {/* Basic Card */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Card
        </h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              Card description with additional context.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content area of the card.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </section>

      {/* Card Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Card Variants
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="interactive" className="max-w-md">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Hover to see lift effect.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card has a hover effect with shadow and translation.
              </p>
            </CardContent>
          </Card>
          <Card variant="gradient" className="max-w-md">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription>Beautiful gradient background.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gradient border and background effect.
              </p>
            </CardContent>
          </Card>
          <Card variant="glass" className="max-w-md">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Glassmorphism effect.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Backdrop blur with transparency for modern UI.
              </p>
            </CardContent>
          </Card>
          <Card variant="outline" className="max-w-md">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
              <CardDescription>Transparent with border.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Clean outline style with transparent background.
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="max-w-md">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Card with shadow elevation.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Subtle shadow for depth and hierarchy.
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated2" className="max-w-md">
            <CardHeader>
              <CardTitle>Elevated 2 Card</CardTitle>
              <CardDescription>Stronger shadow elevation.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                More pronounced shadow for emphasis.
              </p>
            </CardContent>
          </Card>
          <Card variant="bordered" className="max-w-md">
            <CardHeader>
              <CardTitle>Bordered Card</CardTitle>
              <CardDescription>Card with prominent border.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Clear border definition for separation.
              </p>
            </CardContent>
          </Card>
          <Card variant="soft" className="max-w-md">
            <CardHeader>
              <CardTitle>Soft Card</CardTitle>
              <CardDescription>Muted background style.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Subtle muted background for gentle contrast.
              </p>
            </CardContent>
          </Card>
          <Card variant="flat" className="max-w-md">
            <CardHeader>
              <CardTitle>Flat Card</CardTitle>
              <CardDescription>Minimal flat design.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No borders or shadows, pure flat design.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Glass Card Demo with Background */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Glass Card with Background
        </h2>
        <p className="text-sm text-muted-foreground">
          Glassmorphism effect works best over colorful backgrounds.
        </p>
        <div className="relative p-8 rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
          <Card variant="glass" className="max-w-md">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>See the blur effect behind this card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The backdrop blur creates a frosted glass effect that blurs the colorful background behind it.
              </p>
            </CardContent>
          </Card>
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
