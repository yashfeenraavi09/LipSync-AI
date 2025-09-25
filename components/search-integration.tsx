"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Globe, Youtube, MapPin, ShoppingCart, Zap } from "lucide-react"

interface SearchIntegrationProps {
  prediction: string
  mode: "search" | "scroll"
}

export function SearchIntegration({ prediction, mode }: SearchIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [autoSearch, setAutoSearch] = useState(false)
  const [searchEngine, setSearchEngine] = useState("google")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Auto-fill search query when in search mode
  useEffect(() => {
    if (mode === "search" && prediction && prediction.trim()) {
      setSearchQuery(prediction.trim())
    }
  }, [prediction, mode])

  const searchEngines = [
    { value: "google", label: "Google", icon: Globe, url: "https://www.google.com/search?q=" },
    { value: "youtube", label: "YouTube", icon: Youtube, url: "https://www.youtube.com/results?search_query=" },
    { value: "maps", label: "Google Maps", icon: MapPin, url: "https://www.google.com/maps/search/" },
    {
      value: "shopping",
      label: "Google Shopping",
      icon: ShoppingCart,
      url: "https://www.google.com/search?tbm=shop&q=",
    },
  ]

  const currentEngine = searchEngines.find((engine) => engine.value === searchEngine)

  const executeSearch = () => {
    if (!searchQuery.trim()) return

    const searchUrl = currentEngine?.url + encodeURIComponent(searchQuery)
    window.open(searchUrl, "_blank")

    // Add to history
    setSearchHistory((prev) => {
      const newHistory = [searchQuery, ...prev.filter((q) => q !== searchQuery)]
      return newHistory.slice(0, 5) // Keep last 5
    })

    console.log(`[v0] Search executed: ${searchQuery} on ${currentEngine?.label}`)
  }

  const quickSearches = ["weather today", "news headlines", "youtube music", "gmail inbox", "google maps"]

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search query will appear here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && executeSearch()}
          />
          <Button onClick={executeSearch} disabled={!searchQuery.trim()}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Search Engine Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Search with:</span>
          <Select value={searchEngine} onValueChange={setSearchEngine}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchEngines.map((engine) => (
                <SelectItem key={engine.value} value={engine.value}>
                  <div className="flex items-center gap-2">
                    <engine.icon className="h-4 w-4" />
                    {engine.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Auto Search Setting */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">Auto Search</label>
            <p className="text-xs text-muted-foreground">Automatically search when confidence {">"} 80%</p>
          </div>
          <Switch checked={autoSearch} onCheckedChange={setAutoSearch} />
        </div>
      </Card>

      {/* Quick Searches */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Quick Searches</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickSearches.map((query) => (
            <Button
              key={query}
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery(query)}
              className="justify-start text-left"
            >
              <Zap className="h-3 w-3 mr-2" />
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Recent Searches</h3>
          <div className="space-y-2">
            {searchHistory.map((query, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1">{query}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSearchQuery(query)}>
                      Use
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const searchUrl = currentEngine?.url + encodeURIComponent(query)
                        window.open(searchUrl, "_blank")
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      {mode === "search" && (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            <Search className="h-3 w-3 mr-1" />
            Search mode active - Predictions will auto-fill
          </Badge>
        </div>
      )}
    </div>
  )
}
