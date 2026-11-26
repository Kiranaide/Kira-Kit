import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
  PopoverArrow,
  PopoverPortal,
  PopoverBackdrop,
  PopoverViewport,
  PopoverPayloadTrigger,
  createPopoverHandle,
  KiraPopover,
  KiraPopoverFlow,
  type PopoverProps,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconInfoCircle,
  IconSettings,
  IconAlertCircle,
} from "@tabler/icons-react";
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

const editorProjects = [
  { id: "atlas", name: "Atlas design system" },
  { id: "harbor", name: "Harbor accessibility review" },
];

function useAssigneeRequest() {
  const version = React.useRef(0);
  const inFlight = React.useRef(false);
  const failNext = React.useRef(true);

  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const cancel = () => {
    version.current++;
    clearTimeout(timer.current);
    inFlight.current = false;
  };

  React.useEffect(
    () => () => {
      version.current++;
      clearTimeout(timer.current);
    },
    [],
  );

  const start = (finish: (failed: boolean) => void) => {
    if (inFlight.current) return false;
    inFlight.current = true;
    const request = ++version.current;
    timer.current = setTimeout(() => {
      if (request !== version.current) return;
      inFlight.current = false;
      const failed = failNext.current;
      failNext.current = false;
      finish(failed);
    }, 900);

    return true;
  };

  return { start, cancel };
}

function useAssigneeEditor(inputRef: React.RefObject<HTMLInputElement | null>) {
  const [handle] = React.useState(() => createPopoverHandle<string>());
  const [open, setOpen] = React.useState(false);

  const [assignees, setAssignees] = React.useState<Record<string, string>>({
    atlas: "Maya Chen",
    harbor: "Sam Rivera",
  });

  const [recordId, setRecordId] = React.useState("atlas");
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const fieldId = React.useId();
  const request = useAssigneeRequest();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = draft.trim();

    if (!next) {
      setError("Enter an assignee name before saving.");
      inputRef.current?.focus();

      return;
    }

    const accepted = request.start((failed) => {
      setPending(false);

      if (failed) {
        setError(
          "The illustrative request failed. Your draft is kept; retry saving.",
        );
        inputRef.current?.focus();

        return;
      }

      setAssignees((previous) => ({ ...previous, [recordId]: next }));
      setAnnouncement("Assignee saved for " + recordId + ".");
      setOpen(false);
    });

    if (accepted) {
      setPending(true);
      setError("");
    }
  };

  const onOpenChange: NonNullable<PopoverProps<string>["onOpenChange"]> = (
    next,
    details,
  ) => {
    if (details.isCanceled) return;
    request.cancel();
    setPending(false);
    const target = details.trigger?.getAttribute("data-record-id");

    if (next && target) {
      setRecordId(target);
      setDraft(assignees[target]);
      setError("");
    }

    setOpen(next);
  };

  const discard = () => {
    setDraft(assignees[recordId]);
    setError("");
  };

  return {
    handle,
    open,
    assignees,
    draft,
    pending,
    error,
    announcement,
    fieldId,
    onSubmit,
    onOpenChange,
    discard,
    setDraft,
    dirty: draft !== assignees[recordId],
  };
}

type AssigneeEditorState = ReturnType<typeof useAssigneeEditor>;

function SharedAssigneeForm({
  editor,
  ref,
}: {
  editor: AssigneeEditorState;
  ref: React.Ref<HTMLInputElement>;
}) {
  let action = "Save assignee";

  if (editor.error) action = "Retry saving";

  if (editor.pending) action = "Saving...";

  return (
    <form
      onSubmit={editor.onSubmit}
      aria-busy={editor.pending}
      className="space-y-3"
    >
      <Label htmlFor={editor.fieldId}>Assignee name (required)</Label>
      <Input
        ref={ref}
        id={editor.fieldId}
        value={editor.draft}
        disabled={editor.pending}
        aria-invalid={!!editor.error}
        aria-describedby={editor.error ? editor.fieldId + "-error" : undefined}
        onChange={(event) => editor.setDraft(event.target.value)}
      />
      <output
        id={editor.fieldId + "-error"}
        className="block text-sm text-destructive"
      >
        {editor.error || (editor.pending ? "Saving assignee..." : "")}
      </output>
      <Button type="submit" disabled={editor.pending}>
        {action}
      </Button>
    </form>
  );
}

function ProjectAssigneeRows({ editor }: { editor: AssigneeEditorState }) {
  return (
    <>
      {editorProjects.map((project) => (
        <div
          key={project.id}
          className="flex flex-wrap items-center justify-between gap-2 border-b py-2"
        >
          <div className="min-w-0">
            <p className="break-words font-medium">{project.name}</p>
            <p className="text-sm text-muted-foreground">
              {editor.assignees[project.id]}
            </p>
          </div>
          <PopoverPayloadTrigger
            handle={editor.handle}
            payload={project.id}
            data-record-id={project.id}
            render={
              <Button variant="outline" size="sm">
                Edit {project.id}
              </Button>
            }
          />
        </div>
      ))}
    </>
  );
}

function SharedEditorDemo() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const editor = useAssigneeEditor(inputRef);

  return (
    <div className="w-full min-w-0 space-y-3">
      <p className="text-sm text-muted-foreground">
        Illustrative request: the first save fails; retry succeeds.
      </p>
      <ProjectAssigneeRows editor={editor} />
      <KiraPopover
        handle={editor.handle}
        open={editor.open}
        title={(payload) => "Assign " + (payload ?? "project")}
        description="Changes stay here until you submit or discard them."
        dirty={editor.dirty}
        preventClose={editor.pending}
        onDiscard={editor.discard}
        onOpenChange={editor.onOpenChange}
        contentProps={{
          portalProps: { keepMounted: true },
          initialFocus: inputRef,
        }}
      >
        <SharedAssigneeForm editor={editor} ref={inputRef} />
      </KiraPopover>
      <output className="block text-sm">{editor.announcement}</output>
    </div>
  );
}

