import * as React from "react";
import {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
} from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IconHeart, IconStar, IconBookmark } from "@tabler/icons-react";

export function CheckboxPage() {
  const [groupValue, setGroupValue] = React.useState<string[]>(["banana"]);

  const fruitOptions = [
    { value: "apple", label: "Apple", description: "A sweet red fruit" },
    { value: "banana", label: "Banana", description: "A yellow curved fruit" },
    { value: "orange", label: "Orange", description: "A citrus fruit" },
    { value: "grape", label: "Grape", disabled: true },
  ];

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Checkbox</h1>
        <p className="text-muted-foreground">
          A control that allows the user to toggle between checked and
          unchecked.
        </p>
      </header>

      {/* Basic Checkbox */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Checkbox
        </h2>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="size-sm" size="sm" checked />
            <Label htmlFor="size-sm">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="size-default" size="default" checked />
            <Label htmlFor="size-default">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="size-lg" size="lg" checked />
            <Label htmlFor="size-lg">Large</Label>
          </div>
        </div>
      </section>

      {/* Custom Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Icons
        </h2>
        <p className="text-sm text-muted-foreground">
          Use the customIcon prop to display a different icon when checked.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="heart"
              customIcon={<IconHeart className="h-3 w-3" strokeWidth={3} />}
            />
            <Label htmlFor="heart">Favorite</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="star"
              customIcon={<IconStar className="h-3 w-3" strokeWidth={3} />}
            />
            <Label htmlFor="star">Star</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bookmark"
              customIcon={<IconBookmark className="h-3 w-3" strokeWidth={3} />}
            />
            <Label htmlFor="bookmark">Bookmark</Label>
          </div>
        </div>
      </section>

      {/* Indeterminate State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Indeterminate State
        </h2>
        <div className="flex items-center space-x-2">
          <Checkbox id="indeterminate" checked="indeterminate" />
          <Label htmlFor="indeterminate">Partially selected</Label>
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled States
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label
              htmlFor="disabled-unchecked"
              className="text-muted-foreground"
            >
              Disabled unchecked
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-checked" disabled checked />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
        </div>
      </section>

      {/* CheckboxWithLabel */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          CheckboxWithLabel
        </h2>
        <p className="text-sm text-muted-foreground">
          A convenience wrapper with built-in label and description.
        </p>
        <div className="space-y-3 max-w-md">
          <CheckboxWithLabel
            label="Enable notifications"
            description="Receive push notifications on your device"
          />
          <CheckboxWithLabel
            label="Marketing emails"
            description="Get updates about new features"
            checked
          />
        </div>
      </section>

      {/* CheckboxGroup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          CheckboxGroup
        </h2>
        <p className="text-sm text-muted-foreground">
          Grouped checkboxes with optional select-all functionality.
        </p>
        <div className="max-w-md">
          <CheckboxGroup
            label="Select your favorite fruits"
            description="Choose one or more options"
            options={fruitOptions}
            value={groupValue}
            onChange={setGroupValue}
            showSelectAll
            selectAllLabel="Select all fruits"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: {groupValue.join(", ") || "None"}
        </p>
      </section>

      {/* Horizontal CheckboxGroup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal CheckboxGroup
        </h2>
        <div className="max-w-lg">
          <CheckboxGroup
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "angular", label: "Angular" },
              { value: "svelte", label: "Svelte" },
            ]}
            orientation="horizontal"
          />
        </div>
      </section>
    </div>
  );
}
