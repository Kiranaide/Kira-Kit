import * as React from "react"
import {
  IconCurrencyDollar,
  IconUsers,
  IconShoppingCart,
  IconEye,
  IconDotsVertical,
  IconDownload,
  IconRefresh,
  IconChartLine,
  IconTrendingUp,
  IconPercentage,
  IconClock,
  IconTarget,
  IconActivity,
  IconSparkles,
  IconAccessible,
  IconLayoutDashboard,
} from "@tabler/icons-react"
import {
  StatsCard,
  StatsCardIcon,
  StatsCardHeader,
  StatsCardTitle,
  StatsCardAction,
  StatsCardValue,
  StatsCardTrend,
  StatsCardDescription,
  StatsCardProgress,
  StatsCardSpark,
  StatsCardSparkline,
  StatsCardFooter,
  StatsCardTimeRange,
  StatsCardSkeleton,
} from "@/components/ui/stats-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
} from "@/components/docs"

function RevenueDrawerContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">$12,345</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Last Month</p>
          <p className="text-2xl font-bold">$10,982</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Breakdown by Category</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Products</span>
            <span className="font-medium">$8,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Services</span>
            <span className="font-medium">$3,456</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subscriptions</span>
            <span className="font-medium">$655</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          Revenue has increased by 12.5% compared to last month. The primary driver
          was the launch of the new product line.
        </p>
      </div>
    </div>
  )
}

function BasicStatsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Total Revenue</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>New Users</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>2,847</StatsCardValue>
        <StatsCardTrend value={-3.2} />
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Conversion Rate</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>89.3%</StatsCardValue>
        <StatsCardTrend value={0.5} />
      </StatsCard>
    </div>
  )
}

const basicStatsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard>
  <StatsCardHeader>
    <StatsCardTitle>Total Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue>$12,345</StatsCardValue>
  <StatsCardTrend value={12.5} />
</StatsCard>`

function WithIconsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Revenue</StatsCardTitle>
            <StatsCardValue value={12345} format="currency" />
            <StatsCardTrend value={12.5} showSign />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Users</StatsCardTitle>
            <StatsCardValue value={2847} format="compact" />
            <StatsCardTrend value={8.2} showSign />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="warning">
            <IconShoppingCart className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Orders</StatsCardTitle>
            <StatsCardValue value={1234} format="number" />
            <StatsCardTrend value={-2.4} showSign />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="info">
            <IconEye className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Page Views</StatsCardTitle>
            <StatsCardValue value={45678} format="compact" />
            <StatsCardTrend value={15.3} showSign />
          </div>
        </div>
      </StatsCard>
    </div>
  )
}

const withIconsCode = `import { StatsCard, StatsCardIcon } from "@/components/ui/stats-card"

<StatsCard>
  <div className="flex items-start gap-4">
    <StatsCardIcon variant="primary">
      <IconCurrencyDollar className="h-5 w-5" />
    </StatsCardIcon>
    <div className="flex-1">
      <StatsCardTitle>Revenue</StatsCardTitle>
      <StatsCardValue value={12345} format="currency" />
      <StatsCardTrend value={12.5} showSign />
    </div>
  </div>
</StatsCard>`

function AllVariantsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard variant="default">
        <StatsCardHeader>
          <StatsCardTitle>Default</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard variant="outline">
        <StatsCardHeader>
          <StatsCardTitle>Outline</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard variant="filled">
        <StatsCardHeader>
          <StatsCardTitle>Filled</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard variant="gradient">
        <StatsCardHeader>
          <StatsCardTitle>Gradient</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard variant="interactive" onClick={() => alert("Card clicked!")}>
        <StatsCardHeader>
          <StatsCardTitle>Interactive (Click me!)</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard variant="glass">
        <StatsCardHeader>
          <StatsCardTitle>Glass</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>
    </div>
  )
}

const allVariantsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard variant="gradient">
  <StatsCardHeader>
    <StatsCardTitle>Gradient</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue>$12,345</StatsCardValue>
  <StatsCardTrend value={12.5} />
</StatsCard>`

function SizesDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard size="sm">
        <StatsCardHeader>
          <StatsCardTitle>Small</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue size="sm">$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard size="default">
        <StatsCardHeader>
          <StatsCardTitle>Default</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue size="default">$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard size="lg">
        <StatsCardHeader>
          <StatsCardTitle>Large</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue size="lg">$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
      </StatsCard>
    </div>
  )
}

const sizesCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard size="lg">
  <StatsCardValue size="lg">$12,345</StatsCardValue>
</StatsCard>`

function StatusIndicatorsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard status="success">
        <StatsCardHeader>
          <StatsCardTitle>Success</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$12,345</StatsCardValue>
        <StatsCardTrend value={12.5} />
        <StatsCardDescription>Target exceeded</StatsCardDescription>
      </StatsCard>

      <StatsCard status="warning">
        <StatsCardHeader>
          <StatsCardTitle>Warning</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$8,234</StatsCardValue>
        <StatsCardTrend value={-3.2} />
        <StatsCardDescription>Below target</StatsCardDescription>
      </StatsCard>

      <StatsCard status="error">
        <StatsCardHeader>
          <StatsCardTitle>Error</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$4,567</StatsCardValue>
        <StatsCardTrend value={-15.8} />
        <StatsCardDescription>Critical threshold</StatsCardDescription>
      </StatsCard>

      <StatsCard status="info">
        <StatsCardHeader>
          <StatsCardTitle>Info</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>$10,000</StatsCardValue>
        <StatsCardTrend value={0} />
        <StatsCardDescription>No change</StatsCardDescription>
      </StatsCard>
    </div>
  )
}

const statusIndicatorsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard status="success">
  <StatsCardHeader>
    <StatsCardTitle>Success</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue>$12,345</StatsCardValue>
  <StatsCardTrend value={12.5} />
  <StatsCardDescription>Target exceeded</StatsCardDescription>
</StatsCard>`

function InteractiveCardsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard
        variant="interactive"
        drawerTitle="Revenue Details"
        drawerDescription="Detailed breakdown of revenue metrics"
        drawerContent={<RevenueDrawerContent />}
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Total Revenue</StatsCardTitle>
            <StatsCardValue value={12345} format="currency" />
            <StatsCardTrend value={12.5} comparison="vs last month" />
          </div>
        </div>
        <StatsCardFooter>
          <StatsCardTimeRange>Click for details</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>

      <StatsCard
        variant="interactive"
        drawerTitle="User Analytics"
        drawerContent={
          <div className="space-y-4">
            <p className="text-muted-foreground">Detailed user metrics and analytics...</p>
          </div>
        }
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Active Users</StatsCardTitle>
            <StatsCardValue value={2847} format="compact" />
            <StatsCardTrend value={8.2} comparison="vs last week" />
          </div>
        </div>
        <StatsCardFooter>
          <StatsCardTimeRange>Click for details</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>

      <StatsCard
        variant="interactive"
        drawerTitle="Order Analytics"
        drawerContent={
          <div className="space-y-4">
            <p className="text-muted-foreground">Detailed order metrics and trends...</p>
          </div>
        }
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="warning">
            <IconShoppingCart className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Total Orders</StatsCardTitle>
            <StatsCardValue value={1234} format="number" />
            <StatsCardTrend value={-2.4} comparison="vs yesterday" />
          </div>
        </div>
        <StatsCardFooter>
          <StatsCardTimeRange>Click for details</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>
    </div>
  )
}

const interactiveCardsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard
  variant="interactive"
  drawerTitle="Revenue Details"
  drawerDescription="Detailed breakdown of revenue metrics"
  drawerContent={<RevenueDrawerContent />}
>
  <StatsCardTitle>Total Revenue</StatsCardTitle>
  <StatsCardValue value={12345} format="currency" />
  <StatsCardTrend value={12.5} comparison="vs last month" />
</StatsCard>`

function WithActionMenuDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Revenue</StatsCardTitle>
          <StatsCardAction>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <IconDownload className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconChartLine className="mr-2 h-4 w-4" />
                  View Chart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={12345} format="currency" />
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Users</StatsCardTitle>
          <StatsCardAction>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <IconDownload className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Refresh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={2847} format="compact" />
        <StatsCardTrend value={8.2} />
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Conversion</StatsCardTitle>
          <StatsCardAction>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <IconDownload className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={89.3} format="percentage" />
        <StatsCardTrend value={0.5} />
      </StatsCard>
    </div>
  )
}

const withActionMenuCode = `import { StatsCard, StatsCardAction } from "@/components/ui/stats-card"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

