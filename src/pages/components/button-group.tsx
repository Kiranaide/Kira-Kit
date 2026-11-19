import type { ComponentProps as ReactComponentProps } from "react";
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
  IconHome,
  IconUser,
  IconSettings,
  IconCircleCheck,
  IconClock,
  IconArchive,
  IconCut,
  IconCopy,
  IconClipboard,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ButtonGroup,
  ToggleGroupItem,
  ButtonGroupToolbar,
  ButtonGroupSeparator,
  ButtonGroupText,
  KiraButtonGroup,
} from "@/components/ui/button-group";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  Changelog,
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
      "Smooth entrance animations with staggered delays using GSAP and prefers-reduced-motion support.",
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
      <ModesConnectedVsDisconnectedSection />

      <ModesRadioSelectionSingleSection
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
      />

      <ModesCheckboxSelectionMultipleSection
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
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
          onChange={(val) =>
            setSelectedFormat(Array.isArray(val) ? "" : (val ?? ""))
          }
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
          onChange={(val) => setSelectedTools(Array.isArray(val) ? val : [])}
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

const configItems = [
  { value: "home", label: "Home", icon: <IconHome className="w-4 h-4" /> },
  {
    value: "profile",
    label: "Profile",
    icon: <IconUser className="w-4 h-4" />,
  },
  {
    value: "settings",
    label: "Settings",
    icon: <IconSettings className="w-4 h-4" />,
  },
];

const filterItems = [
  {
    value: "active",
    label: "Active",
    icon: <IconCircleCheck className="w-4 h-4" />,
  },
  {
    value: "pending",
    label: "Pending",
    icon: <IconClock className="w-4 h-4" />,
    loading: true,
  },
  {
    value: "archived",
    label: "Archived",
    icon: <IconArchive className="w-4 h-4" />,
  },
];

const toolbarItems = [
  { value: "cut", label: "Cut", icon: <IconCut className="w-4 h-4" /> },
  { value: "copy", label: "Copy", icon: <IconCopy className="w-4 h-4" /> },
  {
    value: "paste",
    label: "Paste",
    icon: <IconClipboard className="w-4 h-4" />,
  },
];

const stylingItems = [
  {
    value: "edit",
    label: "Edit",
    icon: <IconCopy className="w-4 h-4" />,
    variant: "outline" as const,
  },
  {
    value: "duplicate",
    label: "Duplicate",
    icon: <IconCopy className="w-4 h-4" />,
    variant: "secondary" as const,
  },
  {
    value: "delete",
    label: "Delete",
    icon: <IconArchive className="w-4 h-4" />,
    variant: "destructive" as const,
    className: "font-bold",
  },
];

const rightIconItems = [
  {
    value: "prev",
    label: "Previous",
    icon: <IconAlignLeft className="w-4 h-4" />,
  },
  {
    value: "next",
    label: "Next",
    rightIcon: <IconAlignRight className="w-4 h-4" />,
  },
];

function KiraButtonGroupDemo() {
  const [singleValue, setSingleValue] = useState<string>("center");
  const [multiValue, setMultiValue] = useState<string[]>(["bold"]);
  const [requiredValue, setRequiredValue] = useState<string>("home");

  const handleSingleChange = (value: string | string[] | null) => {
    if (value !== null && !Array.isArray(value)) {
      setSingleValue(value);
    }
  };

  const handleMultiChange = (value: string | string[] | null) => {
    if (Array.isArray(value)) {
      setMultiValue(value);
    }
  };

  const handleRequiredChange = (value: string | string[] | null) => {
    if (value !== null && !Array.isArray(value)) {
      setRequiredValue(value);
    }
  };

  return (
    <div className="space-y-8">
      <KiraButtonGroupItemsConfigurationSection
        configItems={configItems}
        singleValue={singleValue}
        handleSingleChange={handleSingleChange}
      />

      <KiraButtonGroupMultipleSelectionSection
        filterItems={filterItems}
        multiValue={multiValue}
        handleMultiChange={handleMultiChange}
      />

      <KiraButtonGroupUncontrolledModeDefaultValueSection
        configItems={configItems}
      />

      <KiraButtonGroupRequiredSelectionSection
        configItems={configItems}
        requiredValue={requiredValue}
        handleRequiredChange={handleRequiredChange}
      />

      <ButtonGroupPresentationExamples />

      <KiraButtonGroupToolbarWrapperSection toolbarItems={toolbarItems} />

      <KiraButtonGroupSizeVariantsSection />
    </div>
  );
}

