
require("@nomicfoundation/hardhat-ethers");

const { ethers } = require("hardhat");

async function main() {
  // Get the ContractFactory for the contract
  const Booking = await ethers.deployContract("TravelBooking");

  console.log("Deploying Booking...");

  // Wait for the deployment to complete
  await Booking.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await Booking.getAddress();
  console.log("Booking deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
