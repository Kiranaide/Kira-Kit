import type { ComponentProps as ReactComponentProps } from "react";
import {
  IconAccessible,
  IconCode,
  IconFile,
  IconFolder,
  IconPalette,
  IconShoppingCart,
  IconStar,
} from "@tabler/icons-react";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbCollapsible,
  BreadcrumbEllipsis,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  KiraBreadcrumb,
} from "@/components/ui/breadcrumb";

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
  );
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
}`;

function SeparatorVariantRow({
  label,
  variant,
  customSeparator,
}: {
  label: string;
  variant?: "chevron" | "slash" | "dot";
  customSeparator?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground">{label}</h3>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator variant={variant}>
            {customSeparator}
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator variant={variant}>
            {customSeparator}
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function SeparatorsDemo() {
  return (
    <div className="space-y-6">
      <SeparatorVariantRow label="Chevron (Default)" variant="chevron" />
      <SeparatorVariantRow label="Slash" variant="slash" />
      <SeparatorVariantRow label="Dot" variant="dot" />
      <SeparatorVariantRow
        label="Arrow (Custom)"
        customSeparator={
          <span className="text-muted-foreground/50" aria-hidden="true">
            →
          </span>
        }
      />
    </div>
  );
}

const separatorsCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<BreadcrumbSeparator variant="chevron" />
<BreadcrumbSeparator variant="slash" />
<BreadcrumbSeparator variant="dot" />
<BreadcrumbSeparator>
  <span className="text-muted-foreground/50" aria-hidden="true">→</span>
</BreadcrumbSeparator>`;

function EllipsisDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Manual Ellipsis with Dropdown
        </h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis items={ellipsisHiddenItems} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/documents/work/projects/2024">
                2024
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Report.pdf</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Auto-Collapsible (maxItems=4)
        </h3>
        <BreadcrumbCollapsible
          items={collapsibleLongPath}
          maxItems={4}
          homeIcon
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Auto-Collapsible (maxItems=3)
        </h3>
        <BreadcrumbCollapsible
          items={collapsibleLongPath}
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
        />
      </div>
    </div>
  );
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

<BreadcrumbCollapsible items={longPath} maxItems={4} homeIcon />`;

function DropdownDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Dropdown with Hidden Items
        </h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbHome href="/" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis items={shopHiddenItems} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop/clothing/mens/jackets/winter">
                Winter
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Parka Jacket</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          File Browser with Icons
        </h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbHome href="/" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/documents"
                className="flex items-center gap-2"
              >
                <IconFolder className="h-4 w-4" aria-hidden="true" />
                Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis items={fileBrowserHiddenItems} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <IconFile className="h-4 w-4" aria-hidden="true" />
                report.pdf
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
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

<BreadcrumbLink href="/documents" className="flex items-center gap-2">
  <IconFolder className="h-4 w-4" aria-hidden="true" />
  Documents
</BreadcrumbLink>`;

function LinkVariantsSection() {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground">
        Link Variants
      </h3>
      <div className="space-y-4">
        {breadcrumbLinkVariantOptions.map((variant) => (
          <Breadcrumb key={variant}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" variant={variant}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components" variant={variant}>
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ))}
      </div>
    </div>
  );
}

