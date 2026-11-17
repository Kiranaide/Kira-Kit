import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { Form as FormPrimitive } from "@base-ui/react/form";
import {
  IconCircleCheck,
  IconCode,
  IconFileText,
  IconLayoutGrid,
  IconPalette,
  IconTable,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  KiraRadioGroup,
  RadioGroup,
  RadioGroupItem,
  RadioWithLabel,
  RadioCard,
  RadioButtonGroup,
  RadioButton,
} from "@/components/ui/radio-group";
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
  const id = React.useId();

  return (
    <div className="max-w-sm space-y-3">
      <p id={id} className="text-sm font-medium">
        Notification schedule
      </p>
      <RadioGroup
        defaultValue="daily"
        name="notifications"
        aria-labelledby={id}
      >
        {[
          { value: "daily", label: "Daily summary" },
          { value: "weekly", label: "Weekly summary" },
          { value: "off", label: "Only when mentioned" },
        ].map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-3"
          >
            <RadioGroupItem
              value={option.value}
              aria-labelledby={`${id}-${option.value}`}
            />
            <span id={`${id}-${option.value}`} className="text-sm">
              {option.label}
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

const basicCode =
  'import * as React from "react";\nimport { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";\n\nexport function BasicDemo() {\n  const id = React.useId();\n\n  return (\n    <div className="max-w-sm space-y-3">\n      <p id={id} className="text-sm font-medium">\n        Notification schedule\n      </p>\n      <RadioGroup\n        defaultValue="daily"\n        name="notifications"\n        aria-labelledby={id}\n      >\n        {[\n          { value: "daily", label: "Daily summary" },\n          { value: "weekly", label: "Weekly summary" },\n          { value: "off", label: "Only when mentioned" },\n        ].map((option) => (\n          <label\n            key={option.value}\n            className="flex min-h-11 cursor-pointer items-center gap-3"\n          >\n            <RadioGroupItem\n              value={option.value}\n              aria-labelledby={`${id}-${option.value}`}\n            />\n            <span id={`${id}-${option.value}`} className="text-sm">\n              {option.label}\n            </span>\n          </label>\n        ))}\n      </RadioGroup>\n    </div>\n  );\n}';

function LabelsDemo() {
  return (
    <RadioGroup
      defaultValue="review"
      aria-label="Review notifications"
      className="max-w-md"
    >
      <RadioWithLabel
        value="review"
        label="Requests for review"
        description="Get a message when someone needs your feedback."
      />
      <RadioWithLabel
        value="all"
        label="All activity"
        description="Include comments and status changes."
      />
      <RadioWithLabel
        value="sms"
        label="SMS notifications"
        description="Receive urgent requests on your phone."
        disabled
        disabledReason="Add a verified phone number in settings."
      />
    </RadioGroup>
  );
}

const labelsCode =
  'import { RadioGroup, RadioWithLabel } from "@/components/ui/radio-group";\n\nexport function LabelsDemo() {\n  return (\n    <RadioGroup\n      defaultValue="review"\n      aria-label="Review notifications"\n      className="max-w-md"\n    >\n      <RadioWithLabel\n        value="review"\n        label="Requests for review"\n        description="Get a message when someone needs your feedback."\n      />\n      <RadioWithLabel\n        value="all"\n        label="All activity"\n        description="Include comments and status changes."\n      />\n      <RadioWithLabel\n        value="sms"\n        label="SMS notifications"\n        description="Receive urgent requests on your phone."\n        disabled\n        disabledReason="Add a verified phone number in settings."\n      />\n    </RadioGroup>\n  );\n}';

function VariantsDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">Sizes</p>
        {(["sm", "default", "lg"] as const).map((size) => {
          const resolveLabel1 = () => {
            if (size === "default") {
              return "Default" as const;
            }

            if (size === "sm") {
              return "Small" as const;
            }

            return "Large" as const;
          };

          return (
            <RadioGroup
              key={size}
              defaultValue={size}
              aria-label={`${size} radio`}
            >
              <RadioWithLabel
                value={size}
                size={size}
                label={resolveLabel1()}
              />
            </RadioGroup>
          );
        })}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Semantic colors</p>
        {(["default", "success", "warning", "destructive"] as const).map(
          (color) => (
            <RadioGroup
              key={color}
              defaultValue={color}
              aria-label={`${color} color example`}
            >
              <RadioWithLabel
                value={color}
                color={color}
                label={color === "default" ? "Primary" : color}
              />
            </RadioGroup>
          ),
        )}
      </div>
      <div className="space-y-2 sm:col-span-2">
        <p className="text-sm font-medium">Horizontal choices wrap</p>
        <RadioGroup
          defaultValue="email"
          orientation="horizontal"
          aria-label="Preferred notification channel"
        >
          <RadioWithLabel value="email" label="Email" />
          <RadioWithLabel value="inbox" label="Workspace inbox" />
          <RadioWithLabel value="desktop" label="Desktop notifications" />
        </RadioGroup>
      </div>
    </div>
  );
}

