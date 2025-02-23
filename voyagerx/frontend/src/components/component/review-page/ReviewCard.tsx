import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface Review {
  imageUrl: string;
  location: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
}

export default function ReviewCard({ review }: { review: Review }) {
  const [likes, setLikes] = useState(review.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl w-full max-w-lg mx-auto">
      <div className="relative h-64 w-full">
        <Image
          src={review.imageUrl || "/placeholder.svg"}
          alt={`Travel photo from ${review.location}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="rounded-t-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-lg font-semibold text-white">{review.location}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {review.author[0]}
          </div>
          <p className="ml-3 text-sm font-medium text-gray-800">{review.author}</p>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{review.content}</p>
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <button
            className={`flex items-center space-x-1 transition-colors ${
              liked ? "text-rose-500" : "hover:text-rose-500"
            }`}
            onClick={handleLike}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-rose-500 transition-colors">
            <MessageCircle size={18} />
            <span>{review.comments}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-rose-500 transition-colors">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
