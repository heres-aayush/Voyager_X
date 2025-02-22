import Image from "next/image"
import { Heart, MessageCircle, Share2 } from "lucide-react"

interface Review {
  imageUrl: string;
  location: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl max-w-sm mx-auto">
      <div className="relative h-48">
        <Image
          src={review.imageUrl || "/placeholder.svg"}
          alt={`Travel photo from ${review.location}`}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-xl font-semibold text-white">{review.location}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {review.author[0]}
          </div>
          <p className="ml-2 text-sm font-medium text-gray-800">{review.author}</p>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{review.content}</p>
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <button className="flex items-center space-x-1 hover:text-rose-500 transition-colors">
            <Heart size={16} />
            <span>{review.likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-rose-500 transition-colors">
            <MessageCircle size={16} />
            <span>{review.comments}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-rose-500 transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

