import * as React from "react";
import { z } from "zod";
import { IconChecks, IconLayoutList, IconRoute } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ProgressIndicator,
  KiraProgressIndicator,
  type ProgressStep,
  type ProgressStepState,
} from "@/components/ui/progress-indicator";
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

const accountSteps: ProgressStep[] = [
  { value: 10, label: "Create account" },
  { value: 20, label: "Set up workspace" },
  { value: 30, label: "Review details" },
];

function BasicDemo() {
  const [current, setCurrent] = React.useState(0);

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={accountSteps}
        currentStep={current}
        aria-label="Account setup"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={current === accountSteps.length}
          onClick={() =>
            setCurrent((value) => Math.min(accountSteps.length, value + 1))
          }
        >
          {current === accountSteps.length - 1 ? "Finish setup" : "Next step"}
        </Button>
      </div>
    </div>
  );
}

const basicCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/ui/progress-indicator"

const steps = [
  { value: 10, label: "Create account" },
  { value: 20, label: "Set up workspace" },
  { value: 30, label: "Review details" },
]

export function BasicDemo() {
  const [current, setCurrent] = useState(0)
  return <div className="space-y-6">
    <ProgressIndicator steps={steps} currentStep={current} aria-label="Account setup" />
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" disabled={current === 0}
        onClick={() => setCurrent(value => Math.max(0, value - 1))}>Previous</Button>
      <Button disabled={current === steps.length}
        onClick={() => setCurrent(value => Math.min(steps.length, value + 1))}>
        {current === steps.length - 1 ? "Finish setup" : "Next step"}
      </Button>
    </div>
  </div>
}`;

function VariantsDemo() {
  const variants = ["default", "success", "warning", "destructive"] as const;

  return (
    <div className="space-y-8">
      {variants.map((variant) => (
        <div key={variant} className="space-y-3">
          <p className="text-sm font-medium capitalize">{variant}</p>
          <ProgressIndicator
            steps={accountSteps}
            currentStep={1}
            variant={variant}
            aria-label={variant + " account setup"}
          />
        </div>
      ))}
    </div>
  );
}

const variantsCode = `import { ProgressIndicator } from "@/components/ui/progress-indicator"

const steps = [
  { value: 10, label: "Create account" },
  { value: 20, label: "Set up workspace" },
  { value: 30, label: "Review details" },
]

export function VariantsDemo() {
  return <div className="space-y-8">
    {(["default", "success", "warning", "destructive"] as const).map(variant =>
      <div key={variant} className="space-y-3">
        <p className="text-sm font-medium capitalize">{variant}</p>
        <ProgressIndicator steps={steps} currentStep={1} variant={variant}
          aria-label={variant + " account setup"} />
      </div>
    )}
  </div>
}`;

function SizesDemo() {
  return (
    <div className="space-y-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="space-y-3">
          <p className="text-sm font-medium">{size}</p>
          <ProgressIndicator steps={accountSteps} currentStep={1} size={size} />
        </div>
      ))}
      <ProgressIndicator
        steps={accountSteps}
        currentStep={1}
        size="sm"
        showLabel={false}
        aria-label="Compact account setup"
      />
    </div>
  );
}

const sizesCode = `import { ProgressIndicator } from "@/components/ui/progress-indicator"

const steps = [
  { value: 10, label: "Create account" },
  { value: 20, label: "Set up workspace" },
  { value: 30, label: "Review details" },
]

export function SizesDemo() {
  return <div className="space-y-8">
    {(["sm", "default", "lg"] as const).map(size => <div key={size} className="space-y-3">
      <p className="text-sm font-medium">{size}</p>
      <ProgressIndicator steps={steps} currentStep={1} size={size} />
    </div>)}
    <ProgressIndicator steps={steps} currentStep={1} size="sm"
      showLabel={false} aria-label="Compact account setup" />
  </div>
}`;

function LayoutDemo() {
  const steps: ProgressStep[] = [
    {
      value: 10,
      label: "Read source",
      description: "Customer contacts from the support export",
    },
    {
      value: 20,
      label: "Validate addresses",
      description:
        "Keep the original file available while reviewing invalid rows",
    },
    {
      value: 30,
      label: "Publish directory",
      description: "Make the approved records available to your team",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium">
          Horizontal; stacks on small screens
        </p>
        <ProgressIndicator steps={steps} currentStep={1} showDescription />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Vertical</p>
        <ProgressIndicator
          steps={steps}
          currentStep={1}
          orientation="vertical"
          showDescription
        />
      </div>
      <div dir="rtl" className="space-y-3">
        <p className="text-sm font-medium">Right to left</p>
        <ProgressIndicator
          steps={accountSteps}
          currentStep={1}
          aria-label="Right to left setup"
        />
      </div>
    </div>
  );
}

const layoutCode = `import { ProgressIndicator, type ProgressStep } from "@/components/ui/progress-indicator"

