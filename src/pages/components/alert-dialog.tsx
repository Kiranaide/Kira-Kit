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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

export default function AlertDialogPage() {
  const basicCode = `import {
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

  const destructiveCode = `import {
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

  const customCode = `import {
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

  return (
    <ComponentPage>
      <PageHeader
        title="Alert Dialog"
        description="Modal dialog for important confirmations that require user action."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description:
              "Full keyboard navigation with Escape to close, Enter to confirm, and proper ARIA roles for screen readers.",
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
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
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
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
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
            ),
          },
          {
            value: "destructive",
            label: "Destructive",
            demo: (
              <DemoWrapper
                title="Destructive Action"
                description="Dialog with destructive variant for dangerous actions like deletion."
                code={destructiveCode}
              >
                <div className="flex justify-center py-8">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="destructive">Delete Account</Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your account? All of
                          your data will be permanently removed. This action
                          cannot be undone.
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
            ),
          },
          {
            value: "custom",
            label: "Custom",
            demo: (
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
                          This action will permanently delete all associated
                          data and cannot be undone.
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
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Escape", description: "Close dialog" },
          { keys: "Enter", description: "Trigger primary action" },
          { keys: "Space", description: "Trigger focused action" },
          { keys: "Tab", description: "Navigate between elements" },
          { keys: "Shift + Tab", description: "Navigate backwards" },
        ]}
      />

      <UsageBlock
        code={`import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogWithIcon,
  AlertDialogWarning,
  AlertDialogList,
  AlertDialogClose,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"

// Basic usage
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Title</AlertDialogTitle>
      <AlertDialogDescription>Description</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// With size variant
<AlertDialogContent size="lg">...</AlertDialogContent>

// With media icon
<AlertDialogHeader>
  <AlertDialogMedia variant="warning">
    <IconAlertTriangle className="h-5 w-5" />
  </AlertDialogMedia>
  <AlertDialogTitle>Warning</AlertDialogTitle>
</AlertDialogHeader>

// With loading state
<AlertDialogAction loading={isLoading} onClick={handleAction}>
  {isLoading ? "Loading..." : "Confirm"}
</AlertDialogAction>

// With keyboard shortcut
<AlertDialogAction shortcut="↵">Confirm</AlertDialogAction>
<AlertDialogCancel shortcut="Esc">Cancel</AlertDialogCancel>

// With warning component
<AlertDialogWarning variant="warning">
  This action is permanent and cannot be undone.
</AlertDialogWarning>

// With list component
<AlertDialogList
  variant="bullet"
  items={["Item 1", "Item 2", "Item 3"]}
/>

// Convenience component
<AlertDialogWithIcon
  variant="destructive"
  title="Delete Item?"
  description="This cannot be undone."
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>`}
      />

      <APIReference
        sections={[
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
                default: "100",
                description: "Animation duration in milliseconds.",
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
                prop: "variant",
                type: "Button variant",
                default: '"default"',
                description: "Style variant of the action button.",
              },
              {
                prop: "loading",
                type: "boolean",
                default: "false",
                description: "Show loading spinner and disable the button.",
              },
              {
                prop: "shortcut",
                type: "string",
                default: "undefined",
                description:
                  "Keyboard shortcut to display next to the button text.",
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
                description:
                  "Keyboard shortcut to display next to the button text.",
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
            title: "AlertDialogWithIcon",
            props: [
              {
                prop: "variant",
                type: '"info" | "success" | "warning" | "danger" | "destructive"',
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
                prop: "confirmLabel",
                type: "string",
                default: '"Confirm"',
                description: "Text for the confirm button.",
              },
              {
                prop: "cancelLabel",
                type: "string",
                default: '"Cancel"',
                description: "Text for the cancel button.",
              },
              {
                prop: "loading",
                type: "boolean",
                default: "false",
                description: "Show loading state on the confirm button.",
              },
              {
                prop: "onConfirm",
                type: "() => void | Promise<void>",
                default: "undefined",
                description: "Callback when confirm button is clicked.",
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
                description: "Keyboard shortcut for the confirm action.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
