import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  Button,
  ExpandableIconButton,
  LoadingButton,
  IconButtonWithTooltip,
  KiraButton,
} from "@/components/ui/button";
import {
  IconPlus,
  IconDownload,
  IconTrash,
  IconMail,
  IconSend,
  IconSettings,
  IconHeart,
  IconStar,
  IconPlayerPlay,
  IconInfoCircle,
  IconCircleCheck,
  IconAccessible,
  IconPalette,
  IconStack2,
  IconArrowRight,
  IconArrowLeft,
  IconRefresh,
  IconUpload,
  IconAlertCircle,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

// =============================================================================
// Demo Components
// =============================================================================

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

// Basic variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Semantic variants
<Button variant="destructive">Destructive</Button>
<Button variant="info">Info</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

// Outline and ghost variants
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
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="icon-xs" variant="outline">
          <IconPlus className="w-3 h-3" />
        </Button>
        <Button size="icon-sm" variant="outline">
          <IconPlus className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline">
          <IconPlus className="w-4 h-4" />
        </Button>
        <Button size="icon-lg" variant="outline">
          <IconPlus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

const sizesCode = `import { Button } from "@/components/ui/button"

// Text button sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Icon button sizes
<Button size="icon-xs"><IconPlus /></Button>
<Button size="icon-sm"><IconPlus /></Button>
<Button size="icon"><IconPlus /></Button>
<Button size="icon-lg"><IconPlus /></Button>`;

function WithIconsDemo() {
  return (
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
      <Button variant="success">
        <IconCircleCheck data-icon="inline-start" className="w-4 h-4" />
        Confirm
      </Button>
      <Button variant="destructive">
        <IconTrash data-icon="inline-start" className="w-4 h-4" />
        Delete
      </Button>
    </div>
  );
}

const withIconsCode = `import { Button } from "@/components/ui/button"
import { IconMail, IconDownload, IconSettings } from "@tabler/icons-react"

// Use data-icon="inline-start" for proper icon spacing
<Button variant="default">
  <IconMail data-icon="inline-start" className="w-4 h-4" />
  Send Email
</Button>

<Button variant="secondary">
  <IconDownload data-icon="inline-start" className="w-4 h-4" />
  Download
</Button>`;

function IconPropsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Using leftIcon and rightIcon Props (Recommended)
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" leftIcon={<IconMail className="w-4 h-4" />}>
            Send Email
          </Button>
          <Button
            variant="secondary"
            leftIcon={<IconDownload className="w-4 h-4" />}
          >
            Download
          </Button>
          <Button
            variant="outline"
            rightIcon={<IconArrowRight className="w-4 h-4" />}
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            leftIcon={<IconArrowLeft className="w-4 h-4" />}
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
            leftIcon={<IconRefresh className="w-4 h-4" />}
            rightIcon={<IconArrowRight className="w-4 h-4" />}
          >
            Sync & Continue
          </Button>
          <Button
            variant="secondary"
            leftIcon={<IconUpload className="w-4 h-4" />}
            rightIcon={<IconArrowRight className="w-4 h-4" />}
          >
            Upload Files
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Flexible Children (Still Supported)
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <span className="flex items-center gap-2">
              <IconSettings className="w-4 h-4" />
              <span>Custom Layout</span>
            </span>
          </Button>
          <Button variant="success">
            <span className="flex items-center gap-2">
              <IconCircleCheck className="w-4 h-4" />
              <span>Success with Badge</span>
              <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded">
                3
              </span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const iconPropsCode = `import { Button } from "@/components/ui/button"
import { IconMail, IconArrowRight } from "@tabler/icons-react"

// Using leftIcon prop (recommended)
<Button 
  variant="default" 
  leftIcon={<IconMail className="w-4 h-4" />}
>
  Send Email
</Button>

// Using rightIcon prop
<Button 
  variant="outline" 
  rightIcon={<IconArrowRight className="w-4 h-4" />}
>
  Continue
</Button>

// Using both icons
<Button 
  leftIcon={<IconRefresh className="w-4 h-4" />}
  rightIcon={<IconArrowRight className="w-4 h-4" />}
>
  Sync & Continue
</Button>

// Flexible children for custom layouts
<Button variant="outline">
  <span className="flex items-center gap-2">
    <IconSettings className="w-4 h-4" />
    <span>Custom Layout</span>
    <Badge>3</Badge>
  </span>
</Button>`;

function HoldToConfirmDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Hold the button to execute the action. Release early to cancel.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          holdDuration={1000}
          onHoldComplete={() => alert("Sent!")}
          leftIcon={<IconSend className="w-4 h-4" />}
        >
          Hold to Send
        </Button>
        <Button
          variant="success"
          holdDuration={1000}
          onHoldComplete={() => alert("Approved!")}
          leftIcon={<IconCircleCheck className="w-4 h-4" />}
        >
          Hold to Approve
        </Button>
        <Button
          variant="destructive"
          holdDuration={1500}
          onHoldComplete={() => alert("Deleted!")}
          leftIcon={<IconTrash className="w-4 h-4" />}
        >
          Hold to Delete
        </Button>
      </div>
    </div>
  );
}

