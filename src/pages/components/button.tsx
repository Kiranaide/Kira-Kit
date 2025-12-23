import { Button } from "@/components/ui/button";
import {
  HoldButton,
  ExpandableIconButton,
  HoldToCloseAlert,
} from "@/components/ui/button-extended";
import {
  IconPlus,
  IconDownload,
  IconTrash,
  IconMail,
  IconSend,
  IconSettings,
  IconHeart,
  IconPlayerPlay,
} from "@tabler/icons-react";

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
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Buttons
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon-xs" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
          <Button size="icon-sm" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
          <Button size="icon-lg" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button>
            <IconMail data-icon="inline-start" className="w-4 h-4" />
            Send Email
          </Button>
          <Button variant="secondary">
            <IconDownload data-icon="inline-start" className="w-4 h-4" />
            Download
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
          <HoldButton
            variant="destructive"
            holdDuration={1500}
            onHoldComplete={() => alert("Deleted!")}
          >
            <IconTrash className="w-4 h-4 mr-2" />
            Hold to Delete
          </HoldButton>
          <HoldButton
            variant="default"
            holdDuration={1000}
            onHoldComplete={() => alert("Sent!")}
          >
            <IconSend className="w-4 h-4 mr-2" />
            Hold to Send
          </HoldButton>
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
            expandDirection="left"
          />
        </div>
      </section>

      {/* Hold to Close Alert */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Hold to Close Alert
        </h2>
        <p className="text-sm text-muted-foreground">
          Hold to dismiss the alert. Progress bar animates while holding.
        </p>
        <div className="space-y-3 max-w-md">
          <HoldToCloseAlert
            variant="info"
            onClose={() => console.log("Info dismissed!")}
          >
            <span className="font-medium">Information</span>
            <p className="text-sm opacity-90">
              This is an informational message.
            </p>
          </HoldToCloseAlert>
          <HoldToCloseAlert
            variant="warning"
            onClose={() => console.log("Warning dismissed!")}
          >
            <span className="font-medium">Warning</span>
            <p className="text-sm opacity-90">
              Something needs your attention.
            </p>
          </HoldToCloseAlert>
          <HoldToCloseAlert
            variant="destructive"
            holdDuration={2000}
            onClose={() => console.log("Error dismissed!")}
          >
            <span className="font-medium">Error</span>
            <p className="text-sm opacity-90">
              An error occurred. Hold to dismiss.
            </p>
          </HoldToCloseAlert>
        </div>
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
            {`import { Button } from "@/components/ui/button"
import { HoldButton, ExpandableIconButton } from "@/components/ui/button-extended"

// Basic
<Button>Click me</Button>

// Hold to confirm
<HoldButton
  holdDuration={1500}
  onHoldComplete={() => handleDelete()}
  variant="destructive"
>
  Hold to Delete
</HoldButton>

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
