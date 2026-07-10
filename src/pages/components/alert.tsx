import { useState } from "react";
import {
  IconDownload,
  IconTrash,
  IconRefresh,
  IconRocket,
  IconSparkles,
  IconBell,
} from "@tabler/icons-react";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  KiraAlert,
} from "@/components/ui/alert";
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

<Alert variant="info">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Helpful context.</AlertDescription>
</Alert>
<Alert variant="success">…</Alert>
<Alert variant="warning">…</Alert>
<Alert variant="destructive">…</Alert>`;

const iconsCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Default icons per variant
<Alert variant="info">
  <AlertTitle>With Default Icon</AlertTitle>
  <AlertDescription>Icons are shown by default.</AlertDescription>
</Alert>

// Disable icons
<Alert variant="info" showIcon={false}>
  <AlertTitle>No Icon</AlertTitle>
</Alert>`;

const dismissibleCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert variant="info" closable onClose={() => {}}>
  <AlertTitle>Dismissible Alert</AlertTitle>
  <AlertDescription>Click the X button to dismiss.</AlertDescription>
</Alert>`;

const softBannerCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Soft palette (matches Badge *-soft)
<Alert variant="success-soft">
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes were saved.</AlertDescription>
</Alert>

// Left accent border
<Alert variant="info" leftAccent>
  <AlertTitle>Note</AlertTitle>
</Alert>

// Full-width banner
<Alert variant="warning" banner>
  <AlertDescription>Scheduled maintenance tonight at 2am UTC.</AlertDescription>
</Alert>`;

const actionsCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="info"
  title="New update available"
  description="A new version is ready to install."
  actions={[
    { label: "Update now", onClick: () => {} },
    { label: "Later", variant: "outline" },
  ]}
/>`;

const expandableCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="destructive"
  title="Deployment failed"
  description="Build step exited with code 1."
  expandable
  expandedContent={<pre>Error: missing env var DATABASE_URL…</pre>}
/>`;

const copyCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="warning"
  title="API key rotated"
  description="sk_live_51H8xY2eZvKq…"
  copyable
  timestamp={new Date()}
/>`;

const kiraCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="success"
  title="Payment successful"
  description="Your payment of $49.99 has been processed."
  timestamp={new Date()}
  actions={[{ label: "View receipt", variant: "outline" }]}
  dismissible
/>`;

const usageCode = `import { Alert, AlertTitle, AlertDescription, KiraAlert } from "@/components/ui/alert"

// Composable
<Alert variant="info">
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>

// Closable
<Alert variant="warning" closable onClose={() => {}}>…</Alert>

// Soft / banner / left accent
<Alert variant="success-soft">…</Alert>
<Alert variant="warning" banner>…</Alert>
<Alert variant="info" leftAccent>…</Alert>

// KiraAlert (prop-driven)
<KiraAlert
  variant="info"
  title="Update available"
  description="A new version is ready."
  actions={[{ label: "Update", onClick: () => {} }]}
  copyable
  timestamp={new Date()}
  dismissible
/>

// For transient notifications, use the toast() API instead
import { toast } from "@/components/ui/toast"
toast.success("Saved")`;

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
  });

  const resetAlerts = () => setAlerts({ closable1: true, closable2: true });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetAlerts}>
          <IconRefresh className="w-4 h-4 mr-2" />
          Reset Alerts
        </Button>
      </div>
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
    </div>
  );
}

