import ReviewCard from "./ReviewCard"

// This is a mock data array. In a real application, you would fetch this data from an API.
const mockReviews = [
  {
    id: 1,
    author: "Jane Doe",
    location: "Bali, Indonesia",
    content: "Absolutely breathtaking! The beaches were pristine and the local culture was fascinating.",
    imageUrl: "/bali-review.jpg?height=300&width=400",
    likes: 42,
    comments: 7,
  },
  {
    id: 2,
    author: "John Smith",
    location: "Paris, France",
    content: "The City of Light truly lives up to its name. Amazing architecture and delicious cuisine!",
    imageUrl: "/paris-review.jpeg?height=300&width=400",
    likes: 38,
    comments: 5,
  },
  {
    id: 3,
    author: "Emily Brown",
    location: "Kyoto, Japan",
    content: "A serene and cultural experience. The temples and cherry blossoms were a highlight of my trip.",
    imageUrl: "/kyoto-review.jpg?height=300&width=400",
    likes: 50,
    comments: 9,
  },
  // Add more mock reviews as needed
]

export default function ReviewFeed() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {mockReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}