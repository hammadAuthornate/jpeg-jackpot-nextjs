"use client";
import React from "react";
import { playSound, soundsLibrary } from "@/context/SoundLibrary";
import { handleButtonClick } from "../Utils/HandleProcessingButton";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function ActiveNftFirebaseWallet() {
  const { firebaseUserNfts, activeNft, moralisUserNfts, setMoralisUserNfts } =
    useStore(
      useShallow((store) => ({
        firebaseUserNfts: store.firebaseUserNfts,
        activeNft: store.activeNft,
        moralisUserNfts: store.moralisUserNfts,
        setMoralisUserNfts: store.setMoralisUserNfts,
      }))
    );
  return (
    <>
      {activeNft && firebaseUserNfts?.length! > 0 && (
        <div className="pb-16 space-y-6">
          <div>
            <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
              {/* <img
                src={activeNft?.image?.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}
                alt=""
                className="object-cover"
              /> */}
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-stone-400">
                  {(activeNft?.name ? activeNft?.name : activeNft?.meta_name) +
                    " #" +
                    activeNft?.tokenId}
                </h2>

                <p className="text-sm font-medium text-stone-400">
                  {activeNft?.description}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-stone-400">price</h3>
            <dl className="mt-2 border-t border-stone-500 divide-y divide-grey-100">
              <div
                key={activeNft?.tokenUri}
                className="py-3 flex justify-between text-sm font-medium"
              >
                <dt className="text-stone-500">opensea floor price</dt>
                <dd className="text-stone-600 text-right">
                  {activeNft?.floor_price?.toFixed(2)} MATIC
                </dd>
              </div>
            </dl>

            <h3 className="mt-2 font-medium text-stone-400">attributes</h3>
            <dl className="mt-2 border-t border-b border-stone-500 divide-y divide-grey-100">
              {activeNft.attributes?.map((attr) => (
                <div
                  key={attr.trait_type}
                  className="py-3 flex justify-between text-sm font-medium"
                >
                  <dt className="text-stone-400">
                    {attr.trait_type?.toLowerCase()}
                  </dt>
                  <dd className="text-stone-400 text-right">
                    {attr.value?.toLowerCase()}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex">
            <button
              value="bet"
              type="button"
              className="flex-1 bg-amber-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-stone-900 hover:bg-yellow-500 hover:text-stone-900  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              onClick={() =>
                handleButtonClick(
                  "bet",
                  activeNft,
                  moralisUserNfts,
                  setMoralisUserNfts
                )
              }
              onMouseEnter={() =>
                playSound(soundsLibrary["on_mouseover_buttons"])
              }
            >
              bet nft
            </button>
            <button
              disabled={false}
              value="withdraw"
              type="button"
              className=" disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-stone-400 py-2 px-4 border border-transparent border-gray-300 rounded-md shadow-sm text-sm font-medium text-stone-900 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              onClick={() =>
                handleButtonClick(
                  "withdraw",
                  activeNft,
                  moralisUserNfts,
                  setMoralisUserNfts
                )
              }
              onMouseEnter={() =>
                playSound(soundsLibrary["on_mouseover_buttons"])
              }
            >
              withdraw to wallet
            </button>
          </div>
        </div>
      )}
    </>
  );
}
