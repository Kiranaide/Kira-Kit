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

const basicCode = `import * as React from "react";
import { IconCheck, IconFileText } from "@tabler/icons-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

export function BasicDemo() {
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
}`;

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

const variantsCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

export function VariantsDemo() {
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
              {["Weekly support review", "Release notes", "Accessibility findings"].map((label) => (
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
}`;

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
            icon: <IconFileText aria-hidden="true" />,
            onSelect: () => setLastAction("Draft created locally."),
          },
          {
            id: "review",
            label: "Review a handoff",
            description: "Compare a title-only row with an explained action.",
            icon: <IconCheck aria-hidden="true" />,
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

const interactionCode = `import * as React from "react";
import { IconCheck, IconCommand, IconFileText } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { KiraCommand, KiraCommandDialog } from "@/components/ui/command";

export function InteractionDemo() {
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
            icon: <IconFileText aria-hidden="true" />,
            onSelect: () => setLastAction("Draft created locally."),
          },
          {
            id: "review",
            label: "Review a handoff",
            description: "Compare a title-only row with an explained action.",
            icon: <IconCheck aria-hidden="true" />,
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
    </div>
  );
}`;

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

const groupsCode = `import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

export function GroupsDemo() {
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
}`;

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
            icon: <IconFileText aria-hidden="true" />,
            group: "Drafts",
            keywords: ["new", "document"],
            onSelect: () => setDrafts((count) => count + 1),
            successMessage: "Review draft added locally.",
          },
          {
            id: "reviewed",
            label: reviewed ? "Mark as needing review" : "Mark as reviewed",
            icon: <IconCheck aria-hidden="true" />,
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

const kiraCode = `import * as React from "react";
import { IconCheck, IconFileText } from "@tabler/icons-react";
import { KiraCommand } from "@/components/ui/command";

export function KiraDemo() {
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
            icon: <IconFileText aria-hidden="true" />,
            group: "Drafts",
            keywords: ["new", "document"],
            onSelect: () => setDrafts((count) => count + 1),
            successMessage: "Review draft added locally.",
          },
          {
            id: "reviewed",
            label: reviewed ? "Mark as needing review" : "Mark as reviewed",
            icon: <IconCheck aria-hidden="true" />,
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
        Local drafts: {drafts}. Status: {reviewed ? "reviewed" : "needs review"}.
      </p>
    </div>
  );
}`;

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

const contextCode = `import * as React from "react";
import { KiraCommand } from "@/components/ui/command";
import { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";

export function ContextDemo() {
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
                  label: paused ? "Resume preview queue" : "Pause preview queue",
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
}`;

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

const pagesCode = `import * as React from "react";
import { KiraCommand } from "@/components/ui/command";

export function PagesDemo() {
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
}`;

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

const asyncCode = `import * as React from "react";
import { KiraCommand } from "@/components/ui/command";

export function AsyncDemo() {
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
              if (fail) {
                throw new Error(
                  "The preview fixture could not finish. Retry to prepare it again.",
                );
              }
              setReports((count) => count + 1);
            },
          },
        ]}
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        Attempts: {attempts}. Previews prepared: {reports}.
      </p>
    </div>
  );
}`;

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

const searchCode = `import * as React from "react";
import { KiraCommand } from "@/components/ui/command";

export function SearchDemo() {
  const [query, setQuery] = React.useState("");
  const [selection, setSelection] = React.useState("");
  const documents = ["Release checklist", "Accessibility review", "Support handoff"];

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
          ? \`Selected preview: \${selection}.\`
          : "Filtering happens in this demo's caller."}
      </p>
    </div>
  );
}`;

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

const statesCode = `import * as React from "react";
import { KiraCommand } from "@/components/ui/command";
import { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";

export function StatesDemo() {
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
}`;

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

const dialogCode = `import * as React from "react";
import { KiraCommandDialog } from "@/components/ui/command";

export function DialogDemo() {
  const [drafts, setDrafts] = React.useState(0);

  return (
    <div className="space-y-4">
      <KiraCommandDialog
        title="Draft commands"
        shortcut
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
        Local drafts: {drafts}.
      </p>
    </div>
  );
}`;

function StressDemo() {
  const [mode, setMode] = React.useState("worst");
  const worst = mode === "worst";
  const empty = mode === "empty";

  return (
    <div className="max-w-xs space-y-5">
      <RadioButtonGroup
        value={mode}
        onValueChange={setMode}
        aria-label="Command stress fixture"
        size="sm"
      >
        <RadioButton value="worst">Worst case</RadioButton>
        <RadioButton value="empty">Empty</RadioButton>
        <RadioButton value="demo">Baseline</RadioButton>
      </RadioButtonGroup>
      <KiraCommand
        key={mode}
        label="Narrow-container stress examples"
        emptyMessage="No commands are available in this narrow container."
        actions={
          empty
            ? []
            : [
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
                  id: "disabled-long",
                  label: worst
                    ? "Archive quarterly compliance and audit records permanently"
                    : "Archive records",
                  disabled: true,
                  disabledReason: worst
                    ? "Archiving requires workspace owner approval before execution."
                    : "Unavailable in this preview.",
                  onSelect: () => {},
                },
                {
                  id: "short",
                  label: worst ? "Å" : "Personal notes",
                  onSelect: () => {},
                },
              ]
        }
      />
    </div>
  );
}

