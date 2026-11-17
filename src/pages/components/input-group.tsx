import type { ComponentProps as ReactComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { KiraSelect } from "@/components/ui/select";
import {
  IconSearch,
  IconEye,
  IconCopy,
  IconMail,
  IconCurrencyDollar,
  IconX,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
  Changelog,
  KeyboardShortcuts,
} from "@/components/docs";

function IconDemo() {
  return (
    <div className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
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
    <IconSearch className="w-4 h-4" />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
</InputGroup>`;

function TextDemo() {
  return (
    <div className="max-w-sm space-y-3">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconMail className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="you" />
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
  <InputGroupInput placeholder="example.com" />
</InputGroup>

<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconMail className="w-4 h-4" />
  </InputGroupAddon>
  <InputGroupInput placeholder="you" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>@company.com</InputGroupText>
  </InputGroupAddon>
</InputGroup>`;

function ButtonDemo() {
  return (
    <div className="max-w-sm space-y-3">
      <InputGroup>
        <InputGroupInput placeholder="Enter password" type="password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <IconEye className="w-4 h-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Copy this text" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <IconCopy className="w-4 h-4" />
            Copy
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

const buttonCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconEye, IconCopy } from "@tabler/icons-react"

<InputGroup>
  <InputGroupInput placeholder="Enter password" type="password" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton>
      <IconEye className="w-4 h-4" />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>

<InputGroup>
  <InputGroupInput placeholder="Copy this text" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton>
      <IconCopy className="w-4 h-4" />
      Copy
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`;

const usageCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { IconSearch } from "@tabler/icons-react"

export function MyInputGroup() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Password" type="password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <IconEye className="w-4 h-4" />
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

  // Clear-with-undo recipe: stash the previous value, expire after 5s,
  // pause the countdown while the strip is hovered or focused.
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
    <IconSearch className="w-4 h-4" />
  </InputGroupAddon>
  <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} />
  {q.length > 0 && (
    <InputGroupAddon align="inline-end">
      <InputGroupButton size="icon-xs" aria-label="Clear input" onClick={() => setQ("")}>
        <IconX className="size-3.5" />
      </InputGroupButton>
    </InputGroupAddon>
  )}
</InputGroup>

// Amount with inline unit selector
<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconCurrencyDollar className="w-4 h-4" />
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
      className="h-6 px-1.5 text-xs"
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

export default function InputGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Input Group"
        description="Input with addons, icons, and buttons attached."
        version="v2.2"
      />

      <FeatureGrid features={inputGroupPageFeatureGridFeatures} />

      <DemoTabs tabs={inputGroupPageDemoTabsTabs} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Input Group components together."
      />

      <KeyboardShortcuts shortcuts={inputGroupPageKeyboardShortcutsShortcuts} />

      <APIReference sections={inputGroupPageAPIReferenceSections} />

      <Changelog entries={inputGroupPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const inputGroupPageFeatureGridFeatures = [
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

const inputGroupPageDemoTabsTabs = [
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
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const inputGroupPageKeyboardShortcutsShortcuts = [
  { keys: "Tab", description: "Move focus into the group's input" },
  {
    keys: "Shift + Tab",
    description: "Move focus to the previous control",
  },
  { keys: "Enter", description: "Open or confirm the unit Select" },
  {
    keys: "Arrow Up/Down",
    description: "Navigate unit Select options",
  },
  { keys: "Escape", description: "Close the unit Select popup" },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const inputGroupPageAPIReferenceSections = [
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
        type: "React.ComponentProps<'input'>",
        default: "-",
        description: "All standard HTML input attributes.",
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
          <IconSearch className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search..."
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
              <IconX className="size-3.5" />
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
          <IconCurrencyDollar className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="0.00"
          inputMode="decimal"
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
            className="h-6 px-1.5 text-xs"
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
          <IconSearch className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Type, then clear…"
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
              <IconX className="size-3.5" />
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
          className="block flex items-center justify-between gap-2 rounded-md border bg-muted/50 px-2 py-1 text-xs text-muted-foreground"
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
