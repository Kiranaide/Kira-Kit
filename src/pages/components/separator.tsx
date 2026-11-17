import * as React from "react";
import {
  IconLayoutRows,
  IconMessage,
  IconSeparator,
  IconShieldCheck,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Separator,
  SeparatorLabel,
  KiraSeparator,
  type SeparatorProps,
} from "@/components/ui/separator";
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
    <div className="space-y-5 text-sm">
      <div>
        <p className="font-medium">Workspace</p>
        <p className="mt-1 text-muted-foreground">Atlas support team</p>
      </div>
      <Separator aria-label="Workspace settings" />
      <div>
        <p className="font-medium">Notifications</p>
        <p className="mt-1 text-muted-foreground">Email and in-app updates</p>
      </div>
      <Separator decorative />
      <p className="text-muted-foreground">
        Purely visual rules can be hidden from assistive technology.
      </p>
    </div>
  );
}

const basicCode = `import { Separator } from "@/components/ui/separator"

export function BasicDemo() {
  return <div className="space-y-5 text-sm">
    <div><p className="font-medium">Workspace</p><p className="mt-1 text-muted-foreground">Atlas support team</p></div>
    <Separator aria-label="Workspace settings" />
    <div><p className="font-medium">Notifications</p><p className="mt-1 text-muted-foreground">Email and in-app updates</p></div>
    <Separator decorative />
    <p className="text-muted-foreground">Purely visual rules can be hidden from assistive technology.</p>
  </div>
}`;

function LayoutDemo() {
  return (
    <div className="space-y-8">
      <div className="flex min-h-10 flex-wrap items-center gap-3 text-sm">
        <Button variant="ghost" size="sm">
          Overview
        </Button>
        <Separator orientation="vertical" decorative />
        <Button variant="ghost" size="sm">
          Activity
        </Button>
        <Separator orientation="vertical" decorative />
        <Button variant="ghost" size="sm">
          Members
        </Button>
      </div>
      <div className="flex h-40 items-stretch justify-center gap-4 text-sm">
        <span className="self-center">Source</span>
        <Separator orientation="vertical" label="Then" />
        <span className="self-center">Preview</span>
      </div>
      <div dir="rtl">
        <Separator label="Next section" labelAlign="start" lineStyle="dashed" />
      </div>
    </div>
  );
}

const layoutCode = `import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function LayoutDemo() {
  return <div className="space-y-8">
    <div className="flex min-h-10 flex-wrap items-center gap-3 text-sm">
      <Button variant="ghost" size="sm">Overview</Button>
      <Separator orientation="vertical" decorative />
      <Button variant="ghost" size="sm">Activity</Button>
      <Separator orientation="vertical" decorative />
      <Button variant="ghost" size="sm">Members</Button>
    </div>
    <div className="flex h-40 items-stretch justify-center gap-4 text-sm">
      <span className="self-center">Source</span>
      <Separator orientation="vertical" label="Then" />
      <span className="self-center">Preview</span>
    </div>
    <div dir="rtl"><Separator label="Next section" labelAlign="start" lineStyle="dashed" /></div>
  </div>
}`;