function SizeVariantsSection() {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground">
        Size Variants
      </h3>
      <div className="space-y-4">
        {breadcrumbSizeOptions.map((size) => (
          <div key={size} className="space-y-1">
            <Badge variant="outline" className="mb-2">
              {size.toUpperCase()}
            </Badge>
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
  );
}

function BadgesAndIconsSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          With Badges
        </h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/components"
                className="flex items-center gap-2"
              >
                Components
                <Badge variant="secondary" className="text-xs">
                  24
                </Badge>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                Breadcrumb
                <Badge variant="outline" className="text-xs">
                  New
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          E-commerce with Icons
        </h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbHome href="/" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop" className="flex items-center gap-2">
                <IconShoppingCart className="h-4 w-4" aria-hidden="true" />
                Shop
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop/clothing">Clothing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Men&apos;s Jackets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function CustomDemo() {
  return (
    <div className="space-y-8">
      <LinkVariantsSection />
      <SizeVariantsSection />
      <BadgesAndIconsSection />
    </div>
  );
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

<BreadcrumbLink href="/" variant="underline">Home</BreadcrumbLink>
<BreadcrumbLink href="/" variant="ghost">Home</BreadcrumbLink>

<BreadcrumbList size="lg">
  ...
</BreadcrumbList>

<BreadcrumbLink href="/components" className="flex items-center gap-2">
  Components
  <Badge variant="secondary" className="text-xs">24</Badge>
</BreadcrumbLink>

<BreadcrumbLink href="/shop" className="flex items-center gap-2">
  <IconShoppingCart className="h-4 w-4" aria-hidden="true" />
  Shop
</BreadcrumbLink>`;

function KiraDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Flat trail (items[])
        </h3>
        <KiraBreadcrumb items={kiraItems} homeIcon />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Collapse (maxItems=3)
        </h3>
        <KiraBreadcrumb items={kiraItems} collapse maxItems={3} homeIcon />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Responsive (mobile-first)
        </h3>
        <KiraBreadcrumb
          items={kiraItems}
          responsive
          homeIcon
          linkVariant="underline"
        />
      </div>
    </div>
  );
}

const kiraCode = `import { KiraBreadcrumb } from "@/components/ui/breadcrumb"

const items = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/clothing", label: "Clothing" },
  { href: "/shop/clothing/mens/jackets", label: "Jackets", current: true },
]

<KiraBreadcrumb items={items} homeIcon />
<KiraBreadcrumb items={items} collapse maxItems={3} homeIcon />
<KiraBreadcrumb items={items} responsive homeIcon linkVariant="underline" />`;

function TruncationDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Flat trail — links longer than 24 chars render start…end (hover for
          the full label)
        </h3>
        <KiraBreadcrumb items={truncationItems} homeIcon />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Collapse + truncation combined
        </h3>
        <KiraBreadcrumb
          items={truncationItems}
          collapse
          maxItems={3}
          homeIcon
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Responsive — the current page is never truncated
        </h3>
        <KiraBreadcrumb items={truncationItems} responsive homeIcon />
      </div>
    </div>
  );
}

const truncationCode = `import { KiraBreadcrumb } from "@/components/ui/breadcrumb"

// Links longer than 24 characters are middle-truncated to start…end
// (full label in the title tooltip); the current page is never truncated.
<KiraBreadcrumb items={longPath} homeIcon />`;

function MobileMenuDemo() {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground">
        Resize below 768px (md) — the current page becomes a chevron trigger
        listing all ancestors
      </h3>
      <KiraBreadcrumb items={kiraItems} homeIcon mobileMenu />
    </div>
  );
}

const mobileMenuCode = `import { KiraBreadcrumb } from "@/components/ui/breadcrumb"

// Below md: current page + chevron trigger; the menu lists every ancestor.
// At md and up: the plain trail renders instead.
<KiraBreadcrumb items={items} homeIcon mobileMenu />`;

function ScrollDemo() {
  return (
    <div className="max-w-md space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground">
        Horizontally scrollable with edge fade masks
      </h3>
      <KiraBreadcrumb items={scrollDeepItems} overflow="scroll" homeIcon />
    </div>
  );
}

const scrollCode = `import { KiraBreadcrumb } from "@/components/ui/breadcrumb"

<KiraBreadcrumb items={deepItems} overflow="scroll" homeIcon />`;

function CopyActionsDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Copy path affordance
        </h3>
        <KiraBreadcrumb items={kiraItems} homeIcon copyPath />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          Custom actions + copy
        </h3>
        <KiraBreadcrumb
          items={kiraItems}
          homeIcon
          copyPath
          actions={
            <button
              type="button"
              aria-label="Star this page"
              className="grid size-8 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <IconStar className="h-4 w-4" aria-hidden="true" />
            </button>
          }
        />
      </div>
    </div>
  );
}

const copyActionsCode = `import { KiraBreadcrumb } from "@/components/ui/breadcrumb"
import { IconStar } from "@tabler/icons-react"

<KiraBreadcrumb items={items} homeIcon copyPath />

<KiraBreadcrumb
  items={items}
  copyPath
  actions={
    <button type="button" aria-label="Star this page">
      <IconStar className="h-4 w-4" aria-hidden="true" />
    </button>
  }
/>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-6 rounded-lg border border-border p-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Long labels + collapsed middle in narrow container
        </p>
        <KiraBreadcrumb
          items={stressLongItems}
          collapse
          maxItems={3}
          homeIcon
          copyPath
          actions={
            <button
              type="button"
              disabled
              aria-label="Locked page action"
              className="grid size-8 place-items-center rounded-md text-muted-foreground opacity-50"
            >
              <IconStar className="h-4 w-4" aria-hidden="true" />
            </button>
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Horizontal scroll overflow in narrow container
        </p>
        <KiraBreadcrumb
          items={stressLongItems}
          overflow="scroll"
          homeIcon
          size="sm"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Empty items array &amp; single-item root
        </p>
        <KiraBreadcrumb items={[]} />
        <KiraBreadcrumb items={[{ href: "/", label: "Root", current: true }]} />
      </div>
    </div>
  );
}

