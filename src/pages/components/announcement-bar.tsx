import * as React from "react"
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
  IconExternalLink,
  IconSparkles,
  IconRocket,
  IconGift,
} from "@tabler/icons-react"

export default function AnnouncementBarPage() {
  const [_isDismissed, _dismiss, _resetDismiss] = useAnnouncementDismiss("demo")
  const [isPersistentDismissed, persistentDismiss, resetPersistent] = useAnnouncementDismiss("persistent-demo")
  const [isSessionDismissed, sessionDismiss, resetSession] = useAnnouncementDismiss("session-demo", "session")
  const [showActionDemo, setShowActionDemo] = React.useState(true)
  const [showAutoDismiss, setShowAutoDismiss] = React.useState(true)
  const [showFloating, setShowFloating] = React.useState(true)

  // Expiry demo - expires in 1 minute from page load
  const expiryDate = React.useMemo(() => new Date(Date.now() + 60 * 1000), [])
  const isExpired = useAnnouncementExpiry(expiryDate)

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Announcement Bar</h1>
        <p className="text-muted-foreground">
          Site-wide notification banner with accessibility, animations, and stacking support
        </p>
      </div>

      {/* All Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Variants</h2>
        <p className="text-muted-foreground">Default, info, success, warning, and destructive styles</p>

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
      </section>

      {/* Priority Levels */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Priority Levels</h2>
        <p className="text-muted-foreground">
          Priority affects visual weight and screen reader behavior (critical uses role="alert")
        </p>

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
      </section>

      {/* Auto-Dismiss with Countdown */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Auto-Dismiss with Countdown</h2>
        <p className="text-muted-foreground">
          Automatically dismisses after a set time. Hover to pause the countdown.
        </p>

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
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Auto-dismiss demo was dismissed</p>
            <Button size="sm" onClick={() => setShowAutoDismiss(true)}>
              Show Again
            </Button>
          </div>
        )}
      </section>

      {/* Floating Position */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Floating Position</h2>
        <p className="text-muted-foreground">
          Centered floating banner with rounded corners and shadow
        </p>

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
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Floating demo was dismissed</p>
            <Button size="sm" onClick={() => setShowFloating(true)}>
              Show Again
            </Button>
          </div>
        )}
      </section>

      {/* Animation Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Animation Types</h2>
        <p className="text-muted-foreground">
          Slide, fade, and scale animations (respects prefers-reduced-motion)
        </p>

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
      </section>

      {/* Stacked Announcements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Stacked Announcements</h2>
        <p className="text-muted-foreground">
          Multiple announcements stacked vertically. Hover to see all, click to expand.
        </p>

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
      </section>

      {/* Persistent vs Session Dismiss */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dismiss Persistence</h2>
        <p className="text-muted-foreground">
          Choose between localStorage (persistent) or sessionStorage (session only)
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Persistent */}
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

          {/* Session */}
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
      </section>

      {/* Expiration Date */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Expiration Date</h2>
        <p className="text-muted-foreground">
          Auto-hide announcements after a specific date/time
        </p>

        {!isExpired ? (
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
        )}
      </section>

      {/* With Action CTA */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Action CTA</h2>
        <p className="text-muted-foreground">
          Include a call-to-action link or button
        </p>

        {showActionDemo && (
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
        )}

        {!showActionDemo && (
          <Button size="sm" onClick={() => setShowActionDemo(true)}>
            Show Again
          </Button>
        )}
      </section>

      {/* Accessibility Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility Features</h2>
        <p className="text-muted-foreground">
          WCAG 2.2 AA compliant with proper ARIA attributes
        </p>

        <div className="p-4 border rounded-lg bg-muted/10 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>aria-live:</strong> "polite" for normal announcements, "assertive" for critical</li>
            <li><strong>role:</strong> "status" for normal, "alert" for critical priority</li>
            <li><strong>44x44px touch targets:</strong> Dismiss button meets WCAG 2.5.8</li>
            <li><strong>Focus indicators:</strong> Visible focus rings on all interactive elements</li>
            <li><strong>prefers-reduced-motion:</strong> Animations disabled when user preference set</li>
            <li><strong>Keyboard navigation:</strong> Tab through all interactive elements</li>
          </ul>

          <AnnouncementBar variant="destructive" priority="critical" urgency="assertive">
            <AnnouncementBarIcon />
            <AnnouncementBarContent>
              Critical alert: Screen readers will announce immediately (aria-live="assertive")
            </AnnouncementBarContent>
            <AnnouncementBarDismiss />
          </AnnouncementBar>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Hooks API</h2>

        <div className="p-4 bg-muted rounded-lg space-y-4">
          <div>
            <h3 className="font-medium mb-2">useAnnouncementDismiss</h3>
            <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`const [isDismissed, dismiss, reset] = useAnnouncementDismiss(
  "unique-key",    // Storage key
  "persistent"     // "persistent" (localStorage) or "session" (sessionStorage)
)`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">useAnnouncementExpiry</h3>
            <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`const isExpired = useAnnouncementExpiry(
  new Date("2025-12-31")  // Expiration date
)`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
