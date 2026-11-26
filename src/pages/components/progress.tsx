import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconChartBar, IconLoader, IconPalette } from "@tabler/icons-react";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
  SegmentedProgress,
  CircularProgress,
  KiraProgress,
  type ProgressStatus,
} from "@/components/ui/progress";
import { KiraPopover } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

function useDemoClock(tick: () => void, active: boolean) {
  React.useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      if (!document.hidden) tick();
    }, 800);

    return () => clearInterval(timer);
  }, [active, tick]);
}

function BufferDemo() {
  const [processed, setProcessed] = React.useState(35);
  const [received, setReceived] = React.useState(70);

  return (
    <div className="w-full space-y-3">
      <Progress
        value={processed}
        bufferValue={received}
        aria-label="Processed rows"
        showLabel
      />
      <p className="text-sm tabular-nums">
        Received {received} MB of 100 MB; processed {processed} of 100 rows.
      </p>
      <p className="text-sm text-muted-foreground">
        Illustrative one-row-per-MB import. The faint layer is received data,
        the solid layer is processed data.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => setReceived((amount) => Math.min(100, amount + 10))}
        >
          Receive 10 MB
        </Button>
        <Button
          onClick={() =>
            setProcessed((amount) => Math.min(received, amount + 10))
          }
        >
          Process 10 rows
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setReceived(70);
            setProcessed(35);
          }}
        >
          Reset buffer
        </Button>
      </div>
    </div>
  );
}

const bufferCode =
  'import * as React from "react";\nimport { Progress } from "@/components/ui/progress";\nimport { Button } from "@/components/ui/button";\n\nexport function BufferDemo() {\n  const [processed, setProcessed] = React.useState(35);\n  const [received, setReceived] = React.useState(70);\n\n  return (\n    <div className="w-full space-y-3">\n      <Progress\n        value={processed}\n        bufferValue={received}\n        aria-label="Processed rows"\n        showLabel\n      />\n      <p className="text-sm tabular-nums">\n        Received {received} MB of 100 MB; processed {processed} of 100 rows.\n      </p>\n      <p className="text-sm text-muted-foreground">\n        Illustrative one-row-per-MB import. The faint layer is received data,\n        the solid layer is processed data.\n      </p>\n      <div className="flex flex-wrap gap-2">\n        <Button\n          variant="outline"\n          onClick={() => setReceived((amount) => Math.min(100, amount + 10))}\n        >\n          Receive 10 MB\n        </Button>\n        <Button\n          onClick={() =>\n            setProcessed((amount) => Math.min(received, amount + 10))\n          }\n        >\n          Process 10 rows\n        </Button>\n        <Button\n          variant="outline"\n          onClick={() => {\n            setReceived(70);\n            setProcessed(35);\n          }}\n        >\n          Reset buffer\n        </Button>\n      </div>\n    </div>\n  );\n}';

interface LifecycleDemoControlsProps {
  status: ProgressStatus;
  value: number | null;
  setStatus: React.Dispatch<React.SetStateAction<ProgressStatus>>;
  setValue: React.Dispatch<React.SetStateAction<number | null>>;
}

function LifecycleDemoControls({
  status,
  value,
  setStatus,
  setValue,
}: LifecycleDemoControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {status === "idle" && (
        <Button onClick={() => setStatus("running")}>
          Start unknown amount
        </Button>
      )}
      {status === "running" && value === null && (
        <Button onClick={() => setValue(20)}>Measure amount</Button>
      )}
      {status === "running" && (
        <Button variant="outline" onClick={() => setStatus("error")}>
          Simulate error
        </Button>
      )}
      {status === "running" && value !== null && (
        <Button variant="outline" onClick={() => setValue(100)}>
          Measure 100%
        </Button>
      )}
      {status === "running" && value === 100 && (
        <Button onClick={() => setStatus("complete")}>
          Confirm completion
        </Button>
      )}
      {status === "complete" && (
        <Button
          variant="outline"
          onClick={() => {
            setStatus("idle");
            setValue(null);
          }}
        >
          Restart illustration
        </Button>
      )}
    </div>
  );
}

function LifecycleDemo({ active = true }: { active?: boolean }) {
  const [status, setStatus] = React.useState<ProgressStatus>("idle");
  const [value, setValue] = React.useState<number | null>(null);

  const tick = React.useCallback(
    () =>
      setValue((amount) =>
        amount === null ? null : Math.min(100, amount + 5),
      ),
    [],
  );

  useDemoClock(
    tick,
    active && status === "running" && value !== null && value < 100,
  );

  return (
    <div className="w-full space-y-4">
      <p className="text-sm text-muted-foreground">
        Illustrative import. Reaching 100% remains Running until the caller
        confirms completion.
      </p>
      <KiraProgress
        label="Import customer records"
        status={status}
        value={value}
        description="Paused, failed and canceled work keeps the measured amount."
        onPause={() => setStatus("paused")}
        onResume={() => setStatus("running")}
        onCancel={() => setStatus("canceled")}
        onRetry={() => {
          if (status === "canceled") setValue(null);
          setStatus("running");
        }}
      />
      <LifecycleDemoControls
        status={status}
        value={value}
        setStatus={setStatus}
        setValue={setValue}
      />
    </div>
  );
}

