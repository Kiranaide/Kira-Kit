import { useState, useMemo } from "react"
import {
  IconGitCommit,
  IconGitPullRequest,
  IconGitMerge,
  IconBug,
  IconRocket,
  IconCircleCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconMessage,
  IconAccessible,
  IconDatabase,
  IconActivity,
} from "@tabler/icons-react"

import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineActions,
  TimelineAvatar,
  type TimelineItemData,
} from "@/components/ui/timeline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

const activityItems: TimelineItemData[] = [
  {
    id: "1",
    datetime: new Date(Date.now() - 1000 * 60 * 5),
    title: "New deployment started",
    description: "Production deployment v2.4.0 initiated by CI/CD pipeline",
    icon: <IconRocket className="h-3 w-3" />,
    status: "info",
  },
  {
    id: "2",
    datetime: new Date(Date.now() - 1000 * 60 * 30),
    title: "Pull request merged",
    description: "Feature: Add user authentication flow #234",
    icon: <IconGitMerge className="h-3 w-3" />,
    status: "success",
  },
  {
    id: "3",
    datetime: new Date(Date.now() - 1000 * 60 * 60),
    title: "Build warning detected",
    description: "Deprecated API usage in auth module",
    icon: <IconAlertTriangle className="h-3 w-3" />,
    status: "warning",
  },
  {
    id: "4",
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    title: "Bug fix committed",
    description: "Fixed memory leak in data fetching hook",
    icon: <IconBug className="h-3 w-3" />,
    status: "success",
  },
  {
    id: "5",
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    title: "Code review completed",
    description: "All changes approved by 2 reviewers",
    icon: <IconCircleCheck className="h-3 w-3" />,
    status: "success",
  },
]

const gitHistory: TimelineItemData[] = [
  {
    id: "commit-1",
    datetime: new Date(Date.now() - 1000 * 60 * 10),
    title: "feat: Add spotlight command palette",
    description: "Implement WCAG 2.2 compliant command palette with GSAP animations",
    icon: <IconGitCommit className="h-3 w-3" />,
    status: "default",
    avatar: { src: "", alt: "John Doe", fallback: "JD" },
  },
  {
    id: "commit-2",
    datetime: new Date(Date.now() - 1000 * 60 * 45),
    title: "fix: Resolve stepper keyboard navigation",
    description: "Arrow keys now properly navigate between steps",
    icon: <IconGitCommit className="h-3 w-3" />,
    status: "default",
    avatar: { src: "", alt: "Jane Smith", fallback: "JS" },
  },
  {
    id: "pr-1",
    datetime: new Date(Date.now() - 1000 * 60 * 120),
    title: "PR #156: Timeline component enhancements",
    description: "Added virtualization, horizontal layout, and grouping",
    icon: <IconGitPullRequest className="h-3 w-3" />,
    status: "success",
    avatar: { src: "", alt: "Mike Johnson", fallback: "MJ" },
  },
]

const generateManyItems = (count: number): TimelineItemData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    datetime: new Date(Date.now() - 1000 * 60 * 60 * i),
    title: `Event #${i + 1}`,
    description: `This is event number ${i + 1} in the timeline`,
    status: (["default", "success", "warning", "error", "info"] as const)[i % 5],
  }))
}

function BasicDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date(Date.now() - 1000 * 60 * 5)} relative />
          <TimelineTitle>Project kickoff meeting</TimelineTitle>
          <TimelineDescription>Initial planning session with stakeholders completed.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date(Date.now() - 1000 * 60 * 60)} relative />
          <TimelineTitle>Design review</TimelineTitle>
          <TimelineDescription>UI/UX designs approved by the team.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot status="active" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>Development in progress</TimelineTitle>
          <TimelineDescription>Currently implementing core features.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Testing phase</TimelineTitle>
          <TimelineDescription>Scheduled for next week.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

const basicCode = `import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline"

export function BasicTimelineDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>Project kickoff meeting</TimelineTitle>
          <TimelineDescription>Initial planning session completed.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot status="active" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>Development in progress</TimelineTitle>
          <TimelineDescription>Currently implementing core features.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}`

function DataDrivenDemo() {
  return (
    <Timeline
      items={activityItems}
      size="lg"
      animate
    />
  )
}

