import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconFileText, IconSettings, IconLock } from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  KiraCollapsible,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="max-w-xl">
      <Collapsible defaultOpen>
        <CollapsibleTrigger icon={<IconFileText className="size-4" />}>
          Release notes
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            October release: document exports now preserve folder structure and
            exclude restricted files.
          </p>
          <a
            href="#release-checklist"
            className="mt-3 inline-block text-sm underline"
          >
            Review the checklist
          </a>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const basicCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
export function ReleaseNotes() {
  return <Collapsible defaultOpen>
    <CollapsibleTrigger>Release notes</CollapsibleTrigger>
    <CollapsibleContent>October release: exports preserve folder structure.</CollapsibleContent>
  </Collapsible>
}`;

function DetailsDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">Research findings.pdf</p>
          <p className="text-sm text-muted-foreground">
            Updated October 28 · 2.4 MB
          </p>
        </div>
        <Button
          className="focus-visible:ring-primary"
          variant="outline"
          onClick={() => setOpen(!open)}
        >
          {open ? "Hide details" : "Show details"}
        </Button>
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger variant="outline" chevronPosition="start">
          Document details
        </CollapsibleTrigger>
        <CollapsibleContent>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Owner</dt>
            <dd>Product research</dd>
            <dt className="text-muted-foreground">Visibility</dt>
            <dd>Workspace members</dd>
            <dt className="text-muted-foreground">Retention</dt>
            <dd>12 months</dd>
          </dl>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const detailsCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
export function DocumentDetails() {
  const [open, setOpen] = useState(false)
  return <><Button onClick={() => setOpen(!open)}>{open ? "Hide details" : "Show details"}</Button>
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger variant="outline" chevronPosition="start">Document details</CollapsibleTrigger>
      <CollapsibleContent><dl><dt>Owner</dt><dd>Product research</dd></dl></CollapsibleContent>
    </Collapsible></>
}`;

