/* oxlint-disable react/only-export-components -- variants and types are part of the public API */
"use client";

import * as React from "react";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva } from "class-variance-authority";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import {
  IconUpload,
  IconX,
  IconFile,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconZoomIn,
  IconZoomOut,
  IconRotateClockwise,
  IconDownload,
  IconChevronLeft,
  IconChevronRight,
  IconAlertCircle,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* Public types                                                        */

export type FileUploadStatus =
  "idle" | "uploading" | "success" | "error" | "canceled";

export interface UploadedFile {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress?: number;
  error?: string;
}

export type FileRejectionCode =
  "file-type" | "file-size" | "duplicate" | "file-count";

export interface FileRejection {
  file: File;
  code: FileRejectionCode;
  message: string;
}

export interface FileUploadContext {
  signal: AbortSignal;
  onProgress: (progress: number) => void;
}

export type FileUploadHandler = (
  file: File,
  context: FileUploadContext,
) => Promise<void>;

interface FileUploadSelectionProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
  enablePreview?: boolean;
  id?: string;
  name?: string;
  capture?: "user" | "environment";
  size?: "sm" | "default" | "lg";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  paste?: boolean;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
}

export type FileUploadTransportProps =
  | { uploadFile: FileUploadHandler; onUpload?: never }
  | { onUpload: (files: File[]) => Promise<void>; uploadFile?: never }
  | { onUpload?: undefined; uploadFile?: undefined };

export type FileUploadProps = FileUploadSelectionProps &
  FileUploadTransportProps;

export interface FilePreviewProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onPreview?: () => void;
  disabled?: boolean;
  className?: string;
}

/* Variants                                                            */

const fileUploadVariants = cva(
  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition-[border-color,background-color] motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: { size: "default" },
  },
);

/* Shared private helpers                                              */

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;
const DEFAULT_MAX_FILES = 10;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    units.length - 1,
  );

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

function resolveLimits(maxSize?: number, maxFiles?: number) {
  const safeMaxSize =
    maxSize !== undefined && Number.isFinite(maxSize) && maxSize >= 0
      ? maxSize
      : DEFAULT_MAX_SIZE;

  const safeMaxFiles =
    maxFiles !== undefined && Number.isFinite(maxFiles) && maxFiles >= 0
      ? Math.floor(maxFiles)
      : DEFAULT_MAX_FILES;

  return { maxSize: safeMaxSize, maxFiles: safeMaxFiles };
}

function parseAcceptTokens(accept: string | undefined): string[] {
  if (!accept) return [];

  return accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
}

function matchesAcceptToken(file: File, token: string): boolean {
  if (token.startsWith(".")) {
    return file.name.toLowerCase().endsWith(token);
  }

  if (token.endsWith("/*")) {
    const group = token.slice(0, -2);

    return file.type !== "" && file.type.toLowerCase().startsWith(`${group}/`);
  }

  return file.type !== "" && file.type.toLowerCase() === token;
}

function matchesAccept(file: File, accept: string | undefined): boolean {
  const tokens = parseAcceptTokens(accept);

  if (tokens.length === 0) return true;

  return tokens.some((t) => matchesAcceptToken(file, t));
}

function sameFileIdentity(a: File, b: File): boolean {
  return (
    a.name === b.name &&
    a.size === b.size &&
    a.lastModified === b.lastModified &&
    a.type === b.type
  );
}

function mediaKindOf(file: File): "image" | "video" | "audio" | undefined {
  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) return "image";

  if (type.startsWith("video/")) return "video";

  if (type.startsWith("audio/")) return "audio";

  return undefined;
}

/** Creates and revokes one object URL bound to one File instance. */
function useFileObjectUrl(file: File | undefined): string | undefined {
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    if (!file) {
      // oxlint-disable-next-line react/set-state-in-effect -- clearing the URL state when the File goes away; external object-URL synchronization
      setUrl(undefined);

      return;
    }

    const created = URL.createObjectURL(file);
    // oxlint-disable-next-line react/set-state-in-effect -- external object-URL synchronization; the created URL cannot be derived during render
    setUrl(created);

    return () => {
      URL.revokeObjectURL(created);
    };
  }, [file]);

  return url;
}

/* Internal queue entry: carries the live attempt controller, never exported. */
interface InternalEntry extends UploadedFile {
  abortController?: AbortController;
}

/** Outcome of one admission pass over candidate files. */
interface AdmissionResult {
  accepted: File[];
  rejected: FileRejection[];
}

function previewFallbackIcon(kind: ReturnType<typeof mediaKindOf>) {
  if (kind === "audio") return IconMusic;

  if (kind === "image") return IconPhoto;

  if (kind === "video") return IconVideo;

  return IconFile;
}

function uploadStatusText(
  status: UploadedFile["status"],
  progress: number | undefined,
  error: string | undefined,
) {
  if (status === "uploading") {
    const label =
      progress === undefined ? "Uploading" : `${Math.round(progress)}%`;

    return { text: label, tone: "muted" as const };
  }

  if (status === "success")
    return { text: "Uploaded", tone: "success" as const };

  if (status === "canceled")
    return { text: "Canceled", tone: "muted" as const };

  if (status === "error") return { text: error ?? "", tone: "error" as const };

  return null;
}

function toPublicEntry(entry: InternalEntry): UploadedFile {
  const { abortController: _ignored, ...rest } = entry;
  void _ignored;

  return rest;
}

/* Download helper                                                     */

interface PendingDownload {
  url: string;
  anchor: HTMLAnchorElement;
}

function downloadFile(
  file: File,
  activeUrl: string | undefined,
): PendingDownload {
  const temporary = activeUrl === undefined;
  const url = temporary ? URL.createObjectURL(file) : activeUrl;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();

  return { url, anchor };
}

function cleanupDownload(download: PendingDownload) {
  download.anchor.remove();
  URL.revokeObjectURL(download.url);
}

/* Media preview body                                                  */

function MediaPreviewBody({
  file,
  objectUrl,
  zoom = 1,
  rotation = 0,
  onMediaError,
  mediaFailed,
  interactive,
}: {
  file: File;
  objectUrl: string | undefined;
  zoom?: number;
  rotation?: number;
  onMediaError: () => void;
  mediaFailed: boolean;
  interactive: boolean;
}) {
  const kind = mediaKindOf(file);

  if (mediaFailed || !objectUrl) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <IconAlertCircle
          className="h-10 w-10 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-sm font-medium">Preview unavailable</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)} &bull; {file.type || "Unknown type"}
        </p>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <img
        src={objectUrl}
        alt={file.name}
        onError={onMediaError}
        className="max-h-full max-w-full object-contain"
        style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
      />
    );
  }

  if (kind === "video") {
    return (
      // oxlint-disable-next-line jsx-a11y/media-has-caption -- local preview of a user-selected file has no caption source
      <video
        src={objectUrl}
        controls={interactive}
        preload="metadata"
        onError={onMediaError}
        className="max-h-full max-w-full"
      />
    );
  }

  if (kind === "audio") {
    return renderMediaPreviewBodySectionPart2({
      objectUrl,
      interactive,
      onMediaError,
      file,
    });
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <IconFile
        className="h-16 w-16 text-muted-foreground"
        aria-hidden="true"
      />
      <p className="text-sm font-medium">{file.name}</p>
      <p className="text-xs text-muted-foreground">
        {formatFileSize(file.size)} &bull; {file.type || "Unknown type"}
      </p>
    </div>
  );
}

/* Preview dialog                                                      */

function isEditableTarget(
  target: HTMLElement | null,
  event: React.KeyboardEvent,
) {
  return (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLMediaElement ||
    target?.isContentEditable
  );
}

function MarkdownFilePreview({ file }: { file: File }) {
  const [document, setDocument] = React.useState<{
    file: File;
    text?: string;
    error?: string;
  }>();

  const [source, setSource] = React.useState(false);

  React.useEffect(() => {
    let current = true;
    file.text().then(
      (text) => {
        if (current) setDocument({ file, text });
      },
      () => {
        if (current)
          setDocument({
            file,
            error:
              "Preview unavailable. Download the original file to read it.",
          });
      },
    );

    return () => {
      current = false;
    };
  }, [file]);

  if (document?.file !== file)
    return (
      <p className="p-6 text-sm text-muted-foreground">Reading Markdown…</p>
    );

  if (document.error)
    return <p className="p-6 text-sm text-destructive">{document.error}</p>;

  return renderFileUploadMarkdownPart1({ source, setSource, document });
}

