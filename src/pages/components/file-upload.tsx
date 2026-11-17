import * as React from "react";
import {
  IconCheck,
  IconEye,
  IconPhoto,
  IconUpload,
  IconVideo,
  IconClipboard,
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
  Section,
} from "@/components/docs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileUpload,
  FilePreview,
  KiraFileUpload,
  type FileRejection,
  type UploadedFile,
} from "@/components/ui/file-upload";

/* ------------------------------------------------------------------ */
/* Shared demo fixtures                                                */
/* ------------------------------------------------------------------ */

function makeFile(name: string, size: number, type: string): File {
  const body = new Uint8Array(size);

  return new File([body], name, { type });
}

/* ------------------------------------------------------------------ */
/* Local demonstration harness — files are NOT sent to a server.       */
/* ------------------------------------------------------------------ */

/**
 * Manual settlement harness for the per-file transport. The buttons drive
 * the callback lifecycle so progress/finishing/success/error/cancel states
 * are visible without network traffic. This is a demonstration harness,
 * not a production transport.
 */
function PerFileHarness({
  children,
}: {
  children: (harness: {
    uploadFile: (
      file: File,
      context: {
        signal: AbortSignal;
        onProgress: (progress: number) => void;
      },
    ) => Promise<void>;
  }) => React.ReactNode;
}) {
  const pendingRef = React.useRef(
    new Map<
      string,
      {
        settle: (outcome: { ok: boolean; error?: Error }) => void;
        reportProgress: (progress: number) => void;
      }
    >(),
  );

  const [pendingCount, setPendingCount] = React.useState(0);

  const uploadFile = React.useCallback(
    async (
      file: File,
      context: {
        signal: AbortSignal;
        onProgress: (progress: number) => void;
      },
    ) => {
      await new Promise<void>((resolve, reject) => {
        const onAbort = () => {
          reject(new DOMException("Aborted", "AbortError"));
        };

        if (context.signal.aborted) {
          onAbort();

          return;
        }

        context.signal.addEventListener("abort", onAbort);
        pendingRef.current.set(file.name, {
          settle: (outcome) => {
            context.signal.removeEventListener("abort", onAbort);

            if (outcome.ok) {
              resolve();

              return;
            }

            reject(outcome.error ?? new Error("Upload failed"));
          },
          reportProgress: context.onProgress,
        });
        setPendingCount(pendingRef.current.size);
      });
    },
    [],
  );

  const settleAll = (ok: boolean, error?: Error) => {
    pendingRef.current.forEach((pending) => {
      pending.settle({ ok, error });
    });
    pendingRef.current.clear();
    setPendingCount(0);
  };

  const reportAll = (progress: number) => {
    pendingRef.current.forEach((pending) => {
      pending.reportProgress(progress);
    });
  };

  return (
    <div className="space-y-3">
      {/* oxlint-disable-next-line react/refs -- render-prop invocation; the harness stores settlement callbacks in a ref intentionally */}
      {children({ uploadFile })}
      <PerFileHarnessLocalDemonstrationFilesAreNotSection
        pendingCount={pendingCount}
        reportAll={reportAll}
        settleAll={settleAll}
      />
    </div>
  );
}

/**
 * Batch settlement harness: Resolve/Reject only — the batch callback cannot
 * supply progress or cancellation, so the harness does not fake them.
 */
function BatchHarness({
  children,
}: {
  children: (props: {
    onUpload: (files: File[]) => Promise<void>;
  }) => React.ReactNode;
}) {
  const pendingRef = React.useRef<(() => void) | null>(null);
  const rejectRef = React.useRef<((error: Error) => void) | null>(null);
  const [pending, setPending] = React.useState(false);

  const onUpload = React.useCallback(async (_files: File[]) => {
    setPending(true);
    await new Promise<void>((resolve, reject) => {
      pendingRef.current = resolve;
      rejectRef.current = reject;
    });
    setPending(false);
  }, []);

  return (
    <div className="space-y-3">
      {/* oxlint-disable-next-line react/refs -- render-prop invocation; the harness stores settlement callbacks in a ref intentionally */}
      {children({ onUpload })}
      <div className="rounded-md border border-dashed p-3">
        <p className="text-xs font-medium text-muted-foreground">
          Local demonstration — files are not sent to a server. Batch settlement
          is Resolve/Reject only (the callback contract has no per-file
          percentage or Cancel).
        </p>
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!pending}
            onClick={() => {
              pendingRef.current?.();
            }}
          >
            Resolve batch
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!pending}
            onClick={() => {
              rejectRef.current?.(
                new Error("Connection interrupted. Try again."),
              );
            }}
          >
            Reject batch
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab demos                                                           */
/* ------------------------------------------------------------------ */

