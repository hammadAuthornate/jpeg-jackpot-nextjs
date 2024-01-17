const { db } = require("../index.js");

// import { db } from "../index.js";
async function getCollectionData(contractAddress) {
  const whitelistRef = db.collection("data").doc("whitelist_games");
  const whitelistDoc = await whitelistRef.get();
  const whitelistData = whitelistDoc.data();
  const slug = whitelistData[contractAddress];
  if (slug) {
    const collectionDataRef = db
      .collection("data")
      .doc("prices")
      .collection("collections")
      .doc(slug);
    const collectionDataDoc = await collectionDataRef.get();
    const collectionData = collectionDataDoc.data();
    return { ...collectionData, slug };
  } else {
    throw new Error(`No slug found for address ${contractAddress}`);
  }
}

module.exports = getCollectionData;
