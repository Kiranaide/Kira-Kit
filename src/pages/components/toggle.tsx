import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
} from "@tabler/icons-react";

export function TogglePage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Toggle & Toggle Group</h1>
        <p className="text-muted-foreground">
          A two-state button and groupings of toggles.
        </p>
      </header>

      {/* Basic Toggle */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Toggle
        </h2>
        <div className="flex gap-2">
          <Toggle aria-label="Toggle bold">
            <IconBold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle italic">
            <IconItalic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle underline">
            <IconUnderline className="h-4 w-4" />
          </Toggle>
        </div>
      </section>

      {/* Toggle Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Variants
        </h2>
        <div className="flex gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Default</p>
            <Toggle variant="default">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outline</p>
            <Toggle variant="outline">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </section>

      {/* Toggle Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Sizes
        </h2>
        <div className="flex items-center gap-4">
          <Toggle size="sm">
            <IconBold className="h-3 w-3" />
          </Toggle>
          <Toggle size="default">
            <IconBold className="h-4 w-4" />
          </Toggle>
          <Toggle size="lg">
            <IconBold className="h-5 w-5" />
          </Toggle>
        </div>
      </section>

      {/* Toggle Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Group
        </h2>
        <ToggleGroup>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <IconBold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <IconItalic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <IconUnderline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Single Selection Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Single Selection (Alignment)
        </h2>
        <ToggleGroup defaultValue={["left"]}>
          <ToggleGroupItem value="left" aria-label="Align left">
            <IconAlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <IconAlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <IconAlignRight className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" aria-label="Align justify">
            <IconAlignJustified className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Outline Variant Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Outline Variant Group
        </h2>
        <ToggleGroup variant="outline" defaultValue={["left"]}>
          <ToggleGroupItem value="left" variant="outline">
            <IconAlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" variant="outline">
            <IconAlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" variant="outline">
            <IconAlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

{/* Single Toggle */}
<Toggle aria-label="Toggle bold">
  <IconBold className="h-4 w-4" />
</Toggle>

{/* Toggle Group */}
<ToggleGroup defaultValue={["left"]}>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
</ToggleGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
