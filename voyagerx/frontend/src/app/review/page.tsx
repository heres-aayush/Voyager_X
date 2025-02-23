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
      id: Date.now(), // ✅ Generates a unique timestamp-based ID
      imageUrl: imageUrl || "/placeholder.svg", // ✅ Uses uploaded image or default
      location: "Unknown Destination",
      author: "Traveler",
      content,
      likes: 0,
      comments: 0,
    };
    setReviews((prevReviews) => [newReview, ...prevReviews]); // ✅ Uses functional update to avoid stale state
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-200">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <ReviewForm onAddReview={addReview} />
        <ReviewFeed reviews={reviews} />
      </div>
    </main>
  );
}
