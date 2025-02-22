import PackageListingForm from "@/components/component/PackageListingForm";
import { Boxes } from "@/components/ui/background-boxes";
import Navbar from "@/components/component/Navbar";

export default function ListPackage() {
  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white overflow-hidden">
       <Navbar />

      {/* Main Content */}
      <main className="min-h-screen relative w-full overflow-hidden bg-zinc-900 flex items-center justify-center pt-16">
      <Boxes />

        <section className="h-full w-full max-w-2xl mt-10 relative">
       
          <h1 className="text-3xl font-semibold text-center mb-6 text-white relative z-10">
            List Your Travel Package
          </h1>

          <div className="p-8 bg-white text-black shadow-xl rounded-2xl border border-zinc-700 relative z-10">
            <PackageListingForm />
          </div>
        </section>
      </main>
    </div>
  );
}