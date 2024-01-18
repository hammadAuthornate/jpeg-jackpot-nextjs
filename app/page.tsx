"use client";
import { db } from "@/context/Firebase";
import { playSound, soundsLibrary } from "@/context/SoundLibrary";
import { collectionPriceListener } from "@/context/functions/collectionPriceListener";
import { ethPriceListener } from "@/context/functions/ethPriceListener";
import { fetchPrices } from "@/context/functions/fetchPrices";
import { getPotValue } from "@/context/functions/getPotValue";
import { getWhitelistedUserNfts } from "@/context/functions/getWhitelistedUserNfts";
import { setupInventoryListener } from "@/context/functions/setupInventoryListener";
import { updateCurrentWalletAddress } from "@/context/functions/updateCurrentWalletAddress";
import { useStore } from "@/store/store";
import { EvmAddress, EvmChain } from "@moralisweb3/common-evm-utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import {
  DocumentData,
  Unsubscribe,
  collection,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import Moralis from "moralis";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useShallow } from "zustand/react/shallow";
import BaseLayout from "./components/BaseLayout";
import ConnectButton from "./components/ConnectButton";
import DataDougnut from "./components/DataDougnut";
import JackpotModal from "./components/Modals/JackpotModal";
import ActiveNftCurrentPot from "./components/Sidebar/ActiveNftCurrentPot";
import ActiveNftFirebaseWallet from "./components/Sidebar/ActiveNftFirebaseWallet";
import ActiveNftMoralisWallet from "./components/Sidebar/ActiveNftMoralisWallet";
import CurrentPotDetails from "./components/Tab/CurrentPotDetails";
import FirebaseUserWallet from "./components/Tab/FirebaseUserWallet";
import MoralisUserWallet from "./components/Tab/MoralisUserWallet";
import Tabs from "./components/Tab/Tabs";

