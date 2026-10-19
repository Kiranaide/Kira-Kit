import * as React from "react";
import { IconUser } from "@tabler/icons-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  KiraSelect,
  type SelectOption,
  type GroupedSelectOption,
} from "@/components/ui/select";
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
// Data
// =============================================================================

const fruits: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "kiwi", label: "Kiwi" },
  { value: "pineapple", label: "Pineapple" },
  { value: "strawberry", label: "Strawberry" },
];

const searchUsers = async (query: string): Promise<SelectOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allUsers = [
    { value: "1", label: "John Doe" },
    { value: "2", label: "Jane Smith" },
    { value: "3", label: "Bob Johnson" },
    { value: "4", label: "Alice Williams" },
    { value: "5", label: "Charlie Brown" },
    { value: "6", label: "Diana Prince" },
    { value: "7", label: "Edward Norton" },
    { value: "8", label: "Fiona Green" },
  ];

  if (!query) return allUsers;

  return allUsers.filter((u) =>
    u.label.toLowerCase().includes(query.toLowerCase()),
  );
};

const groupedFruits: GroupedSelectOption[] = [
  {
    label: "Citrus",
    options: [
      { value: "orange", label: "Orange" },
      { value: "lemon", label: "Lemon" },
      { value: "lime", label: "Lime" },
    ],
  },
  {
    label: "Berries",
    options: [
      { value: "strawberry", label: "Strawberry" },
      { value: "blueberry", label: "Blueberry" },
      { value: "raspberry", label: "Raspberry" },
    ],
  },
  {
    label: "Tropical",
    options: [
      { value: "mango", label: "Mango" },
      { value: "pineapple", label: "Pineapple" },
      { value: "papaya", label: "Papaya" },
    ],
  },
];

// Deterministic 5,000-option fixture for the virtualized demo (no Math.random).
const CITIES = [
  "Amsterdam",
  "Bangkok",
  "Cairo",
  "Dublin",
  "Edinburgh",
  "Frankfurt",
  "Geneva",
  "Helsinki",
  "Istanbul",
  "Jakarta",
  "Kyoto",
  "Lisbon",
  "Melbourne",
  "Nairobi",
  "Osaka",
  "Prague",
  "Quito",
  "Reykjavik",
  "Seoul",
  "Toronto",
  "Utrecht",
  "Vienna",
  "Warsaw",
  "Zurich",
] as const;

const bigOptions: SelectOption[] = Array.from({ length: 5000 }, (_, i) => {
  const city = CITIES[i % CITIES.length];
  const cycle = Math.floor(i / CITIES.length) + 1;

  return { value: `city-${i}`, label: `${city} ${cycle}` };
});

// Stress fixtures (illustrative, not real data).
const LONG_LABEL_OPTIONS: SelectOption[] = [
  {
    value: "short",
    label: "Short label",
  },
  {
    value: "long",
    label:
      "A very long option label that keeps going well past eighty characters to prove truncation behaves inside the trigger and the popup list",
  },
];

// =============================================================================
// Demo Components
// =============================================================================

function BasicSelectDemo() {
  const [basicValue, setBasicValue] = React.useState<string>("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Select
          value={basicValue}
          onValueChange={(val) => setBasicValue(val ?? "")}
        >
          <SelectTrigger>
            <SelectValue>{basicValue || "Select a fruit"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {basicValue && (
        <p className="text-sm text-muted-foreground">Selected: {basicValue}</p>
      )}
    </div>
  );
}

const basicSelectCode = `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BasicSelectDemo() {
  const [value, setValue] = useState("")

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue>{value || "Select a fruit"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}`;

// KiraSelect is the single prop-driven API — the demos below all use it.

function KiraBasicDemo() {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="space-y-4 max-w-sm">
      <KiraSelect
        options={fruits}
        value={value}
        onChange={(val) => setValue(val as string)}
        placeholder="Select a fruit"
      />
      {value && (
        <p className="text-sm text-muted-foreground">Selected: {value}</p>
      )}
    </div>
  );
}

