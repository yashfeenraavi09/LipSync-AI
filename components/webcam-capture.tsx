"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Square, Camera, AlertCircle, CheckCircle } from "lucide-react"

interface WebcamCaptureProps {
  isRecording: boolean
  onRecordingChange: (recording: boolean) => void
  onPredictionChange: (prediction: string) => void
  onConfidenceChange: (confidence: number) => void
}

export function WebcamCapture({
  isRecording,
  onRecordingChange,
  onPredictionChange,
  onConfidenceChange,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      setRecordingProgress(0)
      interval = setInterval(() => {
        setRecordingProgress((prev) => {
          if (prev >= 100) {
            onRecordingChange(false)
            return 0
          }
          return prev + 5 // 2 second recording (100/5 = 20 intervals * 100ms)
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, onRecordingChange])

  useEffect(() => {
    if (isRecording) {
      const predictions = ["scroll down", "scroll up", "stop", "faster", "slower", "search google"]
      const interval = setInterval(() => {
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]
        const confidence = Math.random() * 40 + 60 // 60-100% confidence
        onPredictionChange(randomPrediction)
        onConfidenceChange(confidence)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isRecording, onPredictionChange, onConfidenceChange])

  const startWebcam = async () => {
    try {
      setError("")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      })

      setStream(mediaStream)
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      setError("Unable to access webcam. Please check permissions.")
      setHasPermission(false)
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setHasPermission(null)
    onRecordingChange(false)
  }

  const toggleRecording = () => {
    if (!stream) {
      startWebcam()
      return
    }
    onRecordingChange(!isRecording)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transition-all duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 animate-in fade-in-50 duration-500">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground transition-all duration-300 hover:text-primary hover:scale-110" />
              <p className="text-sm text-muted-foreground">
                {hasPermission === false ? "Camera access denied" : "Click to start webcam"}
              </p>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-xs animate-in slide-in-from-bottom-3 duration-300">
                  <AlertCircle className="h-4 w-4 animate-pulse" />
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute inset-0 bg-destructive/10 border-2 border-destructive rounded-lg animate-in fade-in-0 duration-300">
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="animate-pulse shadow-lg">
                REC
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent animate-pulse"></div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          {hasPermission === true && (
            <Badge
              variant="secondary"
              className="text-xs transition-all duration-300 hover:scale-105 animate-in slide-in-from-left-3 duration-500"
            >
              <CheckCircle className="h-3 w-3 mr-1 text-chart-3" />
              Camera Ready
            </Badge>
          )}
          {stream && (
            <Badge
              variant="outline"
              className="text-xs transition-all duration-300 hover:scale-105 animate-in slide-in-from-left-3 duration-700"
            >
              640x480
            </Badge>
          )}
        </div>
      </div>

      {isRecording && (
        <div className="space-y-2 animate-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Recording Progress</span>
            <span className="font-mono text-foreground transition-all duration-300">
              {Math.round(recordingProgress)}%
            </span>
          </div>
          <Progress value={recordingProgress} className="h-2 transition-all duration-300" />
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          disabled={hasPermission === false}
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {stream ? "Start Recording" : "Start Webcam"}
            </>
          )}
        </Button>

        {stream && (
          <Button
            onClick={stopWebcam}
            variant="outline"
            size="lg"
            className="transition-all duration-300 hover:scale-105 hover:shadow-md bg-transparent"
          >
            Stop Webcam
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-1 animate-in fade-in-50 duration-700">
        <p>Position your face in the center of the frame</p>
        <p>Speak clearly while recording for best results</p>
      </div>
    </div>
  )
}