function BasicTabDemo() {
  const [queue, setQueue] = React.useState<UploadedFile[]>([]);

  return (
    <div className="space-y-3">
      <FileUpload
        multiple
        maxSize={2 * 1024 * 1024}
        onFilesChange={setQueue}
        name="demo-basic"
      />
      <p className="text-xs text-muted-foreground">
        {queue.length === 0
          ? "Queue is empty. Pick or drop files to populate it."
          : `${queue.length} file(s) queued.`}
      </p>
    </div>
  );
}

const basicTabCode = `import { FileUpload } from "@/components/ui/file-upload"

export function BasicDemo() {
  return (
    <FileUpload
      multiple
      maxSize={2 * 1024 * 1024}
      onFilesChange={(files) => console.log(files)}
      name="demo-basic"
    />
  )
}`;

function ValidationTabDemo() {
  const [rejected, setRejected] = React.useState<FileRejection[]>([]);

  return (
    <div className="space-y-3">
      <FileUpload
        accept=".pdf,image/*"
        multiple
        maxFiles={2}
        maxSize={64 * 1024}
        onFilesRejected={setRejected}
        name="demo-validation"
      />
      <p className="text-xs text-muted-foreground">
        accept=&quot;.pdf,image/*&quot;, maxFiles=2, maxSize=64KB. Try a
        duplicate, an oversized image, a text file, and a third valid file.
      </p>
      {rejected.length > 0 && (
        <p className="text-xs text-destructive">
          onFilesRejected received {rejected.length} entr
          {rejected.length === 1 ? "y" : "ies"}.
        </p>
      )}
    </div>
  );
}

const validationTabCode = `import { FileUpload } from "@/components/ui/file-upload"

export function ValidationDemo() {
  return (
    <FileUpload
      accept=".pdf,image/*"
      multiple
      maxFiles={2}
      maxSize={64 * 1024}
      onFilesRejected={(rejections) => console.log(rejections)}
      name="demo-validation"
    />
  )
}`;

function AttachmentsTabDemo() {
  return (
    <PerFileHarness>
      {({ uploadFile }) => (
        <div className="space-y-3">
          <FileUpload
            multiple
            uploadFile={uploadFile}
            name="demo-attachments"
          />
          <p className="text-xs text-muted-foreground">
            Pick two or more files, press Upload files, then drive the buttons
            in the harness: 35% shows progress, 100% shows &quot;Finishing&quot;
            &mdash; success appears only when the promise resolves.
          </p>
        </div>
      )}
    </PerFileHarness>
  );
}

const attachmentsTabCode = `import { FileUpload, type FileUploadHandler } from "@/components/ui/file-upload"

// Application-supplied transport. The component owns pending/progress/
// success/error/cancel/retry UI around whatever this handler does.
const uploadFile: FileUploadHandler = async (file, context) => {
  const body = new FormData()
  body.append("file", file)

  const xhr = new XMLHttpRequest()
  xhr.open("POST", "/api/attachments")
  context.signal.addEventListener("abort", () => xhr.abort())

  const finished = new Promise<void>((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(\`Upload failed (\${xhr.status}). Try again.\`))
      }
    }
    xhr.onerror = () => reject(new Error("Network error. Try again."))
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"))
  })

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      context.onProgress((event.loaded / event.total) * 100)
    }
  }

  xhr.send(body)
  await finished
}

export function AttachmentsDemo() {
  return <FileUpload multiple uploadFile={uploadFile} name="attachments" />
}`;

function MediaTabDemo() {
  return (
    <FileUpload
      accept="image/*,video/*,audio/*"
      multiple
      maxSize={50 * 1024 * 1024}
      name="demo-media"
    />
  );
}

const mediaTabCode = `import { FileUpload } from "@/components/ui/file-upload"

export function MediaDemo() {
  return (
    <FileUpload
      accept="image/*,video/*,audio/*"
      multiple
      maxSize={50 * 1024 * 1024}
      name="demo-media"
    />
  )
}`;

function PasteTabDemo() {
  return (
    <div className="space-y-3">
      <FileUpload paste multiple name="demo-paste" />
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <IconClipboard className="h-3.5 w-3.5" aria-hidden="true" />
        Click the dropzone, then press Ctrl+V with an image copied to the
        clipboard. Pasting inside a text field is left untouched.
      </p>
    </div>
  );
}

const pasteTabCode = `import { FileUpload } from "@/components/ui/file-upload"

export function PasteDemo() {
  return <FileUpload paste multiple name="demo-paste" />
}`;

function ControlledTabDemo() {
  const [value, setValue] = React.useState<File[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue([])}
        >
          Clear from parent
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formRef.current?.requestSubmit()}
        >
          Submit FormData
        </Button>
        <p className="text-xs text-muted-foreground self-center">
          {value.length} file(s) held by the parent.
        </p>
      </div>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          // The staging picker input is cleared after ingest; queue files are
          // appended explicitly under the same field name.
          formData.delete("demo-controlled");
          value.forEach((file) => formData.append("demo-controlled", file));

          const names = formData
            .getAll("demo-controlled")
            .filter((entry): entry is File => entry instanceof File)
            .map((file) => file.name);

          window.alert(
            names.length > 0
              ? `FormData entries: ${names.join(", ")}`
              : "FormData has no attachments.",
          );
        }}
      >
        <FileUpload
          value={value}
          onValueChange={setValue}
          multiple
          name="demo-controlled"
        />
        <Button
          type="reset"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => setValue([])}
        >
          Reset form (restores defaults; parent clears)
        </Button>
      </form>
    </div>
  );
}

const controlledTabCode = `import * as React from "react"
import { FileUpload } from "@/components/ui/file-upload"

export function ControlledDemo() {
  const [value, setValue] = React.useState<File[]>([])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // The staging picker input is cleared after ingest; append the queue.
    formData.delete("attachments")
    value.forEach((file) => formData.append("attachments", file))
    // ...POST formData to your endpoint
  }

  return (
    <form onSubmit={handleSubmit}>
      <FileUpload
        value={value}
        onValueChange={setValue}
        multiple
        name="attachments"
      />
      <button type="submit">Submit</button>
      <button type="reset" onClick={() => setValue([])}>Reset</button>
    </form>
  )
}`;

function BatchTabDemo() {
  const [lastCount, setLastCount] = React.useState(0);

  return (
    <BatchHarness>
      {({ onUpload }) => (
        <div className="space-y-3">
          <FileUpload
            multiple
            onUpload={async (files) => {
              setLastCount(files.length);
              await onUpload(files);
            }}
            name="demo-batch"
          />
          <p className="text-xs text-muted-foreground">
            Batch callback receives the accepted File[] snapshot. There is no
            per-file progress or Cancel; Reset/unmount invalidates the UI
            settlement but cannot cancel your network request.
            {lastCount > 0 ? ` Last batch: ${lastCount} file(s).` : ""}
          </p>
        </div>
      )}
    </BatchHarness>
  );
}

const batchTabCode = `import { FileUpload } from "@/components/ui/file-upload"

export function BatchDemo() {
  return (
    <FileUpload
      multiple
      onUpload={async (files) => {
        const body = new FormData()
        body.delete("attachments")
        files.forEach((file) => body.append("attachments", file))
        const response = await fetch("/api/attachments", {
          method: "POST",
          body,
        })
        if (!response.ok) {
          throw new Error(\`Upload failed (\${response.status}). Try again.\`)
        }
      }}
      name="attachments"
    />
  )
}`;

function KiraTabDemo() {
  return (
    <KiraFileUpload
      label="Attachments"
      description="PDF or image files up to 10 MB each."
      accept=".pdf,image/*"
      multiple
      name="demo-kira"
    />
  );
}

const kiraTabCode = `import { KiraFileUpload } from "@/components/ui/file-upload"

export function KiraDemo() {
  return (
    <KiraFileUpload
      label="Attachments"
      description="PDF or image files up to 10 MB each."
      accept=".pdf,image/*"
      multiple
      name="attachments"
    />
  )
}`;

function StatesTabDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label>Sizes</Label>
        <FileUpload size="sm" name="demo-size-sm" className="max-w-md" />
        <FileUpload
          size="default"
          name="demo-size-default"
          className="max-w-md"
        />
        <FileUpload size="lg" name="demo-size-lg" className="max-w-md" />
      </div>
      <div className="space-y-3">
        <Label>Disabled with reason</Label>
        <FileUpload disabled name="demo-disabled" id="demo-disabled" />
        <p className="text-xs text-muted-foreground">
          Disabled without a caller description shows &quot;Attachments are
          disabled.&quot; helper text via aria-describedby.
        </p>
      </div>
      <div className="space-y-3">
        <Label>Selection-only (no transport)</Label>
        <FileUpload multiple name="demo-selection" />
        <p className="text-xs text-muted-foreground">
          No onUpload/uploadFile: only selection UI, no upload controls or
          success claims.
        </p>
      </div>
    </div>
  );
}

const statesTabCode = `import { FileUpload } from "@/components/ui/file-upload"

export function StatesDemo() {
  return (
    <div className="space-y-8">
      <FileUpload size="sm" name="small" />
      <FileUpload size="lg" name="large" />
      <FileUpload disabled name="blocked" />
      {/* No callbacks: selection-only mode */}
      <FileUpload multiple name="selection" />
    </div>
  )
}`;

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
function ShowcaseTabDemo() {
  const standalone: UploadedFile = {
    id: "showcase-1",
    file: makeFile(
      "quarterly-report-with-a-very-long-filename.pdf",
      245_760,
      "application/pdf",
    ),
    status: "idle",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Long filenames + narrow 320px container</Label>
        <div className="w-[320px]">
          <FileUpload
            multiple
            accept="image/*,.pdf"
            defaultValue={[
              makeFile(
                "scan-of-receipt-october-2026-with-long-name.png",
                184_320,
                "image/png",
              ),
            ]}
            name="demo-showcase"
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label>Standalone FilePreview (exported contract)</Label>
        <div className="w-[320px]">
          <FilePreview
            file={standalone}
            onRemove={() => {}}
            onPreview={() => {}}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          FilePreview works without FileUpload: it owns its thumbnail URL and
          needs only file / onRemove / optional onPreview.
        </p>
      </div>
      <div className="space-y-3">
        <Label>Media kinds</Label>
        <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
          <FilePreview
            file={{
              id: "media-image",
              file: makeFile("photo.png", 20_480, "image/png"),
              status: "idle",
            }}
            onRemove={() => {}}
          />
          <FilePreview
            file={{
              id: "media-video",
              file: makeFile("clip.mp4", 5_242_880, "video/mp4"),
              status: "uploading",
              progress: 35,
            }}
            onRemove={() => {}}
          />
          <FilePreview
            file={{
              id: "media-audio",
              file: makeFile("voice-memo.m4a", 8192, "audio/mp4"),
              status: "success",
            }}
            onRemove={() => {}}
          />
          <FilePreview
            file={{
              id: "media-error",
              file: makeFile("broken.jpg", 4096, "image/jpeg"),
              status: "error",
              error: "Upload failed. Try again.",
            }}
            onRemove={() => {}}
          />
          <FilePreview
            file={{
              id: "media-canceled",
              file: makeFile(
                "draft.docx",
                12_288,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ),
              status: "canceled",
            }}
            onRemove={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

const showcaseTabCode = `import { FilePreview, type UploadedFile } from "@/components/ui/file-upload"

