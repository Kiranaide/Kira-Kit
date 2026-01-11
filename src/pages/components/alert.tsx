import { useState } from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertWithHeading,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ToastConfig = {
  id: string;
  variant: "info" | "success" | "warning" | "destructive";
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  title: string;
  description: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

function ToastDemo() {
  const [activeToasts, setActiveToasts] = useState<ToastConfig[]>([]);

  const showToast = (config: Omit<ToastConfig, "id">) => {
    const id = `toast-${Date.now()}`;
    setActiveToasts((prev) => [...prev, { ...config, id }]);
  };

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold border-b border-border pb-2">
        Toast Alert
      </h2>
      <p className="text-sm text-muted-foreground">
        Click buttons to show toast notifications. They auto-dismiss after a few
        seconds.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            showToast({
              variant: "success",
              position: "bottom-right",
              title: "Success!",
              description: "Your action was completed successfully.",
              duration: 4000,
            })
          }
        >
          Success Toast
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            showToast({
              variant: "info",
              position: "top-right",
              title: "Information",
              description: "Here's some helpful information for you.",
              duration: 4000,
            })
          }
        >
          Info Toast
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            showToast({
              variant: "warning",
              position: "bottom-center",
              title: "Warning",
              description: "Please review this before proceeding.",
              duration: 4000,
            })
          }
        >
          Warning Toast
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() =>
            showToast({
              variant: "destructive",
              position: "top-center",
              title: "Error",
              description: "Something went wrong. Please try again.",
              duration: 5000,
            })
          }
        >
          Error Toast
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            showToast({
              variant: "info",
              position: "top-right",
              title: "With Action",
              description: "Click the action button before it dismisses.",
              duration: 6000,
              action: {
                label: "Undo",
                onClick: () => console.log("Undo clicked!"),
              },
            })
          }
        >
          Toast with Action
        </Button>
      </div>

      {/* Render active toasts */}
      {activeToasts.map((toast) => (
        <Alert
          key={toast.id}
          toast
          toastProps={{
            position: toast.position,
            duration: toast.duration,
            dismissable: true,
            action: toast.action,
          }}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        >
          <AlertTitle>{toast.title}</AlertTitle>
          <AlertDescription>{toast.description}</AlertDescription>
        </Alert>
      ))}
    </section>
  );
}

