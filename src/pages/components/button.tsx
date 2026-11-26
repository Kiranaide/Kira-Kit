import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconAccessible,
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconDownload,
  IconHeart,
  IconInfoCircle,
  IconMail,
  IconPalette,
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
  IconSend,
  IconSettings,
  IconStack2,
  IconStar,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
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
import {
  Button,
  ExpandableIconButton,
  KiraButton,
  LoadingButton,
} from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Basic
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Semantic
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="destructive">Destructive</Button>
          <Button variant="info">Info</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Outline Variants
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="destructive-outline">Destructive</Button>
          <Button variant="info-outline">Info</Button>
          <Button variant="success-outline">Success</Button>
          <Button variant="warning-outline">Warning</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Ghost Variants
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="destructive-ghost">Destructive</Button>
          <Button variant="info-ghost">Info</Button>
          <Button variant="success-ghost">Success</Button>
          <Button variant="warning-ghost">Warning</Button>
        </div>
      </div>
    </div>
  );
}

const variantsCode = `import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button variant="destructive">Destructive</Button>
<Button variant="info">Info</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

<Button variant="destructive-outline">Destructive</Button>
<Button variant="info-ghost">Info</Button>`;

function SizesDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="icon-xs"
          variant="outline"
          aria-label="Add item (extra small)"
        >
          <IconPlus className="w-3 h-3" aria-hidden="true" />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Add item (small)">
          <IconPlus className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Add item">
          <IconPlus className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button size="icon-lg" variant="outline" aria-label="Add item (large)">
          <IconPlus className="w-5 h-5" aria-hidden="true" />
        </Button>
        <Button
          size="icon-xl"
          variant="outline"
          aria-label="Add item (extra large)"
        >
          <IconPlus className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

const sizesCode = `import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

<Button size="icon-xs" aria-label="Add item"><IconPlus aria-hidden="true" /></Button>
<Button size="icon-sm" aria-label="Add item"><IconPlus aria-hidden="true" /></Button>
<Button size="icon" aria-label="Add item"><IconPlus aria-hidden="true" /></Button>
<Button size="icon-lg" aria-label="Add item"><IconPlus aria-hidden="true" /></Button>
<Button size="icon-xl" aria-label="Add item"><IconPlus aria-hidden="true" /></Button>`;

function WithIconsDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">
        <IconMail
          data-icon="inline-start"
          className="w-4 h-4"
          aria-hidden="true"
        />
        Send Email
      </Button>
      <Button variant="secondary">
        <IconDownload
          data-icon="inline-start"
          className="w-4 h-4"
          aria-hidden="true"
        />
        Download
      </Button>
      <Button variant="outline">
        <IconSettings
          data-icon="inline-start"
          className="w-4 h-4"
          aria-hidden="true"
        />
        Settings
      </Button>
      <Button variant="success">
        <IconCircleCheck
          data-icon="inline-start"
          className="w-4 h-4"
          aria-hidden="true"
        />
        Confirm
      </Button>
      <Button variant="destructive">
        <IconTrash
          data-icon="inline-start"
          className="w-4 h-4"
          aria-hidden="true"
        />
        Delete
      </Button>
    </div>
  );
}

const withIconsCode = `import { Button } from "@/components/ui/button"
import { IconMail, IconDownload } from "@tabler/icons-react"

<Button variant="default">
  <IconMail data-icon="inline-start" className="w-4 h-4" aria-hidden="true" />
  Send Email
</Button>

<Button variant="secondary">
  <IconDownload data-icon="inline-start" className="w-4 h-4" aria-hidden="true" />
  Download
</Button>`;

function FlexibleChildrenSection() {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Flexible Children (Still Supported)
      </h3>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline">
          <span className="flex items-center gap-2">
            <IconSettings className="w-4 h-4" aria-hidden="true" />
            <span>Custom Layout</span>
          </span>
        </Button>
        <Button variant="success">
          <span className="flex items-center gap-2">
            <IconCircleCheck className="w-4 h-4" aria-hidden="true" />
            <span>Success with Badge</span>
            <span className="bg-success-foreground/20 text-success-foreground text-xs px-2 py-0.5 rounded">
              3
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}

function IconPropsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Using leftIcon and rightIcon Props (Recommended)
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
          >
            Send Email
          </Button>
          <Button
            variant="secondary"
            leftIcon={<IconDownload className="w-4 h-4" aria-hidden="true" />}
          >
            Download
          </Button>
          <Button
            variant="outline"
            rightIcon={
              <IconArrowRight className="w-4 h-4" aria-hidden="true" />
            }
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            leftIcon={<IconArrowLeft className="w-4 h-4" aria-hidden="true" />}
          >
            Back
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Both Icons
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="default"
            leftIcon={<IconRefresh className="w-4 h-4" aria-hidden="true" />}
            rightIcon={
              <IconArrowRight className="w-4 h-4" aria-hidden="true" />
            }
          >
            Sync &amp; Continue
          </Button>
          <Button
            variant="secondary"
            leftIcon={<IconUpload className="w-4 h-4" aria-hidden="true" />}
            rightIcon={
              <IconArrowRight className="w-4 h-4" aria-hidden="true" />
            }
          >
            Upload Files
          </Button>
        </div>
      </div>
      <FlexibleChildrenSection />
    </div>
  );
}

const iconPropsCode = `import { Button } from "@/components/ui/button"
import { IconMail, IconArrowRight, IconRefresh } from "@tabler/icons-react"

<Button
  variant="default"
  leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
>
  Send Email
</Button>

<Button
  variant="outline"
  rightIcon={<IconArrowRight className="w-4 h-4" aria-hidden="true" />}
>
  Continue
</Button>

<Button
  leftIcon={<IconRefresh className="w-4 h-4" aria-hidden="true" />}
  rightIcon={<IconArrowRight className="w-4 h-4" aria-hidden="true" />}
>
  Sync & Continue
</Button>`;

function HoldToConfirmDemo() {
  const [status, setStatus] = React.useState("Ready");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hold the button (pointer or Enter/Space) to execute the action. Release
        early to cancel.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          holdDuration={1000}
          onHoldComplete={() => setStatus("Sent!")}
          leftIcon={<IconSend className="w-4 h-4" aria-hidden="true" />}
        >
          Hold to Send
        </Button>
        <Button
          variant="success"
          holdDuration={1000}
          onHoldComplete={() => setStatus("Approved!")}
          leftIcon={<IconCircleCheck className="w-4 h-4" aria-hidden="true" />}
        >
          Hold to Approve
        </Button>
        <Button
          variant="destructive"
          holdDuration={1500}
          onHoldComplete={() => setStatus("Deleted!")}
          leftIcon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
        >
          Hold to Delete
        </Button>
      </div>
      <output className="block text-xs text-muted-foreground">
        Status: {status}
      </output>
    </div>
  );
}

const holdToConfirmCode = `import { Button } from "@/components/ui/button"
import { IconTrash, IconCircleCheck } from "@tabler/icons-react"

<Button
  variant="destructive"
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
  leftIcon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
>
  Hold to Delete
</Button>

<Button
  variant="success"
  holdDuration={1000}
  onHoldComplete={() => handleApprove()}
  leftIcon={<IconCircleCheck className="w-4 h-4" aria-hidden="true" />}
>
  Hold to Approve
</Button>`;

function ExpandableDemo() {
  const [status, setStatus] = React.useState("Hover an icon to expand");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Icon-only buttons that expand to show text on hover.
      </p>
      <div className="flex flex-wrap gap-3">
        <ExpandableIconButton
          icon={<IconSettings className="w-4 h-4" aria-hidden="true" />}
          label="Settings"
          variant="outline"
        />
        <ExpandableIconButton
          icon={<IconHeart className="w-4 h-4" aria-hidden="true" />}
          label="Like"
          variant="secondary"
        />
        <ExpandableIconButton
          icon={<IconPlayerPlay className="w-4 h-4" aria-hidden="true" />}
          label="Play Video"
          variant="default"
        />
        <ExpandableIconButton
          icon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
          label="Delete"
          variant="destructive"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          With Hold to Confirm
        </h4>
        <div className="flex flex-wrap gap-3">
          <ExpandableIconButton
            icon={<IconSend className="w-4 h-4" aria-hidden="true" />}
            label="Send"
            variant="default"
            holdDuration={1000}
            onHoldComplete={() => setStatus("Sent via expandable button")}
          />
          <ExpandableIconButton
            icon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
            label="Delete"
            variant="destructive"
            holdDuration={1500}
            onHoldComplete={() => setStatus("Deleted via expandable button")}
          />
        </div>
      </div>
      <output className="block text-xs text-muted-foreground">{status}</output>
    </div>
  );
}

