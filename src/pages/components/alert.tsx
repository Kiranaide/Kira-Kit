import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import {
  IconBell,
  IconDownload,
  IconRefresh,
  IconRocket,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";

import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  KiraAlert,
  type AlertVariant,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

const basicCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function Example() {
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

<Alert variant="info">…</Alert>
<Alert variant="success">…</Alert>
<Alert variant="warning">…</Alert>
<Alert variant="destructive">…</Alert>
<Alert variant="info-soft">…</Alert>
<Alert variant="outline-info">…</Alert>`;

const sizesCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert variant="info" size="xs">…</Alert>
<Alert variant="info" size="sm">…</Alert>
<Alert variant="info" size="default">…</Alert>
<Alert variant="info" size="lg">…</Alert>`;

const iconsCode = `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { IconRocket } from "@tabler/icons-react"

// Icon comes from the variant; pass \`icon={null}\` to hide it,
// or any React node to replace it.
<Alert variant="success">
  <AlertTitle>Saved</AlertTitle>
  <AlertDescription>Your changes are live.</AlertDescription>
</Alert>

<Alert variant="warning" icon={null}>…</Alert>
<Alert variant="default" icon={<IconRocket aria-hidden="true" className="h-full w-full" />}>…</Alert>`;

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

const actionsCode = `import { Alert, AlertTitle, AlertDescription, AlertActions, KiraAlert } from "@/components/ui/alert"

// Composable with AlertActions
<Alert variant="info">
  <AlertTitle>Review pending changes</AlertTitle>
  <AlertDescription>Two configuration updates await approval.</AlertDescription>
  <AlertActions
    actions={[
      { id: "approve", label: "Approve", onClick: () => {} },
      { id: "dismiss", label: "Later", variant: "outline" },
    ]}
  />
</Alert>

// Or prop-driven with KiraAlert
<KiraAlert
  variant="info"
  title="New update available"
  description="A new version is ready to install."
  actions={[
    { id: "update", label: "Update", onClick: () => {} },
    { id: "later", label: "Later", variant: "outline" },
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
  variant="success"
  title="Payment successful"
  description="Your payment of $29.99 has been processed."
  actions={[
    { id: "receipt", label: "View receipt", onClick: () => {} },
    { id: "download", label: "Download", variant: "outline", onClick: () => {} },
  ]}
  copyable
  copyText="Receipt KR-004821"
  timestamp={new Date()}
  dismissible
  undoDismiss
/>`;

const stressCode = `import { Alert, AlertTitle, AlertDescription, KiraAlert } from "@/components/ui/alert"

// Long titles wrap, unbroken IDs break cleanly, empty descriptions omit body gap,
// and copy/timestamp/dismiss/expand coexist inside max-w-xs.
<div className="max-w-xs space-y-4">
  <Alert variant="destructive">
    <AlertTitle>Long wrapping title…</AlertTitle>
    <AlertDescription>…</AlertDescription>
  </Alert>
  <Alert variant="success">
    <AlertTitle>Empty description</AlertTitle>
    <AlertDescription>{""}</AlertDescription>
  </Alert>
  <KiraAlert
    variant="info"
    title="Everything at once"
    description="…"
    copyable
    timestamp={timestamp}
    dismissible
    expandable
    expandedContent="Extra detail stays reachable behind Show more."
  />
</div>`;

const usageCode = `import { Alert, AlertTitle, AlertDescription, AlertActions, KiraAlert } from "@/components/ui/alert"

// Composable
<Alert variant="info">
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
  <AlertActions actions={[{ id: "review", label: "Review", onClick: () => {} }]} />
</Alert>

// Closable / soft / banner / left accent
<Alert variant="warning" closable onClose={() => {}}>…</Alert>
<Alert variant="success-soft">…</Alert>
<Alert variant="warning" banner>…</Alert>
<Alert variant="info" leftAccent>…</Alert>

// KiraAlert (prop-driven)
<KiraAlert
  variant="info"
  title="Update available"
  description="A new version is ready."
  actions={[{ id: "update", label: "Update", onClick: () => {} }]}
  copyable
  timestamp={new Date()}
  dismissible
/>`;

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
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  );
}

