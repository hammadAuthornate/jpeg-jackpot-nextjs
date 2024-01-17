export const soundsLibrary = {
  on_mouseover_item: "/sounds/on_mouseover_item.wav",
  on_mouseover_buttons: "/sounds/on_mouseover_buttons.wav",
  on_click_item: "/sounds/on_click_item.wav",
  jpegjackpot: "/sounds/jpegjackpot_sam.wav",
  on_click_deposit: "/sounds/on_click_deposit.wav",
  on_click_bet: "/sounds/on_click_bet.mp3",
  on_click_remove_item: "/sounds/on_click_remove_item.wav",
  on_receive_deposit: "/sounds/on_receive_deposit.wav",
  on_click_withdraw_item: "/sounds/on_click_withdraw_item.wav",
  on_receive_withdraw: "/sounds/on_receive_withdraw.wav",
  on_win: "/sounds/on_win.mp3",
};

//play sound files
export function playSound(au: string) {
  // console.log(au);
  let hostname;
  if (typeof window !== "undefined") {
    hostname = window.location.origin || "http://localhost:3000";
    // console.log(hostname);
  }
  if (typeof Audio !== "undefined") {
    const audio = new Audio(`${hostname}/${au}`);
    audio.volume = 0.05;
    audio.play();
  } else {
    console.error("error playing audio");
  }
}
