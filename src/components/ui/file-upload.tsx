import * as React from "react";
import { cn } from "@/lib/utils";
import {
  IconUpload,
  IconX,
  IconFile,
  IconPhoto,
  IconVideo,
  IconPlayerPlay,
} from "@tabler/icons-react";

// ============================================
// TYPES
// ============================================
export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
}

// ============================================
// FILE UPLOAD COMPONENT
// ============================================
function FileUpload({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
  className,
  onFilesChange,
  onUpload,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const processFiles = React.useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadedFile[] = [];
      const filesArray = Array.from(fileList);

      for (const file of filesArray) {
        if (files.length + newFiles.length >= maxFiles) break;

        // Check file size
        if (file.size > maxSize) {
          newFiles.push({
            id: crypto.randomUUID(),
            file,
            error: `File too large (max ${formatFileSize(maxSize)})`,
          });
          continue;
        }

        // Create preview for images and videos
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
    // Reset input value to allow selecting the same file again
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

  // Cleanup preview URLs on unmount
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
      {/* Drop Zone */}
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

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file) => (
            <FilePreview key={file.id} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}

      {/* Upload Button */}
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

// ============================================
// FILE PREVIEW COMPONENT
// ============================================
interface FilePreviewProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
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
        file.error && "border-destructive"
      )}
    >
      {/* Preview */}
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

      {/* File Info */}
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

      {/* Remove Button */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
      >
        <IconX className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export { FileUpload, FilePreview };
export type { FileUploadProps, UploadedFile };
