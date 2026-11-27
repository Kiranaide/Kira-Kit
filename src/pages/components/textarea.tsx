import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconAccessible,
  IconLetterCase,
  IconTextResize,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  KiraTextarea,
  Textarea,
  TextareaWithCounter,
} from "@/components/ui/textarea";
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
      <div className="space-y-2">
        <label className="text-sm font-medium">Extra Large</label>
        <Textarea size="xl" placeholder="Extra large textarea..." />
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
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([])

  return (
    <KiraTextarea
      label="Comment"
      description="Press Cmd/Ctrl + Enter to submit."
      maxLength={280}
      showCount
      clearable
      submitOn="mod-enter"
      onSubmit={(text) =>
        setMessages((current) => [...current, { id: crypto.randomUUID(), text }])
      }
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

const validationCode = `import { KiraTextarea } from "@/components/ui/textarea"

export function ValidationDemo() {
  return (
    <KiraTextarea
      label="Username"
      placeholder="3-20 characters, letters and numbers only"
      validate={(value) => {
        if (value.length < 3) return "Must be at least 3 characters."
        if (value.length > 20) return "Must be at most 20 characters."
        if (!/^[a-zA-Z0-9]+$/.test(value)) return "Letters and numbers only."
        return null
      }}
    />
  )
}`;

const stressCode = `import { KiraTextarea } from "@/components/ui/textarea"

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraTextarea
        label="Incident post-mortem summary and cross-functional remediation timeline"
        description="Long label, over-limit text, clear button, and counter inside a narrow container."
        maxLength={60}
        showCount
        clearable
        defaultValue="This prefilled summary intentionally exceeds the sixty-character soft limit to verify wrapping, clear button offset, and error styling."
      />
      <KiraTextarea
        label="Empty optional notes"
        placeholder=""
        maxLength={120}
        showCount
      />
      <KiraTextarea
        label="Disabled narrow field"
        disabled
        clearable
        defaultValue="Disabled content cannot be edited or cleared."
      />
    </div>
  )
}`;

const usageCode = `import { Textarea, TextareaWithCounter, KiraTextarea } from "@/components/ui/textarea"

// Basic textarea
<Textarea placeholder="Type here..." />

// Size variants
<Textarea size="sm" />
<Textarea size="default" />
<Textarea size="lg" />
<Textarea size="xl" />

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

function BasicDemo() {
  return (
    <div className="max-w-md">
      <Textarea placeholder="Type your message here..." />
    </div>
  );
}

function SizesDemo() {
  const textareaLabelsId = React.useId();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-1`}
          className="text-sm font-medium"
        >
          Small
        </label>
        <Textarea
          id={`${textareaLabelsId}-1`}
          size="sm"
          placeholder="Small textarea..."
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-2`}
          className="text-sm font-medium"
        >
          Default
        </label>
        <Textarea
          id={`${textareaLabelsId}-2`}
          size="default"
          placeholder="Default textarea..."
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-3`}
          className="text-sm font-medium"
        >
          Large
        </label>
        <Textarea
          id={`${textareaLabelsId}-3`}
          size="lg"
          placeholder="Large textarea..."
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-4`}
          className="text-sm font-medium"
        >
          Extra Large
        </label>
        <Textarea
          id={`${textareaLabelsId}-4`}
          size="xl"
          placeholder="Extra large textarea..."
        />
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
    <div className="max-w-md space-y-4">
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
      <div className="flex items-center gap-4">
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
  const textareaLabelsId = React.useId();
  const [counterValue, setCounterValue] = React.useState("");

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-4`}
          className="text-sm font-medium"
        >
          Show Current/Max
        </label>
        <TextareaWithCounter
          id={`${textareaLabelsId}-4`}
          value={counterValue}
          onChange={(e) => setCounterValue(e.target.value)}
          maxLength={200}
          warningThreshold={0.8}
          placeholder="Type something..."
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-5`}
          className="text-sm font-medium"
        >
          Show Remaining
        </label>
        <TextareaWithCounter
          id={`${textareaLabelsId}-5`}
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
  const textareaLabelsId = React.useId();

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-6`}
          className="text-sm font-medium"
        >
          Auto-size (default)
        </label>
        <Textarea
          id={`${textareaLabelsId}-6`}
          placeholder="This textarea auto-sizes based on content..."
          autoSize={true}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-7`}
          className="text-sm font-medium"
        >
          Fixed height (no auto-size)
        </label>
        <Textarea
          id={`${textareaLabelsId}-7`}
          placeholder="This textarea has a fixed height..."
          autoSize={false}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-8`}
          className="text-sm font-medium"
        >
          With min/max rows
        </label>
        <Textarea
          id={`${textareaLabelsId}-8`}
          placeholder="Min 2 rows, max 6 rows..."
          minRows={2}
          maxRows={6}
        />
      </div>
    </div>
  );
}

