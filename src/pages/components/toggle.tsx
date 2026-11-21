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

function RadiusDemo() {
  return (
    <div className="flex gap-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default</p>
        <Toggle aria-label="Default radius">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Pill</p>
        <Toggle radius="pill" aria-label="Pill radius">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Square</p>
        <Toggle radius="square" aria-label="Square radius">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
}

const radiusCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function RadiusToggleDemo() {
  return (
    <div className="flex gap-4">
      <Toggle aria-label="Default radius">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle radius="pill" aria-label="Pill radius">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle radius="square" aria-label="Square radius">
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
        radius="pill"
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
        radius="pill"
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
          Announced as “Mute, toggle button, {muted ? "pressed" : "not pressed"}
          ”
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
            ]),
          ),
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

const saveLike = () =>
  new Promise<void>((_resolve, reject) => {
    setTimeout(() => reject(new Error("offline")), 900);
  });

function OptimisticSection() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Optimistic async — the pressed state flips instantly, then commits (or
        rolls back with a toast) when <code>onToggleAsync</code> settles.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <KiraToggle
          variant="outline"
          radius="pill"
          className="gap-2"
          icon={<IconHeart className="h-4 w-4" />}
          pressedIcon={
            <IconHeart className="h-4 w-4 fill-current text-destructive" />
          }
          onToggleAsync={saveLike}
          showSuccess
          errorMessage="Couldn't save your like — try again."
          tooltip="Like this post"
        >
          Like
        </KiraToggle>
        <Toggle
          variant="outline"
          size="sm"
          defaultPressed
          onPressedChange={() => {}}
        >
          Simulate failure (resets on reload)
        </Toggle>
      </div>
    </div>
  );
}

function DisabledReasonSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        <code>disabledReason</code> — never leave a disabled control
        unexplained. Tab to it: the reason is announced and shown as a tooltip.
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
  );
}

function ShortcutSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        <code>shortcut</code> renders a kbd hint <em>and</em> binds the key.
        Press <kbd>S</kbd>.
      </p>
      <KiraToggle
        variant="outline"
        shortcut="S"
        icon={<IconStar className="h-4 w-4" />}
        pressedIcon={<IconStar className="h-4 w-4 fill-warning text-warning" />}
        className="gap-2"
      >
        Star
      </KiraToggle>
    </div>
  );
}

function LabelledSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        <code>label</code> / <code>description</code> render beside the toggle
        and wire up <code>aria-labelledby</code> / <code>aria-describedby</code>
        .
      </p>
      <KiraToggle
        variant="outline"
        size="icon"
        icon={<IconVolumeOff className="h-4 w-4" />}
        label="Mute notifications"
        description="Silences this channel until you turn it back on."
      />
    </div>
  );
}

function StatesInteractiveSection() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Interactive states — hover, then press (data-pressed).
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle aria-label="Default state">Default</Toggle>
        <Toggle variant="outline" defaultPressed aria-label="Pressed state">
          Pressed
        </Toggle>
        <Toggle variant="ghost" aria-label="Ghost state">
          Ghost
        </Toggle>
        <Toggle disabled aria-label="Disabled state">
          Disabled
        </Toggle>
      </div>
    </div>
  );
}

function StatesReasonSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Disabled + reason — Tab reaches the anchor; the reason announces via
        aria-label and shows as a tooltip.
      </p>
      <KiraToggle
        variant="outline"
        disabled
        disabledReason="Read-only in demo mode."
        className="gap-2"
      >
        Read-only
      </KiraToggle>
    </div>
  );
}

function StatesBusySection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Loading & success — the spinner swaps in; success flashes a check.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle loading aria-label="Loading state">
          Saving
        </Toggle>
        <Toggle loading showIndicator aria-label="Loading with indicator">
          Syncing
        </Toggle>
      </div>
    </div>
  );
}

function StatesStressSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Stress cases — very long label, narrow container with scroll, icon-only
        dense bar. All sizes keep ≥ 24×24 touch targets (icon-sm = 32px, group
        sm = 28px) per WCAG 2.5.8.
      </p>
      <Toggle variant="outline" className="max-w-full" aria-label="Long label">
        A very long label that would overflow a tight toolbar at small sizes
      </Toggle>
      <div className="w-[320px]">
        <ToggleGroup
          aria-label="Overflow demo"
          variant="segment"
          overflowMode="scroll"
        >
          <ToggleGroupItem value="one">One</ToggleGroupItem>
          <ToggleGroupItem value="two">Two</ToggleGroupItem>
          <ToggleGroupItem value="three">Three</ToggleGroupItem>
          <ToggleGroupItem value="four">Four</ToggleGroupItem>
          <ToggleGroupItem value="five">Five</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center gap-1">
        <Toggle size="icon-sm" aria-label="Bold">
          <IconBold className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="icon-sm" aria-label="Italic">
          <IconItalic className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="icon-sm" aria-label="Underline">
          <IconUnderline className="h-3.5 w-3.5" />
        </Toggle>
      </div>
    </div>
  );
}

