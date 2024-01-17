import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

//function to get nft collection data for all collections from firebase
export async function getCollectionData() {
  const collectionRef = collection(db, "data/prices/collections");
  const querySnapshot = await getDocs(collectionRef);
  const data: any[] = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
}
