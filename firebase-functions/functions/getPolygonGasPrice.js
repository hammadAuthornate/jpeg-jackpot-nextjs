const { ethers } = require("ethers");

//gets polygon gas price for withdraw transaction
async function getPolygonGasPrice(speed) {
  const apiKey = "BR7N5P98E5XG1UC86V9HF8HBVJUAUUI2HJ";
  const endpoint = `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;

  return fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      const gasPrice =
        speed === "propose"
          ? data.result.ProposeGasPrice
          : speed === "fast"
          ? data.result.FastGasPrice
          : data.result.SafeGasPrice;

      console.log(speed + " gas price: " + gasPrice, "gwei");
      const gasPriceBigNumber = ethers.parseUnits(gasPrice, "gwei");

      return gasPriceBigNumber;
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors that occur
    });
}
module.exports = getPolygonGasPrice;
