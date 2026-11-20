import type { ComponentProps as ReactComponentProps } from "react";
import { useRef, useState } from "react";
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
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

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

function PromiseDemo() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(simulateAsync(), {
              loading: "Creating event...",
              success: (data) => `${data.name} has been created`,
              // SAFETY: simulateAsync rejects with `new Error(...)` only —
              // the rejection value is always an Error instance.
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
              duration: 10_000,
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
        Toasts stack collapsed at the bottom-right (max 3 visible, older ones
        peek behind the frontmost). Hover the stack to expand it — timers pause
        while expanded. Swipe in any direction (or press Esc on a focused toast)
        to dismiss.
      </p>
    </div>
  );
}

const stackingCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

// Collapsed stack at the bottom-right (limit=3 by default).
// Hover to expand (timers pause); swipe any direction to dismiss;
// Esc closes the focused toast.
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
        default: "varies by variant",
        description:
          "Duration in ms before auto-dismiss. Use Infinity for persistent, 0 to disable. Defaults per variant via DURATION (default 5000, success 4000, error 8000, warning 6000, info 5000, loading 0)",
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
      {
        prop: "position",
        type: '{ anchor: HTMLElement | null; align?: "start" | "center" | "end"; side?: "top" | "bottom" | "left" | "right"; sideOffset?: number }',
        default: "sideOffset: 8",
        description:
          "Anchor the toast to an element (renders through the dedicated anchored toaster). A null anchor falls back to the bottom-right viewport stack",
      },
      {
        prop: "onClose",
        type: "() => void",
        description:
          "Called when the toast is closed (swipe, Esc, action, or timeout)",
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
        prop: "toast.update()",
        type: "(id, { title?, description?, variant?, duration?, icon?, action? }) => void",
        description:
          "Update a toast in place. Variant change swaps type, timeout, and icon; unspecified fields keep their current values",
      },
      {
        prop: "toast.dismiss()",
        type: "(id?) => void",
        description: "Dismiss a specific toast or all toasts if no ID",
      },
    ],
  },
  {
    title: "Provider & Components",
    props: [
      {
        prop: "KiraToastProvider",
        type: "{ children, timeout?, limit? }",
        default: "timeout: 5000, limit: 3",
        description:
          "Mount once around the app. timeout is the default auto-dismiss (0 disables); limit caps simultaneously visible toasts — excess toasts fade with data-limited",
      },
      {
        prop: "KiraToaster",
        type: "() => ReactNode",
        description:
          "Renders the stacked viewport. Mounted automatically inside KiraToastProvider; bottom-right fixed, max-w-sm (full-width inset on mobile)",
      },
      {
        prop: "KiraAnchoredToaster",
        type: "() => ReactNode",
        description:
          "Renders element-anchored toasts through Toast.Positioner. Mounted automatically inside KiraToastProvider alongside KiraToaster",
      },
      {
        prop: "useToast()",
        type: "() => ToastManager",
        description:
          "Hook returning the manager (add, close, update, promise, subscribe, toasts) for in-component custom rendering",
      },
      {
        prop: "DURATION",
        type: "Record<ToastType, number>",
        description:
          "Default auto-dismiss timeouts per variant. Exported for callers that mirror kit timings",
      },
    ],
  },
];

function ProgressDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={() => toast.success("Saved")}>
          Success (4s)
        </Button>
        <Button variant="outline" onClick={() => toast.info("Heads up")}>
          Info (5s)
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Review needed", { duration: 10_000 })}
        >
          Warning (10s)
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.loading("Long-running task")}
        >
          Loading (no timer)
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Each toast shows a countdown bar for its remaining time. Hover the toast
        — the bar freezes while the auto-dismiss timer is paused. Loading toasts
        have no timer, so no bar.
      </p>
    </div>
  );
}

const progressCode = `import { toast } from "@/components/ui/toast"

// A countdown bar shows the remaining time; it pauses on hover/focus
// together with the timer. Hidden under prefers-reduced-motion.
toast.success("Saved")                        // 4s
toast.info("Heads up")                        // 5s
toast.warning("Review needed", { duration: 10000 })
toast.loading("Long-running task")            // no timer, no bar`;

function AnchoredDemo() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText("kira-kit");
    setCopied(true);
    toast.success("Copied to clipboard", {
      duration: 1500,
      position: { anchor: buttonRef.current, side: "top", align: "center" },
    });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          ref={buttonRef}
          variant="outline"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? "Copied" : "Copy install command"}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info("Saved locally", {
              duration: 2500,
              position: {
                anchor: buttonRef.current,
                side: "bottom",
                align: "start",
              },
            })
          }
        >
          Anchor below (side: bottom)
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Toasts can anchor to a trigger element — ideal for transient feedback
        like a "Copied" confirmation next to the button. Null anchors fall back
        to the bottom-right viewport.
      </p>
    </div>
  );
}

const anchoredCode = `import { useRef } from "react"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function AnchoredToastDemo() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText("kira-kit")
    toast.success("Copied to clipboard", {
      duration: 1500,
      position: { anchor: buttonRef.current, side: "top", align: "center" },
    })
  }

  return (
    <Button ref={buttonRef} variant="outline" onClick={handleCopy}>
      Copy install command
    </Button>
  )
}`;

function UpdateDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => {
            const id = toast.loading("Uploading file…");
            setTimeout(() => {
              toast.update(id, {
                title: "File uploaded",
                variant: "success",
              });
            }, 2000);
          }}
        >
          Loading → Success (2s)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const id = toast.loading("Starting deployment…");
            setTimeout(() => {
              toast.update(id, {
                title: "Deployment failed",
                description: "Check the build logs for details.",
                variant: "error",
                action: {
                  label: "View logs",
                  onClick: () => toast.info("Opening logs…"),
                },
              });
            }, 2000);
          }}
        >
          Loading → Error + Action
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const id = toast("Step 1 of 3: preparing…");
            let step = 1;

            const interval = setInterval(() => {
              step += 1;

              if (step > 3) {
                clearInterval(interval);
                toast.update(id, {
                  title: "All steps complete",
                  variant: "success",
                });
              } else {
                toast.update(id, { title: `Step ${step} of 3: working…` });
              }
            }, 1200);
          }}
        >
          Multi-step progress
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        toast.update() rewrites a toast in place — the stack position is kept,
        only content and variant change. Variant changes swap icon, colors, and
        timeout.
      </p>
    </div>
  );
}

const updateCode = `import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

<Button
  onClick={() => {
    const id = toast.loading("Uploading file…")
    setTimeout(() => {
      toast.update(id, { title: "File uploaded", variant: "success" })
    }, 2000)
  }}
>
  Loading → Success
</Button>

// Partial updates keep unspecified fields (description, action, icon):
toast.update(id, { title: "Step 2 of 3: working…" })`;

const features = [
  {
    title: "Accessible",
    description:
      "WCAG 2.2 AA compliant with proper ARIA live regions. Success/Info use polite, Error/Warning use assertive announcements. F6 jumps into the viewport landmark.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Collapsed Stack & Swipe",
    description:
      "Toasts stack collapsed at the bottom-right (max 3), expand on hover with paused timers, and swipe-to-dismiss in any direction.",
    icon: <IconLayoutGrid className="h-4 w-4" />,
  },
  {
    title: "Anchored, Progress & Update",
    description:
      "Anchor toasts to trigger elements, countdown progress bars that pause on hover, and update-in-place with variant morphing.",
    icon: <IconClick className="h-4 w-4" />,
  },
];

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
        description="Toasts stack collapsed at the bottom-right; hover to expand and pause, swipe any direction to dismiss."
        code={stackingCode}
      >
        <StackingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "progress",
    label: "Progress",
    demo: (
      <DemoWrapper
        title="Timeout Progress Bar"
        description="Each timed toast shows a countdown bar that pauses with the timer on hover/focus."
        code={progressCode}
      >
        <ProgressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "anchored",
    label: "Anchored",
    demo: (
      <DemoWrapper
        title="Anchored Toasts"
        description="Pin transient feedback to a trigger element via the position option."
        code={anchoredCode}
      >
        <AnchoredDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "update",
    label: "Update in Place",
    demo: (
      <DemoWrapper
        title="toast.update()"
        description="Rewrite a toast's title, description, variant, and action without re-stacking."
        code={updateCode}
      >
        <UpdateDemo />
      </DemoWrapper>
    ),
  },
];

export default function ToastPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Toast"
        version="v2.1.0"
        description="A succinct message displayed temporarily. Built on Base UI Toast with a collapsed bottom-right stack, swipe-to-dismiss, anchored positioning, progress bars, and WCAG 2.2 AA accessibility."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        title="Keyboard & Pointer Interactions"
        description="Provided by the Base UI Toast primitive. Action and close buttons are normal tab stops; toasts are announced via ARIA live regions."
        shortcuts={toastPageKeyboardShortcutsShortcuts}
      />

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

      <Changelog entries={toastPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const toastPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move focus through toast controls (action, close) in DOM order",
  },
  {
    keys: "F6",
    description: "Jump focus into the toast viewport landmark (and back out)",
  },
  {
    keys: "Esc",
    description: "Close the focused toast",
  },
  {
    keys: "Hover / Focus",
    description:
      "Expands the stack and pauses all auto-dismiss timers (progress bar freezes)",
  },
  {
    keys: "Swipe",
    description:
      "Pointer gesture — swipe up, down, left, or right to dismiss a toast",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const toastPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "22 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Bottom-right collapsed stack",
        description:
          "The viewport moves from a flat top-right column to a bottom-right collapsed stack (Base UI 1.9 parity): older toasts peek behind the frontmost, the stack fans out on hover with paused timers, and z-order is index-driven. Apps relying on top-right placement need a code change.",
      },
      {
        type: "breaking",
        title: "toast.update() passes through variant, timeout, and data",
        description:
          "update() now accepts variant/icon/duration and rewrites type, timeout, and data on the manager object (previously dropped). Unknown options fail tsc instead of silently purging.",
      },
      {
        type: "added",
        title: "Anchored toasts",
        description:
          "toast() gains position: { anchor, align, side, sideOffset }, rendering through a dedicated anchored toaster (separate Toast.Provider/Positioner path) for element-anchored feedback like the copy-to-clipboard pattern. Null anchors fall back to the stacked viewport; toast.dismiss() closes in both viewports.",
      },
      {
        type: "added",
        title: "Timeout progress bar",
        description:
          "Timed toasts render a 2px countdown bar at the bottom edge, animated per the toast's timeout. It pauses on hover/focus with the timers and hides under prefers-reduced-motion. @keyframes toast-progress and the --animate-toast-progress token added to index.css.",
      },
      {
        type: "added",
        title: "Update-in-place variant morphing",
        description:
          "toast.update(id, { variant }) swaps icon, colors, and timeout without re-stacking. See the Update in Place tab.",
      },
      {
        type: "fixed",
        title: "transition-all removed",
        description:
          "Toast transitions are limited to transform/opacity/height (transition-[transform,opacity,height]) with data-swiping disabling transitions entirely — layout properties no longer animate.",
      },
      {
        type: "fixed",
        title: "4-way swipe",
        description:
          "swipeDirection extended from [down, right] to all four directions with direction-aware exit transforms.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const simulateAsync = () =>
  new Promise<{ name: string }>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) resolve({ name: "Event" });
      else reject(new Error("Network error"));
    }, 2000);
  });
