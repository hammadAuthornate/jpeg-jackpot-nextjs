// import { Change, FirestoreEvent } from "firebase-functions/v2/firestore";
// import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Moralis = require("moralis").default;
const { ethers, JsonRpcProvider } = require("ethers");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

let jackpotSent = false;
function setJackpotSent(value) {
  jackpotSent = value;
}
// module.exports = admin;
// module.exports = db;
// module.exports = jackpotSent;
// module.exports = setJackpotSent;

module.exports = {
  admin,
  db,
  jackpotSent,
  setJackpotSent,
};

const addUserAuthData = require("./main/addUserAuthData");
const betNft2 = require("./main/betNft2");
const depositListener = require("./main/depositListener");
const getEthPrice = require("./main/getEthPrice");
const getFloorPrice = require("./main/getFloorPrice");
const removeNftFromJackpot = require("./main/removeNftFromJackpot");
const updateFloorPrice = require("./main/updateFloorPrice");
const withdrawNft = require("./main/withdrawNft");

// export {
//   addUserAuthData,
//   betNft2,
//   depositListener,
//   getEthPrice,
//   getFloorPrice,
//   removeNftFromJackpot,
//   updateFloorPrice,
//   withdrawNft,
// };

exports.addUserAuthData = addUserAuthData;
exports.betNft2 = betNft2;
exports.depositListener = depositListener;
exports.getEthPrice = getEthPrice;
exports.getFloorPrice = getFloorPrice;
exports.removeNftFromJackpot = removeNftFromJackpot;
exports.updateFloorPrice = updateFloorPrice;
exports.withdrawNft = withdrawNft;
