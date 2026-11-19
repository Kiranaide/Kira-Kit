import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  KiraField,
  FieldErrorSummary,
  createZodValidator,
} from "@/components/ui/field";
import { ComponentPage, PageHeader, Section } from "@/components/docs";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter a workspace name with at least 2 characters.");

const emailSchema = z.email("Enter an email address, like name@example.com.");

const notesSchema = z.string().max(160, "Keep the note under 160 characters.");

const errorMessageSchema = z.union([
  z.string(),
  z.object({ message: z.string() }).transform((value) => value.message),
]);

const fieldLabels = {
  displayName: "Workspace name",
  email: "Owner email",
  notes: "Note",
} as const;

const controlIds = {
  displayName: "docs-form-display-name",
  email: "docs-form-email",
  notes: "docs-form-notes",
} as const;

const fieldKeys: (keyof typeof fieldLabels)[] = [
  "displayName",
  "email",
  "notes",
];

function firstErrorMessage(error: unknown): string | undefined {
  const parsed = errorMessageSchema.safeParse(error);

  return parsed.success ? parsed.data : undefined;
}

function WorkspaceFormDemo() {
  const [created, setCreated] = useState<{
    displayName: string;
    email: string;
  } | null>(null);

  const form = useForm({
    defaultValues: { displayName: "", email: "", notes: "" },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setCreated({ displayName: value.displayName, email: value.email });
    },
  });

  if (created) {
    return (
      <output className="block space-y-4 rounded-lg border border-success/40 bg-success/10 p-6">
        <p className="flex items-center gap-2 font-medium">
          <IconCheck className="h-5 w-5 text-success" aria-hidden="true" />
          Workspace created
        </p>
        <p className="text-sm text-muted-foreground">
          {created.displayName} · {created.email}. In a real app this is where
          the server response lands — the form state stays the source of truth.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCreated(null);
            form.reset();
          }}
        >
          Start over
        </Button>
      </output>
    );
  }

  return (
    <form
      noValidate
      className="max-w-lg space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={(state) => ({
          fieldMeta: state.fieldMeta,
          attempts: state.submissionAttempts,
          isValid: state.isValid,
        })}
      >
        {({ fieldMeta, attempts, isValid }) => {
          const summary = fieldKeys.flatMap((key) => {
            const message = firstErrorMessage(fieldMeta[key]?.errors?.[0]);

            return attempts > 0 && !isValid && message
              ? [{ id: controlIds[key], label: fieldLabels[key], message }]
              : [];
          });

          return (
            <FieldErrorSummary
              errors={summary}
              focusOnError
              focusKey={attempts}
            />
          );
        }}
      </form.Subscribe>

      <form.Field
        name="displayName"
        validators={{ ...createZodValidator(nameSchema) }}
      >
        {(field) => (
          <KiraField
            field={field}
            label="Workspace name"
            controlId={controlIds.displayName}
            required
            description="Shown to everyone you invite."
            inputProps={{ placeholder: "Design Systems", autoComplete: "off" }}
          />
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{ ...createZodValidator(emailSchema) }}
      >
        {(field) => (
          <KiraField
            field={field}
            label="Owner email"
            controlId={controlIds.email}
            required
            description="We send the invite link here."
            inputProps={{
              type: "email",
              placeholder: "name@example.com",
              autoComplete: "email",
            }}
          />
        )}
      </form.Field>

      <form.Field
        name="notes"
        validators={{ ...createZodValidator(notesSchema) }}
      >
        {(field) => (
          <KiraField
            field={field}
            label="Note"
            controlId={controlIds.notes}
            description="Optional context for your team."
            multiline
            rows={3}
            maxLength={160}
            showCharacterCount
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create workspace"}
          </Button>
        )}
      </form.Subscribe>

      <p className="text-sm text-muted-foreground">
        Try submitting empty: the error summary takes focus and each link jumps
        to its field. Errors validate on blur, not on every keystroke.
      </p>
    </form>
  );
}

const anatomyCode = `import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { KiraField, createZodValidator } from "@/components/ui/field";

const form = useForm({
  defaultValues: { email: "" },
  onSubmit: async ({ value }) => saveWorkspace(value),
});

<form
  noValidate
  onSubmit={(e) => {
    e.preventDefault();
    form.handleSubmit();
  }}
>
  <form.Field
    name="email"
    validators={{ ...createZodValidator(z.email("Enter a valid email.")) }}
  >
    {(field) => (
      <KiraField
        field={field}
        label="Owner email"
        controlId="workspace-email"
        required
      />
    )}
  </form.Field>
  <Button type="submit">Create</Button>
</form>`;

