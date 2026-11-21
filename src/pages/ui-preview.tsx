import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  IconArrowUpRight,
  IconAt,
  IconCheck,
  IconLayoutSidebarRight,
  IconMail,
  IconMessage,
  IconRotateClockwise2,
  IconSquare,
  IconTrash,
} from "@tabler/icons-react";
import { cn } from "cn";
import { CodePanel } from "@/components/docs/code-panel";
import { DocCallout, DocPage, DocSection } from "@/components/docs/doc-page";
import { Button, LoadingButton } from "@/components/ui/button";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldControl,
  FieldErrorSummary,
  FieldGroup,
  FieldLabel,
  KiraField,
} from "@/components/ui/field";
import {
  Input,
  InputCluster,
  InputWithButton,
  InputWithDropdown,
  InputWithSpinner,
  NumericInput,
  PasswordInput,
  SearchInput,
} from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KiraSelect } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { usePreset, type ThemePreset } from "@/lib/theme-presets";

const SIZES = ["xs", "sm", "default", "lg", "xl"] as const;

type PreviewSize = (typeof SIZES)[number];

const SIZE_META: Record<PreviewSize, { px: string; tw: string }> = {
  xs: { px: "28px", tw: "h-7" },
  sm: { px: "32px", tw: "h-8" },
  default: { px: "36px", tw: "h-9" },
  lg: { px: "40px", tw: "h-10" },
  xl: { px: "44px", tw: "h-11" },
};

const SIZE_OPTIONS = SIZES.map((size) => ({
  value: size,
  label: `${size} · ${SIZE_META[size].px}`,
}));

const INPUT_GROUP_HEIGHT: Record<PreviewSize, string> = {
  xs: "h-7",
  sm: "h-8",
  default: "h-9",
  lg: "h-10",
  xl: "h-11",
};

const TEXTAREA_SPECS = [
  { size: "sm", height: "48px", minHeightClass: "min-h-12" },
  { size: "default", height: "64px", minHeightClass: "min-h-16" },
  { size: "lg", height: "80px", minHeightClass: "min-h-20" },
  { size: "xl", height: "96px", minHeightClass: "min-h-24" },
] as const;

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

const SECTIONS = [
  { value: "component-playground", label: "Component playground" },
  { value: "control-sizes", label: "Control sizes" },
  { value: "input-combinations", label: "Input combinations" },
  { value: "input-actions", label: "Input actions" },
  { value: "menus-and-overlays", label: "Menus and overlays" },
  { value: "container-spacing", label: "Container spacing" },
  { value: "form-spacing", label: "Form spacing" },
  { value: "touch-and-motion", label: "Touch and motion" },
] as const;

const PLAYGROUND_COMPONENTS = ["button", "input", "select", "dialog"] as const;

type PlaygroundComponent = (typeof PLAYGROUND_COMPONENTS)[number];

const PLAYGROUND_VIEWS = ["preview", "code"] as const;

type PlaygroundView = (typeof PLAYGROUND_VIEWS)[number];

const BUTTON_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
] as const;

type PlaygroundButtonVariant = (typeof BUTTON_VARIANTS)[number];

const BUTTON_STATES = ["default", "loading", "disabled"] as const;

type PlaygroundButtonState = (typeof BUTTON_STATES)[number];

const INPUT_CONTENT_MODES = ["demo", "long"] as const;

type PlaygroundInputContent = (typeof INPUT_CONTENT_MODES)[number];

const INPUT_ACTION_MODES = ["both", "clear", "copy", "none"] as const;

type PlaygroundInputActions = (typeof INPUT_ACTION_MODES)[number];

const SELECT_MODES = ["select", "searchable"] as const;

type PlaygroundSelectMode = (typeof SELECT_MODES)[number];

const SELECT_STATES = ["default", "disabled"] as const;

type PlaygroundSelectState = (typeof SELECT_STATES)[number];

const DIALOG_VARIANTS = ["destructive", "standard"] as const;

type PlaygroundDialogVariant = (typeof DIALOG_VARIANTS)[number];

const DATASET_MODES = ["demo", "worst"] as const;

type DatasetMode = (typeof DATASET_MODES)[number];

const DEMO_EMAIL = "jane@acme.com";

const WORST_EMAIL =
  "bartholomew.fitzgerald@northwind-industries-holdings.example.com";

// oxlint-disable-next-line sonarjs/no-hardcoded-passwords -- demo fixture for the worst-case toggle, not a credential
const DEMO_PASSWORD = "hunter2";

// oxlint-disable-next-line sonarjs/no-hardcoded-passwords -- demo fixture for the worst-case toggle, not a credential
const WORST_PASSWORD = "correct-horse-battery-staple-東京-🔐";

const DEMO_QUERY = "Design tokens";

const WORST_QUERY = "Accessibility review workspace 東京 / กรุงเทพฯ";

const LADDER_CODE = `<Button size="lg">Save</Button>
<Input size="lg" placeholder="Name" />
<KiraSelect size="lg" options={options} />`;

