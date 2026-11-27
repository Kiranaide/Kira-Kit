import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconBell, IconClock, IconShieldCheck } from "@tabler/icons-react";

import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarPause,
  AnnouncementBarProgress,
  AnnouncementBarCountdown,
  AnnouncementRotator,
  AnnouncementStack,
  KiraAnnouncementBar,
  useAnnouncementDismiss,
  useAnnouncementConsent,
  useAnnouncementExpiry,
  useCountdown,
  type PersistMode,
} from "@/components/ui/announcement-bar";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const rotationMessages = [
  "View deployment changes before publishing.",
  "Portrait and landscape media share one stable frame.",
  "Code file tabs retain each file's draft.",
];

function getNoticeStatus(
  expired: boolean,
  countdown: ReturnType<typeof useCountdown>,
) {
  if (expired) return "The notice expired.";

  if (countdown !== null) return `Notice appears in ${countdown}.`;

  return "The notice is active.";
}

function simulateRequest(signal: AbortSignal, fail: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);

      if (fail) reject(new Error("The preview service is unavailable."));
      else resolve();
    }, 2500);

    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  });
}

function BasicDemo() {
  const [saved, setSaved] = React.useState(false);

  return (
    <AnnouncementBar variant="info" animation="none" dismissible>
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        {saved
          ? "You will receive release updates."
          : "Kira Kit v3 components are ready to review."}
      </AnnouncementBarContent>
      <AnnouncementBarAction
        variant="outline"
        onClick={() => setSaved(true)}
        disabled={saved}
      >
        {saved ? "Subscribed" : "Get updates"}
      </AnnouncementBarAction>
    </AnnouncementBar>
  );
}

function VariantsDemo() {
  return (
    <div className="space-y-3">
      <KiraAnnouncementBar
        message="The next release review starts at 14:00."
        animation="none"
      />
      <KiraAnnouncementBar
        variant="info"
        message="A deployment preview is available."
        animation="none"
      />
      <KiraAnnouncementBar
        variant="success"
        message="Your workspace backup is complete."
        animation="none"
      />
      <KiraAnnouncementBar
        variant="warning"
        message="Scheduled maintenance may delay exports."
        animation="none"
      />
      <KiraAnnouncementBar
        variant="destructive"
        priority="critical"
        message="File uploads are unavailable. Existing files remain accessible."
        animation="none"
      />
    </div>
  );
}

function RotationDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="info" animation="none">
        <AnnouncementRotator
          messages={rotationMessages}
          rotateInterval={6000}
        />
      </AnnouncementBar>
      <p className="text-sm text-muted-foreground">
        Previous and Next stop rotation. Focus stops it until you choose Resume.
        Hover pauses while the pointer stays inside.
      </p>
    </div>
  );
}

function StackDemo() {
  return (
    <AnnouncementStack maxVisible={2}>
      <KiraAnnouncementBar
        message="A deployment preview is ready."
        variant="info"
        animation="none"
      />
      <KiraAnnouncementBar
        message="Your backup is complete."
        variant="success"
        animation="none"
      />
      <AnnouncementBar animation="none">
        <AnnouncementBarContent>
          <label className="flex flex-wrap items-center gap-2">
            Release note{" "}
            <input
              aria-label="Retained release note"
              className="rounded-md border border-border bg-background px-2 py-1"
              defaultValue="Keep this draft"
            />
          </label>
        </AnnouncementBarContent>
      </AnnouncementBar>
      <KiraAnnouncementBar
        message="Maintenance starts later today."
        variant="warning"
        animation="none"
      />
    </AnnouncementStack>
  );
}

function KiraDemo({ active }: { active: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Show floating notice
      </Button>
      <p className="text-sm text-muted-foreground">
        The default notice stays in the document. Pinned notices yield when they
        would cover an external keyboard focus target.
      </p>
      {active && open && (
        <KiraAnnouncementBar
          position="floating"
          variant="info"
          message="The floating notice can be dismissed."
          dismissible
          onDismiss={() => setOpen(false)}
          animation="scale"
        />
      )}
    </div>
  );
}

function TimerDemo() {
  const [version, setVersion] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  return (
    <div className="space-y-4">
      {visible ? (
        <KiraAnnouncementBar
          key={version}
          variant="success"
          message="Your export is ready. It remains available on the Exports page."
          autoDismiss={12_000}
          showProgress
          dismissible
          onDismiss={() => setVisible(false)}
          animation="fade"
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Notice dismissed. Your export remains available.
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setVersion((value) => value + 1);
          setVisible(true);
        }}
      >
        Restart notice
      </Button>
    </div>
  );
}