const expandableCode = `import { ExpandableIconButton } from "@/components/ui/button"
import { IconSettings, IconTrash } from "@tabler/icons-react"

<ExpandableIconButton
  icon={<IconSettings className="w-4 h-4" aria-hidden="true" />}
  label="Settings"
  variant="outline"
/>

<ExpandableIconButton
  icon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
  label="Delete"
  variant="destructive"
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
/>`;

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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Buttons with loading spinners for async operations. Automatically
        disabled while loading.
      </p>
      <div className="flex flex-wrap gap-3">
        <LoadingButton
          isLoading={loadingStates["default"]}
          onClick={() => handleClick("default")}
          leftIcon={<IconSend className="w-4 h-4" aria-hidden="true" />}
        >
          Submit
        </LoadingButton>
        <LoadingButton
          variant="secondary"
          isLoading={loadingStates["secondary"]}
          onClick={() => handleClick("secondary")}
          leftIcon={<IconDownload className="w-4 h-4" aria-hidden="true" />}
        >
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
          variant="destructive"
          isLoading={loadingStates["destructive"]}
          onClick={() => handleClick("destructive")}
          leftIcon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
        >
          Delete
        </LoadingButton>
      </div>
    </div>
  );
}

const loadingButtonCode = `import { LoadingButton } from "@/components/ui/button"

<LoadingButton isLoading={isLoading} onClick={() => handleSubmit()}>
  Submit
</LoadingButton>

<LoadingButton isLoading={isLoading} loadingText="Processing...">
  Process
</LoadingButton>`;

function IconButtonTooltipDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Icon-only buttons with descriptive tooltips for accessibility.
      </p>
      <div className="flex flex-wrap gap-3">
        <SimpleTooltip content="Settings">
          <Button variant="outline" size="icon" aria-label="Settings">
            <IconSettings className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="Add to favorites">
          <Button variant="secondary" size="icon" aria-label="Add to favorites">
            <IconHeart className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="Download file">
          <Button variant="default" size="icon" aria-label="Download file">
            <IconDownload className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="Delete item">
          <Button variant="destructive" size="icon" aria-label="Delete item">
            <IconTrash className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="More information">
          <Button variant="info" size="icon" aria-label="More information">
            <IconInfoCircle className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="Complete all required fields before submitting.">
          <Button
            disabled
            focusableWhenDisabled
            size="icon"
            aria-label="Submit"
          >
            <IconSend className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}

const iconButtonTooltipCode = `import { Button } from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { IconSettings, IconTrash, IconSend } from "@tabler/icons-react"

<SimpleTooltip content="Settings">
  <Button variant="outline" size="icon" aria-label="Settings">
    <IconSettings className="w-4 h-4" aria-hidden="true" />
  </Button>
</SimpleTooltip>

<SimpleTooltip content="Complete all required fields before submitting.">
  <Button disabled focusableWhenDisabled size="icon" aria-label="Submit">
    <IconSend className="w-4 h-4" aria-hidden="true" />
  </Button>
</SimpleTooltip>`;

function DisabledDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button disabled>Disabled Default</Button>
        <Button variant="secondary" disabled>
          Disabled Secondary
        </Button>
        <Button variant="outline" disabled>
          Disabled Outline
        </Button>
        <Button variant="destructive" disabled>
          Disabled Destructive
        </Button>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Focusable when disabled (keyboard users can reach and inspect it)
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button disabled focusableWhenDisabled>
            Reachable by Tab
          </Button>
        </div>
      </div>
    </div>
  );
}

const disabledCode = `import { Button } from "@/components/ui/button"

<Button disabled>Disabled Default</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>
<Button variant="outline" disabled>Disabled Outline</Button>

// Stays keyboard-focusable while disabled (WCAG 2.2)
<Button disabled focusableWhenDisabled>Reachable by Tab</Button>`;

function KiraButtonIconsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">Icons</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Icons via leftIcon and rightIcon, consistent across Button and
          KiraButton.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border">
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
        >
          Send Email
        </KiraButton>
        <KiraButton
          variant="outline"
          rightIcon={<IconArrowRight className="w-4 h-4" aria-hidden="true" />}
        >
          Continue
        </KiraButton>
      </div>
    </div>
  );
}

function KiraButtonAllVariantsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-2">All Variants</h3>
        <p className="text-sm text-muted-foreground mb-4">
          KiraButton supports all button variants with consistent behavior.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg border">
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
          size="sm"
        >
          Default
        </KiraButton>
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
          variant="secondary"
          size="sm"
        >
          Secondary
        </KiraButton>
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
          variant="outline"
          size="sm"
        >
          Outline
        </KiraButton>
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}
          variant="ghost"
          size="sm"
        >
          Ghost
        </KiraButton>
        <KiraButton
          leftIcon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
          variant="destructive"
          size="sm"
        >
          Destructive
        </KiraButton>
        <KiraButton
          leftIcon={<IconInfoCircle className="w-4 h-4" aria-hidden="true" />}
          variant="info"
          size="sm"
        >
          Info
        </KiraButton>
        <KiraButton
          leftIcon={<IconCircleCheck className="w-4 h-4" aria-hidden="true" />}
          variant="success"
          size="sm"
        >
          Success
        </KiraButton>
        <KiraButton
          leftIcon={<IconAlertCircle className="w-4 h-4" aria-hidden="true" />}
          variant="warning"
          size="sm"
        >
          Warning
        </KiraButton>
      </div>
    </div>
  );
}

function KiraButtonDemo() {
  const [loading, setLoading] = React.useState(false);

  const handleLoadingClick = async () => {
    setLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <KiraButtonIconsSection />

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Loading</h3>
          <p className="text-sm text-muted-foreground mb-4">
            KiraButton disables itself and shows a spinner while loading is set.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border">
          <KiraButton loading={loading} onClick={handleLoadingClick}>
            Run Action
          </KiraButton>
          <KiraButton loading loadingText="Saving..." variant="secondary">
            Save
          </KiraButton>
        </div>
      </div>

      <KiraButtonAllVariantsSection />
    </div>
  );
}

const kiraButtonCode = `import { KiraButton } from "@/components/ui/button"
import { IconMail, IconHeart } from "@tabler/icons-react"

<KiraButton leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}>
  Send Email
</KiraButton>

<KiraButton loading={isLoading} onClick={handleRun}>
  Run Action
</KiraButton>

<KiraButton
  toggle
  variant="outline"
  pressedIcon={<IconHeart className="w-4 h-4 text-destructive fill-destructive" aria-hidden="true" />}
  unpressedIcon={<IconHeart className="w-4 h-4" aria-hidden="true" />}
  onToggle={async (pressed) => {
    await likePost(pressed)
  }}
>
  Like
</KiraButton>`;

const flaky = (setter: (v: boolean) => void, next: boolean) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.33) {
        reject(new Error("network"));
      } else {
        setter(next);
        resolve();
      }
    }, 600);
  });

function ToggleDemo() {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Optimistic toggle (flips instantly, reverts on failure)
        </h3>
        <div className="flex flex-wrap gap-3">
          <KiraButton
            toggle
            variant="outline"
            pressed={liked}
            pressedIcon={
              <IconHeart
                className="w-4 h-4 text-destructive fill-destructive"
                aria-hidden="true"
              />
            }
            unpressedIcon={<IconHeart className="w-4 h-4" aria-hidden="true" />}
            onToggle={(next) => flaky(setLiked, next)}
          >
            {liked ? "Liked" : "Like"}
          </KiraButton>
          <KiraButton
            toggle
            variant="outline"
            pressed={bookmarked}
            pressedIcon={
              <IconStar
                className="w-4 h-4 text-warning fill-warning"
                aria-hidden="true"
              />
            }
            unpressedIcon={<IconStar className="w-4 h-4" aria-hidden="true" />}
            onToggle={(next) => flaky(setBookmarked, next)}
          >
            {bookmarked ? "Saved" : "Save"}
          </KiraButton>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          The request fails ~1 in 3 times to demonstrate automatic rollback.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Disabled with a reason (hover the button)
        </h3>
        <SimpleTooltip content="Complete all required fields before submitting.">
          <Button disabled focusableWhenDisabled aria-label="Submit">
            <IconSend className="w-4 h-4" aria-hidden="true" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}

