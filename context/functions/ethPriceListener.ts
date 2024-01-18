import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";

//get eth price from firebase and listen for changes to eth price
export async function ethPriceListener(setEthPrice: (value: any) => void) {
  // Set up listener for changes to ethPrice
  // const ethPriceRef = doc(db, "data", "ethPrice");
  // const unsubscribe = onSnapshot(ethPriceRef, (doc) => {
  //   const newEthPrice = doc.data()?.priceUsd;
  //   setEthPrice(newEthPrice);
  // });
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  const data = await response.json();
  console.log(`The current price of Ethereum is: ${data.ethereum.usd} USD`);
  setEthPrice(data.ethereum.usd);

  // return () => {
  //   unsubscribe();
  // };
}