function DeadlineDemo() {
  const [deadline, setDeadline] = React.useState(
    () => new Date(Date.now() + 90_000),
  );

  const [paused, setPaused] = React.useState(false);

  return (
    <div className="space-y-4">
      <KiraAnnouncementBar
        variant="warning"
        message="A maintenance window begins soon."
        countdownTo={deadline}
        countdownPrefix="Starts in"
        paused={paused}
        onPausedChange={setPaused}
        animation="none"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Resume display" : "Pause display"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDeadline(new Date(Date.now() + 90_000))}
        >
          New deadline
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setDeadline(new Date(Date.now() - 1000))}
        >
          Show ended state
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Deadline:{" "}
        <time dateTime={deadline.toISOString()}>
          {deadline.toLocaleTimeString()}
        </time>
        . Pausing freezes the display without changing the deadline.
      </p>
    </div>
  );
}

function ScheduleDemo() {
  const [start, setStart] = React.useState(() => new Date(Date.now() + 8000));
  const [end, setEnd] = React.useState(() => new Date(Date.now() + 24_000));
  const expired = useAnnouncementExpiry(end);
  const countdown = useCountdown(start);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {getNoticeStatus(expired, countdown)}
      </p>
      <KiraAnnouncementBar
        message="Maintenance is in progress. Saved work remains available."
        variant="warning"
        startsAt={start}
        expiresAt={end}
        animation="none"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setStart(new Date(Date.now() + 8000));
          setEnd(new Date(Date.now() + 24_000));
        }}
      >
        Restart schedule
      </Button>
    </div>
  );
}

function AsyncDemo() {
  const [fail, setFail] = React.useState(true);
  const [version, setVersion] = React.useState(0);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Local fixture: first request fails, retry succeeds, and Cancel stops the
        pending request.
      </p>
      <KiraAnnouncementBar
        key={version}
        variant="info"
        message="Review a deployment preview before publishing."
        dismissible
        animation="none"
        action={{
          id: "preview",
          label: "Prepare preview",
          variant: "button",
          onClick: async ({ signal }) => {
            try {
              await simulateRequest(signal, fail);
            } catch (error) {
              if (!signal.aborted) setFail(false);
              throw error;
            }
          },
        }}
        successMessage="Your preview is ready to review."
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setFail(true);
          setVersion((value) => value + 1);
        }}
      >
        Reset fixture
      </Button>
    </div>
  );
}

function ConsentDemo() {
  const [decision, , reset] = useAnnouncementConsent(
    "kira-demo-preferences",
    "session",
  );

  return (
    <div className="space-y-4">
      <KiraAnnouncementBar
        consent
        consentKey="kira-demo-preferences"
        persistMode="session"
        message="Allow optional product analytics?"
        acceptLabel="Allow analytics"
        rejectLabel="Use essential only"
        onAccept={({ signal }) => simulateRequest(signal, false)}
        onReject={({ signal }) => simulateRequest(signal, false)}
        animation="none"
      />
      <p className="text-sm text-muted-foreground">
        {decision === null
          ? "No choice saved. Both options are available."
          : `Saved choice: ${decision}.`}
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Reset preference
      </Button>
    </div>
  );
}

function PersistenceDemo() {
  const [notice, setNotice] = React.useState("maintenance");
  const [mode, setMode] = React.useState<PersistMode>("session");
  const key = `kira-demo-${notice}`;
  const [dismissed, , reset] = useAnnouncementDismiss(key, mode);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setNotice((value) =>
              value === "maintenance" ? "release" : "maintenance",
            )
          }
        >
          Switch notice
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setMode((value) => (value === "session" ? "persistent" : "session"))
          }
        >
          Use {mode === "session" ? "persistent" : "session"} storage
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset dismissal
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Notice: {notice}. Storage: {mode}.{" "}
        {dismissed
          ? "Dismissed in both instances."
          : "Both instances are visible."}
      </p>
      <KiraAnnouncementBar
        announcementId={key}
        persistMode={mode}
        message="This notice shares dismissal with the next instance."
        dismissible
        animation="none"
      />
      <KiraAnnouncementBar
        announcementId={key}
        persistMode={mode}
        message="Dismiss either instance to hide both."
        dismissible
        animation="none"
      />
    </div>
  );
}

