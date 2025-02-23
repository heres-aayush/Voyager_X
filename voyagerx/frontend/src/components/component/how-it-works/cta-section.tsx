import { motion } from "framer-motion"
import Link from "next/link"

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-center py-16"
    >
      <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
      <p className="text-xl text-zinc-400 mb-8">Experience the future of travel planning with VoyagerX</p>
      <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-rose-600 hover:bg-rose-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
>
  <Link href="/chat" className="block w-full h-full">
    Start Planning Now
  </Link>
</motion.button>
    </motion.section>
  )
}