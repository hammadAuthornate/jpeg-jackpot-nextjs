"use client";
import React from "react";
import { playSound, soundsLibrary } from "@/context/SoundLibrary";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function MoralisUserWallet() {
  const { setActiveNft, activeNft, moralisUserNfts, setHoveredNft } = useStore(
    useShallow((store) => ({
      setActiveNft: store.setActiveNft,
      activeNft: store.activeNft,
      moralisUserNfts: store.moralisUserNfts,
      setHoveredNft: store.setHoveredNft,
    }))
  );
  const handleNftClick = (nft: nftDetails) => {
    setActiveNft(nft);
    playSound(soundsLibrary["on_click_item"]);
  };
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      {moralisUserNfts?.map((nft) => (
        <li
          key={nft.tokenHash}
          onClick={() => handleNftClick(nft)}
          className="relative"
          onMouseEnter={() => setHoveredNft(nft.tokenId!)}
          onMouseLeave={() => setHoveredNft(null)}
        >
          <div
            className={`
              ${
                nft.tokenId === activeNft?.tokenId
                  ? "ring-2 ring-offset-2 ring-yellow-500"
                  : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-yellow-500"
              }
                group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-stone-900 overflow-hidden relative`}
          >
            <img
              src={nft?.image?.originalUrl}
              alt=""
              className={`
                ${
                  nft.tokenId === activeNft?.tokenId
                    ? ""
                    : "group-hover:opacity-75"
                } 
                 object-cover pointer-events-none`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity">
              <div className="text-center">
                <p className="text-white text-lg">{nft?.collection?.name}</p>
                <p className="text-white text-sm">{"#" + nft.tokenId}</p>
              </div>
            </div>
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            ></button>
          </div>
          <p className="mt-2 block text-sm font-medium text-stone-400 truncate pointer-events-none">
            {nft?.contract?.openSeaMetadata?.floorPrice?.toFixed(2)} MATIC
          </p>
        </li>
      ))}
      {moralisUserNfts?.length == 0 && (
        <p className="mt-2 block text-sm font-medium text-stone-400 pointer-events-none">
          There are no NFTs in your wallet.
        </p>
      )}
    </ul>
  );
}
