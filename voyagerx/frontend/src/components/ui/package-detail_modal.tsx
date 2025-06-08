"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ethers } from "ethers";
import { TravelBookingABI, TravelBookingAddress } from "@/contracts";

interface PackageData {
  _id: string;
  packageTitle: string;
  destination: string;
  duration: string;
  highlights: string;
  inclusions: string;
  basePrice: number;
  availability: string;
  images: string[];
}

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: PackageData | null;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  isOpen,
  onClose,
  packageData,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBooked, setIsBooked] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const switchToSepolia = async () => {
    try {
      // First request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Then try to switch network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
      });
    } catch (switchError: unknown) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (typeof switchError === 'object' && switchError !== null && 'code' in switchError && switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const convertMongoIdToNumber = (mongoId: string): number => {
    // Convert the MongoDB _id to a number by taking the first 8 characters
    // and converting them to a number using parseInt with base 16
    const hexString = mongoId.slice(0, 8);
    return parseInt(hexString, 16);
  };

  const checkBookingStatus = useCallback(async () => {
    if (typeof window.ethereum !== "undefined" && packageData) {
      try {
        // First request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        const numericId = convertMongoIdToNumber(packageData._id);
        console.log("Checking booking status for package:", numericId);
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check if we're on the correct network (Sepolia)
        const network = await provider.getNetwork();
        console.log("Current network:", network);
        
        if (network.chainId !== BigInt(11155111)) { // Sepolia chain ID
          console.log("Switching to Sepolia network...");
          await switchToSepolia();
          // Wait for network change
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Get new provider after network change
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const newNetwork = await newProvider.getNetwork();
          console.log("New network:", newNetwork);
          
          if (newNetwork.chainId !== BigInt(11155111)) {
            throw new Error("Failed to switch to Sepolia network");
          }
        }

        // Get current account
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Get a fresh provider after any potential network changes
        const finalProvider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          TravelBookingAddress,
          TravelBookingABI,
          finalProvider
        );
        
        // Get the current booking count
        const currentBookingCount = await contract.bookingCount();
        console.log("Current booking count:", currentBookingCount.toString());

        // Check all bookings to find if this package is booked by this user
        let foundBooking = false;
        for (let i = 1; i <= currentBookingCount; i++) {
          const booking = await contract.bookings(i);
          if (booking.packageId.toString() === numericId.toString() && 
              booking.user.toLowerCase() === address.toLowerCase()) {
            console.log("Found booking for package:", i);
            setIsBooked(booking.isBooked);
            foundBooking = true;
            break;
          }
        }

        if (!foundBooking) {
          console.log("No booking found for package");
          setIsBooked(false);
        }
        
      } catch (error) {
        console.error("Error checking booking status:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
          // If it's a network change error, retry once
          if (error.message.includes("network changed")) {
            console.log("Retrying after network change...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return checkBookingStatus();
          }
        }
      }
    } else {
      console.log("Ethereum provider not available or no package data");
    }
  }, [packageData]);

  useEffect(() => {
    if (isOpen && packageData) {
      console.log("Modal opened, checking booking status...");
      setCurrentImageIndex(0);
      document.body.style.overflow = "hidden";
      checkBookingStatus(); // Check booking status when modal opens
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, packageData, checkBookingStatus]);

  if (!packageData) return null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (packageData.images) {
      setCurrentImageIndex((prev) =>
        prev === packageData.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (packageData.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? packageData.images!.length - 1 : prev - 1
      );
    }
  };

  const hasMultipleImages = packageData.images && packageData.images.length > 1;

  const handleBookPackage = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check if we're on the correct network (Sepolia)
        const network = await provider.getNetwork();
        console.log("Current network:", network);
        
        if (network.chainId !== BigInt(11155111)) { // Sepolia chain ID
          console.log("Switching to Sepolia network...");
          await switchToSepolia();
          // Wait for network change
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Get new provider after network change
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const newNetwork = await newProvider.getNetwork();
          console.log("New network:", newNetwork);
        }

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          TravelBookingAddress,
          TravelBookingABI,
          signer
        );

        // Convert basePrice to wei
        const amount = ethers.parseUnits(
          packageData.basePrice.toString(),
          "ether"
        );

        const numericId = convertMongoIdToNumber(packageData._id);
        console.log("Booking package:", numericId, "with amount:", amount.toString());
        
        // Call the contract's bookPackage function with the numeric ID
        const tx = await contract.bookPackage(numericId, {
          value: amount,
        });
        console.log("Transaction sent:", tx.hash);
        
        await tx.wait();
        console.log("Transaction confirmed");
        
        console.log("Payment successful! Checking updated booking status...");
        await checkBookingStatus(); // Check booking status after successful booking
      } catch (error) {
        console.error("Error during payment:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
        }
        alert("Payment failed. Please try again.");
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to proceed.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-[95%] max-w-4xl max-h-[90vh] bg-zinc-900 rounded-xl shadow-2xl overflow-hidden flex flex-col z-[60]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/90 hover:bg-zinc-700 transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-zinc-200" />
            </button>

            <div className="w-full h-48 md:h-64 flex-shrink-0">
              {packageData.images && packageData.images.length > 0 ? (
                <div className="relative w-full h-full">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={packageData.images[currentImageIndex]}
                      alt={`${packageData.packageTitle} image ${
                        currentImageIndex + 1
                      }`}
                      fill
                      priority
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    <div className="absolute top-4 left-6 right-16 z-10">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-bold text-white leading-tight shadow-sm">
                          {packageData.packageTitle}
                        </h2>
                        <span className="text-sm bg-zinc-800/80 text-zinc-200 px-2 py-1 rounded">
                          ID: {packageData._id}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-200 mt-1">
                        {packageData.destination} • {packageData.duration}
                      </p>
                    </div>

                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5 text-white" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
                          {packageData.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(idx);
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex
                                  ? "bg-white scale-110"
                                  : "bg-white/50 hover:bg-white/70"
                              }`}
                              aria-label={`View image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              ) : null}
            </div>

            {hasMultipleImages && (
              <div className="px-4 py-2">
                <div className="flex space-x-2 overflow-x-auto py-1 -mx-1 hide-scrollbar">
                  {packageData.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 h-12 w-20 rounded-md overflow-hidden transition-all ${
                        idx === currentImageIndex
                          ? "ring-2 ring-blue-500"
                          : "ring-1 ring-zinc-700 hover:ring-zinc-500"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${packageData.packageTitle} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                F
              </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-800/50">
              <div className="p-5 space-y-5">
                {!packageData.images?.length && (
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight">
                      {packageData.packageTitle}
                    </h2>
                    <span className="text-sm bg-zinc-700 text-zinc-200 px-3 py-1 rounded-full">
                      ID: {packageData._id}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 bg-zinc-800/70 p-3 rounded-lg shadow-inner">
                    <div>
                      <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-base font-semibold shadow-md">
                        {packageData.basePrice.toLocaleString(undefined, {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 8,
                        })} ETH
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-zinc-100 mb-1 flex items-center">
                        <span className="inline-block w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                        Destination
                      </h3>
                      <p className="text-zinc-300 ml-4">
                        {packageData.destination}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-zinc-100 mb-1 flex items-center">
                        <span className="inline-block w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                        Duration
                      </h3>
                      <p className="text-zinc-300 ml-4">
                        {packageData.duration}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-zinc-100 mb-1 flex items-center">
                        <span className="inline-block w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                        Availability
                      </h3>
                      <p className="text-zinc-300 ml-4">
                        {packageData.availability
                          ? new Date(
                              packageData.availability
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Contact for availability"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {packageData.highlights ? (
                      <div className="bg-zinc-800/70 p-3 rounded-lg shadow-inner">
                        <h3 className="text-base font-semibold text-zinc-100 mb-1 flex items-center">
                          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          Highlights
                        </h3>
                        <div className="text-zinc-300 leading-relaxed whitespace-pre-line ml-4 max-h-48 overflow-y-auto pr-2 text-sm">
                          {packageData.highlights}
                        </div>
                      </div>
                    ) : null}

                    {packageData.inclusions ? (
                      <div className="bg-zinc-800/70 p-3 rounded-lg shadow-inner">
                        <h3 className="text-base font-semibold text-zinc-100 mb-1 flex items-center">
                          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          Inclusions & Exclusions
                        </h3>
                        <div className="text-zinc-300 leading-relaxed whitespace-pre-line ml-4 max-h-48 overflow-y-auto pr-2 text-sm">
                          {packageData.inclusions}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleBookPackage}
                    disabled={isBooked} // Disable the button after booking
                    className={`w-full md:w-auto px-6 py-3 bg-gradient-to-r ${
                      isBooked
                        ? "from-green-600 to-green-700 cursor-not-allowed"
                        : "from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                    } text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                  >
                    {isBooked ? "Booked" : "Book This Package"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
