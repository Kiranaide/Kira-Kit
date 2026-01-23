import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconAccessible, IconPalette, IconStack2 } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
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
  );
}

const basicCode = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`;

function VariantsDemo() {
  return (
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
    </div>
  );
}

const variantsCode = `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Interactive - hover effect with lift
<Card variant="interactive">...</Card>

// Gradient - gradient border and background
<Card variant="gradient">...</Card>

// Glass - glassmorphism with blur
<Card variant="glass">...</Card>

// Outline - transparent with border
<Card variant="outline">...</Card>

// Elevated - shadow for depth
<Card variant="elevated">...</Card>

// Bordered - prominent border
<Card variant="bordered">...</Card>

// Soft - muted background
<Card variant="soft">...</Card>

// Flat - no borders or shadows
<Card variant="flat">...</Card>`;

function GlassDemo() {
  return (
    <div className="relative p-8 rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
      <Card variant="glass" className="max-w-md">
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription>
            See the blur effect behind this card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The backdrop blur creates a frosted glass effect that blurs the
            colorful background behind it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const glassCode = `// Glass card works best over colorful backgrounds
<div className="bg-gradient-to-br from-primary/20 to-secondary/20">
  <Card variant="glass">
    <CardHeader>
      <CardTitle>Glass Card</CardTitle>
      <CardDescription>Glassmorphism effect</CardDescription>
    </CardHeader>
    <CardContent>
      Content with backdrop blur
    </CardContent>
  </Card>
</div>`;

function MoreVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card variant="elevated2" className="max-w-md">
        <CardHeader>
          <CardTitle>Elevated 2</CardTitle>
          <CardDescription>Stronger shadow elevation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            More pronounced shadow for emphasis.
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
  );
}

const moreVariantsCode = `// Elevated 2 - stronger shadow
<Card variant="elevated2">...</Card>

// Flat - no borders or shadows
<Card variant="flat">...</Card>`;

// =============================================================================
// Main Page Component
// =============================================================================

export default function CardPage() {
  const features = [
    {
      title: "Accessible",
      description: "Semantic HTML structure with proper heading hierarchy.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Multiple Variants",
      description: "10 variants including glass, gradient, elevated, and more.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Composable",
      description:
        "Header, Content, Footer, Title, and Description sub-components.",
      icon: <IconStack2 className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Card"
          description="Standard card with header, content, and footer"
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
          title="Card Variants"
          description="Different visual styles for various contexts"
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "glass",
      label: "Glass",
      demo: (
        <DemoWrapper
          title="Glass Card"
          description="Glassmorphism effect with backdrop blur"
          code={glassCode}
        >
          <GlassDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "more",
      label: "More Variants",
      demo: (
        <DemoWrapper
          title="Additional Variants"
          description="Elevated and flat card styles"
          code={moreVariantsCode}
        >
          <MoreVariantsDemo />
        </DemoWrapper>
      ),
    },
  ];

  const usageCode = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// With variant
<Card variant="interactive">...</Card>
<Card variant="gradient">...</Card>
<Card variant="glass">...</Card>
<Card variant="elevated">...</Card>`;

  const apiReference = [
    {
      title: "Card",
      props: [
        {
          prop: "variant",
          type: '"default" | "interactive" | "gradient" | "glass" | "outline" | "elevated" | "elevated2" | "bordered" | "soft" | "flat"',
          default: '"default"',
          description: "Visual style of the card",
        },
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Card content (Header, Content, Footer)",
        },
      ],
    },
    {
      title: "CardHeader",
      props: [
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Header content (Title, Description)",
        },
      ],
    },
    {
      title: "CardTitle",
      props: [
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Title text",
        },
      ],
    },
    {
      title: "CardDescription",
      props: [
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Description text",
        },
      ],
    },
    {
      title: "CardContent",
      props: [
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Main content",
        },
      ],
    },
    {
      title: "CardFooter",
      props: [
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Footer content (actions, buttons)",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Card"
        description="Versatile container component with multiple visual variants for organizing content with headers, bodies, and footers."
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  );
}
