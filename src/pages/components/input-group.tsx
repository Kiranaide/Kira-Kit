import type { ComponentProps as ReactComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
  IconCheck,
  IconCopy,
  IconCurrencyDollar,
  IconEye,
  IconEyeOff,
  IconMail,
  IconSearch,
  IconX,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { KiraSelect } from "@/components/ui/select";

function IconDemo() {
  return (
    <div className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." aria-label="Search" />
      </InputGroup>
    </div>
  );
}

const iconCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconSearch } from "@tabler/icons-react"

<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconSearch className="size-4" aria-hidden="true" />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." aria-label="Search" />
</InputGroup>`;

function TextDemo() {
  return (
    <div className="max-w-sm space-y-3">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" aria-label="Website URL" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconMail className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput placeholder="you" aria-label="Email username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

const textCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { IconMail } from "@tabler/icons-react"

<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="example.com" aria-label="Website URL" />
</InputGroup>

<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconMail className="size-4" aria-hidden="true" />
  </InputGroupAddon>
  <InputGroupInput placeholder="you" aria-label="Email username" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>@company.com</InputGroupText>
  </InputGroupAddon>
</InputGroup>`;

function ButtonDemo() {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-sm space-y-3">
      <InputGroup>
        <InputGroupInput
          placeholder="Enter password"
          type={showPassword ? "text" : "password"}
          aria-label="Password"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IconEyeOff className="size-4" aria-hidden="true" />
            ) : (
              <IconEye className="size-4" aria-hidden="true" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          defaultValue="https://kira-kit.dev/r/input-group.json"
          readOnly
          aria-label="Registry URL"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={handleCopy}>
            {copied ? (
              <IconCheck className="size-4" aria-hidden="true" />
            ) : (
              <IconCopy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

const buttonCode = `import { useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconCheck, IconCopy, IconEye, IconEyeOff } from "@tabler/icons-react"

export function ButtonDemo() {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <div className="max-w-sm space-y-3">
      <InputGroup>
        <InputGroupInput
          placeholder="Enter password"
          type={showPassword ? "text" : "password"}
          aria-label="Password"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IconEyeOff className="size-4" aria-hidden="true" />
            ) : (
              <IconEye className="size-4" aria-hidden="true" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupInput
          defaultValue="https://kira-kit.dev/r/input-group.json"
          readOnly
          aria-label="Registry URL"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => setCopied(true)}>
            {copied ? (
              <IconCheck className="size-4" aria-hidden="true" />
            ) : (
              <IconCopy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}`;

const units = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "gbp", label: "GBP" },
];

function RecipesDemo() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [unit, setUnit] = useState("usd");
  const [undoValue, setUndoValue] = useState("");
  const [clearedValue, setClearedValue] = useState<string | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  const undoRemainingRef = useRef(0);
  const undoStartedAtRef = useRef(0);

  const stopUndoTimer = () => {
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  useEffect(() => stopUndoTimer, []);

  const pauseUndoTimer = () => {
    if (undoTimerRef.current === null) return;

    undoRemainingRef.current = Math.max(
      0,
      undoRemainingRef.current - (Date.now() - undoStartedAtRef.current),
    );
    stopUndoTimer();
  };

  const scheduleUndoExpiry = () => {
    stopUndoTimer();

    undoStartedAtRef.current = Date.now();
    undoTimerRef.current = window.setTimeout(() => {
      undoTimerRef.current = null;
      setClearedValue(null);
    }, undoRemainingRef.current);
  };

  const undo = () => {
    stopUndoTimer();

    const restored = clearedValue;
    setClearedValue(null);

    if (restored !== null) {
      setUndoValue(restored);
    }
  };

  const handleUndoClear = () => {
    stopUndoTimer();

    undoRemainingRef.current = 5000;
    undoStartedAtRef.current = Date.now();
    undoTimerRef.current = window.setTimeout(() => {
      undoTimerRef.current = null;
      setClearedValue(null);
    }, 5000);
    setClearedValue(undoValue);
    setUndoValue("");
  };

  return (
    <div className="max-w-sm space-y-4">
      <RecipesLeadingIconClearableSection note={note} setNote={setNote} />

      <RecipesAmountWithInlineUnitSelectorSection
        amount={amount}
        setAmount={setAmount}
        units={units}
        unit={unit}
        setUnit={setUnit}
      />

      <RecipesLeadingTextCharacterCounterSection
        note={note}
        setNote={setNote}
      />

      <RecipesClearWithUndo5sHoverSection
        undoValue={undoValue}
        setUndoValue={setUndoValue}
        handleUndoClear={handleUndoClear}
        clearedValue={clearedValue}
        pauseUndoTimer={pauseUndoTimer}
        scheduleUndoExpiry={scheduleUndoExpiry}
        undo={undo}
      />
    </div>
  );
}

const recipesCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { KiraSelect } from "@/components/ui/select"
import { IconSearch, IconX, IconCurrencyDollar } from "@tabler/icons-react"

// Leading icon + clearable
<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconSearch className="size-4" aria-hidden="true" />
  </InputGroupAddon>
  <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} />
  {q.length > 0 && (
    <InputGroupAddon align="inline-end">
      <InputGroupButton size="icon-xs" aria-label="Clear input" onClick={() => setQ("")}>
        <IconX className="size-3" aria-hidden="true" />
      </InputGroupButton>
    </InputGroupAddon>
  )}
