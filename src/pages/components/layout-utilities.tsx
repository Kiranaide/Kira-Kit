import { Center } from "@/components/ui/center";
import { Spacer } from "@/components/ui/spacer";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { HStack, VStack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconLoader2, IconCheck, IconSettings, IconBell, IconUser } from "@tabler/icons-react";

export function LayoutUtilitiesPage() {
  return (
    <div className="p-8 max-w-5xl space-y-16">
      <header>
        <h1 className="text-3xl font-bold mb-2">Layout Utilities</h1>
        <p className="text-muted-foreground">
          Utility components for centering, spacing, and generic wrappers.
        </p>
      </header>

      {/* ==================== CENTER ==================== */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Center</h2>
          <p className="text-muted-foreground">
            Center content horizontally and vertically with multiple strategies.
          </p>
        </div>

        {/* Center Types */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Centering Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">type="flex" (default)</p>
              <Center className="h-32 border rounded-lg bg-muted/30">
                <div className="p-4 bg-primary/20 rounded">Centered</div>
              </Center>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">type="grid"</p>
              <Center type="grid" className="h-32 border rounded-lg bg-muted/30">
                <div className="p-4 bg-primary/20 rounded">Centered</div>
              </Center>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">type="absolute"</p>
              <div className="h-32 border rounded-lg bg-muted/30 relative">
                <Center type="absolute">
                  <div className="p-4 bg-primary/20 rounded">Centered</div>
                </Center>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Center */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Inline Center
          </h3>
          <p className="text-muted-foreground">
            Icon button: 
            <Center inline className="size-8 bg-primary/20 rounded mx-2">
              <IconSettings className="size-4" />
            </Center>
            with text around it.
          </p>
        </div>

        {/* Real Examples */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Real-World Examples
          </h3>

          {/* Loading Overlay */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Loading Overlay</p>
            <div className="h-48 border rounded-lg bg-muted/30 relative">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
                <Center className="h-full">
                  <VStack gap={2} align="center">
                    <IconLoader2 className="size-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </VStack>
                </Center>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Empty State</p>
            <Center className="h-48 border rounded-lg border-dashed">
              <VStack gap={4} align="center">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                  <IconCheck className="size-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold">No items yet</h4>
                  <p className="text-sm text-muted-foreground">Add your first item to get started</p>
                </div>
                <Button>Add Item</Button>
              </VStack>
            </Center>
          </div>
        </div>
      </section>

      {/* ==================== SPACER ==================== */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Spacer</h2>
          <p className="text-muted-foreground">
            Flexible spacing utility to push elements apart or add fixed spacing.
          </p>
        </div>

        {/* Auto Spacer */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Auto Spacer (Flex)
          </h3>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Push elements apart</p>
            <Flex align="center" className="p-4 border rounded-lg bg-muted/30">
              <span className="font-semibold">Brand</span>
              <Spacer />
              <Button variant="ghost" size="sm">Sign In</Button>
            </Flex>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Multiple spacers</p>
            <Flex align="center" className="p-4 border rounded-lg bg-muted/30">
              <IconUser className="size-5" />
              <Spacer />
              <span>Center Content</span>
              <Spacer />
              <IconSettings className="size-5" />
            </Flex>
          </div>
        </div>

        {/* Fixed Spacer */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Fixed Size Spacer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Horizontal (size=8)</p>
              <HStack className="p-4 border rounded-lg bg-muted/30">
                <div className="p-2 bg-primary/20 rounded">A</div>
                <Spacer size={8} axis="horizontal" />
                <div className="p-2 bg-primary/20 rounded">B</div>
              </HStack>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Vertical (size=8)</p>
              <VStack className="p-4 border rounded-lg bg-muted/30">
                <div className="p-2 bg-primary/20 rounded w-full text-center">A</div>
                <Spacer size={8} axis="vertical" />
                <div className="p-2 bg-primary/20 rounded w-full text-center">B</div>
              </VStack>
            </div>
          </div>
        </div>

        {/* Real Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Real-World Example
          </h3>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Navigation Header</p>
            <Flex as="nav" align="center" className="p-4 border rounded-lg bg-background">
              <HStack gap={2} align="center">
                <div className="size-8 bg-primary rounded" />
                <span className="font-semibold">App Name</span>
              </HStack>
              <Spacer />
              <HStack gap={1}>
                <Button variant="ghost" size="icon-sm">
                  <IconBell className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <IconSettings className="size-4" />
                </Button>
              </HStack>
              <Spacer size={4} axis="horizontal" />
              <Avatar size="sm">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Flex>
          </div>
        </div>
      </section>

      {/* ==================== BOX ==================== */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Box</h2>
          <p className="text-muted-foreground">
            Polymorphic wrapper with utility props for quick styling.
          </p>
        </div>

        {/* Basic Box */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Basic Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Padding & Background</p>
              <Box p={4} bg="muted" rounded="lg">
                Box with padding
              </Box>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Shadow</p>
              <Box p={4} shadow="md" rounded="lg" bg="background" border>
                Box with shadow
              </Box>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Custom Colors</p>
              <Box p={4} bg="primary" color="primary-foreground" rounded="lg">
                Custom colors
              </Box>
            </div>
          </div>
        </div>

        {/* Rounded Variants */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Border Radius
          </h3>
          <div className="flex flex-wrap gap-4">
            {(["none", "sm", "default", "md", "lg", "xl", "2xl", "full"] as const).map((rounded) => (
              <Box key={rounded} p={4} bg="primary/20" rounded={rounded} className="min-w-20 text-center">
                <span className="text-xs">{rounded}</span>
              </Box>
            ))}
          </div>
        </div>

        {/* Shadow Variants */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Box Shadow
          </h3>
          <div className="flex flex-wrap gap-4">
            {(["none", "sm", "default", "md", "lg", "xl", "2xl"] as const).map((shadow) => (
              <Box key={shadow} p={4} shadow={shadow} rounded="lg" bg="background" className="min-w-20 text-center">
                <span className="text-xs">{shadow}</span>
              </Box>
            ))}
          </div>
        </div>

        {/* Semantic HTML */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Semantic HTML (as prop)
          </h3>
          <Box as="article" p={6} rounded="lg" border shadow="sm" bg="background">
            <h4 className="font-semibold mb-2">Article Title</h4>
            <p className="text-muted-foreground text-sm">
              This Box renders as an &lt;article&gt; element for semantic HTML.
            </p>
          </Box>
        </div>

        {/* Real Example */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">
            Real-World Examples
          </h3>

          {/* Card-like Box */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Quick Card</p>
            <Box p={6} rounded="xl" shadow="lg" bg="background" border className="max-w-sm">
              <HStack gap={4} align="start">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <VStack gap={1} className="flex-1">
                  <span className="font-semibold">John Doe</span>
                  <span className="text-sm text-muted-foreground">Software Engineer</span>
                  <HStack gap={2} className="mt-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          </div>

          {/* Notification */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Notification Box</p>
            <Box p={4} rounded="lg" bg="primary/10" border className="border-primary/20 max-w-md">
              <HStack gap={3}>
                <Center className="size-10 rounded-full bg-primary/20">
                  <IconCheck className="size-5 text-primary" />
                </Center>
                <VStack gap={0} className="flex-1">
                  <span className="font-medium">Success!</span>
                  <span className="text-sm text-muted-foreground">Your changes have been saved.</span>
                </VStack>
              </HStack>
            </Box>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Center } from "@/components/ui/center"
import { Spacer } from "@/components/ui/spacer"
import { Box } from "@/components/ui/box"

// Center content
<Center className="h-screen">
  <LoadingSpinner />
</Center>

// Absolute center (for overlays)
<div className="relative">
  <Center type="absolute">
    <Modal />
  </Center>
</div>

// Push elements apart
<Flex>
  <Logo />
  <Spacer />
  <Button>Sign In</Button>
</Flex>

// Fixed spacing
<HStack>
  <Avatar />
  <Spacer size={4} axis="horizontal" />
  <Text>Username</Text>
</HStack>

// Box with utility props
<Box p={4} rounded="lg" shadow="md" bg="muted">
  Quick styled container
</Box>

// Semantic Box
<Box as="article" p={6} border>
  <h2>Title</h2>
  <p>Content</p>
</Box>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
