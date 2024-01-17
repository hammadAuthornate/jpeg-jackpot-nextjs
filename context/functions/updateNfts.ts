//updates floor price from firebase for nfts on client side when eth price or collection floor price changes
export function updateNfts(
  nftsArray: nftDetails[],
  setNftsArray: (value: any) => void,
  newFloorPrice: number,
  ethPrice: number
) {
  const updatedNftsArray = nftsArray.map((nft) => {
    if (newFloorPrice) {
      const floorPriceUsdFe = (newFloorPrice * ethPrice!).toFixed(2);
      return { ...nft, floor_price_usd_fe: floorPriceUsdFe };
    }
    const floorPriceUsdFe = (nft.floor_price! * ethPrice!).toFixed(2);
    return { ...nft, floor_price_usd_fe: floorPriceUsdFe };
  });
  setNftsArray(updatedNftsArray);
}