const sharedEditorCode =
  'import * as React from "react";\nimport { PopoverPayloadTrigger, createPopoverHandle, KiraPopover, type PopoverProps } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Label } from "@/components/ui/label";\n\nconst editorProjects = [\n  { id: "atlas", name: "Atlas design system" },\n  { id: "harbor", name: "Harbor accessibility review" },\n];\n\nfunction useAssigneeRequest() {\n  const version = React.useRef(0);\n  const inFlight = React.useRef(false);\n  const failNext = React.useRef(true);\n\n  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(\n    undefined,\n  );\n\n  const cancel = () => {\n    version.current++;\n    clearTimeout(timer.current);\n    inFlight.current = false;\n  };\n\n  React.useEffect(\n    () => () => {\n      version.current++;\n      clearTimeout(timer.current);\n    },\n    [],\n  );\n\n  const start = (finish: (failed: boolean) => void) => {\n    if (inFlight.current) return false;\n    inFlight.current = true;\n    const request = ++version.current;\n    timer.current = setTimeout(() => {\n      if (request !== version.current) return;\n      inFlight.current = false;\n      const failed = failNext.current;\n      failNext.current = false;\n      finish(failed);\n    }, 900);\n\n    return true;\n  };\n\n  return { start, cancel };\n}\n\nfunction useAssigneeEditor(inputRef: React.RefObject<HTMLInputElement | null>) {\n  const [handle] = React.useState(() => createPopoverHandle<string>());\n  const [open, setOpen] = React.useState(false);\n\n  const [assignees, setAssignees] = React.useState<Record<string, string>>({\n    atlas: "Maya Chen",\n    harbor: "Sam Rivera",\n  });\n\n  const [recordId, setRecordId] = React.useState("atlas");\n  const [draft, setDraft] = React.useState("");\n  const [pending, setPending] = React.useState(false);\n  const [error, setError] = React.useState("");\n  const [announcement, setAnnouncement] = React.useState("");\n  const fieldId = React.useId();\n  const request = useAssigneeRequest();\n\n  const onSubmit = (event: React.FormEvent) => {\n    event.preventDefault();\n    const next = draft.trim();\n\n    if (!next) {\n      setError("Enter an assignee name before saving.");\n      inputRef.current?.focus();\n\n      return;\n    }\n\n    const accepted = request.start((failed) => {\n      setPending(false);\n\n      if (failed) {\n        setError(\n          "The illustrative request failed. Your draft is kept; retry saving.",\n        );\n        inputRef.current?.focus();\n\n        return;\n      }\n\n      setAssignees((previous) => ({ ...previous, [recordId]: next }));\n      setAnnouncement("Assignee saved for " + recordId + ".");\n      setOpen(false);\n    });\n\n    if (accepted) {\n      setPending(true);\n      setError("");\n    }\n  };\n\n  const onOpenChange: NonNullable<PopoverProps<string>["onOpenChange"]> = (\n    next,\n    details,\n  ) => {\n    if (details.isCanceled) return;\n    request.cancel();\n    setPending(false);\n    const target = details.trigger?.getAttribute("data-record-id");\n\n    if (next && target) {\n      setRecordId(target);\n      setDraft(assignees[target]);\n      setError("");\n    }\n\n    setOpen(next);\n  };\n\n  const discard = () => {\n    setDraft(assignees[recordId]);\n    setError("");\n  };\n\n  return {\n    handle,\n    open,\n    assignees,\n    draft,\n    pending,\n    error,\n    announcement,\n    fieldId,\n    onSubmit,\n    onOpenChange,\n    discard,\n    setDraft,\n    dirty: draft !== assignees[recordId],\n  };\n}\n\ntype AssigneeEditorState = ReturnType<typeof useAssigneeEditor>;\n\nfunction SharedAssigneeForm({\n  editor,\n  ref,\n}: {\n  editor: AssigneeEditorState;\n  ref: React.Ref<HTMLInputElement>;\n}) {\n  let action = "Save assignee";\n\n  if (editor.error) action = "Retry saving";\n\n  if (editor.pending) action = "Saving...";\n\n  return (\n    <form\n      onSubmit={editor.onSubmit}\n      aria-busy={editor.pending}\n      className="space-y-3"\n    >\n      <Label htmlFor={editor.fieldId}>Assignee name (required)</Label>\n      <Input\n        ref={ref}\n        id={editor.fieldId}\n        value={editor.draft}\n        disabled={editor.pending}\n        aria-invalid={!!editor.error}\n        aria-describedby={editor.error ? editor.fieldId + "-error" : undefined}\n        onChange={(event) => editor.setDraft(event.target.value)}\n      />\n      <output\n        id={editor.fieldId + "-error"}\n        className="block text-sm text-destructive"\n      >\n        {editor.error || (editor.pending ? "Saving assignee..." : "")}\n      </output>\n      <Button type="submit" disabled={editor.pending}>\n        {action}\n      </Button>\n    </form>\n  );\n}\n\nfunction ProjectAssigneeRows({ editor }: { editor: AssigneeEditorState }) {\n  return (\n    <>\n      {editorProjects.map((project) => (\n        <div\n          key={project.id}\n          className="flex flex-wrap items-center justify-between gap-2 border-b py-2"\n        >\n          <div className="min-w-0">\n            <p className="break-words font-medium">{project.name}</p>\n            <p className="text-sm text-muted-foreground">\n              {editor.assignees[project.id]}\n            </p>\n          </div>\n          <PopoverPayloadTrigger\n            handle={editor.handle}\n            payload={project.id}\n            data-record-id={project.id}\n            render={\n              <Button variant="outline" size="sm">\n                Edit {project.id}\n              </Button>\n            }\n          />\n        </div>\n      ))}\n    </>\n  );\n}\n\nexport function SharedEditorDemo() {\n  const inputRef = React.useRef<HTMLInputElement>(null);\n  const editor = useAssigneeEditor(inputRef);\n\n  return (\n    <div className="w-full min-w-0 space-y-3">\n      <p className="text-sm text-muted-foreground">\n        Illustrative request: the first save fails; retry succeeds.\n      </p>\n      <ProjectAssigneeRows editor={editor} />\n      <KiraPopover\n        handle={editor.handle}\n        open={editor.open}\n        title={(payload) => "Assign " + (payload ?? "project")}\n        description="Changes stay here until you submit or discard them."\n        dirty={editor.dirty}\n        preventClose={editor.pending}\n        onDiscard={editor.discard}\n        onOpenChange={editor.onOpenChange}\n        contentProps={{\n          portalProps: { keepMounted: true },\n          initialFocus: inputRef,\n        }}\n      >\n        <SharedAssigneeForm editor={editor} ref={inputRef} />\n      </KiraPopover>\n      <output className="block text-sm">{editor.announcement}</output>\n    </div>\n  );\n}';

