import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../Firebase";
import { fetchPrices } from "./fetchPrices";

// Function to set up the onSnapshot listener for a user's inventory data from firebase
export function setupInventoryListener(
  userAdd: string,
  setFirebaseUserNfts: (value: any) => void
) {
  const userQuery = query(collection(db, `/inventory/${userAdd}/nfts`));
  const unsubscribe = onSnapshot(userQuery, async (querySnapshot) => {
    const tempTxs: any[] = [];
    const usdPrices = await fetchPrices();
    querySnapshot.forEach((doc) => {
      const nftData = doc.data();
      const floor_price_usd_fe = (
        nftData.floor_price *
        (nftData.floor_price_symbol === "MATIC"
          ? usdPrices.matic
          : usdPrices.eth)
      ).toFixed(2);
      const nftWithPrice = { ...nftData, floor_price_usd_fe };
      tempTxs.push(nftWithPrice);
    });
    setFirebaseUserNfts(tempTxs);
  });
  return unsubscribe;
}
