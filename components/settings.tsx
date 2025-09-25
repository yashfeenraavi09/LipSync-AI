"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SettingsIcon, Mic, Shield, Info, Zap, Volume2 } from "lucide-react"

interface SettingsProps {
  currentMode: "scroll" | "search"
  onModeChange: (mode: "scroll" | "search") => void
  scrollSpeed: number
  onScrollSpeedChange: (speed: number) => void
}

export function Settings({ currentMode, onModeChange, scrollSpeed, onScrollSpeedChange }: SettingsProps) {
  const [sensitivity, setSensitivity] = useState(75)
  const [confidenceThreshold, setConfidenceThreshold] = useState(60)
  const [audioFeedback, setAudioFeedback] = useState(true)
  const [visualFeedback, setVisualFeedback] = useState(true)
  const [autoStart, setAutoStart] = useState(false)
  const [language, setLanguage] = useState("en")

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="p-6 bg-card border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-in slide-in-from-top-5 duration-500">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Control Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={currentMode === "scroll" ? "default" : "outline"}
                onClick={() => onModeChange("scroll")}
                className="justify-start gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <Zap className="w-4 h-4" />
                Scroll Mode
              </Button>
              <Button
                variant={currentMode === "search" ? "default" : "outline"}
                onClick={() => onModeChange("search")}
                className="justify-start gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <Info className="w-4 h-4" />
                Search Mode
              </Button>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-background border-border transition-all duration-300 hover:bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Start */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Auto Start Recording</label>
              <p className="text-xs text-muted-foreground">Automatically start recording when app opens</p>
            </div>
            <Switch checked={autoStart} onCheckedChange={setAutoStart} className="transition-all duration-300" />
          </div>
        </div>
      </Card>

      {/* Lip Reading Settings */}
      <Card className="p-6 bg-card border-border transition-all duration-300 hover:shadow-lg animate-in slide-in-from-left-5 duration-700">
        <div className="flex items-center gap-3 mb-4">
          <Mic className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Lip Reading Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Sensitivity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Detection Sensitivity</label>
              <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                {sensitivity}%
              </Badge>
            </div>
            <Slider
              value={[sensitivity]}
              onValueChange={(value) => setSensitivity(value[0])}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Confidence Threshold</label>
              <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                {confidenceThreshold}%
              </Badge>
            </div>
            <Slider
              value={[confidenceThreshold]}
              onValueChange={(value) => setConfidenceThreshold(value[0])}
              max={95}
              min={30}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Commands below this confidence level will be ignored</p>
          </div>
        </div>
      </Card>

      {/* Scroll Settings */}
      {currentMode === "scroll" && (
        <Card className="p-6 bg-card border-border transition-all duration-300 hover:shadow-lg animate-in slide-in-from-right-5 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Scroll Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Scroll Speed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Scroll Speed</label>
                <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                  {scrollSpeed}px
                </Badge>
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

            {/* Quick Speed Presets */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Quick Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { speed: 25, label: "Slow (25px)" },
                  { speed: 50, label: "Normal (50px)" },
                  { speed: 100, label: "Fast (100px)" },
                ].map((preset) => (
                  <Button
                    key={preset.speed}
                    variant="outline"
                    size="sm"
                    onClick={() => onScrollSpeedChange(preset.speed)}
                    className="text-xs transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback Settings */}
      <Card className="p-6 bg-card border-border transition-all duration-300 hover:shadow-lg animate-in slide-in-from-bottom-5 duration-700">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Feedback Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Audio Feedback</label>
              <p className="text-xs text-muted-foreground">Play sounds when commands are recognized</p>
            </div>
            <Switch
              checked={audioFeedback}
              onCheckedChange={setAudioFeedback}
              className="transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Visual Feedback</label>
              <p className="text-xs text-muted-foreground">Show visual indicators for commands</p>
            </div>
            <Switch
              checked={visualFeedback}
              onCheckedChange={setVisualFeedback}
              className="transition-all duration-300"
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 bg-card border-border transition-all duration-300 hover:shadow-lg animate-in slide-in-from-bottom-5 duration-900">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg transition-all duration-300 hover:bg-primary/15">
            <h3 className="text-sm font-semibold text-primary mb-2">Data Processing</h3>
            <p className="text-xs text-muted-foreground mb-3">
              All lip reading processing happens locally on your device. No video data is sent to external servers.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse"></div>
              <span className="text-xs text-chart-3">Local Processing Active</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Permissions</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              {[
                { name: "Camera Access", status: "Granted" },
                { name: "Storage Access", status: "Granted" },
              ].map((permission) => (
                <div key={permission.name} className="flex items-center justify-between">
                  <span>{permission.name}</span>
                  <Badge
                    variant="outline"
                    className="text-chart-3 border-chart-3 transition-all duration-300 hover:bg-chart-3/10"
                  >
                    {permission.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
