import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogList,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogWarning,
  KiraAlertDialog,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

function TypeToConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-8">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <KiraAlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title="Delete project"
        description="This permanently deletes the project and all its data."
        confirmText="DELETE"
        confirmLabel="Delete project"
        onConfirm={() => {
          toast.success("Project deleted");
        }}
      />
    </div>
  );
}

function TimedConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-8">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Wipe cache
      </Button>
      <KiraAlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="warning"
        title="Wipe cache?"
        description="The confirm button unlocks after a short cooldown."
        confirmDelay={3}
        confirmLabel="Wipe now"
        onConfirm={() => {
          toast.success("Cache wiped");
        }}
      />
    </div>
  );
}

function AsyncConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-8">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Save changes
      </Button>
      <KiraAlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="info"
        title="Save changes?"
        description="Shows a pending state, then a checkmark before closing."
        confirmLabel="Save"
        shortcut="⌘↵"
        onConfirmAsync={() =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 1200);
          })
        }
      />
    </div>
  );
}

function ScrollableFullDemo() {
  return (
    <div className="flex justify-center py-8">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Open full-screen terms</Button>}
        />
        <AlertDialogContent size="full">
          <AlertDialogHeader>
            <AlertDialogTitle>Terms of Service</AlertDialogTitle>
            <AlertDialogDescription>
              Scroll to review the full terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            {Array.from({ length: 20 }, (_, i) => ({
              id: "section-" + (i + 1),
              number: i + 1,
            })).map((section) => (
              <p key={section.id}>
                {section.number}. Shared project access ends when a member
                leaves the team. Review active invitations and exported research
                before confirming. This is illustrative policy text for the
                scrolling demo.
              </p>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Decline</AlertDialogCancel>
            <AlertDialogAction>Accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CloseButtonDemo() {
  return (
    <div className="flex justify-center py-8">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Open with close button</Button>}
        />
        <AlertDialogContent showCloseButton>
          <AlertDialogHeader>
            <AlertDialogTitle>Standalone close</AlertDialogTitle>
            <AlertDialogDescription>
              The X in the corner is an AlertDialogClose. showCloseButton adds
              it automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AsyncRecoveryDemo() {
  const [attempts, setAttempts] = useState(0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Illustrative service: the first request fails; retry succeeds. Attempts:{" "}
        {attempts}
      </p>
      <KiraAlertDialog
        trigger={<Button>Publish release</Button>}
        title="Publish release?"
        description="Notify everyone following the November release."
        confirmLabel="Publish release"
        shortcut="Ctrl/Cmd+Enter"
        errorMessage="The publishing service is unavailable. Try publishing again."
        onConfirmAsync={async () => {
          setAttempts((value) => value + 1);
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 900);
          });

          if (attempts === 0) throw new Error("Illustrative service failure");
        }}
      />
    </div>
  );
}

const recoveryCode = `import { useState } from "react"
import { KiraAlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AsyncRecoveryDemo() {
  const [attempts, setAttempts] = useState(0);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Illustrative service: the first request fails; retry succeeds. Attempts:{" "}
        {attempts}
      </p>
      <KiraAlertDialog
        trigger={<Button>Publish release</Button>}
        title="Publish release?"
        description="Notify everyone following the November release."
        confirmLabel="Publish release"
        shortcut="Ctrl/Cmd+Enter"
        errorMessage="The publishing service is unavailable. Try publishing again."
        onConfirmAsync={async () => {
          setAttempts((value) => value + 1);
          await new Promise<void>((resolve) => window.setTimeout(resolve, 900));
          if (attempts === 0) throw new Error("Illustrative service failure");
        }}
      />
    </div>
  );
}`;

function ConfirmationStatesDemo() {
  return (
    <div className="w-full max-w-80 space-y-3">
      <KiraAlertDialog
        trigger={<Button variant="destructive">Review removal</Button>}
        title="Remove the quarterly customer research project and all its shared findings?"
        description="Review the empty attachment list, then type REMOVE to enable the action."
        variant="destructive"
        confirmText="REMOVE"
        confirmLabel="Remove project and shared findings"
      >
        <p className="text-sm text-muted-foreground">
          No attachments. Export the project first if you need a copy.
        </p>
      </KiraAlertDialog>
      <KiraAlertDialog
        trigger={<Button variant="outline">Review information</Button>}
        title="Your export is ready"
        variant="success"
        description="The export contains the current project findings."
        confirmLabel="Got it"
      />
    </div>
  );
}

const statesCode = `import { KiraAlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function ConfirmationStatesDemo() {
  return (
    <div className="w-full max-w-80 space-y-3">
      <KiraAlertDialog
        trigger={<Button variant="destructive">Review removal</Button>}
        title="Remove the quarterly customer research project and all its shared findings?"
        description="Review the empty attachment list, then type REMOVE to enable the action."
        variant="destructive"
        confirmText="REMOVE"
        confirmLabel="Remove project and shared findings"
      >
        <p className="text-sm text-muted-foreground">
          No attachments. Export the project first if you need a copy.
        </p>
      </KiraAlertDialog>
      <KiraAlertDialog
        trigger={<Button variant="outline">Review information</Button>}
        title="Your export is ready"
        variant="success"
        description="The export contains the current project findings."
        confirmLabel="Got it"
      />
    </div>
  );
}`;

const alertUsageCode = `import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogClose, AlertDialogMedia, AlertDialogWarning, AlertDialogList, AlertDialogPortal, AlertDialogOverlay, KiraAlertDialog, alertDialogContentVariants, alertDialogMediaVariants } from "@/components/ui/alert-dialog"
import { dialogContentVariants } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconAlertTriangle } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function ConfirmArchive({ archiveProject }: { archiveProject: () => Promise<void> }) {
  return <KiraAlertDialog trigger={<Button variant="destructive">Archive project</Button>}
    title="Archive this project?" description="Project members will lose editing access."
    variant="destructive" confirmText="ARCHIVE" confirmLabel="Archive project"
    shortcut="Ctrl/Cmd+Enter" onConfirmAsync={archiveProject}
    errorMessage="Could not archive the project. Try again." />
}

export function DiscardDraft({ discardDraft }: { discardDraft: () => void }) {
  return <AlertDialog><AlertDialogTrigger render={<Button variant="outline">Discard draft</Button>} />
    <AlertDialogContent overlayProps={{ opacity: 50, blur: "xs" }}>
      <AlertDialogHeader><AlertDialogMedia variant="warning"><IconAlertTriangle aria-hidden="true" /></AlertDialogMedia>
        <AlertDialogTitle>Discard draft?</AlertDialogTitle><AlertDialogDescription>This removes your unsaved changes.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogWarning><AlertDialogList items={["Unsaved edits will be removed.", "Published findings remain available."]} /></AlertDialogWarning>
      <AlertDialogFooter><AlertDialogCancel>Keep editing</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={discardDraft}>Discard draft</AlertDialogAction></AlertDialogFooter>
      <AlertDialogClose />
    </AlertDialogContent>
  </AlertDialog>
}

export function CustomConfirmation() {
  return <AlertDialog><AlertDialogTrigger render={<Button>Review export</Button>} />
    <AlertDialogPortal><AlertDialogOverlay /><AlertDialogPrimitive.Viewport className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
      <AlertDialogPrimitive.Popup className={cn(dialogContentVariants(), alertDialogContentVariants({ size: "sm" }))}>
        <div className={alertDialogMediaVariants({ variant: "info" })}><IconAlertTriangle aria-hidden="true" /></div>
        <AlertDialogTitle>Export findings?</AlertDialogTitle><AlertDialogDescription>Export the current project findings.</AlertDialogDescription>
        <AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Export</AlertDialogAction>
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Viewport></AlertDialogPortal>
  </AlertDialog>
}`;

const typeConfirmCode = `import { useState } from "react"
import { KiraAlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function TypeToConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-8">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <KiraAlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title="Delete project"
        description="This permanently deletes the project and all its data."
        confirmText="DELETE"
        confirmLabel="Delete project"
        onConfirm={() => {
          toast.success("Project deleted");
        }}
      />
    </div>
  );
}`;

const timedConfirmCode = `import { useState } from "react"
import { KiraAlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function TimedConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-8">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Wipe cache
      </Button>
      <KiraAlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="warning"
        title="Wipe cache?"
        description="The confirm button unlocks after a short cooldown."
        confirmDelay={3}
        confirmLabel="Wipe now"
        onConfirm={() => {
          toast.success("Cache wiped");
        }}
      />
    </div>
  );
}`;

const asyncConfirmCode = `import { useState } from "react"
import { KiraAlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AsyncConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-8">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Save changes
      </Button>
      <KiraAlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="info"
        title="Save changes?"
        description="Shows a pending state, then a checkmark before closing."
        confirmLabel="Save"
        shortcut="⌘↵"
        onConfirmAsync={() =>
          new Promise<void>((resolve) => setTimeout(resolve, 1200))
        }
      />
    </div>
  );
}`;

const scrollableCode = `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function ScrollableFullDemo() {
  return (
    <div className="flex justify-center py-8">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Open full-screen terms</Button>}
        />
        <AlertDialogContent size="full">
          <AlertDialogHeader>
            <AlertDialogTitle>Terms of Service</AlertDialogTitle>
            <AlertDialogDescription>
              Scroll to review the full terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            {Array.from({ length: 20 }, (_, index) => ({ id: "section-" + (index + 1), number: index + 1 })).map((section) => (
              <p key={section.id}>
                {section.number}. Shared project access ends when a member leaves the
                team. Review active invitations and exported research before
                confirming. This is illustrative policy text for the scrolling
                demo.
              </p>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Decline</AlertDialogCancel>
            <AlertDialogAction>Accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}`;

const closeCode = `import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function CloseButtonDemo() {
  return (
    <div className="flex justify-center py-8">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Open with close button</Button>}
        />
        <AlertDialogContent showCloseButton>
          <AlertDialogHeader>
            <AlertDialogTitle>Standalone close</AlertDialogTitle>
            <AlertDialogDescription>
              The X in the corner is an AlertDialogClose. showCloseButton adds
              it automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}`;

const basicCode = `import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function BasicAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`;

const destructiveCode = `import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function DestructiveAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete Account</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? All of your data
            will be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`;

const customCode = `import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
  AlertDialogWarning,
  AlertDialogList,
} from "@/components/ui/alert-dialog"
import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"

export function CustomAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />
      <AlertDialogContent size="lg">
        <AlertDialogHeader>
          <AlertDialogMedia variant="warning">
            <IconAlertTriangle className="h-5 w-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Before you proceed, please note the following warning.
          </AlertDialogDescription>
          <AlertDialogWarning variant="warning">
            This action will permanently delete all associated data and
            cannot be undone.
          </AlertDialogWarning>
          <AlertDialogList
            variant="bullet"
            items={[
              "All project files and assets",
              "Team member access and permissions",
              "API keys and integrations",
            ]}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            Delete Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`;

// oxlint-disable-next-line eslint/max-lines-per-function -- This page is pure static documentation; its complete tab catalog stays readable together.
export default function AlertDialogPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Alert Dialog"
        description="Modal dialog for important confirmations that require user action."
        version="2.1.0"
      />

      <FeatureGrid features={alertDialogPageFeatureGridFeatures} />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "recovery",
            label: "Async recovery",
            demo: (
              <DemoWrapper
                title="Retry a failed publish"
                description="An illustrative service fails once. Duplicate confirmation and dismissal are blocked while work is pending."
                code={recoveryCode}
              >
                <AsyncRecoveryDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "states",
            label: "Kira & states",
            demo: (
              <DemoWrapper
                title="Confirmation states"
                description="Long content, an empty list, a disabled action with a visible reason, typed confirmation and a success variant."
                code={statesCode}
              >
                <ConfirmationStatesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "basic",
            label: "Basic",
            demo: <AlertDialogControlsSection basicCode={basicCode} />,
          },
          {
            value: "destructive",
            label: "Destructive",
            demo: (
              <AlertDialogControlsSection2 destructiveCode={destructiveCode} />
            ),
          },
          {
            value: "custom",
            label: "Custom",
            demo: <AlertDialogControlsSection3 customCode={customCode} />,
          },
          {
            value: "type-to-confirm",
            label: "Type to Confirm",
            demo: (
              <DemoWrapper
                title="Type-to-Confirm"
                description="Require typing an exact word before the destructive action unlocks."
                code={typeConfirmCode}
              >
                <TypeToConfirmDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "timed",
            label: "Timed Confirm",
            demo: (
              <DemoWrapper
                title="Timed Confirm"
                description="Confirm button stays disabled for a short cooldown."
                code={timedConfirmCode}
              >
                <TimedConfirmDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "async",
            label: "Async Confirm",
            demo: (
              <DemoWrapper
                title="Async Confirm"
                description="Awaits the handler, shows a checkmark, then closes. ⌘↵ confirms."
                code={asyncConfirmCode}
              >
                <AsyncConfirmDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "scrollable",
            label: "Scrollable Full",
            demo: (
              <DemoWrapper
                title="Scrollable Full-Screen"
                description="size='full' scrolls the body between a fixed header and footer."
                code={scrollableCode}
              >
                <ScrollableFullDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "close",
            label: "Close Button",
            demo: (
              <DemoWrapper
                title="Close Button"
                description="A standalone AlertDialogClose in the corner."
                code={closeCode}
              >
                <CloseButtonDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={alertDialogPageKeyboardShortcutsShortcuts}
      />

      <UsageBlock code={alertUsageCode} />

      <APIReference sections={alertDialogPageAPIReferenceSections} />
      <Changelog entries={alertDialogPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const alertDialogPageFeatureGridFeatures = [
  {
    title: "Accessible",
    description:
      "Focus stays in the confirmation. Escape cancels when idle; pending work stays open until completion.",
  },
  {
    title: "Flexible Sizes",
    description:
      "Support for sm, default, lg, xl, and full viewport sizes with responsive breakpoints.",
  },
  {
    title: "Rich Components",
    description:
      "Built-in media icons, warning alerts, lists, shortcuts, and loading states for comprehensive dialogs.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const alertDialogPageKeyboardShortcutsShortcuts = [
  {
    keys: "Escape",
    description:
      "Cancel when idle (inherited from Base UI); pending and success states block dismissal.",
  },
  {
    keys: "Enter / Space",
    description: "Activate the focused action (inherited from Base UI).",
  },
  {
    keys: "Cmd/Ctrl + Enter",
    description:
      "Kira confirmation when shortcut is set, focus is inside the popup, and all gates are satisfied.",
  },
  {
    keys: "Space",
    description: "Activate the focused action (inherited from Base UI)",
  },
  {
    keys: "Tab",
    description: "Navigate inside the modal (inherited from Base UI)",
  },
  {
    keys: "Shift + Tab",
    description: "Navigate backwards (inherited from Base UI)",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const alertDialogPageAPIReferenceSections = [
  {
    title: "alertDialogContentVariants",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description:
          "Alert-specific sizing and spacing layered over dialogContentVariants.",
      },
    ],
  },
  {
    title: "alertDialogMediaVariants",
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        default: '"default"',
        description:
          "Shared semantic media styles used by the primitive parts and Kira wrapper.",
      },
    ],
  },
  {
    title: "AlertDialogPortal",
    props: [
      {
        prop: "AlertDialogPrimitive.Portal.Props",
        type: "Base UI Portal props",
        description:
          "Includes container and keepMounted; use through content portalProps for standard composition.",
      },
    ],
  },
  {
    title: "AlertDialogOverlay",
    props: [
      {
        prop: "opacity",
        type: "20 | 30 | 40 | 50 | 60 | 70 | 80",
        default: "50",
        description: "Backdrop opacity.",
      },
      {
        prop: "blur",
        type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"',
        default: '"xs"',
        description: "Backdrop blur.",
      },
      {
        prop: "color",
        type: '"black" | "white"',
        default: '"black"',
        description: "Backdrop color.",
      },
      {
        prop: "blurless",
        type: "boolean",
        default: "false",
        description: "Disable backdrop blur.",
      },
    ],
  },
  {
    title: "AlertDialogClose",
    props: [
      {
        prop: "variant",
        type: '"outline" | "ghost" | "secondary"',
        default: '"ghost"',
        description: "Close button appearance.",
      },
      {
        prop: "size",
        type: '"icon-xs" | "icon-sm" | "icon" | "default" | "sm"',
        default: '"icon-xs"',
        description: "Close button size.",
      },
    ],
  },
  {
    title: "AlertDialogTitle",
    props: [
      {
        prop: "AlertDialogPrimitive.Title.Props",
        type: "Base UI Title props",
        description: "Accessible title and state-aware className.",
      },
    ],
  },
  {
    title: "AlertDialogDescription",
    props: [
      {
        prop: "AlertDialogPrimitive.Description.Props",
        type: "Base UI Description props",
        description: "Accessible description and state-aware className.",
      },
    ],
  },
  {
    title: "AlertDialog",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "undefined",
        description: "Controlled open state of the dialog.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Callback when the open state changes.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state for uncontrolled mode.",
      },
    ],
  },
  {
    title: "AlertDialogTrigger",
    props: [
      {
        prop: "render",
        type: "ReactElement",
        default: "undefined",
        description: "The element to render as the trigger button.",
      },
    ],
  },
  {
    title: "AlertDialogContent",
    props: [
      {
        prop: "portalProps",
        type: "Omit<AlertDialogPrimitive.Portal.Props, 'children'>",
        description: "Portal destination and keepMounted.",
      },
      {
        prop: "overlayProps",
        type: "AlertDialogOverlayProps",
        description: "Backdrop opacity, color, blur and primitive props.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Size variant of the dialog content.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "false",
        description: "Show close button in the corner of the dialog.",
      },
      {
        prop: "duration",
        type: "number",
        default: "200",
        description:
          "Entry and exit transition duration in milliseconds. Reduced motion overrides it.",
      },
    ],
  },
  {
    title: "AlertDialogHeader",
    props: [
      {
        prop: "centered",
        type: "boolean",
        default: "false",
        description: "Center align the header content.",
      },
    ],
  },
  {
    title: "AlertDialogFooter",
    props: [
      {
        prop: "centered",
        type: "boolean",
        default: "false",
        description: "Center align the footer buttons.",
      },
      {
        prop: "layout",
        type: '"horizontal" | "stacked"',
        default: '"horizontal"',
        description: "Layout direction of the footer buttons.",
      },
    ],
  },
  {
    title: "AlertDialogAction",
    props: [
      {
        prop: "closeOnClick",
        type: "boolean",
        default: "true",
        description:
          "Close through Base UI after activation. Set false for custom async ownership.",
      },
      {
        prop: "variant",
        type: "Button variant",
        default: '"default"',
        description: "Style variant of the action button.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Show a pending icon and disable the button.",
      },
      {
        prop: "shortcut",
        type: "string",
        default: "undefined",
        description: "Keyboard shortcut to display next to the button text.",
      },
    ],
  },
  {
    title: "AlertDialogCancel",
    props: [
      {
        prop: "variant",
        type: "Button variant",
        default: '"outline"',
        description: "Style variant of the cancel button.",
      },
      {
        prop: "shortcut",
        type: "string",
        default: "undefined",
        description: "Keyboard shortcut to display next to the button text.",
      },
    ],
  },
  {
    title: "AlertDialogMedia",
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Style variant for the media icon container.",
      },
    ],
  },
  {
    title: "AlertDialogWarning",
    props: [
      {
        prop: "variant",
        type: '"info" | "warning" | "error" | "success"',
        default: '"warning"',
        description: "Style variant for the warning alert.",
      },
    ],
  },
  {
    title: "AlertDialogList",
    props: [
      {
        prop: "items",
        type: "string[]",
        default: "required",
        description: "Array of items to display in the list.",
      },
      {
        prop: "variant",
        type: '"bullet" | "numbered" | "checkbox"',
        default: '"bullet"',
        description: "List style variant.",
      },
    ],
  },
  {
    title: "KiraAlertDialog",
    props: [
      {
        prop: "trigger",
        type: "ReactElement",
        description:
          "Optional Base UI trigger; focus returns here after dismissal.",
      },
      {
        prop: "open / defaultOpen",
        type: "boolean",
        default: "false",
        description: "Controlled or initial uncontrolled visibility.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Visibility callback, including completion.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description:
          "External pending state; blocks confirmation and dismissal.",
      },
      {
        prop: "errorMessage",
        type: "string",
        default: '"Could not complete the action. Try again."',
        description:
          "Visible retry guidance after either confirm handler rejects.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "false",
        description:
          "Optional close affordance, disabled while pending or successful.",
      },
      {
        prop: "action",
        type: "ReactNode",
        description:
          "Custom action owns its gates and dismissal; the built-in shortcut is disabled.",
      },
      {
        prop: "onCancel",
        type: "() => void",
        description: "Called when the cancel button is activated.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Additional confirmation content.",
      },
      {
        prop: "variant",
        type: '"info" | "success" | "warning" | "destructive"',
        default: '"info"',
        description: "Variant that determines the icon and styling.",
      },
      {
        prop: "title",
        type: "string",
        default: "required",
        description: "Title text for the dialog.",
      },
      {
        prop: "description",
        type: "string",
        default: "undefined",
        description: "Description text for the dialog.",
      },
      {
        prop: "confirmText",
        type: "string",
        default: "undefined",
        description:
          "Require typing this exact string to enable confirm (renders an input).",
      },
      {
        prop: "confirmDelay",
        type: "number",
        default: "undefined",
        description:
          "Disable confirmation for N seconds of visible time; pause while the document is hidden.",
      },
      {
        prop: "onConfirmAsync",
        type: "() => Promise<void>",
        default: "undefined",
        description:
          "Async confirm; shows a pending state then a checkmark before closing.",
      },
      {
        prop: "onConfirm",
        type: "() => void | Promise<void>",
        default: "undefined",
        description:
          "Sync or async confirmation; shows success and closes after fulfillment. Rejections show errorMessage.",
      },
      {
        prop: "confirmLabel / cancelLabel",
        type: "string",
        default: '"Confirm" / "Cancel"',
        description: "Button labels.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Size variant of the dialog.",
      },
      {
        prop: "shortcut",
        type: "string",
        default: "undefined",
        description:
          "Confirm shortcut hint; ⌘/Ctrl+Enter also triggers confirm.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const alertDialogPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "5 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Reliable confirmation and recovery",
        description:
          "Synchronous duplicate guard, pending/success dismissal protection, stale-result and timer cleanup, unique confirmation IDs, safer initial focus, a single live status, and visible retry guidance. Uncontrolled trigger composition is supported. Audited on Base UI 1.9.0.",
      },
      {
        type: "breaking",
        title: "Action completion and popup layout",
        description:
          "AlertDialogAction closes by default; pass closeOnClick=false for async ownership. KiraAlertDialog manages both confirm handlers through success and closes after 500ms. Its close icon is now opt-in. Popup centering uses a viewport, shares Dialog variants and transitions on entry and exit; duration applies in milliseconds to both directions. Full size uses the available viewport height. Custom action nodes own their gates and dismissal.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function AlertDialogControlsSection({
  basicCode,
}: {
  basicCode: 'import { Button } from "@/components/ui/button"\nimport {\n  AlertDialog,\n  AlertDialogTrigger,\n  AlertDialogContent,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogCancel,\n  AlertDialogAction,\n} from "@/components/ui/alert-dialog"\n\nexport function BasicAlertDialog() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />\n      <AlertDialogContent>\n        <AlertDialogHeader>\n          <AlertDialogTitle>Are you sure?</AlertDialogTitle>\n          <AlertDialogDescription>\n            This action cannot be undone. This will permanently delete your\n            account and remove your data from our servers.\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Cancel</AlertDialogCancel>\n          <AlertDialogAction>Continue</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  )\n}';
}) {
  return (
    <DemoWrapper
      title="Basic Alert Dialog"
      description="Simple dialog with trigger, header, and action buttons."
      code={basicCode}
    >
      <div className="flex justify-center py-8">
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Show Dialog</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DemoWrapper>
  );
}

function AlertDialogControlsSection2({
  destructiveCode,
}: {
  destructiveCode: 'import { Button } from "@/components/ui/button"\nimport {\n  AlertDialog,\n  AlertDialogTrigger,\n  AlertDialogContent,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogCancel,\n  AlertDialogAction,\n} from "@/components/ui/alert-dialog"\n\nexport function DestructiveAlertDialog() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="destructive">Delete Account</Button>} />\n      <AlertDialogContent>\n        <AlertDialogHeader>\n          <AlertDialogTitle>Delete Account</AlertDialogTitle>\n          <AlertDialogDescription>\n            Are you sure you want to delete your account? All of your data\n            will be permanently removed. This action cannot be undone.\n          </AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Cancel</AlertDialogCancel>\n          <AlertDialogAction variant="destructive">\n            Yes, delete\n          </AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  )\n}';
}) {
  return (
    <DemoWrapper
      title="Destructive Action"
      description="Dialog with destructive variant for dangerous actions like deletion."
      code={destructiveCode}
    >
      <div className="flex justify-center py-8">
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive">Delete Account</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your account? All of your data
                will be permanently removed. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DemoWrapper>
  );
}

function AlertDialogControlsSection3({
  customCode,
}: {
  customCode: 'import { Button } from "@/components/ui/button"\nimport {\n  AlertDialog,\n  AlertDialogTrigger,\n  AlertDialogContent,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogCancel,\n  AlertDialogAction,\n  AlertDialogMedia,\n  AlertDialogWarning,\n  AlertDialogList,\n} from "@/components/ui/alert-dialog"\nimport { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"\n\nexport function CustomAlertDialog() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />\n      <AlertDialogContent size="lg">\n        <AlertDialogHeader>\n          <AlertDialogMedia variant="warning">\n            <IconAlertTriangle className="h-5 w-5" />\n          </AlertDialogMedia>\n          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>\n          <AlertDialogDescription>\n            Before you proceed, please note the following warning.\n          </AlertDialogDescription>\n          <AlertDialogWarning variant="warning">\n            This action will permanently delete all associated data and\n            cannot be undone.\n          </AlertDialogWarning>\n          <AlertDialogList\n            variant="bullet"\n            items={[\n              "All project files and assets",\n              "Team member access and permissions",\n              "API keys and integrations",\n            ]}\n          />\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Go Back</AlertDialogCancel>\n          <AlertDialogAction variant="destructive">\n            Delete Anyway\n          </AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  )\n}';
}) {
  return (
    <DemoWrapper
      title="Custom Styled Dialog"
      description="Dialog with media icons, warnings, lists, and custom sizing."
      code={customCode}
    >
      <div className="flex justify-center py-8">
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Show Dialog</Button>}
          />
          <AlertDialogContent size="lg">
            <AlertDialogHeader>
              <AlertDialogMedia variant="warning">
                <IconAlertTriangle className="h-5 w-5" />
              </AlertDialogMedia>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Before you proceed, please note the following warning.
              </AlertDialogDescription>
              <AlertDialogWarning variant="warning">
                This action will permanently delete all associated data and
                cannot be undone.
              </AlertDialogWarning>
              <AlertDialogList
                variant="bullet"
                items={[
                  "All project files and assets",
                  "Team member access and permissions",
                  "API keys and integrations",
                  "Custom domain configurations",
                ]}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go Back</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Delete Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DemoWrapper>
  );
}
