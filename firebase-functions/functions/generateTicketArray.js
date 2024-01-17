//generates array of tickets, with each address appearing once for each dollar of value bet
async function generateTicketArray(nfts) {
  //takes array of nft objects as parameter
  // Create an empty array to store tickets
  console.log("number of nfts for ticket array: " + nfts.length);

  let ticketArray = []; //array to hold owner address once for each dollar of value bet by player
  // Loop through each nft and push its name (el.) to the array as many times as its price * 100
  nfts.forEach((nft) => {
    const numTickets = Math.floor(nft.floor_price * 100);
    for (let i = 0; i < numTickets; i++) {
      ticketArray.push(nft.current_owner);
    }
  });

  return ticketArray;
}

module.exports = generateTicketArray;