function FlowDemo() {
  const [email, setEmail] = React.useState(true);
  const [controlView, setControlView] = React.useState(false);
  const [controlledView, setControlledView] = React.useState("overview");

  return (
    <div className="space-y-3">
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={controlView}
          onChange={(event) => setControlView(event.target.checked)}
        />
        Control the view (preserve it on close)
      </label>
      <KiraPopoverFlow
        trigger={<Button variant="outline">Notification preferences</Button>}
        defaultValue="overview"
        value={controlView ? controlledView : undefined}
        onValueChange={setControlledView}
        views={[
          {
            id: "overview",
            title: "Notifications",
            render: ({ navigate }) => (
              <div className="mt-3 space-y-3">
                <p className="text-sm">
                  Email delivery is {email ? "enabled" : "disabled"}.
                </p>
                <Button onClick={() => navigate("delivery")}>
                  Delivery settings
                </Button>
              </div>
            ),
          },
          {
            id: "delivery",
            title: "Delivery settings",
            render: ({ back }) => (
              <div className="mt-3 space-y-3">
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={email}
                    onChange={(event) => setEmail(event.target.checked)}
                  />
                  Email notifications
                </label>
                <Button variant="outline" onClick={back}>
                  Back to overview
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

const flowCode =
  'import * as React from "react";\nimport { KiraPopoverFlow } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function FlowDemo() {\n  const [email, setEmail] = React.useState(true);\n  const [controlView, setControlView] = React.useState(false);\n  const [controlledView, setControlledView] = React.useState("overview");\n\n  return (\n    <div className="space-y-3">\n      <label className="flex gap-2 text-sm">\n        <input\n          type="checkbox"\n          checked={controlView}\n          onChange={(event) => setControlView(event.target.checked)}\n        />\n        Control the view (preserve it on close)\n      </label>\n      <KiraPopoverFlow\n        trigger={<Button variant="outline">Notification preferences</Button>}\n        defaultValue="overview"\n        value={controlView ? controlledView : undefined}\n        onValueChange={setControlledView}\n        views={[\n          {\n            id: "overview",\n            title: "Notifications",\n            render: ({ navigate }) => (\n              <div className="mt-3 space-y-3">\n                <p className="text-sm">\n                  Email delivery is {email ? "enabled" : "disabled"}.\n                </p>\n                <Button onClick={() => navigate("delivery")}>\n                  Delivery settings\n                </Button>\n              </div>\n            ),\n          },\n          {\n            id: "delivery",\n            title: "Delivery settings",\n            render: ({ back }) => (\n              <div className="mt-3 space-y-3">\n                <label className="flex gap-2">\n                  <input\n                    type="checkbox"\n                    checked={email}\n                    onChange={(event) => setEmail(event.target.checked)}\n                  />\n                  Email notifications\n                </label>\n                <Button variant="outline" onClick={back}>\n                  Back to overview\n                </Button>\n              </div>\n            ),\n          },\n        ]}\n      />\n    </div>\n  );\n}';

function KiraDemo() {
  return (
    <>
      <KiraPopover
        trigger={<Button>Project details</Button>}
        title="Atlas launch"
        description="Review the release before you continue."
        arrow
        footer={
          <a href="#popover-result" className="text-primary underline">
            Open release notes
          </a>
        }
      >
        <p className="text-sm">The next review is on Thursday.</p>
      </KiraPopover>
      <p id="popover-result" className="mt-3 text-sm">
        Atlas release notes: accessibility review scheduled.
      </p>
    </>
  );
}

const kiraCode =
  'import { KiraPopover } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function KiraDemo() {\n  return (\n    <>\n      <KiraPopover\n        trigger={<Button>Project details</Button>}\n        title="Atlas launch"\n        description="Review the release before you continue."\n        arrow\n        footer={\n          <a href="#popover-result" className="text-primary underline">\n            Open release notes\n          </a>\n        }\n      >\n        <p className="text-sm">The next review is on Thursday.</p>\n      </KiraPopover>\n      <p id="popover-result" className="mt-3 text-sm">\n        Atlas release notes: accessibility review scheduled.\n      </p>\n    </>\n  );\n}';

const reviewChecklistItems = Array.from({ length: 18 }, (_, index) => ({
  id: `review-item-${index + 1}`,
  number: index + 1,
}));

function ModalStressPopover({ portal }: { portal: HTMLDivElement | null }) {
  return (
    <Popover modal>
      <PopoverTrigger
        render={<Button variant="outline">Modal and nested popup</Button>}
      />
      <PopoverPortal container={portal}>
        <PopoverBackdrop />
      </PopoverPortal>
      <PopoverContent
        size="xl"
        portalProps={{ container: portal, keepMounted: true }}
        positionerProps={{ collisionPadding: 16 }}
      >
        <PopoverTitle>
          A release review with an unusually long project name that must wrap
          inside the available space
        </PopoverTitle>
        <PopoverDescription>
          Native modal focus management with a reachable close action.
        </PopoverDescription>
        <Popover>
          <PopoverTrigger
            render={
              <Button className="mt-3" variant="outline">
                Nested details
              </Button>
            }
          />
          <PopoverContent>
            <PopoverTitle>Nested details</PopoverTitle>
            <PopoverClose
              render={<Button className="mt-3">Close details</Button>}
            />
          </PopoverContent>
        </Popover>
        {reviewChecklistItems.map((item) => (
          <p key={item.id} className="my-3 text-sm">
            Review item {item.number}: Check accessible names and keyboard focus
            before releasing.
          </p>
        ))}
        <PopoverClose render={<Button>Close review</Button>} />
      </PopoverContent>
    </Popover>
  );
}

function useControlledPopoverRecord() {
  const [open, setOpen] = React.useState(false);
  const [triggerId, setTriggerId] = React.useState<string | null>(null);
  const [record, setRecord] = React.useState("atlas");

  const onOpenChange: NonNullable<PopoverProps["onOpenChange"]> = (
    next,
    details,
  ) => {
    if (details.isCanceled) return;

    if (next) {
      setTriggerId(details.trigger?.id ?? null);
      setRecord(details.trigger?.getAttribute("data-record-id") ?? "atlas");
    }

    setOpen(next);
  };

  return { open, triggerId, record, onOpenChange };
}

function StressDemo() {
  const [portal, setPortal] = React.useState<HTMLDivElement | null>(null);
  const [handle] = React.useState(() => createPopoverHandle<string>());
  const controlled = useControlledPopoverRecord();

  return (
    <div className="w-full max-w-full space-y-4" dir="rtl">
      <p className="text-sm">
        RTL, a narrow max-w-xs container, a custom portal, retained popup, modal
        nesting, disabled state, empty content, and long titles.
      </p>
      <div className="max-w-xs space-y-3">
        <div ref={setPortal} data-slot="demo-custom-portal" />
        <ModalStressPopover portal={portal} />
        <Button disabled variant="outline">
          No project selected
        </Button>
        <p className="text-sm text-muted-foreground">
          Select a project before editing.
        </p>
        <Popover
          open={controlled.open}
          triggerId={controlled.triggerId}
          onOpenChange={controlled.onOpenChange}
        >
          <PopoverTrigger
            data-record-id="atlas"
            render={<Button variant="outline">Controlled Atlas</Button>}
          />
          <PopoverTrigger
            data-record-id="harbor"
            render={<Button variant="outline">Controlled Harbor</Button>}
          />
          <PopoverContent>
            <PopoverTitle>Controlled {controlled.record}</PopoverTitle>
            <PopoverDescription>
              No notifications yet. Choose delivery settings to get started.
            </PopoverDescription>
            <PopoverClose render={<Button className="mt-3">Close</Button>} />
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2">
          <PopoverPayloadTrigger
            handle={handle}
            payload="Atlas"
            render={<Button variant="outline">Preview Atlas</Button>}
          />
          <PopoverPayloadTrigger
            handle={handle}
            payload="Harbor"
            render={<Button variant="outline">Preview Harbor</Button>}
          />
        </div>
        <Popover handle={handle}>
          {({ payload }) => (
            <PopoverContent>
              <PopoverViewport>
                <PopoverTitle>{payload ?? "No project"}</PopoverTitle>
                <PopoverDescription>
                  Native viewport switches content between payload triggers.
                </PopoverDescription>
              </PopoverViewport>
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  );
}

const stressCode = `import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
  PopoverPortal,
  PopoverBackdrop,
  PopoverViewport,
  PopoverPayloadTrigger,
  createPopoverHandle,
  type PopoverProps,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function StressDemo() {
  const [portal, setPortal] = React.useState<HTMLDivElement | null>(null);
  const [handle] = React.useState(() => createPopoverHandle<string>());
  const [open, setOpen] = React.useState(false);
  const [triggerId, setTriggerId] = React.useState<string | null>(null);
  const [record, setRecord] = React.useState("atlas");

  const onOpenChange: NonNullable<PopoverProps["onOpenChange"]> = (next, details) => {
    if (details.isCanceled) return;
    if (next) {
      setTriggerId(details.trigger?.id ?? null);
      setRecord(details.trigger?.getAttribute("data-record-id") ?? "atlas");
    }
    setOpen(next);
  };

  return (
    <div className="max-w-xs space-y-3" dir="rtl">
      <div ref={setPortal} />
      <Popover modal>
        <PopoverTrigger render={<Button variant="outline">Modal and nested popup</Button>} />
        <PopoverPortal container={portal}><PopoverBackdrop /></PopoverPortal>
        <PopoverContent size="xl" portalProps={{ container: portal, keepMounted: true }}>
          <PopoverTitle>
            A release review with an unusually long project name that must wrap inside the available space
          </PopoverTitle>
          <PopoverDescription>
            Native modal focus management with a reachable close action.
          </PopoverDescription>
          <PopoverClose render={<Button>Close review</Button>} />
        </PopoverContent>
      </Popover>
      <Button disabled variant="outline">No project selected</Button>
      <Popover open={open} triggerId={triggerId} onOpenChange={onOpenChange}>
        <PopoverTrigger data-record-id="atlas" render={<Button variant="outline">Controlled Atlas</Button>} />
        <PopoverTrigger data-record-id="harbor" render={<Button variant="outline">Controlled Harbor</Button>} />
        <PopoverContent>
          <PopoverTitle>Controlled {record}</PopoverTitle>
          <PopoverDescription>No notifications yet. Choose delivery settings to get started.</PopoverDescription>
          <PopoverClose render={<Button className="mt-3">Close</Button>} />
        </PopoverContent>
      </Popover>
      <PopoverPayloadTrigger handle={handle} payload="Atlas" render={<Button variant="outline">Preview Atlas</Button>} />
      <Popover handle={handle}>
        {({ payload }) => (
          <PopoverContent>
            <PopoverViewport>
              <PopoverTitle>{payload ?? "No project"}</PopoverTitle>
              <PopoverDescription>Native viewport switches content between payload triggers.</PopoverDescription>
            </PopoverViewport>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}`;

function BasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Open Popover</Button>}
        />
        <PopoverContent>
          <PopoverTitle>Popover Title</PopoverTitle>
          <PopoverDescription>
            This is a basic popover with accessible title and description.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">With Arrow</Button>}
        />
        <PopoverContent>
          <PopoverArrow />
          <PopoverTitle>With Arrow</PopoverTitle>
          <PopoverDescription>
            The arrow points to the trigger element.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Outline Variant</Button>}
        />
        <PopoverContent variant="outline">
          <PopoverArrow variant="outline" />
          <PopoverTitle>Outline Style</PopoverTitle>
          <PopoverDescription>
            Both content and arrow use outline variant.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const basicCode =
  'import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription, PopoverArrow } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function BasicDemo() {\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Popover>\n        <PopoverTrigger\n          render={<Button variant="outline">Open Popover</Button>}\n        />\n        <PopoverContent>\n          <PopoverTitle>Popover Title</PopoverTitle>\n          <PopoverDescription>\n            This is a basic popover with accessible title and description.\n          </PopoverDescription>\n        </PopoverContent>\n      </Popover>\n\n      <Popover>\n        <PopoverTrigger\n          render={<Button variant="outline">With Arrow</Button>}\n        />\n        <PopoverContent>\n          <PopoverArrow />\n          <PopoverTitle>With Arrow</PopoverTitle>\n          <PopoverDescription>\n            The arrow points to the trigger element.\n          </PopoverDescription>\n        </PopoverContent>\n      </Popover>\n\n      <Popover>\n        <PopoverTrigger\n          render={<Button variant="outline">Outline Variant</Button>}\n        />\n        <PopoverContent variant="outline">\n          <PopoverArrow variant="outline" />\n          <PopoverTitle>Outline Style</PopoverTitle>\n          <PopoverDescription>\n            Both content and arrow use outline variant.\n          </PopoverDescription>\n        </PopoverContent>\n      </Popover>\n    </div>\n  );\n}';

function PositionsDemo() {
  const positions = [
    { side: "top", label: "Top" },
    { side: "bottom", label: "Bottom" },
    { side: "left", label: "Left" },
    { side: "right", label: "Right" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {positions.map(({ side, label }) => (
        <Popover key={side}>
          <PopoverTrigger render={<Button variant="outline">{label}</Button>} />
          <PopoverContent side={side}>
            <PopoverArrow />
            <PopoverTitle>Position: {label}</PopoverTitle>
            <PopoverDescription>
              This popover appears on the {side} of the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

const positionsCode =
  'import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription, PopoverArrow } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function PositionsDemo() {\n  const positions = [\n    { side: "top", label: "Top" },\n    { side: "bottom", label: "Bottom" },\n    { side: "left", label: "Left" },\n    { side: "right", label: "Right" },\n  ] as const;\n\n  return (\n    <div className="flex flex-wrap items-center justify-center gap-4">\n      {positions.map(({ side, label }) => (\n        <Popover key={side}>\n          <PopoverTrigger render={<Button variant="outline">{label}</Button>} />\n          <PopoverContent side={side}>\n            <PopoverArrow />\n            <PopoverTitle>Position: {label}</PopoverTitle>\n            <PopoverDescription>\n              This popover appears on the {side} of the trigger.\n            </PopoverDescription>\n          </PopoverContent>\n        </Popover>\n      ))}\n    </div>\n  );\n}';

function AlignmentsDemo() {
  const alignments = [
    { align: "start", label: "Start" },
    { align: "center", label: "Center" },
    { align: "end", label: "End" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {alignments.map(({ align, label }) => (
        <Popover key={align}>
          <PopoverTrigger render={<Button variant="outline">{label}</Button>} />
          <PopoverContent side="top" align={align}>
            <PopoverArrow />
            <PopoverTitle>Align: {label}</PopoverTitle>
            <PopoverDescription>
              This popover is aligned to the {label} of the trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

const alignmentsCode =
  'import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription, PopoverArrow } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function AlignmentsDemo() {\n  const alignments = [\n    { align: "start", label: "Start" },\n    { align: "center", label: "Center" },\n    { align: "end", label: "End" },\n  ] as const;\n\n  return (\n    <div className="flex flex-wrap items-center justify-center gap-4">\n      {alignments.map(({ align, label }) => (\n        <Popover key={align}>\n          <PopoverTrigger render={<Button variant="outline">{label}</Button>} />\n          <PopoverContent side="top" align={align}>\n            <PopoverArrow />\n            <PopoverTitle>Align: {label}</PopoverTitle>\n            <PopoverDescription>\n              This popover is aligned to the {label} of the trigger.\n            </PopoverDescription>\n          </PopoverContent>\n        </Popover>\n      ))}\n    </div>\n  );\n}';

function SideOffsetDemo() {
  const offsets = [
    { offset: 0, label: "No Offset" },
    { offset: 8, label: "8px" },
    { offset: 16, label: "16px" },
    { offset: 24, label: "24px" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {offsets.map(({ offset, label }) => (
        <Popover key={offset}>
          <PopoverTrigger render={<Button variant="outline">{label}</Button>} />
          <PopoverContent side="bottom" sideOffset={offset}>
            <PopoverArrow />
            <PopoverTitle>Offset: {label}</PopoverTitle>
            <PopoverDescription>
              This popover is{" "}
              {offset === 0 ? "directly adjacent" : `${offset}px away`} from the
              trigger.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

const sideOffsetCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription, PopoverArrow } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function SideOffsetDemo() {\n  const offsets = [\n    { offset: 0, label: "No Offset" },\n    { offset: 8, label: "8px" },\n    { offset: 16, label: "16px" },\n    { offset: 24, label: "24px" },\n  ] as const;\n\n  return (\n    <div className="flex flex-wrap items-center justify-center gap-4">\n      {offsets.map(({ offset, label }) => (\n        <Popover key={offset}>\n          <PopoverTrigger render={<Button variant="outline">{label}</Button>} />\n          <PopoverContent side="bottom" sideOffset={offset}>\n            <PopoverArrow />\n            <PopoverTitle>Offset: {label}</PopoverTitle>\n            <PopoverDescription>\n              This popover is{" "}\n              {offset === 0 ? "directly adjacent" : `${offset}px away`} from the\n              trigger.\n            </PopoverDescription>\n          </PopoverContent>\n        </Popover>\n      ))}\n    </div>\n  );\n}';

function FormDemo() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger render={<Button>Edit Dimensions</Button>} />
        <PopoverContent className="w-80">
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the width and height of your element.
          </PopoverDescription>
          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="auto" className="col-span-2" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <PopoverClose render={<Button size="sm">Apply</Button>} />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline">Focus on Input</Button>}
        />
        <PopoverContent initialFocus={() => inputRef.current}>
          <PopoverTitle>Initial Focus</PopoverTitle>
          <PopoverDescription>
            Focus automatically moves to the input field when opened.
          </PopoverDescription>
          <div className="mt-4 space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="focusInput">Name</Label>
              <Input
                ref={inputRef}
                id="focusInput"
                placeholder="Enter name..."
              />
            </div>
            <PopoverClose render={<Button size="sm">Done</Button>} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const formCode =
  'import * as React from "react";\nimport { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverTitle, PopoverDescription } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Label } from "@/components/ui/label";\n\nexport function FormDemo() {\n  const inputRef = React.useRef<HTMLInputElement>(null);\n\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Popover>\n        <PopoverTrigger render={<Button>Edit Dimensions</Button>} />\n        <PopoverContent className="w-80">\n          <PopoverTitle>Dimensions</PopoverTitle>\n          <PopoverDescription>\n            Set the width and height of your element.\n          </PopoverDescription>\n          <div className="mt-4 grid gap-3">\n            <div className="grid grid-cols-3 items-center gap-2">\n              <Label htmlFor="width">Width</Label>\n              <Input id="width" defaultValue="100%" className="col-span-2" />\n            </div>\n            <div className="grid grid-cols-3 items-center gap-2">\n              <Label htmlFor="height">Height</Label>\n              <Input id="height" defaultValue="auto" className="col-span-2" />\n            </div>\n          </div>\n          <div className="flex justify-end mt-4">\n            <PopoverClose render={<Button size="sm">Apply</Button>} />\n          </div>\n        </PopoverContent>\n      </Popover>\n\n      <Popover>\n        <PopoverTrigger\n          render={<Button variant="outline">Focus on Input</Button>}\n        />\n        <PopoverContent initialFocus={() => inputRef.current}>\n          <PopoverTitle>Initial Focus</PopoverTitle>\n          <PopoverDescription>\n            Focus automatically moves to the input field when opened.\n          </PopoverDescription>\n          <div className="mt-4 space-y-3">\n            <div className="grid gap-2">\n              <Label htmlFor="focusInput">Name</Label>\n              <Input\n                ref={inputRef}\n                id="focusInput"\n                placeholder="Enter name..."\n              />\n            </div>\n            <PopoverClose render={<Button size="sm">Done</Button>} />\n          </div>\n        </PopoverContent>\n      </Popover>\n    </div>\n  );\n}';

function CustomTriggerDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-info/10 text-info hover:bg-info/20 focus-visible:outline-ring motion-safe:transition-colors">
              <IconInfoCircle className="w-4 h-4" />
              <span className="font-medium">Info Button</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Custom Trigger</PopoverTitle>
          <PopoverDescription>
            This popover uses a custom button element as the trigger.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-ring motion-safe:transition-colors">
              <IconSettings className="w-4 h-4" />
              <span className="font-medium">Settings</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Settings</PopoverTitle>
          <PopoverDescription>
            Configure your preferences and options.
          </PopoverDescription>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-warning/10 text-warning hover:bg-warning/20 focus-visible:outline-ring motion-safe:transition-colors">
              <IconAlertCircle className="w-4 h-4" />
              <span className="font-medium">Alert</span>
            </button>
          }
        />
        <PopoverContent>
          <PopoverTitle>Alert</PopoverTitle>
          <PopoverDescription>
            Important information about your account.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const customTriggerCode =
  'import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription } from "@/components/ui/popover";\nimport { IconInfoCircle, IconSettings, IconAlertCircle } from "@tabler/icons-react";\n\nexport function CustomTriggerDemo() {\n  return (\n    <div className="flex flex-wrap items-center gap-4">\n      <Popover>\n        <PopoverTrigger\n          render={\n            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-info/10 text-info hover:bg-info/20 focus-visible:outline-ring motion-safe:transition-colors">\n              <IconInfoCircle className="w-4 h-4" />\n              <span className="font-medium">Info Button</span>\n            </button>\n          }\n        />\n        <PopoverContent>\n          <PopoverTitle>Custom Trigger</PopoverTitle>\n          <PopoverDescription>\n            This popover uses a custom button element as the trigger.\n          </PopoverDescription>\n        </PopoverContent>\n      </Popover>\n\n      <Popover>\n        <PopoverTrigger\n          render={\n            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-ring motion-safe:transition-colors">\n              <IconSettings className="w-4 h-4" />\n              <span className="font-medium">Settings</span>\n            </button>\n          }\n        />\n        <PopoverContent>\n          <PopoverTitle>Settings</PopoverTitle>\n          <PopoverDescription>\n            Configure your preferences and options.\n          </PopoverDescription>\n        </PopoverContent>\n      </Popover>\n\n      <Popover>\n        <PopoverTrigger\n          render={\n            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-warning/10 text-warning hover:bg-warning/20 focus-visible:outline-ring motion-safe:transition-colors">\n              <IconAlertCircle className="w-4 h-4" />\n              <span className="font-medium">Alert</span>\n            </button>\n          }\n        />\n        <PopoverContent>\n          <PopoverTitle>Alert</PopoverTitle>\n          <PopoverDescription>\n            Important information about your account.\n          </PopoverDescription>\n        </PopoverContent>\n      </Popover>\n    </div>\n  );\n}';

const usageCode =
  'import * as React from "react";\nimport { Popover as NativePopover } from "@base-ui/react/popover";\nimport { Popover, PopoverTrigger, PopoverPayloadTrigger, PopoverContent, PopoverClose, PopoverPortal, PopoverPositioner, PopoverViewport, PopoverBackdrop, PopoverArrow, PopoverTitle, PopoverDescription, createPopoverHandle, KiraPopover, KiraPopoverFlow } from "@/components/ui/popover";\nimport { Button } from "@/components/ui/button";\n\nexport function Usage() {\n  const [handle] = React.useState(() => createPopoverHandle<string>());\n  return <>\n    <PopoverPayloadTrigger handle={handle} id="atlas-preview" payload="Atlas" render={<Button>Preview Atlas</Button>} />\n    <Popover handle={handle}>{({ payload }) => <PopoverContent portalProps={{ keepMounted: true }} positionerProps={{ side: "top" }}>\n      <PopoverViewport><PopoverTitle>{payload}</PopoverTitle><PopoverDescription>Project preview</PopoverDescription></PopoverViewport>\n      <PopoverArrow /><PopoverClose render={<Button>Close preview</Button>} />\n    </PopoverContent>}</Popover>\n    <KiraPopover trigger={<Button>Details</Button>} title="Atlas">Project details</KiraPopover>\n    <KiraPopoverFlow trigger={<Button>Preferences</Button>} views={[\n      { id: "overview", title: "Notifications", render: ({ navigate }) => <Button onClick={() => navigate("delivery")}>Delivery settings</Button> },\n      { id: "delivery", title: "Delivery", render: ({ back }) => <Button onClick={back}>Back</Button> },\n    ]} />\n    {/* Low-level parts pair with the native Popup rather than nesting Content. */}\n    <Popover modal><PopoverTrigger render={<Button>Manual modal</Button>} />\n      <PopoverPortal><PopoverBackdrop /><PopoverPositioner sideOffset={8}>\n        <NativePopover.Popup className="rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">\n          <PopoverTitle>Manual composition</PopoverTitle><PopoverDescription>Focus and dismissal remain native.</PopoverDescription><PopoverClose render={<Button>Close modal</Button>} />\n        </NativePopover.Popup>\n      </PopoverPositioner></PopoverPortal>\n    </Popover>\n  </>;\n}';

export default function PopoverPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Popover"
        description="Displays rich content in a floating panel anchored to a trigger element. Supports forms, focus management, and modal behavior."
        version="v2.0.0"
      />

      <FeatureGrid features={popoverPageFeatures} />

      <DemoTabs tabs={popoverPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={popoverPageShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the popover components with proper accessibility."
        notes={[
          {
            label: "KiraPopover",
            body: "Use KiraPopover for structured popovers with title, description, footer, optional arrow, and dirty-draft dismissal protection.",
          },
          {
            label: "KiraPopoverFlow",
            body: "Use KiraPopoverFlow for multi-step local drilldown views with focus-preserving Back navigation.",
          },
        ]}
      />

      <APIReference
        sections={popoverPageAPISections}
        title="API reference"
        description="Complete props reference for all popover components."
      />
      <Changelog entries={popoverPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const popoverPageFeatures = [
  {
    title: "Accessible",
    description:
      "Native title, description and focus handling; inspect Basic and Stress Cases.",
  },
  {
    title: "Shared editing",
    description:
      "One popup serves project triggers and protects unsaved drafts in Shared Editor.",
  },
  {
    title: "Local drilldown",
    description:
      "Notification preferences support a detail view and focus-preserving Back in Flow.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const popoverPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Popover"
        description="Simple popover with title, description, and arrow variants."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "positions",
    label: "Positions",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Positioning"
        description="Popovers can appear on any side of the trigger element."
        code={positionsCode}
      >
        <PositionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "alignments",
    label: "Alignments",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Alignment Options"
        description="Control how the popover aligns relative to the trigger (start, center, end)."
        code={alignmentsCode}
      >
        <AlignmentsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "side-offset",
    label: "Side Offset",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Side Offset"
        description="Adjust the distance between the popover and its trigger element."
        code={sideOffsetCode}
      >
        <SideOffsetDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "custom-trigger",
    label: "Custom Trigger",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Custom Trigger"
        description="Use any element as the popover trigger with full customization."
        code={customTriggerCode}
      >
        <CustomTriggerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraPopover",
    group: "KiraPopover",
    demo: (
      <DemoWrapper
        title="KiraPopover"
        description="Title, description, footer and close composed from native parts."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shared-editor",
    label: "Shared Editor",
    group: "KiraPopover",
    demo: (
      <DemoWrapper
        title="Shared assignee editor"
        description="Validate, save, retry and protect drafts across detached record triggers."
        code={sharedEditorCode}
      >
        <SharedEditorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "flow",
    label: "Flow",
    group: "KiraPopover",
    demo: (
      <DemoWrapper
        title="Notification drilldown"
        description="Local view IDs with focus return; closing resets an uncontrolled flow."
        code={flowCode}
      >
        <FlowDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "form",
    label: "Form",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Popover with Form"
        description="Popover containing form elements with focus management."
        code={formCode}
      >
        <FormDemo />
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
        description="RTL, long titles and scroll, nested modal, custom portal, keepMounted, empty and disabled states inside a narrow max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const popoverPageShortcuts = [
  {
    keys: "Escape",
    description:
      "Inherited from Base UI: request close. Dirty drafts show Keep editing / Discard changes; pending saves prevent dismissal.",
  },
  { keys: "Tab", description: "Move focus to next focusable element" },
  { keys: "Shift + Tab", description: "Move focus to previous element" },
  { keys: "Enter / Space", description: "Activate trigger or close button" },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const popoverPageAPISections = [
  {
    title: "Popover<Payload>",
    props: [
      {
        prop: "open / defaultOpen",
        type: "boolean",
        description: "Controlled or initial uncontrolled visibility.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, details: Popover.Root.ChangeEventDetails) => void",
        description:
          "Native reasons, trigger, cancellation and preventUnmountOnClose are retained. Check details.isCanceled before committing controlled state.",
      },
      {
        prop: "onOpenChangeComplete",
        type: "(open: boolean) => void",
        description: "Runs after the native transition completes.",
      },
      {
        prop: "modal",
        type: 'boolean | "trap-focus"',
        description:
          "Native modality. Render a close part for accessible modal escape.",
        default: "false",
      },
      {
        prop: "handle",
        type: "PopoverHandle<Payload>",
        description: "Associates detached triggers with this root.",
      },
      {
        prop: "triggerId / defaultTriggerId",
        type: "string | null",
        description: "Controlled or initial active trigger identity.",
      },
      {
        prop: "actionsRef",
        type: "RefObject<Popover.Root.Actions | null>",
        description: "Native close/unmount actions.",
      },
      {
        prop: "children",
        type: "ReactNode | ((context: { payload: Payload | undefined }) => ReactNode)",
        description:
          "Native active trigger payload render function. Root renders no DOM element.",
      },
    ],
  },
  {
    title: "PopoverTrigger<Payload>",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "handle / payload / id",
        type: "PopoverHandle<Payload> / Payload / string",
        description:
          "Associate detached triggers, pass a typed record and identify the active trigger.",
      },
      {
        prop: "openOnHover / delay / closeDelay",
        type: "boolean / number / number",
        description:
          "Optional native hover interaction; delays live on the trigger.",
      },
      {
        prop: "disabled / nativeButton",
        type: "boolean / boolean",
        description: "Disabled state and native button semantics.",
      },
    ],
  },
  {
    title: "PopoverPayloadTrigger<Payload>",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "handle / payload / id",
        type: "PopoverHandle<Payload> / Payload / string",
        description:
          "Associate detached triggers, pass a typed record and identify the active trigger.",
      },
      {
        prop: "openOnHover / delay / closeDelay",
        type: "boolean / number / number",
        description:
          "Optional native hover interaction; delays live on the trigger.",
      },
      {
        prop: "disabled / nativeButton",
        type: "boolean / boolean",
        description: "Disabled state and native button semantics.",
      },
    ],
  },
  {
    title: "createPopoverHandle<Payload>()",
    props: [
      {
        prop: "returns",
        type: "PopoverHandle<Payload>",
        description:
          "Create once per popup, for example in useState. handle.open(triggerId) and handle.close() request native changes.",
      },
    ],
  },
  {
    title: "PopoverContent",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "size",
        type: '"auto" | "sm" | "md" | "lg" | "xl"',
        description:
          "Width preset constrained by available space; scrolls internally.",
        default: '"md"',
      },
      {
        prop: "variant",
        type: '"default" | "outline"',
        description: "Surface style.",
        default: '"default"',
      },
      {
        prop: "side / sideOffset / align / alignOffset",
        type: "Popover.Positioner.Props positioning fields",
        description:
          "Convenience props override grouped values only when explicitly supplied; defaults bottom / 4 / center / 0.",
      },
      {
        prop: "arrowPadding / collisionBoundary / collisionPadding / sticky",
        type: "Popover.Positioner.Props positioning fields",
        description:
          "Native collision and arrow controls; default collision padding 16.",
      },
      {
        prop: "positionerProps",
        type: "PopoverPositionerProps",
        description:
          "All native positioning options, such as anchor, collisionAvoidance and disableAnchorTracking.",
      },
      {
        prop: "portalProps",
        type: "PopoverPortalProps",
        description:
          "Native container and keepMounted belong here, not on Popup.",
      },
      {
        prop: "initialFocus / finalFocus",
        type: "boolean | RefObject<HTMLElement | null> | ((interactionType) => void | boolean | HTMLElement | null)",
        description: "Native focus placement and return.",
      },
      {
        prop: "role",
        type: "React.AriaRole",
        description:
          "Changes semantics only; menu/listbox keyboard interaction requires the matching primitive.",
      },
    ],
  },
  {
    title: "PopoverPortal",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "container / keepMounted",
        type: "Popover.Portal.Props",
        description: "Custom portal destination and retained closed DOM.",
      },
    ],
  },
  {
    title: "PopoverPositioner",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "Positioning props",
        type: "Popover.Positioner.Props",
        description:
          "Native anchor, side/align, offsets, collision and tracking. Owns the z-50 popup stacking layer; use with a native Popup for fully manual composition.",
      },
    ],
  },
  {
    title: "PopoverViewport",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description:
          "Optional native animated switching among payload triggers; not a view navigation system.",
      },
    ],
  },
  {
    title: "PopoverClose",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Native close request, subject to cancellation.",
      },
    ],
  },
  {
    title: "PopoverBackdrop",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
    ],
  },
  {
    title: "PopoverArrow",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "variant",
        type: '"default" | "outline"',
        description: "Match the content surface.",
        default: '"default"',
      },
    ],
  },
  {
    title: "PopoverTitle",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
      {
        prop: "as",
        type: '"h2" | "h3" | "h4" | "h5" | "h6"',
        description: "Heading element; native render overrides as.",
        default: '"h4"',
      },
    ],
  },
  {
    title: "PopoverDescription",
    props: [
      {
        prop: "Native props",
        type: "Base UI part Props (including render, ref, className and style)",
        description:
          "Native props and event behavior are forwarded. See the linked Base UI API; render replaces the element without asChild.",
      },
    ],
  },
  {
    title: "KiraPopover<Payload>",
    props: [
      {
        prop: "open / defaultOpen",
        type: "boolean",
        description: "Controlled or initial uncontrolled visibility.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, details: Popover.Root.ChangeEventDetails) => void",
        description:
          "Native reasons, trigger, cancellation and preventUnmountOnClose are retained. Check details.isCanceled before committing controlled state.",
      },
      {
        prop: "onOpenChangeComplete",
        type: "(open: boolean) => void",
        description: "Runs after the native transition completes.",
      },
      {
        prop: "modal",
        type: 'boolean | "trap-focus"',
        description:
          "Native modality. Render a close part for accessible modal escape.",
        default: "false",
      },
      {
        prop: "handle",
        type: "PopoverHandle<Payload>",
        description: "Associates detached triggers with this root.",
      },
      {
        prop: "triggerId / defaultTriggerId",
        type: "string | null",
        description: "Controlled or initial active trigger identity.",
      },
      {
        prop: "actionsRef",
        type: "RefObject<Popover.Root.Actions | null>",
        description: "Native close/unmount actions.",
      },
      {
        prop: "trigger",
        type: "ReactElement",
        description: "Optional convenient trigger; omit for detached triggers.",
      },
      {
        prop: "title / description / children / footer",
        type: "ReactNode | ((payload: Payload | undefined) => ReactNode)",
        description: "Convenience slots resolve the active payload.",
      },
      {
        prop: "contentProps",
        type: "PopoverContentProps",
        description: "Popup, positioning, portal and focus settings.",
      },
      {
        prop: "showClose / arrow",
        type: "boolean / boolean",
        description:
          "Visible close action (default true) and arrow (default false).",
      },
      {
        prop: "dirty / onDiscard",
        type: "boolean / (() => void)",
        description:
          "Dirty dismissals and record switches are canceled and offer Keep editing / Discard changes. Caller owns draft reset. Parent-controlled forced closes remain caller-owned.",
      },
      {
        prop: "preventClose",
        type: "boolean",
        description:
          "Pending work prevents native dismiss/switch requests without a discard option.",
        default: "false",
      },
    ],
  },
  {
    title: "KiraPopoverFlow",
    props: [
      {
        prop: "Inherited",
        type: "Omit<KiraPopoverProps, 'children' | 'title'>",
        description: "All convenience/native popup options except body/title.",
      },
      {
        prop: "views",
        type: "readonly PopoverFlowView[]",
        description:
          "Stable id, title and render({ navigate, back }) per view. An empty list renders an empty-state title.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "string / string / ((id: string) => void)",
        description:
          "Controlled view or initial local view. Local close resets; controlled view stays caller-owned. Back restores the triggering control when possible.",
      },
    ],
  },
  {
    title: "Variants and types",
    props: [
      {
        prop: "popoverContentVariants / popoverArrowVariants",
        type: "CVA functions",
        description: "Exported size/surface classes.",
      },
      {
        prop: "Exported types",
        type: "PopoverProps, PopoverTriggerProps, PopoverPayloadTriggerProps, PopoverContentProps, PopoverPortalProps, PopoverPositionerProps, PopoverViewportProps, PopoverCloseProps, PopoverBackdropProps, PopoverTitleProps, PopoverDescriptionProps, PopoverArrowProps, PopoverSlot, KiraPopoverProps, PopoverFlowNavigation, PopoverFlowView, KiraPopoverFlowProps",
        description: "Generic props preserve native payload types.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const popoverPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "9 November 2026",
    changes: [
      {
        type: "added",
        title:
          "Shared payload editing, dirty draft guard, KiraPopover and KiraPopoverFlow",
        description:
          "Audited against Base UI 1.9.0; no dependency bump. Native viewport is only for switching payload triggers.",
      },
      {
        type: "fixed",
        title:
          "Native event details, positioned-parent stacking, positioning precedence, reduced motion and available-space scrolling",
      },
      {
        type: "breaking",
        title: "Root no longer advertises a DOM data-slot",
        description:
          "Root renders no element. onOpenChange now exposes full native details. Roles alone never add menu or listbox keyboard behavior; use the appropriate primitives.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
