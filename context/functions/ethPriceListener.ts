import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";

//get eth price from firebase and listen for changes to eth price
export function ethPriceListener(setEthPrice: (value: any) => void) {
  // Set up listener for changes to ethPrice
  const ethPriceRef = doc(db, "data", "ethPrice");
  const unsubscribe = onSnapshot(ethPriceRef, (doc) => {
    const newEthPrice = doc.data()?.priceUsd;
    setEthPrice(newEthPrice);
  });

  return () => {
    unsubscribe();
  };
}