const holdToConfirmCode = `import { Button } from "@/components/ui/button"

// Hold duration in milliseconds
<Button
  variant="destructive"
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
  leftIcon={<IconTrash className="w-4 h-4" />}
>
  Hold to Delete
</Button>

// With icon using leftIcon prop
<Button
  variant="success"
  holdDuration={1000}
  onHoldComplete={() => handleApprove()}
  leftIcon={<IconCircleCheck className="w-4 h-4" />}
>
  Hold to Approve
</Button>`;

function ExpandableDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Icon-only buttons that expand to show text on hover.
      </p>
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
          icon={<IconTrash className="w-4 h-4" />}
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
            icon={<IconSend className="w-4 h-4" />}
            label="Send"
            variant="default"
            holdDuration={1000}
            onHoldComplete={() => alert("Sent!")}
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
  );
}

const expandableCode = `import { ExpandableIconButton } from "@/components/ui/button"

// Basic expandable
<ExpandableIconButton
  icon={<IconSettings className="w-4 h-4" />}
  label="Settings"
  variant="outline"
/>

// With hold to confirm
<ExpandableIconButton
  icon={<IconTrash className="w-4 h-4" />}
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
          leftIcon={<IconSend className="w-4 h-4" />}
        >
          Submit
        </LoadingButton>
        <LoadingButton
          variant="secondary"
          isLoading={loadingStates["secondary"]}
          onClick={() => handleClick("secondary")}
          leftIcon={<IconDownload className="w-4 h-4" />}
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
          leftIcon={<IconTrash className="w-4 h-4" />}
        >
          Delete
        </LoadingButton>
      </div>
    </div>
  );
}

const loadingButtonCode = `import { LoadingButton } from "@/components/ui/button"

const [isLoading, setIsLoading] = useState(false)

<LoadingButton
  isLoading={isLoading}
  onClick={() => handleSubmit()}
>
  Submit
</LoadingButton>

// With custom loading text
<LoadingButton
  isLoading={isLoading}
  loadingText="Processing..."
>
  Process
</LoadingButton>`;

function IconButtonWithTooltipDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Icon-only buttons with descriptive tooltips for accessibility.
      </p>
      <div className="flex flex-wrap gap-3">
        <IconButtonWithTooltip
          icon={<IconSettings className="w-4 h-4" />}
          tooltip="Settings"
          variant="outline"
          size="icon"
          aria-label="Settings"
        />
        <IconButtonWithTooltip
          icon={<IconHeart className="w-4 h-4" />}
          tooltip="Add to favorites"
          variant="secondary"
          size="icon"
          aria-label="Add to favorites"
        />
        <IconButtonWithTooltip
          icon={<IconDownload className="w-4 h-4" />}
          tooltip="Download file"
          variant="default"
          size="icon"
          aria-label="Download file"
        />
        <IconButtonWithTooltip
          icon={<IconTrash className="w-4 h-4" />}
          tooltip="Delete item"
          variant="destructive"
          size="icon"
          aria-label="Delete item"
        />
        <IconButtonWithTooltip
          icon={<IconInfoCircle className="w-4 h-4" />}
          tooltip="More information"
          variant="info"
          size="icon"
          aria-label="More information"
        />
        <IconButtonWithTooltip
          icon={<IconSend className="w-4 h-4" />}
          tooltip="Submit"
          disabled
          disabledReason="Complete all required fields before submitting."
          size="icon"
          aria-label="Submit"
        />
      </div>
    </div>
  );
}

const iconButtonWithTooltipCode = `import { IconButtonWithTooltip } from "@/components/ui/button"

