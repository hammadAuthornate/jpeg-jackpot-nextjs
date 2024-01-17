const functions = require("firebase-functions");
const { db } = require("../index.js");
// import functions from "firebase-functions";
// import { db } from "../index.js";

//returns nft from jackpot to user inventory (user presses 'return' button, http call)
const removeNftFromJackpot = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User is not authenticated."
    );
  }

  const nft = data.nft;
  const userId = context.auth.uid;
  console.log(userId, "userId");
  const userRef = db.collection("userUID").doc(userId);
  const userDoc = await userRef.get();
  const walletAddress = userDoc.data()?.walletAddress.toLowerCase();

  const jackpotNftRef = db
    .collection("inventory")
    .doc("jackpot")
    .collection("nfts")
    .doc(nft.token_hash);
  const jackpotNftDoc = await jackpotNftRef.get();

  if (
    walletAddress === nft.current_owner.toLowerCase() &&
    walletAddress === jackpotNftDoc.data()?.current_owner.toLowerCase()
  ) {
    // Set nft to user inventory
    await db.doc(`inventory/${walletAddress}/nfts/${nft.token_hash}`).set(nft);

    // Adjust current_owner field in new nft entry to winner's address
    await db.doc(`inventory/${walletAddress}/nfts/${nft.token_hash}`).update({
      in_pot: false,
    });

    // Remove nft from jackpot inventory
    await db.doc(`inventory/jackpot/nfts/${nft.token_hash}`).delete();

    const jackpotDoc = await db.collection("inventory").doc("jackpot").get();
    const pot_value = jackpotDoc.data()?.pot_value;
    const new_pot_value = parseFloat(pot_value) - parseFloat(nft.floor_price);
    const updated_pot_value = new_pot_value;
    await db
      .collection("inventory")
      .doc("jackpot")
      .update({ pot_value: updated_pot_value });

    return { message: "NFT removed from jackpot" };
  } else {
    throw new functions.https.HttpsError(
      "aborted",
      "withdrawal rejected",
      "User is not current owner of NFT"
    );
  }
});

// export default removeNftFromJackpot;
module.exports = removeNftFromJackpot;
