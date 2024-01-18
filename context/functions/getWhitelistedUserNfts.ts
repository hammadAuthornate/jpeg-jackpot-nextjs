import { fetchPrices } from "./fetchPrices";
import { getCollectionData } from "./getCollectionData";
import { getTokenAddressString } from "./getTokenAddressString";
import { getWhitelist } from "./getWhitelist";

//take raw user wallet data and return only whitelisted nfts for frontend array
export const getWhitelistedUserNfts = async (nfts: any[]) => {
  try {
    const collectionData = await getCollectionData();
    const whitelist = await getWhitelist();
    const usdPrices = await fetchPrices();

    return nfts.filter((nft) => {
      const token_address = getTokenAddressString(nft);
      const collection = collectionData.find(
        (c) => c.contractAddress === token_address
      );
      const whitelistedItem = whitelist![token_address || ""];

      if (!whitelistedItem || !collection) return false;

      const floorPriceUsd =
        collection.floor_price *
        (collection.floor_price_symbol === "MATIC"
          ? usdPrices.matic
          : usdPrices.eth);
      const chainSymbol = nft.chain._chainlistData.nativeCurrency.symbol; //test chain symbol
      nft.floor_price_usd_fe = floorPriceUsd.toFixed(2);
      nft.floor_price = collection.floor_price;
      nft.name2 = nft?.name || nft?.metadata?.name || token_address;
      nft.image = nft.metadata?.image || "images/jpg.png";
      nft.attributes = nft.metadata?.attributes || [
        { trait_type: "collection", value: "JPEG" },
      ];

      return true;
    });
  } catch (e) {
    console.error("Error getting whitelisted user nfts:", e);
  }
};