const steps: ProgressStep[] = [
  { value: 10, label: "Read source", description: "Customer contacts from the support export" },
  { value: 20, label: "Validate addresses", description: "Keep the original file available while reviewing invalid rows" },
  { value: 30, label: "Publish directory", description: "Make the approved records available to your team" },
]

export function LayoutDemo() {
  return <div className="space-y-8">
    <div className="space-y-3">
      <p className="text-sm font-medium">Horizontal; stacks on small screens</p>
      <ProgressIndicator steps={steps} currentStep={1} showDescription />
    </div>
    <div className="space-y-3">
      <p className="text-sm font-medium">Vertical</p>
      <ProgressIndicator steps={steps} currentStep={1} orientation="vertical" showDescription />
    </div>
    <div dir="rtl" className="space-y-3">
      <p className="text-sm font-medium">Right to left</p>
      <ProgressIndicator steps={[
        { value: 10, label: "Create account" },
        { value: 20, label: "Set up workspace" },
        { value: 30, label: "Review details" },
      ]} currentStep={1} aria-label="Right to left setup" />
    </div>
  </div>
}`;

const inspectionSteps: ProgressStep[] = [
  {
    value: 10,
    label: "Source checked",
    description: "24 records are ready for review",
  },
  {
    value: 20,
    label: "Mapping approved",
    description: "Email and company columns are matched",
  },
  {
    value: 30,
    label: "Import records",
    description: "The background task is ready to start",
  },
  {
    value: 40,
    label: "Notify team",
    optional: true,
    disabled: true,
    disabledReason: "Available after the import finishes",
  },
];

function InspectDemo() {
  const [selected, setSelected] = React.useState(10);
  const [readOnly, setReadOnly] = React.useState(false);
  const selectedStep = inspectionSteps.find((step) => step.value === selected);

  return (
    <div className="space-y-5">
      <ProgressIndicator
        steps={inspectionSteps}
        currentStep={2}
        clickable
        onStepClick={setSelected}
        readOnly={readOnly}
        showDescription
        aria-label="Inspect import milestones"
      />
      <div className="rounded-lg border p-4 text-sm">
        <p className="font-medium">Inspecting: {selectedStep?.label}</p>
        <p className="mt-1 text-muted-foreground">
          {selectedStep?.description}
        </p>
      </div>
      <Button
        variant="outline"
        aria-pressed={readOnly}
        onClick={() => setReadOnly((value) => !value)}
      >
        {readOnly ? "Enable inspection" : "Make read only"}
      </Button>
    </div>
  );
}

const inspectCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator, type ProgressStep } from "@/components/ui/progress-indicator"

const steps: ProgressStep[] = [
  { value: 10, label: "Source checked", description: "24 records are ready for review" },
  { value: 20, label: "Mapping approved", description: "Email and company columns are matched" },
  { value: 30, label: "Import records", description: "The background task is ready to start" },
  { value: 40, label: "Notify team", optional: true, disabled: true,
    disabledReason: "Available after the import finishes" },
]

export function InspectDemo() {
  const [selected, setSelected] = useState(10)
  const [readOnly, setReadOnly] = useState(false)
  const selectedStep = steps.find(step => step.value === selected)
  return <div className="space-y-5">
    <ProgressIndicator steps={steps} currentStep={2} clickable onStepClick={setSelected}
      readOnly={readOnly} showDescription aria-label="Inspect import milestones" />
    <div className="rounded-lg border p-4 text-sm">
      <p className="font-medium">Inspecting: {selectedStep?.label}</p>
      <p className="mt-1 text-muted-foreground">{selectedStep?.description}</p>
    </div>
    <Button variant="outline" aria-pressed={readOnly} onClick={() => setReadOnly(value => !value)}>
      {readOnly ? "Enable inspection" : "Make read only"}
    </Button>
  </div>
}`;

