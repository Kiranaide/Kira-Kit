import { useState } from "react";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconCode,
  IconStrikethrough,
  IconList,
  IconListNumbers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ToggleGroupItem,
  ButtonGroupToolbar,
} from "@/components/ui/button-group";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";
import { Tabs } from "@/components/ui/tabs";

const features = [
  {
    title: "Flexible",
    description:
      "Support for connected/disconnected modes, horizontal/vertical orientation, and custom sizes.",
  },
  {
    title: "Interactive",
    description:
      "Built-in radio and checkbox selection modes with keyboard navigation and aria attributes.",
  },
  {
    title: "Animated",
    description:
      "Smooth entrance animations with staggered delays using animejs and prefers-reduced-motion support.",
  },
];

function BasicDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Basic horizontal group</p>
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Icon buttons</p>
        <div className="flex gap-4">
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <IconBold className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconItalic className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconUnderline className="w-4 h-4" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <IconAlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconAlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <IconAlignRight className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Vertical orientation</p>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

const basicCode = `import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Basic horizontal group
<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>

// Icon buttons
<ButtonGroup>
  <Button variant="outline" size="icon">
    <BoldIcon className="w-4 h-4" />
  </Button>
  <Button variant="outline" size="icon">
    <ItalicIcon className="w-4 h-4" />
  </Button>
</ButtonGroup>

// Vertical orientation
<ButtonGroup orientation="vertical">
  <Button variant="outline">Top</Button>
  <Button variant="outline">Middle</Button>
  <Button variant="outline">Bottom</Button>
</ButtonGroup>`;

function StylesDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Mixed button styles</p>
        <ButtonGroup>
          <Button variant="outline">Edit</Button>
          <Button variant="outline">Duplicate</Button>
          <Button variant="destructive">Delete</Button>
        </ButtonGroup>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Sizes</p>
        <div className="flex flex-col gap-3">
          <ButtonGroup size="sm">
            <Button variant="outline">Small</Button>
            <Button variant="outline">Group</Button>
          </ButtonGroup>
          <ButtonGroup size="default">
            <Button variant="outline">Default</Button>
            <Button variant="outline">Group</Button>
          </ButtonGroup>
          <ButtonGroup size="lg">
            <Button variant="outline">Large</Button>
            <Button variant="outline">Group</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

const stylesCode = `import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Mixed button styles
<ButtonGroup>
  <Button variant="outline">Edit</Button>
  <Button variant="outline">Duplicate</Button>
  <Button variant="destructive">Delete</Button>
</ButtonGroup>

// Sizes
<ButtonGroup size="sm">
  <Button variant="outline">Small</Button>
  <Button variant="outline">Group</Button>
</ButtonGroup>
<ButtonGroup size="default">
  <Button variant="outline">Default</Button>
  <Button variant="outline">Group</Button>
</ButtonGroup>
<ButtonGroup size="lg">
  <Button variant="outline">Large</Button>
  <Button variant="outline">Group</Button>
</ButtonGroup>`;