function NestedDemo() {
  return (
    <div className="max-w-xl">
      <Collapsible defaultOpen>
        <CollapsibleTrigger icon={<IconSettings className="size-4" />}>
          Export preferences
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Files keep their original names and folder structure.
          </p>
          <Collapsible>
            <CollapsibleTrigger
              size="sm"
              variant="outline"
              chevronPosition="start"
            >
              Advanced options
            </CollapsibleTrigger>
            <CollapsibleContent size="sm">
              <ul className="list-inside list-disc space-y-2 text-sm">
                <li>Include a manifest of selected documents</li>
                <li>Exclude restricted or archived documents</li>
                <li>Preserve relative folder paths</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const nestedCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
export function ExportPreferences() {
  return <Collapsible defaultOpen><CollapsibleTrigger>Export preferences</CollapsibleTrigger>
    <CollapsibleContent><p>Preserve original names and folder structure.</p>
      <Collapsible><CollapsibleTrigger size="sm" variant="outline">Advanced options</CollapsibleTrigger>
        <CollapsibleContent size="sm">Include a manifest; exclude restricted files.</CollapsibleContent>
      </Collapsible>
    </CollapsibleContent>
  </Collapsible>
}`;

function DraftDemo() {
  return (
    <div className="max-w-xl space-y-3">
      <p className="text-sm text-muted-foreground">
        Type a note, close, and reopen. The input stays mounted, preserving your
        draft.
      </p>
      <Collapsible>
        <CollapsibleTrigger>Optional export note</CollapsibleTrigger>
        <CollapsibleContent lazyMount>
          <label
            htmlFor="export-note"
            className="mb-2 block text-sm font-medium"
          >
            Note for reviewers
          </label>
          <Input
            className="border-muted-foreground focus-visible:border-primary focus-visible:ring-primary"
            id="export-note"
            defaultValue="Please review the research findings."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Local example — nothing is submitted.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const draftCode = `import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
export function ExportNote() {
  return <Collapsible><CollapsibleTrigger>Optional export note</CollapsibleTrigger>
    <CollapsibleContent lazyMount><label htmlFor="export-note">Note for reviewers</label>
      <Input id="export-note" defaultValue="Please review the research findings." />
    </CollapsibleContent>
  </Collapsible>
}`;

function VariantsDemo() {
  return (
    <div className="max-w-xl space-y-3">
      {(
        [
          "default",
          "outline",
          "ghost",
          "link",
          "info",
          "success",
          "warning",
          "destructive",
        ] as const
      ).map((variant) => (
        <Collapsible key={variant}>
          <CollapsibleTrigger variant={variant}>
            {variant} disclosure
          </CollapsibleTrigger>
          <CollapsibleContent>
            Document details use the {variant} tone.
          </CollapsibleContent>
        </Collapsible>
      ))}
      <div className="border-t pt-3">
        {(["xs", "sm", "default", "lg"] as const).map((size) => (
          <Collapsible key={size}>
            <CollapsibleTrigger size={size}>{size} size</CollapsibleTrigger>
            <CollapsibleContent size={size}>
              Matching content spacing.
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

const variantsCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
export function OutlineDisclosure() {
  return <Collapsible><CollapsibleTrigger variant="outline" size="sm">Document details</CollapsibleTrigger>
    <CollapsibleContent size="sm">Owner: Product research</CollapsibleContent>
  </Collapsible>
}`;

function KiraDemo() {
  return (
    <div className="max-w-xl space-y-4">
      <KiraCollapsible
        title="Review requirements"
        description="Complete these checks before sharing outside the workspace."
        icon={<IconFileText className="size-4" />}
        defaultOpen
      >
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>Remove personal data from interview notes</li>
          <li>Confirm the document owner approved sharing</li>
          <li>Use a link with an expiration date</li>
        </ul>
      </KiraCollapsible>
      <KiraCollapsible
        title="External sharing"
        icon={<IconLock className="size-4" />}
        disabled
        disabledReason="Only workspace owners can change external sharing."
      >
        Sharing controls
      </KiraCollapsible>
    </div>
  );
}

const kiraCode = `import { KiraCollapsible } from "@/components/ui/collapsible"
export function ReviewRequirements() {
  return <KiraCollapsible title="Review requirements" defaultOpen
    description="Complete these checks before sharing outside the workspace.">
    <ul><li>Remove personal data</li><li>Confirm owner approval</li></ul>
  </KiraCollapsible>
}`;

function StatesDemo() {
  return (
    <div className="max-w-xl space-y-5">
      <KiraCollapsible title="Loading document metadata" defaultOpen loading />
      <KiraCollapsible title="No review notes" defaultOpen>
        <p className="text-sm text-muted-foreground">
          No notes yet. Add one when the review starts.
        </p>
      </KiraCollapsible>
      <KiraCollapsible title="Unable to load review notes" defaultOpen>
        <p className="text-sm text-[color-mix(in_oklab,var(--destructive)_75%,var(--foreground))]">
          The document is unavailable. Check access with its owner.
        </p>
      </KiraCollapsible>
      <Collapsible defaultOpen motion={false}>
        <CollapsibleTrigger size="xs">
          Long title:
          customer-research-accessibility-and-internationalization-review-october-2026.md
        </CollapsibleTrigger>
        <CollapsibleContent size="xs">
          Motion is explicitly disabled for this example.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const statesCode = `import { KiraCollapsible } from "@/components/ui/collapsible"
export function LoadingMetadata() {
  return <KiraCollapsible title="Loading document metadata" defaultOpen loading />
}`;

const prop = (
  name: string,
  type: string,
  value: string,
  description: string,
) => ({ prop: name, type, default: value, description });

export default function CollapsiblePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Collapsible"
        description="Reveal supporting details with native disclosure semantics and quiet, reversible motion."
        version="2.0.1"
      />
      <FeatureGrid features={collapsiblePageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={collapsiblePageDemoTabsTabs} />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Inherited from Base UI: focus the trigger and visible panel controls.",
          },
          {
            keys: "Enter / Space",
            description: "Inherited from Base UI: toggle the focused trigger.",
          },
        ]}
      />
      <UsageBlock code={basicCode} />
      <UsageBlock title="Kira usage" code={kiraCode} />
      <APIReference sections={collapsiblePageAPIReferenceSections} />
      <Changelog entries={collapsiblePageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const collapsiblePageFeatureGridFeatures = [
  {
    title: "Native disclosure",
    description: "Base UI owns semantics, focus and panel lifecycle.",
    icon: <IconFileText className="size-5" />,
  },
  {
    title: "Draft retention",
    description: "Keep edits when a panel closes and reopens.",
    icon: <IconSettings className="size-5" />,
  },
  {
    title: "Visible reasons",
    description: "Explain unavailable controls beside their trigger.",
    icon: <IconLock className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const collapsiblePageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="Release notes" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "details",
    label: "Details",
    demo: (
      <DemoWrapper title="Details" code={detailsCode}>
        <DetailsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nested",
    label: "Nested",
    demo: (
      <DemoWrapper title="Nested" code={nestedCode}>
        <NestedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "draft",
    label: "Draft",
    demo: (
      <DemoWrapper title="Draft" code={draftCode}>
        <DraftDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper title="Variants" code={variantsCode}>
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper title="Kira" code={kiraCode}>
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper title="States" code={statesCode}>
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const collapsiblePageChangelogEntries = [
  {
    version: "2.0.1",
    date: "10 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Accessible variant contrast and focus",
        description:
          "Light-mode semantic labels and error text now meet contrast requirements; focus rings use the existing primary token.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "10 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Base UI 1.9.0 owns panel lifecycle",
        description:
          "Removed DOM observers, GSAP height measurements and forced inline visibility. Native measured-height and opacity transitions move surrounding content smoothly, interrupt safely and honor reduced motion.",
      },
      {
        type: "added",
        title:
          "KiraCollapsible, loading, retention and padding-free tree content",
        description:
          "Focused document, nested settings, draft and state demos.",
      },
      {
        type: "breaking",
        title: "showSkeleton replaced by loading",
        description:
          "Set loading for a real pending state. Default content unmounts when closed; use keepMounted or lazyMount for retention. Arrow now points right when closed and down when open; showArrow=false hides custom arrows too.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const collapsiblePageAPIReferenceSections = [
  {
    title: "Collapsible / CollapsibleRootProps",
    props: [
      prop(
        "open / defaultOpen",
        "boolean",
        "false",
        "Controlled or initial open state.",
      ),
      prop(
        "onOpenChange",
        "(open, details) => void",
        "—",
        "Native Base UI event details; cancellation is honored.",
      ),
      prop("disabled", "boolean", "false", "Disable trigger interaction."),
      prop(
        "motion",
        "boolean",
        "true",
        "Allow panel and chevron transitions; reduced motion always wins.",
      ),
      prop(
        "render / ref / className / children",
        "Base UI Root props",
        "—",
        "Native composition and root props forwarded.",
      ),
    ],
  },
  {
    title: "CollapsibleTrigger / CollapsibleTriggerProps",
    props: [
      prop(
        "variant",
        '"default" | "info" | "success" | "warning" | "destructive" | "ghost" | "outline" | "link"',
        '"default"',
        "Semantic trigger styling.",
      ),
      prop(
        "size",
        '"xs" | "sm" | "default" | "lg"',
        '"default"',
        "Trigger density.",
      ),
      prop(
        "showArrow",
        "boolean",
        "true",
        "Show the rotating chevron, including custom chevrons.",
      ),
      prop(
        "chevronIcon / icon",
        "ReactNode",
        "—",
        "Decorative custom chevron or leading icon.",
      ),
      prop("chevronPosition", '"start" | "end"', '"end"', "Chevron placement."),
      prop(
        "render / ref / children / className",
        "Base UI Trigger props",
        "—",
        "Native trigger composition and handlers forwarded.",
      ),
    ],
  },
  {
    title: "CollapsibleContent / CollapsibleContentProps",
    props: [
      prop(
        "size",
        '"none" | "xs" | "sm" | "default" | "lg"',
        '"default"',
        "Content spacing; none supports tree groups.",
      ),
      prop("inset", "boolean", "false", "Logical-start content inset."),
      prop(
        "keepMounted",
        "boolean",
        "false",
        "Keep content in the DOM while hidden; explicit value wins over lazyMount.",
      ),
      prop(
        "lazyMount",
        "boolean",
        "false",
        "Retain after first opening; defaultOpen counts as opened.",
      ),
      prop(
        "hiddenUntilFound",
        "boolean",
        "false",
        "Native browser find-in-page disclosure; support varies by browser.",
      ),
      prop(
        "loading / skeletonLines",
        "boolean / number",
        "false / 3",
        "Actual busy state with 1–8 static placeholder lines.",
      ),
      prop(
        "render / ref / children / className / style",
        "Base UI Panel props",
        "—",
        "Native panel props forwarded.",
      ),
    ],
  },
  {
    title: "KiraCollapsible / KiraCollapsibleProps",
    props: [
      prop(
        "title / children",
        "ReactNode",
        "required / —",
        "Visible trigger and panel content.",
      ),
      prop(
        "description / disabledReason",
        "string",
        "—",
        "Visible summary or disabled explanation linked to the trigger.",
      ),
      prop(
        "icon / variant / size",
        "CollapsibleTrigger props",
        "—",
        "Shared trigger styling.",
      ),
      prop(
        "loading / keepMounted",
        "boolean",
        "false",
        "Busy content or state retention.",
      ),
      prop(
        "open / defaultOpen / onOpenChange / disabled / motion",
        "CollapsibleRootProps",
        "native defaults",
        "Root controls forwarded.",
      ),
      prop(
        "ref / className / render",
        "Base UI Root props",
        "—",
        "Root composition and styling.",
      ),
    ],
  },
  {
    title: "collapsibleTriggerVariants / collapsibleContentVariants",
    props: [
      prop(
        "variant / size",
        "cva arguments",
        "default",
        "Exported class recipes used by the components; content also supports size none.",
      ),
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];
