import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconInfoCircle, IconSettings, IconAlertCircle } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Open Popover</Button>}
        />
        <PopoverContent>
          <PopoverTitle>Popover Title</PopoverTitle>
          <PopoverDescription>
            This is a basic popover with accessible title and description.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">With Arrow</Button>}
        />
        <PopoverContent>
          <PopoverArrow />
          <PopoverTitle>With Arrow</PopoverTitle>
          <PopoverDescription>
            The arrow points to the trigger element.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Outline Variant</Button>}
        />
        <PopoverContent variant="outline">
          <PopoverArrow variant="outline" />
          <PopoverTitle>Outline Style</PopoverTitle>
          <PopoverDescription>
            Both content and arrow use outline variant.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const basicCode = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function BasicPopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Popover Title</PopoverTitle>
        <PopoverDescription>
          This is a basic popover with accessible title and description.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}`;

function PositionsDemo() {
  const positions = [
    { side: "top", label: "Top" },
    { side: "bottom", label: "Bottom" },
    { side: "left", label: "Left" },
    { side: "right", label: "Right" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {positions.map(({ side, label }) => (
        <Popover key={side}>
          <PopoverTrigger
            render={<Button variant="outline">{label}</Button>}
          />
          <PopoverContent side={side}>
            <PopoverArrow />
            <PopoverTitle>Position: {label}</PopoverTitle>
            <PopoverDescription>
              This popover appears on the {side} of the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

const positionsCode = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function PositionsDemo() {
  const positions = ["top", "bottom", "left", "right"] as const

  return (
    <div className="flex gap-4">
      {positions.map((side) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline">{side}</Button>} />
          <PopoverContent side={side}>
            <PopoverArrow />
            <PopoverTitle>Position: {side}</PopoverTitle>
            <PopoverDescription>
              This popover appears on the {side} of the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}`;

