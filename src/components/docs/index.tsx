import * as React from "react";
import { IconEye, IconCode } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";

interface PageHeaderProps {
  title: string;
  description: string;
  version?: string;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  version,
  badge,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {version && <Badge>{version}</Badge>}
        {badge}
      </div>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  );
}

interface FeatureGridProps {
  features: FeatureCardProps[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}

interface DemoWrapperProps {
  title: string;
  description?: string;
  code: string;
  language?: string;
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}

export function DemoWrapper({
  title,
  description,
  code,
  language = "tsx",
  children,
  className,
  previewClassName,
}: DemoWrapperProps) {
  const [view, setView] = React.useState<"preview" | "code">("preview");

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v === "code" ? "code" : "preview")}
          >
            <TabsList>
              <TabsTrigger
                value="preview"
                className="gap-1.5"
                icon={<IconEye className="h-4 w-4" />}
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="gap-1.5"
                icon={<IconCode className="h-4 w-4" />}
              >
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {view === "preview" ? (
          <div className={cn("min-h-[200px]", previewClassName)}>
            {children}
          </div>
        ) : (
          <CodeBlock code={code} language={language} />
        )}
      </CardContent>
    </Card>
  );
}

interface DemoTab {
  value: string;
  label: string;
  demo: React.ReactNode | ((isActive: boolean) => React.ReactNode);
}

interface DemoTabsProps {
  tabs: DemoTab[];
  defaultValue?: string;
  className?: string;
  lazyMount?: boolean;
}

export function DemoTabs({
  tabs,
  defaultValue,
  className,
  lazyMount = false,
}: DemoTabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultValue || tabs[0]?.value
  );

  const renderTabContent = (tab: DemoTab) => {
    const isActive = activeTab === tab.value;

    if (typeof tab.demo === "function") {
      return tab.demo(isActive);
    }

    if (lazyMount && !isActive) {
      return null;
    }

    return tab.demo;
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("space-y-6", className)}
    >
      <TabsList className="flex-wrap">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {renderTabContent(tab)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

interface KeyboardShortcutProps {
  keys: string;
  description: string;
}

export function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center gap-2">
      <kbd className="rounded border bg-muted px-2 py-1 text-xs font-mono">
        {keys}
      </kbd>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>
  );
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcutProps[];
  title?: string;
  description?: React.ReactNode;
}

export function KeyboardShortcuts({
  shortcuts,
  title = "Keyboard Navigation",
  description = "Full keyboard support for accessibility",
}: KeyboardShortcutsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {shortcuts.map((shortcut, index) => (
            <KeyboardShortcut key={index} {...shortcut} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageBlockProps {
  code: string;
  title?: string;
  description?: string;
  language?: string;
}

export function UsageBlock({
  code,
  title = "Usage",
  description = "Basic implementation example",
  language = "tsx",
}: UsageBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock code={code} language={language} />
      </CardContent>
    </Card>
  );
}

interface APIProp {
  prop: string;
  type: string;
  default?: string;
  description: string;
}

interface APISection {
  title: string;
  props: APIProp[];
}

interface APIReferenceProps {
  sections: APISection[];
  title?: string;
  description?: string;
}

export function APIReference({
  sections,
  title = "API Reference",
  description = "Key props and configuration options",
}: APIReferenceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium w-[140px]">
                      Prop
                    </th>
                    <th className="py-2 text-left font-medium w-[200px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-medium w-[100px]">
                      Default
                    </th>
                    <th className="py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {section.props.map((prop, propIndex) => (
                    <tr key={propIndex}>
                      <td className="py-2 font-mono text-xs">{prop.prop}</td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {prop.type}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {prop.default || "-"}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {prop.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface ChangelogChange {
  type: "added" | "changed" | "fixed" | "deprecated" | "removed" | "breaking";
  title: string;
  description?: string;
}

interface ChangelogEntryProps {
  version: string;
  date: string;
  changes: ChangelogChange[];
}

const changeTypeVariants: Record<
  ChangelogChange["type"],
  React.ComponentProps<typeof Badge>["variant"]
> = {
  added: "success",
  changed: "secondary",
  fixed: "info",
  deprecated: "warning",
  removed: "destructive",
  breaking: "destructive",
};

export function ChangelogEntry({
  version,
  date,
  changes,
}: ChangelogEntryProps) {
  return (
    <div className="relative pl-6 border-l-2 border-border">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border" />
      <div className="flex items-center gap-2 mb-3">
        <Badge>{version}</Badge>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
      <div className="space-y-3">
        {changes.map((change, index) => (
          <div key={index} className="flex flex-wrap items-start gap-2">
            <Badge variant={changeTypeVariants[change.type]}>
              {change.type}
            </Badge>
            <div className="flex-1">
              <span className="font-medium text-sm">{change.title}</span>
              {change.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {change.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ChangelogProps {
  entries: ChangelogEntryProps[];
  title?: string;
  description?: string;
}

export function Changelog({
  entries,
  title = "Changelog",
  description = "Version history and migration notes",
}: ChangelogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {entries.map((entry, index) => (
          <ChangelogEntry key={index} {...entry} />
        ))}
      </CardContent>
    </Card>
  );
}

interface ComponentPageProps {
  children: React.ReactNode;
  className?: string;
}

export function ComponentPage({ children, className }: ComponentPageProps) {
  return (
    <div className={cn("p-8 max-w-6xl space-y-10", className)}>{children}</div>
  );
}

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {title && (
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  );
}