function PreviewDialogContent(input0: {
  file: UploadedFile;
  files: UploadedFile[];
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  openerRef: React.RefObject<HTMLElement | null>;
}) {
  const state0 = useFilePreviewSetup(input0);
  const state1 = useFilePreviewState2(state0);
  const state2 = useFilePreviewActions(state1);

  return renderFilePreview(state2);
}

/* FilePreview (standalone renderer)                                   */

function FilePreview({
  file,
  onRemove,
  onPreview,
  disabled = false,
  className,
}: FilePreviewProps) {
  const kind = mediaKindOf(file.file);

  const thumbnailUrl = useFileObjectUrl(
    kind === "image" || kind === "video" ? file.file : undefined,
  );

  const [mediaFailed, setMediaFailed] = React.useState(false);

  const showThumbnail = thumbnailUrl !== undefined && !mediaFailed;
  const status = uploadStatusText(file.status, file.progress, file.error);

  const onMediaError = () => setMediaFailed(true);

  return (
    <div
      data-slot="file-upload-item"
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background transition-[border-color] motion-reduce:transition-none",
        file.status === "error" && "border-destructive",
        file.status === "success" && "border-success",
        className,
      )}
    >
      {renderFilePreviewSectionPart7({
        showThumbnail,
        kind,
        thumbnailUrl,
        file,
        onMediaError,
        mediaFailed,
        onPreview,
        disabled,
      })}{" "}
      {renderFilePreviewSectionPart8({ file, status })}
      {!disabled && (
        <button
          type="button"
          data-slot="file-upload-remove"
          onClick={() => onRemove(file.id)}
          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          aria-label={`Remove ${file.file.name}`}
        >
          {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
          <IconX className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* Per-file progress row                                               */

function FileUploadProgressRow({ entry }: { entry: UploadedFile }) {
  const reducedMotion = useReducedMotion();

  if (entry.status !== "uploading") return null;

  const progress = entry.progress;

  const reported = progress !== undefined && Number.isFinite(progress);

  // A reported 100 is not success: cap at 99 so it never announces completion early.
  const value = reported ? Math.min(Math.max(progress, 0), 99) : null;
  const finishing = reported && progress >= 100;

  return (
    <div data-slot="file-upload-progress" className="mt-2 space-y-1">
      {/* kira-kit-ignore spacing-scale: data-viz track hairline, not a control height */}
      <ProgressPrimitive.Root
        value={value}
        aria-label={`Uploading ${entry.file.name}`}
        aria-valuetext={finishing ? "Finishing upload" : undefined}
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
        data-slot="file-upload-progress-track"
      >
        <ProgressPrimitive.Indicator
          style={{
            width: "100%",
            transform: `scaleX(${(value ?? 0) / 100})`,
            transformOrigin: "left",
          }}
          className={cn(
            "h-full rounded-full bg-primary",
            !reducedMotion && "transition-transform duration-150",
          )}
          data-slot="file-upload-progress-indicator"
        />
      </ProgressPrimitive.Root>
      <p className="text-xs text-muted-foreground">
        {finishing ? "Finishing" : "Uploading"}
      </p>
    </div>
  );
}

/* FileUpload (root)                                                   */

function FileUploadImpl(input0: FileUploadProps) {
  const state0 = useFileUploadSetup(input0);
  const state1 = useFileUploadState2(state0);
  const state2 = useFileUploadState3(state1);
  const state3 = useFileUploadState4(state2);
  const state4 = useFileUploadState5(state3);
  const state5 = useFileUploadState6(state4);
  const state6 = useFileUploadState7(state5);
  const state7 = useFileUploadState8(state6);
  const state8 = useFileUploadState9(state7);
  const state9 = useFileUploadState10(state8);
  const state10 = useFileUploadActions(state9);

  return renderFileUpload(state10);
}

function FileUpload(props: FileUploadProps) {
  // Runtime guard for untyped callers supplying both transports.
  if (props.uploadFile !== undefined && props.onUpload !== undefined) {
    throw new Error(
      "FileUpload accepts either onUpload or uploadFile, not both.",
    );
  }

  return <FileUploadImpl {...props} />;
}

/* KiraFileUpload (labelled composition)                               */

export type KiraFileUploadProps = FileUploadProps & {
  label?: string;
  description?: string;
};

function KiraFileUpload({
  label = "Attachments",
  description,
  id,
  "aria-describedby": ariaDescribedby,
  ...props
}: KiraFileUploadProps) {
  const generatedId = `kira-file-upload-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const pickerId = id ?? generatedId;
  const descriptionId = description ? `${pickerId}-description` : undefined;

  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1.5" data-slot="file-upload-field">
      <label htmlFor={pickerId} className="text-sm font-medium">
        {label}
      </label>
      <FileUpload
        id={pickerId}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {description ? (
        <p
          id={descriptionId}
          data-slot="file-upload-description"
          className="text-xs text-muted-foreground"
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { FileUpload, FilePreview, fileUploadVariants, KiraFileUpload };

function useFileUploadSetup(props: FileUploadProps) {
  const resolvedProps = resolveComponentDefaults(props, {
    multiple: false,
    disabled: false,
    enablePreview: true,
    paste: false,
    size: "default",
  });

  const {
    multiple,
    maxSize,
    maxFiles,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
  } = resolvedProps;

  const { maxSize: effMaxSize, maxFiles: effMaxFilesRaw } = resolveLimits(
    maxSize,
    maxFiles,
  );

  const singleMode = !multiple;

  const effMaxFiles = singleMode ? Math.min(effMaxFilesRaw, 1) : effMaxFilesRaw;

  const reactId = React.useId();

  const instanceId = `file-upload-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const serialRef = React.useRef(0);

  const allocateId = React.useCallback(() => {
    serialRef.current += 1;

    return `${instanceId}-${serialRef.current}`;
  }, [instanceId]);

  return {
    ...resolvedProps,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    effMaxSize,
    singleMode,
    effMaxFiles,
    instanceId,
    allocateId,
  };
}

function useFileUploadState2(state: ReturnType<typeof useFileUploadSetup>) {
  const { allocateId } = state;

  const controlled = state.value !== undefined;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const chooseButtonRef = React.useRef<HTMLButtonElement>(null);

  const openerRef = React.useRef<HTMLElement | null>(null);

  const dragDepthRef = React.useRef(0);

  const listRef = React.useRef<HTMLDivElement>(null);

  const makeInitial = (files: File[] | undefined): InternalEntry[] =>
    (files ?? []).map((f) => ({
      id: allocateId(),
      file: f,
      status: "idle" as const,
    }));

  const [uncontrolledEntries, setUncontrolledEntries] = React.useState<
    InternalEntry[]
  >(() => makeInitial(state.defaultValue));

  const [controlledEntries, setControlledEntries] = React.useState<
    InternalEntry[]
  >(() => makeInitial(state.value));

  const entries = controlled ? controlledEntries : uncontrolledEntries;

  const entriesRef = React.useRef<InternalEntry[]>(entries);

  React.useLayoutEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  // Render-time previous-value reconciliation for controlled File identity.
  const [prevControlledValue, setPrevControlledValue] = React.useState<
    File[] | undefined
  >(state.value);

  if (controlled && state.value !== prevControlledValue) {
    setPrevControlledValue(state.value);
    setControlledEntries((prev) => {
      const next: InternalEntry[] = [];

      for (const f of state.value ?? []) {
        const match = prev.find((e) => e.file === f);
        next.push(match ?? { id: allocateId(), file: f, status: "idle" });
      }

      return next;
    });
  }

  return {
    ...state,
    controlled,
    inputRef,
    chooseButtonRef,
    openerRef,
    dragDepthRef,
    listRef,
    setUncontrolledEntries,
    setControlledEntries,
    entries,
    entriesRef,
  };
}

function useFileUploadState3(state: ReturnType<typeof useFileUploadState2>) {
  const { entriesRef } = state;

  const {
    setControlledEntries,
    onValueChange,
    onFilesChange,
    setUncontrolledEntries,
  } = state;

  const [isDragging, setIsDragging] = React.useState(false);

  const [rejections, setRejections] = React.useState<FileRejection[]>([]);

  const [statusMessage, setStatusMessage] = React.useState("");

  const [previewId, setPreviewId] = React.useState<string | null>(null);

  const [batchBusy, setBatchBusy] = React.useState(false);

  const [perFileBusy, setPerFileBusy] = React.useState(false);

  // One mutation path. `emit` marks selection changes: they propose a new
  // File[] to the parent (controlled) or fire the snapshot callbacks
  // (uncontrolled). Progress/status-only updates pass emit=false and never
  // touch selection callbacks.
  const commit = React.useCallback(
    (updater: (prev: InternalEntry[]) => InternalEntry[], emit: boolean) => {
      if (state.controlled) {
        if (!emit) {
          setControlledEntries(updater);

          return;
        }

        // Controlled selection change: propose once via onValueChange; the
        // parent's next value reconciles internal entries. No echo of
        // onFilesChange.
        const next = updater(entriesRef.current);
        onValueChange?.(next.map((e) => e.file));

        return;
      }

      const apply = (prev: InternalEntry[]): InternalEntry[] => {
        const next = updater(prev);

        if (emit) {
          onValueChange?.(next.map((e) => e.file));
          onFilesChange?.(next.map(toPublicEntry));
        }

        return next;
      };

      setUncontrolledEntries(apply);
    },
    [
      state.controlled,
      onValueChange,
      onFilesChange,
      setUncontrolledEntries,
      setControlledEntries,
      entriesRef,
    ],
  );

  const previewFile = previewId
    ? (state.entries.find((f) => f.id === previewId) ?? null)
    : null;

  return {
    ...state,
    isDragging,
    setIsDragging,
    rejections,
    setRejections,
    statusMessage,
    setStatusMessage,
    previewId,
    setPreviewId,
    batchBusy,
    setBatchBusy,
    perFileBusy,
    setPerFileBusy,
    commit,
    previewFile,
  };
}

function useFileUploadState4(state: ReturnType<typeof useFileUploadState3>) {
  const { setPreviewId } = state;

  // Previewed file removed externally: close rather than silently reselect.
  React.useEffect(() => {
    if (state.previewId !== null && !state.previewFile) {
      setPreviewId(null);
    }
  }, [state.previewId, state.previewFile, setPreviewId]);

  const buildRejections = React.useCallback(
    (candidates: File[], retained: File[]): AdmissionResult => {
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];
      const seen = [...retained];
      let capacity = state.effMaxFiles - retained.length;

      for (const file of candidates) {
        if (!matchesAccept(file, state.accept)) {
          rejected.push({
            file,
            code: "file-type",
            message: `${file.name}: Choose a file matching ${state.accept}.`,
          });
          continue;
        }

        if (file.size > state.effMaxSize) {
          rejected.push({
            file,
            code: "file-size",
            message: `${file.name}: File exceeds ${formatFileSize(state.effMaxSize)}.`,
          });
          continue;
        }

        if (seen.some((s) => sameFileIdentity(s, file))) {
          rejected.push({
            file,
            code: "duplicate",
            message: `${file.name}: This file is already selected.`,
          });
          continue;
        }

        if (capacity <= 0) {
          rejected.push({
            file,
            code: "file-count",
            message: `${file.name}: You can select at most ${state.effMaxFiles} file(s).`,
          });
          continue;
        }

        accepted.push(file);
        seen.push(file);
        capacity -= 1;
      }

      return { accepted, rejected };
    },
    [state.accept, state.effMaxSize, state.effMaxFiles],
  );

  return { ...state, buildRejections };
}

function useFileUploadState5(state: ReturnType<typeof useFileUploadState4>) {
  const { entriesRef } = state;

  const {
    setRejections,
    onFilesRejected,
    setStatusMessage,
    buildRejections,
    allocateId,
    commit,
  } = state;

  const announce = useFileUploadAnnouncement({
    setRejections,
    onFilesRejected,
    setStatusMessage,
  });

  /** Builds "over capacity" rejections for valid-but-unselected candidates. */
  const buildCountRejections = React.useCallback(
    (files: File[]): FileRejection[] =>
      files.map((file) => ({
        file,
        code: "file-count",
        message: `${file.name}: You can select at most ${state.effMaxFiles} file(s).`,
      })),
    [state.effMaxFiles],
  );

  const ingestFiles = React.useCallback(
    (fileList: FileList | File[] | null) => {
      if (state.disabled) return;

      if (!fileList) return;
      const candidates = Array.from(fileList);

      if (candidates.length === 0) return;

      const retainedFiles = entriesRef.current.map((e) => e.file);

      const { accepted, rejected } = buildRejections(candidates, retainedFiles);

      if (state.singleMode) {
        ingestSingleFileSelection({
          accepted,
          rejected,
          candidates,
          announce,
          buildCountRejections,
          allocateId,
          commit,
        });

        return;
      }

      if (accepted.length === 0) {
        announce(0, rejected);

        return;
      }

      announce(accepted.length, rejected);

      const run = (prev: InternalEntry[]): InternalEntry[] => [
        ...prev,
        ...accepted.map((f) => ({
          id: allocateId(),
          file: f,
          status: "idle" as const,
        })),
      ];

      commit(run, true);
    },
    [
      state.disabled,
      buildRejections,
      buildCountRejections,
      state.singleMode,
      announce,
      commit,
      entriesRef,
      allocateId,
    ],
  );

  return { ...state, ingestFiles };
}

function ingestSingleFileSelection({
  accepted,
  rejected,
  candidates,
  announce,
  buildCountRejections,
  allocateId,
  commit,
}: {
  accepted: File[];
  rejected: FileRejection[];
  candidates: File[];
  announce: (count: number, rejected: FileRejection[]) => void;
  buildCountRejections: (files: File[]) => FileRejection[];
  allocateId: () => string;
  commit: (
    update: (prev: InternalEntry[]) => InternalEntry[],
    notify: boolean,
  ) => void;
}) {
  // First valid nonduplicate candidate replaces the selection; the rest are rejected by count.
  if (accepted.length === 0) {
    announce(0, rejected);

    return;
  }

  const taken = accepted[0];

  const overflow = candidates.filter(
    (candidate) =>
      accepted.includes(candidate) &&
      candidate !== taken &&
      !rejected.some((item) => item.file === candidate),
  );

  announce(1, [...rejected, ...buildCountRejections(overflow)]);

  const run = (previous: InternalEntry[]): InternalEntry[] => {
    const existing = previous.find((entry) =>
      sameFileIdentity(entry.file, taken),
    );

    return existing
      ? [{ ...existing, id: allocateId() }]
      : [{ id: allocateId(), file: taken, status: "idle" as const }];
  };

  commit(run, true);
}

function useFileUploadState6(state: ReturnType<typeof useFileUploadState5>) {
  const { entriesRef, dragDepthRef } = state;

  const { ingestFiles, commit, setRejections, setPreviewId, setIsDragging } =
    state;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ingestFiles(event.target.files);
    // Clear so re-selecting the same file fires change again.
    event.target.value = "";
  };

  const removeFile = React.useCallback(
    (removeId: string) => {
      const target = entriesRef.current.find((e) => e.id === removeId);
      target?.abortController?.abort();

      const run = (prev: InternalEntry[]): InternalEntry[] =>
        prev.filter((e) => e.id !== removeId);

      commit(run, true);
      setRejections((prev) =>
        target
          ? prev.filter((r) => !sameFileIdentity(r.file, target.file))
          : prev,
      );
      setPreviewId((prev) => (prev === removeId ? null : prev));
    },
    [commit, setPreviewId, setRejections, entriesRef],
  );

  const handleDragEnter = (event: React.DragEvent) => {
    if (state.disabled) return;

    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent) => {
    if (state.disabled) return;

    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
  };

  const handleDragLeave = (event: React.DragEvent) => {
    if (state.disabled) return;
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) setIsDragging(false);
  };

  return {
    ...state,
    handleInputChange,
    removeFile,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
  };
}

