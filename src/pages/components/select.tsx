import * as React from "react";
import { IconUser } from "@tabler/icons-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  AsyncSelect,
  CreatableSelect,
  Autocomplete,
  SelectField,
  type SelectOption,
  type AutocompleteOption,
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

function MultiSelectDemo() {
  const [multiValue, setMultiValue] = React.useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <MultiSelect
          options={fruits}
          value={multiValue}
          onChange={setMultiValue}
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

const multiSelectCode = `import { MultiSelect, type SelectOption } from "@/components/ui/select"

const options: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
]

export function MultiSelectDemo() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={setSelected}
      placeholder="Select fruits..."
    />
  )
}`;

function AsyncSelectDemo() {
  const [asyncValue, setAsyncValue] = React.useState("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <AsyncSelect
          loadOptions={searchUsers}
          value={asyncValue}
          onChange={(val) => setAsyncValue(val)}
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

const asyncSelectCode = `import { AsyncSelect, type SelectOption } from "@/components/ui/select"

const searchUsers = async (query: string): Promise<SelectOption[]> => {
  const res = await fetch(\`/api/users?q=\${query}\`)
  return res.json()
}

export function AsyncSelectDemo() {
  const [value, setValue] = useState("")

  return (
    <AsyncSelect
      loadOptions={searchUsers}
      value={value}
      onChange={setValue}
      placeholder="Search users..."
    />
  )
}`;

function AutocompleteDemo() {
  const [autocompleteValue, setAutocompleteValue] = React.useState<string>("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Autocomplete
          options={fruits as AutocompleteOption[]}
          placeholder="Search fruits..."
          onChange={(v) => setAutocompleteValue(v as string)}
        />
      </div>
      {autocompleteValue && (
        <p className="text-sm text-muted-foreground">
          Selected: {autocompleteValue}
        </p>
      )}
    </div>
  );
}

const autocompleteCode = `import { Autocomplete, type AutocompleteOption } from "@/components/ui/select"

const options: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
]

export function AutocompleteDemo() {
  const [value, setValue] = useState("")

  return (
    <Autocomplete
      options={options}
      placeholder="Search fruits..."
      onChange={setValue}
    />
  )
}`;

function AutocompleteMultiDemo() {
  const [autocompleteMulti, setAutocompleteMulti] = React.useState<string[]>(
    [],
  );

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Autocomplete
          options={fruits as AutocompleteOption[]}
          multiple
          placeholder="Select multiple fruits..."
          value={autocompleteMulti}
          onChange={(v) => setAutocompleteMulti(v as string[])}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Selected: {autocompleteMulti.length} items
      </p>
    </div>
  );
}

const autocompleteMultiCode = `import { Autocomplete, type AutocompleteOption } from "@/components/ui/select"

export function AutocompleteMultiDemo() {
  const [values, setValues] = useState<string[]>([])

  return (
    <Autocomplete
      options={options}
      multiple
      placeholder="Select multiple fruits..."
      value={values}
      onChange={setValues}
    />
  )
}`;

function AutocompleteAsyncDemo() {
  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Autocomplete
          onSearch={
            searchUsers as (query: string) => Promise<AutocompleteOption[]>
          }
          debounceMs={300}
          placeholder="Type to search users..."
        />
      </div>
    </div>
  );
}

const autocompleteAsyncCode = `import { Autocomplete, type AutocompleteOption } from "@/components/ui/select"

const searchUsers = async (query: string): Promise<AutocompleteOption[]> => {
  const res = await fetch(\`/api/users?q=\${query}\`)
  return res.json()
}

export function AutocompleteAsyncDemo() {
  return (
    <Autocomplete
      onSearch={searchUsers}
      debounceMs={300}
      placeholder="Type to search users..."
    />
  )
}`;

function TriggerVariantsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Default</p>
          <SelectField options={fruits} placeholder="Default trigger" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Ghost</p>
          <SelectField
            options={fruits}
            variant="ghost"
            placeholder="Ghost trigger"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Outline</p>
          <SelectField
            options={fruits}
            variant="outline"
            placeholder="Outline trigger"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">With Left Icon</p>
          <SelectField
            options={fruits}
            leftIcon={<IconUser className="w-4 h-4" />}
            placeholder="Select user..."
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Invalid State</p>
          <SelectField
            options={fruits}
            aria-invalid={true}
            placeholder="Error state"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No Chevron</p>
          <SelectField options={fruits} hideChevron placeholder="No chevron" />
        </div>
      </div>
    </div>
  );
}

