"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WebcamCapture } from "@/components/webcam-capture"
import { ScrollControls } from "@/components/scroll-controls"
import { Settings } from "@/components/settings"
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity, Camera, Scroll, SettingsIcon, Mic, MicOff, Zap, Search, ExternalLink } from "lucide-react"
import Image from "next/image"


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
    icon: "https://duckduckgo.com/assets/logo_header.v108.png",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  },
  {
    name: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Special:Search?search=",
    icon: "https://en.wikipedia.org/static/images/project-logos/enwiki.png",
  },
  {
    name: "Amazon",
    url: "https://www.amazon.com/s?k=",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
]

export default function LipReadingApp() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentMode, setCurrentMode] = useState<"scroll" | "search">("scroll")
  const [lastPrediction, setLastPrediction] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [activeTab, setActiveTab] = useState("main")
  const [scrollSpeed, setScrollSpeed] = useState(50)
  const [isScrolling, setIsScrolling] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]) // default Google


  const [activityLog, setActivityLog] = useState<
  { type: "scroll" | "search"; text: string; confidence?: number; timestamp: string }[]
>([])


 useEffect(() => {
  if (isRecording) {
    const predictions =
      currentMode === "scroll"
        ? [
            "open whatsapp",
            "open visual studio code",
            "open vscode",
            "open linkedIn",
            "return to my website",

          ]
        : ["search google", "find cats", "weather today", "news update", "youtube videos"]

    const interval = setInterval(() => {
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]
      setLastPrediction(randomPrediction)
      setConfidence(Math.random() * 40 + 60)

      if (currentMode === "search") {
        setSearchQuery(randomPrediction)
      }
    }, 2000)

    return () => clearInterval(interval)
  }
}, [isRecording, currentMode])


 const handleScrollCommand = (command: string) => {
  const cmd = command.toLowerCase()
  const timestamp = new Date().toLocaleTimeString()

  // Log every command in activity
  setActivityLog((prev) => [
    { type: "scroll", text: command, confidence: confidence, timestamp },
    ...prev,
  ])

  // 🔹 Scroll commands
  if (cmd === "scroll down") {
    window.scrollBy(0, scrollSpeed)
    setIsScrolling(true)
    setTimeout(() => setIsScrolling(false), 500)
  } else if (cmd === "scroll up") {
    window.scrollBy(0, -scrollSpeed)
    setIsScrolling(true)
    setTimeout(() => setIsScrolling(false), 500)
  } else if (cmd === "stop") {
    setIsScrolling(false)
  } else if (cmd === "faster") {
    setScrollSpeed((prev) => Math.min(prev + 20, 200))
  } else if (cmd === "slower") {
    setScrollSpeed((prev) => Math.max(prev - 20, 10))
  }

  // 🔹 Web shortcuts
  else if (cmd === "open whatsapp") {
    window.open("https://web.whatsapp.com", "_blank")
  } else if (cmd === "open visual studio code" || cmd === "open vscode") {
    window.open("https://vscode.dev", "_blank")
  } else if (cmd === "open linkedin") {
    window.open("https://www.linkedin.com", "_blank") }
  else if (cmd === "return to my website") {
    window.location.href = "/" // or your website URL
  }
}


  useEffect(() => {
    if (lastPrediction && currentMode === "scroll") {
      handleScrollCommand(lastPrediction)
    }
  }, [lastPrediction, currentMode])

 const triggerSearch = () => {
  if (searchQuery.trim()) {
    const timestamp = new Date().toLocaleTimeString()
    setActivityLog((prev) => [
      { type: "search", text: searchQuery, timestamp },
      ...prev,
    ])
    window.open(selectedEngine.url + encodeURIComponent(searchQuery), "_blank")
  }
}

  return (
    <div className="min-h-screen bg-background">
      {/* 🔹 Navbar */}
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

      {/* 🔹 Tabs */}
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
          {/* 🔹 Main Tab */}
          {activeTab === "main" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left: Webcam */}
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

              {/* Right: Control Mode */}
              <Card className="p-4 sm:p-6 bg-card border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  Control Mode
                </h2>

                <div className="space-y-4">
                  {/* Mode Buttons */}
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

                  {/* Scroll Mode UI */}
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
                        {["scroll down", "scroll up", "stop", "open linkedIn"].map((cmd, i) => (
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

                  {/* Search Mode UI */}
                  {currentMode === "search" && (
                    <div className="p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                      <h3 className="font-semibold text-chart-2 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search Mode Active
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Speak your search queries and they'll appear in the search bar. Choose an engine & run it.
                      </p>

                      {/* Search Bar + Engine Dropdown */}
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
                        <select
                          value={selectedEngine.name}
                          onChange={(e) => {
                            const engine = searchEngines.find((eng) => eng.name === e.target.value)
                            if (engine) setSelectedEngine(engine)
                          }}
                          className="px-2 py-2 border rounded-lg bg-background text-foreground text-sm"
                        >
                          {searchEngines.map((engine) => (
                            <option key={engine.name} value={engine.name}>
                              {engine.name}
                            </option>
                          ))}
                        </select>
                        <Button onClick={triggerSearch}>Search</Button>
                      </div>

                      {/* Preview */}
                      {searchQuery.trim() && (
                        <div className="mt-3 p-2 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                          <p>
                            Searching <span className="font-mono">"{searchQuery}"</span> on{" "}
                            <span className="font-semibold">{selectedEngine.name}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* 🔹 Scroll Controls Tab */}
          {activeTab === "scroll" && (
            <ScrollControls
              isScrolling={isScrolling}
              scrollSpeed={scrollSpeed}
              onScrollSpeedChange={setScrollSpeed}
              currentMode={currentMode}
              lastPrediction={lastPrediction}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
          )}

          {/* 🔹 Activity Tab */}
{activeTab === "activity" && (
  <Card className="p-4 sm:p-6 bg-card border-border">
    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
      <Activity className="w-5 h-5 text-primary" />
      Recent Activity
    </h2>
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
      {activityLog.length === 0 ? (
        <p className="text-muted-foreground text-sm">No activity yet...</p>
      ) : (
        activityLog.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
          >
            <div className="flex items-center gap-2">
              {item.type === "scroll" ? (
                <Scroll className="w-4 h-4 text-chart-3" />
              ) : (
                <Search className="w-4 h-4 text-chart-2" />
              )}
              <span className="font-mono text-foreground">{item.text}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.confidence && (
                <Badge variant="outline" className="text-chart-3 border-chart-3">
                  {item.confidence.toFixed(0)}%
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
)}
          {/* 🔹 Settings Tab */}
          {activeTab === "settings" && (
            <Settings
              currentMode={currentMode}
              onModeChange={setCurrentMode}
              scrollSpeed={scrollSpeed}
              onScrollSpeedChange={setScrollSpeed}
            />
          )}
        </div>
      </div>
    </div>
  )
}
