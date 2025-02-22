"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import ChatMessage from "@/components/component/aichat/ChatMessage";
import ChatInput from "@/components/component/aichat/ChatInput";
import QuickActions from "@/components/component/aichat/QuickActions";
import Avatar from "@/components/component/aichat/Avatar";
import ClearChatButton from "@/components/component/aichat/ClearChatButton";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addMessage = (type: "user" | "ai", content: string) => {
    setMessages((prev) => [...prev, { type, content }]);
  };

  const handleSendMessage = async (message: string) => {
    addMessage("user", message);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setIsTyping(false);
      if (data.response) {
        addMessage("ai", data.response);
      } else {
        addMessage("ai", "Sorry, something went wrong.");
      }
    } catch {
      setIsTyping(false);
      addMessage("ai", "Error connecting to server.");
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Animation Variants
  const chatContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-zinc-900 to-zinc-700 text-white">
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
        aria-label="Return to home page"
      >
        <X size={24} />
      </Link>

      <header className="p-4 bg-zinc-900 bg-opacity-30 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center">Diversion Mascot</h1>
      </header>

      <main className="text-3xl flex-1 overflow-hidden">
        <motion.div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
          variants={chatContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div key={index} variants={messageVariants}>
                <ChatMessage
                  type={message.type}
                  content={message.content}
                  avatar={
                    message.type === "ai" ? (
                      <Avatar src="/gargigpt.jpeg" alt="AI" />
                    ) : null
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div variants={messageVariants}>
              <ChatMessage
                type="ai"
                content="Typing..."
                isTyping
                avatar={<Avatar src="/gargigpt.jpeg" alt="AI" />}
              />
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="p-4 bg-black bg-opacity-30 backdrop-blur-md">
        <QuickActions onActionClick={handleSendMessage} />
        <ChatInput onSendMessage={handleSendMessage} />
        <div className="mt-2 flex justify-end">
          <ClearChatButton onClear={clearChat} />
        </div>
      </footer>
    </div>
  );
}
