"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from 'lucide-react'
import StepGuide from "@/components/component/how-it-works/step-guide"
import VideoPlayer from "@/components/component/how-it-works/video-player"
import CTASection from "@/components/component/how-it-works/cta-section"
import Navbar from "@/components/component/Navbar"

export default function HowToUsePage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { title: "Plan with AI", content: "Let our AI assist you in planning the perfect trip based on your preferences." },
    { title: "Book with Blockchain", content: "Secure and transparent bookings using our blockchain technology." },
    { title: "Earn Rewards", content: "Accumulate points and unlock exclusive benefits with every booking." },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
        <Navbar />
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold text-center mb-4 mt-14">How to Use VoyagerX</h1>
        <p className="text-xl text-center text-zinc-400">Your gateway to AI-powered, blockchain-secured travel experiences</p>
      </motion.header>

      <main className="container mx-auto px-4 py-12">
        <StepGuide steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="my-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">See VoyagerX in Action</h2>
          <VideoPlayer />
        </motion.section>

        <CTASection />
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="container mx-auto px-4 py-8 text-center text-zinc-500"
      >
        <p>&copy; 2025 VoyagerX. All rights reserved.</p>
      </motion.footer>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-8 right-8"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-3 shadow-lg transition-colors duration-300"
        >
          <ChevronDown className="w-6 h-6 transform rotate-180" />
        </button>
      </motion.div>
    </div>
  )
}