<StatsCard>
  <StatsCardHeader>
    <StatsCardTitle>Revenue</StatsCardTitle>
    <StatsCardAction>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
          <IconDotsVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Export</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StatsCardAction>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
</StatsCard>`

function LoadingStatesDemo() {
  const [loading, setLoading] = React.useState(false)

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Button onClick={toggleLoading} className="mb-4">
        {loading ? "Loading..." : "Simulate Loading"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard loading={loading}>
          <div className="flex items-start gap-4">
            <StatsCardIcon variant="primary">
              <IconCurrencyDollar className="h-5 w-5" />
            </StatsCardIcon>
            <div className="flex-1">
              <StatsCardTitle>Revenue</StatsCardTitle>
              <StatsCardValue value={12345} format="currency" />
              <StatsCardTrend value={12.5} />
            </div>
          </div>
        </StatsCard>

        <StatsCard loading={loading}>
          <StatsCardHeader>
            <StatsCardTitle>Users</StatsCardTitle>
          </StatsCardHeader>
          <StatsCardValue>2,847</StatsCardValue>
          <StatsCardTrend value={8.2} />
        </StatsCard>

        <StatsCardSkeleton showIcon />
        <StatsCardSkeleton showSparkline />
      </div>
    </div>
  )
}

const loadingStatesCode = `import { StatsCard, StatsCardSkeleton } from "@/components/ui/stats-card"

<StatsCard loading={loading}>
  <StatsCardHeader>
    <StatsCardTitle>Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
</StatsCard>

<StatsCardSkeleton showIcon />
<StatsCardSkeleton showSparkline />`

function ProgressGoalsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconTarget className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Sales Goal</StatsCardTitle>
            <StatsCardValue value={75000} format="currency" />
            <StatsCardProgress value={75} max={100} variant="success" />
            <StatsCardDescription>75% of $100,000 target</StatsCardDescription>
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="warning">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>User Signups</StatsCardTitle>
            <StatsCardValue value={450} format="number" />
            <StatsCardProgress value={45} max={100} variant="warning" />
            <StatsCardDescription>45% of 1,000 target</StatsCardDescription>
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="destructive">
            <IconActivity className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Server Uptime</StatsCardTitle>
            <StatsCardValue value={99.9} format="percentage" />
            <StatsCardProgress value={99.9} max={100} variant="success" showLabel />
          </div>
        </div>
      </StatsCard>
    </div>
  )
}

const progressGoalsCode = `import { StatsCard, StatsCardProgress } from "@/components/ui/stats-card"

<StatsCard>
  <StatsCardIcon variant="primary">
    <IconTarget className="h-5 w-5" />
  </StatsCardIcon>
  <div className="flex-1">
    <StatsCardTitle>Sales Goal</StatsCardTitle>
    <StatsCardValue value={75000} format="currency" />
    <StatsCardProgress value={75} max={100} variant="success" />
    <StatsCardDescription>75% of $100,000 target</StatsCardDescription>
  </div>
</StatsCard>`

function WithSparklinesDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Revenue</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue value={12345} format="currency" />
        <StatsCardTrend value={12.5} />
        <StatsCardSpark>
          <StatsCardSparkline
            data={[10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40]}
            trend="up"
          />
        </StatsCardSpark>
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Users</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue value={2847} format="compact" />
        <StatsCardTrend value={-3.2} />
        <StatsCardSpark>
          <StatsCardSparkline
            data={[40, 35, 38, 30, 28, 25, 27, 22, 20, 18, 15, 10]}
            trend="down"
          />
        </StatsCardSpark>
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Conversion</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue value={89.3} format="percentage" />
        <StatsCardTrend value={0.5} />
        <StatsCardSpark>
          <StatsCardSparkline
            data={[85, 87, 86, 88, 89, 88, 90, 89, 91, 90, 89, 89]}
            trend="neutral"
          />
        </StatsCardSpark>
      </StatsCard>
    </div>
  )
}

const withSparklinesCode = `import { StatsCard, StatsCardSpark, StatsCardSparkline } from "@/components/ui/stats-card"

<StatsCard>
  <StatsCardHeader>
    <StatsCardTitle>Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
  <StatsCardSpark>
    <StatsCardSparkline
      data={[10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40]}
      trend="up"
    />
  </StatsCardSpark>