const variantsCode =
  'import { RadioGroup, RadioWithLabel } from "@/components/ui/radio-group";\n\nexport function VariantsDemo() {\n  return (\n    <div className="grid gap-6 sm:grid-cols-2">\n      <div className="space-y-2">\n        <p className="text-sm font-medium">Sizes</p>\n        {(["sm", "default", "lg"] as const).map((size) => (\n          <RadioGroup\n            key={size}\n            defaultValue={size}\n            aria-label={`${size} radio`}\n          >\n            <RadioWithLabel\n              value={size}\n              size={size}\n              label={\n                size === "default"\n                  ? "Default"\n                  : size === "sm"\n                    ? "Small"\n                    : "Large"\n              }\n            />\n          </RadioGroup>\n        ))}\n      </div>\n      <div className="space-y-2">\n        <p className="text-sm font-medium">Semantic colors</p>\n        {(["default", "success", "warning", "destructive"] as const).map(\n          (color) => (\n            <RadioGroup\n              key={color}\n              defaultValue={color}\n              aria-label={`${color} color example`}\n            >\n              <RadioWithLabel\n                value={color}\n                color={color}\n                label={color === "default" ? "Primary" : color}\n              />\n            </RadioGroup>\n          ),\n        )}\n      </div>\n      <div className="space-y-2 sm:col-span-2">\n        <p className="text-sm font-medium">Horizontal choices wrap</p>\n        <RadioGroup\n          defaultValue="email"\n          orientation="horizontal"\n          aria-label="Preferred notification channel"\n        >\n          <RadioWithLabel value="email" label="Email" />\n          <RadioWithLabel value="inbox" label="Workspace inbox" />\n          <RadioWithLabel value="desktop" label="Desktop notifications" />\n        </RadioGroup>\n      </div>\n    </div>\n  );\n}';

function CardsDemo() {
  return (
    <RadioGroup
      defaultValue="pdf"
      aria-label="Report format"
      className="max-w-lg"
    >
      <RadioCard
        value="pdf"
        label="PDF report"
        description="Share a readable snapshot with your team."
        metadata="Recommended for review"
        icon={<IconFileText />}
      />
      <RadioCard
        value="csv"
        label="CSV spreadsheet"
        description="Work with the data in a spreadsheet."
        metadata="All rows included"
        icon={<IconTable />}
      />
      <RadioCard
        value="json"
        label="JSON data"
        description="Keep the structured values for another tool."
        icon={<IconCode />}
      />
    </RadioGroup>
  );
}

const cardsCode =
  'import { IconCode, IconFileText, IconTable } from "@tabler/icons-react";\nimport { RadioGroup, RadioCard } from "@/components/ui/radio-group";\n\nexport function CardsDemo() {\n  return (\n    <RadioGroup\n      defaultValue="pdf"\n      aria-label="Report format"\n      className="max-w-lg"\n    >\n      <RadioCard\n        value="pdf"\n        label="PDF report"\n        description="Share a readable snapshot with your team."\n        metadata="Recommended for review"\n        icon={<IconFileText />}\n      />\n      <RadioCard\n        value="csv"\n        label="CSV spreadsheet"\n        description="Work with the data in a spreadsheet."\n        metadata="All rows included"\n        icon={<IconTable />}\n      />\n      <RadioCard\n        value="json"\n        label="JSON data"\n        description="Keep the structured values for another tool."\n        icon={<IconCode />}\n      />\n    </RadioGroup>\n  );\n}';

function SegmentedDemo() {
  const [frequency, setFrequency] = React.useState("weekly");

  return (
    <div className="space-y-5">
      <p className="text-sm font-medium">Send a summary</p>
      <RadioButtonGroup
        name="frequency"
        value={frequency}
        onValueChange={setFrequency}
        aria-label="Summary frequency"
        size="lg"
      >
        <RadioButton value="daily">Daily</RadioButton>
        <RadioButton value="weekly">Weekly</RadioButton>
        <RadioButton value="monthly">Monthly</RadioButton>
      </RadioButtonGroup>
      <p className="text-sm text-muted-foreground">
        Current preference: {frequency}.
      </p>
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Small group; item sizes are inherited
        </p>
        <RadioButtonGroup
          defaultValue="concise"
          aria-label="Summary length"
          size="sm"
        >
          <RadioButton value="concise">Concise</RadioButton>
          <RadioButton value="detailed">Detailed</RadioButton>
        </RadioButtonGroup>
      </div>
      <KiraRadioGroup
        label="Review workflow"
        description="Details stay below the choices as you switch modes."
        layout="segmented"
        defaultValue="draft"
        options={segmentedDemoKiraRadioGroupOptions}
      />
    </div>
  );
}

