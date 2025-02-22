"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface Package {
  packageId: number
  packageTitle: string
  destination: string
  duration: string
  highlights: string
  inclusions: string
  basePrice: number
  availability: string
  images: string[] // URLs or base64 strings
}

interface PackageContextType {
  packages: Package[]
  addPackage: (pkg: Package) => void
}

const PackageContext = createContext<PackageContextType>({
  packages: [],
  addPackage: () => {},
})

export const PackageProvider = ({ children }: { children: ReactNode }) => {
  const [packages, setPackages] = useState<Package[]>([])

  useEffect(() => {
    const savedPackages = JSON.parse(localStorage.getItem("travelPackages") || "[]")
    setPackages(savedPackages)

    if (sessionStorage.getItem("cleared") !== "true") {
      localStorage.removeItem("travelPackages")
      setPackages([]) // Reset packages in state
      sessionStorage.setItem("cleared", "true") // Mark session as cleared
    }
  }, [])

  const addPackage = (newPackage: Package) => {
    // Check if packageId already exists
    const isDuplicateId = packages.some(pkg => pkg.packageId === newPackage.packageId)
    
    if (isDuplicateId) {
      throw new Error(`Package with ID ${newPackage.packageId} already exists`)
    }

    setPackages((prev) => [...prev, newPackage])
    
    // Persist to localStorage
    const savedPackages = JSON.parse(localStorage.getItem("travelPackages") || "[]")
    localStorage.setItem("travelPackages", JSON.stringify([...savedPackages, newPackage]))
  }

  return (
    <PackageContext.Provider value={{ packages, addPackage }}>
      {children}
    </PackageContext.Provider>
  )
}

export const usePackages = () => useContext(PackageContext)