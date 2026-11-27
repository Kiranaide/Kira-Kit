import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconLayoutSidebar,
  IconDeviceMobile,
  IconHistory,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetClose,
  SheetHandle,
  KiraSheet,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function SheetDetails({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>Local release-planning fixture.</SheetDescription>
      </SheetHeader>
      <SheetBody>{children}</SheetBody>
      {footer != null && <SheetFooter>{footer}</SheetFooter>}
    </>
  );
}

function BasicDemo({ isActive = true }: { isActive?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [reviewed, setReviewed] = React.useState(false);

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <Sheet
        open={open}
        onOpenChange={(next, details) => {
          if (!details.isCanceled) setOpen(next);
        }}
      >
        <SheetTrigger
          render={<Button variant="outline">Review release</Button>}
        />
        <SheetContent>
          <SheetDetails
            title="October release"
            footer={
              <>
                <SheetClose render={<Button variant="outline">Close</Button>} />
                <Button
                  onClick={() => {
                    setReviewed(true);
                    setOpen(false);
                  }}
                >
                  Mark reviewed
                </Button>
              </>
            }
          >
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Owner</dt>
                <dd>Maya Chen</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Scope</dt>
                <dd>Permissions, audit history, and export improvements.</dd>
              </div>
            </dl>
          </SheetDetails>
        </SheetContent>
      </Sheet>
      <output className="block text-sm text-muted-foreground">
        {reviewed
          ? "October release reviewed."
          : "The release is waiting for review."}
      </output>
    </div>
  );
}

const basicDemoCode = `import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetBody, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function SheetDetails({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <>
    <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Local release-planning fixture.</SheetDescription></SheetHeader>
    <SheetBody>{children}</SheetBody>
    {footer != null && <SheetFooter>{footer}</SheetFooter>}
  </>;
}

export function BasicDemo({ isActive = true }: { isActive?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [reviewed, setReviewed] = React.useState(false);
  if (!isActive) return null;
  return <div className="space-y-4">
    <Sheet open={open} onOpenChange={(next, details) => { if (!details.isCanceled) setOpen(next); }}>
      <SheetTrigger render={<Button variant="outline">Review release</Button>} />
      <SheetContent>
        <SheetDetails title="October release" footer={<>
          <SheetClose render={<Button variant="outline">Close</Button>} />
          <Button onClick={() => { setReviewed(true); setOpen(false); }}>Mark reviewed</Button>
        </>}>
          <dl className="space-y-4 text-sm">
            <div><dt className="text-muted-foreground">Owner</dt><dd>Maya Chen</dd></div>
            <div><dt className="text-muted-foreground">Scope</dt><dd>Permissions, audit history, and export improvements.</dd></div>
          </dl>
        </SheetDetails>
      </SheetContent>
    </Sheet>
    <output className="block text-sm text-muted-foreground">{reviewed ? "October release reviewed." : "The release is waiting for review."}</output>
  </div>;
}`;

function EdgesDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {(["left", "right", "top", "bottom"] as const).map((side) => (
        <Sheet key={side} side={side}>
          <SheetTrigger render={<Button variant="outline">{side}</Button>} />
          <SheetContent>
            <SheetDetails title={`Release notes · ${side}`}>
              <p className="text-sm text-muted-foreground">
                The root owns the edge. Content owns the size, focus targets,
                and scrolling.
              </p>
            </SheetDetails>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

const edgesDemoCode = `import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetBody } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function SheetDetails({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <>
    <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Local release-planning fixture.</SheetDescription></SheetHeader>
    <SheetBody>{children}</SheetBody>
    {footer != null && <SheetFooter>{footer}</SheetFooter>}
  </>;
}

export function EdgesDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;
  return <div className="flex flex-wrap gap-3">
    {(["left", "right", "top", "bottom"] as const).map((side) => <Sheet key={side} side={side}>
      <SheetTrigger render={<Button variant="outline">{side}</Button>} />
      <SheetContent><SheetDetails title={\`Release notes · \${side}\`}>
        <p className="text-sm text-muted-foreground">The root owns the edge. Content owns the size, focus targets, and scrolling.</p>
      </SheetDetails></SheetContent>
    </Sheet>)}
  </div>;
}`;

function SizesDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <Sheet key={size}>
          <SheetTrigger render={<Button variant="outline">{size}</Button>} />
          <SheetContent size={size}>
            <SheetDetails title={`Release inspector · ${size}`}>
              <p className="text-sm text-muted-foreground">
                Use a narrow inspector for metadata and a larger panel for
                longer editing tasks.
              </p>
            </SheetDetails>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

const sizesDemoCode = `import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetBody } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function SheetDetails({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <>
    <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Local release-planning fixture.</SheetDescription></SheetHeader>
    <SheetBody>{children}</SheetBody>
    {footer != null && <SheetFooter>{footer}</SheetFooter>}
  </>;
}

export function SizesDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;
  return <div className="flex flex-wrap gap-3">
    {(["sm", "default", "lg", "xl", "full"] as const).map((size) => <Sheet key={size}>
      <SheetTrigger render={<Button variant="outline">{size}</Button>} />
      <SheetContent size={size}><SheetDetails title={\`Release inspector · \${size}\`}>
        <p className="text-sm text-muted-foreground">Use a narrow inspector for metadata and a larger panel for longer editing tasks.</p>
      </SheetDetails></SheetContent>
    </Sheet>)}
  </div>;
}`;

function DraftsDemo({ isActive = true }: { isActive?: boolean }) {
  const id = React.useId();

  if (!isActive) return null;

  return (
    <KiraSheet
      trigger={<Button variant="outline">Open local draft</Button>}
      title="Draft release note"
      description="This unsaved field is retained while the portal stays mounted."
      contentProps={{ portalProps: { keepMounted: true } }}
      footer={
        <SheetClose render={<Button variant="outline">Close draft</Button>} />
      }
    >
      <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium">
          Release note
        </label>
        <Input id={id} defaultValue="Document the permission changes" />
      </div>
    </KiraSheet>
  );
}

const draftsDemoCode = `import * as React from "react";
import { SheetClose, KiraSheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DraftsDemo({ isActive = true }: { isActive?: boolean }) {
  const id = React.useId();
  if (!isActive) return null;
  return <KiraSheet trigger={<Button variant="outline">Open local draft</Button>} title="Draft release note"
    description="This unsaved field is retained while the portal stays mounted."
    contentProps={{ portalProps: { keepMounted: true } }}
    footer={<SheetClose render={<Button variant="outline">Close draft</Button>} />}>
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">Release note</label>
      <Input id={id} defaultValue="Document the permission changes" />
    </div>
  </KiraSheet>;
}`;

function DetentsDemo({ isActive = true }: { isActive?: boolean }) {
  const [point, setPoint] = React.useState<number | string | null>(0.5);

  if (!isActive) return null;

  return (
    <Sheet
      side="bottom"
      snapPoints={[0.5, 1]}
      snapPoint={point}
      onSnapPointChange={setPoint}
    >
      <SheetTrigger
        render={<Button variant="outline">Open release actions</Button>}
      />
      <SheetContent>
        <SheetHandle
          expanded={point === 1}
          onExpandedChange={(expanded) => setPoint(expanded ? 1 : 0.5)}
        />
        <SheetDetails
          title="Release actions"
          footer={
            <SheetClose
              render={<Button variant="outline">Close actions</Button>}
            />
          }
        >
          <p className="text-sm text-muted-foreground">
            The handle is a native button. Enter and Space provide an
            alternative to swiping.
          </p>
          <ol className="mt-4 space-y-3 text-sm">
            {[
              "Review access rules",
              "Confirm the changelog",
              "Prepare the rollout",
            ].map((task) => (
              <li key={task} className="rounded-lg border p-4">
                {task}
              </li>
            ))}
          </ol>
        </SheetDetails>
      </SheetContent>
    </Sheet>
  );
}

const detentsDemoCode = `import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetBody, SheetClose, SheetHandle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function SheetDetails({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <>
    <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Local release-planning fixture.</SheetDescription></SheetHeader>
    <SheetBody>{children}</SheetBody>
    {footer != null && <SheetFooter>{footer}</SheetFooter>}
  </>;
}

export function DetentsDemo({ isActive = true }: { isActive?: boolean }) {
  const [point, setPoint] = React.useState<number | string | null>(0.5);
  if (!isActive) return null;
  return <Sheet side="bottom" snapPoints={[0.5, 1]} snapPoint={point} onSnapPointChange={setPoint}>
    <SheetTrigger render={<Button variant="outline">Open release actions</Button>} />
    <SheetContent>
      <SheetHandle expanded={point === 1} onExpandedChange={(expanded) => setPoint(expanded ? 1 : 0.5)} />
      <SheetDetails title="Release actions" footer={<SheetClose render={<Button variant="outline">Close actions</Button>} />}>
        <p className="text-sm text-muted-foreground">The handle is a native button. Enter and Space provide an alternative to swiping.</p>
        <ol className="mt-4 space-y-3 text-sm">{["Review access rules", "Confirm the changelog", "Prepare the rollout"].map((task) => <li key={task} className="rounded-lg border p-4">{task}</li>)}</ol>
      </SheetDetails>
    </SheetContent>
  </Sheet>;
}`;

function InspectorDemo({ isActive = true }: { isActive?: boolean }) {
  const [queued, setQueued] = React.useState(0);

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Sheet modal={false}>
          <SheetTrigger
            render={<Button variant="outline">Inspect release</Button>}
          />
          <SheetContent size="sm">
            <SheetDetails title="October release">
              <p className="text-sm text-muted-foreground">
                Read-only details. Pointer dismissal is disabled by the shared
                non-modal Drawer recipe.
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt>Owner</dt>
                  <dd>Maya Chen</dd>
                </div>
                <div>
                  <dt>Queue</dt>
                  <dd className="tabular-nums">{queued} items</dd>
                </div>
              </dl>
            </SheetDetails>
          </SheetContent>
        </Sheet>
        <Button
          variant="outline"
          onClick={() => setQueued((value) => value + 1)}
        >
          Queue next item
        </Button>
      </div>
      <output className="block text-sm text-muted-foreground">
        {queued} items queued. The inspector can stay open.
      </output>
    </div>
  );
}

const inspectorDemoCode = `import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetBody } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function SheetDetails({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <>
    <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Local release-planning fixture.</SheetDescription></SheetHeader>
    <SheetBody>{children}</SheetBody>
    {footer != null && <SheetFooter>{footer}</SheetFooter>}
  </>;
}

export function InspectorDemo({ isActive = true }: { isActive?: boolean }) {
  const [queued, setQueued] = React.useState(0);
  if (!isActive) return null;
  return <div className="space-y-4">
    <div className="flex flex-wrap gap-3">
      <Sheet modal={false}>
        <SheetTrigger render={<Button variant="outline">Inspect release</Button>} />
        <SheetContent size="sm"><SheetDetails title="October release">
          <p className="text-sm text-muted-foreground">Read-only details. Pointer dismissal is disabled by the shared non-modal Drawer recipe.</p>
          <dl className="mt-4 space-y-3 text-sm"><div><dt>Owner</dt><dd>Maya Chen</dd></div><div><dt>Queue</dt><dd className="tabular-nums">{queued} items</dd></div></dl>
        </SheetDetails></SheetContent>
      </Sheet>
      <Button variant="outline" onClick={() => setQueued((value) => value + 1)}>Queue next item</Button>
    </div>
    <output className="block text-sm text-muted-foreground">{queued} items queued. The inspector can stay open.</output>
  </div>;
}`;

function HistoryDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Read release history</Button>}
      />
      <SheetContent size="lg">
        <SheetDetails
          title="Release history"
          footer={
            <SheetClose
              render={<Button variant="outline">Done reading</Button>}
            />
          }
        >
          <ol className="space-y-3">
            {Array.from({ length: 24 }, (_, index) => (
              <li
                key={`revision-${index + 1}`}
                className="rounded-lg border p-4"
              >
                <p className="text-sm font-medium">Revision {index + 1}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Access-rule review and rollout notes for the local fixture.
                </p>
              </li>
            ))}
          </ol>
        </SheetDetails>
      </SheetContent>
    </Sheet>
  );
}

