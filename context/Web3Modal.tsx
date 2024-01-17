"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId
const projectId = "4b9171b000864a8ec981668dbc23118e";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const chains = [1, 137]; //from previous project

// 3. Create modal
const metadata = {
  name: "jpeg jackpot",
  description: "jpeg",
  url: "https://jpegjackpot.com",
  icons: ["images/favicon.png"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
  themeVariables: {
    "--w3m-color-mix": "#000000",
    "--w3m-color-mix-strength": 10,
  },
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
