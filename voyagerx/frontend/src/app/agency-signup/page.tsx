import SignupForm from "@/components/component/signup/SignupForm"
import type { Metadata } from "next"
import { Boxes } from "@/components/ui/background-boxes"
import Navbar from "@/components/component/Navbar"

export const metadata: Metadata = {
  title: "Sign Up | VoyagerX",
  description: "Join VoyagerX - The blockchain-powered decentralized travel marketplace",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-zinc-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 w-full h-full bg-zinc-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Navbar/>
      <Boxes />
      <SignupForm className="relative z-20 mt-12" />
    </div>
  )
}