const historyDemoCode = `import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetBody, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function SheetDetails({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return <>
    <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Local release-planning fixture.</SheetDescription></SheetHeader>
    <SheetBody>{children}</SheetBody>
    {footer != null && <SheetFooter>{footer}</SheetFooter>}
  </>;
}

export function HistoryDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;
  return <Sheet>
    <SheetTrigger render={<Button variant="outline">Read release history</Button>} />
    <SheetContent size="lg">
      <SheetDetails title="Release history" footer={<SheetClose render={<Button variant="outline">Done reading</Button>} />}>
        <ol className="space-y-3">{Array.from({ length: 24 }, (_, index) => <li key={\`revision-\${index + 1}\`} className="rounded-lg border p-4">
          <p className="text-sm font-medium">Revision {index + 1}</p>
          <p className="mt-1 text-sm text-muted-foreground">Access-rule review and rollout notes for the local fixture.</p>
        </li>)}</ol>
      </SheetDetails>
    </SheetContent>
  </Sheet>;
}`;

function KiraDemo({ isActive = true }: { isActive?: boolean }) {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [record, setRecord] = React.useState("October release");
  const [draft, setDraft] = React.useState("October release");
  const [error, setError] = React.useState<string | null>(null);
  const dirty = draft !== record;

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <KiraSheet
        trigger={<Button variant="outline">Edit release</Button>}
        title="Edit release"
        description="Changes affect only this local fixture."
        rootProps={{
          open,
          onOpenChange: (next, details) => {
            if (!details.isCanceled) setOpen(next);
          },
        }}
        closeDisabledReason={
          dirty
            ? "Save the changes or discard this draft before closing."
            : undefined
        }
        error={error ? <span id={`${formId}-error`}>{error}</span> : undefined}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDraft(record);
                setError(null);
                setOpen(false);
              }}
            >
              Discard draft
            </Button>
            <Button type="submit" form={formId}>
              Save changes
            </Button>
          </>
        }
      >
        <KiraControlsSection
          formId={formId}
          draft={draft}
          setError={setError}
          setRecord={setRecord}
          setDraft={setDraft}
          setOpen={setOpen}
          error={error}
        />
      </KiraSheet>
      <output className="block text-sm text-muted-foreground">
        Saved release:{" "}
        <span className="font-medium text-foreground">{record}</span>
      </output>
    </div>
  );
}

