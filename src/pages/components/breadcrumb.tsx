"use client"

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
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
  IconFolder,
  IconFile,
  IconShoppingCart,
  IconCode,
  IconAccessible,
  IconPalette,
} from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs"

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
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
  )
}

const basicCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbHome,
} from "@/components/ui/breadcrumb"

export function BasicBreadcrumb() {
  return (
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
  )
}

// With home icon
export function BreadcrumbWithHomeIcon() {
  return (
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
  )
}`

function SeparatorsDemo() {
  return (
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
        <h3 className="font-medium text-sm text-muted-foreground">Arrow (Custom)</h3>
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
  )
}

const separatorsCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Chevron separator (default)
<BreadcrumbSeparator variant="chevron" />

// Slash separator
<BreadcrumbSeparator variant="slash" />

// Dot separator
<BreadcrumbSeparator variant="dot" />

// Custom separator (arrow)
<BreadcrumbSeparator>
  <span className="text-muted-foreground/50">→</span>
</BreadcrumbSeparator>`

function EllipsisDemo() {
  const longPath = [
    { href: "/", label: "Home" },
    { href: "/documents", label: "Documents" },
    { href: "/documents/work", label: "Work" },
    { href: "/documents/work/projects", label: "Projects" },
    { href: "/documents/work/projects/2024", label: "2024" },
    { href: "/documents/work/projects/2024/q4", label: "Q4" },
    { href: "/documents/work/projects/2024/q4/report.pdf", label: "report.pdf", current: true },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Manual Ellipsis with Dropdown</h3>
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
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Auto-Collapsible (maxItems=4)</h3>
        <BreadcrumbCollapsible items={longPath} maxItems={4} homeIcon />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Auto-Collapsible (maxItems=3)</h3>
        <BreadcrumbCollapsible 
          items={longPath} 
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
        />
      </div>
    </div>
  )
}

const ellipsisCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbCollapsible,
} from "@/components/ui/breadcrumb"

// Manual ellipsis with dropdown menu
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
      <BreadcrumbPage>Report.pdf</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// Auto-collapsible breadcrumbs
const longPath = [
  { href: "/", label: "Home" },
  { href: "/documents", label: "Documents" },
  { href: "/documents/work", label: "Work" },
  { href: "/documents/work/projects/2024/q4/report.pdf", label: "report.pdf", current: true },
]

<BreadcrumbCollapsible 
  items={longPath} 
  maxItems={4}
  homeIcon
/>`

function DropdownDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Dropdown with Hidden Items</h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbHome href="/" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis
                items={[
                  { href: "/shop", label: "Shop" },
                  { href: "/shop/clothing", label: "Clothing" },
                  { href: "/shop/clothing/mens", label: "Men's" },
                  { href: "/shop/clothing/mens/jackets", label: "Jackets" },
                ]}
              />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop/clothing/mens/jackets/winter">Winter</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Parka Jacket</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">File Browser with Icons</h3>
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
              <BreadcrumbEllipsis
                items={[
                  { href: "/documents/work", label: "Work" },
                  { href: "/documents/work/projects", label: "Projects" },
                  { href: "/documents/work/projects/2024", label: "2024" },
                ]}
              />
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
    </div>
  )
}

const dropdownCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbHome,
} from "@/components/ui/breadcrumb"
import { IconFolder, IconFile } from "@tabler/icons-react"

// Dropdown with hidden navigation items
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbHome href="/" />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis
        items={[
          { href: "/shop", label: "Shop" },
          { href: "/shop/clothing", label: "Clothing" },
          { href: "/shop/clothing/mens", label: "Men's" },
        ]}
      />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Parka Jacket</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// With icons
<BreadcrumbLink href="/documents" className="flex items-center gap-1.5">
  <IconFolder className="h-4 w-4" />
  Documents
</BreadcrumbLink>`

function CustomDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Link Variants</h3>
        <div className="space-y-4">
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

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">Size Variants</h3>
        <div className="space-y-4">
          {(["sm", "default", "lg"] as const).map((size) => (
            <div key={size} className="space-y-1">
              <Badge variant="outline" className="mb-2">{size.toUpperCase()}</Badge>
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
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">With Badges</h3>
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
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">E-commerce with Icons</h3>
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
  )
}

const customCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { IconShoppingCart } from "@tabler/icons-react"

// Link variants: default, underline, ghost
<BreadcrumbLink href="/" variant="underline">Home</BreadcrumbLink>
<BreadcrumbLink href="/" variant="ghost">Home</BreadcrumbLink>

// Size variants: sm, default, lg
<BreadcrumbList size="lg">
  ...
</BreadcrumbList>

// With badges
<BreadcrumbLink href="/components" className="flex items-center gap-2">
  Components
  <Badge variant="secondary" className="text-xs">24</Badge>
</BreadcrumbLink>

// With icons
<BreadcrumbLink href="/shop" className="flex items-center gap-1.5">
  <IconShoppingCart className="h-4 w-4" />
  Shop
</BreadcrumbLink>`

// =============================================================================
// Usage Code
// =============================================================================

const usageCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbHome,
  BreadcrumbEllipsis,
  BreadcrumbCollapsible,
  useBreadcrumbs,
} from "@/components/ui/breadcrumb"

// Basic usage
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// With useBreadcrumbs hook for auto-generation
const breadcrumbs = useBreadcrumbs("/products/electronics/phones", {
  labels: {
    products: "All Products",
    electronics: "Electronics",
    phones: "Phones",
  },
})`

// =============================================================================
// API Reference Data
// =============================================================================

const apiSections = [
  {
    title: "Breadcrumb",
    props: [
      { prop: "children", type: "ReactNode", description: "BreadcrumbList and other content" },
      { prop: "className", type: "string", description: "Additional CSS classes" },
      { prop: "separator", type: "ReactNode", description: "Default separator for all items" },
    ],
  },
  {
    title: "BreadcrumbList",
    props: [
      { prop: "children", type: "ReactNode", description: "BreadcrumbItem components" },
      { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size variant" },
      { prop: "className", type: "string", description: "Additional CSS classes" },
    ],
  },
  {
    title: "BreadcrumbItem",
    props: [
      { prop: "children", type: "ReactNode", description: "Link or page content" },
      { prop: "className", type: "string", description: "Additional CSS classes" },
    ],
  },
  {
    title: "BreadcrumbLink",
    props: [
      { prop: "href", type: "string", description: "Navigation URL" },
      { prop: "variant", type: '"default" | "underline" | "ghost"', default: '"default"', description: "Link styling variant" },
      { prop: "asChild", type: "boolean", default: "false", description: "Render as child element for router Links" },
      { prop: "className", type: "string", description: "Additional CSS classes" },
    ],
  },
  {
    title: "BreadcrumbPage",
    props: [
      { prop: "children", type: "ReactNode", description: "Current page text" },
      { prop: "className", type: "string", description: "Additional CSS classes" },
    ],
  },
  {
    title: "BreadcrumbSeparator",
    props: [
      { prop: "variant", type: '"chevron" | "slash" | "dot"', default: '"chevron"', description: "Separator style" },
      { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size variant" },
      { prop: "children", type: "ReactNode", description: "Custom separator content" },
    ],
  },
  {
    title: "BreadcrumbEllipsis",
    props: [
      { prop: "items", type: "{ href: string; label: string }[]", description: "Hidden items to show in dropdown" },
      { prop: "className", type: "string", description: "Additional CSS classes" },
    ],
  },
]

// =============================================================================
// Features Data
// =============================================================================

const features = [
  {
    title: "SEO Optimized",
    description: "Schema.org BreadcrumbList microdata, JSON-LD structured data component, and semantic HTML with proper ARIA.",
    icon: <IconCode className="h-4 w-4" />,
  },
  {
    title: "Accessible",
    description: "nav landmark with aria-label, aria-current=\"page\" on current item, hidden separators from screen readers.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Customizable",
    description: "asChild for router integration, useBreadcrumbs hook for auto-generation, auto-collapsing for long paths.",
    icon: <IconPalette className="h-4 w-4" />,
  },
]

// =============================================================================
// Demo Tabs Configuration
// =============================================================================

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Breadcrumb"
        description="Simple navigation path with default styling and home icon variants."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "separators",
    label: "Separators",
    demo: (
      <DemoWrapper
        title="Separator Variants"
        description="Chevron, slash, dot, and custom arrow separators."
        code={separatorsCode}
      >
        <SeparatorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ellipsis",
    label: "Ellipsis",
    demo: (
      <DemoWrapper
        title="Collapsed Breadcrumbs"
        description="Ellipsis with dropdown for hidden items and auto-collapsible paths."
        code={ellipsisCode}
      >
        <EllipsisDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dropdown",
    label: "Dropdown",
    demo: (
      <DemoWrapper
        title="Dropdown Menu"
        description="Breadcrumbs with dropdown menus for collapsed navigation."
        code={dropdownCode}
      >
        <DropdownDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "custom",
    label: "Custom",
    demo: (
      <DemoWrapper
        title="Custom Styling"
        description="Link variants, sizes, badges, and icons."
        code={customCode}
      >
        <CustomDemo />
      </DemoWrapper>
    ),
  },
]

// =============================================================================
// Main Page Component
// =============================================================================

export default function BreadcrumbExamplePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Breadcrumb"
        description="Accessible breadcrumb navigation with Schema.org structured data for SEO, responsive collapse, router integration via asChild, and auto-generation from pathname. WCAG 2.1 AA compliant."
        version="v1.0"
        badge={<Badge variant="outline">Enhanced</Badge>}
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use breadcrumb components for navigation paths."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for all breadcrumb components."
      />
    </ComponentPage>
  )
}