function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <KiraAnnouncementBar
        message="Publishing is unavailable because you have viewer access."
        action={{ label: "Publish", onClick: () => {} }}
        disabled
        animation="none"
      />
      <AnnouncementBar animation="none">
        <AnnouncementBarContent marquee>
          Maintenance-notice-for-the-international-workspace-日本語-ภาษาไทย-العربية
        </AnnouncementBarContent>
        <AnnouncementBarPause />
      </AnnouncementBar>
      <AnnouncementRotator messages={[]} />
      <AnnouncementBar animation="none">
        <AnnouncementBarContent>
          A narrow notice with a long wrapping action label.
        </AnnouncementBarContent>
        <AnnouncementBarAction variant="outline">
          Review every deployment change for the international workspace
        </AnnouncementBarAction>
      </AnnouncementBar>
      <AnnouncementBar animation="none">
        <AnnouncementBarContent>Invalid deadline</AnnouncementBarContent>
        <AnnouncementBarCountdown to={new Date("invalid")} />
        <AnnouncementBarProgress value={Number.NaN} />
      </AnnouncementBar>
    </div>
  );
}

const basicCode = `import * as React from "react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
} from "@/components/ui/announcement-bar"

export function ReleaseNotice() {
  const [saved, setSaved] = React.useState(false)

  return (
    <AnnouncementBar variant="info" animation="none" dismissible>
      <AnnouncementBarIcon />
      <AnnouncementBarContent>
        {saved
          ? "You will receive release updates."
          : "Kira Kit v3 components are ready to review."}
      </AnnouncementBarContent>
      <AnnouncementBarAction
        variant="outline"
        onClick={() => setSaved(true)}
        disabled={saved}
      >
        {saved ? "Subscribed" : "Get updates"}
      </AnnouncementBarAction>
    </AnnouncementBar>
  )
}`;

const variantsCode = `import { KiraAnnouncementBar } from "@/components/ui/announcement-bar"

export function NoticeVariants() {
  return (
    <div className="space-y-3">
      <KiraAnnouncementBar message="The next release review starts at 14:00." animation="none" />
      <KiraAnnouncementBar variant="info" message="A deployment preview is available." animation="none" />
      <KiraAnnouncementBar variant="success" message="Your workspace backup is complete." animation="none" />
      <KiraAnnouncementBar variant="warning" message="Scheduled maintenance may delay exports." animation="none" />
      <KiraAnnouncementBar
        variant="destructive"
        priority="critical"
        message="File uploads are unavailable. Existing files remain accessible."
        animation="none"
      />
    </div>
  )
}`;

const rotationCode = `import { AnnouncementBar, AnnouncementRotator } from "@/components/ui/announcement-bar"

export function ReleaseRotator() {
  return (
    <AnnouncementBar variant="info" animation="none">
      <AnnouncementRotator
        rotateInterval={6000}
        messages={[
          "View deployment changes before publishing.",
          "Portrait and landscape media share one stable frame.",
          "Code file tabs retain each file's draft.",
        ]}
      />
    </AnnouncementBar>
  )
}`;

const stackCode = `import {
  AnnouncementStack,
  KiraAnnouncementBar,
  AnnouncementBar,
  AnnouncementBarContent,
} from "@/components/ui/announcement-bar"

export function NoticeStack() {
  return (
    <AnnouncementStack maxVisible={2}>
      <KiraAnnouncementBar message="A deployment preview is ready." variant="info" animation="none" />
      <KiraAnnouncementBar message="Your backup is complete." variant="success" animation="none" />
      <AnnouncementBar animation="none">
        <AnnouncementBarContent>
          <label>
            Release note <input defaultValue="Keep this draft" />
          </label>
        </AnnouncementBarContent>
      </AnnouncementBar>
      <KiraAnnouncementBar message="Maintenance starts later today." variant="warning" animation="none" />
    </AnnouncementStack>
  )
}`;

const kiraCode = `import * as React from "react"
import { KiraAnnouncementBar } from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function FloatingNotice() {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show floating notice</Button>
      {open && (
        <KiraAnnouncementBar
          position="floating"
          variant="info"
          message="The floating notice can be dismissed."
          dismissible
          onDismiss={() => setOpen(false)}
          animation="scale"
        />
      )}
    </div>
  )
}`;

const timerCode = `import * as React from "react"
import { KiraAnnouncementBar } from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function ExportNotice() {
  const [version, setVersion] = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="space-y-4">
      {visible && (
        <KiraAnnouncementBar
          key={version}
          variant="success"
          message="Your export is ready. It remains available on the Exports page."
          autoDismiss={12000}
          showProgress
          dismissible
          onDismiss={() => setVisible(false)}
          animation="fade"
        />
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setVersion((value) => value + 1)
          setVisible(true)
        }}
      >
        Restart notice
      </Button>
    </div>
  )
}`;