function StylesDemo() {
  const colors: NonNullable<SeparatorProps["color"]>[] = [
    "default",
    "primary",
    "secondary",
    "muted",
    "destructive",
    "success",
    "warning",
    "info",
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        {(["solid", "dashed", "dotted", "gradient"] as const).map(
          (lineStyle) => (
            <div key={lineStyle} className="space-y-2">
              <p className="text-xs font-medium capitalize">{lineStyle}</p>
              <Separator lineStyle={lineStyle} color="primary" />
            </div>
          ),
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {colors.map((color) => (
          <div key={color} className="space-y-2">
            <p className="text-xs font-medium">{color}</p>
            <Separator color={color} size="md" />
          </div>
        ))}
      </div>
      <div className="flex h-20 justify-center gap-8">
        <Separator
          orientation="vertical"
          lineStyle="gradient"
          color="primary"
          size="lg"
          aria-label="Vertical primary fade"
        />
        <Separator
          orientation="vertical"
          lineStyle="gradient"
          color="success"
          size="lg"
          aria-label="Vertical success fade"
        />
      </div>
    </div>
  );
}

const stylesCode = `import { Separator, type SeparatorProps } from "@/components/ui/separator"

export function StylesDemo() {
  const colors: NonNullable<SeparatorProps["color"]>[] = ["default", "primary", "secondary", "muted", "destructive", "success", "warning", "info"]
  return <div className="space-y-8">
    <div className="space-y-5">
      {(["solid", "dashed", "dotted", "gradient"] as const).map(lineStyle =>
        <div key={lineStyle} className="space-y-2">
          <p className="text-xs font-medium capitalize">{lineStyle}</p>
          <Separator lineStyle={lineStyle} color="primary" />
        </div>
      )}
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      {colors.map(color => <div key={color} className="space-y-2">
        <p className="text-xs font-medium">{color}</p><Separator color={color} size="md" />
      </div>)}
    </div>
    <div className="flex h-20 justify-center gap-8">
      <Separator orientation="vertical" lineStyle="gradient" color="primary" size="lg" aria-label="Vertical primary fade" />
      <Separator orientation="vertical" lineStyle="gradient" color="success" size="lg" aria-label="Vertical success fade" />
    </div>
  </div>
}`;

function SizesDemo() {
  return (
    <div className="space-y-5">
      {(["xs", "sm", "default", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="space-y-2">
          <p className="text-xs font-medium">{size}</p>
          <Separator size={size} />
        </div>
      ))}
      <Separator size="lg" lineStyle="dashed" label="Thick dashed rule" />
      <Separator size="xl" lineStyle="dotted" label="Thick dotted rule" />
    </div>
  );
}

const sizesCode = `import { Separator } from "@/components/ui/separator"

export function SizesDemo() {
  return <div className="space-y-5">
    {(["xs", "sm", "default", "md", "lg", "xl"] as const).map(size => <div key={size} className="space-y-2">
      <p className="text-xs font-medium">{size}</p><Separator size={size} />
    </div>)}
    <Separator size="lg" lineStyle="dashed" label="Thick dashed rule" />
    <Separator size="xl" lineStyle="dotted" label="Thick dotted rule" />
  </div>
}`;

function LabelsDemo() {
  return (
    <div className="space-y-7">
      <Separator label="Billing details" labelAlign="start" />
      <Separator label="Or continue with email" />
      <Separator label="End of results" labelAlign="end" />
      <Separator
        label="Verified changes"
        labelIcon={<IconShieldCheck />}
        color="success"
      />
      <Separator
        label="Team activity"
        labelIcon={<IconMessage />}
        labelIconPosition="right"
      />
      <div className="flex items-center gap-3">
        <Separator decorative className="flex-1" />
        <SeparatorLabel>Custom content group</SeparatorLabel>
        <Separator decorative className="flex-1" />
      </div>
    </div>
  );
}

const labelsCode = `import { IconShieldCheck, IconMessage } from "@tabler/icons-react"
import { Separator, SeparatorLabel } from "@/components/ui/separator"

export function LabelsDemo() {
  return <div className="space-y-7">
    <Separator label="Billing details" labelAlign="start" />
    <Separator label="Or continue with email" />
    <Separator label="End of results" labelAlign="end" />
    <Separator label="Verified changes" labelIcon={<IconShieldCheck />} color="success" />
    <Separator label="Team activity" labelIcon={<IconMessage />} labelIconPosition="right" />
    <div className="flex items-center gap-3">
      <Separator decorative className="flex-1" />
      <SeparatorLabel>Custom content group</SeparatorLabel>
      <Separator decorative className="flex-1" />
    </div>
  </div>
}`;

function InsetsDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-lg border py-4">
        <p className="px-4 text-sm font-medium">Contact details</p>
        <Separator inset="default" />
        <p className="px-4 text-sm text-muted-foreground">lee@example.com</p>
        <Separator inset="lg" lineStyle="dashed" />
        <p className="px-4 text-sm text-muted-foreground">
          Related details share an inset.
        </p>
      </div>
      <Separator label="Separate sections" spacing="lg" />
      <div dir="rtl">
        <KiraSeparator
          label="Recent activity"
          labelAlign="start"
          count={12}
          countLabel="updates"
          inset="sm"
        />
      </div>
    </div>
  );
}