const stressCode = `import * as React from "react";
import { KiraCommand } from "@/components/ui/command";
import { RadioButtonGroup, RadioButton } from "@/components/ui/radio-group";

export function StressDemo() {
  const [mode, setMode] = React.useState("worst");
  const worst = mode === "worst";
  const empty = mode === "empty";

  return (
    <div className="max-w-xs space-y-5">
      <RadioButtonGroup
        value={mode}
        onValueChange={setMode}
        aria-label="Command stress fixture"
        size="sm"
      >
        <RadioButton value="worst">Worst case</RadioButton>
        <RadioButton value="empty">Empty</RadioButton>
        <RadioButton value="demo">Baseline</RadioButton>
      </RadioButtonGroup>
      <KiraCommand
        key={mode}
        label="Narrow-container stress examples"
        emptyMessage="No commands are available in this narrow container."
        actions={
          empty
            ? []
            : [
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
                  id: "disabled-long",
                  label: "Archive quarterly compliance and audit records permanently",
                  disabled: true,
                  disabledReason:
                    "Archiving requires workspace owner approval before execution.",
                  onSelect: () => {},
                },
              ]
        }
      />
    </div>
  );
}`;

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

const migrationCode = `import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

export function MigrationDemo() {
  return (
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
  );
}`;

const usageCode = `import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandLoading,
  KiraCommand,
  KiraCommandDialog,
} from "@/components/ui/command";

export function CommandPrimitivesUsage() {
  return (
    <Command label="Workspace actions">
      <CommandInput placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No matching commands.</CommandEmpty>
        <CommandGroup heading="Drafts">
          <CommandItem value="new-draft" keywords={["create", "document"]}>
            New draft
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandLoading>Loading remote actions…</CommandLoading>
      </CommandList>
    </Command>
  );
}

export function KiraCommandUsage() {
  return (
    <KiraCommandDialog
      title="Workspace palette"
      shortcut
      closeOnSelect
      actions={[
        {
          id: "new-draft",
          label: "Create draft",
          onSelect: () => {},
        },
      ]}
    />
  );
}`;

export default function CommandPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Command"
        description="Searchable actions for the current task, with clear execution and recovery."
        version="v2.0.2"
      />

      <FeatureGrid
        features={commandPageFeatures}
        description="Search, scoped navigation, and recoverable async execution built on cmdk and Base UI."
      />

      <DemoTabs defaultValue="basic" tabs={commandPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={commandPageShortcuts}
        description="Keyboard navigation and dialog controls across cmdk, Base UI, and Kira additions."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose primitives directly or use KiraCommand and KiraCommandDialog for data-driven palettes."
        notes={commandUsageNotes}
      />

      <APIReference
        sections={commandPageAPISections}
        description="Props, types, and defaults for every exported Command primitive, wrapper, and variant helper."
      />

      <Changelog
        entries={commandPageChangelogEntries}
        title="Changelog"
        description="Version history for Command."
      />
    </ComponentPage>
  );
}

