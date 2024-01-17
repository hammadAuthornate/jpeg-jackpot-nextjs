//POT VALUE

import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { fetchPrices } from "./fetchPrices";

//gets current pot value from firebase
export async function getPotValue() {
  const jackpotValueRef = doc(db, "inventory/jackpot");
  const jackpotValueDoc = await getDoc(jackpotValueRef);
  const usdPrices = await fetchPrices();
  const usd = (jackpotValueDoc.data()?.pot_value * usdPrices.matic).toFixed(2);
  const matic = jackpotValueDoc.data()?.pot_value;
  return { matic, usd };
}
