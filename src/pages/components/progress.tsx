import * as React from "react";
import { IconChartBar, IconLoader, IconPalette } from "@tabler/icons-react";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
  SegmentedProgress,
  CircularProgress,
} from "@/components/ui/progress";
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

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicDemo() {
  return (
    <div className="space-y-6">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  );
}

const basicCode = `import { Progress } from "@/components/ui/progress"

export function BasicDemo() {
  return (
    <div className="space-y-4">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small (sm)</p>
        <Progress value={60} size="sm" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Progress value={60} size="default" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large (lg)</p>
        <Progress value={60} size="lg" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Extra Large (xl)</p>
        <Progress value={60} size="xl" />
      </div>
    </div>
  );
}

const sizesCode = `import { Progress } from "@/components/ui/progress"

export function SizesDemo() {
  return (
    <div className="space-y-4">
      <Progress value={60} size="sm" />
      <Progress value={60} size="default" />
      <Progress value={60} size="lg" />
      <Progress value={60} size="xl" />
    </div>
  )
}`;

function ColorsDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Progress value={80} variant="default" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Info</p>
        <Progress value={80} variant="info" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Success</p>
        <Progress value={80} variant="success" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Warning</p>
        <Progress value={80} variant="warning" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Destructive</p>
        <Progress value={80} variant="destructive" />
      </div>
    </div>
  );
}

const colorsCode = `import { Progress } from "@/components/ui/progress"

export function ColorsDemo() {
  return (
    <div className="space-y-3">
      <Progress value={80} variant="default" />
      <Progress value={80} variant="info" />
      <Progress value={80} variant="success" />
      <Progress value={80} variant="warning" />
      <Progress value={80} variant="destructive" />
    </div>
  )
}`;

function AnimatedDemo() {
  const [progress, setProgress] = React.useState(45);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Auto-incrementing progress: {progress}%
        </p>
        <Progress value={progress} />
      </div>
    </div>
  );
}

const animatedCode = `import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export function AnimatedDemo() {
  const [progress, setProgress] = useState(45)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  return <Progress value={progress} />
}`;

function IndeterminateDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use{" "}
        <code className="text-xs bg-muted px-1 py-0.5 rounded">
          value=&#123;null&#125;
        </code>{" "}
        for indeterminate state.
      </p>
      <div className="space-y-3">
        <Progress value={null} variant="default" />
        <Progress value={null} variant="info" />
        <Progress value={null} variant="success" />
      </div>
    </div>
  );
}

const indeterminateCode = `import { Progress } from "@/components/ui/progress"

export function IndeterminateDemo() {
  return (
    <div className="space-y-3">
      {/* Use value={null} for indeterminate state */}
      <Progress value={null} variant="default" />
      <Progress value={null} variant="info" />
      <Progress value={null} variant="success" />
    </div>
  )
}`;

function StripedDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Striped</p>
        <Progress value={70} striped size="lg" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Striped + Animated</p>
        <Progress value={70} striped animated size="lg" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Striped + Animated (Success)
        </p>
        <Progress value={70} striped animated size="lg" variant="success" />
      </div>
    </div>
  );
}

const stripedCode = `import { Progress } from "@/components/ui/progress"

export function StripedDemo() {
  return (
    <div className="space-y-4">
      {/* Striped pattern */}
      <Progress value={70} striped size="lg" />
      
      {/* Striped with animation */}
      <Progress value={70} striped animated size="lg" />
      
      {/* Striped + Animated with color variant */}
      <Progress value={70} striped animated size="lg" variant="success" />
    </div>
  )
}`;

function WithLabelDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Built-in label</p>
        <Progress value={75} showLabel />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          With sub-components
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <ProgressLabel>Upload Progress</ProgressLabel>
            <ProgressValue value={65} max={100} />
          </div>
          <Progress value={65} />
        </div>
      </div>
    </div>
  );
}

const withLabelCode = `import { 
  Progress, 
  ProgressLabel, 
  ProgressValue 
} from "@/components/ui/progress"

