//convert evm address to string
export function getTokenAddressString(nft: nftDetails) {
  const address = nft.tokenAddress ? nft.tokenAddress : nft.token_address;
  const addressReflect =
    //@ts-ignore
    typeof address === "string" ? address : Reflect.get(address, "_value");
  return addressReflect.toLowerCase();
}