const file: UploadedFile = {
  id: "att-1",
  file: new File([new Uint8Array(1024)], "report.pdf", {
    type: "application/pdf",
  }),
  status: "idle",
}

export function ShowcaseDemo() {
  // FilePreview is standalone: it works without FileUpload context.
  return <FilePreview file={file} onRemove={(id) => console.log(id)} />
}`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const features = [
  {
    title: "One admission pipeline",
    description:
      "Picker, drop, and paste share the same accept/size/duplicate/capacity validation with named rejections.",
    icon: <IconUpload className="h-5 w-5" />,
  },
  {
    title: "Honest progress",
    description:
      "Per-file transport shows real reported progress; a 100% report shows Finishing until the promise settles.",
    icon: <IconEye className="h-5 w-5" />,
  },
  {
    title: "Media previews",
    description:
      "Images, video, and audio get object-URL previews with a dialog that owns zoom, rotation, and playback.",
    icon: <IconPhoto className="h-5 w-5" />,
  },
  {
    title: "Controlled or uncontrolled",
    description:
      "Pass value to own the File[] selection; form reset restores defaults through one pipeline.",
    icon: <IconCheck className="h-5 w-5" />,
  },
  {
    title: "Paste intake",
    description:
      "Opt-in clipboard file intake while focus is inside the uploader; text paste is never stolen.",
    icon: <IconClipboard className="h-5 w-5" />,
  },
  {
    title: "Two exclusive transports",
    description:
      "Batch onUpload(files) keeps the legacy contract; per-file uploadFile(file, context) adds progress, cancel, and retry.",
    icon: <IconVideo className="h-5 w-5" />,
  },
];

const shortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move through Choose files, item preview, remove, and upload controls.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate the focused control (open picker, preview, remove, upload).",
  },
  {
    keys: "ArrowLeft / ArrowRight",
    description: "Cycle previewed files with wraparound (preview dialog only).",
  },
  {
    keys: "+ / -",
    description:
      "Zoom image 0.5x to 3x in 0.25 steps (preview dialog, image only).",
  },
  {
    keys: "R",
    description:
      "Rotate the previewed image 90 degrees (preview dialog, image only).",
  },
  {
    keys: "Escape",
    description:
      "Close the preview dialog (owned by Base UI); focus returns to the opener.",
  },
  {
    keys: "Ctrl+V",
    description:
      "Paste clipboard files while focus is inside the uploader (paste prop).",
  },
];

const usageCode = `import { FileUpload } from "@/components/ui/file-upload"

