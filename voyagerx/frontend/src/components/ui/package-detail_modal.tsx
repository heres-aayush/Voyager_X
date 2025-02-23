"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ethers } from "ethers";

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    packageId: number;
    packageTitle: string;
    images?: string[];
    destination: string;
    duration: string;
    basePrice: number;
    availability?: string;
    highlights?: string;
    inclusions?: string;
  } | null;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  isOpen,
  onClose,
  packageData,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBooked, setIsBooked] = useState(false); // State to track if the package is booked
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        const signer = await provider.getSigner();

        // Define the transaction parameters
        const tx = {
          to: "0x417D549A38889221Ff588FC0aca874FC93CF1e8E", // Replace with the recipient's address
          value: ethers.parseUnits("0.1", "ether"), // 0.1 POL (Amoy)
        };

        // Send the transaction
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();

        console.log("Payment successful!");
        setIsBooked(true); // Update state to indicate the package is booked
      } catch (error) {
        console.error("Error during payment:", error);
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
                          ID: {packageData.packageId}
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
                      ID: {packageData.packageId}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4 bg-zinc-800/70 p-3 rounded-lg shadow-inner">
                    <div>
                      <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-base font-semibold shadow-md">
                        {packageData.basePrice.toLocaleString()} POL
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
