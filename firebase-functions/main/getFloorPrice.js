const functions = require("firebase-functions");
const { db } = require("../index.js");
const axios = require("axios");
const admin = require("firebase-admin");

// import functions from "firebase-functions";
// import { db } from "../index.js";
// import admin from "firebase-admin";
// import axios from "axios";

//get floor price (and other collection metadata) for collection
const getFloorPrice = functions.https.onRequest(async (req, res) => {
  const whitelistRef = db.collection("data").doc("whitelist_games");
  const whitelistSnapshot = await whitelistRef.get();
  const whitelistData = whitelistSnapshot.data();
  const whitelistDataArray = Object.entries(whitelistData);

  try {
    let batch = db.batch();
    for (const [index, slug] of Object.entries(whitelistDataArray)) {
      console.log(slug[1], "contract slug");

      const contractSlug = slug[1];
      console.log(
        `https://api.opensea.io/api/v2/collections/${contractSlug}/stats`
      );

      // Call the API to get the data
      const options = {
        method: "GET",
        headers: { "X-API-KEY": "8ebb2b4af48f4a978573b5a6071b9815" },
      };
      try {
        const response = await axios.get(
          `https://api.opensea.io/api/v2/collections/${contractSlug}/stats`,
          options
        );

        // check if the floor price is different than last time
        const currentFloorPriceRef = db
          .collection("data")
          .doc("prices")
          .collection("collections")
          .doc(contractSlug);
        const currentFloorPriceDoc = await currentFloorPriceRef.get();
        const responsePriceData = response.data.total;
        const newFloorPrice = responsePriceData.floor_price;

        if (currentFloorPriceDoc.exists) {
          const currentFloorPrice = currentFloorPriceDoc.data()?.floor_price;
          console.log(currentFloorPrice, "current floor price");
          console.log(newFloorPrice, "new floor price");

          if (newFloorPrice !== currentFloorPrice) {
            const docRef = db
              .collection("data")
              .doc("prices")
              .collection("collections")
              .doc(contractSlug);

            batch.set(
              docRef,
              {
                ...responsePriceData,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } else {
            console.log("floor price not updated, same as last update");
          }
        }

        if (!currentFloorPriceDoc.exists) {
          console.log("no current floor price doc exists, adding new one");
          const docRef = db
            .collection("data")
            .doc("prices")
            .collection("collections")
            .doc(contractSlug);

          batch.set(
            docRef,
            {
              ...responsePriceData,
              lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No data found for ${slug}. Skipping...`);
        } else {
          console.error(error);
        }
      }

      // Add the document to the batch
      const parsedIndex = parseInt(index);
      if (parsedIndex % 500 === 0) {
        await batch.commit();
        batch = db.batch();
      }

      // Delay between iterations
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Commit the remaining documents in the batch
    await batch.commit();
    // return true;
  } catch (error) {
    console.error(error);
  }
});

// export default getFloorPrice;
module.exports = getFloorPrice;