export function AlertPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Alert</h1>
        <p className="text-muted-foreground">
          Displays a callout for user attention with colored variants.
        </p>
      </header>

      {/* Filled Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Filled Variants
        </h2>
        <div className="space-y-4">
          <Alert variant="default">
            <AlertTitle>Default</AlertTitle>
            <AlertDescription>
              This is a default alert with neutral styling.
            </AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert with helpful context.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your action was completed successfully.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review this information carefully before proceeding.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Outline Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Outline Variants
        </h2>
        <div className="space-y-4">
          <Alert variant="outline-info">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Outline style with border only.</AlertDescription>
          </Alert>
          <Alert variant="outline-success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Outline success alert.</AlertDescription>
          </Alert>
          <Alert variant="outline-warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Outline warning alert.</AlertDescription>
          </Alert>
          <Alert variant="outline-destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Outline destructive alert.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <p className="text-sm text-muted-foreground">
          Alerts with xs, sm, default, and lg sizes for different contexts.
        </p>
        <div className="space-y-4">
          <Alert size="xs" variant="info">
            <AlertTitle>Extra Small</AlertTitle>
            <AlertDescription>
              Size xs alert with compact padding.
            </AlertDescription>
          </Alert>
          <Alert size="sm" variant="info">
            <AlertTitle>Small</AlertTitle>
            <AlertDescription>
              Size sm alert with moderate padding.
            </AlertDescription>
          </Alert>
          <Alert size="default" variant="info">
            <AlertTitle>Default</AlertTitle>
            <AlertDescription>Default size alert.</AlertDescription>
          </Alert>
          <Alert size="lg" variant="info">
            <AlertTitle>Large</AlertTitle>
            <AlertDescription>
              Size lg alert with generous padding.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Closable Alert */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Closable Alert
        </h2>
        <Alert variant="info" closable onClose={() => console.log("Closed!")}>
          <AlertTitle>Dismissible Alert</AlertTitle>
          <AlertDescription>
            Click the X button to dismiss this alert with animation.
          </AlertDescription>
        </Alert>
        <Alert variant="warning" closable>
          <AlertTitle>Another Closable</AlertTitle>
          <AlertDescription>This one is also dismissible.</AlertDescription>
        </Alert>
      </section>

      {/* Without Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Icon
        </h2>
        <Alert variant="info" showIcon={false}>
          <AlertTitle>No Icon Alert</AlertTitle>
          <AlertDescription>
            This alert has the icon disabled using showIcon=false.
          </AlertDescription>
        </Alert>
      </section>

      {/* Alert With Heading Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          AlertWithHeading (Convenience Component)
        </h2>
        <div className="space-y-4">
          <AlertWithHeading
            variant="info"
            title="Quick Info"
            description="Use AlertWithHeading for a simpler API."
          />
          <AlertWithHeading
            variant="success"
            title="Saved Successfully"
            description="Your changes have been saved."
            closable
          />
        </div>
      </section>

      {/* Toast Alert */}
      <ToastDemo />

      {/* Hold to Close Alert */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Hold to Close Alert
        </h2>
        <p className="text-sm text-muted-foreground">
          Hold to dismiss the alert. Progress bar animates while holding.
        </p>
        <div className="space-y-3 max-w-md">
          <Alert
            variant="default"
            holdToClose
            onClose={() => console.log("Default dismissed!")}
          >
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert message.
            </AlertDescription>
          </Alert>
          <Alert
            variant="info"
            holdToClose
            onClose={() => console.log("Info dismissed!")}
          >
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational message.
            </AlertDescription>
          </Alert>
          <Alert
            variant="success"
            holdToClose
            onClose={() => console.log("Success dismissed!")}
          >
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Operation completed successfully.
            </AlertDescription>
          </Alert>
          <Alert
            variant="warning"
            holdToClose
            onClose={() => console.log("Warning dismissed!")}
          >
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Something needs your attention.</AlertDescription>
          </Alert>
          <Alert
            variant="destructive"
            holdToClose
            holdDuration={2000}
            onClose={() => console.log("Error dismissed!")}
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred. Hold to dismiss.
            </AlertDescription>
          </Alert>
          <Alert
            variant="outline-info"
            holdToClose
            onClose={() => console.log("Outline info dismissed!")}
          >
            <AlertTitle>Outline Info</AlertTitle>
            <AlertDescription>
              This is an outline variant alert.
            </AlertDescription>
          </Alert>
          <Alert
            variant="outline-success"
            holdToClose
            onClose={() => console.log("Outline success dismissed!")}
          >
            <AlertTitle>Outline Success</AlertTitle>
            <AlertDescription>
              Outline success variant example.
            </AlertDescription>
          </Alert>
          <Alert
            variant="outline-warning"
            holdToClose
            onClose={() => console.log("Outline warning dismissed!")}
          >
            <AlertTitle>Outline Warning</AlertTitle>
            <AlertDescription>
              Outline warning variant example.
            </AlertDescription>
          </Alert>
          <Alert
            variant="outline-destructive"
            holdToClose
            holdDuration={2000}
            onClose={() => console.log("Outline destructive dismissed!")}
          >
            <AlertTitle>Outline Error</AlertTitle>
            <AlertDescription>
              Hold longer (2s) to dismiss this one.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Closable + Hold to Close Combined */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Combined: Closable + Hold to Close
        </h2>
        <p className="text-sm text-muted-foreground">
          Use both <code className="bg-muted px-1 rounded">closable</code> and{" "}
          <code className="bg-muted px-1 rounded">holdToClose</code> for maximum
          flexibility.
        </p>
        <div className="space-y-3 max-w-md">
          <Alert
            variant="info"
            closable
            holdToClose
            onClose={() => console.log("Combined alert dismissed!")}
          >
            <AlertTitle>Click X or Hold to Dismiss</AlertTitle>
            <AlertDescription>
              This alert can be closed by clicking the X button or by holding.
            </AlertDescription>
          </Alert>
          <Alert
            variant="warning"
            closable
            holdToClose
            holdDuration={2000}
            onClose={() => console.log("Warning combined dismissed!")}
          >
            <AlertTitle>Multiple Dismiss Options</AlertTitle>
            <AlertDescription>
              Click X for instant close, or hold for 2 seconds.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Basic with icon
<Alert variant="info">
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>

// Closable with X button
<Alert variant="warning" closable onClose={() => {}} />

// Hold to close
<Alert variant="info" holdToClose holdDuration={1500} onClose={() => {}}>
  <AlertTitle>Hold to Dismiss</AlertTitle>
  <AlertDescription>Hold to dismiss this alert</AlertDescription>
</Alert>

// Combined: closable + holdToClose
<Alert variant="success" closable holdToClose onClose={() => {}}>
  <AlertTitle>Both Options</AlertTitle>
  <AlertDescription>Click X or hold to dismiss</AlertDescription>
</Alert>

// Toast alert
<Alert 
  toast 
  toastProps={{ position: "bottom-right", duration: 5000 }}
  variant="success"
>
  <AlertTitle>Toast</AlertTitle>
</Alert>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
