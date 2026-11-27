import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconArchive,
  IconBold,
  IconCircleCheck,
  IconClipboard,
  IconClock,
  IconCode,
  IconCopy,
  IconCut,
  IconHome,
  IconItalic,
  IconList,
  IconListNumbers,
  IconSettings,
  IconStrikethrough,
  IconUnderline,
  IconUser,
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
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  ButtonGroupToolbar,
  KiraButtonGroup,
  ToggleGroupItem,
} from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

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
        <div className="flex flex-wrap gap-4">
          <ButtonGroup>
            <Button variant="outline" size="icon" aria-label="Bold">
              <IconBold className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Italic">
              <IconItalic className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Underline">
              <IconUnderline className="w-4 h-4" aria-hidden="true" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="icon" aria-label="Align left">
              <IconAlignLeft className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Align center">
              <IconAlignCenter className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Align right">
              <IconAlignRight className="w-4 h-4" aria-hidden="true" />
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
import { IconBold, IconItalic } from "@tabler/icons-react"

<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>

<ButtonGroup>
  <Button variant="outline" size="icon" aria-label="Bold">
    <IconBold className="w-4 h-4" aria-hidden="true" />
  </Button>
  <Button variant="outline" size="icon" aria-label="Italic">
    <IconItalic className="w-4 h-4" aria-hidden="true" />
  </Button>
</ButtonGroup>

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

<ButtonGroup>
  <Button variant="outline">Edit</Button>
  <Button variant="outline">Duplicate</Button>
  <Button variant="destructive">Delete</Button>
</ButtonGroup>

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

function ModesConnectedVsDisconnectedSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Connected vs Disconnected</p>
      <div className="flex flex-col gap-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Connected (default)</p>
          <ButtonGroup connected>
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
      <p className="text-sm text-muted-foreground">Single Selection</p>
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
          <ToggleGroupItem value="bold" aria-label="Bold">
            <IconBold className="w-4 h-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <IconItalic className="w-4 h-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <IconUnderline className="w-4 h-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Strikethrough">
            <IconStrikethrough className="w-4 h-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" aria-label="Inline code">
            <IconCode className="w-4 h-4" aria-hidden="true" />
          </ToggleGroupItem>
        </ButtonGroupToolbar>
        <output className="block text-xs">
          Selected:{" "}
          <code className="bg-muted px-1 rounded">
            {selectedFormat === "" ? "none" : selectedFormat}
          </code>
        </output>
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
      <p className="text-sm text-muted-foreground">Multiple Selection</p>
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
        <output className="block text-xs">
          Selected:{" "}
          <code className="bg-muted px-1 rounded">
            {selectedTags.length > 0 ? selectedTags.join(", ") : "none"}
          </code>
        </output>
      </div>
    </div>
  );
}

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

<ButtonGroup connected>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

<ButtonGroup connected={false} gap="default">
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

<ButtonGroupToolbar
  label="Text Formatting"
  selectionMode="single"
  value={selected}
  onChange={setSelected}
  variant="outline"
>
  <ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic">I</ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline">U</ToggleGroupItem>
</ButtonGroupToolbar>`;

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

<ButtonGroup justify="start" connected={false}>
  <Button variant="outline">Action</Button>
  <Button variant="outline">Settings</Button>
</ButtonGroup>

<ButtonGroup justify="between" connected={false} className="w-full">
  <Button variant="outline">Cancel</Button>
  <Button variant="default">Save</Button>
</ButtonGroup>`;

function AnimationDemo() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Buttons animate on mount with staggered delay (automatically skipped
        under prefers-reduced-motion).
      </p>
      <ButtonGroup animated animationStagger={100} orientation="horizontal">
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

