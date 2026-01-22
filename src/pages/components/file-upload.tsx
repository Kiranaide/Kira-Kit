import * as React from "react";
import { IconUpload, IconPhoto, IconVideo } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";
import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadPage() {
  const handleUpload = React.useCallback(async (uploadedFiles: File[]) => {
    console.log("Uploading files:", uploadedFiles);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Uploaded ${uploadedFiles.length} file(s)!`);
  }, []);

  const basicCode = `const handleUpload = async (files: File[]) => {
  console.log("Uploading files:", files);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert(\`Uploaded \${files.length} file(s)!\`);
};

<FileUpload
  multiple
  onFilesChange={(f) => console.log("Files:", f)}
  onUpload={handleUpload}
/>`;

  const imagesCode = `<FileUpload
  accept="image/*"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
  onFilesChange={(f) => console.log("Images:", f)}
/>`;

  const videosCode = `<FileUpload
  accept="video/*"
  multiple
  maxSize={50 * 1024 * 1024} // 50MB
  onFilesChange={(f) => console.log("Videos:", f)}
/>`;

  const singleCode = `<FileUpload onFilesChange={(f) => console.log("Single file:", f)} />`;

  return (
    <ComponentPage>
      <PageHeader
        title="File Upload"
        description="Drag and drop file upload component with image and video preview, progress tracking, and keyboard navigation support."
        version="1.0.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Drag & Drop",
            description: "Intuitive drag and drop interface with visual feedback and file validation.",
            icon: <IconUpload className="h-5 w-5" />,
          },
          {
            title: "Media Preview",
            description: "Built-in image and video preview with zoom, rotate, and playback controls.",
            icon: <IconPhoto className="h-5 w-5" />,
          },
          {
            title: "File Validation",
            description: "Accept types, size limits, and max file count with error handling.",
            icon: <IconVideo className="h-5 w-5" />,
          },
        ]}
      />

      <DemoTabs
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Upload"
                description="Multiple file upload with custom upload handler."
                code={basicCode}
              >
                <FileUpload
                  multiple
                  onFilesChange={(f) => console.log("Files:", f)}
                  onUpload={handleUpload}
                />
              </DemoWrapper>
            ),
          },
          {
            value: "images",
            label: "Images",
            demo: (
              <DemoWrapper
                title="Images Only"
                description="Upload images only with 5MB size limit."
                code={imagesCode}
              >
                <FileUpload
                  accept="image/*"
                  multiple
                  maxSize={5 * 1024 * 1024}
                  onFilesChange={(f) => console.log("Images:", f)}
                />
              </DemoWrapper>
            ),
          },
          {
            value: "videos",
            label: "Videos",
            demo: (
              <DemoWrapper
                title="Videos Only"
                description="Upload videos only with 50MB size limit."
                code={videosCode}
              >
                <FileUpload
                  accept="video/*"
                  multiple
                  maxSize={50 * 1024 * 1024}
                  onFilesChange={(f) => console.log("Videos:", f)}
                />
              </DemoWrapper>
            ),
          },
          {
            value: "single",
            label: "Single File",
            demo: (
              <DemoWrapper
                title="Single File"
                description="Single file upload without multiple selection."
                code={singleCode}
              >
                <FileUpload onFilesChange={(f) => console.log("Single file:", f)} />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Escape", description: "Close preview modal" },
          { keys: "← / →", description: "Navigate between files in preview" },
          { keys: "+ / -", description: "Zoom in/out (images)" },
          { keys: "R", description: "Rotate image (images)" },
        ]}
        title="Preview Navigation"
        description="Keyboard shortcuts for the preview modal"
      />

      <UsageBlock
        code={`import { FileUpload, type UploadedFile } from "@/components/ui/file-upload"

const [files, setFiles] = useState<UploadedFile[]>([])

const handleUpload = async (files: File[]) => {
  // Upload logic here
}

// Basic
<FileUpload
  multiple
  onFilesChange={setFiles}
  onUpload={handleUpload}
/>

// Images only with size limit
<FileUpload
  accept="image/*"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
  maxFiles={10}
/>`}
        title="Usage"
        description="Basic implementation example with common configurations"
      />

      <APIReference
        sections={[
          {
            title: "FileUpload",
            props: [
              {
                prop: "accept",
                type: "string",
                default: "undefined",
                description: "Accepted file types (e.g., 'image/*', 'video/*', '.pdf')",
              },
              {
                prop: "multiple",
                type: "boolean",
                default: "false",
                description: "Allow multiple file selection",
              },
              {
                prop: "maxSize",
                type: "number",
                default: "10485760",
                description: "Maximum file size in bytes (default: 10MB)",
              },
              {
                prop: "maxFiles",
                type: "number",
                default: "10",
                description: "Maximum number of files allowed",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disable the upload component",
              },
              {
                prop: "enablePreview",
                type: "boolean",
                default: "true",
                description: "Enable preview modal for images and videos",
              },
              {
                prop: "onFilesChange",
                type: "(files: UploadedFile[]) => void",
                default: "undefined",
                description: "Callback when files are added or removed",
              },
              {
                prop: "onUpload",
                type: "(files: File[]) => Promise<void>",
                default: "undefined",
                description: "Upload handler called when upload button is clicked",
              },
            ],
          },
          {
            title: "UploadedFile",
            props: [
              {
                prop: "id",
                type: "string",
                default: "-",
                description: "Unique identifier for the file",
              },
              {
                prop: "file",
                type: "File",
                default: "-",
                description: "The original File object",
              },
              {
                prop: "preview",
                type: "string | undefined",
                default: "undefined",
                description: "Preview URL for images and videos",
              },
              {
                prop: "progress",
                type: "number | undefined",
                default: "undefined",
                description: "Upload progress percentage (0-100)",
              },
              {
                prop: "error",
                type: "string | undefined",
                default: "undefined",
                description: "Error message if file validation failed",
              },
            ],
          },
        ]}
        title="API Reference"
        description="Component props and types for FileUpload"
      />
    </ComponentPage>
  );
}
