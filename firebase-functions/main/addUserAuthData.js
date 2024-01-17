const functions = require("firebase-functions");
const { db } = require("../index.js");

//creates user auth data for new user
const addUserAuthData = functions.auth.user().onCreate((user) => {
  // Create a new user with a generated UID
  var newUserRef = db.collection("userUID").doc(user.uid);
  newUserRef.set({
    walletAddress: user.displayName,
  });

  var newUserRef = db.collection("userWallet").doc(user.displayName);
  newUserRef.set({
    uid: user.uid,
  });
});

// export default addUserAuthData;
module.exports = addUserAuthData;
