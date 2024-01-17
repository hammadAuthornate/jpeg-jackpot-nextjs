"use client";
import React from "react";
import { playSound, soundsLibrary } from "@/context/SoundLibrary";
import { handleButtonClick } from "../Utils/HandleProcessingButton";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function ActiveNftCurrentPot() {
  const {
    firebaseJackpotNfts,
    activeNft,
    walletAddress,
    moralisUserNfts,
    setMoralisUserNfts,
  } = useStore(
    useShallow((store) => ({
      firebaseJackpotNfts: store.firebaseJackpotNfts,
      activeNft: store.activeNft,
      walletAddress: store.walletAddress,
      moralisUserNfts: store.moralisUserNfts,
      setMoralisUserNfts: store.setMoralisUserNfts,
    }))
  );
  return (
    <>
      {activeNft && (
        <div className="pb-16 space-y-6">
          <div>
            <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
              <img
                src={activeNft.image?.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}
                alt=""
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-stone-400">
                  {(activeNft.name ? activeNft.name : activeNft.meta_name) +
                    " #" +
                    activeNft.tokenId}
                </h2>
                <p className="text-sm font-medium text-stone-400">
                  {activeNft.description}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-stone-400">price</h3>
            <dl className="mt-2 border-t border-stone-800 divide-y divide-grey-100">
              <div
                key={activeNft.token_uri}
                className="py-3 flex justify-between text-sm font-medium"
              >
                <dt className="text-stone-500">opensea floor price:</dt>
                <dd className="text-stone-600 text-right">
                  {activeNft.floor_price?.toFixed(2)} MATIC
                </dd>
              </div>
            </dl>

            <h3 className="mt-2 font-medium text-stone-400">
              all nfts bet by {activeNft.current_owner?.slice(0, 6) + "..."}
            </h3>
            <dl className="mt-2 border-t border-stone-800 divide-y divide-stone-900">
              {firebaseJackpotNfts
                ?.filter((nft) => nft.current_owner === activeNft.current_owner)
                .map((nft) => (
                  <div
                    key={nft.token_uri}
                    className="py-3 flex justify-between text-sm font-medium"
                  >
                    <dt className="text-stone-500">
                      {(nft.name ? nft.name : nft.meta_name) +
                        "#" +
                        nft.tokenId}
                    </dt>
                    <dd className="text-stone-600 text-right">
                      {nft.floor_price?.toFixed(2)} MATIC
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          <div className="flex">
            <button
              disabled={
                activeNft.current_owner === walletAddress ? false : false
              }
              type="button"
              value="remove"
              className="flex-1 bg-yellow-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={(event) =>
                handleButtonClick(
                  "remove",
                  activeNft,
                  moralisUserNfts,
                  setMoralisUserNfts
                )
              }
              onMouseEnter={() =>
                playSound(soundsLibrary["on_mouseover_buttons"])
              }
            >
              {activeNft.in_pot
                ? "return nft to inventory"
                : "return nft from pot"}
            </button>
            <button
              disabled={firebaseJackpotNfts?.length! > 1 ? false : true}
              value="play"
              type="button"
              className="flex-1 bg-yellow-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={(event) =>
                handleButtonClick(
                  "play",
                  activeNft,
                  moralisUserNfts,
                  setMoralisUserNfts
                )
              }
              onMouseEnter={() =>
                playSound(soundsLibrary["on_mouseover_buttons"])
              }
            >
              {firebaseJackpotNfts?.length! > 1
                ? "play"
                : "below minimum jackpot size"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
