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

      {/* Common Ratios */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Common Ratios
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">16:9 (Video)</p>
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                16:9
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">4:3 (Photo)</p>
            <AspectRatio ratio={4 / 3} className="bg-muted rounded-lg">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                4:3
              </div>
            </AspectRatio>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">1:1 (Square)</p>
            <AspectRatio ratio={1} className="bg-muted rounded-lg">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                1:1
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
        <div className="max-w-md">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Sunset landscape"
              className="rounded-lg object-cover w-full h-full"
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

<AspectRatio ratio={16 / 9}>
  <img src="..." className="object-cover w-full h-full" />
</AspectRatio>

{/* Common ratios: 16/9, 4/3, 1, 21/9, 3/2 */}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
