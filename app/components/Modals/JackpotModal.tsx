"use client";
import React from "react";
import Modal from "./Modal";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function JackpotModal() {
  const {
    showJackpotModal,
    setShowJackpotModal,
    lastWinner,
    firebaseJackpotNftsModal,
    walletAddress,
  } = useStore(
    useShallow((store) => ({
      showJackpotModal: store.showJackpotModal,
      setShowJackpotModal: store.setShowJackpotModal,
      lastWinner: store.lastWinner,
      firebaseJackpotNftsModal: store.firebaseJackpotNftsModal,
      walletAddress: store.walletAddress,
    }))
  );
  return (
    <>
      {showJackpotModal && (
        <Modal onClose={() => setShowJackpotModal(false)}>
          <div className="flex flex-col h-full bg-white">
            <div>
              <h1 className="text-4xl font-bold text-center">
                {lastWinner != walletAddress
                  ? lastWinner?.slice(0, 6) + "..." + "WINS!"
                  : "YOU WIN!"}
              </h1>
              <h2 className="text-6xl font-bold text-center pt-6 pb-6 text-amber-600">
                {firebaseJackpotNftsModal!
                  .reduce((total, nft) => total + nft.floor_price, 0)
                  .toFixed(2)}{" "}
                MATIC
              </h2>
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-100 mb-4">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {firebaseJackpotNftsModal?.map((nft) => (
                    <li key={nft.token_hash} className="list-none">
                      <img
                        src={nft.image.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )}
                        alt={nft.name}
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="font-bold">
                        {(nft.name
                          ? nft.name.slice(0, 6)
                          : nft.meta_name.slice(0, 6)) +
                          "... #" +
                          nft.tokenId.slice(0, 6) +
                          "..."}
                      </p>
                      <p className="font-bold">
                        {nft.floor_price.toFixed(2)} MATIC
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <button
                onClick={() => setShowJackpotModal(false)}
                className="flex-1 bg-amber-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-stone-900 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
