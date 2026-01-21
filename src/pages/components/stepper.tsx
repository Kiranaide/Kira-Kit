import { useState } from "react";
import {
  IconCheck,
  IconUser,
  IconMail,
  IconLock,
  IconBuilding,
  IconEye,
  IconFileCode,
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
import { CodeBlock } from "@/components/ui/code-block";

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

function DemoWrapper({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "preview" | "code")}>
            <TabsList>
              <TabsTrigger value="preview" icon={<IconEye className="w-3.5 h-3.5" />} className="gap-1">
                 Preview
              </TabsTrigger>
              <TabsTrigger value="code" icon={<IconFileCode className="w-3.5 h-3.5" />} className="gap-1">
                 Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {view === "preview" ? (
          <div className="min-h-[200px]">{children}</div>
        ) : (
          <CodeBlock
            code={code}
            language="tsx"
            wordWrap="bounded"
            minimap={false}
            fontSize={13}
            themeMode="system"
            darkTheme="vitesse-dark"
            lightTheme="github-light"
          />
        )}
      </CardContent>
    </Card>
  );
}

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

const basicCode = `import { useState } from "react"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"

export function BasicStepperDemo() {
  const [step, setStep] = useState(0)

  const steps = [
    { title: "Account", description: "Create your account" },
    { title: "Profile", description: "Set up your profile" },
    { title: "Security", description: "Configure security" },
    { title: "Complete", description: "You're all set!" },
  ]

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
  )
}`;

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

const verticalCode = `import { useState } from "react"
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
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function VerticalStepperDemo() {
  const [step, setStep] = useState(0)

  const steps = [
    { title: "Account", icon: <UserIcon /> },
    { title: "Profile", icon: <MailIcon /> },
    { title: "Security", icon: <LockIcon /> },
    { title: "Complete", icon: <CheckIcon /> },
  ]

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
            </div>
          </StepperPanel>

          <StepperPanel value={1}>
            <h3 className="text-lg font-semibold mb-4">Set Up Profile</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
          </StepperPanel>

          {/* More panels... */}

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
  )
}`;

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

const progressCode = `import { useState } from "react"
import {
  Stepper,
  StepperProgress,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"

export function ProgressStepperDemo() {
  const [step, setStep] = useState(1)
  const totalSteps = 4

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
  )
}`;

