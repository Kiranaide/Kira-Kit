"use client";

import type { ComponentProps as ReactComponentProps } from "react";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  IconEye,
  IconPhoto,
  IconLink,
  IconCalendar,
  IconStack2,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";

import {
  createHoverCardHandle,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardAnchor,
  HoverCardHeader,
  HoverCardFooter,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardLoading,
  HoverCardImage,
  HoverCardPayloadTrigger,
} from "@/components/ui/hover-card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger render={<Button variant="link">@kirakit</Button>} />
        <HoverCardContent>
          <HoverCardArrow />
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/mui.png" />
              <AvatarFallback>KK</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@kirakit</h4>
              <p className="text-sm text-muted-foreground">
                A beautiful UI component library built with Base UI.
              </p>
              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                <IconCalendar className="mr-1 h-3 w-3" />
                Joined December 2024
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const basicCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function BasicDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link">@kirakit</Button>} />
      <HoverCardContent>
        <HoverCardArrow />
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/mui.png" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@kirakit</h4>
            <p className="text-sm text-muted-foreground">
              A beautiful UI component library built with Base UI.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}`;

function BasicWithSectionsDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline">View Profile</Button>}
        />
        <HoverCardContent size="lg">
          <HoverCardArrow />
          <HoverCardHeader>
            <Avatar size="lg">
              <AvatarImage src="https://github.com/mui.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <HoverCardTitle>Jane Doe</HoverCardTitle>
              <HoverCardDescription>
                Senior Software Engineer
              </HoverCardDescription>
            </div>
          </HoverCardHeader>
          <p className="text-sm text-muted-foreground">
            Building beautiful user interfaces with React. Open source
            enthusiast and design systems advocate.
          </p>
          <HoverCardFooter>
            <div className="flex items-center gap-1">
              <IconMapPin className="h-3 w-3" />
              San Francisco, CA
            </div>
            <div className="flex items-center gap-1">
              <IconUsers className="h-3 w-3" />
              1.2k followers
            </div>
          </HoverCardFooter>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const basicWithSectionsCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardFooter,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function BasicWithSectionsDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="outline">View Profile</Button>}
      />
      <HoverCardContent size="lg">
        <HoverCardArrow />
        <HoverCardHeader>
          <Avatar size="lg">
            <AvatarImage src="https://github.com/mui.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <HoverCardTitle>Jane Doe</HoverCardTitle>
            <HoverCardDescription>
              Senior Software Engineer
            </HoverCardDescription>
          </div>
        </HoverCardHeader>
        <p className="text-sm text-muted-foreground">
          Building beautiful user interfaces with React.
        </p>
        <HoverCardFooter>
          <div className="flex items-center gap-1">
            <IconMapPin className="h-3 w-3" />
            San Francisco, CA
          </div>
          <div className="flex items-center gap-1">
            <IconUsers className="h-3 w-3" />
            1.2k followers
          </div>
        </HoverCardFooter>
      </HoverCardContent>
    </HoverCard>
  )
}`;

function WithImageDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline">Hover for Image</Button>}
        />
        <HoverCardContent size="lg">
          <HoverCardArrow />
          <HoverCardImage
            src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=200"
            alt="Typography"
            aspectRatio="video"
          />
          <HoverCardTitle>Typography</HoverCardTitle>
          <HoverCardDescription>
            The art and science of arranging type to make written language
            clear, visually appealing, and effective.
          </HoverCardDescription>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const withImageCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardImage,
  HoverCardTitle,
  HoverCardDescription,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function WithImageDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="outline">Hover for Image</Button>}
      />
      <HoverCardContent size="lg">
        <HoverCardArrow />
        <HoverCardImage
          src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=200"
          alt="Typography"
          aspectRatio="video"
        />
        <HoverCardTitle>Typography</HoverCardTitle>
        <HoverCardDescription>
          The art and science of arranging type to make written language
          clear, visually appealing, and effective.
        </HoverCardDescription>
      </HoverCardContent>
    </HoverCard>
  )
}`;

function InlineLinkDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="max-w-md p-4 border rounded-lg">
        <p className="text-sm">
          The principles of good{" "}
          <HoverCard>
            <HoverCardAnchor href="#">typography</HoverCardAnchor>
            <HoverCardContent size="lg">
              <HoverCardArrow />
              <HoverCardImage
                src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=200"
                alt="Typography"
                aspectRatio="video"
              />
              <HoverCardTitle>Typography</HoverCardTitle>
              <HoverCardDescription>
                The art and science of arranging type to make written language
                clear, visually appealing, and effective.
              </HoverCardDescription>
            </HoverCardContent>
          </HoverCard>{" "}
          remain relevant in the digital age. Good typography makes reading
          effortless and enhances the user experience.
        </p>
      </div>
    </div>
  );
}

const inlineLinkCode = `import {
  HoverCard,
  HoverCardAnchor,
  HoverCardContent,
  HoverCardArrow,
  HoverCardImage,
  HoverCardTitle,
  HoverCardDescription,
} from "@/components/ui/hover-card"

export function InlineLinkDemo() {
  return (
    <p className="text-sm">
      The principles of good{" "}
      <HoverCard>
        <HoverCardAnchor href="#">typography</HoverCardAnchor>
        <HoverCardContent size="lg">
          <HoverCardArrow />
          <HoverCardImage
            src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=200"
            alt="Typography"
            aspectRatio="video"
          />
          <HoverCardTitle>Typography</HoverCardTitle>
          <HoverCardDescription>
            The art and science of arranging type to make written language
            clear, visually appealing, and effective.
          </HoverCardDescription>
        </HoverCardContent>
      </HoverCard>{" "}
      remain relevant in the digital age.
    </p>
  )
}`;

function BlurDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline">Hover for Glass Effect</Button>}
        />
        <HoverCardContent variant="blur" size="md">
          <HoverCardArrow />
          <HoverCardTitle>Glassmorphism</HoverCardTitle>
          <HoverCardDescription>
            A translucent backdrop with blur effect for a modern look.
          </HoverCardDescription>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const blurCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTitle,
  HoverCardDescription,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function BlurDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="outline">Hover for Glass Effect</Button>}
      />
      <HoverCardContent variant="blur" size="md">
        <HoverCardArrow />
        <HoverCardTitle>Glassmorphism</HoverCardTitle>
        <HoverCardDescription>
          A translucent backdrop with blur effect for a modern look.
        </HoverCardDescription>
      </HoverCardContent>
    </HoverCard>
  )
}`;

const githubProfileSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  followers: z.number().int().nonnegative(),
});

type GitHubProfile = z.infer<typeof githubProfileSchema>;

const profileCache = new Map<string, GitHubProfile>();

function fetchProfile(login: string) {
  if (profileCache.has(login)) return Promise.resolve(profileCache.get(login)!);

  return fetch(`https://api.github.com/users/${login}`)
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);

      return res.json();
    })
    .then((payload) => {
      const result = githubProfileSchema.safeParse(payload);

      if (!result.success) throw new Error("Invalid GitHub profile response");
      const profile = result.data;

      profileCache.set(login, profile);

      return profile;
    });
}