function useFileUploadState7(state: ReturnType<typeof useFileUploadState6>) {
  const { dragDepthRef, inputRef, entriesRef } = state;

  const {
    setIsDragging,
    ingestFiles,
    setPreviewId,
    setRejections,
    setStatusMessage,
    setBatchBusy,
    setPerFileBusy,
    allocateId,
    onValueChange,
    onFilesChange,
    setUncontrolledEntries,
  } = state;

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);

    if (state.disabled) return;
    ingestFiles(event.dataTransfer.files);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    if (!state.paste || state.disabled) return;
    // SAFETY: ClipboardEvent targets inside the uploader are DOM elements.
    const target = event.target as HTMLElement | null;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable
    ) {
      return;
    }

    const clipboardFiles = event.clipboardData?.files;

    if (!clipboardFiles || clipboardFiles.length === 0) return;
    event.preventDefault();
    ingestFiles(clipboardFiles);
  };

  const defaultValueRef = React.useRef(state.defaultValue);

  const controlledRef = React.useRef(state.controlled);

  React.useLayoutEffect(() => {
    defaultValueRef.current = state.defaultValue;
    controlledRef.current = state.controlled;
  }, [state.defaultValue, state.controlled]);

  React.useEffect(() => {
    return subscribeFileUploadReset({
      inputRef,
      entriesRef,
      setPreviewId,
      setRejections,
      setStatusMessage,
      setBatchBusy,
      setPerFileBusy,
      defaultValueRef,
      allocateId,
      controlledRef,
      onValueChange,
      onFilesChange,
      setUncontrolledEntries,
    });
  }, [
    onValueChange,
    onFilesChange,
    setPerFileBusy,
    setRejections,
    setUncontrolledEntries,
    setStatusMessage,
    inputRef,
    setPreviewId,
    entriesRef,
    allocateId,
    setBatchBusy,
  ]);

  return { ...state, handleDrop, handlePaste };
}