const insetsCode = `import { Separator, KiraSeparator } from "@/components/ui/separator"

export function InsetsDemo() {
  return <div className="space-y-8">
    <div className="space-y-3 rounded-lg border py-4">
      <p className="px-4 text-sm font-medium">Contact details</p>
      <Separator inset="default" />
      <p className="px-4 text-sm text-muted-foreground">lee@example.com</p>
      <Separator inset="lg" lineStyle="dashed" />
      <p className="px-4 text-sm text-muted-foreground">Related details share an inset.</p>
    </div>
    <Separator label="Separate sections" spacing="lg" />
    <div dir="rtl">
      <KiraSeparator label="Recent activity" labelAlign="start" count={12} countLabel="updates" inset="sm" />
    </div>
  </div>
}`;

function ActionsDemo() {
  const [unread, setUnread] = React.useState(3);
  const [pending, setPending] = React.useState(false);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Illustrative delivery states; the application owns work and pending
        state.
      </p>
      <KiraSeparator
        label="New updates"
        count={unread}
        countLabel="updates"
        color="info"
        action={{
          label: "Mark as read",
          onClick: () => setUnread(0),
          pending,
          disabled: unread === 0,
          disabledReason:
            unread === 0 ? "All updates are already read" : undefined,
        }}
      />
      <output className="block text-sm">
        {unread ? unread + " unread updates" : "All updates read"}
      </output>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          aria-pressed={pending}
          onClick={() => setPending((value) => !value)}
        >
          {pending ? "Finish pending work" : "Show pending state"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setUnread(3);
            setPending(false);
          }}
        >
          Reset
        </Button>
      </div>
      <KiraSeparator
        label="Protected activity"
        count={2}
        countLabel="updates"
        action={{
          label: "Archive",
          onClick: () => {},
          disabled: true,
          disabledReason: "Only project owners can archive this activity",
        }}
      />
    </div>
  );
}

const actionsCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KiraSeparator } from "@/components/ui/separator"

export function ActionsDemo() {
  const [unread, setUnread] = useState(3)
  const [pending, setPending] = useState(false)
  return <div className="space-y-6">
    <p className="text-sm text-muted-foreground">Illustrative delivery states; the application owns work and pending state.</p>
    <KiraSeparator label="New updates" count={unread} countLabel="updates" color="info"
      action={{ label: "Mark as read", onClick: () => setUnread(0), pending, disabled: unread === 0,
        disabledReason: unread === 0 ? "All updates are already read" : undefined }} />
    <p role="status" className="text-sm">{unread ? unread + " unread updates" : "All updates read"}</p>
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" aria-pressed={pending} onClick={() => setPending(value => !value)}>
        {pending ? "Finish pending work" : "Show pending state"}
      </Button>
      <Button variant="ghost" onClick={() => { setUnread(3); setPending(false) }}>Reset</Button>
    </div>
    <KiraSeparator label="Protected activity" count={2} countLabel="updates"
      action={{ label: "Archive", onClick: () => {}, disabled: true,
        disabledReason: "Only project owners can archive this activity" }} />
  </div>
}`;

function DisclosureDemo() {
  const [open, setOpen] = React.useState(true);
  const id = React.useId();

  return (
    <div className="space-y-5">
      <KiraSeparator
        label="Import diagnostics"
        count={2}
        countLabel="checks"
        labelAlign="start"
        collapsible
        open={open}
        onOpenChange={(next) => setOpen(next)}
        keepMounted
        description="Hide the details without losing your review note."
      >
        <div className="space-y-4 rounded-lg border p-4 text-sm">
          <p>24 contacts passed validation. Two duplicates were left out.</p>
          <div className="space-y-2">
            <label htmlFor={id} className="font-medium">
              Review note
            </label>
            <Input id={id} defaultValue="Confirm the duplicates with Morgan" />
          </div>
        </div>
      </KiraSeparator>
      <Button variant="outline" onClick={() => setOpen((value) => !value)}>
        {open ? "Hide from outside" : "Open from outside"}
      </Button>
    </div>
  );
}

const disclosureCode = `import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KiraSeparator } from "@/components/ui/separator"