const toggleCode = `import { KiraButton } from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { IconHeart, IconSend } from "@tabler/icons-react"

<KiraButton
  toggle
  variant="outline"
  defaultPressed={false}
  pressedIcon={<IconHeart className="w-4 h-4 text-destructive fill-destructive" aria-hidden="true" />}
  unpressedIcon={<IconHeart className="w-4 h-4" aria-hidden="true" />}
  onToggle={async (pressed) => {
    await likePost(pressed)
  }}
>
  Like
</KiraButton>

<SimpleTooltip content="Complete the form first">
  <Button disabled focusableWhenDisabled aria-label="Submit">
    <IconSend className="w-4 h-4" aria-hidden="true" />
  </Button>
</SimpleTooltip>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4 rounded-lg border border-border p-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Long labels &amp; fullWidth in narrow container
        </p>
        <Button fullWidth className="whitespace-normal h-auto py-2 text-left">
          Export Quarterly Compliance Audit Report (PDF + CSV Archive)
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Disabled, focusable-when-disabled, and loading states
        </p>
        <div className="flex flex-wrap gap-2">
          <Button disabled>Disabled</Button>
          <Button disabled focusableWhenDisabled variant="outline">
            Tabbable Disabled
          </Button>
          <KiraButton loading loadingText="Syncing..." variant="secondary">
            Sync
          </KiraButton>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Icon-only &amp; disabled reason tooltip
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="icon" variant="outline" aria-label="Empty text action">
            <IconPlus className="w-4 h-4" aria-hidden="true" />
          </Button>
          <SimpleTooltip content="You do not have permission to delete this record.">
            <Button
              disabled
              focusableWhenDisabled
              size="icon"
              variant="destructive-outline"
              aria-label="Delete"
            >
              <IconTrash className="w-4 h-4" aria-hidden="true" />
            </Button>
          </SimpleTooltip>
        </div>
      </div>
    </div>
  );
}

const stressCode = `import { Button, KiraButton } from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"

<div className="max-w-xs space-y-4">
  <Button fullWidth className="whitespace-normal h-auto py-2 text-left">
    Export Quarterly Compliance Audit Report (PDF + CSV Archive)
  </Button>
  <Button disabled focusableWhenDisabled variant="outline">
    Tabbable Disabled
  </Button>
  <KiraButton loading loadingText="Syncing..." variant="secondary">
    Sync
  </KiraButton>
  <SimpleTooltip content="You do not have permission to delete this record.">
    <Button disabled focusableWhenDisabled size="icon" aria-label="Delete">
      <IconTrash className="w-4 h-4" aria-hidden="true" />
    </Button>
  </SimpleTooltip>
</div>`;

const usageCode = `import {
  Button,
  KiraButton,
  LoadingButton,
  ExpandableIconButton,
} from "@/components/ui/button"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { IconMail, IconTrash } from "@tabler/icons-react"

<Button leftIcon={<IconMail className="w-4 h-4" aria-hidden="true" />}>
  Send Email
</Button>

<Button
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
  variant="destructive"
  leftIcon={<IconTrash className="w-4 h-4" aria-hidden="true" />}
>
  Hold to Delete
</Button>

<KiraButton loading={isLoading} onClick={handleSubmit}>
  Submit
</KiraButton>

<SimpleTooltip content="Delete item">
  <Button variant="destructive" size="icon" aria-label="Delete item">
    <IconTrash className="w-4 h-4" aria-hidden="true" />
  </Button>
