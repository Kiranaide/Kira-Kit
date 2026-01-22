import * as React from "react";
import {
  IconTextResize,
  IconLetterCase,
  IconAccessible,
} from "@tabler/icons-react";

import {
  Textarea,
  TextareaWithCounter,
} from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

// =============================================================================
// CODE SNIPPETS
// =============================================================================

const basicCode = `import { Textarea } from "@/components/ui/textarea"

export function BasicTextareaDemo() {
  return (
    <Textarea placeholder="Type your message here..." />
  )
}`;

const sizesCode = `import { Textarea } from "@/components/ui/textarea"

export function SizeVariantsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Small</label>
        <Textarea size="sm" placeholder="Small textarea..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Textarea size="default" placeholder="Default textarea..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Large</label>
        <Textarea size="lg" placeholder="Large textarea..." />
      </div>
    </div>
  )
}`;

const resizeCode = `import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ResizeControlDemo() {
  const [resize, setResize] = useState<"none" | "vertical" | "horizontal" | "both">("none")

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={resize === "none" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("none")}
        >
          None
        </Button>
        <Button
          variant={resize === "vertical" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("vertical")}
        >
          Vertical
        </Button>
        <Button
          variant={resize === "horizontal" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("horizontal")}
        >
          Horizontal
        </Button>
        <Button
          variant={resize === "both" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("both")}
        >
          Both
        </Button>
      </div>
      <Textarea
        resize={resize}
        placeholder={\`Resize: \${resize}\`}
        minRows={3}
        maxRows={10}
      />
    </div>
  )
}`;

const counterCode = `import { useState } from "react"
import { TextareaWithCounter } from "@/components/ui/textarea"

export function CharacterCounterDemo() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Show Current/Max</label>
        <TextareaWithCounter
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          warningThreshold={0.8}
          placeholder="Type something..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Show Remaining</label>
        <TextareaWithCounter
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          warningThreshold={0.8}
          showRemaining
          placeholder="Type something..."
        />
      </div>
    </div>
  )
}`;

const autoSizeCode = `import { Textarea } from "@/components/ui/textarea"

export function AutoSizeDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Auto-size (default)</label>
        <Textarea
          placeholder="This textarea auto-sizes based on content..."
          autoSize={true}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Fixed height (no auto-size)</label>
        <Textarea
          placeholder="This textarea has a fixed height..."
          autoSize={false}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">With min/max rows</label>
        <Textarea
          placeholder="Min 2 rows, max 6 rows..."
          minRows={2}
          maxRows={6}
        />
      </div>
    </div>
  )
}`;

const disabledCode = `import { Textarea } from "@/components/ui/textarea"

export function DisabledDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Disabled</label>
        <Textarea
          disabled
          placeholder="This textarea is disabled..."
          defaultValue="You cannot edit this content."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Read-only</label>
        <Textarea
          readOnly
          defaultValue="This content is read-only but can be selected and copied."
        />
      </div>
    </div>
  )
}`;

const accessibilityCode = `import { useState } from "react"
import { TextareaWithCounter } from "@/components/ui/textarea"

export function AccessibilityDemo() {
  const [value, setValue] = useState("")
  const hasError = value.length > 80

  return (
    <div className="space-y-2">
      <label htmlFor="feedback" className="text-sm font-medium">
        Feedback (required)
      </label>
      <TextareaWithCounter
        id="feedback"
        maxLength={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={hasError}
        aria-required
        aria-describedby="feedback-hint"
        placeholder="Over 80 characters shows error state..."
      />
      <p id="feedback-hint" className="text-xs text-muted-foreground">
        Please provide detailed feedback. Maximum 100 characters.
      </p>
    </div>
  )
}`;