export function DisclosureDemo() {
  const [open, setOpen] = useState(true)
  const id = useId()
  return <div className="space-y-5">
    <KiraSeparator label="Import diagnostics" count={2} countLabel="checks" labelAlign="start"
      collapsible open={open} onOpenChange={next => setOpen(next)} keepMounted
      description="Hide the details without losing your review note.">
      <div className="space-y-4 rounded-lg border p-4 text-sm">
        <p>24 contacts passed validation. Two duplicates were left out.</p>
        <div className="space-y-2">
          <label htmlFor={id} className="font-medium">Review note</label>
          <Input id={id} defaultValue="Confirm the duplicates with Morgan" />
        </div>
      </div>
    </KiraSeparator>
    <Button variant="outline" onClick={() => setOpen(value => !value)}>{open ? "Hide from outside" : "Open from outside"}</Button>
  </div>
}`;

const updates = [
  "Morgan approved the contact mapping.",
  "Lee corrected two duplicate addresses.",
  "The local directory preview is ready.",
];

function KiraDemo() {
  const [unread, setUnread] = React.useState(updates.length);

  return (
    <div className="space-y-5 text-sm">
      <p className="text-muted-foreground">
        Activity preview for the Atlas contact import.
      </p>
      <KiraSeparator
        label="New activity"
        count={unread}
        countLabel="updates"
        color="info"
        labelIcon={<IconMessage />}
        action={{
          label: "Mark as read",
          onClick: () => setUnread(0),
          disabled: unread === 0,
          disabledReason: unread === 0 ? "You're caught up" : undefined,
        }}
      />
      <ul className="space-y-3">
        {updates.map((update) => (
          <li key={update} className="wrap-anywhere">
            {update}
          </li>
        ))}
      </ul>
      <KiraSeparator
        label="Earlier activity"
        count={2}
        countLabel="updates"
        collapsible
      >
        <ul className="space-y-3 pt-2 text-muted-foreground">
          <li>The export was added to the workspace.</li>
          <li>Lee started the contact review.</li>
        </ul>
      </KiraSeparator>
    </div>
  );
}

const kiraCode = `import { useState } from "react"
import { IconMessage } from "@tabler/icons-react"
import { KiraSeparator } from "@/components/ui/separator"

const updates = [
  "Morgan approved the contact mapping.",
  "Lee corrected two duplicate addresses.",
  "The local directory preview is ready.",
]

