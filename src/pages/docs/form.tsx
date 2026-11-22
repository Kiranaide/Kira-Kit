import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  KiraField,
  FieldErrorSummary,
  createZodValidator,
} from "@/components/ui/field";
import {
  DocGuideChecklist,
  DocGuidePage,
  DocGuideSection,
  DocGuideTable,
  type DocGuideTableRow,
  type DocGuideTocItem,
} from "@/components/docs/doc-guide";

const SECTIONS: readonly DocGuideTocItem[] = [
  { id: "live-example", label: "Live example" },
  { id: "field-anatomy", label: "Field anatomy" },
  { id: "validation-timing", label: "Validation timing" },
  { id: "error-summaries", label: "Error summaries" },
  { id: "accessibility-checklist", label: "Accessibility checklist" },
];

const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter a workspace name with at least 2 characters.");

const emailSchema = z.email("Enter a valid email address.");

const notesSchema = z
  .string()
  .max(240, "Keep the description under 240 characters.");

const errorMessageSchema = z.union([
  z.string(),
  z.object({ message: z.string() }).transform((value) => value.message),
]);

const fieldLabels = {
  displayName: "Workspace name",
  email: "Owner email",
  notes: "Description (optional)",
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

type FieldErrorInput = z.input<typeof errorMessageSchema>;

function firstErrorMessage(
  error: FieldErrorInput | undefined,
): string | undefined {
  const parsed = errorMessageSchema.safeParse(error);

  return parsed.success ? parsed.data : undefined;
}

function createFieldValidators(schema: z.ZodType<string>) {
  const base = createZodValidator(schema);

  return {
    ...base,
    onChange: ({
      value,
      fieldApi,
    }: {
      value: string;
      fieldApi: { state: { meta: { errors: unknown[] } } };
    }) => {
      if (fieldApi.state.meta.errors.length === 0) return undefined;

      const parsed = schema.safeParse(value);

      return parsed.success ? undefined : parsed.error.issues[0]?.message;
    },
  };
}

function useWorkspaceForm() {
  const [created, setCreated] = useState<{
    displayName: string;
    email: string;
  } | null>(null);

  const [showInitialSummary, setShowInitialSummary] = useState(true);

  const form = useForm({
    defaultValues: {
      displayName: "Signal Studio",
      email: "maya@",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 700);
      });
      setShowInitialSummary(false);
      setCreated({ displayName: value.displayName, email: value.email });
    },
  });

  useEffect(() => {
    form.setFieldMeta("email", (prev) => ({ ...prev, isTouched: true }));
    void form.validateField("email", "blur");
  }, [form]);

  return {
    form,
    created,
    setCreated,
    showInitialSummary,
    setShowInitialSummary,
  };
}

type WorkspaceForm = ReturnType<typeof useWorkspaceForm>["form"];

function WorkspaceCreatedOutput({
  created,
  onStartOver,
}: {
  created: { displayName: string; email: string };
  onStartOver: () => void;
}) {
  return (
    <output className="block space-y-4 rounded-[14px] border border-success/40 bg-success/10 p-6">
      <p className="flex items-center gap-2 font-semibold text-foreground">
        <IconCheck className="size-5 text-success" aria-hidden="true" />
        Workspace created
      </p>
      <p className="text-sm leading-[1.53] text-muted-foreground">
        {created.displayName} · {created.email}. In a real app this is where the
        server response lands — the form state stays the source of truth.
      </p>
      <Button variant="outline" size="sm" onClick={onStartOver}>
        Start over
      </Button>
    </output>
  );
}

function WorkspaceErrorSummary({
  form,
  showInitialSummary,
}: {
  form: WorkspaceForm;
  showInitialSummary: boolean;
}) {
  return (
    <form.Subscribe
      selector={(state) => ({
        fieldMeta: state.fieldMeta,
        attempts: state.submissionAttempts,
      })}
    >
      {({ fieldMeta, attempts }) => {
        const shouldShow = attempts > 0 || showInitialSummary;

        const summary = fieldKeys.flatMap((key) => {
          const message = firstErrorMessage(fieldMeta[key]?.errors?.[0]);

          return shouldShow && message
            ? [{ id: controlIds[key], label: fieldLabels[key], message }]
            : [];
        });

        const title =
          summary.length === 1 ? "Fix 1 field" : `Fix ${summary.length} fields`;

        return (
          <FieldErrorSummary
            title={title}
            errors={summary}
            focusOnError={attempts > 0}
            focusKey={attempts}
          />
        );
      }}
    </form.Subscribe>
  );
}

