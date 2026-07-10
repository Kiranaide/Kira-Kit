import { useState } from "react";
import { IconAccessible, IconLayoutGrid, IconClick } from "@tabler/icons-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

// =============================================================================
// Demo: Basic Toast
// =============================================================================
function BasicDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" onClick={() => toast("Event has been created")}>
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.message("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
          })
        }
      >
        With Description
      </Button>
    </div>
  );
}

const basicCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function BasicToastDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        variant="outline" 
        onClick={() => toast("Event has been created")}
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.message("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
          })
        }
      >
        With Description
      </Button>
    </div>
  )
}`;

// =============================================================================
// Demo: Variants
// =============================================================================
function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => toast("Event has been created")}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Event has been created")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Event has not been created")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("Event start time cannot be in the past")
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("New message received")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.loading("Processing your request...")}
        >
          Loading
        </Button>
      </div>
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
        <strong>Accessibility:</strong> Success/Info use{" "}
        <code>aria-live="polite"</code>, Error/Warning use{" "}
        <code>aria-live="assertive"</code> for screen reader announcements.
      </div>
    </div>
  );
}

const variantsCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function ToastVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        onClick={() => toast("Event has been created")}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Event has been created")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Event has not been created")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Event start time cannot be in the past")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("New message received")}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.loading("Processing your request...")}
      >
        Loading
      </Button>
    </div>
  )
}`;

// =============================================================================
// Demo: Actions
// =============================================================================
function ActionsDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been deleted", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Event restored"),
            },
          })
        }
      >
        With Undo Action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Failed to save changes", {
            action: {
              label: "Retry",
              onClick: () => toast.loading("Retrying..."),
            },
          })
        }
      >
        Error with Retry
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Payment successful", {
            description: "Your order #12345 has been confirmed.",
            action: {
              label: "View Order",
              onClick: () => toast.info("Navigating to order..."),
            },
          })
        }
      >
        Success with Action
      </Button>
    </div>
  );
}

const actionsCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function ToastActionsDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been deleted", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Event restored"),
            },
          })
        }
      >
        With Undo Action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Failed to save changes", {
            action: {
              label: "Retry",
              onClick: () => toast.loading("Retrying..."),
            },
          })
        }
      >
        Error with Retry
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Payment successful", {
            description: "Your order #12345 has been confirmed.",
            action: {
              label: "View Order",
              onClick: () => toast.info("Navigating to order..."),
            },
          })
        }
      >
        Success with Action
      </Button>
    </div>
  )
}`;

// =============================================================================
// Demo: Promise
// =============================================================================
function PromiseDemo() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const simulateAsync = () =>
    new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3
          ? resolve({ name: "Event" })
          : reject(new Error("Network error"));
      }, 2000);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(simulateAsync(), {
              loading: "Creating event...",
              success: (data) => `${data.name} has been created`,
              error: (err) => `Failed: ${(err as Error).message}`,
            })
          }
        >
          Promise Toast (70% success rate)
        </Button>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          Control toast lifecycle programmatically using IDs:
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const id = toast.loading("Processing your request...");
              setLoadingId(id);

              setTimeout(() => {
                toast.dismiss(id);
                toast.success("Processing complete!");
                setLoadingId(null);
              }, 3000);
            }}
            disabled={loadingId !== null}
          >
            {loadingId ? "Processing..." : "Start Loading Toast"}
          </Button>
          {loadingId && (
            <Button
              variant="outline"
              onClick={() => {
                toast.dismiss(loadingId);
                toast.error("Operation cancelled");
                setLoadingId(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const promiseCode = `import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function ToastPromiseDemo() {
  const [loadingId, setLoadingId] = useState<string | number | null>(null)

  const simulateAsync = () =>
    new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3
          ? resolve({ name: "Event" })
          : reject(new Error("Network error"))
      }, 2000)
    })

  return (
    <div className="space-y-6">
      {/* Promise-based toast */}
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(simulateAsync(), {
            loading: "Creating event...",
            success: (data) => \`\${data.name} has been created\`,
            error: (err) => \`Failed: \${(err as Error).message}\`,
          })
        }
      >
        Promise Toast
      </Button>

      {/* Manual control with ID */}
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.loading("Processing your request...")
          setLoadingId(id)

          setTimeout(() => {
            toast.dismiss(id)
            toast.success("Processing complete!")
            setLoadingId(null)
          }, 3000)
        }}
        disabled={loadingId !== null}
      >
        {loadingId ? "Processing..." : "Start Loading Toast"}
      </Button>
    </div>
  )
}`;

// =============================================================================
// Demo: Dismiss
// =============================================================================
function DismissDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast("Quick notification", {
              duration: 2000,
            })
          }
        >
          2 second toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info("This will stay longer", {
              duration: 10000,
            })
          }
        >
          10 second toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("This won't auto-dismiss", {
              duration: Infinity,
            })
          }
        >
          Persistent toast
        </Button>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm text-muted-foreground mb-4">Dismiss control:</p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => {
              toast("Toast 1");
              toast("Toast 2");
              toast("Toast 3");
            }}
          >
            Show Multiple Toasts
          </Button>
          <Button variant="destructive" onClick={() => toast.dismiss()}>
            Dismiss All
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          Programmatic dismiss:
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const id = toast("This toast will be dismissed in 2 seconds");
              setTimeout(() => toast.dismiss(id), 2000);
            }}
          >
            Dismiss by ID
          </Button>
        </div>
      </div>
    </div>
  );
}

const dismissCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function ToastDismissDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {/* Duration control */}
        <Button
          variant="outline"
          onClick={() => toast("Quick notification", { duration: 2000 })}
        >
          2 second toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("This will stay longer", { duration: 10000 })}
        >
          10 second toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Persistent", { duration: Infinity })}
        >
          Persistent toast
        </Button>
      </div>

      {/* Dismiss all */}
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => {
            toast("Toast 1")
            toast("Toast 2")
            toast("Toast 3")
          }}
        >
          Show Multiple Toasts
        </Button>
        <Button variant="destructive" onClick={() => toast.dismiss()}>
          Dismiss All
        </Button>
      </div>

      {/* Dismiss by ID */}
      <Button
        variant="outline"
        onClick={() => {
          const id = toast("This toast will be dismissed in 2 seconds")
          setTimeout(() => toast.dismiss(id), 2000)
        }}
      >
        Dismiss by ID
      </Button>
    </div>
  )
}`;

// =============================================================================
// Demo: Stacking & Swipe
// =============================================================================
function StackingDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => {
            toast.success("File uploaded");
            toast.info("Processing…");
            toast("Almost done");
            toast.success("Complete");
          }}
        >
          Show a burst of toasts
        </Button>
        <Button variant="destructive" onClick={() => toast.dismiss()}>
          Dismiss All
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Toasts stack in the viewport (max 3 visible, older ones collapse). Hover
        to expand the stack, and swipe right or down to dismiss an individual
        toast.
      </p>
    </div>
  );
}

const stackingCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

// Base UI stacks toasts in a single viewport (limit=3 by default).
// Hover to expand; swipe right/down to dismiss.
<Button
  onClick={() => {
    toast.success("File uploaded")
    toast.info("Processing…")
    toast("Almost done")
    toast.success("Complete")
  }}
>
  Show a burst of toasts
</Button>`;

// =============================================================================
// Usage Code
// =============================================================================
const usageCode = `import { toast } from "@/components/ui/toast"

// Basic usage
toast("Hello world")
toast.success("Saved successfully")
toast.error("Something went wrong")
toast.warning("Please review your input")
toast.info("New update available")

// With description
toast.success("Payment processed", {
  description: "Order #12345 confirmed"
})

// With action
toast("File deleted", {
  action: { 
    label: "Undo", 
    onClick: () => restore() 
  }
})

// Duration control
toast("Quick notification", { duration: 2000 })
toast.info("Long notification", { duration: 10000 })
toast.warning("Persistent toast", { duration: Infinity })

// Dismiss control
toast.dismiss() // Dismiss all toasts
const id = toast.loading("Processing...")
toast.dismiss(id) // Dismiss specific toast

// Promise-based
toast.promise(saveData(), {
  loading: "Saving...",
  success: (data) => \`Saved \${data.name}\`,
  error: (err) => \`Error: \${err.message}\`
})`;

