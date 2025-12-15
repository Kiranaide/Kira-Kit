import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function FieldPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Field</h1>
        <p className="text-muted-foreground">
          Form field wrapper with label, description, and error handling.
        </p>
      </header>

      {/* Basic Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Field
        </h2>
        <div className="max-w-md">
          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <Input placeholder="you@example.com" type="email" />
          </Field>
        </div>
      </section>

      {/* With Description */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Description
        </h2>
        <div className="max-w-md">
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input placeholder="Enter username" />
            <FieldDescription>
              Your username must be 3-20 characters long.
            </FieldDescription>
          </Field>
        </div>
      </section>

      {/* With Error */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Error
        </h2>
        <div className="max-w-md">
          <Field data-invalid="true">
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter password"
              aria-invalid="true"
            />
            <FieldError>Password must be at least 8 characters.</FieldError>
          </Field>
        </div>
      </section>

      {/* Field Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Field Group
        </h2>
        <div className="max-w-md">
          <FieldGroup>
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input placeholder="John" />
            </Field>
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input placeholder="Doe" />
            </Field>
          </FieldGroup>
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
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

<Field>
  <FieldLabel>Label</FieldLabel>
  <Input placeholder="..." />
  <FieldDescription>Help text</FieldDescription>
  <FieldError>Error message</FieldError>
</Field>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