<IconButtonWithTooltip
  icon={<IconSettings className="w-4 h-4" />}
  tooltip="Settings"
  variant="outline"
  size="icon"
  aria-label="Settings"
/>

<IconButtonWithTooltip
  icon={<IconTrash className="w-4 h-4" />}
  tooltip="Delete item"
  variant="destructive"
  size="icon"
  aria-label="Delete item"
/>

// Disabled with an explanation on hover (disabledReason overrides tooltip).
<IconButtonWithTooltip
  icon={<IconSend className="w-4 h-4" />}
  tooltip="Submit"
  disabled
  disabledReason="Complete all required fields before submitting."
  size="icon"
  aria-label="Submit"
/>`;

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

function KiraButtonDemo() {
  const [loading, setLoading] = React.useState(false);

  const handleLoadingClick = async () => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Icons */}
      <KiraButtonIconsSection />

      {/* Section 2: Loading */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Loading</h3>
          <p className="text-sm text-muted-foreground mb-4">
            KiraButton disables itself and shows a spinner while `loading` is
            set.
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

      {/* Section 3: Variants */}
      <KiraButtonAllVariantsSection />
    </div>
  );
}

const kiraButtonCode = `import { KiraButton } from "@/components/ui/button"

// Basic usage with icons
<KiraButton leftIcon={<IconMail className="w-4 h-4" />}>
  Send Email
</KiraButton>

// Loading state (disables + shows spinner)
<KiraButton loading={isLoading} onClick={handleRun}>
  Run Action
</KiraButton>

// Optimistic toggle: flips instantly, rolls back + toasts if onToggle rejects.
<KiraButton
  toggle
  variant="outline"
  pressedIcon={<IconHeartFilled className="w-4 h-4 text-red-500" />}
  unpressedIcon={<IconHeart className="w-4 h-4" />}
  onToggle={async (pressed) => {
    await likePost(pressed) // may throw → auto-revert
  }}
>
  Like
</KiraButton>`;

const disabledCode = `import { Button } from "@/components/ui/button"

<Button disabled>Disabled Default</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>
<Button variant="outline" disabled>Disabled Outline</Button>

// Stays keyboard-focusable while disabled (WCAG 2.2).
<Button disabled focusableWhenDisabled>Reachable by Tab</Button>`;

const toggleCode = `import { KiraButton, IconButtonWithTooltip } from "@/components/ui/button"
import { IconHeart, IconHeartFilled, IconSend } from "@tabler/icons-react"

// Optimistic toggle: flips instantly, rolls back + toasts if onToggle rejects.
<KiraButton
  toggle
  variant="outline"
  defaultPressed={false}
  pressedIcon={<IconHeartFilled className="w-4 h-4 text-red-500" />}
  unpressedIcon={<IconHeart className="w-4 h-4" />}
  onToggle={async (pressed) => {
    await likePost(pressed) // may throw → auto-revert
  }}
>
  Like
</KiraButton>

// Disabled with an explanation on hover.
<IconButtonWithTooltip
  icon={<IconSend />}
  tooltip="Submit"
  disabled
  disabledReason="Complete the form first"
  aria-label="Submit"