const triggerVariantsCode = `import { SelectField, type SelectOption } from "@/components/ui/select"
import { IconUser } from "@tabler/icons-react"

const options: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
]

export function TriggerVariantsDemo() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Default */}
      <SelectField options={options} placeholder="Default trigger" />

      {/* Ghost */}
      <SelectField options={options} variant="ghost" placeholder="Ghost" />

      {/* Outline */}
      <SelectField options={options} variant="outline" placeholder="Outline" />

      {/* With Icon */}
      <SelectField
        options={options}
        leftIcon={<IconUser className="w-4 h-4" />}
        placeholder="Select user..."
      />

      {/* Invalid */}
      <SelectField options={options} aria-invalid placeholder="Error state" />

      {/* No Chevron */}
      <SelectField options={options} hideChevron placeholder="No chevron" />
    </div>
  )
}`;

function CreatableSelectDemo() {
  const [creatableOptions, setCreatableOptions] =
    React.useState<SelectOption[]>(fruits);
  const [creatableValue, setCreatableValue] = React.useState<string>("");

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <CreatableSelect
          options={creatableOptions}
          value={creatableValue}
          onChange={(val) => setCreatableValue(val)}
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

const creatableSelectCode = `import { CreatableSelect, type SelectOption } from "@/components/ui/select"

export function CreatableSelectDemo() {
  const [options, setOptions] = useState<SelectOption[]>(initialOptions)
  const [value, setValue] = useState("")

  return (
    <CreatableSelect
      options={options}
      value={value}
      onChange={setValue}
      onCreateOption={(inputValue) => {
        const newOption = {
          value: inputValue.toLowerCase(),
          label: inputValue,
        }
        setOptions((prev) => [...prev, newOption])
        setValue(newOption.value)
      }}
      placeholder="Select or create..."
    />
  )
}`;

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

const usageCode = `import { MultiSelect, AsyncSelect, Autocomplete } from "@/components/ui/select"

// Multi Select
<MultiSelect
  options={[{ value: "1", label: "Option 1" }]}
  value={selected}
  onChange={setSelected}
/>

// Async Select
<AsyncSelect
  loadOptions={async (query) => {
    const res = await fetch(\`/api/search?q=\${query}\`)
    return res.json()
  }}
  onChange={(val, option) => console.log(val, option)}
/>

// Autocomplete with async search
<Autocomplete
  onSearch={searchUsers}
  debounceMs={300}
  placeholder="Type to search..."
/>`;

// =============================================================================
// Features
// =============================================================================

const features = [
  {
    title: "Accessible",
    description:
      "Full WAI-ARIA combobox pattern with keyboard navigation, screen reader announcements, and focus management.",
  },
  {
    title: "Searchable",
    description:
      "Built-in fuzzy search, async data loading with debouncing, and loading states for seamless UX.",
  },
  {
    title: "Composable",
    description:
      "Multiple variants: basic, multi-select, async, autocomplete, and creatable with custom styling support.",
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
    title: "Select",
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
      { prop: "open", type: "boolean", description: "Controlled open state" },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Called when open state changes",
      },
    ],
  },
  {
    title: "MultiSelect",
    props: [
      {
        prop: "options",
        type: "SelectOption[]",
        description: "Array of options to display",
      },
      { prop: "value", type: "string[]", description: "Selected values" },
      {
        prop: "onChange",
        type: "(value: string[]) => void",
        description: "Called when selection changes",
      },
      { prop: "placeholder", type: "string", description: "Placeholder text" },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the select",
      },
      {
        prop: "maxItems",
        type: "number",
        description: "Maximum number of selectable items",
      },
      {
        prop: "searchable",
        type: "boolean",
        default: "true",
        description: "Enable search filtering",
      },
    ],
  },
  {
    title: "AsyncSelect",
    props: [
      {
        prop: "loadOptions",
        type: "(query: string) => Promise<SelectOption[]>",
        description: "Async function to load options",
      },
      { prop: "value", type: "string", description: "Selected value" },
      {
        prop: "onChange",
        type: "(value: string, option?: SelectOption) => void",
        description: "Called when value changes",
      },
      { prop: "placeholder", type: "string", description: "Placeholder text" },
      {
        prop: "debounceMs",
        type: "number",
        default: "300",
        description: "Debounce delay for search",
      },
      {
        prop: "minChars",
        type: "number",
        default: "0",
        description: "Minimum characters before search",
      },
    ],
  },
  {
    title: "Autocomplete",
    props: [
      {
        prop: "options",
        type: "AutocompleteOption[]",
        description: "Static options array",
      },
      {
        prop: "onSearch",
        type: "(query: string) => Promise<AutocompleteOption[]>",
        description: "Async search function",
      },
      {
        prop: "value",
        type: "string | string[]",
        description: "Selected value(s)",
      },
      {
        prop: "onChange",
        type: "(value: string | string[]) => void",
        description: "Called when value changes",
      },
      {
        prop: "multiple",
        type: "boolean",
        default: "false",
        description: "Enable multi-select mode",
      },
      { prop: "placeholder", type: "string", description: "Placeholder text" },
      {
        prop: "debounceMs",
        type: "number",
        default: "300",
        description: "Debounce delay for async search",
      },
    ],
  },
  {
    title: "CreatableSelect",
    props: [
      {
        prop: "options",
        type: "SelectOption[]",
        description: "Array of options",
      },
      { prop: "value", type: "string", description: "Selected value" },
      {
        prop: "onChange",
        type: "(value: string) => void",
        description: "Called when value changes",
      },
      {
        prop: "onCreateOption",
        type: "(inputValue: string) => void",
        description: "Called when creating new option",
      },
      { prop: "placeholder", type: "string", description: "Placeholder text" },
      {
        prop: "createLabel",
        type: "(input: string) => string",
        description: "Custom create option label",
      },
    ],
  },
  {
    title: "SelectField",
    props: [
      {
        prop: "options",
        type: "SelectOption[]",
        description: "Array of options",
      },
      { prop: "value", type: "string", description: "Selected value" },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        description: "Called when value changes",
      },
      { prop: "placeholder", type: "string", description: "Placeholder text" },
      {
        prop: "variant",
        type: "'default' | 'ghost' | 'outline'",
        default: "'default'",
        description: "Trigger style variant",
      },
      {
        prop: "leftIcon",
        type: "ReactNode",
        description: "Icon to show on the left",
      },
      {
        prop: "hideChevron",
        type: "boolean",
        default: "false",
        description: "Hide the dropdown chevron",
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
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Select"
        description="Standard dropdown select with single selection."
        code={basicSelectCode}
      >
        <BasicSelectDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "multi",
    label: "Multi",
    demo: (
      <DemoWrapper
        title="Multi Select"
        description="Select multiple items with search and animated list items."
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
      <div className="space-y-6">
        <DemoWrapper
          title="Autocomplete"
          description="Searchable input with fuzzy matching, keyboard navigation, and auto-highlight."
          code={autocompleteCode}
        >
          <AutocompleteDemo />
        </DemoWrapper>
        <DemoWrapper
          title="Multi-select Autocomplete"
          description="Multi-select with inline tags, fuzzy matching, and backspace to remove."
          code={autocompleteMultiCode}
        >
          <AutocompleteMultiDemo />
        </DemoWrapper>
        <DemoWrapper
          title="Async Autocomplete"
          description="Async search with debouncing and loading indicator."
          code={autocompleteAsyncCode}
        >
          <AutocompleteAsyncDemo />
        </DemoWrapper>
      </div>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Trigger Variants"
        description="Different trigger styles including ghost, outline, icons, and states."
        code={triggerVariantsCode}
      >
        <TriggerVariantsDemo />
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
        version="v2.0"
        description="Dropdown selection component with multiple variants including multi-select, async loading, autocomplete, and creatable options."
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
    </ComponentPage>
  );
}