const usageCode = `import { Textarea, TextareaWithCounter } from "@/components/ui/textarea"

// Basic textarea
<Textarea placeholder="Type here..." />

// Size variants
<Textarea size="sm" />
<Textarea size="default" />
<Textarea size="lg" />

// Resize control
<Textarea resize="vertical" />
<Textarea resize="horizontal" />
<Textarea resize="both" />
<Textarea resize="none" /> {/* default */}

// Auto-size with constraints
<Textarea autoSize minRows={3} maxRows={10} />

// Character counter
<TextareaWithCounter
  maxLength={500}
  warningThreshold={0.8}
  showRemaining
/>

// Accessibility
<Textarea
  aria-describedby="helper-text"
  aria-required
  aria-invalid={hasError}
/>`;

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicDemo() {
  return (
    <div className="max-w-md">
      <Textarea placeholder="Type your message here..." />
    </div>
  );
}

function SizesDemo() {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="space-y-2">
        <label className="text-sm font-medium">Small</label>
        <Textarea size="sm" placeholder="Small textarea..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default</label>
        <Textarea size="default" placeholder="Default textarea..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Large</label>
        <Textarea size="lg" placeholder="Large textarea..." />
      </div>
    </div>
  );
}

function ResizeDemo() {
  const [resize, setResize] = React.useState<"none" | "vertical" | "horizontal" | "both">("none");
  const [useMinRows, setUseMinRows] = React.useState(false);
  const [useMaxRows, setUseMaxRows] = React.useState(false);

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={resize === "none" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("none")}
        >
          None
        </Button>
        <Button
          variant={resize === "vertical" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("vertical")}
        >
          Vertical
        </Button>
        <Button
          variant={resize === "horizontal" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("horizontal")}
        >
          Horizontal
        </Button>
        <Button
          variant={resize === "both" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setResize("both")}
        >
          Both
        </Button>
      </div>
      <Textarea
        resize={resize}
        placeholder={`Resize: ${resize}`}
        minRows={useMinRows ? 3 : undefined}
        maxRows={useMaxRows ? 10 : undefined}
      />
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useMinRows}
            onChange={(e) => setUseMinRows(e.target.checked)}
          />
          Min Rows (3)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useMaxRows}
            onChange={(e) => setUseMaxRows(e.target.checked)}
          />
          Max Rows (10)
        </label>
      </div>
    </div>
  );
}

function CounterDemo() {
  const [counterValue, setCounterValue] = React.useState("");

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Show Current/Max</label>
        <TextareaWithCounter
          value={counterValue}
          onChange={(e) => setCounterValue(e.target.value)}
          maxLength={200}
          warningThreshold={0.8}
          placeholder="Type something..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Show Remaining</label>
        <TextareaWithCounter
          value={counterValue}
          onChange={(e) => setCounterValue(e.target.value)}
          maxLength={200}
          warningThreshold={0.8}
          showRemaining
          placeholder="Type something..."
        />
      </div>
    </div>
  );
}

function AutoSizeDemo() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <label className="text-sm font-medium">Auto-size (default)</label>
        <Textarea
          placeholder="This textarea auto-sizes based on content..."
          autoSize={true}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Fixed height (no auto-size)</label>
        <Textarea
          placeholder="This textarea has a fixed height..."
          autoSize={false}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">With min/max rows</label>
        <Textarea
          placeholder="Min 2 rows, max 6 rows..."
          minRows={2}
          maxRows={6}
        />
      </div>
    </div>
  );
}

function DisabledDemo() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <label className="text-sm font-medium">Disabled</label>
        <Textarea
          disabled
          placeholder="This textarea is disabled..."
          defaultValue="You cannot edit this content."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Read-only</label>
        <Textarea
          readOnly
          defaultValue="This content is read-only but can be selected and copied."
        />
      </div>
    </div>
  );
}

