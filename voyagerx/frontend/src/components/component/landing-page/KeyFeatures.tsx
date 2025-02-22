'use client';
import { motion } from "framer-motion";
import { Brain, Shield, Coins, BookOpen, Gift, FolderOpen } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Personalized Itineraries" },
  { icon: Shield, title: "Smart Contract-Based Secure Bookings" },
  { icon: Coins, title: "Crypto & Web3 Payments for Global Transactions" },
  { icon: BookOpen, title: "Decentralized & Immutable Travel Reviews" },
  { icon: Gift, title: "Token Rewards & NFT-Based Loyalty System" },
  { icon: FolderOpen, title: "IPFS-Based Document & Ticket Storage" },
];

export default function KeyFeatures() {
  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">Key Features</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-zinc-800 bg-opacity-40 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white rounded-full flex items-center justify-center">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}