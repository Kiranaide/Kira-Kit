"use client";

import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { Form as FormPrimitive } from "@base-ui/react/form";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import {
  KiraField,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
  FieldInput,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldItem,
  FieldTitle,
  FieldSeparator,
  FieldRow,
  FieldStatus,
  FieldCharacterCount,
  FieldErrorSummary,
  FormField,
  createZodValidator,
  type KiraFieldControlProps,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, NumericInput } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  KiraSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="max-w-lg space-y-5">
      <KiraField
        label="Billing email"
        controlId="field-basic-email"
        description="Invoices and payment reminders go to this address."
        required
        inputProps={{
          type: "email",
          autoComplete: "email",
          placeholder: "billing@studio.example",
        }}
        successMessage="This address is ready for invoices."
      />
      <Field>
        <FieldLabel>Purchase order reference</FieldLabel>
        <FieldInput placeholder="Optional reference" />
        <FieldDescription>This appears on future invoices.</FieldDescription>
        <FieldError />
      </Field>
    </div>
  );
}

const basicCode = `import { KiraField, Field, FieldLabel, FieldInput, FieldDescription, FieldError } from "@/components/ui/field"

<KiraField
  label="Billing email"
  description="Invoices and payment reminders go to this address."
  required
  inputProps={{ type: "email", autoComplete: "email" }}
  successMessage="This address is ready for invoices."
/>

<Field>
  <FieldLabel>Purchase order reference</FieldLabel>
  <FieldInput placeholder="Optional reference" />
  <FieldDescription>This appears on future invoices.</FieldDescription>
  <FieldError />
</Field>`;

const workspaceTools = ["Figma", "Linear", "Notion", "Slack"];

function WorkspaceToolControl(props: KiraFieldControlProps) {
  return (
    <KiraSelect
      {...props}
      options={workspaceTools}
      defaultValue="Figma"
      searchable
      placeholder="Find a tool"
      emptyMessage="No matching tools."
    />
  );
}

function ControlsDemo() {
  const [mode, setMode] = useState<"editable" | "read-only" | "disabled">(
    "editable",
  );

  const [seats, setSeats] = useState<number | null>(8);
  const [submitted, setSubmitted] = useState<string>();

  const state = {
    disabled: mode === "disabled",
    readOnly: mode === "read-only",
  };

  return (
    <div className="max-w-3xl space-y-5">
      <ControlsControlsSection mode={mode} setMode={setMode} />
      <p className="text-sm text-muted-foreground">
        Choose controls using their own value APIs. Labels, help text, errors,
        and field state stay in one wrapper.
      </p>
      <FormPrimitive
        data-slot="field-demo-controls-form"
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(
            JSON.stringify(
              Array.from(new FormData(event.currentTarget), ([name, value]) => [
                name,
                value instanceof File ? value.name : value,
              ]),
              null,
              2,
            ),
          );
        }}
      >
        <ControlFieldGrid state={state} seats={seats} setSeats={setSeats} />
        <Button type="submit" variant="outline">
          Preview control values
        </Button>
        {submitted && (
          <div className="min-w-0 space-y-2">
            <output className="block text-sm text-muted-foreground">
              Preview updated. No settings were saved.
            </output>
            {/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The overflowing JSON preview must be focusable for keyboard scrolling. */}
            <pre
              data-slot="field-demo-submitted-values"
              tabIndex={0}
              aria-label="Submitted control values"
              className="max-w-full overflow-x-auto rounded-md bg-muted p-3 text-xs"
            >
              {submitted}
            </pre>
            {/* oxlint-enable jsx-a11y/no-noninteractive-tabindex */}
          </div>
        )}
      </FormPrimitive>
    </div>
  );
}

const controlsCode = `import { KiraField, FieldItem, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Kit Input already registers with Base UI Field.
<KiraField name="workspace" label="Workspace name"
  control={(props) => <Input {...props} />}
/>

// Kit Select, Checkbox, RadioGroup, Switch, Slider, NumericInput, and KiraSelect
// integrate with Base UI Field. Keep their own value/change APIs.
// NumericInput and KiraSelect forward id to their registering Root.
<KiraField name="region" label="Billing region" required
  control={({ id, ...props }) => (
    <Select {...props} defaultValue="apac">
      <SelectTrigger id={id}><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="apac">Asia Pacific</SelectItem></SelectContent>
    </Select>
  )}
/>
<KiraField name="billingConsent" label="Send billing updates" required
  control={(props) => <Checkbox {...props} value="accepted" />}
/>
<KiraField name="plan" label="Workspace plan"
  labelProps={{ nativeLabel: false, render: <div /> }}
  control={({ id, ...props }) => (
    <RadioGroup {...props} defaultValue="team">
      <FieldItem>
        <RadioGroupItem id={id} value="team" />
        <FieldLabel showRequired={false}>Team</FieldLabel>
      </FieldItem>
    </RadioGroup>
  )}
/>
// Text-only convenience props cannot be combined with control.
// For TanStack custom controls, bind checked/value and blur explicitly.`;

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
function NativeInputsDemo() {
  return (
    <div className="grid max-w-3xl min-w-0 gap-6 sm:grid-cols-2">
      <KiraField
        name="email"
        label="Contact email"
        description="Native email validation and autofill."
        inputProps={{
          type: "email",
          autoComplete: "email",
          placeholder: "you@example.com",
        }}
      />
      <KiraField
        name="password"
        label="Account password"
        description="Pasting and password managers remain available."
        inputProps={{ type: "password", autoComplete: "new-password" }}
      />
      <KiraField
        name="phone"
        label="Contact phone"
        inputProps={{
          type: "tel",
          autoComplete: "tel",
          placeholder: "+1 555 010 2048",
        }}
      />
      <KiraField
        name="website"
        label="Workspace website"
        inputProps={{
          type: "url",
          autoComplete: "url",
          placeholder: "https://studio.example",
        }}
      />
      <KiraField
        name="search"
        label="Search projects"
        inputProps={{ type: "search", placeholder: "Project name" }}
      />
      <KiraField
        name="quantity"
        label="Review rounds"
        inputProps={{ type: "number", min: 1, max: 10, step: 1 }}
        defaultValue="3"
      />
      <KiraField
        name="startDate"
        label="Start date"
        inputProps={{ type: "date" }}
      />
      <KiraField
        name="startTime"
        label="Start time"
        inputProps={{ type: "time" }}
      />
      <KiraField
        name="launch"
        label="Local launch date and time"
        inputProps={{ type: "datetime-local" }}
      />
      <KiraField
        name="month"
        label="Billing month"
        inputProps={{ type: "month" }}
      />
      <KiraField
        name="week"
        label="Review week"
        inputProps={{ type: "week" }}
      />
      <KiraField
        name="color"
        label="Workspace color"
        inputProps={{ type: "color", className: "w-20 px-1" }}
      />
      <KiraField
        name="brief"
        label="Project brief"
        description="Native file input; no upload is started."
        inputProps={{
          type: "file",
          accept: ".pdf,.txt,.md",
          className:
            "file:me-3 file:rounded-sm file:border-0 file:bg-muted file:px-2 file:py-1 file:text-foreground",
        }}
      />
      <KiraField
        name="nativeRegion"
        label="Native region selector"
        description="Native select elements also register through FieldControl."
        control={(props) => (
          <FieldControl
            {...props}
            render={<select aria-label="Native region selector" />}
            defaultValue="apac"
          >
            <option value="apac">Asia Pacific</option>
            <option value="eu">Europe</option>
            <option value="us">United States</option>
          </FieldControl>
        )}
      />
    </div>
  );
}

