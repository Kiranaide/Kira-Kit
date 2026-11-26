import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperPanel,
  StepperActions,
  StepperProgress,
  StepperNavigation,
  KiraStepper,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconUser,
  IconMail,
  IconLock,
  IconAccessible,
  IconListDetails,
  IconDeviceMobile,
  IconLayersIntersect,
} from "@tabler/icons-react";
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

const accountSteps = [
  { title: "Account", description: "Create your account" },
  { title: "Profile", description: "Set up your profile" },
  { title: "Security", description: "Configure security" },
  { title: "Complete", description: "You're all set!" },
];

function BasicDemo() {
  const [step, setStep] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const current = accountSteps.find((_, index) => index === step);

  return (
    <Stepper
      value={step}
      onValueChange={setStep}
      completedSteps={finished ? [0, 1, 2, 3] : []}
    >
      {accountSteps.map((item, index) => (
        <StepperItem key={item.title} value={index} title={item.title}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>{item.title}</StepperTitle>
            <StepperDescription>{item.description}</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}
      <section
        className="rounded-lg border border-border bg-muted/20 p-6"
        aria-live="polite"
      >
        <p className="mb-2 text-xs text-muted-foreground">
          {finished ? "Setup complete" : "Step " + (step + 1) + " of 4"}
        </p>
        <h2 className="text-base font-semibold">
          {finished ? "Your account is ready" : current?.title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {finished
            ? "All four steps are complete. You can revisit a step or start again."
            : current?.description}
        </p>
      </section>
      {finished ? (
        <StepperActions>
          <Button
            variant="outline"
            onClick={() => {
              setStep(0);
              setFinished(false);
            }}
          >
            Start again
          </Button>
        </StepperActions>
      ) : (
        <StepperNavigation onFinish={() => setFinished(true)} />
      )}
    </Stepper>
  );
}

const basicCode =
  'import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperNavigation } from "@/components/ui/stepper"\nimport { useState } from "react"\n\nexport function BasicStepperDemo() {\n  const [step, setStep] = useState(0)\n  const [finished, setFinished] = useState(false)\n  const steps = ["Account", "Profile", "Security", "Complete"]\n\n  return (\n    <Stepper value={step} onValueChange={setStep} completedSteps={finished ? [0, 1, 2, 3] : []}>\n      {steps.map((title, index) => (\n        <StepperItem key={title} value={index} title={title}>\n          <StepperIndicator />\n          <StepperContent><StepperTitle>{title}</StepperTitle></StepperContent>\n          <StepperSeparator />\n        </StepperItem>\n      ))}\n      <p aria-live="polite">{finished ? "Your account is ready" : steps[step]}</p>\n      <StepperNavigation onFinish={() => setFinished(true)} nextDisabled={finished} finishLabel={finished ? "Complete" : "Finish"} />\n    </Stepper>\n  )\n}';

function KiraDemo() {
  const [step, setStep] = React.useState(0);

  return (
    <KiraStepper
      steps={kiraDemoKiraStepperSteps}
      value={step}
      onValueChange={setStep}
    >
      <StepperProgress />
      <StepperNavigation />
    </KiraStepper>
  );
}

const kiraCode = `import { KiraStepper, StepperProgress, StepperNavigation } from "@/components/ui/stepper"
import { IconUser, IconMail, IconLock } from "@tabler/icons-react"
import { useState } from "react"

export function KiraStepperDemo() {
  const [step, setStep] = useState(0)

  return (
    // StepperProgress/StepperNavigation read the Stepper context —
    // KiraStepper accepts children in the same step context.
    <KiraStepper
        steps={[
          { id: "account", title: "Account", description: "Create your account", icon: <IconUser className="h-4 w-4" /> },
          { id: "profile", title: "Profile", description: "Set up your profile", icon: <IconMail className="h-4 w-4" /> },
          { id: "billing", title: "Billing", description: "Payment details", icon: <IconLock className="h-4 w-4" /> },
        ]}
        value={step}
        onValueChange={setStep}>
      <StepperProgress />
      <StepperNavigation />
    </KiraStepper>
  )
}`;

function VerticalDemo() {
  const [step, setStep] = React.useState(1);

  return (
    <Stepper orientation="vertical" value={step} onValueChange={setStep}>
      {accountSteps.map((s, index) => (
        <StepperItem key={s.title} value={index} title={s.title}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>{s.title}</StepperTitle>
            <StepperDescription>{s.description}</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}
    </Stepper>
  );
}

const verticalCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator } from "@/components/ui/stepper"
import { useState } from "react"

export function VerticalStepperDemo() {
  const [step, setStep] = useState(1)

  return (
    <Stepper orientation="vertical" value={step} onValueChange={setStep}>
      {steps.map((s, index) => (
        <StepperItem key={s.title} value={index} title={s.title}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>{s.title}</StepperTitle>
            <StepperDescription>{s.description}</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}
    </Stepper>
  )
}`;

function ValidationDemo() {
  const [step, setStep] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [finished, setFinished] = React.useState(false);

  // Validate on step-exit (not per keystroke): onNext gates the transition.
  const handleNext = () => {
    if (step === 0 && !email.includes("@")) {
      setEmailError("Enter a valid email address to continue");

      return false;
    }

    return true;
  };

  return (
    <Stepper value={step} onValueChange={setStep} linear className="space-y-8">
      {accountSteps.map((s, index) => (
        <StepperItem key={s.title} value={index} title={s.title}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>{s.title}</StepperTitle>
            <StepperDescription>{s.description}</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}

      <StepperPanel value={0}>
        <div className="border rounded-lg p-6 bg-muted/30 max-w-md space-y-3">
          <label htmlFor="step-email" className="text-sm font-medium">
            Work email
          </label>
          <Input
            id="step-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "step-email-error" : undefined}
            placeholder="you@company.com"
          />
          {emailError && (
            <p id="step-email-error" className="text-sm text-destructive">
              {emailError}
            </p>
          )}
        </div>
      </StepperPanel>
      <StepperPanel value={1}>
        <div className="border rounded-lg p-6 bg-muted/30 max-w-md text-sm text-muted-foreground">
          Profile details go here.
        </div>
      </StepperPanel>
      <StepperPanel value={2}>
        <div className="border rounded-lg p-6 bg-muted/30 max-w-md text-sm text-muted-foreground">
          Security settings go here.
        </div>
      </StepperPanel>
      <StepperPanel value={3}>
        <div className="border rounded-lg p-6 bg-muted/30 max-w-md text-sm text-muted-foreground">
          All done — review and finish.
        </div>
      </StepperPanel>

      <StepperNavigation
        onNext={handleNext}
        onFinish={() => setFinished(true)}
        nextDisabled={finished}
        finishLabel={finished ? "Account created" : "Create account"}
      />
    </Stepper>
  );
}

const validationCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperPanel, StepperNavigation } from "@/components/ui/stepper"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function ValidationStepperDemo() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  // Validate on step-exit, not per keystroke.
  const handleNext = async () => {
    if (step === 0 && !email.includes("@")) {
      setEmailError("Enter a valid email address to continue")
      return false
    }
    return true
  }

  return (
    // Panels and navigation read the Stepper context — keep them inside.
    <Stepper value={step} onValueChange={setStep} linear>
      {/* ...items... */}

      <StepperPanel value={0}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailError ? true : undefined}
        />
        {emailError && <p className="text-sm text-destructive">{emailError}</p>}
      </StepperPanel>

      {/* ...more panels... */}

      {/* onNext returns false to block the transition */}
      <StepperNavigation onNext={handleNext} />
    </Stepper>
  )
}`;

function StatesDemo() {
  // Illustrative fixture: step states as a consumer would compute them.
  const [step, setStep] = React.useState(2);

  return (
    <Stepper
      value={step}
      onValueChange={setStep}
      completedSteps={[0, 1]}
      errorSteps={[3]}
      loadingSteps={[4]}
      skippedSteps={[5]}
      skippableSteps={[5]}
      className="space-y-8"
    >
      {[
        { title: "Imported", description: "completed" },
        { title: "Validated", description: "completed" },
        { title: "Processing", description: "active" },
        { title: "Enrichment", description: "error — retry available" },
        { title: "Publishing", description: "loading" },
        { title: "Archive", description: "skipped / optional" },
        { title: "Notify", description: "pending" },
      ].map((s, index) => (
        <StepperItem
          key={s.title}
          value={index}
          title={s.title}
          optional={index === 5}
        >
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>{s.title}</StepperTitle>
            <StepperDescription>{s.description}</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}

      <StepperProgress />

      <StepperNavigation />
    </Stepper>
  );
}

const statesCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperProgress, StepperNavigation } from "@/components/ui/stepper"
import { useState } from "react"

export function StepperStatesDemo() {
  const [step, setStep] = useState(2)

  return (
    <Stepper
      value={step}
      onValueChange={setStep}
      completedSteps={[0, 1]}
      errorSteps={[3]}
      loadingSteps={[4]}
      skippedSteps={[5]}
      skippableSteps={[5]}
    >
      {steps.map((s, index) => (
        <StepperItem key={s.title} value={index} title={s.title} optional={index === 5}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>{s.title}</StepperTitle>
            <StepperDescription>{s.description}</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}

      <StepperProgress />
      <StepperNavigation />
    </Stepper>
  )
}`;

function MobileDemo() {
  const [step, setStep] = React.useState(1);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Resize below the <code className="bg-muted px-1 rounded">sm</code>{" "}
        breakpoint (or open at 375px): the horizontal rail stacks vertically via
        CSS — no JS, no hydration flicker.
      </p>
      <KiraStepper
        mobileStacked
        steps={[
          { id: "cart", title: "Cart", description: "Review your items" },
          {
            id: "shipping",
            title: "Shipping",
            description: "Delivery details",
          },
          { id: "payment", title: "Payment", description: "Payment method" },
          { id: "review", title: "Review", description: "Confirm and pay" },
        ]}
        value={step}
        onValueChange={setStep}
      />
    </div>
  );
}

const mobileCode = `import { KiraStepper } from "@/components/ui/stepper"
import { useState } from "react"

export function MobileStepperDemo() {
  const [step, setStep] = useState(1)

  return (
    <KiraStepper
      mobileStacked
      steps={[
        { id: "cart", title: "Cart", description: "Review your items" },
        { id: "shipping", title: "Shipping", description: "Delivery details" },
        { id: "payment", title: "Payment", description: "Payment method" },
        { id: "review", title: "Review", description: "Confirm and pay" },
      ]}
      value={step}
      onValueChange={setStep}
    />
  )
}`;

const features = [
  {
    title: "Accessible",
    description:
      "Real buttons for clickable steps, roving arrow/Home/End focus, live-region step announcements, and panels labelled by their step.",
    icon: <IconAccessible className="w-4 h-4 text-primary" />,
  },
  {
    title: "Data-driven",
    description:
      "KiraStepper renders a full rail from a steps array — with mobileStacked for narrow viewports.",
    icon: <IconLayersIntersect className="w-4 h-4 text-primary" />,
  },
  {
    title: "States built in",
    description:
      "Completed, active, pending, error, loading, and skipped indicators; linear gating with an onNext validation hook.",
    icon: <IconListDetails className="w-4 h-4 text-primary" />,
  },
  {
    title: "Vertical & mobile",
    description:
      "First-class vertical orientation, and CSS-only stacking below the sm breakpoint.",
    icon: <IconDeviceMobile className="w-4 h-4 text-primary" />,
  },
];

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic stepper"
        description="A four-step setup with aligned markers, clear progress and a working completion state."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="KiraStepper"
        description="Data-driven rail from a steps array, with progress and navigation."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "vertical",
    label: "Vertical",
    demo: (
      <DemoWrapper
        title="Vertical orientation"
        description="Rails stack vertically for narrow layouts and long flows."
        code={verticalCode}
      >
        <VerticalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "validation",
    label: "Validation",
    demo: (
      <DemoWrapper
        title="Step validation"
        description="onNext gates the transition (validate on step-exit). Enter an email without @ and press Next."
        code={validationCode}
      >
        <ValidationDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Step states"
        description="Completed, active, error, loading, skipped, and pending indicators."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "mobile",
    label: "Mobile",
    demo: (
      <DemoWrapper
        title="Mobile stacking"
        description="mobileStacked swaps the horizontal rail to vertical below sm."
        code={mobileCode}
      >
        <MobileDemo />
      </DemoWrapper>
    ),
  },
];

const keyboardShortcuts = [
  {
    keys: "Tab",
    description:
      "Move focus to the stepper; each available step is a real button tab stop",
  },
  {
    keys: "Space / Enter",
    description: "Activate the focused step (native button behaviour)",
  },
  {
    keys: "Arrow Right / Down",
    description:
      "Move focus to the next available step (Left/Right on horizontal rails; Up/Down on vertical rails)",
  },
  {
    keys: "Arrow Left / Up",
    description: "Move focus to the previous available step",
  },
  { keys: "Home", description: "Move focus to the first step" },
  { keys: "End", description: "Move focus to the last step" },
];

const usageCode = `import {
  Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle,
  StepperDescription, StepperSeparator, StepperPanel, StepperActions,
  StepperProgress, StepperNavigation, KiraStepper,
} from "@/components/ui/stepper"

// Composable rail
<Stepper value={step} onValueChange={setStep}>
  {steps.map((s, index) => (
    <StepperItem key={s.title} value={index} title={s.title}>
      <StepperIndicator />
      <StepperContent>
        <StepperTitle>{s.title}</StepperTitle>
        <StepperDescription>{s.description}</StepperDescription>
      </StepperContent>
      <StepperSeparator />
    </StepperItem>
  ))}
</Stepper>

// Data-driven (Pass B)
<KiraStepper
  steps={[
    { id: "account", title: "Account", description: "Create your account" },
    { id: "profile", title: "Profile" },
  ]}
  value={step}
  onValueChange={setStep}
  mobileStacked
/>

// Content panels (labelled by their step)
<StepperPanel value={0}>...</StepperPanel>

// Progress bar (transform-based fill)
<StepperProgress />

// Navigation with a validation gate
<StepperNavigation onNext={async () => valid} />

// Action buttons
<StepperActions>
  <Button onClick={back}>Previous</Button>
  <Button onClick={next}>Next</Button>
</StepperActions>`;

const apiReference = [
  {
    title: "Stepper",
    props: [
      {
        prop: "mobileStacked",
        type: "boolean",
        default: "true",
        description:
          "Stack horizontal steps below sm. Set false to keep a horizontal rail on small screens.",
      },
      {
        prop: "value",
        type: "number",
        default: "-",
        description: "Controlled current step index.",
      },
      {
        prop: "defaultValue",
        type: "number",
        default: "0",
        description: "Initial step for uncontrolled use.",
      },
      {
        prop: "onValueChange",
        type: "(value: number) => void",
        default: "-",
        description: "Called when the current step changes.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout direction of the rail.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Indicator size and rail gap.",
      },
      {
        prop: "linear",
        type: "boolean",
        default: "false",
        description:
          "Restrict forward navigation to the next step once the current one is completed.",
      },
      {
        prop: "editable",
        type: "boolean",
        default: "true",
        description: "Allow navigating back to completed steps.",
      },
      {
        prop: "completedSteps",
        type: "number[]",
        default: "[]",
        description: "Indexes rendered as completed.",
      },
      {
        prop: "errorSteps",
        type: "number[]",
        default: "[]",
        description: "Indexes rendered with the error state.",
      },
      {
        prop: "loadingSteps",
        type: "number[]",
        default: "[]",
        description: "Indexes rendered with the loading spinner.",
      },
      {
        prop: "skippedSteps",
        type: "number[]",
        default: "[]",
        description: "Indexes rendered as skipped (merged with runtime skips).",
      },
      {
        prop: "skippableSteps",
        type: "number[]",
        default: "[]",
        description: "Indexes the Skip action can mark as skipped.",
      },
      {
        prop: "onSkip",
        type: "(step: number) => void",
        default: "-",
        description: "Called when a skippable step is skipped.",
      },
      {
        prop: "onComplete",
        type: "() => void",
        default: "-",
        description:
          "Called when the value moves onto the final completed step.",
      },
      {
        prop: "persistKey",
        type: "string",
        default: "-",
        description:
          "Persist current step + runtime skips to localStorage under this key.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "StepperItem elements.",
      },
    ],
  },
  {
    title: "StepperItem",
    props: [
      {
        prop: "value",
        type: "number",
        default: "-",
        description: "Step index.",
      },
      {
        prop: "title",
        type: "string",
        default: "-",
        description: "Accessible step title used in live-region announcements.",
      },
      {
        prop: "optional",
        type: "boolean",
        default: "false",
        description: "Marks the step optional/skippable.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Prevents interaction and dims the item.",
      },
      {
        prop: "condition",
        type: "boolean",
        default: "-",
        description:
          "Visibility condition; false hides the step from the rail.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description:
          "Indicator/Content/Separator parts. Clickable items wrap indicator + content in a real <button>.",
      },
    ],
  },
  {
    title: "StepperIndicator",
    props: [
      {
        prop: "completedIcon",
        type: "ReactNode",
        default: "<IconCheck />",
        description: "Icon shown for completed steps.",
      },
      {
        prop: "errorIcon",
        type: "ReactNode",
        default: "<IconX />",
        description: "Icon shown for error steps.",
      },
      {
        prop: "loadingIcon",
        type: "ReactNode",
        default: "<IconLoader2 spin />",
        description: "Icon shown for loading steps.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description:
          "Custom content overriding the state icon (e.g. a step icon).",
      },
    ],
  },
  {
    title: "StepperTitle / StepperDescription",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Step title / supporting text.",
      },
    ],
  },
  {
    title: "StepperSeparator",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          "Extra classes. Fill follows the previous step's state (completed = primary tint, other states = border). Hidden on the last item.",
      },
    ],
  },
  {
    title: "StepperPanel",
    props: [
      {
        prop: "value",
        type: "number",
        default: "-",
        description: "Step index this panel belongs to.",
      },
      {
        prop: "forceMount",
        type: "boolean",
        default: "false",
        description: "Keep the panel mounted (hidden) when inactive.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Panel content.",
      },
    ],
  },
  {
    title: "StepperActions",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Action buttons.",
      },
    ],
  },
  {
    title: "StepperProgress",
    props: [
      {
        prop: "steps",
        type: "number",
        default: "-",
        description: "Override the total step count used for the ratio.",
      },
      {
        prop: "labels",
        type: "string[]",
        default: "[]",
        description: "Optional labels rendered under the bar.",
      },
      {
        prop: "showLabels",
        type: "boolean",
        default: "false",
        description: "Render the labels row.",
      },
    ],
  },
  {
    title: "StepperNavigation",
    props: [
      {
        prop: "onNext",
        type: "() => boolean | Promise<boolean>",
        default: "-",
        description:
          "Gate before advancing: return/resolve false to block (validate on step-exit).",
      },
      {
        prop: "onBack",
        type: "() => void",
        default: "-",
        description: "Override the default back behaviour.",
      },
      {
        prop: "onSkip",
        type: "() => void",
        default: "-",
        description: "Override the default skip behaviour.",
      },
      {
        prop: "onFinish",
        type: "() => void",
        default: "-",
        description: "Called by the finish button on the last step.",
      },
      {
        prop: "showBack / showNext / showSkip",
        type: "boolean",
        default: "true",
        description: "Toggle the Back / Next / Skip buttons.",
      },
      {
        prop: "nextDisabled / backDisabled",
        type: "boolean",
        default: "false",
        description: "Disable the respective buttons.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Shows a Next spinner and disables all buttons.",
      },
      {
        prop: "backLabel / nextLabel / skipLabel / finishLabel",
        type: "string",
        default: '"Back" / "Continue" / "Skip for now" / "Finish"',
        description: "Button labels.",
      },
    ],
  },
  {
    title: "KiraStepper",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        description:
          "Panels, progress and navigation sharing the same step context.",
      },
      {
        prop: "steps",
        type: "KiraStepperStep[]",
        default: "-",
        description:
          "Step data: { id, title, description?, optional?, icon? }.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "number / (value: number) => void",
        default: "-",
        description: "Controlled or uncontrolled current step.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout direction of the rail.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Indicator size and rail gap.",
      },
      {
        prop: "linear",
        type: "boolean",
        default: "false",
        description: "Linear navigation gating.",
      },
      {
        prop: "mobileStacked",
        type: "boolean",
        default: "true",
        description:
          "Stack the rail vertically below the sm breakpoint (CSS-only).",
      },
    ],
  },
];

const changelogEntries: React.ComponentProps<typeof Changelog>["entries"] = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "changed",
        title: "Dropped zod dependency",
        description:
          "Replaced the 3-line zod storage schema with a pure TypeScript parseSavedStepperJson guard so Stepper has no runtime zod dependency.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "9 November 2026",
    changes: [
      {
        type: "changed",
        title: "Refined step rail and responsive spacing",
        description:
          "Aligned markers and connectors, quieter state styling, readable wrapping labels, consistent focus rings and click targets.",
      },
      {
        type: "fixed",
        title: "Panels and navigation have their own layout",
        description:
          "Only step items enter the ordered list. KiraStepper accepts children for panels, progress and navigation in a shared context. IDs are unique per instance.",
      },
      {
        type: "fixed",
        title: "Conditional and async navigation",
        description:
          "Back, Continue and Skip follow visible enabled steps. Async validation blocks duplicate requests and reports retryable failures, including on the final step.",
      },
      {
        type: "breaking",
        title: "Panel semantics and navigation copy",
        description:
          "Panels are labelled sections instead of tabpanels because the rail is navigation, not a tablist. Horizontal rails stack below sm by default; set mobileStacked={false} to keep them horizontal. Default action labels are Continue and Skip for now. Explicit labels remain supported.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "10 November 2026",
    changes: [
      {
        type: "breaking",
        title: "use-stepper.ts hook deleted",
        description:
          "The 667-line hook had zero importers and duplicated the Stepper state machine. Delete any local copies; use the Stepper component family.",
      },
      {
        type: "fixed",
        title: "Separators were invisible",
        description:
          "stepperSeparatorVariants mapped every state to bg-transparent. Completed segments now render bg-primary, active bg-primary/40, pending bg-muted.",
      },
      {
        type: "fixed",
        title: "Panel aria-labelledby pointed at nonexistent ids",
        description:
          "Panels referenced stepper-tab-{n}; steps render stepper-step-{n}. Panels are now correctly labelled by their step for screen readers.",
      },
      {
        type: "fixed",
        title: "Clickable steps are real buttons",
        description:
          "The li tabIndex + Enter/Space shim is replaced by a native <button> around indicator + content (focus ring on the button, aria-current stays on the li). Screen readers announce a real control, not an interactive list item.",
      },
      {
        type: "fixed",
        title: "Progress bar animates transform, not layout",
        description:
          "The fill tweens scaleX from the left edge instead of animating width — no layout thrash; the inline transform doubles as the no-JS/reduced-motion static fallback.",
      },
      {
        type: "changed",
        title: "Shared useReducedMotion adopted",
        description:
          "The file-local copy is replaced by @/hooks/use-reduced-motion (useSyncExternalStore; SSR-safe, updates live).",
      },
      {
        type: "added",
        title: "KiraStepper mega-component",
        description:
          "Data-driven rail: steps={[{ id, title, description?, optional?, icon? }]} with value/onValueChange, orientation, size, linear, and mobileStacked (CSS-only vertical stacking below sm).",
      },
      {
        type: "changed",
        title: "Audited against Base UI 1.9.0",
        description:
          "No Base UI stepper primitive exists (checked the 1.9.0 component list and open roadmap issues) — the hand-rolled rail remains, upgraded to the v2 quality bar.",
      },
    ],
  },
];

export default function StepperPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Stepper"
        version="v2.1.0"
        description="A multi-step wizard rail: clickable step buttons, progress tracking, validation gates, error/loading/skipped states, vertical and mobile-stacked layouts."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />

      <Changelog entries={changelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const kiraDemoKiraStepperSteps = [
  {
    id: "account",
    title: "Account",
    description: "Create your account",
    icon: <IconUser className="h-4 w-4" />,
  },
  {
    id: "profile",
    title: "Profile",
    description: "Set up your profile",
    icon: <IconMail className="h-4 w-4" />,
  },
  {
    id: "billing",
    title: "Billing",
    description: "Payment details",
    icon: <IconLock className="h-4 w-4" />,
  },
] satisfies ReactComponentProps<typeof KiraStepper>["steps"];
