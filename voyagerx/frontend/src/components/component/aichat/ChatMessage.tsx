"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ChatMessageProps {
  type: "user" | "ai";
  content: string;
  avatar: ReactNode;
  isTyping?: boolean;
}

export default function ChatMessage({
  type,
  content,
  avatar,
  isTyping = false,
}: ChatMessageProps) {
  const isAI = type === "ai";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} items-end space-x-2`}>
      {/* Render avatar on the left for AI messages */}
      {isAI && avatar}

      <motion.div
        className={`max-w-[70%] p-3 rounded-lg shadow-xl ${
          isAI
            ? "bg-[linear-gradient(60deg,#89216B,#DA4453)] text-white"
            : "bg-white bg-opacity-10 backdrop-blur-md"
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isTyping ? (
          // Typing indicator
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        ) : (
          // Render formatted markdown content inside a wrapper for styling
          <div className={`prose prose-invert text-lg ${isAI ? "text-white" : "text-white"}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>

      {/* Render avatar on the right for user messages */}
      {!isAI && avatar}
    </div>
  );
}