export function WithLabelDemo() {
  return (
    <div className="space-y-6">
      {/* Built-in label */}
      <Progress value={75} showLabel />
      
      {/* With sub-components */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <ProgressLabel>Upload Progress</ProgressLabel>
          <ProgressValue value={65} max={100} />
        </div>
        <Progress value={65} />
      </div>
    </div>
  )
}`;

function LocaleDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">English (US)</p>
        <Progress value={75} showLabel locale="en-US" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">German</p>
        <Progress value={75} showLabel locale="de-DE" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">French</p>
        <Progress value={75} showLabel locale="fr-FR" />
      </div>
    </div>
  );
}

const localeCode = `import { Progress } from "@/components/ui/progress"

export function LocaleDemo() {
  return (
    <div className="space-y-4">
      <Progress value={75} showLabel locale="en-US" />
      <Progress value={75} showLabel locale="de-DE" />
      <Progress value={75} showLabel locale="fr-FR" />
    </div>
  )
}`;

function AccessibilityDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Custom aria-valuetext (Screen readers announce "Step 3 of 5")
        </p>
        <Progress value={60} showLabel getAriaValueText={() => "Step 3 of 5"} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Custom aria-label</p>
        <Progress value={45} showLabel aria-label="File upload progress" />
      </div>
    </div>
  );
}

const accessibilityCode = `import { Progress } from "@/components/ui/progress"

export function AccessibilityDemo() {
  return (
    <div className="space-y-4">
      {/* Custom aria-valuetext for screen readers */}
      <Progress 
        value={60} 
        showLabel 
        getAriaValueText={() => "Step 3 of 5"} 
      />
      
      {/* Custom aria-label */}
      <Progress 
        value={45} 
        showLabel 
        aria-label="File upload progress" 
      />
    </div>
  )
}`;

function OnCompleteDemo() {
  const [progress, setProgress] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  const handleStart = () => {
    setCompleted(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleStart} disabled={progress > 0 && progress < 100}>
          Start Progress
        </Button>
        {completed && (
          <span className="text-sm text-success">onComplete fired!</span>
        )}
      </div>
      <Progress
        value={progress}
        onComplete={() => setCompleted(true)}
        showLabel
      />
    </div>
  );
}

const onCompleteCode = `import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function OnCompleteDemo() {
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleStart = () => {
    setCompleted(false)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleStart} disabled={progress > 0 && progress < 100}>
          Start Progress
        </Button>
        {completed && <span className="text-success">onComplete fired!</span>}
      </div>
      <Progress
        value={progress}
        onComplete={() => setCompleted(true)}
        showLabel
      />
    </div>
  )
}`;

function SegmentedDemo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Task Status</p>
        <SegmentedProgress
          segments={[
            { value: 45, variant: "success", label: "Completed" },
            { value: 25, variant: "info", label: "In Progress" },
            { value: 15, variant: "warning", label: "Pending" },
          ]}
          total={100}
          showLabels
          size="lg"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Storage Usage</p>
        <SegmentedProgress
          segments={[
            { value: 30, variant: "info", label: "Documents" },
            { value: 25, variant: "success", label: "Photos" },
            { value: 15, variant: "warning", label: "Videos" },
            { value: 10, variant: "destructive", label: "Others" },
          ]}
          total={100}
          showLabels
        />
      </div>
    </div>
  );
}

const segmentedCode = `import { SegmentedProgress } from "@/components/ui/progress"

export function SegmentedDemo() {
  return (
    <div className="space-y-8">
      {/* Task Status */}
      <SegmentedProgress
        segments={[
          { value: 45, variant: "success", label: "Completed" },
          { value: 25, variant: "info", label: "In Progress" },
          { value: 15, variant: "warning", label: "Pending" },
        ]}
        total={100}
        showLabels
        size="lg"
      />
      
      {/* Storage Usage */}
      <SegmentedProgress
        segments={[
          { value: 30, variant: "info", label: "Documents" },
          { value: 25, variant: "success", label: "Photos" },
          { value: 15, variant: "warning", label: "Videos" },
          { value: 10, variant: "destructive", label: "Others" },
        ]}
        total={100}
        showLabels
      />
    </div>
  )
}`;

function CircularDemo() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Sizes</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <CircularProgress value={60} size="sm" />
            <p className="text-xs text-muted-foreground mt-2">Small</p>
          </div>
          <div className="text-center">
            <CircularProgress value={60} size="default" />
            <p className="text-xs text-muted-foreground mt-2">Default</p>
          </div>
          <div className="text-center">
            <CircularProgress value={60} size="lg" />
            <p className="text-xs text-muted-foreground mt-2">Large</p>
          </div>
          <div className="text-center">
            <CircularProgress value={60} size="xl" />
            <p className="text-xs text-muted-foreground mt-2">XL</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">With Label</p>
        <div className="flex items-center gap-6">
          <CircularProgress value={75} showLabel />
          <CircularProgress value={45} showLabel variant="success" />
          <CircularProgress value={90} showLabel variant="warning" />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Indeterminate (value=null)
        </p>
        <div className="flex items-center gap-6">
          <CircularProgress value={null} />
          <CircularProgress value={null} variant="success" />
          <CircularProgress value={null} variant="info" />
        </div>
      </div>
    </div>
  );
}

const circularCode = `import { CircularProgress } from "@/components/ui/progress"

