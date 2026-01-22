import * as React from "react";

import { IconFile, IconSettings, IconLock } from "@tabler/icons-react";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

function DemoWrapper({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "preview" | "code")}>
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {view === "preview" ? (
          <div className="min-h-[200px]">{children}</div>
        ) : (
          <CodeBlock
            code={code}
            language="tsx"
            wordWrap="bounded"
            minimap={false}
            fontSize={13}
            themeMode="system"
            darkTheme="vitesse-dark"
            lightTheme="github-light"
          />
        )}
      </CardContent>
    </Card>
  );
}

function BasicDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        Click to expand
        <span className="text-xs text-muted-foreground ml-2">
          {open ? "Expanded" : "Collapsed"}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2">
          <p>
            This is the collapsible content. Click the trigger above to toggle
            visibility.
          </p>
          <p className="text-sm text-muted-foreground">
            Collapsible panels are perfect for showing additional information on
            demand.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const basicCode = `import { useState } from "react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function BasicCollapsibleDemo() {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        Click to expand
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p>This is the collapsible content.</p>
      </CollapsibleContent>
    </Collapsible>
  )
}`;

function MultipleDemo() {
  return (
    <div className="space-y-4">
      <Collapsible>
        <CollapsibleTrigger icon={<IconFile className="w-4 h-4" />}>
          File Information
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            Contains metadata about the selected file including size, type, and
            creation date.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger icon={<IconSettings className="w-4 h-4" />}>
          Settings
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            Configure display preferences and application behavior.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger icon={<IconLock className="w-4 h-4" />}>
          Security Options
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            Manage security settings including authentication and permissions.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const multipleCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { IconFile, IconSettings, IconLock } from "@tabler/icons-react"

export function MultipleCollapsibleDemo() {
  return (
    <div className="space-y-4">
      <Collapsible>
        <CollapsibleTrigger icon={<IconFile className="w-4 h-4" />}>
          File Information
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>File metadata here.</p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger icon={<IconSettings className="w-4 h-4" />}>
          Settings
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Settings configuration here.</p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger icon={<IconLock className="w-4 h-4" />}>
          Security Options
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Security settings here.</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}`;

function DefaultOpenDemo() {
  return (
    <div className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>
          This is open by default
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            This collapsible uses the <code>defaultOpen</code> prop to be
            expanded when first rendered.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger>
          This starts closed
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            Without the defaultOpen prop, collapsibles start in a closed state.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const defaultOpenCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function DefaultOpenCollapsibleDemo() {
  return (
    <div className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>
          This is open by default
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Content is visible on first render.</p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger>
          This starts closed
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Content is hidden until toggled.</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}`;

function DisabledDemo() {
  return (
    <div className="space-y-4">
      <Collapsible disabled>
        <CollapsibleTrigger>
          Disabled Collapsible
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            This collapsible cannot be opened or closed.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible disabled defaultOpen>
        <CollapsibleTrigger>
          Disabled & Open
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            Even when open, interaction is disabled.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const disabledCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function DisabledCollapsibleDemo() {
  return (
    <div className="space-y-4">
      <Collapsible disabled>
        <CollapsibleTrigger>
          Disabled Collapsible
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Cannot be interacted with.</p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible disabled defaultOpen>
        <CollapsibleTrigger>
          Disabled & Open
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Content visible but interaction disabled.</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}`;

export function CollapsiblePage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Collapsible</h1>
          <Badge>v1.0</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          A collapsible panel that can be toggled open and closed. Supports
          controlled/uncontrolled modes, icons, variants, and disabled states.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Accessible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            WAI-ARIA compliant with proper roles, keyboard navigation (Enter,
            Space), and screen reader announcements.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Customizable</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Supports icons, color variants, sizes, custom chevrons, and disabled
            states.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performant</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            GSAP animations with prefers-reduced-motion support, controlled and
            uncontrolled modes.
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="multiple">Multiple</TabsTrigger>
          <TabsTrigger value="default-open">Default Open</TabsTrigger>
          <TabsTrigger value="disabled">Disabled</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <DemoWrapper
            title="Basic Collapsible"
            description="Simple collapsible panel with toggle trigger and smooth animations."
            code={basicCode}
          >
            <BasicDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="multiple">
          <DemoWrapper
            title="Multiple Collapsibles"
            description="Multiple collapsible panels in a group, each with its own state."
            code={multipleCode}
          >
            <MultipleDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="default-open">
          <DemoWrapper
            title="Default Open State"
            description="Set the default open state using the defaultOpen prop."
            code={defaultOpenCode}
          >
            <DefaultOpenDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="disabled">
          <DemoWrapper
            title="Disabled Collapsible"
            description="Prevent interaction with the collapsible using the disabled prop."
            code={disabledCode}
          >
            <DisabledDemo />
          </DemoWrapper>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>Full keyboard support for accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { key: "Tab", description: "Move focus to collapsible trigger" },
              { key: "Shift + Tab", description: "Move focus from trigger" },
              { key: "Enter / Space", description: "Toggle collapsible open/close" },
            ].map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <kbd className="rounded border bg-muted px-2 py-1 text-sm font-medium">
                  {shortcut.key}
                </kbd>
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Import and use the Collapsible components with various configuration
            options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

// Basic
<Collapsible>
  <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
  <CollapsibleContent>
    Content here
  </CollapsibleContent>
</Collapsible>

// Controlled
const [open, setOpen] = useState(true)
<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Controlled</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>

// With Icon
<CollapsibleTrigger icon={<Icon />}>Title</CollapsibleTrigger>

// Default Open
<Collapsible defaultOpen>
  <CollapsibleTrigger>Open by default</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>

// Disabled
<Collapsible disabled>
  <CollapsibleTrigger>Disabled</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>`}
            language="tsx"
            wordWrap="bounded"
            minimap={false}
            fontSize={13}
            themeMode="system"
            darkTheme="vitesse-dark"
            lightTheme="github-light"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Component props and configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Collapsible</h3>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Prop</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Default</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      prop: "open",
                      type: "boolean",
                      default: "-",
                      description:
                        "Whether the collapsible is currently open (controlled).",
                    },
                    {
                      prop: "defaultOpen",
                      type: "boolean",
                      default: "false",
                      description:
                        "Whether the collapsible is open by default (uncontrolled).",
                    },
                    {
                      prop: "onOpenChange",
                      type: "(open: boolean) => void",
                      default: "-",
                      description: "Callback when the collapsible opens or closes.",
                    },
                    {
                      prop: "disabled",
                      type: "boolean",
                      default: "false",
                      description: "Disable interaction with the collapsible.",
                    },
                    {
                      prop: "className",
                      type: "string",
                      default: "-",
                      description: "Additional CSS classes.",
                    },
                  ].map((row) => (
                    <tr key={row.prop} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1 text-xs">
                          {row.prop}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.default}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">CollapsibleTrigger</h3>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Prop</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Default</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      prop: "variant",
                      type: "'default' | 'info' | 'success' | 'warning' | 'destructive' | 'ghost' | 'outline' | 'link'",
                      default: "'default'",
                      description: "Visual style variant of the trigger.",
                    },
                    {
                      prop: "size",
                      type: "'xs' | 'sm' | 'default' | 'lg'",
                      default: "'default'",
                      description: "Size of the trigger.",
                    },
                    {
                      prop: "showArrow",
                      type: "boolean",
                      default: "true",
                      description: "Show or hide the default chevron arrow.",
                    },
                    {
                      prop: "chevronIcon",
                      type: "ReactNode",
                      default: "-",
                      description: "Custom icon to replace the default chevron.",
                    },
                    {
                      prop: "chevronPosition",
                      type: "'start' | 'end'",
                      default: "'end'",
                      description: "Position of the chevron icon.",
                    },
                    {
                      prop: "icon",
                      type: "ReactNode",
                      default: "-",
                      description: "Icon displayed before the trigger text.",
                    },
                    {
                      prop: "className",
                      type: "string",
                      default: "-",
                      description: "Additional CSS classes.",
                    },
                  ].map((row) => (
                    <tr key={row.prop} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1 text-xs">
                          {row.prop}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.default}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">CollapsibleContent</h3>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Prop</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Default</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      prop: "inset",
                      type: "boolean",
                      default: "false",
                      description: "Add left padding for nested content.",
                    },
                    {
                      prop: "lazyMount",
                      type: "boolean",
                      default: "false",
                      description: "Defer rendering until first open.",
                    },
                    {
                      prop: "showSkeleton",
                      type: "boolean",
                      default: "false",
                      description: "Show skeleton loading state before mount.",
                    },
                    {
                      prop: "skeletonLines",
                      type: "number",
                      default: "3",
                      description: "Number of skeleton lines to show.",
                    },
                    {
                      prop: "className",
                      type: "string",
                      default: "-",
                      description: "Additional CSS classes.",
                    },
                  ].map((row) => (
                    <tr key={row.prop} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1 text-xs">
                          {row.prop}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.default}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