</StatsCard>`

function ValueFormattingDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Currency (USD)</StatsCardTitle>
            <StatsCardValue value={12345.67} format="currency" currency="USD" decimals={2} />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconPercentage className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Percentage</StatsCardTitle>
            <StatsCardValue value={89.34} format="percentage" decimals={2} />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="warning">
            <IconTrendingUp className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Compact Number</StatsCardTitle>
            <StatsCardValue value={1234567} format="compact" />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="info">
            <IconClock className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Custom Formatter</StatsCardTitle>
            <StatsCardValue
              value={3.5}
              formatter={(v) => `${v} hours`}
            />
          </div>
        </div>
      </StatsCard>
    </div>
  )
}

const valueFormattingCode = `import { StatsCard, StatsCardValue } from "@/components/ui/stats-card"

<StatsCardValue value={12345.67} format="currency" currency="USD" decimals={2} />
<StatsCardValue value={89.34} format="percentage" decimals={2} />
<StatsCardValue value={1234567} format="compact" />
<StatsCardValue value={3.5} formatter={(v) => \`\${v} hours\`} />`

function AnimatedValuesDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Animated Currency</StatsCardTitle>
            <StatsCardValue value={12345} format="currency" animate animationDuration={1.5} />
            <StatsCardTrend value={12.5} />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Animated Number</StatsCardTitle>
            <StatsCardValue value={2847} format="number" animate />
            <StatsCardTrend value={8.2} />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="info">
            <IconPercentage className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Animated Percentage</StatsCardTitle>
            <StatsCardValue value={89.3} format="percentage" animate decimals={1} />
            <StatsCardTrend value={0.5} />
          </div>
        </div>
      </StatsCard>
    </div>
  )
}

const animatedValuesCode = `import { StatsCard, StatsCardValue } from "@/components/ui/stats-card"

<StatsCardValue
  value={12345}
  format="currency"
  animate
  animationDuration={1.5}
/>`

function RealtimeUpdatesDemo() {
  const [liveValue, setLiveValue] = React.useState(12345)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((prev) => prev + Math.floor(Math.random() * 100) - 50)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconActivity className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Live Revenue</StatsCardTitle>
            <StatsCardValue value={liveValue} format="currency" animate animationDuration={0.5} />
            <StatsCardTrend value={((liveValue - 12345) / 12345) * 100} />
            <StatsCardFooter>
              <StatsCardTimeRange>Live • Updates every 3s</StatsCardTimeRange>
            </StatsCardFooter>
          </div>
        </div>
      </StatsCard>

      <StatsCard variant="gradient">
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconTrendingUp className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Animated Live Value</StatsCardTitle>
            <StatsCardValue value={liveValue} format="compact" animate animationDuration={0.3} />
            <StatsCardSpark>
              <StatsCardSparkline
                data={[10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40]}
                trend="up"
              />
            </StatsCardSpark>
          </div>
        </div>
      </StatsCard>
    </div>
  )
}

const realtimeUpdatesCode = `import { useState, useEffect } from "react"
import { StatsCard, StatsCardValue } from "@/components/ui/stats-card"

function RealtimeUpdatesDemo() {
  const [liveValue, setLiveValue] = useState(12345)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((prev) => prev + Math.floor(Math.random() * 100) - 50)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <StatsCard>
      <StatsCardTitle>Live Revenue</StatsCardTitle>
      <StatsCardValue value={liveValue} format="currency" animate animationDuration={0.5} />
    </StatsCard>
  )
}`

function DashboardGridDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        variant="interactive"
        drawerTitle="Revenue Details"
        drawerContent={<RevenueDrawerContent />}
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Total Revenue</StatsCardTitle>
            <StatsCardValue value={12345} format="currency" animate />
            <StatsCardTrend value={12.5} showSign comparison="vs last month" />
          </div>
        </div>
        <StatsCardSpark>
          <StatsCardSparkline
            data={[10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40]}
            trend="up"
          />
        </StatsCardSpark>
        <StatsCardFooter>
          <StatsCardTimeRange>Updated 2 hours ago</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>

      <StatsCard
        variant="interactive"
        drawerTitle="User Analytics"
        drawerContent={<div className="p-4">User details...</div>}
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="destructive">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>New Users</StatsCardTitle>
            <StatsCardValue value={2847} format="compact" animate />
            <StatsCardTrend value={-3.2} showSign comparison="vs last month" />
          </div>
        </div>
        <StatsCardSpark>
          <StatsCardSparkline
            data={[40, 35, 38, 30, 28, 25, 27, 22, 20, 18, 15, 10]}
            trend="down"
          />
        </StatsCardSpark>
        <StatsCardFooter>
          <StatsCardTimeRange>Updated 1 hour ago</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>

      <StatsCard
        variant="interactive"
        drawerTitle="Conversion Analytics"
        drawerContent={<div className="p-4">Conversion details...</div>}
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconPercentage className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Conversion</StatsCardTitle>
            <StatsCardValue value={89.3} format="percentage" animate decimals={1} />
            <StatsCardTrend value={0.5} showSign comparison="vs last month" />
          </div>
        </div>
        <StatsCardSpark>
          <StatsCardSparkline
            data={[85, 87, 86, 88, 89, 88, 90, 89, 91, 90, 89, 89]}
            trend="neutral"
          />
        </StatsCardSpark>
        <StatsCardFooter>
          <StatsCardTimeRange>Updated 30 mins ago</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>

      <StatsCard
        variant="interactive"
        drawerTitle="Session Analytics"
        drawerContent={<div className="p-4">Session details...</div>}
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="info">
            <IconActivity className="h-5 w-5" />
          </StatsCardIcon>
          <div className="flex-1">
            <StatsCardTitle>Active Sessions</StatsCardTitle>
            <StatsCardValue value={1234} format="number" animate />
            <StatsCardTrend value={8.7} showSign comparison="vs yesterday" />
          </div>
        </div>
        <StatsCardSpark>
          <StatsCardSparkline
            data={[20, 22, 25, 24, 28, 30, 32, 35, 38, 40, 42, 45]}
            trend="up"
          />
        </StatsCardSpark>
        <StatsCardFooter>
          <StatsCardTimeRange>Live</StatsCardTimeRange>
        </StatsCardFooter>
      </StatsCard>
    </div>
  )
}

const dashboardGridCode = `import { StatsCard } from "@/components/ui/stats-card"

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatsCard variant="interactive">
    <StatsCardTitle>Total Revenue</StatsCardTitle>
    <StatsCardValue value={12345} format="currency" animate />
    <StatsCardTrend value={12.5} showSign comparison="vs last month" />
  </StatsCard>
  {/* More cards... */}
</div>`

function CompactDashboardDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatsCard size="sm">
        <StatsCardTitle>Revenue</StatsCardTitle>
        <StatsCardValue size="sm" value={12345} format="compact" />
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Users</StatsCardTitle>
        <StatsCardValue size="sm" value={2847} format="compact" />
        <StatsCardTrend value={8.2} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Orders</StatsCardTitle>
        <StatsCardValue size="sm" value={1234} format="compact" />
        <StatsCardTrend value={-2.4} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Conv.</StatsCardTitle>
        <StatsCardValue size="sm" value={89.3} format="percentage" decimals={0} />
        <StatsCardTrend value={0.5} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Sessions</StatsCardTitle>
        <StatsCardValue size="sm" value={5678} format="compact" />
        <StatsCardTrend value={15.3} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Bounce</StatsCardTitle>
        <StatsCardValue size="sm" value={32.1} format="percentage" decimals={0} />
        <StatsCardTrend value={-4.2} />
      </StatsCard>
    </div>
  )
}

const compactDashboardCode = `import { StatsCard } from "@/components/ui/stats-card"

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
  <StatsCard size="sm">
    <StatsCardTitle>Revenue</StatsCardTitle>
    <StatsCardValue size="sm" value={12345} format="compact" />
    <StatsCardTrend value={12.5} />
  </StatsCard>
</div>`

const usageCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard variant="gradient" status="success">
  <StatsCardHeader>
    <StatsCardTitle>Total Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
  <StatsCardTrend value={12.5} showSign comparison="vs last month" />
  <StatsCardDescription>Target exceeded by $2,345</StatsCardDescription>