const deadlineCode = `import * as React from "react"
import { KiraAnnouncementBar } from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function MaintenanceCountdown() {
  const [deadline] = React.useState(() => new Date(Date.now() + 90000))
  const [paused, setPaused] = React.useState(false)

  return (
    <div>
      <KiraAnnouncementBar
        variant="warning"
        message="A maintenance window begins soon."
        countdownTo={deadline}
        countdownPrefix="Starts in"
        paused={paused}
        onPausedChange={setPaused}
        animation="none"
      />
      <Button aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        {paused ? "Resume display" : "Pause display"}
      </Button>
    </div>
  )
}`;

const scheduleCode = `import * as React from "react"
import {
  KiraAnnouncementBar,
  useAnnouncementExpiry,
  useCountdown,
} from "@/components/ui/announcement-bar"

export function ScheduledMaintenance() {
  const [start] = React.useState(() => new Date(Date.now() + 8000))
  const [end] = React.useState(() => new Date(Date.now() + 24000))
  const expired = useAnnouncementExpiry(end)
  const countdown = useCountdown(start)

  return (
    <div>
      <p>{expired ? "Notice expired" : countdown ? \`Notice appears in \${countdown}.\` : "Notice active"}</p>
      <KiraAnnouncementBar
        startsAt={start}
        expiresAt={end}
        variant="warning"
        message="Maintenance is in progress. Saved work remains available."
        animation="none"
      />
    </div>
  )
}`;

const asyncCode = `import { KiraAnnouncementBar } from "@/components/ui/announcement-bar"

export function PreviewNotice() {
  return (
    <KiraAnnouncementBar
      variant="info"
      message="Review a deployment preview before publishing."
      dismissible
      successMessage="Your preview is ready to review."
      action={{
        label: "Prepare preview",
        variant: "button",
        onClick: async ({ signal }) => {
          const response = await fetch("/api/preview", { method: "POST", signal })
          if (!response.ok) throw new Error("The preview service is unavailable.")
        },
      }}
    />
  )
}`;

const consentCode = `import { KiraAnnouncementBar, useAnnouncementConsent } from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function AnalyticsPreference() {
  const [decision, , reset] = useAnnouncementConsent("analytics", "session")

  return (
    <div>
      <KiraAnnouncementBar
        consent
        consentKey="analytics"
        persistMode="session"
        message="Allow optional product analytics?"
        acceptLabel="Allow analytics"
        rejectLabel="Use essential only"
        onAccept={async ({ signal }) => {
          const response = await fetch("/api/preferences", {
            method: "POST",
            signal,
            body: JSON.stringify({ analytics: true }),
          })
          if (!response.ok) throw new Error("Your preference was not saved.")
        }}
        onReject={async ({ signal }) => {
          const response = await fetch("/api/preferences", {
            method: "POST",
            signal,
            body: JSON.stringify({ analytics: false }),
          })
          if (!response.ok) throw new Error("Your preference was not saved.")
        }}
      />
      <p>{decision ?? "No saved choice"}</p>
      <Button onClick={reset}>Reset preference</Button>
    </div>
  )
}`;

const persistenceCode = `import { KiraAnnouncementBar, useAnnouncementDismiss } from "@/components/ui/announcement-bar"
import { Button } from "@/components/ui/button"

export function SavedNotice() {
  const [dismissed, , reset] = useAnnouncementDismiss("maintenance-2026", "session")

  return (
    <div>
      <KiraAnnouncementBar
        announcementId="maintenance-2026"
        persistMode="session"
        message="A maintenance window is scheduled."
        dismissible
        animation="none"
      />
      <p>{dismissed ? "Dismissed" : "Visible"}</p>
      <Button onClick={reset}>Reset dismissal</Button>
    </div>
  )
}`;

const stressCode = `import {
  KiraAnnouncementBar,
  AnnouncementRotator,
  AnnouncementBar,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarPause,
  AnnouncementBarCountdown,
  AnnouncementBarProgress,
} from "@/components/ui/announcement-bar"

export function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <KiraAnnouncementBar
        disabled
        animation="none"
        message="Publishing is unavailable because you have viewer access."
        action={{ label: "Publish", onClick: () => {} }}
      />
      <AnnouncementBar animation="none">
        <AnnouncementBarContent marquee>
          Maintenance-notice-for-the-international-workspace-日本語-ภาษาไทย-العربية
        </AnnouncementBarContent>
        <AnnouncementBarPause />
      </AnnouncementBar>
      <AnnouncementRotator messages={[]} />
      <AnnouncementBar animation="none">
        <AnnouncementBarContent>
          A narrow notice with a long wrapping action label.
        </AnnouncementBarContent>
        <AnnouncementBarAction variant="outline">
          Review every deployment change for the international workspace
        </AnnouncementBarAction>
      </AnnouncementBar>
      <AnnouncementBar animation="none">
        <AnnouncementBarContent>Invalid deadline</AnnouncementBarContent>
        <AnnouncementBarCountdown to={new Date("invalid")} />
        <AnnouncementBarProgress value={Number.NaN} />
      </AnnouncementBar>
    </div>
  )
}`;

