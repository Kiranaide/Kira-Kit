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

const basicCode =
  'import * as React from "react";\nimport { AnnouncementBar, AnnouncementBarIcon, AnnouncementBarContent, AnnouncementBarAction } from "@/components/ui/announcement-bar";\n\nexport function ReleaseNotice() {\n  const [saved, setSaved] = React.useState(false);\n  return (\n    <AnnouncementBar variant="info" animation="none" dismissible>\n      <AnnouncementBarIcon />\n      <AnnouncementBarContent>{saved ? "You will receive release updates." : "Kira Kit v3 components are ready to review."}</AnnouncementBarContent>\n      <AnnouncementBarAction variant="outline" onClick={() => setSaved(true)} disabled={saved}>{saved ? "Subscribed" : "Get updates"}</AnnouncementBarAction>\n    </AnnouncementBar>\n  );\n}';

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

const variantsCode =
  'import { KiraAnnouncementBar } from "@/components/ui/announcement-bar";\nexport function NoticeVariants() {\n  return <div className="space-y-3">\n    <KiraAnnouncementBar message="The next release review starts at 14:00." animation="none" />\n    <KiraAnnouncementBar variant="info" message="A deployment preview is available." animation="none" />\n    <KiraAnnouncementBar variant="success" message="Your workspace backup is complete." animation="none" />\n    <KiraAnnouncementBar variant="warning" message="Scheduled maintenance may delay exports." animation="none" />\n    <KiraAnnouncementBar variant="destructive" priority="critical" message="File uploads are unavailable. Existing files remain accessible." animation="none" />\n  </div>;\n}';

const messages = [
  "View deployment changes before publishing.",
  "Portrait and landscape media share one stable frame.",
  "Code file tabs retain each file's draft.",
];

function RotationDemo() {
  return (
    <div className="space-y-3">
      <AnnouncementBar variant="info" animation="none">
        <AnnouncementRotator messages={messages} rotateInterval={6000} />
      </AnnouncementBar>
      <p className="text-sm text-muted-foreground">
        Previous and Next stop rotation. Focus stops it until you choose Resume.
        Hover pauses while the pointer stays inside.
      </p>
    </div>
  );
}

const rotationCode =
  'import { AnnouncementBar, AnnouncementRotator } from "@/components/ui/announcement-bar";\nexport function ReleaseRotator() {\n  return <AnnouncementBar variant="info" animation="none">\n    <AnnouncementRotator rotateInterval={6000} messages={[\n      "View deployment changes before publishing.",\n      "Portrait and landscape media share one stable frame.",\n      "Code file tabs retain each file\'s draft.",\n    ]} />\n  </AnnouncementBar>;\n}';

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

const timerCode =
  'import * as React from "react";\nimport { KiraAnnouncementBar } from "@/components/ui/announcement-bar";\nimport { Button } from "@/components/ui/button";\nexport function ExportNotice() {\n  const [version, setVersion] = React.useState(0);\n  const [visible, setVisible] = React.useState(true);\n  return <div className="space-y-4">\n    {visible && <KiraAnnouncementBar key={version} variant="success"\n      message="Your export is ready. It remains available on the Exports page."\n      autoDismiss={12000} showProgress dismissible onDismiss={() => setVisible(false)} animation="fade" />}\n    <Button variant="outline" size="sm" onClick={() => { setVersion((value) => value + 1); setVisible(true); }}>Restart notice</Button>\n  </div>;\n}';

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

const persistenceCode =
  'import { KiraAnnouncementBar, useAnnouncementDismiss } from "@/components/ui/announcement-bar";\nimport { Button } from "@/components/ui/button";\nexport function SavedNotice() {\n  const [dismissed, , reset] = useAnnouncementDismiss("maintenance-2026", "session");\n  return <div>\n    <KiraAnnouncementBar announcementId="maintenance-2026" persistMode="session"\n      message="A maintenance window is scheduled." dismissible animation="none" />\n    <p>{dismissed ? "Dismissed" : "Visible"}</p>\n    <Button onClick={reset}>Reset dismissal</Button>\n  </div>;\n}';

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

const deadlineCode =
  'import * as React from "react";\nimport { KiraAnnouncementBar } from "@/components/ui/announcement-bar";\nimport { Button } from "@/components/ui/button";\nexport function MaintenanceCountdown() {\n  const [deadline] = React.useState(() => new Date(Date.now() + 90000));\n  const [paused, setPaused] = React.useState(false);\n  return <div>\n    <KiraAnnouncementBar message="A maintenance window begins soon." countdownTo={deadline}\n      countdownPrefix="Starts in" paused={paused} onPausedChange={setPaused} animation="none" />\n    <Button aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume display" : "Pause display"}</Button>\n  </div>;\n}';

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

