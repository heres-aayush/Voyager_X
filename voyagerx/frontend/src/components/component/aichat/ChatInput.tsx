"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Mic } from "lucide-react"



interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws/speech')
    
    websocket.onopen = () => {
      console.log('WebSocket Connected')
      setWs(websocket)
    }

    websocket.onerror = (error) => {
      console.error('WebSocket Error:', error)
      setError('Failed to connect to speech recognition service')
    }

    websocket.onclose = () => {
      console.log('WebSocket Disconnected')
      setWs(null)
    }

    return () => {
      websocket.close()
    }
  }, [])

  const handleSpeechRecognition = async () => {
    if (!ws) {
      setError('Speech recognition service not connected')
      return
    }

    try {
      setIsListening(true)
      ws.send('start')

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.status === "listening") {
          // Update UI to show we're listening
          console.log("Listening...")
        } else if (data.text) {
          setMessage(prev => prev + (prev ? ' ' : '') + data.text)
          setIsListening(false)
        } else if (data.error) {
          setError(data.error)
          setIsListening(false)
        }
      }
    } catch (error) {
      console.error('Speech recognition error:', error)
      setIsListening(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3 pr-24 rounded-full bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-900"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isListening ? {
              scale: [1, 1.2, 1],
              transition: {
                repeat: Infinity,
                duration: 1.5
              }
            } : {}}
            className={`p-2 rounded-full ${
              isListening ? 'bg-rose-700 animate-pulse' : 'bg-rose-500'
            } text-white relative`}
            onClick={handleSpeechRecognition}
            disabled={isListening}
          >
            <Mic size={20} />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3 h-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            )}
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-rose-500 text-white"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  )
}

