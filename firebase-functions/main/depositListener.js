const functions = require("firebase-functions");
const { db } = require("../index.js");
const getCollectionData = require("../functions/getCollectionData.js");
const getPricesFromFirestore = require("../functions/getPricesFromFirestore.js");

// import functions from "firebase-functions";
// import { db } from "../index.js";
// import getCollectionData from "../functions/getCollectionData.js";
// import getPricesFromFirestore from "../functions/getPricesFromFirestore.js";
const Moralis = require("moralis").default;

//listens for new nft transfers to vault, and adds them to user inventory (backend of client side deposit function)
const depositListener = functions.firestore
  .document(`moralis/nftTransfers/Vault_test_polysep/{id}`)
  .onCreate(async (change, context) => {
    //currently NOT waiting for 2nd chain confirmation from moralis before updating firebase (onUpdate would do this, or some conditional)
    const txn = change.data();
    const vaultAddress = "0x51cB35800f8dcb2CF86f693f76665C21F04A0cFe";
    const lowerVaultAddress = vaultAddress.toLowerCase();
    const usdPrices = await getPricesFromFirestore();
    const tokenId = txn.tokenId;
    const contractAddress = txn.contract;
    console.log(usdPrices, "prices usd from firestore");

    //check if nft is in any collection

    if (txn.to === lowerVaultAddress) {
      console.log("DEPOSIT - txn.to is vault"); //if txn.to address is vault, its a deposit
      try {
        //check if nft is in any whitelisted collection
        console.log(contractAddress, "contract address");
        const collectionData = await getCollectionData(contractAddress);
        //get collection data
        console.log(`collection data pulled from firestore: `, collectionData);

        if (!collectionData) {
          console.log("error thrown: nft not in any collection");
          throw new functions.https.HttpsError(
            "aborted",
            "deposit rejected: nft not in a whitelisted collection"
          );
        } else {
          console.log("deposit accepted: nft is in a whitelisted collection");
        }

        console.log(txn, "txn data");

        //start moralis api
        if (!Moralis.Core.isStarted) {
          await Moralis.start({
            apiKey:
              "NBqiXKjFgj9TzaKbhGlNOgqlb5dIhZwediIlxSdRGDsYvE0QZGBTbccoNV7N92id",
          });
        }

        // get metadata on the nft transferred (eventually store this in firebase)
        const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
          address: contractAddress,
          tokenId: tokenId,
          chain: "0x89",
        });
        const nft = response.raw.result[0];
        const nftMetadataString = nft.metadata;
        const nftMetadataObject = JSON.parse(nftMetadataString);
        //const nftAttributes = nftMetadataObject.attributes;
        const nftImage = nftMetadataObject.image;
        const nftName = nftMetadataObject.name;

        // store nft data in firebase - mix of txn and nft metadata from moralis
        const nftData = {
          current_owner: txn.from,
          name: nft.name,
          tokenId: tokenId,
          //attributes: nftAttributes,
          meta_name: nftName,
          image: nftImage,
          token_address: nft.token_address,
          owner_of: nft.owner_of,
          token_uri: nft.token_uri,
          token_hash: nft.token_hash,
          from: txn.from,
          in_pot: false,
          transactionHash: txn.transactionHash,
          updatedAt: txn.updatedAt,
          floor_price_symbol: collectionData.floor_price_symbol,
          floor_price: collectionData.floor_price,
          floor_price_usd: (
            collectionData.floor_price *
            (collectionData.floor_price_symbol === "ETH"
              ? usdPrices?.eth
              : usdPrices?.matic)
          ).toFixed(2),
          contractType: txn.tokenContractType,
          amount: txn.amount,
          slug: collectionData.slug,
        };

        //set the new NFT in user inventory, with data built from above object from the moralis response
        const docRefDepositor = db
          .collection("inventory")
          .doc(txn.from)
          .collection("nfts")
          .doc(nft.token_hash);

        await docRefDepositor.set(nftData);
        // add userAddress field to the 'inventory' document if it doesn't exist
        const inventoryDocRef = db.collection("inventory").doc(txn.from);
        const inventoryDoc = await inventoryDocRef.get();
        if (!inventoryDoc.data()?.userAddress) {
          await inventoryDocRef.set({ userAddress: txn.from }, { merge: true });
        }

        return;
      } catch (error) {
        console.log(error);
      }
    }
  });

// export default depositListener;
module.exports = depositListener;
