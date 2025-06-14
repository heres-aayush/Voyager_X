"use client";

import { useState } from "react";
import Navbar from "@/components/component/Navbar";
import ReviewFeed from "@/components/component/review-page/ReviewFeed";
import ReviewForm from "@/components/component/review-page/ReviewForm";

interface Review {
  id: number;
  imageUrl: string;
  location: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = (content: string, imageUrl?: string) => {
    const newReview: Review = {
      id: Date.now(),
      imageUrl: imageUrl || "/placeholder.svg",
      location: "Unknown Destination",
      author: "Traveler",
      content,
      likes: 0,
      comments: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100">
      <Navbar />

      <section className="container max-w-5xl mx-auto px-4 py-24">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-white">
          🌍 Traveler Stories
        </h1>

        <ReviewForm onAddReview={addReview} />

        <div className="mt-14">
          {reviews.length === 0 ? (
            <div className="text-center text-zinc-400 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm bg-zinc-800/40 shadow-lg">
              <p className="text-lg mb-2">No reviews yet.</p>
              <p className="text-sm">Be the first to share your travel experience! 🌟</p>
            </div>
          ) : (
            <ReviewFeed reviews={reviews} />
          )}
        </div>
      </section>
    </main>
  );
}
