import * as React from "react";
import {
  IconLoader,
  IconCircleCheck,
  IconSettings,
} from "@tabler/icons-react";

import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function BasicDemo() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={[
          { label: "Account", value: 0 },
          { label: "Profile", value: 1 },
          { label: "Security", value: 2 },
          { label: "Complete", value: 3 },
        ]}
        currentStep={currentStep}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
          disabled={currentStep === 3}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const basicCode = `import { useState } from "react"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { Button } from "@/components/ui/button"

export function BasicDemo() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={[
          { label: "Account", value: 0 },
          { label: "Profile", value: 1 },
          { label: "Security", value: 2 },
          { label: "Complete", value: 3 },
        ]}
        currentStep={currentStep}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
          disabled={currentStep === 3}
        >
          Next
        </Button>
      </div>
    </div>
  )
}`;

function VariantsDemo() {
  const currentStep = 1;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default Variant</p>
        <ProgressIndicator
          steps={[
            { label: "Step 1", value: 0 },
            { label: "Step 2", value: 1 },
            { label: "Step 3", value: 2 },
          ]}
          currentStep={currentStep}
          variant="default"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Success Variant</p>
        <ProgressIndicator
          steps={[
            { label: "Step 1", value: 0 },
            { label: "Step 2", value: 1 },
            { label: "Step 3", value: 2 },
          ]}
          currentStep={currentStep}
          variant="success"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Warning Variant</p>
        <ProgressIndicator
          steps={[
            { label: "Step 1", value: 0 },
            { label: "Step 2", value: 1 },
            { label: "Step 3", value: 2 },
          ]}
          currentStep={currentStep}
          variant="warning"
        />
      </div>
    </div>
  );
}

const variantsCode = `import { ProgressIndicator } from "@/components/ui/progress-indicator"

export function VariantsDemo() {
  const currentStep = 1

  return (
    <div className="space-y-8">
      <ProgressIndicator
        steps={[
          { label: "Step 1", value: 0 },
          { label: "Step 2", value: 1 },
          { label: "Step 3", value: 2 },
        ]}
        currentStep={currentStep}
        variant="default"
      />
      <ProgressIndicator
        steps={[
          { label: "Step 1", value: 0 },
          { label: "Step 2", value: 1 },
          { label: "Step 3", value: 2 },
        ]}
        currentStep={currentStep}
        variant="success"
      />
      <ProgressIndicator
        steps={[
          { label: "Step 1", value: 0 },
          { label: "Step 2", value: 1 },
          { label: "Step 3", value: 2 },
        ]}
        currentStep={currentStep}
        variant="warning"
      />
    </div>
  )
}`;

function SizesDemo() {
  const currentStep = 1;
  const steps = [
    { label: "Step 1", value: 0 },
    { label: "Step 2", value: 1 },
    { label: "Step 3", value: 2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <ProgressIndicator steps={steps} currentStep={currentStep} size="sm" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <ProgressIndicator steps={steps} currentStep={currentStep} size="default" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <ProgressIndicator steps={steps} currentStep={currentStep} size="lg" />
      </div>
    </div>
  );
}

const sizesCode = `import { ProgressIndicator } from "@/components/ui/progress-indicator"

export function SizesDemo() {
  const currentStep = 1
  const steps = [
    { label: "Step 1", value: 0 },
    { label: "Step 2", value: 1 },
    { label: "Step 3", value: 2 },
  ]

  return (
    <div className="space-y-8">
      <ProgressIndicator steps={steps} currentStep={currentStep} size="sm" />
      <ProgressIndicator steps={steps} currentStep={currentStep} size="default" />
      <ProgressIndicator steps={steps} currentStep={currentStep} size="lg" />
    </div>
  )
}`;

function WithoutLabelDemo() {
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={[
          { label: "", value: 0 },
          { label: "", value: 1 },
          { label: "", value: 2 },
          { label: "", value: 3 },
        ]}
        currentStep={currentStep}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
          disabled={currentStep === 3}
        >
          Next
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Progress indicator without labels. Provide empty strings for step labels to hide them.
      </p>
    </div>
  );
}

const withoutLabelCode = `import { useState } from "react"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { Button } from "@/components/ui/button"

export function WithoutLabelDemo() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={[
          { label: "", value: 0 },
          { label: "", value: 1 },
          { label: "", value: 2 },
          { label: "", value: 3 },
        ]}
        currentStep={currentStep}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
          disabled={currentStep === 3}
        >
          Next
        </Button>
      </div>
    </div>
  )
}`;

