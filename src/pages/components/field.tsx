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
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";
import { Card, CardContent } from "@/components/ui/card";

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

export default function FieldPage() {
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
    <ComponentPage>
      <PageHeader
        title="Field"
        description="Form field wrapper with label, description, error handling, and accessibility features. Now with FieldContext for state propagation and TanStack Form + Zod integration."
        version="v2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description:
              "Auto ID generation, ARIA attributes, and proper label/input linking. Required indicators are marked with aria-hidden for screen readers.",
          },
          {
            title: "Context Propagation",
            description:
              "FieldContext cascades disabled, required, readOnly, and invalid states to all child components automatically.",
          },
          {
            title: "TanStack Form Ready",
            description:
              "FormField component integrates with TanStack Form for validation, error handling, and form state management with Zod support.",
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
              <div className="space-y-6">
                <DemoWrapper
                  title="Basic Field"
                  description="Simple field with label and input."
                  code={`import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field>
  <FieldLabel>Email Address</FieldLabel>
  <Input placeholder="you@example.com" type="email" />
</Field>`}
                >
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input placeholder="you@example.com" type="email" />
                  </Field>
                </DemoWrapper>

                <DemoWrapper
                  title="Required Field"
                  description="Fields can be marked as required with automatic asterisk indicator."
                  code={`<Field required>
  <FieldLabel>Full Name</FieldLabel>
  <Input placeholder="Enter your full name" />
  <FieldDescription>
    Your legal full name as it appears on official documents.
  </FieldDescription>
</Field>`}
                >
                  <Field required>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input placeholder="Enter your full name" />
                    <FieldDescription>
                      Your legal full name as it appears on official documents.
                    </FieldDescription>
                  </Field>
                </DemoWrapper>

                <DemoWrapper
                  title="Disabled Field"
                  description="Setting disabled on Field cascades to all children via context."
                  code={`<Field disabled>
  <FieldLabel>Username</FieldLabel>
  <Input placeholder="username" defaultValue="john_doe" />
  <FieldDescription>
    This field is disabled and cannot be edited.
  </FieldDescription>
</Field>`}
                >
                  <Field disabled>
                    <FieldLabel>Username</FieldLabel>
                    <Input placeholder="username" defaultValue="john_doe" />
                    <FieldDescription>
                      This field is disabled and cannot be edited.
                    </FieldDescription>
                  </Field>
                </DemoWrapper>

                <DemoWrapper
                  title="Read-Only Field"
                  description="Read-only fields can be selected but not modified."
                  code={`<Field readOnly>
  <FieldLabel>Account ID</FieldLabel>
  <Input defaultValue="ACC-2024-001234" />
  <FieldDescription>
    Read-only fields can be selected but not modified.
  </FieldDescription>
</Field>`}
                >
                  <Field readOnly>
                    <FieldLabel>Account ID</FieldLabel>
                    <Input defaultValue="ACC-2024-001234" />
                    <FieldDescription>
                      Read-only fields can be selected but not modified.
                    </FieldDescription>
                  </Field>
                </DemoWrapper>

                <DemoWrapper
                  title="Invalid Field"
                  description="The invalid prop triggers error styling across the field."
                  code={`<Field invalid>
  <FieldLabel>Password</FieldLabel>
  <Input
    type="password"
    placeholder="Enter password"
    defaultValue="short"
  />
  <FieldError showIcon>
    Password must be at least 8 characters.
  </FieldError>
</Field>`}
                >
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
                </DemoWrapper>
              </div>
            ),
          },
          {
            value: "validation",
            label: "Validation",
            demo: (
              <div className="space-y-6">
                <DemoWrapper
                  title="Character Count"
                  description="FieldCharacterCount displays remaining characters with warning and error states."
                  code={`const [bio, setBio] = useState("")
const maxBioLength = 160

<Field>
  <FieldLabel>Bio</FieldLabel>
  <textarea
    placeholder="Tell us about yourself..."
    maxLength={maxBioLength + 20}
    value={bio}
    onChange={(e) => setBio(e.target.value)}
  />
  <div className="flex items-center justify-between">
    <FieldDescription>A short description about yourself.</FieldDescription>
    <FieldCharacterCount current={bio.length} max={maxBioLength} />
  </div>
</Field>`}
                >
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
                      <FieldCharacterCount
                        current={bio.length}
                        max={maxBioLength}
                      />
                    </div>
                  </Field>
                </DemoWrapper>

                <DemoWrapper
                  title="Character Count with Warning Threshold"
                  description="Show warning color when near limit and hide until threshold is reached."
                  code={`<Field>
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
</Field>`}
                >
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
                </DemoWrapper>

                <DemoWrapper
                  title="Validation Icons"
                  description="FieldValidationIcon provides visual feedback for validation states."
                  code={`<div className="flex items-center gap-6">
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
</div>`}
                >
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
                </DemoWrapper>
              </div>
            ),
          },
          {
            value: "layout",
            label: "Layout",
            demo: (
              <div className="space-y-6">
                <DemoWrapper
                  title="Field Row"
                  description="FieldRow provides horizontal layout for multiple fields with responsive behavior."
                  code={`<FieldRow>
  <Field required className="flex-1">
    <FieldLabel>First Name</FieldLabel>
    <Input placeholder="John" />
  </Field>
  <Field required className="flex-1">
    <FieldLabel>Last Name</FieldLabel>
    <Input placeholder="Doe" />
  </Field>
</FieldRow>`}
                >
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
                </DemoWrapper>

                <DemoWrapper
                  title="FieldSet with Legend"
                  description="FieldSet and FieldLegend provide semantic fieldset/legend structure for form sections."
                  code={`<FieldSet>
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
</FieldSet>`}
                >
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
                </DemoWrapper>

                <DemoWrapper
                  title="Field Group Outline Variant"
                  description="FieldGroup with outline variant wraps fields with a bordered container."
                  code={`<FieldGroup variant="outline">
  <Field>
    <FieldLabel>Payment Method</FieldLabel>
    <Input placeholder="Card number" />
  </Field>
  <FieldSeparator>or</FieldSeparator>
  <Field>
    <FieldLabel>Bank Account</FieldLabel>
    <Input placeholder="Account number" />
  </Field>
</FieldGroup>`}
                >
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
                </DemoWrapper>

                <DemoWrapper
                  title="Horizontal Layout"
                  description="Field with horizontal orientation aligns label and content side by side."
                  code={`<Field orientation="horizontal">
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
</Field>`}
                >
                  <div className="space-y-4">
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
                          Receive weekly updates about new features and
                          promotions.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </div>
                </DemoWrapper>
              </div>
            ),
          },
          {
            value: "forms",
            label: "Forms",
            demo: (
              <div className="space-y-6">
                <DemoWrapper
                  title="Login Form with TanStack Form + Zod"
                  description="Complete form with validation using TanStack Form and Zod schema."
                  code={`import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { FormField } from "@/components/ui/field"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const form = useForm({
  defaultValues: { email: "", password: "", confirmPassword: "" },
  validators: {
    onChange: validateSchema(loginSchema),
  },
  onSubmit: async ({ value }) => {
    console.log("Login:", value)
  },
})

<form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
  <FormField name="email" form={form} required>
    {(field) => (
      <>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        <FieldError field={field} showIcon />
      </>
    )}
  </FormField>
  {/* More fields... */}
  <form.Subscribe
    selector={(state) => [state.canSubmit, state.isSubmitting]}
    children={([canSubmit, isSubmitting]) => (
      <Button type="submit" disabled={!canSubmit}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    )}
  />
</form>`}
                  previewClassName="min-h-[400px]"
                >
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              placeholder="Enter password"
                            />
                            <FieldError field={field} showIcon />
                          </>
                        )}
                      </FormField>

                      <FormField
                        name="confirmPassword"
                        form={loginForm}
                        required
                      >
                        {(field) => (
                          <>
                            <FieldLabel>Confirm Password</FieldLabel>
                            <Input
                              type="password"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              placeholder="Confirm password"
                            />
                            <FieldError field={field} showIcon />
                          </>
                        )}
                      </FormField>

                      <div className="pt-2">
                        <loginForm.Subscribe
                          selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                          ]}
                          children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit}>
                              {isSubmitting ? "Signing in..." : "Sign In"}
                            </Button>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </DemoWrapper>

                <DemoWrapper
                  title="User Registration with Horizontal Layout"
                  description="Registration form with horizontal field orientation and validation."
                  code={`const userForm = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    age: 0,
  },
  validators: {
    onChange: validateSchema(userSchema),
  },
})

<form onSubmit={(e) => { e.preventDefault(); userForm.handleSubmit() }}>
  <FieldGroup>
    <FormField name="firstName" form={userForm} orientation="horizontal" required>
      {(field) => (
        <>
          <FieldLabel className="w-32">First Name</FieldLabel>
          <div className="flex-1 space-y-1">
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <FieldError field={field} />
          </div>
        </>
      )}
    </FormField>
  </FieldGroup>
  {/* More fields... */}
</form>`}
                  previewClassName="min-h-[400px]"
                >
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
                              <FieldLabel className="w-32">
                                First Name
                              </FieldLabel>
                              <div className="flex-1 space-y-1">
                                <Input
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
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
                              <FieldLabel className="w-32">
                                Last Name
                              </FieldLabel>
                              <div className="flex-1 space-y-1">
                                <Input
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                                field.handleChange(
                                  parseInt(e.target.value) || 0,
                                )
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
                          selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                          ]}
                          children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit}>
                              {isSubmitting ? "Creating..." : "Create Account"}
                            </Button>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </DemoWrapper>
              </div>
            ),
          },
          {
            value: "accessibility",
            label: "Accessibility",
            demo: (
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium">
                      Built-in Accessibility Features:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Auto ID generation:</strong> Labels are
                        automatically linked to inputs via generated IDs
                      </li>
                      <li>
                        <strong>ARIA attributes:</strong>{" "}
                        <code>aria-describedby</code> links descriptions and
                        errors to inputs
                      </li>
                      <li>
                        <strong>Required indicator:</strong> Asterisk is marked
                        with <code>aria-hidden="true"</code>
                      </li>
                      <li>
                        <strong>Error announcements:</strong> Errors use{" "}
                        <code>role="alert"</code> and{" "}
                        <code>aria-live="polite"</code>
                      </li>
                      <li>
                        <strong>Disabled state:</strong> Cascades through
                        context to all child elements
                      </li>
                      <li>
                        <strong>Character count:</strong> Uses{" "}
                        <code>aria-live</code> for screen reader updates
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />

      <UsageBlock
        code={`import { useForm } from '@tanstack/react-form'
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
      />

      <APIReference
        sections={[
          {
            title: "Field",
            props: [
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description:
                  "Disable the entire field and its children via context",
              },
              {
                prop: "required",
                type: "boolean",
                default: "false",
                description:
                  "Mark field as required (shows indicator on label)",
              },
              {
                prop: "readOnly",
                type: "boolean",
                default: "false",
                description: "Mark field as read-only",
              },
              {
                prop: "invalid",
                type: "boolean",
                default: "false",
                description: "Mark field as invalid (triggers error styling)",
              },
              {
                prop: "orientation",
                type: '"vertical" | "horizontal" | "responsive"',
                default: '"vertical"',
                description: "Layout orientation for field children",
              },
              {
                prop: "id",
                type: "string",
                default: "auto-generated",
                description: "Custom ID for the field",
              },
            ],
          },
          {
            title: "FieldLabel",
            props: [
              {
                prop: "showRequired",
                type: "boolean",
                default: "inherits",
                description:
                  "Show required indicator (inherits from Field context)",
              },
              {
                prop: "requiredIndicator",
                type: "ReactNode",
                default: '"*"',
                description: "Custom required indicator content",
              },
              {
                prop: "htmlFor",
                type: "string",
                default: "field ID",
                description: "ID of the input to label",
              },
            ],
          },
          {
            title: "FieldDescription",
            props: [
              {
                prop: "id",
                type: "string",
                default: "auto-generated",
                description:
                  "ID override (uses context descriptionId if not provided)",
              },
            ],
          },
          {
            title: "FieldError",
            props: [
              {
                prop: "field",
                type: "FieldApiLike",
                default: "-",
                description: "TanStack Form field API for error extraction",
              },
              {
                prop: "errors",
                type: "string[] | Error[]",
                default: "-",
                description:
                  "Array of error messages (alternative to field prop)",
              },
              {
                prop: "showIcon",
                type: "boolean",
                default: "false",
                description: "Show validation icon with error message",
              },
              {
                prop: "showErrors",
                type: "boolean",
                default: "true",
                description: "Whether to display errors",
              },
            ],
          },
          {
            title: "FieldCharacterCount",
            props: [
              {
                prop: "current",
                type: "number",
                default: "required",
                description: "Current character count",
              },
              {
                prop: "max",
                type: "number",
                default: "required",
                description: "Maximum allowed characters",
              },
              {
                prop: "warningThreshold",
                type: "number",
                default: "80",
                description: "Percentage threshold to show warning color",
              },
              {
                prop: "showOnlyNearLimit",
                type: "boolean",
                default: "false",
                description: "Hide when below warning threshold",
              },
            ],
          },
          {
            title: "FieldValidationIcon",
            props: [
              {
                prop: "state",
                type: '"valid" | "invalid" | "validating"',
                default: "required",
                description: "Current validation state",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Size of the icon",
              },
            ],
          },
          {
            title: "FieldRow",
            props: [
              {
                prop: "gap",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Gap size between fields",
              },
            ],
          },
          {
            title: "FieldGroup",
            props: [
              {
                prop: "variant",
                type: '"default" | "outline"',
                default: '"default"',
                description: "Visual variant for the group",
              },
            ],
          },
          {
            title: "FieldSet",
            props: [],
          },
          {
            title: "FieldLegend",
            props: [
              {
                prop: "variant",
                type: '"legend" | "label"',
                default: '"legend"',
                description: "Display variant for the legend",
              },
              {
                prop: "showRequired",
                type: "boolean",
                default: "inherits",
                description: "Show required indicator",
              },
              {
                prop: "requiredIndicator",
                type: "ReactNode",
                default: '"*"',
                description: "Custom required indicator content",
              },
            ],
          },
          {
            title: "FormField",
            props: [
              {
                prop: "name",
                type: "string",
                default: "required",
                description: "Field name in the form",
              },
              {
                prop: "form",
                type: "FormApi",
                default: "required",
                description: "TanStack Form instance",
              },
              {
                prop: "orientation",
                type: '"vertical" | "horizontal" | "responsive"',
                default: '"vertical"',
                description: "Layout orientation",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disable the field",
              },
              {
                prop: "required",
                type: "boolean",
                default: "false",
                description: "Mark field as required",
              },
              {
                prop: "readOnly",
                type: "boolean",
                default: "false",
                description: "Mark field as read-only",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