/>`;

function ToggleDemo() {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  // Simulated async that fails ~1 in 3 to show optimistic rollback.

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
              <IconHeart className="w-4 h-4 text-red-500 fill-red-500" />
            }
            unpressedIcon={<IconHeart className="w-4 h-4" />}
            onToggle={(next) => flaky(setLiked, next)}
          >
            {liked ? "Liked" : "Like"}
          </KiraButton>
          <KiraButton
            toggle
            variant="outline"
            pressed={bookmarked}
            pressedIcon={
              <IconStar className="w-4 h-4 text-amber-500 fill-amber-500" />
            }
            unpressedIcon={<IconStar className="w-4 h-4" />}
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
        <IconButtonWithTooltip
          icon={<IconSend className="w-4 h-4" />}
          tooltip="Submit"
          disabled
          disabledReason="Complete all required fields before submitting."
          aria-label="Submit"
        />
      </div>
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function ButtonPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "Full keyboard navigation and ARIA support for screen readers.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Multiple Variants",
      description:
        "20+ variants including semantic colors and outline/ghost styles.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Composable",
      description:
        "LoadingButton, ExpandableIconButton, and IconButtonWithTooltip components.",
      icon: <IconStack2 className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "variants",
      label: "Variants",
      demo: (
        <DemoWrapper
          title="Button Variants"
          description="All available button variants including semantic colors"
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Text and icon button sizes from extra small to large"
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "icons",
      label: "With Icons",
      demo: (
        <DemoWrapper
          title="Buttons with Icons"
          description="Combine icons with text using data-icon attribute"
          code={withIconsCode}
        >
          <WithIconsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "icon-props",
      label: "Icon Props",
      demo: (
        <DemoWrapper
          title="Icon Props API"
          description="Use leftIcon and rightIcon props for cleaner code, or flexible children for custom layouts"
          code={iconPropsCode}
        >
          <IconPropsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "hold",
      label: "Hold to Confirm",
      demo: (
        <DemoWrapper
          title="Hold to Confirm"
          description="Prevent accidental clicks with hold-to-confirm pattern"
          code={holdToConfirmCode}
        >
          <HoldToConfirmDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "expandable",
      label: "Expandable",
      demo: (
        <DemoWrapper
          title="Expandable Icon Button"
          description="Icon buttons that expand to show labels on hover"
          code={expandableCode}
        >
          <ExpandableDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "loading",
      label: "Loading",
      demo: (
        <DemoWrapper
          title="Loading Button"
          description="Buttons with loading state for async operations"
          code={loadingButtonCode}
        >
          <LoadingButtonDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "tooltip",
      label: "With Tooltip",
      demo: (
        <DemoWrapper
          title="Icon Button with Tooltip"
          description="Icon buttons with descriptive tooltips"
          code={iconButtonWithTooltipCode}
        >
          <IconButtonWithTooltipDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "kira-button",
      label: "KiraButton",
      demo: (
        <DemoWrapper
          title="KiraButton - Unified Component"
          description="All button features combined into one powerful component"
          code={kiraButtonCode}
        >
          <KiraButtonDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "toggle",
      label: "Optimistic Toggle",
      demo: (
        <DemoWrapper
          title="Optimistic Toggle & Disabled Reason"
          description="Toggle buttons update instantly and roll back automatically if the async handler rejects. Disabled buttons can explain themselves on hover."
          code={toggleCode}
        >
          <ToggleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "disabled",
      label: "Disabled",
      demo: (
        <DemoWrapper
          title="Disabled State"
          description="Buttons in disabled state"
          code={disabledCode}
        >
          <DisabledDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Enter", description: "Activate button" },
    { keys: "Space", description: "Activate button" },
    { keys: "Tab", description: "Move focus to next element" },
    { keys: "Shift + Tab", description: "Move focus to previous element" },
  ];

  const usageCode = `import { 
  Button, 
  LoadingButton,
  ExpandableIconButton,
  IconButtonWithTooltip 
} from "@/components/ui/button"

// Basic button
<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>

// With icon using leftIcon prop (recommended)
<Button leftIcon={<IconMail className="w-4 h-4" />}>
  Send Email
</Button>

// With icon using rightIcon prop
<Button rightIcon={<IconArrowRight className="w-4 h-4" />}>
  Continue
