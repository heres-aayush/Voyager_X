"use client";
import { motion } from "motion/react";
import WorldMap from "@/components/ui/world-map";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center z-10">
        <p className="font-bold text-xl md:text-7xl text-white">
          Voyager
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            {"X".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>

        <p className="text-sm md:text-lg text-neutral-300 max-w-2xl mx-auto py-4">
          Redefining Travel with AI and Blockchain. Effortless planning, secure
          bookings, and limitless exploration—tailored just for you.
        </p>
        <div className="flex justify-center gap-5 mt-8">
          <motion.button
            className="px-8 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:shadow-xl transition duration-200"
            initial={{ opacity: 0, scale: 0.95, rotate: 0 }} // Start slightly smaller and no rotation
            animate={{ opacity: 1, scale: 1, rotate: 0 }} // Scale to full size, no rotation
            transition={{ duration: 0.75, ease: "easeInOut", delay: 0.2 }} // Smooth transition with easeInOut
          >
            Book a Trip
          </motion.button>
          <Link href="/chat">
            <motion.button
              className="px-8 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:shadow-xl transition duration-200"
              initial={{ opacity: 0, scale: 0.95, rotate: 0 }} // Start slightly smaller and no rotation
              animate={{ opacity: 1, scale: 1, rotate: 0 }} // Scale to full size, no rotation
              transition={{ duration: 0.75, ease: "easeInOut", delay: 0.4 }} // Smooth transition with easeInOut
            >
              Plan with AI
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