const stressCode = `import { KiraBreadcrumb } from "@/components/ui/breadcrumb"

<div className="max-w-xs space-y-6">
  <KiraBreadcrumb
    items={longItems}
    collapse
    maxItems={3}
    homeIcon
    copyPath
    actions={
      <button type="button" disabled aria-label="Locked page action">
        <IconStar className="h-4 w-4" aria-hidden="true" />
      </button>
    }
  />
  <KiraBreadcrumb items={longItems} overflow="scroll" homeIcon size="sm" />
  <KiraBreadcrumb items={[]} />
</div>`;

const usageCode = `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  KiraBreadcrumb,
  useBreadcrumbs,
} from "@/components/ui/breadcrumb"

// Composable primitives
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// Data-driven KiraBreadcrumb with useBreadcrumbs
const items = useBreadcrumbs("/products/electronics/phones", {
  labels: { products: "All Products" },
})
<KiraBreadcrumb items={items} collapse maxItems={4} homeIcon copyPath />`;

export default function BreadcrumbDemoPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Breadcrumb"
        description="Accessible breadcrumb navigation with Schema.org structured data for SEO, responsive collapse, Base UI render prop integration, and pathname auto-generation."
        version="v2.1.0"
        badge={<Badge variant="outline">Enhanced</Badge>}
      />

      <FeatureGrid
        features={breadcrumbPageFeatures}
        description="Built-in SEO, overflow, and accessibility capabilities."
      />

      <DemoTabs tabs={breadcrumbPageDemoTabs} defaultValue="kira" />

      <KeyboardShortcuts
        shortcuts={breadcrumbPageShortcuts}
        description="Keyboard navigation and menu bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose primitives manually or pass an items array to KiraBreadcrumb."
        notes={breadcrumbPageUsageNotes}
      />

      <APIReference
        sections={breadcrumbPageAPISections}
        title="API reference"
        description="Props, types, and defaults for every exported breadcrumb part."
      />

      <Changelog
        entries={breadcrumbPageChangelogEntries}
        title="Changelog"
        description="Version history for Breadcrumb."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const breadcrumbLinkVariantOptions = ["default", "underline", "ghost"] as const;

const breadcrumbSizeOptions = ["sm", "default", "lg"] as const;

