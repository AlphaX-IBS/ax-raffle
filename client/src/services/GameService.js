export async function queryGameConfigs(web3, contract) {
  const weiPerTicket = await contract.weiPerTicket.call();
  const ticketPrice = web3.utils.fromWei(weiPerTicket, "ether");

  const feeRate = await contract.feeRate.call();
  const gameIsActive = await contract.gameIsActive.call();

  return { ticketPrice, feeRate, gameIsActive };
}

export async function queryWinners(contract) {
  const length = await contract.lengthOfGameWinnerList.call();
  
  const winners = [];
  for (let i = 0; i < length; i++) {
    const winner = await contract.gameWinnerList(i);
    winners.push(winner);
  }
  return winners;
}

export async function queryPotPlayers(contract) {
  const length = await contract.lengthOfPotPlayerList.call();
  const players = [];
  for (let i = 0; i < length; i++) {
    const player = await contract.potPlayerList(i);
    players.push(player);
  }
  return players;
}

export async function queryPot(contract) {
  const potOpenedTimestamp = await contract.potOpenedTimestamp.call();

  const potClosedTimestamp = await contract.potClosedTimestamp.call();
  console.log(`potClosedTimestamp=${potClosedTimestamp}`);

  const totalWeiPot = await contract.totalWeiPot.call();

  return { potOpenedTimestamp, potClosedTimestamp, totalWeiPot };
}