</InputGroup>

// Amount with inline unit selector
<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconCurrencyDollar className="size-4" aria-hidden="true" />
  </InputGroupAddon>
  <InputGroupInput placeholder="0.00" inputMode="decimal" />
  <InputGroupAddon align="inline-end">
    <KiraSelect
      options={[{ value: "usd", label: "USD" }, { value: "eur", label: "EUR" }]}
      value={unit}
      onChange={(next) => setUnit(String(next))}
      size="sm"
      variant="ghost"
      aria-label="Select unit"
      className="h-6 px-2 text-xs"
    />
  </InputGroupAddon>
</InputGroup>

// Character counter
<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>@</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput maxLength={15} value={v} onChange={(e) => setV(e.target.value)} />
  <InputGroupAddon align="inline-end">
    <InputGroupText aria-live="polite" className="text-xs">
      {v.length}/15
    </InputGroupText>
  </InputGroupAddon>
</InputGroup>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Long prefix, suffix, and unbroken value
        </p>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://workspace.</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            defaultValue="enterprise-international-deployment-subpath"
            aria-label="Workspace endpoint"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.internal</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Empty value with placeholder
        </p>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <IconSearch className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            defaultValue=""
            placeholder="No filter applied"
            aria-label="Empty filter"
          />
        </InputGroup>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Disabled state
        </p>
        <InputGroup data-disabled="true">
          <InputGroupAddon align="inline-start">
            <IconMail className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            disabled
            defaultValue="locked@company.com"
            aria-label="Locked email"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton disabled size="xs">
              Verify
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Textarea with block-end bar
        </p>
        <InputGroup>
          <InputGroupTextarea
            rows={2}
            placeholder="Add deployment notes..."
            aria-label="Deployment notes"
          />
          <InputGroupAddon
            align="block-end"
            className="justify-between border-t"
          >
            <InputGroupText className="text-xs">Markdown</InputGroupText>
            <InputGroupButton size="xs">Save</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

const stressCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { IconMail, IconSearch } from "@tabler/icons-react"

<div className="max-w-xs space-y-4">
  <InputGroup>
    <InputGroupAddon align="inline-start">
      <InputGroupText>https://workspace.</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput
      defaultValue="enterprise-international-deployment-subpath"
      aria-label="Workspace endpoint"
    />
    <InputGroupAddon align="inline-end">
      <InputGroupText>.internal</InputGroupText>
    </InputGroupAddon>
  </InputGroup>

  <InputGroup>
    <InputGroupAddon align="inline-start">
      <IconSearch className="size-4" aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupInput defaultValue="" placeholder="No filter applied" aria-label="Empty filter" />
  </InputGroup>

  <InputGroup data-disabled="true">
    <InputGroupAddon align="inline-start">
      <IconMail className="size-4" aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupInput disabled defaultValue="locked@company.com" aria-label="Locked email" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton disabled size="xs">Verify</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>

  <InputGroup>
    <InputGroupTextarea rows={2} placeholder="Add deployment notes..." aria-label="Deployment notes" />
    <InputGroupAddon align="block-end" className="justify-between border-t">
      <InputGroupText className="text-xs">Markdown</InputGroupText>
      <InputGroupButton size="xs">Save</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</div>`;

const usageCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { IconEye, IconSearch } from "@tabler/icons-react"

export function MyInputGroup() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." aria-label="Search" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" aria-label="Website" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Password" type="password" aria-label="Password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Toggle password visibility">
            <IconEye className="size-4" aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}`;

