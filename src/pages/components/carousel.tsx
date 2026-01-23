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
  IconPhoto,
  IconCode,
} from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

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

function BasicDemo() {
  return (
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
      <CarouselProgressBar className="mt-2" />
    </Carousel>
  )
}

const basicCode = `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselProgressBar,
} from "@/components/ui/carousel"

<Carousel aria-label="Office space gallery">
  <CarouselContent>
    {images.map((img) => (
      <CarouselItem key={img.src}>
        <img src={img.src} alt={img.alt} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
  <CarouselProgressBar />
</Carousel>`

function CardDemo() {
  return (
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
  )
}

const cardCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel variant="cards">
  <CarouselContent>
    {products.map((product, i) => (
      <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
        <Card>{/* product content */}</Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

function AutoplayDemo() {
  return (
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
                  <div className="text-sm text-muted-foreground">{t.role}</div>
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
  )
}

const autoplayCode = `import { Carousel, CarouselContent, CarouselItem, CarouselAutoplayButton, CarouselProgressBar } from "@/components/ui/carousel"

<Carousel
  autoplay
  autoplayInterval={4000}
  pauseOnHover
  pauseOnFocus
  loop
>
  <CarouselContent>
    {/* slides */}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselAutoplayButton />
  <CarouselNext />
  <CarouselProgressBar animated />
</Carousel>`

function ThumbnailDemo() {
  return (
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
  )
}

const thumbnailCode = `import { Carousel, CarouselContent, CarouselItem, CarouselThumbnails } from "@/components/ui/carousel"

<Carousel loop>
  <CarouselContent>
    {images.map((img) => (
      <CarouselItem key={img.src}>
        <img src={img.src} alt={img.alt} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselThumbnails images={images} />
</Carousel>`

function LightboxDemo() {
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)

  return (
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
      <CarouselLightbox
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </Carousel>
  )
}

const lightboxCode = `import { Carousel, CarouselContent, CarouselItem, CarouselLightbox } from "@/components/ui/carousel"

function LightboxDemo() {
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxIndex, setLightboxIndex] = React.useState(0)

  return (
    <Carousel>
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={img.src}>
            <img src={img.src} onClick={() => {
              setLightboxIndex(index)
              setLightboxOpen(true)
            }} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselLightbox
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </Carousel>
  )
}`

function VerticalDemo() {
  return (
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
  )
}

const verticalCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel orientation="vertical" className="h-[400px]">
  <CarouselContent className="h-[300px]">
    {/* vertical slides */}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

function PeekDemo() {
  return (
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
  )
}

const peekCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel variant="peek">
  <CarouselContent>
    <CarouselItem variant="peek">
      {/* content */}
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

function FadeDemo() {
  return (
    <Carousel
      variant="fade"
      className="w-full max-w-xl mx-auto"
    >
      <CarouselContent className="h-[300px]">
        {images.slice(0, 4).map((img, index) => (
          <CarouselItem key={img.src} variant="fade" index={index}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover rounded-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots className="mt-4" />
    </Carousel>
  )
}

const fadeCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel variant="fade">
  <CarouselContent className="h-[300px]">
    {images.map((img) => (
      <CarouselItem key={img.src} variant="fade">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-cover rounded-lg"
        />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
</Carousel>`

function LoopDemo() {
  return (
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
  )
}

const loopCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel loop>
  <CarouselContent>
    {/* slides */}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

function CarouselImageDemo() {
  return (
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
  )
}

const carouselImageCode = `import { Carousel, CarouselContent, CarouselItem, CarouselImage } from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    {images.map((img, index) => (
      <CarouselItem key={img.src}>
        <CarouselImage
          src={img.src}
          alt={img.alt}
          loading={index === 0 ? "eager" : "lazy"}
          showSkeleton
        />
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>`

function CounterDemo() {
  return (
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
  )
}

const counterCode = `import { Carousel, CarouselContent, CarouselItem, CarouselCounter } from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    {/* slides */}
  </CarouselContent>
  <div className="flex items-center justify-between mt-4">
    <CarouselPrevious />
    <CarouselCounter />
    <CarouselNext />
  </div>
</Carousel>`

function ProgrammaticDemo() {
  const { api, scrollPrev, scrollNext, current, count } = useCarouselApi()

  return (
    <div className="space-y-4">
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
      </Carousel>

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
    </div>
  )
}

const programmaticCode = `import { useCarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

function ProgrammaticDemo() {
  const { api, scrollPrev, scrollNext, current, count } = useCarouselApi()

  return (
    <>
      <Carousel>
        <CarouselContent>
          {/* slides */}
        </CarouselContent>
      </Carousel>
      <Button onClick={() => scrollPrev()}>Previous</Button>
      <Button onClick={() => scrollNext()}>Next</Button>
    </>
  )
}`

function EventCallbacksDemo() {
  const [logMessages, setLogMessages] = React.useState<string[]>([])

  const addLog = (message: string) => {
    setLogMessages((prev) => [...prev.slice(-4), message])
  }

  return (
    <div className="space-y-4">
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
    </div>
  )
}

const eventCallbacksCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel
  onInit={() => console.log("initialized")}
  onResize={() => console.log("resized")}
  onSettle={() => console.log("settled")}
  onCarouselScroll={(progress) => console.log(progress)}
>
  <CarouselContent>
    {/* slides */}
  </CarouselContent>
</Carousel>`

const usageCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export default function MyCarousel() {
  const items = [
    { src: "/image1.jpg", alt: "Item 1" },
    { src: "/image2.jpg", alt: "Item 2" },
    { src: "/image3.jpg", alt: "Item 3" },
  ]

  return (
    <Carousel aria-label="My gallery">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            <img src={item.src} alt={item.alt} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  )
}`

export default function CarouselPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Carousel"
        description="Accessible carousel component with keyboard navigation, autoplay controls, touch gestures, lightbox mode, and full WCAG 2.2 compliance. Built with Embla Carousel and GSAP animations."
        version="v2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Fully Accessible",
            description: "WAI-ARIA carousel pattern with aria-roledescription, keyboard navigation (arrows, Home, End), screen reader announcements, and prefers-reduced-motion support.",
            icon: <IconKeyboard className="h-4 w-4" />,
          },
          {
            title: "Rich Features",
            description: "Autoplay with pause on hover/focus, progress bar, thumbnail navigation, lightbox gallery, vertical orientation, and multiple animation variants (fade, peek, zoom, flip).",
            icon: <IconPhoto className="h-4 w-4" />,
          },
          {
            title: "Developer Friendly",
            description: "Simple API with useCarouselApi hook for programmatic control, event callbacks, CarouselImage for loading states, and CarouselCounter for position display.",
            icon: <IconCode className="h-4 w-4" />,
          },
        ]}
      />

      <DemoTabs
        tabs={[
          { value: "basic", label: "Basic", demo: (
            <DemoWrapper
              title="Basic Image Carousel"
              description="Image gallery with navigation arrows, dot indicators, and progress bar."
              code={basicCode}
            >
              <BasicDemo />
            </DemoWrapper>
          )},
          { value: "cards", label: "Cards", demo: (
            <DemoWrapper
              title="Card Slider"
              description="Horizontal scroll with product cards showing multiple items per view."
              code={cardCode}
            >
              <CardDemo />
            </DemoWrapper>
          )},
          { value: "autoplay", label: "Autoplay", demo: (
            <DemoWrapper
              title="Autoplay with Controls"
              description="Auto-scrolling carousel with pause on hover/focus, play/pause button, and progress indicator."
              code={autoplayCode}
            >
              <AutoplayDemo />
            </DemoWrapper>
          )},
          { value: "thumbnails", label: "Thumbnails", demo: (
            <DemoWrapper
              title="Thumbnail Navigation"
              description="Gallery with synchronized thumbnail strip for quick navigation."
              code={thumbnailCode}
            >
              <ThumbnailDemo />
            </DemoWrapper>
          )},
          { value: "lightbox", label: "Lightbox", demo: (
            <DemoWrapper
              title="Lightbox Gallery"
              description="Full-screen lightbox with zoom, pan, download, and share functionality. Keyboard shortcuts: +/- for zoom, 0 to reset, ? for help."
              code={lightboxCode}
            >
              <LightboxDemo />
            </DemoWrapper>
          )},
          { value: "vertical", label: "Vertical", demo: (
            <DemoWrapper
              title="Vertical Carousel"
              description="Vertical orientation for different layouts. Use Up/Down arrow keys to navigate."
              code={verticalCode}
            >
              <VerticalDemo />
            </DemoWrapper>
          )},
          { value: "peek", label: "Peek", demo: (
            <DemoWrapper
              title="Peek Variant"
              description="Shows partial next/previous slides to indicate more content."
              code={peekCode}
            >
              <PeekDemo />
            </DemoWrapper>
          )},
          { value: "fade", label: "Fade", demo: (
            <DemoWrapper
              title="Fade Variant"
              description="Smooth crossfade transitions between slides."
              code={fadeCode}
            >
              <FadeDemo />
            </DemoWrapper>
          )},
          { value: "loop", label: "Loop", demo: (
            <DemoWrapper
              title="Loop Mode"
              description="Infinite scrolling through all items."
              code={loopCode}
            >
              <LoopDemo />
            </DemoWrapper>
          )},
          { value: "carouselimage", label: "CarouselImage", demo: (
            <DemoWrapper
              title="CarouselImage Component"
              description="Smart image component with loading skeleton, error handling, and lazy loading support."
              code={carouselImageCode}
            >
              <CarouselImageDemo />
            </DemoWrapper>
          )},
          { value: "counter", label: "Counter", demo: (
            <DemoWrapper
              title="Carousel Counter"
              description="Shows current slide position (e.g., '1 / 5')."
              code={counterCode}
            >
              <CounterDemo />
            </DemoWrapper>
          )},
          { value: "programmatic", label: "Programmatic", demo: (
            <DemoWrapper
              title="Programmatic Control"
              description="Control the carousel externally using useCarouselApi hook."
              code={programmaticCode}
            >
              <ProgrammaticDemo />
            </DemoWrapper>
          )},
          { value: "events", label: "Events", demo: (
            <DemoWrapper
              title="Event Callbacks"
              description="Track carousel lifecycle events with callbacks."
              code={eventCallbacksCode}
            >
              <EventCallbacksDemo />
            </DemoWrapper>
          )},
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "← / →", description: "Navigate slides (horizontal)" },
          { keys: "↑ / ↓", description: "Navigate slides (vertical)" },
          { keys: "Home", description: "Go to first slide" },
          { keys: "End", description: "Go to last slide" },
          { keys: "Space / Enter", description: "Activate focused button" },
          { keys: "Esc", description: "Close lightbox" },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation example for a simple image carousel."
      />

      <APIReference
        sections={[
          {
            title: "Carousel",
            props: [
              { prop: "variant", type: '"default" | "cards" | "fade" | "peek"', default: '"default"', description: "Carousel display variant" },
              { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Scroll direction" },
              { prop: "loop", type: "boolean", default: "false", description: "Enable infinite loop" },
              { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Slide alignment" },
              { prop: "autoplay", type: "boolean", default: "false", description: "Enable auto-scrolling" },
              { prop: "autoplayInterval", type: "number", default: "5000", description: "Autoplay interval in ms" },
              { prop: "pauseOnHover", type: "boolean", default: "true", description: "Pause autoplay on hover" },
              { prop: "pauseOnFocus", type: "boolean", default: "true", description: "Pause autoplay on focus" },
              { prop: "aria-label", type: "string", default: "-", description: "Accessible label for the carousel" },
              { prop: "onSlideChange", type: "(index: number) => void", default: "-", description: "Callback when slide changes" },
              { prop: "onInit", type: "(api) => void", default: "-", description: "Callback when carousel initializes" },
              { prop: "onResize", type: "() => void", default: "-", description: "Callback when carousel resizes" },
              { prop: "onSettle", type: "() => void", default: "-", description: "Callback when carousel settles" },
              { prop: "onCarouselScroll", type: "(progress: number) => void", default: "-", description: "Callback during scroll (0-1)" },
              { prop: "setApi", type: "(api) => void", default: "-", description: "Callback to receive embla API" },
            ],
          },
          {
            title: "CarouselPrevious / CarouselNext",
            props: [
              { prop: "position", type: '"absolute" | "relative"', default: '"absolute"', description: "Button positioning" },
              { prop: "disabled", type: "boolean", default: "false", description: "Disable navigation button" },
            ],
          },
          {
            title: "CarouselDots",
            props: [
              { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Dot indicators alignment" },
            ],
          },
          {
            title: "CarouselProgressBar",
            props: [
              { prop: "animated", type: "boolean", default: "false", description: "Enable animated progress bar" },
              { prop: "position", type: '"top" | "bottom"', default: '"bottom"', description: "Progress bar position" },
            ],
          },
          {
            title: "CarouselAutoplayButton",
            props: [
              { prop: "playing", type: "boolean", default: "true", description: "Initial playing state" },
              { prop: "onToggle", type: "(playing: boolean) => void", default: "-", description: "Callback on play/pause toggle" },
            ],
          },
          {
            title: "CarouselThumbnails",
            props: [
              { prop: "images", type: "Array<{src, alt, title}>", default: "-", description: "Array of image objects for thumbnails" },
              { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Thumbnail size" },
            ],
          },
          {
            title: "CarouselLightbox",
            props: [
              { prop: "open", type: "boolean", default: "false", description: "Lightbox open state" },
              { prop: "onOpenChange", type: "(open: boolean) => void", default: "-", description: "Callback on open state change" },
              { prop: "images", type: "Array<{src, alt, title}>", default: "-", description: "Array of image objects" },
              { prop: "initialIndex", type: "number", default: "0", description: "Starting image index" },
              { prop: "allowZoom", type: "boolean", default: "true", description: "Enable zoom functionality" },
              { prop: "allowDownload", type: "boolean", default: "true", description: "Enable download button" },
            ],
          },
          {
            title: "CarouselImage",
            props: [
              { prop: "src", type: "string", default: "-", description: "Image source URL" },
              { prop: "alt", type: "string", default: "-", description: "Accessible alt text" },
              { prop: "loading", type: '"eager" | "lazy"', default: '"lazy"', description: "Native lazy loading" },
              { prop: "showSkeleton", type: "boolean", default: "false", description: "Show loading skeleton" },
              { prop: "onError", type: "() => void", default: "-", description: "Callback on image load error" },
              { prop: "onLoad", type: "() => void", default: "-", description: "Callback on image load success" },
            ],
          },
          {
            title: "CarouselCounter",
            props: [
              { prop: "format", type: "(current: number, total: number) => string", default: "(c, t) => `${c} / ${t}`", description: "Custom format function" },
            ],
          },
          {
            title: "useCarouselApi Hook",
            props: [
              { prop: "api", type: "EmblaCarouselType", default: "-", description: "Embla API instance" },
              { prop: "setApi", type: "(api) => void", default: "-", description: "Set API instance" },
              { prop: "current", type: "number", default: "0", description: "Current slide index" },
              { prop: "count", type: "number", default: "0", description: "Total slide count" },
              { prop: "canScrollPrev", type: "boolean", default: "false", description: "Can scroll to previous" },
              { prop: "canScrollNext", type: "boolean", default: "false", description: "Can scroll to next" },
              { prop: "scrollPrev", type: "() => void", default: "-", description: "Scroll to previous slide" },
              { prop: "scrollNext", type: "() => void", default: "-", description: "Scroll to next slide" },
              { prop: "scrollTo", type: "(index: number) => void", default: "-", description: "Scroll to specific slide" },
            ],
          },
        ]}
        title="API Reference"
        description="Key props and configuration options for all Carousel components"
      />
    </ComponentPage>
  )
}
