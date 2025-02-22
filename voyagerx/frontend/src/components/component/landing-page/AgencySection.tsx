"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AgencySection() {
  return (
    <section className="py-20 px-4 bg-zinc-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          For Agencies & Travel Services
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          Join as an Agency & Earn More with Zero Commissions!
        </p>
        <Link href="/agency-signup">
          <motion.button
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
              Sign Up as an Agency
            </span>
          </motion.button>
        </Link>
      </div>
    </section>
  );
}