function StatesDemo() {
  return (
    <div className="space-y-6">
      <StatesInteractiveSection />
      <StatesReasonSection />
      <StatesBusySection />
      <StatesStressSection />
    </div>
  );
}

const statesCode = `import { Toggle, KiraToggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

{/* States matrix */}
<Toggle aria-label="Default state">Default</Toggle>
<Toggle variant="outline" defaultPressed aria-label="Pressed state">
  Pressed
</Toggle>
<Toggle disabled aria-label="Disabled state">Disabled</Toggle>
<Toggle loading aria-label="Loading state">Saving</Toggle>

{/* Disabled + reason: keyboard-reachable (Tab) */}
<KiraToggle disabled disabledReason="Read-only in demo mode.">
  Read-only
</KiraToggle>`;

function KiraToggleDemo() {
  return (
    <div className="space-y-6">
      <OptimisticSection />
      <DisabledReasonSection />
      <ShortcutSection />
      <LabelledSection />
    </div>
  );
}

const kiraToggleCode = `import { KiraToggle } from "@/components/ui/toggle"
import { IconHeart, IconStar, IconVolumeOff } from "@tabler/icons-react"

{/* Optimistic async: flips instantly, rolls back + toasts on rejection */}
<KiraToggle
  variant="outline"
  radius="pill"
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
  {
    keys: "Tab",
    description:
      "Move focus to next element. A disabled toggle with a disabledReason is reachable: the reason is announced via the anchor's aria-label and shown as a tooltip.",
  },
  { keys: "Shift + Tab", description: "Move focus to previous element" },
  { keys: "Arrow Left/Right", description: "Navigate within toggle group" },
  { keys: "Arrow Up/Down", description: "Navigate vertical toggle group" },
];

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
        prop: "radius",
        type: '"default" | "pill" | "square"',
        default: '"default"',
        description: "Border radius style of the toggle.",
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
          'Value submitted while pressed, when name is set. Defaults to "on", as native checkboxes do.',
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
          'Keyboard shortcut hint rendered as a kbd chip and bound to a global handler (e.g. "S", "⌘K").',
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
          'Submits with the enclosing form while pressed — see Toggle\'s name. Pairs with value to set the submitted payload (defaults to "on").',
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
    value: "radius",
    label: "Radius",
    demo: (
      <DemoWrapper
        title="Radius Variants"
        description="Different border radius options for the toggle."
        code={radiusCode}
      >
        <RadiusDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="State Matrix"
        description="Every state the toggle can render: interactive, disabled (with a keyboard-reachable reason), loading, success, and stress cases."
        code={statesCode}
      >
        <StatesDemo />
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

const changelogEntries = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "fixed",
        title: "Focus ring at full strength",
        description:
          "focus-visible now paints border-ring + ring-ring + ring-[3px] without the /50 alpha; the half-strength ring measured 1.63–2.82:1 against the page, below WCAG 1.4.11. The default pressed surface inherits the retuned primary pair.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "20 October 2026",
    changes: [
      {
        type: "breaking",
        title: "shape → radius",
        description:
          'The shape prop is renamed to radius on Toggle, ToggleGroup, and ToggleGroupItem (values unchanged: default | pill | square). Mechanical find-and-replace; "shape" described structure, "radius" describes what it sets.',
      },
      {
        type: "added",
        title: "Keyboard-reachable disabled reasons",
        description:
          "A disabled toggle with a disabledReason now renders a focusable anchor (accordion pattern): Tab reaches it, the reason is announced via aria-label, and focus/hover shows the tooltip. Previously hover-only.",
      },
      {
        type: "changed",
        title: "Interruptible motion",
        description:
          'Press bounce and the sliding indicator tween pass overwrite: "auto" to GSAP, so rapid clicks restart toward the new target instead of stacking tweens.',
      },
      {
        type: "changed",
        title: "Focus ring aligned to button exemplar",
        description:
          "focus-visible now uses border-ring + ring-ring/50 + ring-[3px], matching Button and Tabs.",
      },
      {
        type: "added",
        title: "Selection pop",
        description:
          "A Toggle with an icon springs the icon (1.25 → 1, back.out) when pressed. Reduced-motion aware and interruptible.",
      },
      {
        type: "fixed",
        title: "Registry dependency",
        description:
          "toggle-group no longer declares a false dependency on toggle in the registry.",
      },
    ],
  },
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
] satisfies React.ComponentProps<typeof Changelog>["entries"];

export default function TogglePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Toggle & Toggle Group"
        description="Accessible two-state buttons with WCAG 2.2 AA compliance. Correct aria-pressed semantics, a dev-time guard against label swapping, and KiraToggle for optimistic async toggles."
        version="v2.2"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for Toggle and ToggleGroup."
      />

      <APIReference sections={apiSections} />

      <Changelog entries={changelogEntries} />
    </ComponentPage>
  );
}
