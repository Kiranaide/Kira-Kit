import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
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
} from "@tabler/icons-react";
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
} from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

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
          Revenue has increased by 12.5% compared to last month. The primary
          driver was the launch of the new product line.
        </p>
      </div>
    </div>
  );
}

function BasicStatsDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
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
  );
}

const basicStatsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard>
  <StatsCardHeader>
    <StatsCardTitle>Total Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue>$12,345</StatsCardValue>
  <StatsCardTrend value={12.5} />
</StatsCard>`;

function WithIconsDemo() {
  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Revenue</StatsCardTitle>
            <StatsCardValue value={12_345} format="currency" />
            <StatsCardTrend value={12.5} showSign />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
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
          <div className="min-w-0 flex-1">
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
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Page Views</StatsCardTitle>
            <StatsCardValue value={45_678} format="compact" />
            <StatsCardTrend value={15.3} showSign />
          </div>
        </div>
      </StatsCard>
    </div>
  );
}

const withIconsCode = `import { StatsCard, StatsCardIcon } from "@/components/ui/stats-card"

<StatsCard>
  <div className="flex items-start gap-4">
    <StatsCardIcon variant="primary">
      <IconCurrencyDollar className="h-5 w-5" />
    </StatsCardIcon>
    <div className="min-w-0 flex-1">
      <StatsCardTitle>Revenue</StatsCardTitle>
      <StatsCardValue value={12345} format="currency" />
      <StatsCardTrend value={12.5} showSign />
    </div>
  </div>
</StatsCard>`;

function AllVariantsDemo() {
  const [clicks, setClicks] = React.useState(0);

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <StatsCard
        variant="interactive"
        onClick={() => setClicks((count) => count + 1)}
      >
        <StatsCardHeader>
          <StatsCardTitle>
            Interactive {clicks > 0 ? `(${clicks} clicks)` : "(Click me!)"}
          </StatsCardTitle>
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
  );
}

const allVariantsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard variant="gradient">
  <StatsCardHeader>
    <StatsCardTitle>Gradient</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue>$12,345</StatsCardValue>
  <StatsCardTrend value={12.5} />
</StatsCard>`;

function SizesDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
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
  );
}

const sizesCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard size="lg">
  <StatsCardValue size="lg">$12,345</StatsCardValue>
</StatsCard>`;

function StatusIndicatorsDemo() {
  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
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
  );
}

const statusIndicatorsCode = `import { StatsCard } from "@/components/ui/stats-card"

<StatsCard status="success">
  <StatsCardHeader>
    <StatsCardTitle>Success</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue>$12,345</StatsCardValue>
  <StatsCardTrend value={12.5} />
  <StatsCardDescription>Target exceeded</StatsCardDescription>
</StatsCard>`;

function InteractiveCardsDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Total Revenue</StatsCardTitle>
            <StatsCardValue value={12_345} format="currency" />
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
            <p className="text-muted-foreground">
              Detailed user metrics and analytics...
            </p>
          </div>
        }
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
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
            <p className="text-muted-foreground">
              Detailed order metrics and trends...
            </p>
          </div>
        }
      >
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="warning">
            <IconShoppingCart className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
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
  );
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
</StatsCard>`;

