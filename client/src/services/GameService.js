import { queryAllPlayerTickets } from "./PlayerService";

export async function queryGameConfigs(web3, contract) {
  const weiPerTicket = await contract.weiPerTicket.call();
  const ticketPrice = web3.utils.fromWei(weiPerTicket, "ether");

  const feeRate = await contract.feeRate.call();
  const gameIsActive = await contract.gameIsActive.call();

  return { ticketPrice, feeRate, gameIsActive };
}

export async function queryTotalWinners(contract) {
  const count = await contract.lengthOfGameWinnerList.call();
  return count.toNumber();
}

export async function queryWinners(web3, contract, start = 0, limit = 10) {
  const length = await contract.lengthOfGameWinnerList.call();

  const winners = [];
  // winners.push({
  //   round: 0,
  //   winnerAddress: "0x48b2f0f0b403b29667e7a54775451873d927185a",
  //   totalPot: 1.001,
  //   potEndedTimestamp: 1538153048516
  // });
  const size = Math.min(limit, length - start);

  for (let i = 0; i < size; i++) {
    const winner = await contract.gameWinnerList(i);

    winners.push({
      round: i + 1,
      winnerAddress: winner.winnerAddress,
      totalPot: web3.utils.fromWei(winner.totalWei),
      potEndedTimestamp: winner.potEndedTimestamp.toNumber() * 1000 // seconds to millis
    });
  }
  return {
    list: winners,
    totalWinners: length.toNumber()
  };
}

export async function queryPotRecords(contract, start = 0, limit = 10) {
  const length = await contract.lengthOfpotPlayerTicketList.call();

  const list = [];
  const size = Math.min(limit, length - start);

  for (let i = start; i < size; i++) {
    // const exrecord = { playerAddress, totalTickets };
    const playerRecord = await contract.potPlayerTicketList(i);
    list.push({
      playerAddress: playerRecord.playerAddress,
      ticketStartNumber: playerRecord.ticketStartNumber.toNumber(),
      ticketEndNumber: playerRecord.ticketEndNumber.toNumber(),
      totalTickets: playerRecord.totalTickets.toNumber()
    });
  }

  // console.log(`potRecords=${JSON.stringify(list)}`);

  return list;
}

export async function queryPotRecordsPerPlayer(
  contract,
  start = 0,
  limit = 10
) {
  const length = await contract.totalPotPlayers.call();

  const list = [];
  const size = Math.min(limit, length - start);

  for (let i = start; i < size; i++) {
    const player = await contract.potPlayerList(i);
    const tickets = await queryAllPlayerTickets(
      null,
      contract,
      player.playerAddress
    );
    list.push({
      playerAddress: player.playerAddress,
      list: tickets.list,
      totalTickets: tickets.totalPlTickets
    });
  }

  // console.log(`potRecords=${JSON.stringify(list)}`);

  return list;
}

export async function queryPot(web3, contract) {
  const potOpenedTimestampBigNumber = await contract.potOpenedTimestamp.call();
  const potOpenedTimestamp = potOpenedTimestampBigNumber.toNumber() * 1000; // seconds to millis

  const potClosedTimestampBigNumber = await contract.potClosedTimestamp.call();
  const potClosedTimestamp = potClosedTimestampBigNumber.toNumber() * 1000; // seconds to millis

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
