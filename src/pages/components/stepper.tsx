import { useState } from "react";
import {
  IconCheck,
  IconUser,
  IconMail,
  IconLock,
  IconBuilding,
} from "@tabler/icons-react";

import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperPanel,
  StepperActions,
  StepperProgress,
  StepperNavigation,
} from "@/components/ui/stepper";
import { useStepper } from "@/hooks/use-stepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ============================================================================
// DEMO DATA
// ============================================================================

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

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

function BasicDemo() {
  const [step, setStep] = useState(0);

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

function VerticalDemo() {
  const [step, setStep] = useState(0);

  return (
    <Stepper
      value={step}
      onValueChange={setStep}
      orientation="vertical"
      className="w-full"
    >
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          {steps.map((s, index) => (
            <StepperItem key={index} value={index}>
              <StepperIndicator>{s.icon}</StepperIndicator>
              <StepperContent>
                <StepperTitle>{s.title}</StepperTitle>
                <StepperDescription>{s.description}</StepperDescription>
              </StepperContent>
              <StepperSeparator />
            </StepperItem>
          ))}
        </div>

        <div className="flex-1 rounded-lg border p-6">
          <StepperPanel value={0}>
            <h3 className="text-lg font-semibold mb-4">Create Account</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </div>
          </StepperPanel>

          <StepperPanel value={1}>
            <h3 className="text-lg font-semibold mb-4">Set Up Profile</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" />
              </div>
            </div>
          </StepperPanel>

          <StepperPanel value={2}>
            <h3 className="text-lg font-semibold mb-4">Configure Security</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Enable 2FA for enhanced security.
                </p>
              </div>
            </div>
          </StepperPanel>

          <StepperPanel value={3}>
            <h3 className="text-lg font-semibold mb-4">All Done!</h3>
            <p className="text-muted-foreground">
              Your account is set up and ready to use.
            </p>
          </StepperPanel>

          <StepperActions className="mt-6">
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
      </div>
    </Stepper>
  );
}

function ProgressDemo() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  return (
    <div className="space-y-8">
      <Stepper value={step} onValueChange={setStep}>
        <StepperProgress
          showLabels
          labels={["Cart", "Shipping", "Payment", "Confirm"]}
        />
      </Stepper>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      <StepperActions className="justify-center">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}
          disabled={step === totalSteps - 1}
        >
          Next
        </Button>
      </StepperActions>
    </div>
  );
}

function WithHookDemo() {
  const stepper = useStepper({
    totalSteps: 4,
    initialStep: 0,
    linear: true,
    validators: {
      0: () => true, // Always valid for demo
      1: () => true,
      2: () => true,
    },
  });

  return (
    <div className="space-y-8">
      <Stepper
        value={stepper.currentStep}
        onValueChange={(v) => stepper.goTo(v)}
      >
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </Stepper>

      <div className="flex items-center justify-between rounded-lg bg-muted p-4 text-sm">
        <div className="flex gap-4">
          <span>
            Current: <Badge variant="outline">{stepper.currentStep + 1}</Badge>
          </span>
          <span>
            Progress:{" "}
            <Badge variant="secondary">{Math.round(stepper.progress)}%</Badge>
          </span>
        </div>
        <div className="flex gap-2">
          <span className={stepper.isFirstStep ? "text-muted-foreground" : ""}>
            {stepper.isFirstStep ? "First Step" : ""}
          </span>
          <span className={stepper.isLastStep ? "text-primary" : ""}>
            {stepper.isLastStep ? "Last Step" : ""}
          </span>
        </div>
      </div>

      <StepperActions>
        <Button variant="outline" onClick={stepper.reset}>
          Reset
        </Button>
        <Button
          variant="outline"
          onClick={stepper.prev}
          disabled={!stepper.canGoPrev}
        >
          Previous
        </Button>
        <Button onClick={() => stepper.next()} disabled={!stepper.canGoNext}>
          {stepper.isLastStep ? "Complete" : "Next"}
        </Button>
      </StepperActions>
    </div>
  );
}

function StatesDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-8">
      <Stepper
        value={step}
        onValueChange={setStep}
        completedSteps={[0]}
        errorSteps={[2]}
        loadingSteps={[]}
      >
        <StepperItem value={0}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>Completed</StepperTitle>
            <StepperDescription>This step is done</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value={1}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>Active</StepperTitle>
            <StepperDescription>Currently on this step</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value={2}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>Error</StepperTitle>
            <StepperDescription>This step has an error</StepperDescription>
          </StepperContent>
          <StepperSeparator />
        </StepperItem>

        <StepperItem value={3}>
          <StepperIndicator />
          <StepperContent>
            <StepperTitle>Pending</StepperTitle>
            <StepperDescription>Not yet reached</StepperDescription>
          </StepperContent>
        </StepperItem>
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
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 3}
        >
          Next
        </Button>
      </StepperActions>
    </div>
  );
}

function SizesDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-12">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="space-y-2">
          <Badge variant="outline" className="mb-4">
            {size.toUpperCase()}
          </Badge>
          <Stepper value={step} onValueChange={setStep} size={size}>
            {steps.slice(0, 3).map((s, index) => (
              <StepperItem key={index} value={index}>
                <StepperIndicator />
                <StepperContent>
                  <StepperTitle>{s.title}</StepperTitle>
                </StepperContent>
                <StepperSeparator />
              </StepperItem>
            ))}
          </Stepper>
        </div>
      ))}
    </div>
  );
}

