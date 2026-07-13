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
          onChange={(val) => setCreatableValue(val as string)}
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
      "KiraSelect covers basic, multi, async, autocomplete, and creatable — behaviour is chosen by props, not by picking a different component.",
  },
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA combobox pattern with keyboard navigation, screen reader announcements, and focus management.",
  },
  {
    title: "Searchable & async",
    description:
      "Built-in fuzzy search, debounced async loading, loading states, and reduced-motion-gated animations.",
  },
];

// =============================================================================
// Keyboard Shortcuts
// =============================================================================

const keyboardShortcuts = [
  { keys: "↓ / ↑", description: "Navigate options" },
  { keys: "Enter", description: "Select focused option" },
  { keys: "Escape", description: "Close dropdown" },
  { keys: "Home", description: "Jump to first option" },
  { keys: "End", description: "Jump to last option" },
  { keys: "Backspace", description: "Remove last tag (multi-select)" },
  { keys: "Type", description: "Filter options (searchable)" },
  { keys: "Tab", description: "Move focus out of select" },
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
];

// =============================================================================
// Page Component
// =============================================================================

export default function SelectPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Select"
        version="v3.0"
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
            version: "v3.0.0",
            date: "2026-07-13",
            changes: [
              {
                type: "added",
                title: "KiraSelect — single combobox API",
                description:
                  "One prop-driven component covering basic, multiple, searchable, async, and creatable. Routes to the Base UI Select (simple) or the SelectField engine (rich).",
              },
              {
                type: "breaking",
                title: "Removed MultiSelect / AsyncSelect / CreatableSelect / Autocomplete",
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
