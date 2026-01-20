import * as React from "react"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from "@/components/ui/command"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconSearch, IconFileText, IconSettings, IconUser, IconLayoutDashboard, IconCommand, IconLetterK, IconUsers, IconDatabase } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

export default function CommandPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Command</h1>
        <p className="text-muted-foreground">Command palette with search, groups, and shortcuts</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Command</h2>
        <p className="text-muted-foreground">Simple item list</p>

        <div className="max-w-xl mx-auto">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandItem>
                <IconFileText className="h-4 w-4 mr-2" />
                <span>New Document</span>
              </CommandItem>
              <CommandItem>
                <IconSearch className="h-4 w-4 mr-2" />
                <span>Search</span>
              </CommandItem>
              <CommandItem>
                <IconSettings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </CommandItem>
            </CommandList>
          </Command>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Grouped Items</h2>
        <p className="text-muted-foreground">Items organized by category</p>

        <div className="max-w-xl mx-auto">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="Pages">
                <CommandItem>
                  <IconLayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                  <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <IconUser className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Settings">
                <CommandItem>
                  <IconSettings className="h-4 w-4 mr-2" />
                  <span>Preferences</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Actions">
                <CommandItem>
                  <IconFileText className="h-4 w-4 mr-2" />
                  <span>New File</span>
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Shortcuts</h2>
        <p className="text-muted-foreground">Display keyboard shortcuts</p>

        <div className="max-w-xl mx-auto">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandItem>
                <span>Dashboard</span>
                <CommandShortcut>
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">D</kbd>
                  </div>
                </CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Search</span>
                <CommandShortcut>
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">K</kbd>
                  </div>
                </CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Settings</span>
                <CommandShortcut>
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">,</kbd>
                  </div>
                </CommandShortcut>
              </CommandItem>
            </CommandList>
          </Command>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Empty State</h2>
        <p className="text-muted-foreground">Custom "No results" message</p>

        <div className="max-w-xl mx-auto">
          <Command>
            <CommandInput placeholder="Type to search..." />
            <CommandList>
              <CommandEmpty>
                <div className="flex flex-col items-center py-4 text-center">
                  <IconSearch className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm">No results found</p>
                  <p className="text-xs text-muted-foreground">Try a different search term</p>
                </div>
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <p className="text-muted-foreground">Default, minimal, and bordered styles</p>

        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="font-medium">Default</h3>
            <div className="max-w-xl mx-auto">
              <Command variant="default">
                <CommandInput placeholder="Type a command..." />
                <CommandList>
                  <CommandItem>Dashboard</CommandItem>
                  <CommandItem>Settings</CommandItem>
                  <CommandItem>Profile</CommandItem>
                </CommandList>
              </Command>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Minimal</h3>
            <div className="max-w-xl mx-auto">
              <Command variant="minimal">
                <CommandInput placeholder="Type a command..." />
                <CommandList>
                  <CommandItem>Dashboard</CommandItem>
                  <CommandItem>Settings</CommandItem>
                  <CommandItem>Profile</CommandItem>
                </CommandList>
              </Command>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Bordered</h3>
            <div className="max-w-xl mx-auto">
              <Command variant="bordered">
                <CommandInput placeholder="Type a command..." />
                <CommandList>
                  <CommandItem>Dashboard</CommandItem>
                  <CommandItem>Settings</CommandItem>
                  <CommandItem>Profile</CommandItem>
                </CommandList>
              </Command>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog Mode</h2>
        <p className="text-muted-foreground">Command inside a modal/dialog</p>

        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <IconCommand className="h-4 w-4" />
                <IconLetterK className="h-4 w-4" />
                Open Command
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0">
              <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <IconLayoutDashboard className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                      <CommandShortcut>⌘D</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <IconUser className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <IconSettings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                      <CommandShortcut>⌘,</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Actions">
                    <CommandItem>
                      <IconFileText className="h-4 w-4 mr-2" />
                      <span>New File</span>
                      <CommandShortcut>⌘N</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Badges</h2>
        <p className="text-muted-foreground">Command items with status badges</p>

        <div className="max-w-xl mx-auto">
          <Command>
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandItem>
                <IconUser className="h-4 w-4 mr-2" />
                <span className="flex-1">Profile</span>
                <Badge variant="secondary" className="text-xs">Pro</Badge>
              </CommandItem>
              <CommandItem>
                <IconUsers className="h-4 w-4 mr-2" />
                <span className="flex-1">Team</span>
                <Badge variant="outline" className="text-xs">New</Badge>
              </CommandItem>
              <CommandItem>
                <IconDatabase className="h-4 w-4 mr-2" />
                <span className="flex-1">Database</span>
                <Badge variant="destructive" className="text-xs">3 alerts</Badge>
              </CommandItem>
            </CommandList>
          </Command>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Rich Content</h2>
        <p className="text-muted-foreground">Command items with descriptions</p>

        <div className="max-w-xl mx-auto">
          <Command>
            <CommandInput placeholder="Type a command..." />
            <CommandList>
              <CommandItem>
                <div className="flex flex-col">
                  <span className="font-medium">Dashboard</span>
                  <span className="text-xs text-muted-foreground">View your analytics and metrics</span>
                </div>
              </CommandItem>
              <CommandItem>
                <div className="flex flex-col">
                  <span className="font-medium">Profile</span>
                  <span className="text-xs text-muted-foreground">Manage your account settings</span>
                </div>
              </CommandItem>
              <CommandItem>
                <div className="flex flex-col">
                  <span className="font-medium">Settings</span>
                  <span className="text-xs text-muted-foreground">Configure your preferences</span>
                </div>
              </CommandItem>
            </CommandList>
          </Command>
        </div>
      </section>
    </div>
  )
}
