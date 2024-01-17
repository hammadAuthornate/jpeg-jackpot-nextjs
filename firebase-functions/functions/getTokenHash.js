const { db } = require("../index.js");

async function getTokenHash(txn) {
  const query = db
    .collection("inventory")
    .doc(txn.to)
    .collection("nfts")
    .where("token_address", "==", txn.contract)
    .where("tokenId", "==", txn.tokenId);
  const snapshot = await query.get();
  if (snapshot.empty) {
    console.log("No matching documents for getTokenHash.");
    return null;
  } else {
    const doc = snapshot.docs[0].data();
    const token_hash = doc.token_hash;
    return token_hash;
  }
}
module.exports = getTokenHash;