const kiraDemoCode = `import * as React from "react";
import { KiraSheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function KiraDemo({ isActive = true }: { isActive?: boolean }) {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [record, setRecord] = React.useState("October release");
  const [draft, setDraft] = React.useState("October release");
  const [error, setError] = React.useState<string | null>(null);
  const dirty = draft !== record;
  if (!isActive) return null;
  return <div className="space-y-4">
    <KiraSheet trigger={<Button variant="outline">Edit release</Button>} title="Edit release"
      description="Changes affect only this local fixture." rootProps={{ open, onOpenChange: (next, details) => { if (!details.isCanceled) setOpen(next); } }}
      closeDisabledReason={dirty ? "Save the changes or discard this draft before closing." : undefined}
      error={error ? <span id={\`\${formId}-error\`}>{error}</span> : undefined}
      footer={<><Button variant="outline" onClick={() => { setDraft(record); setError(null); setOpen(false); }}>Discard draft</Button><Button type="submit" form={formId}>Save changes</Button></>}>
      <form id={formId} className="space-y-2" onSubmit={(event) => {
        event.preventDefault();
        if (!draft.trim()) {
          setError("Enter a release name before saving.");
          const field = event.currentTarget.elements.namedItem("release");
          if (field instanceof HTMLElement) field.focus();
          return;
        }
        setRecord(draft.trim()); setDraft(draft.trim()); setError(null); setOpen(false);
      }}>
        <label htmlFor={\`\${formId}-name\`} className="text-sm font-medium">Release name</label>
        <Input id={\`\${formId}-name\`} name="release" value={draft} required
          aria-invalid={error != null} aria-describedby={error ? \`\${formId}-error\` : undefined}
          onChange={(event) => { setDraft(event.target.value); setError(null); }} />
      </form>
    </KiraSheet>
    <output className="block text-sm text-muted-foreground">Saved release: <span className="font-medium text-foreground">{record}</span></output>
  </div>;
}`;

function StatesDemo({ isActive = true }: { isActive?: boolean }) {
  const id = React.useId();

  const [state, setState] = React.useState<
    "ready" | "loading" | "error" | "empty" | "read-only"
  >("ready");

  if (!isActive) return null;

  return (
    <KiraSheet
      trigger={<Button variant="outline">Open content states</Button>}
      title="release-permissions-audit-history-and-migration-notes"
      description="A long title, local loading, recovery, empty content, and read-only details."
      loading={state === "loading"}
      loadingLabel="Loading the local revision fixture…"
      closeDisabledReason={
        state === "loading" ? "Cancel loading before closing." : undefined
      }
      error={
        state === "error"
          ? "Revision details are unavailable. Try loading them again."
          : undefined
      }
      onRetry={() => setState("ready")}
      footer={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setState(state === "loading" ? "ready" : "loading")}
          >
            {state === "loading" ? "Cancel loading" : "Show loading"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setState("error")}>
            Show error
          </Button>
          <Button variant="outline" size="sm" onClick={() => setState("empty")}>
            Show empty
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setState("read-only")}
          >
            Read-only
          </Button>
          <Button variant="outline" size="sm" onClick={() => setState("ready")}>
            Ready
          </Button>
        </div>
      }
    >
      {state === "empty" ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">No revisions yet.</p>
          <Button variant="outline" onClick={() => setState("ready")}>
            Create local revision
          </Button>
        </div>
      ) : (
        <div className="min-h-48 space-y-2">
          <label htmlFor={id} className="text-sm font-medium">
            Owner note
          </label>
          <Input
            id={id}
            defaultValue="Review the access rules"
            readOnly={state === "read-only"}
          />
          <p className="text-sm text-muted-foreground">
            {state === "read-only"
              ? "This snapshot is read-only. Request edit access from the owner."
              : "A loading refresh keeps this field mounted."}
          </p>
        </div>
      )}
    </KiraSheet>
  );
}

