"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, localhost, goerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";

import { PageContext } from "@/constants";
import { useEffect, useState } from "react";

// import useLogin from "@web3mq/react-components/dist/components/LoginModal/hooks/useLogin";
import { useWeb3MQLogin } from "@/hooks/useWeb3MQLogin";
import { Client } from "@web3mq/client";


const { chains, publicClient } = configureChains(
  [mainnet, goerli, localhost],
  [
    // alchemyProvider({ apiKey: "9YgeEGzcchHnmV5Pbq_2TN7ixqG66fk9" }),
    infuraProvider({ apiKey: "d40befbb065a486496e2f48683fc773a" }),
    publicProvider(),
  ]
);
const projectId = "0bc1c433f1d67f1c14da9bd46c051021";

const { wallets } = getDefaultWallets({
  appName: "Fuck ALL",
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);


const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [client, setClient] = useState<Client>();


  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <PageContext.Provider
          value={{ room, setRoom, logs, pushLog: (log) => setLogs([log, ...logs]), web3mqClient: client, setWeb3mqClient: setClient }}
        >
          {children}
        </PageContext.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