function LoadingDemo() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = (login: string) => {
    setProfile(profileCache.get(login) ?? null);
    setIsLoading(true);
    fetchProfile(login)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HoverCard onOpenChange={(open) => open && load("mui")}>
        <HoverCardTrigger
          render={<Button variant="outline">Fetch Profile on Open</Button>}
        />
        <HoverCardContent size="md">
          <HoverCardArrow />
          {isLoading || !profile ? (
            <HoverCardLoading message="Fetching profile..." />
          ) : (
            <>
              <HoverCardTitle>{profile.name ?? profile.login}</HoverCardTitle>
              <HoverCardDescription>
                {profile.bio ?? "No bio available."}
              </HoverCardDescription>
              <HoverCardFooter>
                <span className="flex items-center gap-1">
                  <IconUsers className="h-3 w-3" />
                  {profile.followers.toLocaleString()} followers
                </span>
              </HoverCardFooter>
            </>
          )}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const loadingCode = `import { useState } from "react"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardFooter,
  HoverCardLoading,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function LoadingDemo() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const load = (login: string) => {
    setIsLoading(true)
    fetch(\`https://api.github.com/users/\${login}\`)
      .then((res) => res.json())
      .then(setProfile)
      .finally(() => setIsLoading(false))
  }

  return (
    <HoverCard onOpenChange={(open) => open && load("mui")}>
      <HoverCardTrigger render={<Button variant="outline">Fetch Profile on Open</Button>} />
      <HoverCardContent size="md">
        <HoverCardArrow />
        {isLoading || !profile ? (
          <HoverCardLoading message="Fetching profile..." />
        ) : (
          <>
            <HoverCardTitle>{profile.name ?? profile.login}</HoverCardTitle>
            <HoverCardDescription>{profile.bio}</HoverCardDescription>
            <HoverCardFooter>{profile.followers} followers</HoverCardFooter>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Small (w-48)
            </Button>
          }
        />
        <HoverCardContent size="sm">
          <HoverCardArrow />
          <p className="text-sm">Small hover card content.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Medium (w-64)
            </Button>
          }
        />
        <HoverCardContent size="md">
          <HoverCardArrow />
          <p className="text-sm">Medium hover card content.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Large (w-80)
            </Button>
          }
        />
        <HoverCardContent size="lg">
          <HoverCardArrow />
          <p className="text-sm">Large hover card content with more space.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              XL (w-96)
            </Button>
          }
        />
        <HoverCardContent size="xl">
          <HoverCardArrow />
          <p className="text-sm">Extra large hover card for rich content.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const sizesCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function SizesDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">Small (w-48)</Button>}
        />
        <HoverCardContent size="sm">
          <HoverCardArrow />
          <p className="text-sm">Small hover card content.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">Medium (w-64)</Button>}
        />
        <HoverCardContent size="md">
          <HoverCardArrow />
          <p className="text-sm">Medium hover card content.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">Large (w-80)</Button>}
        />
        <HoverCardContent size="lg">
          <HoverCardArrow />
          <p className="text-sm">Large hover card content with more space.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">XL (w-96)</Button>}
        />
        <HoverCardContent size="xl">
          <HoverCardArrow />
          <p className="text-sm">Extra large hover card for rich content.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}`;

function PositioningDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Top
            </Button>
          }
        />
        <HoverCardContent side="top" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears above the trigger.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Left
            </Button>
          }
        />
        <HoverCardContent side="left" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears to the left.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Right
            </Button>
          }
        />
        <HoverCardContent side="right" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears to the right.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="outline" size="sm">
              Bottom
            </Button>
          }
        />
        <HoverCardContent side="bottom" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears below (default).</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const positioningCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function PositioningDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Top</Button>} />
        <HoverCardContent side="top" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears above the trigger.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Left</Button>} />
        <HoverCardContent side="left" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears to the left.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Right</Button>} />
        <HoverCardContent side="right" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears to the right.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Bottom</Button>} />
        <HoverCardContent side="bottom" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears below (default).</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}`;

interface MemberPayload {
  handle: string;
  role: string;
  posts: number;
}

function DetachedDemo() {
  const handle = useMemo(() => createHoverCardHandle<MemberPayload>(), []);

  const members: MemberPayload[] = [
    { handle: "@ada", role: "Maintainer", posts: 412 },
    { handle: "@linus", role: "Contributor", posts: 87 },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
      <HoverCard<MemberPayload> handle={handle}>
        {({ payload }) => (
          <HoverCardContent size="md">
            <HoverCardArrow />
            {payload && (
              <>
                <HoverCardTitle>{payload.handle}</HoverCardTitle>
                <HoverCardDescription>
                  {payload.role} · {payload.posts} posts. One shared popup,
                  per-trigger payload.
                </HoverCardDescription>
              </>
            )}
          </HoverCardContent>
        )}
      </HoverCard>
      {members.map((member) => (
        <HoverCardPayloadTrigger
          key={member.handle}
          handle={handle}
          payload={member}
          delay={200}
          closeDelay={150}
          render={<Button variant="outline">{member.handle}</Button>}
        />
      ))}
    </div>
  );
}

const detachedCode = `import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardPayloadTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