function AlignmentsDemo() {
  const alignments = [
    { align: "start", label: "Start" },
    { align: "center", label: "Center" },
    { align: "end", label: "End" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {alignments.map(({ align, label }) => (
        <Popover key={align}>
          <PopoverTrigger
            render={<Button variant="outline">{label}</Button>}
          />
          <PopoverContent side="top" align={align}>
            <PopoverArrow />
            <PopoverTitle>Align: {label}</PopoverTitle>
            <PopoverDescription>
              This popover is aligned to the {label} of the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

const alignmentsCode = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function AlignmentsDemo() {
  const alignments = ["start", "center", "end"] as const

  return (
    <div className="flex gap-4">
      {alignments.map((align) => (
        <Popover key={align}>
          <PopoverTrigger render={<Button variant="outline">{align}</Button>} />
          <PopoverContent side="top" align={align}>
            <PopoverArrow />
            <PopoverTitle>Align: {align}</PopoverTitle>
            <PopoverDescription>
              This popover is aligned to the {align} of the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}`;

function SideOffsetDemo() {
  const offsets = [
    { offset: 0, label: "No Offset" },
    { offset: 8, label: "8px" },
    { offset: 16, label: "16px" },
    { offset: 24, label: "24px" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {offsets.map(({ offset, label }) => (
        <Popover key={offset}>
          <PopoverTrigger
            render={<Button variant="outline">{label}</Button>}
          />
          <PopoverContent side="bottom" sideOffset={offset}>
            <PopoverArrow />
            <PopoverTitle>Offset: {label}</PopoverTitle>
            <PopoverDescription>
              This popover is {offset === 0 ? "directly adjacent" : `${offset}px away`} from the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

const sideOffsetCode = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function SideOffsetDemo() {
  const offsets = [0, 8, 16, 24] as const

  return (
    <div className="flex gap-4">
      {offsets.map((offset) => (
        <Popover key={offset}>
          <PopoverTrigger render={<Button variant="outline">{offset}px</Button>} />
          <PopoverContent side="bottom" sideOffset={offset}>
            <PopoverArrow />
            <PopoverTitle>Offset: {offset}px</PopoverTitle>
            <PopoverDescription>
              This popover is {offset}px away from the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}`;

function FormDemo() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger render={<Button>Edit Dimensions</Button>} />
        <PopoverContent className="w-80">
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the width and height of your element.
          </PopoverDescription>
          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="auto" className="col-span-2" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <PopoverClose render={<Button size="sm">Apply</Button>} />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Focus on Input</Button>}
        />
        <PopoverContent initialFocus={() => inputRef.current}>
          <PopoverTitle>Initial Focus</PopoverTitle>
          <PopoverDescription>
            Focus automatically moves to the input field when opened.
          </PopoverDescription>
          <div className="mt-4 space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="focusInput">Name</Label>
              <Input ref={inputRef} id="focusInput" placeholder="Enter name..." />
            </div>
            <PopoverClose render={<Button size="sm">Done</Button>} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const formCode = `import { useRef } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormPopoverDemo() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Popover>
      <PopoverTrigger render={<Button>Edit Dimensions</Button>} />
      <PopoverContent className="w-80" initialFocus={() => inputRef.current}>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>
          Set the width and height of your element.
        </PopoverDescription>
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="width">Width</Label>
            <Input ref={inputRef} id="width" defaultValue="100%" className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="auto" className="col-span-2" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <PopoverClose render={<Button size="sm">Apply</Button>} />
        </div>
      </PopoverContent>
    </Popover>
  )
}`;

function CustomTriggerDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
              <IconInfoCircle className="w-4 h-4" />
              <span className="font-medium">Info Button</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Custom Trigger</PopoverTitle>
          <PopoverDescription>
            This popover uses a custom button element as the trigger.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
              <IconSettings className="w-4 h-4" />
              <span className="font-medium">Settings</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Settings</PopoverTitle>
          <PopoverDescription>
            Configure your preferences and options.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
              <IconAlertCircle className="w-4 h-4" />
              <span className="font-medium">Alert</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Alert</PopoverTitle>
          <PopoverDescription>
            Important information about your account.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const customTriggerCode = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"
import { IconInfoCircle, IconSettings, IconAlertCircle } from "@tabler/icons-react"

export function CustomTriggerDemo() {
  return (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
              <IconInfoCircle className="w-4 h-4" />
              <span className="font-medium">Info Button</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Custom Trigger</PopoverTitle>
          <PopoverDescription>
            This popover uses a custom button element as the trigger.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}`;

const usageCode = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

// Basic with accessibility
<Popover onOpenChange={(open) => console.log(open)}>
  <PopoverTrigger render={<Button>Open</Button>} />
  <PopoverContent>
    <PopoverArrow />
    <PopoverTitle>Title</PopoverTitle>
    <PopoverDescription>Description for screen readers.</PopoverDescription>
    <PopoverClose render={<Button>Close</Button>} />
  </PopoverContent>
</Popover>

// With focus management
<PopoverContent initialFocus={() => inputRef.current}>
  ...
</PopoverContent>

// Positioning
<PopoverContent side="top" align="start" sideOffset={8}>
  ...
</PopoverContent>

// Variants
<PopoverContent variant="outline" size="lg">
  ...
</PopoverContent>`;

export function PopoverPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "WAI-ARIA compliant with PopoverTitle and PopoverDescription automatically setting aria-labelledby and aria-describedby.",
    },
    {
      title: "Flexible Positioning",
      description:
        "Supports all 4 sides (top, bottom, left, right) with alignment options and collision detection.",
    },
    {
      title: "Focus Management",
      description:
        "Control initial and final focus with initialFocus and finalFocus props. Supports modal mode with backdrop.",
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Popover"
          description="Simple popover with title, description, and arrow variants."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "positions",
      label: "Positions",
      demo: (
        <DemoWrapper
          title="Positioning"
          description="Popovers can appear on any side of the trigger element."
          code={positionsCode}
        >
          <PositionsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "alignments",
      label: "Alignments",
      demo: (
        <DemoWrapper
          title="Alignment Options"
          description="Control how the popover aligns relative to the trigger (start, center, end)."
          code={alignmentsCode}
        >
          <AlignmentsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "side-offset",
      label: "Side Offset",
      demo: (
        <DemoWrapper
          title="Side Offset"
          description="Adjust the distance between the popover and its trigger element."
          code={sideOffsetCode}
        >
          <SideOffsetDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "form",
      label: "Form",
      demo: (
        <DemoWrapper
          title="Popover with Form"
          description="Popover containing form elements with focus management."
          code={formCode}
        >
          <FormDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "custom-trigger",
      label: "Custom Trigger",
      demo: (
        <DemoWrapper
          title="Custom Trigger"
          description="Use any element as the popover trigger with full customization."
          code={customTriggerCode}
        >
          <CustomTriggerDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Escape", description: "Close the popover" },
    { keys: "Tab", description: "Move focus to next focusable element" },
    { keys: "Shift + Tab", description: "Move focus to previous element" },
    { keys: "Enter / Space", description: "Activate trigger or close button" },
  ];

  const apiSections = [
    {
      title: "Popover",
      props: [
        {
          prop: "open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          prop: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state (uncontrolled).",
        },
        {
          prop: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Callback when open state changes.",
        },
        {
          prop: "modal",
          type: "boolean",
          default: "false",
          description: "When true, enables modal behavior with focus trapping.",
        },
      ],
    },
    {
      title: "PopoverTrigger",
      props: [
        {
          prop: "render",
          type: "React.ReactElement",
          description: "Element to render as the trigger. Required.",
        },
        {
          prop: "asChild",
          type: "boolean",
          description: "Merge props onto child element.",
        },
      ],
    },
    {
      title: "PopoverContent",
      props: [
        {
          prop: "side",
          type: '"top" | "bottom" | "left" | "right"',
          default: '"bottom"',
          description: "Preferred side for positioning.",
        },
        {
          prop: "sideOffset",
          type: "number",
          default: "4",
          description: "Distance from the trigger in pixels.",
        },
        {
          prop: "align",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: "Alignment relative to the trigger.",
        },
        {
          prop: "alignOffset",
          type: "number",
          default: "0",
          description: "Offset for alignment in pixels.",
        },
        {
          prop: "variant",
          type: '"default" | "outline"',
          default: '"default"',
          description: "Visual style variant.",
        },
        {
          prop: "size",
          type: '"auto" | "sm" | "md" | "lg" | "xl"',
          default: '"md"',
          description: "Width preset for the popover.",
        },
        {
          prop: "initialFocus",
          type: "boolean | (() => HTMLElement | null)",
          description: "Element to focus when popover opens.",
        },
        {
          prop: "finalFocus",
          type: "boolean | (() => HTMLElement | null)",
          description: "Element to focus when popover closes.",
        },
        {
          prop: "role",
          type: '"dialog" | "tooltip" | "listbox" | "menu"',
          description: "ARIA role for the popover content.",
        },
      ],
    },
    {
      title: "PopoverClose",
      props: [
        {
          prop: "render",
          type: "React.ReactElement",
          description: "Element to render as the close button.",
        },
      ],
    },
    {
      title: "PopoverArrow",
      props: [
        {
          prop: "variant",
          type: '"default" | "outline"',
          default: '"default"',
          description: "Should match PopoverContent variant.",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Popover"
        description="Displays rich content in a floating panel anchored to a trigger element. Supports forms, focus management, and modal behavior."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the popover components with proper accessibility."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Complete props reference for all popover components."
      />
    </ComponentPage>
  );
}
