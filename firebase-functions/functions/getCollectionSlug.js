const getTokenAddressString = require("./getTokenAddressString");
// import getTokenAddressString from "./getTokenAddressString";

//returns
async function getCollectionSlug(nft) {
  //nft contract to collection-slug mapping
  const token_address = await getTokenAddressString(nft);
  console.log(token_address, "token address");
  const contractCollectionSlugMap = {
    "0xaaa2746dff31e04bc09375f3bd470746ce6bbcfb": "the-croak",
  };
  return contractCollectionSlugMap[token_address];
}

module.exports = getCollectionSlug;
