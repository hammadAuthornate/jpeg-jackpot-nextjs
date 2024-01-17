const { db } = require("../index.js");
const admin = require("firebase-admin");
const pickWinner = require("./pickWinner.js");

// import { db } from "../index.js";
// import admin from "firebase-admin";
// import pickWinner from "./pickWinner.js";

async function sendJackpotToWinner2() {
  try {
    console.log("in sendjackpot 2");
    const firebaseJackpotNftsRef = db
      .collection("inventory")
      .doc("jackpot")
      .collection("nfts");
    const firebaseJackpotNftsSnapshot = await firebaseJackpotNftsRef.get();
    const firebaseJackpotNfts = firebaseJackpotNftsSnapshot.docs.map((doc) =>
      doc.data()
    );

    const [winnerIndex, winnerAddress] = await pickWinner(firebaseJackpotNfts); //picks winner, returns index of winner (winning ticket #), address of winner. all nfts in current jackpot sent as parameter

    console.log(
      winnerIndex,
      "winningTicketIndex from pickWinner",
      winnerAddress,
      "winningTicketOwner from pickWinner"
    );

    const batch = db.batch();

    // Calculate the pot value
    let potValue = firebaseJackpotNfts.reduce(
      (total, nft) => total + nft.floor_price,
      0
    );

    // Calculate the minimum value for the rake
    let minRakeValue = potValue * 0.05;
    // Sort the nfts in the pot by value
    let sortedNfts = firebaseJackpotNfts.sort(
      (a, b) => a.floor_price - b.floor_price
    );
    console.log(sortedNfts, "sorted nfts from jackpot");

    // Find the number of nfts owned by the winner
    let numWinnerNfts = firebaseJackpotNfts.filter(
      (nft) => nft.current_owner === winnerAddress
    ).length;
    // Find the number of nfts not owned by the winner
    let numNonWinnerNfts = firebaseJackpotNfts.length - numWinnerNfts;
    // Find the first nft worth at least the minimum rake value that was not deposited by the winner and is not the only non-winner nft
    let rakeNft = sortedNfts.find(
      (nft) =>
        nft.floor_price >= minRakeValue &&
        nft.current_owner !== winnerAddress &&
        numNonWinnerNfts > 1
    );

    // If there is no nft worth at least the minimum rake value and not owned by the winner, take the lowest value nft that was not deposited by the winner and is not the only non-winner nft
    if (!rakeNft && numNonWinnerNfts > 1) {
      rakeNft = sortedNfts.find(
        (nft) => nft.current_owner !== winnerAddress && numNonWinnerNfts > 1
      );
    }

    console.log(rakeNft, "rake nft");

    // If there are only 2 NFTs in the pot, don't take an NFT, otherwise rake NFT now
    // if (firebaseJackpotNfts.length > 2 && rakeNft) {
    //   const rakeNftRef = db.doc(`inventory/rake/nfts/${rakeNft.token_hash}`);
    //   batch.set(rakeNftRef, rakeNft); // set rakeNft to rake inventory
    //   batch.delete(db.doc(`inventory/jackpot/nfts/${rakeNft.token_hash}`)); // remove rakeNft from jackpot inventory
    //   batch.update(rakeNftRef, {
    //     current_owner: "rake",
    //     in_pot: false,
    //   });
    // }

    for (let i = 0; i < firebaseJackpotNfts.length; i++) {
      if (firebaseJackpotNfts[i] !== rakeNft) {
        const winnerNftRef = db.doc(
          `inventory/${winnerAddress}/nfts/${firebaseJackpotNfts[i].token_hash}`
        );

        const jackpotNftRef = db.doc(
          `inventory/jackpot/nfts/${firebaseJackpotNfts[i].token_hash}`
        );

        batch.set(winnerNftRef, firebaseJackpotNfts[i]); //set current iteration of firebaseJackpotNft to winner firebase inventory

        batch.update(winnerNftRef, {
          current_owner: winnerAddress,
          in_pot: false,
        }); //adjust current_owner field in new nft entry to winner's address

        batch.delete(jackpotNftRef); //delete that nft from the jackpot inventory
      }
    }

    await batch.commit();

    //update current_pot_value and disable jackpot timer, reset end_time, update last_winner
    await db
      .collection("inventory")
      .doc("jackpot")
      .update({ pot_value: 0, jackpot_timer: false, end_time: null });

    //update last winner doc
    const FieldValue = admin.firestore.FieldValue;
    await db
      .collection("inventory")
      .doc("lastWinner")
      .update({ address: winnerAddress, pot_counter: FieldValue.increment(1) });

    console.log("Jackpot sent to winner, pot reset");
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendJackpotToWinner2;
