"use client";

import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
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
  KiraCarousel,
  useCarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
  IconKeyboard,
  IconPhoto,
  IconCode,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

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
];

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
];

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
];

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
  );
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
</Carousel>`;

function CardDemo() {
  return (
    <Carousel variant="cards" className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.name}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <Card>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{product.price}</div>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
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
  );
}

const cardCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel variant="cards">
  <CarouselContent>
    {products.map((product) => (
      <CarouselItem key={product.name} className="md:basis-1/2 lg:basis-1/3">
        <Card>{/* product content */}</Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

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
        {testimonials.map((t) => (
          <CarouselItem key={t.name}>
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
  );
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
</Carousel>`;

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
  );
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
</Carousel>`;

function LightboxDemo() {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  return (
    <Carousel className="w-full max-w-3xl mx-auto">
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={img.src}>
            <div className="relative group">
              <button
                type="button"
                className="block w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Open ${img.alt} in lightbox`}
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </button>
              <button
                type="button"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
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
  );
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
}`;

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
  );
}

const verticalCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel orientation="vertical" className="h-[400px]">
  <CarouselContent className="h-[300px]">
    {/* vertical slides */}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

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
  );
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
</Carousel>`;

function FadeDemo() {
  return (
    <Carousel variant="fade" className="w-full max-w-xl mx-auto">
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
  );
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
</Carousel>`;

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
  );
}

const loopCode = `import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

<Carousel loop>
  <CarouselContent>
    {/* slides */}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

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
  );
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
</Carousel>`;

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
  );
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
</Carousel>`;

function ProgrammaticDemo() {
  const { api, scrollPrev, scrollNext, current, count } = useCarouselApi();

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
        <Badge variant="secondary">{api ? "Connected" : "Not connected"}</Badge>
        <Badge variant="secondary">Slide {current + 1}</Badge>
        <Badge variant="secondary">{count} total</Badge>
      </div>
    </div>
  );
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
}`;

function EventCallbacksDemo() {
  const [logMessages, setLogMessages] = React.useState<
    { id: number; message: string }[]
  >([]);

  const nextLogId = React.useRef(0);

  const addLog = React.useCallback((message: string) => {
    const entry = { id: nextLogId.current++, message };
    setLogMessages((prev) => [...prev.slice(-4), entry]);
  }, []);

  // Stable props avoid rebinding the subscription (and calling onInit) on every log entry.
  const handleInit = React.useCallback(
    () => addLog("Carousel initialized"),
    [addLog],
  );

  const handleResize = React.useCallback(
    () => addLog("Carousel resized"),
    [addLog],
  );

  const handleSettle = React.useCallback(
    () => addLog("Carousel settled"),
    [addLog],
  );

  const handleScroll = React.useCallback(
    (progress: number) => {
      addLog(`Scroll progress: ${Math.round(progress * 100)}%`);
    },
    [addLog],
  );

  return (
    <div className="space-y-4">
      <Carousel
        className="w-full max-w-xl mx-auto"
        onInit={handleInit}
        onResize={handleResize}
        onSettle={handleSettle}
        onCarouselScroll={handleScroll}
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
            <p className="text-muted-foreground italic">
              Interact with carousel to see events
            </p>
          )}
          {logMessages.map((entry) => (
            <div
              key={entry.id}
              className="font-mono text-xs bg-muted px-2 py-1 rounded"
            >
              {entry.message}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
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
</Carousel>`;

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
}`;

// Illustrative fixture: exaggerated slide labels for stress testing.
const longLabels = [
  "Quarterly business review deck with extended executive summary and appendix materials",
  "Customer onboarding flow: account provisioning, workspace setup, and invitation steps",
  "Design system governance: contribution guidelines, review process, and versioning policy",
  "Infrastructure migration plan covering zero-downtime database cutover and rollback",
  "Accessibility audit remediation roadmap with WCAG 2.2 success criteria mapping",
];

function KiraCarouselDemo() {
  return (
    <KiraCarousel
      className="w-full max-w-3xl mx-auto"
      aria-label="KiraCarousel composed demo"
      items={images.map((img) => (
        <div key={img.src} className="relative">
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-[300px] object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            {img.title}
          </div>
        </div>
      ))}
      dots
      progressBar
      counter
      thumbnails
      thumbnailImages={images.map(({ src, alt }) => ({ src, alt }))}
    />
  );
}

const kiraCode = `import { KiraCarousel } from "@/components/ui/carousel"