const segmentedCode =
  'import * as React from "react";\nimport { KiraRadioGroup, RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";\n\nexport function SegmentedDemo() {\n  const [frequency, setFrequency] = React.useState("weekly");\n\n  return (\n    <div className="space-y-5">\n      <p className="text-sm font-medium">Send a summary</p>\n      <RadioButtonGroup\n        name="frequency"\n        value={frequency}\n        onValueChange={setFrequency}\n        aria-label="Summary frequency"\n        size="lg"\n      >\n        <RadioButton value="daily">Daily</RadioButton>\n        <RadioButton value="weekly">Weekly</RadioButton>\n        <RadioButton value="monthly">Monthly</RadioButton>\n      </RadioButtonGroup>\n      <p className="text-sm text-muted-foreground">\n        Current preference: {frequency}.\n      </p>\n      <div className="space-y-2">\n        <p className="text-sm font-medium">\n          Small group; item sizes are inherited\n        </p>\n        <RadioButtonGroup\n          defaultValue="concise"\n          aria-label="Summary length"\n          size="sm"\n        >\n          <RadioButton value="concise">Concise</RadioButton>\n          <RadioButton value="detailed">Detailed</RadioButton>\n        </RadioButtonGroup>\n      </div>\n      <KiraRadioGroup\n        label="Review workflow"\n        description="Details stay below the choices as you switch modes."\n        layout="segmented"\n        defaultValue="draft"\n        options={[\n          {\n            value: "suggest",\n            label: "Suggest",\n            description: "Prepare an outline before making changes.",\n            metadata: "Local notes",\n          },\n          {\n            value: "draft",\n            label: "Draft",\n            description: "Prepare a draft for your feedback.",\n            metadata: "Manual review",\n          },\n          {\n            value: "background",\n            label: "Background",\n            disabledReason:\n              "Background jobs are unavailable in this local preview.",\n          },\n        ]}\n      />\n    </div>\n  );\n}';

function MotionDemo() {
  const [mode, setMode] = React.useState("review");

  return (
    <div className="max-w-lg space-y-6">
      {(["list", "cards", "segmented"] as const).map((layout) => {
        const resolveLabel2 = () => {
          if (layout === "list") {
            return "Labeled choices" as const;
          }

          if (layout === "cards") {
            return "Choice cards" as const;
          }

          return "Segments" as const;
        };

        return (
          <KiraRadioGroup
            key={layout}
            label={resolveLabel2()}
            layout={layout}
            value={mode}
            onValueChange={setMode}
            options={[
              {
                value: "notes",
                label:
                  layout === "segmented" ? "Suggest" : "Suggest an approach",
                description: "Prepare notes before drafting.",
              },
              {
                value: "review",
                label: layout === "segmented" ? "Draft" : "Draft for review",
                description: "Prepare a draft for your feedback.",
              },
            ]}
          />
        );
      })}
      <p className="text-sm leading-6 text-muted-foreground">
        All three layouts share the selected value. Dots and checkmarks settle
        over 150ms; the segmented highlight moves over 200ms. Choices remain
        immediately usable during the transition. Your reduced-motion preference
        removes the motion.
      </p>
    </div>
  );
}

const motionCode =
  'import * as React from "react";\nimport { KiraRadioGroup } from "@/components/ui/radio-group";\n\nexport function MotionDemo() {\n  const [mode, setMode] = React.useState("review");\n\n  return (\n    <div className="max-w-lg space-y-6">\n      {(["list", "cards", "segmented"] as const).map((layout) => (\n        <KiraRadioGroup\n          key={layout}\n          label={\n            layout === "list"\n              ? "Labeled choices"\n              : layout === "cards"\n                ? "Choice cards"\n                : "Segments"\n          }\n          layout={layout}\n          value={mode}\n          onValueChange={setMode}\n          options={[\n            {\n              value: "notes",\n              label: layout === "segmented" ? "Suggest" : "Suggest an approach",\n              description: "Prepare notes before drafting.",\n            },\n            {\n              value: "review",\n              label: layout === "segmented" ? "Draft" : "Draft for review",\n              description: "Prepare a draft for your feedback.",\n            },\n          ]}\n        />\n      ))}\n      <p className="text-sm leading-6 text-muted-foreground">\n        All three layouts share the selected value. Dots and checkmarks settle\n        over 150ms; the segmented highlight moves over 200ms. Choices remain\n        immediately usable during the transition. Your reduced-motion preference\n        removes the motion.\n      </p>\n    </div>\n  );\n}';