function useFileUploadState8(state: ReturnType<typeof useFileUploadState7>) {
  const { entriesRef } = state;

  const { commit, setBatchBusy, onUpload, setStatusMessage } = state;

  let transportMode: "batch" | "perFile" | "none" = "none";

  if (state.uploadFile !== undefined) {
    transportMode = "perFile";
  } else if (onUpload !== undefined) {
    transportMode = "batch";
  }

  const batchBusyRef = React.useRef(false);

  const perFileBusyRef = React.useRef(false);

  const attemptTokenRef = React.useRef(0);

  // Patch one entry without touching selection callbacks.
  const patchEntry = React.useCallback(
    (entryId: string, patch: (e: InternalEntry) => InternalEntry) => {
      commit(
        (prev) => prev.map((e) => (e.id === entryId ? patch(e) : e)),
        false,
      );
    },
    [commit],
  );

  const runBatchUpload = React.useCallback(async () => {
    if (transportMode !== "batch" || state.disabled) return;

    if (batchBusyRef.current) return;
    const snapshot = entriesRef.current.map((e) => e.file);

    if (snapshot.length === 0) return;
    batchBusyRef.current = true;
    setBatchBusy(true);

    const markAll = (status: FileUploadStatus, error?: string) => {
      commit(
        (prev) =>
          prev.map((e) =>
            status === "error"
              ? { ...e, status, error }
              : { ...e, status, error, progress: undefined },
          ),
        false,
      );
    };

    markAll("uploading");

    try {
      await onUpload?.(snapshot);

      if (batchBusyRef.current) {
        markAll("success");
        setStatusMessage("Upload finished.");
      }
    } catch (error) {
      if (batchBusyRef.current) {
        const message =
          error instanceof Error
            ? getFileUploadErrorMessage(error)
            : "Upload failed. Try again.";

        markAll("error", message);
        setStatusMessage(message);
      }
    } finally {
      batchBusyRef.current = false;
      setBatchBusy(false);
    }
  }, [
    transportMode,
    state.disabled,
    onUpload,
    commit,
    entriesRef,
    setBatchBusy,
    setStatusMessage,
  ]);

  return {
    ...state,
    transportMode,
    batchBusyRef,
    perFileBusyRef,
    attemptTokenRef,
    patchEntry,
    runBatchUpload,
  };
}

function canStartFileUploadAttempt(
  transportMode: string,
  disabled: boolean,
  busy: boolean,
) {
  return transportMode === "perFile" && !disabled && !busy;
}

function isUploadEntryReady(
  entry: InternalEntry | undefined,
): entry is InternalEntry {
  return entry !== undefined && entry.status !== "uploading";
}

function isCurrentFileUploadAttempt(
  token: number,
  attemptTokenRef: { current: number },
  controller: AbortController,
) {
  return token === attemptTokenRef.current && !controller.signal.aborted;
}

function getFileUploadErrorMessage(error: Error) {
  return error.message || "Upload failed. Try again.";
}

function createFileUploadContext({
  token,
  attemptTokenRef,
  controller,
  patchEntry,
  entryId,
}: {
  token: number;
  attemptTokenRef: { current: number };
  controller: AbortController;
  patchEntry: (
    entryId: string,
    patch: (entry: InternalEntry) => InternalEntry,
  ) => void;
  entryId: string;
}): FileUploadContext {
  return {
    signal: controller.signal,
    onProgress: (progress) => {
      if (!isCurrentFileUploadAttempt(token, attemptTokenRef, controller))
        return;

      if (!Number.isFinite(progress)) return;

      const clamped = Math.min(Math.max(progress, 0), 100);
      patchEntry(entryId, (entry) =>
        entry.id === entryId && entry.status === "uploading"
          ? { ...entry, progress: clamped }
          : entry,
      );
    },
  };
}

function beginFileUploadAttempt(
  perFileBusyRef: { current: boolean },
  setPerFileBusy: (busy: boolean) => void,
  attemptTokenRef: { current: number },
) {
  perFileBusyRef.current = true;
  setPerFileBusy(true);

  return {
    token: ++attemptTokenRef.current,
    controller: new AbortController(),
  };
}

function useFileUploadState9(state: ReturnType<typeof useFileUploadState8>) {
  const { perFileBusyRef, entriesRef, attemptTokenRef } = state;

  const { setPerFileBusy, patchEntry, uploadFile, setStatusMessage } = state;
  const transportMode = state.transportMode;
  const disabled = state.disabled;

  const startAttempt = async (entryId: string) => {
    if (
      !canStartFileUploadAttempt(
        transportMode,
        disabled,
        perFileBusyRef.current,
      )
    )
      return;
    const entry = entriesRef.current.find((e) => e.id === entryId);

    if (!isUploadEntryReady(entry)) return;

    const { token, controller } = beginFileUploadAttempt(
      perFileBusyRef,
      setPerFileBusy,
      attemptTokenRef,
    );

    patchEntry(entryId, (e) => ({
      ...e,
      status: "uploading",
      progress: undefined,
      error: undefined,
      abortController: controller,
    }));

    const context = createFileUploadContext({
      token,
      attemptTokenRef,
      controller,
      patchEntry,
      entryId,
    });

    try {
      await uploadFile?.(entry.file, context);

      if (!isCurrentFileUploadAttempt(token, attemptTokenRef, controller))
        return;
      patchEntry(entryId, (e) =>
        e.status === "uploading"
          ? { ...e, status: "success", progress: 100 }
          : e,
      );
      setStatusMessage(`Uploaded ${entry.file.name}.`);
    } catch (error) {
      if (!isCurrentFileUploadAttempt(token, attemptTokenRef, controller))
        return;

      const message =
        error instanceof Error
          ? getFileUploadErrorMessage(error)
          : "Upload failed. Try again.";

      patchEntry(entryId, (e) =>
        e.status === "uploading"
          ? { ...e, status: "error", error: message }
          : e,
      );
      setStatusMessage(message);
    } finally {
      finishFileUploadAttempt({
        token,
        attemptTokenRef,
        perFileBusyRef,
        setPerFileBusy,
        entriesRef,
        disabled,
        startAttempt,
      });
    }
  };

  return { ...state, startAttempt };
}

