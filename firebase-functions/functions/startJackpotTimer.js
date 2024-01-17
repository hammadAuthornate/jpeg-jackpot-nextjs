const { db } = require("../index.js");
const { jackpotSent } = require("../index.js");
const { setJackpotSent } = require("../index.js");
const clearTicker = require("./clearTicker.js");
const sendJackpotToWinner2 = require("./sendJackpotToWinner2.js");

// import { db, jackpotSent, setJackpotSent } from "../index.js";
// import clearTicker from "./clearTicker.js";
// import sendJackpotToWinner2 from "./sendJackpotToWinner2.js";

//listens for jackpot inventory to reach 2 nfts, then starts jackpot timer
const startJackpotTimer = () => {
  const endTimeRef = db.collection("inventory").doc("jackpot");
  let intervalId = null;
  console.log("in startjackpot timer");
  const checkEndTime = async () => {
    console.log("checking end time");
    const doc = await endTimeRef.get();
    const data = doc.data();
    const endTime = data ? data.end_time.toDate() : null;
    const now = new Date();
    const jackpot_timer = doc.data() ? doc.data()?.jackpot_timer : null;
    if (jackpot_timer && endTime && now >= endTime && !jackpotSent) {
      console.log("Calling sendJackpotToWinner2");
      await sendJackpotToWinner2();
      //   jackpotSent = true;
      setJackpotSent(true);
      clearInterval(intervalId);
      clearTicker();
    }
  };

  intervalId = setInterval(checkEndTime, 5000);

  return () => {
    clearInterval(intervalId);
  };
};

module.exports = startJackpotTimer;