function SkippableStepsDemo() {
  const stepper = useStepper({
    totalSteps: 5,
    initialStep: 0,
    skippableSteps: [1, 3], // Profile and Business steps are optional
    onSkip: (step) => console.log(`Skipped step ${step}`),
  });

  const skippableSteps = [
    {
      title: "Account",
      description: "Create your account",
      icon: <IconUser className="h-4 w-4" />,
      optional: false,
    },
    {
      title: "Profile",
      description: "Optional profile setup",
      icon: <IconMail className="h-4 w-4" />,
      optional: true,
    },
    {
      title: "Security",
      description: "Configure security",
      icon: <IconLock className="h-4 w-4" />,
      optional: false,
    },
    {
      title: "Business",
      description: "Optional business info",
      icon: <IconBuilding className="h-4 w-4" />,
      optional: true,
    },
    {
      title: "Complete",
      description: "You're all set!",
      icon: <IconCheck className="h-4 w-4" />,
      optional: false,
    },
  ];

  return (
    <div className="space-y-8">
      <Stepper
        value={stepper.currentStep}
        onValueChange={(v) => stepper.goTo(v)}
        skippableSteps={[1, 3]}
        skippedSteps={Array.from(stepper.skippedSteps)}
      >
        {skippableSteps.map((s, index) => (
          <StepperItem key={index} value={index} optional={s.optional}>
            <StepperIndicator>{s.icon}</StepperIndicator>
            <StepperContent>
              <StepperTitle>
                {s.title}
                {s.optional && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Optional
                  </Badge>
                )}
              </StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </Stepper>

      <div className="flex items-center justify-between rounded-lg bg-muted p-4 text-sm">
        <div className="flex gap-4">
          <span>
            Skipped:{" "}
            <Badge variant="secondary">{stepper.skippedSteps.size}</Badge>
          </span>
          <span>
            Progress:{" "}
            <Badge variant="secondary">{Math.round(stepper.progress)}%</Badge>
          </span>
        </div>
      </div>

      <StepperActions>
        <Button
          variant="outline"
          onClick={stepper.prev}
          disabled={!stepper.canGoPrev}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {stepper.isSkippable(stepper.currentStep) && !stepper.isLastStep && (
            <Button variant="ghost" onClick={stepper.skip}>
              Skip this step
            </Button>
          )}
          <Button
            onClick={() => stepper.next()}
            disabled={!stepper.canGoNext && !stepper.isLastStep}
          >
            {stepper.isLastStep ? "Complete" : "Next"}
          </Button>
        </div>
      </StepperActions>
    </div>
  );
}

function ConditionalStepsDemo() {
  const [isBusiness, setIsBusiness] = useState(false);

  const stepper = useStepper({
    totalSteps: 5,
    initialStep: 0,
    stepConditions: {
      2: isBusiness, // Business Details only shows if isBusiness is true
      3: isBusiness, // Payment only shows if isBusiness is true
    },
  });

  const conditionalSteps = [
    { title: "Account Type", description: "Choose account type", show: true },
    { title: "Personal Info", description: "Your details", show: true },
    {
      title: "Business Details",
      description: "Company information",
      show: isBusiness,
    },
    { title: "Payment", description: "Billing setup", show: isBusiness },
    { title: "Complete", description: "All done!", show: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <Switch
          id="business-mode"
          checked={isBusiness}
          onCheckedChange={setIsBusiness}
        />
        <Label htmlFor="business-mode" className="cursor-pointer">
          I'm signing up as a business
          <span className="block text-sm text-muted-foreground">
            {isBusiness
              ? "Business steps are visible"
              : "Toggle to show business steps"}
          </span>
        </Label>
      </div>

      <Stepper
        value={stepper.currentStep}
        onValueChange={(v) => stepper.goTo(v)}
      >
        {conditionalSteps.map((s, index) => (
          <StepperItem key={index} value={index} condition={s.show}>
            <StepperIndicator />
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </Stepper>

      <div className="text-sm text-muted-foreground">
        Visible steps: {stepper.visibleSteps.length} of 5 total
      </div>

      <StepperActions>
        <Button
          variant="outline"
          onClick={stepper.prev}
          disabled={!stepper.canGoPrev}
        >
          Previous
        </Button>
        <Button
          onClick={() => stepper.next()}
          disabled={!stepper.canGoNext && !stepper.isLastStep}
        >
          {stepper.isLastStep ? "Complete" : "Next"}
        </Button>
      </StepperActions>
    </div>
  );
}

function PersistenceDemo() {
  const stepper = useStepper({
    totalSteps: 4,
    initialStep: 0,
    persistKey: "demo-wizard",
    onComplete: () => alert("Wizard completed!"),
  });

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <p>
          This wizard saves progress to localStorage. Refresh the page to see it
          persist!
        </p>
        <p className="mt-2">
          Key:{" "}
          <code className="rounded bg-muted px-1">stepper-demo-wizard</code>
        </p>
      </div>

      <Stepper
        value={stepper.currentStep}
        onValueChange={(v) => stepper.goTo(v)}
        completedSteps={Array.from(stepper.completedSteps)}
        persistKey="demo-wizard"
      >
        {steps.map((s, index) => (
          <StepperItem key={index} value={index}>
            <StepperIndicator>{s.icon}</StepperIndicator>
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}
      </Stepper>

      <div className="flex items-center justify-between rounded-lg bg-muted p-4 text-sm">
        <span>
          Completed: {stepper.completedSteps.size} / {stepper.totalSteps}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            stepper.reset();
            stepper.clearProgress();
          }}
        >
          Clear Progress
        </Button>
      </div>

      <StepperActions>
        <Button
          variant="outline"
          onClick={stepper.prev}
          disabled={!stepper.canGoPrev}
        >
          Previous
        </Button>
        <Button onClick={() => stepper.next()}>
          {stepper.isLastStep ? "Complete" : "Next"}
        </Button>
      </StepperActions>
    </div>
  );
}

function NavigationComponentDemo() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    // Simulate async validation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    return true;
  };

  return (
    <div className="space-y-8">
      <Stepper value={step} onValueChange={setStep} skippableSteps={[1, 2]}>
        {steps.map((s, index) => (
          <StepperItem
            key={index}
            value={index}
            optional={index === 1 || index === 2}
          >
            <StepperIndicator>{s.icon}</StepperIndicator>
            <StepperContent>
              <StepperTitle>{s.title}</StepperTitle>
              <StepperDescription>{s.description}</StepperDescription>
            </StepperContent>
            <StepperSeparator />
          </StepperItem>
        ))}

        <StepperNavigation
          onNext={handleNext}
          onFinish={() => alert("Done!")}
          loading={loading}
          backLabel="Go Back"
          nextLabel="Continue"
          skipLabel="Skip Step"
          finishLabel="Finish Setup"
        />
      </Stepper>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function StepperPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Stepper</h1>
          <Badge>v2.0</Badge>
          <Badge variant="outline">Breaking Changes</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          A multi-step wizard component with full keyboard navigation, proper
          ARIA navigation pattern, hybrid GSAP + CSS animations, skip steps,
          conditional branching, and persistence support.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Accessible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            WAI-ARIA navigation pattern with <code>aria-current="step"</code>,
            arrow key navigation, Enter/Space activation, and screen reader
            announcements.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Animated</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Hybrid GSAP + tailwind-animate transitions with
            prefers-reduced-motion support.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flexible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Skip steps, conditional branching, localStorage persistence,
            editable mode, and StepperNavigation utility.
          </CardContent>
        </Card>
      </div>

      {/* Demos */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="vertical">Vertical</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="hook">With Hook</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="skippable">Skippable</TabsTrigger>
          <TabsTrigger value="conditional">Conditional</TabsTrigger>
          <TabsTrigger value="persistence">Persistence</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Horizontal Stepper</CardTitle>
              <CardDescription>
                Simple horizontal stepper with step indicators and navigation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vertical">
          <Card>
            <CardHeader>
              <CardTitle>Vertical Stepper with Panels</CardTitle>
              <CardDescription>
                Vertical layout with step content panels and form fields.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerticalDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Bar Variant</CardTitle>
              <CardDescription>
                Linear progress bar with step labels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hook">
          <Card>
            <CardHeader>
              <CardTitle>Using useStepper Hook</CardTitle>
              <CardDescription>
                Programmatic control with the useStepper hook for validation and
                navigation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WithHookDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states">
          <Card>
            <CardHeader>
              <CardTitle>Step States</CardTitle>
              <CardDescription>
                Completed, active, error, skipped, and pending states.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatesDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes">
          <Card>
            <CardHeader>
              <CardTitle>Size Variants</CardTitle>
              <CardDescription>
                Small, default, and large sizes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SizesDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skippable">
          <Card>
            <CardHeader>
              <CardTitle>Skippable Steps</CardTitle>
              <CardDescription>
                Optional steps that users can skip. Steps marked with "Optional"
                badge can be skipped.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkippableStepsDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditional">
          <Card>
            <CardHeader>
              <CardTitle>Conditional / Branching Steps</CardTitle>
              <CardDescription>
                Steps that show/hide based on conditions. Toggle the switch to
                see business-specific steps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionalStepsDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persistence">
          <Card>
            <CardHeader>
              <CardTitle>Save & Resume Progress</CardTitle>
              <CardDescription>
                Progress is automatically saved to localStorage. Refresh the
                page to see it persist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersistenceDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>StepperNavigation Component</CardTitle>
              <CardDescription>
                Pre-built navigation with Back, Next, Skip buttons and async
                validation support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NavigationComponentDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Keyboard Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>
            Full keyboard support for accessibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { key: "← / →", description: "Navigate steps (horizontal)" },
              { key: "↑ / ↓", description: "Navigate steps (vertical)" },
              { key: "Home", description: "Go to first step" },
              { key: "End", description: "Go to last step" },
              { key: "Enter / Space", description: "Activate focused step" },
              { key: "Escape", description: "Cancel / blur focus" },
            ].map(({ key, description }) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="rounded border bg-muted px-2 py-1 text-xs font-mono">
                  {key}
                </kbd>
                <span className="text-sm text-muted-foreground">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Basic implementation example</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4">
            <pre className="text-sm overflow-x-auto">
              <code className="language-tsx">{`import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator
} from "@/components/ui/stepper"

export function StepperDemo() {
  const [step, setStep] = useState(0)

  return (
    <Stepper value={step} onValueChange={setStep}>
      <StepperItem value={0}>
        <StepperIndicator />
        <StepperContent>
          <StepperTitle>Step 1</StepperTitle>
          <StepperDescription>Enter details</StepperDescription>
        </StepperContent>
        <StepperSeparator />
      </StepperItem>
      {/* Add more steps... */}
    </Stepper>
  )
}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Key props and configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stepper</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">value</td>
                    <td className="py-2 text-muted-foreground">number</td>
                    <td className="py-2">
                      Current active step index (0-indexed). Required for
                      controlled mode.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">defaultValue</td>
                    <td className="py-2 text-muted-foreground">number</td>
                    <td className="py-2">
                      Initial step index for uncontrolled mode. Default: 0
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">onValueChange</td>
                    <td className="py-2 text-muted-foreground">
                      (value: number) =&gt; void
                    </td>
                    <td className="py-2">
                      Callback fired when the active step changes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">orientation</td>
                    <td className="py-2 text-muted-foreground">
                      "horizontal" | "vertical"
                    </td>
                    <td className="py-2">
                      Layout orientation of the stepper. Default: "horizontal"
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">size</td>
                    <td className="py-2 text-muted-foreground">
                      "sm" | "default" | "lg"
                    </td>
                    <td className="py-2">
                      Size of the stepper indicators. Default: "default"
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">linear</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      If true, requires steps to be completed sequentially.
                      Default: false
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">editable</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      If true, users can click to navigate back to completed
                      steps. Default: true
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">skippableSteps</td>
                    <td className="py-2 text-muted-foreground">number[]</td>
                    <td className="py-2">
                      Array of step indices that can be skipped.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">persistKey</td>
                    <td className="py-2 text-muted-foreground">string</td>
                    <td className="py-2">
                      Unique key to persist state to localStorage.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">onComplete</td>
                    <td className="py-2 text-muted-foreground">
                      () =&gt; void
                    </td>
                    <td className="py-2">
                      Callback fired when the last step is completed.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperItem</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">value</td>
                    <td className="py-2 text-muted-foreground">number</td>
                    <td className="py-2">
                      The index of this step. Must match the index in the steps
                      array.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">optional</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">Marks the step as optional.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">disabled</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      Disables interaction with the step.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">condition</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      If false, the step is hidden and removed from the flow.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperIndicator</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">completedIcon</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">
                      Icon to show when step is completed. Default: Check icon
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">errorIcon</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">
                      Icon to show when step has an error. Default: X icon
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">loadingIcon</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">
                      Icon to show when step is loading. Default: Loader icon
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperTitle</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">children</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">Title content.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperDescription</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">children</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">Description content.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperSeparator</h3>
            <div className="overflow-x-auto">
              <div className="text-sm text-muted-foreground">
                Renders a separator line between steps. Automatically handles
                positioning and styling based on step state. No specific props.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperContent</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">children</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">
                      Content wrapper for title and description.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperPanel</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">value</td>
                    <td className="py-2 text-muted-foreground">number</td>
                    <td className="py-2">Step index this panel belongs to.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">forceMount</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      Force mount the panel content even when not active (useful
                      for animations).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperActions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">children</td>
                    <td className="py-2 text-muted-foreground">ReactNode</td>
                    <td className="py-2">
                      Container for action buttons (Next, Prev, etc).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperProgress</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">showLabels</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      Whether to show labels below the progress bar.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">labels</td>
                    <td className="py-2 text-muted-foreground">string[]</td>
                    <td className="py-2">Array of label strings to display.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StepperNavigation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[120px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-mono text-xs">onNext</td>
                    <td className="py-2 text-muted-foreground">
                      () =&gt; void | Promise
                    </td>
                    <td className="py-2">
                      Function called when "Next" is clicked. Can return a
                      Promise to show loading.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">onPrev</td>
                    <td className="py-2 text-muted-foreground">
                      () =&gt; void
                    </td>
                    <td className="py-2">
                      Function called when "Previous" is clicked.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">onFinish</td>
                    <td className="py-2 text-muted-foreground">
                      () =&gt; void
                    </td>
                    <td className="py-2">
                      Function called when "Finish" is clicked on the last step.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">loading</td>
                    <td className="py-2 text-muted-foreground">boolean</td>
                    <td className="py-2">
                      Forces data-loading state on the Next/Finish button.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breaking Changes */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">
            Breaking Changes (v2.0)
          </CardTitle>
          <CardDescription>Migration notes from v1.x</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">ARIA Roles Changed</h4>
            <p className="text-muted-foreground">
              Changed from <code>role="tablist"</code> to{" "}
              <code>role="navigation"</code> with
              <code>role="list"</code> + <code>role="listitem"</code> pattern
              for proper stepper semantics.
            </p>
          </div>
          <div>
            <h4 className="font-medium">StepperItem now uses &lt;li&gt;</h4>
            <p className="text-muted-foreground">
              <code>StepperItem</code> changed from <code>&lt;div&gt;</code> to{" "}
              <code>&lt;li&gt;</code>. Update any custom styling that targets
              the element type.
            </p>
          </div>
          <div>
            <h4 className="font-medium">New Props</h4>
            <p className="text-muted-foreground">
              Added: <code>editable</code>, <code>skippableSteps</code>,{" "}
              <code>skippedSteps</code>,<code>persistKey</code>,{" "}
              <code>onSkip</code>, <code>onComplete</code>,{" "}
              <code>condition</code> (on StepperItem).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