<KiraCarousel
  items={images.map((img) => (
    <img key={img.src} src={img.src} alt={img.alt} />
  ))}
  dots
  progressBar
  counter
  thumbnails
  thumbnailImages={images.map(({ src, alt }) => ({ src, alt }))}
/>`;

function StressDemo() {
  return (
    <div className="space-y-8">
      <div className="max-w-[340px]">
        <KiraCarousel
          aria-label="Narrow container stress test"
          items={longLabels.map((label) => (
            <div
              key={label}
              className="flex h-24 items-center rounded-lg border bg-muted/30 px-4"
            >
              <span className="min-w-0 truncate text-sm">{label}</span>
            </div>
          ))}
          dots
          progressBar
        />
        <p className="mt-2 text-xs text-muted-foreground">
          ~340px container, single very long slide label â€” label truncates
          (min-w-0), controls stay inside the viewport.
        </p>
      </div>
      <div>
        <KiraCarousel
          aria-label="Many slides stress test"
          loop
          items={Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="flex h-20 items-center justify-center rounded-lg border bg-muted/30"
            >
              <span className="text-sm text-muted-foreground">
                Slide {i + 1} of 50
              </span>
            </div>
          ))}
          dots={false}
          progressBar
          counter
        />
        <p className="mt-2 text-xs text-muted-foreground">
          50 slides with loop + real scroll progress â€” dots intentionally off
          (50 dots would be unusable); counter and progress bar carry position.
        </p>
      </div>
    </div>
  );
}

const stressCode = `import { KiraCarousel } from "@/components/ui/carousel"

// Narrow container (~340px): long labels truncate via min-w-0.
<KiraCarousel
  items={longLabels.map((label) => (
    <div className="flex h-24 items-center px-4">
      <span className="min-w-0 truncate text-sm">{label}</span>
    </div>
  ))}
  dots
  progressBar
/>

// Many slides (50): dots off, counter + progress bar carry position.
<KiraCarousel
  loop
  items={Array.from({ length: 50 }, (_, i) => <Slide key={i} index={i} />)}
  dots={false}
  progressBar
  counter
