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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ============================================================================
// DEMO DATA
// ============================================================================

const activityItems: TimelineItemData[] = [
  {
    id: "1",
    datetime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    title: "New deployment started",
    description: "Production deployment v2.4.0 initiated by CI/CD pipeline",
    icon: <IconRocket className="h-3 w-3" />,
    status: "info",
  },
  {
    id: "2",
    datetime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    title: "Pull request merged",
    description: "Feature: Add user authentication flow #234",
    icon: <IconGitMerge className="h-3 w-3" />,
    status: "success",
  },
  {
    id: "3",
    datetime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    title: "Build warning detected",
    description: "Deprecated API usage in auth module",
    icon: <IconAlertTriangle className="h-3 w-3" />,
    status: "warning",
  },
  {
    id: "4",
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    title: "Bug fix committed",
    description: "Fixed memory leak in data fetching hook",
    icon: <IconBug className="h-3 w-3" />,
    status: "success",
  },
  {
    id: "5",
    datetime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
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

// Generate many items for virtualization demo
const generateManyItems = (count: number): TimelineItemData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    datetime: new Date(Date.now() - 1000 * 60 * 60 * i),
    title: `Event #${i + 1}`,
    description: `This is event number ${i + 1} in the timeline`,
    status: (["default", "success", "warning", "error", "info"] as const)[i % 5],
  }))
}

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

function BasicDemo() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date(Date.now() - 1000 * 60 * 5)} relative />
          <TimelineTitle>Project kickoff meeting</TimelineTitle>
          <TimelineDescription>
            Initial planning session with stakeholders completed.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot status="success" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date(Date.now() - 1000 * 60 * 60)} relative />
          <TimelineTitle>Design review</TimelineTitle>
          <TimelineDescription>
            UI/UX designs approved by the team.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot status="active" />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTime datetime={new Date()} relative />
          <TimelineTitle>Development in progress</TimelineTitle>
          <TimelineDescription>
            Currently implementing core features.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Testing phase</TimelineTitle>
          <TimelineDescription>
            Scheduled for next week.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

function DataDrivenDemo() {
  return (
    <Timeline
      items={activityItems}
      size="lg"
      animate
    />
  )
}

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
            <TimelineDescription>
              This is an example of a {status} timeline item.
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

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
          <TimelineDescription>
            "Great work on the accessibility improvements!"
          </TimelineDescription>
          <TimelineActions>
            <Button size="sm" variant="outline">
              View Comment
            </Button>
            <Button size="sm" variant="ghost">
              Reply
            </Button>
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
          <TimelineDescription>
            Dependency vulnerability found in package.json
          </TimelineDescription>
          <TimelineActions>
            <Button size="sm" variant="destructive">
              Fix Now
            </Button>
            <Button size="sm" variant="outline">
              Dismiss
            </Button>
          </TimelineActions>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

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
          <TimelineDescription>
            This content was hidden initially. Click to expand and see the full content.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineDot />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Non-collapsible item</TimelineTitle>
          <TimelineDescription>
            This item doesn't have the collapsible prop.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

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

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function TimelinePage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 py-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Timeline</h1>
          <Badge>Enhanced</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          A timeline component with multiple layouts, status variants, virtualization,
          GSAP animations, and full accessibility support.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Accessible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Semantic HTML with role="feed", proper ARIA attributes, and keyboard navigation.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Virtualized</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built-in @tanstack/react-virtual support for rendering 1000+ items efficiently.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flexible</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Data-driven or composition API, status variants, collapsible items, and grouping.
          </CardContent>
        </Card>
      </div>

      {/* Demos */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="data">Data-Driven</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="avatars">With Avatars</TabsTrigger>
          <TabsTrigger value="actions">With Actions</TabsTrigger>
          <TabsTrigger value="collapsible">Collapsible</TabsTrigger>
          <TabsTrigger value="grouped">Grouped</TabsTrigger>
          <TabsTrigger value="virtualized">Virtualized</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Timeline</CardTitle>
              <CardDescription>
                Composition pattern with individual timeline items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data-Driven Timeline</CardTitle>
              <CardDescription>
                Pass an array of items for automatic rendering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataDrivenDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Variants</CardTitle>
              <CardDescription>
                Default, success, warning, error, and info status indicators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusVariantsDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatars">
          <Card>
            <CardHeader>
              <CardTitle>With Avatars</CardTitle>
              <CardDescription>
                Timeline items with user avatars (e.g., for git history).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WithAvatarsDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>With Actions</CardTitle>
              <CardDescription>
                Timeline items with action buttons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WithActionsDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collapsible">
          <Card>
            <CardHeader>
              <CardTitle>Collapsible Items</CardTitle>
              <CardDescription>
                Timeline items that can be expanded/collapsed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CollapsibleDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grouped">
          <Card>
            <CardHeader>
              <CardTitle>Grouped by Date</CardTitle>
              <CardDescription>
                Automatically group items by day, week, month, or year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GroupedDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtualized">
          <Card>
            <CardHeader>
              <CardTitle>Virtualized Timeline</CardTitle>
              <CardDescription>
                Efficiently render thousands of items using virtualization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VirtualizedDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connectors">
          <Card>
            <CardHeader>
              <CardTitle>Connector Variants</CardTitle>
              <CardDescription>
                Solid, dashed, and gradient connector line styles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectorVariantsDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Key props and configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Prop</th>
                  <th className="py-2 text-left font-medium">Type</th>
                  <th className="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono text-xs">items</td>
                  <td className="py-2 text-muted-foreground">TimelineItemData[]</td>
                  <td className="py-2">Data-driven items array</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">orientation</td>
                  <td className="py-2 text-muted-foreground">vertical | horizontal</td>
                  <td className="py-2">Timeline layout direction</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">size</td>
                  <td className="py-2 text-muted-foreground">sm | default | lg | xl</td>
                  <td className="py-2">Dot size</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">connectorVariant</td>
                  <td className="py-2 text-muted-foreground">solid | dashed | gradient</td>
                  <td className="py-2">Connector line style</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">virtualized</td>
                  <td className="py-2 text-muted-foreground">boolean</td>
                  <td className="py-2">Enable virtual scrolling</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">groupBy</td>
                  <td className="py-2 text-muted-foreground">day | week | month | year</td>
                  <td className="py-2">Auto-group items by date</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-xs">collapsible</td>
                  <td className="py-2 text-muted-foreground">boolean</td>
                  <td className="py-2">Enable collapsible items</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
