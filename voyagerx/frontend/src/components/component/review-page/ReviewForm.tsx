"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function ReviewForm() {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log("Submitted review:", content);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 border border-gray-300 shadow-md w-full max-w-3xl mx-auto mt-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Share Your Travel Experience
      </h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review here..."
        className="w-full h-28 px-4 py-2 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none border border-gray-300 mb-4"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center space-x-2 text-rose-500 hover:text-rose-600 transition-colors"
        >
          <Camera size={20} />
          <span className="text-sm">Add Photo</span>
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-all"
        >
          Post Review
        </button>
      </div>
    </form>
  );
}
