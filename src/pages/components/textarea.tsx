import * as React from "react";
import {
  IconTextResize,
  IconLetterCase,
  IconAccessible,
} from "@tabler/icons-react";

import {
  Textarea,
  TextareaWithCounter,
  KiraTextarea,
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
  Changelog,
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

const kiraCode = `import { useState } from "react"
import { KiraTextarea } from "@/components/ui/textarea"

export function KiraTextareaDemo() {
  const [messages, setMessages] = useState<string[]>([])

  return (
    <KiraTextarea
      label="Comment"
      description="Press Cmd/Ctrl + Enter to submit."
      maxLength={280}
      showCount
      clearable
      submitOn="mod-enter"
      onSubmit={(v) => setMessages((m) => [...m, v])}
      placeholder="Share your thoughts..."
    />
  )
}`;

const submitCode = `import { KiraTextarea } from "@/components/ui/textarea"

// Cmd/Ctrl + Enter (default) — safe for multi-line editing
<KiraTextarea submitOn="mod-enter" onSubmit={handleSend} />

// Plain Enter submits, Shift + Enter inserts a newline (chat-style)
<KiraTextarea submitOn="enter" onSubmit={handleSend} />`;

const clearCode = `import { KiraTextarea } from "@/components/ui/textarea"

// Clear button appears when there's content; keeps focus on clear
<KiraTextarea clearable label="Notes" placeholder="Type then clear..." />`;

const usageCode = `import { Textarea, TextareaWithCounter, KiraTextarea } from "@/components/ui/textarea"

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
/>

// KiraTextarea — label + counter + clear + keyboard submit in one API
<KiraTextarea
  label="Comment"
  description="Cmd/Ctrl + Enter to submit."
  maxLength={280}
  showCount
  clearable
  submitOn="mod-enter"
  onSubmit={(value) => console.log(value)}
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
  const [resize, setResize] = React.useState<
    "none" | "vertical" | "horizontal" | "both"
  >("none");

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
        <label className="text-sm font-medium">
          Fixed height (no auto-size)
        </label>
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

function KiraDemo() {
  const [messages, setMessages] = React.useState<string[]>([]);

  return (
    <div className="max-w-md space-y-4">
      <KiraTextarea
        label="Comment"
        description="Press Cmd/Ctrl + Enter to submit."
        maxLength={280}
        showCount
        clearable
        submitOn="mod-enter"
        onSubmit={(v) => setMessages((m) => [...m, v])}
        placeholder="Share your thoughts..."
      />
      {messages.length > 0 && (
        <ul className="space-y-1.5 text-sm">
          {messages.map((m, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5"
            >
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmitDemo() {
  const [sent, setSent] = React.useState<string | null>(null);

  return (
    <div className="max-w-md space-y-6">
      <KiraTextarea
        label="Mod + Enter (default)"
        description="Cmd/Ctrl + Enter submits; Enter inserts a newline."
        submitOn="mod-enter"
        onSubmit={setSent}
        placeholder="Write a paragraph, then Cmd/Ctrl + Enter..."
      />
      <KiraTextarea
        label="Enter to send (chat-style)"
        description="Enter submits; Shift + Enter inserts a newline."
        submitOn="enter"
        onSubmit={setSent}
        placeholder="Type a message and press Enter..."
      />
      {sent && (
        <p className="text-sm text-muted-foreground">
          Last submitted: <span className="text-foreground">{sent}</span>
        </p>
      )}
    </div>
  );
}

function ClearDemo() {
  return (
    <div className="max-w-md">
      <KiraTextarea
        clearable
        label="Notes"
        defaultValue="Clear me — the button keeps focus on the field."
        placeholder="Type something, then clear it..."
      />
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
        description:
          "Maximum number of visible rows (affects max-height, enables scroll)",
      },
      {
        prop: "autoSize",
        type: "boolean",
        default: "true",
        description:
          "Enable auto-sizing based on content using CSS field-sizing",
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
  {
    title: "KiraTextarea",
    props: [
      {
        prop: "label",
        type: "string",
        description: "Visible label rendered above the textarea",
      },
      {
        prop: "description",
        type: "string",
        description: "Helper text linked via aria-describedby",
      },
      {
        prop: "error",
        type: "string",
        description: "Error message; sets aria-invalid and role=alert",
      },
      {
        prop: "maxLength",
        type: "number",
        description: "Enables the accessible character counter",
      },
      {
        prop: "showCount",
        type: "boolean",
        default: "false",
        description: "Show current/max counter (requires maxLength)",
      },
      {
        prop: "showRemaining",
        type: "boolean",
        default: "false",
        description: "Show remaining count instead of current/max",
      },
      {
        prop: "hardLimit",
        type: "boolean",
        default: "false",
        description: "Enforce native maxLength truncation instead of soft over-limit",
      },
      {
        prop: "clearable",
        type: "boolean",
        default: "false",
        description: "Show a clear button when the field has content",
      },
      {
        prop: "onSubmit",
        type: "(value: string) => void",
        description: "Fires on the submit combo with the trimmed value",
      },
      {
        prop: "submitOn",
        type: '"enter" | "mod-enter"',
        default: '"mod-enter"',
        description: "Which key combo triggers onSubmit",
      },
    ],
  },
];

// =============================================================================
// DEMO TABS
// =============================================================================

const demoTabs = [
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="KiraTextarea"
        description="One prop-driven API: label, description, accessible counter, clear button, and keyboard submit."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "submit",
    label: "Submit",
    demo: (
      <DemoWrapper
        title="Keyboard Submit"
        description="Cmd/Ctrl + Enter (default) or plain Enter (chat-style). IME composition is guarded."
        code={submitCode}
      >
        <SubmitDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "clear",
    label: "Clear",
    demo: (
      <DemoWrapper
        title="Clear Button"
        description="Appears when the field has content, empties the value, and keeps focus on the textarea."
        code={clearCode}
      >
        <ClearDemo />
      </DemoWrapper>
    ),
  },
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

export default function TextareaPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Textarea"
        version="v2.0"
        description="Multi-line text input with auto-resize, an accessible character counter, keyboard submit, a clear button, and the unified KiraTextarea API."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="kira" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns and configuration options"
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props for Textarea, TextareaWithCounter, and KiraTextarea"
      />

      <Changelog
        entries={[
          {
            version: "v2.0",
            date: "2026-07-22",
            changes: [
              {
                type: "added",
                title: "KiraTextarea",
                description:
                  "One prop-driven API bundling label, description, error, accessible counter, clear button, and keyboard submit.",
              },
              {
                type: "added",
                title: "Keyboard submit",
                description:
                  'onSubmit with submitOn "enter" or "mod-enter"; guards IME composition and skips empty values.',
              },
              {
                type: "added",
                title: "Clear button",
                description:
                  "clearable prop shows an IconX button that empties the value and keeps focus on the field.",
              },
              {
                type: "changed",
                title: "Accessible character counter",
                description:
                  "TextareaWithCounter now uses the 3-element GOV.UK/USWDS pattern: static hint, aria-hidden visible counter, and a debounced sr-only live region — no more per-keystroke screen-reader flooding.",
              },
              {
                type: "changed",
                title: "Soft character limit",
                description:
                  "Over-limit input is allowed and flagged via aria-invalid instead of silent truncation. Opt back into truncation with hardLimit.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
