import * as React from "react"
import {
  IconSearch,
  IconSettings,
  IconBell,
  IconMenu2,
  IconDownload,
  IconHeart,
  IconTrash,
  IconEdit,
  IconPlus,
  IconX,
  IconCheck,
  IconCopy,
  IconMoon,
  IconSun,
  IconRefresh,
  IconDots,
  IconBrandTwitter,
  IconBrandGithub,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function BasicIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="default">
        <IconSearch className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="secondary">
        <IconSettings className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <IconBell className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <IconMenu2 className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  )
}

const basicIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconSearch, IconSettings, IconBell, IconMenu2 } from "@tabler/icons-react"

export function BasicIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="default">
        <IconSearch className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="secondary">
        <IconSettings className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <IconBell className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <IconMenu2 className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  )
}`

function SizeIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-xs" variant="outline">
        <IconSearch className="h-3 w-3" />
      </Button>
      <Button size="icon-sm" variant="outline">
        <IconSearch className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="outline">
        <IconSearch className="h-4 w-4" />
      </Button>
      <Button size="icon-lg" variant="outline">
        <IconSearch className="h-5 w-5" />
      </Button>
    </div>
  )
}

const sizeIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconSearch } from "@tabler/icons-react"

export function SizeIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-xs" variant="outline">
        <IconSearch className="h-3 w-3" />
      </Button>
      <Button size="icon-sm" variant="outline">
        <IconSearch className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="outline">
        <IconSearch className="h-4 w-4" />
      </Button>
      <Button size="icon-lg" variant="outline">
        <IconSearch className="h-5 w-5" />
      </Button>
    </div>
  )
}`

function TooltipIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="outline" title="Search">
        <IconSearch className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Download">
        <IconDownload className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Favorite">
        <IconHeart className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Delete">
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  )
}

const tooltipIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconSearch, IconDownload, IconHeart, IconTrash } from "@tabler/icons-react"

export function TooltipIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="outline" title="Search">
        <IconSearch className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Download">
        <IconDownload className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Favorite">
        <IconHeart className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" title="Delete">
        <IconTrash className="h-4 w-4" />
      </Button>
    </div>
  )
}`

function ActionIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="default">
        <IconPlus className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="default">
        <IconEdit className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="success">
        <IconCheck className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="warning">
        <IconRefresh className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <IconX className="h-4 w-4" />
      </Button>
    </div>
  )
}

const actionIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconPlus, IconEdit, IconCheck, IconRefresh, IconX } from "@tabler/icons-react"

export function ActionIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="default">
        <IconPlus className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="default">
        <IconEdit className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="success">
        <IconCheck className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="warning">
        <IconRefresh className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <IconX className="h-4 w-4" />
      </Button>
    </div>
  )
}`

function CopyIconButtonDemo() {
  const handleCopy = React.useCallback(() => {
    toast.success("Copied to clipboard!")
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="outline" onClick={handleCopy}>
        <IconCopy className="h-4 w-4" />
      </Button>
      <Button size="icon-sm" variant="outline" onClick={handleCopy}>
        <IconCopy className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" onClick={handleCopy}>
        <IconCopy className="h-4 w-4" />
      </Button>
    </div>
  )
}

const copyIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconCopy } from "@tabler/icons-react"
import { toast } from "sonner"

export function CopyIconButtonDemo() {
  const handleCopy = () => {
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="outline" onClick={handleCopy}>
        <IconCopy className="h-4 w-4" />
      </Button>
      <Button size="icon-sm" variant="outline" onClick={handleCopy}>
        <IconCopy className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" onClick={handleCopy}>
        <IconCopy className="h-4 w-4" />
      </Button>
    </div>
  )
}`

function ToggleIconButtonDemo() {
  const [isDark, setIsDark] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        size="icon"
        variant="outline"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? (
          <IconSun className="h-4 w-4" />
        ) : (
          <IconMoon className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => toast.success("Notifications enabled!")}
      >
        <IconBell className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => toast.success("Settings opened!")}
      >
        <IconSettings className="h-4 w-4" />
      </Button>
    </div>
  )
}

const toggleIconButtonCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconSun, IconMoon, IconBell, IconSettings } from "@tabler/icons-react"
import { toast } from "sonner"

export function ToggleIconButtonDemo() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        size="icon"
        variant="outline"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? (
          <IconSun className="h-4 w-4" />
        ) : (
          <IconMoon className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => toast.success("Notifications enabled!")}
      >
        <IconBell className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => toast.success("Settings opened!")}
      >
        <IconSettings className="h-4 w-4" />
      </Button>
    </div>
  )
}`

function SocialIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="outline">
        <IconBrandTwitter className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <IconBrandGithub className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <IconBrandTwitter className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <IconBrandGithub className="h-4 w-4" />
      </Button>
    </div>
  )
}

const socialIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconBrandTwitter, IconBrandGithub } from "@tabler/icons-react"

export function SocialIconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon" variant="outline">
        <IconBrandTwitter className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <IconBrandGithub className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <IconBrandTwitter className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <IconBrandGithub className="h-4 w-4" />
      </Button>
    </div>
  )
}`

function MenuIconButtonDemo() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Settings</div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost">
            <IconSearch className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <IconDots className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

const menuIconButtonCode = `import { Button } from "@/components/ui/button"
import { IconSearch, IconDots } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"

export function MenuIconButtonDemo() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Settings</div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost">
            <IconSearch className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <IconDots className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}`

const features = [
  {
    title: "Size Variants",
    description: "Available in icon-xs, icon-sm, icon, and icon-lg sizes for flexible layouts.",
  },
  {
    title: "Variant Styles",
    description: "Supports all button variants including outline, ghost, destructive, and semantic colors.",
  },
  {
    title: "Accessible",
    description: "Proper ARIA labels and keyboard navigation support for screen readers.",
  },
]

const apiSections = [
  {
    title: "Button Props (Icon Size)",
    props: [
      {
        prop: "size",
        type: "'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        default: "'default'",
        description: "Icon button size variant.",
      },
      {
        prop: "variant",
        type: "ButtonVariants",
        default: "'default'",
        description: "Visual style variant of the button.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the button interaction.",
      },
      {
        prop: "title",
        type: "string",
        default: "undefined",
        description: "Native tooltip text for accessibility.",
      },
      {
        prop: "holdDuration",
        type: "number",
        default: "undefined",
        description: "Duration in ms for hold-to-confirm functionality.",
      },
      {
        prop: "onHoldComplete",
        type: "() => void",
        default: "undefined",
        description: "Callback when hold duration completes.",
      },
    ],
  },
]

const shortcuts = [
  { keys: "Enter / Space", description: "Activate button" },
  { keys: "Tab", description: "Navigate to next focusable element" },
]

const changelogEntries = [
  {
    version: "v1.0",
    date: "2025-06",
    changes: [
      { type: "added" as const, title: "Initial Release", description: "Icon button variants with size support." },
      { type: "added" as const, title: "Accessibility", description: "Native title attribute for tooltips and ARIA support." },
    ],
  },
]

export default function IconButtonPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Icon Button"
        description="Square buttons that contain only an icon, perfect for toolbars, menus, and action buttons with minimal visual weight."
        version="1.0"
      />

      <FeatureGrid features={features} />

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="tooltip">Tooltip</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="copy">Copy</TabsTrigger>
          <TabsTrigger value="toggle">Toggle</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <DemoWrapper
            title="Basic Icon Buttons"
            description="Icon buttons with different style variants."
            code={basicIconButtonCode}
          >
            <BasicIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="sizes">
          <DemoWrapper
            title="Icon Button Sizes"
            description="Available size variants from icon-xs to icon-lg."
            code={sizeIconButtonCode}
          >
            <SizeIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="tooltip">
          <DemoWrapper
            title="Icon Buttons with Tooltips"
            description="Icon buttons with native title tooltips."
            code={tooltipIconButtonCode}
          >
            <TooltipIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="actions">
          <DemoWrapper
            title="Action Icon Buttons"
            description="Icon buttons with semantic action colors."
            code={actionIconButtonCode}
          >
            <ActionIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="copy">
          <DemoWrapper
            title="Copy Icon Button"
            description="Icon button with copy functionality."
            code={copyIconButtonCode}
          >
            <CopyIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="toggle">
          <DemoWrapper
            title="Toggle Icon Button"
            description="Icon button that toggles between two states."
            code={toggleIconButtonCode}
          >
            <ToggleIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="social">
          <DemoWrapper
            title="Social Icon Buttons"
            description="Social media icon buttons for linking."
            code={socialIconButtonCode}
          >
            <SocialIconButtonDemo />
          </DemoWrapper>
        </TabsContent>

        <TabsContent value="menu">
          <DemoWrapper
            title="Menu Icon Buttons"
            description="Icon buttons in a header context."
            code={menuIconButtonCode}
          >
            <MenuIconButtonDemo />
          </DemoWrapper>
        </TabsContent>
      </Tabs>

      <UsageBlock
        code={basicIconButtonCode}
        title="Usage"
        description="Import the Button component and use size='icon' with any icon."
      />

      <KeyboardShortcuts shortcuts={shortcuts} />

      <APIReference sections={apiSections} />

      <Changelog entries={changelogEntries} />
    </ComponentPage>
  )
}
