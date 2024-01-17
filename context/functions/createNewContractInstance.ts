//CONTRACT INTERACTION

import { ethers } from "ethers";
import { getTokenAddressString } from "./getTokenAddressString";
import { JPEG_ABI_ERC721, ABI_ERC1155 } from "@/contract/index";
import { vaultWallet } from "../Firebase";

//creates contract with signer for executing deposit on chain
export async function createNewContractInstance(
  nft: nftDetails,
  userSigner: string,
  isVaultSigner: boolean = false // default value set here
) {
  //get nft contract address
  const address = await getTokenAddressString(nft);

  //get user wallet as signer for nft contract instance. if isVaultSigner is passed as parameter, sign with vaultSigner
  let signer = "";
  isVaultSigner ? (signer = vaultWallet) : (signer = userSigner);

  //create nft contract instance, signed by user wallet
  const abi =
    nft.contractType === "ERC721"
      ? JPEG_ABI_ERC721
      : nft.contractType === "ERC1155"
      ? ABI_ERC1155
      : false;

  //@ts-ignore
  const newContract = new ethers.Contract(address, abi, signer);
  // and create contract instance with token address, basic ABI, and connected user as signer
  return newContract;
}