const nativeInputsCode = `import { KiraField, FieldControl } from "@/components/ui/field"

<KiraField label="Contact email" required inputProps={{ type: "email", autoComplete: "email" }} />
<KiraField label="Account password" inputProps={{ type: "password", autoComplete: "new-password" }} />
<KiraField label="Start date" inputProps={{ type: "date" }} />
<KiraField label="Start time" inputProps={{ type: "time" }} />
<KiraField label="Project brief" inputProps={{ type: "file", accept: ".pdf,.txt,.md" }} />
<KiraField label="Native region selector" control={(props) => (
  <FieldControl {...props} render={<select aria-label="Native region selector" />} defaultValue="apac">
    <option value="apac">Asia Pacific</option>
    <option value="eu">Europe</option>
  </FieldControl>
)} />
// Text, search, email, password, tel, url, number, date, time,
// datetime-local, month, week, color, and file keep native semantics.
// Use the control slot for checked controls and custom input components.`;

function ValidationDemo() {
  return (
    <div className="max-w-lg space-y-5">
      <KiraField
        label="Workspace URL"
        controlId="field-workspace-url"
        description="Use 3–24 lowercase letters, numbers, or hyphens."
        required
        inputProps={{
          placeholder: "design-studio",
          autoComplete: "off",
          spellCheck: false,
        }}
        validate={(value) =>
          // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Field validation accepts the library union of textual and numeric native control values.
          typeof value === "string" && /^[a-z0-9][a-z0-9-]{2,23}$/.test(value)
            ? undefined
            : "Use 3–24 lowercase letters, numbers, or hyphens."
        }
        successMessage="This URL format is valid."
      />
      <p className="text-sm text-muted-foreground">
        Type a value, then move to the next field to validate it.
      </p>
      <KiraField
        label="Contact name"
        controlId="field-validation-contact"
        inputProps={{ autoComplete: "name", placeholder: "Your name" }}
      />
    </div>
  );
}

const validationCode = `import { KiraField } from "@/components/ui/field"

<KiraField
  label="Workspace URL"
  description="Use 3–24 lowercase letters, numbers, or hyphens."
  required
  validate={(value) =>
    typeof value === "string" && /^[a-z0-9][a-z0-9-]{2,23}$/.test(value)
      ? undefined
      : "Use 3–24 lowercase letters, numbers, or hyphens."
  }
  successMessage="This URL format is valid."
/>
// KiraField defaults to validationMode="onBlur".
// Field itself retains Base UI's onSubmit default.`;

function CounterDemo() {
  const [note, setNote] = useState("");

  const importedAnnouncement =
    "This imported announcement has more detail than the activity feed allows. "
      .repeat(3)
      .slice(0, 183);

  return (
    <div className="max-w-lg space-y-5">
      <KiraField
        label="Release note"
        controlId="field-release-note"
        multiline
        maxLength={160}
        value={note}
        onValueChange={setNote}
        description="Keep the update short enough for the activity feed."
        inputProps={{ placeholder: "What changed for your customers?" }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setNote(
              "This release improves review workflows and makes team handoffs easier. "
                .repeat(2)
                .slice(0, 132),
            )
          }
        >
          Near the limit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNote("x".repeat(160))}
        >
          At the limit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setNote("")}>
          Clear note
        </Button>
      </div>
      <Field>
        <FieldLabel>Imported announcement</FieldLabel>
        <FieldInput defaultValue={importedAnnouncement} readOnly />
        <div className="flex items-start justify-between gap-3">
          <FieldDescription>
            Imported text needs trimming before publishing.
          </FieldDescription>
          <FieldCharacterCount
            current={importedAnnouncement.length}
            max={160}
            announce={false}
          />
        </div>
      </Field>
      <form className="space-y-3">
        <Field>
          <FieldLabel>Draft title</FieldLabel>
          <FieldInput
            id="field-reset-title"
            defaultValue="Release preview"
            maxLength={48}
            showCharacterCount
            description="Edit the title, then reset the draft. Its count resets too."
          />
        </Field>
        <Button type="reset" variant="outline" size="sm">
          Reset draft
        </Button>
      </form>
    </div>
  );
}

const counterCode = `import { useState } from "react"
import { KiraField, Field, FieldLabel, FieldInput, FieldCharacterCount } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

const [note, setNote] = useState("")
<KiraField
  label="Release note"
  multiline
  maxLength={160}
  value={note}
  onValueChange={setNote}
  description="Keep the update short enough for the activity feed."
/>
// Counters follow HTML maxLength (UTF-16 code units).
// Threshold feedback announces state changes, not each keystroke.
<FieldCharacterCount current={183} max={160} announce={false} />
<form>
  <Field>
    <FieldLabel>Draft title</FieldLabel>
    <FieldInput defaultValue="Release preview" maxLength={48} showCharacterCount />
  </Field>
  <Button type="reset">Reset draft</Button>
</form>`;