const lifecycleCode =
  'import * as React from "react";\nimport { KiraProgress, type ProgressStatus } from "@/components/ui/progress";\nimport { Button } from "@/components/ui/button";\n\nfunction useDemoClock(tick: () => void, active: boolean) {\n  React.useEffect(() => {\n    if (!active) return;\n\n    const timer = setInterval(() => {\n      if (!document.hidden) tick();\n    }, 800);\n\n    return () => clearInterval(timer);\n  }, [active, tick]);\n}\n\ninterface LifecycleDemoControlsProps {\n  status: ProgressStatus;\n  value: number | null;\n  setStatus: React.Dispatch<React.SetStateAction<ProgressStatus>>;\n  setValue: React.Dispatch<React.SetStateAction<number | null>>;\n}\n\nfunction LifecycleDemoControls({\n  status,\n  value,\n  setStatus,\n  setValue,\n}: LifecycleDemoControlsProps) {\n  return (\n    <div className="flex flex-wrap gap-2">\n      {status === "idle" && (\n        <Button onClick={() => setStatus("running")}>\n          Start unknown amount\n        </Button>\n      )}\n      {status === "running" && value === null && (\n        <Button onClick={() => setValue(20)}>Measure amount</Button>\n      )}\n      {status === "running" && (\n        <Button variant="outline" onClick={() => setStatus("error")}>\n          Simulate error\n        </Button>\n      )}\n      {status === "running" && value !== null && (\n        <Button variant="outline" onClick={() => setValue(100)}>\n          Measure 100%\n        </Button>\n      )}\n      {status === "running" && value === 100 && (\n        <Button onClick={() => setStatus("complete")}>\n          Confirm completion\n        </Button>\n      )}\n      {status === "complete" && (\n        <Button\n          variant="outline"\n          onClick={() => {\n            setStatus("idle");\n            setValue(null);\n          }}\n        >\n          Restart illustration\n        </Button>\n      )}\n    </div>\n  );\n}\nexport function LifecycleDemo({ active = true }: { active?: boolean }) {\n  const [status, setStatus] = React.useState<ProgressStatus>("idle");\n  const [value, setValue] = React.useState<number | null>(null);\n\n  const tick = React.useCallback(\n    () =>\n      setValue((amount) =>\n        amount === null ? null : Math.min(100, amount + 5),\n      ),\n    [],\n  );\n\n  useDemoClock(\n    tick,\n    active && status === "running" && value !== null && value < 100,\n  );\n\n  return (\n    <div className="w-full space-y-4">\n      <p className="text-sm text-muted-foreground">\n        Illustrative import. Reaching 100% remains Running until the caller\n        confirms completion.\n      </p>\n      <KiraProgress\n        label="Import customer records"\n        status={status}\n        value={value}\n        description="Paused, failed and canceled work keeps the measured amount."\n        onPause={() => setStatus("paused")}\n        onResume={() => setStatus("running")}\n        onCancel={() => setStatus("canceled")}\n        onRetry={() => {\n          if (status === "canceled") setValue(null);\n          setStatus("running");\n        }}\n      />\n      <LifecycleDemoControls\n        status={status}\n        value={value}\n        setStatus={setStatus}\n        setValue={setValue}\n      />\n    </div>\n  );\n}';

function PhasesDemo() {
  const [unknown, setUnknown] = React.useState(false);
  const [transform, setTransform] = React.useState(50);

  return (
    <div className="w-full space-y-4">
      <KiraProgress
        label="Prepare quarterly report"
        status="running"
        currentPhaseId="transform"
        phases={[
          {
            id: "receive",
            label: "Receive source data",
            weight: 1,
            value: 100,
          },
          {
            id: "transform",
            label: "Transform rows",
            weight: 3,
            value: unknown ? null : transform,
          },
          { id: "write", label: "Write report", weight: 1, value: 0 },
        ]}
        description="Weights 1:3:1. At 50% transform, overall progress is 50%. Phase execution and order belong to the caller."
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => setUnknown((previous) => !previous)}
        >
          {unknown ? "Restore phase measurement" : "Make phase unknown"}
        </Button>
        <Button
          onClick={() =>
            setTransform((amount) => (amount >= 100 ? 0 : amount + 25))
          }
        >
          Advance transform
        </Button>
      </div>
    </div>
  );
}

const phasesCode =
  'import * as React from "react";\nimport { KiraProgress } from "@/components/ui/progress";\nimport { Button } from "@/components/ui/button";\n\nexport function PhasesDemo() {\n  const [unknown, setUnknown] = React.useState(false);\n  const [transform, setTransform] = React.useState(50);\n\n  return (\n    <div className="w-full space-y-4">\n      <KiraProgress\n        label="Prepare quarterly report"\n        status="running"\n        currentPhaseId="transform"\n        phases={[\n          {\n            id: "receive",\n            label: "Receive source data",\n            weight: 1,\n            value: 100,\n          },\n          {\n            id: "transform",\n            label: "Transform rows",\n            weight: 3,\n            value: unknown ? null : transform,\n          },\n          { id: "write", label: "Write report", weight: 1, value: 0 },\n        ]}\n        description="Weights 1:3:1. At 50% transform, overall progress is 50%. Phase execution and order belong to the caller."\n      />\n      <div className="flex flex-wrap gap-2">\n        <Button\n          variant="outline"\n          onClick={() => setUnknown((previous) => !previous)}\n        >\n          {unknown ? "Restore phase measurement" : "Make phase unknown"}\n        </Button>\n        <Button\n          onClick={() =>\n            setTransform((amount) => (amount >= 100 ? 0 : amount + 25))\n          }\n        >\n          Advance transform\n        </Button>\n      </div>\n    </div>\n  );\n}';

interface DemoTask {
  id: string;
  label: string;
  value: number;
  status: ProgressStatus;
}

interface BackgroundTaskListProps {
  tasks: DemoTask[];
  change: (id: string, status: ProgressStatus) => void;
}