const scheduleCode =
  'import * as React from "react";\nimport { KiraAnnouncementBar, useAnnouncementExpiry, useCountdown } from "@/components/ui/announcement-bar";\nexport function ScheduledMaintenance() {\n  const [start] = React.useState(() => new Date(Date.now() + 8000));\n  const [end] = React.useState(() => new Date(Date.now() + 24000));\n  const expired = useAnnouncementExpiry(end);\n  const countdown = useCountdown(start);\n  return <div>\n    <p>{expired ? "Notice expired" : countdown ? `Notice appears in ${countdown}.` : "Notice active"}</p>\n    <KiraAnnouncementBar startsAt={start} expiresAt={end} variant="warning"\n      message="Maintenance is in progress. Saved work remains available." animation="none" />\n  </div>;\n}';

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

const asyncCode =
  'import { KiraAnnouncementBar } from "@/components/ui/announcement-bar";\nexport function PreviewNotice() {\n  return <KiraAnnouncementBar message="Review a deployment preview before publishing."\n    dismissible successMessage="Your preview is ready to review." action={{\n      label: "Prepare preview", variant: "button",\n      onClick: async ({ signal }) => {\n        const response = await fetch("/api/preview", { method: "POST", signal });\n        if (!response.ok) throw new Error("The preview service is unavailable.");\n      },\n    }} />;\n}';

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
        {decision
          ? `Saved choice: ${decision}.`
          : "No choice saved. Both options are available."}
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Reset preference
      </Button>
    </div>
  );
}

const consentCode =
  'import { KiraAnnouncementBar, useAnnouncementConsent } from "@/components/ui/announcement-bar";\nimport { Button } from "@/components/ui/button";\nexport function AnalyticsPreference() {\n  const [decision, , reset] = useAnnouncementConsent("analytics", "session");\n  return <div>\n    <KiraAnnouncementBar consent consentKey="analytics" persistMode="session" message="Allow optional product analytics?"\n      acceptLabel="Allow analytics" rejectLabel="Use essential only"\n      onAccept={async ({ signal }) => {\n        const response = await fetch("/api/preferences", { method: "POST", signal, body: JSON.stringify({ analytics: true }) });\n        if (!response.ok) throw new Error("Your preference was not saved.");\n      }}\n      onReject={async ({ signal }) => {\n        const response = await fetch("/api/preferences", { method: "POST", signal, body: JSON.stringify({ analytics: false }) });\n        if (!response.ok) throw new Error("Your preference was not saved.");\n      }} />\n    <p>{decision ?? "No saved choice"}</p>\n    <Button onClick={reset}>Reset preference</Button>\n  </div>;\n}';

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

const stackCode =
  'import { AnnouncementStack, KiraAnnouncementBar, AnnouncementBar, AnnouncementBarContent } from "@/components/ui/announcement-bar";\nexport function NoticeStack() {\n  return <AnnouncementStack maxVisible={2}>\n    <KiraAnnouncementBar message="A deployment preview is ready." variant="info" animation="none" />\n    <KiraAnnouncementBar message="Your backup is complete." variant="success" animation="none" />\n    <AnnouncementBar animation="none"><AnnouncementBarContent>\n      <label>Release note <input defaultValue="Keep this draft" /></label>\n    </AnnouncementBarContent></AnnouncementBar>\n    <KiraAnnouncementBar message="Maintenance starts later today." variant="warning" animation="none" />\n  </AnnouncementStack>;\n}';

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

const kiraCode =
  'import * as React from "react";\nimport { KiraAnnouncementBar } from "@/components/ui/announcement-bar";\nimport { Button } from "@/components/ui/button";\nexport function FloatingNotice() {\n  const [open, setOpen] = React.useState(false);\n  return <div>\n    <Button onClick={() => setOpen(true)}>Show floating notice</Button>\n    {open && <KiraAnnouncementBar position="floating" variant="info" message="The floating notice can be dismissed."\n      dismissible onDismiss={() => setOpen(false)} animation="scale" />}\n  </div>;\n}';

