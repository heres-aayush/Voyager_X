'use client';//start
import HeroSection from "@/components/component/landing-page/HeroSection"
import KeyFeatures from "@/components/component/landing-page/KeyFeatures"
import TrendingDestinations from "@/components/component/landing-page/TrendingDestinations"
import AgencySection from "@/components/component/landing-page/AgencySection"
import Footer from "@/components/component/landing-page/Footer"
import Navbar from "@/components/component/Navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-deep-blue to-cyber-purple text-white">
      <Navbar/>
      <HeroSection />
      <KeyFeatures />
      <TrendingDestinations />
      <AgencySection />
      <Footer />
    </main>
  )
}
