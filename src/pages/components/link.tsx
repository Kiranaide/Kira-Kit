import * as React from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  IconArrowRight,
  IconExternalLink,
  IconArrowLeft,
  IconArrowUp,
  IconDownload,
  IconShare,
  IconCopy,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

function BasicLinksDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Text Links</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Link to="/" className="text-primary hover:underline underline-offset-4">
            Default Link
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
            Muted Link
          </Link>
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Medium Weight
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Inline Links</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This is an example of{" "}
          <Link to="/" className="text-primary hover:underline underline-offset-4 font-medium">
            inline links
          </Link>{" "}
          within paragraph text. They maintain readability while providing clear
          navigation cues.
        </p>
      </div>
    </div>
  )
}

const basicLinksCode = `import { Link } from "@tanstack/react-router"

// Basic text links
<Link to="/">Default Link</Link>

// Muted/secondary link
<Link to="/" className="text-muted-foreground hover:text-foreground hover:underline">
  Muted Link
</Link>

// Inline link in text
<p>
  This is an{" "}
  <Link to="/" className="text-primary hover:underline">
    inline link
  </Link>{" "}
  within paragraph.
</p>`

function ButtonLinksDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Link Variant</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="link">Link Button</Button>
          <Button variant="link" className="text-destructive">
            Destructive Link
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Semantic Colors</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="link" className="text-primary hover:text-primary/80">
            Primary Link
          </Button>
          <Button variant="link" className="text-info hover:text-info/80">
            Info Link
          </Button>
          <Button variant="link" className="text-success hover:text-success/80">
            Success Link
          </Button>
          <Button variant="link" className="text-warning hover:text-warning/80">
            Warning Link
          </Button>
        </div>
      </div>
    </div>
  )
}

const buttonLinksCode = `import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

// Basic link button
<Button variant="link">Link Button</Button>

// Semantic colored links
<Button variant="link" className="text-destructive">
  Delete Link
</Button>

<Button variant="link" className="text-success">
  Success Link
</Button>`

function LinksWithIconsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Icon Links</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Link to="/" className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            Read More
            <IconArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            View Docs
            <IconExternalLink className="w-4 h-4" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1">
            <IconArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Action Links</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
            <IconDownload className="w-4 h-4" />
            Download
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
            <IconShare className="w-4 h-4" />
            Share
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted text-sm font-medium transition-colors">
            <IconCopy className="w-4 h-4" />
            Copy Link
          </Link>
        </div>
      </div>
    </div>
  )
}

const linksWithIconsCode = `import { Link } from "@tanstack/react-router"
import { IconArrowRight, IconDownload } from "@tabler/icons-react"

// Link with trailing icon
<Link to="/" className="inline-flex items-center gap-1">
  Read More
  <IconArrowRight className="w-4 h-4" />
</Link>

// External link indicator
<Link to="/" className="inline-flex items-center gap-1">
  View Docs
  <IconExternalLink className="w-4 h-4" />
</Link>

// Link with leading icon
<Link to="/" className="inline-flex items-center gap-1">
  <IconArrowLeft className="w-4 h-4" />
  Go Back
</Link>

// Action link with icon
<Link to="/" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80">
  <IconDownload className="w-4 h-4" />
  Download
</Link>`

function ExternalLinksDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">External Links</h3>
        <div className="space-y-2">
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
          >
            External Link
            <IconExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-xs text-muted-foreground">
            External links should have target="_blank" and rel="noopener noreferrer"
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Download Links</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="#"
            download
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
          >
            <IconDownload className="w-4 h-4" />
            PDF Download
          </a>
          <a
            href="#"
            download
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-muted text-sm font-medium transition-colors"
          >
            <IconDownload className="w-4 h-4" />
            CSV Export
          </a>
        </div>
      </div>
    </div>
  )
}

const externalLinksCode = `// External link (opens in new tab)
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary hover:underline inline-flex items-center gap-1"
>
  External Link
  <IconExternalLink className="w-4 h-4" />
</a>

// Download link
<a
  href="/files/document.pdf"
  download
  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary"
>
  <IconDownload className="w-4 h-4" />
  PDF Download
</a>

// TanStack Router external link
<Link
  to="https://example.com"
  target="_blank"
  className="text-primary hover:underline"
>
  External Link
</Link>`