function useFileUploadState10(state: ReturnType<typeof useFileUploadState9>) {
  const { perFileBusyRef, entriesRef, attemptTokenRef, batchBusyRef } = state;

  const {
    startAttempt,
    setPerFileBusy,
    patchEntry,
    setStatusMessage,
    setBatchBusy,
    commit,
  } = state;

  const startPerFileRun = () => {
    if (state.transportMode !== "perFile" || state.disabled) return;

    if (perFileBusyRef.current) return;
    const first = entriesRef.current.find((e) => e.status === "idle");

    if (!first) return;
    void startAttempt(first.id);
  };

  const cancelAttempt = (entryId: string) => {
    const entry = entriesRef.current.find((e) => e.id === entryId);

    if (!entry || entry.status !== "uploading") return;
    entry.abortController?.abort();
    attemptTokenRef.current += 1;
    perFileBusyRef.current = false;
    setPerFileBusy(false);
    patchEntry(entryId, (e) => ({
      ...e,
      status: "canceled",
      progress: undefined,
    }));
    setStatusMessage(`Canceled ${entry.file.name}.`);
    // Scheduler freed without waiting for an adapter that ignores AbortSignal.
    const next = entriesRef.current.find((e) => e.status === "idle");

    if (next && !state.disabled) {
      void startAttempt(next.id);
    }
  };

  const retryAttempt = (entryId: string) => {
    if (perFileBusyRef.current) return;
    const entry = entriesRef.current.find((e) => e.id === entryId);

    if (!entry || (entry.status !== "error" && entry.status !== "canceled"))
      return;
    void startAttempt(entryId);
  };

  React.useEffect(() => {
    if (state.disabled) {
      entriesRef.current.forEach((e) => e.abortController?.abort());
      batchBusyRef.current = false;
      setBatchBusy(false);
      perFileBusyRef.current = false;
      setPerFileBusy(false);
      attemptTokenRef.current += 1;
      commit(
        (prev) =>
          prev.map((e) =>
            e.status === "uploading"
              ? { ...e, status: "canceled", progress: undefined }
              : e,
          ),
        false,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- invalidate only on disabled transitions
  }, [state.disabled]);

  return { ...state, startPerFileRun, cancelAttempt, retryAttempt };
}

function useFileUploadActions(state: ReturnType<typeof useFileUploadState10>) {
  const { entriesRef, batchBusyRef, perFileBusyRef } = state;

  React.useEffect(() => {
    return () => {
      // oxlint-disable-next-line react-hooks/exhaustive-deps -- Cleanup must cancel the latest pending operation or timer stored in this stable ref, including work started after effect setup.
      entriesRef.current.forEach((e) => e.abortController?.abort());
      batchBusyRef.current = false;
      perFileBusyRef.current = false;
    };
  }, [entriesRef, batchBusyRef, perFileBusyRef]);

  const pickerId = state.id ?? `${state.instanceId}-input`;

  const errorsId = `${state.instanceId}-errors`;

  const statusId = `${state.instanceId}-status`;

  const describedBy = [
    state.ariaDescribedby,
    state.rejections.length > 0 ? errorsId : undefined,
    state.statusMessage ? statusId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const publicEntries = state.entries.map(toPublicEntry);

  const uploadingCount = state.entries.filter(
    (e) => e.status === "uploading",
  ).length;

  const idleCount = state.entries.filter((e) => e.status === "idle").length;

  const lockMutations = state.disabled || state.batchBusy || uploadingCount > 0;

  const canUploadBatch = canUploadFileBatch({ state });

  const canUploadPerFile = canUploadFilesIndividually({ state, idleCount });

  let batchButtonLabel = `Upload ${state.entries.length} file(s)`;

  if (state.batchBusy) {
    batchButtonLabel = "Uploading\u2026";
  } else if (state.entries.some((e) => e.status === "success")) {
    batchButtonLabel = "Uploaded";
  }

  return {
    ...state,
    pickerId,
    errorsId,
    statusId,
    describedBy,
    publicEntries,
    idleCount,
    lockMutations,
    canUploadBatch,
    canUploadPerFile,
    batchButtonLabel,
  };
}

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderFileUpload(state: ReturnType<typeof useFileUploadActions>) {
  const { openerRef } = state;

  const { setPreviewId } = state;

  return (
    <div
      data-slot="file-upload"
      className={cn("space-y-3", state.className)}
      onPaste={state.handlePaste}
    >
      {renderFileUploadDropzonePart9({ state })}
      {state.rejections.length > 0 && renderFileUploadErrorsPart10({ state })}
      <output
        data-slot="file-upload-status"
        id={state.statusId}
        aria-live="polite"
        htmlFor={state.pickerId}
        className={cn(
          "text-xs text-muted-foreground",
          !state.statusMessage && "sr-only",
        )}
      >
        {state.statusMessage || "No file activity."}
      </output>
      {state.publicEntries.length > 0 && renderFileUploadListPart11({ state })}
      {state.transportMode === "perFile" &&
        state.publicEntries.length > 0 &&
        renderFileUploadActionsPart12({ state })}
      {state.transportMode === "batch" && state.publicEntries.length > 0 && (
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={!state.canUploadBatch}
          onClick={state.runBatchUpload}
          aria-busy={state.batchBusy || undefined}
          className="transition-[color,background-color,border-color,box-shadow,opacity]"
          data-slot="file-upload-actions"
        >
          {state.batchButtonLabel}
        </Button>
      )}
      {state.previewFile && (
        <PreviewDialogContent
          file={state.previewFile}
          files={state.publicEntries}
          onClose={() => setPreviewId(null)}
          onNavigate={(direction) => {
            const count = state.publicEntries.length;

            if (count < 2) return;

            const idx = state.publicEntries.findIndex(
              (f) => f.id === state.previewFile?.id,
            );

            const nextIdx =
              direction === "prev"
                ? (idx - 1 + count) % count
                : (idx + 1) % count;

            setPreviewId(state.publicEntries[nextIdx]?.id ?? null);
          }}
          openerRef={openerRef}
        />
      )}
    </div>
  );
}

type renderFileUploadMarkdownPart1Args = {
  source: boolean;
  setSource: React.Dispatch<React.SetStateAction<boolean>>;
  document: { file: File; text?: string; error?: string };
};

function renderFileUploadMarkdownPart1({
  source,
  setSource,
  document,
}: renderFileUploadMarkdownPart1Args) {
  return (
    <section
      data-slot="file-upload-markdown"
      className="mx-auto w-full max-w-4xl space-y-4 p-4 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={source ? "ghost" : "secondary"}
          aria-pressed={!source}
          onClick={() => setSource(false)}
        >
          Preview
        </Button>
        <Button
          type="button"
          variant={source ? "secondary" : "ghost"}
          aria-pressed={source}
          onClick={() => setSource(true)}
        >
          Source
        </Button>
        <span className="text-xs text-muted-foreground">
          Read-only · embedded HTML and images blocked
        </span>
      </div>
      {source ? (
        <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-word rounded-lg border bg-muted p-4 text-sm leading-6">
          <code>{document.text}</code>
        </pre>
      ) : (
        <MDEditor.Markdown
          source={document.text}
          skipHtml
          rehypePlugins={[rehypeSanitize]}
          disallowedElements={["img", "iframe", "style", "script"]}
          urlTransform={(url) =>
            /^https?:\/\//i.test(url) || /^mailto:/i.test(url) ? url : ""
          }
          style={{
            backgroundColor: "transparent",
            color: "var(--foreground)",
            fontFamily: "inherit",
            lineHeight: 1.7,
          }}
          className="[&_pre]:overflow-x-auto [&_pre]:bg-muted! [&_code]:text-foreground [&_a]:text-primary [&_table]:block [&_table]:overflow-x-auto [&_th]:bg-muted! [&_tr]:bg-transparent! [&_td]:border-border! [&_th]:border-border! [&_blockquote]:text-muted-foreground [&_h1]:border-border [&_h2]:border-border"
        />
      )}
    </section>
  );
}

type renderMediaPreviewBodySectionPart2Args = {
  objectUrl: {
    file: File;
    objectUrl: string | undefined;
    zoom?: number;
    rotation?: number;
    onMediaError: () => void;
    mediaFailed: boolean;
    interactive: boolean;
  }["objectUrl"];
  interactive: {
    file: File;
    objectUrl: string | undefined;
    zoom?: number;
    rotation?: number;
    onMediaError: () => void;
    mediaFailed: boolean;
    interactive: boolean;
  }["interactive"];
  onMediaError: {
    file: File;
    objectUrl: string | undefined;
    zoom?: number;
    rotation?: number;
    onMediaError: () => void;
    mediaFailed: boolean;
    interactive: boolean;
  }["onMediaError"];
  file: {
    file: File;
    objectUrl: string | undefined;
    zoom?: number;
    rotation?: number;
    onMediaError: () => void;
    mediaFailed: boolean;
    interactive: boolean;
  }["file"];
};

function renderMediaPreviewBodySectionPart2({
  objectUrl,
  interactive,
  onMediaError,
  file,
}: renderMediaPreviewBodySectionPart2Args) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-lg border bg-background p-6">
      <IconMusic
        className="h-16 w-16 text-muted-foreground"
        aria-hidden="true"
      />
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- local preview of a user-selected file has no caption source */}
      <audio
        src={objectUrl}
        controls={interactive}
        preload="metadata"
        onError={onMediaError}
        className="w-full"
      />
      <p className="text-sm font-medium">{file.name}</p>
      <p className="text-xs text-muted-foreground">
        {formatFileSize(file.size)} &bull; {file.type || "Unknown type"}
      </p>
    </div>
  );
}

