"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Command as CmdkCommand } from "cmdk"

const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden rounded-md bg-background text-foreground",
  {
    variants: {
      variant: {
        default: "border",
        minimal: "border-0 shadow-none",
        bordered: "border-2",
      },
      size: {
        sm: "max-h-64",
        default: "max-h-96",
        lg: "max-h-[500px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const commandItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        minimal: "hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const commandShortcutVariants = cva(
  "ml-auto text-xs tracking-widest opacity-60",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        subtle: "text-muted-foreground/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CommandProps extends VariantProps<typeof commandVariants> {}
interface CommandInputProps extends React.ComponentPropsWithoutRef<typeof CmdkCommand.Input> {}
interface CommandListProps extends React.ComponentPropsWithoutRef<typeof CmdkCommand.List> {}
interface CommandEmptyProps extends React.ComponentPropsWithoutRef<typeof CmdkCommand.Empty> {}
interface CommandGroupProps extends React.ComponentPropsWithoutRef<typeof CmdkCommand.Group> {}
interface CommandItemProps extends React.ComponentPropsWithoutRef<typeof CmdkCommand.Item>, VariantProps<typeof commandItemVariants> {}
interface CommandShortcutProps extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof commandShortcutVariants> {}
interface CommandSeparatorProps extends React.ComponentPropsWithoutRef<typeof CmdkCommand.Separator> {}

const Command = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CmdkCommand> & CommandProps>(
  ({ className, variant, size, ...props }, ref) => (
    <CmdkCommand
      ref={ref}
      className={cn(commandVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Command.displayName = "Command"

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <IconSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CmdkCommand.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
)
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <CmdkCommand.List
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
)
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  (props, ref) => (
    <CmdkCommand.Empty
      ref={ref}
      className="py-6 text-center text-sm text-muted-foreground"
      {...props}
    />
  )
)
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <CmdkCommand.Group
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
CommandGroup.displayName = "CommandGroup"

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <CmdkCommand.Separator
      ref={ref}
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
)
CommandSeparator.displayName = "CommandSeparator"

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, variant, ...props }, ref) => (
    <CmdkCommand.Item
      ref={ref}
      className={cn(commandItemVariants({ variant, className }))}
      {...props}
    />
  )
)
CommandItem.displayName = "CommandItem"

const CommandShortcut = ({ className, variant, ...props }: CommandShortcutProps) => {
  return <span className={cn(commandShortcutVariants({ variant, className }))} cmdk-shortcut="" {...props} />
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  commandVariants,
  commandItemVariants,
  commandShortcutVariants,
}

export type {
  CommandProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandItemProps,
  CommandShortcutProps,
  CommandSeparatorProps,
}
