import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ToastPage() {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  // Simulate async operation for promise demo
  const simulateAsync = () =>
    new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3
          ? resolve({ name: "Event" })
          : reject(new Error("Network error"));
      }, 2000);
    });

  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Toast</h1>
        <p className="text-lg text-muted-foreground">
          A succinct message that is displayed temporarily. Built using Sonner
          with enhanced accessibility (WCAG 2.2 AA compliant).
        </p>
      </div>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Usage
        </h2>
        <p className="text-sm text-muted-foreground">
          Call the <code className="bg-muted px-1 rounded">toast</code> function
          to display a notification. Each type uses appropriate ARIA live
          regions.
        </p>
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
            onClick={() => toast.info("New message received")}
          >
            Info
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
            onClick={() => toast.error("Event has not been created")}
          >
            Error
          </Button>
        </div>
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <strong>Accessibility:</strong> Success/Info use{" "}
          <code>aria-live="polite"</code>, Error/Warning use{" "}
          <code>aria-live="assertive"</code> for screen reader announcements.
        </div>
      </section>

      {/* With Description */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Description
        </h2>
        <div className="flex flex-wrap gap-4">
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
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Payment successful", {
                description: "Your order #12345 has been confirmed.",
              })
            }
          >
            Success with Description
          </Button>
        </div>
      </section>

      {/* With Action */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Action
        </h2>
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
        </div>
      </section>

      {/* Promise-based Toast */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Promise-based Toast
        </h2>
        <p className="text-sm text-muted-foreground">
          Automatically shows loading, success, or error states based on promise
          resolution.
        </p>
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
      </section>

      {/* Loading Toast with Manual Control */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading Toast (Manual Control)
        </h2>
        <p className="text-sm text-muted-foreground">
          Control toast lifecycle programmatically using IDs.
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
      </section>

      {/* Duration Control */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Duration Control
        </h2>
        <p className="text-sm text-muted-foreground">
          Default durations: Info 5s, Success 4s, Warning 6s, Error 8s. Override
          with <code>duration</code> prop.
        </p>
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
      </section>

      {/* Positions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Positions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => toast("Top Right", { position: "top-right" })}
          >
            Top Right
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Top Center", { position: "top-center" })}
          >
            Top Center
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Top Left", { position: "top-left" })}
          >
            Top Left
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Bottom Right", { position: "bottom-right" })}
          >
            Bottom Right
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Bottom Center", { position: "bottom-center" })
            }
          >
            Bottom Center
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Bottom Left", { position: "bottom-left" })}
          >
            Bottom Left
          </Button>
        </div>
      </section>

      {/* Custom Toast */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Toast
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() =>
              toast.custom((id) => (
                <div className="flex items-center gap-3 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4 shadow-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl">🎉</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Congratulations!</p>
                    <p className="text-sm text-muted-foreground">
                      You've unlocked a new achievement.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.dismiss(id)}
                  >
                    Dismiss
                  </Button>
                </div>
              ))
            }
          >
            Custom Toast
          </Button>
        </div>
      </section>

      {/* Dismiss All */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Dismiss All
        </h2>
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
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { toast } from "@/components/ui/toast"

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

// Promise-based
toast.promise(saveData(), {
  loading: "Saving...",
  success: (data) => \`Saved \${data.name}\`,
  error: (err) => \`Error: \${err.message}\`
})

// Programmatic control
const id = toast.loading("Processing...")
// Later...
toast.dismiss(id)
toast.success("Done!")`}
          </pre>
        </div>
      </section>
    </div>
  );
}
