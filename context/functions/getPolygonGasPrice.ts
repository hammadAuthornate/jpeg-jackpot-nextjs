import { ethers } from "ethers";

//gets polygon gas price from polygscan api
export async function getPolygonGasPrice(speed: string) {
  const apiKey = process.env.POLYSCAN_API;
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

      const gasPriceBigNumber = ethers.utils.parseUnits(gasPrice, "gwei");

      return gasPriceBigNumber;
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors that occur
    });
}