const kiraButtonGroupCode = `import { KiraButtonGroup } from "@/components/ui/button-group"

const items = [
  { value: "left", label: "Left", icon: <IconAlignLeft className="w-4 h-4" /> },
  { value: "center", label: "Center", icon: <IconAlignCenter className="w-4 h-4" /> },
  { value: "right", label: "Right", icon: <IconAlignRight className="w-4 h-4" /> },
]

<KiraButtonGroup
  items={items}
  value={selectedValue}
  onChange={setSelectedValue}
  selectionMode="single"
/>

<KiraButtonGroup
  items={formatItems}
  value={selectedValues}
  onChange={setSelectedValues}
  selectionMode="multiple"
/>

// With toolbar wrapper
<KiraButtonGroup
  items={viewItems}
  toolbar
  toolbarLabel="View options"
  selectionMode="single"
/>

<KiraButtonGroup items={items} size="sm" selectionMode="single" />
<KiraButtonGroup items={items} size="lg" selectionMode="single" />`;

/* oxlint-disable anti-slop/no-shape-in-symbol-names -- These public shape props select geometric outlines, not data structures. */
function SegmentedDemo() {
  const [view, setView] = useState<string>("list");
  const [range, setRange] = useState<string>("week");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Segmented control (animated sliding pill)
        </h3>
        <KiraButtonGroup
          segmented
          type="single"
          value={view}
          onChange={(v) => setView(Array.isArray(v) ? "" : (v ?? ""))}
          items={[
            { value: "list", label: "List" },
            { value: "board", label: "Board" },
            { value: "calendar", label: "Calendar" },
          ]}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Pill shape
        </h3>
        <KiraButtonGroup
          segmented
          shape="pill"
          type="single"
          value={range}
          onChange={(v) => setRange(Array.isArray(v) ? "" : (v ?? ""))}
          items={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Icon-only, dense
        </h3>
        <KiraButtonGroup
          segmented
          type="single"
          size="sm"
          defaultValue="center"
          items={segmentedDemoKiraButtonGroupItems}
        />
      </div>
    </div>
  );
}
/* oxlint-enable anti-slop/no-shape-in-symbol-names */

const segmentedCode = `import { KiraButtonGroup } from "@/components/ui/button-group"

// Animated sliding pill behind the selected item.
<KiraButtonGroup
  segmented
  type="single"
  value={view}
  onChange={setView}
  items={[
    { value: "list", label: "List" },
    { value: "board", label: "Board" },
    { value: "calendar", label: "Calendar" },
  ]}
/>

// Fully-rounded pill shape.
<KiraButtonGroup segmented shape="pill" type="single" items={rangeItems} />`;

function PartsDemo() {
  const [search, setSearch] = useState("");
  const [requiredValue, setRequiredValue] = useState<string | null>("left");

  return (
    <div className="space-y-6">
      <PartsSeparatorBetweenIconButtonsSection />

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Text chunk as a group label
        </h3>
        <ButtonGroup>
          <ButtonGroupText>Filter</ButtonGroupText>
          <Button variant="outline">Active</Button>
          <Button variant="outline">Pending</Button>
          <Button variant="outline">Archived</Button>
        </ButtonGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Mixed group with an input (input stretches, buttons stay compact)
        </h3>
        <ButtonGroup className="w-full max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the archive…"
            aria-label="Search"
          />
          <Button variant="outline">Search</Button>
        </ButtonGroup>
      </div>

      <PartsSegmentedRequiredDeselectEmitsNullSection
        requiredValue={requiredValue}
        setRequiredValue={setRequiredValue}
      />
    </div>
  );
}

