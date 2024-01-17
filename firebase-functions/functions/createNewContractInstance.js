const { ethers } = require("ethers");
const getTokenAddressString = require("./getTokenAddressString");

// import { ethers } from "ethers";
// import getTokenAddressString from "./getTokenAddressString";
const abi_ERC721 = require("../abi_ERC721");
const abi_ERC1155 = require("../abi_ERC1155");

//creates contract with signer for executing deposit/withdrawal on chain
async function createNewContractInstance(nft, vaultWallet) {
  //get nft contract address
  const address = await getTokenAddressString(nft);
  console.log(
    "calling createNewContractInstance for: " +
      nft.name +
      " " +
      nft.tokenId +
      " at contract address " +
      address
  );

  const abi =
    nft.contractType === "ERC721"
      ? abi_ERC721
      : nft.contractType === "ERC1155"
      ? abi_ERC1155
      : undefined;
  console.log(
    nft.contractType === "ERC721"
      ? "erc721"
      : nft.contractType === "ERC1155"
      ? "erc1155"
      : "contract type not supported"
  );

  //create nft contract instance, signed by user wallet
  const newContract = new ethers.Contract(address, abi, vaultWallet); // and create contract instance with token address, basic ABI, and connected user as signer
  console.log(newContract, "new contract");
  return newContract;
}

module.exports = createNewContractInstance;
