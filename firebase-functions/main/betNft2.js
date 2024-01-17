const functions = require("firebase-functions");
const { db } = require("../index.js");
const { setJackpotSent } = require("../index.js");
const startJackpotTimer = require("../functions/startJackpotTimer.js");
const createTickerEntry = require("../functions/createTickerEntry.js");

// import functions from "firebase-functions";
// import { db, setJackpotSent } from "../index.js";
// import startJackpotTimer from "../functions/startJackpotTimer.js";
// import createTickerEntry from "../functions/createTickerEntry.js";

//transfers nft from user inventory to jackpot inventory (puts it in 'play')
const betNft2 = functions.https.onCall(async (data, context) => {
  const {
    owner_of,
    current_owner,
    token_address,
    token_hash,
    in_pot,
    tokenId,
    token_uri,
    contractType,
    floor_price_usd_fe,
    floor_price_usd,
    floor_price,
    from,
    image,
    transactionHash,
    updatedAt,
    name,
    meta_name,
    floor_price_symbol,
  } = data.nft;
  const nft = {
    floor_price,
    owner_of,
    current_owner,
    token_address,
    token_hash,
    in_pot,
    tokenId,
    token_uri,
    contractType,
    from,
    image,
    transactionHash,
    updatedAt,
    name,
    meta_name,
    floor_price_symbol,
    floor_price_usd_fe,
    floor_price_usd,
  };

  console.log(nft, "nft data from client");

  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User is not authenticated."
    );
  }
  const userId = context.auth.uid;
  console.log(userId, "userId");
  const userRef = db.collection("userUID").doc(userId);
  const userDoc = await userRef.get();
  const walletAddress = userDoc.data()?.walletAddress.toLowerCase();
  console.log("wallet: " + walletAddress + " mapped from userId: " + userId);
  console.log("nft.current_owner from client: " + nft.current_owner);

  // Check if user owns the NFT
  const userNftRef = db
    .collection("inventory")
    .doc(walletAddress)
    .collection("nfts")
    .doc(nft.token_hash);
  const userNftDoc = await userNftRef.get();
  console.log(
    "nft.current_owner from db check: " +
      userNftDoc.data()?.current_owner.toLowerCase()
  );

  if (!userNftDoc.exists) {
    throw new functions.https.HttpsError(
      "aborted",
      "permission-deniedd",
      "User does not own the NFT."
    );
  }

  if (
    walletAddress === nft.current_owner.toLowerCase() &&
    walletAddress === userNftDoc.data()?.current_owner.toLowerCase()
  ) {
    console.log("ownership confirmed and nft on whitelist");

    // Set nft to jackpot inventory
    await db
      .collection("inventory")
      .doc("jackpot")
      .collection("nfts")
      .doc(nft.token_hash)
      .set(nft);

    // Update nft in jackpot inventory
    await db.doc(`inventory/jackpot/nfts/${nft.token_hash}`).update({
      in_pot: true,
    });

    // Remove nft from user inventory
    await db
      .collection("inventory")
      .doc(walletAddress)
      .collection("nfts")
      .doc(nft.token_hash)
      .delete();

    //update current_pot_value
    const jackpotDoc = await db.collection("inventory").doc("jackpot").get();
    const pot_value = jackpotDoc.data()?.pot_value;
    const new_pot_value = parseFloat(pot_value) + parseFloat(nft.floor_price);
    const formatted_pot_value = new_pot_value;
    await db
      .collection("inventory")
      .doc("jackpot")
      .update({ pot_value: formatted_pot_value });

    // update jackpot_timer
    const firebaseJackpotCollection = db
      .collection("inventory")
      .doc("jackpot")
      .collection("nfts");
    const querySnapshot = await firebaseJackpotCollection.get();
    const currentPotSize = querySnapshot.size;
    if (currentPotSize >= 2) {
      const jackpotDocRef = db.collection("inventory").doc("jackpot");
      const jackpotDoc = await jackpotDocRef.get();
      const jackpotData = jackpotDoc.data();
      if (!jackpotData?.end_time) {
        // jackpotSent = false; //reset jackpotSent flag, allows jackpot function to trigger again
        setJackpotSent(false);
        const endTime = new Date(Date.now() + 61000); // Set end time to 1 minute from now
        const currentTime = new Date(); // Get current time for last_update
        await jackpotDocRef.update({
          jackpot_timer: true,
          end_time: endTime,
          last_update_time: currentTime,
        });
        console.log("calling start jackpot timerr");
        startJackpotTimer();
      }
    }
    createTickerEntry(nft);
    return true;
    // {
    //   message:
    //     "player bet successful: " +
    //     nft.name +
    //     " #" +
    //     nft.tokenId +
    //     " from " +
    //     walletAddress +
    //     "for " +
    //     nft.floor_price +
    //     " MATIC",
    // };
  } else {
    console.log("ownership discrepancy, bet denied");
  }
});

// export default betNft2;
module.exports = betNft2;
