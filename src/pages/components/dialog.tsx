import type { ComponentProps as ReactComponentProps } from "react";
import { useId, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  KiraDialog,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Open Dialog</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Kira Kit</DialogTitle>
            <DialogDescription>
              This is a basic dialog with a title and description.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You can put any content here including forms, images, or other
            components.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const basicCode = `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function BasicDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Open Dialog</Button>}
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Kira Kit</DialogTitle>
            <DialogDescription>
              This is a basic dialog with a title and description.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You can put any content here including forms, images, or other
            components.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger
            render={
              <Button variant="outline" className="capitalize">
                {size} ({size === "full" ? "Fullscreen" : "Pop-up"})
              </Button>
            }
          />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle className="capitalize">{size} Dialog</DialogTitle>
              <DialogDescription>
                This is a dialog with <code>size="{size}"</code>.
              </DialogDescription>
            </DialogHeader>
            <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
              Content Area
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

const sizesCode = `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger
            render={
              <Button variant="outline" className="capitalize">
                {size} ({size === "full" ? "Fullscreen" : "Pop-up"})
              </Button>
            }
          />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle className="capitalize">{size} Dialog</DialogTitle>
              <DialogDescription>
                This is a dialog with <code>size="{size}"</code>.
              </DialogDescription>
            </DialogHeader>
            <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
              Content Area
            </div>
            <DialogFooter>
              <DialogClose render={<Button>Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}`;

function FormDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger render={<Button>Edit Profile</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const formCode = `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger render={<Button>Edit Profile</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

function ScrollableDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Open Scrollable Dialog</Button>}
        />
        <DialogContent size="lg" scrollable>
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Please read and accept our terms of service.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="max-h-72 space-y-4 pr-2">
            {Array.from({ length: 10 }, (_, i) => ({
              id: "section-" + (i + 1),
              number: i + 1,
            })).map((section) => (
              <p key={section.id} className="text-sm text-muted-foreground">
                Section {section.number}: Project members can access shared
                research while their invitation is active. Remove access from
                project settings when a collaborator leaves the team. This
                sample policy is illustrative demo content.
              </p>
            ))}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Decline</Button>} />
            <DialogClose render={<Button>Accept</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const scrollableCode = `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ScrollableDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Open Scrollable Dialog</Button>}
        />
        <DialogContent size="lg" scrollable>
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Please read and accept our terms of service.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="max-h-72 space-y-4 pr-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={section.id} className="text-sm text-muted-foreground">
                Section {section.number}: Project members can access shared research
                while their invitation is active. Remove access from project
                settings when a collaborator leaves the team. This sample policy
                is illustrative demo content.
              </p>
            ))}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Decline</Button>} />
            <DialogClose render={<Button>Accept</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

function SaveDemo() {
  const resolveValue1 = () => {
    if (state === "invalid") {
      return "Enter a project name, then save again." as const;
    }

    if (state === "saved") {
      return "Project saved." as const;
    }

    if (state === "pending") {
      return "Saving your project." as const;
    }

    return "Your changes stay in this demo." as const;
  };

  const [name, setName] = useState("Customer research");
  const [savedName, setSavedName] = useState(name);

  const [state, setState] = useState<"idle" | "pending" | "saved" | "invalid">(
    "idle",
  );

  const inputId = useId();
  const statusId = useId();

  const save = async () => {
    if (state === "pending") return;

    if (!name.trim()) {
      setState("invalid");

      return;
    }

    setState("pending");
    await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    setSavedName(name.trim());
    setState("saved");
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Current project: {savedName}
      </p>
      <SaveControlsSection
        state={state}
        setState={setState}
        statusId={statusId}
        save={save}
        inputId={inputId}
        name={name}
        setName={setName}
        resolveValue1={resolveValue1}
      />
    </div>
  );
}

const saveCode = `import { useId, useState } from "react"
import { DialogClose, KiraDialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SaveDemo() {
  const [name, setName] = useState("Customer research");
  const [savedName, setSavedName] = useState(name);
  const [state, setState] = useState<"idle" | "pending" | "saved" | "invalid">(
    "idle",
  );
  const inputId = useId();
  const statusId = useId();
  const save = async () => {
    if (state === "pending") return;
    if (!name.trim()) {
      setState("invalid");
      return;
    }
    setState("pending");
    await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    setSavedName(name.trim());
    setState("saved");
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Current project: {savedName}
      </p>
      <KiraDialog
        trigger={<Button>Edit project</Button>}
        title="Edit project"
        description="Save a project name locally for this demo. Use Alert Dialog for irreversible confirmations."
        rootProps={{
          onOpenChange: (next, details) => {
            if (!next && state === "pending") details.cancel();
            if (next) setState("idle");
          },
        }}
        contentProps={{ scrollable: true }}
        footer={
          <>
            <DialogClose
              disabled={state === "pending"}
              render={<Button variant="outline">Done</Button>}
            />
            <Button
              disabled={state === "pending"}
              focusableWhenDisabled
              className="aria-disabled:opacity-50"
              aria-busy={state === "pending"}
              aria-describedby={statusId}
              onClick={save}
            >
              {state === "pending" ? "Saving..." : "Save project"}
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor={inputId}>Project name</Label>
          <Input
            id={inputId}
            value={name}
            disabled={state === "pending"}
            aria-invalid={state === "invalid"}
            aria-describedby={statusId}
            onChange={(event) => {
              setName(event.target.value);
              setState("idle");
            }}
          />
          <p
            id={statusId}
            role="status"
            className={
              state === "invalid"
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {state === "invalid"
              ? "Enter a project name, then save again."
              : state === "saved"
                ? "Project saved."
                : state === "pending"
                  ? "Saving your project."
                  : "Your changes stay in this demo."}
          </p>
        </div>
      </KiraDialog>
    </div>
  );
}`;

function CustomDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      <Dialog>
        <DialogTrigger render={<Button>Open Complex Form</Button>} />
        <DialogContent size="full">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Fill out the form below to schedule a new meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid gap-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label>Meeting Title</Label>
                <Input placeholder="e.g. Q4 Planning" />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <DatePicker placeholder="Pick a date" />
              </div>

              <div className="space-y-2">
                <Label>Participants</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice Johnson</SelectItem>
                    <SelectItem value="bob">Bob Smith</SelectItem>
                    <SelectItem value="charlie">Charlie Brown</SelectItem>
                    <SelectItem value="diana">Diana Prince</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Meeting agenda..." className="h-32" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">No Close Button</Button>}
        />
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Important Notice</DialogTitle>
            <DialogDescription>
              This dialog has no X button. Use the cancel button to close.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const customCode = `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      <Dialog>
        <DialogTrigger render={<Button>Open Complex Form</Button>} />
        <DialogContent size="full">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Fill out the form below to schedule a new meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid gap-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label>Meeting Title</Label>
                <Input placeholder="e.g. Q4 Planning" />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <DatePicker placeholder="Pick a date" />
              </div>

              <div className="space-y-2">
                <Label>Participants</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice Johnson</SelectItem>
                    <SelectItem value="bob">Bob Smith</SelectItem>
                    <SelectItem value="charlie">Charlie Brown</SelectItem>
                    <SelectItem value="diana">Diana Prince</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Meeting agenda..." className="h-32" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">No Close Button</Button>}
        />
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Important Notice</DialogTitle>
            <DialogDescription>
              This dialog has no X button. Use the cancel button to close.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}`;

// =============================================================================
// Usage Code
// =============================================================================

const usageCode = `import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogPortal, DialogOverlay, KiraDialog, dialogContentVariants } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ProjectDetails() {
  return <Dialog>
    <DialogTrigger render={<Button>Project details</Button>} />
    <DialogContent scrollable>
      <DialogHeader><DialogTitle>Customer research</DialogTitle><DialogDescription>Review project access.</DialogDescription></DialogHeader>
      <DialogBody><p>No collaborators yet. Invite someone to get started.</p></DialogBody>
      <DialogFooter><DialogClose render={<Button>Done</Button>} /></DialogFooter>
    </DialogContent>
  </Dialog>
}

export function QuickDetails() {
  return <KiraDialog trigger={<Button>Share project</Button>} title="Share project"
    description="Choose who can access this project."
    footer={<DialogClose render={<Button>Done</Button>} />}>
    <p>No collaborators yet.</p>
  </KiraDialog>
}

export function CustomPopup() {
  return <Dialog><DialogTrigger render={<Button>Custom details</Button>} />
    <DialogPortal><DialogOverlay />
      <DialogPrimitive.Viewport className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Popup className={dialogContentVariants({ size: "sm" })}>
          <DialogTitle>Project details</DialogTitle><DialogDescription>No collaborators yet.</DialogDescription>
          <DialogClose render={<Button>Done</Button>} />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  </Dialog>
}`;

// =============================================================================
// API Reference Data
// =============================================================================

const apiSections = [
  {
    title: "dialogContentVariants",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Shared popup classes for Dialog and Alert Dialog.",
      },
    ],
  },
  {
    title: "DialogBody",
    props: [
      {
        prop: "className",
        type: "string",
        description:
          "Scrollable body; pair with DialogContent scrollable to keep header and footer visible.",
      },
    ],
  },
  {
    title: "KiraDialog",
    props: [
      {
        prop: "trigger",
        type: "ReactElement",
        description: "Element rendered as the trigger.",
      },
      {
        prop: "title",
        type: "ReactNode",
        description: "Accessible dialog title.",
      },
      {
        prop: "description",
        type: "ReactNode",
        description: "Optional dialog description.",
      },
      { prop: "children", type: "ReactNode", description: "Dialog body." },
      { prop: "footer", type: "ReactNode", description: "Optional actions." },
      {
        prop: "rootProps",
        type: "Omit<DialogPrimitive.Root.Props, 'children'>",
        description: "Root state and modality.",
      },
      {
        prop: "contentProps",
        type: "Omit<DialogContentProps, 'children'>",
        description: "Popup and portal options.",
      },
    ],
  },
  {
    title: "DialogPortal",
    props: [
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description: "Keep the portal mounted while closed.",
      },
      {
        prop: "container",
        type: "HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null",
        description: "Portal destination.",
      },
    ],
  },
  {
    title: "DialogOverlay",
    props: [
      {
        prop: "className",
        type: "string | ((state: DialogBackdrop.State) => string | undefined)",
        description: "Backdrop styling.",
      },
    ],
  },
  {
    title: "Dialog",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the dialog.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, details: DialogPrimitive.Root.ChangeEventDetails) => void",
        description: "Callback when the open state changes.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state for uncontrolled usage.",
      },
      {
        prop: "modal",
        type: 'boolean | "trap-focus"',
        default: "true",
        description:
          "Whether the dialog is modal (blocks interaction with rest of page). Non-modal (false) stays open on outside presses and focus-out; close via Esc, Dialog.Close or form submit.",
      },
      {
        prop: "disablePointerDismissal",
        type: "boolean",
        default: "true when modal={false}, else Base UI default (false)",
        description:
          "Prevent outside-press dismissal. Kira bakes it into the non-modal default; pass false explicitly to close on outside clicks.",
      },
    ],
  },
  {
    title: "DialogTrigger",
    props: [
      {
        prop: "render",
        type: "ReactElement",
        description: "The element to render as the trigger button.",
      },
    ],
  },
  {
    title: "DialogContent",
    props: [
      {
        prop: "scrollable",
        type: "boolean",
        default: "false",
        description:
          "Keep the header and footer visible while DialogBody scrolls.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Size variant of the dialog.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Whether to show the X close button in the corner.",
      },
      {
        prop: "portalProps",
        type: "DialogPortal.Props",
        description:
          "Configure the internal portal, including keepMounted and container.",
      },
      {
        prop: "className",
        type: "DialogPrimitive.Popup.Props['className']",
        description: "Additional CSS classes for the content container.",
      },
    ],
  },
  {
    title: "DialogHeader",
    props: [
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for the header container.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description:
          "Header content, typically DialogTitle and DialogDescription.",
      },
    ],
  },
  {
    title: "DialogTitle",
    props: [
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for the title.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "The title text content.",
      },
    ],
  },
  {
    title: "DialogDescription",
    props: [
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for the description.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "The description text content.",
      },
    ],
  },
  {
    title: "DialogFooter",
    props: [
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for the footer container.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Footer content, typically action buttons.",
      },
    ],
  },
  {
    title: "DialogClose",
    props: [
      {
        prop: "render",
        type: "ReactElement",
        description: "The element to render as the close button.",
      },
    ],
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function DialogPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "WAI-ARIA compliant with proper focus management, keyboard navigation, and screen reader announcements.",
    },
    {
      title: "Animated",
      description:
        "Smooth enter/exit animations with backdrop blur and scale transitions. Respects prefers-reduced-motion.",
    },
    {
      title: "Composable",
      description:
        "Flexible composition with separate Header, Footer, Title, Description, and Close components.",
    },
  ];

  const shortcuts = [
    { keys: "Esc", description: "Close the dialog (inherited from Base UI)" },
    {
      keys: "Tab",
      description:
        "Navigate between focusable elements (inherited from Base UI)",
    },
    {
      keys: "Shift + Tab",
      description: "Navigate backwards (inherited from Base UI)",
    },
    {
      keys: "Enter / Space",
      description: "Activate the focused button (inherited from Base UI)",
    },
  ];

  const demoTabs = [
    {
      value: "nonmodal",
      label: "Non-modal",
      demo: (
        <DemoWrapper
          title="Keep the page interactive"
          description="Non-modal dialogs stay open while you work with the page. Outside clicks don't dismiss them; close with Esc or the ✕ button."
          code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog modal={false}>
  <DialogTrigger render={<Button variant="outline">Details</Button>} />
  <DialogContent className="max-w-sm">
    <DialogHeader>
      <DialogTitle>Details</DialogTitle>
      <DialogDescription>
        Stays open while you use the page. Close with Esc or ✕.
      </DialogDescription>
    </DialogHeader>
    {/* Non-modal defaults to top-right placement so the page stays visible. */}
  </DialogContent>
</Dialog>`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Dialog modal={false}>
                <DialogTrigger
                  render={<Button variant="outline">Open details</Button>}
                />
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Details</DialogTitle>
                    <DialogDescription>
                      Stays open while you use the page. Close with Esc or ✕.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground">
                    Click the button below — the dialog keeps its state.
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={(event) => {
                  const b = event.currentTarget;
                  b.textContent = `Clicked ${Number(b.dataset.count ?? 0) + 1}×`;
                  b.dataset.count = String(Number(b.dataset.count ?? 0) + 1);
                }}
              >
                Outside action
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Explicitly re-enabling outside-press dismissal (stock Base UI
              behavior) is a one-prop override:
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                {"<Dialog modal={false} disablePointerDismissal={false}>"}
              </code>
            </p>
          </div>
        </DemoWrapper>
      ),
    },
    {
      value: "kira",
      label: "Kira & states",
      demo: (
        <DemoWrapper
          title="Share a project"
          description="A concise task dialog with an empty state and a long project name."
          code={`import { KiraDialog, DialogClose } from "@/components/ui/dialog"\nimport { Button } from "@/components/ui/button"\n\n<KiraDialog trigger={<Button>Share project</Button>} title="Share project" description="Choose who can access this project." footer={<DialogClose render={<Button>Done</Button>} />}><p>No collaborators yet.</p></KiraDialog>`}
        >
          <div className="w-full max-w-80">
            <KiraDialog
              trigger={<Button>Share project</Button>}
              title="Share the quarterly customer research project"
              description="Choose who can access this project."
              footer={<DialogClose render={<Button>Done</Button>} />}
            >
              <p>No collaborators yet. Invite someone to get started.</p>
            </KiraDialog>
          </div>
        </DemoWrapper>
      ),
    },
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Dialog"
          description="A simple dialog with title, description, and action buttons."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Dialogs come in sm, default, lg, xl, and full-screen sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "form",
      label: "Form",
      demo: (
        <DemoWrapper
          title="Form Dialog"
          description="Dialog containing a form with input fields and validation."
          code={formCode}
        >
          <FormDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "scrollable",
      label: "Scrollable",
      demo: (
        <DemoWrapper
          title="Scrollable Content"
          description="Dialog with scrollable content area for long text or lists."
          code={scrollableCode}
        >
          <ScrollableDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "save",
      label: "Save workflow",
      demo: (
        <DemoWrapper
          title="Save a project"
          description="An editable task with validation, pending, and saved states. Irreversible confirmations live in Alert Dialog."
          code={saveCode}
        >
          <SaveDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "custom",
      label: "Custom",
      demo: (
        <DemoWrapper
          title="Custom Styling"
          description="Full-screen dialogs with nested popovers and custom configurations."
          code={customCode}
        >
          <CustomDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Dialog"
        version="2.3.0"
        description="A focused workspace for forms, details, and editable tasks."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={shortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and compose dialog components for your use case."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for all dialog components."
      />
      <Changelog entries={dialogPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const dialogPageChangelogEntries = [
  {
    version: "2.3.0",
    date: "5 November 2026",
    changes: [
      {
        type: "added",
        title: "Scrollable tasks and a save workflow",
        description:
          "DialogBody and DialogContent scrollable keep actions reachable on short screens. Replaced the misleading Alert example with editable, invalid, pending and saved states. Audited on Base UI 1.9.0.",
      },
      {
        type: "breaking",
        title: "KiraDialog body wrapper",
        description:
          "KiraDialog now wraps its children in data-slot=dialog-body. Update direct-child CSS selectors if used.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "4 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Non-modal dialogs stay open",
        description:
          "modal={false} now bakes disablePointerDismissal (Base UI 1.9 recipe) so outside presses and focus-out no longer close the dialog — Esc, Dialog.Close and submit still do. Pass disablePointerDismissal={false} to restore stock dismissal. Breaking: non-modal dialogs render top-right (viewport alignment + shadow-md + softer scale motion) instead of floating centered; consumers relying on centered non-modal presentation should pass className or re-center via portalProps.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "4 November 2026",
    changes: [
      {
        type: "added",
        title: "KiraDialog",
        description:
          "Compose a scoped task dialog with Base UI 1.9.0 root and popup options.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "4 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Responsive dialog",
        description:
          "Audited against Base UI 1.9.0; content now uses a padded viewport-relative layout instead of fixed centering. Breaking: CSS targeting the former fixed DialogContent positioning may need updating. Focus visibility, state-based className and portal configuration are preserved.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function SaveControlsSection({
  state,
  setState,
  statusId,
  save,
  inputId,
  name,
  setName,
  resolveValue1,
}: {
  state: "idle" | "pending" | "saved" | "invalid";
  setState: React.Dispatch<
    React.SetStateAction<"idle" | "pending" | "saved" | "invalid">
  >;
  statusId: string;
  save: () => Promise<void>;
  inputId: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  resolveValue1: () =>
    | "Enter a project name, then save again."
    | "Project saved."
    | "Saving your project."
    | "Your changes stay in this demo.";
}) {
  return (
    <KiraDialog
      trigger={<Button>Edit project</Button>}
      title="Edit project"
      description="Save a project name locally for this demo. Use Alert Dialog for irreversible confirmations."
      rootProps={{
        onOpenChange: (next, details) => {
          if (!next && state === "pending") details.cancel();

          if (next) setState("idle");
        },
      }}
      contentProps={{ scrollable: true }}
      footer={
        <SaveDialogFooter state={state} statusId={statusId} save={save} />
      }
    >
      <div className="space-y-2">
        <Label htmlFor={inputId}>Project name</Label>
        <Input
          id={inputId}
          value={name}
          disabled={state === "pending"}
          aria-invalid={state === "invalid"}
          aria-describedby={statusId}
          onChange={(event) => {
            setName(event.target.value);
            setState("idle");
          }}
        />
        <output
          id={statusId}

          className={`block ${
            state === "invalid"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }`}
        >
          {resolveValue1()}
        </output>
      </div>
    </KiraDialog>
  );
}

function SaveDialogFooter({ state, statusId, save }: SaveDialogFooterProps) {
  return (
    <>
      <>
        <DialogClose
          disabled={state === "pending"}
          render={<Button variant="outline">Done</Button>}
        />
        <Button
          disabled={state === "pending"}
          focusableWhenDisabled
          className="aria-disabled:opacity-50"
          aria-busy={state === "pending"}
          aria-describedby={statusId}
          onClick={save}
        >
          {state === "pending" ? "Saving..." : "Save project"}
        </Button>
      </>
    </>
  );
}

interface SaveDialogFooterProps {
  state: "idle" | "pending" | "saved" | "invalid";
  statusId: string;
  save: () => Promise<void>;
}
