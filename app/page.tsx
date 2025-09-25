"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WebcamCapture } from "@/components/webcam-capture"
import { ScrollControls } from "@/components/scroll-controls"
import { Settings } from "@/components/settings"
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity, Camera, Scroll, SettingsIcon, Mic, MicOff, Zap, Search } from "lucide-react"

export default function LipReadingApp() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentMode, setCurrentMode] = useState<"scroll" | "search">("scroll")
  const [lastPrediction, setLastPrediction] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [activeTab, setActiveTab] = useState("main")
  const [scrollSpeed, setScrollSpeed] = useState(50)
  const [isScrolling, setIsScrolling] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isRecording) {
      const predictions =
        currentMode === "scroll"
          ? ["scroll down", "scroll up", "stop", "faster", "slower"]
          : ["search google", "find cats", "weather today", "news update", "youtube videos"]

      const interval = setInterval(() => {
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]
        setLastPrediction(randomPrediction)
        setConfidence(Math.random() * 40 + 60) // 60-100% confidence

        if (currentMode === "search") {
          setSearchQuery(randomPrediction)
        }
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isRecording, currentMode])

  const handleScrollCommand = (command: string) => {
    if (currentMode === "scroll") {
      switch (command.toLowerCase()) {
        case "scroll down":
          window.scrollBy(0, scrollSpeed)
          setIsScrolling(true)
          setTimeout(() => setIsScrolling(false), 500)
          break
        case "scroll up":
          window.scrollBy(0, -scrollSpeed)
          setIsScrolling(true)
          setTimeout(() => setIsScrolling(false), 500)
          break
        case "stop":
          setIsScrolling(false)
          break
        case "faster":
          setScrollSpeed((prev) => Math.min(prev + 20, 200))
          break
        case "slower":
          setScrollSpeed((prev) => Math.max(prev - 20, 10))
          break
      }
    }
  }

  useEffect(() => {
    if (lastPrediction && currentMode === "scroll") {
      handleScrollCommand(lastPrediction)
    }
  }, [lastPrediction, currentMode])

  const triggerSearch = () => {
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-chart-2 rounded-lg flex items-center justify-center shadow-lg">
                <Mic className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">LipSync AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Hands-free browsing with lip reading
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Badge variant={isRecording ? "destructive" : "secondary"} className="gap-1 hidden sm:flex">
                {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                {isRecording ? "Recording" : "Stopped"}
              </Badge>
              <Badge variant="outline" className="text-primary border-primary hidden md:flex">
                {currentMode === "scroll" ? "Scroll Mode" : "Search Mode"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "main", icon: Camera, label: "Lip Reading", shortLabel: "Main" },
            { id: "scroll", icon: Scroll, label: "Scroll Controls", shortLabel: "Scroll" },
            { id: "activity", icon: Activity, label: "Activity", shortLabel: "Activity" },
            { id: "settings", icon: SettingsIcon, label: "Settings", shortLabel: "Settings" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2 whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </Button>
          ))}
        </div>

        <div>
          {activeTab === "main" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="p-4 sm:p-6 bg-card border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Live Lip Reading
                </h2>
                <WebcamCapture
                  isRecording={isRecording}
                  onRecordingChange={setIsRecording}
                  onPredictionChange={setLastPrediction}
                  onConfidenceChange={setConfidence}
                />

                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Last Prediction</span>
                    <Badge variant="outline" className="text-chart-3 border-chart-3">
                      {confidence.toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className="text-lg font-mono text-foreground break-words">
                    {lastPrediction || "Start recording to see predictions..."}
                  </p>
                </div>
              </Card>

              <Card className="p-4 sm:p-6 bg-card border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  Control Mode
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant={currentMode === "scroll" ? "default" : "outline"}
                      onClick={() => setCurrentMode("scroll")}
                      className="h-20 flex-col gap-2"
                    >
                      <Scroll className="w-6 h-6" />
                      <span>Scroll Mode</span>
                    </Button>
                    <Button
                      variant={currentMode === "search" ? "default" : "outline"}
                      onClick={() => setCurrentMode("search")}
                      className="h-20 flex-col gap-2"
                    >
                      <Search className="w-6 h-6" />
                      <span>Search Mode</span>
                    </Button>
                  </div>

                  {currentMode === "scroll" && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Scroll Mode Active
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Control webpage scrolling with your lips. Say commands like:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {["scroll down", "scroll up", "stop", "faster"].map((cmd, i) => (
                          <Badge key={i} variant="outline">
                            "{cmd}"
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Scroll Speed:</span>
                        <Badge variant="secondary">{scrollSpeed}px</Badge>
                      </div>
                    </div>
                  )}

                  {currentMode === "search" && (
                    <div className="p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                      <h3 className="font-semibold text-chart-2 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search Mode Active
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Speak your search queries and they'll appear in the search bar. Press enter or click search to
                        run it.
                      </p>

                      {/* Search Bar */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") triggerSearch()
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Waiting for lip input..."
                        />
                        <Button onClick={triggerSearch}>Search</Button>
                      </div>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {["search google", "find cats", "weather today", "news update"].map((cmd, i) => (
                          <Badge key={i} variant="outline">
                            "{cmd}"
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "scroll" && (
            <div>
              <ScrollControls
                isScrolling={isScrolling}
                scrollSpeed={scrollSpeed}
                onScrollSpeedChange={setScrollSpeed}
                currentMode={currentMode}
                lastPrediction={lastPrediction}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
            </div>
          )}

          {activeTab === "activity" && (
            <Card className="p-4 sm:p-6 bg-card border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {["scroll down", "scroll up", "stop", "faster", "scroll down"].map((cmd, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <span className="font-mono text-foreground">{cmd}</span>
                    <Badge variant="outline" className="text-chart-3 border-chart-3">
                      {Math.floor(Math.random() * 20 + 80)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "settings" && (
            <div>
              <Settings
                currentMode={currentMode}
                onModeChange={setCurrentMode}
                scrollSpeed={scrollSpeed}
                onScrollSpeedChange={setScrollSpeed}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
