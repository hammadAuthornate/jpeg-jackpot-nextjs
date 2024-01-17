import { httpsCallable } from "firebase/functions";

//CLOUD FUNCTION HTTP CALLS ⛈️⛈️⛈️⛈️⛈️⛈️⛈️⛈️

import { functions } from "../Firebase";

//cloud function to calculate winning ticket for jackpot from firebase
export const sendJackpotToWinnerHttp = httpsCallable(
  functions,
  "sendJackpotToWinner"
);

//cloud function to bet nft on jackpot from firebase
export const betNftHttp2 = httpsCallable(functions, "betNft2");

//cloud function to withrdraw nft from inventory to wallet for user
export const withdrawNftHttp = httpsCallable(functions, "withdrawNft");

//cloud function to remove nft from jackpot, return to user inventory
export const removeNftFromJackpotHttp = httpsCallable(
  functions,
  "removeNftFromJackpot"
);
export const getEthPriceHttp = httpsCallable(functions, "getEthPrice");