const usageCode = `import * as React from "react"
import {
  AnnouncementBar,
  AnnouncementBarIcon,
  AnnouncementBarContent,
  AnnouncementBarAction,
  AnnouncementBarDismiss,
  AnnouncementBarPause,
  AnnouncementBarProgress,
  AnnouncementBarCountdown,
  AnnouncementRotator,
  AnnouncementStack,
  KiraAnnouncementBar,
} from "@/components/ui/announcement-bar"

export function NoticeParts() {
  const [deadline] = React.useState(() => new Date(Date.now() + 60000))

  return (
    <AnnouncementStack>
      <AnnouncementBar variant="info" animation="none">
        <AnnouncementBarIcon />
        <AnnouncementBarContent>Review the new release.</AnnouncementBarContent>
        <AnnouncementBarAction href="/components/code-block">
          View examples
        </AnnouncementBarAction>
        <AnnouncementBarCountdown to={deadline} />
        <AnnouncementBarPause />
        <AnnouncementBarDismiss />
        <AnnouncementBarProgress value={75} />
      </AnnouncementBar>
      <AnnouncementBar animation="none">
        <AnnouncementRotator
          messages={["A preview is ready.", "Your draft is saved."]}
        />
        <AnnouncementBarDismiss />
      </AnnouncementBar>
      <KiraAnnouncementBar
        message="Your backup is complete."
        variant="success"
        dismissible
      />
    </AnnouncementStack>
  )
}`;

export default function AnnouncementBarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Announcement Bar"
        description="Readable service notices, controlled rotation, and actions that can recover."
        version="v3.0.2"
      />

      <FeatureGrid
        features={announcementBarPageFeatures}
        description="Accessible banner notifications with reader control and durable state."
      />

      <DemoTabs defaultValue="basic" tabs={announcementBarPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={announcementBarPageShortcuts}
        description="Keyboard navigation and playback bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose primitives for custom banners or use KiraAnnouncementBar for end-to-end workflows."
        notes={announcementBarPageUsageNotes}
      />

      <APIReference
        sections={announcementBarPageAPISections}
        description="Props, hooks, and variants exported from announcement-bar."
      />

      <Changelog
        entries={announcementBarPageChangelogEntries}
        title="Changelog"
        description="Version history for Announcement Bar."
      />
    </ComponentPage>
  );
}

