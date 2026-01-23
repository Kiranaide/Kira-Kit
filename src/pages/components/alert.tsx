import { useState } from "react";
import {
  IconDownload,
  IconTrash,
  IconRefresh,
  IconRocket,
  IconSparkles,
} from "@tabler/icons-react";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertWithHeading,
} from "@/components/ui/alert";
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
// Code Examples
// =============================================================================

const basicCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function BasicAlertDemo() {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  )
}`;

const variantsCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function AlertVariantsDemo() {
  return (
    <div className="space-y-4">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>This is a default alert with neutral styling.</AlertDescription>
      </Alert>

      <Alert variant="info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is an informational alert with helpful context.</AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your action was completed successfully.</AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please review this information carefully.</AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Please try again.</AlertDescription>
      </Alert>
    </div>
  )
}`;

const iconsCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function AlertIconsDemo() {
  return (
    <div className="space-y-4">
      {/* Default icons are shown automatically based on variant */}
      <Alert variant="info">
        <AlertTitle>With Default Icon</AlertTitle>
        <AlertDescription>Icons are shown by default for each variant.</AlertDescription>
      </Alert>

      {/* Disable icons */}
      <Alert variant="info" showIcon={false}>
        <AlertTitle>No Icon</AlertTitle>
        <AlertDescription>Set showIcon={false} to hide the icon.</AlertDescription>
      </Alert>
    </div>
  )
}`;

const dismissibleCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function DismissibleAlertDemo() {
  return (
    <div className="space-y-4">
      {/* Closable with X button */}
      <Alert variant="info" closable onClose={() => console.log("Closed!")}>
        <AlertTitle>Dismissible Alert</AlertTitle>
        <AlertDescription>Click the X button to dismiss this alert.</AlertDescription>
      </Alert>

      {/* Hold to close */}
      <Alert variant="warning" holdToClose onClose={() => console.log("Dismissed!")}>
        <AlertTitle>Hold to Dismiss</AlertTitle>
        <AlertDescription>Hold to dismiss this alert with progress indicator.</AlertDescription>
      </Alert>

      {/* Combined */}
      <Alert variant="success" closable holdToClose onClose={() => console.log("Closed!")}>
        <AlertTitle>Both Options</AlertTitle>
        <AlertDescription>Click X or hold to dismiss.</AlertDescription>
      </Alert>
    </div>
  )
}`;

const actionsCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertActionsDemo() {
  return (
    <Alert variant="info">
      <div className="flex flex-1 items-start justify-between gap-4">
        <div>
          <AlertTitle>New update available</AlertTitle>
          <AlertDescription>
            A new version of the application is ready to install.
          </AlertDescription>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm">Later</Button>
          <Button size="sm">Update now</Button>
        </div>
      </div>
    </Alert>
  )
}`;

const customCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { IconRocket } from "@tabler/icons-react"

export function CustomAlertDemo() {
  return (
    <div className="space-y-4">
      {/* Outline variants */}
      <Alert variant="outline-info">
        <AlertTitle>Outline Info</AlertTitle>
        <AlertDescription>Outline style with border only.</AlertDescription>
      </Alert>

      {/* Different sizes */}
      <Alert size="sm" variant="info">
        <AlertTitle>Small Alert</AlertTitle>
        <AlertDescription>Compact padding for tight spaces.</AlertDescription>
      </Alert>

      <Alert size="lg" variant="info">
        <AlertTitle>Large Alert</AlertTitle>
        <AlertDescription>Generous padding for emphasis.</AlertDescription>
      </Alert>

      {/* AlertWithHeading convenience component */}
      <AlertWithHeading
        variant="success"
        title="Quick API"
        description="Use AlertWithHeading for simpler usage."
        closable
      />
    </div>
  )
}`;

const usageCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

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
</Alert>`;

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  );
}

function VariantsDemo() {
  return (
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

      <h4 className="text-sm font-medium pt-4">Outline Variants</h4>
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
  );
}

function IconsDemo() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        <AlertTitle>Default Icon</AlertTitle>
        <AlertDescription>
          Icons are shown automatically based on variant type.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertTitle>Success Icon</AlertTitle>
        <AlertDescription>
          Each variant has its own semantic icon.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTitle>Warning Icon</AlertTitle>
        <AlertDescription>
          Warning variant shows an alert triangle.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Error Icon</AlertTitle>
        <AlertDescription>
          Destructive variant shows an error icon.
        </AlertDescription>
      </Alert>

      <h4 className="text-sm font-medium pt-4">Without Icon</h4>
      <Alert variant="info" showIcon={false}>
        <AlertTitle>No Icon Alert</AlertTitle>
        <AlertDescription>
          This alert has the icon disabled using showIcon=false.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function DismissibleDemo() {
  const [alerts, setAlerts] = useState({
    closable1: true,
    closable2: true,
    hold1: true,
    hold2: true,
    combined: true,
  });

  const resetAlerts = () => {
    setAlerts({
      closable1: true,
      closable2: true,
      hold1: true,
      hold2: true,
      combined: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetAlerts}>
          <IconRefresh className="w-4 h-4 mr-2" />
          Reset Alerts
        </Button>
      </div>

      <h4 className="text-sm font-medium">Closable with X Button</h4>
      {alerts.closable1 && (
        <Alert
          variant="info"
          closable
          onClose={() => setAlerts((prev) => ({ ...prev, closable1: false }))}
        >
          <AlertTitle>Dismissible Alert</AlertTitle>
          <AlertDescription>
            Click the X button to dismiss this alert with animation.
          </AlertDescription>
        </Alert>
      )}
      {alerts.closable2 && (
        <Alert
          variant="warning"
          closable
          onClose={() => setAlerts((prev) => ({ ...prev, closable2: false }))}
        >
          <AlertTitle>Another Closable</AlertTitle>
          <AlertDescription>This one is also dismissible.</AlertDescription>
        </Alert>
      )}

      <h4 className="text-sm font-medium pt-4">Hold to Close</h4>
      {alerts.hold1 && (
        <Alert
          variant="info"
          holdToClose
          onClose={() => setAlerts((prev) => ({ ...prev, hold1: false }))}
        >
          <AlertTitle>Hold to Dismiss</AlertTitle>
          <AlertDescription>
            Hold to dismiss. Progress bar animates while holding.
          </AlertDescription>
        </Alert>
      )}
      {alerts.hold2 && (
        <Alert
          variant="destructive"
          holdToClose
          holdDuration={2000}
          onClose={() => setAlerts((prev) => ({ ...prev, hold2: false }))}
        >
          <AlertTitle>Longer Hold Duration</AlertTitle>
          <AlertDescription>
            Hold for 2 seconds to dismiss this one.
          </AlertDescription>
        </Alert>
      )}

      <h4 className="text-sm font-medium pt-4">Combined: Closable + Hold</h4>
      {alerts.combined && (
        <Alert
          variant="success"
          closable
          holdToClose
          onClose={() => setAlerts((prev) => ({ ...prev, combined: false }))}
        >
          <AlertTitle>Click X or Hold to Dismiss</AlertTitle>
          <AlertDescription>
            This alert can be closed by clicking the X button or by holding.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function ActionsDemo() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        <div className="flex flex-1 items-start justify-between gap-4">
          <div>
            <AlertTitle>New update available</AlertTitle>
            <AlertDescription>
              A new version of the application is ready to install.
            </AlertDescription>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm">
              Later
            </Button>
            <Button size="sm">
              <IconDownload className="w-4 h-4 mr-1" />
              Update
            </Button>
          </div>
        </div>
      </Alert>

      <Alert variant="warning">
        <div className="flex flex-1 items-start justify-between gap-4">
          <div>
            <AlertTitle>Storage almost full</AlertTitle>
            <AlertDescription>
              You've used 90% of your storage quota. Consider upgrading your
              plan.
            </AlertDescription>
          </div>
          <Button variant="outline" size="sm">
            Manage Storage
          </Button>
        </div>
      </Alert>

      <Alert variant="destructive">
        <div className="flex flex-1 items-start justify-between gap-4">
          <div>
            <AlertTitle>Delete confirmation</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDescription>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="destructive" size="sm">
              <IconTrash className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </Alert>

      <Alert variant="success">
        <div className="flex flex-1 items-start justify-between gap-4">
          <div>
            <AlertTitle>Payment successful</AlertTitle>
            <AlertDescription>
              Your payment of $49.99 has been processed successfully.
            </AlertDescription>
          </div>
          <Button variant="outline" size="sm">
            View Receipt
          </Button>
        </div>
      </Alert>
    </div>
  );
}

function CustomDemo() {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Size Variants</h4>
      <Alert size="xs" variant="info">
        <AlertTitle>Extra Small</AlertTitle>
        <AlertDescription>Size xs alert with compact padding.</AlertDescription>
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

      <h4 className="text-sm font-medium pt-4">
        AlertWithHeading (Convenience API)
      </h4>
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

      <h4 className="text-sm font-medium pt-4">Custom Styled</h4>
      <Alert className="border-2 border-dashed border-primary bg-primary/5">
        <IconRocket className="h-5 w-5 text-primary" />
        <div>
          <AlertTitle className="text-primary">Launch Ready!</AlertTitle>
          <AlertDescription>
            Your application is ready for deployment.
          </AlertDescription>
        </div>
      </Alert>

      <Alert className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <IconSparkles className="h-5 w-5 text-purple-500" />
        <div>
          <AlertTitle className="text-purple-700 dark:text-purple-300">
            Premium Feature
          </AlertTitle>
          <AlertDescription>
            Unlock advanced features with a premium subscription.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

// =============================================================================
// Toast Demo (keeping the original interactive demo)
// =============================================================================

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
    <div className="space-y-4">
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
    </div>
  );
}

// =============================================================================
// API Reference Data
// =============================================================================

const apiSections = [
  {
    title: "Alert",
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive" | "outline-*"',
        default: '"default"',
        description: "Visual style variant of the alert",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Size of the alert padding",
      },
      {
        prop: "closable",
        type: "boolean",
        default: "false",
        description: "Show close button to dismiss the alert",
      },
      {
        prop: "showIcon",
        type: "boolean",
        default: "true",
        description: "Show the variant-specific icon",
      },
      {
        prop: "holdToClose",
        type: "boolean",
        default: "false",
        description: "Enable hold-to-dismiss with progress indicator",
      },
      {
        prop: "holdDuration",
        type: "number",
        default: "1500",
        description: "Duration in ms to hold before dismissing",
      },
      {
        prop: "onClose",
        type: "() => void",
        default: "-",
        description: "Callback when alert is dismissed",
      },
      {
        prop: "toast",
        type: "boolean",
        default: "false",
        description: "Render as a toast notification",
      },
      {
        prop: "toastProps",
        type: "ToastProps",
        default: "-",
        description:
          "Configuration for toast behavior (position, duration, etc.)",
      },
    ],
  },
  {
    title: "AlertTitle",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the title",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Title content",
      },
    ],
  },
  {
    title: "AlertDescription",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the description",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Description content",
      },
    ],
  },
  {
    title: "AlertWithHeading",
    props: [
      {
        prop: "title",
        type: "string",
        default: "-",
        description: "Alert title text",
      },
      {
        prop: "description",
        type: "string",
        default: "-",
        description: "Alert description text",
      },
      {
        prop: "variant",
        type: "AlertVariant",
        default: '"default"',
        description: "Visual style variant",
      },
      {
        prop: "closable",
        type: "boolean",
        default: "false",
        description: "Show close button",
      },
    ],
  },
];

// =============================================================================
// Features
// =============================================================================

const features = [
  {
    title: "Accessible",
    description:
      'Uses role="alert" with proper ARIA attributes for screen reader announcements.',
  },
  {
    title: "Semantic Variants",
    description:
      "Info, success, warning, and destructive variants with appropriate colors and icons.",
  },
  {
    title: "Composable",
    description:
      "Build complex alerts with AlertTitle, AlertDescription, and custom content.",
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
        title="Basic Alert"
        description="A simple alert with title and description."
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
        title="Semantic Variants"
        description="All available alert variants including filled and outline styles."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "Icons",
    demo: (
      <DemoWrapper
        title="With Icons"
        description="Alerts with automatic variant-based icons."
        code={iconsCode}
      >
        <IconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dismissible",
    label: "Dismissible",
    demo: (
      <DemoWrapper
        title="Dismissible Alerts"
        description="Closable alerts with X button and hold-to-dismiss functionality."
        code={dismissibleCode}
      >
        <DismissibleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "actions",
    label: "Actions",
    demo: (
      <DemoWrapper
        title="Alerts with Actions"
        description="Alerts with action buttons for user interaction."
        code={actionsCode}
      >
        <ActionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "custom",
    label: "Custom",
    demo: (
      <DemoWrapper
        title="Custom Styled Alerts"
        description="Size variants, convenience components, and custom styling."
        code={customCode}
      >
        <CustomDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "toast",
    label: "Toast",
    demo: (
      <DemoWrapper
        title="Toast Notifications"
        description="Alert used as toast notifications with positioning and auto-dismiss."
        code={`import { useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function ToastDemo() {
  const [toasts, setToasts] = useState([])

  const showToast = (config) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...config, id }])
  }

  return (
    <div>
      <Button onClick={() => showToast({
        variant: "success",
        position: "bottom-right",
        title: "Success!",
        description: "Action completed.",
        duration: 4000,
      })}>
        Show Toast
      </Button>

      {toasts.map(toast => (
        <Alert
          key={toast.id}
          toast
          toastProps={{
            position: toast.position,
            duration: toast.duration,
            dismissable: true,
          }}
          variant={toast.variant}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        >
          <AlertTitle>{toast.title}</AlertTitle>
          <AlertDescription>{toast.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}`}
      >
        <ToastDemo />
      </DemoWrapper>
    ),
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

export default function AlertPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Alert"
        version="v1.0"
        description="Displays a callout for user attention with semantic variants, dismissible options, and toast support."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns for the Alert component"
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for Alert components"
      />
    </ComponentPage>
  );
}