const ellipsisHiddenItems = [
  { href: "/documents", label: "Documents" },
  { href: "/documents/work", label: "Work" },
  { href: "/documents/work/projects", label: "Projects" },
] satisfies ReactComponentProps<typeof BreadcrumbEllipsis>["items"];

const shopHiddenItems = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/clothing", label: "Clothing" },
  { href: "/shop/clothing/mens", label: "Men's" },
  { href: "/shop/clothing/mens/jackets", label: "Jackets" },
] satisfies ReactComponentProps<typeof BreadcrumbEllipsis>["items"];

const fileBrowserHiddenItems = [
  { href: "/documents/work", label: "Work" },
  { href: "/documents/work/projects", label: "Projects" },
  { href: "/documents/work/projects/2024", label: "2024" },
] satisfies ReactComponentProps<typeof BreadcrumbEllipsis>["items"];

const collapsibleLongPath = [
  { href: "/", label: "Home" },
  { href: "/documents", label: "Documents" },
  { href: "/documents/work", label: "Work" },
  { href: "/documents/work/projects", label: "Projects" },
  { href: "/documents/work/projects/2024", label: "2024" },
  { href: "/documents/work/projects/2024/q4", label: "Q4" },
  {
    href: "/documents/work/projects/2024/q4/report.pdf",
    label: "report.pdf",
    current: true,
  },
] satisfies ReactComponentProps<typeof BreadcrumbCollapsible>["items"];

const kiraItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/clothing", label: "Clothing" },
  { href: "/shop/clothing/mens", label: "Men's" },
  { href: "/shop/clothing/mens/jackets", label: "Jackets", current: true },
] satisfies ReactComponentProps<typeof KiraBreadcrumb>["items"];

const truncationItems = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/workspace/engineering", label: "Engineering" },
  {
    href: "/workspace/engineering/frontend-platform-infrastructure",
    label: "frontend-platform-infrastructure",
  },
  {
    href: "/workspace/engineering/frontend-platform-infrastructure/design-system/packages/ui",
    label: "design-system-packages-monorepo",
    current: true,
  },
] satisfies ReactComponentProps<typeof KiraBreadcrumb>["items"];

const scrollDeepItems = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/workspace/engineering", label: "Engineering" },
  { href: "/workspace/engineering/frontend", label: "Frontend" },
  {
    href: "/workspace/engineering/frontend/design-system",
    label: "Design System",
  },
  {
    href: "/workspace/engineering/frontend/design-system/components",
    label: "Components",
  },
  {
    href: "/workspace/engineering/frontend/design-system/components/breadcrumb",
    label: "Breadcrumb",
    current: true,
  },
] satisfies ReactComponentProps<typeof KiraBreadcrumb>["items"];

const stressLongItems = [
  { href: "/", label: "Home" },
  {
    href: "/enterprise-organization-workspace",
    label: "enterprise-organization-workspace-north-america",
  },
  {
    href: "/enterprise-organization-workspace/infrastructure",
    label: "platform-engineering-shared-infrastructure",
  },
  {
    href: "/enterprise-organization-workspace/infrastructure/release-checklist",
    label: "Q4 Production Release Readiness Checklist",
    current: true,
  },
] satisfies ReactComponentProps<typeof KiraBreadcrumb>["items"];

