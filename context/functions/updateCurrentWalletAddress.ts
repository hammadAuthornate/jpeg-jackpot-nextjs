import { onAuthStateChanged } from "firebase/auth";
import { auth, moralisAuth } from "../Firebase";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";
// import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

// update current user inventory and user auth when user changes wallet in metamask
export const updateCurrentWalletAddress = async (
  setFirebaseUserNfts: (value: any) => void,
  setMoralisAuthAddress: (value: any) => void,
  setWalletAddress: (value: any) => void,
  address: `0x${string}` | undefined,
  isConnected: boolean
) => {
  // const { address, isConnected } = useWeb3ModalAccount();
  if (isConnected) {
    const lowercaseUserAddress = address?.toLowerCase();
    setFirebaseUserNfts([]);
    setWalletAddress(lowercaseUserAddress || "");
    let isUserLoggedIn = false;
    onAuthStateChanged(auth, (user) => {
      const authedUser = user?.displayName?.toLowerCase();
      if (
        authedUser &&
        authedUser === lowercaseUserAddress &&
        !isUserLoggedIn
      ) {
        setMoralisAuthAddress(authedUser);
        isUserLoggedIn = true;
      } else if (!isUserLoggedIn) {
        console.log("logging in...");
        // login();
        login(setMoralisAuthAddress);

        isUserLoggedIn = true;
      }
    });
  }
};

async function login(setMoralisAuthAddress: (value: any) => void) {
  // const res = await signInWithMoralis(moralisAuth);
  // console.log(
  //   "logging you in... USER: " +
  //     res.credentials.user.uid +
  //     ", " +
  //     res.credentials.user.displayName
  // );
  // setMoralisAuthAddress(res?.credentials?.user?.displayName?.toLowerCase());
  // return res;
}