function VariantSection({
  heading,
  items,
}: {
  heading?: string;
  items: ReadonlyArray<{
    variant: AlertVariant;
    title: string;
    description: string;
  }>;
}) {
  return (
    <div className="space-y-3">
      {heading !== undefined && (
        <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {heading}
        </p>
      )}
      {items.map((item) => (
        <Alert key={item.variant} variant={item.variant}>
          <AlertTitle>{item.title}</AlertTitle>
          <AlertDescription>{item.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

function VariantsDemo() {
  return (
    <div className="space-y-5">
      <VariantSection items={filledVariantItems} />
      <VariantSection heading="Soft" items={softVariantItems} />
      <VariantSection heading="Outline" items={outlineVariantItems} />
    </div>
  );
}

function SizesDemo() {
  return (
    <div className="space-y-4">
      {alertSizeItems.map((item) => (
        <Alert key={item.size} variant="info" size={item.size}>
          <AlertTitle>{item.label}</AlertTitle>
          <AlertDescription>{item.description}</AlertDescription>
        </Alert>
      ))}
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
          Pass{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            {"icon={null}"}
          </code>{" "}
          to hide it entirely.
        </AlertDescription>
      </Alert>
      <Alert
        variant="default"
        icon={<IconRocket aria-hidden="true" className="h-full w-full" />}
      >
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
  const noneVisible = !alerts.closable1 && !alerts.closable2;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetAlerts}>
          <IconRefresh aria-hidden="true" className="mr-2 size-4" />
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
      {noneVisible && (
        <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          All alerts dismissed. Click Reset Alerts to restore them.
        </div>
      )}
    </div>
  );
}

function SoftBannerDemo() {
  return (
    <div className="space-y-5">
      <VariantSection heading="Soft palette" items={softVariantItems} />

      <div className="space-y-3">
        <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Banner (edge-to-edge)
        </p>
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
      </div>

      <div className="space-y-3">
        <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Left accent
        </p>
        <Alert variant="info" leftAccent>
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            With a coloured left accent border.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive" leftAccent>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            With a coloured left accent border.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

function ActionsDemo() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        <AlertTitle>Review pending changes</AlertTitle>
        <AlertDescription>
          Two configuration updates await approval via AlertActions.
        </AlertDescription>
        <AlertActions
          actions={[
            {
              id: "approve",
              label: "Approve",
              onClick: () => toast.success("Changes approved"),
            },
            {
              id: "later-composable",
              label: "Later",
              variant: "outline",
            },
          ]}
        />
      </Alert>
      <KiraAlert
        variant="info"
        title="New update available"
        description="A new version of the application is ready to install."
        actions={[
          {
            id: "update",
            label: (
              <>
                <IconDownload aria-hidden="true" className="mr-1 size-4" />
                Update
              </>
            ),
            onClick: () => toast.success("Updating…"),
          },
          { id: "later", label: "Later", variant: "outline" },
        ]}
      />
      <KiraAlert
        variant="destructive"
        title="Delete confirmation"
        description="Are you sure? This action cannot be undone."
        actions={[
          {
            id: "delete",
            label: (
              <>
                <IconTrash aria-hidden="true" className="mr-1 size-4" />
                Delete
              </>
            ),
            variant: "destructive",
            onClick: () => toast.error("Deleted"),
          },
          { id: "cancel", label: "Cancel", variant: "outline" },
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
          <pre className="whitespace-pre-wrap rounded-md border border-border/60 bg-muted/60 p-2 font-mono text-xs text-foreground">
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
          <ul className="list-disc space-y-1 pl-4 text-sm">
            <li>PR 482 — migration on users table (Maria)</li>
            <li>PR 483 — copy change on pricing page (Sam)</li>
            <li>PR 487 — dependency bump: react 19.3.1 (Priya)</li>
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
        icon={
          <IconBell aria-hidden="true" className="h-full w-full text-info" />
        }
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
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetKey((prev) => prev + 1)}
        >
          <IconRefresh aria-hidden="true" className="mr-2 size-4" />
          Reset Alert
        </Button>
      </div>
      <KiraAlert
        key={resetKey}
        variant="success"
        icon={<IconSparkles aria-hidden="true" className="h-full w-full" />}
        title="Payment successful"
        description="Your payment of $29.99 has been processed. A receipt has been sent to your email address."
        actions={[
          {
            id: "view-receipt",
            label: "View receipt",
            onClick: () => toast.info("Opening receipt KR-004821…"),
          },
          {
            id: "download-receipt",
            label: "Download",
            variant: "outline",
            onClick: () => toast.success("Receipt PDF downloaded"),
          },
        ]}
        copyable
        copyText="Receipt KR-004821"
        timestamp={T_NOW}
        dismissible
        undoDismiss
      />
    </div>
  );
}

function UndoDismissDemo() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetKey((prev) => prev + 1)}
        >
          <IconRefresh aria-hidden="true" className="mr-2 size-4" />
          Reset Demo
        </Button>
      </div>
      <KiraAlert
        key={resetKey}
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
    <div className="max-w-xs space-y-4">
      <Alert variant="destructive">
        <AlertTitle>
          Record-breaking monsoon rainfall disrupts metropolitan transit
          schedules across the entire coastal region
        </AlertTitle>
        <AlertDescription>
          Transport authorities reported platform flooding at twelve stations
          during Tuesday evening&apos;s commute, with reference token{" "}
          <code className="break-all rounded bg-muted px-1 py-0.5 font-mono text-xs">
            INCIDENT_2026_METRO_COASTAL_GRID_OVERFLOW_ALPHA_9948271
          </code>{" "}
          wrapping cleanly inside a narrow column.
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

export default function AlertPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Alert"
        version="v2.2.0"
        description="Displays a callout for user attention with semantic variants, soft/banner styles, and a prop-driven KiraAlert. For transient notifications, use the toast() API."
      />

      <FeatureGrid
        features={alertPageFeatures}
        description="Inline callout capabilities built into Kira Kit."
      />

      <DemoTabs tabs={alertPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        title="Keyboard shortcuts"
        description="Alert is a static region with standard button controls (no Base UI primitive underneath; follows WAI-ARIA alert guidance)."
        shortcuts={alertPageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose Alert primitives or pass props to KiraAlert."
        notes={alertPageUsageNotes}
      />

      <APIReference
        sections={alertPageAPISections}
        title="API reference"
        description="Props, types, and defaults for every exported Alert part."
      />

      <Changelog
        entries={alertPageChangelogEntries}
        title="Changelog"
        description="Version history for the alert component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const filledVariantItems = [
  {
    variant: "default",
    title: "Default",
    description: "This is a default alert with neutral styling.",
  },
  {
    variant: "info",
    title: "Information",
    description: "This is an informational alert with helpful context.",
  },
  {
    variant: "success",
    title: "Success",
    description: "Your action was completed successfully.",
  },
  {
    variant: "warning",
    title: "Warning",
    description: "Please review this information carefully before proceeding.",
  },
  {
    variant: "destructive",
    title: "Error",
    description: "Something went wrong. Please try again later.",
  },
] as const;

const softVariantItems = [
  {
    variant: "info-soft",
    title: "Information",
    description: "Softer, tinted background.",
  },
  {
    variant: "success-soft",
    title: "Saved",
    description: "Your changes were saved.",
  },
  {
    variant: "warning-soft",
    title: "Heads up",
    description: "Something needs attention.",
  },
  {
    variant: "destructive-soft",
    title: "Error",
    description: "Something went wrong.",
  },
] as const;

const outlineVariantItems = [
  {
    variant: "outline-default",
    title: "Default",
    description: "Outlined, no fill.",
  },
  {
    variant: "outline-info",
    title: "Information",
    description: "Outlined informational alert.",
  },
  {
    variant: "outline-success",
    title: "Success",
    description: "Outlined success alert.",
  },
  {
    variant: "outline-warning",
    title: "Warning",
    description: "Outlined warning alert.",
  },
  {
    variant: "outline-destructive",
    title: "Error",
    description: "Outlined error alert.",
  },
] as const;

const alertSizeItems = [
  {
    size: "xs",
    label: "Extra Small (xs)",
    description: "Compact padding (p-2) and 12px icon for tight panels.",
  },
  {
    size: "sm",
    label: "Small (sm)",
    description: "Compact padding (p-3) for sidebars and inline notices.",
  },
  {
    size: "default",
    label: "Default (default)",
    description: "Standard padding (p-4) for page-level alerts.",
  },
  {
    size: "lg",
    label: "Large (lg)",
    description: "Generous padding (p-5) and base text for prominent banners.",
  },
] as const;

const alertPageFeatures = [
  {
    title: "Accessible",
    description:
      'Uses role="alert" with proper ARIA attributes, polite copy live regions, and keyboard-pausable undo timers.',
  },
  {
    title: "Semantic Variants",
    description:
      "Filled, soft, outline, banner, left-accent, and four size scales with matching icons.",
  },
  {
    title: "KiraAlert",
    description:
      "One prop-driven component: title, actions, expandable details, copy, timestamp, and undoable dismissal.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const alertPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
    demo: (
      <DemoWrapper
        title="Semantic Variants"
        description="Filled, soft, and outline styles for every semantic tone."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Alert Sizes"
        description="Four size steps (xs, sm, default, lg) scaling padding, icon size, and typography."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "Icons",
    group: "Core",
    demo: (
      <DemoWrapper
        title="With Icons"
        description="Automatic variant icons, hidden icons via icon={null}, and custom icon nodes."
        code={iconsCode}
      >
        <IconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "soft-banner",
    label: "Soft & Banner",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Soft, Banner & Left Accent"
        description="Tinted soft surfaces, edge-to-edge banners, and left-accent borders."
        code={softBannerCode}
      >
        <SoftBannerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "actions",
    label: "Action Row",
    group: "KiraAlert",
    demo: (
      <DemoWrapper
        title="Alerts with Actions"
        description="Use AlertActions directly or pass an actions array to KiraAlert."
        code={actionsCode}
      >
        <ActionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "expandable",
    label: "Expandable",
    group: "KiraAlert",
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
    group: "KiraAlert",
    demo: (
      <DemoWrapper
        title="Copy & Timestamp"
        description="Copy-to-clipboard with polite live-region feedback and a self-updating relative timestamp."
        code={copyCode}
      >
        <CopyTimestampDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraAlert",
    group: "KiraAlert",
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
    value: "dismissible",
    label: "Dismissible",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Dismissible Alerts"
        description="Close with GSAP exit animation; instant under reduced motion."
        code={dismissibleCode}
      >
        <DismissibleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "undo-dismiss",
    label: "Undo Dismiss",
    group: "Behavior",
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
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long titles wrap, unbroken tokens break cleanly, empty descriptions render nothing, and dismiss/copy/expand coexist — all inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const alertPageShortcuts = [
  {
    keys: "Tab",
    group: "Navigation",
    description:
      "Move focus to the next control (close, copy, Show more, action buttons, Undo) — all normal tab stops in DOM order.",
  },
  {
    keys: "Shift + Tab",
    group: "Navigation",
    description: "Move focus to the previous control.",
  },
  {
    keys: "Enter / Space",
    group: "Activation",
    description:
      "Activate the focused button (dismiss, copy, Show more/less toggle, action button, or Undo).",
  },
  {
    keys: "Esc",
    group: "Dismissal",
    description:
      "No behavior — an alert is not a dialog; dismissing relies on the visible close button.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const alertPageUsageNotes = [
  {
    label: "KiraAlert vs Alert primitives",
    body: "Use KiraAlert when you want title, description, actions, copyable text, relative timestamp, expandable details, or undoable dismissal from props; compose Alert, AlertTitle, AlertDescription, and AlertActions for custom markup.",
  },
  {
    label: "Alert vs toast()",
    body: "Alert renders persistent inline status callouts inside the page layout. Reach for toast() from @/components/ui/toast for transient, non-blocking notifications.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const alertPageAPISections = [
  {
    title: "Alert",
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive" | "*-soft" | "outline-*"',
        default: '"default"',
        description: "Visual style variant of the alert.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Padding, typography, and icon scale of the alert.",
      },
      {
        prop: "banner",
        type: "boolean",
        default: "false",
        description:
          "Full-width, edge-to-edge banner (no horizontal border or rounding).",
      },
      {
        prop: "leftAccent",
        type: "boolean",
        default: "false",
        description: "Add a 4px colored left accent border.",
      },
      {
        prop: "showIcon",
        type: "boolean",
        default: "true",
        description: "Show the variant-specific icon.",
      },
      {
        prop: "icon",
        type: "ReactNode | null",
        default: "variant icon",
        description:
          "Override the auto icon, or pass null to hide it entirely.",
      },
      {
        prop: "closable",
        type: "boolean",
        default: "false",
        description:
          "Show a close button in the header row to dismiss the alert.",
      },
      {
        prop: "onClose",
        type: "() => void",
        default: "-",
        description: "Callback invoked after the alert is dismissed.",
      },
      {
        prop: "meta",
        type: "ReactNode",
        default: "-",
        description:
          "Extra header-row content (timestamp, copy) rendered left of the close button on one flex row.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
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
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Heading or body content.",
      },
    ],
  },
  {
    title: "AlertActions",
    props: [
      {
        prop: "actions",
        type: "{ id?: string; label: ReactNode; onClick?: () => void; variant?: ButtonVariant }[]",
        default: "required",
        description:
          "Action button items rendered in a wrapped row below the alert body; first button defaults to 'default' variant, subsequent buttons default to 'outline'.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the actions row.",
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
        description: "Alert heading and body copy.",
      },
      {
        prop: "icon",
        type: "ReactNode | null",
        default: "variant icon",
        description: "Override the auto icon or pass null to hide it.",
      },
      {
        prop: "actions",
        type: "AlertAction[]",
        default: "-",
        description:
          "Action buttons ({ id?, label, onClick?, variant? }) rendered under the body.",
      },
      {
        prop: "expandable / expandedContent",
        type: "boolean / ReactNode",
        default: "false / -",
        description:
          "Collapsible extra content behind a Show more / Show less toggle.",
      },
      {
        prop: "copyable / copyText",
        type: "boolean / string",
        default: "false / description or title",
        description:
          "Copy-to-clipboard button with 1.5s check flash and polite live announcement.",
      },
      {
        prop: "timestamp",
        type: "Date",
        default: "-",
        description:
          "Self-updating relative timestamp (e.g. '2m ago') in the header row.",
      },
      {
        prop: "dismissible",
        type: "boolean",
        default: "false",
        description: "Show a close button.",
      },
      {
        prop: "undoDismiss",
        type: "boolean",
        default: "false",
        description:
          "Dismissing replaces the alert with a 'Dismissed — Undo' strip instead of unmounting immediately.",
      },
      {
        prop: "undoDuration",
        type: "number",
        default: "5000",
        description:
          "How long the undo strip stays visible (ms); pauses on strip hover or focus.",
      },
      {
        prop: "variant / size / banner / leftAccent / showIcon / meta / onClose / children",
        type: 'Omit<AlertProps, "title">',
        default: "Alert defaults",
        description:
          "All underlying Alert styling, header, and lifecycle props.",
      },
    ],
  },
  {
    title: "alertVariants / formatRelativeTime",
    props: [
      {
        prop: "alertVariants",
        type: "cva",
        default: 'variant: "default", size: "default", banner: false',
        description:
          "Exported class-variance-authority recipe for Alert styling.",
      },
      {
        prop: "formatRelativeTime",
        type: "(date: Date, now?: number) => string",
        default: "now = Date.now()",
        description:
          "Formats elapsed time as 'just now', 'Xm ago', 'Xh ago', or 'Xd ago'.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

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