const breadcrumbPageFeatures = [
  {
    title: "SEO Optimized",
    description:
      "Schema.org BreadcrumbList microdata, JSON-LD structured data component, and semantic HTML with proper ARIA.",
    icon: <IconCode className="h-4 w-4" aria-hidden="true" />,
  },
  {
    title: "Accessible",
    description:
      'nav landmark with aria-label, aria-current="page" on current item, hidden separators from screen readers.',
    icon: <IconAccessible className="h-4 w-4" aria-hidden="true" />,
  },
  {
    title: "Customizable",
    description:
      "Base UI render prop for router integration, useBreadcrumbs hooks for auto-generation, and auto-collapsing for long paths.",
    icon: <IconPalette className="h-4 w-4" aria-hidden="true" />,
  },
  {
    title: "Long-path ready",
    description:
      "Middle truncation on long links (start…end, full label on hover), mobile ancestor menu below md, and icons in every trail mode.",
    icon: <IconFolder className="h-4 w-4" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const breadcrumbPageDemoTabs = [
  {
    value: "kira",
    label: "KiraBreadcrumb",
    group: "KiraBreadcrumb",
    demo: (
      <DemoWrapper
        title="KiraBreadcrumb"
        description="One prop-driven API over the whole family: items[], collapse, responsive, and SEO JSON-LD out of the box."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "truncation",
    label: "Truncation",
    group: "KiraBreadcrumb",
    demo: (
      <DemoWrapper
        title="Middle Truncation"
        description="Links longer than 24 characters render fixed-width start…end with the full label on hover; the current page is never truncated."
        code={truncationCode}
      >
        <TruncationDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "mobile-menu",
    label: "Mobile Menu",
    group: "KiraBreadcrumb",
    demo: (
      <DemoWrapper
        title="Mobile Ancestor Menu"
        description="Below md, the trail collapses to the current page with a chevron trigger listing all ancestors via Base UI Menu."
        code={mobileMenuCode}
      >
        <MobileMenuDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "scroll",
    label: "Scroll Overflow",
    group: "KiraBreadcrumb",
    demo: (
      <DemoWrapper
        title="Scroll Overflow"
        description="A horizontally scrollable trail with edge fade masks — a mobile-friendly alternative to ellipsis collapsing."
        code={scrollCode}
      >
        <ScrollDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "copy-actions",
    label: "Copy + Actions",
    group: "KiraBreadcrumb",
    demo: (
      <DemoWrapper
        title="Copy Path & Actions"
        description="A copy-current-path affordance and a right-aligned region for page-level actions."
        code={copyActionsCode}
      >
        <CopyActionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, collapsed and scrollable trails, disabled actions, and empty states inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const breadcrumbPageShortcuts = [
  {
    keys: "Tab",
    description:
      "Move focus across breadcrumb links, copy button, and ellipsis/mobile menu triggers.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate the focused link or open the focused ellipsis/mobile menu trigger.",
  },
  {
    keys: "Escape",
    description:
      "Close the open menu and return focus to its trigger (provided by Base UI Menu).",
  },
  {
    keys: "ArrowDown / ArrowUp",
    description:
      "Navigate items inside the open ellipsis or mobile ancestor menu (provided by Base UI Menu).",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const breadcrumbPageUsageNotes = [
  {
    label: "KiraBreadcrumb",
    body: "Use KiraBreadcrumb for data-driven trails: pass items[] to get SEO JSON-LD, middle truncation, collapse/scroll/mobileMenu overflow modes, copyPath, and trailing actions in one component.",
  },
  {
    label: "Composable primitives",
    body: "Compose Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink (with Base UI render prop for router links), BreadcrumbPage, and BreadcrumbSeparator when you need custom markup per crumb.",
  },
  {
    label: "Router hooks",
    body: "Use useBreadcrumbs(pathname, options) or useBreadcrumbsFromMatches(matches) to generate items[] directly from router state.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const breadcrumbPageAPISections = [
  {
    title: "Breadcrumb",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "BreadcrumbList and other content.",
      },
      {
        prop: "separator",
        type: "ReactNode",
        default: "-",
        description: "Default separator inherited via context.",
      },
      {
        prop: "maxItems",
        type: "number",
        default: "-",
        description: "Optional max items hint on nav props.",
      },
      {
        prop: "itemsBeforeCollapse",
        type: "number",
        default: "-",
        description: "Optional leading items hint on nav props.",
      },
      {
        prop: "itemsAfterCollapse",
        type: "number",
        default: "-",
        description: "Optional trailing items hint on nav props.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbList",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Typography and gap size variant.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "BreadcrumbItem and BreadcrumbSeparator elements.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbItem",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Link, home link, ellipsis, or page content.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbLink",
    props: [
      {
        prop: "href",
        type: "string",
        default: "-",
        description: "Navigation URL.",
      },
      {
        prop: "variant",
        type: '"default" | "underline" | "ghost"',
        default: '"default"',
        description: "Visual styling variant for the link.",
      },
      {
        prop: "render",
        type: "useRender.RenderProp",
        default: "-",
        description:
          "Custom element or render function for router Link integration (Base UI useRender).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbPage",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Current page label.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbSeparator",
    props: [
      {
        prop: "variant",
        type: '"default" | "chevron" | "slash" | "dot"',
        default: '"default"',
        description: "Separator icon or dot style.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Separator icon size.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Custom separator content overriding variant.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbEllipsis",
    props: [
      {
        prop: "items",
        type: "{ href: string; label: string }[]",
        default: "-",
        description:
          "Hidden items rendered in a Base UI Menu dropdown when provided.",
      },
      {
        prop: "onExpand",
        type: "() => void",
        default: "-",
        description: "Optional expansion callback.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbHome",
    props: [
      {
        prop: "href",
        type: "string",
        default: "-",
        description: "Home URL.",
      },
      {
        prop: "showLabel",
        type: "boolean",
        default: "false",
        description: "Render visible label text next to the home icon.",
      },
      {
        prop: "label",
        type: "string",
        default: '"Home"',
        description: "Accessible label (and visible text when showLabel).",
      },
      {
        prop: "render",
        type: "useRender.RenderProp",
        default: "-",
        description: "Render as a custom element for router Links.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbJsonLd",
    props: [
      {
        prop: "items",
        type: "{ name: string; href: string }[]",
        default: "-",
        description:
          "Trail items serialized to schema.org BreadcrumbList JSON-LD.",
      },
    ],
  },
  {
    title: "BreadcrumbCollapsible",
    props: [
      {
        prop: "items",
        type: "{ href: string; label: string; current?: boolean; icon?: ReactNode }[]",
        default: "-",
        description: "Trail items.",
      },
      {
        prop: "maxItems",
        type: "number",
        default: "4",
        description: "Trail length above which the middle collapses.",
      },
      {
        prop: "itemsBeforeCollapse",
        type: "number",
        default: "1",
        description: "Items kept before the ellipsis.",
      },
      {
        prop: "itemsAfterCollapse",
        type: "number",
        default: "2",
        description: "Items kept after the ellipsis.",
      },
      {
        prop: "separator / size / linkVariant / homeIcon",
        type: "ReactNode | enum | boolean",
        default: "-",
        description: "Shared trail styling props.",
      },
    ],
  },
  {
    title: "BreadcrumbResponsive",
    props: [
      {
        prop: "items",
        type: "{ href: string; label: string; current?: boolean; icon?: ReactNode }[]",
        default: "-",
        description: "Trail items.",
      },
      {
        prop: "mobileItems",
        type: "number",
        default: "2",
        description:
          "Items kept visible on mobile; earlier items move into the ellipsis menu.",
      },
      {
        prop: "separator / size / linkVariant / homeIcon",
        type: "ReactNode | enum | boolean",
        default: "-",
        description: "Shared trail styling props.",
      },
    ],
  },
  {
    title: "BreadcrumbActions",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Right-aligned trailing action controls.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbCopy",
    props: [
      {
        prop: "value",
        type: "string",
        default: "-",
        description: "Path/URL to copy; defaults to window.location.href.",
      },
      {
        prop: "label",
        type: "string",
        default: '"Copy path"',
        description: "Accessible label and status output text.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "BreadcrumbMobileMenu",
    props: [
      {
        prop: "items",
        type: "{ href: string; label: string; current?: boolean; icon?: ReactNode }[]",
        default: "-",
        description:
          "Full trail; the last item becomes the trigger and ancestors populate the menu.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes on the md:hidden wrapper.",
      },
    ],
  },
  {
    title: "KiraBreadcrumb",
    props: [
      {
        prop: "items",
        type: "KiraBreadcrumbItem[]",
        default: "-",
        description: "Trail items with optional current flag and icon.",
      },
      {
        prop: "collapse / maxItems / itemsBeforeCollapse / itemsAfterCollapse",
        type: "boolean | number",
        default: "false",
        description: "Delegate to BreadcrumbCollapsible.",
      },
      {
        prop: "responsive",
        type: "boolean",
        default: "false",
        description: "Delegate to BreadcrumbResponsive.",
      },
      {
        prop: "mobileMenu",
        type: "boolean",
        default: "false",
        description:
          "Below md: current page + chevron trigger listing ancestors.",
      },
      {
        prop: "overflow",
        type: '"collapse" | "scroll"',
        default: '"collapse"',
        description:
          "Scrollable horizontal row with edge fade masks instead of collapsing.",
      },
      {
        prop: "jsonLd",
        type: "boolean",
        default: "true",
        description: "Emit schema.org BreadcrumbList JSON-LD.",
      },
      {
        prop: "actions / copyPath",
        type: "ReactNode | boolean",
        default: "false",
        description: "Trailing BreadcrumbActions region and copy-path button.",
      },
      {
        prop: "separator / size / linkVariant / homeIcon",
        type: "ReactNode | enum | boolean",
        default: "-",
        description: "Shared trail styling props.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const breadcrumbPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "3 November 2026",
    changes: [
      {
        type: "changed",
        title: "Base UI Menu ellipsis",
        description:
          "BreadcrumbEllipsis now builds on @base-ui/react/menu: Escape to close with focus return, arrow-key walking, focus trap, and data-highlighted styling.",
      },
      {
        type: "added",
        title: "Middle truncation",
        description:
          "Links longer than 24 characters render fixed-width start…end with the full label on hover (title attr); the current page is never truncated.",
      },
      {
        type: "added",
        title: "Mobile ancestor menu",
        description:
          "New BreadcrumbMobileMenu export and KiraBreadcrumb mobileMenu prop: below md the trail collapses to the current page with a chevron trigger listing all ancestors.",
      },
      {
        type: "added",
        title: "Icons in collapse & responsive modes",
        description:
          "items[] in BreadcrumbCollapsible and BreadcrumbResponsive now accepts icon, rendered like the flat trail does.",
      },
      {
        type: "fixed",
        title: "Copy error handling",
        description:
          "BreadcrumbCopy clears its copied-flash timer on unmount and surfaces an sr-only 'Copy failed' hint via the existing live region when the clipboard write is rejected.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "22 July 2026",
    changes: [
      {
        type: "added",
        title: "KiraBreadcrumb",
        description:
          "One prop-driven entry point over the whole family: items[], separator, size, collapse, responsive, overflow, actions, copyPath, and SEO JSON-LD.",
      },
      {
        type: "added",
        title: "Copy path & actions",
        description:
          "BreadcrumbCopy copies the current path (with a copied-check flash) and BreadcrumbActions provides a right-aligned region for page-level actions.",
      },
      {
        type: "added",
        title: "Scroll overflow mode",
        description:
          'overflow="scroll" keeps every crumb in a horizontally scrollable row with edge fade masks — a mobile-friendly alternative to collapsing.',
      },
      {
        type: "fixed",
        title: "data-slot type errors",
        description:
          "Resolved two TS2353 errors on BreadcrumbLink and BreadcrumbHome by moving data-slot into a cast mergeProps arg.",
      },
      {
        type: "changed",
        title: "Reduced-motion gating",
        description:
          "Link/home transitions and the ellipsis dropdown animation now respect prefers-reduced-motion via the shared hook and gsap.matchMedia.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
