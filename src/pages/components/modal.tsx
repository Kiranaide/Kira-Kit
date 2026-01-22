import { useState } from "react"
import {
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
import { Textarea } from "@/components/ui/textarea"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

function BasicDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
            Modal content goes here. Modals are used to focus user attention on
            a specific task or information.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
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
        <p className="text-sm text-muted-foreground">
          Modal content goes here.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
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
              <DialogTitle className="capitalize">{size} Modal</DialogTitle>
              <DialogDescription>
                Modal with <code>size="{size}"</code>
              </DialogDescription>
            </DialogHeader>
            <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
              Content area
            </div>
            <DialogFooter>
              <DialogClose render={<Button>Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
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

export function ModalSizesDemo() {
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
              <DialogTitle className="capitalize">{size} Modal</DialogTitle>
            </DialogHeader>
            <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
              Content area
            </div>
            <DialogFooter>
              <DialogClose render={<Button>Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}`

function CenteredDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger render={<Button variant="outline">Open Centered Modal</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Centered Modal</DialogTitle>
            <DialogDescription>
              This modal is vertically and horizontally centered by default.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            The modal is automatically centered in the viewport using
            CSS transforms.
          </p>
          <DialogFooter>
            <DialogClose render={<Button>Close</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const centeredCode = `import {
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

export function CenteredModalDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Centered Modal</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Centered Modal</DialogTitle>
          <DialogDescription>
            This modal is vertically and horizontally centered by default.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          The modal is automatically centered in the viewport using CSS transforms.
        </p>
        <DialogFooter>
          <DialogClose render={<Button>Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`

function ControlledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
      <Button onClick={() => setOpen(true)}>Open Controlled Modal</Button>
      <p className="text-sm text-muted-foreground">
        Modal is currently: <code>{open ? "open" : "closed"}</code>
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Modal</DialogTitle>
            <DialogDescription>
              This modal's state is controlled by React state.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Use the <code>open</code> and <code>onOpenChange</code> props to
            control the modal's visibility programmatically.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const controlledCode = `import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ControlledModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Controlled Modal</Button>
      <p className="text-sm text-muted-foreground">
        Modal is currently: {open ? "open" : "closed"}
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Modal</DialogTitle>
            <DialogDescription>
              This modal's state is controlled by React state.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Use the open and onOpenChange props to control the modal's visibility.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}`

function ScrollableDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Dialog>
        <DialogTrigger render={<Button variant="outline">View Terms</Button>} />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept our terms to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <h4 className="font-medium text-sm">Section {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Decline</Button>} />
            <Button>Accept Terms</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
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

export function ScrollableModalDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">View Terms</Button>} />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-medium text-sm">Section {i + 1}</h4>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet...
              </p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Decline</Button>} />
          <Button>Accept Terms</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`

function DialogDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="My Awesome Project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your project..."
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
  )
}

const dialogCode = `import {
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
import { Textarea } from "@/components/ui/textarea"

export function DialogModalDemo() {
  return (
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
            <Label htmlFor="project-name">Project Name</Label>
            <Input id="project-name" placeholder="My Awesome Project" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description..."
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
  )
}`

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
</Dialog>`

const apiSections = [
  {
    title: "Dialog (Root)",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the modal.",
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
        description: "Whether the modal blocks interaction with the rest of the page.",
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
        description: "Size variant of the modal.",
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
        description: "Header content, typically DialogTitle and DialogDescription.",
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
]

export default function ModalPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "WAI-ARIA compliant with proper focus trap, keyboard navigation, and screen reader support.",
    },
    {
      title: "Responsive",
      description:
        "Multiple size variants from small popups to fullscreen modals, adapting to different screen sizes.",
    },
    {
      title: "Animated",
      description:
        "Smooth backdrop blur and scale animations with respect for prefers-reduced-motion.",
    },
  ]

  const shortcuts = [
    { keys: "Esc", description: "Close the modal" },
    { keys: "Tab", description: "Navigate between focusable elements" },
    { keys: "Shift + Tab", description: "Navigate backwards" },
    { keys: "Enter / Space", description: "Activate focused button" },
  ]

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Modal"
          description="A simple modal with title, description, and action buttons."
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
      demo: (
        <DemoWrapper
          title="Centered Modal"
          description="Modal content centered vertically and horizontally within the viewport."
          code={centeredCode}
        >
          <CenteredDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "controlled",
      label: "Controlled",
      demo: (
        <DemoWrapper
          title="Controlled State"
          description="Modal visibility controlled programmatically with React state."
          code={controlledCode}
        >
          <ControlledDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "scrollable",
      label: "Scrollable",
      demo: (
        <DemoWrapper
          title="Scrollable Content"
          description="Modal with scrollable content area for long text or lists."
          code={scrollableCode}
        >
          <ScrollableDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "dialog",
      label: "Dialog",
      demo: (
        <DemoWrapper
          title="Dialog Form"
          description="Modal styled as a dialog with header and footer, ideal for forms."
          code={dialogCode}
        >
          <DialogDemo />
        </DemoWrapper>
      ),
    },
  ]

  return (
    <ComponentPage>
      <PageHeader
        title="Modal"
        version="v1.0"
        description="A modal dialog that interrupts the user with important content and requires interaction."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={shortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and compose modal components for your use case."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for all modal components."
      />
    </ComponentPage>
  )
}
