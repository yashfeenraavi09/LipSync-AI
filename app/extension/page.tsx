"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Video, VideoOff, MousePointer, Search, Settings, Zap, ArrowUp, ArrowDown } from "lucide-react"

export default function ExtensionPopup() {
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [controlModeEnabled, setControlModeEnabled] = useState(false)
  const [lastPrediction, setLastPrediction] = useState("scroll down")
  const [confidence, setConfidence] = useState(85)
  const [isConnected, setIsConnected] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWebcamActive && controlModeEnabled) {
        const predictions = ["scroll up", "scroll down", "click", "back", "search"]
        const newPrediction = predictions[Math.floor(Math.random() * predictions.length)]
        const newConfidence = Math.floor(Math.random() * 40) + 60

        setLastPrediction(newPrediction)
        setConfidence(newConfidence)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isWebcamActive, controlModeEnabled])

  const getCommandIcon = (command: string) => {
    if (command.includes("scroll up")) return <ArrowUp className="h-3 w-3" />
    if (command.includes("scroll down")) return <ArrowDown className="h-3 w-3" />
    if (command.includes("click")) return <MousePointer className="h-3 w-3" />
    if (command.includes("search")) return <Search className="h-3 w-3" />
    return <MousePointer className="h-3 w-3" />
  }

  return (
    <div className="w-80 min-h-96 bg-background text-foreground p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm">LipSync AI</h1>
            <p className="text-xs text-muted-foreground">Chrome Extension</p>
          </div>
        </div>
        <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      {/* Webcam Control */}
      <Card className="p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isWebcamActive ? (
              <Video className="h-4 w-4 text-green-500" />
            ) : (
              <VideoOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Webcam</span>
          </div>
          <Switch checked={isWebcamActive} onCheckedChange={setIsWebcamActive} />
        </div>
        <p className="text-xs text-muted-foreground">
          {isWebcamActive ? "Camera is active and monitoring lip movements" : "Click to enable webcam access"}
        </p>
      </Card>

      {/* Control Mode */}
      <Card className="p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            <span className="text-sm font-medium">Control Mode</span>
          </div>
          <Switch checked={controlModeEnabled} onCheckedChange={setControlModeEnabled} disabled={!isWebcamActive} />
        </div>
        <p className="text-xs text-muted-foreground">
          {controlModeEnabled ? "Browser control is active" : "Enable to control browser with lip movements"}
        </p>
      </Card>

      {/* Last Prediction */}
      {isWebcamActive && controlModeEnabled && (
        <Card className="p-3 mb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Command</span>
              <Badge variant={confidence >= 80 ? "default" : "secondary"} className="text-xs">
                {confidence}%
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {getCommandIcon(lastPrediction)}
              <span className="text-sm font-medium capitalize">{lastPrediction}</span>
              {confidence >= 80 && (
                <Badge variant="outline" className="text-xs text-green-500 border-green-500 ml-auto">
                  Executed
                </Badge>
              )}
            </div>

            <Progress value={confidence} className="h-1" />
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-3 mb-4">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <ArrowUp className="h-3 w-3 mr-1" />
            Scroll Up
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <ArrowDown className="h-3 w-3 mr-1" />
            Scroll Down
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <MousePointer className="h-3 w-3 mr-1" />
            Click
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <Search className="h-3 w-3 mr-1" />
            Search
          </Button>
        </div>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-xs">
          <Settings className="h-3 w-3 mr-1" />
          Settings
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => window.open("/lip-reading-app", "_blank")}>
          Open Full App
        </Button>
      </div>

      {/* Status */}
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isWebcamActive && controlModeEnabled ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          {isWebcamActive && controlModeEnabled ? "Listening for commands" : "Ready to activate"}
        </div>
      </div>
    </div>
  )
}