/>`;

export default function CarouselPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Carousel"
        description="Accessible carousel component with keyboard navigation, autoplay controls, touch gestures, lightbox mode, and full WCAG 2.2 compliance. Built with Embla Carousel and GSAP animations."
        version="v2.1"
      />

      <FeatureGrid features={carouselPageFeatureGridFeatures} />

      <DemoTabs tabs={carouselPageDemoTabsTabs} />

      <KeyboardShortcuts shortcuts={carouselPageKeyboardShortcutsShortcuts} />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation example for a simple image carousel."
      />

      <APIReference
        sections={carouselPageAPIReferenceSections}
        title="API Reference"
        description="Key props and configuration options for all Carousel components"
      />
      <Changelog
        entries={carouselPageChangelogEntries}
        title="Changelog"
        description="Version history and migration notes for the Carousel component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const carouselPageFeatureGridFeatures = [
  {
    title: "Fully Accessible",
    description:
      "WAI-ARIA carousel pattern with aria-roledescription, keyboard navigation (arrows, Home, End), screen reader announcements, prefers-reduced-motion support, and autoplay that stops when the tab is hidden.",
    icon: <IconKeyboard className="h-4 w-4" />,
  },
  {
    title: "Rich Features",
    description:
      "Plugin-based autoplay with pause on hover/focus/tab-hidden, real scroll progress bar, thumbnail navigation, lightbox gallery on Base UI Dialog, vertical orientation, and fade/peek/zoom/flip variants.",
    icon: <IconPhoto className="h-4 w-4" />,
  },
  {
    title: "Developer Friendly",
    description:
      "KiraCarousel one-import composition (items + boolean switches), useCarouselApi hook, event callbacks, CarouselImage loading states, and CarouselCounter â€” see the Kira and Stress tabs.",
    icon: <IconCode className="h-4 w-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const carouselPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Image Carousel"
        description="Image gallery with navigation arrows, dot indicators, and progress bar."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "cards",
    label: "Cards",
    demo: (
      <DemoWrapper
        title="Card Slider"
        description="Horizontal scroll with product cards showing multiple items per view."
        code={cardCode}
      >
        <CardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "autoplay",
    label: "Autoplay",
    demo: (
      <DemoWrapper
        title="Autoplay with Controls"
        description="Auto-scrolling carousel with pause on hover/focus, play/pause button, and progress indicator."
        code={autoplayCode}
      >
        <AutoplayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "thumbnails",
    label: "Thumbnails",
    demo: (
      <DemoWrapper
        title="Thumbnail Navigation"
        description="Gallery with synchronized thumbnail strip for quick navigation."
        code={thumbnailCode}
      >
        <ThumbnailDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "lightbox",
    label: "Lightbox",
    demo: (
      <DemoWrapper
        title="Lightbox Gallery"
        description="Full-screen lightbox with zoom, pan, download, and share functionality. Keyboard shortcuts: +/- for zoom, 0 to reset, ? for help."
        code={lightboxCode}
      >
        <LightboxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "vertical",
    label: "Vertical",
    demo: (
      <DemoWrapper
        title="Vertical Carousel"
        description="Vertical orientation for different layouts. Use Up/Down arrow keys to navigate."
        code={verticalCode}
      >
        <VerticalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "peek",
    label: "Peek",
    demo: (
      <DemoWrapper
        title="Peek Variant"
        description="Shows partial next/previous slides to indicate more content."
        code={peekCode}
      >
        <PeekDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "fade",
    label: "Fade",
    demo: (
      <DemoWrapper
        title="Fade Variant"
        description="Smooth crossfade transitions between slides."
        code={fadeCode}
      >
        <FadeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loop",
    label: "Loop",
    demo: (
      <DemoWrapper
        title="Loop Mode"
        description="Infinite scrolling through all items."
        code={loopCode}
      >
        <LoopDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "carouselimage",
    label: "CarouselImage",
    demo: (
      <DemoWrapper
        title="CarouselImage Component"
        description="Smart image component with loading skeleton, error handling, and lazy loading support."
        code={carouselImageCode}
      >
        <CarouselImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "counter",
    label: "Counter",
    demo: (
      <DemoWrapper
        title="Carousel Counter"
        description="Shows current slide position (e.g., '1 / 5')."
        code={counterCode}
      >
        <CounterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "programmatic",
    label: "Programmatic",
    demo: (
      <DemoWrapper
        title="Programmatic Control"
        description="Control the carousel externally using useCarouselApi hook."
        code={programmaticCode}
      >
        <ProgrammaticDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "events",
    label: "Events",
    demo: (
      <DemoWrapper
        title="Event Callbacks"
        description="Track carousel lifecycle events with callbacks."
        code={eventCallbacksCode}
      >
        <EventCallbacksDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraCarousel",
    demo: (
      <DemoWrapper
        title="KiraCarousel"
        description="One-import composed carousel: slides, arrows, dots, real scroll progress, counter, autoplay, and thumbnails behind boolean switches."
        code={kiraCode}
      >
        <KiraCarouselDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Narrow ~340px container with a very long slide label (truncates, controls stay in viewport) and 50 looped slides (dots off, counter + progress bar carry position)."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const carouselPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab",
    description:
      "Move to the carousel, then between its controls (standard tab order)",
  },
  {
    keys: "â† / â†’",
    description: "Previous / next slide (horizontal orientation)",
  },
  {
    keys: "â†‘ / â†“",
    description: "Previous / next slide (vertical orientation)",
  },
  { keys: "Home", description: "Go to first slide" },
  { keys: "End", description: "Go to last slide" },
  {
    keys: "Space / Enter",
    description: "Activate focused dot, arrow, or play/pause button",
  },
  {
    keys: "Esc",
    description: "Close lightbox (inherited from Base UI Dialog)",
  },
  { keys: "Lightbox: + / âˆ’", description: "Zoom in / out" },
  { keys: "Lightbox: 0", description: "Reset zoom" },
  { keys: "Lightbox: ?", description: "Toggle shortcut help overlay" },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const carouselPageAPIReferenceSections = [
  {
    title: "Carousel",
    props: [
      {
        prop: "variant",
        type: '"default" | "cards" | "fade" | "peek" | "zoom" | "flip"',
        default: '"default"',
        description: "Carousel display variant",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Scroll direction",
      },
      {
        prop: "loop",
        type: "boolean",
        default: "false",
        description: "Enable infinite loop",
      },
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Slide alignment",
      },
      {
        prop: "autoplay",
        type: "boolean",
        default: "false",
        description: "Enable auto-scrolling (embla autoplay plugin)",
      },
      {
        prop: "autoplayInterval",
        type: "number",
        default: "5000",
        description: "Autoplay interval in ms",
      },
      {
        prop: "pauseOnHover",
        type: "boolean",
        default: "true",
        description: "Pause autoplay on hover",
      },
      {
        prop: "pauseOnFocus",
        type: "boolean",
        default: "true",
        description: "Pause autoplay on focus",
      },
      {
        prop: "aria-label",
        type: "string",
        default: "-",
        description: "Accessible label for the carousel",
      },
      {
        prop: "onSlideChange",
        type: "(index: number) => void",
        default: "-",
        description: "Callback when slide changes",
      },
      {
        prop: "onAutoplayChange",
        type: "(isPlaying: boolean) => void",
        default: "-",
        description: "Callback when autoplay state changes",
      },
      {
        prop: "onInit",
        type: "(api) => void",
        default: "-",
        description: "Callback when carousel initializes",
      },
      {
        prop: "onResize",
        type: "() => void",
        default: "-",
        description: "Callback when carousel resizes",
      },
      {
        prop: "onSettle",
        type: "() => void",
        default: "-",
        description: "Callback when carousel settles",
      },
      {
        prop: "onCarouselScroll",
        type: "(progress: number) => void",
        default: "-",
        description: "Callback during scroll (0-1)",
      },
      {
        prop: "setApi",
        type: "(api) => void",
        default: "-",
        description: "Callback to receive embla API",
      },
    ],
  },
  {
    title: "CarouselPrevious / CarouselNext",
    props: [
      {
        prop: "variant",
        type: '"default" | "subtle" | "ghost"',
        default: '"default"',
        description: "Button visual variant",
      },
      {
        prop: "position",
        type: '"absolute" | "relative"',
        default: '"absolute"',
        description: "Button positioning",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable navigation button",
      },
    ],
  },
  {
    title: "CarouselDots",
    props: [
      {
        prop: "count",
        type: "number",
        default: "slideCount",
        description: "Override the number of dots",
      },
    ],
  },
  {
    title: "CarouselProgressBar",
    props: [
      {
        prop: "animated",
        type: "boolean",
        default: "true",
        description: "Animate width changes (disabled under reduced motion)",
      },
    ],
  },
  {
    title: "CarouselAutoplayButton",
    props: [
      {
        prop: "isPlaying",
        type: "boolean",
        default: "context",
        description: "Override the playing state",
      },
      {
        prop: "onToggle",
        type: "() => void",
        default: "-",
        description: "Callback on play/pause toggle",
      },
    ],
  },
  {
    title: "CarouselThumbnails",
    props: [
      {
        prop: "images",
        type: "Array<{src, alt}>",
        default: "-",
        description: "Array of image objects for thumbnails",
      },
    ],
  },
  {
    title: "CarouselLightbox",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "false",
        description: "Lightbox open state",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        default: "-",
        description: "Callback on open state change",
      },
      {
        prop: "images",
        type: "Array<{src, alt, title?}>",
        default: "-",
        description: "Array of image objects",
      },
      {
        prop: "initialIndex",
        type: "number",
        default: "0",
        description: "Starting image index",
      },
    ],
  },
  {
    title: "CarouselImage",
    props: [
      {
        prop: "src",
        type: "string",
        default: "-",
        description: "Image source URL",
      },
      {
        prop: "alt",
        type: "string",
        default: "-",
        description: "Accessible alt text",
      },
      {
        prop: "loading",
        type: '"eager" | "lazy"',
        default: '"lazy"',
        description: "Native lazy loading",
      },
      {
        prop: "showSkeleton",
        type: "boolean",
        default: "true",
        description: "Show loading skeleton",
      },
      {
        prop: "onError",
        type: "() => void",
        default: "-",
        description: "Callback on image load error",
      },
    ],
  },
  {
    title: "CarouselCounter",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional classes",
      },
    ],
  },
  {
    title: "KiraCarousel",
    props: [
      {
        prop: "items",
        type: "React.ReactNode[]",
        default: "-",
        description: "Slide contents, rendered one per CarouselItem",
      },
      {
        prop: "arrows",
        type: "boolean",
        default: "true",
        description: "Render previous/next navigation arrows",
      },
      {
        prop: "dots",
        type: "boolean",
        default: "true",
        description: "Render dot indicators",
      },
      {
        prop: "progressBar",
        type: "boolean",
        default: "false",
        description: "Render real scroll progress bar",
      },
      {
        prop: "counter",
        type: "boolean",
        default: "false",
        description: "Render 1 / N position counter",
      },
      {
        prop: "autoplay",
        type: "boolean",
        default: "false",
        description:
          "Enable autoplay with play/pause button (stops on hover, focus, tab hidden, reduced motion)",
      },
      {
        prop: "thumbnails",
        type: "boolean",
        default: "false",
        description: "Render thumbnail strip (requires thumbnailImages)",
      },
      {
        prop: "thumbnailImages",
        type: "Array<{src, alt}>",
        default: "-",
        description: "Images for the thumbnail strip",
      },
      {
        prop: "itemClassName",
        type: "string",
        default: "-",
        description: "Class applied to each CarouselItem",
      },
    ],
  },
  {
    title: "useCarouselApi Hook",
    props: [
      {
        prop: "api",
        type: "EmblaCarouselType",
        default: "-",
        description: "Embla API instance",
      },
      {
        prop: "setApi",
        type: "(api) => void",
        default: "-",
        description: "Set API instance",
      },
      {
        prop: "current",
        type: "number",
        default: "0",
        description: "Current slide index",
      },
      {
        prop: "count",
        type: "number",
        default: "0",
        description: "Total slide count",
      },
      {
        prop: "canScrollPrev",
        type: "boolean",
        default: "false",
        description: "Can scroll to previous",
      },
      {
        prop: "canScrollNext",
        type: "boolean",
        default: "false",
        description: "Can scroll to next",
      },
      {
        prop: "scrollPrev",
        type: "() => void",
        default: "-",
        description: "Scroll to previous slide",
      },
      {
        prop: "scrollNext",
        type: "() => void",
        default: "-",
        description: "Scroll to next slide",
      },
      {
        prop: "scrollTo",
        type: "(index: number) => void",
        default: "-",
        description: "Scroll to specific slide",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const carouselPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "2026-11-04",
    changes: [
      {
        type: "fixed",
        title: "Autoplay rebuilt on the embla-carousel-autoplay plugin",
        description:
          "Replaces the hand-rolled setInterval timers (which could double up via mouse-leave/focus-out races). Pause on hover/focus is now plugin-managed and race-free.",
      },
      {
        type: "added",
        title: "Autoplay stops when the tab is hidden",
        description:
          "Rotating content pauses on visibilitychange and resumes when the tab is visible again (WCAG 2.2.2 / Â§9).",
      },
      {
        type: "breaking",
        title: "CarouselLightbox rebuilt on @base-ui/react/dialog",
        description:
          "Focus trap, focus return, Escape and scroll lock are now handled by the primitive. The lightbox no longer renders a plain div role=dialog. Visual markup is unchanged; className now applies to the Base UI Popup.",
      },
      {
        type: "fixed",
        title: "CarouselProgressBar reports real scroll progress",
        description:
          "Previously index-based ((selectedIndex+1)/slideCount); now driven by embla scrollProgress() with aria-valuenow 0-100.",
      },
      {
        type: "added",
        title: "KiraCarousel mega-component",
        description:
          "Composed carousel: items + boolean switches for arrows, dots, progress bar, counter, autoplay, thumbnails.",
      },
      {
        type: "removed",
        title: "Dead API removed",
        description:
          "CarouselProgress (duplicate of CarouselDots), unused useVisibleSlides hook, no-op CarouselItem/CarouselDot size props, no-op CarouselProps.autoHeight, and the lying demo-documented props (CarouselDots.align, CarouselProgressBar.position, CarouselThumbnails.size, CarouselLightbox.allowZoom/allowDownload, CarouselCounter.format).",
      },
      {
        type: "fixed",
        title: "GSAP drag animation scoped per carousel",
        description:
          "The drag press/scale effect targeted a global .embla__container selector; multiple carousels on one page animated together. Now scoped to the component root.",
      },
      {
        type: "fixed",
        title: "useCarouselApi listener leak",
        description:
          "The select handler was never removed on re-run/unmount; count/canScroll values now also refresh on reInit.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
