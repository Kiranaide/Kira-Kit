import * as React from "react"
import { StatsCard, StatsCardHeader, StatsCardValue, StatsCardTrend, StatsCardDescription, StatsCardSpark, StatsCardSparkline } from "@/components/ui/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsCardPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Stats Card</h1>
        <p className="text-muted-foreground">Display metrics with trends and sparklines</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Stats</h2>
        <p className="text-muted-foreground">Simple value with trend indicator</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Total revenue</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>2,847</StatsCardValue>
              <StatsCardTrend value={-3.2} />
              <StatsCardDescription>New users</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>89.3%</StatsCardValue>
              <StatsCardTrend value={0.5} />
              <StatsCardDescription>Conversion rate</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Sparkline</h2>
        <p className="text-muted-foreground">Visual trend using Recharts AreaChart</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40]} trend="up" />
            </StatsCardSpark>
            <StatsCardDescription>Total revenue</StatsCardDescription>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>2,847</StatsCardValue>
              <StatsCardTrend value={-3.2} />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[40, 35, 38, 30, 28, 25, 27, 22, 20, 18, 15, 10]} trend="down" />
            </StatsCardSpark>
            <StatsCardDescription>New users</StatsCardDescription>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>89.3%</StatsCardValue>
              <StatsCardTrend value={0.5} />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[85, 87, 86, 88, 89, 88, 90, 89, 91, 90, 89, 89]} trend="neutral" />
            </StatsCardSpark>
            <StatsCardDescription>Conversion rate</StatsCardDescription>
          </StatsCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Variants</h2>
        <p className="text-muted-foreground">Default, outline, filled, and gradient styles</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard variant="default">
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Default</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard variant="outline">
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Outline</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard variant="filled">
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Filled</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard variant="gradient">
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Gradient</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <p className="text-muted-foreground">Small, default, and large value sizes</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue size="sm">$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Small</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue size="default">$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Default</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue size="lg">$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Large</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Trend States</h2>
        <p className="text-muted-foreground">Up (green), down (red), and neutral</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} />
              <StatsCardDescription>Trend Up</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={-3.2} />
              <StatsCardDescription>Trend Down</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={0.5} />
              <StatsCardDescription>Trend Neutral</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dashboard Grid</h2>
        <p className="text-muted-foreground">4-card responsive layout</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} showSign />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[10, 15, 13, 18, 20, 25, 22, 28, 30, 35, 32, 40]} trend="up" />
            </StatsCardSpark>
            <StatsCardDescription>Total Revenue</StatsCardDescription>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>2,847</StatsCardValue>
              <StatsCardTrend value={-3.2} showSign />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[40, 35, 38, 30, 28, 25, 27, 22, 20, 18, 15, 10]} trend="down" />
            </StatsCardSpark>
            <StatsCardDescription>New Users</StatsCardDescription>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>89.3%</StatsCardValue>
              <StatsCardTrend value={0.5} showSign />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[85, 87, 86, 88, 89, 88, 90, 89, 91, 90, 89, 89]} trend="neutral" />
            </StatsCardSpark>
            <StatsCardDescription>Conversion</StatsCardDescription>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>1,234</StatsCardValue>
              <StatsCardTrend value={8.7} showSign />
            </StatsCardHeader>
            <StatsCardSpark>
              <StatsCardSparkline data={[20, 22, 25, 24, 28, 30, 32, 35, 38, 40, 42, 45]} trend="up" />
            </StatsCardSpark>
            <StatsCardDescription>Active Sessions</StatsCardDescription>
          </StatsCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Trend Customization</h2>
        <p className="text-muted-foreground">Show/hide icon, show/hide sign, custom trend direction</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} showIcon showSign />
              <StatsCardDescription>Show Icon & Sign</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} showIcon={false} showSign />
              <StatsCardDescription>No Icon</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>

          <StatsCard>
            <StatsCardHeader>
              <StatsCardValue>$12,345</StatsCardValue>
              <StatsCardTrend value={12.5} showIcon showSign={false} />
              <StatsCardDescription>No Sign</StatsCardDescription>
            </StatsCardHeader>
          </StatsCard>
        </div>
      </section>
    </div>
  )
}