function SoftBannerDemo() {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Soft palette</h4>
      <Alert variant="info-soft">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Softer, tinted background.</AlertDescription>
      </Alert>
      <Alert variant="success-soft">
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes were saved.</AlertDescription>
      </Alert>
      <Alert variant="warning-soft">
        <AlertTitle>Careful</AlertTitle>
        <AlertDescription>Double-check before continuing.</AlertDescription>
      </Alert>

      <h4 className="text-sm font-medium pt-4">Left accent border</h4>
      <Alert variant="info" leftAccent>
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>Accent border draws the eye.</AlertDescription>
      </Alert>
      <Alert variant="destructive" leftAccent>
        <AlertTitle>Danger</AlertTitle>
        <AlertDescription>This needs your attention.</AlertDescription>
      </Alert>

      <h4 className="text-sm font-medium pt-4">Full-width banner</h4>
      <Alert variant="warning" banner showIcon>
        <AlertDescription>
          Scheduled maintenance tonight at 2:00 AM UTC.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ActionsDemo() {
  return (
    <div className="space-y-4">
      <KiraAlert
        variant="info"
        title="New update available"
        description="A new version of the application is ready to install."
        actions={[
          {
            label: (
              <>
                <IconDownload className="w-4 h-4 mr-1" />
                Update
              </>
            ),
            onClick: () => toast.success("Updating…"),
          },
          { label: "Later", variant: "outline" },
        ]}
      />
      <KiraAlert
        variant="destructive"
        title="Delete confirmation"
        description="Are you sure? This action cannot be undone."
        actions={[
          {
            label: (
              <>
                <IconTrash className="w-4 h-4 mr-1" />
                Delete
              </>
            ),
            variant: "destructive",
            onClick: () => toast.error("Deleted"),
          },
          { label: "Cancel", variant: "outline" },
        ]}
      />
    </div>
  );
}

function ExpandableDemo() {
  return (
    <div className="space-y-4">
      <KiraAlert
        variant="destructive"
        title="Deployment failed"
        description="Build step exited with code 1."
        expandable
        expandedContent={
          <pre className="whitespace-pre-wrap rounded bg-black/5 p-2 text-xs dark:bg-white/10">
            {`Error: missing env var DATABASE_URL
  at loadConfig (config.ts:42)
  at bootstrap (index.ts:11)`}
          </pre>
        }
      />
      <KiraAlert
        variant="info"
        title="3 items need review"
        description="Some records were imported with warnings."
        expandable
        expandedContent={
          <ul className="list-disc pl-4">
            <li>Row 12 — missing email</li>
            <li>Row 34 — duplicate ID</li>
            <li>Row 58 — invalid date</li>
          </ul>
        }
      />
    </div>
  );
}

function CopyTimestampDemo() {
  return (
    <div className="space-y-4">
      <KiraAlert
        variant="warning"
        title="API key rotated"
        description="sk_live_51H8xY2eZvKq9mNp3wRtBcDf"
        copyable
        timestamp={new Date(Date.now() - 2 * 60 * 1000)}
      />
      <KiraAlert
        variant="info"
        icon={<IconBell className="text-info" />}
        title="New sign-in detected"
        description="Chrome on macOS · San Francisco, CA"
        copyable
        copyText="New sign-in: Chrome on macOS, San Francisco"
        timestamp={new Date(Date.now() - 90 * 60 * 1000)}
      />
    </div>
  );
}

function KiraDemo() {
  const [show, setShow] = useState(true);
  return (
    <div className="space-y-4">
      {show ? (
        <KiraAlert
          variant="success"
          title="Payment successful"
          description="Your payment of $49.99 has been processed."
          timestamp={new Date()}
          actions={[{ label: "View receipt", variant: "outline" }]}
          copyable
          dismissible
          onClose={() => setShow(false)}
        />
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShow(true)}>
          <IconRefresh className="w-4 h-4 mr-2" />
          Restore
        </Button>
      )}
      <Alert className="border-2 border-dashed border-primary bg-primary/5">
        <IconRocket className="h-5 w-5 text-primary" />
        <div>
          <AlertTitle className="text-primary">Launch Ready!</AlertTitle>
          <AlertDescription>
            Custom styling still works — compose freely.
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
// API Reference Data
// =============================================================================

const apiSections = [
  {
    title: "Alert",
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive" | "*-soft" | "outline-*"',
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
        prop: "banner",
        type: "boolean",
        default: "false",
        description: "Full-width, edge-to-edge (no rounding)",
      },
      {
        prop: "leftAccent",
        type: "boolean",
        default: "false",
        description: "Add a colored left accent border",
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
        prop: "onClose",
        type: "() => void",
        default: "-",
        description: "Callback when alert is dismissed",
      },
    ],
  },
  {
    title: "KiraAlert",
    props: [
      {
        prop: "title / description",
        type: "ReactNode",
        default: "-",
        description: "Alert heading and body",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "-",
        description: "Override the auto icon",
      },
      {
        prop: "actions",
        type: "{ label; onClick?; variant? }[]",
        default: "-",
        description: "Action button row under the body",
      },
      {
        prop: "expandable / expandedContent",
        type: "boolean / ReactNode",
        default: "false",
        description: "Collapsible extra content behind Show more / less",
      },
      {
        prop: "copyable / copyText",
        type: "boolean / string",
        default: "false",
        description: "Copy-to-clipboard affordance",
      },
      {
        prop: "timestamp",
        type: "Date",
        default: "-",
        description: "Self-updating relative time (e.g. '2m ago')",
      },
      {
        prop: "dismissible",
        type: "boolean",
        default: "false",
        description: "Show a close button",
      },
    ],
  },
  {
    title: "AlertTitle / AlertDescription",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Content",
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
      "Filled, soft, outline, banner, and left-accent styles with matching icons.",
  },
  {
    title: "KiraAlert",
    description:
      "One prop-driven component: title, actions, expandable, copy, and timestamp.",
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
        description="Filled and outline styles for every variant."
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
    value: "soft-banner",
    label: "Soft & Banner",
    demo: (
      <DemoWrapper
        title="Soft, Banner & Left Accent"
        description="Softer palette, full-width banners, and accent borders."
        code={softBannerCode}
      >
        <SoftBannerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dismissible",
    label: "Dismissible",
    demo: (
      <DemoWrapper
        title="Dismissible Alerts"
        description="Closable alerts with an X button (respects reduced motion)."
        code={dismissibleCode}
      >
        <DismissibleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "actions",
    label: "Action Row",
    demo: (
      <DemoWrapper
        title="Alerts with Actions"
        description="KiraAlert renders a button row from an actions array."
        code={actionsCode}
      >
        <ActionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "expandable",
    label: "Expandable",
    demo: (
      <DemoWrapper
        title="Expandable Alerts"
        description="Progressive disclosure with Show more / less."
        code={expandableCode}
      >
        <ExpandableDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "copy-timestamp",
    label: "Copy & Timestamp",
    demo: (
      <DemoWrapper
        title="Copy & Timestamp"
        description="Copy-to-clipboard and a self-updating relative time."
        code={copyCode}
      >
        <CopyTimestampDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraAlert",
    demo: (
      <DemoWrapper
        title="KiraAlert"
        description="Everything composed through one prop-driven component."
        code={kiraCode}
      >
        <KiraDemo />
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
        version="v2.0"
        description="Displays a callout for user attention with semantic variants, soft/banner styles, and a prop-driven KiraAlert. For transient notifications, use the toast() API."
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