</StatsCard>`

export default function StatsCardPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Stats Card"
        description="Display metrics with trends, sparklines, icons, and interactive features. WCAG 2.1 AA compliant with ARIA live regions."
        version="v2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Accessible",
            description: "WCAG 2.1 AA compliant with ARIA live regions for real-time updates, proper heading hierarchy, and keyboard navigation.",
            icon: <IconAccessible className="h-5 w-5 text-primary" />,
          },
          {
            title: "Animated",
            description: "GSAP-powered count-up animations with prefers-reduced-motion support. Smooth transitions for values and trends.",
            icon: <IconSparkles className="h-5 w-5 text-primary" />,
          },
          {
            title: "Flexible",
            description: "Multiple variants, sizes, status indicators, interactive drawers, action menus, and comprehensive value formatting.",
            icon: <IconLayoutDashboard className="h-5 w-5 text-primary" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic Stats",
            demo: (
              <DemoWrapper
                title="Basic Stats"
                description="Simple value with trend indicator"
                code={basicStatsCode}
              >
                <BasicStatsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "icons",
            label: "With Icons",
            demo: (
              <DemoWrapper
                title="With Icons"
                description="Icon variants for different metric types"
                code={withIconsCode}
              >
                <WithIconsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "variants",
            label: "All Variants",
            demo: (
              <DemoWrapper
                title="All Variants"
                description="Default, outline, filled, gradient, interactive, and glass styles"
                code={allVariantsCode}
              >
                <AllVariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sizes",
            label: "Sizes",
            demo: (
              <DemoWrapper
                title="Size Variants"
                description="Small, default, and large sizes"
                code={sizesCode}
              >
                <SizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "status",
            label: "Status Indicators",
            demo: (
              <DemoWrapper
                title="Status Indicators"
                description="Left border status colors for quick visual scanning"
                code={statusIndicatorsCode}
              >
                <StatusIndicatorsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "interactive",
            label: "Interactive Cards",
            demo: (
              <DemoWrapper
                title="Interactive Cards with Drawer"
                description="Click to open a drawer with detailed information"
                code={interactiveCardsCode}
              >
                <InteractiveCardsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "action",
            label: "With Action Menu",
            demo: (
              <DemoWrapper
                title="With Action Menu"
                description="Cards with dropdown action menus"
                code={withActionMenuCode}
              >
                <WithActionMenuDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "loading",
            label: "Loading States",
            demo: (
              <DemoWrapper
                title="Loading States"
                description="Skeleton loading demonstration"
                code={loadingStatesCode}
              >
                <LoadingStatesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "progress",
            label: "Progress & Goals",
            demo: (
              <DemoWrapper
                title="Progress & Goals"
                description="Target progress visualization"
                code={progressGoalsCode}
              >
                <ProgressGoalsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sparklines",
            label: "With Sparklines",
            demo: (
              <DemoWrapper
                title="With Sparklines"
                description="Visual trend using Recharts AreaChart"
                code={withSparklinesCode}
              >
                <WithSparklinesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "formatting",
            label: "Value Formatting",
            demo: (
              <DemoWrapper
                title="Value Formatting"
                description="Currency, percentage, compact number, and custom formatters"
                code={valueFormattingCode}
              >
                <ValueFormattingDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "animated",
            label: "Animated Values",
            demo: (
              <DemoWrapper
                title="Animated Values (GSAP)"
                description="Count-up animation using GSAP. Respects prefers-reduced-motion."
                code={animatedValuesCode}
              >
                <AnimatedValuesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "realtime",
            label: "Real-time Updates",
            demo: (
              <DemoWrapper
                title="Real-time Updates"
                description="Live data updates with ARIA live announcements (updates every 3 seconds)"
                code={realtimeUpdatesCode}
              >
                <RealtimeUpdatesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "dashboard",
            label: "Dashboard Grid",
            demo: (
              <DemoWrapper
                title="Dashboard Grid"
                description="Complete 4-card responsive layout with all features"
                code={dashboardGridCode}
              >
                <DashboardGridDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "compact",
            label: "Compact Dashboard",
            demo: (
              <DemoWrapper
                title="Compact Dashboard"
                description="Dense sm-size grid layout for data-heavy dashboards"
                code={compactDashboardCode}
              >
                <CompactDashboardDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Enter / Space", description: "Activate interactive cards" },
          { keys: "Tab", description: "Navigate between cards" },
          { keys: "Shift + Tab", description: "Navigate backwards" },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Basic implementation example"
        code={usageCode}
      />

      <APIReference
        sections={[
          {
            title: "StatsCard",
            props: [
              { prop: "variant", type: "'default' | 'outline' | 'filled' | 'gradient' | 'interactive' | 'glass'", default: "'default'", description: "Visual style variant of the card" },
              { prop: "size", type: "'sm' | 'default' | 'lg'", default: "'default'", description: "Size of the card" },
              { prop: "status", type: "'success' | 'warning' | 'error' | 'info'", default: "undefined", description: "Status indicator with left border color" },
              { prop: "loading", type: "boolean", default: "false", description: "Show skeleton loading state" },
              { prop: "onClick", type: "() => void", default: "undefined", description: "Click handler (for interactive variant)" },
              { prop: "drawerTitle", type: "string", default: "undefined", description: "Title for the drawer panel" },
              { prop: "drawerDescription", type: "string", default: "undefined", description: "Description for the drawer panel" },
              { prop: "drawerContent", type: "ReactNode", default: "undefined", description: "Content for the drawer panel" },
            ],
          },
          {
            title: "StatsCardIcon",
            props: [
              { prop: "variant", type: "'primary' | 'success' | 'warning' | 'error' | 'info' | 'destructive'", default: "'primary'", description: "Color variant of the icon wrapper" },
            ],
          },
          {
            title: "StatsCardTitle",
            props: [
              { prop: "asChild", type: "boolean", default: "false", description: "Merge with child element" },
            ],
          },
          {
            title: "StatsCardAction",
            props: [
              { prop: "asChild", type: "boolean", default: "false", description: "Merge with child element" },
            ],
          },
          {
            title: "StatsCardValue",
            props: [
              { prop: "value", type: "number", default: "undefined", description: "Numeric value for formatting" },
              { prop: "format", type: "'currency' | 'number' | 'percentage' | 'compact'", default: "undefined", description: "Format type for the value" },
              { prop: "currency", type: "string", default: "'USD'", description: "Currency code for currency formatting" },
              { prop: "decimals", type: "number", default: "0", description: "Number of decimal places" },
              { prop: "formatter", type: "(value: number) => string", default: "undefined", description: "Custom formatter function" },
              { prop: "animate", type: "boolean", default: "false", description: "Enable count-up animation" },
              { prop: "animationDuration", type: "number", default: "1", description: "Animation duration in seconds" },
              { prop: "size", type: "'sm' | 'default' | 'lg'", default: "inherited", description: "Size of the value text" },
            ],
          },
          {
            title: "StatsCardTrend",
            props: [
              { prop: "value", type: "number", default: "required", description: "Trend percentage value" },
              { prop: "showIcon", type: "boolean", default: "true", description: "Show trend icon" },
              { prop: "showSign", type: "boolean", default: "false", description: "Show + or - sign" },
              { prop: "comparison", type: "string", default: "undefined", description: "Comparison text (e.g., 'vs last month')" },
            ],
          },
          {
            title: "StatsCardDescription",
            props: [
              { prop: "asChild", type: "boolean", default: "false", description: "Merge with child element" },
            ],
          },
          {
            title: "StatsCardProgress",
            props: [
              { prop: "value", type: "number", default: "required", description: "Current progress value" },
              { prop: "max", type: "number", default: "100", description: "Maximum progress value" },
              { prop: "variant", type: "'primary' | 'success' | 'warning' | 'error' | 'info'", default: "'primary'", description: "Color variant of the progress bar" },
              { prop: "showLabel", type: "boolean", default: "false", description: "Show percentage label on progress bar" },
            ],
          },
          {
            title: "StatsCardSpark",
            props: [],
          },
          {
            title: "StatsCardSparkline",
            props: [
              { prop: "data", type: "number[]", default: "required", description: "Array of data points for the sparkline" },
              { prop: "trend", type: "'up' | 'down' | 'neutral'", default: "'neutral'", description: "Trend direction for color" },
              { prop: "height", type: "number", default: "40", description: "Height of the sparkline" },
            ],
          },
          {
            title: "StatsCardFooter",
            props: [],
          },
          {
            title: "StatsCardTimeRange",
            props: [
              { prop: "asChild", type: "boolean", default: "false", description: "Merge with child element" },
            ],
          },
          {
            title: "StatsCardSkeleton",
            props: [
              { prop: "showIcon", type: "boolean", default: "false", description: "Show icon skeleton" },
              { prop: "showSparkline", type: "boolean", default: "false", description: "Show sparkline skeleton" },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
