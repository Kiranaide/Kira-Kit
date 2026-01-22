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
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import {
  IconUser,
  IconMail,
  IconLock,
  IconCheck,
  IconAccessible,
  IconPalette,
  IconListDetails,
  IconArrowRight,
  IconArrowLeft,
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
} from "@/components/docs";

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  const [step, setStep] = React.useState(0);

  const steps = [
    {
      title: "Account",
      description: "Create your account",
      icon: <IconUser className="h-4 w-4" />,
    },
    {
      title: "Profile",
      description: "Set up your profile",
      icon: <IconMail className="h-4 w-4" />,
    },
    {
      title: "Security",
      description: "Configure security",
      icon: <IconLock className="h-4 w-4" />,
    },
    {
      title: "Complete",
      description: "You're all set!",
      icon: <IconCheck className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8">
      <Stepper value={step} onValueChange={setStep}>
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </Stepper>

      <StepperActions>
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >
          {step === steps.length - 1 ? "Complete" : "Next"}
        </Button>
      </StepperActions>
    </div>
  );
}

const basicCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperActions } from "@/components/ui/stepper"
import { useState } from "react"

export function BasicStepperDemo() {
  const [step, setStep] = useState(0)

  const steps = [
    { title: "Account", description: "Create your account" },
    { title: "Profile", description: "Set up your profile" },
    { title: "Security", description: "Configure security" },
  ]

  return (
    <div className="space-y-8">
      <Stepper value={step} onValueChange={setStep}>
        {steps.map((step, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{step.title}</StepperTitle>
              <StepperDescription>{step.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </Stepper>

      <StepperActions>
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Previous
        </Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
          Next
        </Button>
      </StepperActions>
    </div>
  )
}`;

function WithContentPanelsDemo() {
  const [step, setStep] = React.useState(0);

  const steps = [
    { title: "Personal Info", description: "Your basic information" },
    { title: "Contact", description: "How we can reach you" },
    { title: "Preferences", description: "Your custom settings" },
  ];

  return (
    <Stepper value={step} onValueChange={setStep}>
      <div className="flex flex-row items-center w-full">
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {steps.map((s, index) => (
          <StepperPanel key={index} value={index}>
            <div className="border rounded-lg p-6 bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">{s.title} Content</h3>
              <p className="text-muted-foreground">
                This is the content for {s.description}
              </p>
            </div>
          </StepperPanel>
        ))}
      </div>

      <StepperActions>
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
          Next
        </Button>
      </StepperActions>
    </Stepper>
  );
}

const withContentPanelsCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperPanel, StepperActions } from "@/components/ui/stepper"

export function WithContentPanelsDemo() {
  const [step, setStep] = useState(0)

  const steps = [
    { title: "Personal Info", description: "Your basic information" },
    { title: "Contact", description: "How we can reach you" },
    { title: "Preferences", description: "Your custom settings" },
  ]

  return (
    <Stepper value={step} onValueChange={setStep}>
      <div className="flex flex-row items-center w-full">
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {steps.map((s, index) => (
          <StepperPanel key={index} value={index}>
            <div className="border rounded-lg p-6">
              <h3>{s.title} Content</h3>
              <p>Content for {s.description}</p>
            </div>
          </StepperPanel>
        ))}
      </div>

      <StepperActions>
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>Previous</Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>Next</Button>
      </StepperActions>
    </Stepper>
  )
}`;

function WithProgressDemo() {
  const [step, setStep] = React.useState(0);

  const steps = [
    { title: "Step 1", description: "First step" },
    { title: "Step 2", description: "Second step" },
    { title: "Step 3", description: "Third step" },
    { title: "Step 4", description: "Final step" },
  ];

  return (
    <Stepper value={step} onValueChange={setStep}>
      <div className="flex flex-row items-center w-full">
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </div>

      <div className="mt-8">
        <StepperProgress />
      </div>

      <StepperActions>
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
          Next
        </Button>
      </StepperActions>
    </Stepper>
  );
}

const withProgressCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperProgress, StepperActions } from "@/components/ui/stepper"

export function WithProgressDemo() {
  const [step, setStep] = useState(0)

  const steps = [
    { title: "Step 1", description: "First step" },
    { title: "Step 2", description: "Second step" },
    { title: "Step 3", description: "Third step" },
  ]

  return (
    <Stepper value={step} onValueChange={setStep}>
      <div className="flex flex-row items-center w-full">
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </div>

      <div className="mt-8">
        <StepperProgress />
      </div>

      <StepperActions>
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>Previous</Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>Next</Button>
      </StepperActions>
    </Stepper>
  )
}`;

function WithNavigationDemo() {
  const [step, setStep] = React.useState(0);

  const steps = [
    { title: "Upload", description: "Upload files" },
    { title: "Process", description: "Process files" },
    { title: "Review", description: "Review results" },
  ];

  return (
    <Stepper value={step} onValueChange={setStep}>
      <div className="flex flex-row items-center w-full">
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </div>

      <div className="mt-8">
        <StepperNavigation />
      </div>

      <StepperActions>
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
          Next
          <IconArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </StepperActions>
    </Stepper>
  );
}

const withNavigationCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperNavigation, StepperActions } from "@/components/ui/stepper"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

export function WithNavigationDemo() {
  const [step, setStep] = useState(0)

  const steps = [
    { title: "Upload", description: "Upload files" },
    { title: "Process", description: "Process files" },
    { title: "Review", description: "Review results" },
  ]

  return (
    <Stepper value={step} onValueChange={setStep}>
      <div className="flex flex-row items-center w-full">
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </div>

      <div className="mt-8">
        <StepperNavigation />
      </div>

      <StepperActions>
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>
          <IconArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>
          Next
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </StepperActions>
    </Stepper>
  )
}`;

// =============================================================================
// Main Page Component
// =============================================================================

export function StepperPage() {
  const features = [
    {
      title: "Accessible",
      description:
        "Full WAI-ARIA support with keyboard navigation, screen reader announcements, and proper semantic structure.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Customizable",
      description:
        "Flexible step indicators, content panels, progress tracking, and navigation options.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Complete",
      description:
        "Includes progress indicators, content panels, actions, and navigation components out of the box.",
      icon: <IconListDetails className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Stepper"
          description="A simple stepper with step indicators and navigation"
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "panels",
      label: "Content Panels",
      demo: (
        <DemoWrapper
          title="Content Panels"
          description="Stepper with content panels that change based on the current step"
          code={withContentPanelsCode}
        >
          <WithContentPanelsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "progress",
      label: "With Progress",
      demo: (
        <DemoWrapper
          title="Progress Indicator"
          description="Stepper with a visual progress bar showing completion percentage"
          code={withProgressCode}
        >
          <WithProgressDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "navigation",
      label: "With Navigation",
      demo: (
        <DemoWrapper
          title="Navigation Dots"
          description="Stepper with dot navigation for quick step jumping"
          code={withNavigationCode}
        >
          <WithNavigationDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Tab", description: "Move focus through stepper items" },
    { keys: "Space / Enter", description: "Activate focused step" },
    { keys: "Arrow Right / Down", description: "Move to next step" },
    { keys: "Arrow Left / Up", description: "Move to previous step" },
  ];

  const usageCode = `import { Stepper, StepperItem, StepperIndicator, StepperContent, StepperTitle, StepperDescription, StepperSeparator, StepperPanel, StepperActions, StepperProgress, StepperNavigation } from "@/components/ui/stepper"

// Basic stepper
<Stepper value={step} onValueChange={setStep}>
  {steps.map((s, index) => (
    <StepperItem key={index} value={index}>
      <StepperIndicator />
      <StepperContent>
        <StepperTitle>{s.title}</StepperTitle>
        <StepperDescription>{s.description}</StepperDescription>
      </StepperContent>
      <StepperSeparator />
    </StepperItem>
  ))}
</Stepper>

// With content panels
{steps.map((s, index) => (
  <StepperPanel key={index} value={index}>
    <div>Content for {s.title}</div>
  </StepperPanel>
))}

// With progress bar
<StepperProgress />

// With navigation dots
<StepperNavigation />

// With action buttons
<StepperActions>
  <Button onClick={() => setStep(step - 1)}>Previous</Button>
  <Button onClick={() => setStep(step + 1)}>Next</Button>
</StepperActions>`;

  const apiReference = [
    {
      title: "Stepper",
      props: [
        {
          prop: "value",
          type: "number",
          default: "-",
          description: "Current active step index",
        },
        {
          prop: "onValueChange",
          type: "(value: number) => void",
          default: "-",
          description: "Callback when step changes",
        },
        {
          prop: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Layout orientation",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "StepperItem components",
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
          description: "Step index",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Step content",
        },
      ],
    },
    {
      title: "StepperIndicator",
      props: [
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Custom indicator content (optional)",
        },
      ],
    },
    {
      title: "StepperContent",
      props: [
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Step title and description",
        },
      ],
    },
    {
      title: "StepperTitle",
      props: [
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Step title text",
        },
      ],
    },
    {
      title: "StepperDescription",
      props: [
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Step description text",
        },
      ],
    },
    {
      title: "StepperSeparator",
      props: [
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Custom separator content (optional)",
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
          description: "Step index this panel belongs to",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Panel content",
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
          description: "Action buttons",
        },
      ],
    },
    {
      title: "StepperProgress",
      props: [
        {
          prop: "showLabel",
          type: "boolean",
          default: "true",
          description: "Show progress percentage label",
        },
      ],
    },
    {
      title: "StepperNavigation",
      props: [
        {
          prop: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Navigation orientation",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Stepper"
        description="A multi-step wizard component with indicators, content panels, progress tracking, and navigation controls."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  );
}
