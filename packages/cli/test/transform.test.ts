import { describe, expect, it } from "vitest";
import {
  prependUseClient,
  rewriteImports,
  type ImportAliases,
} from "../src/core/install/transform";

const aliases: ImportAliases = {
  components: "@kit/components",
  ui: "@kit/ui",
  hooks: "@kit/hooks",
  lib: "@kit/lib",
  utils: "@kit/utils",
};

describe("rewriteImports", () => {
  it("rewrites ui, hook, lib, and components prefixes", () => {
    const source = [
      'import { Button } from "@/components/ui/button";',
      'import { useThing } from "@/hooks/use-thing";',
      'import { helper } from "@/lib/layout-responsive";',
      'import { Shell } from "@/components/shell";',
    ].join("\n");

    const result = rewriteImports(source, aliases);

    expect(result).toContain('from "@kit/ui/button"');
    expect(result).toContain('from "@kit/hooks/use-thing"');
    expect(result).toContain('from "@kit/lib/layout-responsive"');
    expect(result).toContain('from "@kit/components/shell"');
  });

  it("keeps lib subpaths and rewrites both quote styles", () => {
    const source = `import type { CameraType } from '@/lib/camera/types';`;

    expect(rewriteImports(source, aliases)).toBe(
      `import type { CameraType } from '@kit/lib/camera/types';`,
    );
  });

  it("maps exact @/lib/utils to the utils alias", () => {
    const source = `import { cn } from "@/lib/utils";`;

    expect(rewriteImports(source, aliases)).toBe(
      `import { cn } from "@kit/utils";`,
    );
  });

  it("leaves npm specifiers and unrelated aliases untouched", () => {
    const source = [
      'import { cn } from "cn";',
      'import { Menu } from "@base-ui/react/menu";',
      'import "@/styles/app.css";',
    ].join("\n");

    expect(rewriteImports(source, aliases)).toBe(source);
  });

  it("is identity for default aliases", () => {
    const defaults: ImportAliases = {
      components: "@/components",
      ui: "@/components/ui",
      hooks: "@/hooks",
      lib: "@/lib",
      utils: "@/lib/utils",
    };

    const source = `import { Button } from "@/components/ui/button";`;

    expect(rewriteImports(source, defaults)).toBe(source);
  });
});

describe("prependUseClient", () => {
  it("prepends the directive to a plain module", () => {
    expect(prependUseClient("export const x = 1;")).toBe(
      '"use client";\n\nexport const x = 1;',
    );
  });

  it("does not double an existing directive", () => {
    const source = '"use client";\n\nexport const x = 1;';

    expect(prependUseClient(source)).toBe(source);
    expect(prependUseClient(`'use client';\nconst y = 2;`)).toBe(
      `'use client';\nconst y = 2;`,
    );
  });
});
