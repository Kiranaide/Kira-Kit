import * as React from "react"
import { Timeline, TimelineItem, TimelineConnector, TimelineDot, TimelineContent, TimelineTime, TimelineTitle, TimelineDescription } from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconCheck, IconGitCommit, IconGitPullRequest, IconMessageCircle, IconTag } from "@tabler/icons-react"

export default function TimelinePage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Timeline</h1>
        <p className="text-muted-foreground">Chronological event display with semantic time elements</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Timeline</h2>
        <p className="text-muted-foreground">Default vertical timeline</p>

        <Timeline>
          <TimelineItem>
            <TimelineConnector />
            <TimelineDot>
              <IconCheck className="h-4 w-4" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T10:00">10:00 AM</TimelineTime>
              <TimelineTitle>Project started</TimelineTitle>
              <TimelineDescription>Initial repository created and team onboarded</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector />
            <TimelineDot>
              <IconGitCommit className="h-4 w-4" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T14:30">2:30 PM</TimelineTime>
              <TimelineTitle>First commit</TimelineTitle>
              <TimelineDescription>Initial code structure implemented</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineDot variant="filled" />
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T17:00">5:00 PM</TimelineTime>
              <TimelineTitle>Milestone reached</TimelineTitle>
              <TimelineDescription>Core features completed</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alternating Layout</h2>
        <p className="text-muted-foreground">Left/right alternating content</p>

        <Timeline>
          <TimelineItem variant="alternating">
            <TimelineConnector variant="dashed" />
            <TimelineDot variant="filled" />
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20">Jan 20, 2024</TimelineTime>
              <TimelineTitle>Phase 1 Complete</TimelineTitle>
              <TimelineDescription>All initial requirements documented</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem variant="alternating">
            <TimelineConnector variant="dashed" />
            <TimelineDot variant="outlined" />
            <TimelineContent>
              <TimelineTime dateTime="2024-01-25">Jan 25, 2024</TimelineTime>
              <TimelineTitle>Phase 2 Complete</TimelineTitle>
              <TimelineDescription>Design system finalized</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem variant="alternating">
            <TimelineDot variant="ghost" />
            <TimelineContent>
              <TimelineTime dateTime="2024-01-30">Jan 30, 2024</TimelineTime>
              <TimelineTitle>Phase 3 Complete</TimelineTitle>
              <TimelineDescription>Development finished</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Compact Variant</h2>
        <p className="text-muted-foreground">Condensed timeline with reduced spacing</p>

        <Timeline>
          <TimelineItem variant="compact">
            <TimelineConnector />
            <TimelineDot size="sm" />
            <TimelineContent>
              <TimelineTitle>Task 1</TimelineTitle>
              <TimelineDescription>Completed</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem variant="compact">
            <TimelineConnector />
            <TimelineDot size="sm" variant="filled" />
            <TimelineContent>
              <TimelineTitle>Task 2</TimelineTitle>
              <TimelineDescription>In Progress</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem variant="compact">
            <TimelineDot size="sm" variant="outlined" />
            <TimelineContent>
              <TimelineTitle>Task 3</TimelineTitle>
              <TimelineDescription>Pending</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Connector Styles</h2>
        <p className="text-muted-foreground">Solid vs dashed lines</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-medium">Solid Connector</h3>
            <Timeline>
              <TimelineItem>
                <TimelineConnector />
                <TimelineDot />
                <TimelineContent>
                  <TimelineTitle>Event 1</TimelineTitle>
                  <TimelineDescription>Description</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineConnector />
                <TimelineDot />
                <TimelineContent>
                  <TimelineTitle>Event 2</TimelineTitle>
                  <TimelineDescription>Description</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Dashed Connector</h3>
            <Timeline>
              <TimelineItem>
                <TimelineConnector variant="dashed" />
                <TimelineDot />
                <TimelineContent>
                  <TimelineTitle>Event 1</TimelineTitle>
                  <TimelineDescription>Description</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineConnector variant="dashed" />
                <TimelineDot />
                <TimelineContent>
                  <TimelineTitle>Event 2</TimelineTitle>
                  <TimelineDescription>Description</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dot Variants</h2>
        <p className="text-muted-foreground">Different dot styles and sizes</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-medium">Default</h3>
            <Timeline>
              <TimelineItem>
                <TimelineDot size="sm" />
                <TimelineContent><TimelineTitle>Small</TimelineTitle></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot size="default" />
                <TimelineContent><TimelineTitle>Default</TimelineTitle></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot size="lg" />
                <TimelineContent><TimelineTitle>Large</TimelineTitle></TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Filled</h3>
            <Timeline>
              <TimelineItem>
                <TimelineDot size="sm" variant="filled" />
                <TimelineContent><TimelineTitle>Small</TimelineTitle></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot size="default" variant="filled" />
                <TimelineContent><TimelineTitle>Default</TimelineTitle></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot size="lg" variant="filled" />
                <TimelineContent><TimelineTitle>Large</TimelineTitle></TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Outlined & Ghost</h3>
            <Timeline>
              <TimelineItem>
                <TimelineDot size="sm" variant="outlined" />
                <TimelineContent><TimelineTitle>Outlined</TimelineTitle></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot size="default" variant="ghost" />
                <TimelineContent><TimelineTitle>Ghost</TimelineTitle></TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons</h2>
        <p className="text-muted-foreground">Custom icons in TimelineDot</p>

        <Timeline>
          <TimelineItem>
            <TimelineConnector />
            <TimelineDot>
              <IconGitCommit className="h-4 w-4" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T10:00">10:00 AM</TimelineTime>
              <TimelineTitle>Commit made</TimelineTitle>
              <TimelineDescription>feat: add new component</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector />
            <TimelineDot>
              <IconGitPullRequest className="h-4 w-4" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T11:30">11:30 AM</TimelineTime>
              <TimelineTitle>Pull request</TimelineTitle>
              <TimelineDescription>PR #123 opened</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineConnector />
            <TimelineDot>
              <IconMessageCircle className="h-4 w-4" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T14:00">2:00 PM</TimelineTime>
              <TimelineTitle>Review comment</TimelineTitle>
              <TimelineDescription>Feedback received</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineDot variant="filled">
              <IconCheck className="h-4 w-4" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTime dateTime="2024-01-20T16:00">4:00 PM</TimelineTime>
              <TimelineTitle>Merged</TimelineTitle>
              <TimelineDescription>Changes merged to main</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Activity Feed</h2>
        <p className="text-muted-foreground">Real-world example with avatars and badges</p>

        <div className="max-w-2xl">
          <Timeline>
            <TimelineItem>
              <TimelineConnector />
              <TimelineDot variant="filled" />
              <TimelineContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <TimelineTitle className="text-sm">John Doe</TimelineTitle>
                      <Badge variant="outline" className="text-xs">
                        <IconTag className="h-3 w-3 mr-1" />
                        feature
                      </Badge>
                    </div>
                    <TimelineDescription className="text-sm">Created a new pull request #142</TimelineDescription>
                    <TimelineTime dateTime="2024-01-20T10:00" className="text-xs text-muted-foreground">2 hours ago</TimelineTime>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineConnector />
              <TimelineDot variant="outlined" />
              <TimelineContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <TimelineTitle className="text-sm">Alice Smith</TimelineTitle>
                    <TimelineDescription className="text-sm">Reviewed PR #141 and requested changes</TimelineDescription>
                    <TimelineTime dateTime="2024-01-20T09:30" className="text-xs text-muted-foreground">2.5 hours ago</TimelineTime>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot variant="ghost" />
              <TimelineContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <TimelineTitle className="text-sm">Mike Johnson</TimelineTitle>
                    <TimelineDescription className="text-sm">Merged PR #140 into main branch</TimelineDescription>
                    <TimelineTime dateTime="2024-01-20T09:00" className="text-xs text-muted-foreground">3 hours ago</TimelineTime>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </section>
    </div>
  )
}
