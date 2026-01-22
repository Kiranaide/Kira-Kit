import { IconCloudUpload } from "@tabler/icons-react"
import {
  Empty,
  EmptyInbox,
  EmptySearch,
  EmptyFile,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
} from "@/components/docs"

const basicCode = `import { Empty } from "@/components/ui/empty"

export function BasicEmptyDemo() {
  return (
    <Empty
      title="No data available"
      description="There's nothing here yet. Try adding some content."
    />
  )
}`

function BasicDemo() {
  return (
    <Empty
      title="No data available"
      description="There's nothing here yet. Try adding some content."
    />
  )
}

const iconsCode = `import { EmptyInbox, EmptySearch, EmptyFile } from "@/components/ui/empty"

export function IconPresetsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EmptyInbox description="Your inbox is empty" />
      <EmptySearch description="No results match your search" />
      <EmptyFile description="No files uploaded yet" />
      <Empty
        icon="alert"
        title="Error occurred"
        description="Something went wrong"
      />
    </div>
  )
}`

function IconsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EmptyInbox description="Your inbox is empty" />
      <EmptySearch description="No results match your search" />
      <EmptyFile description="No files uploaded yet" />
      <Empty
        icon="alert"
        title="Error occurred"
        description="Something went wrong"
      />
    </div>
  )
}

const customCode = `import { Empty } from "@/components/ui/empty"
import { IconCloudUpload } from "@tabler/icons-react"

export function CustomIconDemo() {
  return (
    <Empty
      icon={<IconCloudUpload className="h-12 w-12" strokeWidth={1.5} />}
      title="Upload files"
      description="Drag and drop files here or click to browse"
    />
  )
}`

function CustomDemo() {
  return (
    <Empty
      icon={<IconCloudUpload className="h-12 w-12" strokeWidth={1.5} />}
      title="Upload files"
      description="Drag and drop files here or click to browse"
    />
  )
}

const actionCode = `import { Empty } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export function ActionDemo() {
  return (
    <Empty
      icon="inbox"
      title="No projects"
      description="Get started by creating your first project"
      action={<Button>Create Project</Button>}
    />
  )
}`

function ActionDemo() {
  return (
    <Empty
      icon="inbox"
      title="No projects"
      description="Get started by creating your first project"
      action={<Button>Create Project</Button>}
    />
  )
}

const sizesCode = `import { Empty } from "@/components/ui/empty"

export function SizesDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Empty size="sm" title="Small" description="Compact empty state" />
      <Empty size="default" title="Default" description="Standard size" />
      <Empty size="lg" title="Large" description="For prominent display" />
    </div>
  )
}`

function SizesDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Empty size="sm" title="Small" description="Compact empty state" />
      <Empty size="default" title="Default" description="Standard size" />
      <Empty size="lg" title="Large" description="For prominent display" />
    </div>
  )
}

const usageCode = `import { Empty, EmptyInbox, EmptySearch } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

// Basic
<Empty
  icon="inbox"
  title="No data"
  description="Description text"
  action={<Button>Action</Button>}
/>

// Preset components
<EmptyInbox description="Your inbox is empty" />
<EmptySearch description="No results found" />

// Custom icon
<Empty icon={<CustomIcon />} title="Title" />`

export function EmptyPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Empty"
        description="Empty state placeholder for when there's no data to display."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Icon Presets",
            description: "Built-in icons for common empty states: inbox, search, file, and alert.",
          },
          {
            title: "Customizable",
            description: "Use custom icons, sizes, and action buttons to match your design.",
          },
          {
            title: "Accessible",
            description: "Proper ARIA attributes and semantic HTML for screen readers.",
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
                title="Basic Empty State"
                description="Simple empty state with title and description."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "icons",
            label: "Icons",
            demo: (
              <DemoWrapper
                title="Icon Presets"
                description="Pre-configured empty states with built-in icons."
                code={iconsCode}
              >
                <IconsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "custom",
            label: "Custom",
            demo: (
              <DemoWrapper
                title="Custom Icon"
                description="Use any React node as a custom icon."
                code={customCode}
              >
                <CustomDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "action",
            label: "Action",
            demo: (
              <DemoWrapper
                title="With Action Button"
                description="Add a call-to-action button to guide users."
                code={actionCode}
              >
                <ActionDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sizes",
            label: "Sizes",
            demo: (
              <DemoWrapper
                title="Size Variants"
                description="Small, default, and large sizes for different contexts."
                code={sizesCode}
              >
                <SizesDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples showing how to use the Empty component and its preset variants."
      />

      <APIReference
        sections={[
          {
            title: "Empty",
            props: [
              {
                prop: "icon",
                type: "string | ReactNode",
                default: "-",
                description: 'Icon name ("inbox" | "search" | "file" | "alert") or custom icon element.',
              },
              {
                prop: "title",
                type: "string",
                default: '"No data"',
                description: "Main heading text.",
              },
              {
                prop: "description",
                type: "string",
                default: "-",
                description: "Supporting description text.",
              },
              {
                prop: "action",
                type: "ReactNode",
                default: "-",
                description: "Action button or call-to-action element.",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Size variant for spacing and icon scale.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for styling.",
              },
            ],
          },
          {
            title: "EmptyInbox",
            props: [
              {
                prop: "title",
                type: "string",
                default: '"No messages"',
                description: "Main heading text for inbox state.",
              },
              {
                prop: "description",
                type: "string",
                default: "-",
                description: "Supporting description text.",
              },
              {
                prop: "action",
                type: "ReactNode",
                default: "-",
                description: "Action button element.",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Size variant.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "EmptySearch",
            props: [
              {
                prop: "title",
                type: "string",
                default: '"No results"',
                description: "Main heading text for search state.",
              },
              {
                prop: "description",
                type: "string",
                default: "-",
                description: "Supporting description text.",
              },
              {
                prop: "action",
                type: "ReactNode",
                default: "-",
                description: "Action button element.",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Size variant.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
          {
            title: "EmptyFile",
            props: [
              {
                prop: "title",
                type: "string",
                default: '"No files"',
                description: "Main heading text for file state.",
              },
              {
                prop: "description",
                type: "string",
                default: "-",
                description: "Supporting description text.",
              },
              {
                prop: "action",
                type: "ReactNode",
                default: "-",
                description: "Action button element.",
              },
              {
                prop: "size",
                type: '"sm" | "default" | "lg"',
                default: '"default"',
                description: "Size variant.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
