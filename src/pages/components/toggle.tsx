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
  IconBookmark,
  IconHeart,
  IconStar,
} from "@tabler/icons-react";
import { useState } from "react";

export function TogglePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Toggle & Toggle Group</h1>
        <p className="text-muted-foreground">
          Accessible two-state buttons with WCAG 2.2 AA compliance. Uses proper{" "}
          <code>aria-pressed</code> states and keyboard navigation.
        </p>
      </header>

      {/* Basic Toggle */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Toggle
        </h2>
        <p className="text-sm text-muted-foreground">
          Icon-only toggles require <code>aria-label</code> for accessibility.
        </p>
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
        <div className="flex gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Default</p>
            <Toggle variant="default" aria-label="Toggle default">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outline</p>
            <Toggle variant="outline" aria-label="Toggle outline">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ghost</p>
            <Toggle variant="ghost" aria-label="Toggle ghost">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Solid</p>
            <Toggle variant="solid" aria-label="Toggle solid">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </section>

      {/* Semantic Color Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Semantic Color Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Toggle buttons with semantic colors when pressed. Uses icons in
          addition to color for accessibility.
        </p>
        <div className="flex gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Success</p>
            <Toggle variant="success" defaultPressed>
              Accept
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Warning</p>
            <Toggle variant="warning" defaultPressed>
              Warn
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Destructive</p>
            <Toggle variant="destructive" defaultPressed>
              Delete
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
          <Toggle size="sm" aria-label="Small toggle">
            <IconBold className="h-3.5 w-3.5" />
          </Toggle>
          <Toggle size="default" aria-label="Default toggle">
            <IconBold className="h-4 w-4" />
          </Toggle>
          <Toggle size="lg" aria-label="Large toggle">
            <IconBold className="h-5 w-5" />
          </Toggle>
          <Toggle size="icon" aria-label="Icon only toggle">
            <IconBold className="h-4 w-4" />
          </Toggle>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <p className="text-sm text-muted-foreground">
          Show a loading spinner while processing. The toggle is disabled during
          loading.
        </p>
        <div className="flex gap-4 items-center">
          <Toggle loading={isLoading} onClick={handleLoadingDemo}>
            {isLoading ? "Loading..." : "Click to Load"}
          </Toggle>
          <Toggle loading aria-label="Always loading">
            <IconBold className="h-4 w-4" />
          </Toggle>
        </div>
      </section>

      {/* With Indicator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Check Indicator
        </h2>
        <p className="text-sm text-muted-foreground">
          Shows a checkmark when pressed for additional visual feedback.
        </p>
        <div className="flex gap-4">
          <Toggle showIndicator defaultPressed>
            Enabled
          </Toggle>
          <Toggle showIndicator indicatorPosition="right" defaultPressed>
            Feature On
          </Toggle>
        </div>
      </section>

      {/* Shape Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Shape Variants
        </h2>
        <div className="flex gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Default</p>
            <Toggle aria-label="Default shape">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pill</p>
            <Toggle shape="pill" aria-label="Pill shape">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Square</p>
            <Toggle shape="square" aria-label="Square shape">
              <IconBold className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </section>

      {/* Rich Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Rich Examples
        </h2>
        <div className="flex gap-4 items-center flex-wrap">
          <Toggle className="gap-2" aria-label="Toggle bookmark">
            <IconBookmark className="h-4 w-4" />
            Bookmark
          </Toggle>

          <Toggle
            className="group gap-2"
            aria-label="Toggle favorite"
            variant="outline"
            shape="pill"
          >
            <IconHeart className="h-4 w-4 group-data-[pressed]:fill-current group-data-[pressed]:text-destructive transition-colors" />
            Like
          </Toggle>

          <Toggle
            className="h-10 w-10 p-0 rounded-full group"
            variant="outline"
            aria-label="Toggle star"
          >
            <IconStar className="h-5 w-5 group-data-[pressed]:fill-warning group-data-[pressed]:text-warning transition-colors" />
          </Toggle>
        </div>
      </section>

      {/* Toggle Group - Default */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Group (Multiple Selection)
        </h2>
        <p className="text-sm text-muted-foreground">
          Multiple items can be selected. Uses Arrow keys for keyboard
          navigation.
        </p>
        <ToggleGroup aria-label="Text formatting" multiple>
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
          Toggle Group (Single Selection)
        </h2>
        <p className="text-sm text-muted-foreground">
          Only one item can be selected at a time.
        </p>
        <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
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
          Toggle Group - Outline Variant
        </h2>
        <ToggleGroup
          aria-label="Text alignment"
          variant="outline"
          defaultValue={["left"]}
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <IconAlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <IconAlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <IconAlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Segment Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Group - Segment Variant (iOS Style)
        </h2>
        <ToggleGroup
          aria-label="View mode"
          variant="segment"
          defaultValue={["grid"]}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Pills Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Group - Pills Variant
        </h2>
        <ToggleGroup
          aria-label="Filter options"
          variant="pills"
          multiple
          defaultValue={["all"]}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="active">Active</ToggleGroupItem>
          <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Toggle Group Sizes
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Small</p>
            <ToggleGroup
              aria-label="Small alignment"
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default</p>
            <ToggleGroup aria-label="Default alignment" variant="outline">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large</p>
            <ToggleGroup
              aria-label="Large alignment"
              variant="outline"
              size="lg"
            >
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </section>

      {/* Vertical Orientation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical Orientation
        </h2>
        <ToggleGroup
          aria-label="Vertical options"
          variant="outline"
          orientation="vertical"
        >
          <ToggleGroupItem value="top">Top</ToggleGroupItem>
          <ToggleGroupItem value="middle">Middle</ToggleGroupItem>
          <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
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

{/* Single Toggle (icon-only requires aria-label) */}
<Toggle aria-label="Toggle bold">
  <IconBold className="h-4 w-4" />
</Toggle>

{/* Toggle with text and indicator */}
<Toggle showIndicator defaultPressed>
  Enabled
</Toggle>

{/* Loading state */}
<Toggle loading>Processing...</Toggle>

{/* Toggle Group - Multiple selection */}
<ToggleGroup aria-label="Text formatting" multiple>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>

{/* Toggle Group - Single selection (segment style) */}
<ToggleGroup aria-label="View mode" variant="segment">
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
