async function getTokenAddressString(nft) {
  const address = await nft.token_address;
  console.log(address, "address");
  const addressReflect =
    typeof address === "string" ? address : Reflect.get(address, "_value");
  return addressReflect;
}
module.exports = getTokenAddressString;