type renderResolveValue1SectionPart3Args = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  objectUrl: ReturnType<typeof useFileObjectUrl>;
  file: {
    file: UploadedFile;
    files: UploadedFile[];
    onClose: () => void;
    onNavigate: (direction: "prev" | "next") => void;
    openerRef: React.RefObject<HTMLElement | null>;
  }["file"];
  setMediaFailed: React.Dispatch<React.SetStateAction<boolean>>;
  reducedMotion: ReturnType<typeof useReducedMotion>;
  rotation: number;
};

function renderResolveValue1SectionPart3({
  zoom,
  setZoom,
  objectUrl,
  file,
  setMediaFailed,
  reducedMotion,
  rotation,
}: renderResolveValue1SectionPart3Args) {
  return (
    <button
      type="button"
      aria-label={zoom > 1 ? "Zoom image out to fit" : "Zoom image in"}
      title={zoom > 1 ? "Click to fit image" : "Click to zoom image"}
      onClick={() => setZoom((current) => (current > 1 ? 1 : 2))}
      className={cn(
        "flex min-h-full w-full items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
        zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
      )}
    >
      <img
        src={objectUrl}
        alt={file.file.name}
        onError={() => setMediaFailed(true)}
        draggable={false}
        className={cn(
          "max-h-[65dvh] max-w-full select-none object-contain",
          !reducedMotion && "transition-transform duration-150 ease-out",
        )}
        style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
      />
    </button>
  );
}

type renderPreviewDialogContentSectionPart4Args = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
};

function renderPreviewDialogContentSectionPart4({
  zoom,
  setZoom,
  setRotation,
}: renderPreviewDialogContentSectionPart4Args) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Zoom out"
        title="Zoom out (−)"
        className="transition-[color,background-color,transform] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
        disabled={zoom <= 0.5}
        onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
      >
        <IconZoomOut aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Zoom in"
        title="Zoom in (+)"
        className="transition-[color,background-color,transform] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
        disabled={zoom >= 3}
        onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
      >
        <IconZoomIn aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Reset image zoom and rotation"
        title="Reset view"
        onClick={() => {
          setZoom(1);
          setRotation(0);
        }}
        className="min-w-16 tabular-nums"
      >
        {Math.round(zoom * 100)}%
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Rotate 90 degrees"
        onClick={() => setRotation((r) => (r + 90) % 360)}
      >
        <IconRotateClockwise aria-hidden="true" />
      </Button>
    </>
  );
}

type renderPreviewDialogContentSectionPart5Args = {
  markdown: boolean;
  resolveValue1: () => React.JSX.Element;
  kind: ReturnType<typeof mediaKindOf>;
  mediaFailed: boolean;
  zoom: number;
  rotation: number;
};

function renderPreviewDialogContentSectionPart5({
  markdown,
  resolveValue1,
  kind,
  mediaFailed,
  zoom,
  rotation,
}: renderPreviewDialogContentSectionPart5Args) {
  return (
    <DialogBody
      className={cn(
        "relative min-h-0 flex-1 overflow-auto",
        !markdown && "flex items-center justify-center p-4",
      )}
    >
      {resolveValue1()}
      {kind === "image" && !mediaFailed && (
        <output
          aria-live="polite"
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border bg-background/90 px-3 py-1 text-xs tabular-nums text-muted-foreground"
        >
          {Math.round(zoom * 100)}% · {rotation}° · Click image to{" "}
          {zoom > 1 ? "fit" : "zoom"}
        </output>
      )}
    </DialogBody>
  );
}

type renderPreviewDialogContentSectionPart6Args = {
  onNavigate: {
    file: UploadedFile;
    files: UploadedFile[];
    onClose: () => void;
    onNavigate: (direction: "prev" | "next") => void;
    openerRef: React.RefObject<HTMLElement | null>;
  }["onNavigate"];
};

function renderPreviewDialogContentSectionPart6({
  onNavigate,
}: renderPreviewDialogContentSectionPart6Args) {
  return (
    <>
      <button
        type="button"
        onClick={() => onNavigate("prev")}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        aria-label="Previous file"
      >
        <IconChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onNavigate("next")}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        aria-label="Next file"
      >
        <IconChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </>
  );
}

type renderFilePreviewSectionPart7Args = {
  showThumbnail: boolean;
  kind: ReturnType<typeof mediaKindOf>;
  thumbnailUrl: ReturnType<typeof useFileObjectUrl>;
  file: FilePreviewProps["file"];
  onMediaError: () => void;
  mediaFailed: boolean;
  onPreview: FilePreviewProps["onPreview"];
  disabled: Exclude<FilePreviewProps["disabled"], undefined>;
};

function renderFilePreviewSectionPart7({
  showThumbnail,
  kind,
  thumbnailUrl,
  file,
  onMediaError,
  mediaFailed,
  onPreview,
  disabled,
}: renderFilePreviewSectionPart7Args) {
  return (
    <div className="relative flex aspect-square items-center justify-center bg-muted">
      {showThumbnail && kind === "image" && (
        <img
          src={thumbnailUrl}
          alt={file.file.name}
          onError={onMediaError}
          className="h-full w-full object-cover"
        />
      )}
      {showThumbnail && kind === "video" && (
        <video
          src={thumbnailUrl}
          preload="metadata"
          muted
          onError={onMediaError}
          className="h-full w-full object-cover"
        />
      )}
      {!showThumbnail && (
        // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
        <div className="flex flex-col items-center gap-1.5 p-4 text-center">
          {React.createElement(previewFallbackIcon(kind), {
            className: "h-8 w-8 text-muted-foreground",
            "aria-hidden": true,
          })}
          <span className="max-w-full truncate px-2 text-xs text-muted-foreground">
            {mediaFailed ? "Preview unavailable" : file.file.name}
          </span>
        </div>
      )}
      {onPreview && !disabled && (
        <button
          type="button"
          data-slot="file-upload-preview-trigger"
          onClick={onPreview}
          className="absolute inset-0 flex items-end justify-start bg-linear-to-t from-black/40 to-transparent p-2 opacity-0 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none"
          aria-label={`Preview ${file.file.name}`}
        >
          {/* kira-kit-ignore spacing-scale: file chip uses badge-tier compact padding */}
          <span className="rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
            Preview
          </span>
        </button>
      )}
    </div>
  );
}

type renderFilePreviewSectionPart8Args = {
  file: FilePreviewProps["file"];
  status: ReturnType<typeof uploadStatusText>;
};

function renderFilePreviewSectionPart8({
  file,
  status,
}: renderFilePreviewSectionPart8Args) {
  return (
    <div className="p-2">
      <p className="truncate text-xs font-medium" title={file.file.name}>
        {file.file.name}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatFileSize(file.file.size)}
      </p>
      {status && status.tone === "muted" && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {file.status === "uploading" && (
            <IconLoader2
              className="h-3 w-3 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          {status.text}
        </p>
      )}
      {status && status.tone === "success" && (
        <p className="mt-1 flex items-center gap-1 text-xs text-success">
          <IconCheck className="h-3 w-3" aria-hidden="true" /> {status.text}
        </p>
      )}
      {status && status.tone === "error" && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {status.text}
        </p>
      )}
    </div>
  );
}

type renderFileUploadDropzonePart9Args = {
  state: ReturnType<typeof useFileUploadActions>;
};

