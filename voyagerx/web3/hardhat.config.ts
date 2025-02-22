
import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_AMOY, PRIVATE_KEY, POLYGONSCAN_API } = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "amoy",
  solidity: "0.8.28",
  networks: {
    amoy: {
      url: RPC_URL_AMOY || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: `${POLYGONSCAN_API}`,
    },
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
