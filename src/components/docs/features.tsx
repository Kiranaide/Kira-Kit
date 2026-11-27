import * as React from "react";
import {
  DocsSection,
  FeatureIcon,
  Reveal,
  SectionRule,
} from "@/components/docs/layout";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureGridProps {
  features: FeatureCardProps[];
  title?: string;
  description?: React.ReactNode;
  className?: string;
}

/**
 * The design lays features out as a rule-delimited list rather than a card
 * grid: each row is an icon chip beside a title and one line of body copy.
 */
export function FeatureGrid({
  features,
  title = "Features",
  description = "Everything below is implemented in the source you copy — no extra packages, no configuration step.",
  className,
}: FeatureGridProps) {
  return (
    <DocsSection
      title={title}
      description={description}
      className={className}
      contentClassName="flex flex-col"
    >
      {features.map((feature, index) => (
        <React.Fragment key={feature.title}>
          {index > 0 && <SectionRule />}
          <Reveal delay={Math.min(index, 5) * 40}>
            <div className="flex items-start gap-3 py-3.5 lg:gap-3.5 lg:py-[18px]">
              <FeatureIcon title={feature.title} icon={feature.icon} />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-base leading-[1.375] font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-[1.45] text-foreground/80">
                  {feature.description}
                </p>
              </div>
            </div>
          </Reveal>
        </React.Fragment>
      ))}
    </DocsSection>
  );
}
