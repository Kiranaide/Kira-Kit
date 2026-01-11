import { AspectRatio } from "@/components/ui/aspect-ratio";

export function AspectRatioPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Aspect Ratio</h1>
        <p className="text-muted-foreground">
          Maintains a consistent width-to-height ratio for responsive media.
        </p>
      </header>

      {/* Preset Ratios */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Preset Ratios
        </h2>
        <p className="text-sm text-muted-foreground">
          Use string values for common aspect ratios.
        </p>
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">16:9 (Video)</p>
            <AspectRatio ratio="16:9" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                16:9
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">4:3 (Photo)</p>
            <AspectRatio ratio="4:3" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                4:3
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">1:1 (Square)</p>
            <AspectRatio ratio="1:1" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                1:1
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">9:16 (Story)</p>
            <AspectRatio ratio="9:16" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                9:16
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">21:9 (Ultrawide)</p>
            <AspectRatio ratio="21:9" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                21:9
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">3:2 (Classic)</p>
            <AspectRatio ratio="3:2" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                3:2
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">3:4 (Portrait)</p>
            <AspectRatio ratio="3:4" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                3:4
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">2:3 (Portrait)</p>
            <AspectRatio ratio="2:3" className="bg-muted rounded-lg overflow-hidden">
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                2:3
              </div>
            </AspectRatio>
          </div>
        </div>
      </section>

      {/* With Image */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Image
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Cover (default)</p>
            <AspectRatio ratio="16:9">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                alt="Sunset landscape"
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Contain</p>
            <AspectRatio ratio="16:9" fit="contain" className="bg-muted rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                alt="Sunset landscape"
                className="w-full h-full object-contain rounded-lg"
              />
            </AspectRatio>
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <p className="text-sm text-muted-foreground">
          Show a skeleton placeholder while content loads.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <AspectRatio ratio="16:9" loading>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Loading example"
              className="w-full h-full object-cover rounded-lg"
            />
          </AspectRatio>
          <AspectRatio ratio="1:1" loading>
            <img
              src="https://github.com/shadcn.png"
              alt="Loading example"
              className="w-full h-full object-cover rounded-lg"
            />
          </AspectRatio>
          <AspectRatio ratio="9:16" loading>
            <img
              src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=700&dpr=2&q=80"
              alt="Loading example"
              className="w-full h-full object-cover rounded-lg"
            />
          </AspectRatio>
        </div>
      </section>

      {/* Content Position */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Content Position
        </h2>
        <p className="text-sm text-muted-foreground">
          Control the position of content within the aspect ratio container.
        </p>
        <div className="grid gap-4 md:grid-cols-4">
          <AspectRatio ratio="4:3" position="center" className="bg-muted rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
              Center
            </div>
          </AspectRatio>
          <AspectRatio ratio="4:3" position="top" className="bg-muted rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
              Top
            </div>
          </AspectRatio>
          <AspectRatio ratio="4:3" position="bottom-left" className="bg-muted rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
              Bottom Left
            </div>
          </AspectRatio>
          <AspectRatio ratio="4:3" position="bottom-right" className="bg-muted rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
              Bottom Right
            </div>
          </AspectRatio>
        </div>
      </section>

      {/* With Video */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Video
        </h2>
        <p className="text-sm text-muted-foreground">
          Perfect for responsive video embeds.
        </p>
        <div className="max-w-xl">
          <AspectRatio ratio="16:9">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </AspectRatio>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { AspectRatio } from "@/components/ui/aspect-ratio"

// Preset ratios
<AspectRatio ratio="16:9">...</AspectRatio>
<AspectRatio ratio="4:3">...</AspectRatio>
<AspectRatio ratio="1:1">...</AspectRatio>
<AspectRatio ratio="9:16">...</AspectRatio>

// Custom ratio (still supported)
<AspectRatio ratio={21 / 9}>...</AspectRatio>

// Object-fit control
<AspectRatio ratio="16:9" fit="contain">...</AspectRatio>

// Loading skeleton
<AspectRatio ratio="16:9" loading>
  <img src="..." />
</AspectRatio>

// Content position
<AspectRatio ratio="16:9" position="top-left">...</AspectRatio>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
