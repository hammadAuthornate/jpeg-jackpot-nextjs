const { db } = require("../index.js");

// import { db } from "../index.js";

//approach for adding bet ticker

//for each betnft2 call, call 'create ticker entry' function (internal cloud function)
//ticker function receives bet nft as param. takes name, price, owner, and adds timestamp. store as document in 'ticker' collection
//client side function reads the collection, creates unordered list to display all docs in collection in sidebar

const clearTicker = () => {
  const batch = db.batch();
  db.collection("ticker")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
};

// export default clearTicker;
module.exports = clearTicker;