export function KiraDemo() {
  const [unread, setUnread] = useState(updates.length)
  return <div className="space-y-5 text-sm">
    <p className="text-muted-foreground">Activity preview for the Atlas contact import.</p>
    <KiraSeparator label="New activity" count={unread} countLabel="updates"
      color="info" labelIcon={<IconMessage />}
      action={{ label: "Mark as read", onClick: () => setUnread(0), disabled: unread === 0,
        disabledReason: unread === 0 ? "You're caught up" : undefined }} />
    <ul className="space-y-3">
      {updates.map(update => <li key={update} className="wrap-anywhere">{update}</li>)}
    </ul>
    <KiraSeparator label="Earlier activity" count={2} countLabel="updates" collapsible>
      <ul className="space-y-3 pt-2 text-muted-foreground">
        <li>The export was added to the workspace.</li>
        <li>Lee started the contact review.</li>
      </ul>
    </KiraSeparator>
  </div>
}`;

function KeyboardDemo() {
  const [activations, setActivations] = React.useState(0);
  const id = React.useId();

  return (
    <div className="space-y-6">
      <KiraSeparator
        label="Unread changes"
        count={3}
        countLabel="changes"
        action={{
          label: "Review changes",
          onClick: () => setActivations((value) => value + 1),
        }}
      />
      <output className="block text-sm">
        Review activated {activations} times.
      </output>
      <KiraSeparator label="Review note" collapsible keepMounted>
        <div className="space-y-2 pt-3">
          <label htmlFor={id} className="text-sm font-medium">
            Note
          </label>
          <Input id={id} defaultValue="Keep this draft" />
        </div>
      </KiraSeparator>
      <KiraSeparator
        label="Archived details"
        collapsible
        disabled
        disabledReason="Ask a project owner for access"
      >
        <p>Restricted history</p>
      </KiraSeparator>
    </div>
  );
}

const keyboardCode = `import { useId, useState } from "react"
import { Input } from "@/components/ui/input"
import { KiraSeparator } from "@/components/ui/separator"

export function KeyboardDemo() {
  const [activations, setActivations] = useState(0)
  const id = useId()
  return <div className="space-y-6">
    <KiraSeparator label="Unread changes" count={3} countLabel="changes"
      action={{ label: "Review changes", onClick: () => setActivations(value => value + 1) }} />
    <p role="status" className="text-sm">Review activated {activations} times.</p>
    <KiraSeparator label="Review note" collapsible keepMounted>
      <div className="space-y-2 pt-3">
        <label htmlFor={id} className="text-sm font-medium">Note</label>
        <Input id={id} defaultValue="Keep this draft" />
      </div>
    </KiraSeparator>
    <KiraSeparator label="Archived details" collapsible disabled disabledReason="Ask a project owner for access">
      <p>Restricted history</p>
    </KiraSeparator>
  </div>
}`;

function StatesDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [reported, setReported] = React.useState("Not inspected");

  return (
    <div className="space-y-7">
      <div className="w-full max-w-[320px] space-y-6">
        <Separator label="Changes from the international customer-directory import need an additional permissions review" />
        <Separator
          ref={ref}
          label={0}
          id="separator-zero-example"
          data-example="zero-label"
          className={(state) =>
            state.orientation === "horizontal" ? "rounded-md" : undefined
          }
        />
        <KiraSeparator label="Resolved alerts" count={0} countLabel="alerts" />
        <KiraSeparator
          label="Archived customer-directory permission checks"
          count={12_480_567}
          countLabel="checks"
          collapsible
        >
          <p className="text-sm">
            Large counts and long labels wrap inside the available space.
          </p>
        </KiraSeparator>
      </div>
      <Separator label="" aria-label="Empty label becomes a plain rule" />
      <KiraSeparator label="Unknown count" count={Number.NaN} />
      <KiraSeparator
        label="Unavailable section"
        collapsible
        disabled
        disabledReason="The import is still being reviewed"
      >
        <p>Pending review</p>
      </KiraSeparator>
      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={() => setReported(ref.current?.id ?? "Missing ref")}
        >
          Inspect labelled root
        </Button>
        <p className="text-xs text-muted-foreground">
          Forwarded root ID: {reported}
        </p>
      </div>
    </div>
  );
}

const statesCode = `import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator, KiraSeparator } from "@/components/ui/separator"

