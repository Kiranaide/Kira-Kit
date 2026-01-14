"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldCharacterCount,
  FieldValidationIcon,
  FieldRow,
  FormField,
  FieldSeparator,
  FieldContent,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "You must be at least 18 years old"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type UserFormValues = z.infer<typeof userSchema>;

function validateSchema<T>(schema: z.ZodSchema<T>) {
  return ({ value }: { value: T }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (path) {
          errors[path] = issue.message;
        }
      }
      return errors;
    }
    return undefined;
  };
}

export function FieldPage() {
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const maxBioLength = 160;
  const maxUsernameLength = 20;

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    } as LoginFormValues,
    validators: {
      onChange: validateSchema(loginSchema),
      onSubmit: ({ value }) => {
        console.log("Login form submitted:", value);
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      console.log("Login submitted:", value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Login successful!");
    },
  });

  const userForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
    } as UserFormValues,
    validators: {
      onChange: validateSchema(userSchema),
    },
    onSubmit: async ({ value }) => {
      console.log("User form submitted:", value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("User created!");
    },
  });

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Field</h1>
        <p className="text-muted-foreground">
          Form field wrapper with label, description, error handling, and
          accessibility features. Now with FieldContext for state propagation
          and TanStack Form + Zod integration.
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

      {/* Required Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Required Field
        </h2>
        <p className="text-sm text-muted-foreground">
          Fields can be marked as required, which automatically shows an
          asterisk indicator on the label.
        </p>
        <div className="max-w-md space-y-4">
          <Field required>
            <FieldLabel>Full Name</FieldLabel>
            <Input placeholder="Enter your full name" />
            <FieldDescription>
              Your legal full name as it appears on official documents.
            </FieldDescription>
          </Field>

          <Field required>
            <FieldLabel requiredIndicator=" (required)">
              Email Address
            </FieldLabel>
            <Input placeholder="you@example.com" type="email" />
            <FieldDescription>Custom required indicator text.</FieldDescription>
          </Field>
        </div>
      </section>

      {/* Disabled Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled Field
        </h2>
        <p className="text-sm text-muted-foreground">
          Setting <code className="bg-muted px-1 rounded">disabled</code> on
          Field cascades to all children via context.
        </p>
        <div className="max-w-md">
          <Field disabled>
            <FieldLabel>Username</FieldLabel>
            <Input placeholder="username" defaultValue="john_doe" />
            <FieldDescription>
              This field is disabled and cannot be edited.
            </FieldDescription>
          </Field>
        </div>
      </section>

      {/* Read-Only Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Read-Only Field
        </h2>
        <div className="max-w-md">
          <Field readOnly>
            <FieldLabel>Account ID</FieldLabel>
            <Input defaultValue="ACC-2024-001234" />
            <FieldDescription>
              Read-only fields can be selected but not modified.
            </FieldDescription>
          </Field>
        </div>
      </section>

      {/* Invalid Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Invalid Field
        </h2>
        <p className="text-sm text-muted-foreground">
          The <code className="bg-muted px-1 rounded">invalid</code> prop
          triggers error styling across the field.
        </p>
        <div className="max-w-md">
          <Field invalid>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter password"
              defaultValue="short"
            />
            <FieldError showIcon>
              Password must be at least 8 characters.
            </FieldError>
          </Field>
        </div>
      </section>

      {/* Character Count */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Character Count
        </h2>
        <p className="text-sm text-muted-foreground">
          FieldCharacterCount displays remaining characters with warning and
          error states.
        </p>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel>Bio</FieldLabel>
            <textarea
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Tell us about yourself..."
              maxLength={maxBioLength + 20}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <FieldDescription>
                A short description about yourself.
              </FieldDescription>
              <FieldCharacterCount current={bio.length} max={maxBioLength} />
            </div>
          </Field>

          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input
              placeholder="Choose a username"
              maxLength={maxUsernameLength + 5}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <FieldDescription>
                3-20 characters, letters and numbers only.
              </FieldDescription>
              <FieldCharacterCount
                current={username.length}
                max={maxUsernameLength}
                showOnlyNearLimit
                warningThreshold={75}
              />
            </div>
          </Field>
        </div>
      </section>

      {/* Validation Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Validation Icons
        </h2>
        <p className="text-sm text-muted-foreground">
          FieldValidationIcon provides visual feedback for validation states.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FieldValidationIcon state="valid" />
            <span className="text-sm">Valid</span>
          </div>
          <div className="flex items-center gap-2">
            <FieldValidationIcon state="invalid" />
            <span className="text-sm">Invalid</span>
          </div>
          <div className="flex items-center gap-2">
            <FieldValidationIcon state="validating" />
            <span className="text-sm">Validating</span>
          </div>
        </div>
      </section>

      {/* Field Row */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Field Row
        </h2>
        <p className="text-sm text-muted-foreground">
          FieldRow provides horizontal layout for multiple fields with
          responsive behavior.
        </p>
        <div className="max-w-xl">
          <FieldRow>
            <Field required className="flex-1">
              <FieldLabel>First Name</FieldLabel>
              <Input placeholder="John" />
            </Field>
            <Field required className="flex-1">
              <FieldLabel>Last Name</FieldLabel>
              <Input placeholder="Doe" />
            </Field>
          </FieldRow>
        </div>
      </section>

      {/* FieldSet with Legend */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          FieldSet with Legend
        </h2>
        <div className="max-w-md">
          <FieldSet>
            <FieldLegend showRequired>Contact Information</FieldLegend>
            <FieldDescription>
              Please provide your contact details.
            </FieldDescription>
            <FieldGroup>
              <Field required>
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="you@example.com" type="email" />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input placeholder="+1 (555) 000-0000" type="tel" />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </section>

      {/* Field Group with Outline Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Field Group Variants
        </h2>
        <div className="max-w-md space-y-4">
          <FieldGroup variant="outline">
            <Field>
              <FieldLabel>Payment Method</FieldLabel>
              <Input placeholder="Card number" />
            </Field>
            <FieldSeparator>or</FieldSeparator>
            <Field>
              <FieldLabel>Bank Account</FieldLabel>
              <Input placeholder="Account number" />
            </Field>
          </FieldGroup>
        </div>
      </section>

      {/* Horizontal Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal Layout
        </h2>
        <div className="max-w-xl space-y-4">
          <Field orientation="horizontal">
            <Checkbox id="terms" />
            <FieldContent>
              <FieldLabel htmlFor="terms">
                Accept terms and conditions
              </FieldLabel>
              <FieldDescription>
                By checking this box, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="horizontal" required>
            <Checkbox id="newsletter" />
            <FieldContent>
              <FieldLabel htmlFor="newsletter">
                Subscribe to newsletter
              </FieldLabel>
              <FieldDescription>
                Receive weekly updates about new features and promotions.
              </FieldDescription>
            </FieldContent>
          </Field>
        </div>
      </section>

      {/* TanStack Form + Zod Login Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          TanStack Form + Zod Validation
        </h2>
        <div className="max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginForm.handleSubmit();
            }}
          >
            <div className="space-y-4">
              <FormField name="email" form={loginForm} required>
                {(field) => (
                  <>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="you@example.com"
                    />
                    <FieldError field={field} showIcon />
                  </>
                )}
              </FormField>

              <FormField name="password" form={loginForm} required>
                {(field) => (
                  <>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter password"
                    />
                    <FieldError field={field} showIcon />
                  </>
                )}
              </FormField>

              <FormField name="confirmPassword" form={loginForm} required>
                {(field) => (
                  <>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Confirm password"
                    />
                    <FieldError field={field} showIcon />
                  </>
                )}
              </FormField>

              <div className="pt-2">
                <loginForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  )}
                />
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* User Registration Form */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          User Registration with Horizontal Layout
        </h2>
        <div className="max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              userForm.handleSubmit();
            }}
          >
            <div className="space-y-4">
              <FieldGroup>
                <FormField
                  name="firstName"
                  form={userForm}
                  orientation="horizontal"
                  required
                >
                  {(field) => (
                    <>
                      <FieldLabel className="w-32">First Name</FieldLabel>
                      <div className="flex-1 space-y-1">
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="John"
                        />
                        <FieldError field={field} />
                      </div>
                    </>
                  )}
                </FormField>

                <FormField
                  name="lastName"
                  form={userForm}
                  orientation="horizontal"
                  required
                >
                  {(field) => (
                    <>
                      <FieldLabel className="w-32">Last Name</FieldLabel>
                      <div className="flex-1 space-y-1">
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Doe"
                        />
                        <FieldError field={field} />
                      </div>
                    </>
                  )}
                </FormField>
              </FieldGroup>

              <FormField name="email" form={userForm} required>
                {(field) => (
                  <>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="john@example.com"
                    />
                    <FieldError field={field} />
                  </>
                )}
              </FormField>

              <FormField name="age" form={userForm} required>
                {(field) => (
                  <>
                    <FieldLabel>Age</FieldLabel>
                    <Input
                      type="number"
                      value={field.state.value || ""}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value) || 0)
                      }
                      onBlur={field.handleBlur}
                      placeholder="18"
                    />
                    <FieldError field={field} />
                  </>
                )}
              </FormField>

              <div className="pt-2">
                <userForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                  )}
                />
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Accessibility Notes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Accessibility
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium">Built-in Accessibility Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              <strong>Auto ID generation:</strong> Labels are automatically
              linked to inputs via generated IDs
            </li>
            <li>
              <strong>ARIA attributes:</strong> <code>aria-describedby</code>{" "}
              links descriptions and errors to inputs
            </li>
            <li>
              <strong>Required indicator:</strong> Asterisk is marked with{" "}
              <code>aria-hidden="true"</code>
            </li>
            <li>
              <strong>Error announcements:</strong> Errors use{" "}
              <code>role="alert"</code> and <code>aria-live="polite"</code>
            </li>
            <li>
              <strong>Disabled state:</strong> Cascades through context to all
              child elements
            </li>
            <li>
              <strong>Character count:</strong> Uses <code>aria-live</code> for
              screen reader updates
            </li>
          </ul>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldCharacterCount,
  FieldGroup,
  FormField,
} from "@/components/ui/field"

// Basic field with required indicator
<Field required>
  <FieldLabel>Email</FieldLabel>
  <Input placeholder="you@example.com" />
  <FieldDescription>We'll never share your email.</FieldDescription>
</Field>

// Field with character count
<Field>
  <FieldLabel>Bio</FieldLabel>
  <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
  <div className="flex justify-between">
    <FieldDescription>A short bio.</FieldDescription>
    <FieldCharacterCount current={bio.length} max={160} />
  </div>
</Field>

// Disabled field (cascades to children)
<Field disabled>
  <FieldLabel>Username</FieldLabel>
  <Input defaultValue="readonly_user" />
</Field>

// With TanStack Form
<FormField name="email" form={form} required>
  {(field) => (
    <>
      <FieldLabel>Email</FieldLabel>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError field={field} showIcon />
    </>
  )}
</FormField>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