function DisabledDemo() {
  const textareaLabelsId = React.useId();

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-9`}
          className="text-sm font-medium"
        >
          Disabled
        </label>
        <Textarea
          id={`${textareaLabelsId}-9`}
          disabled
          placeholder="This textarea is disabled..."
          defaultValue="You cannot edit this content."
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${textareaLabelsId}-10`}
          className="text-sm font-medium"
        >
          Read-only
        </label>
        <Textarea
          id={`${textareaLabelsId}-10`}
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

function KiraDemo() {
  const [messages, setMessages] = React.useState<
    { id: string; text: string }[]
  >([]);

  return (
    <div className="max-w-md space-y-4">
      <KiraTextarea
        label="Comment"
        description="Press Cmd/Ctrl + Enter to submit."
        maxLength={280}
        showCount
        clearable
        submitOn="mod-enter"
        onSubmit={(text) =>
          setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), text },
          ])
        }
        placeholder="Share your thoughts..."
      />
      {messages.length > 0 && (
        <ul className="space-y-1.5 text-sm">
          {messages.map((message) => (
            <li
              key={message.id}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5"
            >
              {message.text}
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
      {sent !== null && sent.length > 0 && (
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

function ValidationDemoLive() {
  return (
    <div className="max-w-md">
      <KiraTextarea
        label="Username"
        placeholder="3-20 characters, letters and numbers only"
        validate={(value) => {
          if (value.length < 3) return "Must be at least 3 characters.";

          if (value.length > 20) return "Must be at most 20 characters.";

          if (!/^[a-zA-Z0-9]+$/.test(value)) return "Letters and numbers only.";

          return null;
        }}
      />
    </div>
  );
}

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraTextarea
        label="Incident post-mortem summary and cross-functional remediation timeline"
        description="Long label, over-limit text, clear button, and counter inside a narrow container."
        maxLength={60}
        showCount
        clearable
        defaultValue="This prefilled summary intentionally exceeds the sixty-character soft limit to verify wrapping, clear button offset, and error styling."
      />
      <KiraTextarea
        label="Empty optional notes"
        placeholder=""
        maxLength={120}
        showCount
      />
      <KiraTextarea
        label="Disabled narrow field"
        disabled
        clearable
        defaultValue="Disabled content cannot be edited or cleared."
      />
    </div>
  );
}

export default function TextareaPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Textarea"
        version="v2.3.0"
        description="Multi-line text input with auto-resize, an accessible character counter, keyboard submit, a clear button, and the unified KiraTextarea API."
      />

      <FeatureGrid
        features={textareaPageFeatures}
        description="Capabilities built into Kira Kit."
      />

      <DemoTabs tabs={textareaPageDemoTabs} defaultValue="kira" />

      <KeyboardShortcuts
        shortcuts={textareaPageShortcuts}
        description="Native editing shortcuts plus KiraTextarea submit bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns and configuration options."
        notes={[
          {
            label: "KiraTextarea",
            body: "Prefer KiraTextarea when you need a wired label, helper description, accessible counter, clear button, inline validation, or keyboard submit.",
          },
          {
            label: "Textarea vs TextareaWithCounter",
            body: "Use Textarea for bare form controls and TextareaWithCounter when you only need the GOV.UK/USWDS accessible counter without field chrome.",
          },
        ]}
      />

      <APIReference
        sections={textareaPageAPISections}
        title="API reference"
        description="Props for Textarea, TextareaWithCounter, and KiraTextarea."
      />

      <Changelog
        entries={textareaPageChangelogEntries}
        title="Changelog"
        description="Version history for Textarea."
      />
    </ComponentPage>
  );
}

const textareaPageFeatures = [
  {
    title: "Auto-resize",
    description:
      "Automatically adjusts height based on content using CSS field-sizing. Configure min/max rows for constraints.",
    icon: <IconTextResize className="size-4" />,
  },
  {
    title: "Character Counter",
    description:
      "Real-time character counter with warning at 80% and error at 100%. Shows current/max or remaining characters.",
    icon: <IconLetterCase className="size-4" />,
  },
  {
    title: "Accessible",
    description:
      "WCAG 2.2 AA compliant with aria-describedby, aria-invalid, debounced aria-live regions, and 3:1 contrast focus indicators.",
    icon: <IconAccessible className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const textareaPageDemoTabs = [
  {
    value: "kira",
    label: "Kira",
    group: "KiraTextarea",
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
    group: "KiraTextarea",
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
    group: "KiraTextarea",
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
    value: "validation",
    label: "Validation",
    group: "KiraTextarea",
    demo: (
      <DemoWrapper
        title="Inline validation"
        description="Validates on blur by default (not per keystroke); revalidates on change once it has run."
        code={validationCode}
      >
        <ValidationDemoLive />
      </DemoWrapper>
    ),
  },
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Choose from sm, default, lg, or xl sizes — horizontal padding follows the shared control ladder (px-3/4/5/5)."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "resize",
    label: "Resize",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Behavior",
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
    group: "Behavior",
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
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, over-limit text, empty values, and disabled states inside a narrow max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const textareaPageShortcuts = [
  {
    keys: "Tab",
    group: "Native Textarea",
    description: "Move focus to or from the textarea.",
  },
  {
    keys: "Shift + Tab",
    group: "Native Textarea",
    description: "Move focus backwards.",
  },
  {
    keys: "Enter",
    group: "Native Textarea",
    description: "Insert a new line (or submit when submitOn='enter').",
  },
  {
    keys: "Cmd/Ctrl + Enter",
    group: "KiraTextarea",
    description:
      "Trigger onSubmit with the trimmed value when submitOn='mod-enter' (default).",
  },
  {
    keys: "Shift + Enter",
    group: "KiraTextarea",
    description: "Insert a new line when submitOn='enter'.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const textareaPageAPISections = [
  {
    title: "Textarea",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description:
          "Size variant affecting padding, min-height, and font size.",
      },
      {
        prop: "resize",
        type: '"none" | "vertical" | "horizontal" | "both"',
        default: '"none"',
        description: "Controls resize behavior of the textarea.",
      },
      {
        prop: "minRows",
        type: "number",
        default: "-",
        description: "Minimum number of visible rows (affects min-height).",
      },
      {
        prop: "maxRows",
        type: "number",
        default: "-",
        description:
          "Maximum number of visible rows (affects max-height, enables scroll).",
      },
      {
        prop: "autoSize",
        type: "boolean",
        default: "true",
        description:
          "Enable auto-sizing based on content using CSS field-sizing.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes applied to the textarea element.",
      },
    ],
  },
  {
    title: "TextareaWithCounter",
    props: [
      {
        prop: "maxLength",
        type: "number",
        default: "-",
        description: "Maximum character count (required).",
      },
      {
        prop: "warningThreshold",
        type: "number",
        default: "0.8",
        description: "Threshold (0-1) at which to show warning color.",
      },
      {
        prop: "showRemaining",
        type: "boolean",
        default: "false",
        description: "Show remaining characters instead of current/max.",
      },
      {
        prop: "hardLimit",
        type: "boolean",
        default: "false",
        description:
          "Enforce native maxLength truncation instead of allowing soft over-limit.",
      },
      {
        prop: "renderCounter",
        type: "(props: { current: number; max: number; remaining: number; isWarning: boolean; isError: boolean }) => React.ReactNode",
        default: "-",
        description: "Custom counter render function.",
      },
      {
        prop: "wrapperClassName",
        type: "string",
        default: "-",
        description: "Additional class for the wrapper element.",
      },
    ],
  },
  {
    title: "KiraTextarea",
    props: [
      {
        prop: "label",
        type: "string",
        default: "-",
        description: "Visible label rendered above the textarea.",
      },
      {
        prop: "description",
        type: "string",
        default: "-",
        description: "Helper text linked via aria-describedby.",
      },
      {
        prop: "error",
        type: "string",
        default: "-",
        description: "Error message; sets aria-invalid and role=alert.",
      },
      {
        prop: "maxLength",
        type: "number",
        default: "-",
        description: "Enables the accessible character counter.",
      },
      {
        prop: "showCount",
        type: "boolean",
        default: "false",
        description: "Show current/max counter (requires maxLength).",
      },
      {
        prop: "showRemaining",
        type: "boolean",
        default: "false",
        description: "Show remaining count instead of current/max.",
      },
      {
        prop: "warningThreshold",
        type: "number",
        default: "0.8",
        description:
          "Threshold (0-1) at which the counter switches to warning.",
      },
      {
        prop: "hardLimit",
        type: "boolean",
        default: "false",
        description:
          "Enforce native maxLength truncation instead of soft over-limit.",
      },
      {
        prop: "clearable",
        type: "boolean",
        default: "false",
        description: "Show a clear button when the field has content.",
      },
      {
        prop: "onSubmit",
        type: "(value: string) => void",
        default: "-",
        description: "Fires on the submit combo with the trimmed value.",
      },
      {
        prop: "submitOn",
        type: '"enter" | "mod-enter"',
        default: '"mod-enter"',
        description: "Which key combo triggers onSubmit.",
      },
      {
        prop: "validate",
        type: "(value: string) => string | null",
        default: "-",
        description:
          "Inline validation; the returned message renders as the error text, null clears it.",
      },
      {
        prop: "validationMode",
        type: '"onBlur" | "onChange"',
        default: '"onBlur"',
        description:
          "When validation runs; onChange revalidates after the first run.",
      },
      {
        prop: "wrapperClassName",
        type: "string",
        default: "-",
        description: "Additional class for the outer field wrapper.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const textareaPageChangelogEntries = [
  {
    version: "2.3.0",
    date: "18 November 2026",
    changes: [
      {
        type: "added",
        title: "xl size",
        description:
          "New xl size (px-5 py-3, min-h-24, text-base) completes the ladder; auto-height math gains paddingY 24 for xl.",
      },
      {
        type: "changed",
        title: "Ladder-aligned padding",
        description:
          "Horizontal padding now matches the shared control ladder: sm px-3, default px-4, lg px-5 (were px-2/2.5/3). KiraTextarea's clear button aligns to the container padding with the single-action text offset per size.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "22 October 2026",
    changes: [
      {
        type: "added",
        title: "Inline validation (KiraTextarea)",
        description:
          "validate + validationMode (default onBlur) replace per-keystroke error spam; validated messages render with aria-invalid wired.",
      },
      {
        type: "changed",
        title: "Re-audited against Base UI 1.9.0",
        description:
          "The stock Base UI textarea remains a bare styled textarea; parity reconfirmed, no primitive changes required.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "22 July 2026",
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
] satisfies ReactComponentProps<typeof Changelog>["entries"];
