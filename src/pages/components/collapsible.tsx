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
        <CollapsibleTrigger
          icon={<IconFileText aria-hidden="true" className="size-4" />}
        >
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
        <CollapsibleTrigger
          icon={<IconSettings aria-hidden="true" className="size-4" />}
        >
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

const triggerVariantList: ReactComponentProps<
  typeof CollapsibleTrigger
>["variant"][] = [
  "default",
  "outline",
  "ghost",
  "link",
  "info",
  "success",
  "warning",
  "destructive",
];

const triggerSizeList: ReactComponentProps<
  typeof CollapsibleTrigger
>["size"][] = ["xs", "sm", "default", "lg"];

function VariantsDemo() {
  return (
    <div className="max-w-xl space-y-3">
      {triggerVariantList.map((variant) => (
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
        {triggerSizeList.map((size) => (
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
        icon={<IconFileText aria-hidden="true" className="size-4" />}
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
        icon={<IconLock aria-hidden="true" className="size-4" />}
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
        <p className="text-sm text-destructive">
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

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger variant="outline">
          Quarterly-accessibility-and-localization-audit-summary-2026-final-approved.pdf
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-sm text-muted-foreground">
            Long unbroken filenames wrap cleanly inside narrow disclosure
            headers without clipping the chevron.
          </p>
        </CollapsibleContent>
      </Collapsible>
      <KiraCollapsible title="Empty panel" defaultOpen />
      <KiraCollapsible
        title="Locked retention policy"
        icon={<IconLock aria-hidden="true" className="size-4" />}
        disabled
        disabledReason="Only organization administrators can modify retention policies."
      >
        Policy controls
      </KiraCollapsible>
    </div>
  );
}

const stressCode = `import { Collapsible, CollapsibleTrigger, CollapsibleContent, KiraCollapsible } from "@/components/ui/collapsible"

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger variant="outline">
          Quarterly-accessibility-and-localization-audit-summary-2026-final-approved.pdf
        </CollapsibleTrigger>
        <CollapsibleContent>
          Long unbroken filenames wrap cleanly inside narrow disclosure headers.
        </CollapsibleContent>
      </Collapsible>
      <KiraCollapsible title="Empty panel" defaultOpen />
      <KiraCollapsible
        title="Locked retention policy"
        disabled
        disabledReason="Only organization administrators can modify retention policies."
      >
        Policy controls
      </KiraCollapsible>
    </div>
  )
}`;

const usageCode = `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  KiraCollapsible,
} from "@/components/ui/collapsible";

export function ReleaseDisclosure() {
  return (
    <div className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Release notes</CollapsibleTrigger>
        <CollapsibleContent>
          October release: exports preserve folder structure.
        </CollapsibleContent>
      </Collapsible>
      <KiraCollapsible
        title="Review requirements"
        description="Complete these checks before sharing outside the workspace."
        defaultOpen
      >
        <p>Confirm owner approval and remove personal data.</p>
      </KiraCollapsible>
    </div>
  );
}`;

export default function CollapsiblePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Collapsible"
        description="Reveal supporting details with native disclosure semantics and quiet, reversible motion."
        version="v2.0.1"
      />
      <FeatureGrid
        features={collapsiblePageFeatureGridFeatures}
        description="Native Base UI disclosure primitives with draft retention and visible disabled explanations."
      />
      <DemoTabs defaultValue="basic" tabs={collapsiblePageDemoTabsTabs} />
      <KeyboardShortcuts
        shortcuts={collapsiblePageShortcuts}
        description="Standard keyboard navigation and toggle bindings inherited from Base UI."
      />
      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose the primitive parts for custom layouts, or use KiraCollapsible for titled sections with descriptions and loading states."
        notes={collapsiblePageUsageNotes}
      />
      <APIReference
        sections={collapsiblePageAPIReferenceSections}
        description="Props, types and defaults for Collapsible primitives and KiraCollapsible."
      />
      <Changelog
        entries={collapsiblePageChangelogEntries}
        title="Changelog"
        description="Version history for Collapsible."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const collapsiblePageFeatureGridFeatures = [
  {
    title: "Native disclosure",
    description: "Base UI owns semantics, focus and panel lifecycle.",
    icon: <IconFileText aria-hidden="true" className="size-5" />,
  },
  {
    title: "Draft retention",
    description: "Keep edits when a panel closes and reopens.",
    icon: <IconSettings aria-hidden="true" className="size-5" />,
  },
  {
    title: "Visible reasons",
    description: "Explain unavailable controls beside their trigger.",
    icon: <IconLock aria-hidden="true" className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const collapsiblePageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper title="Release notes" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "details",
    label: "Details",
    group: "Core",
    demo: (
      <DemoWrapper title="Details" code={detailsCode}>
        <DetailsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nested",
    label: "Nested",
    group: "Core",
    demo: (
      <DemoWrapper title="Nested" code={nestedCode}>
        <NestedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper title="Variants" code={variantsCode}>
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraCollapsible",
    demo: (
      <DemoWrapper title="Kira" code={kiraCode}>
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "draft",
    label: "Draft",
    group: "Behavior",
    demo: (
      <DemoWrapper title="Draft" code={draftCode}>
        <DraftDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper title="States" code={statesCode}>
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long unbroken titles, empty content and disabled explanations inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const collapsiblePageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Inherited from Base UI: focus the trigger and visible panel controls.",
  },
  {
    keys: "Enter / Space",
    description: "Inherited from Base UI: toggle the focused trigger.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const collapsiblePageUsageNotes = [
  {
    label: "KiraCollapsible",
    body: "Use the wrapper when a disclosure needs a linked description, disabledReason, or built-in loading skeleton.",
  },
  {
    label: "Retaining form drafts",
    body: "Panels unmount when closed by default; pass lazyMount or keepMounted on CollapsibleContent to preserve input state.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

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
      {
        prop: "open / defaultOpen",
        type: "boolean",
        default: "false",
        description: "Controlled or initial open state.",
      },
      {
        prop: "onOpenChange",
        type: "(open, details) => void",
        default: "-",
        description: "Native Base UI event details; cancellation is honored.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable trigger interaction.",
      },
      {
        prop: "motion",
        type: "boolean",
        default: "true",
        description:
          "Allow panel and chevron transitions; reduced motion always wins.",
      },
      {
        prop: "render / ref / className / children",
        type: "Base UI Root props",
        default: "-",
        description: "Native composition and root props forwarded.",
      },
    ],
  },
  {
    title: "CollapsibleTrigger / CollapsibleTriggerProps",
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive" | "ghost" | "outline" | "link"',
        default: '"default"',
        description: "Semantic trigger styling.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Trigger density.",
      },
      {
        prop: "showArrow",
        type: "boolean",
        default: "true",
        description: "Show the rotating chevron, including custom chevrons.",
      },
      {
        prop: "chevronIcon / icon",
        type: "ReactNode",
        default: "-",
        description: "Decorative custom chevron or leading icon.",
      },
      {
        prop: "chevronPosition",
        type: '"start" | "end"',
        default: '"end"',
        description: "Chevron placement.",
      },
      {
        prop: "render / ref / children / className",
        type: "Base UI Trigger props",
        default: "-",
        description: "Native trigger composition and handlers forwarded.",
      },
    ],
  },
  {
    title: "CollapsibleContent / CollapsibleContentProps",
    props: [
      {
        prop: "size",
        type: '"none" | "xs" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Content spacing; none supports tree groups.",
      },
      {
        prop: "inset",
        type: "boolean",
        default: "false",
        description: "Logical-start content inset.",
      },
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description:
          "Keep content in the DOM while hidden; explicit value wins over lazyMount.",
      },
      {
        prop: "lazyMount",
        type: "boolean",
        default: "false",
        description:
          "Retain after first opening; defaultOpen counts as opened.",
      },
      {
        prop: "hiddenUntilFound",
        type: "boolean",
        default: "false",
        description:
          "Native browser find-in-page disclosure; support varies by browser.",
      },
      {
        prop: "loading / skeletonLines",
        type: "boolean / number",
        default: "false / 3",
        description: "Actual busy state with 1–8 static placeholder lines.",
      },
      {
        prop: "render / ref / children / className / style",
        type: "Base UI Panel props",
        default: "-",
        description: "Native panel props forwarded.",
      },
    ],
  },
  {
    title: "KiraCollapsible / KiraCollapsibleProps",
    props: [
      {
        prop: "title / children",
        type: "ReactNode",
        default: "required / -",
        description: "Visible trigger and panel content.",
      },
      {
        prop: "description / disabledReason",
        type: "string",
        default: "-",
        description:
          "Visible summary or disabled explanation linked to the trigger.",
      },
      {
        prop: "icon / variant / size",
        type: "CollapsibleTrigger props",
        default: "-",
        description: "Shared trigger styling.",
      },
      {
        prop: "loading / keepMounted",
        type: "boolean",
        default: "false",
        description: "Busy content or state retention.",
      },
      {
        prop: "open / defaultOpen / onOpenChange / disabled / motion",
        type: "CollapsibleRootProps",
        default: "native defaults",
        description: "Root controls forwarded.",
      },
      {
        prop: "ref / className / render",
        type: "Base UI Root props",
        default: "-",
        description: "Root composition and styling.",
      },
    ],
  },
  {
    title: "collapsibleTriggerVariants / collapsibleContentVariants",
    props: [
      {
        prop: "variant / size",
        type: "cva arguments",
        default: "default",
        description:
          "Exported class recipes used by the components; content also supports size none.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];
