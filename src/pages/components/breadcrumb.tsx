"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbEllipsis,
  BreadcrumbSeparator,
  BreadcrumbHome,
  BreadcrumbCollapsible,
  BreadcrumbResponsive,
  useBreadcrumbs,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconFolder,
  IconFile,
  IconShoppingCart,
  IconCode,
} from "@tabler/icons-react"

export default function BreadcrumbPages() {
  // Demo: useBreadcrumbs hook
  const demoBreadcrumbs = useBreadcrumbs("/products/electronics/phones/iphone-15", {
    labels: {
      products: "All Products",
      electronics: "Electronics",
      phones: "Phones",
      "iphone-15": "iPhone 15 Pro",
    },
  })

  // Long path for collapsible demo
  const longPath = [
    { href: "/", label: "Home" },
    { href: "/documents", label: "Documents" },
    { href: "/documents/work", label: "Work" },
    { href: "/documents/work/projects", label: "Projects" },
    { href: "/documents/work/projects/2024", label: "2024" },
    { href: "/documents/work/projects/2024/q4", label: "Q4" },
    { href: "/documents/work/projects/2024/q4/report.pdf", label: "report.pdf", current: true },
  ]

  // E-commerce path
  const ecommercePath = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/shop/clothing", label: "Clothing" },
    { href: "/shop/clothing/mens", label: "Men's" },
    { href: "/shop/clothing/mens/jackets", label: "Jackets", current: true },
  ]

  return (
    <div className="container mx-auto py-8 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Breadcrumb</h1>
          <Badge variant="outline">Enhanced</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Accessible breadcrumb navigation with Schema.org structured data for SEO,
          responsive collapse, router integration via asChild, and auto-generation
          from pathname. WCAG 2.1 AA compliant.
        </p>
      </div>

      {/* Features Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IconCode className="h-4 w-4" />
                SEO Optimized
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Schema.org BreadcrumbList microdata</li>
                <li>• JSON-LD structured data component</li>
                <li>• Semantic HTML with proper ARIA</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• <code className="text-xs bg-muted px-1 rounded">nav</code> landmark with <code className="text-xs bg-muted px-1 rounded">aria-label</code></li>
                <li>• <code className="text-xs bg-muted px-1 rounded">aria-current="page"</code> on current</li>
                <li>• Hidden separators from screen readers</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Developer Experience</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• <code className="text-xs bg-muted px-1 rounded">asChild</code> for router integration</li>
                <li>• <code className="text-xs bg-muted px-1 rounded">useBreadcrumbs</code> hook</li>
                <li>• Auto-collapsing for long paths</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Basic Breadcrumb */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Breadcrumb</h2>
        <p className="text-muted-foreground">Simple navigation path with default styling.</p>

        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* With Home Icon */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Home Icon</h2>
        <p className="text-muted-foreground">
          Use BreadcrumbHome for an icon-based home link.
        </p>

        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbHome href="/" />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Electronics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbHome href="/" showLabel label="Home" />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Electronics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Separator Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Separator Variants</h2>
        <p className="text-muted-foreground">
          Chevron (default), slash, and dot separators.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Chevron (Default)</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator variant="chevron" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator variant="chevron" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Slash</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator variant="slash" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator variant="slash" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Dot</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator variant="dot" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator variant="dot" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Custom Separator</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="text-muted-foreground/50">→</span>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="text-muted-foreground/50">→</span>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <p className="text-muted-foreground">Small, default, and large sizes.</p>

        <div className="space-y-6">
          {(["sm", "default", "lg"] as const).map((size) => (
            <div key={size} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground capitalize">{size}</h3>
              <Breadcrumb>
                <BreadcrumbList size={size}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size={size} />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator size={size} />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          ))}
        </div>
      </section>

      {/* Link Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Link Variants</h2>
        <p className="text-muted-foreground">Different link styling options.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Default</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" variant="default">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components" variant="default">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Underline</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" variant="underline">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components" variant="underline">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Ghost</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" variant="ghost">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components" variant="ghost">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* With Ellipsis */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Ellipsis</h2>
        <p className="text-muted-foreground">
          Collapsed middle items with dropdown to reveal hidden items.
        </p>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis
                items={[
                  { href: "/documents", label: "Documents" },
                  { href: "/documents/work", label: "Work" },
                  { href: "/documents/work/projects", label: "Projects" },
                ]}
              />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/documents/work/projects/2024">2024</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Report.pdf</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      {/* Auto-Collapsible */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Auto-Collapsible</h2>
        <p className="text-muted-foreground">
          Automatically collapses long paths with configurable limits.
          Click the ellipsis to expand.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">maxItems=4</h3>
            <BreadcrumbCollapsible items={longPath} maxItems={4} homeIcon />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">maxItems=3</h3>
            <BreadcrumbCollapsible 
              items={longPath} 
              maxItems={3}
              itemsBeforeCollapse={1}
              itemsAfterCollapse={1}
            />
          </div>
        </div>
      </section>

      {/* Responsive */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive</h2>
        <p className="text-muted-foreground">
          Automatically shows fewer items on mobile. Resize the browser to see the effect.
        </p>

        <BreadcrumbResponsive
          items={ecommercePath}
          mobileItems={2}
          homeIcon
        />
      </section>

      {/* useBreadcrumbs Hook */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">useBreadcrumbs Hook</h2>
        <p className="text-muted-foreground">
          Generate breadcrumbs automatically from a pathname with custom label mapping.
        </p>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`const breadcrumbs = useBreadcrumbs("/products/electronics/phones/iphone-15", {
  labels: {
    products: "All Products",
    electronics: "Electronics",
    phones: "Phones",
    "iphone-15": "iPhone 15 Pro",
  },
})`}
            </pre>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              {demoBreadcrumbs.map((item, index) => (
                <React.Fragment key={item.href}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.current ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* JSON-LD for SEO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">JSON-LD Structured Data</h2>
        <p className="text-muted-foreground">
          Generates Schema.org BreadcrumbList JSON-LD for search engine optimization.
        </p>

        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`<BreadcrumbJsonLd
  items={[
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Electronics", href: "/products/electronics" },
  ]}
/>

// Generates:
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://example.com/products" },
    { "@type": "ListItem", "position": 3, "name": "Electronics", "item": "https://example.com/products/electronics" }
  ]
}`}
          </pre>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons</h2>
        <p className="text-muted-foreground">
          Add icons to breadcrumb items for visual context.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">File Browser</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbHome href="/" />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/documents" className="flex items-center gap-1.5">
                    <IconFolder className="h-4 w-4" />
                    Documents
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/documents/work" className="flex items-center gap-1.5">
                    <IconFolder className="h-4 w-4" />
                    Work
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <IconFile className="h-4 w-4" />
                    report.pdf
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">E-commerce</h3>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbHome href="/" />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/shop" className="flex items-center gap-1.5">
                    <IconShoppingCart className="h-4 w-4" />
                    Shop
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/shop/clothing">Clothing</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Men's Jackets</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* With Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Badges</h2>
        <p className="text-muted-foreground">Items with status or count badges.</p>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components" className="flex items-center gap-2">
                Components
                <Badge variant="secondary" className="text-xs">24</Badge>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                Breadcrumb
                <Badge variant="outline" className="text-xs">New</Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-2">BreadcrumbLink Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Prop</th>
                    <th className="text-left py-2 pr-4 font-medium">Type</th>
                    <th className="text-left py-2 pr-4 font-medium">Default</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>variant</code></td>
                    <td className="py-2 pr-4">"default" | "underline" | "ghost"</td>
                    <td className="py-2 pr-4">"default"</td>
                    <td className="py-2">Link styling variant</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>asChild</code></td>
                    <td className="py-2 pr-4">boolean</td>
                    <td className="py-2 pr-4">false</td>
                    <td className="py-2">Render as child element (for router Links)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">BreadcrumbCollapsible Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Prop</th>
                    <th className="text-left py-2 pr-4 font-medium">Type</th>
                    <th className="text-left py-2 pr-4 font-medium">Default</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>items</code></td>
                    <td className="py-2 pr-4">BreadcrumbItem[]</td>
                    <td className="py-2 pr-4">required</td>
                    <td className="py-2">Array of breadcrumb items</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>maxItems</code></td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2 pr-4">4</td>
                    <td className="py-2">Max visible items before collapsing</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>itemsBeforeCollapse</code></td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2 pr-4">1</td>
                    <td className="py-2">Items to show before ellipsis</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>itemsAfterCollapse</code></td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2 pr-4">2</td>
                    <td className="py-2">Items to show after ellipsis</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>homeIcon</code></td>
                    <td className="py-2 pr-4">boolean</td>
                    <td className="py-2 pr-4">false</td>
                    <td className="py-2">Show home icon for first item</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">useBreadcrumbs Options</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Option</th>
                    <th className="text-left py-2 pr-4 font-medium">Type</th>
                    <th className="text-left py-2 pr-4 font-medium">Default</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>labels</code></td>
                    <td className="py-2 pr-4">Record&lt;string, string&gt;</td>
                    <td className="py-2 pr-4">{"{}"}</td>
                    <td className="py-2">Custom labels for path segments</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>includeHome</code></td>
                    <td className="py-2 pr-4">boolean</td>
                    <td className="py-2 pr-4">true</td>
                    <td className="py-2">Include home item</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>homeLabel</code></td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">"Home"</td>
                    <td className="py-2">Label for home item</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>basePath</code></td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">""</td>
                    <td className="py-2">Base path to strip from beginning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
