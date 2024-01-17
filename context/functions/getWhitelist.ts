import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

//gets collection whitelist stored in firebase
export async function getWhitelist() {
  const whitelistRef = doc(db, "/data/whitelist_games");
  const whitelistDoc = await getDoc(whitelistRef);
  const whitelist = whitelistDoc.data();
  return whitelist;
}