function BackgroundTaskList({ tasks, change }: BackgroundTaskListProps) {
  return (
    <ul className="space-y-5">
      {tasks.map((task) => (
        <li key={task.id} className="space-y-2">
          <KiraProgress
            label={task.label}
            status={task.status}
            value={task.value}
            onCancel={() => change(task.id, "canceled")}
            onRetry={() => change(task.id, "running")}
          />
          {task.status === "running" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => change(task.id, "error")}
            >
              Simulate {task.id} failure
            </Button>
          )}
          {task.status === "complete" && (
            <a
              className="text-sm text-primary underline"
              href={`#result-${task.id}`}
            >
              View {task.label.toLowerCase()} result
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function BackgroundTasksDemo({ active = true }: { active?: boolean }) {
  const [tasks, setTasks] = React.useState<DemoTask[]>([
    {
      id: "export",
      label: "Export customer report",
      value: 20,
      status: "running",
    },
    { id: "index", label: "Index project files", value: 40, status: "running" },
    {
      id: "archive",
      label: "Archive previous release",
      value: 100,
      status: "complete",
    },
  ]);

  const change = (id: string, status: ProgressStatus) =>
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, status } : task)),
    );

  const tick = React.useCallback(
    () =>
      setTasks((previous) =>
        previous.map((task) => {
          if (task.status !== "running") return task;
          const next = Math.min(100, task.value + 5);

          // Illustrative work result, not a rule inside KiraProgress.
          return {
            ...task,
            value: next,
            status: next === 100 ? "complete" : "running",
          };
        }),
      ),
    [],
  );

  useDemoClock(tick, active && tasks.some((task) => task.status === "running"));
  const running = tasks.filter((task) => task.status === "running").length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Illustrative background tasks continue while the popup is closed.
        Simulation pauses in an inactive demo tab or hidden document.
      </p>
      <KiraPopover
        title="Background tasks"
        trigger={<Button variant="outline">{running} tasks running</Button>}
        contentProps={{ size: "lg" }}
      >
        <BackgroundTaskList tasks={tasks} change={change} />
      </KiraPopover>
      <output className="text-sm">{running} background tasks running.</output>
      {tasks
        .filter((task) => task.status === "complete")
        .map((task) => (
          <p
            tabIndex={-1}
            id={`result-${task.id}`}
            key={task.id}
            className="text-sm"
          >
            {task.label}: illustrative result ready.
          </p>
        ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          setTasks((previous) =>
            previous.map((task) => ({ ...task, status: "running", value: 0 })),
          )
        }
      >
        Restart tasks
      </Button>
    </div>
  );
}

const backgroundCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import * as React from "react";\nimport { KiraProgress, type ProgressStatus } from "@/components/ui/progress";\nimport { KiraPopover } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nfunction useDemoClock(tick: () => void, active: boolean) {\n  React.useEffect(() => {\n    if (!active) return;\n\n    const timer = setInterval(() => {\n      if (!document.hidden) tick();\n    }, 800);\n\n    return () => clearInterval(timer);\n  }, [active, tick]);\n}\n\ninterface DemoTask {\n  id: string;\n  label: string;\n  value: number;\n  status: ProgressStatus;\n}\n\ninterface BackgroundTaskListProps {\n  tasks: DemoTask[];\n  change: (id: string, status: ProgressStatus) => void;\n}\n\nfunction BackgroundTaskList({ tasks, change }: BackgroundTaskListProps) {\n  return (\n    <ul className="space-y-5">\n      {tasks.map((task) => (\n        <li key={task.id} className="space-y-2">\n          <KiraProgress\n            label={task.label}\n            status={task.status}\n            value={task.value}\n            onCancel={() => change(task.id, "canceled")}\n            onRetry={() => change(task.id, "running")}\n          />\n          {task.status === "running" && (\n            <Button\n              size="sm"\n              variant="outline"\n              onClick={() => change(task.id, "error")}\n            >\n              Simulate {task.id} failure\n            </Button>\n          )}\n          {task.status === "complete" && (\n            <a\n              className="text-sm text-primary underline"\n              href={`#result-${task.id}`}\n            >\n              View {task.label.toLowerCase()} result\n            </a>\n          )}\n        </li>\n      ))}\n    </ul>\n  );\n}\n\nexport function BackgroundTasksDemo({ active = true }: { active?: boolean }) {\n  const [tasks, setTasks] = React.useState<DemoTask[]>([\n    {\n      id: "export",\n      label: "Export customer report",\n      value: 20,\n      status: "running",\n    },\n    { id: "index", label: "Index project files", value: 40, status: "running" },\n    {\n      id: "archive",\n      label: "Archive previous release",\n      value: 100,\n      status: "complete",\n    },\n  ]);\n\n  const change = (id: string, status: ProgressStatus) =>\n    setTasks((previous) =>\n      previous.map((task) => (task.id === id ? { ...task, status } : task)),\n    );\n\n  const tick = React.useCallback(\n    () =>\n      setTasks((previous) =>\n        previous.map((task) => {\n          if (task.status !== "running") return task;\n          const next = Math.min(100, task.value + 5);\n\n          // Illustrative work result, not a rule inside KiraProgress.\n          return {\n            ...task,\n            value: next,\n            status: next === 100 ? "complete" : "running",\n          };\n        }),\n      ),\n    [],\n  );\n\n  useDemoClock(tick, active && tasks.some((task) => task.status === "running"));\n  const running = tasks.filter((task) => task.status === "running").length;\n\n  return (\n    <div className="space-y-3">\n      <p className="text-sm text-muted-foreground">\n        Illustrative background tasks continue while the popup is closed.\n        Simulation pauses in an inactive demo tab or hidden document.\n      </p>\n      <KiraPopover\n        title="Background tasks"\n        trigger={<Button variant="outline">{running} tasks running</Button>}\n        contentProps={{ size: "lg" }}\n      >\n        <BackgroundTaskList tasks={tasks} change={change} />\n      </KiraPopover>\n      <output className="text-sm">{running} background tasks running.</output>\n      {tasks\n        .filter((task) => task.status === "complete")\n        .map((task) => (\n          <p\n            tabIndex={-1}\n            id={`result-${task.id}`}\n            key={task.id}\n            className="text-sm"\n          >\n            {task.label}: illustrative result ready.\n          </p>\n        ))}\n      <Button\n        size="sm"\n        variant="outline"\n        onClick={() =>\n          setTasks((previous) =>\n            previous.map((task) => ({ ...task, status: "running", value: 0 })),\n          )\n        }\n      >\n        Restart tasks\n      </Button>\n    </div>\n  );\n}';

function StressEdgeCases() {
  return (
    <>
      <Progress
        aria-label="Invalid bounds fall back to zero through one hundred"
        min={200}
        max={50}
        value={50}
        showLabel
      />
      <Progress
        aria-label="Nonfinite amount is unknown"
        value={Number.NaN}
        showLabel
      />
      <Progress aria-label="Empty process" value={0} showLabel />
      <SegmentedProgress
        aria-label="Capped process segments"
        segments={[
          { value: 80, label: "Processed" },
          { value: 90, label: "Verified" },
          { value: -10, label: "Invalid" },
        ]}
        total={100}
        showLabels
      />
      <SegmentedProgress
        aria-label="Empty process segments"
        segments={[]}
        total={100}
        showLabels
      />
      <KiraProgress
        label="Empty task — choose a file to begin"
        status="idle"
        value={null}
      />
    </>
  );
}

function StressDemo() {
  const [value, setValue] = React.useState(150);
  const [crossings, setCrossings] = React.useState(0);
  const label = React.useId();

  return (
    <div className="max-w-xs space-y-4" dir="rtl">
      <ProgressLabel id={label}>
        A very long release name that should wrap without obscuring the measured
        progress value
      </ProgressLabel>
      <Progress
        aria-labelledby={label}
        min={50}
        max={150}
        value={value}
        showLabel
        locale="ar"
      />
      <CircularProgress
        aria-label="Same custom range"
        min={50}
        max={150}
        value={value}
        showLabel
        locale="ar"
      />
      <React.StrictMode>
        <Progress
          aria-label="Completion reentry"
          value={value}
          min={50}
          max={150}
          onComplete={() => setCrossings((count) => count + 1)}
        />
      </React.StrictMode>
      <p className="text-sm">Completion crossings: {crossings}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setValue(75)}>Below complete</Button>
        <Button onClick={() => setValue(200)}>Above max</Button>
        <Button onClick={() => setValue(0)}>Below min</Button>
        <Button disabled variant="outline">
          Export unavailable
        </Button>
      </div>
      <StressEdgeCases />
    </div>
  );
}

const stressCode = `import * as React from "react";
import {
  Progress,
  ProgressLabel,
  SegmentedProgress,
  CircularProgress,
  KiraProgress,
} from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function StressDemo() {
  const [value, setValue] = React.useState(150);
  const [crossings, setCrossings] = React.useState(0);
  const label = React.useId();

  return (
    <div className="max-w-xs space-y-4" dir="rtl">
      <ProgressLabel id={label}>
        A very long release name that should wrap without obscuring the measured progress value
      </ProgressLabel>
      <Progress aria-labelledby={label} min={50} max={150} value={value} showLabel locale="ar" />
      <CircularProgress aria-label="Same custom range" min={50} max={150} value={value} showLabel locale="ar" />
      <Progress
        aria-label="Completion reentry"
        value={value}
        min={50}
        max={150}
        onComplete={() => setCrossings((count) => count + 1)}
      />
      <p className="text-sm">Completion crossings: {crossings}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setValue(75)}>Below complete</Button>
        <Button onClick={() => setValue(200)}>Above max</Button>
        <Button onClick={() => setValue(0)}>Below min</Button>
        <Button disabled variant="outline">Export unavailable</Button>
      </div>
      <Progress aria-label="Invalid bounds" min={200} max={50} value={50} showLabel />
      <Progress aria-label="Nonfinite amount" value={Number.NaN} showLabel />
      <Progress aria-label="Empty process" value={0} showLabel />
      <SegmentedProgress
        aria-label="Capped process segments"
        segments={[
          { value: 80, label: "Processed" },
          { value: 90, label: "Verified" },
          { value: -10, label: "Invalid" },
        ]}
        total={100}
        showLabels
      />
      <SegmentedProgress aria-label="Empty process segments" segments={[]} total={100} showLabels />
      <KiraProgress label="Empty task — choose a file to begin" status="idle" value={null} />
    </div>
  );
}`;

function BasicDemo() {
  return (
    <div className="space-y-6">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  );
}

const basicCode =
  'import { Progress } from "@/components/ui/progress";\n\nexport function BasicDemo() {\n  return (\n    <div className="space-y-6">\n      <Progress value={33} />\n      <Progress value={66} />\n      <Progress value={100} />\n    </div>\n  );\n}';

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

const sizesCode =
  'import { Progress } from "@/components/ui/progress";\n\nexport function SizesDemo() {\n  return (\n    <div className="space-y-6">\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Small (sm)</p>\n        <Progress value={60} size="sm" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Default</p>\n        <Progress value={60} size="default" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Large (lg)</p>\n        <Progress value={60} size="lg" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Extra Large (xl)</p>\n        <Progress value={60} size="xl" />\n      </div>\n    </div>\n  );\n}';

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

const colorsCode =
  'import { Progress } from "@/components/ui/progress";\n\nexport function ColorsDemo() {\n  return (\n    <div className="space-y-4">\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Default</p>\n        <Progress value={80} variant="default" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Info</p>\n        <Progress value={80} variant="info" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Success</p>\n        <Progress value={80} variant="success" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Warning</p>\n        <Progress value={80} variant="warning" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Destructive</p>\n        <Progress value={80} variant="destructive" />\n      </div>\n    </div>\n  );\n}';

function AnimatedDemo({ active = true }: { active?: boolean }) {
  const [progress, setProgress] = React.useState(45);
  const [playing, setPlaying] = React.useState(false);

  const tick = React.useCallback(
    () => setProgress((amount) => Math.min(100, amount + 5)),
    [],
  );

  useDemoClock(tick, active && playing && progress < 100);

  return (
    <div className="w-full space-y-4">
      <Progress
        value={progress}
        aria-label="Illustrative animated progress"
        showLabel
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setPlaying((previous) => !previous)}>
          {playing ? "Pause illustration" : "Play illustration"}
        </Button>
        <Button variant="outline" onClick={() => setProgress(0)}>
          Reset illustration
        </Button>
        <Button variant="outline" onClick={tick}>
          Advance 5%
        </Button>
      </div>
    </div>
  );
}

const animatedCode =
  'import * as React from "react";\nimport { Progress } from "@/components/ui/progress";\nimport { Button } from "@/components/ui/button";\n\nfunction useDemoClock(tick: () => void, active: boolean) {\n  React.useEffect(() => {\n    if (!active) return;\n\n    const timer = setInterval(() => {\n      if (!document.hidden) tick();\n    }, 800);\n\n    return () => clearInterval(timer);\n  }, [active, tick]);\n}\n\nexport function AnimatedDemo({ active = true }: { active?: boolean }) {\n  const [progress, setProgress] = React.useState(45);\n  const [playing, setPlaying] = React.useState(false);\n\n  const tick = React.useCallback(\n    () => setProgress((amount) => Math.min(100, amount + 5)),\n    [],\n  );\n\n  useDemoClock(tick, active && playing && progress < 100);\n\n  return (\n    <div className="w-full space-y-4">\n      <Progress\n        value={progress}\n        aria-label="Illustrative animated progress"\n        showLabel\n      />\n      <div className="flex flex-wrap gap-2">\n        <Button onClick={() => setPlaying((previous) => !previous)}>\n          {playing ? "Pause illustration" : "Play illustration"}\n        </Button>\n        <Button variant="outline" onClick={() => setProgress(0)}>\n          Reset illustration\n        </Button>\n        <Button variant="outline" onClick={tick}>\n          Advance 5%\n        </Button>\n      </div>\n    </div>\n  );\n}';

function IndeterminateDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use{" "}
        <code className="text-xs bg-muted px-1 py-0.5 rounded">
          {"value={null}"}
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

const indeterminateCode = `import { Progress } from "@/components/ui/progress";

export function IndeterminateDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use <code className="text-xs bg-muted px-1 py-0.5 rounded">{"value={null}"}</code> for indeterminate state.
      </p>
      <div className="space-y-3">
        <Progress value={null} variant="default" />
        <Progress value={null} variant="info" />
        <Progress value={null} variant="success" />
      </div>
    </div>
  );
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

const stripedCode =
  'import { Progress } from "@/components/ui/progress";\n\nexport function StripedDemo() {\n  return (\n    <div className="space-y-6">\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Striped</p>\n        <Progress value={70} striped size="lg" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Striped + Animated</p>\n        <Progress value={70} striped animated size="lg" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">\n          Striped + Animated (Success)\n        </p>\n        <Progress value={70} striped animated size="lg" variant="success" />\n      </div>\n    </div>\n  );\n}';

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
            <ProgressLabel id="upload-progress-label">
              Upload Progress
            </ProgressLabel>
            <ProgressValue value={65} max={100} />
          </div>
          <Progress value={65} aria-labelledby="upload-progress-label" />
        </div>
      </div>
    </div>
  );
}

const withLabelCode =
  'import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";\n\nexport function WithLabelDemo() {\n  return (\n    <div className="space-y-6">\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Built-in label</p>\n        <Progress value={75} showLabel />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">\n          With sub-components\n        </p>\n        <div className="space-y-2">\n          <div className="flex justify-between items-center">\n            <ProgressLabel id="upload-progress-label">\n              Upload Progress\n            </ProgressLabel>\n            <ProgressValue value={65} max={100} />\n          </div>\n          <Progress value={65} aria-labelledby="upload-progress-label" />\n        </div>\n      </div>\n    </div>\n  );\n}';

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

const localeCode =
  'import { Progress } from "@/components/ui/progress";\n\nexport function LocaleDemo() {\n  return (\n    <div className="space-y-4">\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">English (US)</p>\n        <Progress value={75} showLabel locale="en-US" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">German</p>\n        <Progress value={75} showLabel locale="de-DE" />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">French</p>\n        <Progress value={75} showLabel locale="fr-FR" />\n      </div>\n    </div>\n  );\n}';

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

const accessibilityCode =
  'import { Progress } from "@/components/ui/progress";\n\nexport function AccessibilityDemo() {\n  return (\n    <div className="space-y-6">\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">\n          Custom aria-valuetext (Screen readers announce "Step 3 of 5")\n        </p>\n        <Progress value={60} showLabel getAriaValueText={() => "Step 3 of 5"} />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-2">Custom aria-label</p>\n        <Progress value={45} showLabel aria-label="File upload progress" />\n      </div>\n    </div>\n  );\n}';

function OnCompleteDemo() {
  const [progress, setProgress] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setProgress((amount) => Math.min(100, amount + 25))}
        >
          Advance 25%
        </Button>
        <Button variant="outline" onClick={() => setProgress(0)}>
          Reset below complete
        </Button>
      </div>
      <React.StrictMode>
        <Progress
          aria-label="Measured completion"
          value={progress}
          onComplete={() => setCompleted((count) => count + 1)}
          showLabel
        />
      </React.StrictMode>
      <output className="text-sm">
        onComplete fired {completed} times. This reports measurement only.
      </output>
    </div>
  );
}

const onCompleteCode =
  'import * as React from "react";\nimport { Progress } from "@/components/ui/progress";\nimport { Button } from "@/components/ui/button";\n\nexport function OnCompleteDemo() {\n  const [progress, setProgress] = React.useState(0);\n  const [completed, setCompleted] = React.useState(0);\n\n  return (\n    <div className="w-full space-y-4">\n      <div className="flex flex-wrap gap-2">\n        <Button\n          onClick={() => setProgress((amount) => Math.min(100, amount + 25))}\n        >\n          Advance 25%\n        </Button>\n        <Button variant="outline" onClick={() => setProgress(0)}>\n          Reset below complete\n        </Button>\n      </div>\n      <React.StrictMode>\n        <Progress\n          aria-label="Measured completion"\n          value={progress}\n          onComplete={() => setCompleted((count) => count + 1)}\n          showLabel\n        />\n      </React.StrictMode>\n      <output className="text-sm">\n        onComplete fired {completed} times. This reports measurement only.\n      </output>\n    </div>\n  );\n}';

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
          kind="meter"
          aria-label="Storage usage"
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

const segmentedCode =
  'import { SegmentedProgress } from "@/components/ui/progress";\n\nexport function SegmentedDemo() {\n  return (\n    <div className="space-y-8">\n      <div>\n        <p className="text-sm text-muted-foreground mb-3">Task Status</p>\n        <SegmentedProgress\n          segments={[\n            { value: 45, variant: "success", label: "Completed" },\n            { value: 25, variant: "info", label: "In Progress" },\n            { value: 15, variant: "warning", label: "Pending" },\n          ]}\n          total={100}\n          showLabels\n          size="lg"\n        />\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-3">Storage Usage</p>\n        <SegmentedProgress\n          kind="meter"\n          aria-label="Storage usage"\n          segments={[\n            { value: 30, variant: "info", label: "Documents" },\n            { value: 25, variant: "success", label: "Photos" },\n            { value: 15, variant: "warning", label: "Videos" },\n            { value: 10, variant: "destructive", label: "Others" },\n          ]}\n          total={100}\n          showLabels\n        />\n      </div>\n    </div>\n  );\n}';

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

const circularCode =
  'import { CircularProgress } from "@/components/ui/progress";\n\nexport function CircularDemo() {\n  return (\n    <div className="space-y-8">\n      <div>\n        <p className="text-sm text-muted-foreground mb-4">Sizes</p>\n        <div className="flex items-center gap-6">\n          <div className="text-center">\n            <CircularProgress value={60} size="sm" />\n            <p className="text-xs text-muted-foreground mt-2">Small</p>\n          </div>\n          <div className="text-center">\n            <CircularProgress value={60} size="default" />\n            <p className="text-xs text-muted-foreground mt-2">Default</p>\n          </div>\n          <div className="text-center">\n            <CircularProgress value={60} size="lg" />\n            <p className="text-xs text-muted-foreground mt-2">Large</p>\n          </div>\n          <div className="text-center">\n            <CircularProgress value={60} size="xl" />\n            <p className="text-xs text-muted-foreground mt-2">XL</p>\n          </div>\n        </div>\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-4">With Label</p>\n        <div className="flex items-center gap-6">\n          <CircularProgress value={75} showLabel />\n          <CircularProgress value={45} showLabel variant="success" />\n          <CircularProgress value={90} showLabel variant="warning" />\n        </div>\n      </div>\n      <div>\n        <p className="text-sm text-muted-foreground mb-4">\n          Indeterminate (value=null)\n        </p>\n        <div className="flex items-center gap-6">\n          <CircularProgress value={null} />\n          <CircularProgress value={null} variant="success" />\n          <CircularProgress value={null} variant="info" />\n        </div>\n      </div>\n    </div>\n  );\n}';

function LoadingExampleDemo({ active = true }: { active?: boolean }) {
  const [running, setRunning] = React.useState(false);
  const [amount, setAmount] = React.useState(0);

  const tick = React.useCallback(
    () => setAmount((previous) => Math.min(100, previous + 10)),
    [],
  );

  useDemoClock(tick, active && running && amount < 100);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Illustrative loading, with cleanup on unmount and inactive-tab pause.
      </p>
      <CircularProgress
        aria-label="Illustrative loading"
        value={amount}
        showLabel
      />
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setAmount(0);
            setRunning(true);
          }}
        >
          Start loading
        </Button>
        <Button
          variant="outline"
          onClick={() => setRunning((previous) => !previous)}
        >
          {running ? "Pause loading" : "Resume loading"}
        </Button>
        <Button variant="outline" onClick={tick}>
          Advance 10%
        </Button>
      </div>
      {amount === 100 && <output>Illustrative data ready.</output>}
    </div>
  );
}

const loadingExampleCode =
  'import * as React from "react";\nimport { CircularProgress } from "@/components/ui/progress";\nimport { Button } from "@/components/ui/button";\n\nfunction useDemoClock(tick: () => void, active: boolean) {\n  React.useEffect(() => {\n    if (!active) return;\n\n    const timer = setInterval(() => {\n      if (!document.hidden) tick();\n    }, 800);\n\n    return () => clearInterval(timer);\n  }, [active, tick]);\n}\n\nexport function LoadingExampleDemo({ active = true }: { active?: boolean }) {\n  const [running, setRunning] = React.useState(false);\n  const [amount, setAmount] = React.useState(0);\n\n  const tick = React.useCallback(\n    () => setAmount((previous) => Math.min(100, previous + 10)),\n    [],\n  );\n\n  useDemoClock(tick, active && running && amount < 100);\n\n  return (\n    <div className="space-y-4">\n      <p className="text-sm text-muted-foreground">\n        Illustrative loading, with cleanup on unmount and inactive-tab pause.\n      </p>\n      <CircularProgress\n        aria-label="Illustrative loading"\n        value={amount}\n        showLabel\n      />\n      <div className="flex flex-wrap gap-2">\n        <Button\n          onClick={() => {\n            setAmount(0);\n            setRunning(true);\n          }}\n        >\n          Start loading\n        </Button>\n        <Button\n          variant="outline"\n          onClick={() => setRunning((previous) => !previous)}\n        >\n          {running ? "Pause loading" : "Resume loading"}\n        </Button>\n        <Button variant="outline" onClick={tick}>\n          Advance 10%\n        </Button>\n      </div>\n      {amount === 100 && <output>Illustrative data ready.</output>}\n    </div>\n  );\n}';

const usageCode =
  'import { Progress, ProgressLabel, ProgressValue, CircularProgress, SegmentedProgress, KiraProgress } from "@/components/ui/progress";\n\nexport function Usage() {\n  return <div className="space-y-4">\n    <ProgressLabel id="import-label">Process imported rows</ProgressLabel>\n    <Progress value={75} min={50} max={150} bufferValue={120} aria-labelledby="import-label" showLabel />\n    <ProgressValue value={75} min={50} max={150} />\n    <CircularProgress value={75} min={50} max={150} aria-label="Process imported rows" showLabel />\n    <SegmentedProgress segments={[{ id: "documents", label: "Documents", value: 40 }]} total={100} kind="meter" aria-label="Storage used" showLabels />\n    <KiraProgress label="Prepare report" status="running" currentPhaseId="write" phases={[\n      { id: "receive", label: "Receive", weight: 1, value: 100 },\n      { id: "write", label: "Write report", weight: 3, value: 25 },\n    ]} />\n  </div>;\n}';

export default function ProgressPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Progress"
        description="Displays an indicator showing completion progress with linear, circular, and segmented variants."
        version="v2.0.1"
      />

      <FeatureGrid features={progressPageFeatures} />

      <DemoTabs tabs={progressPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={progressPageShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the progress components in your application."
        notes={[
          {
            label: "KiraProgress",
            body: "Use KiraProgress for caller-owned task lifecycles (idle, running, paused, error, complete, canceled), optional action buttons, and weighted multi-phase measurements.",
          },
        ]}
      />

      <APIReference
        sections={progressPageAPISections}
        title="API reference"
        description="Props and configuration options for all progress components."
      />
      <Changelog entries={progressPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const progressPageAPISections = [
  {
    title: "Progress",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "value / min / max",
        type: "number | null / number / number",
        description:
          "Finite values clamp. Missing/nonfinite amount is unknown. Invalid bounds fall back together to 0 to 100.",
        default: "min 0, max 100",
      },
      {
        prop: "locale / format",
        type: "Intl.LocalesArgument / Intl.NumberFormatOptions",
        description:
          "Default percent uses the normalized fraction. Explicit non-percent styles format the clamped raw value.",
      },
      {
        prop: "getAriaValueText",
        type: "(formatted: string | null, value: number | null) => string",
        description:
          "Receives the normalized formatted/clamped amount; unknown uses null.",
      },
      {
        prop: "onComplete",
        type: "() => void",
        description:
          "Once per incomplete-to-complete crossing, including a complete initial mount. StrictMode replay does not duplicate it; return below complete resets. Measurement only, not task success.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        description: "Supported size presets.",
        default: '"default"',
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        description: "Semantic fill/stroke colors.",
        default: '"default"',
      },
      {
        prop: "showLabel / striped / animated / paused",
        type: "boolean",
        description:
          "Visible amount, stripe pattern, moving stripes and animation pause. Reduced motion stops all motion; offscreen/hidden loops pause.",
        default: "false",
      },
      {
        prop: "bufferValue",
        type: "number | null",
        description:
          "Decorative secondary measurement; clamps between current and max, hidden when primary is unknown.",
      },
      {
        prop: "aria-label / aria-labelledby / aria-describedby",
        type: "string",
        description:
          "Explicit accessible name and descriptive text. Pair standalone labels with aria-labelledby.",
      },
    ],
  },
  {
    title: "CircularProgress",
    props: [
      {
        prop: "value / min / max",
        type: "number | null / number / number",
        description:
          "Finite values clamp. Missing/nonfinite amount is unknown. Invalid bounds fall back together to 0 to 100.",
        default: "min 0, max 100",
      },
      {
        prop: "locale / format",
        type: "Intl.LocalesArgument / Intl.NumberFormatOptions",
        description:
          "Default percent uses the normalized fraction. Explicit non-percent styles format the clamped raw value.",
      },
      {
        prop: "getAriaValueText",
        type: "(formatted: string | null, value: number | null) => string",
        description:
          "Receives the normalized formatted/clamped amount; unknown uses null.",
      },
      {
        prop: "onComplete",
        type: "() => void",
        description:
          "Once per incomplete-to-complete crossing, including a complete initial mount. StrictMode replay does not duplicate it; return below complete resets. Measurement only, not task success.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        description: "Supported size presets.",
        default: '"default"',
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        description: "Semantic fill/stroke colors.",
        default: '"default"',
      },
      {
        prop: "showLabel / indeterminate",
        type: "boolean",
        description: "Visible amount or force unknown state.",
        default: "false",
      },
      {
        prop: "SVG props / ref / className",
        type: "React.SVGProps<SVGSVGElement> / Ref<SVGSVGElement> / string",
        description:
          "Forwarded to inner SVG. Accessible name/description props apply to the native Base UI semantic Root.",
      },
      {
        prop: "aria-label / aria-labelledby / aria-describedby",
        type: "string",
        description:
          "Names and descriptions belong to the progressbar, outside decorative SVG.",
      },
    ],
  },
  {
    title: "SegmentedProgress",
    props: [
      {
        prop: "segments",
        type: "Segment[]",
        description:
          "id?, value, variant?, label?. Nonfinite/negative values become zero; each segment caps at remaining total. Visual and accessible values match.",
      },
      {
        prop: "total",
        type: "number",
        description: "Positive finite total; invalid totals fall back to 100.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        description: "Supported size presets.",
        default: '"default"',
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        description: "Semantic fill/stroke colors.",
        default: '"default"',
      },
      {
        prop: "showLabels / kind",
        type: 'boolean / "progress" | "meter"',
        description:
          "Visible breakdown and process/measurement semantics. Quotas use meter; onComplete only applies to process progress.",
        default: 'false / "progress"',
      },
      {
        prop: "locale / onComplete",
        type: "Intl.LocalesArgument / (() => void)",
        description: "Locale formatting and completion crossing callback.",
      },
      {
        prop: "HTML / ARIA props",
        type: "React.HTMLAttributes<HTMLDivElement>",
        description:
          "Forwarded to semantic root. Textual breakdown is always available.",
      },
    ],
  },
  {
    title: "ProgressLabel",
    props: [
      {
        prop: "HTML props / htmlFor / id",
        type: "React.LabelHTMLAttributes<HTMLLabelElement>",
        description:
          "Standalone visible label; set id and point the progressbar aria-labelledby to it. htmlFor remains supported.",
      },
    ],
  },
  {
    title: "ProgressValue",
    props: [
      {
        prop: "value / min / max",
        type: "number | null / number / number",
        description:
          "Finite values clamp. Missing/nonfinite amount is unknown. Invalid bounds fall back together to 0 to 100.",
        default: "min 0, max 100",
      },
      {
        prop: "locale / format",
        type: "Intl.LocalesArgument / Intl.NumberFormatOptions",
        description:
          "Default percent uses the normalized fraction. Explicit non-percent styles format the clamped raw value.",
      },
      {
        prop: "children",
        type: "((formatted: string | null, value: number | null) => ReactNode) | null",
        description: "Standalone renderer; no primitive context required.",
      },
      {
        prop: "HTML props",
        type: "React.HTMLAttributes<HTMLSpanElement>",
        description: "Span props including className.",
      },
    ],
  },
  {
    title: "KiraProgress",
    props: [
      {
        prop: "value / min / max",
        type: "number | null / number / number",
        description:
          "Finite values clamp. Missing/nonfinite amount is unknown. Invalid bounds fall back together to 0 to 100.",
        default: "min 0, max 100",
      },
      {
        prop: "locale / format",
        type: "Intl.LocalesArgument / Intl.NumberFormatOptions",
        description:
          "Default percent uses the normalized fraction. Explicit non-percent styles format the clamped raw value.",
      },
      {
        prop: "getAriaValueText",
        type: "(formatted: string | null, value: number | null) => string",
        description:
          "Receives the normalized formatted/clamped amount; unknown uses null.",
      },
      {
        prop: "onComplete",
        type: "() => void",
        description:
          "Once per incomplete-to-complete crossing, including a complete initial mount. StrictMode replay does not duplicate it; return below complete resets. Measurement only, not task success.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl"',
        description: "Supported size presets.",
        default: '"default"',
      },
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "destructive"',
        description: "Semantic fill/stroke colors.",
        default: '"default"',
      },
      {
        prop: "label / status",
        type: 'string / "idle" | "running" | "paused" | "error" | "complete" | "canceled"',
        description:
          "Required visible label and caller-owned lifecycle. A measured 100% never changes status.",
      },
      {
        prop: "description",
        type: "ReactNode",
        description: "Visible descriptive text linked to progressbar.",
      },
      {
        prop: "bufferValue / striped / animated / paused",
        type: "ProgressProps",
        description:
          "Linear options are inherited; lifecycle pauses unknown/stripe loops outside running.",
      },
      {
        prop: "onPause / onResume / onCancel / onRetry",
        type: "() => void",
        description:
          "Only supplied applicable controls appear. Running: Pause/Cancel; paused: Resume/Cancel; error/canceled: Retry. Focus moves safely if a control disappears.",
      },
      {
        prop: "phases",
        type: "readonly ProgressPhase[]",
        description:
          "Stable unique id, label, positive finite weight, measured value and optional min/max per phase. Weighted overall uses 0 to 100; any unknown/invalid phase makes overall unknown; empty list is unknown. Phase mode ignores overall value/min/max/buffer.",
      },
      {
        prop: "currentPhaseId",
        type: "string",
        description:
          "Explicit current phase display; ordering/execution stay caller-owned.",
      },
    ],
  },
  {
    title: "Variants and types",
    props: [
      {
        prop: "progressVariants / indicatorVariants",
        type: "CVA functions",
        description:
          "Exported track size/tone and indicator stripe composition.",
      },
      {
        prop: "Exported types",
        type: "ProgressProps, ProgressLabelProps, ProgressValueProps, ProgressRange, CircularProgressProps, SegmentedProgressProps, Segment, KiraProgressProps, ProgressStatus, ProgressPhase",
        description: "Shared ranges and lifecycle/phase contracts.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const progressPageFeatures = [
  {
    title: "Measured variants",
    description:
      "Linear, circular, and segmented progress indicators with size and color variants.",
    icon: <IconChartBar className="h-4 w-4" />,
  },
  {
    title: "Lifecycle and phases",
    description:
      "Caller-owned actions and weighted phases distinguish measurement from success; see Kira and Weighted Phases.",
    icon: <IconLoader className="h-4 w-4" />,
  },
  {
    title: "Buffered background work",
    description:
      "Received and processed layers plus a local background-task popup; see Buffer and Background Tasks.",
    icon: <IconPalette className="h-4 w-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const progressPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    value: "labels",
    label: "Labels",
    group: "Core",
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
    value: "segmented",
    label: "Segmented",
    group: "Core",
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
    group: "Core",
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
    value: "kira",
    label: "Kira / Lifecycle",
    group: "KiraProgress",
    demo: (active: boolean) => (
      <DemoWrapper
        title="Caller-owned lifecycle"
        description="Unknown, measured, pause/resume, error/retry, cancel/restart and explicit completion."
        code={lifecycleCode}
      >
        <LifecycleDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "phases",
    label: "Weighted Phases",
    group: "KiraProgress",
    demo: (
      <DemoWrapper
        title="Weighted measurements"
        description="Stable phase IDs and measured amounts; unknown phases keep overall amount unknown."
        code={phasesCode}
      >
        <PhasesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "background",
    label: "Background Tasks",
    group: "KiraProgress",
    demo: (active: boolean) => (
      <DemoWrapper
        title="Progress inside a Popover"
        description="Local demo composition; closing the popup does not stop work."
        code={backgroundCode}
      >
        <BackgroundTasksDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "buffer",
    label: "Buffer",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Received and processed"
        description="A decorative buffer layer shares the primary range."
        code={bufferCode}
      >
        <BufferDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "animated",
    label: "Animated",
    group: "Behavior",
    demo: (active: boolean) => (
      <DemoWrapper
        title="Animated Progress"
        description="Progress bar with smooth value transitions."
        code={animatedCode}
      >
        <AnimatedDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "indeterminate",
    label: "Indeterminate",
    group: "Behavior",
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
    group: "Behavior",
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
    value: "locale",
    label: "Locale",
    group: "Behavior",
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
    group: "Behavior",
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
    group: "Behavior",
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
    value: "loading",
    label: "Loading Example",
    group: "Behavior",
    demo: (active: boolean) => (
      <DemoWrapper
        title="Loading Example"
        description="Circular progress used in a realistic loading state scenario."
        code={loadingExampleCode}
      >
        <LoadingExampleDemo active={active} />
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
        description="RTL, long labels, empty/nonfinite values, disabled states, invalid ranges, clamps, and StrictMode completion reentry in a narrow max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const progressPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move among lifecycle controls. Progress indicators themselves are read-only and have no keyboard commands.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate Pause, Resume, Cancel or Retry. The caller owns work and status; 100% does not confirm success.",
  },
  {
    keys: "Escape",
    description:
      "In Background Tasks: inherited from Base UI Popover, closes the popup and returns focus to its trigger. Tasks continue.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const progressPageChangelogEntries = [
  {
    version: "2.0.1",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Shared useVisibilityPause hook",
        description:
          "Adopted useVisibilityPause from @/hooks/use-visibility-pause instead of duplicating document visibility and IntersectionObserver pause logic inline.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "9 November 2026",
    changes: [
      {
        type: "added",
        title:
          "Buffer layer, KiraProgress lifecycle, weighted phases and background-task composition",
        description:
          "Audited against Base UI 1.9.0; caller owns execution and explicit success.",
      },
      {
        type: "fixed",
        title:
          "Shared normalization, native circular semantics, standalone value formatting, paused/offscreen/reduced motion",
      },
      {
        type: "breaking",
        title: "Corrected range and unknown-value behavior",
        description:
          "min participates in every percentage; invalid bounds fall back to 0–100; missing/nonfinite circular values are unknown; segments clamp cumulatively and quota examples use meter semantics. Circular SVG props/ref stay on the inner SVG. onComplete signals a measured crossing, including initial complete, once in StrictMode; it never means backend success.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
