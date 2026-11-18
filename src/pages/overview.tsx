import { Link } from "@tanstack/react-router";
import {
  IconPalette,
  IconAccessible,
  IconCode,
  IconBox,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComponentPage, PageHeader } from "@/components/docs";

const highlights = [
  {
    title: "Beautiful design",
    description:
      "Carefully crafted components on a 4px spacing contract, with light and dark themes verified for contrast.",
    icon: IconPalette,
  },
  {
    title: "Base UI powered",
    description:
      "Unstyled, accessible primitives with full customization freedom — keyboard and screen-reader support built in.",
    icon: IconAccessible,
  },
  {
    title: "TypeScript first",
    description:
      "Full type definitions and cva variant exports for an excellent developer experience.",
    icon: IconCode,
  },
  {
    title: "90+ components & hooks",
    description:
      "A growing catalog delivered as a shadcn-compatible registry — the source code lands in your project.",
    icon: IconBox,
  },
];

export default function OverviewPage() {
  return (
    <ComponentPage className="max-w-4xl">
      <PageHeader
        title="Welcome to Kira Kit"
        description="A modern React component library built with Base UI, Tailwind CSS v4, and TypeScript — distributed as a registry, so you own every line."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <Card key={highlight.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <highlight.icon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                {highlight.title}
              </CardTitle>
              <CardDescription>{highlight.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
          <CardDescription>
            Read the introduction for the big picture, or jump straight into the
            installation quickstart. Component demos live in the sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            to="/docs/introduction"
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          >
            Introduction
            <IconArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/docs/installation"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-2",
            )}
          >
            Installation
            <IconArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </ComponentPage>
  );
}