const dataDrivenCode = `import { Timeline, type TimelineItemData } from "@/components/ui/timeline"

const items: TimelineItemData[] = [
  {
    id: "1",
    datetime: new Date(Date.now() - 1000 * 60 * 5),
    title: "New deployment started",
    description: "Production deployment v2.4.0 initiated",
    status: "info",
  },
  {
    id: "2",
    datetime: new Date(Date.now() - 1000 * 60 * 30),
    title: "Pull request merged",
    description: "Feature: Add user authentication flow #234",
    status: "success",
  },
]

export function DataDrivenTimelineDemo() {
  return (
    <Timeline
      items={items}
      size="lg"
      animate
    />
  )
}`

function StatusVariantsDemo() {
  return (
    <Timeline>
      {(["default", "success", "warning", "error", "info"] as const).map((status) => (
        <TimelineItem key={status} status={status}>
          <TimelineDot status={status}>
            {status === "success" && <IconCircleCheck className="h-3 w-3" />}
            {status === "warning" && <IconAlertTriangle className="h-3 w-3" />}
            {status === "error" && <IconBug className="h-3 w-3" />}
            {status === "info" && <IconInfoCircle className="h-3 w-3" />}
          </TimelineDot>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle className="capitalize">{status} Status</TimelineTitle>
            <TimelineDescription>This is an example of a {status} timeline item.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

const statusVariantsCode = `import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline"
import { IconCircleCheck, IconAlertTriangle, IconInfoCircle, IconBug } from "@tabler/icons-react"

export function StatusVariantsDemo() {
  const statuses = ["default", "success", "warning", "error", "info"] as const

  return (
    <Timeline>
      {statuses.map((status) => (
        <TimelineItem key={status} status={status}>
          <TimelineDot status={status}>
            {status === "success" && <IconCircleCheck className="h-3 w-3" />}
            {status === "warning" && <IconAlertTriangle className="h-3 w-3" />}
            {status === "error" && <IconBug className="h-3 w-3" />}
            {status === "info" && <IconInfoCircle className="h-3 w-3" />}
          </TimelineDot>
          <TimelineConnector />
          <TimelineContent>
            <TimelineTitle className="capitalize">{status} Status</TimelineTitle>
            <TimelineDescription>This is an example of a {status} timeline item.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}`

function WithAvatarsDemo() {
  return (
    <Timeline>
      {gitHistory.map((item) => (
        <TimelineItem key={item.id} status={item.status}>
          <TimelineDot status={item.status}>{item.icon}</TimelineDot>
          <TimelineConnector />
          <TimelineContent>
            <div className="flex items-start gap-3">
              {item.avatar && (
                <TimelineAvatar
                  src={item.avatar.src}
                  alt={item.avatar.alt}
                  fallback={item.avatar.fallback}
                />
              )}
              <div className="flex-1">
                <TimelineTime datetime={item.datetime!} relative />
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineDescription>{item.description}</TimelineDescription>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

const withAvatarsCode = `import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineAvatar,
  type TimelineItemData,
} from "@/components/ui/timeline"

const gitHistory: TimelineItemData[] = [
  {
    id: "commit-1",
    datetime: new Date(),
    title: "feat: Add spotlight command palette",
    description: "Implement WCAG 2.2 compliant command palette",
    status: "default",
    avatar: { alt: "John Doe", fallback: "JD" },
  },
]

export function WithAvatarsDemo() {
  return (
    <Timeline>
      {gitHistory.map((item) => (
        <TimelineItem key={item.id} status={item.status}>
          <TimelineDot status={item.status}>{item.icon}</TimelineDot>
          <TimelineConnector />
          <TimelineContent>
            <div className="flex items-start gap-3">
              {item.avatar && (
                <TimelineAvatar
                  src={item.avatar.src}
                  alt={item.avatar.alt}
                  fallback={item.avatar.fallback}
                />
              )}
              <div className="flex-1">
                <TimelineTime datetime={item.datetime!} relative />
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineDescription>{item.description}</TimelineDescription>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}`

function WithActionsDemo() {
  return (
    <Timeline>
      <TimelineItem status="info">
        <TimelineDot status="info">
          <IconMessage className="h-3 w-3" />
        </TimelineDot>
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>New comment on your PR</TimelineTitle>
          <TimelineDescription>"Great work on the accessibility improvements!"</TimelineDescription>
          <TimelineActions>
            <Button size="sm" variant="outline">View Comment</Button>
            <Button size="sm" variant="ghost">Reply</Button>
          </TimelineActions>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem status="warning">
        <TimelineDot status="warning">
          <IconAlertTriangle className="h-3 w-3" />
        </TimelineDot>
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date(Date.now() - 1000 * 60 * 30)} relative />
          <TimelineTitle>Security alert detected</TimelineTitle>
          <TimelineDescription>Dependency vulnerability found in package.json</TimelineDescription>
          <TimelineActions>
            <Button size="sm" variant="destructive">Fix Now</Button>
            <Button size="sm" variant="outline">Dismiss</Button>
          </TimelineActions>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

const withActionsCode = `import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineActions,
} from "@/components/ui/timeline"
import { Button } from "@/components/ui/button"
import { IconMessage, IconAlertTriangle } from "@tabler/icons-react"

export function WithActionsDemo() {
  return (
    <Timeline>
      <TimelineItem status="info">
        <TimelineDot status="info">
          <IconMessage className="h-3 w-3" />
        </TimelineDot>
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>New comment on your PR</TimelineTitle>
          <TimelineDescription>"Great work on the accessibility improvements!"</TimelineDescription>
          <TimelineActions>
            <Button size="sm" variant="outline">View Comment</Button>
            <Button size="sm" variant="ghost">Reply</Button>
          </TimelineActions>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}`

function CollapsibleDemo() {
  return (
    <Timeline collapsible>
      <TimelineItem collapsible defaultCollapsed={false}>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Expanded by default</TimelineTitle>
          <TimelineDescription>
            Click the chevron to collapse this item. This is a longer description
            that demonstrates how collapsible content works in the timeline component.
            You can include any content here including forms, lists, or other components.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem collapsible defaultCollapsed>
        <TimelineDot status="info" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Collapsed by default</TimelineTitle>
          <TimelineDescription>This content was hidden initially. Click to expand and see the full content.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Non-collapsible item</TimelineTitle>
          <TimelineDescription>This item doesn't have the collapsible prop.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

const collapsibleCode = `import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@/components/ui/timeline"

export function CollapsibleDemo() {
  return (
    <Timeline collapsible>
      <TimelineItem collapsible defaultCollapsed={false}>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Expanded by default</TimelineTitle>
          <TimelineDescription>Click the chevron to collapse this item.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem collapsible defaultCollapsed>
        <TimelineDot status="info" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Collapsed by default</TimelineTitle>
          <TimelineDescription>Click to expand and see the full content.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}`

function GroupedDemo() {
  const items = useMemo(() => [
    ...activityItems,
    {
      id: "yesterday-1",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      title: "Yesterday's event",
      description: "This happened yesterday",
      status: "success" as const,
    },
    {
      id: "last-week-1",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      title: "Last week's event",
      description: "This happened last week",
      status: "info" as const,
    },
  ], [])

  return (
    <Timeline
      items={items}
      groupBy="day"
      size="lg"
    />
  )
}

const groupedCode = `import { Timeline, type TimelineItemData } from "@/components/ui/timeline"

const items: TimelineItemData[] = [
  { id: "1", datetime: new Date(), title: "Today's event", status: "success" },
  { id: "2", datetime: new Date(Date.now() - 86400000), title: "Yesterday's event", status: "info" },
]

export function GroupedDemo() {
  return (
    <Timeline
      items={items}
      groupBy="day"
      size="lg"
    />
  )
}`

function VirtualizedDemo() {
  const [itemCount] = useState(1000)
  const items = useMemo(() => generateManyItems(itemCount), [itemCount])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Rendering <Badge variant="secondary">{itemCount}</Badge> items with virtualization.
        Only visible items are rendered for optimal performance.
      </p>
      <Timeline
        items={items}
        virtualized
        estimateSize={80}
        size="default"
      />
    </div>
  )
}

const virtualizedCode = `import { useState, useMemo } from "react"
import { Timeline, type TimelineItemData } from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"

const generateManyItems = (count: number): TimelineItemData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: \`item-\${i}\`,
    datetime: new Date(Date.now() - 1000 * 60 * 60 * i),
    title: \`Event #\${i + 1}\`,
    status: "default",
  }))
}

export function VirtualizedDemo() {
  const [itemCount] = useState(1000)
  const items = useMemo(() => generateManyItems(itemCount), [itemCount])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Rendering <Badge variant="secondary">{itemCount}</Badge> items with virtualization.
      </p>
      <Timeline
        items={items}
        virtualized
        estimateSize={80}
      />
    </div>
  )
}`

function ConnectorVariantsDemo() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {(["solid", "dashed", "gradient"] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <Badge variant="outline" className="mb-2">{variant}</Badge>
          <Timeline connectorVariant={variant}>
            <TimelineItem>
              <TimelineDot status="success" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>First</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot status="active" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Second</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot />
              <TimelineContent>
                <TimelineTitle>Third</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      ))}
    </div>
  )
}

const connectorVariantsCode = `import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
} from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"

export function ConnectorVariantsDemo() {
  const variants = ["solid", "dashed", "gradient"] as const

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {variants.map((variant) => (
        <div key={variant} className="space-y-2">
          <Badge variant="outline">{variant}</Badge>
          <Timeline connectorVariant={variant}>
            <TimelineItem>
              <TimelineDot status="success" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>First</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot status="active" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Second</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      ))}
    </div>
  )
}`

const usageCode = `import { Timeline, TimelineItem, TimelineDot, TimelineConnector, TimelineContent, TimelineTime, TimelineTitle, TimelineDescription } from "@/components/ui/timeline"

export default function App() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>Step completed</TimelineTitle>
          <TimelineDescription>Description of what happened.</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}`

export default function TimelinePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Timeline"
        description="A timeline component with multiple layouts, status variants, virtualization, GSAP animations, and full accessibility support."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description: "Semantic HTML with role='feed', proper ARIA attributes, and keyboard navigation.",
            icon: <IconAccessible className="h-4 w-4" />,
          },
          {
            title: "Virtualized",
            description: "Built-in @tanstack/react-virtual support for rendering 1000+ items efficiently.",
            icon: <IconDatabase className="h-4 w-4" />,
          },
          {
            title: "Flexible",
            description: "Data-driven or composition API, status variants, collapsible items, and grouping.",
            icon: <IconActivity className="h-4 w-4" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          { value: "basic", label: "Basic", demo: (
            <DemoWrapper
              title="Basic Timeline"
              description="Composition pattern with individual timeline items."
              code={basicCode}
            >
              <BasicDemo />
            </DemoWrapper>
          )},
          { value: "data", label: "Data Driven", demo: (
            <DemoWrapper
              title="Data-Driven Timeline"
              description="Pass an array of items for automatic rendering."
              code={dataDrivenCode}
            >
              <DataDrivenDemo />
            </DemoWrapper>
          )},
          { value: "status", label: "Status Variants", demo: (
            <DemoWrapper
              title="Status Variants"
              description="Default, success, warning, error, and info status indicators."
              code={statusVariantsCode}
            >
              <StatusVariantsDemo />
            </DemoWrapper>
          )},
          { value: "avatars", label: "With Avatars", demo: (
            <DemoWrapper
              title="With Avatars"
              description="Timeline items with user avatars (e.g., for git history)."
              code={withAvatarsCode}
            >
              <WithAvatarsDemo />
            </DemoWrapper>
          )},
          { value: "actions", label: "With Actions", demo: (
            <DemoWrapper
              title="With Actions"
              description="Timeline items with action buttons."
              code={withActionsCode}
            >
              <WithActionsDemo />
            </DemoWrapper>
          )},
          { value: "collapsible", label: "Collapsible", demo: (
            <DemoWrapper
              title="Collapsible Items"
              description="Timeline items that can be expanded/collapsed."
              code={collapsibleCode}
            >
              <CollapsibleDemo />
            </DemoWrapper>
          )},
          { value: "grouped", label: "Grouped", demo: (
            <DemoWrapper
              title="Grouped by Date"
              description="Automatically group items by day, week, month, or year."
              code={groupedCode}
            >
              <GroupedDemo />
            </DemoWrapper>
          )},
          { value: "virtualized", label: "Virtualized", demo: (
            <DemoWrapper
              title="Virtualized Timeline"
              description="Efficiently render thousands of items using virtualization."
              code={virtualizedCode}
            >
              <VirtualizedDemo />
            </DemoWrapper>
          )},
          { value: "connectors", label: "Connector Variants", demo: (
            <DemoWrapper
              title="Connector Variants"
              description="Solid, dashed, and gradient connector line styles."
              code={connectorVariantsCode}
            >
              <ConnectorVariantsDemo />
            </DemoWrapper>
          )},
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation example"
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "← / →", description: "Navigate items (horizontal timeline)" },
          { keys: "↑ / ↓", description: "Navigate items (vertical timeline)" },
          { keys: "Home", description: "Go to first item" },
          { keys: "End", description: "Go to last item" },
          { keys: "Enter / Space", description: "Activate collapsible item" },
        ]}
      />

      <APIReference
        sections={[
          {
            title: "Timeline",
            props: [
              { prop: "items", type: "TimelineItemData[]", default: "-", description: "Data-driven items array" },
              { prop: "orientation", type: "vertical | horizontal", default: "vertical", description: "Timeline layout direction" },
              { prop: "layout", type: "left | right | alternating | centered", default: "left", description: "Content position relative to dots" },
              { prop: "variant", type: "default | compact | minimal", default: "default", description: "Timeline style variant" },
              { prop: "size", type: "sm | default | lg | xl", default: "default", description: "Dot size" },
              { prop: "connectorVariant", type: "solid | dashed | gradient", default: "solid", description: "Connector line style" },
              { prop: "virtualized", type: "boolean", default: "false", description: "Enable virtual scrolling" },
              { prop: "estimateSize", type: "number", default: "120", description: "Estimated item height for virtualization" },
              { prop: "animate", type: "boolean", default: "true", description: "Enable GSAP animations" },
              { prop: "collapsible", type: "boolean", default: "false", description: "Enable collapsible items" },
              { prop: "groupBy", type: "day | week | month | year | function", default: "-", description: "Auto-group items by date" },
              { prop: "renderItem", type: "(item, index) => ReactNode", default: "-", description: "Custom item render function" },
            ],
          },
          {
            title: "TimelineItem",
            props: [
              { prop: "status", type: "default | success | warning | error | info", default: "default", description: "Item status for styling" },
              { prop: "collapsible", type: "boolean", default: "-", description: "Override parent collapsible setting" },
              { prop: "defaultCollapsed", type: "boolean", default: "false", description: "Initial collapsed state" },
            ],
          },
          {
            title: "TimelineDot",
            props: [
              { prop: "status", type: "default | success | warning | error | info | active", default: "-", description: "Override status from parent" },
              { prop: "size", type: "sm | default | lg | xl", default: "inherited", description: "Override parent size" },
            ],
          },
          {
            title: "TimelineConnector",
            props: [
              { prop: "variant", type: "solid | dashed | gradient", default: "inherited", description: "Override connector style from parent" },
            ],
          },
          {
            title: "TimelineContent",
            props: [
              { prop: "orientation", type: "vertical | horizontal", default: "inherited", description: "Override parent orientation" },
              { prop: "layout", type: "left | right | alternating | centered", default: "inherited", description: "Override parent layout" },
            ],
          },
          {
            title: "TimelineTime",
            props: [
              { prop: "datetime", type: "Date | string", default: "-", description: "Date/time value" },
              { prop: "format", type: "Intl.DateTimeFormatOptions", default: "{ dateStyle: 'medium', timeStyle: 'short' }", description: "Format options for display" },
              { prop: "relative", type: "boolean", default: "false", description: "Show relative time (e.g., '2 hours ago')" },
            ],
          },
          {
            title: "TimelineTitle",
            props: [
              { prop: "status", type: "inherited", default: "-", description: "Color changes based on item status (error = destructive)" },
            ],
          },
          {
            title: "TimelineDescription",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes" },
            ],
          },
          {
            title: "TimelineActions",
            props: [
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes" },
            ],
          },
          {
            title: "TimelineAvatar",
            props: [
              { prop: "src", type: "string", default: "-", description: "Image source URL" },
              { prop: "alt", type: "string", default: "-", description: "Alt text for accessibility" },
              { prop: "fallback", type: "string", default: "-", description: "Fallback text when image fails or missing" },
            ],
          },
          {
            title: "TimelineItemData",
            props: [
              { prop: "id", type: "string", default: "-", description: "Unique identifier for the item" },
              { prop: "datetime", type: "Date | string", default: "-", description: "Date/time of the event" },
              { prop: "title", type: "string", default: "-", description: "Item title" },
              { prop: "description", type: "string", default: "-", description: "Item description text" },
              { prop: "icon", type: "ReactNode", default: "-", description: "Icon to display in the dot" },
              { prop: "status", type: "default | success | warning | error | info", default: "-", description: "Status for styling" },
              { prop: "avatar", type: "{ src, alt, fallback }", default: "-", description: "User avatar information" },
              { prop: "actions", type: "ReactNode", default: "-", description: "Action buttons/links" },
              { prop: "collapsible", type: "boolean", default: "-", description: "Enable collapse for this item" },
              { prop: "defaultCollapsed", type: "boolean", default: "false", description: "Initial collapsed state" },
              { prop: "data", type: "T", default: "-", description: "Custom data attached to item" },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