const handle = createHoverCardHandle<{ name: string; role: string }>()

// One Root + Content, many triggers — each trigger carries its own payload
<HoverCard handle={handle}>
  {({ payload }) => (
    <HoverCardContent>
      {payload ? <p>{payload.name} — {payload.role}</p> : null}
    </HoverCardContent>
  )}
</HoverCard>
<HoverCardPayloadTrigger handle={handle} payload={{ name: "Ada", role: "Maintainer" }} render={<Button>@ada</Button>} />
<HoverCardPayloadTrigger handle={handle} payload={{ name: "Linus", role: "Contributor" }} render={<Button>@linus</Button>} />`;

function ContentTransitionsDemo() {
  const [variant, setVariant] = useState<"a" | "b">("a");

  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-[220px]">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={variant === "a" ? "default" : "outline"}
          onClick={() => setVariant("a")}
        >
          Show A
        </Button>
        <Button
          size="sm"
          variant={variant === "b" ? "default" : "outline"}
          onClick={() => setVariant("b")}
        >
          Show B
        </Button>
      </div>
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="link">Hover — content swaps cross-fade</Button>
          }
        />
        <HoverCardContent size="md" viewport>
          <div data-current className="text-sm">
            {variant === "a" ? (
              <>
                <HoverCardTitle>Content A</HoverCardTitle>
                <HoverCardDescription>
                  PreviewCard.Viewport animates content swaps between triggers;
                  the previous pane fades out in place.
                </HoverCardDescription>
              </>
            ) : (
              <>
                <HoverCardTitle>Content B</HoverCardTitle>
                <HoverCardDescription>
                  Motion respects prefers-reduced-motion: transitions are
                  disabled instantly for reduced-motion users.
                </HoverCardDescription>
              </>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const transitionsCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

// viewport renders PreviewCard.Viewport inside the popup so content
// swaps between triggers cross-fade instead of popping
<HoverCardContent viewport>
  <div data-current>...</div>
</HoverCardContent>`;

const usageCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardAnchor,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardFooter,
  HoverCardLoading,
  HoverCardImage,
} from "@/components/ui/hover-card"

// Basic usage
<HoverCard>
  <HoverCardTrigger render={<Button>Hover me</Button>} />
  <HoverCardContent size="md" side="bottom">
    <HoverCardArrow />
    <p>Preview content here</p>
  </HoverCardContent>
</HoverCard>

// With pre-styled sections
<HoverCard>
  <HoverCardTrigger render={<Button>View Profile</Button>} />
  <HoverCardContent size="lg" variant="blur">
    <HoverCardHeader>
      <Avatar />
      <div>
        <HoverCardTitle>Jane Doe</HoverCardTitle>
        <HoverCardDescription>Engineer</HoverCardDescription>
      </div>
    </HoverCardHeader>
    <HoverCardFooter>Footer content</HoverCardFooter>
  </HoverCardContent>
</HoverCard>

// For inline links
<HoverCard>
  <HoverCardAnchor href="#">Link text</HoverCardAnchor>
  <HoverCardContent>
    <HoverCardImage src="..." aspectRatio="video" />
    Preview content
  </HoverCardContent>