export function StatesDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [reported, setReported] = useState("Not inspected")
  return <div className="space-y-7">
    <div className="w-full max-w-[320px] space-y-6">
      <Separator label="Changes from the international customer-directory import need an additional permissions review" />
      <Separator ref={ref} label={0} id="separator-zero-example" data-example="zero-label"
        className={state => state.orientation === "horizontal" ? "rounded-md" : undefined} />
      <KiraSeparator label="Resolved alerts" count={0} countLabel="alerts" />
      <KiraSeparator label="Archived customer-directory permission checks"
        count={12480567} countLabel="checks" collapsible>
        <p className="text-sm">Large counts and long labels wrap inside the available space.</p>
      </KiraSeparator>
    </div>
    <Separator label="" aria-label="Empty label becomes a plain rule" />
    <KiraSeparator label="Unknown count" count={Number.NaN} />
    <KiraSeparator label="Unavailable section" collapsible disabled disabledReason="The import is still being reviewed">
      <p>Pending review</p>
    </KiraSeparator>
    <div className="space-y-2">
      <Button variant="outline" onClick={() => setReported(ref.current?.id ?? "Missing ref")}>Inspect labelled root</Button>
      <p className="text-xs text-muted-foreground">Forwarded root ID: {reported}</p>
    </div>
  </div>
}`;

const usageCode = `import { Separator, SeparatorLabel, KiraSeparator } from "@/components/ui/separator"