function ActionMenuDropdown({
  showRefresh,
  showChart,
}: {
  showRefresh?: boolean;
  showChart?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <IconDotsVertical className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <IconDownload className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem>
        {showRefresh === true && (
          <DropdownMenuItem>
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </DropdownMenuItem>
        )}
        {showChart === true && (
          <DropdownMenuItem>
            <IconChartLine className="mr-2 h-4 w-4" />
            View Chart
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WithActionMenuDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Revenue</StatsCardTitle>
          <StatsCardAction>
            <ActionMenuDropdown showRefresh showChart />
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={12_345} format="currency" />
        <StatsCardTrend value={12.5} />
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Users</StatsCardTitle>
          <StatsCardAction>
            <ActionMenuDropdown showRefresh />
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={2847} format="compact" />
        <StatsCardTrend value={8.2} />
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Conversion</StatsCardTitle>
          <StatsCardAction>
            <ActionMenuDropdown />
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={89.3} format="percentage" />
        <StatsCardTrend value={0.5} />
      </StatsCard>
    </div>
  );
}

const withActionMenuCode = `import { StatsCard, StatsCardAction } from "@/components/ui/stats-card"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

<StatsCard>
  <StatsCardHeader>
    <StatsCardTitle>Revenue</StatsCardTitle>
    <StatsCardAction>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <IconDotsVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Export</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StatsCardAction>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
</StatsCard>`;

function LoadingStatesDemo() {
  const [loading, setLoading] = React.useState(false);

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      <Button onClick={toggleLoading}>
        {loading ? "Loading..." : "Simulate Loading"}
      </Button>

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard loading={loading}>
          <div className="flex items-start gap-4">
            <StatsCardIcon variant="primary">
              <IconCurrencyDollar className="h-5 w-5" />
            </StatsCardIcon>
            <div className="min-w-0 flex-1">
              <StatsCardTitle>Revenue</StatsCardTitle>
              <StatsCardValue value={12_345} format="currency" />
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
        <StatsCardSkeleton size="sm" />
        <StatsCardSkeleton size="lg" showIcon />
      </div>
    </div>
  );
}

const loadingStatesCode = `import { StatsCard, StatsCardSkeleton } from "@/components/ui/stats-card"

<StatsCard loading={loading}>
  <StatsCardHeader>
    <StatsCardTitle>Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
</StatsCard>

<StatsCardSkeleton showIcon />
<StatsCardSkeleton showSparkline />`;

function ProgressGoalsDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconTarget className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Sales Goal</StatsCardTitle>
            <StatsCardValue value={75_000} format="currency" />
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
          <div className="min-w-0 flex-1">
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
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Server Uptime</StatsCardTitle>
            <StatsCardValue value={99.9} format="percentage" />
            <StatsCardProgress
              value={99.9}
              max={100}
              variant="success"
              showLabel
            />
          </div>
        </div>
      </StatsCard>
    </div>
  );
}

const progressGoalsCode = `import { StatsCard, StatsCardProgress } from "@/components/ui/stats-card"

<StatsCard>
  <StatsCardIcon variant="primary">
    <IconTarget className="h-5 w-5" />
  </StatsCardIcon>
  <div className="min-w-0 flex-1">
    <StatsCardTitle>Sales Goal</StatsCardTitle>
    <StatsCardValue value={75000} format="currency" />
    <StatsCardProgress value={75} max={100} variant="success" />
    <StatsCardDescription>75% of $100,000 target</StatsCardDescription>
  </div>
</StatsCard>`;

function WithSparklinesDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Revenue</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue value={12_345} format="currency" />
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
  );
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
</StatsCard>`;

function ValueFormattingDemo() {
  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Currency (USD)</StatsCardTitle>
            <StatsCardValue
              value={12_345.67}
              format="currency"
              currency="USD"
              decimals={2}
            />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconPercentage className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
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
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Compact Number</StatsCardTitle>
            <StatsCardValue value={1_234_567} format="compact" />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="info">
            <IconClock className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Custom Formatter</StatsCardTitle>
            <StatsCardValue value={3.5} formatter={(v) => `${v} hours`} />
          </div>
        </div>
      </StatsCard>
    </div>
  );
}

const valueFormattingCode = `import { StatsCard, StatsCardValue } from "@/components/ui/stats-card"

<StatsCardValue value={12345.67} format="currency" currency="USD" decimals={2} />
<StatsCardValue value={89.34} format="percentage" decimals={2} />
<StatsCardValue value={1234567} format="compact" />
<StatsCardValue value={3.5} formatter={(v) => \`\${v} hours\`} />`;

function AnimatedValuesDemo() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconCurrencyDollar className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Animated Currency</StatsCardTitle>
            <StatsCardValue
              value={12_345}
              format="currency"
              animate
              animationDuration={1.5}
            />
            <StatsCardTrend value={12.5} />
          </div>
        </div>
      </StatsCard>

      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="success">
            <IconUsers className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
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
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Animated Percentage</StatsCardTitle>
            <StatsCardValue
              value={89.3}
              format="percentage"
              animate
              decimals={1}
            />
            <StatsCardTrend value={0.5} />
          </div>
        </div>
      </StatsCard>
    </div>
  );
}

const animatedValuesCode = `import { StatsCard, StatsCardValue } from "@/components/ui/stats-card"

<StatsCardValue
  value={12345}
  format="currency"
  animate
  animationDuration={1.5}
/>`;

function RealtimeUpdatesDemo() {
  const [liveValue, setLiveValue] = React.useState(12_345);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((prev) => prev + Math.floor(Math.random() * 100) - 50);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard>
        <div className="flex items-start gap-4">
          <StatsCardIcon variant="primary">
            <IconActivity className="h-5 w-5" />
          </StatsCardIcon>
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Live Revenue</StatsCardTitle>
            <StatsCardValue
              value={liveValue}
              format="currency"
              animate
              animationDuration={0.5}
            />
            <StatsCardTrend value={((liveValue - 12_345) / 12_345) * 100} />
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
          <div className="min-w-0 flex-1">
            <StatsCardTitle>Animated Live Value</StatsCardTitle>
            <StatsCardValue
              value={liveValue}
              format="compact"
              animate
              animationDuration={0.3}
            />
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
  );
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
}`;

function DashboardGridDemo() {
  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
      {dashboardMetrics.map((metric) => (
        <StatsCard
          key={metric.title}
          variant="interactive"
          drawerTitle={metric.drawerTitle}
          drawerContent={metric.drawerContent}
        >
          <div className="flex items-start gap-4">
            <StatsCardIcon variant={metric.iconVariant}>
              {metric.icon}
            </StatsCardIcon>
            <div className="min-w-0 flex-1">
              <StatsCardTitle>{metric.title}</StatsCardTitle>
              <StatsCardValue
                value={metric.value}
                format={metric.format}
                decimals={metric.decimals}
                animate
              />
              <StatsCardTrend
                value={metric.trendValue}
                showSign
                comparison={metric.comparison}
              />
            </div>
          </div>
          <StatsCardSpark>
            <StatsCardSparkline
              data={metric.sparkData}
              trend={metric.sparkTrend}
            />
          </StatsCardSpark>
          <StatsCardFooter>
            <StatsCardTimeRange>{metric.updated}</StatsCardTimeRange>
          </StatsCardFooter>
        </StatsCard>
      ))}
    </div>
  );
}

const dashboardGridCode = `import { StatsCard } from "@/components/ui/stats-card"

<div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
  <StatsCard variant="interactive">
    <StatsCardTitle>Total Revenue</StatsCardTitle>
    <StatsCardValue value={12345} format="currency" animate />
    <StatsCardTrend value={12.5} showSign comparison="vs last month" />
  </StatsCard>
  {/* More cards... */}
</div>`;

function CompactDashboardDemo() {
  return (
    <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-3">
      <StatsCard size="sm">
        <StatsCardTitle>Revenue</StatsCardTitle>
        <StatsCardValue size="sm" value={12_345} format="compact" />
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
        <StatsCardValue
          size="sm"
          value={89.3}
          format="percentage"
          decimals={0}
        />
        <StatsCardTrend value={0.5} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Sessions</StatsCardTitle>
        <StatsCardValue size="sm" value={5678} format="compact" />
        <StatsCardTrend value={15.3} />
      </StatsCard>

      <StatsCard size="sm">
        <StatsCardTitle>Bounce</StatsCardTitle>
        <StatsCardValue
          size="sm"
          value={32.1}
          format="percentage"
          decimals={0}
        />
        <StatsCardTrend value={-4.2} />
      </StatsCard>
    </div>
  );
}

const compactDashboardCode = `import { StatsCard } from "@/components/ui/stats-card"

<div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-3">
  <StatsCard size="sm">
    <StatsCardTitle>Revenue</StatsCardTitle>
    <StatsCardValue size="sm" value={12345} format="compact" />
    <StatsCardTrend value={12.5} />
  </StatsCard>
</div>`;

function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <StatsCard status="warning">
        <StatsCardHeader>
          <StatsCardTitle>
            Quarterly Enterprise Net Recurring Revenue Expansion Across EMEA and
            APAC Regions
          </StatsCardTitle>
          <StatsCardAction>
            <Button variant="ghost" size="icon-sm" disabled>
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Actions unavailable</span>
            </Button>
          </StatsCardAction>
        </StatsCardHeader>
        <StatsCardValue value={987_654_321.89} format="currency" decimals={2} />
        <StatsCardTrend
          value={-14.75}
          showSign
          comparison="compared to prior fiscal quarter baseline"
        />
        <StatsCardDescription>
          Includes deferred renewals pending finance reconciliation and
          multi-year contract amendments.
        </StatsCardDescription>
      </StatsCard>

      <StatsCard>
        <StatsCardHeader>
          <StatsCardTitle>Empty Metric</StatsCardTitle>
        </StatsCardHeader>
        <StatsCardValue>—</StatsCardValue>
        <StatsCardTrend value={0} />
        <StatsCardDescription>
          No telemetry recorded in the selected window.
        </StatsCardDescription>
      </StatsCard>

      <StatsCardSkeleton size="sm" showIcon showProgress />
    </div>
  );
}

const stressCode = `import {
  StatsCard,
  StatsCardHeader,
  StatsCardTitle,
  StatsCardAction,
  StatsCardValue,
  StatsCardTrend,
  StatsCardDescription,
  StatsCardSkeleton,
} from "@/components/ui/stats-card"
import { Button } from "@/components/ui/button"

// Long titles, large numbers, empty values, disabled actions, and narrow max-w-xs layout
<div className="w-full max-w-xs space-y-4">
  <StatsCard status="warning">
    <StatsCardHeader>
      <StatsCardTitle>
        Quarterly Enterprise Net Recurring Revenue Expansion Across EMEA and APAC Regions
      </StatsCardTitle>
      <StatsCardAction>
        <Button variant="ghost" size="icon-sm" disabled>
          <IconDotsVertical className="h-4 w-4" />
          <span className="sr-only">Actions unavailable</span>
        </Button>
      </StatsCardAction>
    </StatsCardHeader>
    <StatsCardValue value={987654321.89} format="currency" decimals={2} />
    <StatsCardTrend value={-14.75} showSign comparison="compared to prior fiscal quarter baseline" />
    <StatsCardDescription>
      Includes deferred renewals pending finance reconciliation.
    </StatsCardDescription>
  </StatsCard>
  <StatsCard>
    <StatsCardHeader>
      <StatsCardTitle>Empty Metric</StatsCardTitle>
    </StatsCardHeader>
    <StatsCardValue>—</StatsCardValue>
    <StatsCardTrend value={0} />
  </StatsCard>
  <StatsCardSkeleton size="sm" showIcon showProgress />
</div>`;

const usageCode = `import {
  StatsCard,
  StatsCardHeader,
  StatsCardTitle,
  StatsCardValue,
  StatsCardTrend,
  StatsCardDescription,
} from "@/components/ui/stats-card"

<StatsCard variant="gradient" status="success">
  <StatsCardHeader>
    <StatsCardTitle>Total Revenue</StatsCardTitle>
  </StatsCardHeader>
  <StatsCardValue value={12345} format="currency" />
  <StatsCardTrend value={12.5} showSign comparison="vs last month" />
  <StatsCardDescription>Target exceeded by $2,345</StatsCardDescription>
