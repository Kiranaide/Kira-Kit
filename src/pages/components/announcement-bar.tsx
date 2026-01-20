import * as React from "react"
import { AnnouncementBar, AnnouncementBarContent, AnnouncementBarAction, AnnouncementBarDismiss, useAnnouncementDismiss } from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"
import { IconX, IconInfoCircle, IconCheck, IconAlertTriangle, IconAlertCircle, IconExternalLink } from "@tabler/icons-react"

export default function AnnouncementBarPage() {
  const [isDismissed, dismiss] = useAnnouncementDismiss("demo")
  const [isPersistentDismissed, persistentDismiss] = useAnnouncementDismiss("persistent-demo")
  const [showActionDemo, setShowActionDemo] = React.useState(true)

  if (isDismissed) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Announcement Bar</h1>
          <p className="text-muted-foreground">The announcement bar has been dismissed</p>
        </div>
        <Button onClick={() => {
          localStorage.removeItem("announcement-demo")
          window.location.reload()
        }}>
          Reset Dismissal
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Announcement Bar</h1>
        <p className="text-muted-foreground">Site-wide notification banner with dismissible action</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Variants</h2>
        <p className="text-muted-foreground">Default, info, success, warning, and destructive styles</p>

        <div className="space-y-4">
          <AnnouncementBar variant="default">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconInfoCircle className="h-5 w-5" />
                <span>This is the default announcement style</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>

          <AnnouncementBar variant="info">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconInfoCircle className="h-5 w-5 text-blue-500" />
                <span>New feature: Dashboard analytics is now live!</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>

          <AnnouncementBar variant="success">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconCheck className="h-5 w-5 text-green-500" />
                <span>Your changes have been saved successfully</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>

          <AnnouncementBar variant="warning">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconAlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Your subscription expires in 3 days</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>

          <AnnouncementBar variant="destructive">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconAlertCircle className="h-5 w-5" />
                <span>Critical: Please update your payment method</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dismissible</h2>
        <p className="text-muted-foreground">With dismiss state management (uses useAnnouncementDismiss hook)</p>

        <div className="p-4 border rounded-lg space-y-4">
          <AnnouncementBar variant="info">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconInfoCircle className="h-5 w-5 text-blue-500" />
                <span>This bar can be dismissed. Click the X to dismiss and refresh to see it's remembered.</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss onClick={dismiss}>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>
          <p className="text-sm text-muted-foreground">Dismiss state is persisted to localStorage</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Persistent Dismiss</h2>
        <p className="text-muted-foreground">Remembers dismissal across sessions</p>

        {!isPersistentDismissed && (
          <div className="p-4 border rounded-lg space-y-4">
            <AnnouncementBar variant="success">
              <AnnouncementBarContent>
                <div className="flex items-center gap-3">
                  <IconCheck className="h-5 w-5 text-green-500" />
                  <span>This dismissal persists across page refreshes and browser sessions</span>
                </div>
              </AnnouncementBarContent>
              <AnnouncementDismiss onClick={persistentDismiss}>
                <IconX className="h-4 w-4" />
              </AnnouncementDismiss>
            </AnnouncementBar>
            <p className="text-sm text-muted-foreground">Key: "persistent-demo" in localStorage</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Positions</h2>
        <p className="text-muted-foreground">Top (sticky) vs bottom (fixed)</p>

        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="font-medium">Top Position (Sticky)</h3>
            <p className="text-sm text-muted-foreground">Stays at the top of the viewport when scrolling</p>
            <AnnouncementBar variant="default" position="top">
              <AnnouncementBarContent>
                <div className="flex items-center gap-3">
                  <IconInfoCircle className="h-5 w-5" />
                  <span>This bar is sticky at the top</span>
                </div>
              </AnnouncementBarContent>
              <AnnouncementDismiss>
                <IconX className="h-4 w-4" />
              </AnnouncementDismiss>
            </AnnouncementBar>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Bottom Position (Fixed)</h3>
            <p className="text-sm text-muted-foreground">Fixed at the bottom of the viewport</p>
            <AnnouncementBar variant="info" position="bottom">
              <AnnouncementBarContent>
                <div className="flex items-center gap-3">
                  <IconInfoCircle className="h-5 w-5 text-blue-500" />
                  <span>This bar is fixed at the bottom</span>
                </div>
              </AnnouncementBarContent>
              <AnnouncementDismiss>
                <IconX className="h-4 w-4" />
              </AnnouncementDismiss>
            </AnnouncementBar>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Action</h2>
        <p className="text-muted-foreground">CTA link/button</p>

        {showActionDemo && (
          <AnnouncementBar variant="info">
            <AnnouncementBarContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <IconInfoCircle className="h-5 w-5 text-blue-500" />
                  <span>New feature available: Learn more in our documentation</span>
                </div>
                <AnnouncementBarAction href="/docs" target="_blank" className="flex items-center gap-1 text-sm font-medium hover:underline">
                  View Docs
                  <IconExternalLink className="h-3 w-3" />
                </AnnouncementBarAction>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss onClick={() => setShowActionDemo(false)}>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Animated</h2>
        <p className="text-muted-foreground">Entrance/exit animations</p>

        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">
            Add animations using Tailwind CSS transitions or the tailwind-animate library:
          </p>
          <AnnouncementBar className="transition-all duration-300 ease-in-out" variant="success">
            <AnnouncementBarContent>
              <div className="flex items-center gap-3">
                <IconCheck className="h-5 w-5 text-green-500" />
                <span>Animated announcement bar</span>
              </div>
            </AnnouncementBarContent>
            <AnnouncementDismiss>
              <IconX className="h-4 w-4" />
            </AnnouncementDismiss>
          </AnnouncementBar>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Use AnnouncementDismiss Hook</h2>
        <p className="text-muted-foreground">Code example for persistent dismissals</p>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <p className="font-mono text-sm">
            const [isDismissed, dismiss] = useAnnouncementDismiss("unique-key")
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            {/* isDismissed: boolean - current state */}
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            {/* dismiss: function - call to dismiss and persist */}
          </p>
        </div>
      </section>
    </div>
  )
}