export function CircularDemo() {
  return (
    <div className="space-y-8">
      {/* Sizes */}
      <div className="flex items-center gap-6">
        <CircularProgress value={60} size="sm" />
        <CircularProgress value={60} size="default" />
        <CircularProgress value={60} size="lg" />
        <CircularProgress value={60} size="xl" />
      </div>
      
      {/* With Label */}
      <div className="flex items-center gap-6">
        <CircularProgress value={75} showLabel />
        <CircularProgress value={45} showLabel variant="success" />
        <CircularProgress value={90} showLabel variant="warning" />
      </div>
      
      {/* Indeterminate */}
      <div className="flex items-center gap-6">
        <CircularProgress value={null} />
        <CircularProgress value={null} variant="success" />
        <CircularProgress value={null} variant="info" />
      </div>
    </div>
  )
}`;

function LoadingExampleDemo() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadProgress, setLoadProgress] = React.useState(0);

  const handleLoad = () => {
    setIsLoading(true);
    setLoadProgress(0);

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleLoad} disabled={isLoading}>
          {isLoading ? "Loading..." : "Start Loading"}
        </Button>
        {isLoading && (
          <div className="flex items-center gap-3">
            <CircularProgress value={loadProgress} showLabel size="sm" />
            <span className="text-sm text-muted-foreground">
              Loading data... {loadProgress}%
            </span>
          </div>
        )}
      </div>
      {!isLoading && loadProgress === 100 && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
          <p className="text-sm text-success-foreground">
            Data loaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}

const loadingExampleCode = `import { useState } from "react"
import { CircularProgress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function LoadingExampleDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const handleLoad = () => {
    setIsLoading(true)
    setLoadProgress(0)

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleLoad} disabled={isLoading}>
          {isLoading ? "Loading..." : "Start Loading"}
        </Button>
        {isLoading && (
          <div className="flex items-center gap-3">
            <CircularProgress value={loadProgress} showLabel size="sm" />
            <span className="text-sm text-muted-foreground">
              Loading data... {loadProgress}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}`;

// =============================================================================
// USAGE CODE
// =============================================================================

const usageCode = `import { 
  Progress, 
  CircularProgress, 
  SegmentedProgress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

// Basic progress
<Progress value={33} />

// With label
<Progress value={75} showLabel />

// Indeterminate state
<Progress value={null} />

// Striped and animated
<Progress value={80} striped animated />

// Segmented progress
<SegmentedProgress
  segments={[
    { value: 45, variant: "success", label: "Done" },
    { value: 25, variant: "info", label: "In Progress" },
  ]}
  total={100}
  showLabels
/>

// Circular progress
<CircularProgress value={75} showLabel />

// With onComplete callback
<Progress value={progress} onComplete={() => console.log("Done!")} />

// Custom aria-valuetext for accessibility
<Progress 
  value={60} 
  getAriaValueText={() => "Step 3 of 5"} 
/>`;

// =============================================================================
// API REFERENCE
// =============================================================================

const apiSections = [
  {
    title: "Progress",
    props: [
      {
        prop: "value",
        type: "number | null",
        default: "-",
        description:
          "Current progress value. Use null for indeterminate state.",
      },
      {
        prop: "max",
        type: "number",
        default: "100",
        description: "Maximum value for the progress.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Size of the progress bar.",
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Color variant.",
      },
      {
        prop: "showLabel",
        type: "boolean",
        default: "false",
        description: "Show percentage label below the progress bar.",
      },
      {
        prop: "striped",
        type: "boolean",
        default: "false",
        description: "Display striped pattern on the indicator.",
      },
      {
        prop: "animated",
        type: "boolean",
        default: "false",
        description:
          "Animate the striped pattern. Only works when striped is true.",
      },
      {
        prop: "locale",
        type: "Intl.LocalesArgument",
        default: "-",
        description: "Locale for number formatting.",
      },
      {
        prop: "getAriaValueText",
        type: "(formatted, value) => string",
        default: "-",
        description:
          "Function to generate human-readable text for screen readers.",
      },
      {
        prop: "onComplete",
        type: "() => void",
        default: "-",
        description: "Callback when progress reaches max value.",
      },
    ],
  },
  {
    title: "CircularProgress",
    props: [
      {
        prop: "value",
        type: "number | null",
        default: "-",
        description:
          "Current progress value. Use null for indeterminate state.",
      },
      {
        prop: "max",
        type: "number",
        default: "100",
        description: "Maximum value for the progress.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Size of the circular progress.",
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Color variant.",
      },
      {
        prop: "showLabel",
        type: "boolean",
        default: "false",
        description: "Show percentage label in the center.",
      },
      {
        prop: "getAriaValueText",
        type: "(formatted, value) => string",
        default: "-",
        description:
          "Function to generate human-readable text for screen readers.",
      },
    ],
  },
  {
    title: "SegmentedProgress",
    props: [
      {
        prop: "segments",
        type: "Segment[]",
        default: "-",
        description:
          "Array of segments with value, variant, and optional label.",
      },
      {
        prop: "total",
        type: "number",
        default: "-",
        description: "Total value for calculating segment widths.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Size of the progress bar.",
      },
      {
        prop: "showLabels",
        type: "boolean",
        default: "false",
        description: "Show legend labels below the progress bar.",
      },
    ],
  },
  {
    title: "ProgressLabel",
    props: [
      {
        prop: "htmlFor",
        type: "string",
        default: "-",
        description: "ID of the associated progress element.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Label text content.",
      },
    ],
  },
  {
    title: "ProgressValue",
    props: [
      {
        prop: "value",
        type: "number | null",
        default: "-",
        description: "Current progress value.",
      },
      {
        prop: "max",
        type: "number",
        default: "100",
        description: "Maximum value.",
      },
      {
        prop: "locale",
        type: "Intl.LocalesArgument",
        default: "-",
        description: "Locale for number formatting.",
      },
      {
        prop: "children",
        type: "(formatted, value) => ReactNode",
        default: "-",
        description: "Optional render function for custom display.",
      },
    ],
  },
];

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ProgressPage() {
  const features = [
    {
      title: "Multiple Variants",
      description:
        "Linear, circular, and segmented progress indicators with size and color variants.",
      icon: <IconChartBar className="h-4 w-4" />,
    },
    {
      title: "Indeterminate State",
      description:
        "Support for indeterminate loading states with animated indicators.",
      icon: <IconLoader className="h-4 w-4" />,
    },
    {
      title: "Customizable",
      description:
        "Striped patterns, animated effects, locale formatting, and accessible labels.",
      icon: <IconPalette className="h-4 w-4" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Progress"
          description="Simple linear progress bar with different values."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="Progress bars in different sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "colors",
      label: "Colors",
      demo: (
        <DemoWrapper
          title="Color Variants"
          description="Progress bars with different color variants for various states."
          code={colorsCode}
        >
          <ColorsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "animated",
      label: "Animated",
      demo: (
        <DemoWrapper
          title="Animated Progress"
          description="Progress bar with smooth value transitions."
          code={animatedCode}
        >
          <AnimatedDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "indeterminate",
      label: "Indeterminate",
      demo: (
        <DemoWrapper
          title="Indeterminate State"
          description="Progress bars showing loading without a specific value."
          code={indeterminateCode}
        >
          <IndeterminateDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "striped",
      label: "Striped",
      demo: (
        <DemoWrapper
          title="Striped Variants"
          description="Progress bars with striped patterns and animations."
          code={stripedCode}
        >
          <StripedDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "labels",
      label: "Labels",
      demo: (
        <DemoWrapper
          title="With Labels"
          description="Progress bars with built-in and custom labels."
          code={withLabelCode}
        >
          <WithLabelDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "locale",
      label: "Locale",
      demo: (
        <DemoWrapper
          title="Locale Formatting"
          description="Progress labels formatted according to different locales."
          code={localeCode}
        >
          <LocaleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "accessibility",
      label: "Accessibility",
      demo: (
        <DemoWrapper
          title="Accessibility Features"
          description="Custom ARIA attributes for better screen reader support."
          code={accessibilityCode}
        >
          <AccessibilityDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "oncomplete",
      label: "onComplete",
      demo: (
        <DemoWrapper
          title="onComplete Callback"
          description="Callback fires when progress reaches 100%."
          code={onCompleteCode}
        >
          <OnCompleteDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "segmented",
      label: "Segmented",
      demo: (
        <DemoWrapper
          title="Segmented Progress"
          description="Multi-segment progress bars for showing multiple values."
          code={segmentedCode}
        >
          <SegmentedDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "circular",
      label: "Circular",
      demo: (
        <DemoWrapper
          title="Circular Progress"
          description="Circular progress indicators with sizes, labels, and indeterminate states."
          code={circularCode}
        >
          <CircularDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "loading",
      label: "Loading Example",
      demo: (
        <DemoWrapper
          title="Loading Example"
          description="Circular progress used in a realistic loading state scenario."
          code={loadingExampleCode}
        >
          <LoadingExampleDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Progress"
        description="Displays an indicator showing completion progress with linear, circular, and segmented variants."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the progress components in your application."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for all progress components."
      />
    </ComponentPage>
  );
}
