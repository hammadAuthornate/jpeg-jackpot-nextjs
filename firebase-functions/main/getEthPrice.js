const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

// import functions from "firebase-functions";
// import axios from "axios";
// import admin from "firebase-admin";

//get eth price from coingecko api and store in firestore (function used for 10 minute scheduled function)
const getEthPrice = functions.https.onRequest(async (req, res) => {
  try {
    // Make the API request to get the Ethereum price
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cmatic-network&vs_currencies=usd"
    );
    const ethPrice = response.data.ethereum.usd;
    const maticPrice = response.data["matic-network"].usd;
    // Store the Ethereum price and timestamp in a Firestore document
    const docRef = admin.firestore().collection("data").doc("coinPrices");
    await docRef.set({
      ethPrice: ethPrice,
      maticPrice: maticPrice,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    // Set CORS headers to allow cross-origin requests
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Return a success response to the client with CORS headers
    res
      .status(200)
      .send({ message: `Ethereum price stored in Firestore: ${ethPrice}` });
  } catch (error) {
    console.error(error);
    res.status(500).send("API call failed");
  }
});

// export default getEthPrice;
module.exports = getEthPrice;