function KiraDemo() {
  const [workflow, setWorkflow] = React.useState("review");
  const id = React.useId();

  return (
    <div className="max-w-lg space-y-5">
      <KiraRadioGroup
        name="workflow"
        label="Prepare a draft"
        description="Choose how you want to review the next draft."
        layout="cards"
        value={workflow}
        onValueChange={setWorkflow}
        options={[
          {
            value: "notes",
            label: "Suggest an approach",
            description: "Prepare notes before drafting.",
            metadata: "No draft changes",
            details: <p>You receive an outline to review first.</p>,
          },
          {
            value: "review",
            label: "Draft for review",
            description: "Prepare a draft and wait for your feedback.",
            metadata: "Recommended",
            details: (
              <label htmlFor={id} className="flex min-h-11 items-center gap-3">
                <input
                  id={id}
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-primary"
                />
                Include a review checklist
              </label>
            ),
          },
          {
            value: "background",
            label: "Queue a background draft",
            description: "Continue preparing while you work on other tasks.",
            disabled: true,
            disabledReason:
              "Background jobs are not enabled in this workspace.",
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        Local preference preview. This demo does not create drafts or background
        jobs.
      </p>
    </div>
  );
}

const kiraCode =
  'import * as React from "react";\nimport { KiraRadioGroup } from "@/components/ui/radio-group";\n\nexport function KiraDemo() {\n  const [workflow, setWorkflow] = React.useState("review");\n  const id = React.useId();\n\n  return (\n    <div className="max-w-lg space-y-5">\n      <KiraRadioGroup\n        name="workflow"\n        label="Prepare a draft"\n        description="Choose how you want to review the next draft."\n        layout="cards"\n        value={workflow}\n        onValueChange={setWorkflow}\n        options={[\n          {\n            value: "notes",\n            label: "Suggest an approach",\n            description: "Prepare notes before drafting.",\n            metadata: "No draft changes",\n            details: <p>You receive an outline to review first.</p>,\n          },\n          {\n            value: "review",\n            label: "Draft for review",\n            description: "Prepare a draft and wait for your feedback.",\n            metadata: "Recommended",\n            details: (\n              <label htmlFor={id} className="flex min-h-11 items-center gap-3">\n                <input\n                  id={id}\n                  type="checkbox"\n                  defaultChecked\n                  className="size-4 accent-primary"\n                />\n                Include a review checklist\n              </label>\n            ),\n          },\n          {\n            value: "background",\n            label: "Queue a background draft",\n            description: "Continue preparing while you work on other tasks.",\n            disabled: true,\n            disabledReason:\n              "Background jobs are not enabled in this workspace.",\n          },\n        ]}\n      />\n      <p className="text-sm text-muted-foreground">\n        Local preference preview. This demo does not create drafts or background\n        jobs.\n      </p>\n    </div>\n  );\n}';

function FormDemo() {
  const [saved, setSaved] = React.useState("");
  const [formSession, setFormSession] = React.useState(0);

  return (
    <FormPrimitive<{ schedule: string }>
      className="max-w-md space-y-5"
      onFormSubmit={(values) => setSaved(values.schedule)}
      onReset={() => {
        setSaved("");
        setFormSession((session) => session + 1);
      }}
    >
      <KiraRadioGroup
        key={formSession}
        name="schedule"
        label="Review reminder"
        description="Choose one schedule before saving."
        required
        defaultValue=""
        fieldProps={{
          validate: (value) =>
            value ? null : "Choose a reminder schedule, then save again.",
          validationMode: "onSubmit",
        }}
        options={[
          {
            value: "daily",
            label: "Every day",
            description: "A daily reminder for open reviews.",
          },
          {
            value: "weekly",
            label: "Every week",
            description: "One weekly summary of open reviews.",
          },
        ]}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Save reminder</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <output className="block text-sm text-muted-foreground">
        {saved
          ? `Reminder saved locally: ${saved}.`
          : "This form saves only this demo's local preference."}
      </output>
    </FormPrimitive>
  );
}

const formCode =
  'import * as React from "react";\nimport { Form as FormPrimitive } from "@base-ui/react/form";\nimport { Button } from "@/components/ui/button";\nimport { KiraRadioGroup } from "@/components/ui/radio-group";\n\nexport function FormDemo() {\n  const [saved, setSaved] = React.useState("");\n  const [formSession, setFormSession] = React.useState(0);\n\n  return (\n    <FormPrimitive<{ schedule: string }>\n      className="max-w-md space-y-5"\n      onFormSubmit={(values) => setSaved(values.schedule)}\n      onReset={() => {\n        setSaved("");\n        setFormSession((session) => session + 1);\n      }}\n    >\n      <KiraRadioGroup\n        key={formSession}\n        name="schedule"\n        label="Review reminder"\n        description="Choose one schedule before saving."\n        required\n        defaultValue=""\n        fieldProps={{\n          validate: (value) =>\n            value ? null : "Choose a reminder schedule, then save again.",\n          validationMode: "onSubmit",\n        }}\n        options={[\n          {\n            value: "daily",\n            label: "Every day",\n            description: "A daily reminder for open reviews.",\n          },\n          {\n            value: "weekly",\n            label: "Every week",\n            description: "One weekly summary of open reviews.",\n          },\n        ]}\n      />\n      <div className="flex flex-wrap gap-3">\n        <Button type="submit">Save reminder</Button>\n        <Button type="reset" variant="outline">\n          Reset\n        </Button>\n      </div>\n      <p role="status" className="text-sm text-muted-foreground">\n        {saved\n          ? `Reminder saved locally: ${saved}.`\n          : "This form saves only this demo\'s local preference."}\n      </p>\n    </FormPrimitive>\n  );\n}';

function StatesDemo() {
  const resolveDescription3 = () => {
    if (state === "read-only") {
      return "Your workspace administrator has fixed this preference." as const;
    }

    if (state === "disabled") {
      return "You need access to edit this preference." as const;
    }

    return "Choose where the review request is delivered." as const;
  };

  const [state, setState] = React.useState("ready");

  return (
    <div className="max-w-lg space-y-6">
      <RadioButtonGroup
        value={state}
        onValueChange={setState}
        aria-label="Example state"
        size="sm"
      >
        {["ready", "disabled", "read-only", "loading", "empty", "invalid"].map(
          (value) => (
            <RadioButton key={value} value={value}>
              {value}
            </RadioButton>
          ),
        )}
      </RadioButtonGroup>
      <KiraRadioGroup
        key={state}
        label="Review destination"
        description={resolveDescription3()}
        layout="cards"
        defaultValue="inbox"
        readOnly={state === "read-only"}
        disabled={state === "disabled"}
        loading={state === "loading"}
        loadingLabel="Loading destinations…"
        error={state === "invalid"}
        errorMessage="The saved destination is unavailable. Choose a different destination."
        options={
          state === "loading" || state === "empty"
            ? []
            : [
                {
                  value: "inbox",
                  label: "Workspace inbox",
                  description: "Keep requests with your team's work.",
                },
                {
                  value: "email",
                  label: "Email",
                  description: "Deliver a request to your account email.",
                },
              ]
        }
        emptyMessage="No review destinations are connected. Add one in workspace settings."
      />
    </div>
  );
}

const statesCode =
  'import * as React from "react";\nimport { KiraRadioGroup, RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";\n\nexport function StatesDemo() {\n  const [state, setState] = React.useState("ready");\n\n  return (\n    <div className="max-w-lg space-y-6">\n      <RadioButtonGroup\n        value={state}\n        onValueChange={setState}\n        aria-label="Example state"\n        size="sm"\n      >\n        {["ready", "disabled", "read-only", "loading", "empty", "invalid"].map(\n          (value) => (\n            <RadioButton key={value} value={value}>\n              {value}\n            </RadioButton>\n          ),\n        )}\n      </RadioButtonGroup>\n      <KiraRadioGroup\n        key={state}\n        label="Review destination"\n        description={\n          state === "read-only"\n            ? "Your workspace administrator has fixed this preference."\n            : state === "disabled"\n              ? "You need access to edit this preference."\n              : "Choose where the review request is delivered."\n        }\n        layout="cards"\n        defaultValue="inbox"\n        readOnly={state === "read-only"}\n        disabled={state === "disabled"}\n        loading={state === "loading"}\n        loadingLabel="Loading destinations…"\n        error={state === "invalid"}\n        errorMessage="The saved destination is unavailable. Choose a different destination."\n        options={\n          state === "loading" || state === "empty"\n            ? []\n            : [\n                {\n                  value: "inbox",\n                  label: "Workspace inbox",\n                  description: "Keep requests with your team\'s work.",\n                },\n                {\n                  value: "email",\n                  label: "Email",\n                  description: "Deliver a request to your account email.",\n                },\n              ]\n        }\n        emptyMessage="No review destinations are connected. Add one in workspace settings."\n      />\n    </div>\n  );\n}';

function StressDemo() {
  const [data, setData] = React.useState("demo");
  const worst = data === "worst";

  return (
    <div className="max-w-80 space-y-5">
      <RadioButtonGroup
        value={data}
        onValueChange={setData}
        aria-label="Fixture data"
        size="sm"
      >
        <RadioButton value="demo">Demo data</RadioButton>
        <RadioButton value="worst">Worst case</RadioButton>
      </RadioButtonGroup>
      <KiraRadioGroup
        key={data}
        label="Review workspace"
        layout="cards"
        defaultValue="primary"
        options={[
          {
            value: "primary",
            label: worst
              ? "Northwind international customer support and accessibility research workspace"
              : "Northwind support",
            description: worst
              ? "research-and-accessibility-reviews@northwind-international.example.com"
              : "Weekly customer support reviews",
            metadata: worst ? "1,234,567 open records" : "24 open records",
          },
          {
            value: "thai",
            label: worst
              ? "พื้นที่ทำงานสำหรับการตรวจสอบเอกสารและการเข้าถึงของทีมวิจัย"
              : "Research",
            description: worst
              ? "ตรวจสอบรายละเอียดก่อนส่งคำขอและเลือกพื้นที่ทำงานที่เหมาะสม"
              : undefined,
          },
          { value: "short", label: worst ? "Å" : "Personal" },
        ]}
      />
    </div>
  );
}

const stressCode =
  'import * as React from "react";\nimport { KiraRadioGroup, RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";\n\nexport function StressDemo() {\n  const [data, setData] = React.useState("demo");\n  const worst = data === "worst";\n\n  return (\n    <div className="max-w-80 space-y-5">\n      <RadioButtonGroup\n        value={data}\n        onValueChange={setData}\n        aria-label="Fixture data"\n        size="sm"\n      >\n        <RadioButton value="demo">Demo data</RadioButton>\n        <RadioButton value="worst">Worst case</RadioButton>\n      </RadioButtonGroup>\n      <KiraRadioGroup\n        key={data}\n        label="Review workspace"\n        layout="cards"\n        defaultValue="primary"\n        options={[\n          {\n            value: "primary",\n            label: worst\n              ? "Northwind international customer support and accessibility research workspace"\n              : "Northwind support",\n            description: worst\n              ? "research-and-accessibility-reviews@northwind-international.example.com"\n              : "Weekly customer support reviews",\n            metadata: worst ? "1,234,567 open records" : "24 open records",\n          },\n          {\n            value: "thai",\n            label: worst\n              ? "พื้นที่ทำงานสำหรับการตรวจสอบเอกสารและการเข้าถึงของทีมวิจัย"\n              : "Research",\n            description: worst\n              ? "ตรวจสอบรายละเอียดก่อนส่งคำขอและเลือกพื้นที่ทำงานที่เหมาะสม"\n              : undefined,\n          },\n          { value: "short", label: worst ? "Å" : "Personal" },\n        ]}\n      />\n    </div>\n  );\n}';

function MigrationDemo() {
  return (
    <div className="max-w-md space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">
        RadioCard and RadioButton now render native buttons with radio
        semantics. Keep interactive details beside the radio. Use data-disabled
        for primitive state styling.
      </p>
      <RadioGroup aria-label="Migration example" defaultValue="review">
        <RadioCard
          value="review"
          label="Review draft"
          description="The indicator follows native checked state without a bounce."
        />
      </RadioGroup>
    </div>
  );
}

const migrationCode =
  'import { RadioGroup, RadioCard } from "@/components/ui/radio-group";\n\nexport function MigrationDemo() {\n  return (\n    <div className="max-w-md space-y-4">\n      <p className="text-sm leading-6 text-muted-foreground">\n        RadioCard and RadioButton now render native buttons with radio\n        semantics. Keep interactive details beside the radio. Use data-disabled\n        for primitive state styling.\n      </p>\n      <RadioGroup aria-label="Migration example" defaultValue="review">\n        <RadioCard\n          value="review"\n          label="Review draft"\n          description="The indicator follows native checked state without a bounce."\n        />\n      </RadioGroup>\n    </div>\n  );\n}';

const apiSections: React.ComponentProps<typeof APIReference>["sections"] = [
  {
    title: "RadioGroup",
    props: [
      {
        prop: "value / defaultValue",
        type: "Value",
        description:
          "Controlled value or initial uncontrolled value; string by default, generic values supported.",
      },
      {
        prop: "onValueChange",
        type: "(value: Value, details: RadioGroupPrimitive.ChangeEventDetails) => void",
        description: "Native callback; cancellation is respected by Base UI.",
      },
      {
        prop: "orientation",
        type: '"vertical" | "horizontal"',
        default: '"vertical"',
        description:
          "Grid or wrapping horizontal layout. Both arrow axes are inherited from Base UI.",
      },
      {
        prop: "name / form / inputRef",
        type: "string / string / React.Ref<HTMLInputElement>",
        description:
          "Native form association and representative hidden-input ref.",
      },
      {
        prop: "required / disabled / readOnly",
        type: "boolean",
        default: "false",
        description:
          "Native requirement, disability, and fixed-value behavior.",
      },
      {
        prop: "error / errorMessage",
        type: "boolean / React.ReactNode",
        description: "External invalid state and an associated visible error.",
      },
      {
        prop: "aria-describedby / aria-invalid",
        type: "React.AriaAttributes",
        description:
          "Caller associations are preserved alongside generated errors.",
      },
      {
        prop: "className / style / render / ref",
        type: "RadioGroupPrimitive.Props<Value>",
        description:
          "Native Base UI root props, including state functions and polymorphism.",
      },
    ],
  },
  {
    title: "RadioGroupItem",
    props: [
      { prop: "value", type: "Value", description: "Unique option value." },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description:
          "16, 20, or 24px visual control with an expanded hit area.",
      },
      {
        prop: "color",
        type: '"default" | "destructive" | "success" | "warning"',
        default: '"default"',
        description: "Semantic checked-state color.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        description:
          "Optional custom indicator; native indicator is used by default.",
      },
      {
        prop: "disabled / readOnly / required / inputRef",
        type: "RadioPrimitive.Root.Props<Value>",
        description: "Native radio state and hidden-input access.",
      },
      {
        prop: "className / style / render / ref",
        type: "RadioPrimitive.Root.Props<Value>",
        description:
          "Native root props; state className functions are retained.",
      },
    ],
  },
  {
    title: "RadioWithLabel",
    props: [
      {
        prop: "label / description",
        type: "React.ReactNode",
        description:
          "Visible name and associated description, composed with Field.Item.",
      },
      {
        prop: "disabledReason",
        type: "React.ReactNode",
        description: "A visible explanation of unavailability.",
      },
      {
        prop: "className / itemClassName",
        type: "string / RadioPrimitive.Root.Props<Value>['className']",
        description: "Wrapper styling and separate radio styling.",
      },
      {
        prop: "native radio props",
        type: "RadioGroupItemProps<Value>",
        description:
          "Value, size, color, id, ref, inputRef and native state are forwarded.",
      },
    ],
  },
  {
    title: "RadioCard",
    props: [
      {
        prop: "label / description / icon / metadata",
        type: "React.ReactNode",
        description:
          "Card name, description, decorative icon and comparison metadata.",
      },
      {
        prop: "disabledReason",
        type: "React.ReactNode",
        description: "Visible and ARIA-associated unavailability explanation.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        description:
          "Additional noninteractive content inside the native radio button.",
      },
      {
        prop: "render / nativeButton",
        type: "RadioPrimitive.Root.Props<Value>",
        default: "<button type='button' /> / true",
        description:
          "Native button by default. Set nativeButton appropriately when customizing render.",
      },
      {
        prop: "native radio props",
        type: "RadioPrimitive.Root.Props<Value>",
        description:
          "Generic value, disabled/readOnly/required, ARIA, refs, style and className.",
      },
    ],
  },
  {
    title: "RadioButtonGroup",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description:
          "Inherited by child RadioButton controls unless individually overridden.",
      },
      {
        prop: "native group props",
        type: "Omit<RadioGroupProps<Value>, 'orientation'>",
        description:
          "Single form value, native state, validation and refs; segments wrap horizontally.",
      },
    ],
  },
  {
    title: "RadioButton",
    props: [
      {
        prop: "value / children",
        type: "Value / React.ReactNode",
        description: "Unique option and its visible content.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: "Inherited",
        description:
          "Minimum heights of 32, 36, or 44px; labels remain readable.",
      },
      {
        prop: "render / nativeButton",
        type: "RadioPrimitive.Root.Props<Value>",
        default: "<button type='button' /> / true",
        description: "Native button with Base UI radio semantics.",
      },
      {
        prop: "native radio props",
        type: "RadioPrimitive.Root.Props<Value>",
        description:
          "State, generic value, ARIA associations, className, style and refs.",
      },
    ],
  },
  {
    title: "KiraRadioGroup",
    props: [
      {
        prop: "label / description",
        type: "React.ReactNode",
        description:
          "Visible Field label and automatically associated helper text.",
      },
      {
        prop: "options",
        type: "readonly KiraRadioOption<Value>[]",
        description:
          "Value, label, description, icon, metadata, disabled, disabledReason and details. Value is string or number.",
      },
      {
        prop: "layout",
        type: '"list" | "cards" | "segmented"',
        default: '"list"',
        description: "Composes the same primitive controls in three layouts.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description:
          "Radio and segment size; cards retain shared card spacing.",
      },
      {
        prop: "loading / loadingLabel / emptyMessage",
        type: "boolean / React.ReactNode / React.ReactNode",
        description:
          "Read-only loading, reserved skeletons when options are empty, and an actionable empty state.",
      },
      {
        prop: "fieldProps",
        type: "Omit<FieldPrimitive.Root.Props, 'children' | 'name' | 'disabled' | 'invalid' | 'className'>",
        description:
          "Native validationMode, validate, touched, dirty, actionsRef and render props.",
      },
      {
        prop: "native group props",
        type: "Omit<RadioGroupProps<Value>, 'children'>",
        description:
          "Value/defaultValue/onValueChange, name/form, error, state, ARIA, refs and styling.",
      },
    ],
  },
  {
    title: "Variant exports",
    props: [
      {
        prop: "radioGroupVariants",
        type: "cva",
        description: "Vertical or horizontal layout.",
      },
      {
        prop: "radioItemVariants",
        type: "cva",
        description: "size and semantic color.",
      },
      {
        prop: "radioCardVariants",
        type: "cva",
        description: "Shared card state styling.",
      },
      {
        prop: "radioButtonGroupVariants / radioButtonVariants",
        type: "cva",
        description: "Segment group and button sizes.",
      },
    ],
  },
];