function TanStackDemo() {
  const form = useForm({ defaultValues: { slug: "", owner: "" } });

  const slugValidators = createZodValidator(
    z
      .string()
      .min(3, "Use at least 3 characters.")
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, or hyphens."),
  );

  return (
    <div className="max-w-lg space-y-5">
      <form.Field
        name="slug"
        validators={{
          ...slugValidators,
          onBlurAsync: async ({ value, signal }) => {
            await new Promise<void>((resolve) => {
              const timer = setTimeout(resolve, 650);
              signal.addEventListener(
                "abort",
                () => {
                  clearTimeout(timer);
                  resolve();
                },
                { once: true },
              );
            });

            if (signal.aborted) return undefined;

            return ["admin", "design", "studio"].includes(value)
              ? "This workspace URL is taken. Try another name."
              : undefined;
          },
        }}
      >
        {(field) => (
          <KiraField
            field={field}
            label="Reserve a workspace URL"
            controlId="field-async-slug"
            required
            description="Try “studio” to see the unavailable state, or choose your own name."
            inputProps={{
              placeholder: "my-team",
              autoComplete: "off",
              spellCheck: false,
            }}
          />
        )}
      </form.Field>
      <FormField form={form} name="owner">
        {(field) => (
          <FieldContent>
            <FieldLabel>Workspace owner</FieldLabel>
            <FieldInput field={field} />
            <FieldDescription>
              Choose the person who manages this workspace.
            </FieldDescription>
          </FieldContent>
        )}
      </FormField>
      <p className="text-sm text-muted-foreground">
        This demo simulates a server availability check. Validation runs after
        blur; pending feedback stays still.
      </p>
    </div>
  );
}

const tanStackCode = `import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { KiraField, createZodValidator } from "@/components/ui/field"

const form = useForm({ defaultValues: { slug: "" } })
<form.Field
  name="slug"
  validators={{
    ...createZodValidator(z.string().min(3, "Use at least 3 characters.")),
    onBlurAsync: async ({ value, signal }) => {
      const response = await fetch("/api/workspace-availability?slug=" + encodeURIComponent(value), { signal })
      const result = await response.json()
      return result.available ? undefined : "This workspace URL is taken. Try another name."
    },
  }}
>
  {(field) => <KiraField field={field} label="Workspace URL" required />}
</form.Field>`;

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Enter a display name with at least 2 characters."),
  email: z.email("Enter an email address, like name@example.com."),
});

function ErrorSummaryDemo() {
  const [values, setValues] = useState({ displayName: "", email: "" });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof values, string>>
  >({});

  const [attempt, setAttempt] = useState(0);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaved(false);
  };

  const summary = Object.entries(errors).flatMap(([key, message]) =>
    message
      ? [
          {
            id: `field-profile-${key}`,
            label: key === "displayName" ? "Display name" : "Email",
            message,
          },
        ]
      : [],
  );

  return (
    <form
      noValidate
      className="max-w-lg space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setAttempt((current) => current + 1);
        const result = profileSchema.safeParse(values);

        if (!result.success) {
          const nextErrors: typeof errors = {};

          for (const issue of result.error.issues) {
            const key = issue.path[0];

            if (key === "displayName" || key === "email") {
              nextErrors[key] = issue.message;
            }
          }

          setErrors(nextErrors);
          setSaved(false);

          return;
        }

        setErrors({});
        setSaved(true);
      }}
    >
      <FieldErrorSummary errors={summary} focusOnError focusKey={attempt} />
      <KiraField
        label="Display name"
        controlId="field-profile-displayName"
        value={values.displayName}
        onValueChange={(value) => update("displayName", value)}
        error={errors.displayName}
        required
        inputProps={{ autoComplete: "name" }}
      />
      <KiraField
        label="Email"
        controlId="field-profile-email"
        value={values.email}
        onValueChange={(value) => update("email", value)}
        error={errors.email}
        required
        inputProps={{ type: "email", autoComplete: "email" }}
      />
      <Button type="submit">Save profile</Button>
      <output className="block min-h-6 text-sm text-foreground">
        {saved ? "Profile saved. Both fields are ready." : ""}
      </output>
    </form>
  );
}

const summaryCode = `import { KiraField, FieldErrorSummary } from "@/components/ui/field"

// After a failed submit, update errors and increment submissionAttempt.
<FieldErrorSummary
  errors={[
    { id: "profile-name", label: "Display name", message: "Enter a display name with at least 2 characters." },
    { id: "profile-email", label: "Email", message: "Enter an email address, like name@example.com." },
  ]}
  focusOnError
  focusKey={submissionAttempt}
/>
<KiraField
  controlId="profile-email"
  label="Email"
  error="Enter an email address, like name@example.com."
  inputProps={{ type: "email", autoComplete: "email" }}
/>
// IDs point to controls. Focus is not moved during ordinary blur validation.`;

function LayoutDemo() {
  return (
    <div className="max-w-2xl">
      <FieldSet>
        <FieldLegend>Notification delivery</FieldLegend>
        <FieldGroup>
          <KiraField
            label="Sender name"
            orientation="responsive"
            defaultValue="Studio updates"
            description="Shown beside your email address."
          />
          <KiraField
            label="Reply-to address"
            orientation="responsive"
            defaultValue="team@studio.example"
            inputProps={{ type: "email", autoComplete: "email" }}
          />
        </FieldGroup>
        <FieldSeparator>Delivery preferences</FieldSeparator>
        <Field orientation="horizontal">
          <Checkbox id="field-release-updates" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="field-release-updates">
              Email me when a release is published
            </FieldLabel>
            <FieldDescription>
              One message per release. You can change this later.
            </FieldDescription>
          </FieldContent>
        </Field>
        <FieldRow gap="lg">
          <KiraField
            label="Workspace ID"
            defaultValue="wrk_2048"
            readOnly
            description="Assigned when your workspace was created."
          />
          <KiraField
            label="Region"
            defaultValue="Asia Pacific"
            disabled
            disabledReason="Ask a workspace owner to change the billing region."
          />
        </FieldRow>
      </FieldSet>
    </div>
  );
}

