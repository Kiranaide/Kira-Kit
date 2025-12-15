import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertWithHeading,
} from "@/components/ui/alert";

export function AlertPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Alert</h1>
        <p className="text-muted-foreground">
          Displays a callout for user attention with colored variants.
        </p>
      </header>

      {/* Filled Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Filled Variants
        </h2>
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
        </div>
      </section>

      {/* Outline Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Outline Variants
        </h2>
        <div className="space-y-4">
          <Alert variant="outline-info">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Outline style with border only.</AlertDescription>
          </Alert>
          <Alert variant="outline-success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Outline success alert.</AlertDescription>
          </Alert>
          <Alert variant="outline-warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Outline warning alert.</AlertDescription>
          </Alert>
          <Alert variant="outline-destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Outline destructive alert.</AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Closable Alert */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Closable Alert
        </h2>
        <Alert variant="info" closable onClose={() => console.log("Closed!")}>
          <AlertTitle>Dismissible Alert</AlertTitle>
          <AlertDescription>
            Click the X button to dismiss this alert with animation.
          </AlertDescription>
        </Alert>
        <Alert variant="warning" closable>
          <AlertTitle>Another Closable</AlertTitle>
          <AlertDescription>This one is also dismissible.</AlertDescription>
        </Alert>
      </section>

      {/* Without Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Icon
        </h2>
        <Alert variant="info" showIcon={false}>
          <AlertTitle>No Icon Alert</AlertTitle>
          <AlertDescription>
            This alert has the icon disabled using showIcon=false.
          </AlertDescription>
        </Alert>
      </section>

      {/* Alert With Heading Component */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          AlertWithHeading (Convenience Component)
        </h2>
        <div className="space-y-4">
          <AlertWithHeading
            variant="info"
            title="Quick Info"
            description="Use AlertWithHeading for a simpler API."
          />
          <AlertWithHeading
            variant="success"
            title="Saved Successfully"
            description="Your changes have been saved."
            closable
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
            {`import { Alert, AlertTitle, AlertDescription, AlertWithHeading } from "@/components/ui/alert"

{/* Basic with icon */}
<Alert variant="info">
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>

{/* Outline variant */}
<Alert variant="outline-success" />

{/* Closable */}
<Alert variant="warning" closable onClose={() => {}} />

{/* Convenience component */}
<AlertWithHeading variant="info" title="Title" description="Desc" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
