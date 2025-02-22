"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, mainnet, baseSepolia, polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const { wallets } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "1d7ddc51b6650f8f4ff65718459d3c6b",
});

const chains = [sepolia, mainnet, baseSepolia, polygonAmoy] as const;

const config = createConfig({
  chains,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}