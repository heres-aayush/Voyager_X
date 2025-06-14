"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/component/Navbar";
import StepGuide from "@/components/component/how-it-works/step-guide";
import VideoPlayer from "@/components/component/how-it-works/video-player";
import CTASection from "@/components/component/how-it-works/cta-section";

export default function HowToUsePage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Plan with AI",
      content: "Let our AI assist you in planning the perfect trip based on your preferences.",
    },
    {
      title: "Book with Blockchain",
      content: "Secure and transparent bookings using our blockchain technology.",
    },
    {
      title: "Earn Rewards",
      content: "Accumulate points and unlock exclusive benefits with every booking.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 relative">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center px-6 pt-28 pb-14"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-zinc-100">
          How to Use Voyager<span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-transparent bg-clip-text">X</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
          Your gateway to AI-powered, blockchain-secured travel experiences.
        </p>
      </motion.section>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Step Guide */}
        <section className="mb-20">
          <StepGuide steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
        </section>

        {/* Demo Video Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 sm:p-10 shadow-md mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-zinc-100">
            See VoyagerX in Action
          </h2>
          <VideoPlayer />
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <CTASection />
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-zinc-500 py-10">
        <p>&copy; 2025 VoyagerX. All rights reserved.</p>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors shadow-md"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 text-zinc-200" />
      </motion.button>
    </div>
  );
}
