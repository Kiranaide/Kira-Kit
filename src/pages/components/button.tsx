import {
  Button,
  ExpandableIconButton,
  LoadingButton,
} from "@/components/ui/button";
import {
  IconPlus,
  IconDownload,
  IconTrash,
  IconMail,
  IconSend,
  IconSettings,
  IconHeart,
  IconPlayerPlay,
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

import * as React from "react";

function LoadingButtonDemo() {
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({});

  const handleClick = (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <LoadingButton
        isLoading={loadingStates["default"]}
        onClick={() => handleClick("default")}
      >
        <IconSend data-icon="inline-start" className="w-4 h-4" />
        Submit
      </LoadingButton>
      <LoadingButton
        variant="secondary"
        isLoading={loadingStates["secondary"]}
        onClick={() => handleClick("secondary")}
      >
        <IconDownload data-icon="inline-start" className="w-4 h-4" />
        Save
      </LoadingButton>
      <LoadingButton
        variant="outline"
        isLoading={loadingStates["outline"]}
        onClick={() => handleClick("outline")}
        loadingText="Processing..."
      >
        Process
      </LoadingButton>
      <LoadingButton
        variant="success"
        isLoading={loadingStates["success"]}
        onClick={() => handleClick("success")}
      >
        <IconCircleCheck data-icon="inline-start" className="w-4 h-4" />
        Confirm
      </LoadingButton>
      <LoadingButton
        variant="destructive"
        isLoading={loadingStates["destructive"]}
        onClick={() => handleClick("destructive")}
      >
        <IconTrash data-icon="inline-start" className="w-4 h-4" />
        Delete
      </LoadingButton>
    </div>
  );
}

export function ButtonPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Button</h1>
        <p className="text-muted-foreground">
          A versatile button component with multiple variants and sizes.
        </p>
      </header>

      {/* Variants Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="space-y-6">
          {/* Basic Variants */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Basic
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Destructive Variants */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Destructive
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive">Destructive</Button>
              <Button variant="destructive-outline">Destructive Outline</Button>
              <Button variant="destructive-ghost">Destructive Ghost</Button>
            </div>
          </div>

          {/* Info Variants */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Info
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="info">Info</Button>
              <Button variant="info-outline">Info Outline</Button>
              <Button variant="info-ghost">Info Ghost</Button>
            </div>
          </div>

          {/* Success Variants */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Success
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="success">Success</Button>
              <Button variant="success-outline">Success Outline</Button>
              <Button variant="success-ghost">Success Ghost</Button>
            </div>
          </div>

          {/* Warning Variants */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Warning
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="warning">Warning</Button>
              <Button variant="warning-outline">Warning Outline</Button>
              <Button variant="warning-ghost">Warning Ghost</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs" variant="default">
              Extra Small
            </Button>
            <Button size="xs" variant="secondary">
              Extra Small
            </Button>
            <Button size="xs" variant="outline">
              Extra Small
            </Button>
            <Button size="xs" variant="info">
              Extra Small
            </Button>
            <Button size="xs" variant="success">
              Extra Small
            </Button>
            <Button size="xs" variant="warning">
              Extra Small
            </Button>
            <Button size="xs" variant="destructive">
              Extra Small
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="default">
              Small
            </Button>
            <Button size="sm" variant="secondary">
              Small
            </Button>
            <Button size="sm" variant="outline">
              Small
            </Button>
            <Button size="sm" variant="info">
              Small
            </Button>
            <Button size="sm" variant="success">
              Small
            </Button>
            <Button size="sm" variant="warning">
              Small
            </Button>
            <Button size="sm" variant="destructive">
              Small
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="default" variant="default">
              Default
            </Button>
            <Button size="default" variant="secondary">
              Default
            </Button>
            <Button size="default" variant="outline">
              Default
            </Button>
            <Button size="default" variant="info">
              Default
            </Button>
            <Button size="default" variant="success">
              Default
            </Button>
            <Button size="default" variant="warning">
              Default
            </Button>
            <Button size="default" variant="destructive">
              Default
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" variant="default">
              Large
            </Button>
            <Button size="lg" variant="secondary">
              Large
            </Button>
            <Button size="lg" variant="outline">
              Large
            </Button>
            <Button size="lg" variant="info">
              Large
            </Button>
            <Button size="lg" variant="success">
              Large
            </Button>
            <Button size="lg" variant="warning">
              Large
            </Button>
            <Button size="lg" variant="destructive">
              Large
            </Button>
          </div>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Buttons
        </h2>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon-xs" variant="default">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-xs" variant="secondary">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-xs" variant="outline">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-xs" variant="info">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-xs" variant="success">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-xs" variant="warning">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-xs" variant="destructive">
              <IconPlus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon-sm" variant="default">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="secondary">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="outline">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="info">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="success">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="warning">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="destructive">
              <IconPlus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon" variant="default">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="info">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="success">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="warning">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="destructive">
              <IconPlus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon-lg" variant="default">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="secondary">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="outline">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="info">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="success">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="warning">
              <IconPlus className="w-4 h-4" />
            </Button>
            <Button size="icon-lg" variant="destructive">
              <IconPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">
            <IconMail data-icon="inline-start" className="w-4 h-4" />
            Send Email
          </Button>
          <Button variant="secondary">
            <IconDownload data-icon="inline-start" className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline">
            <IconSettings data-icon="inline-start" className="w-4 h-4" />
            Settings
          </Button>
          <Button variant="info">
            <IconInfoCircle data-icon="inline-start" className="w-4 h-4" />
            Info
          </Button>
          <Button variant="success">
            <IconCircleCheck data-icon="inline-start" className="w-4 h-4" />
            Success
          </Button>
          <Button variant="warning">
            <IconAlertTriangle data-icon="inline-start" className="w-4 h-4" />
            Warning
          </Button>
          <Button variant="destructive">
            <IconTrash data-icon="inline-start" className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </section>

      {/* Hold Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Hold to Confirm
        </h2>
        <p className="text-sm text-muted-foreground">
          Hold the button to execute the action. Release early to cancel.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            holdDuration={1000}
            onHoldComplete={() => alert("Sent!")}
          >
            <IconSend data-icon="inline-start" className="w-4 h-4" />
            Hold to Send
          </Button>
          <Button
            variant="secondary"
            holdDuration={1200}
            onHoldComplete={() => alert("Saved!")}
          >
            <IconDownload data-icon="inline-start" className="w-4 h-4" />
            Hold to Save
          </Button>
          <Button
            variant="info"
            holdDuration={1000}
            onHoldComplete={() => alert("Info confirmed!")}
          >
            <IconInfoCircle data-icon="inline-start" className="w-4 h-4" />
            Hold to Confirm
          </Button>
          <Button
            variant="success"
            holdDuration={1000}
            onHoldComplete={() => alert("Approved!")}
          >
            <IconCircleCheck data-icon="inline-start" className="w-4 h-4" />
            Hold to Approve
          </Button>
          <Button
            variant="warning"
            holdDuration={1500}
            onHoldComplete={() => alert("Warning acknowledged!")}
          >
            <IconAlertTriangle data-icon="inline-start" className="w-4 h-4" />
            Hold to Acknowledge
          </Button>
          <Button
            variant="destructive"
            holdDuration={1500}
            onHoldComplete={() => alert("Deleted!")}
          >
            <IconTrash data-icon="inline-start" className="w-4 h-4" />
            Hold to Delete
          </Button>
        </div>
      </section>

      {/* Expandable Icon Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Expandable Icon Button
        </h2>
        <p className="text-sm text-muted-foreground">
          Icon-only buttons that expand to show text on hover.
        </p>
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Regular
            </h3>
            <div className="flex flex-wrap gap-3">
              <ExpandableIconButton
                icon={<IconSettings className="w-4 h-4" />}
                label="Settings"
                variant="outline"
              />
              <ExpandableIconButton
                icon={<IconHeart className="w-4 h-4" />}
                label="Like"
                variant="secondary"
              />
              <ExpandableIconButton
                icon={<IconPlayerPlay className="w-4 h-4" />}
                label="Play Video"
                variant="default"
              />
              <ExpandableIconButton
                icon={<IconInfoCircle className="w-4 h-4" />}
                label="Info"
                variant="info"
              />
              <ExpandableIconButton
                icon={<IconCircleCheck className="w-4 h-4" />}
                label="Success"
                variant="success"
              />
              <ExpandableIconButton
                icon={<IconAlertTriangle className="w-4 h-4" />}
                label="Warning"
                variant="warning"
              />
              <ExpandableIconButton
                icon={<IconTrash className="w-4 h-4" />}
                label="Delete"
                variant="destructive"
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              With Hold to Confirm
            </h3>
            <div className="flex flex-wrap gap-3">
              <ExpandableIconButton
                icon={<IconSend className="w-4 h-4" />}
                label="Send"
                variant="default"
                holdDuration={1000}
                onHoldComplete={() => alert("Sent!")}
              />
              <ExpandableIconButton
                icon={<IconDownload className="w-4 h-4" />}
                label="Save"
                variant="secondary"
                holdDuration={1200}
                onHoldComplete={() => alert("Saved!")}
              />
              <ExpandableIconButton
                icon={<IconInfoCircle className="w-4 h-4" />}
                label="Confirm"
                variant="info"
                holdDuration={1000}
                onHoldComplete={() => alert("Confirmed!")}
              />
              <ExpandableIconButton
                icon={<IconCircleCheck className="w-4 h-4" />}
                label="Approve"
                variant="success"
                holdDuration={1000}
                onHoldComplete={() => alert("Approved!")}
              />
              <ExpandableIconButton
                icon={<IconAlertTriangle className="w-4 h-4" />}
                label="Acknowledge"
                variant="warning"
                holdDuration={1500}
                onHoldComplete={() => alert("Acknowledged!")}
              />
              <ExpandableIconButton
                icon={<IconTrash className="w-4 h-4" />}
                label="Delete"
                variant="destructive"
                holdDuration={1500}
                onHoldComplete={() => alert("Deleted!")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Loading Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading Button
        </h2>
        <p className="text-sm text-muted-foreground">
          Buttons with loading spinners for async operations. Automatically
          disabled while loading.
        </p>
        <LoadingButtonDemo />
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled Default</Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="outline" disabled>
            Disabled Outline
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
            {`import { Button, ExpandableIconButton } from "@/components/ui/button"

// Basic
<Button>Click me</Button>

// Hold to confirm (use onHoldComplete prop)
<Button
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
  variant="destructive"
>
  Hold to Delete
</Button>

// Expandable icon
<ExpandableIconButton
  icon={<IconSettings />}
  label="Settings"
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
