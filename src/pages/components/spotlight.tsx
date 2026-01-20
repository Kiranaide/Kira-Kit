import * as React from "react"
import { SpotlightSearch, SpotlightRecent, SpotlightSuggestions, SpotlightResults } from "@/components/ui/spotlight"
import { IconSearch, IconCommand, IconFileText, IconSettings, IconUser, IconLayoutDashboard, IconClock } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

export default function SpotlightPage() {
  const [recentSearches, setRecentSearches] = React.useState<string[]>(["user profile", "settings", "dashboard"])
  const [suggestions] = React.useState<string[]>(["Create new user", "View analytics", "System settings", "Logout"])

  const handleRecentClick = (search: string) => {
    console.log("Recent search clicked:", search)
  }

  const handleSuggestionClick = (suggestion: string) => {
    console.log("Suggestion clicked:", suggestion)
  }

  const handleSearch = (value: string) => {
    console.log("Search:", value)
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev].slice(0, 5))
    }
  }

  const mockResults = [
    { id: 1, title: "User Settings", description: "Manage your account preferences", icon: <IconSettings className="h-4 w-4" />, category: "Settings" },
    { id: 2, title: "Dashboard", description: "View your analytics and metrics", icon: <IconLayoutDashboard className="h-4 w-4" />, category: "Pages" },
    { id: 3, title: "Documentation", description: "Read the latest docs", icon: <IconFileText className="h-4 w-4" />, category: "Resources" },
    { id: 4, title: "Profile", description: "View and edit your profile", icon: <IconUser className="h-4 w-4" />, category: "Account" },
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Spotlight Search</h1>
        <p className="text-muted-foreground">Enhanced search with recent searches and suggestions</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Spotlight</h2>
        <p className="text-muted-foreground">Click the search field or press Cmd+K to activate</p>

        <div className="max-w-2xl mx-auto">
          <SpotlightSearch onSearch={handleSearch}>
            <SpotlightRecent recentSearches={recentSearches} onRecentSearchClick={handleRecentClick} />
            <SpotlightSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
            <SpotlightResults>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Quick Actions</div>
              {mockResults.slice(0, 2).map((result) => (
                <div
                  key={result.id}
                  className="px-2 py-2 flex items-center gap-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                  onClick={() => handleSearch(result.title)}
                >
                  <div className="flex-shrink-0">{result.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {result.category}
                  </Badge>
                </div>
              ))}
            </SpotlightResults>
          </SpotlightSearch>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Recent Searches</h2>
        <p className="text-muted-foreground">Shows your recent search history</p>

        <div className="max-w-2xl mx-auto">
          <SpotlightSearch onSearch={handleSearch}>
            <SpotlightRecent recentSearches={recentSearches} onRecentSearchClick={handleRecentClick} />
            <SpotlightResults>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Recent</div>
              {recentSearches.map((search, i) => (
                <div
                  key={i}
                  className="px-2 py-2 flex items-center gap-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                  onClick={() => handleRecentClick(search)}
                >
                  <IconClock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">{search}</div>
                </div>
              ))}
            </SpotlightResults>
          </SpotlightSearch>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Suggestions</h2>
        <p className="text-muted-foreground">Auto-suggestions as you type</p>

        <div className="max-w-2xl mx-auto">
          <SpotlightSearch onSearch={handleSearch}>
            <SpotlightSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
            <SpotlightResults>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Suggestions</div>
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="px-2 py-2 flex items-center gap-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <IconSearch className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">{suggestion}</div>
                </div>
              ))}
            </SpotlightResults>
          </SpotlightSearch>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Keyboard Shortcut</h2>
        <p className="text-muted-foreground">Trigger with Cmd+K (Mac) or Ctrl+K (Windows)</p>

        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <IconCommand className="h-8 w-8 text-muted-foreground" />
            <div className="text-center flex-1">
              <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">⌘</kbd>
              <span className="mx-2">+</span>
              <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">K</kbd>
            </div>
            <div className="text-sm text-muted-foreground">to open</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Categorized Results</h2>
        <p className="text-muted-foreground">Grouped results by type</p>

        <div className="max-w-2xl mx-auto">
          <SpotlightSearch onSearch={handleSearch}>
            <SpotlightResults>
              {["Pages", "Settings", "Resources"].map((category) => (
                <React.Fragment key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>
                  {mockResults
                    .filter((r) => r.category === category)
                    .map((result) => (
                      <div
                        key={result.id}
                        className="px-2 py-2 flex items-center gap-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                        onClick={() => handleSearch(result.title)}
                      >
                        <div className="flex-shrink-0">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{result.title}</div>
                          <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                        </div>
                      </div>
                    ))}
                </React.Fragment>
              ))}
            </SpotlightResults>
          </SpotlightSearch>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Search with Results</h2>
        <p className="text-muted-foreground">Type to search through results</p>

        <div className="max-w-2xl mx-auto">
          <SpotlightSearch onSearch={handleSearch}>
            <SpotlightResults>
              {mockResults.map((result) => (
                <div
                  key={result.id}
                  className="px-2 py-2 flex items-center gap-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
                  onClick={() => handleSearch(result.title)}
                >
                  <div className="flex-shrink-0">{result.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {result.category}
                  </Badge>
                </div>
              ))}
            </SpotlightResults>
          </SpotlightSearch>
        </div>
      </section>
    </div>
  )
}
