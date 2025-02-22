import Navbar from "@/components/component/Navbar";
import ReviewFeed from "@/components/component/review-page/ReviewFeed";
import ReviewForm from "@/components/component/review-page/ReviewForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-200">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <ReviewForm />
        <ReviewFeed />
      </div>
    </main>
  );
}
