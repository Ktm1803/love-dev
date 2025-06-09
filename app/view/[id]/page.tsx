"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import MessagePreview from "@/components/message-preview"
import { useParams } from "next/navigation"

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
  imageFilter?: string
  imageBrightness?: number
  imageContrast?: number
  imageBase64?: string
  audioFile?: string
  audioBase64?: string
  animationEffect?: string
  animationSpeed?: number
}

export default function ViewPage() {
  const params = useParams()
  const [messageData, setMessageData] = useState<MessageData | null>(null)
  const [loading, setLoading] = useState(true)

  // Decompress data function
  const decompressData = (compressedString: string): any => {
    // Reverse the compression by restoring original keys
    const decompressed = compressedString
      .replace(/"t":/g, '"title":')
      .replace(/"m":/g, '"message":')
      .replace(/"r":/g, '"recipient":')
      .replace(/"s":/g, '"sender":')
      .replace(/"bg":/g, '"backgroundColor":')
      .replace(/"tc":/g, '"textColor":')
      .replace(/"e":/g, '"effect":')
      .replace(/"te":/g, '"textEffect":')
      .replace(/"ff":/g, '"fontFamily":')
      .replace(/"bi":/g, '"backgroundImage":')
      .replace(/"ib64":/g, '"imageBase64":')
      .replace(/"ip":/g, '"imagePosition":')
      .replace(/"is":/g, '"imageSize":')
      .replace(/"io":/g, '"imageOpacity":')
      .replace(/"if":/g, '"imageFilter":')
      .replace(/"ib":/g, '"imageBrightness":')
      .replace(/"ic":/g, '"imageContrast":')
      .replace(/"ae":/g, '"animationEffect":')
      .replace(/"as":/g, '"animationSpeed":')
      .replace(/"ab":/g, '"audioBase64":')

    return JSON.parse(decompressed)
  }

  useEffect(() => {
    try {
      const id = params.id as string

      try {
        // Decode URL encoding first
        const decodedBase64 = decodeURIComponent(id)

        // Convert base64 to UTF-8 bytes, then to string
        const binaryString = atob(decodedBase64)
        const utf8Bytes = new Uint8Array(binaryString.length)

        for (let i = 0; i < binaryString.length; i++) {
          utf8Bytes[i] = binaryString.charCodeAt(i)
        }

        const jsonString = new TextDecoder().decode(utf8Bytes)

        // Try to parse the JSON
        let decodedData
        try {
          // Try decompression first (for new compressed format)
          decodedData = decompressData(jsonString)
        } catch (decompressError) {
          // Fallback to direct JSON parsing (for old format)
          decodedData = JSON.parse(jsonString)
        }

        setMessageData(decodedData)
      } catch (error) {
        console.error("Error decoding message data:", error)
        // Fallback to old method for backward compatibility
        try {
          const decodedBase64 = decodeURIComponent(id)
          const jsonString = atob(decodedBase64)

          let decodedData
          try {
            // Try decompression first
            decodedData = decompressData(jsonString)
          } catch (decompressError) {
            // Fallback to direct JSON parsing
            decodedData = JSON.parse(jsonString)
          }

          setMessageData(decodedData)
        } catch (fallbackError) {
          console.error("Fallback decoding also failed:", fallbackError)
          throw new Error("Could not decode message data")
        }
      }
    } catch (error) {
      console.error("Error decoding message data:", error)
      setMessageData(null)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0e17] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Đang tải tin nhắn...</p>
        </div>
      </main>
    )
  }

  if (!messageData) {
    return (
      <main className="min-h-screen bg-[#0d0e17] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy tin nhắn</h1>
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d0e17] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
            {messageData.title}
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1a1b29]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
            <div
              className="bg-[#0d0e17] rounded-lg overflow-hidden relative flex items-center justify-center mx-auto"
              style={{
                aspectRatio: "9/16",
                maxWidth: "400px",
                width: "100%",
              }}
            >
              <MessagePreview messageData={messageData} />
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" asChild>
                <Link href="/create">Tạo tin nhắn của riêng bạn</Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-pink-500 to-cyan-400 hover:opacity-90"
                onClick={() => {
                  navigator.share?.({
                    title: messageData.title,
                    text: messageData.message,
                    url: window.location.href,
                  }) || navigator.clipboard.writeText(window.location.href)
                }}
              >
                <Share2 className="h-4 w-4 mr-2" /> Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