const kiraBasicCode = `import { KiraSelect } from "@/components/ui/select"

<KiraSelect
  options={fruits}
  value={value}
  onChange={(val) => setValue(val as string)}
  placeholder="Select a fruit"
/>`;

function MultiSelectDemo() {
  const [multiValue, setMultiValue] = React.useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <KiraSelect
          options={fruits}
          multiple
          value={multiValue}
          onChange={(val) => setMultiValue(val as string[])}
          placeholder="Select fruits..."
        />
      </div>
      {multiValue.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Selected: {multiValue.join(", ")}
        </p>
      )}
    </div>
  );
}

const multiSelectCode = `import { KiraSelect } from "@/components/ui/select"

<KiraSelect
  options={options}
  multiple
  value={selected}
  onChange={(val) => setSelected(val as string[])}
  placeholder="Select fruits..."
/>`;

function AsyncSelectDemo() {
  const [asyncValue, setAsyncValue] = React.useState("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <KiraSelect
          options={[]}
          async
          onSearch={searchUsers}
          value={asyncValue}
          onChange={(val) => setAsyncValue(val as string)}
          placeholder="Search users..."
        />
      </div>
      {asyncValue && (
        <p className="text-sm text-muted-foreground">
          Selected user ID: {asyncValue}
        </p>
      )}
    </div>
  );
}

const asyncSelectCode = `import { KiraSelect } from "@/components/ui/select"

const searchUsers = async (query: string) => {
  const res = await fetch(\`/api/users?q=\${query}\`)
  return res.json()
}

<KiraSelect
  options={[]}
  async
  onSearch={searchUsers}
  value={value}
  onChange={(val) => setValue(val as string)}
  placeholder="Search users..."
/>`;

function AutocompleteDemo() {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <KiraSelect
          options={fruits}
          searchable
          value={value}
          onChange={(v) => setValue(v as string)}
          placeholder="Search fruits..."
        />
      </div>
      {value && (
        <p className="text-sm text-muted-foreground">Selected: {value}</p>
      )}
    </div>
  );
}

const autocompleteCode = `import { KiraSelect } from "@/components/ui/select"

// searchable makes the single-select filter as you type
<KiraSelect
  options={options}
  searchable
  value={value}
  onChange={(v) => setValue(v as string)}
  placeholder="Search fruits..."
/>`;

function VirtualizedSelectDemo() {
  const [value, setValue] = React.useState<string>("");

  const selected = bigOptions.find((o) => o.value === value);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <KiraSelect
          options={bigOptions}
          searchable
          virtualized
          value={value}
          onChange={(v) => setValue(String(v))}
          placeholder="Search 5,000 cities..."
        />
      </div>
      <p className="text-sm text-muted-foreground">
        5,000 options, windowed rendering.{" "}
        {selected && `Selected: ${selected.label}`}
        {!selected && "Nothing selected yet."}
      </p>
    </div>
  );
}

const virtualizedCode = `import { KiraSelect } from "@/components/ui/select"

// virtualized renders a flat window for very long lists (grouping is ignored)
<KiraSelect
  options={bigOptions}
  searchable
  virtualized
  value={value}
  onChange={(v) => setValue(v as string)}
/>`;

function GroupedSearchableDemo() {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <KiraSelect
          options={groupedFruits}
          searchable
          value={value}
          onChange={(v) => setValue(String(v))}
          placeholder="Filter grouped options..."
        />
      </div>
      {value && (
        <p className="text-sm text-muted-foreground">
          Selected: {value} — group labels stay visible while filtering.
        </p>
      )}
    </div>
  );
}

const groupedCode = `import { KiraSelect } from "@/components/ui/select"

const grouped = [
  { label: "Citrus", options: [{ value: "orange", label: "Orange" }] },
  { label: "Berries", options: [{ value: "kiwi", label: "Kiwi" }] },
]

// groups survive filtering in the rich path
<KiraSelect options={grouped} searchable />`;

function ShowcaseDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Very long label (truncation)
        </p>
        <div className="max-w-sm">
          <KiraSelect options={LONG_LABEL_OPTIONS} searchable />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Narrow container (320px)
        </p>
        <div className="max-w-[320px]">
          <KiraSelect options={fruits} searchable placeholder="Narrow..." />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          String shorthand — `options={["Data1", "Data2"]}` (searchable, rich
          path)
        </p>
        <div className="max-w-sm">
          <KiraSelect
            options={["Data1", "Data2", "Data3"]}
            searchable
            placeholder="String options..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Popup escapes overflow-hidden (portaled)
        </p>
        <div className="overflow-hidden rounded-xl border p-4">
          <div className="max-w-sm">
            <KiraSelect
              options={fruits}
              searchable
              placeholder="Open me — not clipped"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Disabled (reason: read-only dataset)
          </p>
          <KiraSelect
            options={fruits}
            disabled
            placeholder="Disabled — archive view"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Invalid</p>
          <KiraSelect
            options={fruits}
            searchable
            invalid
            placeholder="Invalid"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Empty options</p>
          <KiraSelect options={[]} placeholder="No options" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Size: sm + default</p>
          <div className="space-y-2">
            <KiraSelect options={fruits} size="sm" placeholder="Small" />
            <KiraSelect options={fruits} placeholder="Default" />
          </div>
        </div>
      </div>
    </div>
  );
}

const showcaseCode = `import { KiraSelect } from "@/components/ui/select"

// Portal keeps the popup out of overflow-hidden ancestors:
<div className="overflow-hidden rounded-xl border p-4">
  <KiraSelect options={options} searchable />
</div>

// Windowed rendering for thousands of options:
<KiraSelect options={bigOptions} searchable virtualized />`;

function CreatableSelectDemo() {
  const [creatableOptions, setCreatableOptions] =
    React.useState<SelectOption[]>(fruits);

  const [creatableValue, setCreatableValue] = React.useState<string>("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <KiraSelect
          options={creatableOptions}
          creatable
          value={creatableValue}
          onChange={(val) => setCreatableValue(String(val))}
          onCreateOption={(inputValue) => {
            const newOption = {
              value: inputValue.toLowerCase(),
              label: inputValue,
            };

            setCreatableOptions((prev) => [...prev, newOption]);
            setCreatableValue(newOption.value);
          }}
          placeholder="Select or create..."
        />
      </div>
      {creatableValue && (
        <p className="text-sm text-muted-foreground">
          Selected: {creatableValue}
        </p>
      )}
    </div>
  );
}

const creatableSelectCode = `import { KiraSelect } from "@/components/ui/select"

<KiraSelect
  options={options}
  creatable
  value={value}
  onChange={(val) => setValue(val as string)}
  onCreateOption={(input) => {
    const opt = { value: input.toLowerCase(), label: input }
    setOptions((prev) => [...prev, opt])
    setValue(opt.value)
  }}
  placeholder="Select or create..."
/>`;

function VariantsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Default</p>
          <KiraSelect options={fruits} searchable placeholder="Default" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Ghost</p>
          <KiraSelect
            options={fruits}
            searchable
            variant="ghost"
            placeholder="Ghost"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Outline</p>
          <KiraSelect
            options={fruits}
            searchable
            variant="outline"
            placeholder="Outline"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">With Left Icon</p>
          <KiraSelect
            options={fruits}
            searchable
            leftIcon={<IconUser className="w-4 h-4" />}
            placeholder="Select user..."
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Invalid State</p>
          <KiraSelect
            options={fruits}
            searchable
            invalid
            placeholder="Error state"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No Chevron</p>
          <KiraSelect
            options={fruits}
            searchable
            hideChevron
            placeholder="No chevron"
          />
        </div>
      </div>
    </div>
  );
}

