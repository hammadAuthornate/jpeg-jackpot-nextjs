const { db } = require("../index.js");

// import { db } from "../index.js";

//approach for adding bet ticker

//for each betnft2 call, call 'create ticker entry' function (internal cloud function)
//ticker function receives bet nft as param. takes name, price, owner, and adds timestamp. store as document in 'ticker' collection
//client side function reads the collection, creates unordered list to display all docs in collection in sidebar

const createTickerEntry = (betNft) => {
  const {
    name,
    meta_name,
    tokenId,
    floor_price,
    current_owner,
    image,
    floor_price_usd,
  } = betNft;
  const timestamp = new Date().toISOString();

  const tickerEntry = {
    name,
    meta_name,
    tokenId,
    floor_price,
    floor_price_usd,
    current_owner,
    timestamp,
    image,
  };
  db.collection("ticker").add(tickerEntry);
};

// export default createTickerEntry;
module.exports = createTickerEntry;
