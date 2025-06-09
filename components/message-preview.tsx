"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Circle, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageData {
  title: string
  message: string
  recipient: string
  sender: string
  backgroundColor: string
  textColor: string
  effect: string
  backgroundImage?: string
  textEffect?: string
  fontFamily?: string
  imagePosition?: string
  imageSize?: string
  imageOpacity?: number
  imageFilterStyle?: string
  imageBase64?: string
  imageFilter?: string
  imageBrightness?: number
  imageContrast?: number
  audioFile?: string
  audioBase64?: string
  animationEffect?: string
  animationSpeed?: number
}

interface MessagePreviewProps {
  isDemo?: boolean
  messageData?: MessageData
}

interface EffectItem {
  id: number
  x: number
  y: number
  size: number
  speed: number
  rotation?: number
  opacity?: number
  scale?: number
}

export default function MessagePreview({ isDemo = false, messageData }: MessagePreviewProps) {
  const [effects, setEffects] = useState<EffectItem[]>([])
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Demo content
  const demoData: MessageData = {
    title: "Gửi Người Tôi Yêu",
    message:
      "Mỗi ngày bên em là một ngày tràn đầy hạnh phúc. Cảm ơn em vì đã luôn ở bên, yêu thương và chăm sóc anh. Anh yêu em rất nhiều!",
    sender: "Người luôn yêu em",
    recipient: "Người yêu của anh",
    backgroundColor: "#FF5757",
    textColor: "#FFFFFF",
    effect: "Trái tim",
    textEffect: "gradient-rainbow",
    fontFamily: "font-sans",
    animationEffect: "floating",
    animationSpeed: 1,
  }

  const data = isDemo ? demoData : messageData || demoData

  // Create effects animation with varying sizes
  useEffect(() => {
    const interval = setInterval(() => {
      const newEffect: EffectItem = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 30 + 10, // Varying sizes from 10-40px
        speed: Math.random() * 2 + 0.5, // Varying speeds
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.5, // 0.5-1.0 opacity
        scale: Math.random() * 0.8 + 0.6, // 0.6-1.4 scale
      }

      setEffects((prev) => [...prev, newEffect])
    }, 500)

    const animationInterval = setInterval(() => {
      setEffects((prev) =>
        prev
          .map((effect) => {
            const animationSpeed = data.animationSpeed || 1
            const newEffect = { ...effect }

            // Apply different animation effects based on selected animation
            switch (data.animationEffect) {
              case "floating":
                newEffect.y += effect.speed * animationSpeed
                newEffect.x += Math.sin(Date.now() * 0.001 + effect.id) * 0.5
                break
              case "bouncing":
                newEffect.y += effect.speed * animationSpeed
                newEffect.scale = 0.8 + Math.abs(Math.sin(Date.now() * 0.005 + effect.id)) * 0.4
                break
              case "rotating":
                newEffect.y += effect.speed * animationSpeed
                newEffect.rotation = (newEffect.rotation || 0) + 2 * animationSpeed
                break
              case "pulsing":
                newEffect.y += effect.speed * animationSpeed
                newEffect.opacity = 0.3 + Math.abs(Math.sin(Date.now() * 0.003 + effect.id)) * 0.7
                break
              case "swaying":
                newEffect.y += effect.speed * animationSpeed
                newEffect.x += Math.sin(Date.now() * 0.002 + effect.id) * 2
                break
              case "zooming":
                newEffect.y += effect.speed * animationSpeed
                newEffect.scale = 0.5 + Math.abs(Math.sin(Date.now() * 0.004 + effect.id)) * 1
                break
              case "sliding":
                newEffect.y += effect.speed * animationSpeed
                newEffect.x += 1 * animationSpeed
                break
              case "fading":
                newEffect.y += effect.speed * animationSpeed
                newEffect.opacity = Math.max(0.1, (newEffect.opacity || 1) - 0.01 * animationSpeed)
                break
              default:
                newEffect.y += effect.speed * animationSpeed
            }

            return newEffect
          })
          .filter((effect) => effect.y < 110),
      )
    }, 50)

    return () => {
      clearInterval(interval)
      clearInterval(animationInterval)
    }
  }, [data.animationEffect, data.animationSpeed])

  const renderEffect = (effect: EffectItem) => {
    switch (data.effect) {
      case "Trái tim":
        return <Heart fill="currentColor" />
      case "Bong bóng":
        return <Circle fill="currentColor" />
      case "Tuyết rơi":
        return <div className="text-white">❄</div>
      default:
        return <Heart fill="currentColor" />
    }
  }

  const getEffectColor = () => {
    switch (data.effect) {
      case "Trái tim":
        return "text-pink-500"
      case "Bong bóng":
        return "text-blue-400"
      case "Tuyết rơi":
        return "text-white"
      default:
        return "text-pink-500"
    }
  }

  const getTextEffectClass = (textEffect: string) => {
    switch (textEffect) {
      case "gradient-rainbow":
        return "bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text animate-pulse"
      case "gradient-sunset":
        return "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-transparent bg-clip-text"
      case "gradient-ocean":
        return "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 text-transparent bg-clip-text"
      case "gradient-forest":
        return "bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-transparent bg-clip-text"
      case "gradient-gold":
        return "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text"
      case "neon-glow":
        return "text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]"
      case "typewriter":
        return "animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white"
      case "bounce":
        return "animate-bounce"
      case "fade-in":
        return "animate-fade-in"
      case "slide-in":
        return "animate-slide-in"
      case "glow-pulse":
        return "animate-glow-pulse text-white"
      case "rainbow-shift":
        return "animate-rainbow-shift"
      default:
        return ""
    }
  }

  const getTitleEffectClass = (textEffect: string) => {
    const baseClass = getTextEffectClass(textEffect)
    switch (textEffect) {
      case "typewriter":
        return `${baseClass} animate-typing-title`
      case "bounce":
        return "animate-bounce-slow"
      case "fade-in":
        return "animate-fade-in-slow"
      case "slide-in":
        return "animate-slide-in-title"
      default:
        return baseClass
    }
  }

  const getFontClass = (fontFamily: string) => {
    switch (fontFamily) {
      case "font-sans":
        return "font-sans"
      case "font-serif":
        return "font-serif"
      case "font-mono":
        return "font-mono"
      case "font-dancing":
        return "font-dancing"
      case "font-playfair":
        return "font-playfair"
      case "font-roboto":
        return "font-roboto"
      case "font-lobster":
        return "font-lobster"
      case "font-pacifico":
        return "font-pacifico"
      default:
        return "font-sans"
    }
  }

  // Get background image style with position, size, opacity, and filters
  const getBackgroundImageStyle = () => {
    // Always prioritize base64 data for cross-browser compatibility
    const imageUrl = data.imageBase64 || data.backgroundImage
    if (!imageUrl) return {}

    const imagePosition = data.imagePosition || "center"
    const imageSize = data.imageSize || "cover"
    const imageOpacity = data.imageOpacity !== undefined ? data.imageOpacity : 1

    // Build filter string
    let filterString = ""
    if (data.imageBrightness !== undefined) {
      filterString += `brightness(${data.imageBrightness}) `
    }
    if (data.imageContrast !== undefined) {
      filterString += `contrast(${data.imageContrast}) `
    }

    // Add filter effects
    switch (data.imageFilter) {
      case "grayscale":
        filterString += "grayscale(1) "
        break
      case "sepia":
        filterString += "sepia(0.7) "
        break
      case "warm":
        filterString += "sepia(0.3) saturate(1.5) "
        break
      case "cool":
        filterString += "hue-rotate(30deg) saturate(1.2) "
        break
      case "vintage":
        filterString += "sepia(0.4) saturate(0.8) brightness(0.9) "
        break
      case "dramatic":
        filterString += "contrast(1.3) saturate(1.5) brightness(0.9) "
        break
      case "dreamy":
        filterString += "brightness(1.1) contrast(0.9) saturate(0.8) blur(0.5px) "
        break
    }

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: imagePosition,
      backgroundSize: imageSize,
      opacity: imageOpacity,
      filter: filterString.trim(),
    }
  }

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause()
        setIsPlayingAudio(false)
      } else {
        audioRef.current.play()
        setIsPlayingAudio(true)
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden p-4"
      style={{
        backgroundColor: data.backgroundColor,
        minHeight: "600px", // Đảm bảo chiều cao tối thiểu cho tỷ lệ dọc
      }}
    >
      {/* Background image with adjustments */}
      {(data.backgroundImage || data.imageBase64) && (
        <div className="absolute inset-0 z-0" style={getBackgroundImageStyle()}></div>
      )}

      {/* Effects animation with varying sizes and animations */}
      {effects.map((effect) => (
        <div
          key={effect.id}
          className={`absolute ${getEffectColor()}`}
          style={{
            left: `${effect.x}%`,
            top: `${effect.y}%`,
            fontSize: `${effect.size}px`,
            transform: `rotate(${effect.rotation || 0}deg) scale(${effect.scale || 1})`,
            opacity: effect.opacity || 0.7,
            transition: "all 0.1s ease-out",
          }}
        >
          {renderEffect(effect)}
        </div>
      ))}

      {/* Audio controls */}
      {(data.audioBase64 || data.audioFile) && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudioPlayback}
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          >
            {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <audio
            ref={audioRef}
            src={data.audioBase64 || data.audioFile}
            onEnded={() => setIsPlayingAudio(false)}
            loop
            className="hidden"
          />
        </div>
      )}

      {/* Message content */}
      <div
        className={`bg-black/30 backdrop-blur-sm text-center max-w-sm z-10 border border-white/30 rounded-xl p-4 ${getFontClass(
          data.fontFamily || "font-sans",
        )}`}
      >
        <h2
          className={`text-xl font-bold mb-3 ${data.textEffect ? getTitleEffectClass(data.textEffect) : ""}`}
          style={{ color: !data.textEffect ? data.textColor : undefined }}
        >
          {data.title || "Tiêu đề tin nhắn"}
        </h2>
        <p
          className={`mb-4 leading-relaxed text-sm ${data.textEffect ? getTextEffectClass(data.textEffect) : ""}`}
          style={{ color: !data.textEffect ? data.textColor : undefined }}
        >
          {data.message || "Nội dung tin nhắn của bạn sẽ hiển thị ở đây. Hãy viết những lời ngọt ngào nhất!"}
        </p>
        <div
          className={`text-sm italic opacity-80 ${data.textEffect ? getTextEffectClass(data.textEffect) : ""}`}
          style={{ color: !data.textEffect ? data.textColor : undefined }}
        >
          <p className="mb-1">Gửi đến: {data.recipient || "Người nhận"}</p>
          <p>Từ: {data.sender || "Người gửi"}</p>
        </div>
      </div>
    </div>
  )
}