type SelectionInput = string | string[] | number | null | undefined;

function matchOption<T extends string>(
  raw: SelectionInput,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((item) => item === raw);
}

function scrollToSection(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById(id)?.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}

function presetVars(preset: ThemePreset, mode: "light" | "dark") {
  // SAFETY: cssVars holds only `--*` custom properties, which React's closed
  // CSSProperties type cannot express.
  return {
    ...preset.cssVars[mode],
    ...preset.cssVars.theme,
    colorScheme: mode,
  } as React.CSSProperties;
}

function MobileSectionJump() {
  return (
    <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:hidden">
      <KiraSelect
        size="xl"
        options={[...SECTIONS]}
        placeholder="Jump to a section"
        aria-label="Jump to a section"
        onChange={(next) => {
          const target = matchOption(
            next,
            SECTIONS.map((s) => s.value),
          );

          if (target) scrollToSection(target);
        }}
      />
    </div>
  );
}

interface PlaygroundState {
  component: PlaygroundComponent;
  view: PlaygroundView;
  buttonVariant: PlaygroundButtonVariant;
  buttonSize: PreviewSize;
  buttonState: PlaygroundButtonState;
  inputSize: PreviewSize;
  inputContent: PlaygroundInputContent;
  inputActions: PlaygroundInputActions;
  selectSize: PreviewSize;
  selectMode: PlaygroundSelectMode;
  selectState: PlaygroundSelectState;
  dialogVariant: PlaygroundDialogVariant;
  dialogSize: PreviewSize;
}

const INITIAL_PLAYGROUND: PlaygroundState = {
  component: "button",
  view: "preview",
  buttonVariant: "default",
  buttonSize: "xl",
  buttonState: "loading",
  inputSize: "xl",
  inputContent: "long",
  inputActions: "both",
  selectSize: "default",
  selectMode: "select",
  selectState: "default",
  dialogVariant: "destructive",
  dialogSize: "xl",
};

const PLAYGROUND_DOCS: Record<
  PlaygroundComponent,
  { label: string; to: string }
> = {
  button: { label: "Open Button docs", to: "/components/button" },
  input: { label: "Open Input docs", to: "/components/input" },
  select: { label: "Open Select docs", to: "/components/select" },
  dialog: { label: "Open Dialog docs", to: "/components/dialog" },
};

function buttonSnippet(state: PlaygroundState): string {
  const variantProp =
    state.buttonVariant === "default"
      ? ""
      : `\n  variant="${state.buttonVariant}"`;

  const sizeProp =
    state.buttonSize === "default" ? "" : ` size="${state.buttonSize}"`;

  if (state.buttonState === "loading") {
    return `<LoadingButton${sizeProp}${variantProp}\n  isLoading\n  loadingText="Saving…"\n>\n  Save changes\n</LoadingButton>`;
  }

  const disabledProp = state.buttonState === "disabled" ? " disabled" : "";

  return `<Button${sizeProp}${variantProp}${disabledProp}>\n  Save changes\n</Button>`;
}

function inputSnippet(state: PlaygroundState): string {
  const sizeProp =
    state.inputSize === "default" ? "" : `\n  size="${state.inputSize}"`;

  const clearProp =
    state.inputActions === "clear" || state.inputActions === "both"
      ? "\n  showClear"
      : "";

  const copyProp =
    state.inputActions === "copy" || state.inputActions === "both"
      ? "\n  showCopy"
      : "";

  const sample = state.inputContent === "long" ? WORST_EMAIL : DEMO_EMAIL;

  return `<Input${sizeProp}${clearProp}${copyProp}\n  defaultValue="${sample}"\n/>`;
}

function selectSnippet(state: PlaygroundState): string {
  const sizeProp =
    state.selectSize === "default" ? "" : `\n  size="${state.selectSize}"`;

  const searchProp = state.selectMode === "searchable" ? "\n  searchable" : "";

  const disabledProp = state.selectState === "disabled" ? "\n  disabled" : "";

  return `<KiraSelect${sizeProp}${searchProp}${disabledProp}\n  options={fruitOptions}\n  defaultValue="apple"\n/>`;
}

function dialogSnippet(state: PlaygroundState): string {
  const destructiveAttr =
    state.dialogVariant === "destructive" ? ' variant="destructive"' : "";

  return `<Dialog>
  <DialogTrigger render={<Button size="${state.dialogSize}">Discard changes</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Discard changes?</DialogTitle>
      <DialogDescription>
        Your unsaved changes will be lost.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <DialogClose render={<Button${destructiveAttr}>Discard</Button>} />
    </DialogFooter>
  </DialogContent>
</Dialog>`;
}

const SNIPPET_BUILDERS: Record<
  PlaygroundComponent,
  (state: PlaygroundState) => string
> = {
  button: buttonSnippet,
  input: inputSnippet,
  select: selectSnippet,
  dialog: dialogSnippet,
};

