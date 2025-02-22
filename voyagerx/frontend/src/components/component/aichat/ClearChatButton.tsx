"use client"

import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"

interface ClearChatButtonProps {
  onClear: () => void
}

export default function ClearChatButton({ onClear }: ClearChatButtonProps) {
  return (
    <motion.button
      onClick={onClear}
      className="p-2 rounded-full bg-white bg-opacity-10 backdrop-blur-md text-white hover:bg-opacity-20 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Trash2 size={20} />
    </motion.button>
  )
}

