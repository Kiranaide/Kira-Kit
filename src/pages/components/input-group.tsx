import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { IconSearch, IconEye, IconCopy, IconMail } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function IconDemo() {
  return (
    <div className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
    </div>
  );
}

const iconCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconSearch } from "@tabler/icons-react"

<InputGroup>
  <InputGroupAddon align="inline-start">
    <IconSearch className="w-4 h-4" />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
</InputGroup>`;

function TextDemo() {
  return (
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
  );
}

const textCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { IconMail } from "@tabler/icons-react"

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
</InputGroup>`;

function ButtonDemo() {
  return (
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
  );
}

const buttonCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconEye, IconCopy } from "@tabler/icons-react"

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
</InputGroup>`;

const usageCode = `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { IconSearch } from "@tabler/icons-react"

export function MyInputGroup() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconSearch className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Password" type="password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <IconEye className="w-4 h-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}`;

export function InputGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Input Group"
        description="Input with addons, icons, and buttons attached."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Flexible Alignment",
            description: "Support for inline and block positioning with inline-start, inline-end, block-start, and block-end options.",
          },
          {
            title: "Rich Content",
            description: "Add icons, text labels, or action buttons to create enhanced input experiences.",
          },
          {
            title: "Accessible",
            description: "Proper ARIA roles and keyboard navigation for screen reader compatibility.",
          },
        ]}
      />

      <DemoTabs
        tabs={[
          {
            value: "icon",
            label: "Icon",
            demo: (
              <DemoWrapper
                title="With Icon"
                description="Add icons to input for enhanced visual context."
                code={iconCode}
              >
                <IconDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "text",
            label: "Text",
            demo: (
              <DemoWrapper
                title="With Text Addons"
                description="Prefix or suffix text labels to inputs for fixed values."
                code={textCode}
              >
                <TextDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "button",
            label: "Button",
            demo: (
              <DemoWrapper
                title="With Button"
                description="Add action buttons like password toggle or copy functionality."
                code={buttonCode}
              >
                <ButtonDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use the Input Group components together."
      />

      <APIReference
        sections={[
          {
            title: "InputGroup",
            props: [
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for the container.",
              },
            ],
          },
          {
            title: "InputGroupAddon",
            props: [
              {
                prop: "align",
                type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
                default: '"inline-start"',
                description: "Position of the addon relative to the input.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for the addon.",
              },
            ],
          },
          {
            title: "InputGroupButton",
            props: [
              {
                prop: "type",
                type: '"button" | "submit" | "reset"',
                default: '"button"',
                description: "Button type attribute.",
              },
              {
                prop: "variant",
                type: "Button variant",
                default: '"ghost"',
                description: "Visual style of the button.",
              },
              {
                prop: "size",
                type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
                default: '"xs"',
                description: "Size of the button.",
              },
            ],
          },
          {
            title: "InputGroupInput",
            props: [
              {
                prop: "...props",
                type: "React.ComponentProps<'input'>",
                default: "-",
                description: "All standard HTML input attributes.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for the input.",
              },
            ],
          },
          {
            title: "InputGroupText",
            props: [
              {
                prop: "children",
                type: "ReactNode",
                default: "-",
                description: "Text content to display in the addon.",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for the text.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
