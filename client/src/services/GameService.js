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

export async function queryPotRecords(contract, start = 0, limit = 10) {
  const length = await contract.lengthOfpotPlayerTicketList.call();
  console.log(`length=${length}`);
  const list = [];
  const size = Math.min(limit, length - start);
  for (let i = start; i < size; i++) {
    // const exrecord = { playerAddress, totalTickets };
    const playerRecord = await contract.potPlayerTicketList(i);
    list.push({
      ...playerRecord,
      totalTickets: playerRecord.totalTickets.toNumber()
    });
  }

  console.log(`records=${JSON.stringify(list)}`);
  return list;
}

export async function queryPot(web3, contract) {
  const potOpenedTimestampBigNumber = await contract.potOpenedTimestamp.call();
  const potOpenedTimestamp = potOpenedTimestampBigNumber.toNumber();

  const potClosedTimestampBigNumber = await contract.potClosedTimestamp.call();
  const potClosedTimestamp = potClosedTimestampBigNumber.toNumber();

  const totalWeiPot = await contract.totalWeiPot.call();
  const totalPot = web3.utils.fromWei(totalWeiPot, "ether");

  const totalTicketsBigNumber = await contract.ticketNumberCeiling.call();
  const totalTickets = totalTicketsBigNumber.toNumber();

  const totalPotPlayersBigNumber = await contract.totalPotPlayers.call();
  const totalPotPlayers = totalPotPlayersBigNumber.toNumber();

  return {
    potOpenedTimestamp,
    potClosedTimestamp,
    totalPot,
    totalTickets,
    totalPotPlayers
  };
}
