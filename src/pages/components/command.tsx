import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconCheck,
  IconCommand,
  IconFileText,
  IconSearch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  KiraCommand,
  KiraCommandDialog,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";
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
  const [drafts, setDrafts] = React.useState(0);

  const [message, setMessage] = React.useState(
    "Choose an action to update this local preview.",
  );

  return (
    <div className="max-w-lg space-y-4">
      <Command label="Draft actions">
        <CommandInput placeholder="Search draft actions…" />
        <CommandList>
          <CommandEmpty>No matching actions. Try “draft”.</CommandEmpty>
          <CommandItem
            value="new-draft"
            keywords={["create", "document"]}
            onSelect={() => {
              setDrafts((count) => count + 1);
              setMessage("A draft was added to this local preview.");
            }}
          >
            <IconFileText aria-hidden="true" className="size-4" />
            <span className="min-w-0 flex-1">New draft</span>
            <CommandShortcut>
              <Kbd keys="enter" size="sm" />
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            value="mark-ready"
            keywords={["review", "ready"]}
            onSelect={() => setMessage("The local review is marked ready.")}
          >
            <IconCheck aria-hidden="true" className="size-4" />
            <span>Mark review ready</span>
          </CommandItem>
          <CommandItem
            value="clear-drafts"
            keywords={["reset", "clear"]}
            onSelect={() => {
              setDrafts(0);
              setMessage("The local draft counter was cleared.");
            }}
          >
            Clear draft counter
          </CommandItem>
        </CommandList>
      </Command>
      <p className="text-sm text-muted-foreground tabular-nums">
        Local drafts: {drafts}
      </p>
      <output className="block text-sm text-muted-foreground">{message}</output>
    </div>
  );
}

const basicCode =
  'import * as React from "react";\nimport { IconCheck, IconFileText } from "@tabler/icons-react";\nimport { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandShortcut } from "@/components/ui/command";\nimport { Kbd } from "@/components/ui/kbd";\n\nexport function BasicDemo() {\n  const [drafts, setDrafts] = React.useState(0);\n\n  const [message, setMessage] = React.useState(\n    "Choose an action to update this local preview.",\n  );\n\n  return (\n    <div className="max-w-lg space-y-4">\n      <Command label="Draft actions">\n        <CommandInput placeholder="Search draft actions…" />\n        <CommandList>\n          <CommandEmpty>No matching actions. Try “draft”.</CommandEmpty>\n          <CommandItem\n            value="new-draft"\n            keywords={["create", "document"]}\n            onSelect={() => {\n              setDrafts((count) => count + 1);\n              setMessage("A draft was added to this local preview.");\n            }}\n          >\n            <IconFileText aria-hidden="true" className="size-4" />\n            <span className="min-w-0 flex-1">New draft</span>\n            <CommandShortcut>\n              <Kbd keys="enter" size="sm" />\n            </CommandShortcut>\n          </CommandItem>\n          <CommandItem\n            value="mark-ready"\n            keywords={["review", "ready"]}\n            onSelect={() => setMessage("The local review is marked ready.")}\n          >\n            <IconCheck aria-hidden="true" className="size-4" />\n            <span>Mark review ready</span>\n          </CommandItem>\n          <CommandItem\n            value="clear-drafts"\n            keywords={["reset", "clear"]}\n            onSelect={() => {\n              setDrafts(0);\n              setMessage("The local draft counter was cleared.");\n            }}\n          >\n            Clear draft counter\n          </CommandItem>\n        </CommandList>\n      </Command>\n      <p className="text-sm text-muted-foreground tabular-nums">\n        Local drafts: {drafts}\n      </p>\n      <p role="status" className="text-sm text-muted-foreground">\n        {message}\n      </p>\n    </div>\n  );\n}';

function VariantsDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {(
        [
          { variant: "default", size: "sm", title: "Default / Small" },
          { variant: "minimal", size: "default", title: "Minimal / Default" },
          { variant: "bordered", size: "lg", title: "Bordered / Large" },
        ] as const
      ).map(({ variant, size, title }) => (
        <div key={variant} className="min-w-0 space-y-3">
          <p className="text-sm font-medium">{title}</p>
          <Command variant={variant} size={size} label={title}>
            <CommandInput placeholder="Search reports…" />
            <CommandList className="max-h-none">
              {[
                "Weekly support review",
                "Release notes",
                "Accessibility findings",
                "Draft checklist",
                "Team feedback",
                "Research summary",
                "Customer interviews",
                "Bug triage",
                "Design decisions",
                "Project notes",
                "Review requests",
                "Integration guide",
              ].map((label) => (
                <CommandItem key={label} value={label}>
                  {label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      ))}
    </div>
  );
}

const variantsCode =
  'import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";\n\nexport function VariantsDemo() {\n  return (\n    <div className="grid gap-6 lg:grid-cols-3">\n      {(\n        [\n          { variant: "default", size: "sm", title: "Default / Small" },\n          { variant: "minimal", size: "default", title: "Minimal / Default" },\n          { variant: "bordered", size: "lg", title: "Bordered / Large" },\n        ] as const\n      ).map(({ variant, size, title }) => (\n        <div key={variant} className="min-w-0 space-y-3">\n          <p className="text-sm font-medium">{title}</p>\n          <Command variant={variant} size={size} label={title}>\n            <CommandInput placeholder="Search reports…" />\n            <CommandList className="max-h-none">\n              {[\n                "Weekly support review",\n                "Release notes",\n                "Accessibility findings",\n                "Draft checklist",\n                "Team feedback",\n                "Research summary",\n                "Customer interviews",\n                "Bug triage",\n                "Design decisions",\n                "Project notes",\n                "Review requests",\n                "Integration guide",\n              ].map((label) => (\n                <CommandItem key={label} value={label}>\n                  {label}\n                </CommandItem>\n              ))}\n            </CommandList>\n          </Command>\n        </div>\n      ))}\n    </div>\n  );\n}';

function InteractionDemo() {
  const [lastAction, setLastAction] = React.useState("Choose an action.");

  return (
    <div className="max-w-lg space-y-4">
      <KiraCommand
        label="Interaction and spacing examples"
        actions={[
          {
            id: "notes",
            label: "Open notes",
            onSelect: () => setLastAction("Notes opened locally."),
          },
          {
            id: "draft",
            label: "Create a draft",
            icon: <IconFileText />,
            onSelect: () => setLastAction("Draft created locally."),
          },
          {
            id: "review",
            label: "Review a handoff",
            description: "Compare a title-only row with an explained action.",
            icon: <IconCheck />,
            onSelect: () => setLastAction("Handoff selected locally."),
          },
        ]}
      />
      <output className="block text-sm text-muted-foreground">
        {lastAction}
      </output>
      <KiraCommandDialog
        title="Workspace actions"
        trigger={
          <Button variant="outline">
            <IconCommand aria-hidden="true" />
            Open animated palette
          </Button>
        }
        actions={[
          {
            id: "workspace-actions",
            kind: "page",
            label: "Choose a workspace",
            description: "Open a scoped page of local workspaces.",
            actions: [
              {
                id: "design",
                label: "Design workspace",
                onSelect: () =>
                  setLastAction("Design workspace selected locally."),
              },
              {
                id: "research",
                label: "Research workspace",
                onSelect: () =>
                  setLastAction("Research workspace selected locally."),
              },
            ],
          },
        ]}
      />
      <p className="text-sm leading-6 text-muted-foreground">
        Move the pointer over a row, then away. Use the arrow keys in search to
        highlight a command. The focus border follows the search field's radius.
        Open the palette to try its entrance, exit, and scoped-page transitions.
      </p>
    </div>
  );
}

const interactionCode =
  'import * as React from "react";\nimport { IconCheck, IconCommand, IconFileText } from "@tabler/icons-react";\nimport { Button } from "@/components/ui/button";\nimport { KiraCommand, KiraCommandDialog } from "@/components/ui/command";\n\nexport function InteractionDemo() {\n  const [lastAction, setLastAction] = React.useState("Choose an action.");\n\n  return (\n    <div className="max-w-lg space-y-4">\n      <KiraCommand\n        label="Interaction and spacing examples"\n        actions={[\n          {\n            id: "notes",\n            label: "Open notes",\n            onSelect: () => setLastAction("Notes opened locally."),\n          },\n          {\n            id: "draft",\n            label: "Create a draft",\n            icon: <IconFileText />,\n            onSelect: () => setLastAction("Draft created locally."),\n          },\n          {\n            id: "review",\n            label: "Review a handoff",\n            description: "Compare a title-only row with an explained action.",\n            icon: <IconCheck />,\n            onSelect: () => setLastAction("Handoff selected locally."),\n          },\n        ]}\n      />\n      <output className="block text-sm text-muted-foreground">\n        {lastAction}\n      </output>\n      <KiraCommandDialog\n        title="Workspace actions"\n        trigger={\n          <Button variant="outline">\n            <IconCommand aria-hidden="true" />\n            Open animated palette\n          </Button>\n        }\n        actions={[\n          {\n            id: "workspace-actions",\n            kind: "page",\n            label: "Choose a workspace",\n            description: "Open a scoped page of local workspaces.",\n            actions: [\n              {\n                id: "design",\n                label: "Design workspace",\n                onSelect: () =>\n                  setLastAction("Design workspace selected locally."),\n              },\n              {\n                id: "research",\n                label: "Research workspace",\n                onSelect: () =>\n                  setLastAction("Research workspace selected locally."),\n              },\n            ],\n          },\n        ]}\n      />\n      <p className="text-sm leading-6 text-muted-foreground">\n        Move the pointer over a row, then away. Use the arrow keys in search to\n        highlight a command. The focus border follows the search field\'s radius.\n        Open the palette to try its entrance, exit, and scoped-page transitions.\n      </p>\n    </div>\n  );\n}';

function GroupsDemo() {
  const [message, setMessage] = React.useState(
    "Search “prefs” or “create” to try aliases.",
  );

  return (
    <div className="max-w-lg space-y-4">
      <Command label="Grouped workspace actions" loop>
        <CommandInput placeholder="Search workspace actions…" />
        <CommandList>
          <CommandEmpty>No matches. Try “prefs” or “create”.</CommandEmpty>
          <CommandGroup heading="Workspace">
            <CommandItem
              value="preferences"
              keywords={["settings", "prefs"]}
              onSelect={() => setMessage("Workspace preferences selected.")}
            >
              Preferences
              <CommandShortcut>
                <Kbd keys="enter" size="sm" />
              </CommandShortcut>
            </CommandItem>
            <CommandItem
              value="members"
              keywords={["team", "people"]}
              onSelect={() => setMessage("Team members selected.")}
            >
              Team members
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Drafts">
            <CommandItem
              value="new-document"
              keywords={["create", "draft"]}
              onSelect={() => setMessage("New draft selected.")}
            >
              New draft
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <output className="block text-sm text-muted-foreground">{message}</output>
    </div>
  );
}

const groupsCode =
  'import * as React from "react";\nimport { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from "@/components/ui/command";\nimport { Kbd } from "@/components/ui/kbd";\n\nexport function GroupsDemo() {\n  const [message, setMessage] = React.useState(\n    "Search “prefs” or “create” to try aliases.",\n  );\n\n  return (\n    <div className="max-w-lg space-y-4">\n      <Command label="Grouped workspace actions" loop>\n        <CommandInput placeholder="Search workspace actions…" />\n        <CommandList>\n          <CommandEmpty>No matches. Try “prefs” or “create”.</CommandEmpty>\n          <CommandGroup heading="Workspace">\n            <CommandItem\n              value="preferences"\n              keywords={["settings", "prefs"]}\n              onSelect={() => setMessage("Workspace preferences selected.")}\n            >\n              Preferences\n              <CommandShortcut>\n                <Kbd keys="enter" size="sm" />\n              </CommandShortcut>\n            </CommandItem>\n            <CommandItem\n              value="members"\n              keywords={["team", "people"]}\n              onSelect={() => setMessage("Team members selected.")}\n            >\n              Team members\n            </CommandItem>\n          </CommandGroup>\n          <CommandSeparator />\n          <CommandGroup heading="Drafts">\n            <CommandItem\n              value="new-document"\n              keywords={["create", "draft"]}\n              onSelect={() => setMessage("New draft selected.")}\n            >\n              New draft\n            </CommandItem>\n          </CommandGroup>\n        </CommandList>\n      </Command>\n      <p role="status" className="text-sm text-muted-foreground">\n        {message}\n      </p>\n    </div>\n  );\n}';

function KiraDemo() {
  const [drafts, setDrafts] = React.useState(0);
  const [reviewed, setReviewed] = React.useState(false);

  return (
    <div className="max-w-lg space-y-4">
      <KiraCommand
        label="Review actions"
        actions={[
          {
            id: "new-draft",
            label: "Create a review draft",
            description: "Add a draft to this local preview.",
            icon: <IconFileText />,
            group: "Drafts",
            keywords: ["new", "document"],
            onSelect: () => setDrafts((count) => count + 1),
            successMessage: "Review draft added locally.",
          },
          {
            id: "reviewed",
            label: reviewed ? "Mark as needing review" : "Mark as reviewed",
            icon: <IconCheck />,
            group: "Review",
            onSelect: () => setReviewed((value) => !value),
            successMessage: "Local review status updated.",
          },
          {
            id: "publish",
            label: "Publish draft",
            group: "Review",
            disabled: true,
            disabledReason: "Publishing is unavailable in this local preview.",
            onSelect: () => {},
          },
        ]}
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        Local drafts: {drafts}. Status: {reviewed ? "reviewed" : "needs review"}
        .
      </p>
    </div>
  );
}

const kiraCode =
  'import * as React from "react";\nimport { IconCheck, IconFileText } from "@tabler/icons-react";\nimport { KiraCommand } from "@/components/ui/command";\n\nexport function KiraDemo() {\n  const [drafts, setDrafts] = React.useState(0);\n  const [reviewed, setReviewed] = React.useState(false);\n\n  return (\n    <div className="max-w-lg space-y-4">\n      <KiraCommand\n        label="Review actions"\n        actions={[\n          {\n            id: "new-draft",\n            label: "Create a review draft",\n            description: "Add a draft to this local preview.",\n            icon: <IconFileText />,\n            group: "Drafts",\n            keywords: ["new", "document"],\n            onSelect: () => setDrafts((count) => count + 1),\n            successMessage: "Review draft added locally.",\n          },\n          {\n            id: "reviewed",\n            label: reviewed ? "Mark as needing review" : "Mark as reviewed",\n            icon: <IconCheck />,\n            group: "Review",\n            onSelect: () => setReviewed((value) => !value),\n            successMessage: "Local review status updated.",\n          },\n          {\n            id: "publish",\n            label: "Publish draft",\n            group: "Review",\n            disabled: true,\n            disabledReason: "Publishing is unavailable in this local preview.",\n            onSelect: () => {},\n          },\n        ]}\n      />\n      <p className="text-sm text-muted-foreground tabular-nums">\n        Local drafts: {drafts}. Status: {reviewed ? "reviewed" : "needs review"}\n        .\n      </p>\n    </div>\n  );\n}';

function ContextDemo() {
  const [context, setContext] = React.useState("project");
  const [paused, setPaused] = React.useState(false);
  const [drafts, setDrafts] = React.useState(0);

  return (
    <div className="max-w-lg space-y-5">
      <RadioButtonGroup
        value={context}
        onValueChange={setContext}
        aria-label="Action context"
        size="sm"
      >
        <RadioButton value="project">Project</RadioButton>
        <RadioButton value="queue">Task queue</RadioButton>
      </RadioButtonGroup>
      <KiraCommand
        key={context}
        label={context === "project" ? "Project actions" : "Queue actions"}
        actions={
          context === "project"
            ? [
                {
                  id: "create-draft",
                  label: "Create review draft",
                  description: "Prepare another local review item.",
                  onSelect: () => setDrafts((count) => count + 1),
                },
              ]
            : [
                {
                  id: "pause-queue",
                  label: paused
                    ? "Resume preview queue"
                    : "Pause preview queue",
                  description: "Change the local queue state.",
                  onSelect: () => setPaused((value) => !value),
                  successMessage: "Preview queue state updated.",
                },
                {
                  id: "retry-job",
                  label: "Retry failed job",
                  disabledReason: "There are no failed jobs in this preview.",
                  onSelect: () => {},
                },
              ]
        }
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        Local drafts: {drafts}. Preview queue: {paused ? "paused" : "running"}.
      </p>
    </div>
  );
}

const contextCode =
  'import * as React from "react";\nimport { KiraCommand } from "@/components/ui/command";\nimport { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";\n\nexport function ContextDemo() {\n  const [context, setContext] = React.useState("project");\n  const [paused, setPaused] = React.useState(false);\n  const [drafts, setDrafts] = React.useState(0);\n\n  return (\n    <div className="max-w-lg space-y-5">\n      <RadioButtonGroup\n        value={context}\n        onValueChange={setContext}\n        aria-label="Action context"\n        size="sm"\n      >\n        <RadioButton value="project">Project</RadioButton>\n        <RadioButton value="queue">Task queue</RadioButton>\n      </RadioButtonGroup>\n      <KiraCommand\n        key={context}\n        label={context === "project" ? "Project actions" : "Queue actions"}\n        actions={\n          context === "project"\n            ? [\n                {\n                  id: "create-draft",\n                  label: "Create review draft",\n                  description: "Prepare another local review item.",\n                  onSelect: () => setDrafts((count) => count + 1),\n                },\n              ]\n            : [\n                {\n                  id: "pause-queue",\n                  label: paused\n                    ? "Resume preview queue"\n                    : "Pause preview queue",\n                  description: "Change the local queue state.",\n                  onSelect: () => setPaused((value) => !value),\n                  successMessage: "Preview queue state updated.",\n                },\n                {\n                  id: "retry-job",\n                  label: "Retry failed job",\n                  disabledReason: "There are no failed jobs in this preview.",\n                  onSelect: () => {},\n                },\n              ]\n        }\n      />\n      <p className="text-sm text-muted-foreground tabular-nums">\n        Local drafts: {drafts}. Preview queue: {paused ? "paused" : "running"}.\n      </p>\n    </div>\n  );\n}';

function PagesDemo() {
  const [workspace, setWorkspace] = React.useState("Northwind");

  return (
    <div className="max-w-lg space-y-4">
      <KiraCommand
        label="Workspace commands"
        actions={[
          {
            id: "switch-workspace",
            kind: "page",
            label: "Switch workspace",
            description: "Open a scoped list of workspaces.",
            keywords: ["project", "team"],
            actions: [
              {
                id: "northwind",
                label: "Northwind",
                onSelect: () => setWorkspace("Northwind"),
              },
              {
                id: "research",
                label: "Research",
                onSelect: () => setWorkspace("Research"),
              },
              {
                id: "more-workspaces",
                kind: "page",
                label: "More workspaces",
                actions: [
                  {
                    id: "accessibility",
                    label: "Accessibility research",
                    onSelect: () => setWorkspace("Accessibility research"),
                  },
                ],
              },
            ],
          },
          {
            id: "review-inbox",
            label: "Open review inbox",
            onSelect: () => setWorkspace("Review inbox preview"),
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        Local selection: {workspace}.
      </p>
    </div>
  );
}

const pagesCode =
  'import * as React from "react";\nimport { KiraCommand } from "@/components/ui/command";\n\nexport function PagesDemo() {\n  const [workspace, setWorkspace] = React.useState("Northwind");\n\n  return (\n    <div className="max-w-lg space-y-4">\n      <KiraCommand\n        label="Workspace commands"\n        actions={[\n          {\n            id: "switch-workspace",\n            kind: "page",\n            label: "Switch workspace",\n            description: "Open a scoped list of workspaces.",\n            keywords: ["project", "team"],\n            actions: [\n              {\n                id: "northwind",\n                label: "Northwind",\n                onSelect: () => setWorkspace("Northwind"),\n              },\n              {\n                id: "research",\n                label: "Research",\n                onSelect: () => setWorkspace("Research"),\n              },\n              {\n                id: "more-workspaces",\n                kind: "page",\n                label: "More workspaces",\n                actions: [\n                  {\n                    id: "accessibility",\n                    label: "Accessibility research",\n                    onSelect: () => setWorkspace("Accessibility research"),\n                  },\n                ],\n              },\n            ],\n          },\n          {\n            id: "review-inbox",\n            label: "Open review inbox",\n            onSelect: () => setWorkspace("Review inbox preview"),\n          },\n        ]}\n      />\n      <p className="text-sm text-muted-foreground">\n        Local selection: {workspace}.\n      </p>\n    </div>\n  );\n}';

function AsyncDemo() {
  const [failNext, setFailNext] = React.useState(true);
  const [attempts, setAttempts] = React.useState(0);
  const [reports, setReports] = React.useState(0);

  return (
    <div className="max-w-lg space-y-5">
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={failNext}
          onChange={(event) => setFailNext(event.target.checked)}
          className="size-4 accent-primary"
        />
        Fail the next preview attempt
      </label>
      <KiraCommand
        label="Report preview actions"
        actions={[
          {
            id: "prepare-preview",
            label: "Prepare report preview",
            description: "A local fixture with a short simulated delay.",
            successMessage: "Report preview prepared locally.",
            onSelect: async ({ signal }) => {
              const fail = failNext;
              setFailNext(false);
              setAttempts((count) => count + 1);
              await new Promise<void>((resolve, reject) => {
                if (signal.aborted) {
                  reject(new DOMException("Cancelled", "AbortError"));

                  return;
                }

                const abort = () => {
                  clearTimeout(timer);
                  reject(new DOMException("Cancelled", "AbortError"));
                };

                const timer = setTimeout(() => {
                  signal.removeEventListener("abort", abort);
                  resolve();
                }, 900);

                signal.addEventListener("abort", abort, { once: true });
              });

              if (fail)
                throw new Error(
                  "The preview fixture could not finish. Retry to prepare it again.",
                );
              setReports((count) => count + 1);
            },
          },
        ]}
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        Attempts: {attempts}. Previews prepared: {reports}.
      </p>
      <p className="text-xs leading-5 text-muted-foreground">
        Cancel or Escape requests cancellation. No report or network job is
        created.
      </p>
    </div>
  );
}

const asyncCode =
  'import * as React from "react";\nimport { KiraCommand } from "@/components/ui/command";\n\nexport function AsyncDemo() {\n  const [failNext, setFailNext] = React.useState(true);\n  const [attempts, setAttempts] = React.useState(0);\n  const [reports, setReports] = React.useState(0);\n\n  return (\n    <div className="max-w-lg space-y-5">\n      <label className="flex min-h-11 items-center gap-3 text-sm">\n        <input\n          type="checkbox"\n          checked={failNext}\n          onChange={(event) => setFailNext(event.target.checked)}\n          className="size-4 accent-primary"\n        />\n        Fail the next preview attempt\n      </label>\n      <KiraCommand\n        label="Report preview actions"\n        actions={[\n          {\n            id: "prepare-preview",\n            label: "Prepare report preview",\n            description: "A local fixture with a short simulated delay.",\n            successMessage: "Report preview prepared locally.",\n            onSelect: async ({ signal }) => {\n              const fail = failNext;\n              setFailNext(false);\n              setAttempts((count) => count + 1);\n              await new Promise<void>((resolve, reject) => {\n                if (signal.aborted) {\n                  reject(new DOMException("Cancelled", "AbortError"));\n\n                  return;\n                }\n\n                const abort = () => {\n                  clearTimeout(timer);\n                  reject(new DOMException("Cancelled", "AbortError"));\n                };\n\n                const timer = setTimeout(() => {\n                  signal.removeEventListener("abort", abort);\n                  resolve();\n                }, 900);\n\n                signal.addEventListener("abort", abort, { once: true });\n              });\n\n              if (fail)\n                throw new Error(\n                  "The preview fixture could not finish. Retry to prepare it again.",\n                );\n              setReports((count) => count + 1);\n            },\n          },\n        ]}\n      />\n      <p className="text-sm text-muted-foreground tabular-nums">\n        Attempts: {attempts}. Previews prepared: {reports}.\n      </p>\n      <p className="text-xs leading-5 text-muted-foreground">\n        Cancel or Escape requests cancellation. No report or network job is\n        created.\n      </p>\n    </div>\n  );\n}';

function SearchDemo() {
  const [query, setQuery] = React.useState("");
  const [selection, setSelection] = React.useState("");

  const documents = [
    "Release checklist",
    "Accessibility review",
    "Support handoff",
  ];

  return (
    <div className="max-w-lg space-y-4">
      <KiraCommand
        label="Document search"
        shouldFilter={false}
        search={query}
        onSearchChange={setQuery}
        placeholder="Search document previews…"
        actions={documents.flatMap((name) => {
          if (!name.toLowerCase().includes(query.toLowerCase())) return [];

          return [
            {
              id: name,
              label: name,
              description: "Results supplied by the caller.",
              onSelect: () => setSelection(name),
            },
          ];
        })}
        emptyMessage="No document previews match this search."
      />
      <p className="text-sm text-muted-foreground">
        {selection
          ? `Selected preview: ${selection}.`
          : "Filtering happens in this demo's caller. No remote search is connected."}
      </p>
    </div>
  );
}

const searchCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import * as React from "react";\nimport { KiraCommand } from "@/components/ui/command";\n\nexport function SearchDemo() {\n  const [query, setQuery] = React.useState("");\n  const [selection, setSelection] = React.useState("");\n\n  const documents = [\n    "Release checklist",\n    "Accessibility review",\n    "Support handoff",\n  ];\n\n  return (\n    <div className="max-w-lg space-y-4">\n      <KiraCommand\n        label="Document search"\n        shouldFilter={false}\n        search={query}\n        onSearchChange={setQuery}\n        placeholder="Search document previews…"\n        actions={documents.flatMap((name) => {\n          if (!name.toLowerCase().includes(query.toLowerCase())) return [];\n\n          return [\n            {\n              id: name,\n              label: name,\n              description: "Results supplied by the caller.",\n              onSelect: () => setSelection(name),\n            },\n          ];\n        })}\n        emptyMessage="No document previews match this search."\n      />\n      <p className="text-sm text-muted-foreground">\n        {selection\n          ? `Selected preview: ${selection}.`\n          : "Filtering happens in this demo\'s caller. No remote search is connected."}\n      </p>\n    </div>\n  );\n}';

function StatesDemo() {
  const [state, setState] = React.useState("ready");

  return (
    <div className="max-w-lg space-y-5">
      <RadioButtonGroup
        value={state}
        onValueChange={setState}
        aria-label="Command state fixture"
        size="sm"
      >
        {["ready", "loading", "empty", "error", "unavailable"].map((value) => (
          <RadioButton key={value} value={value}>
            {value}
          </RadioButton>
        ))}
      </RadioButtonGroup>
      <KiraCommand
        key={state}
        label="State examples"
        loading={state === "loading"}
        loadingLabel="Loading review actions…"
        loadError={
          state === "error"
            ? "Review actions could not load. Retry to restore the local fixture."
            : undefined
        }
        onRetryLoad={() => setState("ready")}
        actions={
          state === "empty" || state === "loading" || state === "error"
            ? []
            : [
                {
                  id: "review",
                  label: "Review draft",
                  disabledReason:
                    state === "unavailable"
                      ? "A draft must be assigned before it can be reviewed."
                      : undefined,
                  onSelect: () => {},
                },
              ]
        }
        emptyMessage="No drafts are waiting for review."
      />
    </div>
  );
}

const statesCode =
  'import * as React from "react";\nimport { KiraCommand } from "@/components/ui/command";\nimport { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";\n\nexport function StatesDemo() {\n  const [state, setState] = React.useState("ready");\n\n  return (\n    <div className="max-w-lg space-y-5">\n      <RadioButtonGroup\n        value={state}\n        onValueChange={setState}\n        aria-label="Command state fixture"\n        size="sm"\n      >\n        {["ready", "loading", "empty", "error", "unavailable"].map((value) => (\n          <RadioButton key={value} value={value}>\n            {value}\n          </RadioButton>\n        ))}\n      </RadioButtonGroup>\n      <KiraCommand\n        key={state}\n        label="State examples"\n        loading={state === "loading"}\n        loadingLabel="Loading review actions…"\n        loadError={\n          state === "error"\n            ? "Review actions could not load. Retry to restore the local fixture."\n            : undefined\n        }\n        onRetryLoad={() => setState("ready")}\n        actions={\n          state === "empty" || state === "loading" || state === "error"\n            ? []\n            : [\n                {\n                  id: "review",\n                  label: "Review draft",\n                  disabledReason:\n                    state === "unavailable"\n                      ? "A draft must be assigned before it can be reviewed."\n                      : undefined,\n                  onSelect: () => {},\n                },\n              ]\n        }\n        emptyMessage="No drafts are waiting for review."\n      />\n    </div>\n  );\n}';

function DialogDemo({
  shortcutEnabled = false,
}: {
  shortcutEnabled?: boolean;
}) {
  const [drafts, setDrafts] = React.useState(0);

  return (
    <div className="space-y-4">
      <KiraCommandDialog
        title="Draft commands"
        shortcut={shortcutEnabled}
        closeOnSelect
        actions={[
          {
            id: "new-dialog-draft",
            label: "Create a local draft",
            description: "Increment the draft preview and close the palette.",
            onSelect: () => setDrafts((count) => count + 1),
          },
        ]}
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        Local drafts: {drafts}. Cmd/Ctrl+K is enabled only while this tab is
        active.
      </p>
    </div>
  );
}

const dialogCode =
  'import * as React from "react";\nimport { KiraCommandDialog } from "@/components/ui/command";\n\nexport function DialogDemo({\n  shortcutEnabled = false,\n}: {\n  shortcutEnabled?: boolean;\n}) {\n  const [drafts, setDrafts] = React.useState(0);\n\n  return (\n    <div className="space-y-4">\n      <KiraCommandDialog\n        title="Draft commands"\n        shortcut={shortcutEnabled}\n        closeOnSelect\n        actions={[\n          {\n            id: "new-dialog-draft",\n            label: "Create a local draft",\n            description: "Increment the draft preview and close the palette.",\n            onSelect: () => setDrafts((count) => count + 1),\n          },\n        ]}\n      />\n      <p className="text-sm text-muted-foreground tabular-nums">\n        Local drafts: {drafts}. Cmd/Ctrl+K is enabled only while this tab is\n        active.\n      </p>\n    </div>\n  );\n}';

function StressDemo() {
  const [data, setData] = React.useState("demo");
  const worst = data === "worst";

  return (
    <div className="max-w-80 space-y-5">
      <RadioButtonGroup
        value={data}
        onValueChange={setData}
        aria-label="Command fixture data"
        size="sm"
      >
        <RadioButton value="demo">Demo data</RadioButton>
        <RadioButton value="worst">Worst case</RadioButton>
      </RadioButtonGroup>
      <KiraCommand
        label="Long-content examples"
        actions={[
          {
            id: "review-long",
            label: worst
              ? "Review the Northwind international customer support and accessibility research handoff"
              : "Review handoff",
            description: worst
              ? "research-and-accessibility-reviews@northwind-international.example.com"
              : undefined,
            shortcut: worst ? "mod+shift+alt+r" : undefined,
            onSelect: () => {},
          },
          {
            id: "thai",
            label: worst
              ? "ตรวจสอบเอกสารสำหรับพื้นที่ทำงานของทีมวิจัยและการเข้าถึง"
              : "Research notes",
            description: worst
              ? "เลือกคำสั่งที่เหมาะสมและตรวจสอบรายละเอียดก่อนดำเนินการ"
              : undefined,
            onSelect: () => {},
          },
          {
            id: "short",
            label: worst ? "Å" : "Personal notes",
            onSelect: () => {},
          },
        ]}
      />
    </div>
  );
}

const stressCode =
  'import * as React from "react";\nimport { KiraCommand } from "@/components/ui/command";\nimport { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";\n\nexport function StressDemo() {\n  const [data, setData] = React.useState("demo");\n  const worst = data === "worst";\n\n  return (\n    <div className="max-w-80 space-y-5">\n      <RadioButtonGroup\n        value={data}\n        onValueChange={setData}\n        aria-label="Command fixture data"\n        size="sm"\n      >\n        <RadioButton value="demo">Demo data</RadioButton>\n        <RadioButton value="worst">Worst case</RadioButton>\n      </RadioButtonGroup>\n      <KiraCommand\n        label="Long-content examples"\n        actions={[\n          {\n            id: "review-long",\n            label: worst\n              ? "Review the Northwind international customer support and accessibility research handoff"\n              : "Review handoff",\n            description: worst\n              ? "research-and-accessibility-reviews@northwind-international.example.com"\n              : undefined,\n            shortcut: worst ? "mod+shift+alt+r" : undefined,\n            onSelect: () => {},\n          },\n          {\n            id: "thai",\n            label: worst\n              ? "ตรวจสอบเอกสารสำหรับพื้นที่ทำงานของทีมวิจัยและการเข้าถึง"\n              : "Research notes",\n            description: worst\n              ? "เลือกคำสั่งที่เหมาะสมและตรวจสอบรายละเอียดก่อนดำเนินการ"\n              : undefined,\n            onSelect: () => {},\n          },\n          {\n            id: "short",\n            label: worst ? "Å" : "Personal notes",\n            onSelect: () => {},\n          },\n        ]}\n      />\n    </div>\n  );\n}';

function MigrationDemo() {
  return (
    <div className="space-y-4">
      <p className="max-w-lg text-sm leading-6 text-muted-foreground">
        Existing command exports remain available. Use CommandDialog for a
        labeled Base UI popup, stable values for items, and data-slot hooks for
        styling.
      </p>
      <CommandDialog
        title="Migration example"
        trigger={<Button variant="outline">Open command dialog</Button>}
      >
        <Command label="Migration actions" size="sm">
          <CommandInput placeholder="Search actions…" />
          <CommandList>
            <CommandItem value="review-draft">Review draft</CommandItem>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

const migrationCode =
  'import { Button } from "@/components/ui/button";\nimport { Command, CommandDialog, CommandInput, CommandList, CommandItem } from "@/components/ui/command";\n\nexport function MigrationDemo() {\n  return (\n    <div className="space-y-4">\n      <p className="max-w-lg text-sm leading-6 text-muted-foreground">\n        Existing command exports remain available. Use CommandDialog for a\n        labeled Base UI popup, stable values for items, and data-slot hooks for\n        styling.\n      </p>\n      <CommandDialog\n        title="Migration example"\n        trigger={<Button variant="outline">Open command dialog</Button>}\n      >\n        <Command label="Migration actions" size="sm">\n          <CommandInput placeholder="Search actions…" />\n          <CommandList>\n            <CommandItem value="review-draft">Review draft</CommandItem>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}';

const apiSections: React.ComponentProps<typeof APIReference>["sections"] = [
  {
    title: "Command",
    props: [
      {
        prop: "variant / size",
        type: '"default" | "minimal" | "bordered" / "sm" | "default" | "lg"',
        default: '"default" / "default"',
        description: "Surface and maximum height: 256, 384, or 512px.",
      },
      {
        prop: "label",
        type: "string",
        default: '"Command menu"',
        description: "Accessible name supplied to cmdk.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "string / string / (value: string) => void",
        description:
          "Native cmdk highlighted-item state, distinct from the search query.",
      },
      {
        prop: "shouldFilter / filter",
        type: "boolean / (value: string, search: string, keywords?: string[]) => number",
        default: "true / cmdk default",
        description:
          "Native filtering. Supply your own visible results when shouldFilter is false.",
      },
      {
        prop: "loop / vimBindings / disablePointerSelection",
        type: "boolean",
        default: "false / true / false",
        description:
          "Native cmdk keyboard and pointer behavior; loop is a cmdk prop, not Base UI loopFocus.",
      },
      {
        prop: "className / ref / native props",
        type: "React.ComponentProps<typeof Command>",
        description: "Native div props and forwarded HTMLDivElement ref.",
      },
    ],
  },
  {
    title: "CommandInput",
    props: [
      {
        prop: "value / onValueChange",
        type: "string / (search: string) => void",
        description: "Native cmdk search state.",
      },
      {
        prop: "placeholder / disabled / readOnly",
        type: "string / boolean / boolean",
        description:
          "Input hints and native editing state; 16px text on narrow screens.",
      },
      {
        prop: "native input props / ref",
        type: "CommandInputProps / React.Ref<HTMLInputElement>",
        description:
          "ARIA, autocomplete, keyboard hints, className and input ref.",
      },
    ],
  },
  {
    title: "CommandList",
    props: [
      {
        prop: "label",
        type: "string",
        default: '"Commands"',
        description: "Accessible listbox label.",
      },
      {
        prop: "className / children / ref",
        type: "CommandListProps",
        description:
          "Scrollable flex region. Override max-h-72 when a larger list is needed.",
      },
    ],
  },
  {
    title: "CommandEmpty",
    props: [
      {
        prop: "children / className / ref",
        type: "CommandEmptyProps",
        description:
          "Native automatic empty-state rendering with merged styles.",
      },
    ],
  },
  {
    title: "CommandGroup",
    props: [
      {
        prop: "heading / value / forceMount",
        type: "React.ReactNode / string / boolean",
        description:
          "Native cmdk groups. Provide a unique value when there is no heading.",
      },
      {
        prop: "className / children / ref",
        type: "CommandGroupProps",
        description:
          "Native group props; hidden filtered groups remain hidden.",
      },
    ],
  },
  {
    title: "CommandItem",
    props: [
      {
        prop: "value / keywords",
        type: "string / string[]",
        description: "Stable identity and native search aliases.",
      },
      {
        prop: "onSelect",
        type: "(value: string) => void",
        description: "Native pointer/Enter selection callback.",
      },
      {
        prop: "disabled / forceMount",
        type: "boolean",
        description: "Native disabled and forced-visibility behavior.",
      },
      {
        prop: "variant",
        type: '"default" | "minimal"',
        default: '"default"',
        description: "Selected and hover surface styling.",
      },
      {
        prop: "native props / ref",
        type: "CommandItemProps",
        description:
          "ARIA associations, children, className and forwarded div ref.",
      },
    ],
  },
  {
    title: "CommandShortcut",
    props: [
      {
        prop: "variant",
        type: '"default" | "subtle"',
        default: '"default"',
        description: "Hint text tone.",
      },
      {
        prop: "children / native span props",
        type: "CommandShortcutProps",
        description: "Display hint only; does not register a keyboard binding.",
      },
    ],
  },
  {
    title: "CommandSeparator",
    props: [
      {
        prop: "alwaysRender / native props / ref",
        type: "CommandSeparatorProps",
        description: "Native separator visibility and div ref.",
      },
    ],
  },
  {
    title: "CommandLoading",
    props: [
      {
        prop: "label / children",
        type: "string / React.ReactNode",
        default: '"Loading commands" / "Loading commands…"',
        description: "Native cmdk loading progressbar with accessible label.",
      },
      {
        prop: "progress / native props / ref",
        type: "number / CommandLoadingProps / React.Ref<HTMLDivElement>",
        description: "Optional native progress value, styling and ref.",
      },
    ],
  },
  {
    title: "CommandDialog",
    props: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / DialogPrimitive.Root.Props['onOpenChange']",
        description:
          "Native controlled/uncontrolled dialog state and cancelable event details.",
      },
      {
        prop: "title / description",
        type: "React.ReactNode",
        description: "Accessible labels inside the popup.",
      },
      {
        prop: "trigger / triggerRef",
        type: "React.ReactElement / React.Ref<HTMLElement>",
        description: "Optional native Base UI trigger composition and access.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description:
          "Visible close affordance; keep one for modal touch accessibility.",
      },
      {
        prop: "contentProps / portalProps / className",
        type: "DialogPrimitive.Popup.Props / DialogPrimitive.Portal.Props / string",
        description:
          "Native focus, popup rendering, portal and styling options; children supplied separately.",
      },
      {
        prop: "native root props",
        type: "Omit<DialogPrimitive.Root.Props, 'children'>",
        description:
          "modal, disablePointerDismissal, actionsRef, handle, trigger IDs and lifecycle callbacks.",
      },
    ],
  },
  {
    title: "KiraCommand",
    props: [
      {
        prop: "actions",
        type: "readonly KiraCommandAction[]",
        description:
          "Stable id, label, description, icon, group, keywords, hint, availability and an action or nested page.",
      },
      {
        prop: "action kind / onSelect",
        type: '"action" | undefined / (context: KiraCommandActionContext) => void | Promise<void>',
        description:
          "Leaf execution receives AbortSignal and the current search. successMessage overrides confirmation text.",
      },
      {
        prop: "page kind / actions",
        type: '"page" / readonly KiraCommandAction[]',
        description: "Open a scoped action page with a visible Back control.",
      },
      {
        prop: "search / defaultSearch / onSearchChange",
        type: "string / string / (search: string) => void",
        description:
          "Controlled or local query, separate from cmdk highlighted-item value.",
      },
      {
        prop: "loading / loadingLabel / loadError / onRetryLoad",
        type: "boolean / string / string / () => void",
        description:
          "Caller-owned result loading and recovery. Input stays editable while results load.",
      },
      {
        prop: "emptyMessage / placeholder",
        type: "React.ReactNode / string",
        description: "Search recovery guidance and input hint.",
      },
      {
        prop: "onActionComplete",
        type: "(action: KiraCommandAction) => void",
        description:
          "Runs after successful leaf execution; failures and cancelled stale results do not complete.",
      },
      {
        prop: "inputProps / listProps",
        type: "KiraCommandProps['inputProps'] / KiraCommandProps['listProps']",
        description:
          "Native input/list customization, excluding query and execution-owned props.",
      },
      {
        prop: "native command props",
        type: "Omit<CommandProps, 'children'>",
        description:
          "Variant, size, label, native filtering, highlighted state and keyboard options.",
      },
    ],
  },
  {
    title: "KiraCommandDialog",
    props: [
      {
        prop: "actions / commandProps",
        type: "readonly KiraCommandAction[] / Omit<KiraCommandProps, 'actions' | 'onActionComplete'>",
        description: "Data-driven palette and inline command options.",
      },
      {
        prop: "shortcut",
        type: "boolean",
        default: "false",
        description:
          "Opt-in Cmd/Ctrl+K; one active palette, no repeat/IME/editor hijacking while closed.",
      },
      {
        prop: "closeOnSelect",
        type: "boolean",
        default: "false",
        description:
          "Close through native dialog actions only after successful execution.",
      },
      {
        prop: "onActionComplete",
        type: "(action: KiraCommandAction) => void",
        description: "Successful action callback before optional close.",
      },
      {
        prop: "native dialog props",
        type: "Omit<CommandDialogProps, 'children' | 'triggerRef' | 'actionsRef'>",
        description:
          "Open state, canceled changes, labeling, trigger, focus and portal options. Closing requests cancellation; the command session stays visible through the exit animation.",
      },
    ],
  },
  {
    title: "Variant exports",
    props: [
      {
        prop: "commandVariants",
        type: "cva",
        description: "Surface variant and size.",
      },
      {
        prop: "commandItemVariants",
        type: "cva",
        description: "Default/minimal selected-row styling.",
      },
      {
        prop: "commandShortcutVariants",
        type: "cva",
        description: "Default/subtle hint styling.",
      },
    ],
  },
];

export default function CommandPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Command"
        description="Searchable actions for the current task, with clear execution and recovery."
        version="2.0.0"
      />
      <FeatureGrid features={commandPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={commandPageDemoTabsTabs} />
      <KeyboardShortcuts shortcuts={commandPageKeyboardShortcutsShortcuts} />
      <UsageBlock
        code={
          basicCode +
          "\n\n" +
          groupsCode +
          "\n\n" +
          kiraCode +
          "\n\n" +
          pagesCode +
          "\n\n" +
          asyncCode +
          "\n\n" +
          dialogCode +
          "\n\n" +
          migrationCode +
          "\n\n" +
          'import { Command, CommandInput, CommandList, CommandLoading } from "@/components/ui/command";\n\nexport function LoadingCommands() {\n  return <Command label="Loading actions"><CommandInput placeholder="Search actions…" /><CommandList aria-busy><CommandLoading>Loading actions…</CommandLoading></CommandList></Command>;\n}'
        }
      />
      <APIReference sections={apiSections} />
      <Changelog entries={commandPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const commandPageFeatureGridFeatures = [
  {
    icon: <IconSearch aria-hidden="true" className="size-4" />,
    title: "Native search",
    description:
      "cmdk filtering, keyword aliases, groups and caller-owned results.",
  },
  {
    icon: <IconCommand aria-hidden="true" className="size-4" />,
    title: "Contextual commands",
    description: "Relevant actions and nested pages with visible Back.",
  },
  {
    icon: <IconCheck aria-hidden="true" className="size-4" />,
    title: "Recoverable actions",
    description: "Pending, confirmation, cancellation and explicit retry.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const commandPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Draft actions"
        description="Run an action to update a local preview."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Surfaces and sizes"
        description="Three surfaces with bounded, independently scrolling lists."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "interaction",
    label: "Interaction",
    demo: (
      <DemoWrapper
        title="Hover, keyboard selection and spacing"
        description="Compact titles, explained actions and a rounded search focus border."
        code={interactionCode}
      >
        <InteractionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "groups",
    label: "Groups",
    demo: (
      <DemoWrapper
        title="Groups and search aliases"
        description="Native cmdk ranking, aliases and separators."
        code={groupsCode}
      >
        <GroupsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="Review actions"
        description="Data-driven actions and visible availability reasons."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "context",
    label: "Context",
    demo: (
      <DemoWrapper
        title="Actions for the current task"
        description="The caller supplies project or queue actions."
        code={contextCode}
      >
        <ContextDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "pages",
    label: "Pages",
    demo: (
      <DemoWrapper
        title="Scoped workspace commands"
        description="Open nested pages, then use Back, Escape, or empty Backspace."
        code={pagesCode}
      >
        <PagesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "async",
    label: "Async",
    demo: (
      <DemoWrapper
        title="Prepare a preview"
        description="Try failure, retry, duplicate input and cancellation."
        code={asyncCode}
      >
        <AsyncDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "search",
    label: "Search",
    demo: (
      <DemoWrapper
        title="Caller-owned results"
        description="Controlled query with externally filtered local results."
        code={searchCode}
      >
        <SearchDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="State matrix"
        description="Loading, empty results, load errors and unavailable actions."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dialog",
    label: "Dialog",
    demo: (isActive) => (
      <DemoWrapper
        title="Keyboard command palette"
        description="Cmd/Ctrl+K, visible close, focus trapping and focus return."
        code={dialogCode}
      >
        <DialogDemo shortcutEnabled={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress",
    demo: (
      <DemoWrapper
        title="Narrow-container fixtures"
        description="Long action names, key hints and multilingual descriptions."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "changelog",
    label: "Changelog",
    demo: (
      <DemoWrapper
        title="Migration to 2.0"
        description="Use the labeled Base UI CommandDialog."
        code={migrationCode}
      >
        <MigrationDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const commandPageKeyboardShortcutsShortcuts = [
  {
    keys: "↑ / ↓",
    description:
      "Highlight the next or previous enabled command; inherited from cmdk. loop enables wrapping.",
  },
  {
    keys: "Home / End",
    description:
      "Highlight the first or last enabled command; inherited from cmdk.",
  },
  {
    keys: "Enter",
    description:
      "Run the highlighted enabled command; inherited from cmdk. Kira prevents duplicate in-flight execution.",
  },
  {
    keys: "Escape",
    description:
      "Kira requests cancellation, clears search, or returns to the parent page in that order. At the root with empty search, Base UI closes the dialog.",
  },
  {
    keys: "Backspace",
    description:
      "Kira returns to the parent page when the search is empty. Back is also a visible button.",
  },
  {
    keys: "Cmd/Ctrl+K",
    description:
      "Opt-in KiraCommandDialog toggle; this demo enables it only in the active Dialog tab.",
  },
  {
    keys: "Tab / Shift+Tab",
    description:
      "Reach Back, Cancel, Retry and Close. Dialog trapping and focus return are inherited from Base UI.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const commandPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "2026-11-10",
    changes: [
      {
        type: "added",
        title:
          "CommandDialog, CommandLoading, KiraCommand and KiraCommandDialog",
        description:
          "Native Base UI popup, scoped command pages, caller-owned results, visible availability reasons, and guarded async actions with cancellation/retry. Audited against Base UI 1.9.0; feature research cutoff October 31, 2026.",
      },
      {
        type: "fixed",
        title: "Selection, slots, props, labels and scroll behavior",
        description:
          "Native cmdk prop types, distinct pointer hover and keyboard selection, complete slots, merged empty styles, rounded search focus borders, valid description IDs and reachable dialog close controls.",
      },
      {
        type: "breaking",
        title: "Command layout and control sizes changed",
        description:
          "Title-only rows use 36px minimum desktop heights and 44px touch heights; explained rows receive extra padding. Root sizes bound scrolling, and the large maximum is 512px. Update fixed-height layouts and visual snapshots.",
      },
      {
        type: "changed",
        title: "Responsive motion and separate hover feedback",
        description:
          "The dialog fades and scales in over 200ms and exits over 150ms. Scoped pages and status changes have brief transitions; loading shows a spinner. Closing cancels active work while preserving the exit surface. Reduced motion removes motion. Pointer hover clears on leave; keyboard selection remains immediate.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
