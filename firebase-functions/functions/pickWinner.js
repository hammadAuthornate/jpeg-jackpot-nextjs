const generateTicketArray = require("./generateTicketArray");

// import generateTicketArray from "./generateTicketArray";

// Return a random element from the array using Math.random and Math.floor
function pickRandomElementFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return [randomIndex, array[randomIndex]];
}

async function pickWinner(nfts) {
  // Call generateTicketArray with nfts as parameter
  let ticketArray = await generateTicketArray(nfts);
  // Call pickRandomElementFromArray with ticketArray as parameter
  let winner = pickRandomElementFromArray(ticketArray);
  // Call winPercentageCalculator with nfts and winner as parameters
  // winPercentageCalculator(nfts, winner);
  console.log(winner, "winner from ticket array");
  return winner; // returns array with winning ticket index(#), and address of player at that index.
}

module.exports = pickWinner;