const asyncCode = `<form.Field
  name="slug"
  validators={{
    ...createZodValidator(z.string().min(3)),
    onBlurAsync: async ({ value, signal }) => {
      const res = await fetch(
        "/api/availability?slug=" + encodeURIComponent(value),
        { signal },
      );
      const { available } = await res.json();
      return available ? undefined : "This URL is taken.";
    },
  }}
>
  {(field) => <KiraField field={field} label="Workspace URL" required />}
</form.Field>`;

const summaryCode = `import { FieldErrorSummary } from "@/components/ui/field";

// After a failed submit, move focus to the summary; each item
// links to the invalid control's id.
<FieldErrorSummary
  errors={[
    { id: "workspace-email", label: "Owner email", message: "Enter a valid email." },
  ]}
  focusOnError
  focusKey={submissionAttempts}
/>`;

const validationTiming = [
  {
    title: "Validate on blur",
    description:
      "createZodValidator wires onBlur and onSubmit by default. Users are not interrupted mid-typing, and errors appear as soon as they leave a field.",
  },
  {
    title: "Async checks on blur too",
    description:
      "Server-side checks (uniqueness, availability) belong in onBlurAsync with the abort signal — never fire them on every keystroke.",
  },
  {
    title: "Errors stay with the field",
    description:
      "KiraField renders the message below the control and links it with aria-describedby, so screen readers announce it in context.",
  },
  {
    title: "Summarize on failed submit",
    description:
      "FieldErrorSummary lists every invalid field at the top, takes focus, and links back to each control. Inline errors remain visible.",
  },
];

const accessibilityChecklist = [
  "Visible labels above every control — never placeholder-only labels.",
  "Error text connected via aria-describedby and announced (role=alert).",
  "Focus moves to the error summary after a failed submit, and to the field when its summary link is activated.",
  "Inputs keep at least 16px text below the md breakpoint so iOS does not zoom on focus.",
  "Required fields are marked programmatically (required), not just with an asterisk.",
  "Submit buttons show a pending state and stay disabled while submitting.",
];

const dos = [
  "One column of fields; group related fields with FieldSet.",
  "Specific, actionable messages: “Enter an email address, like name@example.com.”",
  "Helper text for format expectations before the user types.",
  "Set noValidate on the form so browser bubbles don't preempt the error summary.",
];

const donts = [
  "Validate only on submit, or on every keystroke.",
  "Generic messages like “Invalid input” or red borders with no text.",
  "Disable the submit button until the form is valid — users get no feedback about what is wrong.",
];

export default function FormPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Form"
        description="Kira Kit forms combine TanStack Form for state, zod for validation, and KiraField for accessible field anatomy. This guide builds a real, working form and explains the decisions behind it."
        badge={
          <span className="text-sm text-muted-foreground">
            TanStack Form + zod
          </span>
        }
      />

      <Section
        title="Live example"
        description="A complete create-workspace form: blur validation, a focusable error summary, character counting, and a pending submit state. Everything below is the actual kit running."
      >
        <Card>
          <CardContent className="pt-6">
            <WorkspaceFormDemo />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Anatomy"
        description="Three pieces: useForm owns state and submission, form.Field binds a control, and KiraField renders label, description, control, and error as one accessible unit."
      >
        <Card>
          <CardContent className="pt-6">
            <CodeBlock code={anatomyCode} language="tsx" />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Validation timing"
        description="When validation runs matters as much as what it checks. These four rules come from form-UX research and are the kit's defaults."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {validationTiming.map((rule) => (
            <Card key={rule.title}>
              <CardHeader>
                <CardTitle className="text-base">{rule.title}</CardTitle>
                <CardDescription>{rule.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Async validation</CardTitle>
            <CardDescription>
              The abort signal cancels stale requests when the user keeps typing
              — the field page has a runnable version of this demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={asyncCode} language="tsx" />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Error summaries"
        description="Inline errors tell users what is wrong in context; a summary makes failed submits recoverable by keyboard and screen reader. Use both together."
      >
        <Card>
          <CardContent className="pt-6">
            <CodeBlock code={summaryCode} language="tsx" />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Accessibility checklist"
        description="KiraField handles the wiring; this list is what to verify when composing custom controls with the control prop."
      >
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {accessibilityChecklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <IconCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="Do / Don't">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-success/40">
            <CardHeader>
              <CardTitle className="text-base text-success">Do</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {dos.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-base text-destructive">
                Don&apos;t
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {donts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          Every field primitive — FieldSet, FieldRow, custom controls, status
          icons — is documented on the Field component page.
        </p>
        <Link
          to="/components/field"
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
        >
          Field reference
          <IconArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </ComponentPage>
  );
}
