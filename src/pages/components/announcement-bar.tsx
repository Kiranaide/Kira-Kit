import * as React from "react"
import {
  IconSparkles,
  IconRocket,
  IconGift,
  IconExternalLink,
  IconBell,
  IconClock,
  IconAccessible,
} from "@tabler/icons-react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  AnnouncementStack,
  useAnnouncementDismiss,
  useAnnouncementExpiry,
} from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs"

const variantsCode = `import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
} from "@/components/ui/announcement-bar"

export function VariantsDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="default">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Default style</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="info">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Info announcement</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="success">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Success message</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="warning">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Warning notice</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="destructive">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Critical alert</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>
    </div>
  )
}`

function VariantsDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="default">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          This is the default announcement style
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="info">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          New feature: Dashboard analytics is now live!
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="success">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Your changes have been saved successfully
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="warning">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Your subscription expires in 3 days
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="destructive">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Critical: Please update your payment method
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>
    </div>
  )
}

const priorityCode = `import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
} from "@/components/ui/announcement-bar"

export function PriorityDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="info" priority="low">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Low priority: Minor update</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="info" priority="normal">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Normal priority: New features</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="warning" priority="high">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>High priority: Action required</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="destructive" priority="critical">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Critical: Immediate action required</AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>
    </div>
  )
}`

function PriorityDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="info" priority="low">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Low priority: Minor update available
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="info" priority="normal">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Normal priority: New features released
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="warning" priority="high">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          High priority: Action required soon
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>

      <AnnouncementBar variant="destructive" priority="critical">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Critical priority: Immediate action required (uses role="alert")
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>
    </div>
  )
}

const autoDismissCode = `import { useState } from "react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
} from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function AutoDismissDemo() {
  const [showAutoDismiss, setShowAutoDismiss] = useState(true)

  return showAutoDismiss ? (
    <AnnouncementBar
      variant="success"
      autoDismiss={10000}
      showProgress
      onDismiss={() => setShowAutoDismiss(false)}
    >
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        This announcement will auto-dismiss in 10 seconds. Hover to pause!
      </AnnouncementBarContent>
      <AnnouncementBarDismiss onClick={() => setShowAutoDismiss(false)} />
    </AnnouncementBar>
  ) : (
    <Button size="sm" onClick={() => setShowAutoDismiss(true)}>
      Show Again
    </Button>
  )
}`

function AutoDismissDemo() {
  const [showAutoDismiss, setShowAutoDismiss] = React.useState(true)

  return (
    <>
      {showAutoDismiss ? (
        <AnnouncementBar
          variant="success"
          autoDismiss={10000}
          showProgress
          onDismiss={() => setShowAutoDismiss(false)}
        >
          <AnnouncementBarIcon />
          <AnnouncementBarContent>
            This announcement will auto-dismiss in 10 seconds. Hover to pause!
          </AnnouncementBarContent>
          <AnnouncementBarDismiss onClick={() => setShowAutoDismiss(false)} />
        </AnnouncementBar>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Auto-dismiss demo was dismissed</span>
          <Button size="sm" onClick={() => setShowAutoDismiss(true)}>
            Show Again
          </Button>
        </div>
      )}
    </>
  )
}

const floatingCode = `import { useState } from "react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
} from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function FloatingDemo() {
  const [showFloating, setShowFloating] = useState(true)

  return (
    <>
      {showFloating ? (
        <div className="relative h-32 bg-muted/30 rounded-lg overflow-hidden">
          <AnnouncementBar
            variant="info"
            position="floating"
            animation="scale"
            className="relative"
            style={{ position: "relative", transform: "none", left: "auto" }}
          >
            <AnnouncementBarIcon icon={<IconSparkles className="h-5 w-5" />} />
            <AnnouncementBarContent>
              Floating announcement with custom icon!
            </AnnouncementBarContent>
            <AnnouncementBarDismiss onClick={() => setShowFloating(false)} />
          </AnnouncementBar>
        </div>
      ) : (
        <Button size="sm" onClick={() => setShowFloating(true)}>
          Show Again
        </Button>
      )}
    </>
  )
}`