</HoverCard>`;

const apiSections = [
  {
    title: "HoverCard",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the hover card.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state for uncontrolled mode.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes.",
      },
      {
        prop: "handle",
        type: "HoverCardHandle<Payload>",
        default: "-",
        description:
          "Handle associating this Root with detached HoverCardPayloadTrigger elements (createHoverCardHandle).",
      },
    ],
  },
  {
    title: "HoverCardContent",
    props: [
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Width of the hover card content.",
      },
      {
        prop: "viewport",
        type: "boolean",
        default: "false",
        description:
          "Render Base UI PreviewCard.Viewport inside the popup so content swaps between triggers cross-fade.",
      },
      {
        prop: "variant",
        type: '"default" | "blur"',
        default: '"default"',
        description: "Visual style variant. Blur adds glassmorphism effect.",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "Preferred side to position the content.",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "8",
        description: "Distance from the trigger in pixels.",
      },
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment relative to the trigger.",
      },
    ],
  },
  {
    title: "HoverCardTrigger",
    props: [
      {
        prop: "delay",
        type: "number",
        default: "600",
        description:
          "Delay in ms before the hover card opens (Trigger-only prop).",
      },
      {
        prop: "closeDelay",
        type: "number",
        default: "300",
        description:
          "Delay in ms before the hover card closes (Trigger-only prop).",
      },
      {
        prop: "render",
        type: "ReactElement",
        description: "The element to render as the hover trigger.",
      },
    ],
  },
  {
    title: "HoverCardPayloadTrigger",
    props: [
      {
        prop: "handle",
        type: "HoverCardHandle<Payload>",
        description:
          "Handle of the detached HoverCard Root this trigger opens (required).",
      },
      {
        prop: "payload",
        type: "Payload",
        description:
          "Value passed to the Root's function-as-child content when this trigger opens.",
      },
      {
        prop: "delay / closeDelay",
        type: "number",
        default: "600 / 300",
        description: "Open/close delays in ms.",
      },
    ],
  },
  {
    title: "HoverCardAnchor",
    props: [
      {
        prop: "href",
        type: "string",
        description: "URL for the anchor link.",
      },
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for the link.",
      },
    ],
  },
  {
    title: "HoverCardImage",
    props: [
      {
        prop: "src",
        type: "string",
        description: "Image source URL.",
      },
      {
        prop: "alt",
        type: "string",
        description: "Alternative text for the image.",
      },
      {
        prop: "aspectRatio",
        type: '"square" | "video" | "wide"',
        default: '"video"',
        description: "Aspect ratio of the image container.",
      },
    ],
  },
  {
    title: "HoverCardLoading",
    props: [
      {
        prop: "message",
        type: "string",
        default: '"Loading..."',
        description: "Loading message to display.",
      },
    ],
  },
];

const features = [
  {
    title: "Preview on Hover",
    description:
      "Show rich content previews without navigation. Perfect for user profiles, link previews, and contextual information.",
    icon: <IconEye className="h-4 w-4" />,
  },
  {
    title: "Rich Media Support",
    description:
      "Built-in components for images, headers, footers, and loading states with consistent styling.",
    icon: <IconPhoto className="h-4 w-4" />,
  },
  {
    title: "Inline Links",
    description:
      "HoverCardAnchor provides seamless inline link integration with hover previews for enhanced UX.",
    icon: <IconLink className="h-4 w-4" />,
  },
  {
    title: "Detached Triggers",
    description:
      "One shared popup driven by many triggers via createHoverCardHandle, each carrying its own typed payload (see Detached tab).",
    icon: <IconUsers className="h-4 w-4" />,
  },
  {
    title: "Content Transitions",
    description:
      "HoverCardViewport cross-fades content swaps between triggers, reduced-motion aware (see Transitions tab).",
    icon: <IconStack2 className="h-4 w-4" />,
  },
];

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Hover Card"
        description="Simple hover card with avatar and user info."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "basic-with-sections",
    label: "With Sections",
    demo: (
      <DemoWrapper
        title="Pre-styled Sections"
        description="Use HoverCardHeader, HoverCardTitle, HoverCardDescription, and HoverCardFooter for consistent styling."
        code={basicWithSectionsCode}
      >
        <BasicWithSectionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "with-image",
    label: "With Image",
    demo: (
      <DemoWrapper
        title="Hover Card with Image"
        description="Display an image preview with HoverCardImage component."
        code={withImageCode}
      >
        <WithImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "without-trigger",
    label: "Without Trigger",
    demo: (
      <DemoWrapper
        title="Inline Link (No Separate Trigger)"
        description="Use HoverCardAnchor for inline links that trigger the hover card directly."
        code={inlineLinkCode}
      >
        <InlineLinkDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "blur-variant",
    label: "Blur Variant",
    demo: (
      <DemoWrapper
        title="Blur Variant (Glassmorphism)"
        description="Translucent backdrop with blur effect for a modern look."
        code={blurCode}
      >
        <BlurDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading-state",
    label: "Async",
    demo: (
      <DemoWrapper
        title="Async Content"
        description="HoverCardLoading drives a real fetch; results are cached after the first open."
        code={loadingCode}
      >
        <LoadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "detached",
    label: "Detached Triggers",
    demo: (
      <DemoWrapper
        title="Detached Payload Triggers"
        description="Two triggers share one popup via createHoverCardHandle; each passes a typed payload and its own delays."
        code={detachedCode}
      >
        <DetachedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "transitions",
    label: "Content Transitions",
    demo: (
      <DemoWrapper
        title="Content Transitions (Viewport)"
        description="viewport content swaps cross-fade through PreviewCard.Viewport; flip A/B while hovering."
        code={transitionsCode}
      >
        <ContentTransitionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Available sizes: sm (w-48), md (w-64), lg (w-80), xl (w-96)."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "positioning",
    label: "Positioning",
    demo: (
      <DemoWrapper
        title="Positioning"
        description="Control placement with side and sideOffset props."
        code={positioningCode}
      >
        <PositioningDemo />
      </DemoWrapper>
    ),
  },
];

export default function HoverCardPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Hover Card"
        description="A card that appears on hover, for previewing content. Built on Base UI's PreviewCard primitive with pre-styled sections, loading states, detached payload triggers, and viewport content transitions."
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Esc",
            description:
              "Dismiss open preview (inherited from Base UI popup behavior)",
          },
        ]}
        description="HoverCard content is pointer-only progressive enhancement per Base UI docs: triggers are not keyboard-activatable, so equivalent information must be reachable by navigation. Focus styles remain on triggers."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation patterns for HoverCard"
      />

      <APIReference
        sections={apiSections}
        title="API reference"
        description="Props and configuration options for HoverCard components"
      />

      <Changelog entries={hoverCardPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const hoverCardPageChangelogEntries = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "fixed",
        title: "HoverCardContent viewport now wraps children",
        description:
          "Fixed a bug where viewport={true} rendered an empty <PreviewCardPrimitive.Viewport /> sibling above children instead of wrapping props.children inside the viewport.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "3 November 2026",
    changes: [
      {
        type: "breaking",
        title: "delay / closeDelay Removed from Content",
        description:
          "These props were declared on HoverCardContent but never used. They live on the Trigger (Base UI convention, defaults 600ms/300ms). Move them to HoverCardTrigger or HoverCardPayloadTrigger.",
      },
      {
        type: "breaking",
        title: "Motion Convention Replaced",
        description:
          "The tw-animate data-open/data-closed zoom/slide stack is replaced by Base UI data-starting-style/data-ending-style transitions matching tooltip/popover. z-index drops from z-[100] to the shared z-50 popup layer.",
      },
      {
        type: "breaking",
        title: "forwardRef Removed",
        description:
          "HoverCardContent and HoverCardArrow are plain function components; refs flow through props like every other Base UI wrapper in this kit.",
      },
      {
        type: "added",
        title: "Detached Triggers + Typed Payloads",
        description:
          "createHoverCardHandle and HoverCardPayloadTrigger let many triggers share one popup, each carrying its own payload consumed via function-as-child content.",
      },
      {
        type: "added",
        title: "HoverCardViewport + viewport Prop",
        description:
          "HoverCardContent viewport renders Base UI's PreviewCard.Viewport so content swaps between triggers cross-fade (reduced-motion aware).",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
