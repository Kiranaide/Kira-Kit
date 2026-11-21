import type { ComponentProps as ReactComponentProps } from "react";
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
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

const basicCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function Example() {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  )
}`;

const variantsCode = `import { Alert } from "@/components/ui/alert"

<Alert variant="info">…</Alert>
<Alert variant="success">…</Alert>
<Alert variant="warning">…</Alert>
<Alert variant="destructive">…</Alert>
<Alert variant="info-soft">…</Alert>
<Alert variant="outline-info">…</Alert>`;

const iconsCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Icon comes from the variant; pass \`icon={null}\` to hide it,
// or any node to replace it.
<Alert variant="success">
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes are live.</AlertDescription>
</Alert>

<Alert variant="warning" icon={null}>…</Alert>`;

const dismissibleCode = `import { Alert } from "@/components/ui/alert"

// The close button owns the top-right corner; reduced motion
// dismisses instantly.
<Alert variant="warning" closable onClose={() => {}}>…</Alert>`;

const softBannerCode = `import { Alert } from "@/components/ui/alert"

// Soft: tinted background, no border
<Alert variant="success-soft">…</Alert>

// Banner: full-width, edge-to-edge
<Alert variant="warning" banner>…</Alert>

// Left accent border
<Alert variant="info" leftAccent>…</Alert>`;

const actionsCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="info"
  title="New update available"
  description="A new version is ready to install."
  actions={[
    { label: "Update", onClick: () => {} },
    { label: "Later", variant: "outline" },
  ]}
/>`;

const expandableCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="destructive"
  title="Deployment failed"
  description="Build step exited with code 1."
  expandable
  expandedContent={<pre>…log…</pre>}
/>`;

const copyCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="warning"
  title="API key rotated"
  copyable
  copyText="the text to copy"
  timestamp={new Date()}
/>`;

const undoDismissCode = `import { KiraAlert } from "@/components/ui/alert"

// Dismiss shows a "Dismissed — Undo" strip for 5s (undoDuration).
// Hovering or focusing the strip pauses the timer (WCAG 2.2.2).
// onClose fires at dismiss time; Undo is visual restoration.
<KiraAlert
  variant="warning"
  title="3 items archived"
  description="You can undo this for a few seconds."
  dismissible
  undoDismiss
  undoDuration={5000}
/>`;

const kiraCode = `import { KiraAlert } from "@/components/ui/alert"

<KiraAlert
  variant="info"
  title="Update available"
  description="A new version is ready."
  actions={[{ label: "Update", onClick: () => {} }]}
  copyable
  timestamp={new Date()}
  dismissible
/>`;

const showcaseCode = `import { Alert, AlertTitle, AlertDescription, KiraAlert } from "@/components/ui/alert"

