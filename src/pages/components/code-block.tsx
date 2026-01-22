import { useState } from "react"
import { CodeBlock, type CodeBlockProps } from "@/components/ui/code-block"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  APIReference,
} from "@/components/docs"

const sampleCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-4">
      <p className="text-lg">Count: {count}</p>
      <Button onClick={() => setCount(c => c + 1)}>
        Increment
      </Button>
      <Button variant="outline" onClick={() => setCount(0)}>
        Reset
      </Button>
    </div>
  )
}

// This component demonstrates React hooks and state management
// Click the button to increment the counter`

const sampleReactCode = `import { useState, useEffect } from "react"

function Component() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  )
}`

const sampleTypeScriptCode = `interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  if (!response.ok) {
    throw new Error('User not found')
  }
  return response.json()
}

// Usage
const user = await fetchUser(1)
console.log(user.name)`

function BasicDemo() {
  return (
    <CodeBlock
      code={sampleCode}
      language="tsx"
      showLineNumbers={true}
      minimap={false}
      wordWrap="on"
    />
  )
}

const basicCode = `import { CodeBlock } from "@/components/ui/code-block"

<CodeBlock
  code={sampleCode}
  language="tsx"
  showLineNumbers={true}
  minimap={false}
  wordWrap="on"
/>`

function ThemeDemo() {
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Theme (Dark)</p>
          <CodeBlock
            code={sampleReactCode}
            language="tsx"
            theme="vitesse-dark"
            minimap={false}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Theme (Light)</p>
          <CodeBlock
            code={sampleReactCode}
            language="tsx"
            theme="github-light"
            minimap={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
        <div className="space-y-2">
          <p className="text-sm font-medium">Theme Mode:</p>
          <div className="flex gap-2">
            <Button
              variant={themeMode === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setThemeMode("light")}
            >
              Light
            </Button>
            <Button
              variant={themeMode === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setThemeMode("dark")}
            >
              Dark
            </Button>
            <Button
              variant={themeMode === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setThemeMode("system")}
            >
              System
            </Button>
          </div>
        </div>
        <CodeBlock
          code={sampleCode}
          language="tsx"
          themeMode={themeMode}
          lightTheme="github-light"
          darkTheme="vitesse-dark"
          minimap={false}
        />
      </div>
    </div>
  )
}

const themeCode = `import { CodeBlock } from "@/components/ui/code-block"

// Fixed light theme
<CodeBlock
  code={code}
  language="tsx"
  theme="github-light"
/>

// Fixed dark theme
<CodeBlock
  code={code}
  language="tsx"
  theme="vitesse-dark"
/>

// System theme (respects user preference)
<CodeBlock
  code={code}
  language="tsx"
  themeMode="system"
  lightTheme="github-light"
  darkTheme="vitesse-dark"
/>`

function LanguagesDemo() {
  const [language, setLanguage] = useState<"tsx" | "typescript" | "javascript" | "python" | "rust">("tsx")

  const codeSamples = {
    tsx: sampleCode,
    typescript: sampleTypeScriptCode,
    javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
    python: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`,
    rust: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}`,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Language:</span>
        <Badge>{language}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["tsx", "typescript", "javascript", "python", "rust"] as const).map((lang) => (
          <Button
            key={lang}
            variant={language === lang ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage(lang)}
          >
            {lang}
          </Button>
        ))}
      </div>
      <CodeBlock
        code={codeSamples[language]}
        language={language}
        minimap={false}
      />
    </div>
  )
}

const languagesCode = `import { CodeBlock } from "@/components/ui/code-block"

// TypeScript/TSX
<CodeBlock code={tsxCode} language="tsx" />

// Python
<CodeBlock code={pythonCode} language="python" />

// Rust
<CodeBlock code={rustCode} language="rust" />

// JavaScript
<CodeBlock code={jsCode} language="javascript" />

// Other languages supported:
// typescript, javascript, jsx, tsx, python, rust, go, java, c, cpp, csharp,
// php, ruby, swift, kotlin, scala, groovy, clojure, elixir, erlang,
// haskell, lua, perl, sql, shell, powershell, docker, yaml, toml, json,
// xml, html, css, scss, less, markdown, r, julia, matlab`

