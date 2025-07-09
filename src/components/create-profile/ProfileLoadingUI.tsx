
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { 
  File, 
  Radar, 
  Star, 
  Sparkles, 
  Eye, 
  BookOpen, 
  Trophy, 
  Zap 
} from "lucide-react"

interface LoadingMessage {
  text: string
  icon: React.ComponentType<{ className?: string }>
}

const loadingMessages: LoadingMessage[] = [
  {
    text: "Uploading your resume...",
    icon: File
  },
  {
    text: "Scanning for your superpowers...",
    icon: Radar
  },
  {
    text: "Extracting career highlights...",
    icon: Star
  },
  {
    text: "Spotting patterns in your experience...",
    icon: Eye
  },
  {
    text: "Summarizing what makes you stand out...",
    icon: BookOpen
  },
  {
    text: "Turning your journey into a clear story...",
    icon: Sparkles
  },
  {
    text: "Highlighting your best moves so far...",
    icon: Trophy
  },
  {
    text: "Your skills deserve the spotlight. We're making it happen.",
    icon: Zap
  }
]

export const ProfileLoadingUI = () => {
  const [progress, setProgress] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [usedMessages, setUsedMessages] = useState<number[]>([])

  // Progress bar animation - completes in 25 seconds
  useEffect(() => {
    const duration = 30000 // 30 seconds
    const interval = 100 // Update every 100ms
    const increment = 100 / (duration / interval)

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment
        return newProgress >= 100 ? 100 : newProgress
      })
    }, interval)

    return () => clearInterval(progressTimer)
  }, [])

  // Message rotation - changes every 3-5 seconds
  useEffect(() => {
    const getNextMessageIndex = () => {
      let availableIndices = loadingMessages
        .map((_, index) => index)
        .filter(index => index !== currentMessageIndex)

      // If we've used all messages, reset but avoid current
      if (usedMessages.length >= loadingMessages.length - 1) {
        setUsedMessages([])
        availableIndices = loadingMessages
          .map((_, index) => index)
          .filter(index => index !== currentMessageIndex)
      } else {
        availableIndices = availableIndices.filter(
          index => !usedMessages.includes(index)
        )
      }

      const randomIndex = Math.floor(Math.random() * availableIndices.length)
      return availableIndices[randomIndex]
    }

    const messageTimer = setInterval(() => {
      const nextIndex = getNextMessageIndex()
      setCurrentMessageIndex(nextIndex)
      setUsedMessages(prev => [...prev, nextIndex])
    }, Math.random() * 3000 + 6000) // 3-6 seconds

    return () => clearInterval(messageTimer)
  }, [currentMessageIndex, usedMessages])

  const currentMessage = loadingMessages[currentMessageIndex]
  const IconComponent = currentMessage.icon

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        {/* Icon and Message */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <IconComponent className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-h3 text-gray-900 font-urbanist animate-fade-in">
            {currentMessage.text}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <Progress 
            value={progress} 
            className="h-3 bg-gray-200"
            indicatorColor="#449889"
          />
          <div className="flex justify-between text-caption text-gray-600 font-urbanist">
            <span>Building your profile...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Additional context */}
        <p className="text-body text-gray-600 font-urbanist max-w-md">
          We're analyzing your professional background to create a comprehensive profile that highlights your unique strengths.
        </p>
      </div>
    </div>
  )
}