</Button>

// Hold to confirm
<Button
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
  variant="destructive"
  leftIcon={<IconTrash className="w-4 h-4" />}
>
  Hold to Delete
</Button>

// Loading state
<LoadingButton isLoading={isLoading}>
  Submit
</LoadingButton>

// Expandable icon button
<ExpandableIconButton
  icon={<IconSettings />}
  label="Settings"
/>

// Icon with tooltip
<IconButtonWithTooltip
  icon={<IconTrash />}
  tooltip="Delete item"
  variant="destructive"
  aria-label="Delete item"
/>`;

  const apiReference = [
    {
      title: "Button",
      props: [
        {
          prop: "variant",
          type: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "info" | "success" | "warning" | ...',
          default: '"default"',
          description: "Visual style of the button",
        },
        {
          prop: "size",
          type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
          default: '"default"',
          description: "Size of the button",
        },
        {
          prop: "leftIcon",
          type: "ReactNode",
          default: "-",
          description: "Icon displayed on the left side of the button",
        },
        {
          prop: "rightIcon",
          type: "ReactNode",
          default: "-",
          description: "Icon displayed on the right side of the button",
        },
        {
          prop: "holdDuration",
          type: "number",
          default: "-",
          description:
            "Duration in ms to hold before triggering onHoldComplete",
        },
        {
          prop: "onHoldComplete",
          type: "() => void",
          default: "-",
          description: "Callback when hold duration is completed",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable the button",
        },
        {
          prop: "focusableWhenDisabled",
          type: "boolean",
          default: "false",
          description:
            "Keep a disabled button keyboard-focusable (Base UI primitive, WCAG 2.2)",
        },
        {
          prop: "leftIcon / rightIcon",
          type: "ReactNode",
          default: "-",
          description: "Icons on the left / right side of the label",
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
          description: "Show loading spinner and disable button",
        },
        {
          prop: "loadingText",
          type: "string",
          default: "-",
          description: "Text to show while loading",
        },
        {
          prop: "...props",
          type: "ButtonProps",
          default: "-",
          description: "All Button props are supported",
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
          description: "Icon element to display",
        },
        {
          prop: "label",
          type: "string",
          default: "-",
          description: "Text label shown on hover",
        },
        {
          prop: "...props",
          type: "ButtonProps",
          default: "-",
          description: "All Button props are supported",
        },
      ],
    },
    {
      title: "IconButtonWithTooltip",
      props: [
        {
          prop: "icon",
          type: "ReactNode",
          default: "-",
          description: "Icon element to display",
        },
        {
          prop: "tooltip",
          type: "string",
          default: "-",
          description: "Tooltip text on hover",
        },
        {
          prop: "aria-label",
          type: "string",
          default: "-",
          description: "Accessible label (falls back to tooltip text)",
        },
        {
          prop: "disabledReason",
          type: "string",
          default: "-",
          description:
            "Shown in the tooltip while the button is disabled (overrides tooltip)",
        },
        {
          prop: "...props",
          type: "ButtonProps",
          default: "-",
          description: "All Button props are supported",
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
          description: "Show spinner, disable the button",
        },
        {
          prop: "loadingText",
          type: "string",
          default: "-",
          description: "Text to show while loading",
        },
        {
          prop: "toggle",
          type: "boolean",
          default: "false",
          description: "Enable optimistic toggle mode",
        },
        {
          prop: "pressed / defaultPressed",
          type: "boolean",
          default: "-",
          description: "Controlled / uncontrolled pressed state",
        },
        {
          prop: "onToggle",
          type: "(pressed: boolean) => void | Promise<void>",
          default: "-",
          description:
            "Async toggle handler; flips instantly, reverts + toasts on reject",
        },
        {
          prop: "pressedIcon / unpressedIcon",
          type: "ReactNode",
          default: "-",
          description: "Icons for the pressed / unpressed states",
        },
        {
          prop: "toggleErrorMessage",
          type: "string",
          default: '"Couldn\'t update"',
          description: "Toast message when onToggle rejects",
        },
        {
          prop: "...props",
          type: "ButtonProps",
          default: "-",
          description: "All Button props are supported",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Button"
        description="A versatile button component with multiple variants, sizes, and interactive features like hold-to-confirm and loading states."
        version="v2.3"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />

      <Changelog entries={buttonPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const buttonPageChangelogEntries = [
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
          "Removed icon/iconPosition (use leftIcon/rightIcon), tooltip/disabledReason (use IconButtonWithTooltip), expandable, onAsyncClick + async props, copyText + copy props, formLabel + form props, quickAction, and compound code paths. Keep toggle, loading, and the optimistic onToggle behavior.",
      },
      {
        type: "breaking",
        title: "Removed rippleColor and progressColor Props",
        description:
          "Ripple and hold-progress visuals now use currentColor (the button's text color), which always contrasts with the variant background. The per-variant rgba color maps are gone.",
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
          "The loading spinner at size lg is now h-5 w-5 (was h-4.5 w-4.5), matching getButtonIconSize.",
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
          "KiraButton gained a `toggle` mode built on React 19's useOptimistic: the pressed state flips instantly and rolls back with a toast if the async onToggle handler rejects. Pairs with aria-pressed and pressed/unpressed icons.",
      },
      {
        type: "added",
        title: "Disabled Reason Tooltips",
        description:
          "KiraButton now accepts `disabledReason` — a tooltip shown only while the button is disabled that explains why, so disabled controls are never a dead end.",
      },
      {
        type: "changed",
        title: "Reduced-Motion Gating",
        description:
          "Every GSAP animation (ripple, press-scale, spinner, expandable width, quick-action press) now respects prefers-reduced-motion via the shared useReducedMotion hook. The loading spinner falls back to a CSS spin.",
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
          "Added KiraButton - a powerful unified component that combines all button features (icons, loading, tooltips, expandable, async actions, copy, form integration, quick actions, compound layouts) into a single, easy-to-use API.",
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
          "Enhanced KiraButton demo tab with improved layout, better organization, and comprehensive examples showcasing all features.",
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
          "Added leftIcon and rightIcon props as the standard way to add icons to buttons, while maintaining flexible children support for custom layouts.",
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
          "Added aria-busy support for LoadingButton, improved aria-label handling for IconButtonWithTooltip, and added aria-live regions for AsyncButton status changes.",
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

const flaky = (setter: (v: boolean) => void, next: boolean) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() < 0.33) {
        reject(new Error("network"));
      } else {
        setter(next);
        resolve();
      }
    }, 600),
  );

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
        <KiraButton leftIcon={<IconMail className="w-4 h-4" />}>
          Send Email
        </KiraButton>
        <KiraButton
          variant="outline"
          rightIcon={<IconArrowRight className="w-4 h-4" />}
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
        <KiraButton leftIcon={<IconMail className="w-4 h-4" />} size="sm">
          Default
        </KiraButton>
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" />}
          variant="secondary"
          size="sm"
        >
          Secondary
        </KiraButton>
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" />}
          variant="outline"
          size="sm"
        >
          Outline
        </KiraButton>
        <KiraButton
          leftIcon={<IconMail className="w-4 h-4" />}
          variant="ghost"
          size="sm"
        >
          Ghost
        </KiraButton>
        <KiraButton
          leftIcon={<IconTrash className="w-4 h-4" />}
          variant="destructive"
          size="sm"
        >
          Destructive
        </KiraButton>
        <KiraButton
          leftIcon={<IconInfoCircle className="w-4 h-4" />}
          variant="info"
          size="sm"
        >
          Info
        </KiraButton>
        <KiraButton
          leftIcon={<IconCircleCheck className="w-4 h-4" />}
          variant="success"
          size="sm"
        >
          Success
        </KiraButton>
        <KiraButton
          leftIcon={<IconAlertCircle className="w-4 h-4" />}
          variant="warning"
          size="sm"
        >
          Warning
        </KiraButton>
      </div>
    </div>
  );
}
