import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogList,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogWarning,
  AlertDialogWithIcon,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

export function AlertDialogPage() {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Alert Dialog</h1>
        <p className="text-muted-foreground">
          Modal dialog for important confirmations that require user action.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Alert Dialog
        </h2>
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
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Dialogs with sm, default, lg, and xl sizes for different content
          amounts.
        </p>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="outline" size="sm">
                  Small
                </Button>
              }
            />
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Small Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  Compact dialog for simple confirmations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Default</Button>}
            />
            <AlertDialogContent size="default">
              <AlertDialogHeader>
                <AlertDialogTitle>Default Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  Standard dialog size for most use cases.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Large</Button>}
            />
            <AlertDialogContent size="lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Large Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  Larger dialog for more content. Supports longer descriptions
                  and additional context.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Extra Large</Button>}
            />
            <AlertDialogContent size="xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Extra Large Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  Extra large dialog for complex confirmations with multiple
                  sections.
                </AlertDialogDescription>
                <AlertDialogWarning variant="warning">
                  This action will affect multiple users and cannot be undone.
                </AlertDialogWarning>
                <AlertDialogList
                  variant="bullet"
                  items={[
                    "All user data will be archived for 30 days",
                    "API access will be revoked immediately",
                    "Connected integrations will be disconnected",
                    "Billing will be prorated",
                  ]}
                />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Fullscreen</Button>}
            />
            <AlertDialogContent size="full" showCloseButton>
              <AlertDialogHeader>
                <AlertDialogTitle>Fullscreen Dialog</AlertDialogTitle>
                <AlertDialogDescription>
                  A fullscreen dialog for immersive content or complex
                  workflows.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex-1 min-h-0 overflow-auto p-4 bg-muted/30 rounded-lg">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This content area expands to fill the remaining space.
                    Header and footer take only the space they need.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-background rounded-lg p-4 border"
                      >
                        <h3 className="font-medium">Card {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">
                          Content area
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* Destructive Action */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Destructive Action
        </h2>
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
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <p className="text-sm text-muted-foreground">
          Action buttons with loading state for async operations.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Async Action</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Process Data</AlertDialogTitle>
              <AlertDialogDescription>
                Click confirm to start processing. This may take a few seconds.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction loading={loading} onClick={handleAsyncAction}>
                {loading ? "Processing..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* With Keyboard Shortcuts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Keyboard Shortcuts
        </h2>
        <p className="text-sm text-muted-foreground">
          Action buttons can display keyboard shortcuts for power users.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">With Shortcuts</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Keyboard Navigation</AlertDialogTitle>
              <AlertDialogDescription>
                Press Enter to confirm or Escape to cancel. Shortcuts are
                displayed for quick actions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel shortcut="Esc">Cancel</AlertDialogCancel>
              <AlertDialogAction shortcut="↵">Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* With Media Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Media Icon
        </h2>
        <p className="text-sm text-muted-foreground">
          Dialog with variant-styled media icons for visual context.
        </p>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Info</Button>}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia variant="info">
                  <IconInfoCircle className="h-5 w-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Information</AlertDialogTitle>
                <AlertDialogDescription>
                  This is an informational message for the user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Got it</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Success</Button>}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia variant="success">
                  <IconCircleCheck className="h-5 w-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Success!</AlertDialogTitle>
                <AlertDialogDescription>
                  Your changes have been saved successfully.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Great</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Warning</Button>}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia variant="warning">
                  <IconAlertTriangle className="h-5 w-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Warning</AlertDialogTitle>
                <AlertDialogDescription>
                  Please review this information carefully.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Proceed</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline">Destructive</Button>}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia variant="destructive">
                  <IconX className="h-5 w-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Error Occurred</AlertDialogTitle>
                <AlertDialogDescription>
                  Something went wrong. Please try again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction variant="destructive">
                  Retry
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* With Warning Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Warning Component
        </h2>
        <p className="text-sm text-muted-foreground">
          Built-in warning component for important notices.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Show Warning</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Before you proceed, please note the following warning.
              </AlertDialogDescription>
              <AlertDialogWarning variant="warning">
                This action will permanently delete all associated data and
                cannot be undone.
              </AlertDialogWarning>
              <AlertDialogWarning variant="error">
                Your subscription will be cancelled immediately upon deletion.
              </AlertDialogWarning>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go Back</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Delete Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* With List Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With List Component
        </h2>
        <p className="text-sm text-muted-foreground">
          Lists with bullet, numbered, or checkbox styles for itemized content.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Show List</Button>}
          />
          <AlertDialogContent size="lg">
            <AlertDialogHeader>
              <AlertDialogTitle>What will be deleted</AlertDialogTitle>
              <AlertDialogDescription>
                The following items will be removed from your account:
              </AlertDialogDescription>
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Checkbox List</Button>}
          />
          <AlertDialogContent size="lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Select Items</AlertDialogTitle>
              <AlertDialogDescription>
                Select which items you want to export:
              </AlertDialogDescription>
              <AlertDialogList
                variant="checkbox"
                items={[
                  "Documents (15 files)",
                  "Images (42 files)",
                  "Videos (8 files)",
                  "Archives (3 files)",
                ]}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Export Selected</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* With Close Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Close Button
        </h2>
        <p className="text-sm text-muted-foreground">
          Dialog with dismissible close button in the corner.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Dismissible</Button>}
          />
          <AlertDialogContent>
            <AlertDialogClose />
            <AlertDialogHeader>
              <AlertDialogTitle>Dismissible Dialog</AlertDialogTitle>
              <AlertDialogDescription>
                You can close this dialog by clicking the X button in the
                corner, pressing Escape, or clicking outside the dialog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Centered Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Centered Layout
        </h2>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline">Centered Dialog</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader centered>
              <AlertDialogTitle>Successfully Saved</AlertDialogTitle>
              <AlertDialogDescription>
                Your changes have been saved successfully to the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-center py-4">
              <div className="bg-success/20 text-success-foreground p-4 rounded-full">
                <IconCircleCheck className="size-8" />
              </div>
            </div>
            <AlertDialogFooter centered>
              <AlertDialogAction className="w-full sm:w-auto">
                Awesome
              </AlertDialogAction>
            </AlertDialogFooter>
            <AlertDialogClose />
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* AlertDialogWithIcon Convenience Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          AlertDialogWithIcon (Convenience Component)
        </h2>
        <p className="text-sm text-muted-foreground">
          Quick dialogs with built-in icon variants and async support.
        </p>
        <div className="flex flex-wrap gap-3">
          <AlertDialogWithIcon
            variant="info"
            title="New Feature Available"
            description="Check out the new dashboard customization options in your settings."
            confirmLabel="Learn More"
            onConfirm={() => console.log("Learn more clicked")}
          />
          <AlertDialogWithIcon
            variant="success"
            title="Changes Saved"
            description="Your settings have been updated successfully."
            onConfirm={() => console.log("OK clicked")}
          />
          <AlertDialogWithIcon
            variant="warning"
            title="Storage Low"
            description="You're running out of storage space. Upgrade or delete some files."
            confirmLabel="Upgrade"
            cancelLabel="Later"
            onConfirm={() => console.log("Upgrade clicked")}
          />
          <AlertDialogWithIcon
            variant="destructive"
            title="Delete Project?"
            description="This will permanently delete the project and all its data. This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            loading={loading}
            onConfirm={async () => {
              setLoading(true);
              await new Promise((r) => setTimeout(r, 2000));
              setLoading(false);
            }}
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogWithIcon,
  AlertDialogWarning,
  AlertDialogList,
  AlertDialogClose,
} from "@/components/ui/alert-dialog"

// Basic
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

// With loading state
<AlertDialogAction loading={isLoading} onClick={handleAction}>
  {isLoading ? "Loading..." : "Confirm"}
</AlertDialogAction>

// With keyboard shortcut
<AlertDialogAction shortcut="↵">Confirm</AlertDialogAction>
<AlertDialogCancel shortcut="Esc">Cancel</AlertDialogCancel>

// With size
<AlertDialogContent size="lg">...</AlertDialogContent>

// Convenience component
<AlertDialogWithIcon
  variant="danger"
  title="Delete Item?"
  description="This cannot be undone."
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>

// With warning
<AlertDialogWarning variant="warning">
  This action is permanent and cannot be undone.
</AlertDialogWarning>

// With list
<AlertDialogList
  variant="bullet"
  items={["Item 1", "Item 2", "Item 3"]}
/>

// With close button
<AlertDialogClose />
<AlertDialogContent>
  <AlertDialogClose />
  ...
</AlertDialogContent>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