export default function RadioGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Radio Group"
        description="Explained choices, native form behavior, and layouts that fit the task."
        version="2.0.0"
      />
      <FeatureGrid features={radioGroupPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={radioGroupPageDemoTabsTabs} />
      <KeyboardShortcuts shortcuts={radioGroupPageKeyboardShortcutsShortcuts} />
      <UsageBlock
        code={
          basicCode +
          "\n\n" +
          labelsCode +
          "\n\n" +
          cardsCode +
          "\n\n" +
          segmentedCode +
          "\n\n" +
          kiraCode +
          "\n\n" +
          formCode
        }
      />
      <APIReference sections={apiSections} />
      <Changelog entries={radioGroupPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const segmentedDemoKiraRadioGroupOptions = [
  {
    value: "suggest",
    label: "Suggest",
    description: "Prepare an outline before making changes.",
    metadata: "Local notes",
  },
  {
    value: "draft",
    label: "Draft",
    description: "Prepare a draft for your feedback.",
    metadata: "Manual review",
  },
  {
    value: "background",
    label: "Background",
    disabledReason: "Background jobs are unavailable in this local preview.",
  },
] satisfies ReactComponentProps<typeof KiraRadioGroup>["options"];

const radioGroupPageFeatureGridFeatures = [
  {
    icon: <IconCircleCheck aria-hidden="true" className="size-4" />,
    title: "Native forms",
    description: "Associated labels, keyboard selection and Field validation.",
  },
  {
    icon: <IconPalette aria-hidden="true" className="size-4" />,
    title: "One value, three layouts",
    description: "Labeled radios, choice cards and wrapping segments.",
  },
  {
    icon: <IconLayoutGrid aria-hidden="true" className="size-4" />,
    title: "Explained choices",
    description:
      "Data-driven options, availability reasons and selected details.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const radioGroupPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Notification schedule"
        description="Native radios with associated labels."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "labels",
    label: "Labels",
    demo: (
      <DemoWrapper
        title="Labels and availability"
        description="Descriptions and visible reasons stay associated with their radio."
        code={labelsCode}
      >
        <LabelsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Sizes, colors and layout"
        description="Semantic colors, three sizes, and wrapping horizontal choices."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "cards",
    label: "Cards",
    demo: (
      <DemoWrapper
        title="Choose a report format"
        description="A full selectable card with a native checked indicator."
        code={cardsCode}
      >
        <CardsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "segmented",
    label: "Segmented",
    demo: (
      <DemoWrapper
        title="Summary preferences"
        description="A single form value with sizes inherited from its group."
        code={segmentedCode}
      >
        <SegmentedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "motion",
    label: "Motion",
    demo: (
      <DemoWrapper
        title="Selection feedback"
        description="Dot, checkmark and segment fades stay synchronized with native state."
        code={motionCode}
      >
        <MotionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="Draft workflow"
        description="Data-driven choices with details outside the radio control."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "form",
    label: "Form",
    demo: (
      <DemoWrapper
        title="Save a reminder"
        description="Submit empty to see native Field validation, then choose and save."
        code={formCode}
      >
        <FormDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="State matrix"
        description="Loading, empty, disabled, read-only, and invalid examples."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress",
    demo: (
      <DemoWrapper
        title="Narrow-container fixtures"
        description="Switch between realistic demo data and long, multilingual values."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "changelog",
    label: "Changelog",
    demo: (
      <DemoWrapper
        title="Migration to 2.0"
        description="Native button roots with responsive selection feedback."
        code={migrationCode}
      >
        <MigrationDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const radioGroupPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Enter or leave the group at the checked or first enabled radio; inherited from Base UI.",
  },
  {
    keys: "↑ ↓ ← →",
    description:
      "Move and select an enabled option, wrapping at the ends; inherited from Base UI. Read-only groups retain their value.",
  },
  {
    keys: "Space",
    description: "Check the focused radio; inherited from Base UI.",
  },
  {
    keys: "Home / End",
    description:
      "Not selection shortcuts for this radio implementation; Base UI 1.9.0 disables them for RadioGroup.",
  },
  {
    keys: "Tab into details",
    description:
      "Selected Kira details are siblings of the radio, so their own controls are reachable.",
  },
  {
    keys: "Save / Reset",
    description:
      "Use the Form demo buttons to exercise native validation, submission and reset.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const radioGroupPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "2026-11-10",
    changes: [
      {
        type: "added",
        title: "KiraRadioGroup and exported radioCardVariants",
        description:
          "Data-driven list/card/segment choices, selected details, visible availability reasons, loading/empty states and native Field validation. Audited against Base UI 1.9.0; feature research cutoff October 31, 2026.",
      },
      {
        type: "fixed",
        title: "Native state, labeling, responsive layout and motion",
        description:
          "Associated labels/descriptions, semantic colors, complete slots, inherited segment sizes and 150ms indicator feedback. Segments use one measured 200ms sliding highlight, keep descriptions outside the rail, and retain visible availability reasons. Reduced motion removes motion; checked state updates immediately.",
      },
      {
        type: "breaking",
        title: "RadioCard and RadioButton now use native button roots",
        description:
          "Refs/render overrides must match the chosen element. Controls and hit areas grew; success/warning colors follow tokens. RadioWithLabel className still styles its wrapper, while itemClassName styles the radio.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