function getPlaygroundBehaviorNote(state: PlaygroundState): string {
  if (state.component === "button") {
    if (state.buttonState === "loading") {
      return "While the action is pending, the button shows a loading label and blocks repeat presses.";
    }

    if (state.buttonState === "disabled") {
      return "Disabled buttons stay muted and block pointer and keyboard activation.";
    }

    return "Press or activate with Enter or Space to test focus rings and press feedback.";
  }

  if (state.component === "input") {
    return "Tab reaches Clear and Copy in order. Long values scroll inside the field without overlapping actions.";
  }

  if (state.component === "select") {
    return "Arrow keys move through options. Escape closes the menu and restores focus.";
  }

  return "Escape closes the dialog and returns focus to its trigger.";
}

function PlaygroundField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
      {children}
    </div>
  );
}

interface SettingsProps {
  state: PlaygroundState;
  onChange: (patch: Partial<PlaygroundState>) => void;
}

function ButtonSettings({ state, onChange }: SettingsProps) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      <PlaygroundField label="Variant">
        <KiraSelect
          value={state.buttonVariant}
          aria-label="Button variant"
          options={[
            { value: "default", label: "Default" },
            { value: "outline", label: "Outline" },
            { value: "secondary", label: "Secondary" },
            { value: "ghost", label: "Ghost" },
            { value: "destructive", label: "Destructive" },
          ]}
          onChange={(next) => {
            const v = matchOption(next, BUTTON_VARIANTS);

            if (v) onChange({ buttonVariant: v });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="Size">
        <KiraSelect
          value={state.buttonSize}
          aria-label="Button size"
          options={SIZE_OPTIONS}
          onChange={(next) => {
            const s = matchOption(next, SIZES);

            if (s) onChange({ buttonSize: s });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="State">
        <KiraSelect
          value={state.buttonState}
          aria-label="Button state"
          options={[
            { value: "default", label: "Default" },
            { value: "loading", label: "Loading" },
            { value: "disabled", label: "Disabled" },
          ]}
          onChange={(next) => {
            const st = matchOption(next, BUTTON_STATES);

            if (st) onChange({ buttonState: st });
          }}
        />
      </PlaygroundField>
    </div>
  );
}

function InputSettings({ state, onChange }: SettingsProps) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      <PlaygroundField label="Content">
        <KiraSelect
          value={state.inputContent}
          aria-label="Input content"
          options={[
            { value: "demo", label: "Short value" },
            { value: "long", label: "Long value" },
          ]}
          onChange={(next) => {
            const c = matchOption(next, INPUT_CONTENT_MODES);

            if (c) onChange({ inputContent: c });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="Size">
        <KiraSelect
          value={state.inputSize}
          aria-label="Input size"
          options={SIZE_OPTIONS}
          onChange={(next) => {
            const s = matchOption(next, SIZES);

            if (s) onChange({ inputSize: s });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="Actions">
        <KiraSelect
          value={state.inputActions}
          aria-label="Input actions"
          options={[
            { value: "both", label: "Clear + copy" },
            { value: "clear", label: "Clear" },
            { value: "copy", label: "Copy" },
            { value: "none", label: "None" },
          ]}
          onChange={(next) => {
            const a = matchOption(next, INPUT_ACTION_MODES);

            if (a) onChange({ inputActions: a });
          }}
        />
      </PlaygroundField>
    </div>
  );
}

function SelectSettings({ state, onChange }: SettingsProps) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      <PlaygroundField label="Mode">
        <KiraSelect
          value={state.selectMode}
          aria-label="Select mode"
          options={[
            { value: "select", label: "Select" },
            { value: "searchable", label: "Searchable" },
          ]}
          onChange={(next) => {
            const m = matchOption(next, SELECT_MODES);

            if (m) onChange({ selectMode: m });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="Size">
        <KiraSelect
          value={state.selectSize}
          aria-label="Select size"
          options={SIZE_OPTIONS}
          onChange={(next) => {
            const s = matchOption(next, SIZES);

            if (s) onChange({ selectSize: s });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="State">
        <KiraSelect
          value={state.selectState}
          aria-label="Select state"
          options={[
            { value: "default", label: "Default" },
            { value: "disabled", label: "Disabled" },
          ]}
          onChange={(next) => {
            const st = matchOption(next, SELECT_STATES);

            if (st) onChange({ selectState: st });
          }}
        />
      </PlaygroundField>
    </div>
  );
}

function DialogSettings({ state, onChange }: SettingsProps) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <PlaygroundField label="Intent">
        <KiraSelect
          value={state.dialogVariant}
          aria-label="Dialog intent"
          options={[
            { value: "destructive", label: "Destructive confirm" },
            { value: "standard", label: "Standard modal" },
          ]}
          onChange={(next) => {
            const v = matchOption(next, DIALOG_VARIANTS);

            if (v) onChange({ dialogVariant: v });
          }}
        />
      </PlaygroundField>
      <PlaygroundField label="Trigger size">
        <KiraSelect
          value={state.dialogSize}
          aria-label="Dialog trigger size"
          options={SIZE_OPTIONS}
          onChange={(next) => {
            const s = matchOption(next, SIZES);

            if (s) onChange({ dialogSize: s });
          }}
        />
      </PlaygroundField>
    </div>
  );
}

function PlaygroundSettings({ state, onChange }: SettingsProps) {
  if (state.component === "button") {
    return <ButtonSettings state={state} onChange={onChange} />;
  }

  if (state.component === "input") {
    return <InputSettings state={state} onChange={onChange} />;
  }

  if (state.component === "select") {
    return <SelectSettings state={state} onChange={onChange} />;
  }

  return <DialogSettings state={state} onChange={onChange} />;
}

function PlaygroundInputStage({ state }: { state: PlaygroundState }) {
  const initial = state.inputContent === "long" ? WORST_EMAIL : DEMO_EMAIL;
  const [value, setValue] = React.useState(initial);

  return (
    <div className="w-full max-w-md">
      <Input
        size={state.inputSize}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue("")}
        showClear={
          state.inputActions === "clear" || state.inputActions === "both"
        }
        showCopy={
          state.inputActions === "copy" || state.inputActions === "both"
        }
        aria-label="Playground email input"
      />
    </div>
  );
}

function PlaygroundStage({ state }: { state: PlaygroundState }) {
  if (state.component === "button") {
    return (
      <LoadingButton
        variant={state.buttonVariant}
        size={state.buttonSize}
        isLoading={state.buttonState === "loading"}
        loadingText="Saving…"
        disabled={state.buttonState === "disabled"}
      >
        Save changes
      </LoadingButton>
    );
  }

  if (state.component === "input") {
    return (
      <PlaygroundInputStage
        key={`${state.inputContent}-${state.inputActions}`}
        state={state}
      />
    );
  }

  if (state.component === "select") {
    return (
      <div className="flex w-full max-w-xs flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-foreground">Fruit</span>
        <KiraSelect
          key={`${state.selectMode}-${state.selectSize}`}
          size={state.selectSize}
          searchable={state.selectMode === "searchable"}
          disabled={state.selectState === "disabled"}
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          aria-label="Playground fruit select"
        />
      </div>
    );
  }

  const isDestructive = state.dialogVariant === "destructive";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size={state.dialogSize}
            variant={isDestructive ? "destructive" : "default"}
          />
        }
      >
        {isDestructive ? "Discard changes" : "Open dialog"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDestructive ? "Discard changes?" : "Confirm action"}
          </DialogTitle>
          <DialogDescription>
            {isDestructive
              ? "Your unsaved changes will be lost."
              : "Dialog bodies use the p-6 container tier, matching Card and Drawer."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose
            render={
              <Button variant={isDestructive ? "destructive" : "default"} />
            }
          >
            {isDestructive ? "Discard" : "Continue"}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PlaygroundToolbar({
  view,
  resetSpin,
  onViewChange,
  onReset,
}: {
  view: PlaygroundView;
  resetSpin: number;
  onViewChange: (view: PlaygroundView) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-3.5 py-2">
      <Tabs
        value={view}
        onValueChange={(next) => {
          const v = matchOption(next, PLAYGROUND_VIEWS);

          if (v) onViewChange(v);
        }}
      >
        <TabsList>
          <TabsTrigger value="preview" className="min-h-11 sm:min-h-8">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="min-h-11 sm:min-h-8">
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="min-h-11 gap-1.5 text-muted-foreground hover:text-foreground sm:min-h-8"
      >
        <IconRotateClockwise2
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={
            resetSpin > 0
              ? { transform: `rotate(${-resetSpin * 360}deg)` }
              : undefined
          }
        />
        Reset
      </Button>
    </div>
  );
}

function PlaygroundFooter({
  behaviorNote,
  docsLink,
}: {
  behaviorNote: string;
  docsLink: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col gap-1 border-t border-border px-3.5 py-3">
      <p className="text-[13px] leading-5 text-muted-foreground">
        {behaviorNote}
      </p>
      <Link
        to={docsLink.to}
        className="docs-focus-ring group inline-flex min-h-11 w-fit items-center gap-1.5 rounded-md text-[13px] font-semibold docs-accent underline-offset-4 hover:underline sm:min-h-8"
      >
        {docsLink.label}
        <IconArrowUpRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      </Link>
    </div>
  );
}

function PlaygroundViewport({
  state,
  stageKey,
  code,
}: {
  state: PlaygroundState;
  stageKey: string;
  code: string;
}) {
  if (state.view === "preview") {
    return (
      <div className="flex min-h-[128px] items-center justify-center bg-muted/40 p-6 sm:min-h-[164px]">
        <div
          key={stageKey}
          className="docs-example-panel flex w-full items-center justify-center"
        >
          <PlaygroundStage state={state} />
        </div>
      </div>
    );
  }

  return (
    <div
      key={`code-${state.component}`}
      className="docs-example-panel border-t border-border/70"
    >
      <CodePanel
        code={code}
        language="tsx"
        showFooter={false}
        viewportClassName="max-h-[260px]"
        className="rounded-none border-0"
      />
    </div>
  );
}

function ComponentPlaygroundSection() {
  const [state, setState] = React.useState<PlaygroundState>(INITIAL_PLAYGROUND);
  const [resetSpin, setResetSpin] = React.useState(0);

  const updateState = (patch: Partial<PlaygroundState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setState((prev) => ({
      ...INITIAL_PLAYGROUND,
      component: prev.component,
      view: prev.view,
    }));
    setResetSpin((count) => count + 1);
  };

  const code = SNIPPET_BUILDERS[state.component](state);
  const stageKey = `${state.component}-${state.buttonVariant}-${state.buttonSize}-${state.buttonState}-${state.inputSize}-${state.selectSize}-${state.dialogVariant}`;

  return (
    <DocSection
      id="component-playground"
      title="Component playground"
      description="Try a component in isolation, then compare it with the other controls further down."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <Tabs
            value={state.component}
            onValueChange={(next) => {
              const comp = matchOption(next, PLAYGROUND_COMPONENTS);

              if (comp) updateState({ component: comp });
            }}
          >
            <TabsList className="w-full sm:w-fit">
              {PLAYGROUND_COMPONENTS.map((item) => (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="min-h-11 flex-1 capitalize sm:min-h-8 sm:flex-initial"
                >
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <PlaygroundSettings state={state} onChange={updateState} />
        </div>

        <div className="h-px w-full bg-border" />

        <PlaygroundToolbar
          view={state.view}
          resetSpin={resetSpin}
          onViewChange={(view) => updateState({ view })}
          onReset={handleReset}
        />

        <PlaygroundViewport state={state} stageKey={stageKey} code={code} />

        <PlaygroundFooter
          behaviorNote={getPlaygroundBehaviorNote(state)}
          docsLink={PLAYGROUND_DOCS[state.component]}
        />
      </div>
    </DocSection>
  );
}

function ControlSizeRow({ size }: { size: PreviewSize }) {
  const [count, setCount] = React.useState<number | null>(12);
  const isDefault = size === "default";

  return (
    <div
      className={cn(
        "grid grid-cols-[82px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 px-3.5 py-2.5 transition-colors duration-150 ease-out md:grid-cols-[110px_104px_minmax(0,1fr)_minmax(0,1fr)_113px]",
        isDefault
          ? "bg-primary/[0.04] dark:bg-primary/[0.08]"
          : "hover:bg-muted/25",
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            "font-mono text-xs font-semibold",
            isDefault ? "docs-accent" : "text-foreground",
          )}
        >
          {size}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {SIZE_META[size].px} · {SIZE_META[size].tw}
        </span>
      </div>

      <div className="flex items-center">
        <Button size={size}>Save</Button>
      </div>

      <div className="hidden md:block">
        <Input size={size} placeholder="Name" aria-label={`Input ${size}`} />
      </div>

      <div>
        <KiraSelect
          size={size}
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          aria-label={`Select ${size}`}
        />
      </div>

      <div className="hidden md:block">
        <NumericInput
          size={size}
          value={count}
          onValueChange={setCount}
          aria-label={`Quantity ${size}`}
        />
      </div>
    </div>
  );
}

function ControlSizesSection() {
  return (
    <DocSection
      id="control-sizes"
      title="Control sizes"
      description="Button, Input, Select, and NumericInput use the same five heights on a 4px scale."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[82px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 border-b border-border bg-muted/50 px-3.5 py-2.5 text-[13px] font-semibold text-foreground md:grid-cols-[110px_104px_minmax(0,1fr)_minmax(0,1fr)_113px]">
          <span>Size</span>
          <span>Button</span>
          <span className="hidden md:inline">Input</span>
          <span>Select</span>
          <span className="hidden md:inline">Quantity</span>
        </div>

        <div className="divide-y divide-border">
          {SIZES.map((size) => (
            <ControlSizeRow key={size} size={size} />
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <DocCallout variant="info" title="Comparing heights">
          The specimens show the component scale. Use the 44px tier for
          touch-first controls.
        </DocCallout>
      </div>

      <div className="flex flex-col gap-3 rounded-[14px] border border-border bg-card p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Textarea minimum heights
        </h3>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {TEXTAREA_SPECS.map((spec) => (
            <div key={spec.size} className="flex flex-col gap-1.5">
              <span className="font-mono text-xs docs-accent">{spec.size}</span>
              <Textarea
                size={spec.size}
                aria-label={`Textarea ${spec.size}`}
                placeholder={`min-h ${spec.height}`}
                className={cn("resize-none", spec.minHeightClass)}
              />
              <span className="font-mono text-[11px] text-muted-foreground">
                {spec.height}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CodePanel
        code={LADDER_CODE}
        language="tsx"
        showFooter={false}
        viewportClassName="h-auto"
      />
    </DocSection>
  );
}

function CombinationRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 px-3.5 py-3 sm:grid sm:grid-cols-[156px_minmax(0,1fr)] sm:items-center sm:gap-3.5">
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CombinationSpecimens({ size }: { size: PreviewSize }) {
  const [stepperCount, setStepperCount] = React.useState<number | null>(3);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      <CombinationRow label="Input with button">
        <InputWithButton
          size={size}
          buttonText="Apply"
          placeholder="Coupon code"
          aria-label="Coupon code"
        />
      </CombinationRow>

      <CombinationRow label="Input with dropdown">
        <InputWithDropdown
          size={size}
          options={DROPDOWN_OPTIONS}
          dropdownValue="https"
          defaultValue="example.com"
          placeholder="example.com"
          aria-label="Domain"
        />
      </CombinationRow>

      <CombinationRow label="InputGroup addon">
        <InputGroup className={INPUT_GROUP_HEIGHT[size]}>
          <InputGroupAddon align="inline-start">
            <InputGroupText className="font-mono text-xs">
              https://
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            defaultValue="studio.example"
            placeholder="studio.example"
            aria-label="Studio domain"
          />
        </InputGroup>
      </CombinationRow>

      <CombinationRow label="Numeric stepper">
        <NumericInput
          size={size}
          value={stepperCount}
          onValueChange={setStepperCount}
          showButtons
          className="w-36"
          aria-label="Numeric stepper"
        />
      </CombinationRow>

      <CombinationRow label="Input cluster">
        <InputCluster>
          <Input size={size} placeholder="First name" aria-label="First name" />
          <Input size={size} placeholder="Last name" aria-label="Last name" />
        </InputCluster>
      </CombinationRow>
    </div>
  );
}

function InputCombinationsSection() {
  const [size, setSize] = React.useState<PreviewSize>("default");

  return (
    <DocSection
      id="input-combinations"
      title="Input combinations"
      description="Pick a size and check that inputs, buttons, addons, and steppers share a baseline."
    >
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] font-semibold text-foreground">
          Preview size
        </span>
        <div className="w-[156px]">
          <KiraSelect
            value={size}
            options={SIZE_OPTIONS}
            aria-label="Input combinations preview size"
            onChange={(next) => {
              const s = matchOption(next, SIZES);

              if (s) setSize(s);
            }}
          />
        </div>
      </div>

      <CombinationSpecimens size={size} />
    </DocSection>
  );
}

type AffordanceRender = (
  size: PreviewSize,
  value: string,
  onChange: (next: string) => void,
) => React.ReactNode;

interface AffordanceSpec {
  label: string;
  demo: string;
  worst: string;
  render: AffordanceRender;
}

const AFFORDANCE_ROWS: readonly [AffordanceSpec, AffordanceSpec][] = [
  [
    {
      label: "Prefix",
      demo: DEMO_EMAIL,
      worst: WORST_EMAIL,
      render: (size, value, onChange) => (
        <Input
          size={size}
          prefix={<IconMail />}
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
          onChange={(event) => onChange(event.target.value)}
          aria-label="Username with suffix"
        />
      ),
    },
  ],
  [
    {
      label: "Clear",
      demo: DEMO_EMAIL,
      worst: WORST_EMAIL,
      render: (size, value, onChange) => (
        <Input
          size={size}
          showClear
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
          onChange={(event) => onChange(event.target.value)}
          aria-label="Copyable email"
        />
      ),
    },
  ],
  [
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
          onChange={(event) => onChange(event.target.value)}
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
          onChange={(event) => onChange(event.target.value)}
          aria-label="Password"
        />
      ),
    },
  ],
  [
    {
      label: "Spinner",
      demo: DEMO_EMAIL,
      worst: WORST_EMAIL,
      render: (size, value, onChange) => (
        <InputWithSpinner
          size={size}
          isLoading
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
  ],
];

function AffordanceField({
  spec,
  size,
  mode,
}: {
  spec: AffordanceSpec;
  size: PreviewSize;
  mode: DatasetMode;
}) {
  const [value, setValue] = React.useState(
    mode === "worst" ? spec.worst : spec.demo,
  );

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-foreground">
        {spec.label}
      </span>
      {spec.render(size, value, setValue)}
    </div>
  );
}

function InputActionsSection() {
  const [mode, setMode] = React.useState<DatasetMode>("demo");
  const [size, setSize] = React.useState<PreviewSize>("default");

  return (
    <DocSection
      id="input-actions"
      title="Input actions"
      description="Check clear, copy, and other input actions with short values or long text."
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Tabs
          value={mode}
          onValueChange={(next) => {
            const m = matchOption(next, DATASET_MODES);

            if (m) setMode(m);
          }}
        >
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger
              value="demo"
              className="min-h-11 flex-1 sm:min-h-8 sm:flex-initial"
            >
              Demo data
            </TabsTrigger>
            <TabsTrigger
              value="worst"
              className="min-h-11 flex-1 sm:min-h-8 sm:flex-initial"
            >
              Worst case
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-[156px]">
          <KiraSelect
            value={size}
            options={SIZE_OPTIONS}
            aria-label="Input actions size"
            onChange={(next) => {
              const s = matchOption(next, SIZES);

              if (s) setSize(s);
            }}
          />
        </div>
      </div>

      <div
        key={mode}
        className="docs-example-panel divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
      >
        {AFFORDANCE_ROWS.map(([left, right]) => (
          <div
            key={`${left.label}-${right.label}`}
            className="grid gap-4 px-3.5 py-3 sm:grid-cols-2 sm:gap-4.5"
          >
            <AffordanceField
              key={`${left.label}-${mode}`}
              spec={left}
              size={size}
              mode={mode}
            />
            <AffordanceField
              key={`${right.label}-${mode}`}
              spec={right}
              size={size}
              mode={mode}
            />
          </div>
        ))}
      </div>

      <p className="text-[13px] leading-5 text-muted-foreground">
        {mode === "worst"
          ? "Long values scroll inside the field. The action buttons stay visible and keyboard-accessible."
          : "Switch to Worst case to check long values, Unicode text, and the space reserved for trailing actions."}
      </p>
    </DocSection>
  );
}

function MenuSpecimenPopup({
  items,
}: {
  items: readonly {
    label: string;
    selected?: boolean;
    checked?: boolean;
    destructive?: boolean;
  }[];
}) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col rounded-[10px] border border-border bg-popover p-1 shadow-xs"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex min-h-8 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px]",
            item.selected && "bg-muted text-foreground",
            item.destructive
              ? "text-destructive"
              : !item.selected && "text-popover-foreground",
          )}
        >
          <span className="truncate">{item.label}</span>
          {item.checked && (
            <IconCheck className="size-3.5 shrink-0 docs-accent" />
          )}
          {item.destructive && (
            <IconTrash className="size-3.5 shrink-0 text-destructive" />
          )}
        </div>
      ))}
    </div>
  );
}

function MenuComparisonGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-sm font-semibold text-foreground">Select</span>
        <KiraSelect
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          aria-label="Plain select"
        />
        <MenuSpecimenPopup
          items={[
            { label: "Apple", selected: true, checked: true },
            { label: "Banana" },
            { label: "Cherry" },
          ]}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-sm font-semibold text-foreground">Combobox</span>
        <KiraSelect
          searchable
          options={FRUIT_OPTIONS}
          defaultValue="apple"
          placeholder="Search fruit"
          aria-label="Searchable combobox"
        />
        <MenuSpecimenPopup
          items={[
            { label: "Apple", selected: true },
            { label: "Banana" },
            { label: "Cherry" },
          ]}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-sm font-semibold text-foreground">
          Dropdown menu
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="w-full justify-between" />
            }
          >
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
        <MenuSpecimenPopup
          items={[
            { label: "Profile", selected: true },
            { label: "Settings" },
            { label: "Delete workspace", destructive: true },
          ]}
        />
      </div>
    </div>
  );
}

function OverlayUsageRow({
  trigger,
  description,
}: {
  trigger: React.ReactNode;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 px-3.5 py-3 sm:flex-row sm:items-center sm:gap-3">
      <div className="sm:w-[157px] sm:shrink-0">{trigger}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function DialogTriggerSample() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            leftIcon={<IconSquare />}
            className="h-11 sm:h-9"
          />
        }
      >
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
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PopoverTriggerSample() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            leftIcon={<IconMessage />}
            className="h-11 sm:h-9"
          />
        }
      >
        Popover
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverTitle>Popover tier</PopoverTitle>
        <PopoverDescription>
          Popovers sit between menus (p-1) and containers (p-6).
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

function DrawerTriggerSample() {
  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button
            variant="outline"
            leftIcon={<IconLayoutSidebarRight />}
            className="h-11 sm:h-9"
          />
        }
      >
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
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function OverlayUsageList() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      <OverlayUsageRow
        description="Confirm an action in a centered modal."
        trigger={<DialogTriggerSample />}
      />
      <OverlayUsageRow
        description="Show short, contextual details beside a trigger."
        trigger={<PopoverTriggerSample />}
      />
      <OverlayUsageRow
        description="Open a side panel or bottom sheet for longer tasks."
        trigger={<DrawerTriggerSample />}
      />
    </div>
  );
}

