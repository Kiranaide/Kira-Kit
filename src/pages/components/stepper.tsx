import * as React from "react"
import {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperNavigation,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconCheck, IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

export default function StepperPage() {
  const [value, setValue] = React.useState(0)

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Stepper</h1>
        <p className="text-muted-foreground">Multi-step wizard with progress indication</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Stepper</h2>
        <p className="text-muted-foreground">Horizontal 4-step wizard</p>

        <div className="max-w-2xl mx-auto">
          <Stepper value={value} onValueChange={setValue}>
            <StepperList>
              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    1
                  </StepperIndicator>
                  <StepperTitle>Account</StepperTitle>
                  <StepperDescription>Basic info</StepperDescription>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>

              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    2
                  </StepperIndicator>
                  <StepperTitle>Profile</StepperTitle>
                  <StepperDescription>Details</StepperDescription>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>

              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    3
                  </StepperIndicator>
                  <StepperTitle>Settings</StepperTitle>
                  <StepperDescription>Preferences</StepperDescription>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>

              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    4
                  </StepperIndicator>
                  <StepperTitle>Review</StepperTitle>
                  <StepperDescription>Confirm</StepperDescription>
                </StepperTrigger>
              </StepperItem>
            </StepperList>

            <div className="mt-8 p-6 border rounded-lg bg-card">
              {value === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Account Information</h3>
                  <p className="text-muted-foreground">Enter your basic account details</p>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="john@example.com" type="email" />
                  </div>
                </div>
              )}
              {value === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Profile Details</h3>
                  <p className="text-muted-foreground">Tell us more about yourself</p>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Input placeholder="Software developer..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="San Francisco, CA" />
                  </div>
                </div>
              )}
              {value === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Settings</h3>
                  <p className="text-muted-foreground">Configure your preferences</p>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Input placeholder="Light" />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input placeholder="English" />
                  </div>
                </div>
              )}
              {value === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Review</h3>
                  <p className="text-muted-foreground">Confirm your information</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> John Doe</div>
                    <div><strong>Email:</strong> john@example.com</div>
                    <div><strong>Bio:</strong> Software developer...</div>
                  </div>
                </div>
              )}

              <StepperNavigation className="mt-6 flex justify-between">
                <Button variant="outline" disabled={value === 0} onClick={() => setValue((v) => v - 1)}>
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button disabled={value === 3} onClick={() => setValue((v) => v + 1)}>
                  Next
                  <IconArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </StepperNavigation>
            </div>
          </Stepper>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Vertical Stepper</h2>
        <p className="text-muted-foreground">Vertical orientation</p>

        <div className="max-w-md mx-auto">
          <Stepper value={value} onValueChange={setValue} orientation="vertical">
            <StepperList>
              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    1
                  </StepperIndicator>
                  <div className="flex-1">
                    <StepperTitle>Step 1</StepperTitle>
                    <StepperDescription>Initial setup</StepperDescription>
                  </div>
                </StepperTrigger>
                <StepperSeparator orientation="vertical" />
              </StepperItem>

              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    2
                  </StepperIndicator>
                  <div className="flex-1">
                    <StepperTitle>Step 2</StepperTitle>
                    <StepperDescription>Configuration</StepperDescription>
                  </div>
                </StepperTrigger>
                <StepperSeparator orientation="vertical" />
              </StepperItem>

              <StepperItem>
                <StepperTrigger>
                  <StepperIndicator>
                    <IconCheck className="h-4 w-4 completed" />
                    3
                  </StepperIndicator>
                  <div className="flex-1">
                    <StepperTitle>Step 3</StepperTitle>
                    <StepperDescription>Finalize</StepperDescription>
                  </div>
                </StepperTrigger>
              </StepperItem>
            </StepperList>
          </Stepper>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <p className="text-muted-foreground">Small, default, and large sizes</p>

        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-4">Small</h3>
            <Stepper value={value} onValueChange={setValue} size="sm">
              <StepperList>
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <StepperItem>
                      <StepperTrigger>
                        <StepperIndicator>
                          <IconCheck className="h-3 w-3 completed" />
                          {step}
                        </StepperIndicator>
                        <StepperTitle>Step {step}</StepperTitle>
                      </StepperTrigger>
                      {step < 4 && <StepperSeparator />}
                    </StepperItem>
                  </React.Fragment>
                ))}
              </StepperList>
            </Stepper>
          </div>

          <div>
            <h3 className="font-medium mb-4">Default</h3>
            <Stepper value={value} onValueChange={setValue} size="default">
              <StepperList>
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <StepperItem>
                      <StepperTrigger>
                        <StepperIndicator>
                          <IconCheck className="h-4 w-4 completed" />
                          {step}
                        </StepperIndicator>
                        <StepperTitle>Step {step}</StepperTitle>
                      </StepperTrigger>
                      {step < 4 && <StepperSeparator />}
                    </StepperItem>
                  </React.Fragment>
                ))}
              </StepperList>
            </Stepper>
          </div>

          <div>
            <h3 className="font-medium mb-4">Large</h3>
            <Stepper value={value} onValueChange={setValue} size="lg">
              <StepperList>
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <StepperItem>
                      <StepperTrigger>
                        <StepperIndicator>
                          <IconCheck className="h-5 w-5 completed" />
                          {step}
                        </StepperIndicator>
                        <StepperTitle>Step {step}</StepperTitle>
                      </StepperTrigger>
                      {step < 4 && <StepperSeparator />}
                    </StepperItem>
                  </React.Fragment>
                ))}
              </StepperList>
            </Stepper>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Error State</h2>
        <p className="text-muted-foreground">Step with error indicator</p>

        <Stepper value={value} onValueChange={setValue}>
          <StepperList>
            <StepperItem>
              <StepperTrigger>
                <StepperIndicator>
                  <IconCheck className="h-4 w-4 completed" />
                  1
                </StepperIndicator>
                <StepperTitle>Step 1</StepperTitle>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem>
              <StepperTrigger>
                <StepperIndicator state="error">
                  !
                </StepperIndicator>
                <StepperTitle>Step 2</StepperTitle>
                <StepperDescription>Error occurred</StepperDescription>
              </StepperTrigger>
              <StepperSeparator state="completed" />
            </StepperItem>

            <StepperItem>
              <StepperTrigger>
                <StepperIndicator>3</StepperIndicator>
                <StepperTitle>Step 3</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
        </Stepper>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Completed States</h2>
        <p className="text-muted-foreground">Show checkmarks on completed steps</p>

        <Stepper value={value} onValueChange={setValue}>
          <StepperList>
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <StepperItem>
                  <StepperTrigger>
                    <StepperIndicator state={step <= 2 ? "completed" : "default"}>
                      <IconCheck className="h-4 w-4 completed" />
                      {step > 2 && step}
                    </StepperIndicator>
                    <StepperTitle>Step {step}</StepperTitle>
                  </StepperTrigger>
                  {step < 4 && <StepperSeparator state={step < 2 ? "completed" : "default"} />}
                </StepperItem>
              </React.Fragment>
            ))}
          </StepperList>
        </Stepper>
      </section>
    </div>
  )
}
