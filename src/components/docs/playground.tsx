import * as React from "react";
import {
  IconChevronDown,
  IconChevronRight,
  IconCode,
  IconEye,
} from "@tabler/icons-react";
import { cn } from "cn";
import { CodePanel } from "@/components/docs/code-panel";

type View = "preview" | "code";

interface Example {
  value: string;
  label: string;
  group?: string;
  title: string;
  description?: string;
  code?: string;
  language?: string;
  body: React.ReactNode;
  previewClassName?: string;
}

interface DemoWrapperProps {
  title: string;
  description?: string;
  code: string;
  language?: string;
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}

/**
 * A `fieldset` rather than `role="group"`: it names the pair of toggles without
 * a legend in the layout, and Tailwind's preflight already drops its chrome.
 */
function ViewSelector({
  view,
  onChange,
  canViewCode,
}: {
  view: View;
  onChange: (view: View) => void;
  canViewCode: boolean;
}) {
  if (!canViewCode) return null;

  const options: { value: View; label: string; icon: React.ReactNode }[] = [
    {
      value: "preview",
      label: "Preview",
      icon: <IconEye aria-hidden className="h-3.5 w-3.5" />,
    },
    {
      value: "code",
      label: "Code",
      icon: <IconCode aria-hidden className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <fieldset
      aria-label="Example view"
      className="flex min-w-0 shrink-0 items-stretch self-stretch gap-2 rounded-[8px] border border-border bg-muted/20 p-1 lg:w-fit lg:self-center lg:gap-0.5 lg:p-[3px]"
    >
      {options.map(({ value, label, icon }) => {
        const selected = view === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(value)}
            className={cn(
              "docs-focus-ring flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[6px] px-2.5 text-[13px] transition-colors duration-150 ease-out lg:h-8 lg:flex-none",
              selected
                ? "bg-primary/10 font-semibold docs-accent"
                : "font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </fieldset>
  );
}

interface ExampleStageProps {
  title: string;
  description?: string;
  code?: string;
  language?: string;
  children: React.ReactNode;
  previewClassName?: string;
  className?: string;
  panelId?: string;
  panelLabelledBy?: string;
}

/**
 * Controls row plus stage, shared by the example browser and the standalone
 * card. The stage scrolls and centres its content, so a tall example stays
 * reachable instead of clipping under flex centering.
 */
function ExampleStage({
  title,
  description,
  code,
  language = "tsx",
  children,
  previewClassName,
  className,
  panelId,
  panelLabelledBy,
}: ExampleStageProps) {
  const [view, setView] = React.useState<View>("preview");

  return (
    <div
      data-slot="example-stage"
      className={cn("flex min-h-0 flex-1 flex-col gap-3 lg:gap-4", className)}
    >
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-[19px] font-semibold leading-tight text-foreground lg:text-[22px]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-[13px] leading-[1.45] text-muted-foreground lg:text-sm">
              {description}
            </p>
          )}
        </div>

        <ViewSelector
          view={view}
          onChange={setView}
          canViewCode={Boolean(code)}
        />
      </div>

      <div
        {...(panelId && {
          id: panelId,
          role: "tabpanel",
          tabIndex: 0,
          "aria-labelledby": panelLabelledBy,
        })}
        className="docs-focus-ring flex min-h-0 flex-1 flex-col outline-none"
      >
        {view === "code" && code ? (
          <CodePanel
            code={code}
            language={language}
            className="h-full"
            viewportClassName="max-lg:h-[276px]"
          />
        ) : (
          <div
            key={view}
            className={cn(
              "docs-example-panel docs-scroll min-h-[200px] flex-1 overflow-auto rounded-[8px] border border-border bg-muted/20 p-2 lg:min-h-0 lg:p-8",
              previewClassName,
            )}
          >
            <div className="flex min-h-full w-full items-center justify-center">
              <div className="w-full max-w-[592px]">{children}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * One example with its own source: `DemoTabs` lifts it out of the tab list into
 * the browser, and a page that mounts a demo without a browser gets the same
 * chrome as a standalone card.
 */
export function DemoWrapper({
  title,
  description,
  code,
  language = "tsx",
  children,
  className,
  previewClassName,
}: DemoWrapperProps) {
  return (
    <div
      data-slot="demo-wrapper"
      className={cn(
        "rounded-[12px] border border-border bg-background p-3 lg:p-4",
        className,
      )}
    >
      <ExampleStage
        title={title}
        description={description}
        code={code}
        language={language}
        previewClassName={previewClassName}
      >
        {children}
      </ExampleStage>
    </div>
  );
}

interface DemoTab {
  value: string;
  label: string;
  group?: string;
  demo: React.ReactNode | ((isActive: boolean) => React.ReactNode);
}

interface DemoTabsProps {
  tabs: DemoTab[];
  defaultValue?: string;
  className?: string;
  /** Section headings for the example list, in order. Defaults to the groups the tabs declare. */
  groups?: string[];
}

/**
 * A `demo` render-prop is called with `true`: the browser mounts only the
 * selected example, so the flag that used to keep hidden examples idle is always
 * on for whatever actually renders.
 */
function normalize(tab: DemoTab): Example {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React's typed node/render-prop union requires callable discrimination.
  const body = typeof tab.demo === "function" ? tab.demo(true) : tab.demo;

  const wrapper =
    React.isValidElement<DemoWrapperProps>(body) && body.type === DemoWrapper
      ? body.props
      : null;

  if (!wrapper) {
    return {
      value: tab.value,
      label: tab.label,
      group: tab.group,
      title: tab.label,
      body,
    };
  }

  return {
    value: tab.value,
    label: tab.label,
    group: tab.group,
    title: wrapper.title ?? tab.label,
    description: wrapper.description,
    code: wrapper.code,
    language: wrapper.language,
    body: wrapper.children,
    previewClassName: wrapper.previewClassName,
  };
}

interface ExampleGroup {
  label: string;
  items: Example[];
}

/** Declared groups lead, in the order the page lists them; the rest follow in document order. */
function groupExamples(
  examples: Example[],
  declared?: string[],
): ExampleGroup[] {
  const groups = new Map<string, Example[]>();

  for (const example of examples) {
    const label = example.group ?? "";
    const items = groups.get(label);

    if (items) items.push(example);
    else groups.set(label, [example]);
  }

  const sections: ExampleGroup[] = [];

  if (declared) {
    for (const label of declared) {
      const items = groups.get(label);

      if (items) sections.push({ label, items });
    }
  }

  for (const [label, items] of groups) {
    if (!declared || !declared.includes(label)) sections.push({ label, items });
  }

  return sections;
}

/**
 * Sliding selection pill. The nav is 23 rows deep on the busiest page and the
 * frame is a fixed 692px, so the list scrolls and the pill lives inside it:
 * rects (not `offsetTop`) keep it aligned with the row through padding, gaps,
 * the scrollbar gutter, and scrolling alike.
 */
function useNavPill(
  listRef: React.RefObject<HTMLDivElement | null>,
  active: string,
  count: number,
) {
  const [pill, setPill] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const measure = React.useCallback(() => {
    const list = listRef.current;

    const item = list?.querySelector<HTMLElement>(
      `[data-example-value="${CSS.escape(active)}"]`,
    );

    if (!list || !item) {
      setPill(null);

      return;
    }

    const box = list.getBoundingClientRect();
    const rect = item.getBoundingClientRect();

    setPill({
      top: rect.top - box.top + list.scrollTop,
      left: rect.left - box.left,
      width: rect.width,
      height: rect.height,
    });
  }, [active, listRef]);

  React.useLayoutEffect(measure, [measure, count]);

  React.useEffect(() => {
    const list = listRef.current;

    if (!list || !("ResizeObserver" in window)) return;

    const observer = new ResizeObserver(measure);

    observer.observe(list);

    return () => observer.disconnect();
  }, [measure, listRef]);

  return pill;
}

/** Mobile stands in for the tablist with the platform picker, so touch users get the OS list. */
function ExamplePicker({
  groups,
  active,
  onSelect,
  id,
}: {
  groups: ExampleGroup[];
  active: string;
  onSelect: (value: string) => void;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
        Examples
      </label>

      <div className="relative">
        <select
          id={id}
          value={active}
          onChange={(event) => onSelect(event.target.value)}
          className="docs-focus-ring h-12 w-full appearance-none rounded-[8px] border border-border bg-background pr-10 pl-3 text-sm font-semibold text-foreground"
        >
          {groups.map((group) =>
            group.label ? (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((example) => (
                  <option key={example.value} value={example.value}>
                    {example.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              group.items.map((example) => (
                <option key={example.value} value={example.value}>
                  {example.label}
                </option>
              ))
            ),
          )}
        </select>

        <IconChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </div>
  );
}

interface ExampleTabProps {
  example: Example;
  selected: boolean;
  onSelect: (value: string) => void;
  setRef: (element: HTMLButtonElement | null) => void;
  tabId: string;
  panelId: string;
}

function ExampleTab({
  example,
  selected,
  onSelect,
  setRef,
  tabId,
  panelId,
}: ExampleTabProps) {
  return (
    <button
      ref={setRef}
      data-example-value={example.value}
      role="tab"
      type="button"
      aria-selected={selected}
      aria-controls={panelId}
      id={tabId}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(example.value)}
      className={cn(
        "docs-nav-item docs-focus-ring relative z-1 flex h-[27px] w-full items-center justify-between rounded-[5px] px-2 text-left text-[13px] transition-colors duration-150 ease-out",
        selected
          ? "font-semibold docs-accent"
          : "font-normal text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="truncate">{example.label}</span>

      {selected && (
        <IconChevronRight
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 docs-accent"
        />
      )}
    </button>
  );
}

interface ExampleNavProps {
  groups: ExampleGroup[];
  active: string;
  onSelect: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.RefObject<Map<string, HTMLButtonElement>>;
  pill: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
  tabId: (value: string) => string;
  panelId: string;
}

function ExampleNav({
  groups,
  active,
  onSelect,
  onKeyDown,
  listRef,
  itemRefs,
  pill,
  tabId,
  panelId,
}: ExampleNavProps) {
  return (
    <div
      role="tablist"
      aria-label="Examples"
      aria-orientation="vertical"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="hidden w-56 shrink-0 flex-col gap-3 border-r border-border bg-muted/40 px-3 py-[18px] lg:flex"
    >
      <span className="shrink-0 text-[15px] font-semibold text-foreground">
        Examples
      </span>

      <div
        ref={listRef}
        className="docs-scroll relative flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto"
      >
        {pill && (
          <span
            aria-hidden
            className="docs-nav-indicator docs-accent pointer-events-none absolute top-0 left-0 rounded-[5px] border border-current bg-primary/10"
            style={{
              width: pill.width,
              height: pill.height,
              transform: `translate(${pill.left}px, ${pill.top}px)`,
            }}
          />
        )}

        {groups.map((group) => (
          <div
            key={group.label || "examples"}
            className="flex shrink-0 flex-col gap-[1px]"
          >
            {group.label && (
              <span className="flex h-[22px] items-center px-2 text-[11px] font-semibold text-muted-foreground">
                {group.label}
              </span>
            )}

            {group.items.map((example) => (
              <ExampleTab
                key={example.value}
                example={example}
                selected={example.value === active}
                onSelect={onSelect}
                tabId={tabId(example.value)}
                panelId={panelId}
                setRef={(element) => {
                  const refs = itemRefs.current;

                  if (element) refs.set(example.value, element);
                  else refs.delete(example.value);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Roving focus: the arrow keys move the selection, so the tablist holds one tab stop. */
function nextIndex(examples: Example[], active: string, key: string) {
  const index = examples.findIndex((example) => example.value === active);

  if (index < 0) return undefined;

  const last = examples.length - 1;

  const target: number | undefined = {
    ArrowDown: Math.min(index + 1, last),
    ArrowRight: Math.min(index + 1, last),
    ArrowUp: Math.max(index - 1, 0),
    ArrowLeft: Math.max(index - 1, 0),
    Home: 0,
    End: last,
  }[key];

  return target === undefined ? undefined : examples[target]?.value;
}

/**
 * The example browser: every example on the page in a vertical tablist beside a
 * fixed-height workspace, so switching examples never shifts the layout.
 */
export function DemoTabs({
  tabs,
  defaultValue,
  className,
  groups,
}: DemoTabsProps) {
  const examples = React.useMemo(() => tabs.map(normalize), [tabs]);

  const sections = React.useMemo(
    () => groupExamples(examples, groups),
    [examples, groups],
  );

  const [active, setActive] = React.useState(
    () =>
      examples.find((example) => example.value === defaultValue)?.value ??
      examples[0]?.value ??
      "",
  );

  const listRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const uid = React.useId();
  const pill = useNavPill(listRef, active, examples.length);
  const current = examples.find((example) => example.value === active);
  const panelId = `${uid}-panel`;

  const tabId = React.useCallback(
    (value: string) => `${uid}-tab-${value}`,
    [uid],
  );

  const select = React.useCallback((value: string, focus = false) => {
    setActive(value);

    if (focus) itemRefs.current.get(value)?.focus();
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const value = nextIndex(examples, active, event.key);

    if (!value) return;

    event.preventDefault();
    select(value, true);
  };

  if (!current) return null;

  return (
    <div
      data-slot="example-browser"
      className={cn("flex flex-col gap-5 lg:h-[692px] lg:gap-0", className)}
    >
      <ExamplePicker
        groups={sections}
        active={active}
        onSelect={select}
        id={`${uid}-picker`}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[12px] border border-border lg:h-full">
        <ExampleNav
          groups={sections}
          active={active}
          onSelect={select}
          onKeyDown={onKeyDown}
          listRef={listRef}
          itemRefs={itemRefs}
          pill={pill}
          tabId={tabId}
          panelId={panelId}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background p-3 lg:p-6">
          <ExampleStage
            key={current.value}
            title={current.title}
            description={current.description}
            code={current.code}
            language={current.language}
            previewClassName={current.previewClassName}
            panelId={panelId}
            panelLabelledBy={tabId(current.value)}
          >
            {current.body}
          </ExampleStage>
        </div>
      </div>
    </div>
  );
}