function ModesDemo() {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Connected vs Disconnected
        </p>
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Connected (default)</p>
            <ButtonGroup connected={true}>
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Disconnected (with gap)
            </p>
            <ButtonGroup connected={false} gap="default">
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Radio Selection (Single)
        </p>
        <div className="space-y-2">
          <ButtonGroupToolbar
            label="Text Formatting"
            selectionMode="single"
            value={selectedFormat}
            onChange={(val) => setSelectedFormat(val as string)}
            variant="outline"
          >
            <ToggleGroupItem value="bold">
              <IconBold className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <IconItalic className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <IconUnderline className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="strikethrough">
              <IconStrikethrough className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="code">
              <IconCode className="w-4 h-4" />
            </ToggleGroupItem>
          </ButtonGroupToolbar>
          <p className="text-xs">
            Selected:{" "}
            <code className="bg-muted px-1 rounded">
              {selectedFormat || "none"}
            </code>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Checkbox Selection (Multiple)
        </p>
        <div className="space-y-2">
          <ButtonGroupToolbar
            label="Tags"
            selectionMode="multiple"
            value={selectedTags}
            onChange={(val) => setSelectedTags(val as string[])}
            variant="secondary"
          >
            <ToggleGroupItem value="react">React</ToggleGroupItem>
            <ToggleGroupItem value="vue">Vue</ToggleGroupItem>
            <ToggleGroupItem value="svelte">Svelte</ToggleGroupItem>
            <ToggleGroupItem value="angular">Angular</ToggleGroupItem>
          </ButtonGroupToolbar>
          <p className="text-xs">
            Selected:{" "}
            <code className="bg-muted px-1 rounded">
              {selectedTags.length > 0 ? selectedTags.join(", ") : "none"}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

const modesCode = `import { useState } from "react"
import {
  ButtonGroup,
  ToggleGroupItem,
  ButtonGroupToolbar,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Connected vs Disconnected
<ButtonGroup connected={true}>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

<ButtonGroup connected={false} gap="default">
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

// Radio Selection (Single)
function RadioDemo() {
  const [selected, setSelected] = useState("")

  return (
    <ButtonGroupToolbar
      label="Text Formatting"
      selectionMode="single"
      value={selected}
      onChange={setSelected}
      variant="outline"
    >
      <ToggleGroupItem value="bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic">I</ToggleGroupItem>
      <ToggleGroupItem value="underline">U</ToggleGroupItem>
    </ButtonGroupToolbar>
  )
}

// Checkbox Selection (Multiple)
function CheckboxDemo() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <ButtonGroupToolbar
      label="Tags"
      selectionMode="multiple"
      value={selected}
      onChange={setSelected}
      variant="secondary"
    >
      <ToggleGroupItem value="react">React</ToggleGroupItem>
      <ToggleGroupItem value="vue">Vue</ToggleGroupItem>
      <ToggleGroupItem value="svelte">Svelte</ToggleGroupItem>
    </ButtonGroupToolbar>
  )
}`;

function LayoutDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Start (default)</p>
        <ButtonGroup justify="start" connected={false}>
          <Button variant="outline">Action</Button>
          <Button variant="outline">Settings</Button>
        </ButtonGroup>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Center</p>
        <ButtonGroup justify="center" connected={false}>
          <Button variant="outline">Action</Button>
          <Button variant="outline">Settings</Button>
        </ButtonGroup>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Between</p>
        <ButtonGroup justify="between" connected={false} className="w-full">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Save</Button>
        </ButtonGroup>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">End</p>
        <ButtonGroup justify="end" connected={false}>
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Save</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

const layoutCode = `import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Start (default)
<ButtonGroup justify="start" connected={false}>
  <Button variant="outline">Action</Button>
  <Button variant="outline">Settings</Button>
</ButtonGroup>

// Center
<ButtonGroup justify="center" connected={false}>
  <Button variant="outline">Action</Button>
  <Button variant="outline">Settings</Button>
</ButtonGroup>

// Between
<ButtonGroup justify="between" connected={false} className="w-full">
  <Button variant="outline">Cancel</Button>
  <Button variant="default">Save</Button>
</ButtonGroup>

// End
<ButtonGroup justify="end" connected={false}>
  <Button variant="outline">Cancel</Button>
  <Button variant="default">Save</Button>
</ButtonGroup>`;

function AnimationDemo() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Buttons animate on mount with staggered delay
      </p>
      <ButtonGroup
        animated={true}
        animationStagger={100}
        orientation="horizontal"
      >
        <Button variant="outline">First</Button>
        <Button variant="outline">Second</Button>
        <Button variant="outline">Third</Button>
        <Button variant="outline">Fourth</Button>
      </ButtonGroup>
    </div>
  );
}

const animationCode = `import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Animated entrance with staggered delay
<ButtonGroup
  animated={true}
  animationStagger={100}
  orientation="horizontal"
>
  <Button variant="outline">First</Button>
  <Button variant="outline">Second</Button>
  <Button variant="outline">Third</Button>
  <Button variant="outline">Fourth</Button>
</ButtonGroup>`;

