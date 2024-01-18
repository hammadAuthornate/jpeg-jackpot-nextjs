"use client";
//DEPOSIT

import { toast } from "react-toastify";
import { playSound, soundsLibrary } from "../SoundLibrary";
import { getTokenAddressString } from "./getTokenAddressString";
import { getWhitelist } from "./getWhitelist";
import { getPolygonGasPrice } from "./getPolygonGasPrice";
import { createNewContractInstance } from "./createNewContractInstance";
// import { vaultWallet } from "../Firebase";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

//process deposit of nft to vault by player

export async function depositNft({ nft }: { nft: nftDetails }) {
  const { moralisUserNfts, setMoralisUserNfts, walletAddress, userSigner } =
    useStore(
      useShallow((store) => ({
        moralisUserNfts: store.moralisUserNfts,
        setMoralisUserNfts: store.setMoralisUserNfts,
        walletAddress: store.walletAddress,
        userSigner: store.userSigner,
      }))
    );
  const vaultWallet = process.env.NEXT_PUBLIC_VAULT_ADDRESS || "";

  playSound(soundsLibrary["on_click_deposit"]);
  const whitelist = await getWhitelist();
  const token_address = getTokenAddressString(nft);

  if (whitelist![token_address] != undefined) {
    const gasPrice = await getPolygonGasPrice("fast");
    const gasLimit = 1000000;

    //get user wallet as signer for nft contract instance. if isVaultSigner is passed as parameter, sign with vaultSigner
    const contract = await createNewContractInstance(nft, userSigner);
    const isErc721 = await contract.supportsInterface("0x80ac58cd"); // check if contract is ERC721
    const isErc1155 = await contract.supportsInterface("0xd9b67a26");
    let txnTransfer;
    if (isErc721) {
      txnTransfer = await contract["safeTransferFrom(address,address,uint256)"](
        walletAddress,
        vaultWallet,
        nft.tokenId,
        {
          gasPrice,
          gasLimit,
        }
      );
      toast.loading(
        <div className="d-flex align-items-center">
          <div className="spinner-border text-primary me-2" role="status">
            {" "}
            Processing deposit...
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
        }
      );
      const receiptTransfer = await txnTransfer.wait();
      toast.dismiss();
      toast.success("Deposit successful!");
      playSound(soundsLibrary.on_receive_deposit);
      const updatedNfts = moralisUserNfts!.filter(
        (n) => n.tokenHash !== nft.tokenHash
      );
      setMoralisUserNfts!(updatedNfts);
      console.log("Transaction receipt:", receiptTransfer);
    } else if (isErc1155) {
      toast.loading(
        <div className="d-flex align-items-center">
          <div className="spinner-border text-primary me-2" role="status">
            {" "}
            Processing deposit...
          </div>
        </div>
      );
      txnTransfer = await contract[
        "safeTransferFrom(address,address,uint256,uint256,bytes)"
      ](walletAddress, vaultWallet, nft.tokenId, nft.amount, "0x", {
        gasPrice,
        gasLimit,
      });
      const receiptTransfer = await txnTransfer.wait();
      toast.success("recieved deposit");
      playSound(soundsLibrary.on_receive_deposit);
      const updatedNfts = moralisUserNfts!.filter(
        (n) => n.tokenHash !== nft.tokenHash
      );
      setMoralisUserNfts!(updatedNfts);
      console.log("Transaction receipt:", receiptTransfer);
    } else {
      toast.dismiss();
    }
  } else {
    toast.dismiss();
    console.log("this nft is not on the whitelist");
  }
}
