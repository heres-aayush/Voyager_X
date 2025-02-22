// src/components/TravelBooking.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { TravelBookingABI, TravelBookingAddress } from "../contracts";

const TravelBooking: React.FC = () => {
  const [packageId, setPackageId] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<string>("");

  // Function to book a package
  const handleBookPackage = async () => {
    try {
      // Connect to the Ethereum provider (MetaMask) - ethers.js v6
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the signer
      const signer = await provider.getSigner();

      // Create the contract instance with the signer
      const travelBookingContract = new ethers.Contract(
        TravelBookingAddress,
        TravelBookingABI,
        signer
      );

      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount);

      // Call the `bookPackage` function
      const tx = await travelBookingContract.bookPackage(packageId, {
        value: amountInWei,
      });
      await tx.wait();

      alert("Package booked successfully!");
    } catch (error) {
      console.error("Error booking package:", error);
      alert("Failed to book package.");
    }
  };

  // Function to check booking status
  const handleCheckBookingStatus = async () => {
    try {
      // Connect to the Ethereum provider (MetaMask) - ethers.js v6
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the signer
      const signer = await provider.getSigner();

      // Create the contract instance with the signer
      const travelBookingContract = new ethers.Contract(
        TravelBookingAddress,
        TravelBookingABI,
        signer
      );

      // Call the `getBookingStatus` function
      const status = await travelBookingContract.getBookingStatus(packageId);
      setBookingStatus(status ? "Booked" : "Not Booked");
    } catch (error) {
      console.error("Error checking booking status:", error);
    }
  };

  return (
    <div>
      <h1>Travel Booking</h1>
      <div>
        <label>
          Package ID:
          <input
            type="number"
            value={packageId}
            onChange={(e) => setPackageId(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Amount (ETH):
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleBookPackage}>Book This Package</button>
      <div>
        <button onClick={handleCheckBookingStatus}>Check Booking Status</button>
        <p>Booking Status: {bookingStatus}</p>
      </div>
    </div>
  );
};

export default TravelBooking;