function CustomDemo() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">With Custom Icons</p>
        <ProgressIndicator
          steps={[
            { label: "Upload", value: 0, icon: <IconLoader className="h-4 w-4" /> },
            { label: "Process", value: 1, icon: <IconSettings className="h-4 w-4" /> },
            { label: "Complete", value: 2, icon: <IconCircleCheck className="h-4 w-4" /> },
          ]}
          currentStep={currentStep}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">With Descriptions</p>
        <ProgressIndicator
          steps={[
            {
              label: "Account Setup",
              value: 0,
              description: "Create your account"
            },
            {
              label: "Profile",
              value: 1,
              description: "Add your information"
            },
            {
              label: "Preferences",
              value: 2,
              description: "Configure settings"
            },
          ]}
          currentStep={currentStep}
          showDescription
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Animated with Custom Width</p>
        <div className="max-w-md">
          <ProgressIndicator
            steps={[
              { label: "Start", value: 0 },
              { label: "Middle", value: 1 },
              { label: "End", value: 2 },
            ]}
            currentStep={currentStep}
            animated
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(2, prev + 1))}
          disabled={currentStep === 2}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const customCode = `import { useState } from "react"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { IconLoader, IconSettings, IconCircleCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function CustomDemo() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="space-y-8">
      <ProgressIndicator
        steps={[
          { label: "Upload", value: 0, icon: <IconLoader className="h-4 w-4" /> },
          { label: "Process", value: 1, icon: <IconSettings className="h-4 w-4" /> },
          { label: "Complete", value: 2, icon: <IconCircleCheck className="h-4 w-4" /> },
        ]}
        currentStep={currentStep}
      />

      <ProgressIndicator
        steps={[
          {
            label: "Account Setup",
            value: 0,
            description: "Create your account"
          },
          {
            label: "Profile",
            value: 1,
            description: "Add your information"
          },
        ]}
        currentStep={currentStep}
        showDescription
      />

      <div className="max-w-md">
        <ProgressIndicator
          steps={[
            { label: "Start", value: 0 },
            { label: "Middle", value: 1 },
            { label: "End", value: 2 },
          ]}
          currentStep={currentStep}
          animated
        />
      </div>
    </div>
  )
}`;

const usageCode = `import { ProgressIndicator } from "@/components/ui/progress-indicator"

// Basic usage
<ProgressIndicator
  steps={[
    { label: "Step 1", value: 0 },
    { label: "Step 2", value: 1 },
    { label: "Step 3", value: 2 },
  ]}
  currentStep={currentStep}
/>

// With icons
<ProgressIndicator
  steps={[
    { label: "Upload", value: 0, icon: <IconUpload className="h-4 w-4" /> },
    { label: "Process", value: 1, icon: <IconSettings className="h-4 w-4" /> },
    { label: "Complete", value: 2, icon: <IconCheck className="h-4 w-4" /> },
  ]}
  currentStep={currentStep}
/>

// With descriptions
<ProgressIndicator
  steps={[
    {
      label: "Account",
      value: 0,
      description: "Create your account"
    },
    {
      label: "Profile",
      value: 1,
      description: "Add your information"
    },
  ]}
  currentStep={currentStep}
  showDescription
/>

// With variant and size
<ProgressIndicator
  steps={steps}
  currentStep={currentStep}
  variant="success"
  size="lg"
/>`;

const apiSections = [
  {
    title: "ProgressIndicator",
    props: [
      { prop: "steps", type: "ProgressStep[]", default: "-", description: "Array of step objects with label, value, icon, and optional description." },
      { prop: "currentStep", type: "number", default: "-", description: "The currently active step index." },
      { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size of the progress indicator." },
      { prop: "variant", type: '"default" | "success" | "warning" | "destructive"', default: '"default"', description: "Color variant of the indicator." },
      { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout orientation of the steps." },
      { prop: "clickable", type: "boolean", default: "false", description: "Whether steps can be clicked to navigate." },
      { prop: "animated", type: "boolean", default: "false", description: "Enable animations for step transitions." },
      { prop: "showDescription", type: "boolean", default: "false", description: "Show step descriptions below labels." },
      { prop: "onStepClick", type: "(value: number) => void", default: "-", description: "Callback when a step is clicked." },
    ],
  },
  {
    title: "ProgressIndicatorStep",
    props: [
      { prop: "label", type: "string", default: "-", description: "Display label for the step. Use empty string to hide." },
      { prop: "value", type: "number", default: "-", description: "Unique value/identifier for the step." },
      { prop: "icon", type: "ReactNode", default: "-", description: "Optional icon to display in the step indicator." },
      { prop: "description", type: "string", default: "-", description: "Optional description text for the step." },
    ],
  },
];

export function ProgressIndicatorPage() {
  const features = [
    {
      title: "Flexible Layout",
      description: "Horizontal and vertical orientations with size and color variants.",
      icon: <IconSettings className="h-4 w-4" />,
    },
    {
      title: "Interactive",
      description: "Clickable steps for direct navigation with callback support.",
      icon: <IconLoader className="h-4 w-4" />,
    },
    {
      title: "Customizable",
      description: "Optional icons, descriptions, animations, and responsive design.",
      icon: <IconCircleCheck className="h-4 w-4" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Progress Indicator"
          description="Simple step indicator with labels and navigation."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "variants",
      label: "Variants",
      demo: (
        <DemoWrapper
          title="Color Variants"
          description="Progress indicators with different color styles."
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Progress indicators in small, default, and large sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "without-label",
      label: "Without Label",
      demo: (
        <DemoWrapper
          title="Progress Without Labels"
          description="Progress indicator showing only step indicators without text labels."
          code={withoutLabelCode}
        >
          <WithoutLabelDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "custom",
      label: "Custom",
      demo: (
        <DemoWrapper
          title="Custom Options"
          description="Progress indicators with custom icons, descriptions, animations, and custom widths."
          code={customCode}
        >
          <CustomDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Progress Indicator"
        description="A step-by-step progress indicator for multi-step workflows with icons, descriptions, and flexible orientations."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the progress indicator in your application."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for the progress indicator components."
      />
    </ComponentPage>
  );
}