export function ActivityBoundary() {
  return <div className="space-y-6">
    <Separator decorative />
    <Separator label="Workspace activity" labelAlign="start" inset="sm" />
    <div className="flex items-center gap-3">
      <Separator decorative className="flex-1" />
      <SeparatorLabel>Review queue</SeparatorLabel>
      <Separator decorative className="flex-1" />
    </div>
    <KiraSeparator label="Import diagnostics" count={2} countLabel="checks" collapsible keepMounted>
      <p className="pt-3 text-sm">Two duplicates were left out of the import.</p>
    </KiraSeparator>
  </div>
}`;

const separatorProps = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Rule direction; vertical rules stretch in a flex row.",
  },
  {
    prop: "size",
    type: '"xs" | "sm" | "default" | "md" | "lg" | "xl"',
    default: '"default"',
    description:
      "Thickness: 1/1/1/2/4/6px for solid, dashed, dotted, and gradient styles.",
  },
  {
    prop: "lineStyle",
    type: '"solid" | "dashed" | "dotted" | "gradient"',
    default: '"solid"',
    description: "Rule appearance; gradient follows its orientation.",
  },
  {
    prop: "color",
    type: '"default" | "primary" | "secondary" | "muted" | "destructive" | "success" | "warning" | "info"',
    default: '"default"',
    description: "Semantic token for all line styles.",
  },
  {
    prop: "gradient",
    type: '"none" | "fade" | "primary"',
    default: '"none"',
    description:
      "Used with lineStyle=gradient. none/fade inherit the color; primary selects the primary token.",
  },
  {
    prop: "label / labelAlign",
    type: 'React.ReactNode / ("start" | "center" | "end")',
    default: '"center"',
    description:
      "Sentence-case label and logical alignment. 0 is valid; empty string renders a plain rule.",
  },
  {
    prop: "labelIcon / labelIconPosition",
    type: 'React.ReactNode / ("left" | "right")',
    default: '"left"',
    description: "Decorative icon beside the label.",
  },
  {
    prop: "labelClassName / lineClassName",
    type: "string",
    description: "Override the named label and inner line slots.",
  },
  {
    prop: "spacing / inset",
    type: '"none" | "sm" | "default" | "lg"',
    description:
      "Optional outer spacing or content inset using existing 0/8/16/24px tokens. No margin by default.",
  },
  {
    prop: "decorative",
    type: "boolean",
    default: "false",
    description:
      "Maps to presentation/aria-hidden instead of an unsupported primitive prop.",
  },
  {
    prop: "Base UI root props",
    type: 'Omit<SeparatorPrimitive.Props, "children" | "color">',
    description:
      "Native ref/ID/events/ARIA, render, and state-aware className/style are preserved on plain and labelled roots. Use KiraSeparator for interactive labels.",
  },
];

const apiSections = [
  { title: "Separator", props: separatorProps },
  {
    title: "SeparatorLabel",
    props: [
      {
        prop: "children / className / native props",
        type: 'React.ComponentProps<"span">',
        description:
          "Composable sentence-case label with native ref/ID/attributes and separator-label slot.",
      },
    ],
  },
  {
    title: "KiraSeparator",
    props: [
      {
        prop: "label",
        type: "React.ReactNode",
        description:
          "Visible boundary/section name. Actions stay outside separator-role descendants.",
      },
      {
        prop: "Rule options",
        type: 'Pick<SeparatorProps, "orientation" | "size" | "lineStyle" | "color" | "gradient" | "spacing" | "inset" | "labelAlign" | "labelIcon" | "labelIconPosition" | "labelClassName" | "lineClassName">',
        description: "Shares the base variants, label options, and spacing.",
      },
      {
        prop: "count / countLabel",
        type: "number / string",
        default: '"items"',
        description:
          "Finite nonnegative integer count with tabular numerals and contextual accessible label. Invalid counts are omitted.",
      },
      {
        prop: "description / disabledReason",
        type: "React.ReactNode / string",
        description:
          "Visible descriptions and unavailable reasons linked to the root/control.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description:
          "Disable the boundary action or disclosure. A disabled disclosure reason remains focusable.",
      },
      {
        prop: "action",
        type: "SeparatorAction",
        description:
          "Static boundary action; mutually exclusive with collapsible content.",
      },
      {
        prop: "collapsible / children",
        type: "true / React.ReactNode",
        description:
          "Enable a shared Base UI disclosure with a named trigger and panel.",
      },
      {
        prop: "open / defaultOpen / onOpenChange",
        type: 'boolean / boolean / React.ComponentProps<typeof Collapsible>["onOpenChange"]',
        default: "false",
        description:
          "Controlled or uncontrolled disclosure state; native cancellation details are preserved.",
      },
      {
        prop: "keepMounted / motion",
        type: "boolean",
        default: "false / true",
        description:
          "Retain draft content and optionally enable shared disclosure motion; reduced motion remains respected.",
      },
      {
        prop: "Native div props",
        type: 'Omit<React.ComponentProps<"div">, "children" | "color">',
        description:
          "Ref, ID, events, style, ARIA descriptions, and data attributes target the Kira wrapper.",
      },
    ],
  },
  {
    title: "SeparatorAction",
    props: [
      {
        prop: "label / onClick",
        type: "string / (() => void)",
        description: "Visible action name and caller-owned operation.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        default: "false",
        description: "Guard activation and show a reachable explanation.",
      },
      {
        prop: "pending",
        type: "boolean",
        default: "false",
        description:
          "Guard repeat activation and expose busy state with a static decorative loading glyph. Execution stays with the caller.",
      },
    ],
  },
];

const demos = [
  {
    value: "basic",
    label: "Basic",
    title: "Separate workspace settings",
    description: "Semantic and decorative plain rules preserve stock geometry.",
    code: basicCode,
    component: BasicDemo,
  },
  {
    value: "layout",
    label: "Layout",
    title: "Both orientations",
    description:
      "Vertical self-stretch, labelled rails, and logical alignment.",
    code: layoutCode,
    component: LayoutDemo,
  },
  {
    value: "styles",
    label: "Styles",
    title: "Semantic line styles",
    description:
      "Solid, dashed, dotted, and orientation-aware fades use existing tokens.",
    code: stylesCode,
    component: StylesDemo,
  },
  {
    value: "sizes",
    label: "Sizes",
    title: "Consistent thickness",
    description: "All sizes apply to borders as well as solid rules.",
    code: sizesCode,
    component: SizesDemo,
  },
  {
    value: "labels",
    label: "Labels",
    title: "Named content boundaries",
    description:
      "Sentence case, icons, logical placement, and a composable label part.",
    code: labelsCode,
    component: LabelsDemo,
  },
  {
    value: "insets",
    label: "Insets",
    title: "Group related content",
    description: "Token-based insets and explicit outer spacing.",
    code: insetsCode,
    component: InsetsDemo,
  },
  {
    value: "actions",
    label: "Actions",
    title: "Act on a feed boundary",
    description:
      "Shared buttons with counts, busy states, and unavailable reasons.",
    code: actionsCode,
    component: ActionsDemo,
  },
  {
    value: "disclosure",
    label: "Disclosure",
    title: "Retain an import review note",
    description:
      "Controlled disclosure uses shared Collapsible and keeps draft input.",
    code: disclosureCode,
    component: DisclosureDemo,
  },
  {
    value: "kira",
    label: "Kira",
    title: "Activity boundaries",
    description:
      "Read new activity and reveal the archived section when needed.",
    code: kiraCode,
    component: KiraDemo,
  },
  {
    value: "keyboard",
    label: "Keyboard",
    title: "Actions and section controls",
    description:
      "Native activation, reachable disabled reasons, and retained input.",
    code: keyboardCode,
    component: KeyboardDemo,
  },
  {
    value: "states",
    label: "States",
    title: "Labels, refs, and narrow content",
    description:
      "Long names, zero/invalid counts, empty labels, native refs, and unavailable sections.",
    code: statesCode,
    component: StatesDemo,
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function SeparatorPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Separator"
        description="Content boundaries with honest semantics, logical insets, and optional actions or section disclosure."
        version="v2.0.0"
      />
      <FeatureGrid features={separatorPageFeatureGridFeatures} />
      <DemoTabs
        defaultValue="basic"
        tabs={demos.map(({ component: Demo, ...demo }) => ({
          value: demo.value,
          label: demo.label,
          demo: (
            <DemoWrapper
              title={demo.title}
              description={demo.description}
              code={demo.code}
            >
              <Demo />
            </DemoWrapper>
          ),
        }))}
      />
      <KeyboardShortcuts
        description="Plain separators are not tab stops. Actions and disclosure controls inherit native Base UI behavior."
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Visit boundary actions, disclosure triggers, retained inputs while open, and disabled-reason proxies.",
          },
          {
            keys: "Enter / Space",
            description:
              "Activate the action or toggle the section; inherited from Base UI Button/Collapsible.",
          },
          {
            keys: "Close → Open",
            description:
              "Kira addition: keepMounted preserves the review note; closed descendants remain outside normal keyboard interaction.",
          },
          {
            keys: "Disabled reason",
            description:
              "Kira addition: focus the unavailable control/proxy to read its visible explanation.",
          },
        ]}
      />
      <UsageBlock
        code={usageCode}
        description="Use decorative rules for purely visual separation. Put interactive boundary content in KiraSeparator."
      />
      <APIReference sections={apiSections} />
      <Changelog
        entries={[
          {
            version: "v2.0.0",
            date: "2026-11-13",
            changes: [
              {
                type: "added",
                title: "Contextual boundaries and disclosure",
                description:
                  "KiraSeparator adds counts, shared actions, visible disabled reasons, and controlled/uncontrolled Collapsible sections with retained content. Audited on Base UI 1.9.0; feature research through October 31, 2026.",
              },
              {
                type: "fixed",
                title: "Preserve the primitive and native props",
                description:
                  "Labelled roots retain refs, IDs, events, render, state-aware classes/styles, and ARIA. Zero labels work; dashed/dotted thickness and vertical gradients follow their props; slots and logical insets are complete.",
              },
              {
                type: "breaking",
                title: "Remove decorative loops and rainbow gradients",
                description:
                  "animated and gradient=rainbow are removed. Use semantic gradient colors; pending work belongs to the boundary action. Labels use sentence case and can wrap. Plain root geometry and the decorative=false default are retained.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}

const separatorPageFeatureGridFeatures = [
  {
    title: "Semantic rules",
    description:
      "Plain and labelled rules retain the Base UI root and native props.",
    icon: <IconSeparator className="size-4" aria-hidden="true" />,
  },
  {
    title: "Boundary actions",
    description:
      "Named counts and shared buttons turn a feed boundary into a useful next step.",
    icon: <IconMessage className="size-4" aria-hidden="true" />,
  },
  {
    title: "Section disclosure",
    description:
      "Reveal diagnostics and keep draft content through the shared Collapsible.",
    icon: <IconLayoutRows className="size-4" aria-hidden="true" />,
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];