function WithHookDemo() {
  const stepper = useStepper({
    totalSteps: 4,
    initialStep: 0,
    linear: true,
    validators: {
      0: () => true,
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

const hookCode = `import { useStepper } from "@/hooks/use-stepper"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperSeparator,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function StepperWithHookDemo() {
  const stepper = useStepper({
    totalSteps: 4,
    initialStep: 0,
    linear: true,
    validators: {
      0: () => true,
      1: () => true,
      2: () => true,
    },
  })

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
            Progress: <Badge variant="secondary">{Math.round(stepper.progress)}%</Badge>
          </span>
        </div>
      </div>

      <StepperActions>
        <Button variant="outline" onClick={stepper.reset}>Reset</Button>
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
  )
}`;

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

const statesCode = `import { useState } from "react"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"

export function StepperStatesDemo() {
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-8">
      <Stepper
        value={step}
        onValueChange={setStep}
        completedSteps={[0]}
        errorSteps={[2]}
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
  )
}`;

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

const sizesCode = `import { useState } from "react"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper"
import { Badge } from "@/components/ui/badge"

export function StepperSizesDemo() {
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-12">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="space-y-2">
          <Badge variant="outline">{size.toUpperCase()}</Badge>
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
  )
}`;

function SkippableStepsDemo() {
  const stepper = useStepper({
    totalSteps: 5,
    initialStep: 0,
    skippableSteps: [1, 3],
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

const skippableCode = `import { useStepper } from "@/hooks/use-stepper"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SkippableStepsDemo() {
  const stepper = useStepper({
    totalSteps: 5,
    initialStep: 0,
    skippableSteps: [1, 3],
    onSkip: (step) => console.log(\`Skipped step \${step}\`),
  })

  const skippableSteps = [
    { title: "Account", optional: false },
    { title: "Profile", optional: true },
    { title: "Security", optional: false },
    { title: "Business", optional: true },
    { title: "Complete", optional: false },
  ]

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
            <StepperIndicator />
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
  )
}`;

function ConditionalStepsDemo() {
  const [isBusiness, setIsBusiness] = useState(false);

  const stepper = useStepper({
    totalSteps: 5,
    initialStep: 0,
    stepConditions: {
      2: isBusiness,
      3: isBusiness,
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

const conditionalCode = `import { useState } from "react"
import { useStepper } from "@/hooks/use-stepper"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ConditionalStepsDemo() {
  const [isBusiness, setIsBusiness] = useState(false)

  const stepper = useStepper({
    totalSteps: 5,
    initialStep: 0,
    stepConditions: {
      2: isBusiness,
      3: isBusiness,
    },
  })

  const conditionalSteps = [
    { title: "Account Type", show: true },
    { title: "Personal Info", show: true },
    { title: "Business Details", show: isBusiness },
    { title: "Payment", show: isBusiness },
    { title: "Complete", show: true },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <Switch
          id="business-mode"
          checked={isBusiness}
          onCheckedChange={setIsBusiness}
        />
        <Label htmlFor="business-mode">
          I'm signing up as a business
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
  )
}`;

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

const persistenceCode = `import { useStepper } from "@/hooks/use-stepper"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperActions,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"

export function PersistenceDemo() {
  const stepper = useStepper({
    totalSteps: 4,
    initialStep: 0,
    persistKey: "demo-wizard",
    onComplete: () => alert("Wizard completed!"),
  })

  return (
    <div className="space-y-8">
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
            stepper.reset()
            stepper.clearProgress()
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
  )
}`;

function NavigationComponentDemo() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
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

const navigationCode = `import { useState } from "react"
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperNavigation,
} from "@/components/ui/stepper"

export function NavigationDemo() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    return true
  }

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
  )
}`;

function ChangelogSection() {
  const changelogs = [
    {
      version: "v2.0",
      badge: "secondary",
      date: "2026-01",
      changes: [
        {
          type: "breaking",
          title: "ARIA Roles Changed",
          description:
            'Changed from role="tablist" to role="navigation" with list/listitem pattern for proper stepper semantics.',
        },
        {
          type: "breaking",
          title: "StepperItem Element",
          description:
            "StepperItem changed from <div> to <li>. Update any custom styling that targets the element type.",
        },
        {
          type: "feature",
          title: "New Props",
          description:
            "Added: editable, skippableSteps, skippedSteps, persistKey, onSkip, onComplete, condition (on StepperItem).",
        },
        {
          type: "feature",
          title: "StepperNavigation",
          description:
            "New pre-built navigation component with Back/Next/Skip buttons and async validation support.",
        },
        {
          type: "improvement",
          title: "Keyboard Navigation",
          description:
            "Full keyboard support: Home/End/Arrows/Enter/Space/Escape with proper ARIA announcements.",
        },
      ],
    },
    {
      version: "v1.0",
      badge: "outline",
      date: "2025-06",
      changes: [
        {
          type: "feature",
          title: "Initial Release",
          description: "Basic stepper with horizontal/vertical orientations and animations.",
        },
        {
          type: "feature",
          title: "Accessibility",
          description: "WAI-ARIA compliance with proper roles and keyboard navigation.",
        },
        {
          type: "feature",
          title: "Animations",
          description: "GSAP + CSS transitions for smooth step transitions.",
        },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changelog</CardTitle>
        <CardDescription>Version history and migration notes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {changelogs.map((release) => (
          <div key={release.version} className="relative pl-6 border-l-2 border-border">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border" />
            <div className="flex items-center gap-2 mb-3">
              <Badge>{release.version}</Badge>
              <span className="text-sm text-muted-foreground">{release.date}</span>
            </div>
            <div className="space-y-4">
              {release.changes.map((change, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        change.type === "breaking"
                          ? "destructive"
                          : change.type === "feature"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {change.type}
                    </Badge>
                    <span className="font-medium text-sm">{change.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-20">
                    {change.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function StepperPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Stepper</h1>
          <Badge>v2.0</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          A multi-step wizard component with full keyboard navigation, proper
          ARIA navigation pattern, hybrid GSAP + CSS animations, skip steps,
          conditional branching, and persistence support.
        </p>
      </div>

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
          <DemoWrapper
            title="Basic Horizontal Stepper"
            description="Simple horizontal stepper with step indicators and navigation."
            code={basicCode}
          >
            <BasicDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="vertical">
          <DemoWrapper
            title="Vertical Stepper with Panels"
            description="Vertical layout with step content panels and form fields."
            code={verticalCode}
          >
            <VerticalDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="progress">
          <DemoWrapper
            title="Progress Bar Variant"
            description="Linear progress bar with step labels."
            code={progressCode}
          >
            <ProgressDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="hook">
          <DemoWrapper
            title="Using useStepper Hook"
            description="Programmatic control with the useStepper hook for validation and navigation."
            code={hookCode}
          >
            <WithHookDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="states">
          <DemoWrapper
            title="Step States"
            description="Completed, active, error, skipped, and pending states."
            code={statesCode}
          >
            <StatesDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="sizes">
          <DemoWrapper
            title="Size Variants"
            description="Small, default, and large sizes."
            code={sizesCode}
          >
            <SizesDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="skippable">
          <DemoWrapper
            title="Skippable Steps"
            description="Optional steps that users can skip. Steps marked with Optional badge can be skipped."
            code={skippableCode}
          >
            <SkippableStepsDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="conditional">
          <DemoWrapper
            title="Conditional / Branching Steps"
            description="Steps that show/hide based on conditions. Toggle the switch to see business-specific steps."
            code={conditionalCode}
          >
            <ConditionalStepsDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="persistence">
          <DemoWrapper
            title="Save & Resume Progress"
            description="Progress is automatically saved to localStorage. Refresh the page to see it persist."
            code={persistenceCode}
          >
            <PersistenceDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="navigation">
          <DemoWrapper
            title="StepperNavigation Component"
            description="Pre-built navigation with Back, Next, Skip buttons and async validation support."
            code={navigationCode}
          >
            <NavigationComponentDemo />
          </DemoWrapper>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>Full keyboard support for accessibility</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Basic implementation example</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={`import {
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
}`}
          />
        </CardContent>
      </Card>

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
                  <tr>
                    <td className="py-2 font-mono text-xs">backLabel</td>
                    <td className="py-2 text-muted-foreground">string</td>
                    <td className="py-2">Label for the back button.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">nextLabel</td>
                    <td className="py-2 text-muted-foreground">string</td>
                    <td className="py-2">Label for the next button.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">skipLabel</td>
                    <td className="py-2 text-muted-foreground">string</td>
                    <td className="py-2">Label for the skip button.</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">finishLabel</td>
                    <td className="py-2 text-muted-foreground">string</td>
                    <td className="py-2">Label for the finish button.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangelogSection />
    </div>
  );
}
