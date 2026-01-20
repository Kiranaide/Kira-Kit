"use client"

import * as React from "react"
import { IconClock, IconX } from "@tabler/icons-react"
import { Command } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface SpotlightSearchProps extends React.ComponentPropsWithoutRef<typeof Command> {
  recentSearches?: string[]
  suggestions?: string[]
  onRecentSearchClick?: (search: string) => void
  onSuggestionClick?: (suggestion: string) => void
  onSearch?: (value: string) => void
}

interface SpotlightRecentProps {
  items: string[]
  onItemClick?: (item: string) => void
}

interface SpotlightSuggestionsProps {
  items: string[]
  onItemClick?: (item: string) => void
}

interface SpotlightResultsProps {
  results: Array<{ id: string; title: string; description?: string }>
  onItemClick?: (item: { id: string; title: string; description?: string }) => void
}

const SpotlightRecent = React.forwardRef<HTMLDivElement, SpotlightRecentProps>(
  ({ items, onItemClick }, ref) => {
    if (items.length === 0) return null

    return (
      <div ref={ref} className="px-2 py-4">
        <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">Recent searches</div>
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <IconClock className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{item}</span>
            <button
              type="button"
              className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted"
              aria-label={`Remove ${item} from recent searches`}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <IconX className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    )
  }
)
SpotlightRecent.displayName = "SpotlightRecent"

const SpotlightSuggestions = React.forwardRef<HTMLDivElement, SpotlightSuggestionsProps>(
  ({ items, onItemClick }, ref) => {
    if (items.length === 0) return null

    return (
      <div ref={ref} className="px-2 py-2">
        <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">Suggestions</div>
        {items.map((item) => (
          <div
            key={item}
            className="rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
    )
  }
)
SpotlightSuggestions.displayName = "SpotlightSuggestions"

const SpotlightResults = React.forwardRef<HTMLDivElement, SpotlightResultsProps>(
  ({ results, onItemClick }, ref) => {
    if (results.length === 0) return null

    return (
      <div ref={ref} className="px-2 py-2">
        <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">{`Results (${results.length})`}</div>
        {results.map((result) => (
          <div
            key={result.id}
            className="rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            onClick={() => onItemClick?.(result)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{result.title}</span>
              {result.description && (
                <span className="text-xs text-muted-foreground">{result.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
)
SpotlightResults.displayName = "SpotlightResults"

const SpotlightSearch = React.forwardRef<HTMLDivElement, SpotlightSearchProps>(
  ({ className, recentSearches = [], suggestions = [], onRecentSearchClick, onSuggestionClick, onSearch, ...props }, ref) => {
    const [search, setSearch] = React.useState("")
    const [results, setResults] = React.useState<Array<{ id: string; title: string; description?: string }>>([])

    const handleSearch = (value: string) => {
      setSearch(value)
      onSearch?.(value)

      if (value.length > 0) {
        const filteredResults = [
          ...recentSearches.filter((s) => s.toLowerCase().includes(value.toLowerCase())).map((title) => ({ id: title, title })),
          ...suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())).map((title) => ({ id: title, title })),
        ]
        setResults(filteredResults)
      } else {
        setResults([])
      }
    }

  return (
    <Command ref={ref} className={cn("max-h-[600px]", className)} {...props}>
      <div className="flex items-center border-b px-3">
        <IconClock className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {search.length === 0 && recentSearches.length > 0 && (
          <SpotlightRecent items={recentSearches} onItemClick={onRecentSearchClick} />
        )}
        {search.length === 0 && suggestions.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <SpotlightSuggestions items={suggestions} onItemClick={onSuggestionClick} />
          </>
        )}
        {search.length > 0 && (
          <>
            {results.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
            )}
            {results.length > 0 && (
              <SpotlightResults
                results={results}
                onItemClick={(item) => {
                  setSearch(item.title)
                  onSearch?.(item.title)
                }}
              />
            )}
          </>
        )}
      </div>
    </Command>
  )
  }
)
SpotlightSearch.displayName = "SpotlightSearch"

export {
  SpotlightSearch,
  SpotlightRecent,
  SpotlightSuggestions,
  SpotlightResults,
}

export type {
  SpotlightSearchProps,
  SpotlightRecentProps,
  SpotlightSuggestionsProps,
  SpotlightResultsProps,
}