export function Example() {
  return <FileUpload multiple name="attachments" />
}`;

const apiSections = [
  {
    title: "FileUpload",
    props: [
      {
        prop: "accept",
        type: "string",
        default: "-",
        description:
          "Comma-separated extensions, MIME types, or MIME groups. UX filter only, not a security guarantee.",
      },
      {
        prop: "multiple",
        type: "boolean",
        default: "false",
        description:
          "Append mode. false replaces the single selection; the first valid candidate wins.",
      },
      {
        prop: "maxSize",
        type: "number",
        default: "10485760",
        description:
          "Per-file size limit in bytes. Equal-to-limit and zero-byte files are accepted. Negative/nonfinite falls back to the default.",
      },
      {
        prop: "maxFiles",
        type: "number",
        default: "10",
        description:
          "Queue capacity. <= 0 means zero capacity; fractional values are floored. Single mode caps at 1.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description:
          "Disables ingestion/removal/upload. Active uploads are aborted and left in canceled state for retry after re-enable.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Dropzone padding scale (p-4/p-6/p-8).",
      },
      {
        prop: "id",
        type: "string",
        default: "generated",
        description: "Native picker input id (used by KiraFileUpload label).",
      },
      {
        prop: "name",
        type: "string",
        default: "-",
        description:
          "Picker input name. Append accepted File[] to FormData yourself; the cleared staging input does not submit the queue.",
      },
      {
        prop: "capture",
        type: '"user" | "environment"',
        default: "-",
        description:
          "Native capture hint forwarded to the input; desktop browsers ignore it.",
      },
      {
        prop: "paste",
        type: "boolean",
        default: "false",
        description:
          "Ingest clipboardData.files on paste while focus is inside the uploader and the target is not editable.",
      },
      {
        prop: "enablePreview",
        type: "boolean",
        default: "true",
        description: "Show per-item preview triggers and the preview dialog.",
      },
      {
        prop: "onFilesChange",
        type: "(files: UploadedFile[]) => void",
        default: "-",
        description:
          "Selection snapshot callback. Fires on selection changes only, never on progress/status updates.",
      },
      {
        prop: "onFilesRejected",
        type: "(rejections: FileRejection[]) => void",
        default: "-",
        description:
          "Called once per nonempty rejected batch with code and message per file.",
      },
      {
        prop: "aria-label / aria-labelledby / aria-describedby / aria-invalid",
        type: "string / boolean",
        default: "-",
        description: "Applied to the dropzone region.",
      },
    ],
  },
  {
    title: "Transport (exclusive modes)",
    props: [
      {
        prop: "uploadFile",
        type: "(file: File, context: FileUploadContext) => Promise<void>",
        default: "-",
        description:
          "Per-file transport. Sequential scheduler: one active attempt, Upload files starts idle items in selection order, retry per error/canceled item.",
      },
      {
        prop: "onUpload",
        type: "(files: File[]) => Promise<void>",
        default: "-",
        description:
          "Batch transport (legacy contract). Snapshot on click, mutation lock while pending, whole-batch Retry upload. No per-file progress or Cancel.",
      },
      {
        prop: "onUpload + uploadFile",
        type: "-",
        default: "-",
        description:
          'Rejected. TypeScript union makes this a compile error; runtime callers get Error("FileUpload accepts either onUpload or uploadFile, not both.").',
      },
      {
        prop: "neither",
        type: "-",
        default: "-",
        description:
          "Selection-only mode: no upload controls or success claims.",
      },
      {
        prop: "FileUploadContext.signal",
        type: "AbortSignal",
        default: "-",
        description:
          "Aborted on cancel/remove/reset/disable. Honor it; the scheduler frees even if your adapter ignores it.",
      },
      {
        prop: "FileUploadContext.onProgress",
        type: "(progress: number) => void",
        default: "-",
        description:
          "Finite percentages clamped to 0..100; invalid numbers ignored. Report 100 before resolving to see the Finishing state.",
      },
    ],
  },
  {
    title: "Controlled selection",
    props: [
      {
        prop: "value",
        type: "File[]",
        default: "-",
        description:
          "Controlled File[] selection. Provide onValueChange; the parent must keep values conformant (limits constrain newly ingested files only).",
      },
      {
        prop: "defaultValue",
        type: "File[]",
        default: "[]",
        description:
          "Initial selection; also the reset target when the owning form resets.",
      },
      {
        prop: "onValueChange",
        type: "(files: File[]) => void",
        default: "-",
        description:
          "Fired once per user selection action. Not fired for progress/status updates or controlled prop reconciliation.",
      },
    ],
  },
  {
    title: "KiraFileUpload",
    props: [
      {
        prop: "label",
        type: "string",
        default: '"Attachments"',
        description: "Visible label bound to the picker input.",
      },
      {
        prop: "description",
        type: "string",
        default: "-",
        description: "Helper text merged into aria-describedby.",
      },
      {
        prop: "...props",
        type: "FileUploadProps",
        default: "-",
        description:
          "All FileUpload props pass through; no duplicated state machine.",
      },
    ],
  },
  {
    title: "FilePreview (standalone)",
    props: [
      {
        prop: "file",
        type: "UploadedFile",
        default: "-",
        description: "Entry to render; owns its thumbnail object URL.",
      },
      {
        prop: "onRemove",
        type: "(id: string) => void",
        default: "-",
        description:
          "Remove action; button always visible (hidden when disabled).",
      },
      {
        prop: "onPreview",
        type: "() => void",
        default: "-",
        description: "Renders the preview trigger overlay when provided.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Hides remove and preview actions; media stays readable.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Merged onto the card root.",
      },
    ],
  },
  {
    title: "Types",
    props: [
      {
        prop: "UploadedFile",
        type: "{ id: string; file: File; status: ...; progress?: number; error?: string }",
        default: "-",
        description:
          'status: "idle" | "uploading" | "success" | "error" | "canceled". preview was removed; URLs never escape their owner.',
      },
      {
        prop: "FileRejection",
        type: "{ file: File; code: FileRejectionCode; message: string }",
        default: "-",
        description:
          'code: "file-type" | "file-size" | "duplicate" | "file-count".',
      },
      {
        prop: "FileUploadContext",
        type: "{ signal: AbortSignal; onProgress: (progress: number) => void }",
        default: "-",
        description: "Handler context for uploadFile.",
      },
      {
        prop: "FileUploadHandler",
        type: "(file: File, context: FileUploadContext) => Promise<void>",
        default: "-",
        description: "Per-file transport signature.",
      },
    ],
  },
];

const changelogEntries = [
  {
    version: "2.1.0",
    date: "6 November 2026",
    changes: [
      {
        type: "added",
        title: "Per-file transport with honest progress",
        description:
          "New exclusive uploadFile(file, context) mode: sequential attempts, AbortSignal cancellation, explicit retry, reported progress clamped 0-100, Finishing state at a reported 100 until the promise resolves. Batch onUpload(files) contract is unchanged.",
      },
      {
        type: "added",
        title: "Controlled selection and form reset",
        description:
          "value/defaultValue/onValueChange manage the File[] selection; the nearest owning form reset restores defaults and aborts active work.",
      },
      {
        type: "added",
        title: "Paste intake and capture hint",
        description:
          "Opt-in paste (paste prop) ingests clipboard files through the shared pipeline; capture forwards the native hint.",
      },
      {
        type: "breaking",
        title: "Rejected files never enter the accepted snapshot",
        description:
          "Oversized files no longer appear in the queue with an error; they are reported through onFilesRejected. Duplicates and overflow are explicit rejections. Single mode really replaces the previous selection.",
      },
      {
        type: "breaking",
        title: "UploadedFile.preview removed; status added",
        description:
          'Ephemeral object URLs no longer escape the component. UploadedFile gains status: "idle" | "uploading" | "success" | "error" | "canceled".',
      },
      {
        type: "fixed",
        title: "Object URL lifetime and preview dialog",
        description:
          "URLs are created/revoked per File including unmount and StrictMode; the preview dialog is rebuilt on Base UI Dialog with focus trap/return and scoped shortcuts; audio files now get previews; failed media shows Preview unavailable with Download; autoplay removed.",
      },
      {
        type: "fixed",
        title: "Keyboard and pointer accessibility",
        description:
          "Dropzone is a noninteractive region with a real Choose files button; remove buttons are always visible; all shortcuts listed here are actually implemented.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "1 September 2026",
    changes: [
      {
        type: "added",
        title: "Initial FileUpload",
        description: "Picker, drop, preview grid, and batch onUpload callback.",
      },
    ],
  },
] satisfies React.ComponentProps<typeof Changelog>["entries"];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function FileUploadPage() {
  const tabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Drag, drop, pick"
          description="Selection queue with always-visible remove controls and per-file status."
          code={basicTabCode}
        >
          <BasicTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "validation",
      label: "Validation",
      demo: (
        <DemoWrapper
          title="Admission rules"
          description="Type, size, duplicate, and capacity rejections with dismissible messages and one polite status region."
          code={validationTabCode}
        >
          <ValidationTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "attachments",
      label: "Attachments",
      demo: (
        <DemoWrapper
          title="Per-file transport"
          description="uploadFile(file, context) with real AbortSignal handling and a manual settlement harness."
          code={attachmentsTabCode}
        >
          <AttachmentsTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "media",
      label: "Media",
      demo: (
        <DemoWrapper
          title="Image / video / audio previews"
          description="Thumbnails, dialog playback without autoplay, zoom/rotation for images, download for unsupported formats."
          code={mediaTabCode}
        >
          <MediaTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "paste",
      label: "Paste",
      demo: (
        <DemoWrapper
          title="Clipboard intake"
          description="Focused paste ingests clipboard files only; text paste elsewhere is untouched."
          code={pasteTabCode}
        >
          <PasteTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "controlled",
      label: "Controlled",
      demo: (
        <DemoWrapper
          title="Parent-owned selection"
          description="value/onValueChange with explicit FormData append and form reset restoring defaults."
          code={controlledTabCode}
        >
          <ControlledTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "batch",
      label: "Batch",
      demo: (
        <DemoWrapper
          title="Legacy batch callback"
          description="onUpload(files) snapshot with pending lock and Retry upload; no fake per-file progress."
          code={batchTabCode}
        >
          <BatchTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "kira",
      label: "Kira",
      demo: (
        <DemoWrapper
          title="Labelled composition"
          description="KiraFileUpload adds a visible label and description over the same implementation."
          code={kiraTabCode}
        >
          <KiraTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "states",
      label: "States",
      demo: (
        <DemoWrapper
          title="Sizes, disabled, selection-only"
          description="Token-scale sizes, disabled with helper text, and selection-only mode."
          code={statesTabCode}
        >
          <StatesTabDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "showcase",
      label: "Showcase",
      demo: (
        <DemoWrapper
          title="Stress cases"
          description="Long filenames, 320px container, standalone FilePreview, and every queue status."
          code={showcaseTabCode}
        >
          <ShowcaseTabDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="File Upload"
        version="v2.1.0"
        description='Reliable file attachments with one admission pipeline, honest upload outcomes, and media previews. Built on Base UI Dialog and Progress; the compact native picker remains <Input type="file" /> on the Input page.'
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={tabs} defaultValue="basic" />

      <Section
        title="Application transport example"
        description="Complete copy-paste XHR + FormData adapter with progress, abort, and response-status checking. Wire your own endpoint; the library ships no HTTP client."
      >
        <UsageBlock
          title="XMLHttpRequest adapter"
          description="Real upload transport with upload.onprogress, AbortSignal, and status check."
          code={`import { FileUpload, type FileUploadHandler } from "@/components/ui/file-upload"

