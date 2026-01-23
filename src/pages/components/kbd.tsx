import { Kbd, KbdShortcut } from "@/components/ui/kbd";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
} from "@/components/docs";

const basicCode = `import { Kbd } from "@/components/ui/kbd"

export function BasicKbdDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>Alt</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  )
}`;

function BasicDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>Alt</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  );
}

const variantsCode = `import { Kbd } from "@/components/ui/kbd"

export function VariantsKbdDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Kbd variant="default">Ctrl</Kbd>
      <Kbd variant="outline">Ctrl</Kbd>
      <Kbd variant="ghost">Ctrl</Kbd>
    </div>
  )
}`;

function VariantsDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Kbd variant="default">Ctrl</Kbd>
      <Kbd variant="outline">Ctrl</Kbd>
      <Kbd variant="ghost">Ctrl</Kbd>
    </div>
  );
}

const sizesCode = `import { Kbd } from "@/components/ui/kbd"

export function SizesKbdDemo() {
  return (
    <div className="flex items-center gap-4">
      <Kbd size="sm">K</Kbd>
      <Kbd size="default">K</Kbd>
      <Kbd size="lg">K</Kbd>
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Kbd size="sm">K</Kbd>
      <Kbd size="default">K</Kbd>
      <Kbd size="lg">K</Kbd>
    </div>
  );
}

const shortcutsCode = `import { KbdShortcut } from "@/components/ui/kbd"

export function ShortcutsKbdDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Save</span>
        <KbdShortcut keys={["⌘", "S"]} />
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Copy</span>
        <KbdShortcut keys={["Ctrl", "C"]} />
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Paste</span>
        <KbdShortcut keys={["Ctrl", "V"]} />
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Find</span>
        <KbdShortcut keys={["Ctrl", "Shift", "F"]} />
      </div>
    </div>
  )
}`;

function ShortcutsDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Save</span>
        <KbdShortcut keys={["⌘", "S"]} />
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Copy</span>
        <KbdShortcut keys={["Ctrl", "C"]} />
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Paste</span>
        <KbdShortcut keys={["Ctrl", "V"]} />
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
        <span className="text-sm">Find</span>
        <KbdShortcut keys={["Ctrl", "Shift", "F"]} />
      </div>
    </div>
  );
}

const inlineCode = `import { Kbd } from "@/components/ui/kbd"

export function InlineKbdDemo() {
  return (
    <p className="text-sm text-muted-foreground">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open the command palette, or use{" "}
      <Kbd>Esc</Kbd> to close it.
    </p>
  )
}`;

function InlineDemo() {
  return (
    <p className="text-sm text-muted-foreground">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open the command palette, or use{" "}
      <Kbd>Esc</Kbd> to close it.
    </p>
  );
}

const usageCode = `import { Kbd, KbdShortcut } from "@/components/ui/kbd"

// Single key
<Kbd>⌘</Kbd>

// With variants
<Kbd variant="outline" size="sm">K</Kbd>

// Keyboard shortcut
<KbdShortcut keys={["Ctrl", "Shift", "P"]} />`;

export default function KbdPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Kbd"
        description="Display keyboard keys and shortcuts in a styled inline element with support for variants, sizes, and compound shortcuts."
        version="1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Inline Display",
            description:
              "Elegant inline keyboard key display with proper spacing and typography.",
          },
          {
            title: "Variant Support",
            description:
              "Multiple visual styles: default, outline, and ghost variants.",
          },
          {
            title: "Compound Shortcuts",
            description:
              "KbdShortcut component for displaying multi-key keyboard combinations.",
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
                title="Basic Keys"
                description="Common keyboard keys and modifiers displayed inline."
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
                title="Visual Variants"
                description="Different visual styles for keyboard keys."
                code={variantsCode}
              >
                <VariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sizes",
            label: "Sizes",
            demo: (
              <DemoWrapper
                title="Size Options"
                description="Small, default, and large sizes for different contexts."
                code={sizesCode}
              >
                <SizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "shortcuts",
            label: "Shortcuts",
            demo: (
              <DemoWrapper
                title="Keyboard Shortcuts"
                description="Display multi-key combinations with KbdShortcut component."
                code={shortcutsCode}
              >
                <ShortcutsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "inline",
            label: "Inline",
            demo: (
              <DemoWrapper
                title="Inline Usage"
                description="Using keyboard keys within text content."
                code={inlineCode}
              >
                <InlineDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation examples for single keys and shortcuts."
      />

      <APIReference
        sections={[
          {
            title: "Kbd",
            props: [
              {
                prop: "variant",
                type: '"default" | "outline" | "ghost"',
                default: "default",
                description: "Visual style variant for the keyboard key.",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg"',
                default: "default",
                description: "Size of the keyboard key element.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS class names for styling.",
              },
            ],
          },
          {
            title: "KbdShortcut",
            props: [
              {
                prop: "keys",
                type: "string[]",
                default: "-",
                description:
                  "Array of key strings to display as a compound shortcut.",
              },
              {
                prop: "separator",
                type: "ReactNode",
                default: "+",
                description: "Separator to display between keys.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS class names for styling.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