const layoutCode = `import { FieldSet, FieldLegend, FieldGroup, FieldRow, KiraField } from "@/components/ui/field"

<FieldSet>
  <FieldLegend>Notification delivery</FieldLegend>
  <FieldGroup>
    <KiraField label="Sender name" orientation="responsive" defaultValue="Studio updates" />
    <KiraField label="Reply-to address" orientation="responsive" inputProps={{ type: "email" }} />
  </FieldGroup>
  <FieldRow gap="lg">
    <KiraField label="Workspace ID" defaultValue="wrk_2048" readOnly />
    <KiraField label="Region" defaultValue="Asia Pacific" disabled disabledReason="Ask a workspace owner to change the billing region." />
  </FieldRow>
</FieldSet>`;

function ShowcaseDemo() {
  const [worst, setWorst] = useState(false);

  return (
    <div className="space-y-6">
      <fieldset aria-label="Demo data" className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={worst ? "outline" : "default"}
          aria-pressed={!worst}
          onClick={() => setWorst(false)}
        >
          Demo data
        </Button>
        <Button
          size="sm"
          variant={worst ? "default" : "outline"}
          aria-pressed={worst}
          onClick={() => setWorst(true)}
        >
          Worst case
        </Button>
      </fieldset>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2" key={String(worst)}>
        <FieldGroup>
          <FieldTitle>Editable and selected states</FieldTitle>
          <KiraField
            label={
              worst
                ? "The customer-facing workspace name for the international design, accessibility, and localization review team — 東京 / กรุงเทพฯ / التصميم"
                : "Workspace name"
            }
            defaultValue={
              worst
                ? "InternationalDesignAndAccessibilityReviewWorkspaceWithoutAnySpaces"
                : "Design studio"
            }
            description="A visible label stays readable even when it is long."
          />
          <KiraField
            label="Empty value"
            inputProps={{ placeholder: "Add a short description" }}
          />
          <KiraField label="Review status" defaultValue="Approved" readOnly />
          <Field>
            <FieldLabel>Validation feedback</FieldLabel>
            <FieldInput defaultValue="studio" />
            <FieldStatus state="valid">Ready to use.</FieldStatus>
            <FieldStatus state="validating">Checking availability…</FieldStatus>
          </Field>
        </FieldGroup>
        <FieldGroup variant="outline" className="max-w-sm">
          <FieldTitle>Narrow form and recovery</FieldTitle>
          <KiraField
            label="Publishing token"
            defaultValue="Ask an owner"
            disabled
            disabledReason="Only workspace owners can create publishing tokens."
          />
          <KiraField
            label="Imported reference"
            defaultValue={worst ? "long-reference-".repeat(14) : "ref_2048"}
            error="This reference is no longer valid. Request a new one."
          />
          <KiraField
            label="Release summary"
            multiline
            maxLength={80}
            defaultValue={
              worst
                ? "Long labels and emoji 👩🏽‍💻 stay editable without breaking the layout."
                : "A smaller, calmer release."
            }
            description="Resize the page or zoom to check the container layout."
          />
        </FieldGroup>
      </div>
    </div>
  );
}

const showcaseCode = `import { FieldGroup, KiraField } from "@/components/ui/field"

<FieldGroup variant="outline" className="max-w-sm">
  <KiraField label="Publishing token" disabled disabledReason="Only workspace owners can create publishing tokens." />
  <KiraField label="Imported reference" error="This reference is no longer valid. Request a new one." />
  <KiraField label="Release summary" multiline maxLength={80} />
</FieldGroup>`;

function KeyboardDemo() {
  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground">
        Tab through these fields. Clicking a label focuses its control. Space
        toggles the notification checkbox.
      </p>
      <Field>
        <FieldLabel>Keyboard email</FieldLabel>
        <FieldInput
          id="field-keyboard-email"
          type="email"
          placeholder="you@example.com"
        />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="field-keyboard-checkbox" />
        <FieldContent>
          <FieldLabel htmlFor="field-keyboard-checkbox">
            Send a monthly activity summary
          </FieldLabel>
          <FieldDescription>
            The control remains a normal tab stop.
          </FieldDescription>
        </FieldContent>
      </Field>
      <KiraField
        label="Read-only workspace ID"
        defaultValue="wrk_2048"
        readOnly
      />
      <KiraField
        label="Restricted setting"
        disabled
        disabledReason="Your role has view access only."
      />
    </div>
  );
}

const keyboardCode = `import { Field, FieldLabel, FieldInput, KiraField } from "@/components/ui/field"

<Field>
  <FieldLabel>Keyboard email</FieldLabel>
  <FieldInput type="email" />
</Field>
<KiraField label="Read-only workspace ID" defaultValue="wrk_2048" readOnly />
<KiraField label="Restricted setting" disabled disabledReason="Your role has view access only." />`;