function MenusAndOverlaysSection() {
  return (
    <DocSection
      id="menus-and-overlays"
      title="Menus and overlays"
      description="Compare the same menu item spacing across Select, Combobox, and Dropdown Menu. Then compare where each overlay opens."
    >
      <MenuComparisonGrid />
      <p className="text-[13px] leading-5 text-muted-foreground">
        32px minimum item height, 8px horizontal padding, and 4px popup padding.
      </p>
      <OverlayUsageList />
    </DocSection>
  );
}

function ContainerSpacingSection() {
  return (
    <DocSection
      id="container-spacing"
      title="Container spacing"
      description="Match the padding tier to the amount of content and keep it consistent across containers."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Default card</CardTitle>
              <span className="font-mono text-[11px] docs-accent">
                p-6 · 24px
              </span>
            </div>
            <CardDescription>
              Use p-6 for standard content. Dialogs and drawers share this tier.
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-2">
            <Button size="sm">Confirm</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Compact card</CardTitle>
              <span className="font-mono text-[11px] docs-accent">
                p-4 · 16px
              </span>
            </div>
            <CardDescription>
              Use p-4 when the content and actions fit comfortably in less
              space.
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-2">
            <Button size="sm">Confirm</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>

      <FieldErrorSummary
        title="Fix 2 fields"
        errors={[
          {
            id: "preview-name",
            label: "Name",
            message: "Enter your name",
          },
          {
            id: "preview-email",
            label: "Email",
            message: "Enter a valid email address",
          },
        ]}
      />
    </DocSection>
  );
}