const announcementBarPageFeatures = [
  {
    title: "Reader control",
    description: "Pause rotation and extend timed notices.",
    icon: <IconClock aria-hidden="true" className="size-5" />,
  },
  {
    title: "Reliable actions",
    description: "Cancellation, retry and completion in the notice.",
    icon: <IconBell aria-hidden="true" className="size-5" />,
  },
  {
    title: "Saved decisions",
    description: "Separate reactive dismissal and consent keys.",
    icon: <IconShieldCheck aria-hidden="true" className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const announcementBarPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Release notice"
        description="Composable announcement bar with semantic icon, live content, and action."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Notice importance"
        description="Semantic surface variants and priority emphasis."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rotation",
    label: "Rotation",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Reader-controlled rotation"
        description="Previous, Next, and Pause controls with focus and hover pause behavior."
        code={rotationCode}
      >
        <RotationDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stack",
    label: "Stack",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Retained notices"
        description="Disclosure stack that keeps hidden notices and form drafts mounted."
        code={stackCode}
      >
        <StackDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Floating Kira",
    group: "KiraAnnouncementBar",
    demo: (active: boolean) => (
      <DemoWrapper
        title="Pinned Kira notice"
        description="Floating notice that yields when covering a focused element."
        code={kiraCode}
      >
        <KiraDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "timer",
    label: "Timer",
    group: "KiraAnnouncementBar",
    demo: (
      <DemoWrapper
        title="Extendable notice"
        description="Auto-dismiss countdown with progress indicator, Pause, and Extend controls."
        code={timerCode}
      >
        <TimerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "deadline",
    label: "Countdown",
    group: "KiraAnnouncementBar",
    demo: (
      <DemoWrapper
        title="A real deadline"
        description="Live deadline countdown with pauseable display and ended state."
        code={deadlineCode}
      >
        <DeadlineDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "schedule",
    label: "Schedule",
    group: "KiraAnnouncementBar",
    demo: (
      <DemoWrapper
        title="Scheduled maintenance"
        description="Visibility window driven by startsAt and expiresAt timestamps."
        code={scheduleCode}
      >
        <ScheduleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async",
    label: "Actions",
    group: "KiraAnnouncementBar",
    demo: (
      <DemoWrapper
        title="Cancellation and retry"
        description="AbortSignal-backed async action with inline Cancel and Try again recovery."
        code={asyncCode}
      >
        <AsyncDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "consent",
    label: "Consent",
    group: "KiraAnnouncementBar",
    demo: (
      <DemoWrapper
        title="Save a preference"
        description="Persists accepted or rejected decisions only after the async callback succeeds."
        code={consentCode}
      >
        <ConsentDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "persistence",
    label: "Persistence",
    group: "KiraAnnouncementBar",
    demo: (
      <DemoWrapper
        title="Shared keyed dismissal"
        description="Multiple instances sharing an announcementId stay synchronized across session or persistent storage."
        code={persistenceCode}
      >
        <PersistenceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Disabled state, long multilingual marquee text, empty rotator, wrapping action labels, and invalid deadlines in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const announcementBarPageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    group: "Base UI",
    description:
      "Reach actions, pause, disclosure, and dismiss controls (inherited from Base UI).",
  },
  {
    keys: "Enter / Space",
    group: "Base UI",
    description: "Activate buttons. Enter follows a navigation link.",
  },
  {
    keys: "Tab",
    group: "Rotation & Timer",
    description:
      "Entering the rotator stops automatic changes until Resume is explicitly activated.",
  },
  {
    keys: "Enter",
    group: "Rotation & Timer",
    description:
      "Previous/Next change the message and stop rotation; Extend restarts remaining time.",
  },
  {
    keys: "Enter",
    group: "Async Actions",
    description:
      "Cancel stops the pending action; Try again starts a new request.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const announcementBarPageUsageNotes = [
  {
    label: "KiraAnnouncementBar",
    body: "Use KiraAnnouncementBar for common service notices with async actions, AbortSignal cancellation, retry feedback, consent persistence, or countdowns.",
  },
  {
    label: "Composable primitives",
    body: "Use AnnouncementBar with AnnouncementBarIcon, AnnouncementBarContent, AnnouncementRotator, and AnnouncementStack when you need custom markup or bespoke controls via useAnnouncementBar.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const announcementBarPageAPISections = [
  {
    title: "AnnouncementBar",
    props: [
      {
        prop: "variant",
        type: "'default' | 'info' | 'success' | 'warning' | 'destructive'",
        default: "'default'",
        description: "Semantic surface with readable text.",
      },
      {
        prop: "position",
        type: "'inline' | 'top' | 'bottom' | 'floating'",
        default: "'inline'",
        description: "Pinned notices yield to covered focus targets.",
      },
      {
        prop: "priority / urgency",
        type: "'low' | 'normal' | 'high' | 'critical' / 'polite' | 'assertive'",
        default: "'normal' / 'polite'",
        description: "Critical content uses assertive urgency.",
      },
      {
        prop: "announcementId / persistMode",
        type: "string / 'session' | 'persistent'",
        default: "undefined / 'persistent'",
        description: "Reactive dismissal key and storage mode.",
      },
      {
        prop: "autoDismiss / showProgress",
        type: "number / boolean",
        default: "undefined / false",
        description:
          "Milliseconds, minimum 1000; supplies Pause and Extend controls.",
      },
      {
        prop: "paused / onPausedChange",
        type: "boolean / (paused: boolean) => void",
        default: "undefined",
        description:
          "Controlled pause; focus, hover, motion, and visibility can also stop the timer.",
      },
      {
        prop: "startsAt / expiresAt",
        type: "Date / Date",
        default: "undefined",
        description:
          "Real schedule timestamps; invalid dates do not hide a notice.",
      },
      {
        prop: "icon / marquee / dismissible",
        type: "ReactNode / boolean / boolean",
        default: "undefined / false / false",
        description: "Convenience parts; plain text receives content.",
      },
      {
        prop: "animation",
        type: "'slide' | 'fade' | 'scale' | 'none'",
        default: "'slide'",
        description: "Reduced-motion-gated entrance; dismissal is immediate.",
      },
      {
        prop: "disabled / onDismiss",
        type: "boolean / () => void",
        default: "false",
        description:
          "Disable actions and timers; notify once for user or timer dismissal.",
      },
      {
        prop: "native props / ref / render",
        type: "useRender.ComponentProps<'div'>",
        default: "-",
        description: "DOM props and Base UI render composition reach the root.",
      },
    ],
  },
  {
    title: "AnnouncementBarContent",
    props: [
      {
        prop: "marquee",
        type: "boolean",
        default: "false",
        description:
          "Moving text is capped at three loops with pause and visibility controls.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'div'>",
        default: "-",
        description: "One contextual live region; events compose.",
      },
    ],
  },
  {
    title: "AnnouncementBarIcon",
    props: [
      {
        prop: "icon / variant",
        type: "ReactNode / AnnouncementVariant",
        default: "undefined",
        description: "Undefined selects a semantic icon; null hides it.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'span'>",
        default: "-",
        description: "Decorative wrapper props.",
      },
    ],
  },
  {
    title: "AnnouncementBarAction",
    props: [
      {
        prop: "variant",
        type: "'link' | 'button' | 'outline'",
        default: "'link'",
        description: "Shared styling for actions and navigation.",
      },
      {
        prop: "href / target / rel / download",
        type: "string / string / string / string | boolean",
        default: "undefined",
        description: "Anchor attributes; disabled actions remove the URL.",
      },
      {
        prop: "nativeButton / render / native props",
        type: "ButtonPrimitive.Props",
        default: "-",
        description: "Base UI button composition and events.",
      },
    ],
  },
  {
    title: "AnnouncementBarDismiss / AnnouncementDismiss",
    props: [
      {
        prop: "label",
        type: "string",
        default: "'Dismiss announcement'",
        description: "Accessible button label.",
      },
      {
        prop: "onClick / native props",
        type: "React.ComponentProps<typeof Button>",
        default: "-",
        description:
          "External handler runs before dismissal; preventDefault cancels it.",
      },
    ],
  },
  {
    title: "AnnouncementBarPause",
    props: [
      {
        prop: "native props",
        type: "React.ComponentProps<typeof Button>",
        default: "-",
        description: "Pause or resume the enclosing timer.",
      },
    ],
  },
  {
    title: "AnnouncementBarProgress",
    props: [
      {
        prop: "value / variant",
        type: "number / AnnouncementVariant",
        default: "required / 'default'",
        description:
          "Finite 0-100 percentage with a named progressbar and transform fill.",
      },
      {
        prop: "duration / paused",
        type: "number / boolean",
        default: "undefined / false",
        description:
          "Optional one-shot linear CSS countdown in milliseconds, suspended with the enclosing timer. Omit duration for an interpolated percentage fill.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'div'>",
        default: "-",
        description: "Progress root props.",
      },
    ],
  },
  {
    title: "AnnouncementBarCountdown",
    props: [
      {
        prop: "to / prefix / expiredLabel",
        type: "Date / string / string",
        default: "required / 'Ends in' / 'Ended'",
        description:
          "Aligned two-digit unit cells; ticks never use a live region.",
      },
      {
        prop: "paused / native props",
        type: "boolean / React.ComponentProps<'span'>",
        default: "false",
        description: "Freeze the display while retaining the real deadline.",
      },
    ],
  },
  {
    title: "AnnouncementRotator",
    props: [
      {
        prop: "messages / rotateInterval",
        type: "ReactNode[] / number",
        default: "required / 6000",
        description: "Retained messages with minimum 1000ms cadence.",
      },
      {
        prop: "paused / onPausedChange / onIndexChange",
        type: "boolean / (paused: boolean) => void / (index: number) => void",
        default: "undefined",
        description: "Controlled pause and selection notifications.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'div'>",
        default: "-",
        description: "Compose events with focus and hover stops.",
      },
    ],
  },
  {
    title: "AnnouncementStack",
    props: [
      {
        prop: "maxVisible / position",
        type: "number / 'inline' | 'top' | 'bottom'",
        default: "3 / 'inline'",
        description: "Button disclosure retains hidden children and drafts.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'div'>",
        default: "-",
        description: "Stack root props; children stay in the stack flow.",
      },
    ],
  },
  {
    title: "KiraAnnouncementBar",
    props: [
      {
        prop: "message / messages / rotateInterval",
        type: "ReactNode / ReactNode[] / number",
        default: "undefined",
        description: "Single content or reader-controlled rotation.",
      },
      {
        prop: "action",
        type: "{ id?: string; label: ReactNode; href?: string; onClick?: (context: { signal: AbortSignal }) => void | Promise<void>; variant?: 'link' | 'button' | 'outline' }",
        default: "undefined",
        description:
          "Caller-owned action with cancellation, retry, and success.",
      },
      {
        prop: "countdownTo / countdownPrefix",
        type: "Date / string",
        default: "undefined",
        description: "Compose the deadline display.",
      },
      {
        prop: "consent / consentKey",
        type: "boolean / string",
        default: "false / undefined",
        description:
          "Acceptance/rejection with optional distinct persisted choice.",
      },
      {
        prop: "onAccept / onReject",
        type: "(context: { signal: AbortSignal }) => void | Promise<void>",
        default: "undefined",
        description: "Persist a decision only after its callback succeeds.",
      },
      {
        prop: "acceptLabel / rejectLabel",
        type: "string / string",
        default: "'Accept' / 'Reject'",
        description: "Visible decision labels.",
      },
      {
        prop: "successMessage / dismissOnActionSuccess",
        type: "string / boolean",
        default: "undefined / false",
        description: "Completion feedback or optional removal.",
      },
      {
        prop: "root props",
        type: "Omit<AnnouncementBarProps, 'children'>",
        default: "-",
        description:
          "All root settings, native props, refs, and render adapters.",
      },
    ],
  },
  {
    title: "Hooks and variants",
    props: [
      {
        prop: "useAnnouncementDismiss(key, mode)",
        type: "readonly [boolean, () => void, () => void]",
        default: "-",
        description:
          "Read dismissal, dismiss, and reset. Empty keys never persist.",
      },
      {
        prop: "useAnnouncementConsent(key, mode)",
        type: "readonly ['accepted' | 'rejected' | null, (decision: 'accepted' | 'rejected') => void, () => void]",
        default: "-",
        description: "Read, save, and reset a distinct decision.",
      },
      {
        prop: "useAnnouncementExpiry(date)",
        type: "(date?: Date) => boolean",
        default: "-",
        description: "Compare the shared clock with a finite deadline.",
      },
      {
        prop: "useCountdown(date, paused)",
        type: "(date?: Date, paused?: boolean) => string | null",
        default: "-",
        description:
          "Remaining time or null after expiry; pause freezes the display.",
      },
      {
        prop: "useAnnouncementBar()",
        type: "{ variant: AnnouncementVariant; priority: AnnouncementPriority; urgency: AnnouncementUrgency; isPaused: boolean; playbackPaused: boolean; setIsPaused: (paused: boolean) => void; dismiss: () => void; extend: () => void; disabled: boolean }",
        default: "-",
        description: "Enclosing context for custom controls.",
      },
      {
        prop: "announcementBarVariants",
        type: "cva",
        default: "-",
        description: "Exported variant, position, and priority styling.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const announcementBarPageChangelogEntries = [
  {
    version: "3.0.2",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Aligned action controls onto kit Button",
        description:
          "Replaced direct @base-ui/react/button imports with kit Button using Base UI render/nativeButton props, eliminating dual raw-primitive and kit imports.",
      },
    ],
  },
  {
    version: "3.0.1",
    date: "15 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Reliable playback controls",
        description:
          "Pause/Play reflects explicit playback and focus stops, independently of temporary hover/visibility suspension. Rotation and playback icons have reduced-motion-safe transitions.",
      },
      {
        type: "fixed",
        title: "Smooth progress and aligned deadlines",
        description:
          "One linear CSS progress animation follows pause/extend/restart while timer state updates once per second. Countdown units reserve two digit widths and retain minutes at zero.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "14 November 2026",
    changes: [
      {
        type: "added",
        title: "Reader-controlled notices",
        description:
          "Pause/previous/next, focus and visibility stops, extension and start/end dates. Audited on Base UI 1.9.0.",
      },
      {
        type: "added",
        title: "Recoverable actions and saved choices",
        description:
          "AbortSignal callbacks, cancellation/retry and distinct consent persistence after success.",
      },
      {
        type: "fixed",
        title: "Dismissal, storage and retained stacks",
        description:
          "Dismiss once, adopt keys/storage changes, restore on reset, retain hidden drafts.",
      },
      {
        type: "breaking",
        title: "Inline default and native actions",
        description:
          "Default position is inline instead of sticky top. URL-less actions are buttons with Base UI events/refs. Dismissal is immediate; animation applies to entrance.",
      },
      {
        type: "breaking",
        title: "Announcement and motion behavior",
        description:
          "A named root region contains contextual live content. Focus stops rotation until explicit resume. Countdown displays Ended on expiry; marquee loops are bounded.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
