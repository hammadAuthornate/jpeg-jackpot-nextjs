"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function Tabs() {
  const {
    setActiveNft,
    firebaseUserNfts,
    moralisUserNfts,
    firebaseJackpotNfts,
    tabs,
    setTabs,
  } = useStore(
    useShallow((store) => ({
      setActiveNft: store.setActiveNft,
      firebaseUserNfts: store.firebaseUserNfts,
      moralisUserNfts: store.moralisUserNfts,
      firebaseJackpotNfts: store.firebaseJackpotNfts,
      tabs: store.tabs,
      setTabs: store.setTabs,
    }))
  );
  //donut chart elements
  ChartJS.register(ArcElement, Tooltip, Legend);

  //function for nested tab render
  const handleTabClick = (index: number) => {
    if (!index) return;
    setTabs(
      tabs.map((tab, i) => ({
        ...tab,
        current: i === index - 1,
      }))
    );
    switch (index) {
      case 0:
        if (moralisUserNfts?.length > 0) setActiveNft(moralisUserNfts[0]);
        break;
      case 1:
        if (firebaseUserNfts?.length > 0) setActiveNft(firebaseUserNfts[0]);
        break;
      case 2:
        if (firebaseJackpotNfts?.length > 0)
          setActiveNft(firebaseJackpotNfts[0]);
        break;
      default:
        if (moralisUserNfts?.length > 0) setActiveNft(moralisUserNfts[0]);
        break;
    }
  };
  return (
    <>
      {tabs.map((tab, index) => (
        <a
          key={tab.name}
          href={tab.href}
          onClick={() => handleTabClick(index + 1)}
          aria-current={tab.current ? "page" : undefined}
          className={`${
            tab.current
              ? "border-yellow-500 text-amber-600"
              : "border-transparent text-yellow-800 hover:text-yellow-800 hover:border-yellow-800"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {tab.name}
        </a>
      ))}
    </>
  );
}
