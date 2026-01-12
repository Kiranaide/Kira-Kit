import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  ToggleGroupItem,
  ButtonGroupToolbar,
} from "@/components/ui/button-group";
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
import { useState } from "react";

export function ButtonGroupPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>(["copy"]);

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Button Group</h1>
        <p className="text-muted-foreground">
          Groups multiple buttons together with seamless styling.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Button Group
        </h2>
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Buttons
        </h2>
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
      </section>

      {/* Vertical */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical Orientation
        </h2>
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </section>

      {/* Mixed Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Mixed Button Styles
        </h2>
        <ButtonGroup>
          <Button variant="outline">Edit</Button>
          <Button variant="outline">Duplicate</Button>
          <Button variant="destructive">Delete</Button>
        </ButtonGroup>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="flex flex-col gap-4">
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
      </section>

      {/* Connected Mode */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Connected vs Disconnected
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Connected (default)
            </p>
            <ButtonGroup connected={true}>
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Disconnected (with gap)
            </p>
            <ButtonGroup connected={false} gap="default">
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Radio Selection Mode */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Radio Selection (Single Selection)
        </h2>
        <p className="text-muted-foreground">
          Use ToggleGroupItem for single-select button groups. Click to select.
        </p>
        <div className="flex flex-col gap-4">
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
          <p className="text-sm">
            Selected:{" "}
            <code className="bg-muted px-1 rounded">
              {selectedFormat || "none"}
            </code>
          </p>
        </div>
      </section>

      {/* Checkbox Selection Mode */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Checkbox Selection (Multiple Selection)
        </h2>
        <p className="text-muted-foreground">
          Use ToggleGroupItem with selectionMode="multiple" for multi-select.
        </p>
        <div className="flex flex-col gap-4">
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
          <p className="text-sm">
            Selected:{" "}
            <code className="bg-muted px-1 rounded">
              {selectedTags.length > 0 ? selectedTags.join(", ") : "none"}
            </code>
          </p>
        </div>
      </section>

      {/* Alignment */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Justify Content
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Start (default)
            </p>
            <ButtonGroup justify="start" connected={false}>
              <Button variant="outline">Action</Button>
              <Button variant="outline">Settings</Button>
            </ButtonGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Center</p>
            <ButtonGroup justify="center" connected={false}>
              <Button variant="outline">Action</Button>
              <Button variant="outline">Settings</Button>
            </ButtonGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Between</p>
            <ButtonGroup justify="between" connected={false} className="w-full">
              <Button variant="outline">Cancel</Button>
              <Button variant="default">Save</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Animated */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Animated Entrance
        </h2>
        <p className="text-muted-foreground">
          ButtonGroup can animate children on mount with staggered effect.
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
      </section>

      {/* Tools Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Real-World Example: Editor Toolbar
        </h2>
        <p className="text-muted-foreground">
          Combining selection modes for a rich toolbar experience.
        </p>
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
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ToggleGroupItem, ButtonGroupToolbar } from "@/components/ui/button-group"

// Basic group
<ButtonGroup>
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>

// Vertical
<ButtonGroup orientation="vertical">
  ...
</ButtonGroup>

// Radio selection (single)
<ButtonGroupToolbar
  selectionMode="single"
  value={selected}
  onChange={setSelected}
>
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>
</ButtonGroupToolbar>

// Checkbox selection (multiple)
<ButtonGroupToolbar
  selectionMode="multiple"
  value={selectedItems}
  onChange={setSelectedItems}
>
  <ToggleGroupItem value="x">X</ToggleGroupItem>
  <ToggleGroupItem value="y">Y</ToggleGroupItem>
  <ToggleGroupItem value="z">Z</ToggleGroupItem>
</ButtonGroupToolbar>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