function OptionsDemo() {
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState<CodeBlockProps["wordWrap"]>("on")
  const [minimap, setMinimap] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Line Numbers</p>
          <Button
            variant={showLineNumbers ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
          >
            {showLineNumbers ? "Shown" : "Hidden"}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Font Size: {fontSize}px</p>
          <div className="flex gap-2">
            {[12, 14, 16, 18, 20].map((size) => (
              <Button
                key={size}
                variant={fontSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => setFontSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Word Wrap</p>
          <div className="flex gap-2">
            {(["on", "off", "bounded"] as const).map((mode) => (
              <Button
                key={mode}
                variant={wordWrap === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setWordWrap(mode)}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Minimap</p>
          <Button
            variant={minimap ? "default" : "outline"}
            size="sm"
            onClick={() => setMinimap(!minimap)}
          >
            {minimap ? "Shown" : "Hidden"}
          </Button>
        </div>
      </div>

      <CodeBlock
        code={sampleCode}
        language="tsx"
        showLineNumbers={showLineNumbers}
        fontSize={fontSize}
        wordWrap={wordWrap}
        minimap={minimap}
      />
    </div>
  )
}

const optionsCode = `import { CodeBlock } from "@/components/ui/code-block"

// With line numbers
<CodeBlock
  code={code}
  language="tsx"
  showLineNumbers={true}
/>

// Custom font size
<CodeBlock
  code={code}
  language="tsx"
  fontSize={16}
/>

// Word wrap options
<CodeBlock
  code={code}
  language="tsx"
  wordWrap="on"     // Wrap lines
  wordWrap="off"    // No wrap
  wordWrap="bounded" // Wrap at viewport
/>

// Show/hide minimap
<CodeBlock
  code={code}
  language="tsx"
  minimap={true}
  minimap={false}
/>`

function HeightDemo() {
  const [height, setHeight] = useState<"auto" | number>("auto")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Height: {typeof height === "number" ? `${height}px` : "auto"}</p>
        <div className="flex gap-2">
          <Button
            variant={height === "auto" ? "default" : "outline"}
            size="sm"
            onClick={() => setHeight("auto")}
          >
            Auto
          </Button>
          <Button
            variant={height === 300 ? "default" : "outline"}
            size="sm"
            onClick={() => setHeight(300)}
          >
            300px
          </Button>
          <Button
            variant={height === 500 ? "default" : "outline"}
            size="sm"
            onClick={() => setHeight(500)}
          >
            500px
          </Button>
        </div>
      </div>
      <CodeBlock
        code={sampleCode}
        language="tsx"
        height={height}
        minimap={false}
      />
    </div>
  )
}

const heightCode = `import { CodeBlock } from "@/components/ui/code-block"

// Auto height (expands to fit content)
<CodeBlock
  code={code}
  height="auto"
/>

// Fixed height
<CodeBlock
  code={code}
  height={300}
/>

// Height with scroll
<CodeBlock
  code={code}
  height={500}
/>`

function VariantDemo() {
  const [variant, setVariant] = useState<"default" | "light">("default")

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={variant === "default" ? "default" : "outline"}
          onClick={() => setVariant("default")}
        >
          Default
        </Button>
        <Button
          variant={variant === "light" ? "default" : "outline"}
          onClick={() => setVariant("light")}
        >
          Light
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium mb-2">Default (Dark)</p>
          <CodeBlock
            code={sampleCode}
            language="tsx"
            variant="default"
            minimap={false}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Light</p>
          <CodeBlock
            code={sampleCode}
            language="tsx"
            variant="light"
            minimap={false}
          />
        </div>
      </div>
    </div>
  )
}

const variantCode = `import { CodeBlock } from "@/components/ui/code-block"

// Default (dark theme)
<CodeBlock
  code={code}
  language="tsx"
  variant="default"
/>

// Light theme
<CodeBlock
  code={code}
  language="tsx"
  variant="light"
/>`

export function CodeBlockPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Code Block"
        description="A feature-rich code display component with Monaco editor. Supports syntax highlighting, multiple themes, line numbers, word wrap, and more."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Syntax Highlighting",
            description: "Support for 100+ programming languages with Monaco's powerful tokenizer.",
          },
          {
            title: "Multiple Themes",
            description: "Beautiful light and dark themes including Vitesse, GitHub, Nord, Dracula, and more.",
          },
          {
            title: "Customizable",
            description: "Control font size, line numbers, word wrap, minimap, and height.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Usage"
                description="Simple code display with syntax highlighting."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "theme",
            label: "Theme",
            demo: (
              <DemoWrapper
                title="Theme Options"
                description="Fixed themes or system-aware theming with light/dark modes."
                code={themeCode}
              >
                <ThemeDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "languages",
            label: "Languages",
            demo: (
              <DemoWrapper
                title="Language Support"
                description="Support for 100+ programming languages. Click to change."
                code={languagesCode}
              >
                <LanguagesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "options",
            label: "Options",
            demo: (
              <DemoWrapper
                title="Display Options"
                description="Customize line numbers, font size, word wrap, and minimap."
                code={optionsCode}
              >
                <OptionsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "height",
            label: "Height",
            demo: (
              <DemoWrapper
                title="Height Control"
                description="Auto height or fixed height with scrolling."
                code={heightCode}
              >
                <HeightDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "variant",
            label: "Variant",
            demo: (
              <DemoWrapper
                title="Color Variant"
                description="Default dark theme or light theme variant."
                code={variantCode}
              >
                <VariantDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <APIReference
        sections={[
          {
            title: "CodeBlock Props",
            props: [
              { prop: "code", type: "string", default: "-", description: "The code content to display" },
              { prop: "language", type: "string", default: "tsx", description: "Programming language for syntax highlighting" },
              { prop: "variant", type: '"default" | "light"', default: "default", description: "Color variant" },
              { prop: "theme", type: "MonacoTheme", default: "vitesse-dark", description: "Fixed theme (ignores themeMode)" },
              { prop: "themeMode", type: '"light" | "dark" | "system"', default: "dark", description: "Theme mode preference" },
              { prop: "lightTheme", type: "MonacoTheme", default: "github-light", description: "Theme for light mode" },
              { prop: "darkTheme", type: "MonacoTheme", default: "vitesse-dark", description: "Theme for dark mode" },
              { prop: "showLineNumbers", type: "boolean", default: "true", description: "Show line numbers" },
              { prop: "fontSize", type: "number", default: "14", description: "Font size in pixels" },
              { prop: "fontFamily", type: "string", default: "Geist Mono, monospace", description: "Font family" },
              { prop: "wordWrap", type: '"on" | "off" | "bounded"', default: "on", description: "Word wrap behavior" },
              { prop: "minimap", type: "boolean", default: "false", description: "Show minimap" },
              { prop: "readOnly", type: "boolean", default: "true", description: "Read-only mode" },
              { prop: "editable", type: "boolean", default: "false", description: "Enable editing" },
              { prop: "height", type: "string | number", default: "auto", description: "Container height" },
              { prop: "className", type: "string", default: "-", description: "Additional CSS classes" },
            ],
          },
          {
            title: "Available Themes",
            props: [
              { prop: "vitesse-dark", type: "string", default: "-", description: "Dark theme with neon accents" },
              { prop: "vitesse-light", type: "string", default: "-", description: "Light theme with clean look" },
              { prop: "github-dark", type: "string", default: "-", description: "GitHub's dark theme" },
              { prop: "github-dark-default", type: "string", default: "-", description: "GitHub dark default" },
              { prop: "github-light", type: "string", default: "-", description: "GitHub's light theme" },
              { prop: "nord", type: "string", default: "-", description: "Arctic, north-bluish color palette" },
              { prop: "one-dark-pro", type: "string", default: "-", description: "Atom's iconic dark theme" },
              { prop: "dracula", type: "string", default: "-", description: "Dracula official theme" },
              { prop: "tokyo-night", type: "string", default: "-", description: "A clean, dark Tokyo Night theme" },
            ],
          },
          {
            title: "Supported Languages",
            props: [
              { prop: "JavaScript/TypeScript", type: "string", default: "-", description: "javascript, typescript, tsx, jsx" },
              { prop: "Python", type: "string", default: "-", description: "python" },
              { prop: "Rust", type: "string", default: "-", description: "rust" },
              { prop: "Go", type: "string", default: "-", description: "go" },
              { prop: "Java", type: "string", default: "-", description: "java" },
              { prop: "C/C++/C#", type: "string", default: "-", description: "c, cpp, csharp" },
              { prop: "PHP", type: "string", default: "-", description: "php" },
              { prop: "Ruby", type: "string", default: "-", description: "ruby" },
              { prop: "Swift/Kotlin", type: "string", default: "-", description: "swift, kotlin" },
              { prop: "SQL", type: "string", default: "-", description: "sql" },
              { prop: "Shell", type: "string", default: "-", description: "shell, powershell, bash" },
              { prop: "Config", type: "string", default: "-", description: "json, yaml, toml, xml, ini" },
              { prop: "Web", type: "string", default: "-", description: "html, css, scss, less, markdown" },
              { prop: "Data Science", type: "string", default: "-", description: "r, julia, matlab" },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
