const functions = require("firebase-functions");
const { db } = require("../index.js");
const ethers = require("ethers");
const getPrivateKey = require("../functions/getPrivateKey.js");
const createNewContractInstance = require("../functions/createNewContractInstance.js");
const getPolygonGasPrice = require("../functions/getPolygonGasPrice.js");

// import functions from "firebase-functions";
// import { db } from "../index.js";
// import getPrivateKey from "../functions/getPrivateKey.js";
// import createNewContractInstance from "../functions/createNewContractInstance.js";
// import getPolygonGasPrice from "../functions/getPolygonGasPrice.js";
// import { ethers } from "ethers";

//withdraws nft from user inventory (actually vault wallet addr) to user wallet addr
const withdrawNft = functions.https.onCall(async (data, context) => {
  console.log("hitting withdrawNft cloud function");

  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User is not authenticated."
    );
  }

  //get nft/user data from client
  const nft = data.nft;
  console.log(nft, "nft data from client");
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
      "permission-denied",
      "User does not own the NFT."
    );
  }

  if (
    walletAddress === nft.current_owner.toLowerCase() &&
    walletAddress === userNftDoc.data()?.current_owner.toLowerCase()
  ) {
    console.log("ownership confirmed");

    //create wallet from private key secret
    const privateKey = await getPrivateKey();
    const provider = new ethers.JsonRpcProvider(
      "https://polygon-mainnet.infura.io/v3/147e3ea71cd843bcbbb4812b4a92eba5"
    );
    const vaultWallet = new ethers.Wallet(privateKey, provider);
    const vaultAddress = vaultWallet.address;

    //Transfer NFT from vault to player wallet
    const contract = await createNewContractInstance(nft, vaultWallet);
    // const isErc721 = await contract.supportsInterface("0x80ac58cd"); // check if contract is ERC721
    // const isErc1155 = await contract.supportsInterface("0xd9b67a26");
    let txnTransfer;
    const gasPrice = await getPolygonGasPrice("fast"); //get gas price from polygon
    const gasLimit = 1000000; // set gas limit to 1,000,000

    if (nft.contractType === "ERC721") {
      const txnWithdrawTransfer = await contract[
        "safeTransferFrom(address,address,uint256)"
      ](vaultAddress, walletAddress, nft.tokenId, {
        gasPrice,
        gasLimit,
      }); //(from, to, tokenId) send from VAULT to USER with selected NFT ID, sent to nft contract
      const receiptWithdrawTransfer = await txnWithdrawTransfer.wait(); //console log of withdraw transaction confirmation
      console.log(
        "user.TransferFrom vault to user - Transaction receipt:",
        receiptWithdrawTransfer
      );

      // Remove nft from user inventory
      await db
        .collection("inventory")
        .doc(walletAddress)
        .collection("nfts")
        .doc(nft.token_hash)
        .delete();

      return {
        message: "withdraw successful",
      };
    } else if (nft.contractType === "ERC1155") {
      console.log("contract is erc1155");
      txnTransfer = await contract[
        "safeTransferFrom(address,address,uint256,uint256,bytes)"
      ](vaultAddress, walletAddress, nft.tokenId, 1, "0x", {
        gasPrice,
        gasLimit,
      });
      const receiptWithdrawTransfer = await txnTransfer.wait();
      console.log(
        "user.TransferFrom vault to user - Transaction receipt:",
        receiptWithdrawTransfer
      );
      await db
        .collection("inventory")
        .doc(walletAddress)
        .collection("nfts")
        .doc(nft.token_hash)
        .delete();

      return {
        message: "withdraw successful",
      };
    } else {
      console.log("ownership discrepancy, bet denied");
    }
  }
});

// export default withdrawNft;
module.exports = withdrawNft;
