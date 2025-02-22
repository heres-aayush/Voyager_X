'use client';
import { motion } from "framer-motion";
import Image from "next/image";

const destinations = [
  { name: "Tokyo", image: "/image1.png?height=400&width=600" },
  { name: "Bali", image: "/image2.png?height=400&width=600" },
  { name: "New York", image: "/image3.png?height=400&width=600" },
  { name: "Paris", image: "/image4.png?height=400&width=600" },
];

export default function TrendingDestinations() {
  return (
    <section id="destinations" className="py-20 px-4 bg-zinc-900">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">
        Trending Destinations
      </h2>
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <div className="flex space-x-6 pb-4">
          {destinations.map((destination, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-72 rounded-lg overflow-hidden bg-zinc-800 bg-opacity-40 backdrop-blur-md"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">
                  <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    {destination.name}
                  </span>
                </h3>
                <p className="text-sm text-gray-300 mt-2">AI-recommended travel spot</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