function renderFileUploadDropzonePart9({
  state,
}: renderFileUploadDropzonePart9Args) {
  return (
    <div
      data-slot="file-upload-dropzone"
      className={cn(
        fileUploadVariants({ size: state.size }),
        state.isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        state.disabled && "opacity-60",
      )}
      onDragEnter={state.handleDragEnter}
      onDragOver={state.handleDragOver}
      onDragLeave={state.handleDragLeave}
      onDrop={state.handleDrop}
      aria-labelledby={state.ariaLabelledby}
      aria-label={state.ariaLabel}
      aria-describedby={state.describedBy || undefined}
      aria-invalid={state.ariaInvalid || undefined}
    >
      <input
        ref={state.inputRef}
        id={state.pickerId}
        name={state.name}
        type="file"
        accept={state.accept}
        multiple={state.multiple}
        capture={state.capture}
        disabled={state.disabled}
        onChange={state.handleInputChange}
        className="sr-only"
        data-slot="file-upload-input"
        tabIndex={-1}
        aria-hidden="true"
      />
      <IconUpload
        className="mb-2 h-8 w-8 text-muted-foreground"
        aria-hidden="true"
      />
      <p className="text-sm font-medium">Drag &amp; drop files here</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {state.accept ? `Accepts: ${state.accept}` : "All file types"}
        {" \u2022 "}
        {`Max ${formatFileSize(state.effMaxSize)}`}
        {" \u2022 "}
        {`Max ${state.effMaxFiles} file${state.effMaxFiles === 1 ? "" : "s"}`}
      </p>
      <Button
        ref={state.chooseButtonRef}
        type="button"
        variant="outline"
        size="sm"
        disabled={state.disabled}
        onClick={() => state.inputRef.current?.click()}
        className="mt-3 transition-[color,background-color,border-color,box-shadow,opacity]"
        data-slot="file-upload-trigger"
      >
        Choose files
      </Button>
    </div>
  );
}

type renderFileUploadErrorsPart10Args = {
  state: ReturnType<typeof useFileUploadActions>;
};

function renderFileUploadErrorsPart10({
  state,
}: renderFileUploadErrorsPart10Args) {
  const { setRejections } = state;

  return (
    <div
      data-slot="file-upload-errors"
      id={state.errorsId}
      className="space-y-1"
    >
      {state.rejections.map((rejection, index) => (
        <p
          key={`${rejection.file.name}-${rejection.file.size}-${rejection.file.lastModified}-${rejection.code}`}
          data-slot="file-upload-error"
          className="flex items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-2 py-1 text-xs text-destructive"
        >
          <span>{rejection.message}</span>
          <button
            type="button"
            onClick={() =>
              setRejections((prev) => prev.filter((_, i) => i !== index))
            }
            className="shrink-0 rounded p-0.5 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Dismiss error for ${rejection.file.name}`}
          >
            <IconX className="h-3 w-3" aria-hidden="true" />
          </button>
        </p>
      ))}
    </div>
  );
}

type renderFileUploadListPart11Args = {
  state: ReturnType<typeof useFileUploadActions>;
};

function renderFileUploadListPart11({ state }: renderFileUploadListPart11Args) {
  const { setPreviewId, cancelAttempt, retryAttempt } = state;

  return (
    <div
      ref={state.listRef}
      data-slot="file-upload-list"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
    >
      {state.publicEntries.map((file) => (
        <div key={file.id}>
          <FilePreview
            file={file}
            onRemove={state.removeFile}
            disabled={state.lockMutations && file.status !== "uploading"}
            onPreview={
              state.enablePreview
                ? () => {
                    state.openerRef.current = state.chooseButtonRef.current;
                    setPreviewId(file.id);
                  }
                : undefined
            }
          />
          <FileUploadProgressRow entry={file} />
          {state.transportMode === "perFile" && file.status === "uploading" && (
            <button
              type="button"
              onClick={() => cancelAttempt(file.id)}
              className="mt-1 text-xs text-muted-foreground underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cancel
            </button>
          )}
          {state.transportMode === "perFile" &&
            (file.status === "error" || file.status === "canceled") && (
              <button
                type="button"
                disabled={state.perFileBusy}
                onClick={() => retryAttempt(file.id)}
                className="mt-1 text-xs text-primary underline hover:text-primary/80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Retry
              </button>
            )}
        </div>
      ))}
    </div>
  );
}

type renderFileUploadActionsPart12Args = {
  state: ReturnType<typeof useFileUploadActions>;
};

function renderFileUploadActionsPart12({
  state,
}: renderFileUploadActionsPart12Args) {
  return (
    <Button
      type="button"
      variant="default"
      size="sm"
      disabled={!state.canUploadPerFile}
      onClick={state.startPerFileRun}
      aria-busy={state.perFileBusy || undefined}
      className="transition-[color,background-color,border-color,box-shadow,opacity]"
      data-slot="file-upload-actions"
    >
      {state.perFileBusy
        ? "Uploading\u2026"
        : `Upload ${state.idleCount} file(s)`}
    </Button>
  );
}

function useFilePreviewSetup({
  file,
  files,
  onClose,
  onNavigate,
  openerRef,
}: {
  file: UploadedFile;
  files: UploadedFile[];
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  openerRef: React.RefObject<HTMLElement | null>;
}) {
  const resolveValue1 = () => {
    if (markdown) {
      return <MarkdownFilePreview key={file.id} file={file.file} />;
    }

    if (kind === "image" && objectUrl && !mediaFailed) {
      return renderResolveValue1SectionPart3({
        zoom,
        setZoom,
        objectUrl,
        file,
        setMediaFailed,
        reducedMotion,
        rotation,
      });
    }

    return (
      <MediaPreviewBody
        key={file.id}
        file={file.file}
        objectUrl={objectUrl}
        onMediaError={() => setMediaFailed(true)}
        mediaFailed={mediaFailed}
        interactive
      />
    );
  };

  const [zoom, setZoom] = React.useState(1);

  const [rotation, setRotation] = React.useState(0);

  const [mediaFailed, setMediaFailed] = React.useState(false);

  const reducedMotion = useReducedMotion();

  const objectUrl = useFileObjectUrl(file.file);

  const kind = mediaKindOf(file.file);

  const currentIndex = files.findIndex((f) => f.id === file.id);

  const canNavigate = files.length > 1;

  const markdown =
    /\.(md|markdown)$/i.test(file.file.name) ||
    file.file.type === "text/markdown";

  // Reset before commit when the media identity changes; keyed media remounts.
  const [previousFile, setPreviousFile] = React.useState(file);

  if (previousFile !== file) {
    setPreviousFile(file);
    setZoom(1);
    setRotation(0);
    setMediaFailed(false);
  }

  return {
    file,
    files,
    onClose,
    onNavigate,
    openerRef,
    resolveValue1,
    zoom,
    setZoom,
    rotation,
    setRotation,
    mediaFailed,
    objectUrl,
    kind,
    currentIndex,
    canNavigate,
    markdown,
  };
}

function useFilePreviewState2(state: ReturnType<typeof useFilePreviewSetup>) {
  const { onNavigate, setZoom, setRotation, kind, canNavigate } = state;

  const applyShortcut = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" && canNavigate) {
      event.preventDefault();
      onNavigate("prev");

      return true;
    }

    if (event.key === "ArrowRight" && canNavigate) {
      event.preventDefault();
      onNavigate("next");

      return true;
    }

    return applyImagePreviewShortcut(event, kind, setZoom, setRotation);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // SAFETY: KeyboardEvent targets inside dialog content are DOM elements.
    const target = event.target as HTMLElement | null;

    if (isEditableTarget(target, event)) return;
    applyShortcut(event);
  };

  return { ...state, handleKeyDown };
}

function applyImagePreviewShortcut(
  event: React.KeyboardEvent,
  kind: string | undefined,
  setZoom: React.Dispatch<React.SetStateAction<number>>,
  setRotation: React.Dispatch<React.SetStateAction<number>>,
) {
  if (kind !== "image") return false;

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    setZoom((zoom) => Math.min(3, zoom + 0.25));

    return true;
  }

  if (event.key === "-") {
    event.preventDefault();
    setZoom((zoom) => Math.max(0.5, zoom - 0.25));

    return true;
  }

  if (event.key === "r" || event.key === "R") {
    event.preventDefault();
    setRotation((rotation) => (rotation + 90) % 360);

    return true;
  }

  return false;
}