function FloatingDemo() {
  const [showFloating, setShowFloating] = React.useState(true)

  return (
    <>
      {showFloating ? (
        <div className="relative h-32 bg-muted/30 rounded-lg overflow-hidden">
          <AnnouncementBar
            variant="info"
            position="floating"
            animation="scale"
            className="relative"
            style={{ position: "relative", transform: "none", left: "auto" }}
          >
            <AnnouncementBarIcon icon={<IconSparkles className="h-5 w-5" />} />
            <AnnouncementBarContent>
              Floating announcement with custom icon!
            </AnnouncementBarContent>
            <AnnouncementBarDismiss onClick={() => setShowFloating(false)} />
          </AnnouncementBar>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Floating demo was dismissed</span>
          <Button size="sm" onClick={() => setShowFloating(true)}>
            Show Again
          </Button>
        </div>
      )}
    </>
  )
}

const animationCode = `import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
} from "@/components/ui/announcement-bar"

export function AnimationDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="info" animation="slide">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Slide animation (default)</AnnouncementBarContent>
      </AnnouncementBar>

      <AnnouncementBar variant="success" animation="fade">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Fade animation</AnnouncementBarContent>
      </AnnouncementBar>

      <AnnouncementBar variant="warning" animation="scale">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Scale animation</AnnouncementBarContent>
      </AnnouncementBar>

      <AnnouncementBar variant="default" animation="none">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>No animation</AnnouncementBarContent>
      </AnnouncementBar>
    </div>
  )
}`

function AnimationDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="info" animation="slide">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Slide animation (default)
        </AnnouncementBarContent>
      </AnnouncementBar>

      <AnnouncementBar variant="success" animation="fade">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Fade animation
        </AnnouncementBarContent>
      </AnnouncementBar>

      <AnnouncementBar variant="warning" animation="scale">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Scale animation
        </AnnouncementBarContent>
      </AnnouncementBar>

      <AnnouncementBar variant="default" animation="none">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          No animation
        </AnnouncementBarContent>
      </AnnouncementBar>
    </div>
  )
}

const stackedCode = `import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
  AnnouncementStack,
} from "@/components/ui/announcement-bar"

export function StackedDemo() {
  return (
    <div className="border rounded-lg p-4 bg-muted/10">
      <AnnouncementStack maxVisible={2}>
        <AnnouncementBar variant="info" className="relative">
          <AnnouncementBarIcon icon={<IconRocket className="h-5 w-5" />} />
          <AnnouncementBarContent>First announcement: New version available!</AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>

        <AnnouncementBar variant="success" className="relative">
          <AnnouncementBarIcon icon={<IconGift className="h-5 w-5" />} />
          <AnnouncementBarContent>Second announcement: You've earned a reward!</AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>

        <AnnouncementBar variant="warning" className="relative">
          <AnnouncementBarIcon />
          <AnnouncementBarContent>Third announcement: Action required soon</AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>

        <AnnouncementBar variant="destructive" className="relative">
          <AnnouncementBarIcon />
          <AnnouncementBarContent>Fourth announcement: Critical update</AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>
      </AnnouncementStack>
    </div>
  )
}`

function StackedDemo() {
  return (
    <div className="border rounded-lg p-4 bg-muted/10">
      <AnnouncementStack maxVisible={2}>
        <AnnouncementBar variant="info" className="relative">
          <AnnouncementBarIcon icon={<IconRocket className="h-5 w-5" />} />
          <AnnouncementBarContent>
            First announcement: New version available!
          </AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>

        <AnnouncementBar variant="success" className="relative">
          <AnnouncementBarIcon icon={<IconGift className="h-5 w-5" />} />
          <AnnouncementBarContent>
            Second announcement: You've earned a reward!
          </AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>

        <AnnouncementBar variant="warning" className="relative">
          <AnnouncementBarIcon />
          <AnnouncementBarContent>
            Third announcement: Action required soon
          </AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>

        <AnnouncementBar variant="destructive" className="relative">
          <AnnouncementBarIcon />
          <AnnouncementBarContent>
            Fourth announcement: Critical update
          </AnnouncementBarContent>
          <AnnouncementBarDismiss />
        </AnnouncementBar>
      </AnnouncementStack>
    </div>
  )
}

