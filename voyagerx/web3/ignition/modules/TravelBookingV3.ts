import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for the contract
  const TravelBooking = await ethers.getContractFactory("TravelBookingV3");

  console.log("Deploying TravelBookingV3...");
  const travelBooking = await TravelBooking.deploy();

  // Wait for the deployment to complete
  await travelBooking.waitForDeployment();

  // Get the deployed contract's address
  const contractAddress = await travelBooking.getAddress();
  console.log("TravelBookingV3 deployed to:", contractAddress);
}

// Proper error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });