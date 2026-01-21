import * as React from "react"
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
} from "@tabler/icons-react"

// Demo drawer content component
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

export default function StatsCardPage() {
  const [loading, setLoading] = React.useState(false)
  const [liveValue, setLiveValue] = React.useState(12345)

  // Simulate live data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((prev) => prev + Math.floor(Math.random() * 100) - 50)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const toggleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Stats Card</h1>
        <p className="text-muted-foreground">
          Display metrics with trends, sparklines, icons, and interactive features.
          WCAG 2.1 AA compliant with ARIA live regions.
        </p>
      </div>

      {/* Basic Stats */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Stats</h2>
        <p className="text-muted-foreground">Simple value with trend indicator</p>

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
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons</h2>
        <p className="text-muted-foreground">Icon variants for different metric types</p>

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
      </section>

      {/* All Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Variants</h2>
        <p className="text-muted-foreground">Default, outline, filled, gradient, interactive, and glass styles</p>

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
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <p className="text-muted-foreground">Small, default, and large sizes</p>

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
      </section>

      {/* Status Indicators */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Status Indicators</h2>
        <p className="text-muted-foreground">Left border status colors for quick visual scanning</p>

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
      </section>

      {/* Interactive Cards with Drawer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Cards with Drawer</h2>
        <p className="text-muted-foreground">Click to open a drawer with detailed information</p>

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
      </section>

      {/* With Action Menu */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Action Menu</h2>
        <p className="text-muted-foreground">Cards with dropdown action menus</p>

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
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <p className="text-muted-foreground">Skeleton loading demonstration</p>

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
      </section>

      {/* Progress & Goals */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Progress & Goals</h2>
        <p className="text-muted-foreground">Target progress visualization</p>

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
      </section>

      {/* With Sparklines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Sparklines</h2>
        <p className="text-muted-foreground">Visual trend using Recharts AreaChart</p>

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
      </section>

      {/* Value Formatting */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Value Formatting</h2>
        <p className="text-muted-foreground">Currency, percentage, compact number, and custom formatters</p>

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
      </section>

      {/* Animated Values (GSAP) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Animated Values (GSAP)</h2>
        <p className="text-muted-foreground">
          Count-up animation using GSAP. Respects prefers-reduced-motion.
        </p>

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
      </section>

      {/* Real-time Updates */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Real-time Updates</h2>
        <p className="text-muted-foreground">
          Live data updates with ARIA live announcements (updates every 3 seconds)
        </p>

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
      </section>

      {/* Trend Customization */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Trend Customization</h2>
        <p className="text-muted-foreground">Show/hide icon, show/hide sign, comparison text</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardTitle>Icon & Sign</StatsCardTitle>
            </StatsCardHeader>
            <StatsCardValue>$12,345</StatsCardValue>
            <StatsCardTrend value={12.5} showIcon showSign />
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardTitle>No Icon</StatsCardTitle>
            </StatsCardHeader>
            <StatsCardValue>$12,345</StatsCardValue>
            <StatsCardTrend value={12.5} showIcon={false} showSign />
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardTitle>No Sign</StatsCardTitle>
            </StatsCardHeader>
            <StatsCardValue>$12,345</StatsCardValue>
            <StatsCardTrend value={12.5} showIcon showSign={false} />
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardTitle>With Comparison</StatsCardTitle>
            </StatsCardHeader>
            <StatsCardValue>$12,345</StatsCardValue>
            <StatsCardTrend value={12.5} comparison="vs last month" />
          </StatsCard>
        </div>
      </section>

      {/* Complete Dashboard Grid */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dashboard Grid</h2>
        <p className="text-muted-foreground">Complete 4-card responsive layout with all features</p>

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
      </section>

      {/* Compact Dashboard (sm size) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Compact Dashboard</h2>
        <p className="text-muted-foreground">Dense sm-size grid layout for data-heavy dashboards</p>

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
      </section>
    </div>
  )
}