type ImportResult = {
  emails: string[];
  error: string | null;
  imported: boolean;
};

const initialSource =
  '[{"email":"lee@example.com"},{"email":"morgan@example.com"}]';

const importRecordsSchema = z
  .array(
    z.object({
      email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    }),
  )
  .nonempty();

function validateRecords(source: string): string[] {
  const result = importRecordsSchema.safeParse(JSON.parse(source));

  if (!result.success) {
    const issue = result.error.issues[0];

    if (issue.path.length === 0)
      throw new Error("Add at least one contact record.");

    throw new Error(
      "Record " + (Number(issue.path[0]) + 1) + " needs a valid email address.",
    );
  }

  return result.data.map((record) => record.email);
}

type ImportPresentation = {
  validationState: ProgressStepState;
  importState: ProgressStepState;
  currentStep: number;
  progress: number | undefined;
};

function getImportPresentation(
  result: ImportResult | null,
): ImportPresentation {
  if (!result)
    return {
      validationState: "pending",
      importState: "pending",
      currentStep: 0,
      progress: undefined,
    };

  if (result.error)
    return {
      validationState: "error",
      importState: "pending",
      currentStep: 1,
      progress: undefined,
    };

  if (result.imported)
    return {
      validationState: "completed",
      importState: "completed",
      currentStep: 4,
      progress: 100,
    };

  return {
    validationState: "completed",
    importState: "active",
    currentStep: 2,
    progress: 0,
  };
}

function getImportSteps(
  result: ImportResult | null,
  presentation: ImportPresentation,
): ProgressStep[] {
  return [
    { value: 10, label: "Read source", state: result ? "completed" : "active" },
    {
      value: 20,
      label: "Validate contacts",
      state: presentation.validationState,
      description:
        result?.error ??
        (result
          ? result.emails.length + " valid contacts"
          : "Check JSON and email addresses"),
    },
    {
      value: 30,
      label: "Import locally",
      state: presentation.importState,
    },
    {
      value: 40,
      label: "Directory ready",
      state: result?.imported ? "completed" : "pending",
    },
  ];
}

