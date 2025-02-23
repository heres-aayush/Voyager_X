import { motion } from "framer-motion"
import { Play } from 'lucide-react'

export default function VideoPlayer() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden shadow-2xl"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-4 shadow-lg transition-colors duration-300">
          <Play className="w-8 h-8" />
        </button>
      </div>
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded">
        <h3 className="text-lg font-semibold">VoyagerX Demo</h3>
        <p className="text-sm">Watch how easy it is to plan and book your next adventure</p>
      </div>
    </motion.div>
  )
}