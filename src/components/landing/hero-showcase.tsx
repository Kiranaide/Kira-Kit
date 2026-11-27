import * as React from "react";
import {
  IconBook,
  IconLayoutSidebarRight,
  IconPalette,
  IconTerminal2,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { KiraCommand } from "@/components/ui/command";
import { KiraAccordion } from "@/components/ui/accordion";
import { SearchInput } from "@/components/ui/input";
import { KiraSelect } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
}

const members: Member[] = [
  {
    id: "ada",
    name: "Ada Okonkwo",
    email: "ada@kira-kit.dev",
    role: "Owner",
    status: "Active",
  },
  {
    id: "ruiz",
    name: "Marco Ruiz",
    email: "marco@kira-kit.dev",
    role: "Admin",
    status: "Active",
  },
  {
    id: "chen",
    name: "Wren Chen",
    email: "wren@kira-kit.dev",
    role: "Editor",
    status: "Active",
  },
  {
    id: "halden",
    name: "Sam Halden",
    email: "sam@kira-kit.dev",
    role: "Viewer",
    status: "Invited",
  },
];

const roleOptions = [
  { value: "all", label: "All roles" },
  { value: "Owner", label: "Owner" },
  { value: "Admin", label: "Admin" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Header checkbox state: none of the visible rows, all of them, or some. */
function selectAllState(selectedCount: number, rowCount: number) {
  if (selectedCount === 0) return false;

  if (selectedCount === rowCount) return true;

  return "indeterminate" as const;
}

function MembersFilters({
  query,
  role,
  onQueryChange,
  onRoleChange,
}: {
  query: string;
  role: string;
  onQueryChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        aria-label="Search members"
        placeholder="Search members…"
        size="sm"
        className="w-52"
      />
      <KiraSelect
        options={roleOptions}
        value={role}
        onChange={(value) => onRoleChange(Array.isArray(value) ? "all" : value)}
        aria-label="Filter by role"
        size="sm"
        className="w-36"
      />
    </div>
  );
}

function MemberRow({
  member,
  selected,
  onToggle,
}: {
  member: Member;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <TableRow data-state={selected}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle(member.id)}
          aria-label={`Select ${member.name}`}
          size="sm"
        />
      </TableCell>
      <TableCell>
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback>{initials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-card-foreground">
              {member.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-[13px] text-muted-foreground">
        {member.role}
      </TableCell>
      <TableCell>
        <StatusBadge
          status={member.status === "Active" ? "success" : "default"}
          size="sm"
          label={member.status}
        />
      </TableCell>
    </TableRow>
  );
}

function MembersTableFoot({
  rowCount,
  selectedCount,
}: {
  rowCount: number;
  selectedCount: number;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
      <span>
        {selectedCount > 0
          ? `${selectedCount} of ${rowCount} selected`
          : `${rowCount} ${rowCount === 1 ? "member" : "members"}`}
      </span>
      <span>Page 1 of 1</span>
    </div>
  );
}

function MembersTable() {
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [selected, setSelected] = React.useState<string[]>([]);

  const rows = members.filter((member) => {
    const haystack = `${member.name} ${member.email}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesRole = role === "all" || member.role === role;

    return matchesQuery && matchesRole;
  });

  const selectedCount = selected.filter((id) =>
    rows.some((member) => member.id === id),
  ).length;

  const toggleAll = () => {
    setSelected((current) =>
      current.length === rows.length ? [] : rows.map((member) => member.id),
    );
  };

  const toggleOne = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-card-foreground">
            Team members
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            Real Data Table, Avatar, Badge and Select — from the registry.
          </p>
        </div>
        <Button size="sm">Invite member</Button>
      </div>

      <MembersFilters
        query={query}
        role={role}
        onQueryChange={setQuery}
        onRoleChange={setRole}
      />

      <Table
        density="compact"
        label="Team members"
        containerClassName="border-t border-border"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={selectAllState(selectedCount, rows.length)}
                onCheckedChange={toggleAll}
                aria-label="Select all members"
                size="sm"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              selected={selected.includes(member.id)}
              onToggle={toggleOne}
            />
          ))}
        </TableBody>
      </Table>

      <MembersTableFoot rowCount={rows.length} selectedCount={selectedCount} />
    </div>
  );
}

const showcaseFaqs = [
  {
    value: "ownership",
    title: "The source lands in your repo",
    content:
      "kira-kit add writes the component files into your project. Nothing is imported from node_modules at runtime, so you can edit any line and delete what you do not use.",
    icon: <IconTerminal2 aria-hidden="true" />,
  },
  {
    value: "theming",
    title: "One token contract",
    content:
      "Colours, radii and control heights come from semantic CSS variables. Switching the preset above re-skins this panel, the site chrome, and every component page at once.",
    icon: <IconPalette aria-hidden="true" />,
  },
  {
    value: "behaviour",
    title: "Base UI does the hard parts",
    content:
      "Keyboard patterns, focus management, typeahead, RTL and ARIA wiring come from the primitive layer — the styling layer only ever adds classes.",
    icon: <IconLayoutSidebarRight aria-hidden="true" />,
  },
];

function ShowcaseCommand() {
  const [status, setStatus] = React.useState("Pick an action to see it fire.");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <KiraCommand
        label="Kira Kit actions"
        actions={[
          {
            id: "add",
            label: "Add a component",
            description: "npx kira-kit add button card",
            icon: <IconTerminal2 />,
            group: "CLI",
            keywords: ["install", "registry"],
            onSelect: () =>
              setStatus("Copied button and card into src/components/ui."),
          },
          {
            id: "theme",
            label: "Generate a palette",
            description: 'npx kira-kit theme --primary "#0C7F79"',
            icon: <IconPalette />,
            group: "CLI",
            keywords: ["color", "oklch", "preset"],
            onSelect: () =>
              setStatus("Wrote light and dark tokens, both AA-verified."),
          },
          {
            id: "check",
            label: "Run the quality checks",
            description: "npx kira-kit check",
            icon: <IconBook />,
            group: "CLI",
            keywords: ["lint", "ci", "audit"],
            onSelect: () => setStatus("13 checks passed, exit code 0."),
          },
        ]}
      />
      <output className="mt-3 block text-[13px] text-muted-foreground">
        {status}
      </output>
    </div>
  );
}

/**
 * The hero product preview. Real registry components, driven by real state —
 * search, role filter, row selection and the command palette all work.
 */
export function HeroShowcase() {
  return (
    <Tabs defaultValue="table" className="gap-3">
      <TabsList variant="default" className="w-fit">
        <TabsTrigger value="table">Data Table</TabsTrigger>
        <TabsTrigger value="accordion">Accordion</TabsTrigger>
        <TabsTrigger value="command">Command</TabsTrigger>
      </TabsList>

      <TabsContent value="table">
        <MembersTable />
      </TabsContent>

      <TabsContent value="accordion">
        <div className="rounded-xl border border-border bg-card px-4 py-2">
          <KiraAccordion items={showcaseFaqs} defaultValue={["ownership"]} />
        </div>
      </TabsContent>

      <TabsContent value="command">
        <ShowcaseCommand />
      </TabsContent>
    </Tabs>
  );
}