function KiraDemo() {
  const [source, setSource] = React.useState(initialSource);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const id = React.useId();

  const validate = () => {
    try {
      setResult({
        emails: validateRecords(source),
        error: null,
        imported: false,
      });
    } catch (error) {
      setResult({
        emails: [],
        error:
          error instanceof Error ? error.message : "Check the JSON format.",
        imported: false,
      });
    }
  };

  const presentation = getImportPresentation(result);
  const steps = getImportSteps(result, presentation);

  return (
    <div className="space-y-6">
      <KiraLocalImportPreviewRecordsStaySection
        id={id}
        source={source}
        setSource={setSource}
        result={result}
      />
      <KiraProgressIndicator
        label="Contact import"
        description="Inspect the phase that needs attention, fix the source, and retry."
        steps={steps}
        currentStep={presentation.currentStep}
        progress={presentation.progress}
        progressLabel="Local import"
        onRetry={validate}
        retryLabel="Retry validation"
      />
      <KiraControlsSection
        validate={validate}
        result={result}
        setResult={setResult}
        setSource={setSource}
      />
      {result?.imported && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">Local directory</p>
          <ul className="list-inside list-disc">
            {Array.from(new Set(result.emails)).map((email) => (
              <li key={email} className="wrap-anywhere">
                {email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const kiraCode = `import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { KiraProgressIndicator, type ProgressStep } from "@/components/ui/progress-indicator"

type Result = { emails: string[]; error: string | null; imported: boolean }
const initialSource = '[{"email":"lee@example.com"},{"email":"morgan@example.com"}]'

function validateRecords(source: string): string[] {
  const records: unknown = JSON.parse(source)
  if (!Array.isArray(records) || records.length === 0) throw new Error("Add at least one contact record.")
  return records.map((record: unknown, index: number) => {
    if (typeof record !== "object" || record === null || !("email" in record) ||
      typeof record.email !== "string" || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(record.email)) {
      throw new Error("Record " + (index + 1) + " needs a valid email address.")
    }
    return record.email
  })
}

export function KiraDemo() {
  const [source, setSource] = useState(initialSource)
  const [result, setResult] = useState<Result | null>(null)
  const id = useId()
  const validate = () => {
    try { setResult({ emails: validateRecords(source), error: null, imported: false }) }
    catch (error) {
      setResult({ emails: [], error: error instanceof Error ? error.message : "Check the JSON format.", imported: false })
    }
  }
  const steps: ProgressStep[] = [
    { value: 10, label: "Read source", state: result ? "completed" : "active" },
    { value: 20, label: "Validate contacts", state: !result ? "pending" : result.error ? "error" : "completed",
      description: result?.error ?? (result ? result.emails.length + " valid contacts" : "Check JSON and email addresses") },
    { value: 30, label: "Import locally", state: result && !result.error ? result.imported ? "completed" : "active" : "pending" },
    { value: 40, label: "Directory ready", state: result?.imported ? "completed" : "pending" },
  ]
  return <div className="space-y-6">
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">Contact records</label>
      <Textarea id={id} value={source} onChange={event => setSource(event.target.value)}
        aria-invalid={Boolean(result?.error)} aria-describedby={result?.error ? id + "-error" : id + "-hint"}
        className="font-mono text-xs" />
      <p id={id + "-hint"} className="text-xs text-muted-foreground">Local import preview. Records stay in this browser.</p>
      {result?.error && <p id={id + "-error"} className="text-sm text-destructive">{result.error}</p>}
    </div>
    <KiraProgressIndicator label="Contact import"
      description="Inspect the phase that needs attention, fix the source, and retry."
      steps={steps} currentStep={!result ? 0 : result.error ? 1 : result.imported ? 4 : 2}
      progress={result && !result.error ? result.imported ? 100 : 0 : undefined}
      progressLabel="Local import" onRetry={validate} retryLabel="Retry validation" />
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={validate}>Check records</Button>
      <Button disabled={!result || Boolean(result.error) || result.imported}
        onClick={() => setResult(value => value && !value.error ? { ...value, imported: true } : value)}>Import contacts</Button>
      <Button variant="ghost" onClick={() => { setSource(initialSource); setResult(null) }}>Reset</Button>
    </div>
    {result?.imported && <div className="space-y-2 text-sm">
      <p className="font-medium">Local directory</p>
      <ul className="list-inside list-disc">
        {result.emails.map((email, index) => <li key={email + index} className="wrap-anywhere">{email}</li>)}
      </ul>
    </div>}
  </div>
}`;

function MotionDemo() {
  const [motion, setMotion] = React.useState(true);
  const [finished, setFinished] = React.useState(false);

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Illustrative worker events. Motion stops offscreen, in hidden tabs, and
        with reduced motion.
      </p>
      <ProgressIndicator
        steps={[
          { value: 10, label: "Download complete", state: "completed" },
          {
            value: 20,
            label: "Index documents",
            state: finished ? "completed" : "active",
            loading: !finished,
          },
          {
            value: 30,
            label: "Search ready",
            state: finished ? "completed" : "pending",
          },
        ]}
        currentStep={finished ? 3 : 1}
        animated={motion}
        showStatus
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          aria-pressed={motion}
          onClick={() => setMotion((value) => !value)}
        >
          Motion {motion ? "on" : "off"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setFinished((value) => !value)}
        >
          {finished ? "Restart worker" : "Mark indexing complete"}
        </Button>
      </div>
    </div>
  );
}

const motionCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "@/components/ui/progress-indicator"

export function MotionDemo() {
  const [motion, setMotion] = useState(true)
  const [finished, setFinished] = useState(false)
  return <div className="space-y-5">
    <p className="text-sm text-muted-foreground">Illustrative worker events. Motion stops offscreen, in hidden tabs, and with reduced motion.</p>
    <ProgressIndicator steps={[
      { value: 10, label: "Download complete", state: "completed" },
      { value: 20, label: "Index documents", state: finished ? "completed" : "active", loading: !finished },
      { value: 30, label: "Search ready", state: finished ? "completed" : "pending" },
    ]} currentStep={finished ? 3 : 1} animated={motion} showStatus />
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" aria-pressed={motion} onClick={() => setMotion(value => !value)}>Motion {motion ? "on" : "off"}</Button>
      <Button variant="outline" onClick={() => setFinished(value => !value)}>{finished ? "Restart worker" : "Mark indexing complete"}</Button>
    </div>
  </div>
}`;

function KeyboardDemo() {
  const [selected, setSelected] = React.useState("None");

  const steps: ProgressStep[] = [
    { value: 10, label: "Read source", state: "completed" },
    {
      value: 20,
      label: "Check permissions",
      state: "error",
      description: "Reconnect the source account to continue",
    },
    {
      value: 30,
      label: "Start import",
      disabled: true,
      disabledReason: "Resolve the permission error first",
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Tab through the named buttons. Enter and Space inspect a step. The
        disabled reason remains reachable.
      </p>
      <ProgressIndicator
        steps={steps}
        currentStep={1}
        orientation="vertical"
        clickable
        showDescription
        onStepClick={(value) =>
          setSelected(
            steps.find((step) => step.value === value)?.label ?? "None",
          )
        }
      />
      <p className="text-sm">Last inspected: {selected}</p>
    </div>
  );
}

const keyboardCode = `import { useState } from "react"
import { ProgressIndicator, type ProgressStep } from "@/components/ui/progress-indicator"

const steps: ProgressStep[] = [
  { value: 10, label: "Read source", state: "completed" },
  { value: 20, label: "Check permissions", state: "error", description: "Reconnect the source account to continue" },
  { value: 30, label: "Start import", disabled: true, disabledReason: "Resolve the permission error first" },
]

export function KeyboardDemo() {
  const [selected, setSelected] = useState("None")
  return <div className="space-y-5">
    <p className="text-sm text-muted-foreground">Tab through the named buttons. Enter and Space inspect a step. The disabled reason remains reachable.</p>
    <ProgressIndicator steps={steps} currentStep={1} orientation="vertical" clickable showDescription
      onStepClick={value => setSelected(steps.find(step => step.value === value)?.label ?? "None")} />
    <p className="text-sm">Last inspected: {selected}</p>
  </div>
}`;

function StatesDemo() {
  const states: ProgressStepState[] = [
    "completed",
    "active",
    "pending",
    "error",
    "paused",
    "skipped",
  ];

  const steps: ProgressStep[] = states.map((state, index) => ({
    value: index,
    label:
      state === "error"
        ? "Check customer-directory permissions before importing international accounts"
        : state,
    state,
    description:
      state === "error"
        ? "Reconnect the directory with permission to read contacts"
        : undefined,
    optional: state === "skipped",
  }));

  return (
    <div className="space-y-8">
      <div className="w-full max-w-[320px]">
        <ProgressIndicator
          steps={steps}
          currentStep={1}
          orientation="vertical"
          showStatus
          showDescription
        />
      </div>
      <ProgressIndicator steps={[]} currentStep={0} />
      <ProgressIndicator
        steps={[{ value: 10, label: "" }]}
        currentStep={Number.NaN}
        showStatus
        aria-label="Unstarted unnamed step"
      />
      <ProgressIndicator
        steps={accountSteps}
        currentStep={99}
        showStatus
        aria-label="Clamped completion"
      />
      <ProgressIndicator
        steps={accountSteps}
        currentStep={1}
        clickable
        onStepClick={() => {}}
        disabled
        disabledReason="This workflow is unavailable during maintenance"
        showStatus
        aria-label="Unavailable workflow"
      />
    </div>
  );
}

const statesCode = `import { ProgressIndicator, type ProgressStep, type ProgressStepState } from "@/components/ui/progress-indicator"

const accountSteps = [
  { value: 10, label: "Create account" },
  { value: 20, label: "Set up workspace" },
  { value: 30, label: "Review details" },
]

export function StatesDemo() {
  const states: ProgressStepState[] = ["completed", "active", "pending", "error", "paused", "skipped"]
  const steps: ProgressStep[] = states.map((state, index) => ({
    value: index,
    label: state === "error" ? "Check customer-directory permissions before importing international accounts" : state,
    state,
    description: state === "error" ? "Reconnect the directory with permission to read contacts" : undefined,
    optional: state === "skipped",
  }))
  return <div className="space-y-8">
    <div className="w-full max-w-[320px]">
      <ProgressIndicator steps={steps} currentStep={1} orientation="vertical" showStatus showDescription />
    </div>
    <ProgressIndicator steps={[]} currentStep={0} />
    <ProgressIndicator steps={[{ value: 10, label: "" }]} currentStep={Number.NaN}
      showStatus aria-label="Unstarted unnamed step" />
    <ProgressIndicator steps={accountSteps} currentStep={99} showStatus aria-label="Clamped completion" />
    <ProgressIndicator steps={accountSteps} currentStep={1} clickable onStepClick={() => {}}
      disabled disabledReason="This workflow is unavailable during maintenance" showStatus aria-label="Unavailable workflow" />
  </div>
}`;

const usageCode = `import { ProgressIndicator, KiraProgressIndicator, type ProgressStep } from "@/components/ui/progress-indicator"

const steps: ProgressStep[] = [
  { value: 10, label: "Read source", state: "completed" },
  { value: 20, label: "Validate contacts", state: "error", description: "Reconnect the source account" },
  { value: 30, label: "Import records", state: "pending" },
]

export function ImportStatus() {
  const retry = (value: number) => console.info("Reconnect and retry step", value)
  return <div className="space-y-6">
    <ProgressIndicator steps={steps} currentStep={1} orientation="vertical" showDescription />
    <KiraProgressIndicator label="Contact import" steps={steps} currentStep={1} onRetry={retry} />
  </div>
}`;

const baseProps = [
  {
    prop: "steps",
    type: "readonly ProgressStep[]",
    description:
      "Ordered steps with unique numeric values. Explicit states override index-derived states.",
  },
  {
    prop: "currentStep",
    type: "number",
    description:
      "Zero-based index; -1 is unstarted and steps.length is complete. Finite values are truncated/clamped; nonfinite values are unstarted.",
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Marker and connector size.",
  },
  {
    prop: "variant",
    type: '"default" | "success" | "warning" | "destructive"',
    default: '"default"',
    description: "Active and completed tone; future connectors remain neutral.",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Step layout; vertical labels remain visible.",
  },
  {
    prop: "responsive",
    type: "boolean",
    default: "true",
    description: "Stack horizontal steps below the sm breakpoint.",
  },
  {
    prop: "clickable / onStepClick",
    type: "boolean / ((value: number) => void)",
    default: "false",
    description:
      "Both enable native step buttons. Inspecting a step does not change progress automatically.",
  },
  {
    prop: "animated",
    type: "boolean",
    default: "false",
    description:
      "Gate state transitions and loading rotation; respects reduced motion and visibility.",
  },
  {
    prop: "showLabel / showDescription / showStatus",
    type: "boolean",
    default: "true / false / false",
    description:
      "Show label, description, and state text. Labels remain accessible when hidden; error/paused/skipped states remain visible.",
  },
  {
    prop: "disabled / readOnly",
    type: "boolean",
    default: "false",
    description:
      "Disable controls or render a passive inspection view. Disabled step reasons can remain focusable.",
  },
  {
    prop: "disabledReason",
    type: "string",
    description:
      "Fallback explanation for disabled steps; a per-step reason takes precedence.",
  },
  {
    prop: "emptyMessage",
    type: "React.ReactNode",
    default: '"No steps to show."',
    description: "Content for an empty sequence.",
  },
  {
    prop: "Native div props",
    type: 'Omit<React.ComponentProps<"div">, "children">',
    description:
      "Ref, IDs, style, events, data attributes, and accessible group naming target the outer div.",
  },
];

const apiSections = [
  { title: "ProgressIndicator", props: baseProps },
  {
    title: "ProgressStep",
    props: [
      {
        prop: "label / value",
        type: "string / number",
        description:
          "Readable step name and unique stable callback value. Empty labels fall back to Step N; use showLabel=false to hide visual labels.",
      },
      {
        prop: "state",
        type: '"pending" | "active" | "completed" | "error" | "paused" | "skipped"',
        description: "Explicit task state; also exported as ProgressStepState.",
      },
      {
        prop: "icon / description",
        type: "React.ReactNode / string",
        description:
          "Custom pending/active icon and helper text. Terminal states use their own glyph.",
      },
      {
        prop: "optional / loading / disabled",
        type: "boolean",
        default: "false",
        description:
          "Optional hint, active loading glyph, or unavailable inspection action.",
      },
      {
        prop: "disabledReason",
        type: "string",
        description:
          "Visible explanation associated with the disabled step button.",
      },
    ],
  },
  {
    title: "KiraProgressIndicator",
    props: [
      {
        prop: "ProgressIndicator props",
        type: 'Omit<ProgressIndicatorProps, "aria-label" | "aria-labelledby">',
        description:
          "Inherits step/layout options. Native div props target the Kira wrapper. showDescription and showStatus default to true.",
      },
      {
        prop: "label / description",
        type: "string / React.ReactNode",
        description:
          "Visible task name and optional description, associated with the wrapper.",
      },
      {
        prop: "progress",
        type: "number | null",
        description:
          "Measured 0–100 phase progress via shared Base UI Progress; null means indeterminate; omitted hides the bar.",
      },
      {
        prop: "progressLabel",
        type: "string",
        description:
          "Phase bar label; defaults to the active step or Current phase.",
      },
      {
        prop: "statusMessage",
        type: "string",
        description: "Override the single contextual status phrase.",
      },
      {
        prop: "onRetry / retryLabel / retrying",
        type: "((value: number) => void) / string / boolean",
        default: "Retry step label / false",
        description:
          "Caller-owned recovery for the first failed step. Retry focuses the summary; read-only removes the action and retrying disables it.",
      },
    ],
  },
];

const demos = [
  {
    value: "basic",
    label: "Basic",
    title: "Account setup",
    description: "Index-based progress with an explicit completed state.",
    code: basicCode,
    component: BasicDemo,
  },
  {
    value: "variants",
    label: "Variants",
    title: "Semantic tones",
    description: "Colors apply to resolved work; future steps remain neutral.",
    code: variantsCode,
    component: VariantsDemo,
  },
  {
    value: "sizes",
    label: "Sizes",
    title: "Marker sizes",
    description: "Small, default, large, and an accessible compact view.",
    code: sizesCode,
    component: SizesDemo,
  },
  {
    value: "layout",
    label: "Layout",
    title: "Responsive milestone rails",
    description: "Descriptions, vertical reading, and right-to-left layout.",
    code: layoutCode,
    component: LayoutDemo,
  },
  {
    value: "inspect",
    label: "Inspect",
    title: "Inspect completed work",
    description: "Native step controls and visible unavailable reasons.",
    code: inspectCode,
    component: InspectDemo,
  },
  {
    value: "kira",
    label: "Kira",
    title: "Recover a contact import",
    description:
      "Validate real local records, fix errors, retry, and finish the import preview.",
    code: kiraCode,
    component: KiraDemo,
  },
  {
    value: "motion",
    label: "Motion",
    title: "Worker progress",
    description:
      "Caller-controlled loading and completion with an explicit motion switch.",
    code: motionCode,
    component: MotionDemo,
  },
  {
    value: "keyboard",
    label: "Keyboard",
    title: "Keyboard inspection",
    description:
      "Use Tab, Enter, and Space; disabled reasons remain accessible.",
    code: keyboardCode,
    component: KeyboardDemo,
  },
  {
    value: "states",
    label: "States",
    title: "States and narrow content",
    description:
      "Errors, pause, skipped work, empty input, safe indices, and long names.",
    code: statesCode,
    component: StatesDemo,
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function ProgressIndicatorPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Progress Indicator"
        description="Readable task milestones with explicit states, native inspection controls, and a contextual recovery summary."
        version="v2.0.0"
      />
      <FeatureGrid features={progressIndicatorPageFeatureGridFeatures} />
      <DemoTabs
        defaultValue="basic"
        tabs={demos.map(({ component: Demo, ...demo }) => ({
          value: demo.value,
          label: demo.label,
          demo: (
            <DemoWrapper
              title={demo.title}
              description={demo.description}
              code={demo.code}
            >
              <Demo />
            </DemoWrapper>
          ),
        }))}
      />
      <KeyboardShortcuts
        description="Step buttons inherit native activation through the shared Base UI Button. This indicator describes tasks; the separate Stepper owns wizard navigation."
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Visit each operable step and focusable disabled reason; passive indicators add no tab stops.",
          },
          {
            keys: "Enter / Space",
            description:
              "Inspect the focused step through onStepClick; inherited from Base UI Button.",
          },
          {
            keys: "Tab → Retry → Enter",
            description:
              "Kira addition: retry the failed phase and move focus to its contextual summary.",
          },
          {
            keys: "Read only",
            description:
              "Kira addition: preserve task information while removing inspection/retry actions.",
          },
        ]}
      />
      <UsageBlock
        code={usageCode}
        description="Numeric callback values remain independent of the currentStep index. The application owns task execution and recovery."
      />
      <APIReference sections={apiSections} />
      <Changelog
        entries={[
          {
            version: "v2.0.0",
            date: "2026-11-13",
            changes: [
              {
                type: "added",
                title:
                  "Explicit task states, native inspection, and Kira recovery",
                description:
                  "Completed/error/paused/skipped milestones, optional/disabled reasons, one status summary, and shared phase Progress. Audited on Base UI 1.9.0; feature research through October 31, 2026.",
              },
              {
                type: "fixed",
                title: "Accessible controls and aligned rails",
                description:
                  "Ordered steps, native buttons, root refs/props, full slots, truthful connectors, vertical labels, safe currentStep bounds, and motion/visibility gates.",
              },
              {
                type: "breaking",
                title: "Responsive and compact-label behavior",
                description:
                  "Horizontal layouts now stack below sm by default; use responsive=false to retain a horizontal rail. Empty labels now get Step N; use showLabel=false for an icon-only view. Connector classes are positioned within steps and active connectors no longer imply unfinished work is complete.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}

const progressIndicatorPageFeatureGridFeatures = [
  {
    title: "Task states",
    description:
      "Errors, pauses, skipped work, and disabled reasons stay visible.",
    icon: <IconChecks className="size-4" aria-hidden="true" />,
  },
  {
    title: "Responsive rails",
    description:
      "Aligned markers with vertical, compact, and right-to-left layouts.",
    icon: <IconLayoutList className="size-4" aria-hidden="true" />,
  },
  {
    title: "Local recovery",
    description:
      "A Kira task summary combines phase progress with caller-owned retry.",
    icon: <IconRoute className="size-4" aria-hidden="true" />,
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];

function KiraLocalImportPreviewRecordsStaySection({
  id,
  source,
  setSource,
  result,
}: {
  id: string;
  source: string;
  setSource: React.Dispatch<React.SetStateAction<string>>;
  result: ImportResult | null;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        Contact records
      </label>
      <Textarea
        id={id}
        value={source}
        onChange={(event) => setSource(event.target.value)}
        aria-invalid={Boolean(result?.error)}
        aria-describedby={result?.error ? id + "-error" : id + "-hint"}
        className="font-mono text-xs"
      />
      <p id={id + "-hint"} className="text-xs text-muted-foreground">
        Local import preview. Records stay in this browser.
      </p>
      {result?.error && (
        <p id={id + "-error"} className="text-sm text-destructive">
          {result.error}
        </p>
      )}
    </div>
  );
}

function KiraControlsSection({
  validate,
  result,
  setResult,
  setSource,
}: {
  validate: () => void;
  result: ImportResult | null;
  setResult: React.Dispatch<React.SetStateAction<ImportResult | null>>;
  setSource: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={validate}>
        Check records
      </Button>
      <Button
        disabled={!result || Boolean(result.error) || result.imported}
        onClick={() =>
          setResult((value) =>
            value && !value.error ? { ...value, imported: true } : value,
          )
        }
      >
        Import contacts
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setSource(initialSource);
          setResult(null);
        }}
      >
        Reset
      </Button>
    </div>
  );
}