function ToolbarDemo() {
  const [selectedFormat, setSelectedFormat] = useState<string>("paragraph");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Text Format</span>
        <ButtonGroup
          selectionMode="single"
          value={selectedFormat}
          onChange={(val) => setSelectedFormat(val as string)}
          size="sm"
          connected={true}
        >
          <ToggleGroupItem value="paragraph">
            <span className="text-xs">P</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h1">
            <span className="text-xs font-bold">H1</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h2">
            <span className="text-xs font-bold">H2</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h3">
            <span className="text-xs font-bold">H3</span>
          </ToggleGroupItem>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">List Style</span>
        <ButtonGroup
          selectionMode="multiple"
          value={selectedTools}
          onChange={(val) => setSelectedTools(val as string[])}
          size="sm"
          connected={true}
        >
          <ToggleGroupItem value="bullet">
            <IconList className="w-3 h-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="numbered">
            <IconListNumbers className="w-3 h-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="checkbox">
            <span className="text-xs">☑</span>
          </ToggleGroupItem>
        </ButtonGroup>
      </div>
    </div>
  );
}

const toolbarCode = `import { useState } from "react"
import {
  ButtonGroup,
  ToggleGroupItem,
} from "@/components/ui/button-group"
import { IconList, IconListNumbers } from "@tabler/icons-react"

function EditorToolbar() {
  const [selectedFormat, setSelectedFormat] = useState("paragraph")
  const [selectedTools, setSelectedTools] = useState<string[]>([])

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Text Format - Single Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Text Format</span>
        <ButtonGroup
          selectionMode="single"
          value={selectedFormat}
          onChange={setSelectedFormat}
          size="sm"
          connected={true}
        >
          <ToggleGroupItem value="paragraph">
            <span className="text-xs">P</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h1">
            <span className="text-xs font-bold">H1</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h2">
            <span className="text-xs font-bold">H2</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h3">
            <span className="text-xs font-bold">H3</span>
          </ToggleGroupItem>
        </ButtonGroup>
      </div>

      {/* List Style - Multiple Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">List Style</span>
        <ButtonGroup
          selectionMode="multiple"
          value={selectedTools}
          onChange={setSelectedTools}
          size="sm"
          connected={true}
        >
          <ToggleGroupItem value="bullet">
            <IconList className="w-3 h-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="numbered">
            <IconListNumbers className="w-3 h-3" />
          </ToggleGroupItem>
        </ButtonGroup>
      </div>
    </div>
  )
}`;

const usageCode = `import {
  ButtonGroup,
  ToggleGroupItem,
  ButtonGroupToolbar,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Basic group
<ButtonGroup>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

// Vertical orientation
<ButtonGroup orientation="vertical">
  <Button variant="outline">Top</Button>
  <Button variant="outline">Middle</Button>
  <Button variant="outline">Bottom</Button>
</ButtonGroup>

// Radio selection (single)
function SingleSelectDemo() {
  const [selected, setSelected] = useState("")

  return (
    <ButtonGroupToolbar
      selectionMode="single"
      value={selected}
      onChange={setSelected}
      variant="outline"
    >
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ButtonGroupToolbar>
  )
}

// Checkbox selection (multiple)
function MultiSelectDemo() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <ButtonGroupToolbar
      selectionMode="multiple"
      value={selectedItems}
      onChange={setSelectedItems}
      variant="secondary"
    >
      <ToggleGroupItem value="x">X</ToggleGroupItem>
      <ToggleGroupItem value="y">Y</ToggleGroupItem>
      <ToggleGroupItem value="z">Z</ToggleGroupItem>
    </ButtonGroupToolbar>
  )
}

// Animated entrance
<ButtonGroup animated={true} animationStagger={100}>
  <Button variant="outline">First</Button>
  <Button variant="outline">Second</Button>
  <Button variant="outline">Third</Button>
</ButtonGroup>`;