export default function InputGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Input Group"
        description="Input with addons, icons, and buttons attached."
        version="v2.3.1"
      />

      <FeatureGrid
        features={inputGroupPageFeatures}
        description="Compound primitives for icons, static affixes, inline actions, and textarea toolbars."
      />

      <DemoTabs defaultValue="icon" tabs={inputGroupPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={inputGroupPageShortcuts}
        description="Keyboard navigation across inputs, addon buttons, and inline selects."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and compose the Input Group primitives together."
        notes={inputGroupPageUsageNotes}
      />

      <APIReference
        sections={inputGroupPageAPISections}
        description="Props, types, and defaults for every exported Input Group part."
      />

      <Changelog
        entries={inputGroupPageChangelogEntries}
        title="Changelog"
        description="Version history for Input Group."
      />
    </ComponentPage>
  );
}

const inputGroupPageFeatures = [
  {
    title: "Flexible Alignment",
    description:
      "Support for inline and block positioning with inline-start, inline-end, block-start, and block-end options.",
  },
  {
    title: "Rich Content",
    description:
      "Add icons, text labels, or action buttons to create enhanced input experiences.",
  },
  {
    title: "Accessible",
    description:
      "Proper ARIA roles and keyboard navigation for screen reader compatibility.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const inputGroupPageDemoTabs = [
  {
    value: "icon",
    label: "Icon",
    demo: (
      <DemoWrapper
        title="With Icon"
        description="Add icons to input for enhanced visual context."
        code={iconCode}
      >
        <IconDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "text",
    label: "Text",
    demo: (
      <DemoWrapper
        title="With Text Addons"
        description="Prefix or suffix text labels to inputs for fixed values."
        code={textCode}
      >
        <TextDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "button",
    label: "Button",
    demo: (
      <DemoWrapper
        title="With Button"
        description="Add action buttons like password toggle or copy functionality."
        code={buttonCode}
      >
        <ButtonDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "recipes",
    label: "Recipes",
    demo: (
      <DemoWrapper
        title="Recipes"
        description="Common addons composed from the compound parts: clearable input, inline unit selector, and a character counter."
        code={recipesCode}
      >
        <RecipesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long affixes and values, empty state, disabled controls, and block-end textarea bars in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const inputGroupPageShortcuts = [
  {
    keys: "Tab",
    description: "Move focus into the group's input or addon button.",
  },
  {
    keys: "Shift + Tab",
    description: "Move focus to the previous control.",
  },
  {
    keys: "Enter",
    description: "Activate focused addon button or open inline Select.",
  },
  {
    keys: "Arrow Up/Down",
    description:
      "Navigate inline Select options when an addon renders KiraSelect.",
  },
  { keys: "Escape", description: "Close an open inline Select popup." },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const inputGroupPageUsageNotes = [
  {
    label: "Addon alignment",
    body: 'Use "inline-start" and "inline-end" for single-line inputs, or "block-start" and "block-end" to stack header and footer bars around InputGroupTextarea.',
  },
  {
    label: "Click-to-focus",
    body: "Clicking non-interactive text or icon areas inside InputGroupAddon automatically focuses the sibling input or textarea without interfering with addon buttons.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const inputGroupPageAPISections = [
  {
    title: "InputGroup",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the container.",
      },
    ],
  },
  {
    title: "InputGroupAddon",
    props: [
      {
        prop: "align",
        type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
        default: '"inline-start"',
        description: "Position of the addon relative to the input.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the addon.",
      },
    ],
  },
  {
    title: "InputGroupButton",
    props: [
      {
        prop: "type",
        type: '"button" | "submit" | "reset"',
        default: '"button"',
        description: "Button type attribute.",
      },
      {
        prop: "variant",
        type: "Button variant",
        default: '"ghost"',
        description: "Visual style of the button.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
        default: '"xs"',
        description: "Size of the button.",
      },
    ],
  },
  {
    title: "InputGroupInput",
    props: [
      {
        prop: "...props",
        type: "Omit<React.ComponentProps<'input'>, 'size'>",
        default: "-",
        description:
          "Standard HTML input attributes forwarded to Base UI Input.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the input.",
      },
    ],
  },
  {
    title: "InputGroupText",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Text content to display in the addon.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the text.",
      },
    ],
  },
  {
    title: "InputGroupTextarea",
    props: [
      {
        prop: "...props",
        type: "React.ComponentProps<'textarea'>",
        default: "-",
        description: "All standard HTML textarea attributes.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the textarea.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const inputGroupPageChangelogEntries = [
  {
    version: "2.3.1",
    date: "28 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Aligned addon spacing with Input's 4px optical rhythm",
        description:
          "Updated inline-start/inline-end addon insets to logical ps-3/pe-3 (ps-2/pe-2 for buttons and kbd) and increased the addon-to-input gap to 8px (ps-2/pe-2), removing half-step spacing and arbitrary negative margin hacks while improving RTL support and respecting prefers-reduced-motion.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: "Shell height matches the default control",
        description:
          "InputGroup shell height increased from h-8 to h-9 so it sits flush beside default Button/Input/Select, and inner input horizontal padding increased to px-3. Compact addon buttons keep their in-control affordance sizing.",
      },
    ],
  },
  {
    version: "2.2.1",
    date: "17 October 2026",
    changes: [
      {
        type: "removed",
        title: "KiraInputGroup removed",
        description:
          "Its features duplicated Input (clear, counter) or are composable in a few lines from the compound parts. The Recipes tab shows the equivalent compositions: clearable input, inline unit selector (KiraSelect), character counter, and the clear-with-undo strip.",
      },
      {
        type: "fixed",
        title: "Input fills remaining width",
        description:
          "InputGroupInput now renders the input as a direct child of the group, so it flexes to fill the space between addons instead of collapsing to a fixed width.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "17 October 2026",
    changes: [
      {
        type: "added",
        title: "Clear with Undo",
        description:
          "KiraInputGroup gains undoDuration (ms). With clearable, clearing shows a 'Cleared — Undo' strip for that duration; hovering or focusing the strip pauses the timer (WCAG 2.2.2). Default 0 = instant clear, unchanged behavior.",
      },
      {
        type: "changed",
        title: "Unit selector on shared Select",
        description:
          "InputGroupUnitSelect now renders the shared Select primitive instead of a hand-rolled outside-click popover — full keyboard navigation, correct listbox semantics.",
      },
      {
        type: "changed",
        title: "Counter near-limit warning",
        description:
          "The counter turns warning-colored at ≥90% of maxLength and destructive at the limit, matching Input's showCount.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "10 July 2026",
    changes: [
      {
        type: "added",
        title: "KiraInputGroup",
        description:
          "Added a prop-driven KiraInputGroup that composes leading icon/text, an inline unit/currency selector, a clear button, and a live character counter behind a single API — matching the Kira* convention used across the library.",
      },
      {
        type: "added",
        title: "Inline Unit Selector",
        description:
          "Exposed InputGroupUnitSelect, a compact dropdown addon for units and currencies that sits flush against the input.",
      },
      {
        type: "changed",
        title: "Accessibility Polish",
        description:
          "Added a data-slot to InputGroupText and ensured icon-only addon buttons meet the 24px minimum target size.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function RecipesLeadingIconClearableSection({
  note,
  setNote,
}: {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Leading icon + clearable
      </p>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search..."
          aria-label="Clearable search"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {note.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Clear input"
              onClick={() => setNote("")}
            >
              <IconX className="size-3" aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}

function RecipesAmountWithInlineUnitSelectorSection({
  amount,
  setAmount,
  units,
  unit,
  setUnit,
}: {
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  units: { value: string; label: string }[];
  unit: string;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Amount with inline unit selector
      </p>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconCurrencyDollar className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="0.00"
          inputMode="decimal"
          aria-label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <KiraSelect
            options={units}
            value={unit}
            onChange={(next) => setUnit(String(next))}
            size="sm"
            variant="ghost"
            aria-label="Select unit"
            className="h-6 px-2 text-xs"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function RecipesLeadingTextCharacterCounterSection({
  note,
  setNote,
}: {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Leading text + character counter
      </p>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          maxLength={15}
          aria-label="Handle"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText aria-live="polite" className="text-xs">
            {note.length}/15
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function RecipesClearWithUndo5sHoverSection({
  undoValue,
  setUndoValue,
  handleUndoClear,
  clearedValue,
  pauseUndoTimer,
  scheduleUndoExpiry,
  undo,
}: {
  undoValue: string;
  setUndoValue: React.Dispatch<React.SetStateAction<string>>;
  handleUndoClear: () => void;
  clearedValue: string | null;
  pauseUndoTimer: () => void;
  scheduleUndoExpiry: () => void;
  undo: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Clear with undo (5s, hover pauses the timer)
      </p>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="size-4" aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Type, then clear…"
          aria-label="Clearable input with undo"
          value={undoValue}
          onChange={(e) => setUndoValue(e.target.value)}
        />
        {undoValue.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Clear input"
              onClick={handleUndoClear}
            >
              <IconX className="size-3" aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      {clearedValue !== null && (
        <div
          onMouseEnter={pauseUndoTimer}
          onMouseLeave={scheduleUndoExpiry}
          onFocus={pauseUndoTimer}
          onBlur={scheduleUndoExpiry}
          className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
        >
          <output>Cleared</output>
          <button
            type="button"
            onClick={undo}
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
