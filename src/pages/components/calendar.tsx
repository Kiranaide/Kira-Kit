import * as React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, MonthPicker, YearPicker } from "@/components/ui/calendar";
import { format, addDays, subDays } from "date-fns";

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
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>();
  const [monthDate, setMonthDate] = React.useState<Date | undefined>();
  const [yearValue, setYearValue] = React.useState<number | undefined>();

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Date Picker & Calendar</h1>
        <p className="text-muted-foreground">
          Date selection components with presets, month/year navigation, and
          various customization options.
        </p>
      </header>

      {/* ========================================== */}
      {/* DATE PICKER SECTION */}
      {/* ========================================== */}

      <div className="space-y-12">
        <h2 className="text-2xl font-bold border-b border-border pb-3">
          DatePicker Component
        </h2>

        {/* Single Date */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Single Date
          </h3>
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
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Date Range
          </h3>
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
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Without Presets
          </h3>
          <div className="max-w-xs">
            <DatePicker
              mode="single"
              placeholder="No presets"
              showPresets={false}
            />
          </div>
        </section>

        {/* Disabled State */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Disabled State
          </h3>
          <div className="max-w-xs">
            <DatePicker mode="single" placeholder="Disabled picker" disabled />
          </div>
        </section>

        {/* Min/Max Date Constraints */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Date Constraints (Min/Max)
          </h3>
          <div className="max-w-xs space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Only future dates (from today)
              </label>
              <DatePicker
                mode="single"
                placeholder="Select future date"
                minDate={new Date()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Only past dates (up to today)
              </label>
              <DatePicker
                mode="single"
                placeholder="Select past date"
                maxDate={new Date()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Next 7 days only
              </label>
              <DatePicker
                mode="single"
                placeholder="Select within 7 days"
                minDate={new Date()}
                maxDate={addDays(new Date(), 7)}
              />
            </div>
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Size Variants
          </h3>
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

        {/* Style Variants */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Style Variants
          </h3>
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

        {/* Apply Mode Variants */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Apply Mode Variants
          </h3>
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
                Select a date then click "Apply" to confirm, or "Cancel" to
                reset.
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
                  {confirmRange.to &&
                    ` — To: ${format(confirmRange.to, "PPP")}`}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ========================================== */}
      {/* STANDALONE CALENDAR SECTION */}
      {/* ========================================== */}

      <div className="space-y-12">
        <h2 className="text-2xl font-bold border-b border-border pb-3">
          Standalone Calendar
        </h2>

        {/* Basic Calendar */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Basic Calendar
          </h3>
          <div className="border border-border rounded-lg inline-block">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={(d) => setCalendarDate(d as Date)}
            />
          </div>
          {calendarDate && (
            <p className="text-sm text-muted-foreground">
              Selected: {format(calendarDate, "PPP")}
            </p>
          )}
        </section>

        {/* Calendar Size Variants */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Calendar Size Variants
          </h3>
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Small
              </label>
              <div className="border border-border rounded-lg inline-block">
                <Calendar mode="single" size="sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Default
              </label>
              <div className="border border-border rounded-lg inline-block">
                <Calendar mode="single" size="default" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Large
              </label>
              <div className="border border-border rounded-lg inline-block">
                <Calendar mode="single" size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Without Today Button */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Without Today Button
          </h3>
          <div className="border border-border rounded-lg inline-block">
            <Calendar mode="single" showTodayButton={false} />
          </div>
        </section>
      </div>

      {/* ========================================== */}
      {/* MONTH PICKER SECTION */}
      {/* ========================================== */}

      <div className="space-y-12">
        <h2 className="text-2xl font-bold border-b border-border pb-3">
          MonthPicker & YearPicker
        </h2>

        {/* Month Picker */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Month Picker
          </h3>
          <div className="inline-block">
            <MonthPicker
              mode="single"
              selected={monthDate}
              onSelect={(d) => setMonthDate(d as Date)}
            />
          </div>
          {monthDate && (
            <p className="text-sm text-muted-foreground">
              Selected: {format(monthDate, "MMMM yyyy")}
            </p>
          )}
        </section>

        {/* Year Picker */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Year Picker
          </h3>
          <div className="inline-block">
            <YearPicker
              mode="single"
              selected={yearValue}
              onSelect={(y) => setYearValue(y as number)}
            />
          </div>
          {yearValue && (
            <p className="text-sm text-muted-foreground">
              Selected: {yearValue}
            </p>
          )}
        </section>
      </div>

      {/* ========================================== */}
      {/* FEATURES & USAGE */}
      {/* ========================================== */}

      <div className="space-y-12">
        {/* Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Features
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Click on month/year in header to open dropdown picker</li>
            <li>Navigation arrows for previous/next month</li>
            <li>Presets sidebar for quick date selection</li>
            <li>Clear button to reset selection</li>
            <li>Single date and date range modes</li>
            <li>
              Apply mode: immediate (default) or confirm (with Apply/Cancel
              buttons)
            </li>
            <li>Min/max date constraints</li>
            <li>Size variants: sm, default, lg</li>
            <li>Style variants: default, outline, ghost</li>
            <li>Standalone Calendar, MonthPicker, and YearPicker components</li>
            <li>Click outside to close</li>
            <li>Full keyboard navigation and accessibility</li>
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
import { Calendar, MonthPicker, YearPicker } from "@/components/ui/calendar"

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
  onChange={setDateRange}
/>

{/* Without presets */}
<DatePicker showPresets={false} />

{/* Disabled */}
<DatePicker disabled />

{/* Date constraints */}
<DatePicker minDate={new Date()} />
<DatePicker maxDate={new Date()} />
<DatePicker minDate={startDate} maxDate={endDate} />

{/* Size variants */}
<DatePicker size="sm" />
<DatePicker size="default" />
<DatePicker size="lg" />

{/* Style variants */}
<DatePicker variant="default" />
<DatePicker variant="outline" />
<DatePicker variant="ghost" />

{/* Apply mode */}
<DatePicker applyMode="immediate" />
<DatePicker applyMode="confirm" />

{/* Standalone Calendar */}
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>

{/* Calendar with custom size */}
<Calendar mode="single" size="lg" />

{/* Calendar without Today button */}
<Calendar mode="single" showTodayButton={false} />

{/* Month Picker */}
<MonthPicker
  mode="single"
  selected={monthDate}
  onSelect={setMonthDate}
/>

{/* Year Picker */}
<YearPicker
  mode="single"
  selected={year}
  onSelect={setYear}
/>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