const statesDemoCode = `import * as React from "react";
import { KiraSheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StatesDemo({ isActive = true }: { isActive?: boolean }) {
  const id = React.useId();
  const [state, setState] = React.useState<"ready" | "loading" | "error" | "empty" | "read-only">("ready");
  if (!isActive) return null;
  return <KiraSheet trigger={<Button variant="outline">Open content states</Button>}
    title="release-permissions-audit-history-and-migration-notes" description="A long title, local loading, recovery, empty content, and read-only details."
    loading={state === "loading"} loadingLabel="Loading the local revision fixture…"
    closeDisabledReason={state === "loading" ? "Cancel loading before closing." : undefined}
    error={state === "error" ? "Revision details are unavailable. Try loading them again." : undefined}
    onRetry={() => setState("ready")}
    footer={<div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => setState(state === "loading" ? "ready" : "loading")}>{state === "loading" ? "Cancel loading" : "Show loading"}</Button>
      <Button variant="outline" size="sm" onClick={() => setState("error")}>Show error</Button>
      <Button variant="outline" size="sm" onClick={() => setState("empty")}>Show empty</Button>
      <Button variant="outline" size="sm" onClick={() => setState("read-only")}>Read-only</Button>
      <Button variant="outline" size="sm" onClick={() => setState("ready")}>Ready</Button>
    </div>}>
    {state === "empty" ? <div className="space-y-3"><p className="text-sm text-muted-foreground">No revisions yet.</p><Button variant="outline" onClick={() => setState("ready")}>Create local revision</Button></div> :
      <div className="min-h-48 space-y-2"><label htmlFor={id} className="text-sm font-medium">Owner note</label><Input id={id} defaultValue="Review the access rules" readOnly={state === "read-only"} />
        <p className="text-sm text-muted-foreground">{state === "read-only" ? "This snapshot is read-only. Request edit access from the owner." : "A loading refresh keeps this field mounted."}</p></div>}
  </KiraSheet>;
}`;

function StressDemo({ isActive = true }: { isActive?: boolean }) {
  if (!isActive) return null;

  return (
    <div className="max-w-xs space-y-3">
      <KiraSheet
        trigger={
          <Button variant="outline" className="w-full justify-start truncate">
            EnterpriseReleasePermissionsAndAuditHistoryReviewPanel
          </Button>
        }
        title="EnterpriseReleasePermissionsAndAuditHistoryReviewPanel"
        description="Long unbroken title, empty body, and disabled footer action inside a narrow trigger container."
        footer={
          <>
            <SheetClose render={<Button variant="outline">Close</Button>} />
            <Button disabled>Approve rollout</Button>
          </>
        }
      />
      <Sheet>
        <SheetTrigger
          disabled
          render={
            <Button variant="outline" className="w-full justify-start truncate">
              Disabled trigger in narrow column
            </Button>
          }
        />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Unavailable panel</SheetTitle>
            <SheetDescription>This trigger is disabled.</SheetDescription>
          </SheetHeader>
          <SheetBody />
        </SheetContent>
      </Sheet>
    </div>
  );
}

const stressDemoCode = `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetClose, KiraSheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-3">
      <KiraSheet
        trigger={
          <Button variant="outline" className="w-full justify-start truncate">
            EnterpriseReleasePermissionsAndAuditHistoryReviewPanel
          </Button>
        }
        title="EnterpriseReleasePermissionsAndAuditHistoryReviewPanel"
        description="Long unbroken title, empty body, and disabled footer action inside a narrow trigger container."
        footer={
          <>
            <SheetClose render={<Button variant="outline">Close</Button>} />
            <Button disabled>Approve rollout</Button>
          </>
        }
      />
      <Sheet>
        <SheetTrigger
          disabled
          render={
            <Button variant="outline" className="w-full justify-start truncate">
              Disabled trigger in narrow column
            </Button>
          }
        />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Unavailable panel</SheetTitle>
            <SheetDescription>This trigger is disabled.</SheetDescription>
          </SheetHeader>
          <SheetBody />
        </SheetContent>
      </Sheet>
    </div>
  );
}`;

const sheetUsageCode = `import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose, SheetHandle, SheetPortal, SheetOverlay, KiraSheet, sheetVariants } from "@/components/ui/sheet";

export function ComposedSheet() {
  return <Sheet>
    <SheetTrigger render={<Button variant="outline">Review release</Button>} />
    <SheetContent>
      <SheetHeader><SheetTitle>Review release</SheetTitle><SheetDescription>Local release details.</SheetDescription></SheetHeader>
      <SheetBody>Review the rollout notes.</SheetBody>
      <SheetFooter><SheetClose render={<Button variant="outline">Close</Button>} /></SheetFooter>
    </SheetContent>
  </Sheet>;
}

export function ResponsiveSheet() {
  return <KiraSheet trigger={<Button variant="outline">Open notes</Button>} title="Release notes"
    contentProps={{ portalProps: { keepMounted: true } }}>
    Draft content.
  </KiraSheet>;
}

export function BottomSheet() {
  const [point, setPoint] = React.useState<number | string | null>(0.5);
  return <Sheet side="bottom" snapPoints={[0.5, 1]} snapPoint={point} onSnapPointChange={setPoint}>
    <SheetTrigger render={<Button variant="outline">Open actions</Button>} />
    <SheetContent><SheetHandle expanded={point === 1} onExpandedChange={(expanded) => setPoint(expanded ? 1 : 0.5)} />
      <SheetHeader><SheetTitle>Actions</SheetTitle></SheetHeader>
      <SheetBody>Release actions.</SheetBody>
    </SheetContent>
  </Sheet>;
}

// SheetContent includes a portal and overlay. Use the lower-level exports only
// when composing your own native viewport and popup.
export function CustomComposition() {
  return <Sheet>
    <SheetTrigger render={<Button variant="outline">Open custom panel</Button>} />
    <SheetPortal><SheetOverlay />
      <Drawer.Viewport className="pointer-events-none fixed inset-0 z-50">
        <Drawer.Popup className={sheetVariants({ size: "default", className: "pointer-events-auto" })}>
          <SheetHeader><SheetTitle>Custom panel</SheetTitle></SheetHeader>
          <SheetBody>Custom composition.</SheetBody>
          <SheetFooter><SheetClose render={<Button variant="outline">Close</Button>} /></SheetFooter>
        </Drawer.Popup>
      </Drawer.Viewport>
    </SheetPortal>
  </Sheet>;
}`;