export default function ButtonGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Button Group"
        description="Groups multiple buttons together with seamless styling, supporting connected/disconnected modes, radio/checkbox selection, and animated entrances."
        version="1.0"
      />

      <FeatureGrid features={features} />

      <Tabs defaultValue="basic" className="space-y-6">
        <DemoTabs
          defaultValue="basic"
          tabs={[
            {
              value: "basic",
              label: "Basic",
              demo: (
                <DemoWrapper
                  title="Basic Button Group"
                  description="Basic horizontal group, icon buttons, and vertical orientation."
                  code={basicCode}
                >
                  <BasicDemo />
                </DemoWrapper>
              ),
            },
            {
              value: "styles",
              label: "Styles",
              demo: (
                <DemoWrapper
                  title="Styles & Sizes"
                  description="Mixed button styles and size variants (sm, default, lg)."
                  code={stylesCode}
                >
                  <StylesDemo />
                </DemoWrapper>
              ),
            },
            {
              value: "modes",
              label: "Modes",
              demo: (
                <DemoWrapper
                  title="Selection Modes"
                  description="Connected/disconnected modes, radio selection (single), and checkbox selection (multiple)."
                  code={modesCode}
                >
                  <ModesDemo />
                </DemoWrapper>
              ),
            },
            {
              value: "layout",
              label: "Layout",
              demo: (
                <DemoWrapper
                  title="Justify Content"
                  description="Different justification options: start, center, between, and end."
                  code={layoutCode}
                >
                  <LayoutDemo />
                </DemoWrapper>
              ),
            },
            {
              value: "animation",
              label: "Animation",
              demo: (
                <DemoWrapper
                  title="Animated Entrance"
                  description="Buttons animate on mount with staggered delay using animejs."
                  code={animationCode}
                >
                  <AnimationDemo />
                </DemoWrapper>
              ),
            },
            {
              value: "toolbar",
              label: "Toolbar",
              demo: (
                <DemoWrapper
                  title="Real-World Toolbar"
                  description="Rich editor toolbar combining single and multiple selection modes."
                  code={toolbarCode}
                >
                  <ToolbarDemo />
                </DemoWrapper>
              ),
            },
          ]}
        />
      </Tabs>

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for common use cases."
      />

      <APIReference
        sections={[
          {
            title: "ButtonGroup",
            props: [
              {
                prop: "orientation",
                type: "horizontal | vertical",
                default: "horizontal",
                description: "Layout direction of the button group.",
              },
              {
                prop: "size",
                type: "xs | sm | default | lg",
                default: "default",
                description: "Size variant applied to all buttons.",
              },
              {
                prop: "gap",
                type: "none | sm | default | lg",
                default: "-",
                description: "Gap between buttons (only when not connected).",
              },
              {
                prop: "justify",
                type: "start | center | end | between | around",
                default: "start",
                description: "Flexbox justify content alignment.",
              },
              {
                prop: "value",
                type: "string | string[] | null",
                default: "null",
                description: "Controlled value for selection mode.",
              },
              {
                prop: "onChange",
                type: "(value: string | string[]) => void",
                default: "-",
                description: "Callback when selection changes.",
              },
              {
                prop: "selectionMode",
                type: "none | single | multiple",
                default: "none",
                description: "Selection mode for toggle items.",
              },
              {
                prop: "connected",
                type: "boolean",
                default: "true",
                description:
                  "Whether buttons are visually connected (shared borders).",
              },
              {
                prop: "animated",
                type: "boolean",
                default: "false",
                description: "Enable entrance animation.",
              },
              {
                prop: "animationStagger",
                type: "number",
                default: "50",
                description: "Stagger delay for animation in milliseconds.",
              },
              {
                prop: "variant",
                type: "Button variant",
                default: "-",
                description: "Default variant for all buttons.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disable all buttons in the group.",
              },
              {
                prop: "loop",
                type: "boolean",
                default: "true",
                description: "Loop keyboard navigation.",
              },
            ],
          },
          {
            title: "ButtonGroupToolbar",
            props: [
              {
                prop: "label",
                type: "string",
                default: "-",
                description: "Accessible label for the toolbar.",
              },
              {
                prop: "...ButtonGroup",
                type: "ButtonGroupProps",
                default: "-",
                description: "All props from ButtonGroup component.",
              },
            ],
          },
          {
            title: "ToggleGroupItem",
            props: [
              {
                prop: "value",
                type: "string",
                default: "-",
                description: "Unique value for selection tracking.",
              },
              {
                prop: "variant",
                type: "Button variant",
                default: "outline",
                description: "Button variant, overrides group default.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "-",
                description: "Disable this specific item.",
              },
              {
                prop: "...Button",
                type: "ButtonProps",
                default: "-",
                description: "All props from Button component.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
