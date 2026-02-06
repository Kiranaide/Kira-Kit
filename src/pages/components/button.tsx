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
  IconCopy,
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
/>`;

function DisabledDemo() {
  return (
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
  );
}

function KiraButtonDemo() {
  const [asyncLoading, setAsyncLoading] = React.useState(false);

  const handleAsyncClick = async () => {
    setAsyncLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAsyncLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Basic Features */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Basic Features</h3>
          <p className="text-sm text-muted-foreground mb-4">
            KiraButton combines icons, loading states, tooltips, and expandable
            layouts in one component.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border">
          <KiraButton icon={<IconMail className="w-4 h-4" />}>
            With Icon
          </KiraButton>
          <KiraButton
            loading={asyncLoading}
            onAsyncClick={handleAsyncClick}
            icon={<IconRefresh className="w-4 h-4" />}
          >
            Async Action
          </KiraButton>
          <KiraButton
            tooltip="Hover to see tooltip"
            icon={<IconInfoCircle className="w-4 h-4" />}
          >
            With Tooltip
          </KiraButton>
          <KiraButton
            expandable
            expandLabel="Settings"
            icon={<IconSettings className="w-4 h-4" />}
            variant="outline"
          />
        </div>
      </div>

      {/* Section 2: Quick Actions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Quick Action Layout</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Perfect for toolbars and action menus with icon + label + optional
            description.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-4 p-4 bg-muted/30 rounded-lg border">
          <KiraButton
            quickAction
            icon={<IconHeart className="w-5 h-5" />}
            variant="secondary"
          >
            Like
          </KiraButton>
          <KiraButton
            quickAction
            quickActionDescription="Save to your favorites"
            icon={<IconHeart className="w-5 h-5" />}
            variant="outline"
          >
            Favorite
          </KiraButton>
          <KiraButton
            quickAction
            quickActionDescription="Download as PDF"
            icon={<IconDownload className="w-5 h-5" />}
            variant="default"
          >
            Download
          </KiraButton>
          <KiraButton
            quickAction
            quickActionDescription="Upload files to cloud"
            icon={<IconUpload className="w-5 h-5" />}
            variant="info"
          >
            Upload
          </KiraButton>
        </div>
      </div>

      {/* Section 3: Form Integration */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Form Integration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Built-in label, description, and error state support for form
            contexts.
          </p>
        </div>
        <div className="grid gap-4 p-4 bg-muted/30 rounded-lg border max-w-md">
          <KiraButton
            formLabel="Submit Form"
            formDescription="Click to submit your changes"
            icon={<IconSend className="w-4 h-4" />}
          >
            Submit
          </KiraButton>
          <KiraButton
            formLabel="Delete Account"
            formError="This action cannot be undone"
            icon={<IconTrash className="w-4 h-4" />}
            variant="destructive"
          >
            Delete
          </KiraButton>
        </div>
      </div>

      {/* Section 4: Utility Features */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Utility Features</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Copy to clipboard and compound layouts for complex use cases.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-4 p-4 bg-muted/30 rounded-lg border">
          <KiraButton
            copyText="Hello from KiraButton!"
            copySuccessMessage="Copied to clipboard!"
            icon={<IconCopy className="w-4 h-4" />}
            variant="outline"
          >
            Copy Text
          </KiraButton>
          <KiraButton
            compound
            compoundDescription="Manage your account settings and preferences"
            icon={<IconSettings className="w-4 h-4" />}
            variant="secondary"
          >
            Settings
          </KiraButton>
          <KiraButton
            compound
            compoundDescription="View and manage your files"
            compoundIconPosition="right"
            icon={<IconArrowRight className="w-4 h-4" />}
            variant="outline"
          >
            Files
          </KiraButton>
        </div>
      </div>

      {/* Section 5: Variants Showcase */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">All Variants</h3>
          <p className="text-sm text-muted-foreground mb-4">
            KiraButton supports all button variants with consistent behavior.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg border">
          <KiraButton icon={<IconMail className="w-4 h-4" />} size="sm">
            Default
          </KiraButton>
          <KiraButton
            icon={<IconMail className="w-4 h-4" />}
            variant="secondary"
            size="sm"
          >
            Secondary
          </KiraButton>
          <KiraButton
            icon={<IconMail className="w-4 h-4" />}
            variant="outline"
            size="sm"
          >
            Outline
          </KiraButton>
          <KiraButton
            icon={<IconMail className="w-4 h-4" />}
            variant="ghost"
            size="sm"
          >
            Ghost
          </KiraButton>
          <KiraButton
            icon={<IconTrash className="w-4 h-4" />}
            variant="destructive"
            size="sm"
          >
            Destructive
          </KiraButton>
          <KiraButton
            icon={<IconInfoCircle className="w-4 h-4" />}
            variant="info"
            size="sm"
          >
            Info
          </KiraButton>
          <KiraButton
            icon={<IconCircleCheck className="w-4 h-4" />}
            variant="success"
            size="sm"
          >
            Success
          </KiraButton>
          <KiraButton
            icon={<IconAlertCircle className="w-4 h-4" />}
            variant="warning"
            size="sm"
          >
            Warning
          </KiraButton>
        </div>
      </div>
    </div>
  );
}

const kiraButtonCode = `import { KiraButton } from "@/components/ui/button"

// Basic usage with icon
<KiraButton icon={<IconMail className="w-4 h-4" />}>
  With Icon
</KiraButton>

// Async action with loading state
<KiraButton
  onAsyncClick={handleAsyncAction}
  icon={<IconRefresh className="w-4 h-4" />}
>
  Async Action
</KiraButton>

// With tooltip
<KiraButton
  tooltip="This button has a tooltip"
  icon={<IconInfoCircle className="w-4 h-4" />}
>
  With Tooltip
</KiraButton>

// Expandable icon button
<KiraButton
  expandable
  expandLabel="Settings"
  icon={<IconSettings className="w-4 h-4" />}
  variant="outline"
/>

// Quick action layout
<KiraButton
  quickAction
  quickActionDescription="Save to favorites"
  icon={<IconHeart className="w-5 h-5" />}
  variant="outline"
>
  Favorite
</KiraButton>

// Copy to clipboard
<KiraButton
  copyText="Text to copy"
  copySuccessMessage="Copied!"
  icon={<IconCopy className="w-4 h-4" />}
  variant="outline"
>
  Copy
</KiraButton>

// Form integration
<KiraButton
  formLabel="Submit Form"
  formDescription="Click to submit"
  icon={<IconSend className="w-4 h-4" />}
>
  Submit
</KiraButton>`;

const disabledCode = `import { Button } from "@/components/ui/button"

<Button disabled>Disabled Default</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>
<Button variant="outline" disabled>Disabled Outline</Button>`;

// =============================================================================
// Main Page Component
// =============================================================================

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
          prop: "asChild",
          type: "boolean",
          default: "false",
          description: "Render as child element (for custom components)",
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
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />

      <Changelog
        entries={[
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
        ]}
      />
    </ComponentPage>
  );
}
