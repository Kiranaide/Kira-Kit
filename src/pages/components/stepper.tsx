import { useState } from "react"
import { IconCheck, IconUser, IconMail, IconLock } from "@tabler/icons-react"

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
} from "@/components/ui/stepper"
import { useStepper } from "@/hooks/use-stepper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ============================================================================
// DEMO DATA
// ============================================================================

const steps = [
  { title: "Account", description: "Create your account", icon: <IconUser className="h-4 w-4" /> },
  { title: "Profile", description: "Set up your profile", icon: <IconMail className="h-4 w-4" /> },
  { title: "Security", description: "Configure security", icon: <IconLock className="h-4 w-4" /> },
  { title: "Complete", description: "You're all set!", icon: <IconCheck className="h-4 w-4" /> },
]

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

function BasicDemo() {
  const [step, setStep] = useState(0)

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
}

function VerticalDemo() {
  const [step, setStep] = useState(0)

  return (
    <Stepper value={step} onValueChange={setStep} orientation="vertical" className="w-full">
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
  )
}

function ProgressDemo() {
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
  })

  return (
    <div className="space-y-8">
      <Stepper value={stepper.currentStep} onValueChange={(v) => stepper.goTo(v)}>
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
          <span>Current: <Badge variant="outline">{stepper.currentStep + 1}</Badge></span>
          <span>Progress: <Badge variant="secondary">{Math.round(stepper.progress)}%</Badge></span>
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
        <Button
          onClick={() => stepper.next()}
          disabled={!stepper.canGoNext}
        >
          {stepper.isLastStep ? "Complete" : "Next"}
        </Button>
      </StepperActions>
    </div>
  )
}

function StatesDemo() {
  const [step, setStep] = useState(1)

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
  )
}

function SizesDemo() {
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-12">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="space-y-2">
          <Badge variant="outline" className="mb-4">{size.toUpperCase()}</Badge>
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
          <Badge>Enhanced</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          A multi-step wizard component with full keyboard navigation,
          ARIA tablist pattern, GSAP animations, and validation support.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Accessible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            WAI-ARIA tablist pattern with arrow key navigation and screen reader announcements.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Animated</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Smooth GSAP transitions with prefers-reduced-motion support.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flexible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Horizontal/vertical layouts, progress bar variant, validation API, and useStepper hook.
          </CardContent>
        </Card>
      </div>

      {/* Demos */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="vertical">Vertical</TabsTrigger>
          <TabsTrigger value="progress">Progress Bar</TabsTrigger>
          <TabsTrigger value="hook">With Hook</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
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
                Programmatic control with the useStepper hook for validation and navigation.
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
                Completed, active, error, and pending states.
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
      </Tabs>

      {/* Keyboard Navigation */}
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
            ].map(({ key, description }) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="rounded border bg-muted px-2 py-1 text-xs font-mono">
                  {key}
                </kbd>
                <span className="text-sm text-muted-foreground">{description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Key props and configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Prop</th>
                  <th className="py-2 text-left font-medium">Type</th>
                  <th className="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono text-xs">value</td>
                  <td className="py-2 text-muted-foreground">number</td>
                  <td className="py-2">Current step (0-indexed)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">orientation</td>
                  <td className="py-2 text-muted-foreground">horizontal | vertical</td>
                  <td className="py-2">Layout direction</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">size</td>
                  <td className="py-2 text-muted-foreground">sm | default | lg</td>
                  <td className="py-2">Indicator size</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">linear</td>
                  <td className="py-2 text-muted-foreground">boolean</td>
                  <td className="py-2">Force sequential completion</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">completedSteps</td>
                  <td className="py-2 text-muted-foreground">number[]</td>
                  <td className="py-2">Array of completed step indices</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">errorSteps</td>
                  <td className="py-2 text-muted-foreground">number[]</td>
                  <td className="py-2">Array of error step indices</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
