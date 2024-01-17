"use client";
import React from "react";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function CurrentPotDetails() {
  const { setActiveNft, tickerData, walletAddress } = useStore(
    useShallow((store) => ({
      setActiveNft: store.setActiveNft,
      tickerData: store.tickerData,
      walletAddress: store.walletAddress,
    }))
  );
  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium text-stone-400"></h2>
      <section aria-labelledby="timeline-title" className="mt-6 relative">
        {tickerData.length > 0 ? (
          <ul className="divide-y bg-stone-900">
            {tickerData?.map((nft, index) => (
              <li
                key={nft.timestamp}
                className={`py-4 flex ${
                  nft.current_owner === walletAddress
                    ? "bg-stone-900"
                    : "bg-stone-900"
                } rounded`}
                onClick={() => setActiveNft(nft)}
              >
                <div className={`flex-shrink-0`}>
                  <img
                    className={`h-20 w-20 rounded-md object-cover border-4 ${
                      nft.current_owner === walletAddress
                        ? "border-black-600"
                        : "border-gray-300"
                    } `}
                    src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-grow bg-stone-900">
                  <p className="text-sm font-medium text-stone-400 truncate">
                    {(nft.name ? nft.name : nft.meta_name) + "#" + nft.tokenId}
                  </p>
                  <p className="text-sm text-stone-600">
                    {new Date(nft.timestamp).toLocaleString()} | Current owner:{" "}
                    {nft.current_owner === walletAddress
                      ? "you"
                      : nft.current_owner.slice(0, 6) + "..."}
                  </p>
                  <p
                    className={`text-lg font-bold text-right  ${
                      nft.current_owner === walletAddress
                        ? "text-amber-600"
                        : "text-amber-600"
                    }`}
                  >
                    {nft.floor_price.toFixed(2) + " MATIC"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg font-bold text-stone-400">
            waiting for 1st bet...
          </p>
        )}
      </section>
    </div>
  );
}
