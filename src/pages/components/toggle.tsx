import { useState } from "react";
import { Toggle, KiraToggle } from "@/components/ui/toggle";
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
  IconVolumeOff,
  IconAccessible,
  IconPalette,
  IconStack2,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
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
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
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
  );
}

const basicCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

export function BasicToggleDemo() {
  return (
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
  )
}`;

function VariantsDemo() {
  return (
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
  );
}

const variantsCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function ToggleVariantsDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Toggle variant="default" aria-label="Toggle default">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle outline">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="ghost" aria-label="Toggle ghost">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="solid" aria-label="Toggle solid">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function SemanticVariantsDemo() {
  return (
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
  );
}

const semanticCode = `import { Toggle } from "@/components/ui/toggle"

export function SemanticToggleDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Toggle variant="success" defaultPressed>
        Accept
      </Toggle>
      <Toggle variant="warning" defaultPressed>
        Warn
      </Toggle>
      <Toggle variant="destructive" defaultPressed>
        Delete
      </Toggle>
    </div>
  )
}`;

function SizesDemo() {
  return (
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
  );
}

const sizesCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function ToggleSizesDemo() {
  return (
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
  )
}`;

function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex gap-4 items-center">
      <Toggle loading={isLoading} onClick={handleLoadingDemo}>
        {isLoading ? "Loading..." : "Click to Load"}
      </Toggle>
      <Toggle loading aria-label="Always loading">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

const loadingCode = `import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function LoadingToggleDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex gap-4 items-center">
      <Toggle loading={isLoading} onClick={handleLoadingDemo}>
        {isLoading ? "Loading..." : "Click to Load"}
      </Toggle>
      <Toggle loading aria-label="Always loading">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function IndicatorDemo() {
  return (
    <div className="flex gap-4">
      <Toggle showIndicator defaultPressed>
        Enabled
      </Toggle>
      <Toggle showIndicator indicatorPosition="right" defaultPressed>
        Feature On
      </Toggle>
    </div>
  );
}

const indicatorCode = `import { Toggle } from "@/components/ui/toggle"

export function IndicatorToggleDemo() {
  return (
    <div className="flex gap-4">
      <Toggle showIndicator defaultPressed>
        Enabled
      </Toggle>
      <Toggle showIndicator indicatorPosition="right" defaultPressed>
        Feature On
      </Toggle>
    </div>
  )
}`;

function ShapesDemo() {
  return (
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
  );
}

const shapesCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function ShapeToggleDemo() {
  return (
    <div className="flex gap-4">
      <Toggle aria-label="Default shape">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle shape="pill" aria-label="Pill shape">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle shape="square" aria-label="Square shape">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function RichExamplesDemo() {
  return (
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
  );
}

const richExamplesCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBookmark, IconHeart, IconStar } from "@tabler/icons-react"

export function RichToggleExamples() {
  return (
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
  )
}`;

function GroupMultipleDemo() {
  return (
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
  );
}

const groupMultipleCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

export function ToggleGroupMultipleDemo() {
  return (
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
  )
}`;

function GroupSingleDemo() {
  return (
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
  );
}

const groupSingleCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified } from "@tabler/icons-react"

export function ToggleGroupSingleDemo() {
  return (
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
  )
}`;

function GroupVariantsDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Outline</p>
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
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Segment (iOS Style)</p>
        <ToggleGroup
          aria-label="View mode"
          variant="segment"
          defaultValue={["grid"]}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Pills</p>
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
      </div>
    </div>
  );
}

const groupVariantsCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from "@tabler/icons-react"