function ActiveStatesDemo() {
  const [activeLink, setActiveLink] = React.useState("home")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Active State</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveLink("home")}
            className={activeLink === "home" ? "text-primary font-medium underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}
          >
            Home
          </button>
          <button
            onClick={() => setActiveLink("about")}
            className={activeLink === "about" ? "text-primary font-medium underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}
          >
            About
          </button>
          <button
            onClick={() => setActiveLink("contact")}
            className={activeLink === "contact" ? "text-primary font-medium underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}
          >
            Contact
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Active: {activeLink}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Visited State</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
            Visited Link Style
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use :visited pseudo-class for visited links
        </p>
      </div>
    </div>
  )
}

const activeStatesCode = `import { useState } from "react"

// Active link with state
const [activeLink, setActiveLink] = useState("home")

<button
  onClick={() => setActiveLink("home")}
  className={activeLink === "home" ? "text-primary font-medium underline" : "text-muted-foreground"}
>
  Home
</button>

// TanStack Router active link
import { Link, useMatch } from "@tanstack/react-router"

const isHomeActive = useMatch({ to: "/" })

<Link
  to="/"
  className={isHomeActive ? "text-primary font-medium" : "text-muted-foreground"}
>
  Home
</Link>

// Visited state via CSS
a:visited {
  color: hsl(var(--primary) / 0.7);
}`

function HoverEffectsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Hover Effects</h3>
        <div className="space-y-3">
          <Link to="/" className="text-primary hover:text-primary/70 hover:underline underline-offset-4 transition-colors">
            Fade & Underline
          </Link>
          <br />
          <Link to="/" className="text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1 rounded transition-colors">
            Background Highlight
          </Link>
          <br />
          <Link to="/" className="inline-flex items-center gap-2 hover:translate-x-1 transition-transform">
            Slide Right
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Focus States</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
            Ring Focus
          </Link>
          <Link to="/" className="text-primary focus:outline-none focus:underline focus:underline-offset-4 focus:decoration-2">
            Underline Focus
          </Link>
        </div>
      </div>
    </div>
  )
}

const hoverEffectsCode = `// Hover effects
<Link to="/" className="text-primary hover:text-primary/70 hover:underline">
  Fade & Underline
</Link>

<Link to="/" className="text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1">
  Background Highlight
</Link>

// Slide animation on hover
<Link to="/" className="hover:translate-x-1 transition-transform inline-flex items-center gap-2">
  Slide Right
  <IconArrowRight className="w-4 h-4" />
</Link>

// Focus states for accessibility
<Link to="/" className="text-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
  Ring Focus
</Link>

<Link to="/" className="text-primary focus:outline-none focus:underline focus:underline-offset-4">
  Underline Focus
</Link>`

function DisabledLinksDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Disabled Links</h3>
        <div className="flex flex-wrap gap-3">
          <span className="text-muted-foreground cursor-not-allowed opacity-50">
            Disabled Link
          </span>
          <span className="text-muted-foreground/60 cursor-not-allowed decoration-muted-foreground/30 line-through">
            Unavailable Action
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use span for disabled links since true anchor elements cannot be disabled
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Action Links (Disabled)</h3>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-muted-foreground/50 cursor-not-allowed">
            <IconEye className="w-4 h-4" />
            View
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground/50 cursor-not-allowed">
            <IconEdit className="w-4 h-4" />
            Edit
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 text-destructive/50 cursor-not-allowed">
            <IconTrash className="w-4 h-4" />
            Delete
          </span>
        </div>
      </div>
    </div>
  )
}

const disabledLinksCode = `// Disabled link (use span, not a tag)
<span className="text-muted-foreground cursor-not-allowed opacity-50">
  Disabled Link
</span>

// Disabled action link
<span className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground/50 cursor-not-allowed">
  <IconEye className="w-4 h-4" />
  View
</span>

// Unavailable action
<span className="text-muted-foreground/60 cursor-not-allowed decoration-muted-foreground/30 line-through">
  Unavailable Action
</span>`

function BreadcrumbStyleDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Breadcrumb Navigation</h3>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link to="/components/button" className="text-muted-foreground hover:text-foreground">
            Components
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium">Links</span>
        </nav>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">With Icons</h3>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <IconArrowUp className="w-3.5 h-3.5" />
            Up
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link to="/components/button" className="text-muted-foreground hover:text-foreground">
            Components
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground">Links</span>
        </nav>
      </div>
    </div>
  )
}

const breadcrumbStyleCode = `// Breadcrumb navigation
<nav className="flex items-center gap-2 text-sm">
  <Link to="/" className="text-muted-foreground hover:text-foreground">
    Home
  </Link>
  <span className="text-muted-foreground/50">/</span>
  <Link to="/components/button" className="text-muted-foreground hover:text-foreground">
    Components
  </Link>
  <span className="text-muted-foreground/50">/</span>
  <span className="text-foreground font-medium">Links</span>
</nav>

// With icons
<nav className="flex items-center gap-2 text-sm">
  <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
    <IconArrowUp className="w-3.5 h-3.5" />
    Up
  </Link>
  <span className="text-muted-foreground/50">/</span>
  <Link to="/components/button" className="text-muted-foreground hover:text-foreground">
    Components
  </Link>
  <span className="text-muted-foreground/50">/</span>
  <span className="text-foreground">Links</span>
</nav>`

