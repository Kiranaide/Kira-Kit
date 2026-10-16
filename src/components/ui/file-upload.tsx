import * as React from "react";
import { cn } from "@/lib/utils";
import {
  IconUpload,
  IconX,
  IconFile,
  IconPhoto,
  IconVideo,
  IconPlayerPlay,
  IconZoomIn,
  IconZoomOut,
  IconRotateClockwise,
  IconDownload,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  enablePreview?: boolean;
}

function FileUpload({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 10,
  disabled = false,
  className,
  onFilesChange,
  onUpload,
  enablePreview = true,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const [previewFile, setPreviewFile] = React.useState<UploadedFile | null>(
    null
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  const processFiles = React.useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadedFile[] = [];
      const filesArray = Array.from(fileList);

      for (const file of filesArray) {
        if (files.length + newFiles.length >= maxFiles) break;

        if (file.size > maxSize) {
          newFiles.push({
            id: crypto.randomUUID(),
            file,
            error: `File too large (max ${formatFileSize(maxSize)})`,
          });
          continue;
        }

        let preview: string | undefined;

        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          preview = URL.createObjectURL(file);
        }

        newFiles.push({
          id: crypto.randomUUID(),
          file,
          preview,
        });
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, maxFiles, maxSize, multiple, onFilesChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }

    e.target.value = "";
  };

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id);

    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }

    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleUpload = async () => {
    if (onUpload) {
      const validFiles = files.filter((f) => !f.error).map((f) => f.file);
      await onUpload(validFiles);
    }
  };

  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
        />

        <IconUpload className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">
          Drag & drop files here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {accept ? `Accepts: ${accept}` : "All file types"}
          {maxSize && ` • Max ${formatFileSize(maxSize)}`}
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              onRemove={removeFile}
              onPreview={enablePreview ? () => setPreviewFile(file) : undefined}
            />
          ))}
        </div>
      )}

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          allFiles={files}
          onClose={() => setPreviewFile(null)}
          onNavigate={(direction) => {
            const currentIndex = files.findIndex(
              (f) => f.id === previewFile.id
            );

            const newIndex =
              direction === "prev"
                ? (currentIndex - 1 + files.length) % files.length
                : (currentIndex + 1) % files.length;

            setPreviewFile(files[newIndex]);
          }}
        />
      )}

      {files.length > 0 && onUpload && (
        <button
          onClick={handleUpload}
          disabled={disabled || files.every((f) => f.error)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload {files.filter((f) => !f.error).length} file(s)
        </button>
      )}
    </div>
  );
}

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onPreview?: () => void;
}