// Every variant, size, banner, and left accent — plus stress cases:
// long content, empty description, narrow containers, and 200% text.
<Alert variant="info" size="sm">…</Alert>
<KiraAlert variant="destructive" title="…" description="…" dismissible />`;

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

// Fixture timestamps — fixed at module scope so demo renders stay pure
// (react-hooks/purity) and relative labels don't drift between re-renders.
const T_2_MIN_AGO = new Date(Date.now() - 2 * 60 * 1000);
const T_90_MIN_AGO = new Date(Date.now() - 90 * 60 * 1000);
const T_3_MIN_AGO = new Date(Date.now() - 3 * 60 * 1000);
const T_NOW = new Date();

function BasicDemo() {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
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

      <h4 className="pt-2 text-sm font-medium">Soft</h4>
      <Alert variant="info-soft">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Softer, tinted background.</AlertDescription>
      </Alert>
      <Alert variant="success-soft">
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes were saved.</AlertDescription>
      </Alert>
      <Alert variant="warning-soft">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something needs attention.</AlertDescription>
      </Alert>
      <Alert variant="destructive-soft">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>

      <h4 className="pt-2 text-sm font-medium">Outline</h4>
      <Alert variant="outline-default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Outlined, no fill.</AlertDescription>
      </Alert>
      <Alert variant="outline-info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Outlined informational alert.</AlertDescription>
      </Alert>
      <Alert variant="outline-success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Outlined success alert.</AlertDescription>
      </Alert>
      <Alert variant="outline-warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Outlined warning alert.</AlertDescription>
      </Alert>
      <Alert variant="outline-destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Outlined error alert.</AlertDescription>
      </Alert>
    </div>
  );
}

function IconsDemo() {
  return (
    <div className="space-y-4">
      <Alert variant="success">
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>
          Icons are chosen automatically from the variant and carry the tone
          colour.
        </AlertDescription>
      </Alert>
      <Alert variant="warning" icon={null}>
        <AlertTitle>No icon</AlertTitle>
        <AlertDescription>
          Pass <code>icon=&#123;null&#125;</code> to hide it entirely.
        </AlertDescription>
      </Alert>
      <Alert variant="default" icon={<IconRocket className="h-full w-full" />}>
        <AlertTitle>Custom icon</AlertTitle>
        <AlertDescription>
          Any React node replaces the variant default.
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
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something needs attention.</AlertDescription>
      </Alert>
      <Alert variant="destructive-soft">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>

      <h4 className="pt-2 text-sm font-medium">Banner (edge-to-edge)</h4>
      <Alert variant="warning" banner>
        <AlertDescription>
          Scheduled maintenance: Sunday 02:00–03:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="info" banner>
        <AlertDescription>
          New in this release: dark mode and saved filters.
        </AlertDescription>
      </Alert>

      <h4 className="pt-2 text-sm font-medium">Left accent</h4>
      <Alert variant="info" leftAccent>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>With a coloured left accent border.</AlertDescription>
      </Alert>
      <Alert variant="destructive" leftAccent>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>With a coloured left accent border.</AlertDescription>
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
        description="Open the review queue to approve or reject pending changes."
        expandable
        expandedContent={
          <ul className="list-disc pl-4 text-sm">
            <li>#482 — migration on users table (Maria)</li>
            <li>#483 — copy change on pricing page (Sam)</li>
            <li>#487 — dependency bump: react 19.3.1 (Priya)</li>
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
        description="[REDACTED:stripe]"
        copyable
        timestamp={T_2_MIN_AGO}
      />
      <KiraAlert
        variant="info"
        icon={<IconBell className="text-info" />}
        title="New sign-in detected"
        description="Chrome on macOS · San Francisco, CA"
        copyable
        copyText="New sign-in: Chrome on macOS, San Francisco"
        timestamp={T_90_MIN_AGO}
      />
    </div>
  );
}

function KiraDemo() {
  return (
    <div className="space-y-4">
      <KiraAlert
        variant="success"
        icon={<IconSparkles className="h-full w-full" />}
        title="Payment successful"
        description="Your payment of $29.99 has been processed. A receipt has been sent to your email address."
        actions={[
          { label: "View receipt", onClick: () => {} },
          { label: "Download", variant: "outline", onClick: () => {} },
        ]}
        copyable
        copyText="Receipt #KR-004821"
        timestamp={T_NOW}
        dismissible
        undoDismiss
      />
    </div>
  );
}

function UndoDismissDemo() {
  return (
    <div className="space-y-4">
      <KiraAlert
        variant="warning"
        title="3 items archived"
        description="Archive completed. You can undo this for a few seconds after dismissing."
        dismissible
        undoDismiss
        undoDuration={5000}
      />
      <p className="text-xs text-muted-foreground">
        Dismiss the alert above — hover or focus the strip to pause the 5s
        window before it disappears for good.
      </p>
    </div>
  );
}

function StressDemo() {
  return (
    <div className="max-w-[320px] space-y-4">
      <Alert variant="destructive">
        <AlertTitle>
          Record-breaking monsoon rainfall disrupts metropolitan transit
          schedules across the entire coastal region
        </AlertTitle>
        <AlertDescription>
          Transport authorities reported platform flooding at twelve stations
          during Tuesday evening&apos;s commute, with service restored
          incrementally overnight and residual delays expected through Thursday.
          Long content wraps instead of overflowing the narrow column.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Empty description</AlertTitle>
        <AlertDescription>{""}</AlertDescription>
      </Alert>
      <KiraAlert
        variant="info"
        title="Everything at once"
        description="Copy, timestamp, and dismiss share one narrow column."
        copyable
        timestamp={T_3_MIN_AGO}
        dismissible
        expandable
        expandedContent="Extra detail stays reachable behind Show more."
      />
    </div>
  );
}

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
      {
        prop: "meta",
        type: "ReactNode",
        default: "-",
        description:
          "Extra header-row content (timestamp, copy) rendered left of the close button on one flex row",
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
      {
        prop: "undoDismiss",
        type: "boolean",
        default: "false",
        description:
          "Dismiss shows a 'Dismissed — Undo' strip for a short window instead of unmounting immediately",
      },
      {
        prop: "undoDuration",
        type: "number",
        default: "5000",
        description:
          "How long the undo strip stays visible (ms); pauses on strip hover/focus",
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
        description="Tinted, edge-to-edge, and accented styles."
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
        description="Close with animation; instant under reduced motion."
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
    value: "undo-dismiss",
    label: "Undo Dismiss",
    demo: (
      <DemoWrapper
        title="Undo-dismiss"
        description="Dismissal shows a 'Dismissed — Undo' strip instead of dead-ending; hovering or focusing the strip pauses the 5s timer."
        code={undoDismissCode}
      >
        <UndoDismissDemo />
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
  {
    value: "stress",
    label: "Stress Cases",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long titles wrap instead of overflowing, empty descriptions render nothing, and dismiss/copy/expand coexist — all inside a max-w-[320px] column."
        code={showcaseCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
];

export default function AlertPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Alert"
        version="v2.2.0"
        description="Displays a callout for user attention with semantic variants, soft/banner styles, and a prop-driven KiraAlert. For transient notifications, use the toast() API."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        title="Keyboard shortcuts"
        description="Alert is a static region with regular buttons — Kira additions only; there is no Base UI primitive underneath, so no inherited behavior. Reference: WAI-ARIA alert pattern."
        shortcuts={alertPageKeyboardShortcutsShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Common usage patterns for the Alert component"
      />

      <APIReference
        sections={apiSections}
        title="API reference"
        description="Props and configuration options for Alert components"
      />

      <Changelog entries={alertPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const alertPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab",
    description:
      "Move focus to the next control (close, copy, Show more, action buttons) — all normal tab stops in DOM order",
  },
  {
    keys: "Shift + Tab",
    description: "Move focus to the previous control",
  },
  {
    keys: "Enter / Space",
    description: "Activate the focused button (dismiss, copy, toggle)",
  },
  {
    keys: "Esc",
    description:
      "No behavior — an alert is not a dialog; dismissing relies on the visible close button",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const alertPageChangelogEntries = [
  {
    version: "2.2.0",
    date: "16 October 2026",
    changes: [
      {
        type: "added",
        title: "Undo-dismiss strip",
        description:
          "undoDismiss/undoDuration on KiraAlert: dismissing shows a 'Dismissed — Undo' strip for 5s instead of dead-ending. Timer pauses on strip hover/focus (WCAG 2.2.2); onClose fires at dismiss time so parent state matches what the user last saw; undo is visual restoration. Instant swap, no animation.",
      },
      {
        type: "fixed",
        title: "Header alignment",
        description:
          "Alert renders icon, body, and header actions (meta + close) on one baseline-aligned flex row. The close button is no longer absolutely positioned and the timestamp/copy cluster no longer stacks above the title — one coordinate system.",
      },
      {
        type: "added",
        title: "meta prop",
        description:
          "Alert accepts a meta node rendered into the header row left of the close button; KiraAlert's timestamp/copy cluster is delivered through it (caller-provided meta wins).",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "16 October 2026",
    changes: [
      {
        type: "changed",
        title: "WCAG AA Contrast for Tone Variants",
        description:
          "Tone variant body text now uses foreground color in light and dark; the semantic tone is carried by icon, border, and left accent. Audited against @base-ui/react 1.9.0 (the stock Base UI alert has no primitive — parity unchanged).",
      },
      {
        type: "fixed",
        title: "Copy Button",
        description:
          "Clipboard promise rejection handled; copied state announced via a polite live region; hit area ≥ 24px with visible focus ring.",
      },
      {
        type: "fixed",
        title: "Dismissible + Copyable Collision",
        description:
          "When both are on, the timestamp/copy cluster flows inline instead of overlapping the close button.",
      },
      {
        type: "fixed",
        title: "Dismiss Tween Interruption",
        description:
          "Rapid re-clicks and unmount now kill the GSAP dismiss tween; reduced motion dismisses instantly.",
      },
      {
        type: "fixed",
        title: "Render Purity",
        description:
          "Date.now() no longer runs during render for relative timestamps (react-compiler-safe lazy state initializer).",
      },
      {
        type: "added",
        title: "Focus Visibility",
        description:
          "Close, copy, and Show more buttons show a focus-visible ring; icon-only controls keep stable accessible names.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