export default function FieldPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Field"
        description="Visible labels, useful feedback, and form layouts that stay readable while people edit. Built on Base UI Field and Fieldset."
        version="v3.1.1"
      />
      <FeatureGrid features={fieldPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={fieldPageDemoTabsTabs} />
      <KeyboardShortcuts
        shortcuts={fieldPageKeyboardShortcutsShortcuts}
        description="Use the Keyboard and Error summary demos as the walkthrough. Field adds no arrow-key navigation."
      />
      <UsageBlock
        code={`import { KiraField } from "@/components/ui/field"

export function ReleaseNoteField() {
  return (
    <KiraField
      name="releaseNote"
      label="Release note"
      description="A short update for the activity feed."
      multiline
      maxLength={160}
      required
      inputProps={{ placeholder: "What changed?" }}
    />
  )
}`}
      />
      <APIReference sections={fieldPageAPIReferenceSections} />
      <Changelog entries={fieldPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const fieldPageFeatureGridFeatures = [
  {
    title: "Every control shape",
    description:
      "Compose text, selection, checked, numeric, and native inputs without replacing their own APIs.",
  },
  {
    title: "Blur-first feedback",
    description:
      "Validate after editing, with linked errors and clear success or pending text.",
  },
  {
    title: "Character limits",
    description:
      "See the remaining space without a live announcement on every keystroke.",
  },
  {
    title: "Error recovery",
    description:
      "Jump from a focused error summary to each field that needs attention.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const fieldPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Billing details"
        description="Use KiraField for a complete field, or compose the individual parts."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controls",
    label: "Controls",
    demo: (
      <DemoWrapper
        title="Workspace control gallery"
        description="Input, Textarea, InputGroup, Select, RadioGroup, Checkbox, CheckboxGroup, Switch, Slider, NumberField, and Combobox share field anatomy. Try state changes and preview actual form values."
        code={controlsCode}
      >
        <ControlsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "native-inputs",
    label: "Native inputs",
    demo: (
      <DemoWrapper
        title="Native input types"
        description="Email, password, phone, search, numbers, dates, time, color, files, and native select keep their browser behavior."
        code={nativeInputsCode}
      >
        <NativeInputsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "validation",
    label: "Validation",
    demo: (
      <DemoWrapper
        title="Validate after editing"
        description="The workspace rule runs on blur; error and success feedback stay beside the control."
        code={validationCode}
      >
        <ValidationDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "counter",
    label: "Character limit",
    demo: (
      <DemoWrapper
        title="Write a release note"
        description="Try the threshold, the limit, and an imported value that needs trimming."
        code={counterCode}
      >
        <CounterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "tanstack",
    label: "Async validation",
    demo: (
      <DemoWrapper
        title="Reserve a workspace URL"
        description="TanStack owns the asynchronous check; Field presents its touched, invalid, and pending states."
        code={tanStackCode}
      >
        <TanStackDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "summary",
    label: "Error summary",
    demo: (
      <DemoWrapper
        title="Recover from a failed submission"
        description="Save an empty profile, follow a summary link, then correct both fields."
        code={summaryCode}
      >
        <ErrorSummaryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "layout",
    label: "Layouts",
    demo: (
      <DemoWrapper
        title="Notification settings"
        description="Responsive rows, a fieldset legend, checkbox labeling, and restricted settings."
        code={layoutCode}
      >
        <LayoutDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "showcase",
    label: "Showcase",
    demo: (
      <DemoWrapper
        title="States and difficult content"
        description="Switch to worst-case data, resize the container, and check both page themes."
        code={showcaseCode}
      >
        <ShowcaseDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "keyboard",
    label: "Keyboard",
    demo: (
      <DemoWrapper
        title="Follow the focus"
        description="Use normal tab stops, the label association, and the read-only versus disabled states."
        code={keyboardCode}
      >
        <KeyboardDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const fieldPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move between native controls in document order (inherited from Base UI).",
  },
  {
    keys: "Space",
    description:
      "Toggle a focused checkbox or switch (inherited from Base UI).",
  },
  {
    keys: "Arrow keys / Home / End",
    description:
      "Navigate radio options, select/combobox choices, and slider values in the Controls demo (inherited from Base UI).",
  },
  {
    keys: "Escape",
    description:
      "Dismiss an open Select or Combobox popup (inherited from Base UI).",
  },
  {
    keys: "Enter",
    description:
      "Submit the profile form, or follow a focused error-summary link.",
  },
  {
    keys: "Ctrl/Cmd + A, paste",
    description:
      "Select or paste into an editable control. Read-only values remain selectable.",
  },
  {
    keys: "Failed Save profile",
    description:
      "Focus moves to the summary once; each link focuses the named input. Editing does not move focus.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const fieldPageAPIReferenceSections = [
  {
    title: "Field",
    props: [
      {
        prop: "orientation",
        type: '"vertical" | "horizontal" | "responsive"',
        default: '"vertical"',
        description:
          "Layout direction. Responsive rows use the surrounding FieldGroup container width.",
      },
      {
        prop: "name",
        type: "string",
        description:
          "Submitted control name; Base UI Field takes precedence over the control name.",
      },
      {
        prop: "id",
        type: "string",
        description:
          "Root container ID. FieldInput gets a separate control ID; FieldLabel associates through Base UI.",
      },
      {
        prop: "disabled / required / readOnly",
        type: "boolean",
        default: "false",
        description:
          "Disabled is primitive-owned. Required and readOnly apply to FieldControl/FieldInput; also pass them directly to other composed controls.",
      },
      {
        prop: "invalid / dirty / touched",
        type: "boolean",
        description: "External validation state, e.g. TanStack field metadata.",
      },
      {
        prop: "validationMode",
        type: '"onSubmit" | "onBlur" | "onChange"',
        default: '"onSubmit"',
        description: "Base UI validation timing. KiraField defaults to onBlur.",
      },
      {
        prop: "validate",
        type: "(value, formValues) => string | string[] | void | Promise",
        description:
          "Base UI custom validation. Async onSubmit validation does not block submission; use a form library/server flow for that contract.",
      },
      {
        prop: "validationDebounceTime",
        type: "number",
        default: "0",
        description: "Delay for onChange validation, in milliseconds.",
      },
      {
        prop: "actionsRef",
        type: "RefObject<Field.Root.Actions>",
        description:
          "Exposes validate(). Other Base UI Root render, ref, and DOM props are forwarded.",
      },
      {
        prop: "validating / disabledReason",
        type: "boolean / ReactNode",
        description:
          "Pending metadata and persistent text explaining an explicitly disabled field.",
      },
    ],
  },
  {
    title: "KiraField",
    props: [
      {
        prop: "label",
        type: "ReactNode",
        description: "Required visible label. Accepts Field root props.",
      },
      {
        prop: "control",
        type: "(props: KiraFieldControlProps) => ReactNode",
        description:
          "Optional custom control. Receives id, name, disabled, required, and readOnly. Base UI controls register directly; native controls use FieldControl. Pass id to the registering primitive (NumberField/Combobox Root, SelectTrigger). Value/checked callbacks remain caller-owned.",
      },
      {
        prop: "labelProps",
        type: "Omit<FieldLabelProps, 'children'>",
        description:
          "Label attributes and render options. For a radio/checkbox group title, use nativeLabel=false with render={<div />}; FieldItem labels individual choices.",
      },
      {
        prop: "description / error / successMessage",
        type: "ReactNode",
        description:
          "Helper, external error, and optional success feedback. Errors automatically mark the control invalid.",
      },
      {
        prop: "field",
        type: "FieldApi",
        description:
          "TanStack adapter for errors and field state. The default text control also binds value and blur; custom controls bind their own checked/value and blur callbacks.",
      },
      {
        prop: "controlId",
        type: "string",
        description: "Actual control ID; use this for FieldErrorSummary links.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "Input value / default value / (value, details) => void",
        description:
          "Default text-control branch only; cannot be combined with control. Caller cancellation is respected before adapter updates.",
      },
      {
        prop: "inputProps",
        type: "FieldInputProps",
        description:
          "Shared Input props including size, prefix/suffix, showClear/showCopy, className, native attributes, render, and Base UI event handlers.",
      },
      {
        prop: "multiline / rows",
        type: "boolean / number",
        default: "false / 3",
        description:
          "Render the shared Textarea through the Base UI control adapter; rows sets its minimum initial height and content can grow.",
      },
      {
        prop: "maxLength / showCharacterCount",
        type: "number / boolean",
        description:
          "Default text-control branch only. Counter defaults on when maxLength is provided; custom text controls can compose FieldCharacterCount explicitly.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Additional content after the control and its feedback.",
      },
    ],
  },
  {
    title: "FieldControl / FieldInput",
    props: [
      {
        prop: "value / defaultValue / onValueChange",
        type: "Base UI control props",
        description:
          "FieldControl exposes Base UI Field.Control; FieldInput composes the kit Input and keeps its Base UI value/change contract.",
      },
      {
        prop: "render / ref / native input props",
        type: "Base UI render / ref / input attributes",
        description:
          "Polymorphic control and composed DOM events. Use render={<Textarea />} for the kit textarea; KiraField multiline does this automatically.",
      },
      {
        prop: "disabled / required / readOnly",
        type: "boolean",
        description:
          "Supplemented by Field context. Global field disability cannot be bypassed.",
      },
      {
        prop: "field",
        type: "FieldApi",
        description:
          "FieldInput only: optional TanStack value and change/blur adapter.",
      },
      {
        prop: "label / description / error",
        type: "ReactNode",
        description: "FieldInput only: render associated optional field parts.",
      },
      {
        prop: "maxLength / showCharacterCount",
        type: "number / boolean",
        description:
          "FieldInput only: uses the actual controlled or uncontrolled value, including empty values.",
      },
    ],
  },
  {
    title: "FieldItem",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        description:
          "Group one checkbox/radio option with its own FieldLabel and FieldDescription. Wrap options in FieldItem, not a second Field root.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description:
          "Disable one option. Parent Field disability takes precedence; label and description association are scoped to this item.",
      },
      {
        prop: "render / ref / className",
        type: "Base UI Item props",
        description:
          "Underlying Base UI Field.Item, rendered as a div by default.",
      },
    ],
  },
  {
    title: "FieldLabel / FieldTitle",
    props: [
      {
        prop: "showRequired / requiredIndicator",
        type: "boolean / ReactNode",
        default: "Field.required / *",
        description:
          "Visible required marker; the control receives required semantics separately.",
      },
      {
        prop: "htmlFor / nativeLabel / render",
        type: "Base UI Field.Label props",
        description:
          "FieldLabel only: explicit association or Base UI automatic association. Set nativeLabel=false for non-label rendering.",
      },
      {
        prop: "children / className / DOM props",
        type: "ReactNode / string / attributes",
        description:
          "FieldTitle is plain group text, not an input label. Use FieldLabel for controls.",
      },
    ],
  },
  {
    title: "FieldDescription / FieldHelperText / FieldStatus",
    props: [
      {
        prop: "children / render / ref / DOM props",
        type: "Base UI Field.Description props",
        description:
          "Descriptions are automatically included in the control's accessible description; multiple descriptions receive unique IDs.",
      },
      {
        prop: "state",
        type: '"valid" | "invalid" | "validating"',
        description:
          "FieldStatus only: static icon and text for the stated condition.",
      },
    ],
  },
  {
    title: "FieldError / FieldErrorText / FieldValidity",
    props: [
      {
        prop: "errors",
        type: "Array<string | { message?: string } | undefined>",
        description:
          "External errors, deduplicated with empty entries removed.",
      },
      {
        prop: "field",
        type: "FieldApi",
        description: "Read current TanStack errors on each render.",
      },
      {
        prop: "children / match",
        type: "ReactNode / boolean | keyof ValidityState",
        description:
          "Explicit external content or Base UI error matching. Without external content, show the primitive validation message.",
      },
      {
        prop: "showErrors / showIcon",
        type: "boolean",
        default: "true / false",
        description:
          "showErrors=false hides all content. Icons remain static and decorative.",
      },
      {
        prop: "FieldValidity.children",
        type: "(state) => ReactNode",
        description:
          "Base UI validity render function: validity, errors, error, value, initialValue, and transitionStatus.",
      },
    ],
  },
  {
    title: "FieldCharacterCount / FieldValidationIcon",
    props: [
      {
        prop: "current / max",
        type: "number",
        description:
          "Counter values. Native maxLength measures UTF-16 code units; use value.length for parity.",
      },
      {
        prop: "warningThreshold",
        type: "number",
        default: "80",
        description: "Percentage threshold, normalized from 0 to 100.",
      },
      {
        prop: "showOnlyNearLimit / announce",
        type: "boolean",
        default: "false / true",
        description:
          "Visually hide early counts; announce only near/reached/exceeded threshold phrases. Turn announce off for static examples.",
      },
      {
        prop: "state / size",
        type: '"valid" | "invalid" | "validating" / "sm" | "default" | "lg"',
        description:
          "FieldValidationIcon: state and size. Supply aria-label when the icon itself needs a name.",
      },
    ],
  },
  {
    title: "FieldErrorSummary",
    props: [
      {
        prop: "errors",
        type: "{ id: string; message: ReactNode; label?: ReactNode }[]",
        description:
          "Links to actual controls and displays matching inline messages. Empty arrays render nothing.",
      },
      {
        prop: "title",
        type: "ReactNode",
        default: '"Check these fields"',
        description: "Heading that names the summary.",
      },
      {
        prop: "focusOnError / focusKey",
        type: "boolean / string | number",
        default: "false",
        description:
          "Opt into focus after the first failure; change focusKey after each failed submit. Editing does not trigger repeated focus.",
      },
    ],
  },
  {
    title:
      "FieldSet / FieldLegend / FieldGroup / FieldContent / FieldRow / FieldSeparator",
    props: [
      {
        prop: "FieldSet / FieldLegend",
        type: "Base UI Fieldset.Root / Legend props",
        description:
          "Native fieldset semantics and legend association; FieldSet supports disabled.",
      },
      {
        prop: "FieldLegend.variant / showRequired / requiredIndicator",
        type: '"legend" | "label" / boolean / ReactNode',
        default: '"legend" / false / *',
        description: "Legend styling and optional required marker.",
      },
      {
        prop: "FieldGroup.variant",
        type: '"default" | "outline"',
        default: '"default"',
        description:
          "Group controls and provide the responsive layout container.",
      },
      {
        prop: "FieldContent",
        type: "div props",
        description:
          "Shrinkable control-and-feedback column for horizontal layouts.",
      },
      {
        prop: "FieldRow.gap",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Responsive row spacing. Stacks before the sm breakpoint.",
      },
      {
        prop: "FieldSeparator.children",
        type: "ReactNode",
        description:
          "Optional text interrupting a separator. All layout parts forward className and native attributes.",
      },
    ],
  },
  {
    title: "FormField / createZodValidator / useFieldContext / variants",
    props: [
      {
        prop: "FormField.form / name / children",
        type: "TanStack form / string / (field) => ReactNode",
        description:
          "Legacy adapter renders form.Field and passes current metadata to Field. Supports orientation, className, disabled, required, and readOnly.",
      },
      {
        prop: "createZodValidator(schema, options)",
        type: "ZodType / { onBlur?, onSubmit?, onChange? }",
        default: "onBlur and onSubmit",
        description:
          "Field-level first-message validators. onChange=true is sync; a numeric onChange uses async debounce only. Form-level schema errors should use TanStack's schema support.",
      },
      {
        prop: "useFieldContext()",
        type: "FieldContextValue | null",
        description:
          "Kira supplemental metadata. Use Base UI association rather than constructing ARIA IDs from the legacy context ID hints.",
      },
      {
        prop: "fieldVariants / fieldControlVariants",
        type: "CVA functions",
        description:
          "Exported styling variants; the z export remains available for existing consumers.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const fieldPageChangelogEntries = [
  {
    version: "3.2.0",
    date: "November 18, 2026",
    changes: [
      {
        type: "changed" as const,
        title: "Contract gaps and FieldControl metrics",
        description:
          "FieldSet and FieldGroup move gap-5→gap-6 (form-field tier); FieldError and FieldStatus icon gaps move gap-1.5→gap-2. FieldControl now matches the default control: min-h-9 px-4 py-1 rounded-lg (was min-h-10 px-3 py-2 rounded-md), so it renders equal-height beside a plain Input. Outline and ErrorSummary keep the inline-alert p-4 rounded-lg tier.",
      },
    ],
  },
  {
    version: "3.1.1",
    date: "November 13, 2026",
    changes: [
      {
        type: "changed" as const,
        title: "Reuse shared kit controls",
        description:
          "FieldInput now uses the shared Input styling and actions, and KiraField multiline uses Textarea. Input sizes use the kit xs/sm/default/lg variants. The Controls demo reuses NumericInput and searchable KiraSelect with field IDs, form names, and read-only state preserved.",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "November 12, 2026",
    changes: [
      {
        type: "added",
        title: "Composable controls",
        description:
          "KiraField.control supports existing kit and Base UI controls without converting checked, array, or numeric values into text. Native controls register through FieldControl. FieldItem scopes option labels and descriptions.",
      },
      {
        type: "added",
        title: "Control and native-input demos",
        description:
          "Live input, textarea, input-group, select, radio, checkbox/group, switch, slider, number-field and combobox composition; editable/read-only/disabled states; form-value preview; native input types.",
      },
      {
        type: "changed",
        title: "Exclusive control props",
        description:
          "Text convenience props are type-exclusive with control. The existing default input API is unchanged. Custom controls own value/checked/blur callbacks. Audited against Base UI 1.9.0.",
      },
    ],
  },
  {
    version: "3.0.1",
    date: "November 12, 2026",
    changes: [
      {
        type: "fixed",
        title: "Validation ownership and status feedback",
        description:
          "Empty conditional errors no longer mark a field invalid. Explicit invalid=false is respected; otherwise Base UI owns native validation. Status feedback has polite, atomic announcement semantics.",
      },
      {
        type: "fixed",
        title: "Typed adapters and accurate fixtures",
        description:
          "FormField infers its field-name contract from the supplied TanStack renderer without broad form generics. Error-summary keys are narrowed safely, uncontrolled counters subscribe to the native value through edits, resets, and changed defaults; imported counters measure actual text.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "November 11, 2026",
    changes: [
      {
        type: "added",
        title: "KiraField and recoverable errors",
        description:
          "Composed control, blur-first validation, native textarea, character limits, and linked FieldErrorSummary with deliberate submit focus.",
      },
      {
        type: "changed",
        title: "Base UI Field and Fieldset",
        description:
          "Audited against Base UI 1.9.0 (October 9, 2026 release). Primitive-owned association replaces the custom label/error state wiring.",
      },
      {
        type: "breaking",
        title: "IDs and validation helper contract",
        description:
          "Field.id now identifies its root; use KiraField.controlId or FieldInput.id for control links. createZodValidator now defaults to blur/submit and returns field-level strings, including scalar submit errors; numeric onChange is async-only.",
      },
      {
        type: "breaking",
        title: "FieldLabel and state selectors",
        description:
          "FieldLabel accepts Base UI Field.Label props. Base UI data-invalid/data-disabled are presence attributes; use data-invalid selectors. FieldTitle now has data-slot=field-title.",
      },
      {
        type: "fixed",
        title: "Input events, live metadata, and quiet feedback",
        description:
          "Uncontrolled inputs stay editable; external handlers compose with TanStack; helper and error descriptions are connected; showErrors hides all content. Removed icon scale-from-zero and routine error movement.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function ControlsControlsSection({
  mode,
  setMode,
}: {
  mode: "disabled" | "editable" | "read-only";
  setMode: React.Dispatch<
    React.SetStateAction<"disabled" | "editable" | "read-only">
  >;
}) {
  return (
    <fieldset aria-label="Control state" className="flex flex-wrap gap-2">
      {(["editable", "read-only", "disabled"] as const).map((next) => {
        const resolveValue1 = () => {
          if (next === "editable") {
            return "Editable" as const;
          }

          if (next === "read-only") {
            return "Read-only" as const;
          }

          return "Disabled" as const;
        };

        return (
          <Button
            key={next}
            size="sm"
            variant={mode === next ? "default" : "outline"}
            aria-pressed={mode === next}
            onClick={() => setMode(next)}
          >
            {resolveValue1()}
          </Button>
        );
      })}
    </fieldset>
  );
}

function ControlsControlsSection2({
  state,
}: {
  state: { disabled: boolean; readOnly: boolean };
}) {
  return (
    <KiraField
      {...state}
      name="region"
      label="Billing region"
      required
      description="Select a region before previewing the form."
      control={({ id, ...props }) => (
        <Select
          {...props}
          defaultValue=""
          items={[
            { value: "", label: "Choose a region" },
            { value: "apac", label: "Asia Pacific" },
            { value: "eu", label: "Europe" },
            { value: "us", label: "United States" },
          ]}
        >
          <SelectTrigger id={id} size="lg" className="pointer-coarse:min-h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="">Choose a region</SelectItem>
            <SelectItem value="apac">Asia Pacific</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="us">United States</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  );
}

function ControlsControlsSection3({
  state,
}: {
  state: { disabled: boolean; readOnly: boolean };
}) {
  return (
    <KiraField
      {...state}
      name="plan"
      label="Workspace plan"
      labelProps={{ nativeLabel: false, render: <div /> }}
      required
      description="Arrow keys move within the radio group."
      control={({ id, ...props }) => (
        <RadioGroup {...props} defaultValue="team">
          {(["Starter", "Team", "Business"] as const).map((plan, index) => (
            <FieldItem key={plan}>
              <RadioGroupItem
                id={index === 0 ? id : undefined}
                value={plan.toLowerCase()}
              />
              <FieldLabel showRequired={false}>{plan}</FieldLabel>
            </FieldItem>
          ))}
        </RadioGroup>
      )}
    />
  );
}

function ControlsControlsSection4({
  state,
}: {
  state: { disabled: boolean; readOnly: boolean };
}) {
  return (
    <KiraField
      {...state}
      name="channels"
      label="Notification channels"
      labelProps={{ nativeLabel: false, render: <div /> }}
      description="Choose at least one channel. Group choices share a value, but each option has its own label."
      validate={(values) =>
        Array.isArray(values) && values.length > 0
          ? undefined
          : "Choose at least one notification channel."
      }
      control={({ id, disabled, readOnly }) => (
        <CheckboxGroupPrimitive
          data-slot="field-demo-checkbox-group"
          disabled={disabled}
          defaultValue={["email"]}
          className="space-y-3"
        >
          {(["Email", "In-app", "Weekly digest"] as const).map(
            (channel, index) => (
              <FieldItem key={channel}>
                <Checkbox
                  id={index === 0 ? id : undefined}
                  value={channel.toLowerCase()}
                  readOnly={readOnly}
                />
                <FieldContent>
                  <FieldLabel showRequired={false}>{channel}</FieldLabel>
                  {channel === "Weekly digest" && (
                    <FieldDescription>
                      A single summary every Monday.
                    </FieldDescription>
                  )}
                </FieldContent>
              </FieldItem>
            ),
          )}
        </CheckboxGroupPrimitive>
      )}
    />
  );
}

function ControlsControlsSection5({
  state,
}: {
  state: { disabled: boolean; readOnly: boolean };
}) {
  return (
    <KiraField
      {...state}
      name="reminder"
      label="Reminder lead time"
      labelProps={{ nativeLabel: false, render: <div /> }}
      description="A numeric slider. Arrow keys adjust the value."
      control={({ name, disabled, readOnly }) => (
        <Slider
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          defaultValue={30}
          min={5}
          max={60}
          step={5}
          showValue
          tooltipMode="never"
          formatValue={(value) => `${value} minutes`}
        />
      )}
    />
  );
}

function ControlTextFields({ state }: ControlTextFieldsProps) {
  return (
    <>
      <KiraField
        {...state}
        name="workspace"
        label="Workspace name"
        description="Kit Input registers directly with the field."
        control={(props) => <Input {...props} defaultValue="Design studio" />}
      />
      <KiraField
        {...state}
        name="summary"
        label="Workspace summary"
        description="Kit Textarea keeps its native form value."
        control={(props) => (
          <FieldInput
            {...props}
            render={<Textarea minRows={2} />}
            defaultValue="A shared home for design reviews."
          />
        )}
      />
      <KiraField
        {...state}
        name="handle"
        label="Public handle"
        description="InputGroupInput already uses Base UI Input."
        control={(props) => (
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput {...props} defaultValue="design-studio" />
          </InputGroup>
        )}
      />
    </>
  );
}

interface ControlTextFieldsProps {
  state: { disabled: boolean; readOnly: boolean };
}

function ControlFieldGrid({ state, seats, setSeats }: ControlFieldGridProps) {
  return (
    <>
      <div className="grid min-w-0 gap-6 sm:grid-cols-2">
        <ControlTextFields state={state} />
        <ControlsControlsSection2 state={state} />
        <ControlsControlsSection3 state={state} />
        <ControlsControlsSection4 state={state} />
        <KiraField
          {...state}
          name="billingConsent"
          label="Send billing updates"
          required
          description="Required checkbox. Press Space to change it."
          control={(props) => <Checkbox {...props} value="accepted" />}
        />
        <KiraField
          {...state}
          name="presence"
          label="Show my online status"
          description="A switch uses checked state, not a string value."
          control={(props) => (
            <Switch {...props} defaultChecked value="visible" />
          )}
        />
        <ControlsControlsSection5 state={state} />
        <KiraField
          {...state}
          name="seats"
          label="Licensed seats"
          required
          description="Kit NumericInput owns stepping and numeric validation."
          control={(props) => (
            <NumericInput
              {...props}
              value={seats}
              onValueChange={setSeats}
              min={1}
              max={200}
            />
          )}
        />
        <KiraField
          {...state}
          name="tool"
          label="Workspace tool"
          description="Kit KiraSelect supports searching and selection."
          control={(props) => <WorkspaceToolControl {...props} />}
        />
      </div>
    </>
  );
}

interface ControlFieldGridProps {
  state: { disabled: boolean; readOnly: boolean };
  seats: number | null;
  setSeats: React.Dispatch<React.SetStateAction<number | null>>;
}
