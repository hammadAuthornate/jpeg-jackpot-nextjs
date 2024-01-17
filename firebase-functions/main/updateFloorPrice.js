const functions = require("firebase-functions");
const { db } = require("../index.js");
const getPricesFromFirestore = require("../functions/getPricesFromFirestore.js");

// import functions from "firebase-functions";
// import getPricesFromFirestore from "../functions/getPricesFromFirestore.js";
// import { db } from "../index.js";

//update all nfts in inventory when collection floor price changes
const updateFloorPrice = functions.firestore
  .document("data/prices/collections/{collection}")
  .onUpdate(async (change, context) => {
    const { floor_price, contractAddress } = change.after.data();
    const usdPrices = await getPricesFromFirestore();
    const ethPrice = usdPrices?.eth;
    const maticPrice = usdPrices?.matic;
    console.log(floor_price, "floor price");
    console.log(contractAddress, "contract address");
    const inventoryRef = db.collection("inventory");
    const inventoryDocs = await inventoryRef.get();

    inventoryDocs.forEach(async (inventoryDoc) => {
      console.log(inventoryDoc.data(), "inventory doc");
      const nftsRef = inventoryDoc.ref.collection("nfts");
      const nftsQuery = nftsRef.where("token_address", "==", contractAddress);
      const nftsDocs = await nftsQuery.get();
      nftsDocs.forEach(async (nftDoc) => {
        const data = nftDoc.data();
        const floor_price_symbol = data.floor_price_symbol;
        const tokenId = data.tokenId;
        const name = data.name;
        console.log("updating " + name + " #" + tokenId);
        const { floor_price: currentFloorPrice } = nftDoc.data();
        const newFloorPrice = floor_price.toFixed(4);
        let floor_price_usd;
        if (floor_price_symbol === "ETH") {
          floor_price_usd = (newFloorPrice * ethPrice).toFixed(4);
        }
        if (floor_price_symbol === "MATIC") {
          floor_price_usd = (newFloorPrice * maticPrice).toFixed(4);
        }
        console.log("floor price", newFloorPrice);
        console.log("current floor price", currentFloorPrice);

        if (currentFloorPrice !== newFloorPrice) {
          console.log("updating floor price");
          await nftDoc.ref.update({
            newFloorPrice,
            floor_price_usd,
          });
        }
      });
    });
  });

// export default updateFloorPrice;
module.exports = updateFloorPrice;