const variantsCode = `import { KiraSelect } from "@/components/ui/select"
import { IconUser } from "@tabler/icons-react"

<KiraSelect options={options} searchable placeholder="Default" />
<KiraSelect options={options} searchable variant="ghost" placeholder="Ghost" />
<KiraSelect options={options} searchable variant="outline" placeholder="Outline" />
<KiraSelect options={options} searchable leftIcon={<IconUser />} placeholder="User" />
<KiraSelect options={options} searchable invalid placeholder="Error state" />
<KiraSelect options={options} searchable hideChevron placeholder="No chevron" />`;

function DisabledDemo() {
  return (
    <div className="max-w-sm">
      <Select disabled>
        <SelectTrigger>
          <SelectValue>Disabled</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option">Option</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

const disabledCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DisabledDemo() {
  return (
    <Select disabled>
      <SelectTrigger>
        <SelectValue>Disabled</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option">Option</SelectItem>
      </SelectContent>
    </Select>
  )
}`;

// =============================================================================
// Code Examples
// =============================================================================

const usageCode = `import { KiraSelect } from "@/components/ui/select"

// One component, behaviour chosen by props:
<KiraSelect options={options} />                       // basic
<KiraSelect options={options} multiple />              // multi
<KiraSelect options={[]} async onSearch={loadOptions} /> // async
<KiraSelect options={options} creatable onCreateOption={create} /> // creatable
<KiraSelect options={options} searchable />            // autocomplete
<KiraSelect options={bigOptions} searchable virtualized /> // long lists

// Low-level primitives are still available for full control:
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"`;

// =============================================================================
// Features
// =============================================================================

const features = [
  {
    title: "One API",
    description:
      "KiraSelect covers basic, multi, async, autocomplete, creatable, and virtualized — behaviour is chosen by props, not by picking a different component.",
  },
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA combobox pattern via Base UI: keyboard navigation, screen reader announcements, and focus management.",
  },
  {
    title: "Searchable & async",
    description:
      "Subsequence search, debounced async loading with pulse skeletons + Status live region, portaled collision-aware popup.",
  },
  {
    title: "Virtualized",
    description:
      "Windowed rendering for very long lists (5,000+ options) with scroll position, End/Home, and selection verified.",
  },
];

// =============================================================================
// Keyboard Shortcuts
// =============================================================================

const keyboardShortcuts = [
  { keys: "↓ / ↑", description: "Navigate options — inherited from Base UI" },
  {
    keys: "Home / End",
    description: "Jump to first / last option — inherited from Base UI",
  },
  {
    keys: "Enter",
    description: "Select highlighted option — inherited from Base UI",
  },
  { keys: "Escape", description: "Close dropdown — inherited from Base UI" },
  {
    keys: "Type",
    description: "Typeahead / filter options — inherited from Base UI",
  },
  {
    keys: "Backspace",
    description:
      "Remove last chip (multi, empty input) — inherited from Base UI",
  },
  {
    keys: "Tab",
    description: "Move focus out of select — inherited from Base UI",
  },
  {
    keys: "Enter",
    description: "Kira: create item flow when 'Create \"…\"' is highlighted",
  },
];

// =============================================================================
// API Reference
// =============================================================================

const apiSections = [
  {
    title: "KiraSelect",
    props: [
      {
        prop: "options",
        type: "SelectOption[] | GroupedSelectOption[]",
        description: "Options to display (flat or grouped)",
      },
      {
        prop: "value / defaultValue",
        type: "string | string[]",
        description: "Selected value(s); array when multiple",
      },
      {
        prop: "onChange",
        type: "(value, option) => void",
        description: "Called with the new value and matching option(s)",
      },
      {
        prop: "multiple",
        type: "boolean",
        default: "false",
        description: "Tag-style multi-select",
      },
      {
        prop: "searchable",
        type: "boolean",
        default: "false",
        description: "Filter options as you type (autocomplete)",
      },
      {
        prop: "async",
        type: "boolean",
        default: "false",
        description: "Load options via onSearch with debouncing",
      },
      {
        prop: "virtualized",
        type: "boolean",
        default: "false",
        description:
          "Windowed rendering for very long lists (renders a flat window; grouping is ignored)",
      },
      {
        prop: "onSearch",
        type: "(query) => Promise<SelectOption[]>",
        description: "Async loader (required when async)",
      },
      {
        prop: "creatable",
        type: "boolean",
        default: "false",
        description: "Offer to create an option from the query",
      },
      {
        prop: "onCreateOption",
        type: "(input: string) => void",
        description: "Called when a new option is created",
      },
      {
        prop: "variant",
        type: "'default' | 'ghost' | 'outline'",
        default: "'default'",
        description: "Trigger style (rich path)",
      },
      {
        prop: "invalid",
        type: "boolean",
        default: "false",
        description: "Sets aria-invalid + destructive ring",
      },
      {
        prop: "leftIcon / hideChevron / maxDisplayedTags",
        type: "ReactNode / boolean / number",
        description: "Trigger adornments and tag overflow cap",
      },
    ],
  },
  {
    title: "Select (primitive)",
    props: [
      { prop: "value", type: "string", description: "Controlled value" },
      {
        prop: "defaultValue",
        type: "string",
        description: "Initial value for uncontrolled mode",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        description: "Called when value changes",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the select",
      },
    ],
  },
];

// =============================================================================
// Demo Tabs Configuration
// =============================================================================

const demoTabs = [
  {
    value: "basic",
    label: "Basic (primitive)",
    demo: (
      <DemoWrapper
        title="Basic Select"
        description="Low-level primitives for full control over the markup."
        code={basicSelectCode}
      >
        <BasicSelectDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraSelect",
    demo: (
      <DemoWrapper
        title="KiraSelect (single API)"
        description="Prop-driven select from an options array — the recommended entry point."
        code={kiraBasicCode}
      >
        <KiraBasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "multi",
    label: "Multi",
    demo: (
      <DemoWrapper
        title="Multi Select"
        description="Tag-style multi-select with search and animated list items."
        code={multiSelectCode}
      >
        <MultiSelectDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async",
    label: "Async",
    demo: (
      <DemoWrapper
        title="Async Select"
        description="Search with debounced API calls, loading state, and animated results."
        code={asyncSelectCode}
      >
        <AsyncSelectDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "autocomplete",
    label: "Autocomplete",
    demo: (
      <DemoWrapper
        title="Autocomplete"
        description="A searchable single-select with fuzzy matching and keyboard navigation."
        code={autocompleteCode}
      >
        <AutocompleteDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "creatable",
    label: "Creatable",
    demo: (
      <DemoWrapper
        title="Creatable Select"
        description="Type to search or create new options. Press Enter to create when no match is found."
        code={creatableSelectCode}
      >
        <CreatableSelectDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Trigger Variants"
        description="Ghost, outline, left icon, invalid, and no-chevron — all via KiraSelect props."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled",
    label: "Disabled",
    demo: (
      <DemoWrapper
        title="Disabled State"
        description="Select in disabled state, preventing user interaction."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "virtualized",
    label: "Virtualized",
    demo: (
      <DemoWrapper
        title="Virtualized Long List"
        description="5,000 options rendered as a flat window (grouping is ignored while virtualized)."
        code={virtualizedCode}
      >
        <VirtualizedSelectDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "grouped",
    label: "Grouped + search",
    demo: (
      <DemoWrapper
        title="Grouped Options with Search"
        description="Group labels survive filtering in the rich path."
        code={groupedCode}
      >
        <GroupedSearchableDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "showcase",
    label: "Showcase",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, narrow containers, overflow escape, disabled/invalid/empty states, sizes."
        code={showcaseCode}
      >
        <ShowcaseDemo />
      </DemoWrapper>
    ),
  },
];

// =============================================================================
// Page Component
// =============================================================================

export default function SelectPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Select"
        version="v3.2"
        description="Dropdown selection with a single prop-driven API (KiraSelect) covering multi-select, async loading, autocomplete, and creatable options."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns for select components"
      />

      <APIReference sections={apiSections} />

      <Changelog
        entries={[
          {
            version: "3.2.0",
            date: "18 October 2026",
            changes: [
              {
                type: "fixed",
                title: "Duplicate Selection in Multi-Select",
                description:
                  "Picking the same option twice appended it twice instead of toggling: items now emit the derived string value so Base UI's selected-value comparison matches.",
              },
              {
                type: "fixed",
                title: "Empty Gap Above the List",
                description:
                  "Base UI keeps the Empty element mounted even when the list is non-empty, which painted a blank strip above every popup. It now collapses with empty:hidden.",
              },
              {
                type: "added",
                title: "String Array Options Shorthand",
                description:
                  "options now accepts a plain string array (options={[\"Data1\", \"Data2\"]}) in addition to option objects and groups; each string becomes { value, label }. Works on both the simple and the rich (searchable) path.",
              },
            ],
          },
          {
            version: "3.1.0",
            date: "18 October 2026",
            changes: [
              {
                type: "changed",
                title: "v2 rebuild on Base UI 1.9.0",
                description:
                  "Rich path (searchable/async/creatable/multiple) rebuilt on the Base UI Combobox primitive; popup is now portaled and collision-aware; grouped options render grouped in all modes; new virtualized prop for windowed long lists; async loading shows pulse rows + a polite Status live region. Audited against @base-ui/react 1.9.0.",
              },
              {
                type: "breaking",
                title: "SelectField export removed",
                description:
                  "Use <KiraSelect />. SelectFieldProps-only props (showSearchIcon, fuzzyMatching, filterFn, debounceMs, cacheOptions, onSearchChange, onClearAll, onOpenChange) were never exposed on KiraSelect and are gone with it. AutocompleteOption type removed (dead code).",
              },
              {
                type: "fixed",
                title: "Search crash on regex metacharacters",
                description:
                  "Typing (, [, or * in a searchable select used to throw Invalid regular expression during render and crash the page; matching is now a two-pointer subsequence match that cannot throw.",
              },
              {
                type: "fixed",
                title: "Sticky selected label in the input",
                description:
                  "After picking an option, reopening no longer keeps the selected label in the input and filter the list down to just that option.",
              },
              {
                type: "fixed",
                title: "List re-stagger on every keystroke",
                description:
                  "GSAP stagger now plays once per open, not while typing; still gated on prefers-reduced-motion.",
              },
            ],
          },
          {
            version: "3.0.0",
            date: "13 July 2026",
            changes: [
              {
                type: "added",
                title: "KiraSelect — single combobox API",
                description:
                  "One prop-driven component covering basic, multiple, searchable, async, and creatable. Routes to the Base UI Select (simple) or the Base UI Combobox (rich).",
              },
              {
                type: "breaking",
                title:
                  "Removed MultiSelect / AsyncSelect / CreatableSelect / Autocomplete",
                description:
                  "Migrate to <KiraSelect multiple />, <KiraSelect async onSearch={…} />, <KiraSelect creatable />, and <KiraSelect searchable /> respectively.",
              },
              {
                type: "fixed",
                title: "Chevron rotation & tag removal",
                description:
                  "The trigger chevron now rotates on open (correct Base UI data attribute); Backspace no longer removes two tags at once.",
              },
              {
                type: "fixed",
                title: "Reduced motion",
                description:
                  "Popup enter/exit animations on both the primitive and the field are gated on prefers-reduced-motion.",
              },
              {
                type: "removed",
                title: "Dead virtualization props",
                description:
                  "virtualize / virtualItemHeight / overscan were never implemented and have been removed.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