<ButtonGroup animated animationStagger={100} orientation="horizontal">
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
          connected
        >
          <ToggleGroupItem value="paragraph" aria-label="Paragraph">
            <span className="text-xs">P</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h1" aria-label="Heading 1">
            <span className="text-xs font-bold">H1</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h2" aria-label="Heading 2">
            <span className="text-xs font-bold">H2</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="h3" aria-label="Heading 3">
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
          connected
        >
          <ToggleGroupItem value="bullet" aria-label="Bulleted list">
            <IconList className="w-3 h-3" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="numbered" aria-label="Numbered list">
            <IconListNumbers className="w-3 h-3" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="checkbox" aria-label="Checklist">
            <span className="text-xs" aria-hidden="true">
              ☑
            </span>
          </ToggleGroupItem>
        </ButtonGroup>
      </div>
    </div>
  );
}

const toolbarCode = `import { useState } from "react"
import { ButtonGroup, ToggleGroupItem } from "@/components/ui/button-group"
import { IconList, IconListNumbers } from "@tabler/icons-react"

<ButtonGroup
  selectionMode="single"
  value={selectedFormat}
  onChange={setSelectedFormat}
  size="sm"
  connected
>
  <ToggleGroupItem value="paragraph" aria-label="Paragraph">P</ToggleGroupItem>
  <ToggleGroupItem value="h1" aria-label="Heading 1">H1</ToggleGroupItem>
  <ToggleGroupItem value="h2" aria-label="Heading 2">H2</ToggleGroupItem>
</ButtonGroup>

<ButtonGroup
  selectionMode="multiple"
  value={selectedTools}
  onChange={setSelectedTools}
  size="sm"
  connected
>
  <ToggleGroupItem value="bullet" aria-label="Bulleted list">
    <IconList className="w-3 h-3" aria-hidden="true" />
  </ToggleGroupItem>
  <ToggleGroupItem value="numbered" aria-label="Numbered list">
    <IconListNumbers className="w-3 h-3" aria-hidden="true" />
  </ToggleGroupItem>
</ButtonGroup>`;

function KiraButtonGroupSelectionSections({
  singleValue,
  multiValue,
  requiredValue,
  handleSingleChange,
  handleMultiChange,
  handleRequiredChange,
}: {
  singleValue: string | null;
  multiValue: string[];
  requiredValue: string;
  handleSingleChange: (value: string | string[] | null) => void;
  handleMultiChange: (value: string | string[] | null) => void;
  handleRequiredChange: (value: string | string[] | null) => void;
}) {
  return (
    <>
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
          <output className="text-sm text-muted-foreground">
            Selected: {singleValue ?? "null (deselected)"}
          </output>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Multiple Selection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select multiple items simultaneously with per-item loading support.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg border">
          <KiraButtonGroup
            items={filterItems}
            value={multiValue}
            onChange={handleMultiChange}
            type="multiple"
          />
          <output className="text-sm text-muted-foreground">
            Selected: {multiValue.length > 0 ? multiValue.join(", ") : "none"}
          </output>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Required Selection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Prevent empty selection with the required prop. Clicking the active
            item keeps it selected.
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
          <output className="text-sm text-muted-foreground">
            Selected: {requiredValue}
          </output>
        </div>
      </div>
    </>
  );
}

function KiraButtonGroupPresentationSections() {
  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">
            Uncontrolled &amp; Right Icons
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use defaultValue for uncontrolled groups and rightIcon per item.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border">
          <KiraButtonGroup
            items={configItems}
            defaultValue="profile"
            type="single"
          />
          <KiraButtonGroup
            items={rightIconItems}
            type="single"
            defaultValue="next"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">
            RTL, Full Width &amp; Per-Item Styling
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Logical properties handle RTL automatically, and items accept
            individual variants.
          </p>
        </div>
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          <div dir="rtl">
            <KiraButtonGroup
              items={configItems}
              dir="rtl"
              type="single"
              defaultValue="settings"
            />
          </div>
          <KiraButtonGroup
            items={configItems}
            fullWidth
            type="single"
            defaultValue="profile"
          />
          <KiraButtonGroup
            items={stylingItems}
            type="single"
            defaultValue="duplicate"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Toolbar Wrapper</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Wrap button groups in a semantic toolbar with an accessible label.
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
    </>
  );
}

function KiraButtonGroupSizeVariantsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Size Variants</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Button groups support xs, sm, default, and lg sizes.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border">
        {buttonGroupSizeDemos.map((entry) => (
          <div key={entry.size} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{entry.size}</span>
            <KiraButtonGroup
              items={entry.items}
              size={entry.size}
              type="single"
              defaultValue="1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function KiraButtonGroupDemo() {
  const [singleValue, setSingleValue] = useState<string | null>("home");
  const [multiValue, setMultiValue] = useState<string[]>(["active"]);
  const [requiredValue, setRequiredValue] = useState<string>("home");

  const handleSingleChange = (value: string | string[] | null) => {
    if (!Array.isArray(value)) {
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
      <KiraButtonGroupSelectionSections
        singleValue={singleValue}
        multiValue={multiValue}
        requiredValue={requiredValue}
        handleSingleChange={handleSingleChange}
        handleMultiChange={handleMultiChange}
        handleRequiredChange={handleRequiredChange}
      />
      <KiraButtonGroupPresentationSections />
      <KiraButtonGroupSizeVariantsSection />
    </div>
  );
}

const kiraButtonGroupCode = `import { KiraButtonGroup } from "@/components/ui/button-group"

<KiraButtonGroup
  items={items}
  value={selectedValue}
  onChange={setSelectedValue}
  selectionMode="single"
/>

<KiraButtonGroup
  items={filterItems}
  value={selectedValues}
  onChange={setSelectedValues}
  selectionMode="multiple"
/>

<KiraButtonGroup
  items={toolbarItems}
  toolbar
  toolbarLabel="Clipboard actions"
  type="single"
  defaultValue="copy"
/>`;

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
          items={segmentedViewItems}
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
          items={segmentedRangeItems}
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
          items={segmentedIconItems}
        />
      </div>
    </div>
  );
}
/* oxlint-enable anti-slop/no-shape-in-symbol-names */

const segmentedCode = `import { KiraButtonGroup } from "@/components/ui/button-group"

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

<KiraButtonGroup segmented shape="pill" type="single" items={rangeItems} />`;

function PartsDemo() {
  const [search, setSearch] = useState("");
  const [requiredValue, setRequiredValue] = useState<string | null>("left");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Separator between icon buttons
        </h3>
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Bold">
            <IconBold className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Italic">
            <IconItalic className="w-4 h-4" aria-hidden="true" />
          </Button>
          <ButtonGroupSeparator />
          <Button variant="outline" size="icon" aria-label="Code">
            <IconCode className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon" aria-label="List">
            <IconList className="w-4 h-4" aria-hidden="true" />
          </Button>
        </ButtonGroup>
      </div>

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
          Mixed group with an input
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

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Segmented + required (deselect emits null; required blocks it)
        </h3>
        <div className="flex flex-wrap items-center gap-4">
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
            items={alignTextItems}
          />
          <output className="text-sm text-muted-foreground">
            Selected: {requiredValue ?? "null (deselected)"}
          </output>
        </div>
      </div>
    </div>
  );
}

const partsCode = `import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  KiraButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

<ButtonGroup>
  <Button variant="outline" size="icon" aria-label="Bold"><IconBold aria-hidden="true" /></Button>
  <ButtonGroupSeparator />
  <Button variant="outline" size="icon" aria-label="Code"><IconCode aria-hidden="true" /></Button>
</ButtonGroup>

<ButtonGroup>
  <ButtonGroupText>Filter</ButtonGroupText>
  <Button variant="outline">Active</Button>
  <Button variant="outline">Pending</Button>
</ButtonGroup>

<ButtonGroup className="w-full max-w-md">
  <Input placeholder="Search the archive…" aria-label="Search" />
  <Button variant="outline">Search</Button>
</ButtonGroup>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-6 rounded-lg border border-border p-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Long labels in vertical group (narrow container)
        </p>
        <KiraButtonGroup
          orientation="vertical"
          fullWidth
          type="single"
          defaultValue="compliance"
          items={stressVerticalItems}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Disabled group &amp; empty-label icon items
        </p>
        <div className="flex flex-col gap-3">
          <KiraButtonGroup
            disabled
            type="single"
            defaultValue="left"
            items={segmentedIconItems}
          />
          <KiraButtonGroup items={[]} />
        </div>
      </div>
    </div>
  );
}

const stressCode = `import { KiraButtonGroup } from "@/components/ui/button-group"

