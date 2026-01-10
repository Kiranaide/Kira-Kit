import * as React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

export function CalendarPage() {
  const [singleDate, setSingleDate] = React.useState<Date | undefined>();
  const [dateRange, setDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>();
  const [confirmDate, setConfirmDate] = React.useState<Date | undefined>();
  const [confirmRange, setConfirmRange] = React.useState<{
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

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Small (sm)
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                size="sm"
                placeholder="Small date picker"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Default
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                size="default"
                placeholder="Default date picker"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Large (lg)
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                size="lg"
                placeholder="Large date picker"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Apply Mode Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Apply Mode Variants
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Immediate (Default) - Applies on selection
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                value={singleDate}
                onChange={(d) => setSingleDate(d as Date)}
                placeholder="Pick a date (immediate)"
                applyMode="immediate"
              />
            </div>
            {singleDate && (
              <p className="text-sm text-muted-foreground">
                Selected: {format(singleDate, "PPP")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Confirm Mode - Requires Apply button click
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                value={confirmDate}
                onChange={(d) => setConfirmDate(d as Date)}
                placeholder="Pick a date (confirm mode)"
                applyMode="confirm"
              />
            </div>
            {confirmDate && (
              <p className="text-sm text-muted-foreground">
                Selected: {format(confirmDate, "PPP")}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Select a date and click "Apply" to confirm, or "Cancel" to reset.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Confirm Mode with Date Range
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="range"
                value={confirmRange}
                onChange={(d) =>
                  setConfirmRange(d as { from?: Date; to?: Date })
                }
                placeholder="Select date range (confirm mode)"
                applyMode="confirm"
              />
            </div>
            {confirmRange?.from && (
              <p className="text-sm text-muted-foreground">
                From: {format(confirmRange.from, "PPP")}
                {confirmRange.to && ` — To: ${format(confirmRange.to, "PPP")}`}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Select a date range and click "Apply" to confirm.
            </p>
          </div>
        </div>
      </section>

      {/* Style Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Style Variants
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Default
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                variant="default"
                placeholder="Default variant"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Outline
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                variant="outline"
                placeholder="Outline variant"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Ghost
            </label>
            <div className="max-w-xs">
              <DatePicker
                mode="single"
                variant="ghost"
                placeholder="Ghost variant"
              />
            </div>
          </div>
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
          <li>Apply mode: immediate (default) or confirm (with Apply/Cancel buttons)</li>
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
<DatePicker showPresets={false} />

{/* Size variants */}
<DatePicker size="sm" placeholder="Small" />
<DatePicker size="default" placeholder="Default" />
<DatePicker size="lg" placeholder="Large" />

{/* Style variants */}
<DatePicker variant="default" placeholder="Default" />
<DatePicker variant="outline" placeholder="Outline" />
<DatePicker variant="ghost" placeholder="Ghost" />

{/* Combined variants */}
<DatePicker 
  size="lg" 
  variant="outline" 
  placeholder="Large outline" 
/>

{/* Apply mode variants */}
{/* Immediate (default) - applies on selection */}
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  applyMode="immediate"
/>

{/* Confirm mode - requires Apply button */}
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  applyMode="confirm"
/>

{/* Confirm mode with date range */}
<DatePicker
  mode="range"
  value={{ from: startDate, to: endDate }}
  onChange={setDateRange}
  applyMode="confirm"
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
