import * as React from "react";
import { IconMail, IconAt, IconMoon, IconSun } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  Section,
  DemoWrapper,
} from "@/components/docs";
import { Button } from "@/components/ui/button";
import {
  Input,
  NumericInput,
  InputWithButton,
  InputWithDropdown,
  InputWithSpinner,
  InputCluster,
  SearchInput,
  PasswordInput,
} from "@/components/ui/input";
import { KiraSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldGroup,
  FieldErrorSummary,
  KiraField,
} from "@/components/ui/field";
import { useTheme } from "@/components/ui/sidebar";

const SIZES = ["xs", "sm", "default", "lg", "xl"] as const;

type PreviewSize = (typeof SIZES)[number];

const SIZE_META: Record<PreviewSize, string> = {
  xs: "h-7 · 28px",
  sm: "h-8 · 32px",
  default: "h-9 · 36px",
  lg: "h-10 · 40px",
  xl: "h-11 · 44px",
};

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "mango", label: "Mango" },
];

const DROPDOWN_OPTIONS = [
  { value: "https", label: "https://" },
  { value: "http", label: "http://" },
];

function LadderRow({ size }: { size: PreviewSize }) {
  const [count, setCount] = React.useState<number | null>(12);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {size} · {SIZE_META[size]}
      </span>
      <Button size={size}>Button</Button>
      <Input size={size} placeholder="Input" className="w-40" />
      <KiraSelect
        size={size}
        options={FRUIT_OPTIONS}
        defaultValue="apple"
        className="w-40"
        aria-label={`Select ${size}`}
      />
      <NumericInput
        size={size}
        value={count}
        onValueChange={setCount}
        className="w-32"
        aria-label={`Quantity ${size}`}
      />
    </div>
  );
}

function HeightLadder() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {SIZES.map((size) => (
          <LadderRow key={size} size={size} />
        ))}
      </div>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Textarea is multi-line: its min-height ladder (12/16/20/24) uses the
          documented vertical-text py exceptions, so it sits apart from the
          single-line controls.
        </p>
        {(["sm", "default", "lg", "xl"] as const).map((size) => (
          <div key={size} className="flex flex-wrap items-start gap-3">
            <span className="w-28 shrink-0 pt-2 text-xs text-muted-foreground">
              {size}
            </span>
            <Textarea
              size={size}
              rows={2}
              placeholder={`Textarea ${size}`}
              className="max-w-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CompositeCell({ size }: { size: PreviewSize }) {
  const [count, setCount] = React.useState<number | null>(3);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">
        {size} · {SIZE_META[size]}
      </p>
      <InputWithButton size={size} buttonText="Apply" placeholder="Coupon" />
      <InputWithDropdown
        size={size}
        options={DROPDOWN_OPTIONS}
        dropdownValue="https"
        placeholder="example.com"
      />
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="domain" />
      </InputGroup>
      <NumericInput
        size={size}
        value={count}
        onValueChange={setCount}
        showButtons
        aria-label={`Stepper ${size}`}
      />
      <InputCluster>
        <Input size={size} placeholder="First" aria-label="First name" />
        <Input size={size} placeholder="Last" aria-label="Last name" />
      </InputCluster>
    </div>
  );
}

function CompositeSeams() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {SIZES.map((size) => (
        <CompositeCell key={size} size={size} />
      ))}
    </div>
  );
}

const DEMO_EMAIL = "jane@acme.com";

const WORST_EMAIL =
  "bartholomew.fitzgerald@northwind-industries-holdings.example.com";

// oxlint-disable-next-line sonarjs/no-hardcoded-passwords -- demo fixture for the worst-case toggle, not a credential
const DEMO_PASSWORD = "hunter2";

// oxlint-disable-next-line sonarjs/no-hardcoded-passwords -- demo fixture for the worst-case toggle, not a credential
const WORST_PASSWORD = "correct-horse-battery-staple-東京-🔐";

const DEMO_QUERY = "design tokens";

const WORST_QUERY =
  "internationalization accessibility review workspace 東京 /กรุงเทพฯ";

type AffordanceRender = (
  size: PreviewSize,
  value: string,
  onChange: (next: string) => void,
) => React.ReactNode;

interface AffordanceRow {
  label: string;
  demo: string;
  worst: string;
  render: AffordanceRender;
}