function AccessibilityDemo() {
  const [value, setValue] = React.useState("");
  const hasError = value.length > 80;

  return (
    <div className="max-w-md space-y-2">
      <label htmlFor="feedback" className="text-sm font-medium">
        Feedback (required)
      </label>
      <TextareaWithCounter
        id="feedback"
        maxLength={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={hasError}
        aria-required
        aria-describedby="feedback-hint"
        placeholder="Over 80 characters shows error state..."
      />
      <p id="feedback-hint" className="text-xs text-muted-foreground">
        Please provide detailed feedback. Maximum 100 characters.
      </p>
    </div>
  );
}

// =============================================================================
// FEATURES
// =============================================================================

const features = [
  {
    title: "Auto-resize",
    description:
      "Automatically adjusts height based on content using CSS field-sizing. Configure min/max rows for constraints.",
    icon: <IconTextResize className="h-4 w-4" />,
  },
  {
    title: "Character Counter",
    description:
      "Real-time character counter with warning at 80% and error at 100%. Shows current/max or remaining characters.",
    icon: <IconLetterCase className="h-4 w-4" />,
  },
  {
    title: "Accessible",
    description:
      "WCAG 2.2 AA compliant with aria-describedby, aria-invalid, aria-live regions, and 3:1 contrast focus indicators.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
];

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

const keyboardShortcuts = [
  { keys: "Tab", description: "Move focus to/from textarea" },
  { keys: "Shift + Tab", description: "Move focus backwards" },
  { keys: "Enter", description: "Insert new line" },
  { keys: "Ctrl + A", description: "Select all text" },
  { keys: "Ctrl + C", description: "Copy selected text" },
  { keys: "Ctrl + V", description: "Paste from clipboard" },
];

// =============================================================================
// API REFERENCE
// =============================================================================

const apiSections = [
  {
    title: "Textarea",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size variant affecting padding and font size",
      },
      {
        prop: "resize",
        type: '"none" | "vertical" | "horizontal" | "both"',
        default: '"none"',
        description: "Controls resize behavior of the textarea",
      },
      {
        prop: "minRows",
        type: "number",
        description: "Minimum number of visible rows (affects min-height)",
      },
      {
        prop: "maxRows",
        type: "number",
        description: "Maximum number of visible rows (affects max-height, enables scroll)",
      },
      {
        prop: "autoSize",
        type: "boolean",
        default: "true",
        description: "Enable auto-sizing based on content using CSS field-sizing",
      },
    ],
  },
  {
    title: "TextareaWithCounter",
    props: [
      {
        prop: "maxLength",
        type: "number",
        description: "Maximum character count (required)",
      },
      {
        prop: "warningThreshold",
        type: "number",
        default: "0.8",
        description: "Threshold (0-1) at which to show warning color",
      },
      {
        prop: "showRemaining",
        type: "boolean",
        default: "false",
        description: "Show remaining characters instead of current/max",
      },
      {
        prop: "renderCounter",
        type: "(props) => ReactNode",
        description: "Custom counter render function",
      },
      {
        prop: "wrapperClassName",
        type: "string",
        description: "Additional class for the wrapper element",
      },
    ],
  },
];

// =============================================================================
// DEMO TABS
// =============================================================================

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Textarea"
        description="Simple multi-line text input with default styling."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Choose from sm, default, or lg sizes for different visual emphasis."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "resize",
    label: "Resize",
    demo: (
      <DemoWrapper
        title="Resize Control"
        description="Control how users can resize the textarea: none, vertical, horizontal, or both."
        code={resizeCode}
      >
        <ResizeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "counter",
    label: "Character Count",
    demo: (
      <DemoWrapper
        title="Character Counter"
        description="Real-time character counter with warning at 80% and error at 100%."
        code={counterCode}
      >
        <CounterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "autosize",
    label: "Auto-size",
    demo: (
      <DemoWrapper
        title="Auto-size"
        description="Automatically adjusts height based on content with optional min/max row constraints."
        code={autoSizeCode}
      >
        <AutoSizeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled",
    label: "Disabled",
    demo: (
      <DemoWrapper
        title="Disabled & Read-only"
        description="Disabled textareas cannot be edited or focused. Read-only textareas can be selected and copied."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "accessibility",
    label: "Accessibility",
    demo: (
      <DemoWrapper
        title="Accessibility Features"
        description="Built with WCAG 2.2 AA compliance including ARIA attributes and live regions."
        code={accessibilityCode}
      >
        <AccessibilityDemo />
      </DemoWrapper>
    ),
  },
];

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export function TextareaPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Textarea"
        version="v1.0"
        description="Multi-line text input with auto-resize, character counter, size variants, and full accessibility support."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns and configuration options"
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props for Textarea and TextareaWithCounter components"
      />
    </ComponentPage>
  );
}