const dismissCode = `import { useAnnouncementDismiss } from "@/components/ui/announcement-bar"

export function DismissDemo() {
  const [isPersistentDismissed, persistentDismiss, resetPersistent] =
    useAnnouncementDismiss("persistent-demo", "persistent")
  const [isSessionDismissed, sessionDismiss, resetSession] =
    useAnnouncementDismiss("session-demo", "session")

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Persistent */}
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Persistent (localStorage)</h3>
        {!isPersistentDismissed ? (
          <AnnouncementBar variant="info" className="relative">
            <AnnouncementBarIcon />
            <AnnouncementBarContent>Survives browser restart</AnnouncementBarContent>
            <AnnouncementBarDismiss onClick={persistentDismiss} />
          </AnnouncementBar>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dismissed</span>
            <Button size="sm" variant="outline" onClick={resetPersistent}>
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Session */}
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Session (sessionStorage)</h3>
        {!isSessionDismissed ? (
          <AnnouncementBar variant="success" className="relative">
            <AnnouncementBarIcon />
            <AnnouncementBarContent>Clears on browser close</AnnouncementBarContent>
            <AnnouncementBarDismiss onClick={sessionDismiss} />
          </AnnouncementBar>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dismissed</span>
            <Button size="sm" variant="outline" onClick={resetSession}>
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}`