const AFFORDANCES: AffordanceRow[] = [
  {
    label: "Prefix",
    demo: DEMO_EMAIL,
    worst: WORST_EMAIL,
    render: (size, value, onChange) => (
      <Input
        size={size}
        prefix={<IconMail />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Email with prefix"
      />
    ),
  },
  {
    label: "Suffix",
    demo: "jane",
    worst: "aleksandra.wisniewska-kowalczyk",
    render: (size, value, onChange) => (
      <Input
        size={size}
        suffix={<IconAt />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Username with suffix"
      />
    ),
  },
  {
    label: "Clear",
    demo: DEMO_EMAIL,
    worst: WORST_EMAIL,
    render: (size, value, onChange) => (
      <Input
        size={size}
        showClear
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={() => onChange("")}
        aria-label="Clearable email"
      />
    ),
  },
  {
    label: "Copy",
    demo: DEMO_EMAIL,
    worst: WORST_EMAIL,
    render: (size, value, onChange) => (
      <Input
        size={size}
        showCopy
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Copyable email"
      />
    ),
  },
  {
    label: "Clear + copy",
    demo: DEMO_EMAIL,
    worst: WORST_EMAIL,
    render: (size, value, onChange) => (
      <Input
        size={size}
        showClear
        showCopy
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={() => onChange("")}
        aria-label="Clearable and copyable email"
      />
    ),
  },
  {
    label: "Password",
    demo: DEMO_PASSWORD,
    worst: WORST_PASSWORD,
    render: (size, value, onChange) => (
      <PasswordInput
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Password"
      />
    ),
  },
  {
    label: "Spinner",
    demo: DEMO_EMAIL,
    worst: WORST_EMAIL,
    render: (size, value, onChange) => (
      <InputWithSpinner
        size={size}
        isLoading
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Validating email"
      />
    ),
  },
  {
    label: "Search",
    demo: DEMO_QUERY,
    worst: WORST_QUERY,
    render: (size, value, onChange) => (
      <SearchInput
        size={size}
        value={value}
        onChange={onChange}
        showClear
        aria-label="Search"
      />
    ),
  },
];

function AffordanceCell({
  initial,
  render,
  size,
}: {
  initial: string;
  render: AffordanceRender;
  size: PreviewSize;
}) {
  const [value, setValue] = React.useState(initial);

  return <>{render(size, value, setValue)}</>;
}

function AffordanceMatrix() {
  const [worst, setWorst] = React.useState(false);

  return (
    <div className="space-y-4">
      <div
        className="flex items-center gap-2"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a dataset toggle is a generic group; fieldset would imply form semantics it doesn't have
        role="group"
        aria-label="Dataset"
      >
        <Button
          size="sm"
          variant={worst ? "outline" : "secondary"}
          aria-pressed={!worst}
          onClick={() => setWorst(false)}
        >
          Demo data
        </Button>
        <Button
          size="sm"
          variant={worst ? "secondary" : "outline"}
          aria-pressed={worst}
          onClick={() => setWorst(true)}
        >
          Worst case
        </Button>
        <span className="text-xs text-muted-foreground">
          Long values prove the pr-16…19 double-action offsets never collide
          with the text.
        </span>
      </div>
      <div className="space-y-4">
        {AFFORDANCES.map((row) => (
          <div key={row.label} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {row.label}
            </p>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {SIZES.map((size) => (
                <AffordanceCell
                  key={`${row.label}-${size}-${worst}`}
                  size={size}
                  initial={worst ? row.worst : row.demo}
                  render={row.render}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuUnification() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <KiraSelect
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          className="w-44"
          aria-label="Plain select"
        />
        <KiraSelect
          searchable
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          className="w-44"
          aria-label="Searchable combobox"
        />
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Delete workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground">
        Open all three: every item shares one metric — px-2 py-1.5, min-h-8,
        gap-2 — inside a p-1 popup, with one label metric (px-2 py-1.5). The
        combobox virtualizer estimates 32px per item to match.
      </p>
    </div>
  );
}

function OverlayTriggers() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Container tier</DialogTitle>
            <DialogDescription>
              Dialog bodies use the p-6 container tier, like Card.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Popover
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <PopoverTitle>Popover tier</PopoverTitle>
          <PopoverDescription>
            Popovers sit between menus (p-1) and containers (p-6).
          </PopoverDescription>
        </PopoverContent>
      </Popover>
      <Drawer>
        <DrawerTrigger render={<Button variant="outline" />}>
          Drawer
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer tier</DrawerTitle>
            <DrawerDescription>
              Drawers share the container padding tier.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-sm text-muted-foreground">
              Content pads to the same p-6 rhythm as Card and Dialog.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function ContainerTiers() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Card · p-6</CardTitle>
            <CardDescription>Default container tier.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The Card owns the padding; sections add rhythm with mb-4/pt-6, not
              their own horizontal padding.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Confirm</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Card sm · p-4</CardTitle>
            <CardDescription>Compact container tier.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compact cards tighten to p-4 with mb-3/pt-4 section rhythm.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Confirm</Button>
          </CardFooter>
        </Card>
      </div>
      <OverlayTriggers />
      <FieldErrorSummary
        errors={[
          {
            id: "preview-name",
            label: "Name",
            message: "Name is required.",
          },
          {
            id: "preview-email",
            label: "Email",
            message: "Enter a valid email address.",
          },
        ]}
      />
    </div>
  );
}

function FormStack() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FieldGroup>
        <KiraField
          label="Name"
          name="preview-name"
          description="FieldGroup stacks fields with gap-6."
          inputProps={{ id: "preview-name", placeholder: "Jo" }}
        />
        <KiraField
          label="Email"
          name="preview-email"
          inputProps={{
            id: "preview-email",
            type: "email",
            placeholder: "jo@acme.com",
          }}
        />
        <KiraField
          label="Reply-to"
          defaultValue="team@studio.example"
          description="Same rhythm at every field."
        />
      </FieldGroup>
      <div className="space-y-6">
        <Field>
          <FieldLabel>FieldControl</FieldLabel>
          <FieldControl
            aria-label="FieldControl example"
            placeholder="min-h-9"
          />
        </Field>
        <Field>
          <FieldLabel>Input</FieldLabel>
          <Input aria-label="Input example" placeholder="h-9" />
        </Field>
        <p className="text-sm text-muted-foreground">
          FieldControl (rounded-lg px-4 py-1, min-h-9) and a default Input share
          the same 36px height and horizontal padding.
        </p>
      </div>
    </div>
  );
}

function TouchMobile() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xl">Tap target</Button>
        <Input size="xl" placeholder="44px input" className="w-48" />
        <KiraSelect
          size="xl"
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          className="w-44"
          aria-label="Touch select"
        />
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>xl is the 44px touch tier (WCAG 2.5.5 enhanced target size).</li>
        <li>
          Inputs keep text-base below md so iOS Safari never zooms on focus;
          sm/xs text sizes are desktop-density tiers.
        </li>
        <li>
          Targets keep at least 8px between them (gap-2+); the coarse-pointer
          sidebar keeps its min-h-11 chrome.
        </li>
      </ul>
    </div>
  );
}

function ThemeMotion() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={toggleTheme}
        leftIcon={theme === "light" ? <IconMoon /> : <IconSun />}
      >
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Every metric on this page is theme-independent: spacing, heights, and
        radii come from the same tokens in light and dark. All motion honors
        prefers-reduced-motion through the global gate in index.css and
        per-component JS gates — enable it in your OS and popups snap instead of
        animating.
      </p>
    </div>
  );
}