function WorkspaceFields({ form }: { form: WorkspaceForm }) {
  return (
    <>
      <form.Field
        name="displayName"
        validators={createFieldValidators(nameSchema)}
      >
        {(field) => (
          <KiraField
            field={field}
            label="Workspace name"
            controlId={controlIds.displayName}
            required
            inputProps={{
              placeholder: "Signal Studio",
              autoComplete: "organization",
            }}
          />
        )}
      </form.Field>

      <form.Field name="email" validators={createFieldValidators(emailSchema)}>
        {(field) => (
          <KiraField
            field={field}
            label="Owner email"
            controlId={controlIds.email}
            required
            inputProps={{
              type: "email",
              placeholder: "name@example.com",
              autoComplete: "email",
            }}
          />
        )}
      </form.Field>

      <form.Field name="notes" validators={createFieldValidators(notesSchema)}>
        {(field) => (
          <KiraField
            field={field}
            label="Description (optional)"
            controlId={controlIds.notes}
            multiline
            rows={3}
            maxLength={240}
            showCharacterCount
            inputProps={{ placeholder: "Describe the workspace" }}
          />
        )}
      </form.Field>
    </>
  );
}

function WorkspaceFormDemo() {
  const {
    form,
    created,
    setCreated,
    showInitialSummary,
    setShowInitialSummary,
  } = useWorkspaceForm();

  if (created) {
    return (
      <WorkspaceCreatedOutput
        created={created}
        onStartOver={() => {
          setCreated(null);
          setShowInitialSummary(false);
          form.reset({ displayName: "", email: "", notes: "" });
        }}
      />
    );
  }

  return (
    <div
      data-slot="form-live-card"
      className="flex flex-col gap-3 rounded-[14px] border border-border bg-card p-4 lg:p-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.35px] text-card-foreground">
          Create a workspace
        </h3>
        <p className="text-sm leading-[1.53] text-muted-foreground">
          Set up your team’s shared space.
        </p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-3.5"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <WorkspaceErrorSummary
          form={form}
          showInitialSummary={showInitialSummary}
        />

        <WorkspaceFields form={form} />

        <div className="pt-1">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 gap-2 rounded-[7px] px-3.5 text-sm font-semibold"
              >
                <IconArrowRight aria-hidden="true" className="size-4" />
                {isSubmitting ? "Creating…" : "Create workspace"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}

const SUBMIT_NOTES = [
  {
    title: "Focus the summary",
    description: "Each error links to its input.",
  },
  {
    title: "Keep the draft",
    description: "All entered values stay in place.",
  },
  {
    title: "Show progress",
    description: "The button reads “Creating…” during submission.",
  },
] as const;

const FIELD_ANATOMY_ROWS: readonly DocGuideTableRow[] = [
  {
    key: "useForm",
    term: "useForm",
    detail: "Defaults, schema validation, and submit state.",
  },
  {
    key: "form.Field",
    term: "form.Field",
    detail: "Binds the workspace field to form state.",
  },
  {
    key: "KiraField",
    term: "KiraField",
    detail: "Connects labels, helper text, and errors to the input.",
  },
];

const ANATOMY_CODE = `<KiraField
  field={field}
  label="Owner email"
  controlId="workspace-email"
  required
/>`;

const VALIDATION_TIMING_ROWS: readonly DocGuideTableRow[] = [
  {
    key: "on-blur",
    term: "On blur",
    detail: "Validate once users leave the field.",
  },
  {
    key: "on-change",
    term: "On change",
    detail: "Clear or revalidate an existing error as it’s fixed.",
  },
  {
    key: "on-submit",
    term: "On submit",
    detail: "Validate the full schema and focus the error summary.",
  },
  {
    key: "async-validation",
    term: "Async validation",
    detail: "Abort stale requests when the value changes.",
  },
];

const ACCESSIBILITY_CHECKLIST = [
  {
    title: "Use visible labels",
    description: "For custom controls, confirm the label targets the input ID.",
  },
  {
    title: "Associate helper and error text",
    description:
      "Use aria-describedby and set aria-invalid when the control has an error.",
  },
  {
    title: "Verify keyboard focus",
    description:
      "The failed-submit summary and its links must work with the keyboard.",
  },
  {
    title: "Announce the result",
    description:
      "Use the pending and success states to give feedback as submission progresses.",
  },
] as const;

function LiveExampleSection() {
  return (
    <DocGuideSection
      id="live-example"
      title="Live example"
      description="The example shows a failed submit. Users can jump from the summary to the field and fix it in place."
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[480px] lg:shrink-0">
          <WorkspaceFormDemo />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:py-3">
          <h3 className="text-lg font-semibold leading-[1.15] tracking-[-0.35px] text-foreground">
            What happens on submit
          </h3>
          <DocGuideChecklist items={SUBMIT_NOTES} />
        </div>
      </div>
    </DocGuideSection>
  );
}

function FieldAnatomySection() {
  return (
    <DocGuideSection
      id="field-anatomy"
      title="Field anatomy"
      description="useForm owns state and submission. form.Field binds values. KiraField renders the label, description, control, and error."
    >
      <DocGuideTable
        columns={["Part", "Responsibility"]}
        rows={FIELD_ANATOMY_ROWS}
        caption="Field anatomy"
      />
      <CodeBlock code={ANATOMY_CODE} language="tsx" showLineNumbers />
      <Link
        to="/components/field"
        className="docs-focus-ring inline-flex min-h-11 w-fit items-center gap-[7px] rounded-[6px] text-sm font-semibold leading-[1.42] docs-accent underline-offset-4 hover:underline"
      >
        <span>Open the Field reference</span>
        <IconArrowUpRight aria-hidden="true" className="size-[15px]" />
      </Link>
    </DocGuideSection>
  );
}

function ValidationTimingSection() {
  return (
    <DocGuideSection
      id="validation-timing"
      title="Validation timing"
      description="Validate when feedback can help people complete the form."
    >
      <DocGuideTable
        columns={["Trigger", "Behavior"]}
        rows={VALIDATION_TIMING_ROWS}
        caption="Validation timing"
      />
    </DocGuideSection>
  );
}

function ErrorSummariesSection() {
  return (
    <DocGuideSection
      id="error-summaries"
      title="Error summaries"
      description="Use a short summary for navigation and an inline message for recovery. Link each summary item to the field ID."
    >
      <div
        data-slot="form-message-example"
        className="flex items-start gap-3 rounded-[7px] border border-border bg-primary/8 px-4 py-[15px]"
      >
        <IconInfoCircle
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 docs-accent"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[15px] font-semibold leading-[1.15] tracking-[-0.35px] docs-accent">
            Message example
          </p>
          <p className="text-sm leading-[1.53] text-foreground">
            Owner email: Enter a valid email address.
          </p>
        </div>
      </div>
    </DocGuideSection>
  );
}

function AccessibilityChecklistSection() {
  return (
    <DocGuideSection
      id="accessibility-checklist"
      title="Accessibility checklist"
    >
      <DocGuideChecklist items={ACCESSIBILITY_CHECKLIST} />
    </DocGuideSection>
  );
}

export default function FormPage() {
  return (
    <DocGuidePage
      title="Form"
      crumb="Form"
      description="Build accessible forms with TanStack Form, Zod, and KiraField, from first input to submit."
      sections={SECTIONS}
      previous={{ to: "/docs/typeset", label: "Typeset" }}
      next={{ to: "/docs/changelog", label: "Changelog" }}
    >
      <LiveExampleSection />
      <FieldAnatomySection />
      <ValidationTimingSection />
      <ErrorSummariesSection />
      <AccessibilityChecklistSection />
    </DocGuidePage>
  );
}