</SimpleTooltip>`;

export default function ButtonPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Button"
        description="A versatile Base UI button family with semantic variants, five height tiers, hold-to-confirm, loading spinners, and optimistic toggles."
        version="v3.0.0"
      />

      <FeatureGrid
        features={buttonPageFeatures}
        description="Built on Base UI Button with reduced-motion-gated GSAP feedback."
      />

      <DemoTabs defaultValue="variants" tabs={buttonPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={buttonPageShortcuts}
        description="Keyboard activation, focus, and hold-to-confirm bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import Button for standard actions or KiraButton for loading and optimistic toggle flows."
        notes={buttonPageUsageNotes}
      />

      <APIReference
        sections={buttonPageAPISections}
        description="Props, types, and defaults for every exported button component."
      />

      <Changelog
        entries={buttonPageChangelogEntries}
        title="Changelog"
        description="Version history for Button."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const buttonPageFeatures = [
  {
    title: "Accessible",
    description:
      "Full keyboard navigation, focusableWhenDisabled support, and ARIA attributes for screen readers.",
    icon: (
      <IconAccessible className="w-4 h-4 text-primary" aria-hidden="true" />
    ),
  },
  {
    title: "Multiple Variants",
    description:
      "17 variants including solid, outline, and ghost styles for semantic states.",
    icon: <IconPalette className="w-4 h-4 text-primary" aria-hidden="true" />,
  },
  {
    title: "Composable",
    description:
      "KiraButton, LoadingButton, and ExpandableIconButton built on Button.",
    icon: <IconStack2 className="w-4 h-4 text-primary" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const buttonPageDemoTabs = [
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Button Variants"
        description="All available button variants including semantic colors."
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
        title="Size Variants"
        description="Text and icon button sizes from extra small (xs) to extra large (xl)."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "With Icons",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Buttons with Icons"
        description="Combine icons with text using inline children."
        code={withIconsCode}
      >
        <WithIconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icon-props",
    label: "Icon Props",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Icon Props API"
        description="Use leftIcon and rightIcon props for consistent spacing, or flexible children for custom layouts."
        code={iconPropsCode}
      >
        <IconPropsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled",
    label: "Disabled",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Disabled State"
        description="Standard disabled buttons and keyboard-focusable disabled buttons."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira-button",
    label: "KiraButton",
    group: "KiraButton",
    demo: (
      <DemoWrapper
        title="KiraButton"
        description="Unified wrapper adding loading state and optimistic toggle support on top of Button."
        code={kiraButtonCode}
      >
        <KiraButtonDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "toggle",
    label: "Optimistic Toggle",
    group: "KiraButton",
    demo: (
      <DemoWrapper
        title="Optimistic Toggle & Disabled Reason"
        description="Toggle buttons update instantly and roll back automatically if the async handler rejects."
        code={toggleCode}
      >
        <ToggleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "hold",
    label: "Hold to Confirm",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Hold to Confirm"
        description="Prevent accidental clicks with a pointer and keyboard hold-to-confirm progress fill."
        code={holdToConfirmCode}
      >
        <HoldToConfirmDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "expandable",
    label: "Expandable",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Expandable Icon Button"
        description="Icon buttons that smoothly expand to reveal labels on hover."
        code={expandableCode}
      >
        <ExpandableDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Loading Button"
        description="Buttons with loading spinners and aria-busy for async operations."
        code={loadingButtonCode}
      >
        <LoadingButtonDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "tooltip",
    label: "With Tooltip",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Icon Button with Tooltip"
        description="Icon buttons with descriptive tooltips and optional disabledReason explanations."
        code={iconButtonTooltipCode}
      >
        <IconButtonTooltipDemo />
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
        description="Long labels, disabled and loading states, and icon-only controls in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const buttonPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move focus to the next or previous control (includes disabled buttons when focusableWhenDisabled is true).",
  },
  {
    keys: "Enter / Space",
    description: "Activate the focused button (provided by Base UI Button).",
  },
  {
    keys: "Hold Enter / Space",
    description:
      "Fill and complete a hold-to-confirm button when onHoldComplete is set; releasing early cancels.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const buttonPageUsageNotes = [
  {
    label: "Button",
    body: "Use Button directly for standard actions, icon buttons, fullWidth layouts, and hold-to-confirm destructive actions.",
  },
  {
    label: "KiraButton",
    body: "Use KiraButton when you need built-in loading spinners or optimistic toggle buttons with automatic rollback and error feedback.",
  },
  {
    label: "Specialized wrappers",
    body: "Compose SimpleTooltip with Button to explain an icon-only action. Use LoadingButton for explicit loading control and ExpandableIconButton for labels revealed on hover.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const buttonPageAPISections = [
  {
    title: "Button",
    props: [
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "destructive-outline" | "destructive-ghost" | "info" | "info-outline" | "info-ghost" | "success" | "success-outline" | "success-ghost" | "warning" | "warning-outline" | "warning-ghost"',
        default: '"default"',
        description: "Visual style of the button.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl" | "icon-xs" | "icon-sm" | "icon" | "icon-lg" | "icon-xl"',
        default: '"default"',
        description: "Height tier or square icon size of the button.",
      },
      {
        prop: "fullWidth",
        type: "boolean",
        default: "false",
        description: "Stretch the button to fill its container width.",
      },
      {
        prop: "leftIcon",
        type: "ReactNode",
        default: "-",
        description: "Icon rendered before the label.",
      },
      {
        prop: "rightIcon",
        type: "ReactNode",
        default: "-",
        description: "Icon rendered after the label.",
      },
      {
        prop: "holdDuration",
        type: "number",
        default: "1000",
        description:
          "Duration in milliseconds to hold before triggering onHoldComplete.",
      },
      {
        prop: "onHoldComplete",
        type: "() => void",
        default: "-",
        description:
          "Callback invoked when the hold-to-confirm progress reaches 100%.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable pointer and activation interactions.",
      },
      {
        prop: "focusableWhenDisabled",
        type: "boolean",
        default: "false",
        description:
          "Keep a disabled button keyboard-focusable (Base UI primitive, WCAG 2.2).",
      },
    ],
  },
  {
    title: "LoadingButton",
    props: [
      {
        prop: "isLoading",
        type: "boolean",
        default: "false",
        description: "Show loading spinner, set aria-busy, and disable button.",
      },
      {
        prop: "loadingText",
        type: "string",
        default: "-",
        description: "Optional replacement text shown while loading.",
      },
      {
        prop: "...props",
        type: "ButtonProps",
        default: "-",
        description: "All Button props are supported.",
      },
    ],
  },
  {
    title: "ExpandableIconButton",
    props: [
      {
        prop: "icon",
        type: "ReactNode",
        default: "-",
        description: "Icon element always visible in the button.",
      },
      {
        prop: "label",
        type: "string",
        default: "-",
        description:
          "Accessible aria-label and text label revealed smoothly on hover.",
      },
      {
        prop: "expandDirection",
        type: '"left" | "right"',
        default: '"right"',
        description: "Direction in which the label expands on hover.",
      },
      {
        prop: "...props",
        type: "Omit<ButtonProps, 'children'>",
        default: "-",
        description: "All Button props except children are supported.",
      },
    ],
  },
  {
    title: "KiraButton",
    props: [
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Show spinner, set aria-busy, and disable the button.",
      },
      {
        prop: "loadingText",
        type: "string",
        default: "-",
        description: "Optional text displayed while loading.",
      },
      {
        prop: "toggle",
        type: "boolean",
        default: "false",
        description: "Enable optimistic toggle mode with aria-pressed.",
      },
      {
        prop: "pressed / defaultPressed",
        type: "boolean",
        default: "false",
        description: "Controlled or uncontrolled pressed state.",
      },
      {
        prop: "onToggle",
        type: "(pressed: boolean) => void | Promise<void>",
        default: "-",
        description:
          "Async toggle handler. Rejection rolls back the optimistic pressed state.",
      },
      {
        prop: "pressedIcon / unpressedIcon",
        type: "ReactNode",
        default: "-",
        description: "Icons rendered for the pressed and unpressed states.",
      },
      {
        prop: "toggleErrorMessage",
        type: "string",
        default: '"Couldn\'t update"',
        description:
          "Error title sent to the app feedback provider when onToggle rejects.",
      },
      {
        prop: "onToggleError",
        type: "(error: Error) => void",
        default: "-",
        description:
          "Handles a rejected toggle in place of the app feedback provider.",
      },
      {
        prop: "...props",
        type: "Omit<ButtonProps, 'onToggle'>",
        default: "-",
        description: "All Button props are supported.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const buttonPageChangelogEntries = [
  {
    version: "3.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "breaking",
        title:
          "Removed IconButtonWithTooltip and direct toast/tooltip dependencies",
        description:
          "Deleted IconButtonWithTooltip (compose Tooltip around Button directly). Removed direct tooltip and toast imports so Button has 0 UI component dependencies; KiraButton optimistic failures now route through useOptimisticCommit.",
      },
      {
        type: "changed",
        title: "CSS micro-motion and Base UI render/nativeButton support",
        description:
          "Migrated press, ripple, hold-to-confirm, and expand animations from GSAP onto Tailwind CSS keyframes/WAAPI (removing gsap and @gsap/react), and exposed Base UI render and nativeButton props on ButtonProps.",
      },
    ],
  },
  {
    version: "2.4.0",
    date: "18 November 2026",
    changes: [
      {
        type: "added",
        title: "xl and icon-xl Sizes",
        description:
          "New h-11 (44px) xl size with text-base and size-5 icons, plus the matching icon-xl square. Completes the shared control-height ladder (h-7/8/9/10/11) and the 44px touch minimum for auth, marketing, and touch surfaces.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "17 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Removed Thin Wrapper Components",
        description:
          "Deleted HoldButton, CopyButton, ButtonWithLabel, CompoundButton, AsyncButton, and QuickActionButton — plain <Button> covers all of them. Also removed the getButtonIconSize export.",
      },
      {
        type: "breaking",
        title: "KiraButton Slimmed to Toggle + Loading",
        description:
          "Removed icon/iconPosition (use leftIcon/rightIcon), tooltip/disabledReason (use IconButtonWithTooltip), expandable, onAsyncClick + async props, copyText + copy props, formLabel + form props, quickAction, and compound code paths. Kept toggle, loading, and the optimistic onToggle behavior.",
      },
      {
        type: "breaking",
        title: "Removed rippleColor and progressColor Props",
        description:
          "Ripple and hold-progress visuals now use currentColor (the button's text color), which always contrasts with the variant background.",
      },
      {
        type: "changed",
        title: "forwardRef Removed",
        description:
          "React 19 ref-as-prop: Button and ExpandableIconButton take ref as a regular prop now.",
      },
      {
        type: "changed",
        title: "LG Spinner Size",
        description:
          "The loading spinner at size lg is now 20px (h-5 w-5, up from 18px), matching getButtonIconSize.",
      },
      {
        type: "added",
        title: "focusableWhenDisabled",
        description:
          "Button passes focusableWhenDisabled through to the Base UI Button primitive (default false). Disabled buttons stay keyboard-reachable so users can inspect them — WCAG 2.2.",
      },
      {
        type: "added",
        title: "IconButtonWithTooltip disabledReason",
        description:
          "IconButtonWithTooltip accepts disabledReason — shown in the tooltip while disabled (the disabled button is wrapped in a focus/hover target).",
      },
      {
        type: "changed",
        title: "Ripple Rebuilt Imperatively",
        description:
          "Ripple spans are now created and removed imperatively (no React state churn) and scale to the button's diagonal instead of a fixed 100px.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "10 July 2026",
    changes: [
      {
        type: "added",
        title: "Optimistic Toggle Buttons",
        description:
          "KiraButton gained a toggle mode built on React 19's useOptimistic: the pressed state flips instantly and rolls back with a toast if the async onToggle handler rejects.",
      },
      {
        type: "added",
        title: "Disabled Reason Tooltips",
        description:
          "Added disabledReason tooltip support for explaining why a disabled action is unavailable.",
      },
      {
        type: "changed",
        title: "Reduced-Motion Gating",
        description:
          "Every GSAP animation (ripple, press-scale, spinner, expandable width) now respects prefers-reduced-motion via the shared useReducedMotion hook.",
      },
      {
        type: "changed",
        title: "Standardized Async Success",
        description:
          "Async success now flashes a checkmark (IconCheck) instead of a sparkle, matching the confirm pattern used across the system.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "5 February 2026",
    changes: [
      {
        type: "added",
        title: "Unified KiraButton Component",
        description:
          "Added KiraButton as a unified high-level button API combining common interaction patterns.",
      },
      {
        type: "fixed",
        title: "Icon Duplication Bug",
        description:
          "Fixed icon duplication issue in Quick Action and Compound layouts where icons were appearing twice.",
      },
      {
        type: "changed",
        title: "Demo Page Enhancement",
        description:
          "Enhanced KiraButton demo tab with improved layout, better organization, and comprehensive examples.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "5 February 2026",
    changes: [
      {
        type: "changed",
        title: "Animation Library Migration",
        description:
          "Migrated from anime.js to GSAP for consistency with design system standards and better performance.",
      },
      {
        type: "added",
        title: "Icon Props API",
        description:
          "Added leftIcon and rightIcon props as the standard way to add icons to buttons, while maintaining flexible children support.",
      },
      {
        type: "changed",
        title: "ButtonGroup Consolidation",
        description:
          "Removed duplicate ButtonGroup implementation from button.tsx. Import from button-group.tsx instead.",
      },
      {
        type: "fixed",
        title: "Accessibility Improvements",
        description:
          "Added aria-busy support for LoadingButton and improved aria-label handling for IconButtonWithTooltip.",
      },
      {
        type: "added",
        title: "GSAP React Integration",
        description:
          "Integrated @gsap/react for better React lifecycle management and animation cleanup.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