function DismissDemo() {
  const [isPersistentDismissed, persistentDismiss, resetPersistent] =
    useAnnouncementDismiss("persistent-demo", "persistent")
  const [isSessionDismissed, sessionDismiss, resetSession] =
    useAnnouncementDismiss("session-demo", "session")

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Persistent (localStorage)</h3>
        {!isPersistentDismissed ? (
          <AnnouncementBar variant="info" className="relative">
            <AnnouncementBarIcon />
            <AnnouncementBarContent>
              Survives browser restart
            </AnnouncementBarContent>
            <AnnouncementBarDismiss onClick={persistentDismiss} />
          </AnnouncementBar>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dismissed</span>
            <Button size="sm" variant="outline" onClick={resetPersistent}>
              Reset
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Session (sessionStorage)</h3>
        {!isSessionDismissed ? (
          <AnnouncementBar variant="success" className="relative">
            <AnnouncementBarIcon />
            <AnnouncementBarContent>
              Clears on browser close
            </AnnouncementBarContent>
            <AnnouncementBarDismiss onClick={sessionDismiss} />
          </AnnouncementBar>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dismissed</span>
            <Button size="sm" variant="outline" onClick={resetSession}>
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const expiryCode = `import { useMemo } from "react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
  useAnnouncementExpiry,
} from "@/components/ui/announcement-bar"

export function ExpiryDemo() {
  const expiryDate = useMemo(() => new Date(Date.now() + 60 * 1000), [])
  const isExpired = useAnnouncementExpiry(expiryDate)

  return !isExpired ? (
    <AnnouncementBar variant="warning">
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        This announcement expires in ~1 minute (demo purposes)
      </AnnouncementBarContent>
      <AnnouncementBarDismiss />
    </AnnouncementBar>
  ) : (
    <div className="p-4 border rounded-lg bg-muted/30">
      <p className="text-sm text-muted-foreground">
        This announcement has expired. Refresh the page to see it again.
      </p>
    </div>
  )
}`

function ExpiryDemo() {
  const expiryDate = React.useMemo(() => new Date(Date.now() + 60 * 1000), [])
  const isExpired = useAnnouncementExpiry(expiryDate)

  return !isExpired ? (
    <AnnouncementBar variant="warning">
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        This announcement expires in ~1 minute (demo purposes)
      </AnnouncementBarContent>
      <AnnouncementBarDismiss />
    </AnnouncementBar>
  ) : (
    <div className="p-4 border rounded-lg bg-muted/30">
      <p className="text-sm text-muted-foreground">
        This announcement has expired. Refresh the page to see it again.
      </p>
    </div>
  )
}

const actionCode = `import { useState } from "react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
} from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function ActionDemo() {
  const [showActionDemo, setShowActionDemo] = useState(true)

  return showActionDemo ? (
    <AnnouncementBar variant="info">
      <AnnouncementBarIcon icon={<IconSparkles className="h-5 w-5" />} />
      <AnnouncementBarContent>
        <span>New feature available: Learn more in our documentation</span>
        <AnnouncementBarAction href="/docs" className="ml-2">
          View Docs
          <IconExternalLink className="h-3 w-3" />
        </AnnouncementBarAction>
      </AnnouncementBarContent>
      <AnnouncementBarDismiss onClick={() => setShowActionDemo(false)} />
    </AnnouncementBar>
  ) : (
    <Button size="sm" onClick={() => setShowActionDemo(true)}>
      Show Again
    </Button>
  )
}`

function ActionDemo() {
  const [showActionDemo, setShowActionDemo] = React.useState(true)

  return (
    <>
      {showActionDemo ? (
        <AnnouncementBar variant="info">
          <AnnouncementBarIcon icon={<IconSparkles className="h-5 w-5" />} />
          <AnnouncementBarContent>
            <span>New feature available: Learn more in our documentation</span>
            <AnnouncementBarAction href="/docs" className="ml-2">
              View Docs
              <IconExternalLink className="h-3 w-3" />
            </AnnouncementBarAction>
          </AnnouncementBarContent>
          <AnnouncementBarDismiss onClick={() => setShowActionDemo(false)} />
        </AnnouncementBar>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Action demo was dismissed</span>
          <Button size="sm" onClick={() => setShowActionDemo(true)}>
            Show Again
          </Button>
        </div>
      )}
    </>
  )
}

const accessibilityCode = `import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarDismiss,
} from "@/components/ui/announcement-bar"

export function AccessibilityDemo() {
  return (
    <AnnouncementBar variant="destructive" priority="critical" urgency="assertive">
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        Critical alert: Screen readers will announce immediately (aria-live="assertive")
      </AnnouncementBarContent>
      <AnnouncementBarDismiss />
    </AnnouncementBar>
  )
}`

function AccessibilityDemo() {
  return (
    <>
      <div className="p-4 border rounded-lg bg-muted/10 space-y-4 mb-4">
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>aria-live:</strong> "polite" for normal announcements, "assertive" for
            critical
          </li>
          <li>
            <strong>role:</strong> "status" for normal, "alert" for critical priority
          </li>
          <li>
            <strong>44x44px touch targets:</strong> Dismiss button meets WCAG 2.5.8
          </li>
          <li>
            <strong>Focus indicators:</strong> Visible focus rings on all interactive elements
          </li>
          <li>
            <strong>prefers-reduced-motion:</strong> Animations disabled when user preference set
          </li>
          <li>
            <strong>Keyboard navigation:</strong> Tab through all interactive elements
          </li>
        </ul>
      </div>

      <AnnouncementBar variant="destructive" priority="critical" urgency="assertive">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>
          Critical alert: Screen readers will announce immediately (aria-live="assertive")
        </AnnouncementBarContent>
        <AnnouncementBarDismiss />
      </AnnouncementBar>
    </>
  )
}

export default function AnnouncementBarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Announcement Bar"
        description="Site-wide notification banner with accessibility, animations, and stacking support"
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description: "WCAG 2.2 AA compliant with proper ARIA live regions and roles",
            icon: <IconAccessible className="h-5 w-5 text-primary" />,
          },
          {
            title: "Dismissable",
            description: "Persistent or session-based dismiss with custom hooks",
            icon: <IconBell className="h-5 w-5 text-primary" />,
          },
          {
            title: "Animated",
            description: "Slide, fade, and scale animations with reduced-motion support",
            icon: <IconClock className="h-5 w-5 text-primary" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="variants"
        tabs={[
          { value: "variants", label: "Variants", demo: <DemoWrapper title="All Variants" description="Default, info, success, warning, and destructive styles" code={variantsCode}><VariantsDemo /></DemoWrapper> },
          { value: "priority", label: "Priority", demo: <DemoWrapper title="Priority Levels" description="Priority affects visual weight and screen reader behavior (critical uses role='alert')" code={priorityCode}><PriorityDemo /></DemoWrapper> },
          { value: "auto-dismiss", label: "Auto-Dismiss", demo: <DemoWrapper title="Auto-Dismiss with Countdown" description="Automatically dismisses after a set time. Hover to pause the countdown." code={autoDismissCode}><AutoDismissDemo /></DemoWrapper> },
          { value: "floating", label: "Floating", demo: <DemoWrapper title="Floating Position" description="Centered floating banner with rounded corners and shadow" code={floatingCode}><FloatingDemo /></DemoWrapper> },
          { value: "animation", label: "Animation", demo: <DemoWrapper title="Animation Types" description="Slide, fade, and scale animations (respects prefers-reduced-motion)" code={animationCode}><AnimationDemo /></DemoWrapper> },
          { value: "stacked", label: "Stacked", demo: <DemoWrapper title="Stacked Announcements" description="Multiple announcements stacked vertically. Hover to see all, click to expand." code={stackedCode}><StackedDemo /></DemoWrapper> },
          { value: "dismiss", label: "Dismiss", demo: <DemoWrapper title="Dismiss Persistence" description="Choose between localStorage (persistent) or sessionStorage (session only)" code={dismissCode}><DismissDemo /></DemoWrapper> },
          { value: "expiry", label: "Expiry", demo: <DemoWrapper title="Expiration Date" description="Auto-hide announcements after a specific date/time" code={expiryCode}><ExpiryDemo /></DemoWrapper> },
          { value: "action", label: "Action", demo: <DemoWrapper title="With Action CTA" description="Include a call-to-action link or button" code={actionCode}><ActionDemo /></DemoWrapper> },
          { value: "accessibility", label: "Accessibility", demo: <DemoWrapper title="Accessibility Features" description="WCAG 2.2 AA compliant with proper ARIA attributes" code={accessibilityCode}><AccessibilityDemo /></DemoWrapper> },
        ]}
      />

      <UsageBlock
        code={`import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  AnnouncementStack,
} from "@/components/ui/announcement-bar"

function Example() {
  return (
    <AnnouncementBar variant="info" priority="normal">
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        <span>Update available</span>
        <AnnouncementBarAction href="/changelog">
          View details
        </AnnouncementBarAction>
      </AnnouncementBarContent>
      <AnnouncementBarDismiss />
    </AnnouncementBar>
  )
}`}
      />

      <APIReference
        sections={[
          {
            title: "AnnouncementBar",
            props: [
              { prop: "variant", type: "'default' | 'info' | 'success' | 'warning' | 'destructive'", default: "'default'", description: "Visual style variant of the announcement bar" },
              { prop: "priority", type: "'low' | 'normal' | 'high' | 'critical'", default: "'normal'", description: "Affects visual weight and screen reader behavior. Critical uses role='alert'" },
              { prop: "position", type: "'default' | 'floating'", default: "'default'", description: "Positioning of the announcement bar" },
              { prop: "animation", type: "'slide' | 'fade' | 'scale' | 'none'", default: "'slide'", description: "Animation type on mount/dismiss. Respects prefers-reduced-motion" },
              { prop: "autoDismiss", type: "number", default: "undefined", description: "Auto-dismiss after specified milliseconds. Hover pauses countdown" },
              { prop: "showProgress", type: "boolean", default: "false", description: "Shows a progress bar for auto-dismiss countdown" },
              { prop: "onDismiss", type: "() => void", default: "undefined", description: "Callback fired when the announcement is dismissed" },
              { prop: "urgency", type: "'polite' | 'assertive'", default: "'polite'", description: "ARIA live region urgency for screen readers" },
            ],
          },
          {
            title: "AnnouncementBarIcon",
            props: [
              { prop: "icon", type: "ReactNode", default: "undefined", description: "Custom icon to display. If not provided, uses default icon based on variant" },
            ],
          },
          {
            title: "AnnouncementBarContent",
            props: [
              { prop: "children", type: "ReactNode", default: "required", description: "Content of the announcement" },
            ],
          },
          {
            title: "AnnouncementBarAction",
            props: [
              { prop: "href", type: "string", default: "undefined", description: "URL to navigate to when clicked" },
              { prop: "children", type: "ReactNode", default: "required", description: "Action button content" },
              { prop: "className", type: "string", default: "undefined", description: "Additional classes for the action button" },
            ],
          },
          {
            title: "AnnouncementBarDismiss",
            props: [
              { prop: "onClick", type: "() => void", default: "undefined", description: "Callback fired when dismiss button is clicked" },
            ],
          },
          {
            title: "AnnouncementStack",
            props: [
              { prop: "maxVisible", type: "number", default: "2", description: "Maximum number of announcements to show before stacking" },
              { prop: "children", type: "ReactNode", default: "required", description: "AnnouncementBar children to stack" },
            ],
          },
          {
            title: "useAnnouncementDismiss",
            props: [
              { prop: "key", type: "string", default: "required", description: "Unique storage key for the dismissal state" },
              { prop: "storageType", type: "'persistent' | 'session'", default: "'persistent'", description: "Type of storage: localStorage or sessionStorage" },
              { prop: "returns", type: "[boolean, () => void, () => void]", default: "-", description: "[isDismissed, dismiss, reset] tuple" },
            ],
          },
          {
            title: "useAnnouncementExpiry",
            props: [
              { prop: "expiryDate", type: "Date", default: "required", description: "Date when the announcement should expire" },
              { prop: "returns", type: "boolean", default: "-", description: "true if expired, false otherwise" },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