// =============================================================================
// API Reference Data
// =============================================================================
const apiSections = [
  {
    title: "toast()",
    props: [
      {
        prop: "message",
        type: "string | ReactNode",
        description: "The message content to display in the toast",
      },
      {
        prop: "options",
        type: "ToastOptions",
        description: "Optional configuration object",
      },
    ],
  },
  {
    title: "ToastOptions",
    props: [
      {
        prop: "description",
        type: "string | ReactNode",
        description: "Additional descriptive text below the main message",
      },
      {
        prop: "duration",
        type: "number",
        default: "4000",
        description:
          "Duration in ms before auto-dismiss. Use Infinity for persistent",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Override the default variant icon",
      },
      {
        prop: "action",
        type: "{ label: string; onClick: () => void }",
        description: "Action button configuration",
      },
    ],
  },
  {
    title: "Toast Methods",
    props: [
      {
        prop: "toast()",
        type: "(message, options?) => id",
        description: "Show a default toast",
      },
      {
        prop: "toast.success()",
        type: "(message, options?) => id",
        description: "Show a success toast with checkmark icon",
      },
      {
        prop: "toast.error()",
        type: "(message, options?) => id",
        description: "Show an error toast with X icon",
      },
      {
        prop: "toast.warning()",
        type: "(message, options?) => id",
        description: "Show a warning toast with alert icon",
      },
      {
        prop: "toast.info()",
        type: "(message, options?) => id",
        description: "Show an info toast with info icon",
      },
      {
        prop: "toast.loading()",
        type: "(message, options?) => id",
        description: "Show a loading toast with spinner",
      },
      {
        prop: "toast.promise()",
        type: "(promise, { loading, success, error }) => Promise",
        description: "Show toast states based on promise resolution",
      },
      {
        prop: "toast.dismiss()",
        type: "(id?) => void",
        description: "Dismiss a specific toast or all toasts if no ID",
      },
    ],
  },
];

// =============================================================================
// Features Data
// =============================================================================
const features = [
  {
    title: "Accessible",
    description:
      "WCAG 2.2 AA compliant with proper ARIA live regions. Success/Info use polite, Error/Warning use assertive announcements.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Stacking & Swipe",
    description:
      "Base UI viewport stacks toasts (max 3), expands on hover, and supports swipe-to-dismiss.",
    icon: <IconLayoutGrid className="h-4 w-4" />,
  },
  {
    title: "Rich Actions",
    description:
      "Action buttons, promise-based toasts, and programmatic control via IDs.",
    icon: <IconClick className="h-4 w-4" />,
  },
];

// =============================================================================
// Demo Tabs Configuration
// =============================================================================
const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Toast"
        description="Simple toast notifications with optional descriptions."
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
        title="Toast Variants"
        description="All available toast types with appropriate icons and ARIA semantics."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "actions",
    label: "Actions",
    demo: (
      <DemoWrapper
        title="Toast with Actions"
        description="Add action buttons for undo, retry, or custom interactions."
        code={actionsCode}
      >
        <ActionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dismiss",
    label: "Dismiss",
    demo: (
      <DemoWrapper
        title="Dismiss Control"
        description="Auto-dismiss duration, persistent toasts, and programmatic dismiss."
        code={dismissCode}
      >
        <DismissDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "promise",
    label: "Promise",
    demo: (
      <DemoWrapper
        title="Promise-based Toasts"
        description="Automatically show loading, success, or error states based on promise resolution."
        code={promiseCode}
      >
        <PromiseDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stacking",
    label: "Stacking & Swipe",
    demo: (
      <DemoWrapper
        title="Stacking & Swipe"
        description="Toasts stack in a single viewport; hover to expand, swipe to dismiss."
        code={stackingCode}
      >
        <StackingDemo />
      </DemoWrapper>
    ),
  },
];

// =============================================================================
// Main Page Component
// =============================================================================
export default function ToastPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Toast"
        version="v2.0"
        description="A succinct message displayed temporarily. Built on Base UI Toast with stacking, swipe-to-dismiss, and WCAG 2.2 AA accessibility."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import the toast function and call it to display notifications."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Complete API for the toast notification system."
      />
    </ComponentPage>
  );
}
