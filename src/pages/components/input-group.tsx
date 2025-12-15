import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { IconSearch, IconEye, IconCopy, IconMail } from "@tabler/icons-react";

export function InputGroupPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Input Group</h1>
        <p className="text-muted-foreground">
          Input with addons, icons, and buttons attached.
        </p>
      </header>

      {/* With Icon */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icon
        </h2>
        <div className="max-w-sm">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconSearch className="w-4 h-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>
        </div>
      </section>

      {/* With Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Text Addon
        </h2>
        <div className="max-w-sm space-y-3">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconMail className="w-4 h-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="you" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>@company.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </section>

      {/* With Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Button
        </h2>
        <div className="max-w-sm space-y-3">
          <InputGroup>
            <InputGroupInput placeholder="Enter password" type="password" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>
                <IconEye className="w-4 h-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Copy this text" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>
                <IconCopy className="w-4 h-4" />
                Copy
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconSearch />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
</InputGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
