import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
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

const basicCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function BasicDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
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
  )
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

const sizesCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DialogSizesDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
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
              <DialogTitle className="capitalize">{size} Dialog</DialogTitle>
              <DialogDescription>
                This is a dialog with size="{size}".
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
  )
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

const formCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormDialogDemo() {
  return (
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
  )
}`;

function ScrollableDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Open Scrollable Dialog</Button>}
        />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Please read and accept our terms of service.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Decline</Button>} />
            <Button>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const scrollableCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ScrollableDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Scrollable Dialog</Button>} />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read and accept our terms of service.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Decline</Button>} />
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`;

function AlertDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger
          render={<Button variant="destructive">Delete Account</Button>}
        />
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="destructive">Yes, delete my account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const alertCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete Account</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Yes, delete my account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
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

const customCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CustomDialogDemo() {
  return (
    <>
      {/* Full-screen dialog with complex form */}
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog without close button */}
      <Dialog>
        <DialogTrigger render={<Button variant="outline">No Close Button</Button>} />
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
    </>
  )
}`;

// =============================================================================
// Usage Code
// =============================================================================

const usageCode = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger render={<Button>Open</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Your content here */}
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

// =============================================================================
// API Reference Data
// =============================================================================

const apiSections = [
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
        type: "(open: boolean) => void",
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
        type: "boolean",
        default: "true",
        description:
          "Whether the dialog is modal (blocks interaction with rest of page).",
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
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto child element instead of wrapping.",
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
        description: "Size variant of the dialog.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Whether to show the X close button in the corner.",
      },
      {
        prop: "className",
        type: "string",
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
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto child element instead of wrapping.",
      },
    ],
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

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
    { keys: "Esc", description: "Close the dialog" },
    { keys: "Tab", description: "Navigate between focusable elements" },
    { keys: "Shift + Tab", description: "Navigate backwards" },
    { keys: "Enter / Space", description: "Activate focused button" },
  ];

  const demoTabs = [
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
      value: "alert",
      label: "Alert",
      demo: (
        <DemoWrapper
          title="Alert Dialog"
          description="Confirmation dialog for destructive actions without close button."
          code={alertCode}
        >
          <AlertDemo />
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
        version="v1.0"
        description="A modal dialog that interrupts the user with important content and expects a response."
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
    </ComponentPage>
  );
}
