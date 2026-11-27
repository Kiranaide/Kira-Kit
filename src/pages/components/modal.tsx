import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button>Open Modal</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal Title</DialogTitle>
            <DialogDescription>
              This is a basic modal with title and description.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Modal content goes here. Modals focus user attention on a single
            task while trapping keyboard focus inside the surface.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const basicCode = `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BasicModalDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Open Modal</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>
            This is a basic modal with title and description.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Modal content goes here.</p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex min-h-48 flex-wrap items-center justify-center gap-4">
      {modalSizes.map((size) => (
        <Dialog key={size}>
          <DialogTrigger
            render={
              <Button variant="outline" className="capitalize">
                {size}
              </Button>
            }
          />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle className="capitalize">{size} Modal</DialogTitle>
              <DialogDescription>
                Modal with <code>size="{size}"</code>
              </DialogDescription>
            </DialogHeader>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
              Content area
            </div>
            <DialogFooter>
              <DialogClose render={<Button>Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

const sizesCode = `const sizes = ["sm", "default", "lg", "xl", "full"] as const

export function ModalSizesDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline">{size}</Button>} />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>{size} Modal</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button>Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}`;

function CenteredDemo() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Open Centered Modal</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Centered Modal</DialogTitle>
            <DialogDescription>
              Vertically and horizontally centered inside the viewport with safe
              padding.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            DialogContent centers itself in the viewport flex container and
            clamps height to fit smaller mobile screens.
          </p>
          <DialogFooter>
            <DialogClose render={<Button>Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const centeredCode = `<Dialog>
  <DialogTrigger render={<Button variant="outline">Open Centered Modal</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Centered Modal</DialogTitle>
      <DialogDescription>Centered inside the viewport.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button>Close</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`;

function ControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Controlled Modal</Button>
      <p className="text-sm text-muted-foreground">
        Modal is currently: <code>{open ? "open" : "closed"}</code>
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Modal</DialogTitle>
            <DialogDescription>
              Visibility is controlled programmatically via React state.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Pass <code>open</code> and <code>onOpenChange</code> to coordinate
            modal dismissal with form submissions or routing.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const controlledCode = `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open Controlled Modal</Button>
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Controlled Modal</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
      <Button onClick={() => setOpen(false)}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

function ScrollableDemo() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline">View Terms</Button>} />
        <DialogContent size="lg" scrollable>
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Scrollable body keeps the header and footer anchored while reading
              long documents.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="max-h-72 space-y-4 pr-2">
            {termsSections.map((section) => (
              <div key={section.id} className="space-y-1">
                <h4 className="text-sm font-medium text-foreground">
                  {section.heading}
                </h4>
                <p className="text-sm text-muted-foreground">{section.body}</p>
              </div>
            ))}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Decline</Button>} />
            <DialogClose render={<Button>Accept Terms</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const scrollableCode = `import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button variant="outline">View Terms</Button>} />
  <DialogContent size="lg" scrollable>
    <DialogHeader>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogDescription>Header and footer remain visible while scrolling.</DialogDescription>
    </DialogHeader>
    <DialogBody className="max-h-72 space-y-4 pr-2">
      {sections.map((section) => (
        <div key={section.id}>
          <h4 className="text-sm font-medium">{section.heading}</h4>
          <p className="text-sm text-muted-foreground">{section.body}</p>
        </div>
      ))}
    </DialogBody>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Decline</Button>} />
      <DialogClose render={<Button>Accept Terms</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`;

function DialogFormDemo() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button>Create Project</Button>} />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modal-project-name">Project Name</Label>
              <Input id="modal-project-name" placeholder="Kira Dashboard" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-project-description">Description</Label>
              <Textarea
                id="modal-project-description"
                placeholder="Brief summary of the project goals…"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const dialogFormCode = `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

<Dialog>
  <DialogTrigger render={<Button>Create Project</Button>} />
  <DialogContent size="lg">
    <DialogHeader>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogDescription>Fill in the details below.</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input id="project-name" placeholder="Kira Dashboard" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} />
      </div>
    </div>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Create Project</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-3">
      <Dialog>
        <DialogTrigger
          render={
            <Button variant="outline" className="w-full justify-start truncate">
              Open Long Unbroken Title &amp; Empty Body Modal
            </Button>
          }
        />
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle className="break-words">
              WorkspaceBillingMigrationConfirmation_2026_EnterpriseTier
            </DialogTitle>
            <DialogDescription>
              Verifies unbroken title wrapping, empty body spacing, and disabled
              primary confirmation in narrow viewports.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Dismiss</Button>} />
            <Button disabled>Confirm unavailable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" className="w-full" disabled>
        Disabled trigger state
      </Button>
    </div>
  );
}

const stressCode = `// Narrow max-w-xs column: long unbroken title, empty body, disabled action & trigger
<div className="max-w-xs space-y-3">
  <Dialog>
    <DialogTrigger render={<Button variant="outline" className="w-full truncate">Open Long Title Modal</Button>} />
    <DialogContent size="sm">
      <DialogHeader>
        <DialogTitle className="break-words">
          WorkspaceBillingMigrationConfirmation_2026_EnterpriseTier
        </DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <DialogClose render={<Button variant="outline">Dismiss</Button>} />
        <Button disabled>Confirm unavailable</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>`;

