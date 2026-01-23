import * as React from "react";
import {
  IconFile,
  IconSettings,
  IconLock,
  IconChevronRight,
} from "@tabler/icons-react";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

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
  )
}`;

function DefaultOpenDemo() {
  return (
    <div className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>This is open by default</CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            This collapsible uses the <code>defaultOpen</code> prop to be
            expanded when first rendered.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger>This starts closed</CollapsibleTrigger>
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
          <p className="text-sm text-muted-foreground">
            This collapsible uses the defaultOpen prop to be expanded when first
            rendered.
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
  )
}`;

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Trigger Variants</p>
        <div className="space-y-3">
          <Collapsible>
            <CollapsibleTrigger variant="default">Default</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                Default variant styling.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="info">Info</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                Informational variant with blue pastel background.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="success">Success</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                Success variant with green pastel background.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="warning">Warning</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                Warning variant with yellow pastel background.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="destructive">
              Destructive
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">
                Destructive variant with red pastel background.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Size Variants</p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">xs</p>
            <Collapsible>
              <CollapsibleTrigger size="xs">Extra Small</CollapsibleTrigger>
              <CollapsibleContent size="xs">
                This is extra small content.
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">sm</p>
            <Collapsible>
              <CollapsibleTrigger size="sm">Small</CollapsibleTrigger>
              <CollapsibleContent size="sm">
                This is small content.
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">lg</p>
            <Collapsible>
              <CollapsibleTrigger size="lg">Large</CollapsibleTrigger>
              <CollapsibleContent size="lg">
                This is large content with more padding.
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}

const variantsCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function VariantsCollapsibleDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Trigger Variants</p>
        <div className="space-y-3">
          <Collapsible>
            <CollapsibleTrigger variant="default">Default</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">Default variant styling.</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="info">Info</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">Informational variant.</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="success">Success</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">Success variant.</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="warning">Warning</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">Warning variant.</p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger variant="destructive">Destructive</CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground">Destructive variant.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Size Variants</p>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">xs</p>
            <Collapsible>
              <CollapsibleTrigger size="xs">Extra Small</CollapsibleTrigger>
              <CollapsibleContent size="xs">Extra small content.</CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">sm</p>
            <Collapsible>
              <CollapsibleTrigger size="sm">Small</CollapsibleTrigger>
              <CollapsibleContent size="sm">Small content.</CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">lg</p>
            <Collapsible>
              <CollapsibleTrigger size="lg">Large</CollapsibleTrigger>
              <CollapsibleContent size="lg">Large content.</CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  )
}`;

function CustomDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Custom Chevron</p>
        <Collapsible>
          <CollapsibleTrigger
            chevronIcon={<IconChevronRight className="w-4 h-4" />}
            chevronPosition="end"
          >
            Custom Chevron (Right Arrow)
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground">
              This collapsible uses a custom right arrow icon.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Without Arrow</p>
        <Collapsible>
          <CollapsibleTrigger showArrow={false}>
            Click to expand (no arrow)
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground">
              This collapsible has no chevron arrow indicator.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Inset Content</p>
        <Collapsible>
          <CollapsibleTrigger>Nested Content Example</CollapsibleTrigger>
          <CollapsibleContent inset>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This content has inset padding for visual hierarchy.
              </p>
              <Collapsible>
                <CollapsibleTrigger variant="ghost" size="sm">
                  Nested Collapsible
                </CollapsibleTrigger>
                <CollapsibleContent inset>
                  <p className="text-sm text-muted-foreground">
                    This is a nested collapsible with additional inset padding.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

const customCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { IconChevronRight } from "@tabler/icons-react"

export function CustomCollapsibleDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Custom Chevron</p>
        <Collapsible>
          <CollapsibleTrigger
            chevronIcon={<IconChevronRight className="w-4 h-4" />}
            chevronPosition="end"
          >
            Custom Chevron (Right Arrow)
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground">
              This collapsible uses a custom right arrow icon.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Without Arrow</p>
        <Collapsible>
          <CollapsibleTrigger showArrow={false}>
            Click to expand (no arrow)
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground">
              This collapsible has no chevron arrow indicator.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Inset Content</p>
        <Collapsible>
          <CollapsibleTrigger>
            Nested Content Example
          </CollapsibleTrigger>
          <CollapsibleContent inset>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This content has inset padding for visual hierarchy.
              </p>
              <Collapsible>
                <CollapsibleTrigger variant="ghost" size="sm">
                  Nested Collapsible
                </CollapsibleTrigger>
                <CollapsibleContent inset>
                  <p className="text-sm text-muted-foreground">
                    This is a nested collapsible with additional inset padding.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}`;

