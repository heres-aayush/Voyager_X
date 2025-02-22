"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SuccessStep() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <svg
        className="mx-auto h-12 w-12 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Welcome aboard!</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Your account has been successfully created. Start listing your travel packages now.
      </p>
      <div className="mt-6">
        <Link
          href="/agencies"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </motion.div>
  );
}
