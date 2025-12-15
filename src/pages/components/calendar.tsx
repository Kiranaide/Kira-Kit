import * as React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

export function CalendarPage() {
  const [singleDate, setSingleDate] = React.useState<Date | undefined>();
  const [dateRange, setDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>();

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Date Picker</h1>
        <p className="text-muted-foreground">
          Date selection component with presets and month/year navigation.
        </p>
      </header>

      {/* Single Date */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Single Date
        </h2>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            value={singleDate}
            onChange={(d) => setSingleDate(d as Date)}
            placeholder="Pick a date"
          />
        </div>
        {singleDate && (
          <p className="text-sm text-muted-foreground">
            Selected: {format(singleDate, "PPP")}
          </p>
        )}
      </section>

      {/* Date Range */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Date Range
        </h2>
        <div className="max-w-xs">
          <DatePicker
            mode="range"
            value={dateRange}
            onChange={(d) => setDateRange(d as { from?: Date; to?: Date })}
            placeholder="Select date range"
          />
        </div>
        {dateRange?.from && (
          <p className="text-sm text-muted-foreground">
            From: {format(dateRange.from, "PPP")}
            {dateRange.to && ` — To: ${format(dateRange.to, "PPP")}`}
          </p>
        )}
      </section>

      {/* Without Presets */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Presets
        </h2>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            placeholder="No presets"
            showPresets={false}
          />
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Features
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Click on month/year in header to switch to month/year picker</li>
          <li>Presets sidebar for quick date selection</li>
          <li>Clear button to reset selection</li>
          <li>Single date and date range modes</li>
          <li>Click outside to close</li>
        </ul>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { DatePicker } from "@/components/ui/date-picker"

{/* Single date */}
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>

{/* Date range */}
<DatePicker
  mode="range"
  value={{ from: startDate, to: endDate }}
  onChange={(v) => {
    setStartDate(v?.from)
    setEndDate(v?.to)
  }}
/>

{/* Without presets */}
<DatePicker showPresets={false} />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
