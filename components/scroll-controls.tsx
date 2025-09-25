"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Scroll,
  Activity,
  Search,
  ExternalLink,
} from "lucide-react"

interface ScrollControlsProps {
  isScrolling: boolean
  scrollSpeed: number
  onScrollSpeedChange: (speed: number) => void
  currentMode: "scroll" | "search"
  lastPrediction: string
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
}

const searchEngines = [
  {
    name: "Google",
    url: "https://www.google.com/search?q=",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Bing_Fluent_Logo.svg",
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
    icon: "https://duckduckgo.com/assets/logo_header.v108.png", // ✅ working
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  },
  {
    name: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Special:Search?search=",
    icon: "https://en.wikipedia.org/static/images/project-logos/enwiki.png", // ✅ reliable
  },
  {
    name: "Amazon",
    url: "https://www.amazon.com/s?k=",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
]

export function ScrollControls({
  isScrolling,
  scrollSpeed,
  onScrollSpeedChange,
  currentMode,
  lastPrediction,
  searchQuery = "",
  onSearchQueryChange,
}: ScrollControlsProps) {
  const [autoScrollActive, setAutoScrollActive] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [commandHistory, setCommandHistory] = useState<string[]>([])

  useEffect(() => {
    if (lastPrediction && currentMode === "scroll") {
      setCommandHistory((prev) => [lastPrediction, ...prev.slice(0, 9)]) // Keep last 10 commands
    }
  }, [lastPrediction, currentMode])

  const handleManualScroll = (direction: "up" | "down") => {
    const scrollAmount = direction === "down" ? scrollSpeed : -scrollSpeed
    window.scrollBy(0, scrollAmount)
  }

  const toggleAutoScroll = () => {
    setAutoScrollActive(!autoScrollActive)
  }

  const resetScrollPosition = () => {
    window.scrollTo(0, 0)
  }

  const handleSearchEngineClick = (engine: (typeof searchEngines)[0]) => {
    if (searchQuery.trim()) {
      const searchUrl = engine.url + encodeURIComponent(searchQuery)
      window.open(searchUrl, "_blank")
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoScrollActive) {
      interval = setInterval(() => {
        const scrollAmount = scrollDirection === "down" ? scrollSpeed / 10 : -scrollSpeed / 10
        window.scrollBy(0, scrollAmount)
      }, 50)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoScrollActive, scrollDirection, scrollSpeed])

  return (
    <div className="space-y-6">
      {currentMode === "scroll" ? (
        <>
          {/* 🔹 Scroll Controls Card */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Scroll className="w-5 h-5 text-primary" />
                Scroll Controls
              </h2>
              <Badge
                variant="outline"
                className={
                  currentMode === "scroll" ? "text-primary border-primary bg-primary/10" : "text-muted-foreground"
                }
              >
                {currentMode === "scroll" ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={() => handleManualScroll("up")}
                variant="outline"
                size="lg"
                className="h-16 flex-col gap-2"
                disabled={currentMode !== "scroll"}
              >
                <ArrowUp className="w-6 h-6" />
                <span>Scroll Up</span>
              </Button>
              <Button
                onClick={() => handleManualScroll("down")}
                variant="outline"
                size="lg"
                className="h-16 flex-col gap-2"
                disabled={currentMode !== "scroll"}
              >
                <ArrowDown className="w-6 h-6" />
                <span>Scroll Down</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Auto Scroll</span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setScrollDirection("up")}
                    variant={scrollDirection === "up" ? "default" : "outline"}
                    size="sm"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button onClick={toggleAutoScroll} variant={autoScrollActive ? "destructive" : "default"} size="sm">
                    {autoScrollActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => setScrollDirection("down")}
                    variant={scrollDirection === "down" ? "default" : "outline"}
                    size="sm"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {autoScrollActive && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-primary">Auto scrolling {scrollDirection}</span>
                  </div>
                  <Progress value={75} className="h-1" />
                </div>
              )}
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Scroll Speed</span>
                <Badge variant="secondary">{scrollSpeed}px</Badge>
              </div>
              <Slider
                value={[scrollSpeed]}
                onValueChange={(value) => onScrollSpeedChange(value[0])}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={resetScrollPosition} variant="outline" size="sm" className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Reset Position
              </Button>
              <Button onClick={() => onScrollSpeedChange(50)} variant="outline" size="sm" className="gap-2">
                <Zap className="w-4 h-4" />
                Default Speed
              </Button>
            </div>
          </Card>

          {/* 🔹 Voice Command History */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Voice Command History
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {commandHistory.length > 0 ? (
                commandHistory.map((command, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <span className="font-mono text-foreground">{command}</span>
                    <Badge variant="outline" className="text-xs">
                      {index === 0 ? "Latest" : `${index + 1}`}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No commands yet</p>
                  <p className="text-sm">Start lip reading to see command history</p>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          {/* 🔹 Search Mode */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Search Mode
              </h2>
              <Badge variant="outline" className="text-primary border-primary bg-primary/10">
                Active
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search Query (from lip reading)
                </label>
                <Input
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange?.(e.target.value)}
                  placeholder="Speak your search query..."
                  className="text-lg font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Words from lip reading will appear here automatically
                </p>
              </div>
            </div>
          </Card>

          {/* 🔹 Search Engines */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-primary" />
              Popular Search Engines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchEngines.map((engine) => (
                <Button
                  key={engine.name}
                  onClick={() => handleSearchEngineClick(engine)}
                  variant="outline"
                  className="h-16 flex-col gap-2 p-4"
                  disabled={!searchQuery.trim()}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={engine.icon}
                      alt={`${engine.name} logo`}
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span className="font-medium">{engine.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {searchQuery.trim()
                      ? `Search "${searchQuery.slice(0, 20)}${searchQuery.length > 20 ? "..." : ""}"`
                      : "Enter query to search"}
                  </span>
                </Button>
              ))}
            </div>

            {searchQuery.trim() && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary">
                  Ready to search for: <span className="font-mono font-semibold">"{searchQuery}"</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click any search engine above to open the search in a new tab
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {isScrolling && (
        <Card className="p-4 bg-chart-3/10 border-chart-3/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
            <span className="text-chart-3 font-medium">Scrolling Active</span>
            <Badge variant="outline" className="text-chart-3 border-chart-3 ml-auto">
              {scrollSpeed}px/action
            </Badge>
          </div>
        </Card>
      )}
    </div>
  )
}
