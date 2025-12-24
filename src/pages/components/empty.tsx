import {
  Empty,
  EmptyInbox,
  EmptySearch,
  EmptyFile,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { IconCloudUpload } from "@tabler/icons-react";

export function EmptyPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Empty</h1>
        <p className="text-muted-foreground">
          Empty state placeholder for when there's no data to display.
        </p>
      </header>

      {/* Basic Empty */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Empty State
        </h2>
        <div className="border border-border rounded-lg">
          <Empty
            title="No data available"
            description="There's nothing here yet. Try adding some content."
          />
        </div>
      </section>

      {/* Icon Presets */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Presets
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border rounded-lg">
            <EmptyInbox description="Your inbox is empty" />
          </div>
          <div className="border border-border rounded-lg">
            <EmptySearch description="No results match your search" />
          </div>
          <div className="border border-border rounded-lg">
            <EmptyFile description="No files uploaded yet" />
          </div>
          <div className="border border-border rounded-lg">
            <Empty
              icon="alert"
              title="Error occurred"
              description="Something went wrong"
            />
          </div>
        </div>
      </section>

      {/* Custom Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Icon
        </h2>
        <div className="border border-border rounded-lg">
          <Empty
            icon={<IconCloudUpload className="h-12 w-12" strokeWidth={1.5} />}
            title="Upload files"
            description="Drag and drop files here or click to browse"
          />
        </div>
      </section>

      {/* With Action */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Action Button
        </h2>
        <div className="border border-border rounded-lg">
          <Empty
            icon="inbox"
            title="No projects"
            description="Get started by creating your first project"
            action={<Button>Create Project</Button>}
          />
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-border rounded-lg">
            <Empty size="sm" title="Small" description="Compact empty state" />
          </div>
          <div className="border border-border rounded-lg">
            <Empty size="default" title="Default" description="Standard size" />
          </div>
          <div className="border border-border rounded-lg">
            <Empty
              size="lg"
              title="Large"
              description="For prominent display"
            />
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Empty, EmptyInbox, EmptySearch } from "@/components/ui/empty"

{/* Basic */}
<Empty
  icon="inbox" // inbox | file | search | alert
  title="No data"
  description="Description text"
  action={<Button>Action</Button>}
/>

{/* Preset components */}
<EmptyInbox description="Your inbox is empty" />
<EmptySearch description="No results found" />

{/* Custom icon */}
<Empty icon={<CustomIcon />} title="Title" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