function FilePreview({ file, onRemove, onPreview }: FilePreviewProps) {
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isImage = file.file.type.startsWith("image/");
  const isVideo = file.file.type.startsWith("video/");

  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }

      setVideoPlaying(!videoPlaying);
    }
  };

  return (
    <div
      className={cn(
        "relative group rounded-lg border overflow-hidden",
        file.error && "border-destructive",
        onPreview && "cursor-pointer hover:border-primary transition-colors"
      )}
      onClick={onPreview}
    >
      <div className="aspect-square bg-muted flex items-center justify-center">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.file.name}
            className="h-full w-full object-cover"
          />
        ) : isVideo && file.preview ? (
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              src={file.preview}
              className="h-full w-full object-cover"
              onEnded={() => setVideoPlaying(false)}
            />
            <button
              onClick={toggleVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:opacity-100"
            >
              {videoPlaying ? (
                <span className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                  <span className="h-4 w-1 bg-foreground rounded-sm mx-0.5" />
                  <span className="h-4 w-1 bg-foreground rounded-sm mx-0.5" />
                </span>
              ) : (
                <span className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                  <IconPlayerPlay className="h-5 w-5 text-foreground ml-1" />
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            {isVideo ? (
              <IconVideo className="h-8 w-8 text-muted-foreground mb-2" />
            ) : isImage ? (
              <IconPhoto className="h-8 w-8 text-muted-foreground mb-2" />
            ) : (
              <IconFile className="h-8 w-8 text-muted-foreground mb-2" />
            )}
            <span className="text-xs text-muted-foreground truncate max-w-full">
              {file.file.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-2">
        <p className="text-xs font-medium truncate" title={file.file.name}>
          {file.file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.file.size)}
        </p>
        {file.error && (
          <p className="text-xs text-destructive mt-1">{file.error}</p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file.id);
        }}
        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        aria-label="Remove file"
      >
        <IconX className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface FilePreviewModalProps {
  file: UploadedFile;
  allFiles: UploadedFile[];
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

function FilePreviewModal({
  file,
  allFiles,
  onClose,
  onNavigate,
}: FilePreviewModalProps) {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const modalRef = React.useRef<HTMLDivElement>(null);

  const isImage = file.file.type.startsWith("image/");
  const isVideo = file.file.type.startsWith("video/");
  const isAudio = file.file.type.startsWith("audio/");

  const currentIndex = allFiles.findIndex((f) => f.id === file.id);
  const canNavigate = allFiles.length > 1;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && canNavigate) {
        onNavigate("prev");
      } else if (e.key === "ArrowRight" && canNavigate) {
        onNavigate("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate, canNavigate]);

  React.useEffect(() => {
    const modal = modalRef.current;

    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;

    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTabKey as EventListener);

    return () =>
      modal.removeEventListener("keydown", handleTabKey as EventListener);
  }, []);

  const handleDownload = () => {
    const url = file.preview || URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file.name;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="File preview"
    >
      <div
        ref={modalRef}
        className="relative w-full h-full max-w-7xl max-h-[90vh] m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur rounded-t-lg border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{file.file.name}</h2>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.file.size)} •{" "}
              {file.file.type || "Unknown type"}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {isImage && (
              <>
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="p-2 rounded-md hover:bg-muted"
                  aria-label="Zoom out"
                >
                  <IconZoomOut className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="p-2 rounded-md hover:bg-muted"
                  aria-label="Zoom in"
                >
                  <IconZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-2 rounded-md hover:bg-muted"
                  aria-label="Rotate"
                >
                  <IconRotateClockwise className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={handleDownload}
              className="p-2 rounded-md hover:bg-muted"
              aria-label="Download file"
            >
              <IconDownload className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-muted"
              aria-label="Close preview"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {}
        <div className="flex-1 flex items-center justify-center p-4 bg-muted/30 overflow-hidden">
          {isImage && file.preview ? (
            <img
              src={file.preview}
              alt={file.file.name}
              className="max-w-full max-h-full object-contain transition-transform"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          ) : isVideo && file.preview ? (
            <video
              src={file.preview}
              controls
              className="max-w-full max-h-full"
              autoPlay
            />
          ) : isAudio && file.preview ? (
            <div className="w-full max-w-2xl space-y-4">
              <div className="flex items-center justify-center p-8 bg-background rounded-lg">
                <IconVideo className="h-24 w-24 text-muted-foreground" />
              </div>
              <audio src={file.preview} controls className="w-full" autoPlay />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">{file.file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.file.size)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <IconFile className="h-24 w-24 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">{file.file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.file.size)} •{" "}
                  {file.file.type || "Unknown type"}
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <IconDownload className="h-4 w-4" />
                Download
              </button>
            </div>
          )}
        </div>

        {}
        {canNavigate && (
          <>
            <button
              onClick={() => onNavigate("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
              aria-label="Previous file"
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
              aria-label="Next file"
            >
              <IconChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {}
        {canNavigate && (
          <div className="p-4 bg-background/80 backdrop-blur rounded-b-lg border-t text-center text-sm text-muted-foreground">
            {currentIndex + 1} of {allFiles.length}
          </div>
        )}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export { FileUpload, FilePreview };

export type { FileUploadProps, UploadedFile };