function FormSpacingSection() {
  return (
    <DocSection
      id="form-spacing"
      title="Form spacing"
      description="FieldGroup uses a 24px gap. Default FieldControl and Input share a 36px height and 16px horizontal padding."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <KiraField
                label="Name"
                name="preview-name"
                defaultValue="Jo"
                inputProps={{ id: "preview-name", placeholder: "Jo" }}
              />
              <KiraField
                label="Email"
                name="preview-email"
                defaultValue="jo@acme.com"
                inputProps={{
                  id: "preview-email",
                  type: "email",
                  placeholder: "jo@acme.com",
                }}
              />
              <KiraField
                label="Reply-to"
                defaultValue="team@studio.example"
                description="Replies will go to this address."
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default control comparison</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
            <p className="text-[13px] leading-5 text-muted-foreground">
              Both examples use the default 36px tier. The form example uses
              44px controls at touch widths.
            </p>
          </CardContent>
        </Card>
      </div>
    </DocSection>
  );
}

function ModePreviewCard({
  preset,
  mode,
}: {
  preset: ThemePreset;
  mode: "light" | "dark";
}) {
  return (
    <div
      style={presetVars(preset, mode)}
      className={cn(
        "flex flex-col gap-3 rounded-[14px] border border-border bg-background p-4 text-foreground",
        mode === "dark" && "dark",
      )}
    >
      <span className="text-sm font-semibold text-foreground">
        {mode === "light" ? "Light mode" : "Dark mode"}
      </span>
      <div className="flex items-center gap-2">
        <Button>Save</Button>
        <Input
          placeholder="Name"
          aria-label={`${mode} mode name`}
          className="flex-1"
        />
      </div>
    </div>
  );
}

