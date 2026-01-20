"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselAutoplayButton,
  CarouselProgressBar,
  CarouselThumbnails,
  CarouselLightbox,
  CarouselImage,
  CarouselCounter,
  useCarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
  IconKeyboard,
} from "@tabler/icons-react"

export default function CarouselPage() {
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)
  const { api, scrollPrev, scrollNext, current, count } = useCarouselApi()
  const [logMessages, setLogMessages] = React.useState<string[]>([])

  const addLog = (message: string) => {
    setLogMessages((prev) => [...prev.slice(-4), message])
  }

  const images = [
    {
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
      alt: "Office Space",
      title: "Modern Office Space",
    },
    {
      src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=400&fit=crop",
      alt: "Modern Workspace",
      title: "Contemporary Workspace",
    },
    {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop",
      alt: "Creative Studio",
      title: "Creative Design Studio",
    },
    {
      src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=400&fit=crop",
      alt: "Meeting Room",
      title: "Executive Meeting Room",
    },
    {
      src: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=400&fit=crop",
      alt: "Open Plan Office",
      title: "Open Plan Office",
    },
  ]

  const products = [
    {
      name: "Pro Plan",
      price: "$29/mo",
      features: ["10 projects", "100GB storage", "Priority support"],
    },
    {
      name: "Team Plan",
      price: "$99/mo",
      features: ["Unlimited projects", "1TB storage", "24/7 support"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom solutions", "Dedicated support", "SLA"],
    },
    {
      name: "Starter",
      price: "$9/mo",
      features: ["3 projects", "10GB storage", "Email support"],
    },
    {
      name: "Business",
      price: "$49/mo",
      features: ["25 projects", "500GB storage", "Phone support"],
    },
  ]

  const testimonials = [
    {
      name: "Sarah J.",
      role: "CEO, TechCorp",
      text: "Amazing product that transformed our workflow!",
      avatar: "https://i.pravatar.cc/100?u=sarah",
    },
    {
      name: "Mike R.",
      role: "CTO, StartupCo",
      text: "The best decision we made this year.",
      avatar: "https://i.pravatar.cc/100?u=mike",
    },
    {
      name: "Emily L.",
      role: "PM, DesignHub",
      text: "Intuitive and powerful. Love it!",
      avatar: "https://i.pravatar.cc/100?u=emily",
    },
  ]

  return (
    <div className="container mx-auto py-8 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Carousel</h1>
          <Badge variant="outline">Enhanced</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Accessible carousel component with keyboard navigation, autoplay controls, 
          touch gestures, lightbox mode, and full WCAG 2.2 compliance. Built with 
          Embla Carousel and GSAP animations.
        </p>
      </div>

      {/* Accessibility Info */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IconKeyboard className="h-4 w-4" />
                Keyboard Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">←</kbd> / <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">→</kbd> Navigate slides</li>
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Home</kbd> First slide</li>
                <li><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">End</kbd> Last slide</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Screen Reader Support</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• <code className="text-xs bg-muted px-1 rounded">aria-roledescription="carousel"</code></li>
                <li>• <code className="text-xs bg-muted px-1 rounded">aria-roledescription="slide"</code></li>
                <li>• Live region announcements</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Motion & Autoplay</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Respects <code className="text-xs bg-muted px-1 rounded">prefers-reduced-motion</code></li>
                <li>• Pause on hover/focus</li>
                <li>• Accessible play/pause button</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Basic Image Carousel */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Image Carousel</h2>
        <p className="text-muted-foreground">
          Image gallery with navigation arrows, dot indicators, and progress bar.
        </p>

        <Carousel 
          className="w-full max-w-3xl mx-auto" 
          aria-label="Office space gallery"
        >
          <CarouselContent>
            {images.slice(0, 4).map((img) => (
              <CarouselItem key={img.src}>
                <div className="relative">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm backdrop-blur-sm">
                    {img.title}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious>
            <IconChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext>
            <IconChevronRight className="h-4 w-4" />
          </CarouselNext>
          <CarouselDots className="mt-4" />
          <CarouselProgressBar className="mt-4" />
        </Carousel>
      </section>

      {/* Card Slider */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Slider</h2>
        <p className="text-muted-foreground">
          Horizontal scroll with product cards showing multiple items per view.
        </p>

        <Carousel variant="cards" className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {products.map((product, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{product.price}</div>
                    <ul className="space-y-2">
                      {product.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Autoplay with Controls */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Autoplay with Controls</h2>
        <p className="text-muted-foreground">
          Auto-scrolling carousel with pause on hover/focus, play/pause button, 
          and progress indicator. Respects reduced motion preferences.
        </p>

        <Carousel
          autoplay
          autoplayInterval={4000}
          pauseOnHover
          pauseOnFocus
          loop
          className="w-full max-w-2xl mx-auto"
          aria-label="Customer testimonials"
        >
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <Card className="py-8">
                  <CardContent className="text-center space-y-4">
                    <img
                      src={t.avatar}
                      alt=""
                      className="w-16 h-16 rounded-full mx-auto"
                    />
                    <p className="text-lg italic">"{t.text}"</p>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-4">
            <CarouselPrevious position="relative" />
            <CarouselAutoplayButton />
            <CarouselNext position="relative" />
          </div>
          <CarouselProgressBar className="mt-4" animated />
        </Carousel>
      </section>

      {/* Thumbnail Navigation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Thumbnail Navigation</h2>
        <p className="text-muted-foreground">
          Gallery with synchronized thumbnail strip for quick navigation.
        </p>

        <Carousel className="w-full max-w-3xl mx-auto" loop>
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselThumbnails images={images} className="mt-4" />
        </Carousel>
      </section>

      {/* Lightbox Gallery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Lightbox Gallery</h2>
        <p className="text-muted-foreground">
          Full-screen lightbox with zoom, pan, download, and share functionality.
          Keyboard shortcuts: +/- for zoom, 0 to reset, ? for help.
        </p>

        <Carousel className="w-full max-w-3xl mx-auto">
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={img.src}>
                <div className="relative group">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(index)
                      setLightboxOpen(true)
                    }}
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    onClick={() => {
                      setLightboxIndex(index)
                      setLightboxOpen(true)
                    }}
                    aria-label="Open in lightbox"
                  >
                    <IconMaximize className="h-5 w-5" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="mt-4" />
        </Carousel>

        <CarouselLightbox
          images={images}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      </section>

      {/* Vertical Carousel */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Vertical Carousel</h2>
        <p className="text-muted-foreground">
          Vertical orientation for different layouts. Use Up/Down arrow keys to navigate.
        </p>

        <Carousel
          orientation="vertical"
          className="w-full max-w-md mx-auto h-[400px]"
        >
          <CarouselContent className="h-[300px]">
            {images.slice(0, 4).map((img) => (
              <CarouselItem key={img.src}>
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-[280px] object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Peek Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Peek Variant</h2>
        <p className="text-muted-foreground">
          Shows partial next/previous slides to indicate more content.
        </p>

        <Carousel variant="peek" className="w-full max-w-3xl mx-auto">
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.src} variant="peek">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Fade Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Fade Variant</h2>
        <p className="text-muted-foreground">
          Smooth crossfade transitions between slides.
        </p>

        <Carousel variant="fade" className="w-full max-w-xl mx-auto">
          <div className="relative h-[300px]">
            <CarouselContent>
              {images.slice(0, 4).map((img) => (
                <CarouselItem key={img.src} variant="fade">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-[300px] object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="mt-4" />
        </Carousel>
      </section>

      {/* Loop Mode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loop Mode</h2>
        <p className="text-muted-foreground">
          Infinite scrolling through all items.
        </p>

        <Carousel loop className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.slice(0, 4).map((img) => (
              <CarouselItem key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="mt-4" />
        </Carousel>
      </section>

      {/* CarouselImage with Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CarouselImage Component</h2>
        <p className="text-muted-foreground">
          Smart image component with loading skeleton, error handling, and lazy loading support.
        </p>

        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.slice(0, 4).map((img, index) => (
              <CarouselItem key={img.src}>
                <div className="relative h-[300px]">
                  <CarouselImage
                    src={img.src}
                    alt={img.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    showSkeleton
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm backdrop-blur-sm">
                    {img.title}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="mt-4" />
        </Carousel>
      </section>

      {/* Carousel Counter */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Carousel Counter</h2>
        <p className="text-muted-foreground">
          Shows current slide position (e.g., "1 / 5").
        </p>

        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.slice(0, 4).map((img) => (
              <CarouselItem key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-between mt-4">
            <CarouselPrevious />
            <CarouselCounter />
            <CarouselNext />
          </div>
        </Carousel>
      </section>

      {/* Programmatic Control */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Programmatic Control</h2>
        <p className="text-muted-foreground">
          Control the carousel externally using <code className="text-xs bg-muted px-1 rounded">useCarouselApi</code> hook.
        </p>

        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.slice(0, 4).map((img) => (
              <CarouselItem key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" size="icon" onClick={() => scrollPrev()}>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[80px] text-center">
              {current + 1} / {count}
            </span>
            <Button variant="outline" size="icon" onClick={() => scrollNext()}>
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Carousel>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Current API state:</span>
          <Badge variant="secondary">
            {api ? "Connected" : "Not connected"}
          </Badge>
          <Badge variant="secondary">
            Slide {current + 1}
          </Badge>
          <Badge variant="secondary">
            {count} total
          </Badge>
        </div>
      </section>

      {/* Event Callbacks */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Event Callbacks</h2>
        <p className="text-muted-foreground">
          Track carousel lifecycle events with callbacks.
        </p>

        <Carousel
          className="w-full max-w-xl mx-auto"
          onInit={() => addLog("Carousel initialized")}
          onResize={() => addLog("Carousel resized")}
          onSettle={() => addLog("Carousel settled")}
          onCarouselScroll={(progress) => addLog(`Scroll progress: ${Math.round(progress * 100)}%`)}
        >
          <CarouselContent>
            {images.slice(0, 4).map((img) => (
              <CarouselItem key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-between mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Event Log</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {logMessages.length === 0 && (
              <p className="text-muted-foreground italic">Interact with carousel to see events</p>
            )}
            {logMessages.map((msg, i) => (
              <div key={i} className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {msg}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">Prop</th>
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 pr-4 font-medium">Default</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4"><code>variant</code></td>
                <td className="py-2 pr-4">"default" | "cards" | "fade" | "peek"</td>
                <td className="py-2 pr-4">"default"</td>
                <td className="py-2">Carousel display variant</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>orientation</code></td>
                <td className="py-2 pr-4">"horizontal" | "vertical"</td>
                <td className="py-2 pr-4">"horizontal"</td>
                <td className="py-2">Scroll direction</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>loop</code></td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Enable infinite loop</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>align</code></td>
                <td className="py-2 pr-4">"start" | "center" | "end"</td>
                <td className="py-2 pr-4">"start"</td>
                <td className="py-2">Slide alignment</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>autoplay</code></td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Enable auto-scrolling</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>autoplayInterval</code></td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">5000</td>
                <td className="py-2">Autoplay interval in ms</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>pauseOnHover</code></td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Pause autoplay on hover</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>pauseOnFocus</code></td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Pause autoplay on focus</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>onSlideChange</code></td>
                <td className="py-2 pr-4">(index: number) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback when slide changes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>onInit</code></td>
                <td className="py-2 pr-4">(api) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback when carousel initializes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>onResize</code></td>
                <td className="py-2 pr-4">() =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback when carousel resizes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>onSettle</code></td>
                <td className="py-2 pr-4">() =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback when carousel settles</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>onCarouselScroll</code></td>
                <td className="py-2 pr-4">(progress: number) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback during scroll (0-1)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4"><code>setApi</code></td>
                <td className="py-2 pr-4">(api) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback to receive embla API</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">New Components</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base"><code className="text-xs">CarouselImage</code></CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Smart image with loading skeleton, error handling, and lazy loading.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base"><code className="text-xs">CarouselCounter</code></CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Displays current slide position (e.g., "1 / 5").
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Hooks</h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base"><code className="text-xs">useCarouselApi()</code></CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Returns carousel control methods for programmatic manipulation:</p>
              <ul className="space-y-1 font-mono text-xs">
                <li><code>api</code> - Embla API instance</li>
                <li><code>setApi</code> - Set API instance</li>
                <li><code>current</code> - Current slide index</li>
                <li><code>count</code> - Total slide count</li>
                <li><code>canScrollPrev</code> - Can scroll to previous</li>
                <li><code>canScrollNext</code> - Can scroll to next</li>
                <li><code>scrollPrev()</code> - Scroll to previous slide</li>
                <li><code>scrollNext()</code> - Scroll to next slide</li>
                <li><code>scrollTo(index)</code> - Scroll to specific slide</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
