import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

export const fetchPrices = async () => {
  const pricesDoc = await getDoc(doc(collection(db, "data"), "coinPrices"));
  const pricesData = pricesDoc.data();
  return { eth: pricesData?.ethPrice, matic: pricesData?.maticPrice };
};
