import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadPage() {
  const handleUpload = async (uploadedFiles: File[]) => {
    console.log("Uploading files:", uploadedFiles);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Uploaded ${uploadedFiles.length} file(s)!`);
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">File Upload</h1>
        <p className="text-muted-foreground">
          Drag and drop file upload with image and video preview.
        </p>
      </header>

      {/* Basic Upload */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Upload
        </h2>
        <FileUpload
          multiple
          onFilesChange={(f) => console.log("Files:", f)}
          onUpload={handleUpload}
        />
      </section>

      {/* Images Only */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Images Only
        </h2>
        <FileUpload
          accept="image/*"
          multiple
          maxSize={5 * 1024 * 1024}
          onFilesChange={(f) => console.log("Images:", f)}
        />
      </section>

      {/* Videos Only */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Videos Only
        </h2>
        <FileUpload
          accept="video/*"
          multiple
          maxSize={50 * 1024 * 1024}
          onFilesChange={(f) => console.log("Videos:", f)}
        />
      </section>

      {/* Single File */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Single File
        </h2>
        <FileUpload onFilesChange={(f) => console.log("Single file:", f)} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { FileUpload, type UploadedFile } from "@/components/ui/file-upload"

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
          </pre>
        </div>
      </section>
    </div>
  );
}
