const admin = require("firebase-admin");

//get eth price from firebase (updated by scheduled function every 10 minutes)
async function getPricesFromFirestore() {
  try {
    // Get the Ethereum price from Firestore
    const docRef = admin.firestore().collection("data").doc("coinPrices");
    const doc = await docRef.get();
    const ethPrice = doc.data().ethPrice;
    const maticPrice = doc.data().maticPrice;

    // Return the Ethereum price
    return { eth: ethPrice, matic: maticPrice };
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = getPricesFromFirestore;
