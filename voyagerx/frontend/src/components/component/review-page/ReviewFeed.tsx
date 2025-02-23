import ReviewCard from "./ReviewCard";

interface Review {
  id: number;
  author: string;
  location: string;
  content: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

interface ReviewFeedProps {
  reviews: Review[];
}

export default function ReviewFeed({ reviews }: ReviewFeedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {reviews.length > 0 ? (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      ) : (
        <p className="text-center text-gray-400 col-span-full">
          No reviews yet. Be the first to share your experience!
        </p>
      )}
    </div>
  );
}