export function LinkPage() {
  const features = [
    {
      title: "Navigation",
      description: "TanStack Router Link component for client-side navigation with prefetching.",
      icon: <IconArrowRight className="w-4 h-4 text-primary" />,
    },
    {
      title: "Flexible Styles",
      description: "Link variant buttons, styled anchors, and inline text links for any use case.",
      icon: <IconExternalLink className="w-4 h-4 text-primary" />,
    },
    {
      title: "Accessible",
      description: "Proper focus states, keyboard navigation, and ARIA attributes for screen readers.",
      icon: <IconEye className="w-4 h-4 text-primary" />,
    },
  ]

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Links"
          description="Simple text and inline links for navigation"
          code={basicLinksCode}
        >
          <BasicLinksDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "button",
      label: "Button Links",
      demo: (
        <DemoWrapper
          title="Button Variant Links"
          description="Using Button component with link variant for styled navigation"
          code={buttonLinksCode}
        >
          <ButtonLinksDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "icons",
      label: "With Icons",
      demo: (
        <DemoWrapper
          title="Links with Icons"
          description="Add icons for visual context and action indicators"
          code={linksWithIconsCode}
        >
          <LinksWithIconsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "external",
      label: "External",
      demo: (
        <DemoWrapper
          title="External & Download Links"
          description="External links that open in new tabs and download links"
          code={externalLinksCode}
        >
          <ExternalLinksDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "active",
      label: "States",
      demo: (
        <DemoWrapper
          title="Active & Visited States"
          description="Visual feedback for current page and visited links"
          code={activeStatesCode}
        >
          <ActiveStatesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "hover",
      label: "Hover & Focus",
      demo: (
        <DemoWrapper
          title="Hover & Focus Effects"
          description="Interactive states with animations and focus indicators"
          code={hoverEffectsCode}
        >
          <HoverEffectsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "disabled",
      label: "Disabled",
      demo: (
        <DemoWrapper
          title="Disabled Links"
          description="Non-interactive links for disabled or unavailable actions"
          code={disabledLinksCode}
        >
          <DisabledLinksDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "breadcrumb",
      label: "Breadcrumb",
      demo: (
        <DemoWrapper
          title="Breadcrumb Style"
          description="Navigation breadcrumbs with hierarchical paths"
          code={breadcrumbStyleCode}
        >
          <BreadcrumbStyleDemo />
        </DemoWrapper>
      ),
    },
  ]

  const keyboardShortcuts = [
    { keys: "Tab", description: "Move focus to next link" },
    { keys: "Shift + Tab", description: "Move focus to previous link" },
    { keys: "Enter", description: "Activate focused link" },
    { keys: "Space", description: "Activate focused link" },
  ]

  const usageCode = `import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

// Basic navigation link
<Link to="/dashboard">Dashboard</Link>

// External link
<Link
  to="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  External Site
</Link>

// Button with link styling
<Button variant="link">Link Button</Button>

// Navigation button
<Button variant="link" asChild>
  <Link to="/settings">Settings</Link>
</Button>

// Link with icon
<Link to="/" className="inline-flex items-center gap-2">
  <IconArrowRight className="w-4 h-4" />
  Continue
</Link>`

  const apiReference = [
    {
      title: "Link (TanStack Router)",
      props: [
        { prop: "to", type: "string | ToPathOption", default: "-", description: "Target route path or path object" },
        { prop: "target", type: '"_blank" | "_self" | "_parent" | "_top"', default: '"_self"', description: "Where to open the link" },
        { prop: "reloadDocument", type: "boolean", default: "false", description: "Force a full document reload" },
        { prop: "preload", type: '"intent" | "render" | "false"', default: '"intent"', description: "When to preload the route" },
        { prop: "activeProps", type: "object", default: "-", description: "Props to apply when link is active" },
        { prop: "inactiveProps", type: "object", default: "-", description: "Props to apply when link is inactive" },
        { prop: "...props", type: "AnchorHTMLAttributes", default: "-", description: "All anchor element props" },
      ],
    },
    {
      title: "Button (link variant)",
      props: [
        { prop: "variant", type: '"link"', default: "-", description: "Set to 'link' for link styling" },
        { prop: "asChild", type: "boolean", default: "false", description: "Render as child element (e.g., Link)" },
        { prop: "className", type: "string", default: "-", description: "Additional CSS classes" },
        { prop: "...props", type: "ButtonProps", default: "-", description: "All Button props supported" },
      ],
    },
  ]

  return (
    <ComponentPage>
      <PageHeader
        title="Link"
        description="Navigation links using TanStack Router Link component and Button link variant. Includes external links, downloads, breadcrumbs, and various interactive states."
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  )
}
