import { playSound, soundsLibrary } from "@/context/SoundLibrary";
import {
  betNftHttp2,
  removeNftFromJackpotHttp,
  withdrawNftHttp,
} from "@/context/functions/cloudFunctionCalls";
import { depositNft } from "@/context/functions/depositNft";
import { toast } from "react-toastify";

export const handleButtonClick = (
  btn: string,
  activeNft: nftDetails,
  moralisUserNfts: nftDetails[],
  setMoralisUserNfts: (value: any) => void
) => {
  if (btn == "withdraw") {
    toast.loading("Processing withdrawal...");
    const nft = activeNft;
    withdrawNftHttp({ nft })
      .then((result) => {
        console.log(result, "result");
        const updatedNfts = moralisUserNfts?.concat(nft!);
        toast.dismiss();
        toast.success("Withdrawal successful!");
        playSound(soundsLibrary.on_receive_withdraw);
        setMoralisUserNfts(updatedNfts!);
      })
      .catch((error) => {
        toast.dismiss();
        console.error(error);
      });
  } else if (btn === "deposit") {
    depositNft({ nft: activeNft });
  } else if (btn === "bet") {
    const nft = activeNft;
    betNftHttp2({ nft })
      .then((result) => {
        console.log(result, "result");
        playSound(soundsLibrary.on_click_bet);
      })
      .catch((error) => {
        console.error(error);
      });
  } else if (btn === "remove") {
    const nft = activeNft;
    removeNftFromJackpotHttp({ nft }).then((result) => {
      console.log(result, "result");
      playSound(soundsLibrary.on_click_remove_item);
    });
  }
};