function DisabledDemo() {
  return (
    <div className="space-y-4">
      <Collapsible disabled>
        <CollapsibleTrigger>Disabled Collapsible</CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            This collapsible cannot be opened or closed.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible disabled defaultOpen>
        <CollapsibleTrigger>Disabled & Open</CollapsibleTrigger>
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
  )
}`;

const usageCode = `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

// Basic
<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
  <CollapsibleContent>Content here</CollapsibleContent>
</Collapsible>

// Default Open
<Collapsible defaultOpen>
  <CollapsibleTrigger>Open by default</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>

// With Icon
<CollapsibleTrigger icon={<Icon />}>Title</CollapsibleTrigger>

// Variants
<CollapsibleTrigger variant="info">Info</CollapsibleTrigger>
<CollapsibleTrigger variant="success">Success</CollapsibleTrigger>
<CollapsibleTrigger variant="warning">Warning</CollapsibleTrigger>
<CollapsibleTrigger variant="destructive">Destructive</CollapsibleTrigger>
<CollapsibleTrigger variant="ghost">Ghost</CollapsibleTrigger>

// Sizes
<CollapsibleTrigger size="xs">Extra Small</CollapsibleTrigger>
<CollapsibleTrigger size="sm">Small</CollapsibleTrigger>
<CollapsibleTrigger size="default">Default</CollapsibleTrigger>
<CollapsibleTrigger size="lg">Large</CollapsibleTrigger>

// Without Arrow
<CollapsibleTrigger showArrow={false}>No Arrow</CollapsibleTrigger>

// Custom Chevron
<CollapsibleTrigger chevronIcon={<CustomIcon />} chevronPosition="start">
  Title
</CollapsibleTrigger>

// Inset Content (for nesting)
<CollapsibleContent inset>...</CollapsibleContent>

// Disabled
<Collapsible disabled>
  <CollapsibleTrigger>Disabled</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>`;

export default function CollapsiblePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Collapsible"
        description="A collapsible panel that can be toggled open and closed. Supports controlled/uncontrolled modes, icons, variants, and disabled states."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description:
              "WAI-ARIA compliant with proper roles, keyboard navigation (Enter, Space), and screen reader announcements.",
          },
          {
            title: "Customizable",
            description:
              "Supports icons, color variants, sizes, custom chevrons, and disabled states.",
          },
          {
            title: "Performant",
            description:
              "GSAP animations with prefers-reduced-motion support, controlled and uncontrolled modes.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Collapsible"
                description="Simple collapsible panel with toggle trigger and smooth animations."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "multiple",
            label: "Multiple",
            demo: (
              <DemoWrapper
                title="Multiple Collapsibles"
                description="Multiple collapsible panels in a group, each with its own state."
                code={multipleCode}
              >
                <MultipleDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "default-open",
            label: "Default Open",
            demo: (
              <DemoWrapper
                title="Default Open State"
                description="Set the default open state using the defaultOpen prop."
                code={defaultOpenCode}
              >
                <DefaultOpenDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "variants",
            label: "Variants",
            demo: (
              <DemoWrapper
                title="Color & Size Variants"
                description="Visual variants for triggers and content with different color themes and sizes."
                code={variantsCode}
              >
                <VariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "custom",
            label: "Custom",
            demo: (
              <DemoWrapper
                title="Custom Styling"
                description="Custom chevron icons, hide arrows, and inset content for nesting."
                code={customCode}
              >
                <CustomDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "disabled",
            label: "Disabled",
            demo: (
              <DemoWrapper
                title="Disabled Collapsible"
                description="Prevent interaction with the collapsible using the disabled prop."
                code={disabledCode}
              >
                <DisabledDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Tab", description: "Move focus to collapsible trigger" },
          { keys: "Shift + Tab", description: "Move focus from trigger" },
          {
            keys: "Enter / Space",
            description: "Toggle collapsible open/close",
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Collapsible components with various configuration options."
      />

      <APIReference
        sections={[
          {
            title: "Collapsible",
            props: [
              {
                prop: "open",
                type: "boolean",
                default: "-",
                description:
                  "Whether to collapsible is currently open (controlled).",
              },
              {
                prop: "defaultOpen",
                type: "boolean",
                default: "false",
                description:
                  "Whether to collapsible is open by default (uncontrolled).",
              },
              {
                prop: "onOpenChange",
                type: "(open: boolean) => void",
                default: "-",
                description: "Callback when to collapsible opens or closes.",
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
            ],
          },
          {
            title: "CollapsibleTrigger",
            props: [
              {
                prop: "variant",
                type: "'default' | 'info' | 'success' | 'warning' | 'destructive' | 'ghost' | 'outline'",
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
            ],
          },
          {
            title: "CollapsibleContent",
            props: [
              {
                prop: "size",
                type: "'xs' | 'sm' | 'default' | 'lg'",
                default: "'default'",
                description: "Size of the content padding.",
              },
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
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