function TouchAndMotionSection() {
  const { presetName, presets } = usePreset();

  const activePreset =
    presets.find((item) => item.name === presetName) ?? presets[0];

  return (
    <DocSection
      id="touch-and-motion"
      title="Touch and motion"
      description="Use the xl tier for touch targets. Theme changes preserve sizes, and animations follow your system’s reduced-motion preference."
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Touch targets</CardTitle>
            <span className="font-mono text-xs docs-accent">xl · 44px</span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button size="xl">Save</Button>
            <Input
              size="xl"
              placeholder="Name"
              aria-label="Touch target name"
              className="sm:flex-1"
            />
            <KiraSelect
              size="xl"
              options={FRUIT_OPTIONS}
              defaultValue="apple"
              aria-label="Touch target fruit"
              className="sm:flex-1"
            />
          </div>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Leave at least 8px between controls. Use 16px text in inputs on
            phones.
          </p>
        </CardContent>
      </Card>

      {activePreset && (
        <div className="grid gap-3 sm:grid-cols-2">
          <ModePreviewCard preset={activePreset} mode="light" />
          <ModePreviewCard preset={activePreset} mode="dark" />
        </div>
      )}

      <DocCallout variant="info" title="Reduced motion">
        With reduced motion enabled, menus and overlays open without entrance
        animation.
      </DocCallout>
    </DocSection>
  );
}

export default function UIPreviewPage() {
  return (
    <DocPage
      title="UI Preview"
      description="Compare control sizes, check how fields fit together, and test how components handle long content."
      crumb="UI Preview"
    >
      <MobileSectionJump />
      <div
        aria-hidden="true"
        className="hidden h-px w-full bg-border/70 lg:block"
      />
      <ComponentPlaygroundSection />
      <ControlSizesSection />
      <InputCombinationsSection />
      <InputActionsSection />
      <MenusAndOverlaysSection />
      <ContainerSpacingSection />
      <FormSpacingSection />
      <TouchAndMotionSection />
    </DocPage>
  );
}