</StatsCard>`;

export default function StatsCardPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Stats Card"
        description="Display metrics with trends, sparklines, icons, and interactive features. WCAG 2.1 AA compliant with ARIA live regions, Base UI Meter progress, and size-aware skeletons."
        version="v2.1.3"
      />

      <FeatureGrid
        features={statsCardPageFeatureGridFeatures}
        description="KPI cards with accessible live regions, GSAP count-up, and Base UI Meter progress."
      />

      <DemoTabs defaultValue="basic" tabs={statsCardPageDemoTabsTabs} />

      <KeyboardShortcuts
        shortcuts={statsCardPageShortcuts}
        description="Keyboard navigation and activation for interactive cards."
      />

      <UsageBlock
        title="Usage"
        description="Compose StatsCard parts for KPI summaries, trends, progress meters, and drill-down drawers."
        code={usageCode}
        notes={[
          {
            label: "Interactive drawers",
            body: "Pass drawerContent (with optional drawerTitle and drawerDescription) to automatically make a StatsCard clickable and open a detail drawer.",
          },
          {
            label: "Reduced motion",
            body: "GSAP count-up animations in StatsCardValue and Recharts animations in StatsCardSparkline automatically respect prefers-reduced-motion.",
          },
        ]}
      />

      <APIReference
        sections={statsCardPageAPIReferenceSections}
        description="Props, types, and defaults for every exported StatsCard sub-component."
      />

      <Changelog
        entries={statsCardPageChangelogEntries}
        title="Changelog"
        description="Version history for StatsCard."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const dashboardMetrics = [
  {
    title: "Total Revenue",
    drawerTitle: "Revenue Details",
    drawerContent: <RevenueDrawerContent />,
    iconVariant: "primary" as const,
    icon: <IconCurrencyDollar className="h-5 w-5" />,
    value: 12_345,
    format: "currency" as const,
    decimals: undefined,
    trendValue: 12.5,
    comparison: "vs last month",
    sparkData: [10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40],
    sparkTrend: "up" as const,
    updated: "Updated 2 hours ago",
  },
  {
    title: "New Users",
    drawerTitle: "User Analytics",
    drawerContent: <div className="p-4">User details...</div>,
    iconVariant: "destructive" as const,
    icon: <IconUsers className="h-5 w-5" />,
    value: 2847,
    format: "compact" as const,
    decimals: undefined,
    trendValue: -3.2,
    comparison: "vs last month",
    sparkData: [40, 35, 38, 30, 28, 25, 27, 22, 20, 18, 15, 10],
    sparkTrend: "down" as const,
    updated: "Updated 1 hour ago",
  },
  {
    title: "Conversion",
    drawerTitle: "Conversion Analytics",
    drawerContent: <div className="p-4">Conversion details...</div>,
    iconVariant: "success" as const,
    icon: <IconPercentage className="h-5 w-5" />,
    value: 89.3,
    format: "percentage" as const,
    decimals: 1,
    trendValue: 0.5,
    comparison: "vs last month",
    sparkData: [85, 87, 86, 88, 89, 88, 90, 89, 91, 90, 89, 89],
    sparkTrend: "neutral" as const,
    updated: "Updated 30 mins ago",
  },
  {
    title: "Active Sessions",
    drawerTitle: "Session Analytics",
    drawerContent: <div className="p-4">Session details...</div>,
    iconVariant: "info" as const,
    icon: <IconActivity className="h-5 w-5" />,
    value: 1234,
    format: "number" as const,
    decimals: undefined,
    trendValue: 8.7,
    comparison: "vs yesterday",
    sparkData: [20, 22, 25, 24, 28, 30, 32, 35, 38, 40, 42, 45],
    sparkTrend: "up" as const,
    updated: "Live",
  },
];

const statsCardPageShortcuts = [
  { keys: "Enter / Space", description: "Activate interactive cards" },
  { keys: "Tab", description: "Navigate between cards" },
  { keys: "Shift + Tab", description: "Navigate backwards" },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const statsCardPageFeatureGridFeatures = [
  {
    title: "Accessible",
    description:
      "WCAG 2.1 AA compliant with ARIA live regions for real-time updates, proper heading hierarchy, and keyboard navigation.",
    icon: <IconAccessible className="h-5 w-5 text-primary" />,
  },
  {
    title: "Animated",
    description:
      "GSAP-powered count-up animations with prefers-reduced-motion support. Smooth transitions for values and trends.",
    icon: <IconSparkles className="h-5 w-5 text-primary" />,
  },
  {
    title: "Flexible",
    description:
      "Multiple variants, sizes, status indicators, interactive drawers, action menus, and comprehensive value formatting.",
    icon: <IconLayoutDashboard className="h-5 w-5 text-primary" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const statsCardPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic Stats",
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Core",
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
    group: "Composition",
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
    group: "Composition",
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
    value: "progress",
    label: "Progress & Goals",
    group: "Composition",
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
    group: "Composition",
    demo: (isActive) =>
      isActive ? (
        <DemoWrapper
          title="With Sparklines"
          description="Visual trend using Recharts AreaChart"
          code={withSparklinesCode}
        >
          <WithSparklinesDemo />
        </DemoWrapper>
      ) : null,
  },
  {
    value: "formatting",
    label: "Value Formatting",
    group: "Composition",
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
    value: "loading",
    label: "Loading States",
    group: "Behavior",
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
    value: "animated",
    label: "Animated Values",
    group: "Behavior",
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
    group: "Behavior",
    demo: (isActive) =>
      isActive ? (
        <DemoWrapper
          title="Real-time Updates"
          description="Live data updates with ARIA live announcements (updates every 3 seconds)"
          code={realtimeUpdatesCode}
        >
          <RealtimeUpdatesDemo />
        </DemoWrapper>
      ) : null,
  },
  {
    value: "dashboard",
    label: "Dashboard Grid",
    group: "Behavior",
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
    group: "Behavior",
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
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long titles, large numbers, empty values, disabled actions, and skeletons inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const statsCardPageAPIReferenceSections = [
  {
    title: "StatsCard",
    props: [
      {
        prop: "variant",
        type: '"default" | "outline" | "filled" | "gradient" | "interactive" | "glass"',
        default: '"default"',
        description: "Visual style variant of the card",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size of the card",
      },
      {
        prop: "status",
        type: '"default" | "success" | "warning" | "error" | "info"',
        default: '"default"',
        description: "Status indicator with left border color",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Show size-aware skeleton loading state",
      },
      {
        prop: "onClick",
        type: "(event: React.MouseEvent<HTMLElement>) => void",
        default: "-",
        description:
          "Click handler (automatically enables interactive semantics)",
      },
      {
        prop: "drawerTitle",
        type: "string",
        default: '"Details"',
        description: "Title for the drawer panel",
      },
      {
        prop: "drawerDescription",
        type: "string",
        default: "-",
        description: "Description for the drawer panel",
      },
      {
        prop: "drawerContent",
        type: "ReactNode",
        default: "-",
        description: "Content for the drawer panel",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        default: "-",
        description: "Called when the detail drawer opens or closes",
      },
    ],
  },
  {
    title: "StatsCardIcon",
    props: [
      {
        prop: "variant",
        type: '"default" | "primary" | "success" | "warning" | "destructive" | "info"',
        default: '"default"',
        description: "Color variant of the icon wrapper",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Dimensions of the icon wrapper",
      },
    ],
  },
  {
    title: "StatsCardHeader",
    props: [
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Vertical spacing scale inside the header",
      },
    ],
  },
  {
    title: "StatsCardTitle",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Heading text linked via aria-labelledby to the card",
      },
    ],
  },
  {
    title: "StatsCardAction",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Action control slot aligned in the card header",
      },
    ],
  },
  {
    title: "StatsCardValue",
    props: [
      {
        prop: "value",
        type: "number",
        default: "-",
        description: "Numeric value for formatting",
      },
      {
        prop: "format",
        type: '"currency" | "percentage" | "compact" | "number" | "custom"',
        default: '"number"',
        description: "Format type for the value",
      },
      {
        prop: "currency",
        type: "string",
        default: '"USD"',
        description: "ISO currency code for currency formatting",
      },
      {
        prop: "locale",
        type: "string",
        default: '"en-US"',
        description: "BCP 47 locale tag for Intl.NumberFormat",
      },
      {
        prop: "decimals",
        type: "number",
        default: "0",
        description:
          "Number of decimal places (defaults to 1 for percentage/compact)",
      },
      {
        prop: "prefix / suffix",
        type: "string",
        default: '""',
        description:
          "Optional text prepended or appended to the formatted value",
      },
      {
        prop: "formatter",
        type: "(value: number) => string",
        default: "-",
        description: "Custom formatter function",
      },
      {
        prop: "animate",
        type: "boolean",
        default: "false",
        description: "Enable GSAP count-up animation",
      },
      {
        prop: "animationDuration",
        type: "number",
        default: "1",
        description: "Animation duration in seconds",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size of the value text",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Custom display node overriding numeric formatting",
      },
    ],
  },
  {
    title: "StatsCardTrend",
    props: [
      {
        prop: "value",
        type: "number",
        default: "required",
        description: "Trend percentage value",
      },
      {
        prop: "trend",
        type: '"up" | "down" | "neutral"',
        default: "auto",
        description:
          "Override trend color direction (defaults from value sign)",
      },
      {
        prop: "showIcon",
        type: "boolean",
        default: "true",
        description: "Show trend direction icon",
      },
      {
        prop: "showSign",
        type: "boolean",
        default: "false",
        description: "Show leading + or - sign",
      },
      {
        prop: "comparison",
        type: "string",
        default: "-",
        description: 'Comparison text (e.g., "vs last month")',
      },
    ],
  },
  {
    title: "StatsCardDescription",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Supporting description text",
      },
    ],
  },
  {
    title: "StatsCardProgress",
    props: [
      {
        prop: "value",
        type: "number",
        default: "required",
        description: "Current meter value",
      },
      {
        prop: "max",
        type: "number",
        default: "100",
        description: "Maximum meter value",
      },
      {
        prop: "variant",
        type: '"default" | "success" | "warning" | "destructive"',
        default: '"default"',
        description:
          "Indicator color. Built on Base UI Meter (role=meter with aria-valuetext)",
      },
      {
        prop: "showLabel",
        type: "boolean",
        default: "false",
        description: "Show value / max label row above the meter",
      },
    ],
  },
  {
    title: "StatsCardSpark",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Decorative container for sparkline charts",
      },
    ],
  },
  {
    title: "StatsCardSparkline",
    props: [
      {
        prop: "data",
        type: "number[]",
        default: "required",
        description: "Array of data points for the sparkline",
      },
      {
        prop: "trend",
        type: '"up" | "down" | "neutral"',
        default: '"neutral"',
        description: "Trend direction for semantic stroke and fill tokens",
      },
    ],
  },
  {
    title: "StatsCardFooter",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Footer content row",
      },
    ],
  },
  {
    title: "StatsCardTimeRange",
    props: [
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Timestamp or range label",
      },
    ],
  },
  {
    title: "StatsCardSkeleton",
    props: [
      {
        prop: "showIcon",
        type: "boolean",
        default: "false",
        description: "Show icon skeleton",
      },
      {
        prop: "showSparkline",
        type: "boolean",
        default: "false",
        description: "Show sparkline skeleton",
      },
      {
        prop: "showProgress",
        type: "boolean",
        default: "false",
        description: "Show progress skeleton",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description:
          "Scales padding and placeholder blocks; auto-applied by StatsCard loading",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const statsCardPageChangelogEntries = [
  {
    version: "2.1.3",
    date: "26 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Space wrapped trend labels on the 4px scale",
        description: "Wrapped values and comparison labels use a 4px row gap.",
      },
    ],
  },
  {
    version: "2.1.2",
    date: "26 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Prevent horizontal clipping and header misalignment",
        description:
          "Replaced space-y-* with mb-* on StatsCardHeader so StatsCardAction stays top-aligned, allowed StatsCardTrend to wrap comparison copy cleanly, added min-w-0/break-words to StatsCardTitle and StatsCardValue, and gated StatsCardSkeleton pulse on motion-safe with max-w-full bars.",
      },
    ],
  },
  {
    version: "2.1.1",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: 'Icon actions use size="icon-sm"',
        description:
          "Ghost icon buttons in the examples drop the h-8 w-8 className override for the built-in icon-sm size now that the button ladder covers it.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "3 November 2026",
    changes: [
      {
        type: "breaking",
        title:
          "Removed statsCardDescriptionVariants and statsCardProgressVariants",
        description:
          "Both were empty/dead cva factories with no variants. Description styling is now the literal text-sm text-muted-foreground; the progress track classes are inlined.",
      },
      {
        type: "breaking",
        title: "StatsCardProgress Rebuilt on Base UI Meter",
        description:
          "The hand-rolled role=progressbar div is now Base UI Meter (Root/Track/Indicator/Value). DOM and ARIA role change from progressbar to meter — the correct semantics for quota/gauge KPIs — with 'N% complete' exposed via aria-valuetext.",
      },
      {
        type: "breaking",
        title: "useReducedMotion No Longer Re-exported",
        description:
          "The local SSR-unsafe duplicate was deleted; import { useReducedMotion } from @/hooks/use-reduced-motion directly.",
      },
      {
        type: "fixed",
        title: "Interrupt-Safe Count-Up",
        description:
          "useCountUp captures the live tween value on interrupt, so a re-triggered animation resumes from the current position instead of restarting from the stale start value.",
      },
      {
        type: "fixed",
        title: "Sparkline Colors Use Theme Tokens",
        description:
          "Hardcoded hex fills replaced with var(--color-success), var(--color-destructive), and var(--color-muted-foreground) so sparklines follow light/dark themes.",
      },
      {
        type: "added",
        title: "Size-Aware Skeleton",
        description:
          "StatsCardSkeleton accepts size (sm/default/lg) scaling padding and placeholder blocks; StatsCard loading state forwards its own size automatically.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