<div className="max-w-xs space-y-6">
  <KiraButtonGroup
    orientation="vertical"
    fullWidth
    type="single"
    defaultValue="compliance"
    items={longItems}
  />
  <KiraButtonGroup disabled type="single" defaultValue="left" items={iconItems} />
  <KiraButtonGroup items={[]} />
</div>`;

const usageCode = `import {
  ButtonGroup,
  ToggleGroupItem,
  ButtonGroupToolbar,
  KiraButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

// Composable action group
<ButtonGroup>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

// Composable single-select toolbar
<ButtonGroupToolbar
  label="View"
  selectionMode="single"
  value={selected}
  onChange={setSelected}
  variant="outline"
>
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ButtonGroupToolbar>

// Data-driven segmented control
<KiraButtonGroup
  segmented
  type="single"
  required
  defaultValue="list"
  items={[
    { value: "list", label: "List" },
    { value: "board", label: "Board" },
  ]}
/>`;

export default function ButtonGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Button Group"
        description="Groups buttons and toggle controls with RTL-safe connected seams, Base UI ToggleGroup keyboard navigation, segmented sliding pills, and toolbar wrappers."
        version="v2.3.0"
      />

      <FeatureGrid
        features={buttonGroupPageFeatures}
        description="Built on Base UI ToggleGroup with reduced-motion-gated GSAP transitions."
      />

      <DemoTabs defaultValue="basic" tabs={buttonGroupPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={buttonGroupPageShortcuts}
        description="Roving tabindex and selection bindings provided by Base UI ToggleGroup."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose ButtonGroup primitives manually or pass items[] to KiraButtonGroup."
        notes={buttonGroupPageUsageNotes}
      />

      <APIReference
        sections={buttonGroupPageAPISections}
        description="Props, types, and defaults for every exported button-group part."
      />

      <Changelog
        entries={buttonGroupPageChangelogEntries}
        title="Changelog"
        description="Version history for Button Group."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const configItems = [
  {
    value: "home",
    label: "Home",
    icon: <IconHome className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "profile",
    label: "Profile",
    icon: <IconUser className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "settings",
    label: "Settings",
    icon: <IconSettings className="w-4 h-4" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const filterItems = [
  {
    value: "active",
    label: "Active",
    icon: <IconCircleCheck className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "pending",
    label: "Pending",
    icon: <IconClock className="w-4 h-4" aria-hidden="true" />,
    loading: true,
  },
  {
    value: "archived",
    label: "Archived",
    icon: <IconArchive className="w-4 h-4" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const toolbarItems = [
  {
    value: "cut",
    label: "Cut",
    icon: <IconCut className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "copy",
    label: "Copy",
    icon: <IconCopy className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "paste",
    label: "Paste",
    icon: <IconClipboard className="w-4 h-4" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const stylingItems = [
  {
    value: "edit",
    label: "Edit",
    icon: <IconCopy className="w-4 h-4" aria-hidden="true" />,
    variant: "outline",
  },
  {
    value: "duplicate",
    label: "Duplicate",
    icon: <IconCopy className="w-4 h-4" aria-hidden="true" />,
    variant: "secondary",
  },
  {
    value: "delete",
    label: "Delete",
    icon: <IconArchive className="w-4 h-4" aria-hidden="true" />,
    variant: "destructive",
    className: "font-bold",
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const rightIconItems = [
  {
    value: "prev",
    label: "Previous",
    icon: <IconAlignLeft className="w-4 h-4" aria-hidden="true" />,
  },
  {
    value: "next",
    label: "Next",
    rightIcon: <IconAlignRight className="w-4 h-4" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const segmentedViewItems = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const segmentedRangeItems = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const segmentedIconItems = [
  {
    value: "left",
    label: "",
    icon: <IconAlignLeft className="w-4 h-4" aria-hidden="true" />,
    "aria-label": "Align left",
  },
  {
    value: "center",
    label: "",
    icon: <IconAlignCenter className="w-4 h-4" aria-hidden="true" />,
    "aria-label": "Align center",
  },
  {
    value: "right",
    label: "",
    icon: <IconAlignRight className="w-4 h-4" aria-hidden="true" />,
    "aria-label": "Align right",
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const alignTextItems = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const stressVerticalItems = [
  {
    value: "compliance",
    label: "Enterprise Compliance & Audit Trail",
  },
  {
    value: "syncing",
    label: "Background Synchronization",
    loading: true,
  },
  {
    value: "locked",
    label: "Restricted Region Settings",
    disabled: true,
  },
] satisfies ReactComponentProps<typeof KiraButtonGroup>["items"];

const buttonGroupSizeDemos = [
  {
    size: "xs",
    items: [
      { value: "1", label: "XS" },
      { value: "2", label: "Extra" },
      { value: "3", label: "Small" },
    ],
  },
  {
    size: "sm",
    items: [
      { value: "1", label: "SM" },
      { value: "2", label: "Small" },
      { value: "3", label: "Size" },
    ],
  },
  {
    size: "default",
    items: [
      { value: "1", label: "Default" },
      { value: "2", label: "Normal" },
      { value: "3", label: "Medium" },
    ],
  },
  {
    size: "lg",
    items: [
      { value: "1", label: "LG" },
      { value: "2", label: "Large" },
      { value: "3", label: "Big" },
    ],
  },
] satisfies {
  size: NonNullable<ReactComponentProps<typeof KiraButtonGroup>["size"]>;
  items: NonNullable<ReactComponentProps<typeof KiraButtonGroup>["items"]>;
}[];

const buttonGroupPageFeatures = [
  {
    title: "Flexible",
    description:
      "Support for connected/disconnected modes, horizontal/vertical orientation, RTL seams, and four size tiers.",
  },
  {
    title: "Interactive",
    description:
      "Built on Base UI ToggleGroup for single and multiple selection with roving tabindex and aria-pressed.",
  },
  {
    title: "Animated",
    description:
      "Smooth segmented sliding pill and staggered entrance animations using GSAP with prefers-reduced-motion gating.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const buttonGroupPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
    demo: (
      <DemoWrapper
        title="Selection Modes"
        description="Connected/disconnected modes, single selection, and multiple selection."
        code={modesCode}
      >
        <ModesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "layout",
    label: "Layout",
    group: "Core",
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
    value: "parts",
    label: "Parts",
    group: "Core",
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
  {
    value: "kira-button-group",
    label: "KiraButtonGroup",
    group: "KiraButtonGroup",
    demo: (
      <DemoWrapper
        title="KiraButtonGroup"
        description="Items-based API for button groups with selection, RTL, loading, and toolbar wrapper."
        code={kiraButtonGroupCode}
      >
        <KiraButtonGroupDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "segmented",
    label: "Segmented",
    group: "KiraButtonGroup",
    demo: (
      <DemoWrapper
        title="Segmented Control"
        description="An animated pill slides behind the selected item and snaps instantly under reduced motion."
        code={segmentedCode}
      >
        <SegmentedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "animation",
    label: "Animation",
    group: "Behavior",
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
    group: "Behavior",
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
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, loading and disabled items, icon-only controls, and empty states inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const buttonGroupPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Enter or leave the button group (uses roving tabindex in selection modes, provided by Base UI ToggleGroup).",
  },
  {
    keys: "ArrowLeft / ArrowRight",
    description:
      "Move focus between items in a horizontal selectable group (wraps when loop is true).",
  },
  {
    keys: "ArrowUp / ArrowDown",
    description:
      "Move focus between items in a vertical selectable group (provided by Base UI ToggleGroup).",
  },
  {
    keys: "Home / End",
    description:
      "Jump focus to the first or last enabled item in a selectable group.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate the focused button or toggle the focused ToggleGroupItem.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const buttonGroupPageUsageNotes = [
  {
    label: "KiraButtonGroup",
    body: "Use KiraButtonGroup for data-driven toggle groups, segmented controls, per-item loading/variants, uncontrolled defaultValue, required/allowEmpty rules, or an integrated toolbar wrapper.",
  },
  {
    label: "Composable primitives",
    body: "Use ButtonGroup with Button, ToggleGroupItem, ButtonGroupSeparator, ButtonGroupText, ButtonGroupToolbar, or Input when composing custom mixed layouts.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const buttonGroupPageAPISections = [
  {
    title: "ButtonGroup",
    props: [
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout direction of the button group.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg"',
        default: '"default"',
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
        type: '"default" | "pill"',
        default: '"default"',
        description: "Corner shape; pill fully rounds the container and items.",
      },
      {
        prop: "gap",
        type: '"none" | "sm" | "default" | "lg"',
        default: "-",
        description: "Gap between buttons (when not connected).",
      },
      {
        prop: "justify",
        type: '"start" | "center" | "end" | "between" | "around"',
        default: '"start"',
        description: "Flexbox justify-content alignment.",
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
          "Selection callback. Deselecting the active single-select item emits null.",
      },
      {
        prop: "selectionMode",
        type: '"none" | "single" | "multiple"',
        default: '"none"',
        description: "Selection mode for toggle items.",
      },
      {
        prop: "connected",
        type: "boolean",
        default: "true",
        description:
          "Whether buttons are visually connected with shared seams.",
      },
      {
        prop: "animated",
        type: "boolean",
        default: "false",
        description: "Enable staggered entrance animation.",
      },
      {
        prop: "animationStagger",
        type: "number",
        default: "50",
        description: "Stagger delay for entrance animation in milliseconds.",
      },
      {
        prop: "variant",
        type: 'ButtonProps["variant"]',
        default: "-",
        description: "Default variant for all ToggleGroupItem children.",
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
        description: "Loop arrow-key navigation at the ends of the group.",
      },
      {
        prop: "dir",
        type: '"ltr" | "rtl"',
        default: "-",
        description: "Text direction for RTL layouts.",
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
        description: "Visible and accessible label for the toolbar.",
      },
      {
        prop: "...ButtonGroup",
        type: "ButtonGroupProps",
        default: "-",
        description: "All props from ButtonGroup are supported.",
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
        type: 'ButtonProps["variant"]',
        default: '"outline"',
        description: "Button variant, overriding the group default.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "-",
        description: "Disable this specific item.",
      },
      {
        prop: "...Button",
        type: 'Omit<ButtonProps, "ref">',
        default: "-",
        description: "All props from Button are supported.",
      },
    ],
  },
  {
    title: "ButtonGroupSeparator",
    props: [
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"vertical"',
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
        type: "useRender.RenderProp",
        default: "-",
        description: "Replace the default div via Base UI useRender.",
      },
      {
        prop: "...props",
        type: 'useRender.ComponentProps<"div">',
        default: "-",
        description: "Standard div props.",
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
        description: "Array of item configs rendered as ToggleGroupItem.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Alternative to items for rendering custom children.",
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
        description: "Initial value for uncontrolled mode.",
      },
      {
        prop: "onChange",
        type: "(value: string | string[] | null) => void",
        default: "-",
        description:
          "Selection callback. Single-select deselect emits null unless blocked.",
      },
      {
        prop: "onValueChange",
        type: "(value: string | string[] | null) => void",
        default: "-",
        description: "Alias for onChange.",
      },
      {
        prop: "selectionMode",
        type: '"none" | "single" | "multiple"',
        default: '"none"',
        description: "Selection mode for the group.",
      },
      {
        prop: "type",
        type: '"single" | "multiple"',
        default: "-",
        description: "Shorthand alias for selectionMode.",
      },
      {
        prop: "required",
        type: "boolean",
        default: "false",
        description: "Require at least one item to stay selected.",
      },
      {
        prop: "allowEmpty",
        type: "boolean",
        default: "true",
        description: "Allow empty selection in single mode.",
      },
      {
        prop: "dir",
        type: '"ltr" | "rtl"',
        default: "-",
        description: "Text direction for RTL language support.",
      },
      {
        prop: "fullWidth",
        type: "boolean",
        default: "false",
        description: "Make the group fill its container width.",
      },
      {
        prop: "toolbar",
        type: "boolean",
        default: "false",
        description: "Wrap the group in a ButtonGroupToolbar.",
      },
      {
        prop: "toolbarLabel",
        type: "string",
        default: "-",
        description: "Accessible label when toolbar is enabled.",
      },
      {
        prop: "onItemClick",
        type: "(value: string) => void",
        default: "-",
        description: "Callback invoked when any configured item is clicked.",
      },
      {
        prop: "...ButtonGroup",
        type: "ButtonGroupProps",
        default: "-",
        description: "All props from ButtonGroup are supported.",
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
        description: "Leading icon rendered on the left side.",
      },
      {
        prop: "rightIcon",
        type: "ReactNode",
        default: "-",
        description: "Trailing icon rendered on the right side.",
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
        description: "Show loading spinner and disable this item.",
      },
      {
        prop: "variant",
        type: 'ButtonProps["variant"]',
        default: "-",
        description: "Custom button variant for this item.",
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
        description: "Accessible label for icon-only items.",
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
          "ToggleGroupItem now renders through the Base UI Toggle inside a ToggleGroup: roving tabindex, Arrow/Home/End navigation, and a single aria-pressed state attribute are owned by the primitive.",
      },
      {
        type: "breaking",
        title: "Single-Select Deselect Emits null",
        description:
          'Deselecting the active item in single mode now calls onChange(null) instead of onChange(""). required and allowEmpty={false} block null.',
      },
      {
        type: "breaking",
        title: "rovingFocus Prop Removed",
        description:
          "The rovingFocus prop was declared but never read; the Base UI primitive owns roving focus now.",
      },
      {
        type: "added",
        title: "ButtonGroupSeparator and ButtonGroupText",
        description:
          "Stock-parity parts: a Separator wrapper for visual seams between buttons, and a text chunk for group labels. Connected-group rounding uses logical CSS sibling selectors (RTL-safe).",
      },
      {
        type: "changed",
        title: "Deleted Per-Item Ripple and Selected Scale",
        description:
          "Items now inherit Button's reduced-motion-gated ripple and press animation instead of running duplicate handlers.",
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
          'Added a segmented mode that renders an animated sliding pill behind the selected item, plus a shape="pill" variant for fully-rounded groups. The slide respects prefers-reduced-motion.',
      },
      {
        type: "fixed",
        title: "Per-Item Loading Indicator",
        description:
          "Replaced the emoji loading placeholder with an IconLoader2 spinner, and busy items now expose aria-busy and become disabled.",
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
          "Added defaultValue prop for uncontrolled components that don't require external state.",
      },
      {
        type: "added",
        title: "Type Alias",
        description:
          "Added type prop as an alias for selectionMode, accepting 'single' | 'multiple'.",
      },
      {
        type: "added",
        title: "onValueChange Alias",
        description: "Added onValueChange callback as an alias for onChange.",
      },
      {
        type: "added",
        title: "Required Selection",
        description:
          "Added required prop to prevent empty selection in single or multiple mode.",
      },
      {
        type: "added",
        title: "RTL Support",
        description:
          "Added dir prop ('ltr' | 'rtl') for right-to-left language support.",
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
          "Added state and disabled data attributes to ToggleGroupItem for styling and accessibility.",
      },
      {
        type: "added",
        title: "Roving Focus API",
        description:
          "Added rovingFocus prop for future roving tabindex control.",
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