const uploadFile: FileUploadHandler = async (file, context) => {
  const body = new FormData()
  body.append("file", file)

  const xhr = new XMLHttpRequest()
  xhr.open("POST", "https://your-endpoint.example/upload")
  context.signal.addEventListener("abort", () => xhr.abort())

  const finished = new Promise<void>((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(\`Upload failed (\${xhr.status}). Try again.\`))
    }
    xhr.onerror = () => reject(new Error("Network error. Try again."))
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"))
  })

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      context.onProgress((event.loaded / event.total) * 100)
    }
  }

  xhr.send(body)
  await finished
}

export function Uploader() {
  return <FileUpload multiple uploadFile={uploadFile} name="file" />
}`}
        />
      </Section>

      <KeyboardShortcuts
        shortcuts={shortcuts}
        description="Only Kira-implemented shortcuts are listed. OS file-dialog shortcuts belong to the browser, not this component."
      />

      <UsageBlock code={usageCode} description="Minimal selection-only usage" />

      <APIReference
        sections={apiSections}
        description="All exported components and types, including exclusive transport modes and controlled reset policy."
      />

      <Changelog
        entries={changelogEntries}
        description="Breaking changes and migration notes. Latest matches the PageHeader version."
      />
    </ComponentPage>
  );
}

function PerFileHarnessLocalDemonstrationFilesAreNotSection({
  pendingCount,
  reportAll,
  settleAll,
}: {
  pendingCount: number;
  reportAll: (progress: number) => void;
  settleAll: (ok: boolean, error?: Error) => void;
}) {
  return (
    <div className="rounded-md border border-dashed p-3">
      <p className="text-xs font-medium text-muted-foreground">
        Local demonstration — files are not sent to a server. Buttons below
        drive the callback lifecycle manually.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pendingCount === 0}
          onClick={() => reportAll(35)}
        >
          Report 35%
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pendingCount === 0}
          onClick={() => reportAll(100)}
        >
          Report 100%
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pendingCount === 0}
          onClick={() => settleAll(true)}
        >
          Resolve upload
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pendingCount === 0}
          onClick={() =>
            settleAll(false, new Error("Connection interrupted. Try again."))
          }
        >
          Reject upload
        </Button>
      </div>
    </div>
  );
}