function StatesDemo() {
  return (
    <div className="max-w-full space-y-4">
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
      <AnnouncementBar animation="none" className="max-w-sm">
        <AnnouncementBarContent>
          A narrow notice with a useful action label.
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

const statesCode =
  'import { KiraAnnouncementBar, AnnouncementRotator, AnnouncementBar, AnnouncementBarContent, AnnouncementBarAction } from "@/components/ui/announcement-bar";\nexport function NoticeStates() {\n  return <div className="space-y-4">\n    <KiraAnnouncementBar disabled animation="none" message="Publishing is unavailable because you have viewer access." action={{ label: "Publish", onClick: () => {} }} />\n    <AnnouncementRotator messages={[]} />\n    <AnnouncementBar animation="none" className="max-w-sm">\n      <AnnouncementBarContent>A narrow notice with a useful action label.</AnnouncementBarContent>\n      <AnnouncementBarAction variant="outline">Review every deployment change for the international workspace</AnnouncementBarAction>\n    </AnnouncementBar>\n  </div>;\n}';

const tabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="Release notice" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper title="Notice importance" code={variantsCode}>
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rotation",
    label: "Rotation",
    demo: (
      <DemoWrapper title="Reader-controlled rotation" code={rotationCode}>
        <RotationDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "timer",
    label: "Timer",
    demo: (
      <DemoWrapper title="Extendable notice" code={timerCode}>
        <TimerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "persistence",
    label: "Persistence",
    demo: (
      <DemoWrapper title="Shared keyed dismissal" code={persistenceCode}>
        <PersistenceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "deadline",
    label: "Countdown",
    demo: (
      <DemoWrapper title="A real deadline" code={deadlineCode}>
        <DeadlineDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "schedule",
    label: "Schedule",
    demo: (
      <DemoWrapper title="Scheduled maintenance" code={scheduleCode}>
        <ScheduleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async",
    label: "Actions",
    demo: (
      <DemoWrapper title="Cancellation and retry" code={asyncCode}>
        <AsyncDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "consent",
    label: "Consent",
    demo: (
      <DemoWrapper title="Save a preference" code={consentCode}>
        <ConsentDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stack",
    label: "Stack",
    demo: (
      <DemoWrapper title="Retained notices" code={stackCode}>
        <StackDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (active: boolean) => (
      <DemoWrapper title="Pinned Kira notice" code={kiraCode}>
        <KiraDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper title="Narrow and unavailable states" code={statesCode}>
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

type APIRow = [string, string, string, string?];

function section(title: string, rows: APIRow[]) {
  return {
    title,
    props: rows.map(([prop, type, description, defaultValue]) => ({
      prop,
      type,
      description,
      default: defaultValue,
    })),
  };
}

const api = [
  section("AnnouncementBar", [
    [
      "variant",
      "'default' | 'info' | 'success' | 'warning' | 'destructive'",
      "Semantic surface with readable text.",
      "'default'",
    ],
    [
      "position",
      "'inline' | 'top' | 'bottom' | 'floating'",
      "Pinned notices yield to covered focus targets.",
      "'inline'",
    ],
    [
      "priority / urgency",
      "'low' | 'normal' | 'high' | 'critical' / 'polite' | 'assertive'",
      "Critical content uses assertive urgency.",
      "'normal' / 'polite'",
    ],
    [
      "announcementId / persistMode",
      "string / 'session' | 'persistent'",
      "Reactive dismissal key and storage mode.",
      "undefined / 'persistent'",
    ],
    [
      "autoDismiss / showProgress",
      "number / boolean",
      "Milliseconds, minimum 1000; supplies Pause and Extend.",
      "undefined / false",
    ],
    [
      "paused / onPausedChange",
      "boolean / (paused: boolean) => void",
      "Controlled pause; focus, hover, motion and visibility can also stop the timer.",
    ],
    [
      "startsAt / expiresAt",
      "Date / Date",
      "Real schedule timestamps; invalid dates do not hide a notice.",
    ],
    [
      "icon / marquee / dismissible",
      "ReactNode / boolean / boolean",
      "Convenience parts; plain text receives content.",
      "undefined / false / false",
    ],
    [
      "animation",
      "'slide' | 'fade' | 'scale' | 'none'",
      "Gated entrance; dismissal is immediate.",
      "'slide'",
    ],
    [
      "disabled / onDismiss",
      "boolean / () => void",
      "Disable actions/timers; notify once for user or timer dismissal.",
      "false",
    ],
    [
      "native props / ref / render",
      "useRender.ComponentProps<'div'>",
      "DOM props and Base UI render composition reach the root.",
    ],
  ]),
  section("AnnouncementBarContent", [
    [
      "marquee",
      "boolean",
      "Moving text is capped at three loops with pause/visibility controls.",
      "false",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'div'>",
      "One contextual live region; events compose.",
    ],
  ]),
  section("AnnouncementBarIcon", [
    [
      "icon / variant",
      "ReactNode / AnnouncementVariant",
      "Undefined selects a semantic icon; null hides it.",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'span'>",
      "Decorative wrapper props.",
    ],
  ]),
  section("AnnouncementBarAction", [
    [
      "variant",
      "'link' | 'button' | 'outline'",
      "Shared styling for actions and navigation.",
      "'link'",
    ],
    [
      "href / target / rel / download",
      "string / string / string / string | boolean",
      "Anchor attributes; disabled actions remove the URL.",
    ],
    [
      "nativeButton / render / native props",
      "ButtonPrimitive.Props",
      "Base UI button composition and events.",
    ],
  ]),
  section("AnnouncementBarDismiss / AnnouncementDismiss", [
    ["label", "string", "Accessible name.", "'Dismiss announcement'"],
    [
      "onClick / native props",
      "React.ComponentProps<typeof Button>",
      "External handler runs before dismissal; preventDefault cancels it.",
    ],
  ]),
  section("AnnouncementBarPause", [
    [
      "native props",
      "React.ComponentProps<typeof Button>",
      "Pause/resume the enclosing timer.",
    ],
  ]),
  section("AnnouncementBarProgress", [
    [
      "duration / paused",
      "number / boolean",
      "Optional one-shot linear CSS countdown in milliseconds, suspended with the enclosing timer. Omit duration for an interpolated percentage fill.",
      "undefined / false",
    ],
    [
      "value / variant",
      "number / AnnouncementVariant",
      "Finite 0–100 percentage with a named progressbar and transform fill.",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'div'>",
      "Progress root props.",
    ],
  ]),
  section("AnnouncementBarCountdown", [
    [
      "to / prefix / expiredLabel",
      "Date / string / string",
      "Aligned two-digit unit cells; ticks never use a live region.",
      "required / 'Ends in' / 'Ended'",
    ],
    [
      "paused / native props",
      "boolean / React.ComponentProps<'span'>",
      "Freeze the display, retaining the real deadline.",
      "false",
    ],
  ]),
  section("AnnouncementRotator", [
    [
      "messages / rotateInterval",
      "ReactNode[] / number",
      "Retained messages with minimum 1000ms cadence.",
      "required / 6000",
    ],
    [
      "paused / onPausedChange / onIndexChange",
      "boolean / (paused: boolean) => void / (index: number) => void",
      "Controlled pause and selection notifications.",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'div'>",
      "Compose events with focus and hover stops.",
    ],
  ]),
  section("AnnouncementStack", [
    [
      "maxVisible / position",
      "number / 'inline' | 'top' | 'bottom'",
      "Button disclosure retains hidden children and drafts.",
      "3 / 'inline'",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'div'>",
      "Stack root props; children stay in the stack flow.",
    ],
  ]),
  section("KiraAnnouncementBar", [
    [
      "message / messages / rotateInterval",
      "ReactNode / ReactNode[] / number",
      "Single content or reader-controlled rotation.",
    ],
    [
      "action",
      "{ id?: string; label: ReactNode; href?: string; onClick?: (context: { signal: AbortSignal }) => void | Promise<void>; variant?: 'link' | 'button' | 'outline' }",
      "Caller-owned action with cancellation/retry/success.",
    ],
    [
      "countdownTo / countdownPrefix",
      "Date / string",
      "Compose the deadline display.",
    ],
    [
      "consent / consentKey",
      "boolean / string",
      "Acceptance/rejection with optional distinct persisted choice.",
      "false",
    ],
    [
      "onAccept / onReject",
      "(context: { signal: AbortSignal }) => void | Promise<void>",
      "Persist a decision only after its callback succeeds.",
    ],
    [
      "acceptLabel / rejectLabel",
      "string / string",
      "Visible decision labels.",
      "'Accept' / 'Reject'",
    ],
    [
      "successMessage / dismissOnActionSuccess",
      "string / boolean",
      "Completion feedback or optional removal.",
      "undefined / false",
    ],
    [
      "root props",
      "Omit<AnnouncementBarProps, 'children'>",
      "All root settings, native props, refs and render adapters.",
    ],
  ]),
  section("Hooks and variants", [
    [
      "useAnnouncementDismiss(key, mode)",
      "readonly [boolean, () => void, () => void]",
      "Read dismissal, dismiss, reset. Empty keys never persist.",
    ],
    [
      "useAnnouncementConsent(key, mode)",
      "readonly ['accepted' | 'rejected' | null, (decision: 'accepted' | 'rejected') => void, () => void]",
      "Read, save and reset a distinct decision.",
    ],
    [
      "useAnnouncementExpiry(date)",
      "(date?: Date) => boolean",
      "Compare the shared clock with a finite deadline.",
    ],
    [
      "useCountdown(date, paused)",
      "(date?: Date, paused?: boolean) => string | null",
      "Remaining time or null after expiry; pause freezes the display.",
    ],
    [
      "useAnnouncementBar()",
      "{ variant: AnnouncementVariant; priority: AnnouncementPriority; urgency: AnnouncementUrgency; isPaused: boolean; setIsPaused: (paused: boolean) => void; dismiss: () => void; extend: () => void; disabled: boolean }",
      "Enclosing context for custom controls.",
    ],
    [
      "announcementBarVariants",
      "cva",
      "Exported variant, position and priority styling.",
    ],
  ]),
] satisfies React.ComponentProps<typeof APIReference>["sections"];

const usageCode =
  'import * as React from "react";\nimport {\n  AnnouncementBar, AnnouncementBarIcon, AnnouncementBarContent, AnnouncementBarAction,\n  AnnouncementBarDismiss, AnnouncementDismiss, AnnouncementBarPause, AnnouncementBarProgress,\n  AnnouncementBarCountdown, AnnouncementRotator, AnnouncementStack, KiraAnnouncementBar,\n  useAnnouncementDismiss, useAnnouncementConsent, useAnnouncementExpiry, useCountdown,\n  useAnnouncementBar, announcementBarVariants,\n} from "@/components/ui/announcement-bar";\n\nexport function NoticeParts() {\n  const [deadline] = React.useState(() => new Date(Date.now() + 60000));\n  return <AnnouncementStack>\n    <AnnouncementBar variant="info" animation="none">\n      <AnnouncementBarIcon />\n      <AnnouncementBarContent>Review the new release.</AnnouncementBarContent>\n      <AnnouncementBarAction href="/components/code-block">View examples</AnnouncementBarAction>\n      <AnnouncementBarCountdown to={deadline} />\n      <AnnouncementBarPause /><AnnouncementBarDismiss />\n      <AnnouncementBarProgress value={75} />\n    </AnnouncementBar>\n    <AnnouncementBar animation="none">\n      <AnnouncementRotator messages={["A preview is ready.", "Your draft is saved."]} />\n      <AnnouncementDismiss />\n    </AnnouncementBar>\n    <KiraAnnouncementBar message="Your backup is complete." variant="success" dismissible />\n  </AnnouncementStack>;\n}\n// useAnnouncementBar exposes dismiss/extend/setIsPaused for custom controls.\n// Dismiss and consent hooks expose read/save/reset tuples.\n// Expiry and countdown hooks share a visibility-aware clock.\n// announcementBarVariants({ variant: "info", position: "inline" }) is exported.';

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function AnnouncementBarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Announcement Bar"
        description="Readable service notices, controlled rotation, and actions that can recover."
        version="3.0.1"
      />
      <FeatureGrid
        features={[
          {
            title: "Reader control",
            description: "Pause rotation and extend timed notices.",
            icon: <IconClock className="size-5" />,
          },
          {
            title: "Reliable actions",
            description: "Cancellation, retry and completion in the notice.",
            icon: <IconBell className="size-5" />,
          },
          {
            title: "Saved decisions",
            description: "Separate reactive dismissal and consent keys.",
            icon: <IconShieldCheck className="size-5" />,
          },
        ]}
      />
      <DemoTabs defaultValue="basic" tabs={tabs} />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Reach actions, pause, disclosure and dismiss; native controls inherited from Base UI.",
          },
          {
            keys: "Enter / Space",
            description: "Activate buttons. Enter follows a navigation link.",
          },
          {
            keys: "Tab",
            description:
              "Entering the rotator stops changes until Resume is explicitly activated.",
          },
          {
            keys: "Enter",
            description:
              "Previous/Next change the message and stop rotation; Extend restarts remaining time.",
          },
          {
            keys: "Enter",
            description:
              "Cancel stops the pending action; Try again starts a new request.",
          },
        ]}
      />
      <UsageBlock code={usageCode} />
      <APIReference sections={api} />
      <Changelog
        entries={[
          {
            version: "3.0.1",
            date: "November 15, 2026",
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
            date: "November 14, 2026",
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
        ]}
      />
    </ComponentPage>
  );
}

function getNoticeStatus(
  expired: boolean,
  countdown: ReturnType<typeof useCountdown>,
) {
  if (expired) return "The notice expired.";

  if (countdown) return `Notice appears in ${countdown}.`;

  return "The notice is active.";
}