const usageCode = `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button>Open Modal</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    <div>Your content here</div>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

export default function ModalPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Modal"
        description="Modal overlay patterns composed from Base UI Dialog primitives with focus trapping, scrollable bodies, and controlled state."
        version="v1.0.0"
      />

      <FeatureGrid
        features={modalPageFeatures}
        description="Accessible modal patterns powered by @/components/ui/dialog."
      />

      <DemoTabs defaultValue="basic" tabs={modalPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={modalPageShortcuts}
        description="Focus trapping and dismissal bindings provided by Base UI Dialog."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose modal patterns using Dialog primitives from @/components/ui/dialog."
        notes={modalPageUsageNotes}
      />

      <APIReference
        sections={modalPageAPISections}
        description="Props for the Dialog primitives used in these modal recipes."
      />

      <Changelog
        entries={modalPageChangelogEntries}
        title="Changelog"
        description="Version history for modal pattern documentation."
      />
    </ComponentPage>
  );
}

const modalSizes = ["sm", "default", "lg", "xl", "full"] as const;

const termsSections = [
  {
    id: "terms-1",
    heading: "1. Account & Workspace Access",
    body: "Workspaces isolate billing, audit logs, and role permissions per organization.",
  },
  {
    id: "terms-2",
    heading: "2. Data Retention",
    body: "Exported archives remain available for thirty days before automatic removal.",
  },
  {
    id: "terms-3",
    heading: "3. Security Controls",
    body: "Single sign-on and hardware passkeys can be enforced by workspace administrators.",
  },
  {
    id: "terms-4",
    heading: "4. Service Availability",
    body: "Planned maintenance windows are announced in advance with status updates.",
  },
  {
    id: "terms-5",
    heading: "5. Acceptable Use",
    body: "Automated scraping or rate-limit evasion is prohibited across shared endpoints.",
  },
  {
    id: "terms-6",
    heading: "6. Support & Notices",
    body: "Policy updates take effect after notification to designated billing contacts.",
  },
] as const;

const modalPageFeatures = [
  {
    title: "Accessible Focus Trap",
    description:
      "WAI-ARIA dialog semantics with focus containment, Escape dismissal, and automatic focus return.",
  },
  {
    title: "Responsive Sizes & Scrollable Body",
    description:
      "Five width presets (sm through full) plus DialogBody for sticky headers and footers.",
  },
  {
    title: "Reduced-Motion Safe",
    description:
      "Scale and backdrop transitions automatically respect prefers-reduced-motion.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const modalPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Modal"
        description="A standard modal with title, description, and action buttons."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Available in sm, default, lg, xl, and full-screen sizes."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "centered",
    label: "Centered",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Centered Modal"
        description="Vertically and horizontally centered with safe viewport padding."
        code={centeredCode}
      >
        <CenteredDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controlled",
    label: "Controlled",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Controlled State"
        description="Manage modal visibility programmatically with open and onOpenChange."
        code={controlledCode}
      >
        <ControlledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "scrollable",
    label: "Scrollable",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Scrollable Content"
        description="Keep header and footer anchored while DialogBody scrolls long content."
        code={scrollableCode}
      >
        <ScrollableDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dialog",
    label: "Form Modal",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Form Modal"
        description="Modal composed with labelled Input and Textarea fields."
        code={dialogFormCode}
      >
        <DialogFormDemo />
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
        description="Unbroken title wrapping, empty body, and disabled action/trigger states in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const modalPageShortcuts = [
  {
    keys: "Esc",
    group: "Dismissal",
    description: "Close the modal and restore focus to the trigger (Base UI).",
  },
  {
    keys: "Tab / Shift + Tab",
    group: "Focus trap",
    description: "Cycle focus strictly within the modal surface (Base UI).",
  },
  {
    keys: "Enter / Space",
    group: "Activation",
    description: "Activate the focused trigger or modal action button.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const modalPageUsageNotes = [
  {
    label: "Modal vs Dialog",
    body: "Modal patterns in Kira Kit are built directly on @/components/ui/dialog (Base UI Dialog). Use the render prop on DialogTrigger and DialogClose instead of Radix asChild.",
  },
  {
    label: "Destructive confirmations",
    body: "Reach for AlertDialog when an action is irreversible and requires explicit confirmation without accidental backdrop dismissal.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const modalPageAPISections = [
  {
    title: "Dialog",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "-",
        description: "Controlled open state of the modal.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state when uncontrolled.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        default: "-",
        description: "Callback fired when open state changes.",
      },
      {
        prop: "modal",
        type: "boolean",
        default: "true",
        description: "Block background interaction while open.",
      },
    ],
  },
  {
    title: "DialogTrigger & DialogClose",
    props: [
      {
        prop: "render",
        type: "ReactElement",
        default: "-",
        description:
          "Base UI element composition prop (for example render={<Button>Open</Button>}).",
      },
    ],
  },
  {
    title: "DialogContent",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Maximum width preset for the modal surface.",
      },
      {
        prop: "scrollable",
        type: "boolean",
        default: "false",
        description: "Keep header and footer fixed while DialogBody scrolls.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Render the top-right dismiss icon button.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "DialogHeader / DialogBody / DialogFooter",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for structural layout slots.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description:
          "Slot contents (DialogTitle/DialogDescription, scrollable body, or action buttons).",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const modalPageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Modal pattern guide",
        description:
          "Documented Base UI Dialog modal recipes including sizes, controlled state, scrollable DialogBody, forms, and stress cases.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
