import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import { updateNfts } from "./updateNfts";

//get collection price from firebase and listen for changes to collection floor price, if it changes, update floor_price
export function collectionPriceListener(
  moralisUserNfts: nftDetails[],
  setMoralisUserNfts: (value: any) => void,
  ethPrice: number
) {
  const collectionPriceRef = doc(
    db,
    "data",
    "prices",
    "collections",
    "the-croak" //change this to relevant collection name
  );
  if (moralisUserNfts.length > 0) {
    updateNfts(
      moralisUserNfts,
      setMoralisUserNfts,
      0, // TODO: replace with actual FLoor price
      ethPrice
    );
  }
  // const unsubscribe = onSnapshot(collectionPriceRef, (doc) => {
  //   const newFloorPrice = doc.data()?.floor_price;

  //   if (moralisUserNfts.length > 0) {
  //     updateNfts(moralisUserNfts, setMoralisUserNfts, newFloorPrice, ethPrice);
  //   }
  // });

  // return () => {
  //   unsubscribe();
  // };
}
