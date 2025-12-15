import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function AvatarPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Avatar</h1>
        <p className="text-muted-foreground">
          An image element with fallback for representing users.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Avatar
        </h2>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="flex items-end gap-4">
          <Avatar size="xs">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>XS</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>XL</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Fallback */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Fallback
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          When image fails to load or is not provided, the fallback is shown.
        </p>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="" alt="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Avatar Group
        </h2>
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-background">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://..." alt="Name" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

{/* Sizes: xs, sm, default, lg, xl */}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