export function ToggleGroupVariantsDemo() {
  return (
    <div className="space-y-6">
      {/* Outline variant */}
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

      {/* Segment variant (iOS style) */}
      <ToggleGroup
        aria-label="View mode"
        variant="segment"
        defaultValue={["grid"]}
      >
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="board">Board</ToggleGroupItem>
      </ToggleGroup>

      {/* Pills variant */}
      <ToggleGroup
        aria-label="Filter options"
        variant="pills"
        multiple
        defaultValue={["all"]}
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function GroupSizesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <ToggleGroup aria-label="Small alignment" variant="outline" size="sm">
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
        <ToggleGroup aria-label="Large alignment" variant="outline" size="lg">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const groupSizesCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupSizesDemo() {
  return (
    <div className="space-y-4">
      {/* Small */}
      <ToggleGroup aria-label="Small alignment" variant="outline" size="sm">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>

      {/* Default */}
      <ToggleGroup aria-label="Default alignment" variant="outline">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>

      {/* Large */}
      <ToggleGroup aria-label="Large alignment" variant="outline" size="lg">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function GroupVerticalDemo() {
  return (
    <ToggleGroup
      aria-label="Vertical options"
      variant="outline"
      orientation="vertical"
    >
      <ToggleGroupItem value="top">Top</ToggleGroupItem>
      <ToggleGroupItem value="middle">Middle</ToggleGroupItem>
      <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
    </ToggleGroup>
  );
}

const groupVerticalCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupVerticalDemo() {
  return (
    <ToggleGroup
      aria-label="Vertical options"
      variant="outline"
      orientation="vertical"
    >
      <ToggleGroupItem value="top">Top</ToggleGroupItem>
      <ToggleGroupItem value="middle">Middle</ToggleGroupItem>
      <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function StableLabelDemo() {
  const [muted, setMuted] = useState(false);
  const [swapped, setSwapped] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          ✅ Correct — the label stays <code>Mute</code> in both states.{" "}
          <code>aria-pressed</code> already announces on/off.
        </p>
        <Toggle
          variant="outline"
          pressed={muted}
          onPressedChange={setMuted}
          className="gap-2"
        >
          <IconVolumeOff className="h-4 w-4" />
          Mute
        </Toggle>
        <p className="text-xs text-muted-foreground">
          Announced as “Mute, toggle button, {muted ? "pressed" : "not pressed"}”
        </p>
      </div>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          ⚠️ Swapping the label between states logs a dev-only console warning.
          It double-announces the state and breaks voice control, which targets
          the visible name. Open the console and press this one.
        </p>
        <Toggle
          variant="outline"
          pressed={swapped}
          onPressedChange={setSwapped}
          className="gap-2"
        >
          {swapped ? "Unmute" : "Mute"}
        </Toggle>
        <p className="text-xs text-muted-foreground">
          If the label genuinely must change (Play → Pause), that's the
          text-carries-state pattern — drop <code>aria-pressed</code> and use a
          plain <code>&lt;button&gt;</code> instead of shipping both.
        </p>
      </div>
    </div>
  );
}

const stableLabelCode = `import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"
import { IconVolumeOff } from "@tabler/icons-react"

export function StableLabelDemo() {
  const [muted, setMuted] = useState(false)

  return (
    <>
      {/* ✅ One fixed label; aria-pressed carries the state */}
      <Toggle variant="outline" pressed={muted} onPressedChange={setMuted}>
        <IconVolumeOff className="h-4 w-4" />
        Mute
      </Toggle>

      {/* ⚠️ Warns in dev: the label must not change with the state */}
      <Toggle variant="outline" pressed={muted} onPressedChange={setMuted}>
        {muted ? "Unmute" : "Mute"}
      </Toggle>
    </>
  )
}`;


function FormDemo() {
  const [entries, setEntries] = useState<Record<string, string> | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        // The proof: whatever the browser actually built from the DOM.
        setEntries(
          Object.fromEntries(
            [...new FormData(e.currentTarget).entries()].map(([k, v]) => [
              k,
              String(v),
            ])
          )
        );
      }}
    >
      <div className="flex flex-wrap gap-3">
        <Toggle variant="outline" name="notify" defaultPressed>
          Email me
        </Toggle>
        <Toggle variant="outline" name="digest" value="weekly">
          Weekly digest
        </Toggle>
      </div>
      <Button type="submit" size="sm">
        Submit
      </Button>
      {entries && (
        <pre
          data-slot="formdata-readout"
          className="rounded-md border bg-muted/50 p-3 text-xs"
        >
          {Object.keys(entries).length === 0
            ? "(no keys — nothing pressed)"
            : JSON.stringify(entries, null, 2)}
        </pre>
      )}
      <p className="text-xs text-muted-foreground">
        Native checkbox semantics: an unpressed toggle contributes{" "}
        <em>nothing</em> — the key is absent rather than blank, so servers test
        presence. <code>notify</code> submits <code>"on"</code> by default;{" "}
        <code>digest</code> overrides it with <code>value="weekly"</code>.
      </p>
    </form>
  );
}

const formCode = `import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"

export function FormDemo() {
  const [entries, setEntries] = useState(null)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setEntries(Object.fromEntries(new FormData(e.currentTarget)))
      }}
    >
      {/* Pressed → notify=on. Unpressed → key absent entirely. */}
      <Toggle variant="outline" name="notify" defaultPressed>
        Email me
      </Toggle>

      {/* value overrides the default "on" payload */}
      <Toggle variant="outline" name="digest" value="weekly">
        Weekly digest
      </Toggle>

      <button type="submit">Submit</button>
      {entries && <pre>{JSON.stringify(entries, null, 2)}</pre>}
    </form>
  )
}`;

function KiraToggleDemo() {
  const [failNext, setFailNext] = useState(false);

  const save = () =>
    new Promise<void>((resolve, reject) =>
      setTimeout(
        () => (failNext ? reject(new Error("offline")) : resolve()),
        900
      )
    );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Optimistic async — the pressed state flips instantly, then commits (or
          rolls back with a toast) when <code>onToggleAsync</code> settles.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <KiraToggle
            variant="outline"
            shape="pill"
            className="gap-2"
            icon={<IconHeart className="h-4 w-4" />}
            pressedIcon={
              <IconHeart className="h-4 w-4 fill-current text-destructive" />
            }
            onToggleAsync={save}
            showSuccess
            errorMessage="Couldn't save your like — try again."
            tooltip="Like this post"
          >
            Like
          </KiraToggle>
          <Toggle
            variant="outline"
            size="sm"
            pressed={failNext}
            onPressedChange={setFailNext}
          >
            Simulate failure
          </Toggle>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          <code>disabledReason</code> — never leave a disabled control
          unexplained. Hover it.
        </p>
        <KiraToggle
          variant="outline"
          disabled
          disabledReason="Upgrade to Pro to pin conversations."
          icon={<IconBookmark className="h-4 w-4" />}
          className="gap-2"
        >
          Pin
        </KiraToggle>
      </div>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          <code>shortcut</code> renders a kbd hint <em>and</em> binds the key.
          Press <kbd>S</kbd>.
        </p>
        <KiraToggle
          variant="outline"
          shortcut="S"
          icon={<IconStar className="h-4 w-4" />}
          pressedIcon={
            <IconStar className="h-4 w-4 fill-warning text-warning" />
          }
          className="gap-2"
        >
          Star
        </KiraToggle>
      </div>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          <code>label</code> / <code>description</code> render beside the toggle
          and wire up <code>aria-labelledby</code> /{" "}
          <code>aria-describedby</code>.
        </p>
        <KiraToggle
          variant="outline"
          size="icon"
          icon={<IconVolumeOff className="h-4 w-4" />}
          label="Mute notifications"
          description="Silences this channel until you turn it back on."
        />
      </div>
    </div>
  );
}

const kiraToggleCode = `import { KiraToggle } from "@/components/ui/toggle"
import { IconHeart, IconStar, IconVolumeOff } from "@tabler/icons-react"

{/* Optimistic async: flips instantly, rolls back + toasts on rejection */}
<KiraToggle
  variant="outline"
  shape="pill"
  icon={<IconHeart className="h-4 w-4" />}
  pressedIcon={<IconHeart className="h-4 w-4 fill-current text-destructive" />}
  onToggleAsync={async (pressed) => { await api.setLike(pressed) }}
  showSuccess
  errorMessage="Couldn't save your like — try again."
  tooltip="Like this post"
>
  Like
</KiraToggle>

{/* A disabled control always explains itself */}
<KiraToggle disabled disabledReason="Upgrade to Pro to pin conversations.">
  Pin
</KiraToggle>

{/* Renders a kbd chip and binds the key globally */}
<KiraToggle shortcut="S" icon={<IconStar className="h-4 w-4" />}>
  Star
</KiraToggle>

{/* label/description wire aria-labelledby + aria-describedby */}
<KiraToggle
  size="icon"
  icon={<IconVolumeOff className="h-4 w-4" />}
  label="Mute notifications"
  description="Silences this channel until you turn it back on."
/>`;

// =============================================================================
// Page Component
// =============================================================================

export default function TogglePage() {
  const features = [
    {
      title: "Accessible",
      description:
        "WCAG 2.2 AA compliant with proper aria-pressed states and keyboard navigation. Icon-only toggles require aria-label.",
      icon: <IconAccessible className="h-4 w-4" />,
    },
    {
      title: "Multiple Variants",
      description:
        "Default, outline, ghost, solid, and semantic color variants (success, warning, destructive) for different use cases.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Flexible Groups",
      description:
        "ToggleGroup supports single/multiple selection, segment and pills variants, vertical orientation, and various sizes.",
      icon: <IconStack2 className="h-4 w-4" />,
    },
  ];

  const keyboardShortcuts = [
    { keys: "Space", description: "Toggle the focused button" },
    { keys: "Enter", description: "Toggle the focused button" },
    {
      keys: "Custom",
      description:
        "KiraToggle's shortcut prop binds a global key (and shows it as a kbd chip)",
    },
    { keys: "Tab", description: "Move focus to next element" },
    { keys: "Shift + Tab", description: "Move focus to previous element" },
    { keys: "Arrow Left/Right", description: "Navigate within toggle group" },
    { keys: "Arrow Up/Down", description: "Navigate vertical toggle group" },
  ];

  const usageCode = `import { Toggle } from "@/components/ui/toggle"
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
</ToggleGroup>`;

  const apiSections = [
    {
      title: "Toggle",
      props: [
        {
          prop: "pressed",
          type: "boolean",
          description: "Controlled pressed state of the toggle.",
        },
        {
          prop: "defaultPressed",
          type: "boolean",
          default: "false",
          description: "Default pressed state for uncontrolled mode.",
        },
        {
          prop: "onPressedChange",
          type: "(pressed: boolean) => void",
          description: "Callback fired when the pressed state changes.",
        },
        {
          prop: "variant",
          type: '"default" | "outline" | "ghost" | "solid" | "success" | "warning" | "destructive"',
          default: '"default"',
          description: "Visual style variant of the toggle.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg"',
          default: '"default"',
          description: "Size of the toggle button.",
        },
        {
          prop: "icon",
          type: "React.ReactNode",
          description:
            "Icon rendered before the children. An icon-only toggle warns in dev unless it has an aria-label.",
        },
        {
          prop: "shape",
          type: '"default" | "pill" | "square"',
          default: '"default"',
          description: "Border radius shape of the toggle.",
        },
        {
          prop: "loading",
          type: "boolean",
          default: "false",
          description: "Shows a loading spinner and disables the toggle.",
        },
        {
          prop: "showIndicator",
          type: "boolean",
          default: "false",
          description: "Shows a checkmark indicator when pressed.",
        },
        {
          prop: "indicatorPosition",
          type: '"left" | "right"',
          default: '"left"',
          description: "Position of the check indicator.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the toggle button.",
        },
        {
          prop: "name",
          type: "string",
          description:
            "Submits with the enclosing form, following native checkbox semantics: a hidden input is emitted only while pressed, so an unpressed toggle contributes nothing to FormData (the key is absent, not blank).",
        },
        {
          prop: "value",
          type: "string",
          default: '"on"',
          description:
            "Value submitted while pressed, when name is set. Defaults to \"on\", as native checkboxes do.",
        },
      ],
    },
    {
      title: "KiraToggle",
      props: [
        {
          prop: "onToggleAsync",
          type: "(pressed: boolean) => Promise<void>",
          description:
            "Async handler. The pressed state flips instantly (useOptimistic) and rolls back with a toast if this rejects. For non-destructive actions only — don't fake success on deletes or payments.",
        },
        {
          prop: "showSuccess",
          type: "boolean",
          default: "false",
          description:
            "Flash a checkmark after onToggleAsync resolves, then reset.",
        },
        {
          prop: "successDuration",
          type: "number",
          default: "1200",
          description: "How long the success checkmark stays, in ms.",
        },
        {
          prop: "errorMessage",
          type: "string",
          default: '"Couldn\'t update"',
          description: "Toast text shown when onToggleAsync rejects.",
        },
        {
          prop: "pressedIcon",
          type: "React.ReactNode",
          description:
            "Icon swapped in while pressed (e.g. a filled heart). Falls back to icon.",
        },
        {
          prop: "tooltip",
          type: "React.ReactNode",
          description:
            "Tooltip on the toggle. Icon-only toggles should always have one.",
        },
        {
          prop: "tooltipSide",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"top"',
          description: "Which side the tooltip opens on.",
        },
        {
          prop: "disabledReason",
          type: "React.ReactNode",
          description:
            "Tooltip shown only while disabled, explaining why. Takes precedence over tooltip.",
        },
        {
          prop: "shortcut",
          type: "string",
          description:
            "Keyboard shortcut hint rendered as a kbd chip and bound to a global handler (e.g. \"S\", \"⌘K\").",
        },
        {
          prop: "label",
          type: "React.ReactNode",
          description:
            "Label rendered beside the toggle and wired via aria-labelledby.",
        },
        {
          prop: "description",
          type: "React.ReactNode",
          description:
            "Supporting text rendered under the label and wired via aria-describedby.",
        },
        {
          prop: "onPressedChange",
          type: "(pressed: boolean) => void",
          description: "Plain (non-async) pressed-state callback.",
        },
        {
          prop: "name",
          type: "string",
          description:
            "Submits with the enclosing form while pressed — see Toggle's name. Pairs with value to set the submitted payload (defaults to \"on\").",
        },
      ],
    },
    {
      title: "ToggleGroup",
      props: [
        {
          prop: "aria-label",
          type: "string",
          description:
            "Required — describes the group's purpose. See the Toggle Group page for the full API (semantics, allowEmpty, showSelectedIcon, overflowMode, slidingIndicator, form-field props).",
        },
        {
          prop: "value",
          type: "string[]",
          description:
            "Controlled value of the selected items (array of values).",
        },
        {
          prop: "defaultValue",
          type: "string[]",
          description: "Default selected values for uncontrolled mode.",
        },
        {
          prop: "onValueChange",
          type: "(value: string[]) => void",
          description: "Callback fired when selection changes.",
        },
        {
          prop: "multiple",
          type: "boolean",
          default: "false",
          description: "Allow multiple items to be selected simultaneously.",
        },
        {
          prop: "variant",
          type: '"default" | "outline" | "segment" | "pills"',
          default: '"default"',
          description: "Visual style variant of the toggle group.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Size of all toggle items in the group.",
        },
        {
          prop: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Layout orientation of the toggle group.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables all toggle items in the group.",
        },
      ],
    },
    {
      title: "ToggleGroupItem",
      props: [
        {
          prop: "value",
          type: "string",
          description:
            "Unique value for the item. Required for selection tracking.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables this specific toggle item.",
        },
      ],
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Toggle"
          description="Icon-only toggles require aria-label for accessibility."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "variants",
      label: "Variants",
      demo: (
        <DemoWrapper
          title="Toggle Variants"
          description="Different visual styles for various contexts."
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "semantic",
      label: "Semantic",
      demo: (
        <DemoWrapper
          title="Semantic Color Variants"
          description="Toggle buttons with semantic colors when pressed. Uses icons in addition to color for accessibility."
          code={semanticCode}
        >
          <SemanticVariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Toggle Sizes"
          description="Small, default, large, and icon-only sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "loading",
      label: "Loading",
      demo: (
        <DemoWrapper
          title="Loading State"
          description="Show a loading spinner while processing. The toggle is disabled during loading."
          code={loadingCode}
        >
          <LoadingDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "indicator",
      label: "Indicator",
      demo: (
        <DemoWrapper
          title="With Check Indicator"
          description="Shows a checkmark when pressed for additional visual feedback."
          code={indicatorCode}
        >
          <IndicatorDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "shapes",
      label: "Shapes",
      demo: (
        <DemoWrapper
          title="Shape Variants"
          description="Different border radius options for the toggle."
          code={shapesCode}
        >
          <ShapesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "rich",
      label: "Rich Examples",
      demo: (
        <DemoWrapper
          title="Rich Examples"
          description="Creative toggle implementations with icons and custom styling."
          code={richExamplesCode}
        >
          <RichExamplesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "stable-label",
      label: "Stable Label",
      demo: (
        <DemoWrapper
          title="A Toggle's Label Must Not Change"
          description="The APG calls this critical: a button labelled Mute stays Mute when pressed, because aria-pressed already carries the state. Swapping it to Unmute double-announces the state and breaks voice control, which targets the visible name. Toggle warns in dev when it sees a label change between states."
          code={stableLabelCode}
        >
          <StableLabelDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "form",
      label: "Form",
      demo: (
        <DemoWrapper
          title="Form Submission"
          description="name submits the toggle with the enclosing form, following native checkbox semantics: a hidden input is emitted only while pressed, so an unpressed toggle contributes nothing to FormData. Submit with one pressed and one not — the unpressed key is absent, not blank."
          code={formCode}
        >
          <FormDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "kira",
      label: "KiraToggle",
      demo: (
        <DemoWrapper
          title="KiraToggle"
          description="One prop-driven entry point over the whole family: optimistic async with rollback + toast, success checkmark, pressedIcon, tooltip and disabledReason, a bound keyboard shortcut, and label/description wired to aria-labelledby/aria-describedby."
          code={kiraToggleCode}
        >
          <KiraToggleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-multiple",
      label: "Group (Multiple)",
      demo: (
        <DemoWrapper
          title="Toggle Group (Multiple Selection)"
          description="Multiple items can be selected. Uses Arrow keys for keyboard navigation."
          code={groupMultipleCode}
        >
          <GroupMultipleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-single",
      label: "Group (Single)",
      demo: (
        <DemoWrapper
          title="Toggle Group (Single Selection)"
          description="Only one item can be selected at a time."
          code={groupSingleCode}
        >
          <GroupSingleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-variants",
      label: "Group Variants",
      demo: (
        <DemoWrapper
          title="Toggle Group Variants"
          description="Outline, segment (iOS style), and pills variants."
          code={groupVariantsCode}
        >
          <GroupVariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-sizes",
      label: "Group Sizes",
      demo: (
        <DemoWrapper
          title="Toggle Group Sizes"
          description="Small, default, and large sizes for toggle groups."
          code={groupSizesCode}
        >
          <GroupSizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-vertical",
      label: "Vertical",
      demo: (
        <DemoWrapper
          title="Vertical Orientation"
          description="Toggle group with vertical layout."
          code={groupVerticalCode}
        >
          <GroupVerticalDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Toggle & Toggle Group"
        description="Accessible two-state buttons with WCAG 2.2 AA compliance. Correct aria-pressed semantics, a dev-time guard against label swapping, and KiraToggle for optimistic async toggles."
        version="v2.1"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for Toggle and ToggleGroup."
      />

      <APIReference sections={apiSections} />

      <Changelog
        entries={[
          {
            version: "2.1.0",
            date: "8 August 2026",
            changes: [
              {
                type: "added",
                title: "Form Submission",
                description:
                  "Toggle takes name and value and submits with the enclosing form. Native checkbox semantics: the hidden input exists only while pressed, so an unpressed toggle leaves the key absent from FormData rather than blank.",
              },
              {
                type: "added",
                title: "KiraToggle",
                description:
                  "One prop-driven entry point over optimistic async toggling (onToggleAsync with rollback + toast), pressedIcon, shortcut, disabledReason, and label/description wired via aria-labelledby and aria-describedby.",
              },
              {
                type: "added",
                title: "Label-Stability Warning",
                description:
                  "A dev-only console warning when a toggle's label changes between pressed states. The APG requires the label to stay fixed — aria-pressed already announces the state, and a swapped label double-announces it and breaks voice control.",
              },
              {
                type: "changed",
                title: "Reduced Motion",
                description:
                  "The press micro-interaction now reads the shared useReducedMotion hook instead of an inline media query, so it stays in sync with the rest of the kit and re-renders when the OS preference changes.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
