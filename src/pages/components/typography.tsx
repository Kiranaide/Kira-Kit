export function TypographyPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Typography</h1>
        <p className="text-muted-foreground">
          Text styles and formatting for consistent typography across your
          application.
        </p>
      </header>

      {/* Headings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Headings
        </h2>
        <div className="space-y-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Heading 1
          </h1>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Heading 2
          </h2>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Heading 3
          </h3>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Heading 4
          </h4>
          <h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Heading 5
          </h5>
          <h6 className="scroll-m-20 text-base font-semibold tracking-tight">
            Heading 6
          </h6>
        </div>
      </section>

      {/* Paragraph */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Paragraph
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The king, seeing how much happier his subjects were, realized the
          error of his ways. He gave up his greedy nature and began to share the
          kingdom's wealth with all.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          And so, the kingdom flourished under his benevolent rule, and the
          people lived happily ever after.
        </p>
      </section>

      {/* Lead Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Lead Text
        </h2>
        <p className="text-xl text-muted-foreground">
          A modal dialog that interrupts the user with important content and
          expects a response.
        </p>
      </section>

      {/* Large Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Large Text
        </h2>
        <div className="text-lg font-semibold">Are you absolutely sure?</div>
      </section>

      {/* Small Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Small Text
        </h2>
        <small className="text-sm font-medium leading-none">
          Email address
        </small>
      </section>

      {/* Muted Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Muted Text
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email address.
        </p>
      </section>

      {/* Blockquote */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Blockquote
        </h2>
        <blockquote className="mt-6 border-l-2 border-border pl-6 italic">
          "After all," he said, "everyone deserves a chance to fly."
        </blockquote>
      </section>

      {/* Inline Code */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Inline Code
        </h2>
        <p className="leading-7">
          Use the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            @tanstack/react-table
          </code>{" "}
          library for powerful data tables.
        </p>
      </section>

      {/* Lists */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Lists
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Unordered List</h4>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Ordered List</h4>
            <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Links
        </h2>
        <p className="leading-7">
          Visit our{" "}
          <a
            href="#"
            className="font-medium text-primary underline underline-offset-4"
          >
            documentation
          </a>{" "}
          to learn more.
        </p>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage Classes
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`{/* Heading 1 */}
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Title
</h1>

{/* Lead text */}
<p className="text-xl text-muted-foreground">
  Description
</p>

{/* Paragraph */}
<p className="leading-7 [&:not(:first-child)]:mt-6">
  Content
</p>

{/* Inline code */}
<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  code
</code>

{/* Blockquote */}
<blockquote className="mt-6 border-l-2 border-border pl-6 italic">
  Quote
</blockquote>

{/* List */}
<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>Item</li>
</ul>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
