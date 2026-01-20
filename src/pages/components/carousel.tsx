import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselDot,
  CarouselAutoplayButton,
  CarouselProgress,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPlay, IconPause, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

export default function CarouselPage() {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  const images = [
    { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop", title: "Office Space" },
    { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=400&fit=crop", title: "Modern Workspace" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop", title: "Creative Studio" },
    { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=400&fit=crop", title: "Meeting Room" },
  ]

  const products = [
    { name: "Pro Plan", price: "$29/mo", features: ["10 projects", "100GB storage", "Priority support"] },
    { name: "Team Plan", price: "$99/mo", features: ["Unlimited projects", "1TB storage", "24/7 support"] },
    { name: "Enterprise", price: "Custom", features: ["Custom solutions", "Dedicated support", "SLA"] },
    { name: "Starter", price: "$9/mo", features: ["3 projects", "10GB storage", "Email support"] },
    { name: "Business", price: "$49/mo", features: ["25 projects", "500GB storage", "Phone support"] },
  ]

  const testimonials = [
    { name: "Sarah J.", role: "CEO, TechCorp", text: "Amazing product that transformed our workflow!" },
    { name: "Mike R.", role: "CTO, StartupCo", text: "The best decision we made this year." },
    { name: "Emily L.", role: "PM, DesignHub", text: "Intuitive and powerful. Love it!" },
  ]

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Carousel</h1>
        <p className="text-muted-foreground">Accessible carousel with autoplay, navigation, and progress</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Image Carousel</h2>
        <p className="text-muted-foreground">Image gallery with prev/next navigation</p>

        <Carousel className="w-full max-w-3xl mx-auto" setCurrentSlide={setCurrentSlide}>
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.src}>
                <img src={img.src} alt={img.title} className="w-full h-[400px] object-cover rounded-lg" />
                <div className="text-center mt-2 font-medium">{img.title}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious>
            <IconChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext>
            <IconChevronRight className="h-4 w-4" />
          </CarouselNext>
          <CarouselDots className="mt-4">
            {images.map((_, i) => (
              <CarouselDot key={i} index={i} isActive={i === currentSlide} onClick={() => {}} />
            ))}
          </CarouselDots>
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Slider</h2>
        <p className="text-muted-foreground">Horizontal scroll with product cards</p>

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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Autoplay with Controls</h2>
        <p className="text-muted-foreground">Auto-scrolling with pause/play button and progress indicator</p>

        <Carousel autoplay autoplayInterval={3000} className="w-full max-w-2xl mx-auto">
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <Card className="py-8">
                  <CardContent className="text-center space-y-4">
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
            <CarouselPrevious />
            <CarouselAutoplayButton>
              <IconPlay className="h-4 w-4 play" />
              <IconPause className="h-4 w-4 pause" />
            </CarouselAutoplayButton>
            <CarouselNext />
          </div>
          <CarouselProgress className="mt-4" />
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Vertical Carousel</h2>
        <p className="text-muted-foreground">Vertical orientation for different layouts</p>

        <Carousel orientation="vertical" className="w-full max-w-md mx-auto h-[400px]">
          <CarouselContent className="h-[300px]">
            {images.map((img) => (
              <CarouselItem key={img.src}>
                <Card>
                  <CardContent className="p-0">
                    <img src={img.src} alt={img.title} className="w-full h-[280px] object-cover rounded-lg" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dot Navigation</h2>
        <p className="text-muted-foreground">Different dot styling options</p>

        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-2">Default Dots</h3>
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {images.map((img) => (
                  <CarouselItem key={img.src}>
                    <img src={img.src} alt={img.title} className="w-full h-[300px] object-cover rounded-lg" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots className="mt-4">
                {images.map((_, i) => (
                  <CarouselDot key={i} index={i} onClick={() => {}} />
                ))}
              </CarouselDots>
            </Carousel>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loop Mode</h2>
        <p className="text-muted-foreground">Infinite scrolling through all items</p>

        <Carousel loop className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.src}>
                <img src={img.src} alt={img.title} className="w-full h-[300px] object-cover rounded-lg" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="mt-4">
            {images.map((_, i) => (
              <CarouselDot key={i} index={i} onClick={() => {}} />
            ))}
          </CarouselDots>
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Fade Variant</h2>
        <p className="text-muted-foreground">Smooth crossfade transitions</p>

        <Carousel variant="fade" className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.src} variant="fade">
                <img src={img.src} alt={img.title} className="w-full h-[300px] object-cover rounded-lg" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  )
}