export default function Home() {
  const { walletProvider, walletProviderType } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const {
    firebaseUserNfts,
    firebaseJackpotNfts,
    activeNft,
    setActiveNft,
    tabs,
    setUserSigner,
    setProvider,
    setPotValue,
    provider,
    setFirebaseUserNfts,
    setMoralisAuthAddress,
    setWalletAddress,
    moralisAuthAddress,
    walletAddress,
    setMoralisUserNfts,
    setEthPrice,
    moralisUserNfts,
    ethPrice,
    endTime,
    setEndTime,
    timeLeft,
    setTimeLeft,
    setLastWinner,
    setShowJackpotModal,
    setTickerData,
    setFirebaseJackpotNftsModal,
    setFirebaseJackpotNfts,
    setChartData,
  } = useStore(
    useShallow((store) => ({
      firebaseUserNfts: store.firebaseUserNfts,
      firebaseJackpotNfts: store.firebaseJackpotNfts,
      activeNft: store.activeNft,
      setActiveNft: store.setActiveNft,
      tabs: store.tabs,
      setUserSigner: store.setUserSigner,
      setProvider: store.setProvider,
      setPotValue: store.setPotValue,
      provider: store.provider,
      setFirebaseUserNfts: store.setFirebaseUserNfts,
      setMoralisAuthAddress: store.setMoralisAuthAddress,
      setWalletAddress: store.setWalletAddress,
      moralisAuthAddress: store.MoralisAuthAddress,
      walletAddress: store.walletAddress,
      setMoralisUserNfts: store.setMoralisUserNfts,
      setEthPrice: store.setEthPrice,
      moralisUserNfts: store.moralisUserNfts,
      ethPrice: store.ethPrice,
      endTime: store.endTime,
      setEndTime: store.setEndTime,
      timeLeft: store.timeLeft,
      setTimeLeft: store.setTimeLeft,
      setLastWinner: store.setLastWinner,
      setShowJackpotModal: store.setShowJackpotModal,
      setTickerData: store.setTickerData,
      setFirebaseJackpotNftsModal: store.setFirebaseJackpotNftsModal,
      setFirebaseJackpotNfts: store.setFirebaseJackpotNfts,
      setChartData: store.setChartData,
    }))
  );

  // NFTs array
  useEffect(() => {
    if (firebaseUserNfts.length > 0) setActiveNft(firebaseUserNfts[0]);

    return () => setActiveNft(null);
  }, []);

  //setting web3 instance to state
  useEffect(() => {
    // async function getSigner() {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum!);
    //   await provider.send("eth_requestAccounts", []);
    //   const signer = provider.getSigner();
    //   return signer;
    // }
    const setSignerAndProvider = async () => {
      // const signer = await getSigner();
      // setUserSigner(signer);
      setUserSigner(walletProviderType);
      setProvider(walletProvider);
    };

    setSignerAndProvider();
  }, [isConnected]);

  // set listener for changes to wallet address
  useEffect(() => {
    updateCurrentWalletAddress(
      setFirebaseUserNfts,
      setMoralisAuthAddress,
      setWalletAddress,
      address,
      isConnected
    );
  }, [provider]);

  //NFTS & FLOOR PRICE
  //start moralis and get NFTs from user wallet
  useEffect(() => {
    // const startMoralis = async () => {
    //   if (!Moralis.Core.isStarted) {
    //     Moralis.Auth.setup();
    //     await Moralis.start({
    //       apiKey: process.env.NEXT_PUBLIC_MORALIS_API,
    //       // buidEnvironment: "browser",
    //       maxRetries: 5,
    //       // ...and any other configuration
    //     })
    //       .then((data) => console.log(data))
    //       .catch((error) => console.log(error));
    //   }
    // };
    // startMoralis();
    fetch("/");
  }, []);

  useEffect(() => {
    const fetchMoralisData = async () => {
      if (moralisAuthAddress) {
        try {
          const userAddress = await walletAddress?.toString();
          // const vaultAddress = await vaultWallet;
          const chain = EvmChain.POLYGON;
          const userNftResponse = await Moralis.EvmApi.nft.getWalletNFTs({
            address: userAddress!,
            chain,
          });
          //get whitelisted nft list for display
          const whitelistedUserNfts = await getWhitelistedUserNfts(
            userNftResponse?.result
          );
          setMoralisUserNfts(whitelistedUserNfts!);
        } catch (e) {
          console.log("error fetching data");
          console.error(e);
        }
      }
    };
    fetchMoralisData();
  }, [moralisAuthAddress]); //adjust this so it updates everytime page loads? or update without refresh but with counter instead?

  //set up eth and collection price listeners on mount, clean up on unmount
  useEffect(() => {
    const unsubscribeEthPrice = ethPriceListener(setEthPrice);
    const unsubscribeCollectionPrice = collectionPriceListener(
      moralisUserNfts,
      setMoralisUserNfts,
      ethPrice!
    );
    // Clean up function
    return () => {
      unsubscribeEthPrice();
      unsubscribeCollectionPrice();
    };
  }, []);

  useEffect(() => {
    async function fetchPotValue() {
      const potValue = await getPotValue();
      setPotValue(potValue.matic);
    }
    fetchPotValue();
  }, []);

  // NFTs array, sets the default active nft on user's nft load
  useEffect(() => {
    if (firebaseUserNfts.length > 0) setActiveNft(firebaseUserNfts[0]);
    return () => setActiveNft(null);
  }, []);

  // Set up the onSnapshot listener for the currently connected wallet
  useEffect(() => {
    // check that wallet is connected
    if (
      moralisAuthAddress?.length! > 0 &&
      walletAddress?.length! > 0 &&
      moralisAuthAddress?.toLowerCase() == walletAddress!.toLowerCase()
    ) {
      const userAdd = walletAddress?.toLowerCase(); //user wallet address for firebase, case sensitive
      // Set up the onSnapshot listener for the current user's inventory data
      const unsubscribe = setupInventoryListener(userAdd!, setFirebaseUserNfts);
      // Clean up the onSnapshot listener when the component unmounts
      return () => {
        unsubscribe();
      };
    } else {
      // Clear the user's Firebase NFTs from the frontend
      setFirebaseUserNfts([]);
    }
  }, [moralisAuthAddress]);

  //JACKPOT

  //keep jackpot counter on client side synced with server timer
  useEffect(() => {
    const endTimeRef = doc(collection(db, "inventory"), "jackpot");
    // Listen for updates to the end time from the server
    const unsubscribe = onSnapshot(endTimeRef, (doc: any) => {
      const data = doc.data();
      const endTime = data && data.end_time ? data.end_time.toDate() : null;
      setEndTime(endTime);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  //calculates client side timer based on firebase jackpot timer endtime
  useEffect(() => {
    if (endTime) {
      // Calculate the time left until the end time
      const intervalId = setInterval(() => {
        const now = new Date();
        const endTimeDate = endTime as unknown as Date; //converted string to date to get time
        const diff = endTimeDate.getTime() - now.getTime();
        const secondsLeft = Math.max(Math.floor(diff / 1000), 0);
        setTimeLeft(secondsLeft);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [endTime]);

  //if timer runs out, set firebase jackpot nfts to modal nfts (to save for modal display)
  useEffect(() => {
    if (timeLeft === 0) {
      setFirebaseJackpotNftsModal(firebaseJackpotNfts);
      setTickerData([]);
    }
  }, [timeLeft]);

  // listen for "last winner" from firebase, set to state, and display in jackpot modal
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    let initialData: DocumentData | undefined;
    const lastWinnerDocRef = doc(db, "inventory", "lastWinner");
    unsubscribe = onSnapshot(lastWinnerDocRef, (doc) => {
      const data = doc.data();
      const winnerAddress = data && data.address ? data.address : null;
      if (initialData) {
        //if initial data is initialized but undefined (on page load), then just define initialData as data. if initialData is already defined, then let listener display jackpot modal
        setLastWinner(winnerAddress);
        setShowJackpotModal(true);
        playSound(soundsLibrary.on_win);
      } else {
        initialData = data;
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Set up the onSnapshot listener for the jackpot inventory data
  useEffect(() => {
    const jackpotAdd = "jackpot"; // Firebase collection for jackpot, case sensitive
    const jackpotQuery = query(collection(db, `inventory/${jackpotAdd}/nfts`));
    const unsubscribe = onSnapshot(jackpotQuery, async (querySnapshot) => {
      const tempTxs: any = [];
      const usdPrices = await fetchPrices();
      //build tempTxs from firebase, to set for firebaseJackpotNfts and chartData
      querySnapshot.forEach((doc) => {
        const nft = doc.data();
        const floor_price_usd_fe = (nft.floor_price * usdPrices.matic).toFixed(
          2
        );
        nft.floor_price_usd_fe = floor_price_usd_fe;
        tempTxs.push(nft);
      });
      //set chartData with tempTxs
      const inventory = tempTxs;
      const potValueRef = doc(db, "inventory/jackpot");
      //can this be replaced with getPotValue function?
      onSnapshot(potValueRef, (doc) => {
        const potValue = doc.data()?.pot_value;
        //@ts-ignore
        const nftsByOwner = inventory.reduce((acc, nft) => {
          const owner = nft?.current_owner;
          if (!acc[owner]) {
            acc[owner] = [];
          }
          acc[owner].push(nft);
          return acc;
        }, {});
        const chartData = Object.entries(nftsByOwner).map(([owner, nfts]) => {
          //@ts-ignore
          const totalValue = nfts.reduce((acc, nft) => {
            return acc + nft.floor_price;
          }, 0);
          const percentage =
            potValue === 0 ? 100 : (totalValue / potValue) * 100;
          return { owner, percentage, totalValue };
        });
        //set state with temptxs data from firebase
        setChartData(chartData);
        setFirebaseJackpotNfts(tempTxs);
        setActiveNft(tempTxs[0]);
        setEthPrice(usdPrices.eth);
        // Add a check to ensure that console.log() is only called once per snapshot
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //set up listener for bet ticker
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ticker"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      const tickerDataDescending = [...data].sort(
        //@ts-ignore
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTickerData(tickerDataDescending);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <BaseLayout>
        {/* <Timer sendWinner={sendWinner} setSendWinner={setSendWinner} /> */}
        <div className=" relative h-full flex ">
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-900 ">
            {/* <div className="absolute right-0 top-0 z-50 "> */}
            <ConnectButton />
            {/* </div> */}
            <div className="flex-1 flex items-stretch overflow-hidden bg-stone-900">
              <main className="flex-1 overflow-hidden bg-stone-900">
                <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-stone-900">
                  <JackpotModal />
                  <div className="flex">
                    {firebaseJackpotNfts?.length! > 0 && (
                      <div
                        style={{ width: "500px", height: "500px" }}
                        className="w-96 h-96 ml-32 mb-8"
                      >
                        {true ? <DataDougnut /> : <p>Loading chart data...</p>}
                      </div>
                    )}
                    {firebaseJackpotNfts?.length === 0 && (
                      <div
                        style={{ width: "500px", height: "500px" }}
                        className="w-96 h-96 ml-32 mb-8 bg-stone-900"
                      >
                        <img src="../images/coin.gif" alt="Image description" />
                        <span className="flex-1 text-2xl font-bold text-stone-400 ml-32">
                          waiting for 1st bet...
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-2">
                    <div className="hidden sm:block">
                      <div className="flex items-center border-b border-stone-800">
                        <nav
                          className="flex-1 flex space-x-6 xl:space-x-8"
                          aria-label="Tabs"
                        >
                          <Tabs />
                        </nav>
                      </div>
                    </div>
                  </div>
                  <section
                    className="mt-8 pb-16"
                    aria-labelledby="gallery-heading"
                  >
                    {tabs[0].current && <MoralisUserWallet />}
                    {tabs[1].current && <FirebaseUserWallet />}
                    {tabs[2].current && <CurrentPotDetails />}
                  </section>
                </div>
              </main>
              {/* Details sidebar */}
              <aside className="hidden w-96 p-8 border-l border-stone-800 overflow-hidden lg:block bg-stone-900">
                {activeNft && tabs[0].current && <ActiveNftMoralisWallet />}
                {activeNft &&
                  tabs[1].current &&
                  firebaseUserNfts!.length > 0 && <ActiveNftFirebaseWallet />}
                {activeNft && tabs[2].current && <ActiveNftCurrentPot />}
              </aside>
            </div>
          </div>
        </div>
        {/* <ToastContainer /> */}
      </BaseLayout>
    </>
  );
}