export default function SheetPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Sheet"
        description="Contextual panels for reviewing and editing. Native Drawer gestures and focus, with a responsive Kira composition."
        version="v2.1.0"
      />
      <FeatureGrid
        features={sheetPageFeatureGridFeatures}
        description="Capabilities built into Kira Kit."
      />
      <DemoTabs defaultValue="basic" tabs={sheetPageDemoTabs} />
      <KeyboardShortcuts
        shortcuts={sheetPageKeyboardShortcuts}
        description="Keyboard navigation, detent activation, and dismissal bindings."
      />
      <UsageBlock
        code={sheetUsageCode}
        title="Usage"
        description="Compose Sheet primitives or use KiraSheet for responsive panels."
        notes={sheetPageUsageNotes}
      />
      <APIReference
        sections={sheetPageAPISections}
        description="Props, types, and defaults for each exported part."
      />
      <Changelog
        entries={sheetPageChangelogEntries}
        title="Changelog"
        description="Version history for this component."
      />
    </ComponentPage>
  );
}

const sheetPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (isActive) => (
      <DemoWrapper
        title="Review a release"
        description="A native composed Sheet with a working review action."
        code={basicDemoCode}
      >
        <BasicDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "edges",
    label: "Edges",
    group: "Core",
    demo: (isActive) => (
      <DemoWrapper
        title="Choose the edge"
        description="Four native swipe directions for secondary content."
        code={edgesDemoCode}
      >
        <EdgesDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (isActive) => (
      <DemoWrapper
        title="Panel widths"
        description="The five existing sizes share the Drawer variants."
        code={sizesDemoCode}
      >
        <SizesDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "history",
    label: "Scrolling",
    group: "Core",
    demo: (isActive) => (
      <DemoWrapper
        title="Reach the final action"
        description="Long history scrolls in the body while the footer stays reachable."
        code={historyDemoCode}
      >
        <HistoryDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraSheet",
    demo: (isActive) => (
      <DemoWrapper
        title="Edit without losing context"
        description="Desktop side panel, mobile bottom sheet, validation, and explicit save or discard."
        code={kiraDemoCode}
      >
        <KiraDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "drafts",
    label: "Drafts",
    group: "KiraSheet",
    demo: (isActive) => (
      <DemoWrapper
        title="Keep a draft mounted"
        description="Edit the field, close the Sheet, and reopen it. No save request is made."
        code={draftsDemoCode}
      >
        <DraftsDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "KiraSheet",
    demo: (isActive) => (
      <DemoWrapper
        title="Deferred details and recovery"
        description="Use the footer controls to drive a local loading fixture and recover from an error."
        code={statesDemoCode}
      >
        <StatesDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "detents",
    label: "Detents",
    group: "Behavior",
    demo: (isActive) => (
      <DemoWrapper
        title="Bottom-sheet snap points"
        description="Swipe or use the named handle to switch between half and full height."
        code={detentsDemoCode}
      >
        <DetentsDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "inspector",
    label: "Inspector",
    group: "Behavior",
    demo: (isActive) => (
      <DemoWrapper
        title="Keep the list available"
        description="A non-modal details panel leaves the page controls usable."
        code={inspectorDemoCode}
      >
        <InspectorDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (isActive) => (
      <DemoWrapper
        title="Stress Cases"
        description="Long unbroken titles, empty content, disabled triggers/actions, and narrow max-w-xs containers."
        code={stressDemoCode}
      >
        <StressDemo isActive={isActive} />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const sheetPageAPISections = [
  {
    title: "Sheet",
    props: [
      {
        prop: "side",
        type: '"left" | "right" | "top" | "bottom"',
        default: '"right"',
        description: "Edge and swipe direction belong to the root.",
      },
      {
        prop: "open / defaultOpen",
        type: "boolean",
        default: "false",
        description: "Controlled or initial open state.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, details: Drawer.Root.ChangeEventDetails) => void",
        default: "-",
        description:
          "Native close reasons and cancel(). Controlled callers respect details.isCanceled.",
      },
      {
        prop: "onOpenChangeComplete",
        type: "(open: boolean) => void",
        default: "-",
        description: "Native post-transition notification.",
      },
      {
        prop: "modal",
        type: 'boolean | "trap-focus"',
        default: "true",
        description:
          "Native modality. Non-modal Kira Drawer defaults pointer dismissal off.",
      },
      {
        prop: "disablePointerDismissal",
        type: "boolean",
        default: "-",
        description:
          "Prevents outside press and non-modal focus-out dismissal.",
      },
      {
        prop: "snapPoints / snapPoint / defaultSnapPoint",
        type: "Array<number | string> / number | string | null",
        default: "-",
        description: "Snap-point props are accepted only with side bottom.",
      },
      {
        prop: "onSnapPointChange",
        type: "(point: number | string | null, details: Drawer.Root.SnapPointChangeEventDetails) => void",
        default: "-",
        description: "Native active-detent callback.",
      },
      {
        prop: "snapToSequentialPoints",
        type: "boolean",
        default: "false",
        description: "Disables velocity-based snap skipping.",
      },
      {
        prop: "handle / actionsRef",
        type: "Drawer.Handle / React.RefObject<Drawer.Root.Actions | null>",
        default: "-",
        description: "Native detached-trigger and imperative APIs.",
      },
      {
        prop: "triggerId / defaultTriggerId",
        type: "string | null",
        default: "-",
        description: "Native trigger association.",
      },
      {
        prop: "children",
        type: "React.ReactNode | ((payload) => React.ReactNode)",
        default: "-",
        description: "Native root composition.",
      },
    ],
  },
  {
    title: "SheetTrigger",
    props: [
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Native button disability.",
      },
      {
        prop: "payload",
        type: "unknown",
        default: "-",
        description: "Payload associated with a native detached trigger.",
      },
    ],
  },
  {
    title: "SheetPortal",
    props: [
      {
        prop: "container",
        type: "HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null>",
        default: "-",
        description: "Native portal destination.",
      },
      {
        prop: "keepMounted",
        type: "boolean",
        default: "false",
        description:
          "Retains content on close; native hidden/inert behavior applies.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Portaled parts.",
      },
    ],
  },
  {
    title: "SheetOverlay",
    props: [
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
    ],
  },
  {
    title: "SheetContent",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description: "Shared Drawer size variant.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Visible native close control.",
      },
      {
        prop: "portalProps",
        type: "Omit<Drawer.Portal.Props, 'children'>",
        default: "-",
        description: "Configure the included portal.",
      },
      {
        prop: "overlayProps",
        type: "Drawer.Backdrop.Props",
        default: "-",
        description: "Configure the included modal backdrop.",
      },
      {
        prop: "initialFocus / finalFocus",
        type: "Drawer.Popup.Props['initialFocus'] / Drawer.Popup.Props['finalFocus']",
        default: "-",
        description: "Native focus target values or functions.",
      },
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
      {
        prop: "style",
        type: "React.CSSProperties | ((state) => React.CSSProperties)",
        default: "-",
        description: "Styles belong to the outer drawer-popup.",
      },
    ],
  },
  {
    title: "SheetHeader",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional native element classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Part content.",
      },
    ],
  },
  {
    title: "SheetTitle",
    props: [
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
    ],
  },
  {
    title: "SheetDescription",
    props: [
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
    ],
  },
  {
    title: "SheetBody",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional native element classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Part content.",
      },
    ],
  },
  {
    title: "SheetFooter",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional native element classes.",
      },
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Part content.",
      },
    ],
  },
  {
    title: "SheetClose",
    props: [
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Native close-button disability.",
      },
    ],
  },
  {
    title: "SheetHandle",
    props: [
      {
        prop: "expanded",
        type: "boolean",
        default: "-",
        description: "Current detent state.",
      },
      {
        prop: "onExpandedChange",
        type: "(expanded: boolean) => void",
        default: "-",
        description: "Map handle activation to a caller-owned snap point.",
      },
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description: "Native Base UI composition.",
      },
      {
        prop: "className",
        type: "string | ((state) => string | undefined)",
        default: "-",
        description: "Classes on the native part.",
      },
      {
        prop: "ref",
        type: "React.Ref<HTMLElement>",
        default: "-",
        description: "The native part element.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Native button disability.",
      },
    ],
  },
  {
    title: "KiraSheet",
    props: [
      {
        prop: "trigger",
        type: "React.ReactElement",
        default: "-",
        description:
          "The shared native trigger is rendered through this element.",
      },
      {
        prop: "title / description",
        type: "React.ReactNode",
        default: "-",
        description: "Accessible header content.",
      },
      {
        prop: "children / footer",
        type: "React.ReactNode",
        default: "-",
        description: "Body content and reachable footer actions.",
      },
      {
        prop: "responsive",
        type: "boolean",
        default: "true",
        description: "Switch edges below the existing 640px breakpoint.",
      },
      {
        prop: "side / mobileSide",
        type: '"left" | "right" | "top" | "bottom"',
        default: '"right" / "bottom"',
        description: "Desktop and mobile edges.",
      },
      {
        prop: "rootProps",
        type: "KiraSheetRootProps",
        default: "-",
        description:
          "Native root options excluding children, side and snap-point props. Use composed Sheet for detents.",
      },
      {
        prop: "contentProps",
        type: "Omit<SheetContentProps, 'children'>",
        default: "-",
        description: "Native popup, portal and backdrop configuration.",
      },
      {
        prop: "closeDisabledReason",
        type: "string",
        default: "-",
        description: "Visible reason that cancels native close requests.",
      },
      {
        prop: "loading / loadingLabel / loadingContent",
        type: "boolean / string / React.ReactNode",
        default: 'false / "Loading details…"',
        description:
          "Caller-owned loading. Children stay mounted. Match custom skeleton dimensions to content.",
      },
      {
        prop: "error / onRetry",
        type: "React.ReactNode / (() => void)",
        default: "-",
        description: "Visible recovery message and optional retry action.",
      },
    ],
  },
  {
    title: "sheetVariants",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg" | "xl" | "full"',
        default: '"default"',
        description:
          "Shared Drawer popup classes, including native motion and direction attributes.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional popup classes.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const sheetPageFeatureGridFeatures = [
  {
    title: "Context stays available",
    description:
      "Modal editing and a non-modal inspector each have a live example.",
    icon: <IconLayoutSidebar className="size-4" aria-hidden="true" />,
  },
  {
    title: "Mobile bottom sheet",
    description:
      "Responsive edges and native snap points with a keyboard handle.",
    icon: <IconDeviceMobile className="size-4" aria-hidden="true" />,
  },
  {
    title: "Drafts and recovery",
    description:
      "Keep draft content mounted, guard dismissal, and recover deferred details.",
    icon: <IconHistory className="size-4" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const sheetPageKeyboardShortcuts = [
  {
    keys: "Enter / Space",
    description:
      "Open or close using native Base UI buttons. The detent handle switches half/full height.",
  },
  {
    keys: "Tab / Shift + Tab",
    description:
      "Walk modal controls and contain focus, inherited from Base UI. Non-modal inspectors leave the page usable.",
  },
  {
    keys: "Escape",
    description:
      "Request close and return focus, inherited from Base UI. Kira's visible closeDisabledReason can cancel the request.",
  },
  {
    keys: "Enter in the form",
    description:
      "Validate and save the local release. Save or explicitly discard a dirty draft before closing.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const sheetPageUsageNotes = [
  {
    label: "KiraSheet",
    body: "Use KiraSheet for responsive desktop-to-mobile panels with built-in loading, error recovery, and dismissal guards.",
  },
  {
    label: "Snap points",
    body: "Use composed Sheet with side='bottom' and SheetHandle when you need bottom-sheet detents.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const sheetPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "13 November 2026",
    changes: [
      {
        type: "added",
        title: "Responsive KiraSheet",
        description:
          "Desktop/mobile edges, native dismissal guard, retained loading content and recovery. Audited against Base UI 1.9.0; research cutoff October 31, 2026.",
      },
      {
        type: "added",
        title: "SheetHandle and native types",
        description:
          "Typed SheetProps, SheetContentProps, SheetHandleProps and SheetSide are exported; existing aliases and Drawer slots remain compatible.",
      },
      {
        type: "fixed",
        title: "Working release workflows",
        description:
          "Replaced decorative fixtures and inert Save actions with labelled fields, local save/discard, native detents, retained drafts and a states tab.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "4 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Native Drawer migration",
        description:
          "Move side from SheetContent to Sheet; sheetVariants no longer accepts side. The outer popup is drawer-popup and receives className/ref; drawer-content identifies the inner wrapper. Base UI 1.9.0.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function KiraControlsSection({
  formId,
  draft,
  setError,
  setRecord,
  setDraft,
  setOpen,
  error,
}: {
  formId: string;
  draft: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setRecord: React.Dispatch<React.SetStateAction<string>>;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
}) {
  return (
    <form
      id={formId}
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();

        if (!draft.trim()) {
          setError("Enter a release name before saving.");
          const field = event.currentTarget.elements.namedItem("release");

          if (field instanceof HTMLElement) field.focus();

          return;
        }

        setRecord(draft.trim());
        setDraft(draft.trim());
        setError(null);
        setOpen(false);
      }}
    >
      <label htmlFor={`${formId}-name`} className="text-sm font-medium">
        Release name
      </label>
      <Input
        id={`${formId}-name`}
        name="release"
        value={draft}
        required
        aria-invalid={error != null}
        aria-describedby={error ? `${formId}-error` : undefined}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
      />
    </form>
  );
}
