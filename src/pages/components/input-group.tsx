import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  KiraInputGroup,
} from "@/components/ui/input-group";
import {
  IconSearch,
  IconEye,
  IconCopy,
  IconMail,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
  Changelog,
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

function KiraDemo() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [unit, setUnit] = useState("usd");

  return (
    <div className="max-w-sm space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Leading icon + clearable
        </p>
        <KiraInputGroup
          leadingIcon={<IconSearch className="w-4 h-4" />}
          placeholder="Search..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          clearable
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Amount with inline unit selector
        </p>
        <KiraInputGroup
          leadingIcon={<IconCurrencyDollar className="w-4 h-4" />}
          placeholder="0.00"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          units={[
            { value: "usd", label: "USD" },
            { value: "eur", label: "EUR" },
            { value: "gbp", label: "GBP" },
          ]}
          unitValue={unit}
          onUnitChange={setUnit}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Leading text + character counter
        </p>
        <KiraInputGroup
          leadingText="@"
          placeholder="handle"
          maxLength={15}
          counter
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}

const kiraCode = `import { KiraInputGroup } from "@/components/ui/input-group"
import { IconCurrencyDollar } from "@tabler/icons-react"

// Prop-driven wrapper: leading icon/text, trailing, unit selector,
// clearable, and a character counter — all behind one API.
<KiraInputGroup
  leadingIcon={<IconCurrencyDollar className="w-4 h-4" />}
  placeholder="0.00"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  units={[
    { value: "usd", label: "USD" },
    { value: "eur", label: "EUR" },
  ]}
  unitValue={unit}
  onUnitChange={setUnit}
  clearable
/>

<KiraInputGroup leadingText="@" maxLength={15} counter value={v} onChange={...} />`;

export default function InputGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Input Group"
        description="Input with addons, icons, and buttons attached."
        version="v2.1"
      />

      <FeatureGrid
        features={[
          {
            title: "Flexible Alignment",
            description:
              "Support for inline and block positioning with inline-start, inline-end, block-start, and block-end options.",
          },
          {
            title: "Rich Content",
            description:
              "Add icons, text labels, or action buttons to create enhanced input experiences.",
          },
          {
            title: "Accessible",
            description:
              "Proper ARIA roles and keyboard navigation for screen reader compatibility.",
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
          {
            value: "kira",
            label: "KiraInputGroup",
            demo: (
              <DemoWrapper
                title="KiraInputGroup"
                description="A prop-driven wrapper that composes leading icon/text, an inline unit/currency selector, a clear button, and a live character counter behind one API."
                code={kiraCode}
              >
                <KiraDemo />
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
          {
            title: "KiraInputGroup",
            props: [
              {
                prop: "leadingIcon",
                type: "ReactNode",
                default: "-",
                description: "Icon rendered in the inline-start addon.",
              },
              {
                prop: "leadingText",
                type: "string",
                default: "-",
                description: "Text rendered in the inline-start addon (e.g. @ or https://).",
              },
              {
                prop: "units",
                type: "{ value; label }[]",
                default: "-",
                description: "Options for the inline-end unit/currency selector.",
              },
              {
                prop: "unitValue / onUnitChange",
                type: "string / (v) => void",
                default: "-",
                description: "Controlled value and change handler for the unit selector.",
              },
              {
                prop: "clearable",
                type: "boolean",
                default: "false",
                description: "Show a clear button when the field has a value.",
              },
              {
                prop: "counter",
                type: "boolean",
                default: "false",
                description: "Show a live character counter (pair with maxLength).",
              },
            ],
          },
        ]}
      />

      <Changelog
        entries={[
          {
            version: "2.1.0",
            date: "10 July 2026",
            changes: [
              {
                type: "added",
                title: "KiraInputGroup",
                description:
                  "Added a prop-driven KiraInputGroup that composes leading icon/text, an inline unit/currency selector, a clear button, and a live character counter behind a single API — matching the Kira* convention used across the library.",
              },
              {
                type: "added",
                title: "Inline Unit Selector",
                description:
                  "Exposed InputGroupUnitSelect, a compact dropdown addon for units and currencies that sits flush against the input.",
              },
              {
                type: "changed",
                title: "Accessibility Polish",
                description:
                  "Added a data-slot to InputGroupText and ensured icon-only addon buttons meet the 24px minimum target size.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