function useFilePreviewActions(state: ReturnType<typeof useFilePreviewState2>) {
  const { file, openerRef, objectUrl } = state;

  const handleDownload = () => {
    const pending = downloadFile(file.file, objectUrl);

    if (pending.url === objectUrl) {
      // Reused live view URL: detach the anchor only, never revoke it.
      pending.anchor.remove();
    } else {
      cleanupDownload(pending);
    }
  };

  const focusFinal = () => {
    const opener = openerRef.current;

    if (opener && opener.isConnected) {
      opener.focus();
    }
  };

  return { ...state, handleDownload, focusFinal };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderFilePreview({
  file,
  files,
  onClose,
  onNavigate,
  resolveValue1,
  zoom,
  setZoom,
  rotation,
  setRotation,
  mediaFailed,
  kind,
  currentIndex,
  canNavigate,
  markdown,
  handleKeyDown,
  handleDownload,
  focusFinal,
}: ReturnType<typeof useFilePreviewActions>) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          focusFinal();
          onClose();
        }
      }}
    >
      <DialogContent
        size="full"
        onKeyDown={handleKeyDown}
        finalFocus={focusFinal}
        showCloseButton={false}
        scrollable
        className="h-full max-h-full gap-0 p-0"
      >
        <div
          data-slot="file-upload-preview-toolbar"
          className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-6"
        >
          <div className="min-w-0 flex-1 basis-48 space-y-1">
            <DialogTitle className="text-base leading-6 wrap-anywhere">
              {file.file.name}
            </DialogTitle>
            <DialogDescription className="wrap-break-word text-sm leading-5">
              {formatFileSize(file.file.size)} &bull;{" "}
              {file.file.type || "Unknown type"}
              {canNavigate
                ? ` \u2022 ${currentIndex + 1} of ${files.length}`
                : ""}
            </DialogDescription>
          </div>
          <div className="flex max-w-full flex-wrap items-center gap-1">
            {kind === "image" &&
              renderPreviewDialogContentSectionPart4({
                zoom,
                setZoom,
                setRotation,
              })}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Download ${file.file.name}`}
              onClick={handleDownload}
            >
              <IconDownload aria-hidden="true" />
            </Button>
            <DialogClose
              type="button"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-[color,background-color,transform] hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none motion-reduce:active:scale-100"
              aria-label="Close preview"
            >
              <IconX aria-hidden="true" className="h-4 w-4" />
            </DialogClose>
          </div>
        </div>
        {renderPreviewDialogContentSectionPart5({
          markdown,
          resolveValue1,
          kind,
          mediaFailed,
          zoom,
          rotation,
        })}
        {canNavigate && renderPreviewDialogContentSectionPart6({ onNavigate })}
      </DialogContent>
    </Dialog>
  );
}

type finishFileUploadAttemptArgs = {
  token: number;
  attemptTokenRef: ReturnType<typeof useFileUploadState8>["attemptTokenRef"];
  perFileBusyRef: ReturnType<typeof useFileUploadState8>["perFileBusyRef"];
  setPerFileBusy: ReturnType<typeof useFileUploadState8>["setPerFileBusy"];
  entriesRef: ReturnType<typeof useFileUploadState8>["entriesRef"];
  disabled: ReturnType<typeof useFileUploadState8>["disabled"];
  startAttempt: (entryId: string) => Promise<void>;
};

function finishFileUploadAttempt({
  token,
  attemptTokenRef,
  perFileBusyRef,
  setPerFileBusy,
  entriesRef,
  disabled,
  startAttempt,
}: finishFileUploadAttemptArgs) {
  if (token === attemptTokenRef.current) {
    perFileBusyRef.current = false;
    setPerFileBusy(false);

    // Sequential run: start the next idle item in selection order.
    const next = entriesRef.current.find((e) => e.status === "idle");

    if (next && !disabled) {
      void startAttempt(next.id);
    }
  }
}

type canUploadFileBatchArgs = {
  state: ReturnType<typeof useFileUploadState10>;
};

function canUploadFileBatch({ state }: canUploadFileBatchArgs) {
  return (
    state.transportMode === "batch" &&
    !state.disabled &&
    !state.batchBusy &&
    state.entries.length > 0
  );
}

type canUploadFilesIndividuallyArgs = {
  state: ReturnType<typeof useFileUploadState10>;
  idleCount: number;
};

function canUploadFilesIndividually({
  state,
  idleCount,
}: canUploadFilesIndividuallyArgs) {
  return (
    state.transportMode === "perFile" &&
    !state.disabled &&
    !state.perFileBusy &&
    idleCount > 0
  );
}

type useFileUploadAnnouncementArgs = {
  setRejections: ReturnType<typeof useFileUploadState4>["setRejections"];
  onFilesRejected: ReturnType<typeof useFileUploadState4>["onFilesRejected"];
  setStatusMessage: ReturnType<typeof useFileUploadState4>["setStatusMessage"];
};

function useFileUploadAnnouncement({
  setRejections,
  onFilesRejected,
  setStatusMessage,
}: useFileUploadAnnouncementArgs) {
  return React.useCallback(
    (acceptedCount: number, rejected: FileRejection[]) => {
      setRejections(rejected);

      if (rejected.length > 0) {
        onFilesRejected?.(rejected);
      }

      const acceptedText =
        acceptedCount === 1 ? "1 file added" : `${acceptedCount} files added`;

      let rejectedText = "";

      if (rejected.length === 1) {
        rejectedText = "1 file rejected";
      } else if (rejected.length > 0) {
        rejectedText = `${rejected.length} files rejected`;
      }

      let message = "";

      if (rejected.length > 0) {
        message = `${acceptedText}. ${rejectedText}.`;
      } else if (acceptedCount > 0) {
        message = `${acceptedText}.`;
      }

      setStatusMessage(message);
    },
    [onFilesRejected, setRejections, setStatusMessage],
  );
}

type subscribeFileUploadResetArgs = {
  inputRef: ReturnType<typeof useFileUploadState6>["inputRef"];
  entriesRef: ReturnType<typeof useFileUploadState6>["entriesRef"];
  setPreviewId: ReturnType<typeof useFileUploadState6>["setPreviewId"];
  setRejections: ReturnType<typeof useFileUploadState6>["setRejections"];
  setStatusMessage: ReturnType<typeof useFileUploadState6>["setStatusMessage"];
  setBatchBusy: ReturnType<typeof useFileUploadState6>["setBatchBusy"];
  setPerFileBusy: ReturnType<typeof useFileUploadState6>["setPerFileBusy"];
  defaultValueRef: React.RefObject<File[] | undefined>;
  allocateId: ReturnType<typeof useFileUploadState6>["allocateId"];
  controlledRef: React.RefObject<boolean>;
  onValueChange: ReturnType<typeof useFileUploadState6>["onValueChange"];
  onFilesChange: ReturnType<typeof useFileUploadState6>["onFilesChange"];
  setUncontrolledEntries: ReturnType<
    typeof useFileUploadState6
  >["setUncontrolledEntries"];
};

function subscribeFileUploadReset({
  inputRef,
  entriesRef,
  setPreviewId,
  setRejections,
  setStatusMessage,
  setBatchBusy,
  setPerFileBusy,
  defaultValueRef,
  allocateId,
  controlledRef,
  onValueChange,
  onFilesChange,
  setUncontrolledEntries,
}: subscribeFileUploadResetArgs) {
  const input = inputRef.current;

  if (!input) return;
  const form = input.form;

  if (!form) return;

  const handleReset = (event: Event) => {
    // Honor a canceled reset: defer mutation until after dispatch completes.
    if (event.defaultPrevented) return;
    queueMicrotask(() => {
      if (event.defaultPrevented) return;
      entriesRef.current.forEach((e) => e.abortController?.abort());
      setPreviewId(null);
      setRejections([]);
      setStatusMessage("");
      setBatchBusy(false);
      setPerFileBusy(false);
      const originals = defaultValueRef.current ?? [];

      const run = (): InternalEntry[] =>
        originals.map((f) => ({
          id: allocateId(),
          file: f,
          status: "idle" as const,
        }));

      if (controlledRef.current) {
        // Controlled: propose reset through callbacks; parent value stays truth.
        onValueChange?.(originals);
        onFilesChange?.(
          originals.map((f) => ({
            id: allocateId(),
            file: f,
            status: "idle" as const,
          })),
        );
      } else {
        const next = run();
        setUncontrolledEntries(next);
        onValueChange?.(originals);
        onFilesChange?.(next.map(toPublicEntry));
      }
    });
  };

  form.addEventListener("reset", handleReset);

  return () => form.removeEventListener("reset", handleReset);
}