const commandUsageNotes = [
  {
    label: "KiraCommand & KiraCommandDialog",
    body: "Prefer the data-driven wrappers when you need nested action pages, visible disabled reasons, caller-owned search results, or guarded async execution with cancellation and retry.",
  },
  {
    label: "CommandDialog",
    body: "Wrap custom cmdk trees in CommandDialog for a labeled Base UI modal popup with focus trapping, Escape handling, and a reachable close button.",
  },
  {
    label: "Global shortcut",
    body: "Enable shortcut on at most one active KiraCommandDialog per page so Cmd/Ctrl+K never conflicts across mounted palettes.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const commandPageFeatures = [
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

const commandPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "KiraCommand",
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
    group: "KiraCommand",
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
    group: "KiraCommand",
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
    group: "KiraCommand",
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
    group: "KiraCommand",
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
    value: "dialog",
    label: "Dialog",
    group: "KiraCommand",
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
    value: "states",
    label: "States",
    group: "Behavior",
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
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long action labels, multilingual copy, disabled reasons, and empty state in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "migration",
    label: "Migration",
    group: "Behavior",
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

const commandPageShortcuts = [
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

const commandPageAPISections = [
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
        default: "-",
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
        default: "-",
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
        default: "-",
        description: "Native cmdk search state.",
      },
      {
        prop: "placeholder / disabled / readOnly",
        type: "string / boolean / boolean",
        default: "-",
        description:
          "Input hints and native editing state; 16px text on narrow screens.",
      },
      {
        prop: "native input props / ref",
        type: "CommandInputProps / React.Ref<HTMLInputElement>",
        default: "-",
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
        default: "-",
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
        default: "-",
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
        default: "-",
        description:
          "Native cmdk groups. Provide a unique value when there is no heading.",
      },
      {
        prop: "className / children / ref",
        type: "CommandGroupProps",
        default: "-",
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
        default: "-",
        description: "Stable identity and native search aliases.",
      },
      {
        prop: "onSelect",
        type: "(value: string) => void",
        default: "-",
        description: "Native pointer/Enter selection callback.",
      },
      {
        prop: "disabled / forceMount",
        type: "boolean",
        default: "false",
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
        default: "-",
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
        default: "-",
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
        default: "-",
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
        default: "-",
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
        default: "-",
        description:
          "Native controlled/uncontrolled dialog state and cancelable event details.",
      },
      {
        prop: "title / description",
        type: "React.ReactNode",
        default: "-",
        description: "Accessible labels inside the popup.",
      },
      {
        prop: "trigger / triggerRef",
        type: "React.ReactElement / React.Ref<HTMLButtonElement>",
        default: "-",
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
        default: "-",
        description:
          "Native focus, popup rendering, portal and styling options; children supplied separately.",
      },
      {
        prop: "native root props",
        type: "Omit<DialogPrimitive.Root.Props, 'children'>",
        default: "-",
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
        default: "-",
        description:
          "Stable id, label, description, icon, group, keywords, hint, availability and an action or nested page.",
      },
      {
        prop: "action kind / onSelect",
        type: '"action" | undefined / (context: KiraCommandActionContext) => void | Promise<void>',
        default: "-",
        description:
          "Leaf execution receives AbortSignal and the current search. successMessage overrides confirmation text.",
      },
      {
        prop: "page kind / actions",
        type: '"page" / readonly KiraCommandAction[]',
        default: "-",
        description: "Open a scoped action page with a visible Back control.",
      },
      {
        prop: "search / defaultSearch / onSearchChange",
        type: "string / string / (search: string) => void",
        default: "-",
        description:
          "Controlled or local query, separate from cmdk highlighted-item value.",
      },
      {
        prop: "loading / loadingLabel / loadError / onRetryLoad",
        type: "boolean / string / string / () => void",
        default: "-",
        description:
          "Caller-owned result loading and recovery. Input stays editable while results load.",
      },
      {
        prop: "emptyMessage / placeholder",
        type: "React.ReactNode / string",
        default: "-",
        description: "Search recovery guidance and input hint.",
      },
      {
        prop: "onActionComplete",
        type: "(action: KiraCommandAction) => void",
        default: "-",
        description:
          "Runs after successful leaf execution; failures and cancelled stale results do not complete.",
      },
      {
        prop: "inputProps / listProps",
        type: "KiraCommandProps['inputProps'] / KiraCommandProps['listProps']",
        default: "-",
        description:
          "Native input/list customization, excluding query and execution-owned props.",
      },
      {
        prop: "native command props",
        type: "Omit<CommandProps, 'children'>",
        default: "-",
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
        default: "-",
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
        default: "-",
        description: "Successful action callback before optional close.",
      },
      {
        prop: "native dialog props",
        type: "Omit<CommandDialogProps, 'children' | 'triggerRef' | 'actionsRef'>",
        default: "-",
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
        default: "-",
        description: "Surface variant and size.",
      },
      {
        prop: "commandItemVariants",
        type: "cva",
        default: "-",
        description: "Default/minimal selected-row styling.",
      },
      {
        prop: "commandShortcutVariants",
        type: "cva",
        default: "-",
        description: "Default/subtle hint styling.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const commandPageChangelogEntries = [
  {
    version: "2.0.2",
    date: "27 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Breadcrumb close-button clearance in CommandDialog",
        description:
          "Reserved trailing space on command-breadcrumb when nested pages are active in CommandDialog and only padded command-input-wrapper when no breadcrumb sits above it.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Aligned CommandDialog onto kit Dialog exports",
        description:
          "Switched CommandDialog and KiraCommandDialog to compose DialogPopup and types from @/components/ui/dialog instead of importing @base-ui/react/dialog directly.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "10 November 2026",
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
