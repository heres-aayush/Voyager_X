"use client"

import { motion } from "framer-motion"

interface QuickActionsProps {
  onActionClick: (action: string) => void
}

const actions = ["Suggest a beach vacation", "Plan a city tour", "Find adventure activities", "Recommend local cuisine"]

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          onClick={() => onActionClick(action)}
          className="px-4 py-2 rounded-full bg-white bg-opacity-10 backdrop-blur-md text-sm text-white hover:bg-opacity-20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action}
        </motion.button>
      ))}
    </div>
  )
}

