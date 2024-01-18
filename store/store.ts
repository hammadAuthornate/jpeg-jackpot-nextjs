import { createContext, useContext } from "react";
import { createStore, useStore as useZustandStore } from "zustand";
import { PreloadedStoreInterface } from "./StoreProvider";
import { auth, moralisAuth } from "@/context/Firebase";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";

export interface StoreInterface {
  tabs: {
    name: string;
    href: string;
    current: boolean;
  }[];
  setTabs: (value: any[]) => void;

  hoveredNft: string | null;
  setHoveredNft: (value: string | null) => void;

  potValue: string | number | null;
  setPotValue: (value: string | number | null) => void;

  moralisUserNfts: nftDetails[];
  setMoralisUserNfts: (value: nftDetails[]) => void;

  moralisVaultNfts: nftDetails[];
  setMoralisVaultNfts: (value: nftDetails[]) => void;

  firebaseUserNfts: nftDetails[];
  setFirebaseUserNfts: (value: nftDetails[]) => void;

  firebaseVaultNfts: nftDetails[];
  setFirebaseVaultNfts: (value: nftDetails[]) => void;

  firebaseJackpotNfts: nftDetails[];
  setFirebaseJackpotNfts: (value: nftDetails[]) => void;

  showJackpotModal: boolean;
  setShowJackpotModal: (value: boolean) => void;

  firebaseJackpotNftsModal: any[];
  setFirebaseJackpotNftsModal: (value: any[]) => void;

  activeNft: nftDetails | null;
  setActiveNft: (value: nftDetails | null) => void;

  endTime: string | null;
  setEndTime: (value: string) => void;

  timeLeft: string | number | null;
  setTimeLeft: (value: string | number) => void;

  ethPrice: number | null;
  setEthPrice: (value: number | null) => void;

  chartData: any[];
  setChartData: (value: any[]) => void;

  tickerData: any[];
  setTickerData: (value: any[]) => void;

  lastWinner: string | null;
  setLastWinner: (value: string) => void;

  winningTicketIndex: string | null;
  setWinningTicketIndex: (value: string) => void;

  winningTicketOwner: string | null;
  setWinningTicketOwner: (value: string) => void;

  user: any; //for firebase userAuthmoralis

  MoralisAuthAddress: string | null; //for firebase userAuthmoralis
  setMoralisAuthAddress: (value: string) => void;

  provider: any | null;
  setProvider: (value: any) => void;

  userSigner: any;
  setUserSigner: (value: any) => void;

  walletAddress: string | null;
  setWalletAddress: (value: string) => void;
}

export type StoreType = ReturnType<typeof initializeStore>;

const storeContext = createContext<StoreType | null>(null);

export const Provider = storeContext.Provider;

export function useStore<T>(selector: (state: StoreInterface) => T) {
  const store = useContext(storeContext);

  if (!store) throw new Error("Store is missing the provider");

  return useZustandStore(store, selector);
}

export function initializeStore() {
  return createStore<StoreInterface>((set, get) => ({
    tabs: [
      { name: "your wallet", href: "#", current: false },
      { name: "your inventory", href: "##", current: false },
      { name: "current pot", href: "##", current: true },
    ],
    setTabs: (value: any[]) => set((state) => ({ tabs: value })),

    hoveredNft: "",
    setHoveredNft: (value: string | null) =>
      set((state) => ({ hoveredNft: value })),

    potValue: null,
    setPotValue: (value: string | number | null) =>
      set((state) => ({ potValue: value })),

    moralisUserNfts: [],
    setMoralisUserNfts: (value: nftDetails[]) =>
      set((state) => ({ moralisUserNfts: value })),

    moralisVaultNfts: [],
    setMoralisVaultNfts: (value: nftDetails[]) =>
      set((state) => ({ moralisVaultNfts: value })),

    firebaseUserNfts: [],
    setFirebaseUserNfts: (value: nftDetails[]) =>
      set((state) => ({ firebaseUserNfts: value })),

    firebaseVaultNfts: [],
    setFirebaseVaultNfts: (value: nftDetails[]) =>
      set((state) => ({ firebaseVaultNfts: value })),

    firebaseJackpotNfts: [],
    setFirebaseJackpotNfts: (value: nftDetails[]) =>
      set((state) => ({ firebaseJackpotNfts: value })),

    showJackpotModal: false,
    setShowJackpotModal: (value: boolean) =>
      set((state) => ({ showJackpotModal: value })),

    firebaseJackpotNftsModal: [],
    setFirebaseJackpotNftsModal: (value: any[]) =>
      set((state) => ({ firebaseJackpotNftsModal: value })),

    activeNft: null,
    setActiveNft: (value: nftDetails | null) =>
      set((state) => ({ activeNft: value })),

    endTime: null,
    setEndTime: (value: string) => set((state) => ({ endTime: value })),

    timeLeft: null,
    setTimeLeft: (value: string | number) =>
      set((state) => ({ timeLeft: value })),

    ethPrice: null,
    setEthPrice: (value: number | null) =>
      set((state) => ({ ethPrice: value })),

    chartData: [],
    setChartData: (value: any[]) => set((state) => ({ chartData: value })),

    tickerData: [],
    setTickerData: (value: any[]) => set((state) => ({ tickerData: value })),

    lastWinner: null,
    setLastWinner: (value: string) => set((state) => ({ lastWinner: value })),

    winningTicketIndex: null,
    setWinningTicketIndex: (value: string) =>
      set((state) => ({ winningTicketIndex: value })),

    winningTicketOwner: null,
    setWinningTicketOwner: (value: string) =>
      set((state) => ({ winningTicketOwner: value })),

    user: null,

    MoralisAuthAddress: null,
    setMoralisAuthAddress: (value: string) =>
      set((state) => ({ MoralisAuthAddress: value })),
    //login and logout from firebase auth triggered when wallet connects/disconnects

    provider: null,
    setProvider: (value: any) => set((state) => ({ provider: value })),

    userSigner: "",
    setUserSigner: (value: any) => set((state) => ({ userSigner: value })),

    walletAddress: null,
    setWalletAddress: (value: string) =>
      set((state) => ({ walletAddress: value })),
  }));
}