const partsCode = `import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  ToggleGroupItem,
  KiraButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Separator between icon buttons
<ButtonGroup>
  <Button variant="outline" size="icon" aria-label="Bold"><BoldIcon /></Button>
  <Button variant="outline" size="icon" aria-label="Italic"><ItalicIcon /></Button>
  <ButtonGroupSeparator />
  <Button variant="outline" size="icon" aria-label="Link"><CodeIcon /></Button>
</ButtonGroup>

// Text chunk as a group label
<ButtonGroup>
  <ButtonGroupText>Filter</ButtonGroupText>
  <Button variant="outline">Active</Button>
  <Button variant="outline">Pending</Button>
</ButtonGroup>

// Mixed group with an input — [&>input]:flex-1 stretches it
<ButtonGroup className="w-full max-w-md">
  <Input placeholder="Search the archive…" />
  <Button variant="outline">Search</Button>
</ButtonGroup>

// Single-select deselect now emits null (was ""); required blocks it
<KiraButtonGroup
  segmented
  type="single"
  required
  value={value}
  onChange={(v) => setValue(v)} // v: string | string[] | null
  items={alignItems}
/>`;

export default function ButtonGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Button Group"
        description="Groups multiple buttons together with seamless styling, supporting connected/disconnected modes, radio/checkbox selection, and animated entrances."
        version="v2.3"
      />

      <FeatureGrid features={features} />

      <Tabs defaultValue="basic" className="space-y-6">
        <DemoTabs defaultValue="basic" tabs={buttonGroupPageDemoTabsTabs} />
      </Tabs>

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for common use cases."
      />

      <APIReference sections={buttonGroupPageAPIReferenceSections} />

      <Changelog entries={buttonGroupPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const segmentedDemoKiraButtonGroupItems = [
  {
    value: "left",
    label: "",
    icon: <IconAlignLeft className="w-4 h-4" />,
    "aria-label": "Align left",
  },
  {
    value: "center",
    label: "",
    icon: <IconAlignCenter className="w-4 h-4" />,
    "aria-label": "Align center",
  },
  {
    value: "right",
    label: "",
    icon: <IconAlignRight className="w-4 h-4" />,
    "aria-label": "Align right",
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const buttonGroupPageDemoTabsTabs = [
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
        description="Buttons animate on mount with staggered delay using GSAP."
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
  {
    value: "kira-button-group",
    label: "KiraButtonGroup",
    demo: (
      <DemoWrapper
        title="KiraButtonGroup"
        description="Items-based API for button groups with selection and toolbar wrapper."
        code={kiraButtonGroupCode}
      >
        <KiraButtonGroupDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "segmented",
    label: "Segmented",
    demo: (
      <DemoWrapper
        title="Segmented Control"
        description="An animated pill slides behind the selected item. Supports a fully-rounded pill shape and dense icon-only layouts. The slide snaps instantly under reduced motion."
        code={segmentedCode}
      >
        <SegmentedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "parts",
    label: "Parts",
    demo: (
      <DemoWrapper
        title="Group Parts"
        description="Separator, text chunks, an input inside a connected group, and required segmented selection."
        code={partsCode}
      >
        <PartsDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const buttonGroupPageAPIReferenceSections = [
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
        prop: "segmented",
        type: "boolean",
        default: "false",
        description:
          "Segmented-control mode: renders an animated sliding pill behind the selected item (single selection).",
      },
      {
        prop: "shape",
        type: "default | pill",
        default: "default",
        description: "Corner shape; pill fully rounds the container and items.",
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
        type: "(value: string | string[] | null) => void",
        default: "-",
        description:
          'Selection callback. Single-select deselect now emits null (was "").',
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
        description: "Whether buttons are visually connected (shared borders).",
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
  {
    title: "KiraButtonGroup",
    props: [
      {
        prop: "items",
        type: "KiraButtonGroupItem[]",
        default: "-",
        description: "Array of items to render as buttons.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Alternative to items - render custom children.",
      },
      {
        prop: "value",
        type: "string | string[] | null",
        default: "-",
        description: "Controlled value for selection.",
      },
      {
        prop: "defaultValue",
        type: "string | string[] | null",
        default: "-",
        description: "Default value for uncontrolled mode.",
      },
      {
        prop: "onChange",
        type: "(value: string | string[] | null) => void",
        default: "-",
        description:
          'Selection callback. Single-select deselect now emits null (was "").',
      },
      {
        prop: "onValueChange",
        type: "(value: string | string[]) => void",
        default: "-",
        description: "Alias for onChange (Radix API compatibility).",
      },
      {
        prop: "selectionMode",
        type: "none | single | multiple",
        default: "none",
        description: "Selection mode for the group.",
      },
      {
        prop: "type",
        type: "single | multiple",
        default: "-",
        description: "Alias for selectionMode (Radix API compatibility).",
      },
      {
        prop: "required",
        type: "boolean",
        default: "false",
        description: "Require at least one item to be selected.",
      },
      {
        prop: "dir",
        type: "ltr | rtl",
        default: "-",
        description: "Text direction for RTL language support.",
      },
      {
        prop: "fullWidth",
        type: "boolean",
        default: "false",
        description: "Make the group take full width of container.",
      },
      {
        prop: "toolbar",
        type: "boolean",
        default: "false",
        description: "Wrap the group in a toolbar wrapper.",
      },
      {
        prop: "toolbarLabel",
        type: "string",
        default: "-",
        description: "Accessible label for the toolbar.",
      },
      {
        prop: "allowEmpty",
        type: "boolean",
        default: "true",
        description: "Allow empty selection in single mode.",
      },
      {
        prop: "onItemClick",
        type: "(value: string) => void",
        default: "-",
        description: "Callback when an item is clicked.",
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
    title: "KiraButtonGroupItem",
    props: [
      {
        prop: "value",
        type: "string",
        default: "-",
        description: "Unique value for the item.",
      },
      {
        prop: "label",
        type: "string",
        default: "-",
        description: "Display label for the item.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "-",
        description: "Icon to display on the left side.",
      },
      {
        prop: "rightIcon",
        type: "ReactNode",
        default: "-",
        description: "Icon to display on the right side.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable this specific item.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Show loading spinner on the item.",
      },
      {
        prop: "variant",
        type: "Button variant",
        default: "-",
        description: "Custom variant for this item.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Custom CSS classes for this item.",
      },
      {
        prop: "aria-label",
        type: "string",
        default: "-",
        description: "Accessible label for this item.",
      },
    ],
  },
  {
    title: "ButtonGroupSeparator",
    props: [
      {
        prop: "orientation",
        type: "horizontal | vertical",
        default: "vertical",
        description: "Separator orientation inside the group.",
      },
      {
        prop: "...props",
        type: "SeparatorProps",
        default: "-",
        description: "All props from the Separator component.",
      },
    ],
  },
  {
    title: "ButtonGroupText",
    props: [
      {
        prop: "render",
        type: "ReactElement | (props) => ReactElement",
        default: "-",
        description: "Replace the default div (Base UI useRender).",
      },
      {
        prop: "...props",
        type: "HTMLAttributes<HTMLDivElement>",
        default: "-",
        description: "Standard div props.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const buttonGroupPageChangelogEntries = [
  {
    version: "2.3.0",
    date: "17 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Selection Rebuilt on the Base UI ToggleGroup Primitive",
        description:
          "ToggleGroupItem now renders through the Base UI Toggle inside a ToggleGroup: roving tabindex, Arrow/Home/End navigation, and a single aria-pressed state attribute are owned by the primitive. The old aria-pressed + role=radio + aria-checked conflict and ~70 lines of hand-rolled keyboard navigation are gone.",
      },
      {
        type: "breaking",
        title: "Single-Select Deselect Emits null",
        description:
          'Deselecting the active item in single mode now calls onChange(null) — it was onChange(""). Update `val as string` consumers to handle null. required and allowEmpty={false} block null.',
      },
      {
        type: "breaking",
        title: "rovingFocus Prop Removed",
        description:
          "The rovingFocus prop was declared but never read; the primitive owns roving focus now.",
      },
      {
        type: "added",
        title: "ButtonGroupSeparator and ButtonGroupText",
        description:
          "Stock-parity parts: a Separator wrapper for visual seams between buttons, and a text chunk for group labels. Connected-group rounding is now CSS sibling selectors with logical properties (RTL-safe) instead of cloneElement position classes. Inputs inside a group stretch via [&>input]:flex-1.",
      },
      {
        type: "changed",
        title: "Deleted Per-Item Ripple and Selected Scale",
        description:
          "Items now inherit Button's reduced-motion-gated ripple and press animation instead of running their own duplicate handlers.",
      },
      {
        type: "added",
        title: "focusableWhenDisabled Pass-Through",
        description:
          "Button gained focusableWhenDisabled (Base UI primitive, WCAG 2.2); see the Button page changelog.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "10 July 2026",
    changes: [
      {
        type: "added",
        title: "Segmented Control",
        description:
          'Added a `segmented` mode that renders an animated sliding pill behind the selected item, plus a `shape="pill"` variant for fully-rounded groups. The slide respects prefers-reduced-motion.',
      },
      {
        type: "fixed",
        title: "Per-Item Loading Indicator",
        description:
          "Replaced the ⏳ emoji loading placeholder with a proper IconLoader2 spinner, and busy items now expose aria-busy and become disabled.",
      },
      {
        type: "changed",
        title: "Reduced-Motion Gating",
        description:
          "The staggered entrance, selected press-tween, and click ripple now respect prefers-reduced-motion.",
      },
      {
        type: "changed",
        title: "KiraButtonGroup Cleanup",
        description:
          "De-duplicated the toolbar rendering path so items render through a single code path regardless of the toolbar wrapper.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "7 February 2026",
    changes: [
      {
        type: "added",
        title: "Uncontrolled Mode",
        description:
          "Added defaultValue prop for uncontrolled components that don't require state management.",
      },
      {
        type: "added",
        title: "Type Alias",
        description:
          "Added type prop as an alias for selectionMode, accepting 'single' | 'multiple' for Radix API compatibility.",
      },
      {
        type: "added",
        title: "onValueChange Alias",
        description:
          "Added onValueChange callback as an alias for onChange for consistency with Radix ToggleGroup API.",
      },
      {
        type: "added",
        title: "Required Selection",
        description:
          "Added required prop to prevent empty selection, ensuring at least one item remains selected in single mode.",
      },
      {
        type: "added",
        title: "RTL Support",
        description:
          "Added dir prop ('ltr' | 'rtl') for right-to-left language support and internationalization.",
      },
      {
        type: "added",
        title: "Full Width Layout",
        description:
          "Added fullWidth prop to make button groups take the full width of their container.",
      },
      {
        type: "added",
        title: "Enhanced Item Configuration",
        description:
          "KiraButtonGroupItem now supports rightIcon, loading state, custom variant, className, and aria-label per item.",
      },
      {
        type: "added",
        title: "Better Data Attributes",
        description:
          "Added data-state ('on' | 'off') and data-disabled attributes to ToggleGroupItem for better accessibility and styling.",
      },
      {
        type: "added",
        title: "Roving Focus API",
        description:
          "Added rovingFocus prop for future implementation of roving tabindex control.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "5 February 2026",
    changes: [
      {
        type: "added",
        title: "KiraButtonGroup",
        description:
          "Items-based component with selection modes and optional toolbar wrapper.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function ModesConnectedVsDisconnectedSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Connected vs Disconnected</p>
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
  );
}

function ModesRadioSelectionSingleSection({
  selectedFormat,
  setSelectedFormat,
}: {
  selectedFormat: string;
  setSelectedFormat: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Radio Selection (Single)</p>
      <div className="space-y-2">
        <ButtonGroupToolbar
          label="Text Formatting"
          selectionMode="single"
          value={selectedFormat}
          onChange={(val) =>
            setSelectedFormat(Array.isArray(val) ? "" : (val ?? ""))
          }
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
  );
}

function ModesCheckboxSelectionMultipleSection({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Checkbox Selection (Multiple)
      </p>
      <div className="space-y-2">
        <ButtonGroupToolbar
          label="Tags"
          selectionMode="multiple"
          value={selectedTags}
          onChange={(val) => setSelectedTags(Array.isArray(val) ? val : [])}
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
  );
}

function KiraButtonGroupItemsConfigurationSection({
  configItems,
  singleValue,
  handleSingleChange,
}: {
  configItems: { value: string; label: string; icon: React.JSX.Element }[];
  singleValue: string;
  handleSingleChange: (value: string | string[] | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Items Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define button groups using a simple items array with icons, labels,
          and values.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg border">
        <KiraButtonGroup
          items={configItems}
          value={singleValue}
          onChange={handleSingleChange}
          type="single"
        />
        <span className="text-sm text-muted-foreground">
          Selected: {singleValue ?? "null (deselected)"}
        </span>
      </div>
    </div>
  );
}

function KiraButtonGroupMultipleSelectionSection({
  filterItems,
  multiValue,
  handleMultiChange,
}: {
  filterItems: (
    | {
        value: string;
        label: string;
        icon: React.JSX.Element;
        loading?: undefined;
      }
    | {
        value: string;
        label: string;
        icon: React.JSX.Element;
        loading: boolean;
      }
  )[];
  multiValue: string[];
  handleMultiChange: (value: string | string[] | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Multiple Selection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select multiple items simultaneously with checkbox-like behavior.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg border">
        <KiraButtonGroup
          items={filterItems}
          value={multiValue}
          onChange={handleMultiChange}
          type="multiple"
        />
        <span className="text-sm text-muted-foreground">
          Selected: {multiValue.join(", ") || "none"}
        </span>
      </div>
    </div>
  );
}

function KiraButtonGroupUncontrolledModeDefaultValueSection({
  configItems,
}: {
  configItems: { value: string; label: string; icon: React.JSX.Element }[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">
          Uncontrolled Mode (defaultValue)
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use defaultValue for uncontrolled components that don't need state
          management.
        </p>
      </div>
      <div className="p-4 bg-muted/30 rounded-lg border">
        <KiraButtonGroup
          items={configItems}
          defaultValue="profile"
          type="single"
        />
      </div>
    </div>
  );
}

function KiraButtonGroupRequiredSelectionSection({
  configItems,
  requiredValue,
  handleRequiredChange,
}: {
  configItems: { value: string; label: string; icon: React.JSX.Element }[];
  requiredValue: string;
  handleRequiredChange: (value: string | string[] | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Required Selection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Prevent empty selection with the required prop. Try clicking the
          selected item - it won&apos;t deselect.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg border">
        <KiraButtonGroup
          items={configItems}
          value={requiredValue}
          onChange={handleRequiredChange}
          selectionMode="single"
          required
        />
        <span className="text-sm text-muted-foreground">
          Selected: {requiredValue}
        </span>
      </div>
    </div>
  );
}

function KiraButtonGroupToolbarWrapperSection({
  toolbarItems,
}: {
  toolbarItems: { value: string; label: string; icon: React.JSX.Element }[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Toolbar Wrapper</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Wrap button groups in a toolbar with an accessible label for better
          semantics.
        </p>
      </div>
      <div className="p-4 bg-muted/30 rounded-lg border">
        <KiraButtonGroup
          items={toolbarItems}
          toolbar
          toolbarLabel="Clipboard actions"
          type="single"
          defaultValue="copy"
        />
      </div>
    </div>
  );
}

function KiraButtonGroupSizeVariantsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Size Variants</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Button groups support all standard button sizes: xs, sm, default, and
          lg.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground">xs</span>
          <KiraButtonGroup
            items={[
              { value: "1", label: "XS" },
              { value: "2", label: "Extra" },
              { value: "3", label: "Small" },
            ]}
            size="xs"
            type="single"
            defaultValue="1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground">sm</span>
          <KiraButtonGroup
            items={[
              { value: "1", label: "SM" },
              { value: "2", label: "Small" },
              { value: "3", label: "Size" },
            ]}
            size="sm"
            type="single"
            defaultValue="1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground">default</span>
          <KiraButtonGroup
            items={[
              { value: "1", label: "Default" },
              { value: "2", label: "Normal" },
              { value: "3", label: "Medium" },
            ]}
            size="default"
            type="single"
            defaultValue="1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground">lg</span>
          <KiraButtonGroup
            items={[
              { value: "1", label: "LG" },
              { value: "2", label: "Large" },
              { value: "3", label: "Big" },
            ]}
            size="lg"
            type="single"
            defaultValue="1"
          />
        </div>
      </div>
    </div>
  );
}

function PartsSeparatorBetweenIconButtonsSection() {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Separator between icon buttons
      </h3>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Bold">
          <IconBold className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Italic">
          <IconItalic className="w-4 h-4" />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="outline" size="icon" aria-label="Link">
          <IconCode className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="List">
          <IconList className="w-4 h-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function PartsSegmentedRequiredDeselectEmitsNullSection({
  requiredValue,
  setRequiredValue,
}: {
  requiredValue: string | null;
  setRequiredValue: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Segmented + required (deselect emits null; required blocks it)
      </h3>
      <div className="flex items-center gap-4">
        <KiraButtonGroup
          segmented
          type="single"
          required
          value={requiredValue}
          onChange={(v) => {
            if (Array.isArray(v)) {
              setRequiredValue(null);
            } else {
              setRequiredValue(v);
            }
          }}
          items={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
        />
        <span className="text-sm text-muted-foreground">
          Selected: {requiredValue ?? "null (deselected)"}
        </span>
      </div>
    </div>
  );
}

function ButtonGroupPresentationExamples() {
  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Loading States</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Show loading indicators on individual items.
          </p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <KiraButtonGroup
            items={filterItems}
            type="single"
            defaultValue="pending"
          />
        </div>
      </div>

      <ButtonGroupRightIconsExample />

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">RTL Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Right-to-left direction support for internationalization.
          </p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border" dir="rtl">
          <KiraButtonGroup
            items={configItems}
            dir="rtl"
            type="single"
            defaultValue="settings"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Full Width</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Make the button group take full width of its container.
          </p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <KiraButtonGroup
            items={configItems}
            fullWidth
            type="single"
            defaultValue="profile"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Per-Item Styling</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Custom variant and className per item for flexible styling.
          </p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <KiraButtonGroup
            items={stylingItems}
            type="single"
            defaultValue="duplicate"
          />
        </div>
      </div>
    </>
  );
}

function ButtonGroupRightIconsExample() {
  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Right Icons</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add icons to the right side of items.
          </p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <KiraButtonGroup
            items={rightIconItems}
            type="single"
            defaultValue="next"
          />
        </div>
      </div>
    </>
  );
}
