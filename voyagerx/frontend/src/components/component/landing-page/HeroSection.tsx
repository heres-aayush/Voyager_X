"use client";
import { motion } from "framer-motion";
import WorldMap from "@/components/ui/world-map";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";

export default function HeroSection() {
  const words = ["seamless", "secure", "intelligent", "personalized"]; // Correctly declare the words array

  return (
    <section className="relative w-full">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center z-10">
        <p className="font-bold text-xl md:text-7xl text-white">
          Voyager
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            {"X".split("").map((letter, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </p>
        <div className="text-2xl mx-auto text-white mt-4">
          Experience
          <FlipWords words={words} />
          travel with AI &amp; Blockchain
        </div>

        <div className="flex justify-center gap-5 mt-8">
  <Link href="/agencies">
    <motion.button
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut", delay: 0.2 }}
    >
      <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FECACA_0%,#BE123C_50%,#FECACA_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
        Book a Trip
      </span>
    </motion.button>
  </Link>
  <Link href="/chat">
    <motion.button
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut", delay: 0.4 }}
    >
      <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FECACA_0%,#BE123C_50%,#FECACA_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
        Plan with AI
      </span>
    </motion.button>
  </Link>
</div>


      </div>
      <div className="w-full h-full z-0">
        <WorldMap
          dots={[
            {
              start: { lat: 64.2008, lng: -149.4937 },
              end: { lat: 34.0522, lng: -118.2437 },
            },
            {
              start: { lat: 64.2008, lng: -149.4937 },
              end: { lat: -15.7975, lng: -47.8919 },
            },
            {
              start: { lat: -15.7975, lng: -47.8919 },
              end: { lat: 38.7223, lng: -9.1393 },
            },
            {
              start: { lat: 51.5074, lng: -0.1278 },
              end: { lat: 8.6139, lng: 77.209 },
            },
            {
              start: { lat: 8.6139, lng: 77.209 },
              end: { lat: 43.1332, lng: 131.9113 },
            },
            {
              start: { lat: 8.6139, lng: 77.209 },
              end: { lat: -1.2921, lng: 36.8219 },
            },
          ]}
        />
      </div>
    </section>
  );
}
