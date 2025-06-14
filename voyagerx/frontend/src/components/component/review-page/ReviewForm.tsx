"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function ReviewForm({ onAddReview }: { onAddReview: (content: string, imageUrl?: string) => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddReview(content, image || undefined);
    setContent("");
    setImage(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-3xl mx-auto transition-all duration-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Share Your Travel Experience
      </h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review here..."
        className="w-full h-28 px-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none mb-5 transition-all duration-200"
      />

      {image && (
        <div className="mb-5 overflow-hidden rounded-xl border border-gray-300 shadow-sm">
          <img
            src={image}
            alt="Preview"
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-sm font-medium cursor-pointer transition-colors">
          <Camera size={20} />
          <span>Add Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        <button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Post Review
        </button>
      </div>
    </form>
  );
}
