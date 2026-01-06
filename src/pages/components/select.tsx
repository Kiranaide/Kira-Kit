import * as React from "react";
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
  type SelectOption,
} from "@/components/ui/select";

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

// Simulate async API call
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
    u.label.toLowerCase().includes(query.toLowerCase())
  );
};

export function SelectPage() {
  const [multiValue, setMultiValue] = React.useState<string[]>([]);
  const [asyncValue, setAsyncValue] = React.useState("");

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Select</h1>
        <p className="text-muted-foreground">
          Dropdown selection component with customizable options.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Select
        </h2>
        <div className="max-w-sm">
          <Select>
            <SelectTrigger>
              <SelectValue>Select a fruit</SelectValue>
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
      </section>

      {/* Multi Select */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Multi Select
        </h2>
        <p className="text-sm text-muted-foreground">
          Select multiple items with search and animated list items.
        </p>
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
      </section>

      {/* Async Select */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Async Select
        </h2>
        <p className="text-sm text-muted-foreground">
          Search with debounced API calls, loading state, and animated results.
        </p>
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
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled
        </h2>
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
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { MultiSelect, AsyncSelect } from "@/components/ui/select"

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
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