const ladderCode = `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KiraSelect } from "@/components/ui/select"

// One ladder everywhere: xs h-7 · sm h-8 · default h-9 · lg h-10 · xl h-11
<Button size="lg">Button</Button>
<Input size="lg" placeholder="Input" />
<KiraSelect size="lg" options={options} />`;

const affordanceCode = `import { Input } from "@/components/ui/input"

// Double-action offset: container px + 2×24px actions + gaps = pr-16…19
<Input showClear showCopy value={value} onChange={onChange} />
<Input size="xl" showClear showCopy value={value} onChange={onChange} />`;

export default function UIPreviewPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="UI Preview"
        description="The spacing contract in one page: one control ladder, one menu metric, container tiers, and the affordance offsets that keep them honest."
        badge={
          <span className="text-xs text-muted-foreground">
            4px scale · steps 1 2 3 4 5 6 8 10 12 16
          </span>
        }
      />
      <Section
        title="1 · Height ladder"
        description="Button, Input, Select, and NumericInput share one height and padding ladder at every size."
      >
        <DemoWrapper
          title="Control ladder"
          description="Same baseline, same heights — no per-component drift."
          code={ladderCode}
        >
          <HeightLadder />
        </DemoWrapper>
      </Section>
      <Section
        title="2 · Composite seams"
        description="Composites compose the ladder instead of hardcoding heights: buttons, dropdowns, addons, and steppers all match their input."
      >
        <CompositeSeams />
      </Section>
      <Section
        title="3 · Affordance matrix"
        description="Prefix, suffix, clear, copy, password, spinner, and search at every size. Flip to worst-case data to stress the double-action offsets."
      >
        <DemoWrapper
          title="Affordances × sizes"
          description="Text never collides with actions, even with a 60-character email."
          code={affordanceCode}
        >
          <AffordanceMatrix />
        </DemoWrapper>
      </Section>
      <Section
        title="4 · Menu unification"
        description="Select, combobox, and dropdown menu items are visually identical."
      >
        <MenuUnification />
      </Section>
      <Section
        title="5 · Container tiers"
        description="Card p-6 / Card sm p-4, overlays on the same tier, menus at p-1, and the error summary container."
      >
        <ContainerTiers />
      </Section>
      <Section
        title="6 · Form stack"
        description="gap-6 field rhythm; FieldControl and Input agree on height and padding."
      >
        <FormStack />
      </Section>
      <Section
        title="7 · Touch & mobile"
        description="The xl tier is the 44px touch target; inputs stay zoom-safe on iOS."
      >
        <TouchMobile />
      </Section>
      <Section
        title="8 · Theme & motion"
        description="Metrics are theme-independent; motion is reduced-motion aware."
      >
        <ThemeMotion />
      </Section>
    </ComponentPage>
  );
}
